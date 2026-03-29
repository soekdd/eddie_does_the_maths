<!-- i18n-ally-scope: useI18n("book1.SE") -->
<template>
<AppFrame
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
			<p v-html="t( 'book.p1' )"/>
			<p v-html="t( 'book.p2' )"/>
			<p v-html="t( 'book.p3' )"/>
		</div>
	</template>

	<template #descriptionPart>
		<h2 id="muster" class="mt-8">{{ t( "sections.routines.title" ) }}</h2>
		<div class="eddie">
			<v-expansion-panels v-model="openRoutinePanel" variant="accordion">
				<v-expansion-panel v-for="item in routines" :key="item.id">
					<v-expansion-panel-title>{{ item.title }}<v-icon v-if="item.graph"
						class="ml-4"
						:icon="mdiImageFilterBlackWhite"
						size="18"
					/></v-expansion-panel-title>
					<v-expansion-panel-text class="d-flex flex-column ga-2" eager>
						<figure v-if="item.graph" class="exampleFigure">
							<ImageZoomer no-zoom>
								<component :is="item.graph" />
							</ImageZoomer>
						</figure>
						<div>{{ item.text }}</div>
					</v-expansion-panel-text>
				</v-expansion-panel>
			</v-expansion-panels>
		</div>
	</template>

	<template #interactivePart>
		<h2 id="quiz">{{ t( "sections.quiz.title" ) }}</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p v-html="t( 'sections.quiz.p1' )"/>
			<v-select
				v-model="mode"
				class="w-100"
				hide-details="auto"
				item-title="label"
				item-value="value"
				:items="modes"
				:label="t( 'quiz.modeLabel' )"
				@update:model-value="nextExercise"
			/>
			<div class="d-flex flex-wrap ga-3 align-center w-100 px-2">
				<v-btn color="primary" variant="flat" @click="nextExercise">{{ t( "quiz.newExercise" ) }}</v-btn>
				<v-btn variant="tonal" @click="revealSolution = !revealSolution">
					{{ revealSolution ? t( "quiz.hideSolution" ) : t( "quiz.showSolution" ) }}
				</v-btn>
			</div>

			<v-sheet v-if="exercise" class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium">{{ exercise.title }}</div>
				<div class="mt-1">{{ exercise.prompt }}</div>
				<div class="muted mt-1">{{ exercise.hint }}</div>
			</v-sheet>

			<v-radio-group v-if="exercise" v-model="selectedOption" class="mt-1">
				<v-radio
					v-for="opt in exercise.options"
					:key="opt.id"
					:label="opt.label"
					:value="opt.id"
				/>
			</v-radio-group>

			<div class="d-flex flex-wrap ga-3">
				<v-btn color="primary"
					:disabled="!exercise || !selectedOption"
					variant="flat"
					@click="checkAnswer"
				>
					{{ t( "quiz.check" ) }}
				</v-btn>
				<v-btn variant="text" @click="resetChoice">{{ t( "quiz.clearSelection" ) }}</v-btn>
			</div>

			<v-alert v-if="feedback" :type="feedback.ok ? 'success' : 'warning'" variant="tonal">
				{{ feedback.text }}
			</v-alert>
		</div>
	</template>

	<template #calculationPart>
		<h2>{{ t( "details.title" ) }}</h2>
		<div class="eddie d-flex flex-column ga-3">
			<v-sheet v-if="exercise && solved" class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">{{ t( "details.solutionPath" ) }}</div>
				<div class="mono mb-2">{{ exercise.formula }}</div>
				<div v-for="(line, idx) in exercise.steps" :key="idx" class="mono">{{ line }}</div>
			</v-sheet>

			<v-sheet v-if="exercise && revealSolution" class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">{{ t( "details.directSolution" ) }}</div>
				<div class="mono">{{ t( "details.correctIs", { value: correctLabel } ) }}</div>
			</v-sheet>
		</div>
	</template>
</AppFrame>
</template>

<script setup>
 
import { computed, ref } from "vue";
import { mdiImageFilterBlackWhite } from "@mdi/js";
import { useI18n } from "@/utils/i18n.mjs";
import titleImg from "./SE.webp";
import SEGraph2 from "./SE_Graph_2.vue";
import SEGraph3 from "./SE_Graph_3.vue";
import SEGraph6 from "./SE_Graph_6.vue";
import SEGraph7 from "./SE_Graph_7.vue";
import SEGraph8 from "./SE_Graph_8.vue";
import SEGraph9 from "./SE_Graph_9.vue";
import SEGraph10 from "./SE_Graph_10.vue";
import SEGraph11 from "./SE_Graph11.vue";

const {
	t, tm, locale
} = useI18n( "book1.SE" );

const graphMap = {
	2:  SEGraph2,
	3:  SEGraph3,
	6:  SEGraph6,
	7:  SEGraph7,
	8:  SEGraph8,
	9:  SEGraph9,
	10: SEGraph10,
	11: SEGraph11
};

const subChapter = computed( () => tm( "subChapter" ) ?? {} );
const routines = computed( () => ( tm( "routines" ) ?? [] ).map( ( item ) => ( {
	...item,
	graph: item.graphId ? graphMap[ item.graphId ] : null
} ) ) );
const modes = computed( () => tm( "quiz.modes" ) ?? [] );

const mode = ref( "mix" );
const openRoutinePanel = ref( 0 );
const exercise = ref( null );
const selectedOption = ref( "" );
const revealSolution = ref( false );
const feedback = ref( null );
const solved = ref( false );

function randInt( min, max ) {
	return min + Math.floor( Math.random() * ( max - min + 1 ) );
}

function shuffle( arr ) {
	const a = [ ...arr ];

	for ( let i = a.length - 1; i > 0; i-- ) {
		const j = Math.floor( Math.random() * ( i + 1 ) );
		[ a[ i ], a[ j ] ] = [ a[ j ], a[ i ] ];
	}

	return a;
}

function formatNumber(
	value, minFractionDigits = 0, maxFractionDigits = 0
) {
	return new Intl.NumberFormat( locale.value === "de" ? "de-DE" : "en-US", {
		minimumFractionDigits: minFractionDigits,
		maximumFractionDigits: maxFractionDigits
	} ).format( value );
}

function mkOptions(
	correct, candidates, suffix = "", minFractionDigits = 0, maxFractionDigits = 0
) {
	const uniq = [];

	for ( const c of [ correct, ...candidates ] ) {
		const val = Number( c );

		if ( !Number.isFinite( val ) ) {
			continue;
		}

		if ( uniq.some( ( x ) => Math.abs( x - val ) < 1e-9 ) ) {
			continue;
		}

		uniq.push( val );

		if ( uniq.length === 4 ) {
			break;
		}
	}

	while ( uniq.length < 4 ) {
		uniq.push( correct + uniq.length + 1 );
	}

	return shuffle( uniq ).map( ( n, idx ) => ( {
		id:    String( idx + 1 ),
		value: n,
		label: `${formatNumber(
			n, minFractionDigits, maxFractionDigits
		)}${suffix}`
	} ) );
}

function makeTriangleExercise() {
	const n = randInt( 6, 15 );
	const correct = n * ( n + 1 ) / 2;
	const options = mkOptions( correct, [ correct - n, correct + n, correct + 2 * n ] );
	return {
		title:   t( "quiz.exercises.tri.title" ),
		prompt:  t( "quiz.exercises.tri.prompt", { n } ),
		hint:    t( "quiz.exercises.tri.hint" ),
		formula: t( "quiz.exercises.tri.formula", { n } ),
		steps:   [
			t( "quiz.exercises.tri.step1", {
				a:       n,
				b:       n + 1,
				product: n * ( n + 1 )
			} ),
			t( "quiz.exercises.tri.step2", {
				product: n * ( n + 1 ),
				result:  correct
			} )
		],
		options,
		correctValue: correct
	};
}

function makeGaussExercise() {
	const n = [ 39, 59, 79, 99 ][ randInt( 0, 3 ) ];
	const correct = n * ( n + 1 ) / 2;
	const pairSum = n + 1;
	const pairs = ( n - 1 ) / 2;
	const middle = ( n + 1 ) / 2;
	const options = mkOptions( correct, [ correct - pairSum, correct + pairSum, correct + middle ] );
	return {
		title:   t( "quiz.exercises.gauss.title" ),
		prompt:  t( "quiz.exercises.gauss.prompt", { n } ),
		hint:    t( "quiz.exercises.gauss.hint", { n } ),
		formula: t( "quiz.exercises.gauss.formula", {
			pairs,
			pairSum,
			middle
		} ),
		steps: [
			t( "quiz.exercises.gauss.step1", {
				pairs,
				pairSum,
				product: pairs * pairSum
			} ),
			t( "quiz.exercises.gauss.step2", {
				product: pairs * pairSum,
				middle,
				result:  correct
			} )
		],
		options,
		correctValue: correct
	};
}

function makeFibonacciExercise() {
	const seq = [ 1, 1, 2, 3, 5, 8, 13, 21, 34, 55 ];
	const idx = randInt( 2, 6 );
	const a = seq[ idx ];
	const b = seq[ idx + 1 ];
	const c = seq[ idx + 2 ];
	const correct = b + c;
	const options = mkOptions( correct, [ correct - b, correct + a, correct + 2 ] );
	return {
		title:  t( "quiz.exercises.fib.title" ),
		prompt: t( "quiz.exercises.fib.prompt", {
			a,
			b,
			c
		} ),
		hint:    t( "quiz.exercises.fib.hint" ),
		formula: t( "quiz.exercises.fib.formula", {
			b,
			c
		} ),
		steps: [ t( "quiz.exercises.fib.step1", {
			b,
			c,
			result: correct
		} ) ],
		options,
		correctValue: correct
	};
}

function makeSilenceExercise() {
	const p = [ 0.1, 0.15, 0.2, 0.25, 0.3 ][ randInt( 0, 4 ) ];
	const m = randInt( 3, 6 );
	const q = 1 - p;
	const correct = Math.round( Math.pow( q, m ) * 1000 ) / 10;
	const options = mkOptions(
		correct, [ correct - 4.5, correct + 3.5, correct + 8.0 ], " %", 1, 1
	);
	return {
		title:  t( "quiz.exercises.silence.title" ),
		prompt: t( "quiz.exercises.silence.prompt", {
			probability: Math.round( p * 100 ),
			minutes:     m
		} ),
		hint:    t( "quiz.exercises.silence.hint" ),
		formula: t( "quiz.exercises.silence.formula", { p, m } ),
		steps:   [
			t( "quiz.exercises.silence.step1", {
				q: formatNumber(
					q, 2, 2
				)
			} ),
			t( "quiz.exercises.silence.step2", {
				q: formatNumber(
					q, 2, 2
				),
				m,
				result: formatNumber(
					Math.pow( q, m ), 4, 4
				)
			} ),
			t( "quiz.exercises.silence.step3", {
				result: `${formatNumber(
					correct, 1, 1
				)} %`
			} )
		],
		options,
		correctValue: correct,
		suffix:       "%"
	};
}

function makeModuloExercise() {
	const step = [ 3, 4, 5, 7 ][ randInt( 0, 3 ) ];
	const k = randInt( 4, 10 );
	const mod = 12;
	const correct = step * k % mod;
	const options = mkOptions( correct, [ ( correct + step ) % mod, ( correct + 6 ) % mod, ( correct + 9 ) % mod ] );
	return {
		title:  t( "quiz.exercises.mod.title" ),
		prompt: t( "quiz.exercises.mod.prompt", {
			step,
			steps: k
		} ),
		hint:    t( "quiz.exercises.mod.hint" ),
		formula: t( "quiz.exercises.mod.formula", {
			step,
			steps: k
		} ),
		steps: [ t( "quiz.exercises.mod.step1", {
			product: step * k,
			result:  correct
		} ) ],
		options,
		correctValue: correct
	};
}

function buildExercise( kind ) {
	const generators = {
		tri:     makeTriangleExercise,
		gauss:   makeGaussExercise,
		fib:     makeFibonacciExercise,
		silence: makeSilenceExercise,
		mod:     makeModuloExercise
	};

	if ( kind !== "mix" && generators[ kind ] ) {
		return generators[ kind ]();
	}

	const all = Object.values( generators );
	return all[ randInt( 0, all.length - 1 ) ]();
}

function nextExercise() {
	exercise.value = buildExercise( mode.value );
	selectedOption.value = "";
	feedback.value = null;
	revealSolution.value = false;
	solved.value = false;
}

function resetChoice() {
	selectedOption.value = "";
	feedback.value = null;
	solved.value = false;
}

function checkAnswer() {
	if ( !exercise.value || !selectedOption.value ) {
		return;
	}

	const selected = exercise.value.options.find( ( o ) => o.id === selectedOption.value );
	const ok = selected && Math.abs( selected.value - exercise.value.correctValue ) < 1e-9;
	solved.value = Boolean( ok );
	feedback.value = {
		ok,
		text: ok ? t( "quiz.feedback.correct" ) : t( "quiz.feedback.wrong" )
	};
}

const correctLabel = computed( () => {
	if ( !exercise.value ) {
		return "-";
	}

	const item = exercise.value.options.find( ( o ) => Math.abs( o.value - exercise.value.correctValue ) < 1e-9 );
	return item?.label || String( exercise.value.correctValue );
} );

nextExercise();
</script>

<style scoped>
.mono {
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
}
</style>
