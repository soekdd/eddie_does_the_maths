<template>
<AppFrame
	:sub-chapter="{
		'aufgabe': 'Aufgabe',
		'loesung': 'Lösung',
		'zusammenfassung': 'Zusammenfassung',
		'simulation': 'Simulation'
	}"
	title="Eddie rechnet: Frühstückszettel #1 Fischpopulation"
>

	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="`Eddie`">
				<img alt="Eddie rechnet zur Fischpopulation" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>

		<h2 id="aufgabe">Aufgabe: Entwicklung eines Fischbestandes</h2>
		<div class="eddie">
			<p>
				In einem abgeschlossenen See lebt eine Fischpopulation.
				Zu Beginn eines Jahres <Katex tex="t" /> gibt es <Katex tex="N_t" />
				fortpflanzungsfähige Fische.
			</p>
			<p>Für die Entwicklung des Bestands von Jahr zu Jahr gelten folgende Regeln:</p>
			<ol>
				<li>
					Jeder erwachsene Fisch erzeugt im Laufe eines Jahres im Mittel
					<Katex tex="b>0" /> Jungfische.
				</li>
				<li>
					Nicht alle Jungfische überleben bis zum nächsten Jahr.
					Die Überlebenswahrscheinlichkeit beträgt:
					<div class="kbox">
						<Katex as="div" display tex="s(N_t)=\frac{1}{1+cN_t}" />
					</div>
					mit <Katex tex="c>0" /> als Maß für begrenzte Nahrung und begrenzten Lebensraum.
				</li>
				<li>
					Alle überlebenden Jungfische sind im nächsten Jahr fortpflanzungsfähig.
				</li>
				<li>
					Fischfang, Zu- oder Abwanderung werden vernachlässigt.
				</li>
			</ol>
			<p>
				Untersuche dazu:
			</p>
			<ul>
				<li><b>a)</b> Stelle die Rekursionsgleichung für <Katex tex="N_{t+1}" /> in Abhängigkeit von <Katex tex="N_t" /> auf.</li>
				<li><b>b)</b> Bestimme die Gleichgewichte der Rekursion.</li>
				<li><b>c)</b> Beschreibe das langfristige Verhalten abhängig von <Katex tex="b" />:
					Aussterben, unbegrenztes Wachstum oder Einpendeln auf einen festen Wert.</li>
			</ul>
		</div>

		<h2 id="loesung" class="mt-8">Lösung</h2>
		<div class="eddie">
			<h3>a) Rekursionsgleichung</h3>
			<p>
				Im Jahr <Katex tex="t" /> gibt es <Katex tex="N_t" /> fortpflanzungsfähige Fische.
				Diese erzeugen im Mittel <Katex tex="bN_t" /> Jungfische.
				Jeder Jungfisch überlebt mit Wahrscheinlichkeit <Katex tex="\frac{1}{1+cN_t}" />.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="N_{t+1}=bN_t\cdot\frac{1}{1+cN_t}=\frac{bN_t}{1+cN_t}" />
			</div>
			<p>Damit lautet die Rekursion:</p>
			<div class="kbox">
				<Katex as="div" display tex="\boxed{N_{t+1}=\frac{bN_t}{1+cN_t}}" />
			</div>
		</div>

		<div class="eddie">
			<h3>b) Gleichgewichte</h3>
			<p>
				Ein Gleichgewicht erfüllt <Katex tex="N_{t+1}=N_t=N^*" />.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="N^*=\frac{bN^*}{1+cN^*}" />
			</div>

			<h4>Aussterbe-Gleichgewicht</h4>
			<div class="kbox">
				<Katex as="div" display tex="N^*=0" />
			</div>
			<p>Diese Lösung existiert immer.</p>

			<h4>Positives Gleichgewicht</h4>
			<p>
				Für <Katex tex="N^*>0" /> kann durch <Katex tex="N^*" /> geteilt werden:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="1=\frac{b}{1+cN^*}" />
				<Katex as="div" display tex="1+cN^*=b\Rightarrow N^*=\frac{b-1}{c}" />
			</div>
			<p>Ein positives Gleichgewicht existiert nur für <Katex tex="b>1" />.</p>
		</div>

		<div class="eddie">
			<h3>c) Langfristiges Verhalten</h3>
			<p><b>Fall 1:</b> <Katex tex="b\le 1" /></p>
			<ul>
				<li>Jeder Fisch erzeugt im Mittel höchstens einen überlebenden Nachkommen.</li>
				<li>Die Population kann sich nicht selbst erhalten.</li>
				<li>Die Population nimmt langfristig ab.</li>
				<li>Grenzwert: <Katex tex="N^*=0" /> (Aussterben).</li>
			</ul>

			<p><b>Fall 2:</b> <Katex tex="b>1" /></p>
			<ul>
				<li>Die Population wächst zunächst.</li>
				<li>Mit wachsender Dichte sinkt die Überlebenswahrscheinlichkeit der Jungfische.</li>
				<li>Unabhängig von der Anfangsgröße pendelt sich die Folge auf <Katex tex="N^*=\frac{b-1}{c}" /> ein.</li>
			</ul>
			<p>Unbegrenztes Wachstum tritt in diesem Modell nicht auf.</p>
		</div>

		<h2 id="zusammenfassung" class="mt-8">Zusammenfassung</h2>
		<div class="eddie">
			<ul>
				<li>Für <Katex tex="b\le 1" /> stirbt die Population aus.</li>
				<li>Für <Katex tex="b>1" /> stabilisiert sich die Population bei <Katex tex="N^*=\frac{b-1}{c}" />.</li>
				<li>Die dichteabhängige Überlebenswahrscheinlichkeit verhindert unbegrenztes Wachstum.</li>
			</ul>
			<p>Das ist typisch für Modelle mit dichteabhängiger Regulation.</p>
		</div>
	</template>

	<template #interactivePart>
		<h2 id="simulation">Interaktive Simulation</h2>
		<div class="eddie">
			<p>
				Variiere <Katex tex="N_0,b,c" /> und den Zeithorizont.
				Die Kurve zeigt den Verlauf <Katex tex="N_t" />;
				die gestrichelte Linie markiert <Katex tex="N^*" />.
			</p>
		</div>
		<v-sheet border class="pa-4" rounded="lg">
			<v-row dense>
				<v-col cols="12" md="6" sm="6">
					<v-number-input v-model="graphN0Input"
						control-variant="stacked"
						hide-details="auto"
						label="N0 (Startpopulation)"
						:max="5000"
						:min="0"
						:precision="0"
						:step="10"
					/>
				</v-col>
				<v-col cols="12" md="6" sm="6">
					<v-number-input v-model="graphBInput"
						control-variant="stacked"
						hide-details="auto"
						label="b (Reproduktionsfaktor)"
						:max="5"
						:min="0"
						:precision="2"
						:step="0.05"
					/>
				</v-col>
				<v-col cols="12" md="6" sm="6">
					<v-number-input v-model="graphCInput"
						control-variant="stacked"
						hide-details="auto"
						label="c (Konkurrenzfaktor)"
						:max="1"
						:min="0.0001"
						:precision="4"
						:step="0.001"
					/>
				</v-col>
				<v-col cols="12" md="6" sm="6">
					<v-number-input v-model="graphYearsInput"
						control-variant="stacked"
						hide-details="auto"
						label="Zeithorizont t (Jahre)"
						:max="60"
						:min="1"
						:precision="0"
						:step="1"
					/>
				</v-col>
			</v-row>
		</v-sheet>

		<div class="kbox mt-4">
			<div class="mono"><Katex :tex="`N_{t+1}=\\frac{bN_t}{1+cN_t}`" /></div>
			<div class="mono"><Katex :tex="`N_0=${fmtTex( graphN0, 0 )},\ b=${fmtTex( graphB, 3 )},\ c=${fmtTex( graphC, 4 )}`" /></div>
			<div v-if="graphHasPositiveEquilibrium" class="mono">
				<Katex :tex="`N^*=\\frac{b-1}{c}=${fmtTex( graphEquilibrium, 3 )}`" />
			</div>
			<div v-else class="mono">
				<Katex tex="b\le 1\Rightarrow N^*=0\ (Aussterbe-Gleichgewicht)" />
			</div>
			<div class="mono">
				Nach <b>{{ graphHorizon }}</b> Jahren: <b>N</b>={{ fmt( graphFinalPopulation, 3 ) }}.
			</div>
		</div>
	</template>

	<template #calculationPart>
		<h2>Rechnung mit einem Beispielsatz</h2>
		<div class="eddie">
			<div class="kbox">
				<Katex as="div" display :tex="texScenario" />
				<Katex as="div" display :tex="texEquilibrium" />
			</div>
			<div class="kbox">
				<Katex as="div" display :tex="`N_1=${fmtTex( n1, 3 )}`" />
				<Katex as="div" display :tex="`N_2=${fmtTex( n2, 3 )}`" />
				<Katex as="div" display :tex="`N_3=${fmtTex( n3, 3 )}`" />
			</div>
			<div class="kbox">
				<Katex as="div" display :tex="`N_${graphHorizon}=${fmtTex( nT, 3 )}`" />
				<Katex as="div" display :tex="`|N_${graphHorizon}-N^*|=${fmtTex( deltaToEquilibrium, 3 )}`" />
			</div>
			<p class="muted">
				Man sieht: Die Population nähert sich dem stabilen Gleichgewicht schnell und ohne Oszillation.
			</p>
		</div>
	</template>
	<template #summaryPart>
		<FS_Graph
			:b="graphB"
			:c="graphC"
			:horizon="graphHorizon"
			:n0="graphN0"
		/>
	</template>
	<template #footer>
	</template>
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";

import FS_Graph from "./FS_Graph.vue";
import titleImg from "@/images/FS.webp";

const graphN0Input = ref( 4 );
const graphBInput = ref( 2.2 );
const graphCInput = ref( 0.02 );
const graphYearsInput = ref( 12 );

const graphN0 = computed( () => clampNumber(
	graphN0Input.value, 0, 5000
) );
const graphB = computed( () => clampNumber(
	graphBInput.value, 0, 5
) );
const graphC = computed( () => clampNumber(
	graphCInput.value, 0.0001, 1
) );
const graphHorizon = computed( () => clampInt(
	graphYearsInput.value, 1, 60
) );
const graphSeries = computed( () => simulateSeries(
	graphN0.value, graphB.value, graphC.value, graphHorizon.value
) );
const graphFinalPopulation = computed( () =>
	graphSeries.value[ graphSeries.value.length - 1 ] ?? 0 );
const graphHasPositiveEquilibrium = computed( () => graphB.value > 1 );
const graphEquilibrium = computed( () =>
	graphHasPositiveEquilibrium.value ? ( graphB.value - 1 ) / graphC.value : 0 );

const n1 = computed( () => graphSeries.value[ 1 ] ?? 0 );
const n2 = computed( () => graphSeries.value[ 2 ] ?? 0 );
const n3 = computed( () => graphSeries.value[ 3 ] ?? 0 );
const nT = computed( () => graphSeries.value[ graphHorizon.value ] ?? 0 );
const equilibrium = computed( () => graphEquilibrium.value );
const deltaToEquilibrium = computed( () => Math.abs( nT.value - equilibrium.value ) );

const texScenario = computed( () => [
	`N_0=${fmtTex( graphN0.value, 0 )},`,
	`\\ b=${fmtTex( graphB.value, 2 )},`,
	`\\ c=${fmtTex( graphC.value, 3 )},`,
	`\\ t=${graphHorizon.value}`
].join( " " ) );
const texEquilibrium = computed( () => {
	if ( !graphHasPositiveEquilibrium.value ) {
		return "b\\le 1\\Rightarrow N^*=0\\ (Aussterbe-Gleichgewicht)";
	}

	return [
		`N^*=\\\\frac{b-1}{c}=\\\\frac{${fmtTex( graphB.value, 2 )}-1}{${fmtTex( graphC.value, 3 )}}`,
		`=${fmtTex( equilibrium.value, 3 )}`
	].join( "" );
} );

function simulateSeries(
	n0, b, c, years
) {
	const values = [ Number( n0 ) ];

	for ( let t = 0; t < years; t++ ) {
		const current = values[ t ];
		const next = b * current / ( 1 + c * current );
		values.push( next );
	}

	return values;
}

function fmtTex( value, digits = 2 ) {
	if ( !Number.isFinite( value ) ) {
		return "0";
	}

	return Number( value ).toFixed( digits )
		.replace( /0+$/, "" )
		.replace( /\.$/, "" );
}

function fmt( value, digits = 2 ) {
	if ( !Number.isFinite( value ) ) {
		return "0";
	}

	return Number( value ).toFixed( digits )
		.replace( ".", "," );
}

function clampNumber(
	value, min, max
) {
	const number = Number( value );

	if ( !Number.isFinite( number ) ) {
		return min;
	}

	return Math.min( max, Math.max( min, number ) );
}

function clampInt(
	value, min, max
) {
	return Math.round( clampNumber(
		value, min, max
	) );
}
</script>
