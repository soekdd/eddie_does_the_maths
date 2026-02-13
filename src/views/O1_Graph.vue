<template>
<div class="wrap">
	<svg
		v-if="state.ready"
		aria-label="Zyklisches Viereck mit Tangentialkreis"
		class="svg"
		role="img"
		:viewBox="`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`"
	>
		<!-- Geometry drawn in cartesian (y up) -->
		<g transform="scale(1,-1)">
			<!-- circumcircle (dashed) -->
			<circle
				:cx="state.circ.center.x"
				:cy="state.circ.center.y"
				fill="none"
				:r="state.circ.r"
				stroke="var(--o1-muted)"
				stroke-dasharray="7 7"
				stroke-width="0.2"
			/>

			<!-- tangent circle (solid) -->
			<circle
				:cx="state.O.x"
				:cy="state.O.y"
				fill="none"
				:r="state.r"
				stroke="var(--o1-ink)"
				stroke-width="0.4"
			/>

			<!-- quadrilateral -->
			<polyline
				fill="none"
				:points="ptsStr([ state.A, state.B, state.C, state.D, state.A ])"
				stroke="var(--o1-primary)"
				stroke-linejoin="round"
				stroke-width="0.6"
			/>

			<!-- radii to tangency points -->
			<line stroke="var(--o1-muted)"
				stroke-dasharray="1 1"
				stroke-width="0.4"
				:x1="state.O.x"
				:x2="state.L.x"
				:y1="state.O.y"
				:y2="state.L.y"
			/>
			<line stroke="var(--o1-muted)"
				stroke-dasharray="1 1"
				stroke-width="0.4"
				:x1="state.O.x"
				:x2="state.M.x"
				:y1="state.O.y"
				:y2="state.M.y"
			/>
			<line stroke="var(--o1-muted)"
				stroke-dasharray="1 1"
				stroke-width="0.4"
				:x1="state.O.x"
				:x2="state.N.x"
				:y1="state.O.y"
				:y2="state.N.y"
			/>

			<!-- points -->
			<g fill="var(--o1-ink)">
				<circle :cx="state.A.x" :cy="state.A.y" r="1.0"/>
				<circle :cx="state.B.x" :cy="state.B.y" r="1.0"/>
				<circle :cx="state.C.x" :cy="state.C.y" r="1.0"/>
				<circle :cx="state.D.x" :cy="state.D.y" r="1.0"/>
				<circle :cx="state.O.x" :cy="state.O.y" r="1.0"/>

				<circle :cx="state.L.x" :cy="state.L.y" r="1.0"/>
				<circle :cx="state.M.x" :cy="state.M.y" r="1.0"/>
				<circle :cx="state.N.x" :cy="state.N.y" r="1.0"/>
			</g>

			<!-- right-angle markers at L, M, N -->
			<polyline fill="none"
				:points="rightAngleMarker(state.L, state.O)"
				stroke="var(--o1-ink)"
				stroke-width="0.4"
			/>
			<polyline fill="none"
				:points="rightAngleMarker(state.M, state.O)"
				stroke="var(--o1-ink)"
				stroke-width="0.4"
			/>
			<polyline fill="none"
				:points="rightAngleMarker(state.N, state.O)"
				stroke="var(--o1-ink)"
				stroke-width="0.4"
			/>

			<!-- line AB (optional emphasize) -->
			<line stroke="var(--o1-ink)"
				stroke-width="0.6"
				:x1="state.D.x"
				:x2="state.C.x"
				:y1="state.D.y"
				:y2="state.C.y"
			/>
		</g>

		<!-- Labels (normal SVG coords: y down) -->
		<g class="labels">
			<text :x="state.A.x " :y="-state.A.y + 8">A</text>
			<text :x="state.B.x -4 " :y="-state.B.y + 8">B</text>
			<text :x="state.C.x - 0" :y="-state.C.y - 10">C</text>
			<text :x="state.D.x - 4" :y="-state.D.y - 10">D</text>

			<text :x="state.O.x - 2" :y="-state.O.y + 8">O</text>

			<text :x="state.L.x - 4" :y="-state.L.y - 4">L</text>
			<text :x="state.M.x - 2"  :y="-state.M.y - 4">M</text>
			<text :x="state.N.x - 0"  :y="-state.N.y - 4">N</text>
		</g>
	</svg>

	<div v-if="state.ready" class="legendHtml">
		<div class="legendItem">
			<span class="swatch circ"></span>
			<span>Umkreis durch A,B,C,D (zyklisch)</span>
		</div>
		<div class="legendItem">
			<span class="swatch tan"></span>
			<span>Tangentialkreis: berührt AD, DC, BC</span>
		</div>
	</div>

	<div v-else class="loading">Generiere Beispiel…</div>
</div>
</template>

<script setup>
import { onMounted, reactive } from "vue";

const FIXED_AB = 100;
const FIXED_A_X = -50;
const viewBox = {
	x: -70, y: -50, w: 140, h: 75
};

const state = reactive( {
	ready: false,

	// points
	A: { x: 0, y: 0 } ,
	B: { x: 0, y: 0 } ,
	C: { x: 0, y: 0 } ,
	D: { x: 0, y: 0 } ,

	// tangent circle
	O: { x: 0, y: 0 } ,
	r: 50,

	// tangency points
	L: { x: 0, y: 0 } ,
	M: { x: 0, y: 0 } ,
	N: { x: 0, y: 0 } ,

	// circumcircle
	circ: { center: { x: 0, y: 0 }, r: 1 },

	// lengths
	lenAB:       0,
	lenAD:       0,
	lenBC:       0,
	delta:       0,
	cyclicError: 0
} );

function rand( min, max ) {
	return min + Math.random() * ( max - min );
}

function dist( p, q ) {
	return Math.hypot( p.x - q.x, p.y - q.y );
}

function add( p, q ) {
	return { x: p.x + q.x, y: p.y + q.y };
}

function sub( p, q ) {
	return { x: p.x - q.x, y: p.y - q.y };
}

function mul( p, k ) {
	return { x: p.x * k, y: p.y * k };
}

function norm( v ) {
	const d = Math.hypot( v.x, v.y );
	return d === 0 ? { x: 0, y: 0 } : { x: v.x / d, y: v.y / d };
}

function rot90( v ) {
	return { x: -v.y, y: v.x };
}

function lineThrough( p, q ) {
	const a = q.y - p.y;
	const b = p.x - q.x;
	const c = a * p.x + b * p.y;
	return {
		a, b, c
	};
}

function intersect( l1, l2 ) {
	const det = l1.a * l2.b - l2.a * l1.b;

	if ( Math.abs( det ) < 1e-10 ) {
		return null;
	}

	const x = ( l1.c * l2.b - l2.c * l1.b ) / det;
	const y = ( l1.a * l2.c - l2.a * l1.c ) / det;
	return { x, y };
}

// For circle centered at origin radius r, tangent line at angle phi has equation: x cosφ + y sinφ = r
function tangentLineAt( phi, r ) {
	const M = { x: r * Math.cos( phi ), y: r * Math.sin( phi ) };
	const a = Math.cos( phi );
	const b = Math.sin( phi );
	const c = r;
	return {
		M,
		line: {
			a, b, c
		}
	};
}

// Tangent point from external point P=(p,0) on x-axis to circle center (0,0) radius r; choose upper tangency
function tangentPointFromXAxis( p, r ) {
	const ap = Math.abs( p );

	if ( ap <= r + 1e-9 ) {
		return null;
	}

	const x = r * r / p;
	const y = r * Math.sqrt( 1 - r * r / ( p * p ) );
	return { x, y };
}

function circumcircle(
	p1, p2, p3
){
	const ax = p1.x, ay = p1.y;
	const bx = p2.x, by = p2.y;
	const cx = p3.x, cy = p3.y;

	const d = 2 * ( ax * ( by - cy ) + bx * ( cy - ay ) + cx * ( ay - by ) );

	if ( Math.abs( d ) < 1e-10 ) {
		return null;
	}

	const a2 = ax * ax + ay * ay;
	const b2 = bx * bx + by * by;
	const c2 = cx * cx + cy * cy;

	const ux = ( a2 * ( by - cy ) + b2 * ( cy - ay ) + c2 * ( ay - by ) ) / d;
	const uy = ( a2 * ( cx - bx ) + b2 * ( ax - cx ) + c2 * ( bx - ax ) ) / d;

	const center = { x: ux, y: uy };
	const r = dist( center, p1 );

	if ( !Number.isFinite( r ) || r < 1e-6 || r > 1e6 ) {
		return null;
	}

	return { center, r };
}

function ptsStr( points ) {
	return points.map( p => `${p.x},${p.y}` ).join( " " );
}

// Right angle marker at tangency point T between radius (O->T) and tangent
function rightAngleMarker(
	T, O, s = 2
) {
	const rvec = sub( O, T ); // towards center
	const v = norm( rvec ); // radius direction (towards O)
	const u = norm( rot90( v ) ); // tangent direction

	const p1 = T;
	const p2 = add( T, mul( u, s ) );
	const p3 = add( p2, mul( v, s ) );
	const p4 = add( T, mul( v, s ) );
	return ptsStr( [ p1, p2, p3, p4 ] );
}

function computeLengthsAndError() {
	state.lenAB = dist( state.A, state.B );
	state.lenAD = dist( state.A, state.D );
	state.lenBC = dist( state.B, state.C );
	state.delta = state.lenAB - ( state.lenAD + state.lenBC );
	state.cyclicError = dist( state.D, state.circ.center ) - state.circ.r;
}

function shifted( p, tx ) {
	return { x: p.x + tx, y: p.y };
}

function solvePhiForCyclicity(
	A, B, r, L, N
) {
	const AD = lineThrough( A, L );
	const BC = lineThrough( B, N );

	function evalPhi( phi ) {
		const { M, line: DC } = tangentLineAt( phi, r );
		const D = intersect( AD, DC );
		const C = intersect( BC, DC );

		if ( !D || !C ) {
			return null;
		}

		// prefer "upper" configuration
		if ( D.y <= 1e-6 || C.y <= 1e-6 ) {
			return null;
		}

		const circ = circumcircle(
			A, B, C
		);

		if ( !circ ) {
			return null;
		}

		const res = dist( D, circ.center ) - circ.r; // should be 0

		if ( !Number.isFinite( res ) ) {
			return null;
		}

		return {
			phi, M, C, D, circ, res
		};
	}

	// scan for a sign change
	const lo = 0.20;
	const hi = Math.PI - 0.20;
	const steps = 220;

	const samples = [];

	for ( let i = 0; i <= steps; i++ ) {
		const phi = lo + ( hi - lo ) * ( i / steps );
		const v = evalPhi( phi );

		if ( v ) {
			samples.push( v );
		}
	}

	if ( samples.length < 5 ) {
		return null;
	}

	let bracket = null;

	for ( let i = 0; i < samples.length - 1; i++ ) {
		const s1 = samples[ i ];
		const s2 = samples[ i + 1 ];

		if ( s1.res === 0 ) {
			bracket = {
				a: s1.phi, b: s1.phi, fa: 0, fb: 0
			};
			break;
		}

		if ( s1.res * s2.res < 0 ) {
			bracket = {
				a: s1.phi, b: s2.phi, fa: s1.res, fb: s2.res
			};
			break;
		}
	}

	if ( !bracket ) {
		return null;
	}

	// bisection
	let a = bracket.a, b = bracket.b;
	let fa = bracket.fa, fb = bracket.fb;

	let best = evalPhi( a ) ?? evalPhi( b );

	for ( let iter = 0; iter < 70; iter++ ) {
		const m = ( a + b ) / 2;
		const fmObj = evalPhi( m );

		if ( !fmObj ) {
			// if invalid, shrink slightly
			a = a + 1e-4;
			b = b - 1e-4;
			continue;
		}

		const fm = fmObj.res;
		best = fmObj;

		if ( Math.abs( fm ) < 1e-10 ) {
			break;
		}

		if ( fa * fm < 0 ) {
			b = m; fb = fm;
		} else {
			a = m; fa = fm;
		}
	}

	return best;
}

function regenerate() {
	state.ready = false;

	for ( let attempt = 0; attempt < 220; attempt++ ) {
		// Build in local coordinates with O at origin and AB fixed to length 100.
		// Then shift all points so A,B stay at fixed screen coordinates.
		const AO = rand( 24, 76 );
		const OB = FIXED_AB - AO;
		const ALocal = { x: -AO, y: 0 };
		const BLocal = { x: OB, y: 0 };
		const r = Math.min( AO, OB ) * rand( 0.26, 0.52 );

		const LLocal = tangentPointFromXAxis( ALocal.x, r ); // negative x okay
		const NLocal = tangentPointFromXAxis( BLocal.x, r );

		if ( !LLocal || !NLocal ) {
			continue;
		}

		// Solve for phi so that A,B,C,D become concyclic.
		const sol = solvePhiForCyclicity(
			ALocal, BLocal, r, LLocal, NLocal
		);

		if ( !sol ) {
			continue;
		}

		// Accept only “nice” shapes (avoid extreme skinny)
		const {
			C, D, M, circ, res
		} = sol;

		if ( Math.abs( res ) > 1e-6 ) {
			continue;
		}

		if ( dist( C, D ) < FIXED_AB * 0.06 ) {
			continue;
		}

		// Shift so AB always sits at A=(-50,0), B=(50,0).
		const tx = FIXED_A_X - ALocal.x;
		const A = shifted( ALocal, tx );
		const B = shifted( BLocal, tx );
		const O = shifted( { x: 0, y: 0 }, tx );
		const L = shifted( LLocal, tx );
		const N = shifted( NLocal, tx );
		const CShift = shifted( C, tx );
		const DShift = shifted( D, tx );
		const MShift = shifted( M, tx );
		const circShift = {
			center: shifted( circ.center, tx ),
			r:      circ.r
		};

		state.A = A;
		state.B = B;
		state.C = CShift;
		state.D = DShift;
		state.O = O;
		state.r = r;
		state.L = L;
		state.M = MShift;
		state.N = N;
		state.circ = circShift;
		computeLengthsAndError();

		// Numerical guard: AB should be fixed up to tiny floating-point error.
		if ( Math.abs( state.lenAB - FIXED_AB ) > 1e-6 ) {
			continue;
		}

		state.ready = true;
		return;
	}

	// fallback (should rarely happen)
	state.ready = false;
	console.warn( "Konnte kein gültiges Beispiel finden. Bitte erneut klicken." );
}

// expose regenerate for parent components if you want
defineExpose( { regenerate, state } );

onMounted( () => regenerate() );
</script>

<style scoped>
.wrap {
  display: grid;
  gap: 12px;
  --o1-surface: rgb(var(--v-theme-surface, 255, 255, 255));
  --o1-ink: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.92);
  --o1-muted: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.58);
  --o1-primary: rgb(var(--v-theme-primary, 25, 118, 210));
  --o1-border: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.18);
  --o1-panel: rgba(var(--v-theme-surface, 255, 255, 255), 0.86);
}
.svg {
  width: min(900px, 100%);
  height: auto;
  border: 1px solid var(--o1-border);
  border-radius: 14px;
  background: var(--o1-surface);
}
.labels text {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  font-size: 4px;
  fill: var(--o1-ink);
  letter-spacing: initial;
  user-select: none;
}

.legendHtml {
  background: var(--o1-panel);
  border: 1px solid var(--o1-border);
  border-radius: 8px;
  color: var(--o1-ink);
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

.swatch.circ {
  border-top: 2px dashed var(--o1-muted);
}

.swatch.tan {
  border-top: 2px solid var(--o1-ink);
}

.loading {
  opacity: 0.7;
}
</style>
