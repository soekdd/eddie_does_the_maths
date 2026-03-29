<!-- i18n-ally-scope: useI18n("book1.GZ") -->
<!-- eslint-disable vue/max-len -->
<template>
<AppFrame
	:languages="[ 'de', 'en' ]"
	:sub-chapter
	:title="t( 'title' )"
	:vue-date="__VITE_SFC_MTIME_MS__"
>
	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="t( 'imageTitle' )">
				<img :alt="t( 'imageAlt' )" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">{{ t( "introDate" ) }}</h3>
		<div class="eddie">
			<p v-html="t( 'book.p1' )" />
			<p v-html="t( 'book.p2' )" />
			<p v-html="t( 'book.p3' )" />
			<p v-html="t( 'book.p4' )" />
			<p v-html="t( 'book.p5' )" />
			<p v-html="t( 'book.p6' )" />
		</div>
	</template>

	<template #descriptionPart>
		<h2 id="grundidee">{{ t( "sections.part1.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part1.p1' )" />
			<p v-html="t( 'sections.part1.p2', {
				chance: exampleChanceLabel,
				tries:  fmtInteger( exampleTries ),
				total:  exampleTotalLabel
			} )"
			/>

			<div class="kbox">
				<Katex
					as="div"
					display
					:tex="exampleTex"
				/>
			</div>

			<p v-html="t( 'sections.part1.p3' )" />
		</div>

		<h2 id="gegenwahrscheinlichkeit" class="mt-8">{{ t( "sections.part2.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part2.p1' )" />
			<p v-html="t( 'sections.part2.p2' )" />

			<div class="kbox">
				<Katex
					v-for="texLine in part2Tex"
					:key="texLine"
					as="div"
					display
					:tex="texLine"
				/>
			</div>

			<p v-html="t( 'sections.part2.p3' )" />
		</div>

		<h2 id="zielquote" class="mt-8">{{ t( "sections.part3.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part3.p1' )" />
			<p v-html="t( 'sections.part3.p2' )" />

			<div class="kbox">
				<Katex
					as="div"
					display
					tex="1-(1-p)^n \ge T \quad\Longleftrightarrow\quad n \ge \frac{\ln(1-T)}{\ln(1-p)}"
				/>
			</div>

			<p v-html="t( 'sections.part3.p3' )" />
		</div>

		<EddieComment class="mt-4" :subtitle="t( 'sections.comment.title' )">
			<p v-html="t( 'sections.comment.p1' )" />
			<p v-html="t( 'sections.comment.p2' )" />
		</EddieComment>
	</template>

	<template #interactivePart>
		<h2 id="rechner">{{ t( "interactive.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "interactive.intro" ) }}</p>
		</div>

		<v-card class="panel pa-2">
			<div class="presetWrap">
				<v-btn
					color="primary"
					size="small"
					variant="flat"
					@click="applyPreset( 'tiny' )"
				>
					{{ t( "interactive.presets.tiny" ) }}
				</v-btn>
				<v-btn
					size="small"
					variant="tonal"
					@click="applyPreset( 'medium' )"
				>
					{{ t( "interactive.presets.medium" ) }}
				</v-btn>
				<v-btn
					size="small"
					variant="tonal"
					@click="applyPreset( 'bold' )"
				>
					{{ t( "interactive.presets.bold" ) }}
				</v-btn>
			</div>

			<div class="controlRow">
				<div class="controlHeader">
					<div class="text-subtitle-2">{{ t( "interactive.fields.p" ) }}</div>
					<div class="controlValue">{{ fmtPercent( p, 1 ) }}</div>
				</div>
				<v-slider
					v-model="pPercent"
					color="primary"
					hide-details
					:max="50"
					:min="0"
					:step="0.1"
					thumb-label
				/>
			</div>

			<div class="controlRow">
				<div class="controlHeader">
					<div class="text-subtitle-2">{{ t( "interactive.fields.n" ) }}</div>
					<div class="controlValue">{{ fmtInteger( tries ) }}</div>
				</div>
				<v-slider
					v-model="tries"
					color="primary"
					hide-details
					:max="400"
					:min="1"
					:step="1"
					thumb-label
				/>
			</div>

			<div class="controlRow">
				<div class="controlHeader">
					<div class="text-subtitle-2">{{ t( "interactive.fields.runs" ) }}</div>
					<div class="controlValue">{{ fmtInteger( runs ) }}</div>
				</div>
				<v-slider
					v-model="runs"
					color="primary"
					hide-details
					:max="1000"
					:min="50"
					:step="10"
					thumb-label
				/>
			</div>

			<div class="d-flex flex-wrap align-center justify-space-between ga-3 mt-4">
				<v-btn-toggle
					v-model="explanationMode"
					color="primary"
					divided
					mandatory
					rounded="xl"
				>
					<v-btn value="story">
						{{ t( "interactive.modes.story" ) }}
					</v-btn>
					<v-btn value="math">
						{{ t( "interactive.modes.math" ) }}
					</v-btn>
				</v-btn-toggle>

				<div class="d-flex flex-wrap ga-2">
					<v-btn size="small" variant="outlined" @click="rerollSimulation">
						{{ t( "interactive.buttons.reroll" ) }}
					</v-btn>
					<v-btn size="small" variant="text" @click="resetAll">
						{{ t( "interactive.buttons.reset" ) }}
					</v-btn>
				</div>
			</div>

			<v-row class="mt-4" dense>
				<v-col cols="12" md="6">
					<v-sheet class="statCard" rounded="xl" variant="tonal">
						<h3 class="text-h6 mb-3">{{ t( "interactive.exactTitle" ) }}</h3>

						<v-progress-linear
							class="mb-4"
							color="primary"
							height="14"
							:model-value="exactAtLeastOne * 100"
							rounded
						/>

						<div class="statLines">
							<div class="statLine">
								<span>{{ t( "interactive.exactNo" ) }}</span>
								<b>{{ fmtPercent( exactNoSuccess, 1 ) }}</b>
							</div>
							<div class="statLine">
								<span>{{ t( "interactive.exactYes" ) }}</span>
								<b>{{ fmtPercent( exactAtLeastOne, 1 ) }}</b>
							</div>
						</div>

						<p class="muted mt-3">{{ interpretationText }}</p>
					</v-sheet>
				</v-col>

				<v-col cols="12" md="6">
					<v-sheet class="statCard" rounded="xl" variant="tonal">
						<h3 class="text-h6 mb-3">{{ t( "interactive.simulationTitle" ) }}</h3>

						<v-progress-linear
							class="mb-4"
							color="success"
							height="14"
							:model-value="simulation.proportion * 100"
							rounded
						/>

						<div class="statLines">
							<div class="statLine">
								<span>{{ t( "interactive.simulationHits" ) }}</span>
								<b>{{ simulation.successes }} / {{ fmtInteger( runs ) }}</b>
							</div>
							<div class="statLine">
								<span>{{ t( "interactive.simulationShare" ) }}</span>
								<b>{{ fmtPercent( simulation.proportion, 1 ) }}</b>
							</div>
							<div class="statLine">
								<span>{{ t( "interactive.delta" ) }}</span>
								<b>{{ fmtPercent( simulationGap, 1 ) }}</b>
							</div>
						</div>

						<div class="targetWrap mt-3">
							<div class="text-subtitle-2 mb-2">{{ t( "interactive.targetTitle" ) }}</div>
							<v-chip
								v-for="row in targetRows"
								:key="row.target"
								class="me-2 mb-2"
								color="primary"
								size="small"
								variant="outlined"
							>
								{{ t( "interactive.targetRow", {
									target: row.label,
									trials: row.trialsText
								} ) }}
							</v-chip>
						</div>
					</v-sheet>
				</v-col>
			</v-row>

			<div class="sampleSection mt-4">
				<div class="d-flex flex-wrap align-center justify-space-between ga-2 mb-2">
					<div class="text-subtitle-2">
						{{ t( "interactive.sampleTitle", { count: simulation.sample.length } ) }}
					</div>
					<div class="sampleLegend">
						<span class="legendItem">
							<span class="legendDot is-success"></span>
							{{ t( "interactive.sampleLegendSuccess" ) }}
						</span>
						<span class="legendItem">
							<span class="legendDot is-fail"></span>
							{{ t( "interactive.sampleLegendFail" ) }}
						</span>
					</div>
				</div>

				<div class="sampleGrid">
					<div
						v-for="cell in simulation.sample"
						:key="cell.id"
						class="sampleCell"
						:class="cell.success ? 'is-success' : 'is-fail'"
						:title="sampleCellTitle( cell )"
					></div>
				</div>
			</div>
		</v-card>
	</template>

	<template #calculationPart>
		<h2 id="schritt-fur-schritt">{{ t( "calculation.title" ) }}</h2>

		<v-card class="panel">
			<v-expansion-panels multiple variant="accordion">
				<v-expansion-panel :value="0">
					<v-expansion-panel-title>{{ t( "calculation.step1Title" ) }}</v-expansion-panel-title>
					<v-expansion-panel-text eager>
						<p class="muted">{{ t( "calculation.step1Body" ) }}</p>
						<div class="kbox">
							<Katex
								aligned
								as="div"
								display
								:tex="step1Tex"
							/>
						</div>
					</v-expansion-panel-text>
				</v-expansion-panel>

				<v-expansion-panel>
					<v-expansion-panel-title>{{ t( "calculation.step2Title" ) }}</v-expansion-panel-title>
					<v-expansion-panel-text eager>
						<p class="muted">{{ t( "calculation.step2Body" ) }}</p>
						<div class="kbox">
							<Katex
								aligned
								as="div"
								display
								:tex="step2Tex"
							/>
						</div>
					</v-expansion-panel-text>
				</v-expansion-panel>

				<v-expansion-panel>
					<v-expansion-panel-title>{{ t( "calculation.step3Title" ) }}</v-expansion-panel-title>
					<v-expansion-panel-text eager>
						<p class="muted">{{ t( "calculation.step3Body" ) }}</p>
						<div class="kbox">
							<Katex
								aligned
								as="div"
								display
								:tex="step3Tex"
							/>
						</div>
					</v-expansion-panel-text>
				</v-expansion-panel>

				<v-expansion-panel>
					<v-expansion-panel-title>{{ t( "calculation.step4Title" ) }}</v-expansion-panel-title>
					<v-expansion-panel-text eager>
						<p class="muted">{{ t( "calculation.step4Body" ) }}</p>

						<div class="kbox">
							<Katex
								as="div"
								display
								tex="n \ge \frac{\ln(1-T)}{\ln(1-p)}"
							/>
						</div>

						<div class="tableScroller">
							<v-table density="compact">
								<thead>
									<tr>
										<th>{{ t( "calculation.table.target" ) }}</th>
										<th>{{ t( "calculation.table.trials" ) }}</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="row in targetRows" :key="`target-${row.target}`">
										<td class="mono">{{ row.label }}</td>
										<td class="mono">{{ row.trialsText }}</td>
									</tr>
								</tbody>
							</v-table>
						</div>
					</v-expansion-panel-text>
				</v-expansion-panel>
			</v-expansion-panels>
		</v-card>
	</template>

	<template #summaryPart>
		<v-card class="panel pa-4">
			<h2 class="text-h5 mb-4">{{ t( "summary.title" ) }}</h2>

			<div class="insightGrid">
				<div class="insightCard">
					<h3>{{ t( "summary.cards.one.title" ) }}</h3>
					<p>{{ t( "summary.cards.one.text" ) }}</p>
				</div>
				<div class="insightCard">
					<h3>{{ t( "summary.cards.two.title" ) }}</h3>
					<p>{{ t( "summary.cards.two.text" ) }}</p>
				</div>
				<div class="insightCard">
					<h3>{{ t( "summary.cards.three.title" ) }}</h3>
					<p>{{ t( "summary.cards.three.text" ) }}</p>
				</div>
			</div>

			<EddieComment class="mt-4" :subtitle="t( 'summary.commentTitle' )">
				{{ t( "summary.commentBody" ) }}
			</EddieComment>
		</v-card>
	</template>
</AppFrame>
</template>

<script setup>
import {
	computed, ref, watch
} from "vue";
import { useI18n } from "@/utils/i18n.mjs";
import titleImg from "./GZ.webp";

const {
	t, tm, locale
} = useI18n( "book1.GZ" );

const SAMPLE_SIZE = 180;
const DEFAULT_STATE = Object.freeze( {
	pPercent: 1,
	tries:    70,
	runs:     400
} );

const PRESETS = {
	tiny: {
		pPercent: 1,
		tries:    70,
		runs:     400
	},
	medium: {
		pPercent: 5,
		tries:    20,
		runs:     400
	},
	bold: {
		pPercent: 20,
		tries:    8,
		runs:     400
	}
};

const pPercent = ref( DEFAULT_STATE.pPercent );
const tries = ref( DEFAULT_STATE.tries );
const runs = ref( DEFAULT_STATE.runs );
const explanationMode = ref( "story" );
const simulation = ref( {
	successes:  0,
	proportion: 0,
	sample:     []
} );

const subChapter = computed( () => tm( "subChapter" ) ?? {} );
const p = computed( () => clampNumber(
	Number( pPercent.value ) / 100, 0, 1
) );
const singleFailure = computed( () => 1 - p.value );
const exactNoSuccess = computed( () => noSuccessProbability( p.value, tries.value ) );
const exactAtLeastOne = computed( () => 1 - exactNoSuccess.value );
const simulationGap = computed( () =>
	Math.abs( simulation.value.proportion - exactAtLeastOne.value ) );

const exampleProbability = 0.01;
const exampleTries = 70;
const exampleTotal = atLeastOneProbability( exampleProbability, exampleTries );
const exampleChanceLabel = computed( () => fmtPercent( exampleProbability, 0 ) );
const exampleTotalLabel = computed( () => fmtPercent( exampleTotal, 1 ) );
const formulaLabels = computed( () => ( {
	noHitOne: locale.value === "de" ?
		"kein Treffer in 1 Versuch" :
		"no hit in 1 try",
	noHitCurrent: locale.value === "de" ?
		`kein Treffer in ${tries.value} ${Number( tries.value ) === 1 ? "Versuch" : "Versuchen"}` :
		`no hit in ${tries.value} ${Number( tries.value ) === 1 ? "try" : "tries"}`,
	atLeastOne: locale.value === "de" ?
		"mindestens ein Treffer" :
		"at least one hit"
} ) );
const exampleTex = computed( () =>
	String.raw`P(\text{${formulaLabels.value.atLeastOne}}) = 1-(1-0.01)^{70} \approx ${fmtTex( exampleTotal, 4 )}` );
const part2Tex = computed( () => locale.value === "de" ?
	[
		String.raw`P(\text{kein Treffer in 1 Versuch}) = 1-p`,
		String.raw`P(\text{kein Treffer in }n\text{ Versuchen}) = (1-p)^n`,
		String.raw`P(\text{mindestens ein Treffer}) = 1-(1-p)^n`
	] :
	[
		String.raw`P(\text{no hit in 1 try}) = 1-p`,
		String.raw`P(\text{no hit in }n\text{ tries}) = (1-p)^n`,
		String.raw`P(\text{at least one hit}) = 1-(1-p)^n`
	] );
const step1Tex = computed( () =>
	String.raw`P(\text{${formulaLabels.value.noHitOne}}) &= 1-p 
	\\ &= 1-${fmtTex( p.value, 4 )} \\ &= ${fmtTex( singleFailure.value, 4 )}` );
const step2Tex = computed( () =>
	String.raw`P(\text{${formulaLabels.value.noHitCurrent}}) &= (1-p)^{${tries.value}} 
	\\ &= (${fmtTex( singleFailure.value, 4 )})^{${tries.value}} \\ &= ${fmtTex( exactNoSuccess.value, 6 )}` );
const step3Tex = computed( () =>
	String.raw`P(\text{${formulaLabels.value.atLeastOne}}) &= 1 - P(\text{${formulaLabels.value.noHitCurrent}}) 
	\\ &= 1-${fmtTex( exactNoSuccess.value, 6 )} \\ &= ${fmtTex( exactAtLeastOne.value, 6 )}` );

const interpretationText = computed( () =>
	explanationMode.value === "story" ?
		t( "interactive.storyModeText", {
			p:    fmtPercent( p.value, 1 ),
			n:    fmtInteger( tries.value ),
			hit:  fmtPercent( exactAtLeastOne.value, 1 ),
			miss: fmtPercent( exactNoSuccess.value, 1 )
		} ) :
		t( "interactive.mathModeText", {
			p:    fmtTex( p.value, 4 ),
			n:    fmtInteger( tries.value ),
			hit:  fmtTex( exactAtLeastOne.value, 6 ),
			miss: fmtTex( exactNoSuccess.value, 6 )
		} ) );

const targetRows = computed( () => [
	0.5,
	0.9,
	0.95
].map( ( target ) => {
	const trials = trialsForTargetProbability( p.value, target );

	return {
		target,
		label:      fmtPercent( target, 0 ),
		trials,
		trialsText: Number.isFinite( trials ) ? fmtInteger( trials ) : "∞"
	};
} ) );

watch(
	[
		pPercent,
		tries,
		runs
	], () => {
		rerollSimulation();
	}, { immediate: true }
);

function clampNumber(
	value, min, max
) {
	const number = Number( value );

	if ( !Number.isFinite( number ) ) {
		return min;
	}

	return Math.min( max, Math.max( min, number ) );
}

function noSuccessProbability( probability, count ) {
	const safeProbability = clampNumber(
		probability, 0, 1
	);
	const safeCount = Math.max( 0, Math.floor( Number( count ) || 0 ) );

	if ( safeCount === 0 ) {
		return 1;
	}

	if ( safeProbability <= 0 ) {
		return 1;
	}

	if ( safeProbability >= 1 ) {
		return 0;
	}

	return ( 1 - safeProbability ) ** safeCount;
}

function atLeastOneProbability( probability, count ) {
	return 1 - noSuccessProbability( probability, count );
}

function trialsForTargetProbability( probability, target ) {
	const safeProbability = clampNumber(
		probability, 0, 1
	);
	const safeTarget = clampNumber(
		target, 0, 1
	);

	if ( safeTarget <= 0 ) {
		return 0;
	}

	if ( safeProbability <= 0 ) {
		return Number.POSITIVE_INFINITY;
	}

	if ( safeProbability >= 1 ) {
		return 1;
	}

	return Math.max( 1, Math.ceil( Math.log1p( -safeTarget ) / Math.log1p( -safeProbability ) ) );
}

function simulateAtLeastOne(
	probability, count, totalRuns
) {
	const safeProbability = clampNumber(
		probability, 0, 1
	);
	const safeCount = Math.max( 0, Math.floor( Number( count ) || 0 ) );
	const safeRuns = Math.max( 1, Math.floor( Number( totalRuns ) || 1 ) );
	let successes = 0;
	const sample = [];

	for ( let run = 0; run < safeRuns; run++ ) {
		let success = false;
		let firstHit = null;

		for ( let step = 0; step < safeCount; step++ ) {
			if ( Math.random() < safeProbability ) {
				success = true;
				firstHit = step + 1;
				break;
			}
		}

		if ( success ) {
			successes++;
		}

		if ( run < SAMPLE_SIZE ) {
			sample.push( {
				id: run,
				success,
				firstHit
			} );
		}
	}

	return {
		successes,
		proportion: successes / safeRuns,
		sample
	};
}

function rerollSimulation() {
	simulation.value = simulateAtLeastOne(
		p.value,
		tries.value,
		runs.value
	);
}

function applyPreset( key ) {
	const preset = PRESETS[ key ];

	if ( !preset ) {
		return;
	}

	pPercent.value = preset.pPercent;
	tries.value = preset.tries;
	runs.value = preset.runs;
}

function resetAll() {
	pPercent.value = DEFAULT_STATE.pPercent;
	tries.value = DEFAULT_STATE.tries;
	runs.value = DEFAULT_STATE.runs;
	explanationMode.value = "story";
}

function fmtPercent( value, digits = 1 ) {
	if ( !Number.isFinite( value ) ) {
		return "∞";
	}

	return new Intl.NumberFormat( locale.value === "de" ? "de-DE" : "en-US", {
		style:                 "percent",
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	} ).format( value );
}

function fmtInteger( value ) {
	if ( !Number.isFinite( value ) ) {
		return "∞";
	}

	const numberLocale = locale.value === "de" ? "de-DE" : "en-US";
	return new Intl.NumberFormat( numberLocale, { maximumFractionDigits: 0 } ).format( value );
}

function fmtTex( value, digits = 4 ) {
	if ( !Number.isFinite( value ) ) {
		return "\\infty";
	}

	const formatted = Number( value ).toFixed( digits )
		.replace( /0+$/, "" )
		.replace( /\.$/, "" );

	return formatted === "-0" ? "0" : formatted;
}

function sampleCellTitle( cell ) {
	if ( cell.success ) {
		return t( "interactive.sampleHitTitle", { hit: cell.firstHit } );
	}

	return t( "interactive.sampleFailTitle" );
}
</script>

<style scoped>
.presetWrap {
	display: flex;
	flex-wrap: wrap;
	gap: 0.6rem;
	margin-bottom: 1rem;
}

.controlRow + .controlRow {
	margin-top: 0.75rem;
}

.controlHeader {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
}

.controlValue {
	font-variant-numeric: tabular-nums;
	font-weight: 600;
}

.statCard {
	height: 100%;
	padding: 1rem;
}

.statLines {
	display: grid;
	gap: 0.55rem;
}

.statLine {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: 1rem;
	font-variant-numeric: tabular-nums;
}

.targetWrap {
	border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
	padding-top: 0.85rem;
}

.sampleSection {
	border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
	padding-top: 1rem;
}

.sampleLegend {
	display: flex;
	flex-wrap: wrap;
	gap: 0.85rem;
	font-size: 0.92rem;
}

.legendItem {
	display: inline-flex;
	align-items: center;
	gap: 0.45rem;
}

.legendDot {
	display: inline-block;
	width: 0.85rem;
	height: 0.85rem;
	border-radius: 999px;
}

.sampleGrid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(14px, 1fr));
	gap: 0.35rem;
}

.sampleCell {
	aspect-ratio: 1;
	border-radius: 999px;
	border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.is-success {
	background: rgba(var(--v-theme-success), 0.82);
}

.is-fail {
	background: rgba(var(--v-theme-error), 0.3);
}

.insightGrid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 1rem;
}

.insightCard {
	border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
	border-radius: 18px;
	padding: 1rem;
	background: rgba(var(--v-theme-surface-bright), 0.58);
}

.insightCard h3 {
	margin-bottom: 0.45rem;
	font-size: 1rem;
}

.insightCard p {
	margin: 0;
}

@media ( max-width: 860px ) {
	.insightGrid {
		grid-template-columns: 1fr;
	}

	.sampleGrid {
		grid-template-columns: repeat(auto-fill, minmax(12px, 1fr));
	}
}
</style>
