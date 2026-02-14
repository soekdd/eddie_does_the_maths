<template>
<AppFrame short="RD"
	:sub-chapter="{
		'depot-strategie': 'Depot-Strategie',
		'vorstufe-plus-klassisches-mehrdepot-modell': 'Vorstufe + klassisches Mehrdepot-Modell'
	}"
	title="Eddie rechnet: Das Rentier-Problem"
	warning
>

	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="`Eddie`">
				<img alt="Eddie rechnet" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h2>Teil 1 — Aufgabe (Lappland-Version)</h2>
		<div class="eddie">
			<p>
				Eine Wanderin kann pro Tag <Katex tex="c" /> Rationen verbrauchen und maximal
				<Katex tex="C" /> Rationen tragen. Am Start liegt unbegrenzter Vorrat.
				Mit Depots soll die maximale Entfernung in die Wildnis (mit sicherer Rückkehr)
				möglichst groß werden.
			</p>
		</div>

		<h2 id="vorstufe-plus-klassisches-mehrdepot-modell" class="mt-8">Teil 2 — Warum ein Depot nur die Vorstufe ist</h2>
		<div class="eddie">
			<p>
				Dein Punkt ist richtig: Mit genau einem Depot entsteht noch keine Reihenstruktur.
				Die Ein-Depot-Version ist nur eine saubere Einstiegsversion
				(Machbarkeit, Bilanz, Formeln), aber noch nicht das eigentliche klassische Jeep-Problem.
			</p>
			<p class="muted">
				Die Reihe entsteht erst, wenn man mehrere Depotstufen nutzt.
				Dann wird jeder weitere Kilometer teurer und der Zusatzgewinn pro Stufe kleiner.
			</p>
		</div>

		<h2 id="depot-strategie" class="mt-8">Teil 3 — Klassische Mehrdepot-Idee (harmonische Struktur)</h2>
		<div class="eddie">
			<p>
				Für das idealisierte Mehrdepot-Modell mit Rückkehrpflicht gilt pro Stufe
				<code>j</code> der effektive Faktor <Katex tex="2j-1" />.
				Damit ergibt sich:
			</p>

			<div class="kbox">
				<Katex as="div" display tex="\Delta x_j=\frac{vC}{2c}\cdot\frac{1}{2j-1}" />
				<Katex as="div" display tex="D_m=\sum_{j=1}^{m}\Delta x_j=\frac{vC}{2c}\sum_{j=1}^{m}\frac{1}{2j-1}" />
			</div>

			<p>
				Die Summe wächst weiter (sehr langsam), also gibt es keine harte endliche Obergrenze
				bei unbegrenzt vielen Depotstufen.
				Praktisch sieht es aber wie eine Sättigung aus, weil jeder neue Term kleiner wird.
			</p>
		</div>

		<h2 class="mt-8">Teil 4 — Ein-Depot-Formel (Vorstufe)</h2>
		<div class="eddie">
			<p>
				Für die Vorstufe mit einem Depot bei <Katex tex="x" />, Ablage <Katex tex="d" />
				pro Shuttle und <Katex tex="k" /> Shuttles gilt:
			</p>

			<div class="kbox">
				<Katex as="div" display tex="d + 2c\frac{x}{v} \le C" />
				<Katex as="div" display tex="D_{\max}=x+\frac{v}{2c}\left(kd + C - c\frac{x}{v}\right)" />
			</div>
		</div>
	</template>

	<template #interactivePart>
		<h2>Interaktiver Rechner</h2>
		<div class="eddie d-flex flex-column ga-3">
			<v-sheet border class="pa-4" rounded="lg">
				<v-select
					v-model="mode"
					hide-details="auto"
					item-title="title"
					item-value="value"
					:items="modeItems"
					label="Modus"
				/>
			</v-sheet>

			<template v-if="mode === 'light'">
				<v-alert type="info" variant="tonal">
					Vorstufe: ein Depot. Didaktisch klar, aber noch ohne Reihenstruktur.
				</v-alert>

				<v-sheet border class="pa-4" rounded="lg">
					<v-row dense>
						<v-col cols="12" md="6" sm="6">
							<v-number-input v-model="CInput"
								control-variant="stacked"
								hide-details="auto"
								label="C (Traglast)"
								:precision="0"
								:step="1"
							/>
						</v-col>
						<v-col cols="12" md="6" sm="6">
							<v-number-input v-model="cInput"
								control-variant="stacked"
								hide-details="auto"
								label="c (Verbrauch/Tag)"
								:precision="0"
								:step="1"
							/>
						</v-col>
						<v-col cols="12" md="6" sm="6">
							<v-number-input v-model="vInput"
								control-variant="stacked"
								hide-details="auto"
								label="v (km/Tag)"
								:precision="0"
								:step="1"
							/>
						</v-col>
						<v-col cols="12" md="6" sm="6">
							<v-number-input v-model="xInput"
								control-variant="stacked"
								hide-details="auto"
								label="x (Depot-km)"
								:precision="0"
								:step="1"
							/>
						</v-col>
						<v-col cols="12" md="6" sm="6">
							<v-number-input v-model="dInput"
								control-variant="stacked"
								hide-details="auto"
								label="d (Ablage/Shuttle)"
								:precision="0"
								:step="1"
							/>
						</v-col>
						<v-col cols="12" md="6" sm="6">
							<v-number-input v-model="kInput"
								control-variant="stacked"
								hide-details="auto"
								label="k (Shuttles)"
								:precision="0"
								:step="1"
							/>
						</v-col>
					</v-row>

					<div class="d-flex ga-2 mt-2 flex-wrap">
						<v-btn color="primary" variant="flat" @click="applyLapplandPreset">Lappland-Preset</v-btn>
						<v-btn variant="tonal" @click="setMaxFeasibleX">x auf Max setzen</v-btn>
					</div>
				</v-sheet>

				<v-alert v-if="lightCalc.error" type="error" variant="tonal">
					{{ lightCalc.error }}
				</v-alert>

				<template v-else>
					<v-alert :type="lightCalc.ok ? 'success' : 'warning'" variant="tonal">
						<div v-if="lightCalc.ok">
							Machbar: Die gewählte Shuttle-Strategie ist konsistent.
						</div>
						<div v-else>
							{{ lightCalc.warning }}
						</div>
					</v-alert>

					<div class="kbox">
						<div class="mono">Depotfüllung: L = k·d = {{ fmt(lightCalc.L, 3) }}</div>
						<div class="mono">Ohne Depot: D0 = {{ fmt(lightCalc.D0, 3) }} km</div>
						<div class="mono">Mit Depot: Dmax = {{ fmt(lightCalc.Dmax, 3) }} km</div>
						<div class="mono">Gewinn: Delta = {{ fmt(lightCalc.gain, 3) }} km</div>
					</div>
				</template>
			</template>

			<template v-else>
				<v-alert type="info" variant="tonal">
					Klassisches Mehrdepot-Modell: Hier entsteht die harmonische Reihe.
				</v-alert>

				<v-sheet border class="pa-4" rounded="lg">
					<v-row dense>
						<v-col cols="12" md="6" sm="6">
							<v-number-input v-model="classicCInput"
								control-variant="stacked"
								hide-details="auto"
								label="C (Traglast)"
								:precision="0"
								:step="1"
							/>
						</v-col>
						<v-col cols="12" md="6" sm="6">
							<v-number-input v-model="classiccInput"
								control-variant="stacked"
								hide-details="auto"
								label="c (Verbrauch/Tag)"
								:precision="0"
								:step="1"
							/>
						</v-col>
						<v-col cols="12" md="6" sm="6">
							<v-number-input v-model="classicVInput"
								control-variant="stacked"
								hide-details="auto"
								label="v (km/Tag)"
								:precision="0"
								:step="1"
							/>
						</v-col>
						<v-col cols="12" md="6" sm="6">
							<v-number-input v-model="mInput"
								control-variant="stacked"
								hide-details="auto"
								label="m (Depotstufen)"
								:precision="0"
								:step="1"
							/>
						</v-col>
					</v-row>

					<div class="d-flex ga-2 mt-2 flex-wrap">
						<v-btn color="primary" variant="flat" @click="applyClassicPreset">Lappland-Preset</v-btn>
					</div>
				</v-sheet>

				<v-alert v-if="classicCalc.error" type="error" variant="tonal">
					{{ classicCalc.error }}
				</v-alert>

				<template v-else>
					<div class="kbox">
						<div class="mono">Basis (ohne Depot): D0 = {{ fmt(classicCalc.D0, 3) }} km</div>
						<div class="mono">Odd-Harmonic-Summe Hodd(m) = {{ fmt(classicCalc.Hodd, 6) }}</div>
						<div class="mono">Mehrdepot-Distanz: Dm = {{ fmt(classicCalc.Dm, 3) }} km</div>
						<div class="mono">
							Letzter Stufengewinn: Delta xm = {{ fmt(classicCalc.lastGain, 3) }} km
						</div>
					</div>
				</template>
			</template>
		</div>
	</template>

	<template #calculationPart>
		<h2>Tabellenansicht</h2>
		<div class="eddie d-flex flex-column ga-3">
			<template v-if="mode === 'light'">
				<v-sheet border class="pa-3" rounded="lg">
					<v-table density="compact">
						<thead>
							<tr>
								<th>k</th>
								<th class="text-right">L = k·d</th>
								<th class="text-right">Dmax(k) [km]</th>
								<th class="text-right">Delta gegen D0 [km]</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="row in lightCalc.rows" :key="row.k">
								<td class="mono">{{ row.k }}</td>
								<td class="mono text-right">{{ fmt(row.L, 3) }}</td>
								<td class="mono text-right">{{ fmt(row.D, 3) }}</td>
								<td class="mono text-right">{{ fmt(row.gain, 3) }}</td>
							</tr>
						</tbody>
					</v-table>
				</v-sheet>
			</template>

			<template v-else>
				<v-sheet border class="pa-3" rounded="lg">
					<v-table density="compact">
						<thead>
							<tr>
								<th>j</th>
								<th class="text-right">1/(2j-1)</th>
								<th class="text-right">Delta xj [km]</th>
								<th class="text-right">Dj [km]</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="row in classicCalc.rows" :key="row.j">
								<td class="mono">{{ row.j }}</td>
								<td class="mono text-right">{{ fmt(row.term, 6) }}</td>
								<td class="mono text-right">{{ fmt(row.delta, 3) }}</td>
								<td class="mono text-right">{{ fmt(row.cum, 3) }}</td>
							</tr>
						</tbody>
					</v-table>
				</v-sheet>
				<p class="muted">
					Interpretation: Die Zugewinne werden kleiner (<Katex tex="\propto \frac{1}{2j-1}" />),
					daher wirkt es wie Sättigung, obwohl die Summe theoretisch weiter wächst.
				</p>
			</template>
		</div>
	</template>

	<template #summaryPart>
		<h2>Grafische Darstellung</h2>
		<div class="eddie d-flex flex-column ga-3">
			<template v-if="mode === 'light'">
				<v-sheet v-if="!lightCalc.error"
					border
					class="pa-3"
					rounded="lg"
				>
					<RD_Graph
						:cap="CInput"
						:cons="cInput"
						:d0="lightCalc.D0"
						:depot-x="xInput"
						:dmax="lightCalc.Dmax"
						:drop="dInput"
						mode="light"
						:ok="lightCalc.ok"
						:shuttles="kInput"
						:speed="vInput"
						:warning="lightCalc.warning"
					/>
				</v-sheet>
			</template>
			<template v-else>
				<v-sheet v-if="!classicCalc.error"
					border
					class="pa-3"
					rounded="lg"
				>
					<h3>Stufen als SVG</h3>
					<RD_Graph mode="classic" :rows="classicCalc.rows" />
				</v-sheet>
			</template>
		</div>
	</template>

	<template #footer>
		<p class="muted">
			Quelle: <code class="mono">eddie/03_Eddie_rechnet/130_Rentiere.md</code>
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";
import titleImg from "@/images/RD.webp";
import RD_Graph from "@/views/RD_Graph.vue";

const mode = ref( "classic" );
const modeItems = [
	{ title: "Klassisch (Mehrdepot, Reihe)", value: "classic" },
	{ title: "Vorstufe (ein Depot)", value: "light" }
];

const CInput = ref( 3 );
const cInput = ref( 1 );
const vInput = ref( 20 );
const xInput = ref( 20 );
const dInput = ref( 1 );
const kInput = ref( 3 );

const classicCInput = ref( 3 );
const classiccInput = ref( 1 );
const classicVInput = ref( 20 );
const mInput = ref( 6 );

function parseMaybeFloat( v ) {
	if ( typeof v === "number" ) {
		return Number.isFinite( v ) ? v : null;
	}

	const s = String( v ).trim()
		.replace( ",", "." );

	if ( !s ) {
		return null;
	}

	if ( !/^[-+]?(\d+(\.\d+)?|\.\d+)$/.test( s ) ) {
		return null;
	}

	const n = Number( s );
	return Number.isFinite( n ) ? n : null;
}

function parseMaybeInt( v ) {
	const n = parseMaybeFloat( v );

	if ( n === null || !Number.isInteger( n ) ) {
		return null;
	}

	return n;
}

const lightCalc = computed( () => {
	const C = parseMaybeFloat( CInput.value );
	const c = parseMaybeFloat( cInput.value );
	const speed = parseMaybeFloat( vInput.value );
	const x = parseMaybeFloat( xInput.value );
	const d = parseMaybeFloat( dInput.value );
	const k = parseMaybeInt( kInput.value );

	if ( C === null || c === null || speed === null || x === null || d === null || k === null ) {
		return { error: "Bitte alle Felder mit gültigen Zahlen ausfüllen (k ganzzahlig)." };
	}

	if ( C <= 0 || c <= 0 || speed <= 0 ) {
		return { error: "C, c und v müssen größer als 0 sein." };
	}

	if ( x < 0 || d < 0 || k < 0 ) {
		return { error: "x, d und k dürfen nicht negativ sein." };
	}

	const shuttleRoundUse = 2 * c * x / speed;
	const finalToDepotUse = c * x / speed;
	const shuttleFeasible = d + shuttleRoundUse <= C + 1e-12;
	const finalReachFeasible = finalToDepotUse <= C + 1e-12;

	const L = k * d;
	const D0 = speed * C / ( 2 * c );
	const Dmax = x + speed / ( 2 * c ) * ( L + C - finalToDepotUse );
	const gain = Dmax - D0;

	let ok = true;
	let warning = "";

	if ( !finalReachFeasible ) {
		ok = false;
		warning = "Das Depot liegt zu weit weg: Startladung reicht nicht, um x zu erreichen.";
	} else if ( !shuttleFeasible ) {
		ok = false;
		warning = "Mit diesen Werten kann pro Shuttle nicht d abgelegt und sicher zurückgekehrt werden.";
	}

	const rows = [];

	for ( let kk = 0; kk <= 8; kk++ ) {
		const Lk = kk * d;
		const Dk = x + speed / ( 2 * c ) * ( Lk + C - finalToDepotUse );
		rows.push( {
			k:    kk,
			L:    Lk,
			D:    Dk,
			gain: Dk - D0
		} );
	}

	return {
		error: "",
		ok,
		warning,
		L,
		D0,
		Dmax,
		gain,
		rows
	};
} );

const classicCalc = computed( () => {
	const C = parseMaybeFloat( classicCInput.value );
	const c = parseMaybeFloat( classiccInput.value );
	const speed = parseMaybeFloat( classicVInput.value );
	const m = parseMaybeInt( mInput.value );

	if ( C === null || c === null || speed === null || m === null ) {
		return { error: "Bitte alle Felder mit gültigen Zahlen ausfüllen (m ganzzahlig)." };
	}

	if ( C <= 0 || c <= 0 || speed <= 0 ) {
		return { error: "C, c und v müssen größer als 0 sein." };
	}

	if ( m <= 0 ) {
		return { error: "m muss mindestens 1 sein." };
	}

	const D0 = speed * C / ( 2 * c );
	let Hodd = 0;
	let Dm = 0;
	let lastGain = 0;
	const rows = [];

	for ( let j = 1; j <= m; j++ ) {
		const term = 1 / ( 2 * j - 1 );
		const delta = D0 * term;
		Hodd += term;
		Dm += delta;
		lastGain = delta;
		rows.push( {
			j,
			term,
			delta,
			cum: Dm
		} );
	}

	return {
		error: "",
		D0,
		Hodd,
		Dm,
		lastGain,
		rows
	};
} );

function applyLapplandPreset() {
	CInput.value = 3;
	cInput.value = 1;
	vInput.value = 20;
	xInput.value = 20;
	dInput.value = 1;
	kInput.value = 3;
}

function applyClassicPreset() {
	classicCInput.value = 3;
	classiccInput.value = 1;
	classicVInput.value = 20;
	mInput.value = 6;
}

function setMaxFeasibleX() {
	const C = parseMaybeFloat( CInput.value );
	const c = parseMaybeFloat( cInput.value );
	const speed = parseMaybeFloat( vInput.value );
	const d = parseMaybeFloat( dInput.value );

	if ( C === null || c === null || speed === null || d === null || C <= 0 || c <= 0 || speed <= 0 || d < 0 ) {
		return;
	}

	const xByShuttle = speed / ( 2 * c ) * ( C - d );
	const xByReach = speed / c * C;
	const xMax = Math.max( 0, Math.min( xByShuttle, xByReach ) );
	xInput.value = xMax;
}

function fmt( n, digits = 3 ) {
	if ( !Number.isFinite( n ) ) {
		return "-";
	}

	return n.toFixed( digits ).replace( ".", "," );
}
</script>
