<!-- i18n-ally-scope: useI18n("book1.QC") -->
<template>
<AppFrame
	:sub-chapter
	:title="t('title')"
	:vue-date="__VITE_SFC_MTIME_MS__"
>
	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer is-ai :title="t( 'imageTitle' )">
				<img :alt="t( 'imageAlt' )" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="introduce">{{ t( "introDate" ) }}</h3>
		<div class="eddie">
			<p v-html="t('book.p1')" />
			<p v-html="t('book.p2')" />
			<p v-html="t('book.p3')" />
			<p v-html="t('book.p4')" />
			<p v-html="t('book.p5')" />
			<p v-html="t('book.p6')" />
		</div>
	</template>

	<template #descriptionPart>
		<h2 id="problem">{{ t('sections.problem.title') }}</h2>
		<div class="eddie">
			<p v-html="t('sections.problem.p1')" />
			<p v-html="t('sections.problem.p2')" />
		</div>

		<h2 id="idea" class="mt-8">{{ t('sections.idea.title') }}</h2>
		<div class="eddie">
			<p v-html="t('sections.idea.p1')" />
			<p v-html="t('sections.idea.p2')" />
			<ul>
				<li v-html="t('sections.idea.l1')" />
				<li v-html="t('sections.idea.l2')" />
			</ul>
			<p v-html="t('sections.idea.p3')" />
		</div>

		<h2 id="computer" class="mt-8">{{ t('sections.computer.title') }}</h2>
		<div class="eddie">
			<p v-html="t('sections.computer.p1')" />
			<p v-html="t('sections.computer.p2')" />
			<p v-html="t('sections.computer.p3')" />
		</div>
	</template>

	<template #interactivePart>
		<h2 id="interactive">{{ t('sections.interactive.title') }}</h2>
		<div class="eddie d-flex flex-column ga-4">
			<QCGraph
				v-model="currentIndex"
				:configurations
				:height="720"
				:intro="t('sections.interactive.intro')"
				:node-radius="5"
				:title="t('sections.interactive.graphTitle')"
				:width="720"
			/>
		</div>
	</template>

	<template #footer>
		<div class="eddie footnote">
			<p v-html="t('footnote.p1')" />
		</div>
	</template>
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";
import titleImg from "./QC.webp";
import { useI18n } from "@/utils/i18n.mjs";
import QCGraph from "./QCGraph.vue";
import rawConfigurations from "./original/U_2822.conf?raw";
import { parseU2822Conf } from "./parser";

const { t, tm } = useI18n( "book1.QC" );

const configurations = parseU2822Conf( rawConfigurations );
const currentIndex = ref( 1 );
const subChapter = computed( () => tm( "subChapter" ) ?? {} );
</script>

<style scoped>
.footnote {
  font-size: 0.95rem;
  opacity: 0.92;
}
</style>
