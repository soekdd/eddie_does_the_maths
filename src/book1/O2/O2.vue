<!-- i18n-ally-scope: useI18n("book1.O2") -->
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
			<p v-html="t( 'book.p1' )"/>
			<p v-html="t( 'book.p2' )"/>
			<p v-html="t( 'book.p3' )"/>
			<p v-html="t( 'book.p4' )"/>
		</div>
	</template>

	<template #descriptionPart>
		<h2>{{ t( "sections.part1.title" ) }}</h2>
		<div class="eddie">
			<p class="muted"><i>{{ t( "sections.part1.meta" ) }}</i></p>
			<p v-html="t( 'sections.part1.p1' )" />
			<div class="kbox">
				<Katex as="div" display tex="M=\{1,2,3,\dots,n-1\}" />
			</div>
			<p v-html="t( 'sections.part1.p2' )" />
			<p v-html="t( 'sections.part1.rule1' )" />
			<p v-html="t( 'sections.part1.rule2' )" />
			<p v-html="t( 'sections.part1.prove' )" />
		</div>

		<h2 id="wahrscheinlichkeiten" class="mt-8">{{ t( "sections.part2.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part2.p1' )" />
			<ul>
				<li v-html="t( 'sections.part2.l1' )" />
				<li v-html="t( 'sections.part2.l2' )" />
			</ul>
			<p v-html="t( 'sections.part2.p2' )" />
			<div class="kbox">
				<Katex as="div" display tex="k,\;2k,\;3k,\;\dots,\;(n-1)k \quad (\bmod n)." />
			</div>
			<p v-html="t( 'sections.part2.p3' )" />
			<p v-html="t( 'sections.part2.p4' )" />
		</div>

		<h2 id="entscheidungsbaum" class="mt-8">{{ t( "sections.part3.title" ) }}</h2>
		<div class="eddie">
			<h3 v-html="t( 'sections.part3.step1Title' )" />
			<p v-html="t( 'sections.part3.step1p1' )"/>
			<div class="kbox">
				<Katex as="div" display tex="k,\;2k,\;3k,\;\dots,\;(n-1)k \quad (\bmod n)" />
			</div>
			<p v-html="t( 'sections.part3.step1p2' )" />
			<p v-html="t( 'sections.part3.step1p3' )" />
			<div class="kbox">
				<Katex as="div" display tex="ak \equiv bk \pmod n." />
			</div>
			<p v-html="t( 'sections.part3.step1p4' )"/>
			<div class="kbox">
				<Katex as="div" display tex="(a-b)k \equiv 0 \pmod n," />
			</div>
			<p v-html="t( 'sections.part3.step1p5' )" />
			<div class="kbox">
				<Katex as="div" display tex="a-b \equiv 0 \pmod n." />
			</div>
			<p v-html="t( 'sections.part3.step1p6' )" />

			<h3 class="mt-6" v-html="t( 'sections.part3.step2Title' )" />
			<p v-html="t( 'sections.part3.step2p1' )" />
			<p v-html="t( 'sections.part3.step2p2' )" />
			<div class="kbox">
				<Katex as="div" display tex="(i+1)k=ik+k" />
			</div>
			<p v-html="t( 'sections.part3.step2p3' )" />
			<div class="kbox">
				<Katex as="div" display tex="r_{i+1}\equiv r_i+k \pmod n." />
			</div>
			<p v-html="t( 'sections.part3.step2p4' )"/>

			<h4>{{ t( "sections.part3.caseATitle" ) }}</h4>
			<p v-html="t( 'sections.part3.caseAp1' )"/>
			<div class="kbox">
				<Katex as="div" display tex="r_{i+1}=r_i+k." />
			</div>
			<p v-html="t( 'sections.part3.caseAp2' )"/>
			<div class="kbox">
				<Katex as="div" display tex="r_i=r_{i+1}-k=|r_{i+1}-k|." />
			</div>
			<p v-html="t( 'sections.part3.caseAp3' )" />

			<h4>{{ t( "sections.part3.caseBTitle" ) }}</h4>
			<p v-html="t( 'sections.part3.caseBp1' )"/>
			<div class="kbox">
				<Katex as="div" display tex="r_{i+1}=r_i+k-n \quad\Rightarrow\quad r_i=r_{i+1}+n-k." />
			</div>
			<p v-html="t( 'sections.part3.caseBp2' )"/>
			<div class="kbox">
				<Katex as="div" display tex="t:=k-r_{i+1}." />
			</div>
			<p v-html="t( 'sections.part3.caseBp3' )" />
			<p v-html="t( 'sections.part3.caseBp4' )"/>
			<ul>
				<li v-html="t( 'sections.part3.caseBl1' )" />
				<li v-html="t( 'sections.part3.caseBl2' )" />
			</ul>
			<p v-html="t( 'sections.part3.caseBp5' )" />
			<p v-html="t( 'sections.part3.caseBp6' )" />
			<p v-html="t( 'sections.part3.caseBp7' )" />
			<p v-html="t( 'sections.part3.step2p5' )" />

			<h3 class="mt-6" v-html="t( 'sections.part3.step3Title' )" />
			<p v-html="t( 'sections.part3.step3p1' )" />
			<p v-html="t( 'sections.part3.step3p2' )" />
			<div class="kbox">
				<Katex as="div" display :tex="t( 'sections.part3.step3Box' )" />
			</div>
		</div>

		<EddieComment :subtitle="t( 'sections.part3.commentTitle' )">
			<ol>
				<li v-for="(item, idx) in commentItems" :key="`comment-${idx}`" v-html="item" />
			</ol>
		</EddieComment>
	</template>

	<template #interactivePart>
		<h2 id="rechner">{{ t( "sections.interactive.title" ) }}</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p v-html="t( 'sections.interactive.intro' )"/>

			<div class="d-flex flex-wrap ga-3 align-center">
				<v-text-field
					v-model.number="n"
					hide-details="auto"
					:label="t( 'sections.interactive.labels.n' )"
					min="2"
					step="1"
					style="max-width: 160px"
					type="number"
				/>
				<v-text-field
					v-model.number="k"
					hide-details="auto"
					:label="t( 'sections.interactive.labels.k' )"
					:max="Math.max( 1, n - 1 )"
					:min="1"
					step="1"
					style="max-width: 160px"
					type="number"
				/>
				<v-btn color="primary" variant="flat" @click="runCheck">
					{{ t( "sections.interactive.labels.check" ) }}
				</v-btn>
				<v-btn variant="tonal" @click="randomCoprime">
					{{ t( "sections.interactive.labels.random" ) }}
				</v-btn>
			</div>

			<v-alert v-if="error" type="error" variant="tonal">
				{{ error }}
			</v-alert>

			<v-sheet v-if="result" class="pa-3 rounded">
				<div class="d-flex flex-column ga-2">
					<div>
						<strong>{{ t( "sections.interactive.labels.checkLabel" ) }}</strong>
						<span>{{ t( "sections.interactive.labels.gcd", { value: result.g } ) }}</span>
						<span class="mx-2">•</span>
						<span>{{ t( "sections.interactive.labels.components", { value: result.components.length } ) }}</span>
						<span class="mx-2">•</span>
						<span>
							{{ t( "sections.interactive.labels.connected" ) }}
							<strong>
								{{ result.components.length === 1
									? t( "sections.interactive.labels.yes" )
									: t( "sections.interactive.labels.no" ) }}
							</strong>
						</span>
					</div>

					<div v-if="result.components.length === 1">
						<v-alert
							class="mt-2"
							type="success"
							variant="tonal"
							v-html="t( 'sections.interactive.result.connected' )"
						/>
					</div>
					<div v-else>
						<v-alert
							class="mt-2"
							type="warning"
							variant="tonal"
							v-html="t( 'sections.interactive.result.disconnected' )"
						/>
					</div>

					<div class="mt-2">
						<strong>{{ t( "sections.interactive.labels.componentSizes" ) }}</strong>
						<span class="ml-2">{{ result.components.map( ( c ) => c.length ).join( ", " ) }}</span>
					</div>
				</div>
			</v-sheet>
		</div>
	</template>

	<template #calculationPart>
		<h2>{{ t( "sections.calc.title" ) }}</h2>
		<div class="eddie d-flex flex-column ga-2">
			<div class="text-body-2" v-html="t( 'sections.calc.intro' )" />

			<v-sheet class="pa-3 rounded">
				<div class="text-subtitle-2 mb-2">{{ t( "sections.calc.orderTitle" ) }}</div>
				<div class="d-flex flex-wrap ga-2">
					<v-chip
						v-for="(x, idx) in chain"
						:key="idx"
						:color="idx < visitedStepCount ? 'primary' : undefined"
						size="small"
						:variant="idx < visitedStepCount ? 'flat' : 'tonal'"
					>
						{{ x }}
					</v-chip>
				</div>
			</v-sheet>

			<v-sheet class="pa-3 rounded">
				<div class="text-subtitle-2 mb-2">{{ t( "sections.calc.sortedTitle" ) }}</div>
				<div class="d-flex flex-wrap ga-2">
					<v-chip
						v-for="x in sortedTargets"
						:key="`sorted-${x}`"
						:color="visitedTargetSet.has( x ) ? 'primary' : undefined"
						size="small"
						:variant="visitedTargetSet.has( x ) ? 'flat' : 'tonal'"
					>
						{{ x }}
					</v-chip>
				</div>
				<div class="d-flex flex-wrap align-center ga-2 mt-3">
					<v-btn
						:disabled="!chain.length"
						size="small"
						variant="flat"
						@click="startAnimation"
					>
						{{ visitedStepCount >= chain.length ? t( "sections.calc.restart" ) : t( "sections.calc.start" ) }}
					</v-btn>
					<v-btn
						:disabled="!chain.length && visitedStepCount === 0"
						size="small"
						variant="tonal"
						@click="resetAnimation"
					>
						{{ t( "sections.calc.reset" ) }}
					</v-btn>
					<span class="text-caption">
						{{ t( "sections.calc.steps", { current: visitedStepCount, total: chain.length } ) }}
					</span>
					<span v-if="currentVisitedValue !== null" class="text-caption">
						{{ t( "sections.calc.current", { value: currentVisitedValue } ) }}
					</span>
				</div>
			</v-sheet>

			<v-expansion-panels class="mt-2" variant="accordion">
				<v-expansion-panel>
					<v-expansion-panel-title>{{ t( "sections.calc.detailsTitle" ) }}</v-expansion-panel-title>
					<v-expansion-panel-text class="d-flex flex-column ga-3" eager>
						<div class="text-body-2" v-html="t( 'sections.calc.detailsIntro' )" />

						<v-sheet v-if="transitions.length" class="pa-3 rounded">
							<div class="text-subtitle-2 mb-2">{{ t( "sections.calc.transitionsTitle" ) }}</div>
							<div class="d-flex flex-column ga-2">
								<div
									v-for="transition in transitions"
									:key="transition.i"
									class="d-flex flex-wrap align-center ga-2"
								>
									<v-chip size="x-small">i={{ transition.i }}</v-chip>
									<span><strong>{{ transition.r }}</strong> → <strong>{{ transition.s }}</strong></span>
									<v-chip size="x-small" variant="tonal">{{ transition.caseLabel }}</v-chip>
									<span class="text-body-2">{{ transition.explain }}</span>
								</div>
							</div>
						</v-sheet>
					</v-expansion-panel-text>
				</v-expansion-panel>
			</v-expansion-panels>
		</div>
	</template>

	<template #footer>
		<p class="muted">
			{{ t( "footer.label" ) }}
			<a href="https://prase.cz/kalva/imo/isoln/isoln852.html">{{ t( "footer.link" ) }}</a>
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import {
	computed, onBeforeUnmount, ref, watch
} from "vue";
import { useI18n } from "@/utils/i18n.mjs";
import titleImg from "./O2.webp";

const { t, tm } = useI18n( "book1.O2" );

const subChapter = computed( () => tm( "subChapter" ) ?? {} );
const commentItems = computed( () => tm( "sections.part3.commentItems" ) ?? [] );

const n = ref( 10 );
const k = ref( 3 );
const error = ref( "" );
const result = ref( null );
const ANIMATION_STEP_MS = 500;
const canUseAnimationTimer = typeof window !== "undefined";
const visitedStepCount = ref( 0 );
const animationTimerId = ref( null );

const chain = computed( () => {
	const nn = Number( n.value );
	const kk = Number( k.value );

	if ( !Number.isInteger( nn ) || !Number.isInteger( kk ) || nn < 2 || kk < 1 || kk >= nn ) {
		return [];
	}

	const out = [];

	for ( let i = 1; i <= nn - 1; i++ ) {
		out.push( mod( i * kk, nn ) );
	}

	return out;
} );

const sortedTargets = computed( () => {
	const nn = Number( n.value );

	if ( !Number.isInteger( nn ) || nn < 2 ) {
		return [];
	}

	return Array.from( { length: nn - 1 }, ( _, idx ) => idx + 1 );
} );

const visitedTargetSet = computed( () => {
	const set = new Set();
	const limit = Math.min( visitedStepCount.value, chain.value.length );

	for ( let idx = 0; idx < limit; idx++ ) {
		const value = chain.value[ idx ];

		if ( Number.isInteger( value ) && value >= 1 ) {
			set.add( value );
		}
	}

	return set;
} );

const currentVisitedValue = computed( () => {
	if ( visitedStepCount.value <= 0 || visitedStepCount.value > chain.value.length ) {
		return null;
	}

	return chain.value[ visitedStepCount.value - 1 ];
} );

const transitions = computed( () => {
	const nn = Number( n.value );
	const kk = Number( k.value );

	if ( !Number.isInteger( nn ) || !Number.isInteger( kk ) || nn < 2 || kk < 1 || kk >= nn ) {
		return [];
	}

	const out = [];

	for ( let i = 1; i <= nn - 2; i++ ) {
		const r = mod( i * kk, nn );
		const s = mod( ( i + 1 ) * kk, nn );
		const noWrap = r + kk < nn && s === r + kk;

		if ( noWrap ) {
			out.push( {
				i,
				r,
				s,
				caseLabel: t( "sections.calc.transitions.caseA" ),
				explain:   t( "sections.calc.transitions.explainA" )
			} );
			continue;
		}

		out.push( {
			i,
			r,
			s,
			caseLabel: t( "sections.calc.transitions.caseB" ),
			explain:   t( "sections.calc.transitions.explainB" )
		} );
	}

	return out;
} );

function stopAnimation() {
	if ( !canUseAnimationTimer ) {
		return;
	}

	if ( animationTimerId.value !== null ) {
		window.clearInterval( animationTimerId.value );
		animationTimerId.value = null;
	}
}

function resetAnimation() {
	stopAnimation();
	visitedStepCount.value = 0;
}

function startAnimation() {
	if ( !chain.value.length ) {
		resetAnimation();
		return;
	}

	if ( visitedStepCount.value >= chain.value.length ) {
		visitedStepCount.value = 0;
	}

	if ( !canUseAnimationTimer ) {
		return;
	}

	stopAnimation();
	animationTimerId.value = window.setInterval( () => {
		if ( visitedStepCount.value < chain.value.length ) {
			visitedStepCount.value += 1;
			return;
		}

		stopAnimation();
	}, ANIMATION_STEP_MS );
}

function mod( a, m ) {
	const r = a % m;
	return r < 0 ? r + m : r;
}

function gcd( a, b ) {
	a = Math.abs( a );
	b = Math.abs( b );

	while ( b !== 0 ) {
		const temp = a % b;
		a = b;
		b = temp;
	}

	return a;
}

function buildGraph( nn, kk ) {
	const adj = Array.from( { length: nn }, () => [] );

	const addEdge = ( u, v ) => {
		if ( u === v ) {
			return;
		}

		adj[ u ].push( v );
		adj[ v ].push( u );
	};

	for ( let i = 1; i <= nn - 1; i++ ) {
		const j = nn - i;

		if ( j >= 1 && j <= nn - 1 ) {
			addEdge( i, j );
		}
	}

	for ( let i = 1; i <= nn - 1; i++ ) {
		if ( i === kk ) {
			continue;
		}

		const j = Math.abs( i - kk );

		if ( j >= 1 && j <= nn - 1 ) {
			addEdge( i, j );
		}
	}

	return adj;
}

function connectedComponents( adj, nn ) {
	const seen = Array( nn ).fill( false );
	const comps = [];

	for ( let start = 1; start <= nn - 1; start++ ) {
		if ( seen[ start ] ) {
			continue;
		}

		const q = [ start ];
		seen[ start ] = true;
		const comp = [ start ];

		for ( let qi = 0; qi < q.length; qi++ ) {
			const u = q[ qi ];

			for ( const v of adj[ u ] ) {
				if ( !seen[ v ] ) {
					seen[ v ] = true;
					q.push( v );
					comp.push( v );
				}
			}
		}

		comp.sort( ( a, b ) => a - b );
		comps.push( comp );
	}

	comps.sort( ( a, b ) => b.length - a.length );
	return comps;
}

function runCheck() {
	error.value = "";
	result.value = null;

	const nn = Number( n.value );
	const kk = Number( k.value );

	if ( !Number.isInteger( nn ) || !Number.isInteger( kk ) ) {
		error.value = t( "sections.interactive.errors.integers" );
		return;
	}

	if ( nn < 2 ) {
		error.value = t( "sections.interactive.errors.minN" );
		return;
	}

	if ( kk < 1 || kk >= nn ) {
		error.value = t( "sections.interactive.errors.rangeK" );
		return;
	}

	const g = gcd( nn, kk );
	const adj = buildGraph( nn, kk );
	const components = connectedComponents( adj, nn );

	result.value = {
		g,
		components
	};
}

function randomCoprime() {
	error.value = "";
	const nn = Math.max( 5, Math.min( 200, Math.floor( 5 + Math.random() * 46 ) ) );
	let kk = 1 + Math.floor( Math.random() * ( nn - 1 ) );

	while ( gcd( nn, kk ) !== 1 ) {
		kk = 1 + Math.floor( Math.random() * ( nn - 1 ) );
	}

	n.value = nn;
	k.value = kk;
	runCheck();
}

watch(
	chain,
	() => {
		resetAnimation();
		startAnimation();
	},
	{ immediate: true }
);

onBeforeUnmount( () => {
	stopAnimation();
} );

runCheck();
</script>

<style scoped>
ol > li { margin: 0.35rem 0; }
</style>
