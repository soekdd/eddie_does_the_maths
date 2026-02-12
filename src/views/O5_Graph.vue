<template>
<div class="wrap">
	<template v-if="geom">
		<svg
			aria-label="Geometrische Konfiguration zu IMO 1985 Aufgabe 5"
			class="svg"
			role="img"
			:viewBox="`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`"
		>
			<!-- Geometry in cartesian coordinates (y up) -->
			<g transform="scale(1,-1)">
				<!-- Base circle through A,C -->
				<circle
					:cx="geom.O.x"
					:cy="geom.O.y"
					fill="none"
					:r="geom.baseRadius"
					stroke="#1f2937"
					stroke-width="0.025"
				/>

				<!-- Circumcircles used in proof -->
				<circle
					v-if="geom.circABC"
					:cx="geom.circABC.center.x"
					:cy="geom.circABC.center.y"
					fill="none"
					:r="geom.circABC.radius"
					stroke="#9ca3af"
					stroke-dasharray="0.08 0.08"
					stroke-width="0.018"
				/>
				<circle
					v-if="geom.circKBN"
					:cx="geom.circKBN.center.x"
					:cy="geom.circKBN.center.y"
					fill="none"
					:r="geom.circKBN.radius"
					stroke="#9ca3af"
					stroke-dasharray="0.08 0.08"
					stroke-width="0.018"
				/>

				<!-- Triangle and secants -->
				<polyline
					fill="none"
					:points="ptsStr([ geom.A, geom.B, geom.C, geom.A ])"
					stroke="#2563eb"
					stroke-linejoin="round"
					stroke-width="0.03"
				/>
				<line
					stroke="#0f766e"
					stroke-width="0.026"
					:x1="geom.B.x"
					:x2="geom.K.x"
					:y1="geom.B.y"
					:y2="geom.K.y"
				/>
				<line
					stroke="#0f766e"
					stroke-width="0.026"
					:x1="geom.B.x"
					:x2="geom.N.x"
					:y1="geom.B.y"
					:y2="geom.N.y"
				/>

				<!-- Radical-axis related lines -->
				<line
					stroke="#7c3aed"
					stroke-dasharray="0.07 0.06"
					stroke-width="0.022"
					:x1="geom.A.x"
					:x2="geom.C.x"
					:y1="geom.A.y"
					:y2="geom.C.y"
				/>
				<line
					stroke="#7c3aed"
					stroke-dasharray="0.07 0.06"
					stroke-width="0.022"
					:x1="geom.K.x"
					:x2="geom.N.x"
					:y1="geom.K.y"
					:y2="geom.N.y"
				/>
				<line
					stroke="#111827"
					stroke-width="0.028"
					:x1="geom.B.x"
					:x2="geom.M.x"
					:y1="geom.B.y"
					:y2="geom.M.y"
				/>

				<!-- Segment OM for right-angle statement -->
				<line
					stroke="#111827"
					stroke-width="0.028"
					:x1="geom.O.x"
					:x2="geom.M.x"
					:y1="geom.O.y"
					:y2="geom.M.y"
				/>

				<!-- Right-angle marker at M between MO and MB -->
				<polyline
					v-if="rightMarker"
					fill="none"
					:points="rightMarker"
					stroke="#111827"
					stroke-width="0.02"
				/>

				<!-- Points -->
				<g fill="#111827">
					<circle v-for="p in geom.points"
						:key="p.name"
						:cx="p.x"
						:cy="p.y"
						r="0.035"
					/>
				</g>
			</g>

			<!-- Labels in regular SVG coordinate system -->
			<g class="labels points" :font-size="pointLabelSize">
				<text
					v-for="p in geom.points"
					:key="`label-${p.name}`"
					:x="labelPos(p).x"
					:y="labelPos(p).y"
				>
					{{ p.name }}
				</text>
			</g>
		</svg>

		<div class="legendHtml">
			<div class="legendItem">
				<span class="swatch tri"></span>
				<span>Dreieck ABC</span>
			</div>
			<div class="legendItem">
				<span class="swatch rad"></span>
				<span>Radikalachsen AC und KN</span>
			</div>
			<div class="legendItem">
				<span class="swatch right"></span>
				<span>BM und OM (zu zeigen: ⟂)</span>
			</div>
			<div class="legendItem">
				<span class="swatch circ"></span>
				<span>Umkreise von ABC und KBN</span>
			</div>
		</div>
	</template>

	<div v-else class="loading">Gültige Konfiguration berechnen…</div>
</div>
</template>

<script setup>
import { computed } from "vue";

const EPS = 1e-9;

const props = defineProps( {
	result: {
		type:    Object,
		default: null
	}
} );

function pt( x, y ) {
	return { x, y };
}

function add( a, b ) {
	return pt( a.x + b.x, a.y + b.y );
}

function sub( a, b ) {
	return pt( a.x - b.x, a.y - b.y );
}

function mul( a, t ) {
	return pt( a.x * t, a.y * t );
}

function rotateAround(
	p, center, angle
) {
	const dx = p.x - center.x;
	const dy = p.y - center.y;
	const c = Math.cos( angle );
	const s = Math.sin( angle );
	return pt( center.x + c * dx - s * dy,
		center.y + s * dx + c * dy );
}

function norm( a ) {
	const d = Math.hypot( a.x, a.y );

	if ( d < EPS ) {
		return null;
	}

	return pt( a.x / d, a.y / d );
}

function dist( a, b ) {
	return Math.hypot( a.x - b.x, a.y - b.y );
}

function finitePoint( p ) {
	return p && Number.isFinite( p.x ) && Number.isFinite( p.y );
}

function circumcircle(
	P, Q, Rr
) {
	const x1 = P.x;
	const y1 = P.y;
	const x2 = Q.x;
	const y2 = Q.y;
	const x3 = Rr.x;
	const y3 = Rr.y;
	const d = 2 * ( x1 * ( y2 - y3 ) + x2 * ( y3 - y1 ) + x3 * ( y1 - y2 ) );

	if ( Math.abs( d ) < EPS ) {
		return null;
	}

	const uX =
		( ( x1 * x1 + y1 * y1 ) * ( y2 - y3 ) +
		( x2 * x2 + y2 * y2 ) * ( y3 - y1 ) +
		( x3 * x3 + y3 * y3 ) * ( y1 - y2 ) ) / d;
	const uY =
		( ( x1 * x1 + y1 * y1 ) * ( x3 - x2 ) +
		( x2 * x2 + y2 * y2 ) * ( x1 - x3 ) +
		( x3 * x3 + y3 * y3 ) * ( x2 - x1 ) ) / d;
	const center = pt( uX, uY );
	const radius = dist( center, P );

	if ( !Number.isFinite( radius ) || radius < EPS ) {
		return null;
	}

	return { center, radius };
}

function boundsFromPoints( points ) {
	let minX = Infinity;
	let maxX = -Infinity;
	let minY = Infinity;
	let maxY = -Infinity;

	for ( const p of points ) {
		if ( !finitePoint( p ) ) {
			continue;
		}

		minX = Math.min( minX, p.x );
		maxX = Math.max( maxX, p.x );
		minY = Math.min( minY, p.y );
		maxY = Math.max( maxY, p.y );
	}

	if ( !Number.isFinite( minX ) ) {
		return null;
	}

	return {
		minX, maxX, minY, maxY
	};
}

function growBoundsByCircle( bounds, circle ) {
	if ( !circle || !finitePoint( circle.center ) || !Number.isFinite( circle.radius ) ) {
		return;
	}

	bounds.minX = Math.min( bounds.minX, circle.center.x - circle.radius );
	bounds.maxX = Math.max( bounds.maxX, circle.center.x + circle.radius );
	bounds.minY = Math.min( bounds.minY, circle.center.y - circle.radius );
	bounds.maxY = Math.max( bounds.maxY, circle.center.y + circle.radius );
}

function rightAngleMarker(
	vertex, pointA, pointB, size
) {
	const u = norm( sub( pointA, vertex ) );
	const v = norm( sub( pointB, vertex ) );

	if ( !u || !v ) {
		return "";
	}

	const p1 = add( vertex, mul( u, size ) );
	const p2 = add( p1, mul( v, size ) );
	const p3 = add( vertex, mul( v, size ) );
	return `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
}

function ptsStr( pts ) {
	return pts.map( ( p ) => `${p.x},${p.y}` ).join( " " );
}

const geom = computed( () => {
	const list = Array.isArray( props.result?.points ) ? props.result.points : null;

	if ( !list || !list.length ) {
		return null;
	}

	const map = Object.create( null );

	for ( const item of list ) {
		if ( !item?.name ) {
			continue;
		}

		map[ item.name ] = pt( Number( item.x ), Number( item.y ) );
	}

	const required = [ "O", "A", "B", "C", "K", "N", "M", "X" ];

	if ( required.some( ( key ) => !finitePoint( map[ key ] ) ) ) {
		return null;
	}

	const O = map.O;
	const A = map.A;
	const B = map.B;
	const C = map.C;
	const K = map.K;
	const N = map.N;
	const M = map.M;
	const X = map.X;

	const baseRadius = dist( O, A );

	if ( !Number.isFinite( baseRadius ) || baseRadius < EPS ) {
		return null;
	}

	const circABCraw = circumcircle(
		A, B, C
	);
	const circKBNraw = circumcircle(
		K, B, N
	);
	const rotationCenter = circABCraw?.center || O;
	const omAngle = Math.atan2( M.y - O.y, M.x - O.x );
	const rotateBy = Math.PI / 2 - omAngle;

	const rotatedMap = Object.create( null );

	for ( const key of required ) {
		rotatedMap[ key ] = rotateAround(
			map[ key ], rotationCenter, rotateBy
		);
	}

	const allPoints = required.map( ( key ) => ( {
		name: key,
		...rotatedMap[ key ]
	} ) );

	const pointBounds = boundsFromPoints( allPoints );

	if ( !pointBounds ) {
		return null;
	}

	const span = Math.max(
		pointBounds.maxX - pointBounds.minX,
		pointBounds.maxY - pointBounds.minY,
		0.7
	);
	const maxCircleRadius = span * 8;

	const circABCrot = circABCraw ?
		{
			center: rotateAround(
				circABCraw.center, rotationCenter, rotateBy
			),
			radius: circABCraw.radius
		} :
		null;
	const circKBNrot = circKBNraw ?
		{
			center: rotateAround(
				circKBNraw.center, rotationCenter, rotateBy
			),
			radius: circKBNraw.radius
		} :
		null;

	const circABC =
		circABCrot && circABCrot.radius <= maxCircleRadius ? circABCrot : null;
	const circKBN =
		circKBNrot && circKBNrot.radius <= maxCircleRadius ? circKBNrot : null;

	const bounds = { ...pointBounds };
	growBoundsByCircle( bounds, {
		center: rotatedMap.O,
		radius: baseRadius
	} );
	growBoundsByCircle( bounds, circABC );
	growBoundsByCircle( bounds, circKBN );

	return {
		O:      rotatedMap.O,
		A:      rotatedMap.A,
		B:      rotatedMap.B,
		C:      rotatedMap.C,
		K:      rotatedMap.K,
		N:      rotatedMap.N,
		M:      rotatedMap.M,
		X:      rotatedMap.X,
		baseRadius,
		circABC,
		circKBN,
		points: allPoints,
		bounds
	};
} );

const viewBox = computed( () => {
	if ( !geom.value ) {
		return {
			x: -2.2,
			y: -2.2,
			w: 4.4,
			h: 4.4
		};
	}

	// Keep the circumcircle of ABC centered and make it occupy 80% of the available width.
	// Fallback to the base circle around O if circumcircle is unavailable.
	const circle = geom.value.circABC || {
		center: geom.value.O,
		radius: geom.value.baseRadius
	};
	const r = Math.max( circle.radius, EPS );
	const w = 2.5 * r; // because diameter / width = 2r / w = 0.8
	const h = w;
	const cx = circle.center.x;
	const cy = circle.center.y;

	return {
		x: cx - w / 2,
		y: -( cy + h / 2 ),
		w,
		h
	};
} );

const centroid = computed( () => {
	if ( !geom.value ) {
		return pt( 0, 0 );
	}

	let sx = 0;
	let sy = 0;
	let count = 0;

	for ( const p of geom.value.points ) {
		sx += p.x;
		sy += p.y;
		count += 1;
	}

	if ( !count ) {
		return pt( 0, 0 );
	}

	return pt( sx / count, sy / count );
} );

const rightMarker = computed( () => {
	if ( !geom.value ) {
		return "";
	}

	const span = Math.max(
		viewBox.value.w, viewBox.value.h, 1
	);
	const size = span * 0.035;

	return rightAngleMarker(
		geom.value.M, geom.value.O, geom.value.B, size
	);
} );

const pointLabelSize = computed( () => {
	return Math.max( viewBox.value.w, viewBox.value.h ) * 0.042;
} );

function labelPos( p ) {
	const c = centroid.value;
	const dir = norm( sub( p, c ) ) || pt( 0.7, 0.7 );
	const d = Math.max( viewBox.value.w, viewBox.value.h ) * 0.042;
	return {
		x: p.x + dir.x * d,
		y: -p.y - dir.y * d
	};
}
</script>

<style scoped>
.wrap {
	align-items: stretch;
	display: flex;
	flex-direction: column;
	gap: 10px;
	justify-content: center;
	width: 100%;
}

.svg {
	background: #fff;
	border: 1px solid #d1d5db;
	border-radius: 10px;
	display: block;
	height: auto;
	max-height: 660px;
	width: 100%;
}

.labels.points text {
	fill: #0f172a;
	font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
	font-weight: 600;
}

.legendHtml {
	background: #ffffffdd;
	border: 1px solid #d1d5db;
	border-radius: 8px;
	color: #0f172a;
	display: grid;
	font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
	font-size: 13px;
	font-weight: 500;
	gap: 6px;
	padding: 9px 12px;
}

.legendItem {
	align-items: center;
	display: flex;
	gap: 8px;
}

.swatch {
	border-radius: 2px;
	display: inline-block;
	flex: 0 0 26px;
	height: 0;
}

.swatch.tri {
	border-top: 2px solid #2563eb;
}

.swatch.rad {
	border-top: 2px dashed #7c3aed;
}

.swatch.right {
	border-top: 2px solid #111827;
}

.swatch.circ {
	border-top: 2px dashed #9ca3af;
}

.loading {
	color: #6b7280;
	font-size: 0.95rem;
	padding: 0.65rem 0;
}
</style>
