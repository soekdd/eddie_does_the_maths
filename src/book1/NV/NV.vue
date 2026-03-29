<!-- i18n-ally-scope: useI18n("book1.NV") -->
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
			<p v-html="t( 'book.p1' )" />
			<p v-html="t( 'book.p2' )" />
			<p v-html="t( 'book.p3' )"/>
		</div>
	</template>

	<template #descriptionPart>
		<h2 id="lektionen" class="mt-8">{{ t( "sections.lessonsTitle" ) }}</h2>
		<div class="eddie">
			<v-expansion-panels v-model="openLessonPanel" variant="accordion">
				<v-expansion-panel v-for="item in lessons" :key="item.id">
					<v-expansion-panel-title>{{ item.title }}</v-expansion-panel-title>
					<v-expansion-panel-text class="lessonBody" eager>
						<p v-for="(paragraph, pIdx) in item.text" :key="`${item.id}-p-${pIdx}`">
							{{ paragraph }}
						</p>

						<div v-if="item.formulas.length" class="kbox mb-3">
							<Katex aligned
								as="div"
								display
								:tex="lessonFormulaBlock( item.formulas )"
							/>
						</div>

						<h4 class="lessonHeading">{{ t( "sections.stepsTitle" ) }}</h4>
						<ol class="lessonSteps">
							<li v-for="(step, sIdx) in item.steps" :key="`${item.id}-s-${sIdx}`">
								{{ step }}
							</li>
						</ol>

						<h4 class="lessonHeading">{{ t( "sections.practiceTitle" ) }}</h4>
						<ul class="lessonList">
							<li v-for="(task, tIdx) in item.practice" :key="`${item.id}-t-${tIdx}`">
								{{ task }}
							</li>
						</ul>

						<p v-if="item.note" class="muted mt-2">
							{{ item.note }}
						</p>
					</v-expansion-panel-text>
				</v-expansion-panel>
			</v-expansion-panels>

			<EddieComment :subtitle="t( 'sections.noteTitle' )">
				{{ t( "sections.noteBody" ) }}
			</EddieComment>
		</div>
	</template>

	<template #interactivePart>
		<h2 id="interaktiv">{{ t( "sections.interactiveTitle" ) }}</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p v-html="t( 'sections.interactiveBody' )"/>
			<v-select
				v-model="interactiveMode"
				class="w-100"
				hide-details="auto"
				item-title="label"
				item-value="value"
				:items="interactiveModes"
				:label="t( 'sections.interactiveSelect' )"
			/>
			<component :is="activeInteractiveComponent" />
		</div>
	</template>
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "@/utils/i18n.mjs";
import titleImg from "./NV.webp";
import NVAzimut from "./NV_Azimut.vue";
import NVBayes from "./NV_Bayes.vue";
import NVSchnitt from "./NV_Schnitt.vue";
import NVZeit from "./NV_Zeit.vue";

const { t, tm } = useI18n( "book1.NV" );

const subChapter = computed( () => tm( "subChapter" ) ?? {} );
const lessons = computed( () => tm( "lessons" ) ?? [] );
const interactiveModes = computed( () => tm( "interactiveModes" ) ?? [] );

const interactiveMode = ref( "schnitt" );
const openLessonPanel = ref( 0 );

const addAlignmentTab = ( formula ) => {
	if ( formula.includes( "&" ) ) {
		return formula;
	}

	const equalIndex = formula.indexOf( "=" );
	const approxIndex = formula.indexOf( "\\approx" );

	if ( equalIndex !== -1 && ( approxIndex === -1 || equalIndex < approxIndex ) ) {
		return `${formula.slice( 0, equalIndex )}&=${formula.slice( equalIndex + 1 )}`;
	}

	if ( approxIndex !== -1 ) {
		return formula.replace( "\\approx", "&\\approx" );
	}

	return formula;
};

const lessonFormulaBlock = ( formulas ) => formulas.map( addAlignmentTab ).join( " \\\\ " );

const interactiveComponentMap = {
	schnitt: NVSchnitt,
	azimut:  NVAzimut,
	zeit:    NVZeit,
	bayes:   NVBayes
};

const activeInteractiveComponent = computed( () => {
	return interactiveComponentMap[ interactiveMode.value ] ?? NVSchnitt;
} );
</script>

<style scoped>
.lessonBody {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.lessonHeading {
	margin: 4px 0 0;
	font-size: 0.95rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.02em;
}

.lessonSteps {
	margin: 0;
	padding-left: 1.15rem;
}

.lessonList {
	margin: 0;
	padding-left: 1.15rem;
}
</style>
