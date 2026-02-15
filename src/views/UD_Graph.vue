<template>
<div class="udGraph">
	<div class="toolbar">
		<button
			class="regenButton"
			type="button"
			@click="regenerate"
		>
			Neues Polygon
		</button>
		<label class="vertexControl" for="vertexCountSlider">
			<span class="meta">Ecken: {{ vertexCountTarget }}</span>
			<input
				id="vertexCountSlider"
				v-model.number="vertexCountTarget"
				class="vertexSlider"
				:max="MAX_VERTEX_COUNT"
				:min="MIN_VERTEX_COUNT"
				step="1"
				type="range"
				@input="regenerate"
			>
		</label>
		<span class="meta">Typ: {{ model.concave ? "konkav" : "konvex" }}</span>
	</div>

	<svg
		:aria-label="ariaLabel"
		class="canvas"
		role="img"
		viewBox="0 0 640 420"
		xmlns="http://www.w3.org/2000/svg"
		@click="regenerate"
	>
		<rect class="bg"
			height="420"
			width="640"
			x="0"
			y="0"
		/>

		<polygon
			v-for="(rect, i) in edgeRectangles"
			:key="`rect-${i}`"
			class="edgeRect"
			:points="rect.points"
		/>

		<polyline
			class="polygon"
			:points="polylinePoints"
		/>

		<path
			v-for="slice in cornerSlices"
			:key="`slice-${slice.index}`"
			:class="slice.kind === 'convex' ? 'cornerSliceConvex' : 'cornerSliceConcave'"
			:d="slice.d"
		/>
		<g class="slicePack">
			<path
				v-for="slice in packedCornerSlices"
				:key="`slice-pack-${slice.index}`"
				:class="slice.kind === 'convex' ? 'cornerSliceConvex' : 'cornerSliceConcave'"
				:d="slice.d"
				:transform="slice.transform"
			/>
			<circle
				class="slicePackCircle"
				:cx="SLICE_PACK_CENTER.x"
				:cy="SLICE_PACK_CENTER.y"
				:r="stripHeight"
			/>
		</g>

		<line
			v-for="(edge, i) in edgeLines"
			:key="`edge-${i}`"
			class="edge"
			:x1="edge.x1"
			:x2="edge.x2"
			:y1="edge.y1"
			:y2="edge.y2"
		/>

		<g v-for="(point, i) in model.points" :key="`point-${i}`">
			<circle
				class="pointHit"
				:cx="point.x"
				:cy="point.y"
				r="12"
				@mouseenter="hoveredIndex = i"
				@mouseleave="hoveredIndex = -1"
			/>
			<circle
				:class="[ 'point', { active: hoveredIndex === i } ]"
				:cx="point.x"
				:cy="point.y"
				r="4.5"
			/>
			<text
				v-if="hoveredIndex === i"
				class="pointLabel"
				:x="point.x + 8"
				:y="point.y - 10"
			>
				P{{ i + 1 }} ({{ fmt( point.x ) }}, {{ fmt( point.y ) }})
			</text>
		</g>
	</svg>

	<p class="hint">
		Im Kreis oben rechts wird klar, dass die Kreissektoren um die Ecken in der Summe genau eine Kreisfläche ergeben.
	</p>
</div>
</template>

<script setup>
import { computed, ref } from "vue";

const VIEWBOX_WIDTH = 640;
const VIEWBOX_HEIGHT = 420;
const VIEWBOX_PADDING = 34;
const VIEWBOX_LEFT_SHIFT_RATIO = 0.05;
const MIN_VERTEX_COUNT = 4;
const MAX_VERTEX_COUNT = 12;
const EPS = 1e-9;
const MAX_GENERATION_ATTEMPTS = 200;
const SLICE_PACK_GAP = 6;
const SLICE_PACK_CENTER = {
	x: VIEWBOX_WIDTH - 78,
	y: 74
};

const vertexCountTarget = ref( 6 );
const model = ref( createPolygonModel( vertexCountTarget.value ) );
const hoveredIndex = ref( -1 );

const ariaLabel = computed( () => `Zufallspolygon mit ${model.value.vertexCount} Punkten` );

const polylinePoints = computed( () => {
	const pts = model.value.points.map( ( p ) => `${p.x},${p.y}` );

	if ( model.value.points.length ) {
		const first = model.value.points[ 0 ];
		pts.push( `${first.x},${first.y}` );
	}

	return pts.join( " " );
} );

const edgeLines = computed( () => {
	const pts = model.value.points;
	const edges = [];

	for ( let i = 0; i < pts.length; i++ ) {
		const next = ( i + 1 ) % pts.length;
		edges.push( {
			x1: pts[ i ].x,
			y1: pts[ i ].y,
			x2: pts[ next ].x,
			y2: pts[ next ].y
		} );
	}

	return edges;
} );

const stripHeight = computed( () => computeStripHeight( model.value.points ) );

const edgeMeta = computed( () => {
	const pts = model.value.points;
	const n = pts.length;
	const h = stripHeight.value;

	if ( n < 2 || h <= 0 ) {
		return [];
	}

	return pts.map( ( p1, i ) => {
		const p2 = pts[ ( i + 1 ) % n ];
		const dx = p2.x - p1.x;
		const dy = p2.y - p1.y;
		const len = Math.hypot( dx, dy );

		if ( len < EPS ) {
			return null;
		}

		const leftNormal = {
			x: -dy / len,
			y: dx / len
		};
		const mid = {
			x: ( p1.x + p2.x ) / 2,
			y: ( p1.y + p2.y ) / 2
		};
		const probe = Math.max( 1, h * 0.35 );
		const plus = pointInPolygon( {
			x: mid.x + leftNormal.x * probe,
			y: mid.y + leftNormal.y * probe
		}, pts );
		const minus = pointInPolygon( {
			x: mid.x - leftNormal.x * probe,
			y: mid.y - leftNormal.y * probe
		}, pts );

		let outward = leftNormal;

		if ( plus && !minus ) {
			outward = {
				x: -leftNormal.x,
				y: -leftNormal.y
			};
		} else if ( plus === minus ) {
			const signed = polygonArea( pts );

			if ( signed > 0 ) {
				outward = {
					x: -leftNormal.x,
					y: -leftNormal.y
				};
			}
		}

		const ox = outward.x * h;
		const oy = outward.y * h;
		const rectPoints = [
			{
				x: p1.x,
				y: p1.y
			},
			{
				x: p2.x,
				y: p2.y
			},
			{
				x: p2.x + ox,
				y: p2.y + oy
			},
			{
				x: p1.x + ox,
				y: p1.y + oy
			}
		];

		return {
			index: i,
			p1,
			p2,
			outward,
			rectPoints
		};
	} );
} );

const edgeRectangles = computed( () => edgeMeta.value
	.filter( Boolean )
	.map( ( edge ) => ( { points: pointsToString( edge.rectPoints ) } ) ) );

const cornerSlices = computed( () => {
	const pts = model.value.points;
	const edges = edgeMeta.value;
	const n = pts.length;
	const h = stripHeight.value;

	if ( n < 3 || h <= 0 || edges.length !== n ) {
		return [];
	}

	const signedArea = polygonArea( pts );
	const orientationSign = signedArea >= 0 ? 1 : -1;
	const slices = [];

	for ( let i = 0; i < n; i++ ) {
		const prev = pts[ ( i - 1 + n ) % n ];
		const curr = pts[ i ];
		const next = pts[ ( i + 1 ) % n ];
		const prevEdge = edges[ ( i - 1 + n ) % n ];
		const nextEdge = edges[ i ];

		if ( !prevEdge || !nextEdge ) {
			continue;
		}

		const turnCross = cross2d( {
			x: curr.x - prev.x,
			y: curr.y - prev.y
		},
		{
			x: next.x - curr.x,
			y: next.y - curr.y
		} );
		const curvature = turnCross * orientationSign;

		if ( Math.abs( curvature ) <= EPS ) {
			continue;
		}

		const kind = curvature > 0 ? "convex" : "concave";
		const sector = buildSectorPath(
			curr,
			h,
			prevEdge.outward,
			nextEdge.outward
		);

		if ( !sector ) {
			continue;
		}

		slices.push( {
			index:  i,
			kind,
			d:      sector.d,
			center: sector.center,
			dir:    sector.dir
		} );
	}

	return slices;
} );

const packedCornerSlices = computed( () => cornerSlices.value.map( ( slice ) => ( {
	...slice,
	transform: `translate(${
		SLICE_PACK_CENTER.x - slice.center.x + slice.dir.x * SLICE_PACK_GAP
	} ${
		SLICE_PACK_CENTER.y - slice.center.y + slice.dir.y * SLICE_PACK_GAP
	})`
} ) ) );

function buildSectorPath(
	center, radius, startVec, endVec
) {
	const startLen = Math.hypot( startVec.x, startVec.y );
	const endLen = Math.hypot( endVec.x, endVec.y );

	if ( startLen < EPS || endLen < EPS || radius <= 0 ) {
		return "";
	}

	const a0 = Math.atan2( startVec.y, startVec.x );
	const a1 = Math.atan2( endVec.y, endVec.x );
	const delta = normalizeAngle( a1 - a0 );

	if ( Math.abs( delta ) < 1e-3 ) {
		return "";
	}

	const start = {
		x: center.x + Math.cos( a0 ) * radius,
		y: center.y + Math.sin( a0 ) * radius
	};
	const end = {
		x: center.x + Math.cos( a0 + delta ) * radius,
		y: center.y + Math.sin( a0 + delta ) * radius
	};
	const midAngle = a0 + delta / 2;
	const sweep = delta >= 0 ? 1 : 0;

	return {
		center,
		dir: {
			x: Math.cos( midAngle ),
			y: Math.sin( midAngle )
		},
		d: `M ${center.x} ${center.y} L ${start.x} ${start.y} A ${radius} ${radius} 0 0 ${sweep} ${end.x} ${end.y} Z`
	};
}

function normalizeAngle( angle ) {
	let a = angle;

	while ( a <= -Math.PI ) {
		a += Math.PI * 2;
	}

	while ( a > Math.PI ) {
		a -= Math.PI * 2;
	}

	return a;
}

function cross2d( a, b ) {
	return a.x * b.y - a.y * b.x;
}

function regenerate() {
	model.value = createPolygonModel( vertexCountTarget.value );
	hoveredIndex.value = -1;
}

function createPolygonModel( vertexCountInput ) {
	const vertexCount = clampVertexCount( vertexCountInput );

	for ( let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++ ) {
		const rawPoints = makeAngularPolygon( vertexCount );

		if ( !isSimplePolygon( rawPoints ) ) {
			continue;
		}

		const area = Math.abs( polygonArea( rawPoints ) );

		if ( area < 5 ) {
			continue;
		}

		const normalized = normalizeToViewbox(
			rawPoints,
			VIEWBOX_WIDTH,
			VIEWBOX_HEIGHT,
			VIEWBOX_PADDING
		);

		if ( normalized.length !== vertexCount ) {
			continue;
		}

		return {
			points:  normalized,
			vertexCount,
			concave: isConcavePolygon( rawPoints )
		};
	}

	const fallback = normalizeToViewbox(
		makeRegularPolygon( vertexCount,
			140 ),
		VIEWBOX_WIDTH,
		VIEWBOX_HEIGHT,
		VIEWBOX_PADDING
	);

	return {
		points:      fallback,
		vertexCount: vertexCount,
		concave:     false
	};
}

function makeAngularPolygon( vertexCount ) {
	const baseRadius = randFloat( 90,
		165 );
	const step = Math.PI * 2 / vertexCount;
	const angles = [];

	for ( let i = 0; i < vertexCount; i++ ) {
		const jitter = randFloat( -step * 0.28,
			step * 0.28 );
		angles.push( i * step + jitter );
	}

	angles.sort( ( a, b ) => a - b );

	const radii = angles.map( () => baseRadius * randFloat( 0.58, 1 ) );

	if ( Math.random() < 0.72 ) {
		const idx = randInt( 0,
			vertexCount - 1 );
		radii[ idx ] *= randFloat( 0.28, 0.55 );
	}

	return angles.map( ( angle, i ) => ( {
		x: Math.cos( angle ) * radii[ i ],
		y: Math.sin( angle ) * radii[ i ]
	} ) );
}

function makeRegularPolygon( vertexCount, radius ) {
	const points = [];
	const step = Math.PI * 2 / vertexCount;

	for ( let i = 0; i < vertexCount; i++ ) {
		points.push( {
			x: Math.cos( step * i ) * radius,
			y: Math.sin( step * i ) * radius
		} );
	}

	return points;
}

function normalizeToViewbox(
	points, width, height, padding
) {
	if ( !Array.isArray( points ) || points.length < 3 ) {
		return [];
	}

	let minX = Infinity;
	let maxX = -Infinity;
	let minY = Infinity;
	let maxY = -Infinity;

	for ( const p of points ) {
		minX = Math.min( minX, p.x );
		maxX = Math.max( maxX, p.x );
		minY = Math.min( minY, p.y );
		maxY = Math.max( maxY, p.y );
	}

	const spanX = Math.max( maxX - minX,
		1 );
	const spanY = Math.max( maxY - minY,
		1 );
	const drawableW = width - padding * 2;
	const drawableH = height - padding * 2;
	const scale = Math.min( drawableW / spanX, drawableH / spanY );
	const occupiedW = spanX * scale;
	const occupiedH = spanY * scale;
	const offsetX = ( width - occupiedW ) / 2 - width * VIEWBOX_LEFT_SHIFT_RATIO;
	const offsetY = ( height - occupiedH ) / 2;

	return points.map( ( p ) => ( {
		x: ( p.x - minX ) * scale + offsetX,
		y: ( maxY - p.y ) * scale + offsetY
	} ) );
}

function computeStripHeight( points ) {
	void points;
	return 20;
}

function pointInPolygon( point, polygon ) {
	let inside = false;

	for ( let i = 0, j = polygon.length - 1; i < polygon.length; j = i++ ) {
		const xi = polygon[ i ].x;
		const yi = polygon[ i ].y;
		const xj = polygon[ j ].x;
		const yj = polygon[ j ].y;

		const intersects = yi > point.y !== yj > point.y &&
			 point.x < ( xj - xi ) * ( point.y - yi ) / ( yj - yi + EPS ) + xi ;

		if ( intersects ) {
			inside = !inside;
		}
	}

	return inside;
}

function pointsToString( points ) {
	return points.map( ( p ) => `${p.x},${p.y}` ).join( " " );
}

function polygonArea( points ) {
	let twiceArea = 0;

	for ( let i = 0; i < points.length; i++ ) {
		const j = ( i + 1 ) % points.length;
		twiceArea += points[ i ].x * points[ j ].y - points[ j ].x * points[ i ].y;
	}

	return twiceArea / 2;
}

function isSimplePolygon( points ) {
	const n = points.length;

	if ( n < 3 ) {
		return false;
	}

	for ( let i = 0; i < n; i++ ) {
		const a1 = points[ i ];
		const a2 = points[ ( i + 1 ) % n ];

		for ( let j = i + 1; j < n; j++ ) {
			const b1 = points[ j ];
			const b2 = points[ ( j + 1 ) % n ];

			if ( i === j ) {
				continue;
			}

			if ( ( i + 1 ) % n === j ) {
				continue;
			}

			if ( i === ( j + 1 ) % n ) {
				continue;
			}

			if ( segmentsIntersect(
				a1,
				a2,
				b1,
				b2
			) ) {
				return false;
			}
		}
	}

	return true;
}

function isConcavePolygon( points ) {
	let lastNonZeroSign = 0;

	for ( let i = 0; i < points.length; i++ ) {
		const a = points[ i ];
		const b = points[ ( i + 1 ) % points.length ];
		const c = points[ ( i + 2 ) % points.length ];
		const cross = crossZ(
			a,
			b,
			c
		);

		if ( Math.abs( cross ) < EPS ) {
			continue;
		}

		const sign = Math.sign( cross );

		if ( lastNonZeroSign === 0 ) {
			lastNonZeroSign = sign;
			continue;
		}

		if ( sign !== lastNonZeroSign ) {
			return true;
		}
	}

	return false;
}

function segmentsIntersect(
	a, b, c, d
) {
	const o1 = orientation(
		a,
		b,
		c
	);
	const o2 = orientation(
		a,
		b,
		d
	);
	const o3 = orientation(
		c,
		d,
		a
	);
	const o4 = orientation(
		c,
		d,
		b
	);

	if ( o1 !== o2 && o3 !== o4 ) {
		return true;
	}

	if ( o1 === 0 && onSegment(
		a,
		c,
		b
	) ) {
		return true;
	}

	if ( o2 === 0 && onSegment(
		a,
		d,
		b
	) ) {
		return true;
	}

	if ( o3 === 0 && onSegment(
		c,
		a,
		d
	) ) {
		return true;
	}

	if ( o4 === 0 && onSegment(
		c,
		b,
		d
	) ) {
		return true;
	}

	return false;
}

function orientation(
	p, q, r
) {
	const value = ( q.y - p.y ) * ( r.x - q.x ) - ( q.x - p.x ) * ( r.y - q.y );

	if ( Math.abs( value ) < EPS ) {
		return 0;
	}

	return value > 0 ? 1 : -1;
}

function onSegment(
	p, q, r
) {
	return (
		q.x <= Math.max( p.x, r.x ) + EPS &&
		q.x + EPS >= Math.min( p.x, r.x ) &&
		q.y <= Math.max( p.y, r.y ) + EPS &&
		q.y + EPS >= Math.min( p.y, r.y )
	);
}

function crossZ(
	a, b, c
) {
	return ( b.x - a.x ) * ( c.y - b.y ) - ( b.y - a.y ) * ( c.x - b.x );
}

function randFloat( min, max ) {
	return min + Math.random() * ( max - min );
}

function randInt( min, max ) {
	return min + Math.floor( Math.random() * ( max - min + 1 ) );
}

function clampVertexCount( value ) {
	const numeric = Number( value );

	if ( !Number.isFinite( numeric ) ) {
		return MIN_VERTEX_COUNT;
	}

	return Math.min( MAX_VERTEX_COUNT, Math.max( MIN_VERTEX_COUNT, Math.round( numeric ) ) );
}

function fmt( value ) {
	return Number( value ).toFixed( 1 );
}
</script>

<style scoped>
.udGraph {
	display: flex;
	flex-direction: column;
	gap: 10px;
	width: 100%;
}

.toolbar {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 10px;
}

.vertexControl {
	align-items: center;
	display: flex;
	gap: 8px;
}

.vertexSlider {
	accent-color: #204ecf;
	width: 150px;
}

.regenButton {
	background: #204ecf;
	border: 0;
	border-radius: 10px;
	color: #fff;
	cursor: pointer;
	font-size: 0.92rem;
	font-weight: 600;
	padding: 8px 12px;
}

.regenButton:hover {
	background: #1a43ba;
}

.regenButton:focus-visible {
	outline: 2px solid #0f4d7a;
	outline-offset: 2px;
}

.meta {
	color: var(--v-theme-on-surface, #2a2a2a);
	font-size: 0.9rem;
	opacity: 0.78;
}

.canvas {
	background: linear-gradient(180deg, #fff, #f7f9ff);
	border: 1px solid #d6dcef;
	border-radius: 12px;
	cursor: pointer;
	height: auto;
	max-width: 760px;
	width: 100%;
}

.bg {
	fill: transparent;
}

.polygon {
	fill: rgba(32, 78, 207, 0.14);
	stroke: rgba(32, 78, 207, 0.38);
	stroke-linejoin: round;
	stroke-width: 1.4;
}

.edgeRect {
	fill: rgba(215, 38, 61, 0.18);
	stroke: rgba(215, 38, 61, 0.5);
	stroke-width: 1;
}

.cornerSliceConvex {
	fill: rgba(20, 150, 120, 0.46);
	stroke: rgba(12, 110, 90, 0.9);
	stroke-width: 1;
}

.cornerSliceConcave {
	fill: rgba(242, 147, 34, 0.48);
	stroke: rgba(196, 94, 12, 0.9);
	stroke-width: 1;
}

.slicePack {
	pointer-events: none;
}

.slicePackCircle {
	fill: none;
	stroke: rgba(28, 53, 99, 0.7);
	stroke-dasharray: 3 3;
	stroke-width: 1.2;
}

.edge {
	stroke: #204ecf;
	stroke-width: 2.2;
}

.pointHit {
	fill: transparent;
}

.point {
	fill: #113189;
	transition: r 120ms ease;
}

.point.active {
	fill: #d7263d;
}

.pointLabel {
	fill: #12295f;
	font-size: 12px;
	font-weight: 600;
	pointer-events: none;
}

.hint {
	color: #3b4361;
	font-size: 0.9rem;
	margin: 0;
}
</style>
