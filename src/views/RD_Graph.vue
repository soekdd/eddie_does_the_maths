<!-- JeepProblemDiagram.vue
     Vue 3 + Vuetify 3, Single-File-Component

     Visualisiert (idealisiert / kontinuierliches Depot-Modell) die Varianten:
     1) One-way (maximale Reichweite)
     2) Hin & zurück (max. Entfernung, wenn am Ende wieder Start erreicht werden soll)
     3) Lieferung (Wie viel Starttreibstoff braucht man, um am Ziel noch Q zu haben?)

     Diagramm:
     X = Entfernung ab Start (km)
     Y = Zeit (h), wächst nach unten (Sequenzdiagramm-Style)
     Pfad = Zick-Zack-Linien (Pendelfahrten pro Phase)
-->
<template>
<section>
	<v-row class="rdg-layout" dense>
		<v-col cols="12" md="4">
			<v-card class="pa-3" variant="tonal">
				<div class="text-h6 mb-3">Jeep-Problem – interaktiv</div>

				<v-select
					v-model="variant"
					class="mb-2"
					density="comfortable"
					item-title="title"
					item-value="value"
					:items="variantItems"
					label="Variante"
				/>

				<v-divider class="my-2" />

				<div class="text-subtitle-2 mb-2">Fahrzeug & Einheiten</div>

				<v-text-field
					v-model.number="tankCapacityL"
					class="mb-2"
					density="comfortable"
					label="Tankkapazität (Liter)"
					min="0.0001"
					step="1"
					type="number"
				/>

				<v-text-field
					v-model.number="consumptionLperKm"
					class="mb-2"
					density="comfortable"
					hint="z.B. 0.12 = 12L/100km"
					label="Verbrauch (Liter / km)"
					min="0.000001"
					persistent-hint
					step="0.001"
					type="number"
				/>

				<v-text-field
					v-model.number="speedKmH"
					class="mb-2"
					density="comfortable"
					label="Geschwindigkeit (km/h) – nur für Y-Achse"
					min="0.0001"
					step="1"
					type="number"
				/>

				<v-divider class="my-2" />

				<div v-if="variant !== 'deliver'" class="text-subtitle-2 mb-2">Starttreibstoff</div>

				<v-text-field
					v-if="variant !== 'deliver'"
					v-model.number="startFuelL"
					class="mb-2"
					density="comfortable"
					label="Gesamt-Treibstoff am Start (Liter)"
					min="0"
					step="1"
					type="number"
				/>

				<template v-else>
					<div class="text-subtitle-2 mb-2">Lieferproblem</div>

					<v-text-field
						v-model.number="targetDistanceKm"
						class="mb-2"
						density="comfortable"
						label="Zielentfernung (km)"
						min="0"
						step="1"
						type="number"
					/>

					<v-text-field
						v-model.number="deliveredFuelL"
						class="mb-2"
						density="comfortable"
						label="Treibstoff am Ziel (Liter)"
						min="0"
						step="1"
						type="number"
					/>
				</template>

				<v-divider class="my-2" />

				<div class="text-subtitle-2 mb-2">Visualisierung</div>

				<v-switch
					v-model="showGrid"
					class="mb-1"
					density="comfortable"
					label="Raster anzeigen"
				/>
				<v-switch
					v-model="showPhaseMarkers"
					class="mb-2"
					density="comfortable"
					label="Phasenmarken anzeigen"
				/>

				<!-- <v-slider
					v-model="maxPolylinePoints"
					density="comfortable"
					label="Max. Punkte (Performance)"
					:max="3000"
					:min="200"
					:step="100"
					thumb-label
				/> -->

				<v-alert
					v-if="warning"
					class="mt-3"
					density="comfortable"
					type="warning"
					variant="tonal"
				>
					{{ warning }}
				</v-alert>
			</v-card>
			<v-divider class="my-3" />
			<div class="text-caption text-medium-emphasis">
				Modellannahme: Treibstoff ist kontinuierlich teilbar, Umfüllen/Depots sind verlustfrei,
				und “optimal” wird hier über das klassische Phasen-Modell (harmonische Summen) angenähert.
				Für Kanister/Integer-Restriktionen oder Depot-Limits müsste man extra Regeln ergänzen.
			</div>
		</v-col>

		<v-col class="graph-col d-flex" cols="12" md="8">
			<v-card class="pa-3 graph-card">
				<div class="d-flex align-center justify-space-between flex-wrap ga-3">
					<div>
						<div class="text-h6">Fahrten (X = Entfernung, Y = Zeit)</div>
						<div class="text-caption text-medium-emphasis">
							Y wächst nach unten wie in einem Sequenzdiagramm.
						</div>
					</div>

					<div class="text-caption text-right">
						<div v-if="variant !== 'deliver'">
							<b>Max. Entfernung:</b> {{ fmtKm(result.maxDistanceKm) }}
							<span v-if="variant === 'roundtrip'"> (und zurück)</span>
						</div>
						<div v-else>
							<b>Benötigter Starttreibstoff:</b> {{ fmtL(result.requiredStartFuelL) }}
						</div>
						<div>
							<b>Gesamtfahrzeit:</b> {{ fmtH(result.totalTimeH) }}
							&nbsp;·&nbsp;
							<b>Gesamtfahrstrecke:</b> {{ fmtKm(result.totalTravelKm) }}
						</div>
					</div>
				</div>

				<div class="max90 svg-wrap mt-3">
					<svg
						aria-label="Jeep-Fahrten Diagramm"
						class="max90"
						preserveAspectRatio="xMidYMid meet"
						role="img"
						:viewBox="`0 0 ${svgW} ${svgH}`"
						xmlns="http://www.w3.org/2000/svg"
					>
						<!-- Hintergrund -->
						<rect fill="transparent"
							:height="svgH"
							:width="svgW"
							x="0"
							y="0"
						/>

						<!-- Grid -->
						<g v-if="showGrid" opacity="0.35">
							<g v-for="x in gridXTicks" :key="'gx' + x">
								<line
									stroke="currentColor"
									stroke-width="1"
									vector-effect="non-scaling-stroke"
									:x1="mapX(x)"
									:x2="mapX(x)"
									:y1="plotTop"
									:y2="plotBottom"
								/>
							</g>

							<g v-for="t in gridYTicks" :key="'gy' + t">
								<line
									stroke="currentColor"
									stroke-width="1"
									vector-effect="non-scaling-stroke"
									:x1="plotLeft"
									:x2="plotRight"
									:y1="mapY(t)"
									:y2="mapY(t)"
								/>
							</g>
						</g>

						<!-- Achsen -->
						<g opacity="0.9">
							<line
								stroke="currentColor"
								stroke-width="2"
								vector-effect="non-scaling-stroke"
								:x1="plotLeft"
								:x2="plotLeft"
								:y1="plotTop"
								:y2="plotBottom"
							/>
							<line
								stroke="currentColor"
								stroke-width="2"
								vector-effect="non-scaling-stroke"
								:x1="plotLeft"
								:x2="plotRight"
								:y1="plotTop"
								:y2="plotTop"
							/>
							<text
								fill="currentColor"
								font-size="12"
								:x="plotLeft"
								:y="plotTop - 10"
							>
								Zeit (h) ↓
							</text>
							<text
								fill="currentColor"
								font-size="12"
								:x="plotRight - 140"
								:y="plotTop - 10"
							>
								Entfernung (km) →
							</text>
						</g>

						<!-- Tick Labels -->
						<g opacity="0.9">
							<g v-for="x in labelXTicks" :key="'lx' + x">
								<text
									fill="currentColor"
									font-size="11"
									text-anchor="middle"
									:x="mapX(x)"
									:y="plotTop - 6"
								>
									{{ Math.round(x) }}
								</text>
							</g>

							<g v-for="t in labelYTicks" :key="'ly' + t">
								<text
									fill="currentColor"
									font-size="11"
									text-anchor="end"
									:x="plotLeft - 8"
									:y="mapY(t) + 4"
								>
									{{ round1(t) }}
								</text>
							</g>
						</g>

						<!-- Phasenmarken -->
						<g v-if="showPhaseMarkers" opacity="0.9">
							<g v-for="x in phaseMarkersKm" :key="'pm' + x">
								<line
									opacity="0.5"
									stroke="currentColor"
									stroke-dasharray="4 4"
									stroke-width="2"
									vector-effect="non-scaling-stroke"
									:x1="mapX(x)"
									:x2="mapX(x)"
									:y1="plotTop"
									:y2="plotBottom"
								/>
							</g>
						</g>

						<!-- Pfad -->
						<polyline
							v-if="polylinePointsAttr"
							fill="none"
							opacity="0.95"
							:points="polylinePointsAttr"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2.5"
							vector-effect="non-scaling-stroke"
						/>

						<!-- Start/End Punkte -->
						<g v-if="pathPoints.length >= 1" opacity="0.95">
							<circle
								:cx="mapX(pathPoints[0].xKm)"
								:cy="mapY(pathPoints[0].tH)"
								fill="currentColor"
								r="4"
							/>
							<circle
								:cx="mapX(pathPoints[pathPoints.length - 1].xKm)"
								:cy="mapY(pathPoints[pathPoints.length - 1].tH)"
								fill="currentColor"
								r="4"
							/>
						</g>
					</svg>
				</div>
			</v-card>
		</v-col>
	</v-row>
</section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

type Variant = "oneway" | "roundtrip" | "deliver";

type Phase = {
  k: number; // "aktive Tankladungen" (idealisiert)
  f0: number; // Start-Fuel (in Tank-Einheiten)
  f1: number; // End-Fuel   (in Tank-Einheiten)
  rate: number; // Verbrauchsfaktor pro Distanz (idealisiert)
  lengthNorm: number; // Distanz (normiert, Tank=1, Verbrauch=1)
};

type PathPoint = { xKm: number; tH: number };

const variant = ref<Variant>( "oneway" );
const variantItems = [
	{ title: "1) One-way: maximale Reichweite", value: "oneway" },
	{ title: "2) Hin & zurück: maximale Entfernung", value: "roundtrip" },
	{ title: "3) Lieferung: Startfuel für Ziel + Rest", value: "deliver" }
];

// Eingaben
const tankCapacityL = ref( 60 );
const consumptionLperKm = ref( 0.12 );
const speedKmH = ref( 50 );

const startFuelL = ref( 300 );

const targetDistanceKm = ref( 300 );
const deliveredFuelL = ref( 60 );

// Visual
const showGrid = ref( true );
const showPhaseMarkers = ref( true );
const maxPolylinePoints = ref( 1600 );

// SVG Layout
const svgW = 500;
const svgH = 920;

const marginLeft = 70;
const marginRight = 30;
const marginTop = 10;
const marginBottom = 5;

const plotLeft = marginLeft;
const plotRight = svgW - marginRight;
const plotTop = marginTop;
const plotBottom = svgH - marginBottom;

// ---- Helpers ----
const EPS = 1e-12;

function clampNonNeg( n: number ) {
	return Number.isFinite( n ) ? Math.max( 0, n ) : 0;
}

function round1( n: number ) {
	return Math.round( n * 10 ) / 10;
}

function fmtKm( km: number ) {
	if ( !Number.isFinite( km ) ) {
		return "—";
	}

	if ( km >= 100 ) {
		return `${Math.round( km )} km`;
	}

	if ( km >= 10 ) {
		return `${round1( km )} km`;
	}

	return `${Math.round( km * 10 ) / 10} km`;
}

function fmtH( h: number ) {
	if ( !Number.isFinite( h ) ) {
		return "—";
	}

	if ( h >= 10 ) {
		return `${round1( h )} h`;
	}

	return `${Math.round( h * 60 )} min`;
}

function fmtL( l: number ) {
	if ( !Number.isFinite( l ) ) {
		return "—";
	}

	return `${Math.round( l )} L`;
}

/**
 * Normiertes Phasenmodell:
 *  - Tankkapazität = 1
 *  - Verbrauch = 1 pro Distanz
 *
 * one-way: rate = (2k-1)
 * roundtrip (max. Entfernung mit Rückkehr): rate = (2k)
 *
 * Phase läuft von f0 -> f1, wobei f1 = max(endFuel, k-1).
 */
function buildPhases(
	startFuelUnits: number, endFuelUnits: number, mode: "oneway" | "roundtrip"
): Phase[] {
	const phases: Phase[] = [];
	let f = startFuelUnits;
	const endF = endFuelUnits;

	if ( !( f > endF + EPS ) ) {
		return phases;
	}

	// Sicherheitsbremse
	let guard = 0;

	while ( f > endF + EPS && guard++ < 5000 ) {
		// ceil(f) mit leichter Korrektur, damit ganzzahlige Werte stabil sind:
		const k = Math.ceil( f - 1e-9 );
		const rate = mode === "oneway" ? 2 * k - 1 : 2 * k;

		const f1 = Math.max( endF, k - 1 );
		const df = f - f1;
		const lengthNorm = df / rate;

		phases.push( {
			k, f0: f, f1, rate, lengthNorm
		} );
		f = f1;
	}

	return phases;
}

function distNormFor(
	startFuelUnits: number, endFuelUnits: number, mode: "oneway" | "roundtrip"
) {
	return buildPhases(
		startFuelUnits, endFuelUnits, mode
	).reduce( ( a, p ) => a + p.lengthNorm, 0 );
}

/**
 * Liefervariante: finde minimalen Startfuel (in Tank-Einheiten),
 * so dass DistanzNorm(start -> end=q) = targetDistNorm.
 * Monoton -> Binärsuche.
 */
function solveStartFuelUnitsForDelivery( targetDistNorm: number, endFuelUnits: number ): number {
	const q = endFuelUnits;
	const d = Math.max( 0, targetDistNorm );

	let lo = q;
	let hi = Math.max( q + 1, q + d * 2 + 2 );

	let guard = 0;

	while ( distNormFor(
		hi, q, "oneway"
	) < d && guard++ < 60 ) {
		hi *= 2;

		if ( hi > 1e9 ) {
			break;
		}
	}

	// Binärsuche
	for ( let i = 0; i < 80; i++ ) {
		const mid = ( lo + hi ) / 2;
		const dm = distNormFor(
			mid, q, "oneway"
		);

		if ( dm >= d ) {
			hi = mid;
		} else {
			lo = mid;
		}
	}

	return hi;
}

/**
 * Erzeuge den “Zick-Zack”-Pfad:
 * Pro Phase pendelt der Jeep (2k-1) mal zwischen x und x+L (L = Phasenlänge),
 * endet vorne -> nächste Phase beginnt dort.
 *
 * Für roundtrip: am Ende wird ein “finaler Rückweg” (ein Segment) ergänzt,
 * um wieder auf x=0 zu landen (das entspricht der zusätzlichen Traversierung,
 * die im 2k-Phasenmodell gegenüber (2k-1) “fehlt”).
 */
function buildPathFromPhases(
	phases: Phase[],
	kmPerTankNormUnit: number,
	speed: number,
	doFinalReturn: boolean
): PathPoint[] {
	const pts: PathPoint[] = [];

	let baseXKm = 0;
	let curXKm = 0;
	let tH = 0;

	pts.push( { xKm: curXKm, tH } );

	for ( const ph of phases ) {
		const Lkm = ph.lengthNorm * kmPerTankNormUnit;
		const segCount = Math.max( 1, 2 * ph.k - 1 );

		// Pendel zwischen baseX und baseX+L
		const left = baseXKm;
		const right = baseXKm + Lkm;

		for ( let s = 0; s < segCount; s++ ) {
			const targetX = s % 2 === 0 ? right : left;
			const dist = Math.abs( targetX - curXKm );
			tH += dist / speed;
			curXKm = targetX;
			pts.push( { xKm: curXKm, tH } );
		}

		// Jetzt sind wir vorne (right), und die nächste Phase startet dort.
		baseXKm = right;
	}

	if ( doFinalReturn && curXKm > 0 ) {
		// final zurück nach 0 (ein “glatter” Rückweg)
		const dist = curXKm;
		tH += dist / speed;
		curXKm = 0;
		pts.push( { xKm: curXKm, tH } );
	}

	return pts;
}

// ---- Ergebnisberechnung ----
const warning = computed( () => {
	if ( !( tankCapacityL.value > 0 ) || !( consumptionLperKm.value > 0 ) || !( speedKmH.value > 0 ) ) {
		return "Tankkapazität, Verbrauch und Geschwindigkeit müssen > 0 sein.";
	}

	if ( variant.value !== "deliver" && startFuelL.value < 0 ) {
		return "Starttreibstoff darf nicht negativ sein.";
	}

	if ( variant.value === "deliver" ) {
		if ( targetDistanceKm.value < 0 ) {
			return "Zielentfernung darf nicht negativ sein.";
		}

		if ( deliveredFuelL.value < 0 ) {
			return "Liefermenge darf nicht negativ sein.";
		}
	}

	return "";
} );

const result = computed( () => {
	const C = tankCapacityL.value;
	const r = consumptionLperKm.value;
	const v = speedKmH.value;

	const kmPerTank = C / r; // wie weit komme ich mit einem vollen Tank (ohne Depot-Tricks)
	const safeKmPerTank = Number.isFinite( kmPerTank ) && kmPerTank > 0 ? kmPerTank : 0;

	if ( warning.value ) {
		return {
			maxDistanceKm:      0,
			requiredStartFuelL: 0,
			totalTimeH:         0,
			totalTravelKm:      0,
			phases:             [] as Phase[],
			phaseMarkersKm:     [] as number[],
			path:               [] as PathPoint[]
		};
	}

	if ( variant.value === "deliver" ) {
		const qUnits = clampNonNeg( deliveredFuelL.value ) / C;
		const targetDistNorm = clampNonNeg( targetDistanceKm.value ) / safeKmPerTank;

		const startUnits = solveStartFuelUnitsForDelivery( targetDistNorm, qUnits );
		const phases = buildPhases(
			startUnits, qUnits, "oneway"
		);

		const maxDistKm = phases.reduce( ( a, p ) => a + p.lengthNorm, 0 ) * safeKmPerTank;

		const markers = [];
		let cum = 0;

		for ( const p of phases ) {
			cum += p.lengthNorm * safeKmPerTank;
			markers.push( cum );
		}

		const path = buildPathFromPhases(
			phases, safeKmPerTank, v, false
		);
		const totalTimeH = path.length ? path[ path.length - 1 ].tH : 0;

		// totale Fahrstrecke aus Pfad (Summe |dx|)
		let totalTravelKm = 0;

		for ( let i = 1; i < path.length; i++ ) {
			totalTravelKm += Math.abs( path[ i ].xKm - path[ i - 1 ].xKm );
		}

		return {
			maxDistanceKm:      maxDistKm,
			requiredStartFuelL: startUnits * C,
			totalTimeH,
			totalTravelKm,
			phases,
			phaseMarkersKm:     markers,
			path
		};
	}

	// Varianten 1 und 2
	const startUnits = clampNonNeg( startFuelL.value ) / C;

	if ( variant.value === "oneway" ) {
		const phases = buildPhases(
			startUnits, 0, "oneway"
		);
		const maxDistKm = phases.reduce( ( a, p ) => a + p.lengthNorm, 0 ) * safeKmPerTank;

		const markers = [];
		let cum = 0;

		for ( const p of phases ) {
			cum += p.lengthNorm * safeKmPerTank;
			markers.push( cum );
		}

		const path = buildPathFromPhases(
			phases, safeKmPerTank, v, false
		);
		const totalTimeH = path.length ? path[ path.length - 1 ].tH : 0;

		let totalTravelKm = 0;

		for ( let i = 1; i < path.length; i++ ) {
			totalTravelKm += Math.abs( path[ i ].xKm - path[ i - 1 ].xKm );
		}

		return {
			maxDistanceKm:      maxDistKm,
			requiredStartFuelL: 0,
			totalTimeH,
			totalTravelKm,
			phases,
			phaseMarkersKm:     markers,
			path
		};
	}

	// roundtrip: max. Entfernung (hin), wenn am Ende wieder Start erreicht werden soll
	const phases = buildPhases(
		startUnits, 0, "roundtrip"
	);
	const maxDistKm = phases.reduce( ( a, p ) => a + p.lengthNorm, 0 ) * safeKmPerTank;

	const markers = [];
	let cum = 0;

	for ( const p of phases ) {
		cum += p.lengthNorm * safeKmPerTank;
		markers.push( cum );
	}

	// Outward-Zickzack (2k-1 pro Phase) + finaler Rückweg
	const path = buildPathFromPhases(
		phases, safeKmPerTank, v, true
	);
	const totalTimeH = path.length ? path[ path.length - 1 ].tH : 0;

	let totalTravelKm = 0;

	for ( let i = 1; i < path.length; i++ ) {
		totalTravelKm += Math.abs( path[ i ].xKm - path[ i - 1 ].xKm );
	}

	return {
		maxDistanceKm:      maxDistKm,
		requiredStartFuelL: 0,
		totalTimeH,
		totalTravelKm,
		phases,
		phaseMarkersKm:     markers,
		path
	};
} );

// ---- Pfad + Downsampling für SVG ----
const phaseMarkersKm = computed( () => result.value.phaseMarkersKm );

const pathPoints = computed<PathPoint[]>( () => {
	const pts = result.value.path;

	if ( pts.length <= maxPolylinePoints.value ) {
		return pts;
	}

	// simple downsample: n-tes Element + letztes
	const step = Math.ceil( pts.length / maxPolylinePoints.value );
	const sampled: PathPoint[] = [];

	for ( let i = 0; i < pts.length; i += step ) {
		sampled.push( pts[ i ] );
	}

	if ( sampled[ sampled.length - 1 ] !== pts[ pts.length - 1 ] ) {
		sampled.push( pts[ pts.length - 1 ] );
	}

	return sampled;
} );

// ---- Skalierung + Mapping in SVG ----
const maxXKm = computed( () => Math.max( 1, result.value.maxDistanceKm || 1 ) );
const maxTimeH = computed( () => {
	const pts = pathPoints.value;
	return Math.max( 1e-6, pts.length ? pts[ pts.length - 1 ].tH : 1e-6 );
} );

function mapX( xKm: number ) {
	const span = plotRight - plotLeft;
	return plotLeft + xKm / maxXKm.value * span;
}

function mapY( tH: number ) {
	const span = plotBottom - plotTop;
	return plotTop + tH / maxTimeH.value * span;
}

const polylinePointsAttr = computed( () => {
	const pts = pathPoints.value;

	if ( pts.length < 2 ) {
		return "";
	}

	return pts.map( p => `${mapX( p.xKm ).toFixed( 2 )},${mapY( p.tH ).toFixed( 2 )}` ).join( " " );
} );

// ---- Ticks / Grid ----
function niceStep( maxVal: number, targetTicks: number ) {
	const raw = maxVal / Math.max( 1, targetTicks );
	const pow = Math.pow( 10, Math.floor( Math.log10( raw ) ) );
	const scaled = raw / pow;

	let nice = 1;

	if ( scaled <= 1 ) {
		nice = 1;
	} else if ( scaled <= 2 ) {
		nice = 2;
	} else if ( scaled <= 5 ) {
		nice = 5;
	} else {
		nice = 10;
	}

	return nice * pow;
}

const gridXTicks = computed( () => {
	const step = niceStep( maxXKm.value, 12 );
	const ticks: number[] = [];

	for ( let x = 0; x <= maxXKm.value + EPS; x += step ) {
		ticks.push( x );
	}

	return ticks;
} );
const gridYTicks = computed( () => {
	const step = niceStep( maxTimeH.value, 12 );
	const ticks: number[] = [];

	for ( let t = 0; t <= maxTimeH.value + EPS; t += step ) {
		ticks.push( t );
	}

	return ticks;
} );

const labelXTicks = computed( () => {
	const step = niceStep( maxXKm.value, 6 );
	const ticks: number[] = [];

	for ( let x = 0; x <= maxXKm.value + EPS; x += step ) {
		ticks.push( x );
	}

	return ticks;
} );
const labelYTicks = computed( () => {
	const step = niceStep( maxTimeH.value, 6 );
	const ticks: number[] = [];

	for ( let t = 0; t <= maxTimeH.value + EPS; t += step ) {
		ticks.push( t );
	}

	return ticks;
} );
</script>

<style scoped>
.rdg-layout {
  height: 100%;
  align-items: stretch;
}

.graph-col {
  min-height: 0;
}

.graph-card {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.svg-wrap {
  width: 100%;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgba(127, 127, 127, 0.35);
  padding: 6px;
  display: flex;
}

.max90{
	max-height: 90vh;
}

svg {
  width: 100%;
  height: 100%;
  min-height: 360px;
  display: block;
}

@media (max-width: 960px) {
  .rdg-layout {
    height: auto;
  }

  .graph-card {
    height: auto;
  }
}
</style>
