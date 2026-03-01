<template>
<svg
	:aria-label="ariaLabel"
	class="dgGraph"
	role="img"
	viewBox="0 0 520 600"
	xmlns="http://www.w3.org/2000/svg"
>
	<defs>
		<marker
			:id="arrowId"
			markerHeight="8"
			markerWidth="8"
			orient="auto-start-reverse"
			refX="9"
			refY="5"
			viewBox="0 0 10 10"
		>
			<path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
		</marker>
	</defs>

	<!-- Background -->
	<rect class="bg"
		height="600"
		width="520"
		x="0"
		y="0"
	/>

	<g v-if="!model.ok" class="small">
		<text x="20" y="30">{{ model.message }}</text>
	</g>

	<g v-else-if="layout">
		<!-- Plot area frame -->
		<rect
			class="frame"
			fill="none"
			:height="layout.bottom - layout.yTop"
			:width="layout.xEnd - layout.left"
			:x="layout.left"
			:y="layout.yTop"
		/>

		<!-- Grid -->
		<g class="grid">
			<line v-for="(ln, i) in gridLines.v" :key="`gv-${i}`" v-bind="ln" />
			<line v-for="(ln, i) in gridLines.h" :key="`gh-${i}`" v-bind="ln" />
		</g>

		<!-- Axes -->
		<g class="axis">
			<line :marker-end="`url(#${arrowId})`"
				:x1="layout.left"
				:x2="layout.xEnd + 16"
				:y1="layout.bottom"
				:y2="layout.bottom"
			/>
			<line :marker-end="`url(#${arrowId})`"
				:x1="layout.left"
				:x2="layout.left"
				:y1="layout.bottom"
				:y2="layout.yTop - 16"
			/>
		</g>

		<!-- Ticks -->
		<g class="tick">
			<line
				v-for="(v, i) in ticks.x"
				:key="`xt-${i}`"
				:x1="xPix(v)"
				:x2="xPix(v)"
				:y1="layout.bottom"
				:y2="layout.bottom + 8"
			/>
			<line
				v-for="(v, i) in ticks.y"
				:key="`yt-${i}`"
				:x1="layout.left - 8"
				:x2="layout.left"
				:y1="yPix(v)"
				:y2="yPix(v)"
			/>
		</g>

		<g class="small">
			<text v-for="(v, i) in ticks.x"
				:key="`xl-${i}`"
				text-anchor="middle"
				:x="xPix(v)"
				:y="layout.bottom + 28"
			>
				{{ v }}
			</text>
			<text v-for="(v, i) in ticks.y"
				:key="`yl-${i}`"
				text-anchor="end"
				:x="layout.left - 18"
				:y="yPix(v) + 4"
			>
				{{ v }}
			</text>
		</g>

		<!-- Axis labels -->
		<text class="label" :x="layout.xEnd + 22" :y="layout.bottom - 15">{{ xLabel }}</text>
		<text v-if="yLabel.length<2"
			class="label"
			:x="layout.left - 55"
			:y="layout.yTop + 8"
		>
			{{ yLabel }}
		</text>
		<text v-else
			class="label"
			:transform="`rotate(-90 ${layout.left - 52} ${layout.yTop + 8})`"
			:x="layout.left - 152"
			:y="layout.yTop + 8"
		>
			{{ yLabel }}
		</text>

		<!-- Equation label -->
		<text class="equation" :x="layout.left + 30" y="20">{{ equationText }}</text>

		<!-- Constraints (x>=minX, y>=minY) -->
		<g v-if="constraintLines">
			<line v-if="constraintLines.x" class="dash" v-bind="constraintLines.x.line" />
			<line v-if="constraintLines.y" class="dash" v-bind="constraintLines.y.line" />
			<text v-if="constraintLines.x"
				class="small"
				:x="constraintLines.x.line.x1 + 4"
				:y="layout.yTop + 16"
			>
				{{ constraintLines.x.label }}
			</text>
			<text v-if="constraintLines.y"
				class="small"
				:x="layout.left + 6"
				:y="constraintLines.y.line.y1 - 6"
			>
				{{ constraintLines.y.label }}
			</text>
		</g>

		<!-- Line segment within plotting window -->
		<path v-if="lineSegment" class="line" :d="lineSegment.d" />

		<!-- Integer solution points -->
		<g v-for="(p, i) in drawPoints" :key="`pc-${i}`">
			<circle class="point"
				:cx="xPix(p.x)"
				:cy="yPix(p.y)"
				r="7"
			/>
			<circle class="pointFill"
				:cx="xPix(p.x)"
				:cy="yPix(p.y)"
				r="2.5"
			/>
		</g>

		<g v-for="(p, i) in labelPoints" :key="`pl-${i}`">
			<text class="small" :x="xPix(p.x) + 8" :y="yPix(p.y) - 6">({{ p.x }}, {{ p.y }})</text>
		</g>

		<!-- Step vector between first two shown solutions -->
		<g v-if="vector">
			<path class="vector" :d="vector.d" :marker-end="`url(#${arrowId})`" />
			<text class="small"
				:transform="`rotate(${vector.ang} ${vector.mx} ${vector.my})`"
				:x="vector.mx"
				:y="vector.my"
			>
				{{ vector.label }}
			</text>
		</g>

		<!-- Legend / hint -->
		<g v-if="showLegend && legend" class="small">
			<text v-for="(ln, i) in legend.lines"
				:key="`l-${i}`"
				:x="legend.x"
				:y="legend.y0 + i * 20"
			>
				{{ ln }}
			</text>
			<text
				v-for="(ln, i) in legend.extra"
				:key="`e-${i}`"
				:x="legend.x"
				:y="legend.y0 + (legend.lines.length + i + 1) * 20"
			>
				{{ ln }}
			</text>
		</g>
	</g>
</svg>
</template>

<script setup>
import { computed } from "vue";

import { gcd, parseIntStrict } from "@/utils/diophantine";

const props = defineProps( {
	a: { type: [ Number, String ], required: true },
	b: { type: [ Number, String ], required: true },
	c: { type: [ Number, String ], required: true },

	// Solutions are shown for x>=minX, y>=minY (defaults to "positive")
	minX: { type: Number, default: 1 },
	minY: { type: Number, default: 1 },

	xLabel: { type: String, default: "x" },
	yLabel: { type: String, default: "y" },
	xVar:   { type: String, default: "x" },
	yVar:   { type: String, default: "y" },

	showLegend: { type: Boolean, default: true }
} );

function parseMaybeInt( v ) {
	if ( typeof v === "number" ) {
		return Number.isFinite( v ) ? Math.trunc( v ) : null;
	}

	return parseIntStrict( v );
}

function extentWithMargin( n, minExtent = 5 ) {
	const base = Math.max( minExtent, n );
	const margin = Math.max( 2, Math.floor( base * 0.1 ) );
	return base + margin;
}

function gridStepFor( maxUnits ) {
	if ( maxUnits <= 30 ) {
		return 1;
	}

	if ( maxUnits <= 60 ) {
		return 2;
	}

	if ( maxUnits <= 120 ) {
		return 5;
	}

	if ( maxUnits <= 240 ) {
		return 10;
	}

	return 20;
}

function majorStepFor( maxUnits ) {
	if ( maxUnits <= 12 ) {
		return 2;
	}

	if ( maxUnits <= 25 ) {
		return 5;
	}

	if ( maxUnits <= 50 ) {
		return 10;
	}

	if ( maxUnits <= 100 ) {
		return 20;
	}

	return 50;
}

const arrowId = `dg-arrow-${
	globalThis.crypto?.randomUUID?.() ?? Math.random().toString( 16 )
		.slice( 2 )
}`;

const model = computed( () => {
	const aRaw = parseMaybeInt( props.a );
	const bRaw = parseMaybeInt( props.b );
	const cRaw = parseMaybeInt( props.c );

	if ( aRaw === null || bRaw === null || cRaw === null ) {
		return { ok: false, message: "Bitte ganze Zahlen für a,b,c eingeben." };
	}

	if ( aRaw === 0 || bRaw === 0 ) {
		return { ok: false, message: "Grafik nur für a≠0 und b≠0." };
	}

	// If a and b have different signs, there can be infinitely many solutions in the first quadrant.
	if ( aRaw * bRaw < 0 ) {
		return { ok: false, message: "Grafik nur für a und b mit gleichem Vorzeichen." };
	}

	// Normalize global sign so we can work with a>0,b>0.
	const s = aRaw > 0 ? 1 : -1;
	const a = aRaw * s;
	const b = bRaw * s;
	const c = cRaw * s;

	if ( c <= 0 ) {
		return {
			ok:      true,
			a,
			b,
			c,
			points:  [],
			g:       gcd( a, b ),
			dx:      0,
			dy:      0,
			message: "Keine positiven Lösungen (c muss > 0 sein)."
		};
	}

	const g = gcd( a, b );

	if ( c % g !== 0 ) {
		return {
			ok: true, a, b, c, points: [], g, dx: b / g, dy: a / g, message: "Keine ganzzahligen Lösungen."
		};
	}

	const minX = Math.max( 0, Math.trunc( props.minX ) );
	const minY = Math.max( 0, Math.trunc( props.minY ) );

	const points = [];
	const xMaxScan = Math.floor( c / a );

	for ( let x = minX; x <= xMaxScan; x++ ) {
		const rem = c - a * x;

		if ( rem % b !== 0 ) {
			continue;
		}

		const y = rem / b;

		if ( y < minY ) {
			continue;
		}

		points.push( { x, y } );
	}

	// Sort for stable labeling + vector selection.
	points.sort( ( p1, p2 ) => p1.x - p2.x || p1.y - p2.y );

	return {
		ok:      true,
		a,
		b,
		c,
		points,
		g,
		dx:      b / g,
		dy:      a / g,
		message: points.length ? "" : "Keine positiven ganzzahligen Lösungen im 1. Quadranten."
	};
} );

const layout = computed( () => {
	if ( !model.value.ok ) {
		return null;
	}

	// SVG coordinate system (match DG.svg proportions)
	const width = 520;
	const height = 600;
	const left = 80;
	const top = 32;
	const bottom = 560;
	const plotW = 264;
	const plotH = bottom - top;

	const pts = model.value.points;
	const maxXPoint = pts.reduce( ( m, p ) => Math.max( m, p.x ), 0 );
	const maxYPoint = pts.reduce( ( m, p ) => Math.max( m, p.y ), 0 );

	// Focus the viewport on the integer solution set (like the baked-in SVG),
	// and add some headroom so points + labels breathe.
	let xMaxUnits = extentWithMargin( maxXPoint, 5 );
	let yMaxUnits = extentWithMargin( maxYPoint, 5 );

	// Keep the same "portrait" feeling as DG.svg (plot is twice as tall as wide).
	yMaxUnits = Math.max( yMaxUnits, 2 * xMaxUnits );

	const scale = Math.min( plotW / xMaxUnits, plotH / yMaxUnits );
	const xEnd = left + xMaxUnits * scale;
	const yTop = bottom - yMaxUnits * scale;

	const gridStepX = gridStepFor( xMaxUnits );
	const gridStepY = gridStepFor( yMaxUnits );
	const majorX = Math.max( gridStepX, majorStepFor( xMaxUnits ) );
	const majorY = Math.max( gridStepY, majorStepFor( yMaxUnits ) );

	return {
		width,
		height,
		left,
		top,
		bottom,
		plotW,
		plotH,
		scale,
		xEnd,
		yTop,
		xMaxUnits,
		yMaxUnits,
		gridStepX,
		gridStepY,
		majorX,
		majorY
	};
} );

function xPix( x ) {
	const l = layout.value;
	return l.left + x * l.scale;
}

function yPix( y ) {
	const l = layout.value;
	return l.bottom - y * l.scale;
}

const gridLines = computed( () => {
	if ( !layout.value || !model.value.ok ) {
		return { v: [], h: [] };
	}

	const l = layout.value;
	const v = [];

	for ( let x = 0; x <= l.xMaxUnits + 1e-9; x += l.gridStepX ) {
		const xp = l.left + x * l.scale;
		v.push( {
			x1: xp, y1: l.yTop, x2: xp, y2: l.bottom
		} );
	}

	if ( v.length && Math.abs( v.at( -1 ).x1 - l.xEnd ) > 1e-6 ) {
		v.push( {
			x1: l.xEnd, y1: l.yTop, x2: l.xEnd, y2: l.bottom
		} );
	}

	const h = [];

	for ( let y = 0; y <= l.yMaxUnits + 1e-9; y += l.gridStepY ) {
		const yp = l.bottom - y * l.scale;
		h.push( {
			x1: l.left, y1: yp, x2: l.xEnd, y2: yp
		} );
	}

	if ( h.length && Math.abs( h.at( -1 ).y1 - l.yTop ) > 1e-6 ) {
		h.push( {
			x1: l.left, y1: l.yTop, x2: l.xEnd, y2: l.yTop
		} );
	}

	return { v, h };
} );

const ticks = computed( () => {
	if ( !layout.value || !model.value.ok ) {
		return { x: [], y: [] };
	}

	const l = layout.value;

	const x = [];

	for ( let v = 0; v <= l.xMaxUnits + 1e-9; v += l.majorX ) {
		x.push( v );
	}

	if ( x.at( -1 ) !== l.xMaxUnits ) {
		x.push( l.xMaxUnits );
	}

	const y = [];

	for ( let v = 0; v <= l.yMaxUnits + 1e-9; v += l.majorY ) {
		y.push( v );
	}

	if ( y.at( -1 ) !== l.yMaxUnits ) {
		y.push( l.yMaxUnits );
	}

	return { x, y };
} );

const lineSegment = computed( () => {
	if ( !layout.value || !model.value.ok ) {
		return null;
	}

	const l = layout.value;
	const {
		a, b, c
	} = model.value;

	const candidates = [];

	// x=0
	candidates.push( { x: 0, y: c / b } );
	// y=0
	candidates.push( { x: c / a, y: 0 } );
	// x=xMax
	candidates.push( { x: l.xMaxUnits, y: ( c - a * l.xMaxUnits ) / b } );
	// y=yMax
	candidates.push( { x: ( c - b * l.yMaxUnits ) / a, y: l.yMaxUnits } );

	const inside = ( p ) =>
		Number.isFinite( p.x ) &&
    Number.isFinite( p.y ) &&
    p.x >= -1e-9 &&
    p.x <= l.xMaxUnits + 1e-9 &&
    p.y >= -1e-9 &&
    p.y <= l.yMaxUnits + 1e-9;

	const pts = candidates.filter( inside );

	// Dedup (corner hits)
	const uniq = [];

	for ( const p of pts ) {
		if ( uniq.some( ( q ) => Math.abs( q.x - p.x ) < 1e-6 && Math.abs( q.y - p.y ) < 1e-6 ) ) {
			continue;
		}

		uniq.push( p );
	}

	if ( uniq.length < 2 ) {
		return null;
	}

	uniq.sort( ( p1, p2 ) => p1.x - p2.x );

	const p0 = uniq[ 0 ];
	const p1 = uniq[ uniq.length - 1 ];
	return { d: `M ${xPix( p0.x )} ${yPix( p0.y )} L ${xPix( p1.x )} ${yPix( p1.y )}` };
} );

const vector = computed( () => {
	if ( !layout.value || !model.value.ok ) {
		return null;
	}

	const pts = model.value.points;

	if ( pts.length < 2 ) {
		return null;
	}

	const p0 = pts[ 0 ];
	const p1 = pts[ 1 ];

	const x0 = xPix( p0.x );
	const y0 = yPix( p0.y );
	const x1 = xPix( p1.x );
	const y1 = yPix( p1.y );

	const mx = ( x0 + x1 ) / 2;
	const my = ( y0 + y1 ) / 2;
	const ang = Math.atan2( y1 - y0, x1 - x0 ) * 180 / Math.PI;

	const dx = model.value.dx;
	const dy = model.value.dy;

	return {
		d:     `M ${x0} ${y0} L ${x1} ${y1}`,
		label: `(+${dx}, -${dy})`,
		mx,
		my,
		ang
	};
} );

const ariaLabel = computed( () => {
	if ( !model.value.ok ) {
		return "Diophantische Gleichung";
	}

	const {
		a, b, c
	} = model.value;
	return `Diophantische Gleichung als Gerade mit Gitterpunkten: ${a}${props.xVar} + ${b}${props.yVar} = ${c}`;
} );

const equationText = computed( () => {
	if ( !model.value.ok ) {
		return "";
	}

	const {
		a, b, c
	} = model.value;
	return `${a}${props.xVar} + ${b}${props.yVar} = ${c}`;
} );

const drawPoints = computed( () => model.value.ok ? model.value.points : [] );

const labelPoints = computed( () => {
	const pts = drawPoints.value;
	const maxLabels = 12;
	return pts.length <= maxLabels ? pts : pts.slice( 0, maxLabels );
} );

const hasHiddenLabels = computed( () => drawPoints.value.length > labelPoints.value.length );

const constraintLines = computed( () => {
	if ( !layout.value || !model.value.ok ) {
		return null;
	}

	const l = layout.value;

	const x = Math.trunc( props.minX );
	const y = Math.trunc( props.minY );
	const out = { x: null, y: null };

	if ( x > 0 && x <= l.xMaxUnits ) {
		out.x = {
			line: {
				x1: xPix( x ), y1: l.yTop, x2: xPix( x ), y2: l.bottom
			},
			label: `${props.xVar} ≥ ${x}`
		};
	}

	if ( y > 0 && y <= l.yMaxUnits ) {
		out.y = {
			line: {
				x1: l.left, y1: yPix( y ), x2: l.xEnd, y2: yPix( y )
			},
			label: `${props.yVar} ≥ ${y}`
		};
	}

	return out;
} );

const legend = computed( () => {
	if ( !layout.value || !model.value.ok ) {
		return null;
	}

	const l = layout.value;
	const x = 370;
	const y0 = 110;

	const lines = [
		"• Gerade: reelle Lösungen",
		"• Markierte Gitterpunkte:",
		"  ganzzahlige Lösungen"
	];

	const extra = [];

	if ( model.value.message ) {
		extra.push( model.value.message );
	}

	if ( hasHiddenLabels.value ) {
		extra.push( `(… und ${drawPoints.value.length - labelPoints.value.length} weitere)` );
	}

	return {
		x,
		y0,
		lines,
		extra
	};
} );
</script>

<style scoped>
.dgGraph {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 12px;
  overflow: hidden;

  /* Theme-aware colors (Vuetify exposes RGB tuples in CSS variables). */
  --graph-bg: rgb(var(--v-theme-surface, 255, 255, 255));
  --graph-text: rgb(var(--v-theme-on-surface, 17, 17, 17));
  --graph-axis: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.86);
  --graph-ink: rgb(var(--v-theme-on-surface, 11, 11, 11));
  --graph-grid: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.12);
  --graph-muted: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.55);
  --graph-frame: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.16);
  --graph-point-fill: var(--graph-bg);
}

.bg { fill: var(--graph-bg, #ffffff); }
.frame { stroke: var(--graph-frame, #ddd); }
.grid { stroke: var(--graph-grid, #e6e6e6); stroke-width: 1; }
.axis { stroke: var(--graph-axis, #222); stroke-width: 2; color: var(--graph-axis, #222); }
.tick { stroke: var(--graph-axis, #222); stroke-width: 1.5; }
.label { fill: var(--graph-text, #111); font: 14px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
.small { fill: var(--graph-text, #111); font: 12px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
.equation { fill: var(--graph-text, #111); font: 16px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-weight: 600; }
.line { stroke: var(--graph-ink, #0b0b0b); stroke-width: 3; fill: none; }
.dash { stroke: var(--graph-muted, #777); stroke-width: 1.5; stroke-dasharray: 5 5; }
.point { stroke: var(--graph-ink, #0b0b0b); stroke-width: 2; fill: var(--graph-point-fill, #fff); }
.pointFill { fill: var(--graph-ink, #0b0b0b); }
.vector { stroke: var(--graph-ink, #0b0b0b); stroke-width: 2.5; fill: none; }
</style>
