<!-- i18n-ally-scope: useI18n("book1.RC") -->
<template>
<AppFrame
	:sub-chapter
	:title="t( 'title' )"
	:vue-date="__VITE_SFC_MTIME_MS__"
>
	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer is-ai :title="t( 'imageTitle' )">
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
		<h2 id="spielzeug">{{ t( "sections.part1.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part1.p1' )" />
			<ul>
				<li>{{ t( "sections.part1.l1" ) }}</li>
				<li>{{ t( "sections.part1.l2" ) }}</li>
				<li>{{ t( "sections.part1.l3" ) }}</li>
			</ul>
			<p v-html="t( 'sections.part1.p2' )" />
		</div>

		<h2 id="permutationsmaschine" class="mt-8">{{ t( "sections.part2.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part2.p1' )" />
			<ul>
				<li>{{ t( "sections.part2.l1Before" ) }} <Katex inline tex="8!" />.</li>
				<li>{{ t( "sections.part2.l2Before" ) }} <Katex inline tex="3^8" />.</li>
				<li>{{ t( "sections.part2.l3Before" ) }} <Katex inline tex="12!" />.</li>
				<li>{{ t( "sections.part2.l4Before" ) }} <Katex inline tex="2^{12}" />.</li>
			</ul>
			<div class="kbox">
				<Katex as="div" display tex="8!\cdot 3^8\cdot 12!\cdot 2^{12}" />
			</div>
			<p v-html="t( 'sections.part2.p2' )" />
		</div>

		<h2 id="unmoegliche-zustaende" class="mt-8">{{ t( "sections.part3.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part3.p1' )" />

			<h3>{{ t( "sections.part3.cornersTitle" ) }}</h3>
			<p v-html="t( 'sections.part3.cornersP1' )" />
			<div class="kbox">
				<Katex as="div" display tex="\sum_{i=1}^{8}c_i\equiv 0\pmod 3\qquad\Longrightarrow\qquad 3^7" />
			</div>

			<h3>{{ t( "sections.part3.edgesTitle" ) }}</h3>
			<p v-html="t( 'sections.part3.edgesP1' )" />
			<div class="kbox">
				<Katex as="div" display tex="\sum_{i=1}^{12}e_i\equiv 0\pmod 2\qquad\Longrightarrow\qquad 2^{11}" />
			</div>

			<h3>{{ t( "sections.part3.parityTitle" ) }}</h3>
			<p v-html="t( 'sections.part3.parityP1' )" />
			<div class="kbox">
				<Katex as="div" display tex="\operatorname{sgn}(\pi_{\mathrm C})=\operatorname{sgn}(\pi_{\mathrm E})" />
			</div>

			<p v-html="t( 'sections.part3.p2' )" />
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="N&=\frac{8!\cdot 3^7\cdot 12!\cdot 2^{11}}{2}\\
&=43\,252\,003\,274\,489\,856\,000\\
&\approx 4.3252\cdot 10^{19}"
				/>
			</div>
			<p class="muted" v-html="t( 'sections.part3.p3' )" />
		</div>

		<h2 id="reihenfolge" class="mt-8">{{ t( "sections.part4.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part4.p1' )" />
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="a+b&=b+a\\ RU&\ne UR"
				/>
			</div>
			<p v-html="t( 'sections.part4.p2' )" />
			<p class="muted" v-html="t( 'sections.part4.p3' )" />
		</div>

		<h2 id="kommutatoren" class="mt-8">{{ t( "sections.part5.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part5.p1' )" />
			<div class="kbox">
				<Katex as="div" display tex="[A,B]=ABA^{-1}B^{-1}" />
			</div>
			<ol>
				<li>{{ t( "sections.part5.l1" ) }}</li>
				<li>{{ t( "sections.part5.l2" ) }}</li>
				<li>{{ t( "sections.part5.l3" ) }}</li>
				<li>{{ t( "sections.part5.l4" ) }}</li>
			</ol>
			<p v-html="t( 'sections.part5.p2' )" />
			<p class="muted" v-html="t( 'sections.part5.p3' )" />
		</div>

		<h2 id="konjugation" class="mt-8">{{ t( "sections.part6.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part6.p1' )" />
			<div class="kbox">
				<Katex as="div" display tex="XAX^{-1}" />
			</div>
			<p v-html="t( 'sections.part6.p2' )" />
			<p class="muted" v-html="t( 'sections.part6.p3' )" />
		</div>

		<h2 id="grenzen-1985" class="mt-8">{{ t( "sections.part7.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part7.p1' )" />
			<div class="kbox">
				<Katex
					as="div"
					display
					tex="|S_{\le d}|<N"
				/>
			</div>
			<p v-html="t( 'sections.part7.p2' )" />
			<ul>
				<li v-html="t( 'sections.part7.l1' )" />
				<li v-html="t( 'sections.part7.l2' )" />
				<li v-html="t( 'sections.part7.l3' )" />
			</ul>
			<p class="muted" v-html="t( 'sections.part7.p3' )" />
		</div>
	</template>

	<template #interactivePart>
		<h2 id="interaktiv">{{ t( "sections.interactive.title" ) }}</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p v-html="t( 'sections.interactive.p1' )" />
			<v-btn
				block
				color="primary"
				:disabled="controlsDisabled"
				variant="flat"
				@click="scrambleCube"
			>
				{{ t( "controls.scramble" ) }}
			</v-btn>

			<div class="text-subtitle-1 font-weight-medium">
				{{ t( "sections.interactive.solveTitle" ) }}
			</div>
			<v-btn
				v-for="solver in solverOptions"
				:key="solver.id"
				block
				:disabled="solverDisabled( solver.id )"
				:variant="selectedSolver === solver.id ? 'flat' : 'tonal'"
				@click="solveCube( solver.id )"
			>
				{{ t( solver.label ) }}
			</v-btn>

			<v-alert v-if="solutionExplanation" type="info" variant="tonal">
				<div class="text-subtitle-1 font-weight-medium mb-2">
					{{ solutionExplanation.title }}
				</div>
				<p>{{ solutionExplanation.p1 }}</p>
				<p class="mb-0">{{ solutionExplanation.p2 }}</p>
			</v-alert>
		</div>
	</template>

	<template #calculationPart>
		<h2 id="wuerfel">{{ t( "sections.cube.title" ) }}</h2>
		<RCRubikCube ref="rubikCube" />
	</template>

	<template #summaryPart>
		<v-alert type="info" variant="tonal">
			<div class="text-subtitle-1 font-weight-medium mb-2">
				{{ t( "sections.godsNumber.title" ) }}
			</div>
			<p>
				{{ t( "sections.godsNumber.p1Before" ) }}
				<Katex inline tex="D=20" />.
				{{ t( "sections.godsNumber.p1After" ) }}
			</p>
			<p class="mb-0">
				{{ t( "sections.godsNumber.p2Before" ) }}
				<Katex inline tex="18\le D\le 52" />.
			</p>
		</v-alert>
	</template>

	<template #footer>
		<div class="text-caption">
			<p class="muted">{{ t( "footer.creditsIntro" ) }}</p>
			<ul class="muted">
				<li>
					<a href="https://github.com/pglass/cube">pglass/cube</a>:
					{{ t( "footer.pglass" ) }}
				</li>
				<li>
					<a href="https://github.com/slammayjammay/rubiks-cube-solver">rubiks-cube-solver</a>:
					{{ t( "footer.rubiksCubeSolver" ) }}
				</li>
				<li>
					<a href="https://github.com/torjusti/cube-solver">cube-solver</a>:
					{{ t( "footer.cubeSolver" ) }}
				</li>
			</ul>
			<!-- <p class="muted">{{ t( "footer.licenseNote" ) }}</p> -->
		</div>
	</template>
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "@/utils/i18n.mjs";
import RCRubikCube from "./RC_RubikCube.vue";
import titleImg from "./RC.webp";

const { t, tm } = useI18n( "book1.RC" );

const solverOptions = [
	{ id: "history", label: "controls.GodsSolver" },
	{ id: "beginner", label: "controls.beginnerMethodSolver" },
	{ id: "cfop", label: "controls.cfopMethodSolver" },
	{ id: "roux", label: "controls.rouxMethodSolver" },
	{ id: "thistlethwaite", label: "controls.thistlethwaiteSolver" }
];
const rubikCube = ref( null );
const selectedSolver = ref( null );
const subChapter = computed( () => tm( "subChapter" ) ?? {} );
const controlsDisabled = computed( () => rubikCube.value?.controlsDisabled ?? true );
const historySolveDisabled = computed( () => rubikCube.value?.solveDisabled ?? true );
const methodSolveDisabled = computed( () => rubikCube.value?.methodSolveDisabled ?? true );
const solutionExplanation = computed( () => {
	if ( !selectedSolver.value ) {
		return null;
	}

	const key = `solutionMethods.${selectedSolver.value}`;
	return {
		p1:    t( `${key}.p1` ),
		p2:    t( `${key}.p2` ),
		title: t( `${key}.title` )
	};
} );

function solverDisabled( solverId ) {
	return solverId === "history" ? historySolveDisabled.value : methodSolveDisabled.value;
}

function scrambleCube() {
	if ( controlsDisabled.value ) {
		return;
	}

	selectedSolver.value = null;
	rubikCube.value?.scramble();
}

async function solveCube( solverId ) {
	if ( solverDisabled( solverId ) ) {
		return;
	}

	selectedSolver.value = solverId;
	await rubikCube.value?.solve( solverId );
}
</script>
