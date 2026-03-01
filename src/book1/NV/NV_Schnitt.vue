<template>
<v-card class="pa-4" rounded="xl">
	<h3 class="text-h6 mb-2">Standortbestimmung per Schnittverfahren</h3>
	<p class="text-body-2 mb-4">
		Zwei Landmarken und zwei Peilungen liefern deinen Standort als Schnitt der Rückwärtslinien.
		Optional kannst du Distanzkreise zur Plausibilität einschalten.
	</p>

	<v-row dense>
		<v-col cols="12" md="6">
			<v-sheet class="pa-3 rounded-lg" variant="tonal">
				<div class="text-subtitle-2 mb-2">Landmarke A</div>
				<v-row dense>
					<v-col cols="6">
						<v-text-field v-model.number="ax" label="A_x" type="number" />
					</v-col>
					<v-col cols="6">
						<v-text-field v-model.number="ay" label="A_y" type="number" />
					</v-col>
					<v-col cols="12">
						<v-text-field
							v-model.number="bearingA"
							label="Peilung zu A (Grad ab Nord)"
							type="number"
						/>
					</v-col>
					<v-col cols="12">
						<v-text-field
							v-model.number="distA"
							label="Optionale Distanz zu A"
							min="0"
							step="0.1"
							type="number"
						/>
					</v-col>
				</v-row>
			</v-sheet>
		</v-col>

		<v-col cols="12" md="6">
			<v-sheet class="pa-3 rounded-lg" variant="tonal">
				<div class="text-subtitle-2 mb-2">Landmarke B</div>
				<v-row dense>
					<v-col cols="6">
						<v-text-field v-model.number="bx" label="B_x" type="number" />
					</v-col>
					<v-col cols="6">
						<v-text-field v-model.number="by" label="B_y" type="number" />
					</v-col>
					<v-col cols="12">
						<v-text-field
							v-model.number="bearingB"
							label="Peilung zu B (Grad ab Nord)"
							type="number"
						/>
					</v-col>
					<v-col cols="12">
						<v-text-field
							v-model.number="distB"
							label="Optionale Distanz zu B"
							min="0"
							step="0.1"
							type="number"
						/>
					</v-col>
				</v-row>
			</v-sheet>
		</v-col>
	</v-row>

	<v-row class="mt-1" dense>
		<v-col cols="12" md="6">
			<v-slider
				v-model="epsilonDeg"
				color="primary"
				:max="20"
				:min="0"
				step="0.5"
			>
				<template #prepend>
					<span class="text-caption">Unsicherheit ±ε</span>
				</template>
				<template #append>
					<v-chip size="small" variant="tonal">{{ fmt( epsilonDeg ) }}°</v-chip>
				</template>
			</v-slider>
		</v-col>
		<v-col class="d-flex align-center" cols="12" md="6">
			<v-checkbox
				v-model="showDistanceCircles"
				label="Distanzkreise zeichnen"
			/>
		</v-col>
	</v-row>

	<v-alert class="mt-2" :type="status.type" variant="tonal">
		{{ status.message }}
	</v-alert>

	<div class="kbox mt-3">
		<Katex as="div" display :tex="texLines" />
		<Katex as="div" display :tex="texAngle" />
		<Katex as="div" display :tex="texPoint" />
	</div>

	<div class="schnittCanvas mt-3">
		<svg viewBox="0 0 380 280" xmlns="http://www.w3.org/2000/svg">
			<rect fill="rgba(255,255,255,0.05)"
				height="280"
				rx="10"
				width="380"
			/>

			<line
				class="lineA"
				:x1="rayA.x1"
				:x2="rayA.x2"
				:y1="rayA.y1"
				:y2="rayA.y2"
			/>
			<line
				class="lineB"
				:x1="rayB.x1"
				:x2="rayB.x2"
				:y1="rayB.y1"
				:y2="rayB.y2"
			/>

			<line
				v-for="(line, idx) in coneLines"
				:key="`cone-${idx}`"
				class="coneLine"
				:x1="line.x1"
				:x2="line.x2"
				:y1="line.y1"
				:y2="line.y2"
			/>

			<circle
				v-if="showDistanceCircles && distA > 0"
				class="circleA"
				:cx="pointA.x"
				:cy="pointA.y"
				:r="distA * view.scale"
			/>
			<circle
				v-if="showDistanceCircles && distB > 0"
				class="circleB"
				:cx="pointB.x"
				:cy="pointB.y"
				:r="distB * view.scale"
			/>

			<circle class="landmarkA"
				:cx="pointA.x"
				:cy="pointA.y"
				r="5"
			/>
			<circle class="landmarkB"
				:cx="pointB.x"
				:cy="pointB.y"
				r="5"
			/>
			<text class="label" :x="pointA.x + 7" :y="pointA.y - 7">A</text>
			<text class="label" :x="pointB.x + 7" :y="pointB.y - 7">B</text>

			<g v-if="hasIntersection">
				<circle class="pointX"
					:cx="pointX.x"
					:cy="pointX.y"
					r="6"
				/>
				<text class="label" :x="pointX.x + 8" :y="pointX.y - 8">X</text>
			</g>
		</svg>
	</div>

	<v-row class="mt-3" dense>
		<v-col cols="12" md="6">
			<v-sheet class="pa-3 rounded-lg" variant="outlined">
				<div class="text-caption text-medium-emphasis mb-1">Rückwärtspeilungen</div>
				<div class="mono">A: {{ fmt( reverseBearingA ) }}°</div>
				<div class="mono">B: {{ fmt( reverseBearingB ) }}°</div>
				<div class="mono">Schnittwinkel: {{ fmt( intersectionAngleDeg ) }}°</div>
			</v-sheet>
		</v-col>
		<v-col cols="12" md="6">
			<v-sheet class="pa-3 rounded-lg" variant="outlined">
				<div class="text-caption text-medium-emphasis mb-1">Distanzcheck</div>
				<div class="mono">|XA|: {{ fmt( distToA ) }}</div>
				<div class="mono">|XB|: {{ fmt( distToB ) }}</div>
				<div class="mono">Residuum: {{ fmt( distanceResidual ) }}</div>
			</v-sheet>
		</v-col>
	</v-row>
</v-card>
</template>

<script setup>
import { computed, ref } from "vue";

const ax = ref( 2 );
const ay = ref( 7 );
const bx = ref( 15 );
const by = ref( 3 );
const bearingA = ref( 330 );
const bearingB = ref( 40 );
const distA = ref( 0 );
const distB = ref( 0 );
const epsilonDeg = ref( 4 );
const showDistanceCircles = ref( true );

const EPS = 1e-9;
const CANVAS = {
	w:   380,
	h:   280,
	pad: 20
};

function fmt( n, digits = 2 ) {
	if ( !Number.isFinite( n ) ) {
		return "n/a";
	}

	return Number( n.toFixed( digits ) ).toString();
}

function normDeg( deg ) {
	let out = deg % 360;

	if ( out < 0 ) {
		out += 360;
	}

	return out;
}

function degToRad( deg ) {
	return deg * Math.PI / 180;
}

function bearingToVec( bearingDeg ) {
	const r = degToRad( bearingDeg );
	return {
		x: Math.sin( r ),
		y: Math.cos( r )
	};
}

function cross2( a, b ) {
	return a.x * b.y - a.y * b.x;
}

function sub( a, b ) {
	return {
		x: a.x - b.x,
		y: a.y - b.y
	};
}

function add( a, b ) {
	return {
		x: a.x + b.x,
		y: a.y + b.y
	};
}

function mul( a, t ) {
	return {
		x: a.x * t,
		y: a.y * t
	};
}

function dist( a, b ) {
	return Math.hypot( a.x - b.x, a.y - b.y );
}

const landmarkA = computed( () => ( {
	x: Number( ax.value ),
	y: Number( ay.value )
} ) );

const landmarkB = computed( () => ( {
	x: Number( bx.value ),
	y: Number( by.value )
} ) );

const reverseBearingA = computed( () => normDeg( Number( bearingA.value ) + 180 ) );
const reverseBearingB = computed( () => normDeg( Number( bearingB.value ) + 180 ) );

const intersectionData = computed( () => {
	const p = landmarkA.value;
	const q = landmarkB.value;
	const r = bearingToVec( reverseBearingA.value );
	const s = bearingToVec( reverseBearingB.value );
	const denom = cross2( r, s );

	if ( Math.abs( denom ) < EPS ) {
		return {
			ok:    false,
			p,
			q,
			r,
			s,
			denom,
			t:     NaN,
			u:     NaN,
			point: null
		};
	}

	const qp = sub( q, p );
	const t = cross2( qp, s ) / denom;
	const u = cross2( qp, r ) / denom;
	const point = add( p, mul( r, t ) );

	return {
		ok: true,
		p,
		q,
		r,
		s,
		denom,
		t,
		u,
		point
	};
} );

const hasIntersection = computed( () => intersectionData.value.ok && Boolean( intersectionData.value.point ) );

const intersectionAngleDeg = computed( () => {
	const { r, s } = intersectionData.value;
	const dot = r.x * s.x + r.y * s.y;
	const clamped = Math.max( -1, Math.min( 1, dot ) );
	return Math.acos( clamped ) * 180 / Math.PI;
} );

const distToA = computed( () => {
	if ( !hasIntersection.value ) {
		return NaN;
	}

	return dist( intersectionData.value.point, landmarkA.value );
} );

const distToB = computed( () => {
	if ( !hasIntersection.value ) {
		return NaN;
	}

	return dist( intersectionData.value.point, landmarkB.value );
} );

const distanceResidual = computed( () => {
	if ( !hasIntersection.value ) {
		return NaN;
	}

	const useA = Number( distA.value ) > 0;
	const useB = Number( distB.value ) > 0;

	if ( !useA && !useB ) {
		return 0;
	}

	let res = 0;

	if ( useA ) {
		res += Math.abs( distToA.value - Number( distA.value ) );
	}

	if ( useB ) {
		res += Math.abs( distToB.value - Number( distB.value ) );
	}

	return res;
} );

const status = computed( () => {
	if ( !hasIntersection.value ) {
		return {
			type:    "error",
			message: "Die Linien sind nahezu parallel. Ändere mindestens eine Peilung."
		};
	}

	const gamma = intersectionAngleDeg.value;
	const t = intersectionData.value.t;
	const u = intersectionData.value.u;

	if ( gamma < 30 || gamma > 150 ) {
		return {
			type:    "warning",
			message: "Schnittwinkel ungünstig. Nutze möglichst 30 bis 150 Grad."
		};
	}

	if ( t < 0 || u < 0 ) {
		return {
			type:    "warning",
			message: "Der Schnitt liegt hinter mindestens einer Landmarke. Peilung prüfen."
		};
	}

	return {
		type:    "success",
		message: "Geometrie stabil genug. Standort X ist als primäre Schätzung nutzbar."
	};
} );

const texLines = computed( () => {
	return String.raw`\vec r_A(t)=\vec A+t` +
		String.raw`\binom{\sin ${fmt( reverseBearingA.value )}}{\cos ${fmt( reverseBearingA.value )}},\quad ` +
		String.raw`\vec r_B(u)=\vec B+u` +
		String.raw`\binom{\sin ${fmt( reverseBearingB.value )}}{\cos ${fmt( reverseBearingB.value )}}`;
} );

const texAngle = computed( () => {
	return String.raw`\gamma=\left|${fmt( intersectionAngleDeg.value )}^\circ\right|,\quad ` +
		String.raw`\varepsilon=\pm ${fmt( epsilonDeg.value )}^\circ`;
} );

const texPoint = computed( () => {
	if ( !hasIntersection.value ) {
		return String.raw`\text{Kein stabiler Schnittpunkt}`;
	}

	return String.raw`X\approx\left(` +
		`${fmt( intersectionData.value.point.x )},\ ${fmt( intersectionData.value.point.y )}` +
		String.raw`\right)`;
} );

const world = computed( () => {
	const points = [ landmarkA.value, landmarkB.value ];

	if ( hasIntersection.value ) {
		points.push( intersectionData.value.point );
	}

	let minX = Math.min( ...points.map( ( p ) => p.x ) );
	let maxX = Math.max( ...points.map( ( p ) => p.x ) );
	let minY = Math.min( ...points.map( ( p ) => p.y ) );
	let maxY = Math.max( ...points.map( ( p ) => p.y ) );
	const spanX = Math.max( 1, maxX - minX );
	const spanY = Math.max( 1, maxY - minY );
	const padUnits = 0.45 * Math.max( spanX, spanY );

	minX -= padUnits;
	maxX += padUnits;
	minY -= padUnits;
	maxY += padUnits;

	return {
		minX,
		maxX,
		minY,
		maxY,
		spanX: maxX - minX,
		spanY: maxY - minY
	};
} );

const view = computed( () => {
	const ww = world.value;
	const scale = Math.min( ( CANVAS.w - 2 * CANVAS.pad ) / ww.spanX,
		( CANVAS.h - 2 * CANVAS.pad ) / ww.spanY );
	const drawW = ww.spanX * scale;
	const drawH = ww.spanY * scale;
	const offsetX = ( CANVAS.w - drawW ) / 2;
	const offsetY = ( CANVAS.h - drawH ) / 2;

	return {
		scale,
		offsetX,
		offsetY
	};
} );

function mapPoint( p ) {
	const ww = world.value;
	const v = view.value;
	const x = v.offsetX + ( p.x - ww.minX ) * v.scale;
	const yNorm = v.offsetY + ( p.y - ww.minY ) * v.scale;

	return {
		x,
		y: CANVAS.h - yNorm
	};
}

function fullLineForBearing( origin, bearingDeg ) {
	const v = bearingToVec( bearingDeg );
	const span = Math.max( world.value.spanX, world.value.spanY );
	const len = span * 1.8;
	const p1 = add( origin, mul( v, -len ) );
	const p2 = add( origin, mul( v, len ) );
	const a = mapPoint( p1 );
	const b = mapPoint( p2 );

	return {
		x1: a.x,
		y1: a.y,
		x2: b.x,
		y2: b.y
	};
}

const rayA = computed( () => fullLineForBearing( landmarkA.value, reverseBearingA.value ) );
const rayB = computed( () => fullLineForBearing( landmarkB.value, reverseBearingB.value ) );

const coneLines = computed( () => {
	const e = Number( epsilonDeg.value );

	if ( e <= 0 ) {
		return [];
	}

	return [
		fullLineForBearing( landmarkA.value, reverseBearingA.value - e ),
		fullLineForBearing( landmarkA.value, reverseBearingA.value + e ),
		fullLineForBearing( landmarkB.value, reverseBearingB.value - e ),
		fullLineForBearing( landmarkB.value, reverseBearingB.value + e )
	];
} );

const pointA = computed( () => mapPoint( landmarkA.value ) );
const pointB = computed( () => mapPoint( landmarkB.value ) );
const pointX = computed( () => {
	if ( !hasIntersection.value ) {
		return {
			x: -100,
			y: -100
		};
	}

	return mapPoint( intersectionData.value.point );
} );
</script>

<style scoped>
.schnittCanvas {
	border-radius: 10px;
	overflow: hidden;
	border: 1px solid rgba(var(--v-theme-on-surface, 20, 20, 20), 0.12);
}

.lineA {
	stroke: rgba(59, 130, 246, 0.95);
	stroke-width: 2.5;
	stroke-dasharray: 6 4;
}

.lineB {
	stroke: rgba(236, 72, 153, 0.95);
	stroke-width: 2.5;
	stroke-dasharray: 6 4;
}

.coneLine {
	stroke: rgba(120, 120, 120, 0.55);
	stroke-width: 1.25;
}

.landmarkA {
	fill: rgb(37, 99, 235);
}

.landmarkB {
	fill: rgb(219, 39, 119);
}

.pointX {
	fill: rgb(16, 185, 129);
	stroke: rgba(0, 0, 0, 0.25);
	stroke-width: 1.5;
}

.circleA {
	fill: none;
	stroke: rgba(59, 130, 246, 0.5);
	stroke-width: 1.4;
}

.circleB {
	fill: none;
	stroke: rgba(236, 72, 153, 0.5);
	stroke-width: 1.4;
}

.label {
	fill: rgba(var(--v-theme-on-surface, 20, 20, 20), 0.9);
	font-size: 12px;
	font-weight: 700;
}
</style>
