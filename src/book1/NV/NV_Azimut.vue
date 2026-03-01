<template>
<v-card class="pa-4" rounded="xl">
	<h3 class="text-h6 mb-2">Azimut und Kursabweichung</h3>
	<p class="text-body-2 mb-4">
		Du gibst Kartenkurs, Deklination, Distanz und einen Winkel-Fehler ein.
		Der Rechner zeigt sofort, wie groß die seitliche Abweichung wird.
	</p>

	<v-row dense>
		<v-col cols="12" md="3">
			<v-text-field
				v-model.number="alphaKarte"
				label="Kartenkurs α_karte (Grad)"
				type="number"
			/>
		</v-col>
		<v-col cols="12" md="3">
			<v-text-field
				v-model.number="deklination"
				label="Deklination D (Grad)"
				type="number"
			/>
		</v-col>
		<v-col cols="12" md="3">
			<v-text-field
				v-model.number="distanceKm"
				label="Distanz d (km)"
				min="0.1"
				step="0.1"
				type="number"
			/>
		</v-col>
		<v-col cols="12" md="3">
			<v-text-field
				v-model.number="deltaAlpha"
				label="Kursfehler Δα (Grad)"
				type="number"
			/>
		</v-col>
	</v-row>

	<div class="kbox">
		<Katex as="div" display :tex="texMagCourse" />
		<Katex as="div" display :tex="texActualCourse" />
		<Katex as="div" display :tex="texLateral" />
	</div>

	<v-alert class="mt-2" :type="status.type" variant="tonal">
		{{ status.message }}
	</v-alert>

	<div class="azimutCanvas mt-3">
		<svg viewBox="0 0 380 280" xmlns="http://www.w3.org/2000/svg">
			<rect fill="rgba(255,255,255,0.05)"
				height="280"
				rx="10"
				width="380"
			/>

			<line class="planned"
				:x1="startPx.x"
				:x2="plannedPx.x"
				:y1="startPx.y"
				:y2="plannedPx.y"
			/>
			<line class="actual"
				:x1="startPx.x"
				:x2="actualPx.x"
				:y1="startPx.y"
				:y2="actualPx.y"
			/>
			<line class="errorLine"
				:x1="plannedPx.x"
				:x2="actualPx.x"
				:y1="plannedPx.y"
				:y2="actualPx.y"
			/>

			<circle class="startPoint"
				:cx="startPx.x"
				:cy="startPx.y"
				r="4.5"
			/>
			<circle class="plannedPoint"
				:cx="plannedPx.x"
				:cy="plannedPx.y"
				r="5"
			/>
			<circle class="actualPoint"
				:cx="actualPx.x"
				:cy="actualPx.y"
				r="5"
			/>

			<text class="label" :x="startPx.x + 6" :y="startPx.y - 8">Start</text>
			<text class="label" :x="plannedPx.x + 6" :y="plannedPx.y - 8">Plan</text>
			<text class="label" :x="actualPx.x + 6" :y="actualPx.y - 8">Ist</text>
		</svg>
	</div>

	<v-row class="mt-3" dense>
		<v-col cols="12" md="4">
			<v-sheet class="pa-3 rounded-lg" variant="outlined">
				<div class="text-caption text-medium-emphasis mb-1">Kurse</div>
				<div class="mono">α_karte: {{ fmt( alphaKarteNorm ) }}°</div>
				<div class="mono">α_mag: {{ fmt( alphaMag ) }}°</div>
				<div class="mono">α_ist: {{ fmt( alphaActual ) }}°</div>
			</v-sheet>
		</v-col>
		<v-col cols="12" md="4">
			<v-sheet class="pa-3 rounded-lg" variant="outlined">
				<div class="text-caption text-medium-emphasis mb-1">Abweichung</div>
				<div class="mono">seitlich e: {{ fmt( lateralErrorKm, 3 ) }} km</div>
				<div class="mono">Fehlerlinie: {{ fmt( endpointErrorKm, 3 ) }} km</div>
				<div class="mono">in Metern: {{ fmt( lateralErrorKm * 1000, 0 ) }} m</div>
			</v-sheet>
		</v-col>
		<v-col cols="12" md="4">
			<v-sheet class="pa-3 rounded-lg" variant="outlined">
				<div class="text-caption text-medium-emphasis mb-1">Merksatz</div>
				<div class="mono">e ~ d * sin(Delta alpha)</div>
				<div class="mono">Bei kleinen Winkeln:</div>
				<div class="mono">e ~ d * Delta alpha(rad)</div>
			</v-sheet>
		</v-col>
	</v-row>
</v-card>
</template>

<script setup>
import { computed, ref } from "vue";

const alphaKarte = ref( 68 );
const deklination = ref( 6 );
const distanceKm = ref( 3.5 );
const deltaAlpha = ref( 4 );

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

const safeDistanceKm = computed( () => Math.max( 0.05, Number( distanceKm.value ) || 0 ) );
const alphaKarteNorm = computed( () => normDeg( Number( alphaKarte.value ) || 0 ) );
const alphaMag = computed( () => normDeg( alphaKarteNorm.value - ( Number( deklination.value ) || 0 ) ) );
const alphaActual = computed( () => normDeg( alphaMag.value + ( Number( deltaAlpha.value ) || 0 ) ) );

const deltaRad = computed( () => degToRad( Number( deltaAlpha.value ) || 0 ) );
const lateralErrorKm = computed( () => Math.abs( safeDistanceKm.value * Math.sin( deltaRad.value ) ) );
const endpointErrorKm = computed( () => {
	return 2 * safeDistanceKm.value * Math.sin( Math.abs( deltaRad.value ) / 2 );
} );

const start = {
	x: 0,
	y: 0
};

const planned = computed( () => {
	const dir = bearingToVec( alphaMag.value );
	return {
		x: dir.x * safeDistanceKm.value,
		y: dir.y * safeDistanceKm.value
	};
} );

const actual = computed( () => {
	const dir = bearingToVec( alphaActual.value );
	return {
		x: dir.x * safeDistanceKm.value,
		y: dir.y * safeDistanceKm.value
	};
} );

const bounds = computed( () => {
	const points = [ start, planned.value, actual.value ];
	const minX = Math.min( ...points.map( ( p ) => p.x ) );
	const maxX = Math.max( ...points.map( ( p ) => p.x ) );
	const minY = Math.min( ...points.map( ( p ) => p.y ) );
	const maxY = Math.max( ...points.map( ( p ) => p.y ) );
	const span = Math.max(
		1, maxX - minX, maxY - minY
	);
	const padding = span * 0.45;

	return {
		minX: minX - padding,
		maxX: maxX + padding,
		minY: minY - padding,
		maxY: maxY + padding
	};
} );

const CANVAS = {
	w:   380,
	h:   280,
	pad: 18
};

function mapPoint( p ) {
	const b = bounds.value;
	const spanX = Math.max( 1e-6, b.maxX - b.minX );
	const spanY = Math.max( 1e-6, b.maxY - b.minY );
	const scale = Math.min( ( CANVAS.w - 2 * CANVAS.pad ) / spanX,
		( CANVAS.h - 2 * CANVAS.pad ) / spanY );
	const drawW = spanX * scale;
	const drawH = spanY * scale;
	const offX = ( CANVAS.w - drawW ) / 2;
	const offY = ( CANVAS.h - drawH ) / 2;
	const x = offX + ( p.x - b.minX ) * scale;
	const yNorm = offY + ( p.y - b.minY ) * scale;

	return {
		x,
		y: CANVAS.h - yNorm
	};
}

const startPx = computed( () => mapPoint( start ) );
const plannedPx = computed( () => mapPoint( planned.value ) );
const actualPx = computed( () => mapPoint( actual.value ) );

const status = computed( () => {
	if ( lateralErrorKm.value < 0.02 ) {
		return {
			type:    "success",
			message: "Sehr kleine Kursabweichung. Bei dieser Distanz bleibt der Fehler gering."
		};
	}

	if ( lateralErrorKm.value < 0.1 ) {
		return {
			type:    "info",
			message: "Moderate Abweichung. Mit Zwischenzielen kannst du das gut korrigieren."
		};
	}

	return {
		type:    "warning",
		message: "Deutliche seitliche Abweichung. Kürzere Teilabschnitte und häufiges Nachpeilen empfohlen."
	};
} );

const texMagCourse = computed( () => {
	return String.raw`\alpha_{\text{mag}}=\alpha_{\text{karte}}-D=` +
		`${fmt( alphaKarteNorm.value )}^\circ-` +
		`${fmt( Number( deklination.value ) || 0 )}^\circ=` +
		`${fmt( alphaMag.value )}^\circ`;
} );

const texActualCourse = computed( () => {
	return String.raw`\alpha_{\text{ist}}=\alpha_{\text{mag}}+\Delta\alpha=` +
		`${fmt( alphaMag.value )}^\circ+` +
		`${fmt( Number( deltaAlpha.value ) || 0 )}^\circ=` +
		`${fmt( alphaActual.value )}^\circ`;
} );

const texLateral = computed( () => {
	return String.raw`e\approx d\sin(\Delta\alpha)=` +
		`${fmt( safeDistanceKm.value, 3 )}\cdot` +
		String.raw`\sin(${fmt( Number( deltaAlpha.value ) || 0 )}^\circ)\approx ` +
		`${fmt( lateralErrorKm.value, 3 )}\\ \text{km}`;
} );
</script>

<style scoped>
.azimutCanvas {
	border-radius: 10px;
	overflow: hidden;
	border: 1px solid rgba(var(--v-theme-on-surface, 20, 20, 20), 0.12);
}

.planned {
	stroke: rgba(59, 130, 246, 0.95);
	stroke-width: 3;
}

.actual {
	stroke: rgba(236, 72, 153, 0.95);
	stroke-width: 3;
	stroke-dasharray: 8 4;
}

.errorLine {
	stroke: rgba(234, 179, 8, 0.95);
	stroke-width: 2;
}

.startPoint {
	fill: rgba(var(--v-theme-on-surface, 20, 20, 20), 0.95);
}

.plannedPoint {
	fill: rgb(37, 99, 235);
}

.actualPoint {
	fill: rgb(219, 39, 119);
}

.label {
	fill: rgba(var(--v-theme-on-surface, 20, 20, 20), 0.9);
	font-size: 12px;
	font-weight: 700;
}
</style>
