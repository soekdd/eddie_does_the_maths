<template>
<AppFrame
	:languages="[ 'de', 'en' ]"
	:sub-chapter
	:title="t( 'fs.title' )"
	:vue-date="__VITE_SFC_MTIME_MS__"
>
	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="t( 'fs.imageTitle' )">
				<img :alt="t( 'fs.imageAlt' )" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">{{ t( "fs.introDate" ) }}</h3>
		<div class="eddie">
			<p>{{ t( "fs.book.p1" ) }}</p>
			<p>{{ t( "fs.book.p2" ) }}</p>
		</div>
	</template>

	<template #descriptionPart>
		<h2 id="aufgabe">{{ t( "fs.sections.task.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "fs.sections.task.p1" ) }}</p>
			<p>{{ t( "fs.sections.task.p2" ) }}</p>
			<ol>
				<li>
					{{ t( "fs.sections.task.r1" ) }}
				</li>
				<li>
					{{ t( "fs.sections.task.r2" ) }}
					<div class="kbox">
						<Katex as="div" display tex="s(N_t)=\frac{1}{1+cN_t}" />
					</div>
					{{ t( "fs.sections.task.r2b" ) }}
				</li>
				<li>
					{{ t( "fs.sections.task.r3" ) }}
				</li>
				<li>
					{{ t( "fs.sections.task.r4" ) }}
				</li>
			</ol>
			<p>{{ t( "fs.sections.task.p3" ) }}</p>
			<ul>
				<li><b>a)</b> {{ t( "fs.sections.task.q1" ) }}</li>
				<li><b>b)</b> {{ t( "fs.sections.task.q2" ) }}</li>
				<li><b>c)</b> {{ t( "fs.sections.task.q3" ) }}</li>
			</ul>
		</div>

		<h2 id="loesung" class="mt-8">{{ t( "fs.sections.solution.title" ) }}</h2>
		<div class="eddie">
			<h3>{{ t( "fs.sections.solution.step21" ) }}</h3>
			<p>{{ t( "fs.sections.solution.p21" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="N_{t+1}=bN_t\cdot\frac{1}{1+cN_t}=\frac{bN_t}{1+cN_t}" />
			</div>
			<p>{{ t( "fs.sections.solution.p22" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="\boxed{N_{t+1}=\frac{bN_t}{1+cN_t}}" />
			</div>
		</div>

		<div class="eddie">
			<h3>{{ t( "fs.sections.solution.step22" ) }}</h3>
			<p>{{ t( "fs.sections.solution.p23" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="N^*=\frac{bN^*}{1+cN^*}" />
			</div>

			<h4>{{ t( "fs.sections.solution.extinctionTitle" ) }}</h4>
			<div class="kbox">
				<Katex as="div" display tex="N^*=0" />
			</div>
			<p>{{ t( "fs.sections.solution.p24" ) }}</p>

			<h4>{{ t( "fs.sections.solution.positiveTitle" ) }}</h4>
			<p>{{ t( "fs.sections.solution.p25" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="1=\frac{b}{1+cN^*}" />
				<Katex as="div" display tex="1+cN^*=b\Rightarrow N^*=\frac{b-1}{c}" />
			</div>
			<p>{{ t( "fs.sections.solution.p26" ) }}</p>
		</div>

		<div class="eddie">
			<h3>{{ t( "fs.sections.solution.step23" ) }}</h3>
			<p><b>{{ t( "fs.sections.solution.case1" ) }}</b> <Katex tex="b\le 1" /></p>
			<ul>
				<li>{{ t( "fs.sections.solution.case1a" ) }}</li>
				<li>{{ t( "fs.sections.solution.case1b" ) }}</li>
				<li>{{ t( "fs.sections.solution.case1c" ) }}</li>
				<li>{{ t( "fs.sections.solution.case1d" ) }}</li>
			</ul>

			<p><b>{{ t( "fs.sections.solution.case2" ) }}</b> <Katex tex="b>1" /></p>
			<ul>
				<li>{{ t( "fs.sections.solution.case2a" ) }}</li>
				<li>{{ t( "fs.sections.solution.case2b" ) }}</li>
				<li>{{ t( "fs.sections.solution.case2c" ) }}</li>
			</ul>
			<p>{{ t( "fs.sections.solution.p27" ) }}</p>
		</div>

		<h2 id="zusammenfassung" class="mt-8">{{ t( "fs.sections.summary.title" ) }}</h2>
		<div class="eddie">
			<ul>
				<li>{{ t( "fs.sections.summary.s1" ) }}</li>
				<li>{{ t( "fs.sections.summary.s2" ) }}</li>
				<li>{{ t( "fs.sections.summary.s3" ) }}</li>
			</ul>
			<p>{{ t( "fs.sections.summary.p1" ) }}</p>
		</div>
	</template>

	<template #interactivePart>
		<h2 id="simulation">{{ t( "fs.interactive.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "fs.interactive.p1" ) }}</p>
		</div>
		<v-sheet border class="pa-4" rounded="lg">
			<v-row dense>
				<v-col cols="12" md="6" sm="6">
					<v-number-input v-model="graphN0Input"
						control-variant="stacked"
						hide-details="auto"
						:label="t( 'fs.interactive.n0' )"
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
						:label="t( 'fs.interactive.b' )"
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
						:label="t( 'fs.interactive.c' )"
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
						:label="t( 'fs.interactive.horizon' )"
						:max="60"
						:min="1"
						:precision="0"
						:step="1"
					/>
				</v-col>
			</v-row>
		</v-sheet>

		<div class="kbox mt-4">
			<div class="mono"><Katex aligned
				:tex="`N_{t+1} &=\\frac{bN_t}{1+cN_t} \\\\
N_0 &=${fmtTex( graphN0, 0 )},\ b=${fmtTex( graphB, 3 )},\ c=${fmtTex( graphC, 4 )}` +
					(graphHasPositiveEquilibrium ? `\\\\ N^*&=\\frac{b-1}{c}=${fmtTex( graphEquilibrium, 3 )}`
						: `\\\\ ${t( 'fs.interactive.extinctionTex' )}`)"
			/>		</div>
			<div class="mono">
				{{ t( "fs.interactive.afterYears", {
					years: graphHorizon,
					value: fmt( graphFinalPopulation, 3 )
				} ) }}
			</div>
		</div>
	</template>

	<template #calculationPart>
		<h2>{{ t( "fs.calculation.title" ) }}</h2>
		<div class="eddie">
			<div class="kbox">
				<Katex aligned
					as="div"
					display
					:tex="texScenario + `\\\\` + texEquilibrium"
				/>
			</div>
			<div class="kbox">
				<Katex aligned
					as="div"
					display
					:tex="`N_1 &=${fmtTex( n1, 3 )} \\\\ N_2 &=${fmtTex( n2, 3 )} \\\\ N_3 &=${fmtTex( n3, 3 )}`"
				/>
			</div>
			<div class="kbox">
				<Katex aligned
					as="div"
					display
					:tex="`N_${graphHorizon}&=${fmtTex( nT, 3 )} \\\\ |N_${graphHorizon}-N^*| &=${fmtTex( deltaToEquilibrium, 3 )}`"
				/>
			</div>
			<p class="muted">
				{{ t( "fs.calculation.note" ) }}
			</p>
		</div>
	</template>
	<template #summaryPart>
		<FSGraph
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
import { useI18n } from "@/i18n.mjs";

import FSGraph from "./FS_Graph.vue";
import titleImg from "./FS.webp";

const {
	locale,
	t
} = useI18n( "book1/FS" );

const subChapter = computed( () => ( {
	einleitung:      t( "fs.subChapter.einleitung" ),
	aufgabe:         t( "fs.subChapter.aufgabe" ),
	loesung:         t( "fs.subChapter.loesung" ),
	zusammenfassung: t( "fs.subChapter.zusammenfassung" ),
	simulation:      t( "fs.subChapter.simulation" )
} ) );

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
	`N_0 &=${fmtTex( graphN0.value, 0 )},`,
	`\\\\ b &=${fmtTex( graphB.value, 2 )},`,
	`\\\\ c &=${fmtTex( graphC.value, 3 )},`,
	`\\\\ t &=${graphHorizon.value}`
].join( " " ) );
const texEquilibrium = computed( () => {
	if ( !graphHasPositiveEquilibrium.value ) {
		return t( "fs.calculation.extinctionTex" );
	}

	return [
		`N^* &=\\frac{b-1}{c}=\\frac{${fmtTex( graphB.value, 2 )}-1}{${fmtTex( graphC.value, 3 )}}`,
		`\\\\ &=${fmtTex( equilibrium.value, 3 )}`
	].join( " " );
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

	return new Intl.NumberFormat( locale.value, {
		maximumFractionDigits: digits,
		minimumFractionDigits: digits
	} ).format( Number( value ) );
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
