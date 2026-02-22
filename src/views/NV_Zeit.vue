<template>
<v-card class="pa-4" rounded="xl">
	<h3 class="text-h6 mb-2">Zeitabschätzung: Naismith vs. Tobler</h3>
	<p class="text-body-2 mb-4">
		Lege deine Route als Segmente an. Der Rechner vergleicht pro Segment zwei Modelle
		und liefert Gesamtzeit plus Reserven.
	</p>

	<v-row align="center" dense>
		<v-col cols="12" md="6">
			<div class="text-caption mb-1">Geländefaktor (1.0 = neutral)</div>
			<v-slider
				v-model="terrainFactor"
				color="primary"
				:max="1.8"
				:min="0.8"
				step="0.05"
			>
				<template #append>
					<v-chip size="small" variant="tonal">{{ fmt( terrainFactor ) }}</v-chip>
				</template>
			</v-slider>
		</v-col>
		<v-col class="d-flex justify-end ga-2" cols="12" md="6">
			<v-btn color="primary" variant="flat" @click="addSegment">Segment +</v-btn>
			<v-btn variant="tonal" @click="resetSegments">Reset</v-btn>
		</v-col>
	</v-row>

	<v-table class="mt-2" density="compact">
		<thead>
			<tr>
				<th>#</th>
				<th>Distanz [km]</th>
				<th>Aufstieg [m]</th>
				<th>Steigung s</th>
				<th>Naismith [h]</th>
				<th>Tobler [h]</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(seg, idx) in segments"
				:key="seg.id"
			>
				<td class="mono">{{ idx + 1 }}</td>
				<td style="min-width: 132px;">
					<v-text-field
						v-model.number="seg.distanceKm"
						density="compact"
						hide-details
						min="0.1"
						step="0.1"
						type="number"
					/>
				</td>
				<td style="min-width: 132px;">
					<v-text-field
						v-model.number="seg.ascentM"
						density="compact"
						hide-details
						step="10"
						type="number"
					/>
				</td>
				<td class="mono">{{ fmt( segmentRows[ idx ].slope, 3 ) }}</td>
				<td class="mono">{{ fmt( segmentRows[ idx ].naismithH, 2 ) }}</td>
				<td class="mono">{{ fmt( segmentRows[ idx ].toblerH, 2 ) }}</td>
				<td>
					<v-btn
						color="error"
						:disabled="segments.length <= 1"
						icon="$delete"
						size="small"
						variant="text"
						@click="removeSegment( seg.id )"
					/>
				</td>
			</tr>
		</tbody>
	</v-table>

	<div class="kbox mt-3">
		<Katex as="div" display tex="t_{\text{Naismith}}=\frac{d_{km}}{5}+\frac{\max(0,h_{\text{auf}})}{600}" />
		<Katex as="div" display tex="v_{\text{Tobler}}=6e^{-3.5|s+0.05|},\quad s=\frac{\Delta h}{\Delta x}" />
		<Katex as="div" display :tex="texTotals" />
	</div>

	<v-row class="mt-2" dense>
		<v-col cols="12" md="4">
			<v-sheet class="pa-3 rounded-lg" variant="outlined">
				<div class="text-caption text-medium-emphasis mb-1">Summen</div>
				<div class="mono">Distanz: {{ fmt( totalDistanceKm, 2 ) }} km</div>
				<div class="mono">Aufstieg: {{ fmt( totalAscentM, 0 ) }} m</div>
				<div class="mono">Segmente: {{ segments.length }}</div>
			</v-sheet>
		</v-col>
		<v-col cols="12" md="4">
			<v-sheet class="pa-3 rounded-lg" variant="outlined">
				<div class="text-caption text-medium-emphasis mb-1">Zeitmodell</div>
				<div class="mono">Naismith: {{ fmt( totalNaismithH, 2 ) }} h</div>
				<div class="mono">Tobler: {{ fmt( totalToblerH, 2 ) }} h</div>
				<div class="mono">Differenz: {{ fmt( totalToblerH - totalNaismithH, 2 ) }} h</div>
			</v-sheet>
		</v-col>
		<v-col cols="12" md="4">
			<v-sheet class="pa-3 rounded-lg" variant="outlined">
				<div class="text-caption text-medium-emphasis mb-1">Empfehlung</div>
				<div class="mono">Planzeit: {{ fmt( planTimeH, 2 ) }} h</div>
				<div class="mono">Reserve (15%): {{ fmt( reserveH, 2 ) }} h</div>
				<div class="mono">Soll total: {{ fmt( planWithReserveH, 2 ) }} h</div>
			</v-sheet>
		</v-col>
	</v-row>

	<v-alert class="mt-3" :type="status.type" variant="tonal">
		{{ status.message }}
	</v-alert>
</v-card>
</template>

<script setup>
import { computed, ref } from "vue";

const terrainFactor = ref( 1 );
const segments = ref( [
	{
		id:         1,
		distanceKm: 2.6,
		ascentM:    190
	},
	{
		id:         2,
		distanceKm: 1.9,
		ascentM:    -60
	},
	{
		id:         3,
		distanceKm: 3.4,
		ascentM:    230
	}
] );

let nextId = 4;

function fmt( n, digits = 2 ) {
	if ( !Number.isFinite( n ) ) {
		return "n/a";
	}

	return Number( n.toFixed( digits ) ).toString();
}

function safeNumber( value, fallback = 0 ) {
	const out = Number( value );
	return Number.isFinite( out ) ? out : fallback;
}

function rowCalc( row ) {
	const d = Math.max( 0.05, safeNumber( row.distanceKm, 0 ) );
	const h = safeNumber( row.ascentM, 0 );
	const slope = h / ( d * 1000 );
	const naismith = d / 5 + Math.max( 0, h ) / 600;
	const speed = 6 * Math.exp( -3.5 * Math.abs( slope + 0.05 ) );
	const tobler = d / Math.max( 0.2, speed );

	return {
		distanceKm: d,
		ascentM:    h,
		slope,
		naismithH:  naismith,
		toblerH:    tobler
	};
}

const segmentRows = computed( () => segments.value.map( rowCalc ) );

const totalDistanceKm = computed( () => segmentRows.value.reduce( ( sum, row ) => sum + row.distanceKm, 0 ) );
const totalAscentM = computed( () => segmentRows.value.reduce( ( sum, row ) => sum + Math.max( 0, row.ascentM ), 0 ) );
const totalNaismithH = computed( () => {
	const base = segmentRows.value.reduce( ( sum, row ) => sum + row.naismithH, 0 );
	return base * safeNumber( terrainFactor.value, 1 );
} );
const totalToblerH = computed( () => {
	const base = segmentRows.value.reduce( ( sum, row ) => sum + row.toblerH, 0 );
	return base * safeNumber( terrainFactor.value, 1 );
} );

const planTimeH = computed( () => Math.max( totalNaismithH.value, totalToblerH.value ) );
const reserveH = computed( () => planTimeH.value * 0.15 );
const planWithReserveH = computed( () => planTimeH.value + reserveH.value );

const texTotals = computed( () => {
	return String.raw`t_{\text{Plan}}=\max\left(${fmt( totalNaismithH.value )},${fmt( totalToblerH.value )}\right)=` +
		`${fmt( planTimeH.value )}\,\text{h}`;
} );

const status = computed( () => {
	if ( planWithReserveH.value < 2 ) {
		return {
			type:    "success",
			message: "Kurzstrecke. Dennoch immer mit Reserve starten."
		};
	}

	if ( planWithReserveH.value < 5 ) {
		return {
			type:    "info",
			message: "Mittlere Tour. Checkpunkte und Zeitkontrolle je Segment sinnvoll."
		};
	}

	return {
		type:    "warning",
		message: "Lange Route. Frühe Umkehrschwelle und klare Notfalloption setzen."
	};
} );

function addSegment() {
	segments.value.push( {
		id:         nextId++,
		distanceKm: 1.8,
		ascentM:    120
	} );
}

function removeSegment( segmentId ) {
	segments.value = segments.value.filter( ( seg ) => seg.id !== segmentId );
}

function resetSegments() {
	terrainFactor.value = 1;
	segments.value = [
		{
			id:         1,
			distanceKm: 2.6,
			ascentM:    190
		},
		{
			id:         2,
			distanceKm: 1.9,
			ascentM:    -60
		},
		{
			id:         3,
			distanceKm: 3.4,
			ascentM:    230
		}
	];
	nextId = 4;
}
</script>
