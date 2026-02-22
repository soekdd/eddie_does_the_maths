<template>
<div ref="canvasRef" class="canvas">
	<svg
		ref="svgRef"
		class="scene"
		:viewBox="viewBox"
		xmlns="http://www.w3.org/2000/svg"
		@pointerleave="stopDrag"
		@pointermove="onPointerMove"
		@pointerup="stopDrag"
	>
		<defs>
			<linearGradient
				:id="gid('g1')"
				gradientUnits="userSpaceOnUse"
				:x1="warpedGradients.g1.x1"
				:x2="warpedGradients.g1.x2"
				:y1="warpedGradients.g1.y1"
				:y2="warpedGradients.g1.y2"
			>
				<stop offset="0" stop-color="rgb(145,145,145)" />
				<stop offset="0.31" stop-color="rgb(145,145,145)" />
				<stop offset="0.51" stop-color="rgb(92,92,92)" />
				<stop offset="0.7" stop-color="rgb(145,145,145)" />
				<stop offset="1" stop-color="rgb(145,145,145)" />
			</linearGradient>

			<linearGradient
				:id="gid('g2')"
				gradientUnits="userSpaceOnUse"
				:x1="warpedGradients.g2.x1"
				:x2="warpedGradients.g2.x2"
				:y1="warpedGradients.g2.y1"
				:y2="warpedGradients.g2.y2"
			>
				<stop offset="0" stop-color="rgb(146,146,149)" />
				<stop offset="1" stop-color="rgb(185,185,185)" />
			</linearGradient>

			<linearGradient
				:id="gid('g3')"
				gradientUnits="userSpaceOnUse"
				:x1="warpedGradients.g3.x1"
				:x2="warpedGradients.g3.x2"
				:y1="warpedGradients.g3.y1"
				:y2="warpedGradients.g3.y2"
			>
				<stop offset="0" stop-color="rgb(220,220,220)" />
				<stop offset="0.07" stop-color="rgb(232,232,232)" />
				<stop offset="0.39" stop-color="rgb(226,226,226)" />
				<stop offset="0.5" stop-color="rgb(188,188,188)" />
				<stop offset="0.64" stop-color="rgb(222,222,222)" />
				<stop offset="0.95" stop-color="rgb(221,221,221)" />
				<stop offset="1" stop-color="rgb(220,220,220)" />
			</linearGradient>
		</defs>
		<!-- Geometrie (transform-frei) -->
		<path :d="warpedPathD[0]" :fill="`url(#${gid('g1')})`" />
		<path :d="warpedPathD[1]" :fill="`url(#${gid('g2')})`" />
		<path :d="warpedPathD[2]" :fill="`url(#${gid('g3')})`" />
		<path
			:d="warpedPathD[3]"
			fill="rgb(146,146,146)"
			stroke="rgb(184,183,184)"
			stroke-width="1"
		/>

		<!-- HTML-Slot innerhalb der SVG -->
		<foreignObject
			:height="Math.max(1, contentBox.height)"
			style="padding: 0 2em;"
			:width="contentBox.width"
			:x="contentBox.x"
			:y="contentBox.y"
		>
			<div
				ref="slotContentRef"
				class="svg-html-slot"
				:style="slotContentStyle"
				xmlns="http://www.w3.org/1999/xhtml"
			>
				<slot name="inner">
					<slot />
				</slot>
			</div>
		</foreignObject>
	</svg>
</div>
</template>

<script setup lang="ts">
/*eslint-disable vue/max-len*/
import {
	computed,
	getCurrentInstance,
	reactive,
	ref,
	onMounted,
	onBeforeUnmount,
	nextTick
} from "vue";

type CornerKey = "lt" | "rt" | "lb" | "rb"
type Pt = { x: number; y: number }
type Seg = { cmd: "M" | "L" | "C" | "Z"; values: number[] }

const uid = `metal-warp-${getCurrentInstance()?.uid ?? "0"}`;
const gid = ( name: string ) => `${uid}-${name}`;

/**
 * Bereits transform-frei aufgelöste Pfade (aus deiner SVG abgeflacht).
 * Alle group-transform und gradientTransform-Matrizen wurden vorgerechnet.
 */
const BASE_PATHS = [
	// 1
	"M17.8,545.117L17.8,520.378L463.613,513.21L516.673,529.591C516.223,530.944 497.094,534.374 452.49,531.57C369.834,526.373 62.99,545.117 62.99,545.117C32.751,543.121 17.8,545.117 17.8,545.117Z",
	// 2
	"M465.886,46.475L484.827,29.206L513.495,49.216L516.673,529.591L487.171,521.564L474.445,505.643L465.886,46.475Z",
	// 3
	"M17.8,32.245L17.8,525.813C17.8,525.813 16.684,527.483 24.507,529.164C32.731,530.931 42.797,536.042 42.797,536.042C42.797,536.042 341.305,519.639 437.052,520.363C482.997,520.711 487.172,521.564 487.172,521.564L485.463,24.011C461.991,34.084 409.028,27.24 367.529,25.059C278.556,20.381 55.656,28.558 37.453,43.53C34.751,29.395 17.8,32.245 17.8,32.245Z",
	// 4
	"M39.787,42.48L37.507,42.568L41.165,538.758L43.451,538.64L39.787,42.48Z"
] as const;

/**
 * Bereits transform-frei aufgelöste Gradienten-Endpunkte.
 */
const BASE_GRADIENTS = {
	g1: {
		x1: -221.372, y1: 481.603, x2: 493.358, y2: 470.621
	},
	g2: {
		x1: 463.788, y1: 280.314, x2: 385.331, y2: 290.162
	},
	g3: {
		x1: -146.552, y1: 286.516, x2: 415.749, y2: 264.47
	}
};

const BASE = {
	minX:   16.684,
	minY:   20.381,
	maxX:   516.673,
	maxY:   545.117,
	splitX: ( 16.684 + 516.673 ) / 2,
	splitY: ( 20.381 + 545.117 ) / 2
} as const;

const baseCorners = {
	lt: { x: BASE.minX, y: BASE.minY },
	rt: { x: BASE.maxX, y: BASE.minY },
	lb: { x: BASE.minX, y: BASE.maxY },
	rb: { x: BASE.maxX, y: BASE.maxY }
} satisfies Record<CornerKey, Pt>;

// 4 variable Stützpunkte (Quadranten-Anker)
const corners = reactive<Record<CornerKey, Pt>>( {
	lt: { ...baseCorners.lt },
	rt: { ...baseCorners.rt },
	lb: { ...baseCorners.lb },
	rb: { ...baseCorners.rb }
} );

const rectMode = ref( true );

const INNER = {
	padX: 18,
	padY: 14
};

// Refs / ResizeObserver für responsive Breite + dynamische Slot-Höhe
const svgRef = ref<SVGSVGElement | null>( null );
const canvasRef = ref<HTMLElement | null>( null );
const slotContentRef = ref<HTMLElement | null>( null );

const canvasWidthPx = ref( 1 );
const slotHeightPx = ref( 40 );

const SIZE_EPSILON_PX = 0.5;
let canvasRO: ResizeObserver | null = null;
let slotRO: ResizeObserver | null = null;
let slotMeasureFrameId: number | null = null;

function setSlotHeight( nextHeightPx: number ) {
	const next = Math.max( 1, nextHeightPx );

	if ( Math.abs( slotHeightPx.value - next ) <= SIZE_EPSILON_PX ) {
		return;
	}

	slotHeightPx.value = next;
}

function measureSlotHeightPx() {
	const el = slotContentRef.value;

	if ( !el ) {
		return;
	}

	const rectHeight = el.getBoundingClientRect().height;

	if ( rectHeight > 0 ) {
		setSlotHeight( rectHeight );
		return;
	}

	setSlotHeight( Math.max( el.scrollHeight, el.offsetHeight ) );
}

function scheduleSlotMeasure() {
	if ( slotMeasureFrameId !== null ) {
		return;
	}

	slotMeasureFrameId = window.requestAnimationFrame( () => {
		slotMeasureFrameId = null;
		measureSlotHeightPx();
	} );
}

onMounted( async() => {
	await nextTick();
	measureSlotHeightPx();

	canvasRO = new ResizeObserver( ( entries ) => {
		const e = entries[ 0 ];

		if ( !e ) {
			return;
		}

		const nextWidth = Math.max( 1, e.contentRect.width );

		if ( Math.abs( canvasWidthPx.value - nextWidth ) > SIZE_EPSILON_PX ) {
			canvasWidthPx.value = nextWidth;
		}

		scheduleSlotMeasure();
	} );

	slotRO = new ResizeObserver( ( entries ) => {
		const e = entries[ 0 ];

		if ( !e ) {
			return;
		}

		scheduleSlotMeasure();
	} );

	if ( canvasRef.value ) {
		canvasRO.observe( canvasRef.value );
	}

	if ( slotContentRef.value ) {
		slotRO.observe( slotContentRef.value );
	}
} );

onBeforeUnmount( () => {
	canvasRO?.disconnect();
	slotRO?.disconnect();

	if ( slotMeasureFrameId !== null ) {
		window.cancelAnimationFrame( slotMeasureFrameId );
		slotMeasureFrameId = null;
	}
} );

function resetCorners() {
	( [ "lt", "rt", "lb", "rb" ] as CornerKey[] ).forEach( ( k ) => {
		corners[ k ].x = baseCorners[ k ].x;
		corners[ k ].y = baseCorners[ k ].y;
	} );
}

function syncRect( source: CornerKey ) {
	if ( !rectMode.value ) {
		return;
	}

	if ( source === "lt" ) {
		corners.lb.x = corners.lt.x;
		corners.rt.y = corners.lt.y;
	} else if ( source === "rt" ) {
		corners.rb.x = corners.rt.x;
		corners.lt.y = corners.rt.y;
	} else if ( source === "lb" ) {
		corners.lt.x = corners.lb.x;
		corners.rb.y = corners.lb.y;
	} else if ( source === "rb" ) {
		corners.rt.x = corners.rb.x;
		corners.lb.y = corners.rb.y;
	}
}

function quadrantOf( p: Pt ): CornerKey {
	const left = p.x <= BASE.splitX;
	const top = p.y <= BASE.splitY;

	if ( left && top ) {
		return "lt";
	}

	if ( !left && top ) {
		return "rt";
	}

	if ( left && !top ) {
		return "lb";
	}

	return "rb";
}

function warpPointWithCorners(
	x: number, y: number, activeCorners: Record<CornerKey, Pt>
): Pt {
	const key = quadrantOf( { x, y } );
	const dx = activeCorners[ key ].x - baseCorners[ key ].x;
	const dy = activeCorners[ key ].y - baseCorners[ key ].y;
	return { x: x + dx, y: y + dy };
}

// px pro SVG-Unit (nur über Breite, damit kein Kreisbezug entsteht)
const currentOuterWidthSvg = computed( () => {
	const left = Math.min( corners.lt.x, corners.lb.x );
	const right = Math.max( corners.rt.x, corners.rb.x );
	return Math.max( 1, right - left );
} );

const pxPerSvgUnit = computed( () => {
	return canvasWidthPx.value / currentOuterWidthSvg.value;
} );

const foreignObjectScale = computed( () => {
	// Nur nach unten korrigieren: übergroße Darstellung im foreignObject abfangen.
	const inv = 1 / Math.max( 0.0001, pxPerSvgUnit.value );
	return Math.min( 1, inv );
} );

const slotContentStyle = computed( () => {
	const scale = foreignObjectScale.value;
	return {
		transform:       `scale(${scale})`,
		transformOrigin: "top left",
		width:           `${100 / scale}%`
	};
} );

const slotHeightSvg = computed( () => {
	return slotHeightPx.value / Math.max( 0.0001, pxPerSvgUnit.value );
} );

// 1) Slot-Inhalt -> 2) foreignObject-Höhe
const foreignObjectHeightSvg = computed( () => {
	return Math.max( 10, slotHeightSvg.value + 26 );
} );

const contentBottomTargetSvg = computed( () => {
	const top = Math.min( corners.lt.y, corners.rt.y ) + INNER.padY;
	return top + foreignObjectHeightSvg.value + 26;
} );

// Offset kann positiv oder negativ sein: unten wird auf FO-Unterkante ausgerichtet.
const autoExtraBottom = computed( () => {
	const rawBottom = Math.max( corners.lb.y, corners.rb.y );
	return contentBottomTargetSvg.value - rawBottom;
} );

// Effektive Ecken: unten wird bei Bedarf automatisch verlängert
const effectiveCorners = computed<Record<CornerKey, Pt>>( () => ( {
	lt: { x: corners.lt.x, y: corners.lt.y },
	rt: { x: corners.rt.x, y: corners.rt.y },
	lb: { x: corners.lb.x, y: corners.lb.y + autoExtraBottom.value },
	rb: { x: corners.rb.x, y: corners.rb.y + autoExtraBottom.value }
} ) );

function warpPoint( x: number, y: number ): Pt {
	return warpPointWithCorners(
		x, y, effectiveCorners.value
	);
}

// --- SVG path parsing / serialization (absolute M/L/C/Z) ---
function parsePath( d: string ): Seg[] {
	const tokens = d.match( /[MLCZ]|-?\d+(?:\.\d+)?/g ) ?? [];
	const segs: Seg[] = [];
	let i = 0;

	while ( i < tokens.length ) {
		const t = tokens[ i++ ] as Seg["cmd"];

		if ( t === "M" || t === "L" ) {
			segs.push( { cmd: t, values: [ Number( tokens[ i++ ] ), Number( tokens[ i++ ] ) ] } );
		} else if ( t === "C" ) {
			segs.push( {
				cmd:    "C",
				values: [
					Number( tokens[ i++ ] ),
					Number( tokens[ i++ ] ),
					Number( tokens[ i++ ] ),
					Number( tokens[ i++ ] ),
					Number( tokens[ i++ ] ),
					Number( tokens[ i++ ] )
				]
			} );
		} else if ( t === "Z" ) {
			segs.push( { cmd: "Z", values: [] } );
		} else {
			throw new Error( `Unsupported path token: ${t}` );
		}
	}

	return segs;
}

function serializePath( segs: Seg[] ): string {
	return segs
		.map( ( s ) => {
			if ( s.cmd === "M" || s.cmd === "L" ) {
				return `${s.cmd}${fmt( s.values[ 0 ] )},${fmt( s.values[ 1 ] )}`;
			}

			if ( s.cmd === "C" ) {
				return `C${fmt( s.values[ 0 ] )},${fmt( s.values[ 1 ] )} ${fmt( s.values[ 2 ] )},${fmt( s.values[ 3 ] )} ${fmt( s.values[ 4 ] )},${fmt( s.values[ 5 ] )}`;
			}

			return "Z";
		} )
		.join( "" );
}

function warpSegs( segs: Seg[] ): Seg[] {
	return segs.map( ( s ) => {
		if ( s.cmd === "Z" ) {
			return s;
		}

		const out: number[] = [];

		for ( let i = 0; i < s.values.length; i += 2 ) {
			const p = warpPoint( s.values[ i ], s.values[ i + 1 ] );
			out.push( p.x, p.y );
		}

		return { cmd: s.cmd, values: out };
	} );
}

function extractPoints( segs: Seg[] ): Pt[] {
	const pts: Pt[] = [];

	for ( const s of segs ) {
		for ( let i = 0; i < s.values.length; i += 2 ) {
			pts.push( { x: s.values[ i ], y: s.values[ i + 1 ] } );
		}
	}

	return pts;
}

function fmt( n: number ) {
	return Number( n.toFixed( 3 ) ).toString();
}

const parsedBase = BASE_PATHS.map( parsePath );
const warpedSegs = computed( () => parsedBase.map( warpSegs ) );
const warpedPathD = computed( () => warpedSegs.value.map( serializePath ) );

const warpedGradients = computed( () => {
	const mapGrad = ( g: { x1: number; y1: number; x2: number; y2: number } ) => {
		const p1 = warpPoint( g.x1, g.y1 );
		const p2 = warpPoint( g.x2, g.y2 );
		return {
			x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y
		};
	};

	return {
		g1: mapGrad( BASE_GRADIENTS.g1 ),
		g2: mapGrad( BASE_GRADIENTS.g2 ),
		g3: mapGrad( BASE_GRADIENTS.g3 )
	};
} );

// Innenbox für foreignObject (Slot-Inhalt)
const contentBox = computed( () => {
	const ec = effectiveCorners.value;
	const left = Math.min( ec.lt.x, ec.lb.x ) + INNER.padX;
	const right = Math.max( ec.rt.x, ec.rb.x ) - INNER.padX;
	const top = Math.min( ec.lt.y, ec.rt.y ) + INNER.padY + 6;

	const width = Math.max( 10, right - left );
	const height = foreignObjectHeightSvg.value;

	return {
		x: left, y: top, width, height
	};
} );

const viewBoxParts = computed( () => {
	const pts = warpedSegs.value.flatMap( extractPoints );

	// Ecken / Handles berücksichtigen
	const ec = effectiveCorners.value;
	pts.push(
		ec.lt, ec.rt, ec.lb, ec.rb
	);

	// Slot-Box berücksichtigen (damit Höhe mitwächst)
	const cb = contentBox.value;
	pts.push( { x: cb.x, y: cb.y },
		{ x: cb.x + cb.width, y: cb.y + cb.height } );

	const minX = Math.min( ...pts.map( ( p ) => p.x ) );
	const minY = Math.min( ...pts.map( ( p ) => p.y ) );
	const maxX = Math.max( ...pts.map( ( p ) => p.x ) );
	const maxY = Math.max( ...pts.map( ( p ) => p.y ) );
	const pad = 24;

	return {
		minX: minX,
		minY: minY,
		maxX: maxX,
		maxY: maxY
	};
} );

const viewBox = computed( () => {
	const vb = viewBoxParts.value;
	return `${fmt( vb.minX )} ${fmt( vb.minY )} ${fmt( vb.maxX - vb.minX )} ${fmt( vb.maxY - vb.minY )}`;
} );

// --- Interaktivität: Drag-Handles ---
const dragging = ref<CornerKey | null>( null );

function startDrag( key: CornerKey, e: PointerEvent ) {
	dragging.value = key
	;( e.currentTarget as Element )?.setPointerCapture?.( e.pointerId );
}

function stopDrag() {
	dragging.value = null;
}

function toSvgPoint( e: PointerEvent ): Pt | null {
	const svg = svgRef.value;

	if ( !svg ) {
		return null;
	}

	const ctm = svg.getScreenCTM();

	if ( !ctm ) {
		return null;
	}

	const p = new DOMPoint( e.clientX, e.clientY ).matrixTransform( ctm.inverse() );
	return { x: p.x, y: p.y };
}

function onPointerMove( e: PointerEvent ) {
	if ( !dragging.value ) {
		return;
	}

	const p = toSvgPoint( e );

	if ( !p ) {
		return;
	}

	const k = dragging.value;
	corners[ k ].x = p.x;

	// Untere Ecken werden intern ohne autoExtra gespeichert
	if ( k === "lb" || k === "rb" ) {
		corners[ k ].y = p.y - autoExtraBottom.value;
	} else {
		corners[ k ].y = p.y;
	}

	syncRect( k );
}

const handleList = computed( () => {
	const ec = effectiveCorners.value;
	return [
		{
			key: "lt" as const, p: ec.lt, color: "#ff6b6b"
		},
		{
			key: "rt" as const, p: ec.rt, color: "#4dabf7"
		},
		{
			key: "lb" as const, p: ec.lb, color: "#ffd43b"
		},
		{
			key: "rb" as const, p: ec.rb, color: "#51cf66"
		}
	];
} );
</script>

<style scoped>
.svg-warp-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: system-ui, sans-serif;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar button {
  padding: 6px 10px;
  cursor: pointer;
}

.grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 12px;
  align-items: start;
}

.panel {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
}

.panel h4 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  gap: 8px;
  margin: 4px 0;
}

.row label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.row input[type='number'] {
  width: 88px;
}

.row.split {
  margin-top: 10px;
  color: #666;
}

.canvas {
  width: 100%;
}

.scene {
  width: 100%;
  height: auto; /* Höhe folgt viewBox-Verhältnis */
  display: block;
  touch-action: pan-y;
  user-select: none;
}

.handle {
  cursor: grab;
}

.handle:active {
  cursor: grabbing;
}

.svg-html-slot {
  width: 100%;
  box-sizing: border-box;
  display: block;
  overflow: visible;
  color: #222;
  font: 1.35 system-ui, sans-serif;
}

.svg-html-slot :deep(*) {
  box-sizing: border-box;
}

.svg-html-slot :deep(h2),
.svg-html-slot :deep(h3) {
  color: #000 !important;
}
</style>
