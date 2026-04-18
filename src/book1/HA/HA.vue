<!-- i18n-ally-scope: useI18n("book1.HA") -->
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
		<h3 id="einleitung">{{ t( "subChapter.einleitung" ) }}</h3>
		<div class="eddie">
			{{ t( "bookPart.introText" ) }}
		</div>
	</template>

	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="t( 'description.figureTitle' )">
				<HATree />
			</ImageZoomer>
		</figure>

		<h2 id="baumgedanke">{{ t( "description.sections.baumgedanke.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'description.sections.baumgedanke.p1' )" />
			<ul class="haCodeList">
				<li v-for="choice in symbolChoices" :key="choice.symbol">
					<strong>{{ choice.label }}</strong> <code>{{ choice.symbol }}</code>
				</li>
			</ul>
			<p v-html="t( 'description.sections.baumgedanke.p2' )" />
			<p v-html="t( 'description.sections.baumgedanke.rootIntro' )" />
			<ul class="haCodeList">
				<li v-for="example in rootExamples" :key="example.letter">
					<code>{{ example.letter }} = {{ example.code }}</code>
				</li>
			</ul>
			<p v-html="t( 'description.sections.baumgedanke.levelIntro' )" />
			<ul class="haCodeList">
				<li v-for="example in levelExamples" :key="example.letter">
					<code>{{ example.letter }} = {{ example.code }}</code>
				</li>
			</ul>
			<p v-html="t( 'description.sections.baumgedanke.p3' )" />
			<div class="haLeadBox">
				<strong>{{ t( "description.sections.baumgedanke.lead1" ) }}</strong>
			</div>
			<p v-html="t( 'description.sections.baumgedanke.p4' )" />
			<div class="haLeadBox">
				<strong>{{ t( "description.sections.baumgedanke.lead2" ) }}</strong>
			</div>
		</div>

		<h2 id="tiefe" class="mt-8">{{ t( "description.sections.tiefe.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'description.sections.tiefe.p1' )" />
			<div class="haLeadBox">
				{{ t( "description.sections.tiefe.lead" ) }}
			</div>
			<p v-html="t( 'description.sections.tiefe.p2' )" />
			<ul>
				<li v-for="cost in timingCosts" :key="cost.label">
					<strong>{{ cost.label }}</strong> <span class="mono">{{ cost.value }}</span>
				</li>
			</ul>
			<p v-html="t( 'description.sections.tiefe.p3' )" />
		</div>

		<h2 id="zeitformel" class="mt-8">{{ t( "description.sections.zeitformel.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'description.sections.zeitformel.p1' )" />
			<ul>
				<li v-for="part in formulaParts" :key="part.symbol">
					<Katex :tex="part.symbol" />: {{ part.text }}
				</li>
			</ul>
			<p v-html="t( 'description.sections.zeitformel.p2' )" />
			<div class="kbox">
				<Katex as="div" display :tex="tex.durationFormula" />
			</div>
			<p v-html="t( 'description.sections.zeitformel.p3' )" />
			<ul>
				<li v-for="reason in formulaReasons" :key="reason">
					{{ reason }}
				</li>
			</ul>
		</div>

		<h2 id="beispiele" class="mt-8">{{ t( "description.sections.beispiele.title" ) }}</h2>
		<v-row dense>
			<v-col
				v-for="example in exampleCards"
				:key="example.key"
				cols="12"
				md="6"
			>
				<v-card class="haExampleCard pa-4 fill-height" variant="outlined">
					<h3>{{ example.title }}</h3>
					<p class="haCodeLine">
						<code>{{ example.title }} = {{ example.code }}</code>
					</p>
					<ul class="haFactList">
						<li v-for="fact in example.facts" :key="fact">
							{{ fact }}
						</li>
					</ul>
					<div class="kbox mb-0">
						<Katex as="div" display :tex="example.tex" />
					</div>
				</v-card>
			</v-col>
		</v-row>

		<h2 id="ueberraschung" class="mt-8">{{ t( "description.sections.ueberraschung.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'description.sections.ueberraschung.p1' )" />
			<ul>
				<li v-for="item in surpriseItems" :key="item" v-html="item"></li>
			</ul>
			<p v-html="t( 'description.sections.ueberraschung.p2' )" />
			<div class="haLeadBox">
				<strong>{{ t( "description.sections.ueberraschung.lead1" ) }}</strong>
			</div>
			<p v-html="t( 'description.sections.ueberraschung.p3' )" />
			<div class="haLeadBox">
				<strong>{{ t( "description.sections.ueberraschung.lead2" ) }}</strong>
			</div>
		</div>

		<h2 id="optimierung" class="mt-8">{{ t( "description.sections.optimierung.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'description.sections.optimierung.p1' )" />
			<p v-html="t( 'description.sections.optimierung.p2' )" />
			<div class="kbox">
				<Katex as="div" display :tex="tex.expectationFormula" />
			</div>
			<p v-html="t( 'description.sections.optimierung.p3' )" />
			<ul>
				<li v-for="goal in optimizationGoals" :key="goal">
					{{ goal }}
				</li>
			</ul>
			<p v-html="t( 'description.sections.optimierung.p4' )" />
		</div>

		<h2 id="huffman" class="mt-8">{{ t( "description.sections.huffman.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'description.sections.huffman.p1' )" />
			<ul>
				<li v-for="item in huffmanSimilarities" :key="item">
					{{ item }}
				</li>
			</ul>
			<p v-html="t( 'description.sections.huffman.p2' )" />
			<ul class="haCodeList">
				<li v-for="example in prefixExamples" :key="example.letter">
					<code>{{ example.letter }} = {{ example.code }}</code>
				</li>
			</ul>
		</div>

		<v-row dense>
			<v-col cols="12" md="6">
				<v-card class="haInfoCard pa-4 fill-height" variant="outlined">
					<h3>{{ t( "description.sections.huffman.cards.huffman.title" ) }}</h3>
					<p v-html="t( 'description.sections.huffman.cards.huffman.text' )" />
				</v-card>
			</v-col>
			<v-col cols="12" md="6">
				<v-card class="haInfoCard pa-4 fill-height" variant="outlined">
					<h3>{{ t( "description.sections.huffman.cards.morse.title" ) }}</h3>
					<p v-html="t( 'description.sections.huffman.cards.morse.text' )" />
				</v-card>
			</v-col>
		</v-row>

		<div class="eddie">
			<p v-html="t( 'description.sections.huffman.p3' )" />
			<div class="haLeadBox">
				<strong>{{ t( "description.sections.huffman.lead" ) }}</strong>
			</div>
		</div>

		<h2 id="menschen-code" class="mt-8">{{ t( "description.sections.menschenCode.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'description.sections.menschenCode.p1' )" />
			<ul>
				<li v-for="strength in strengths" :key="strength">
					{{ strength }}
				</li>
			</ul>
			<p v-html="t( 'description.sections.menschenCode.p2' )" />
			<ul>
				<li v-for="point in compromisePoints" :key="point">
					{{ point }}
				</li>
			</ul>
		</div>

		<h2 id="pointe" class="mt-8">{{ t( "description.sections.pointe.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'description.sections.pointe.p1' )" />
			<div class="haLeadBox">
				{{ t( "description.sections.pointe.lead1" ) }}
			</div>
			<p v-html="t( 'description.sections.pointe.p2' )" />
			<div class="haLeadBox">
				<strong>{{ t( "description.sections.pointe.lead2" ) }}</strong>
			</div>
		</div>

		<h2 id="eddies-schluss" class="mt-8">{{ t( "description.sections.eddie.title" ) }}</h2>
		<EddieComment :subtitle="t( 'description.sections.eddie.subtitle' )">
			<p v-html="t( 'description.sections.eddie.p1' )" />
			<p v-html="t( 'description.sections.eddie.p2' )" />
			<p v-html="t( 'description.sections.eddie.p3' )" />
			<p v-html="t( 'description.sections.eddie.p4' )" />
		</EddieComment>
	</template>

	<template #summaryPart>
		<v-sheet border class="mb-6 pa-3" rounded="xl">
			<div class="d-flex flex-wrap align-center justify-space-between ga-3">
				<div class="text-subtitle-1 font-weight-medium">
					{{ t( "title" ) }}
				</div>
				<v-btn-toggle
					v-model="visibleMode"
					color="primary"
					divided
					mandatory
					rounded="xl"
				>
					<v-btn value="encoder">
						{{ t( "subChapter.encoder" ) }}
					</v-btn>
					<v-btn value="decoder">
						{{ t( "subChapter.decoder" ) }}
					</v-btn>
				</v-btn-toggle>
			</div>
		</v-sheet>

		<div v-if="visibleMode === 'encoder'" id="encoder">
			<HAEncoder
				v-model="encoderInput"
				@update:output="handleEncodedOutput"
			/>
		</div>
		<div v-else id="decoder">
			<HADecoder
				v-model="decoderInput"
				@update:output="handleDecodedOutput"
			/>
		</div>
	</template>
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "@/utils/i18n.mjs";
import HADecoder from "./HA_Decoder.vue";
import HAEncoder from "./HA_Encoder.vue";
import HATree from "./HA_Tree.vue";
import titleImg from "./HA.webp";

const { t, tm } = useI18n( "book1.HA" );

const visibleMode = ref( "decoder" );
const encoderInput = ref( "" );
const decoderInput = ref( "" );

const tex = {
	durationFormula:    String.raw`\tau = d + 3s + (k-1)`,
	expectationFormula: String.raw`\sum_i p_i \tau_i`,
	exampleFormulas:    {
		e: String.raw`\tau(E)=1+0+(1-1)=1`,
		t: String.raw`\tau(T)=0+3+(1-1)=3`,
		i: String.raw`\tau(I)=2+0+(2-1)=3`,
		a: String.raw`\tau(A)=1+3+(2-1)=5`,
		s: String.raw`\tau(S)=3+0+(3-1)=5`
	}
};

function handleEncodedOutput( nextValue ) {
	decoderInput.value = String( nextValue ?? "" );
}

function handleDecodedOutput( nextValue ) {
	encoderInput.value = String( nextValue ?? "" );
}

const subChapter = computed( () => {
	const labels = tm( "subChapter" ) ?? {};

	return {
		baumgedanke:           labels.baumgedanke,
		tiefe:                 labels.tiefe,
		zeitformel:            labels.zeitformel,
		beispiele:             labels.beispiele,
		ueberraschung:         labels.ueberraschung,
		optimierung:           labels.optimierung,
		huffman:               labels.huffman,
		"menschen-code":       labels[ "menschen-code" ],
		pointe:                labels.pointe,
		"eddies-schluss":      labels[ "eddies-schluss" ],
		[ visibleMode.value ]: labels[ visibleMode.value ]
	};
} );

const symbolChoices = computed( () => tm( "description.sections.baumgedanke.choices" ) ?? [] );
const rootExamples = computed( () => tm( "description.sections.baumgedanke.rootExamples" ) ?? [] );
const levelExamples = computed( () => tm( "description.sections.baumgedanke.levelExamples" ) ?? [] );
const timingCosts = computed( () => tm( "description.sections.tiefe.costs" ) ?? [] );
const formulaParts = computed( () => tm( "description.sections.zeitformel.parts" ) ?? [] );
const formulaReasons = computed( () => tm( "description.sections.zeitformel.reasons" ) ?? [] );
const surpriseItems = computed( () => tm( "description.sections.ueberraschung.items" ) ?? [] );
const optimizationGoals = computed( () => tm( "description.sections.optimierung.goals" ) ?? [] );
const huffmanSimilarities = computed( () => tm( "description.sections.huffman.similarities" ) ?? [] );
const prefixExamples = computed( () => tm( "description.sections.huffman.prefixExamples" ) ?? [] );
const strengths = computed( () => tm( "description.sections.menschenCode.strengths" ) ?? [] );
const compromisePoints = computed( () => tm( "description.sections.menschenCode.compromises" ) ?? [] );

const exampleCards = computed( () => {
	const cards = tm( "description.sections.beispiele.cards" ) ?? [];

	return cards.map( ( card ) => ( {
		...card,
		tex: tex.exampleFormulas[ card.key ] ?? ""
	} ) );
} );
</script>

<style scoped>
.haLeadBox {
	margin: 1rem 0;
	padding: 0.9rem 1rem;
	border-left: 4px solid rgba(var(--v-theme-primary), 0.55);
	border-radius: 0 12px 12px 0;
	background: rgba(var(--v-theme-primary), 0.08);
}

.haCodeList {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem 1.25rem;
	padding-left: 1.25rem;
}

.haCodeLine {
	margin-bottom: 0.9rem;
}

.haExampleCard,
.haInfoCard {
	border-color: rgba(0, 0, 0, 0.12);
}

.haExampleCard h3,
.haInfoCard h3 {
	margin-bottom: 0.65rem;
}

.haExampleCard p,
.haInfoCard p {
	margin-bottom: 0;
}

.haFactList {
	margin-bottom: 1rem;
	padding-left: 1.25rem;
}

.haFactList li + li {
	margin-top: 0.35rem;
}

code {
	font-family: var(--mono);
}
</style>
