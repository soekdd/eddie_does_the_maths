<!-- i18n-ally-scope: useI18n("book1.FX") -->
<template>
<AppFrame
	:sub-chapter
	:title="t( 'fx.title' )"
	:vue-date="__VITE_SFC_MTIME_MS__"
>

	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="t( 'fx.imageTitle' )">
				<img :alt="t( 'fx.imageAlt' )" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">{{ t( "fx.introDate" ) }}</h3>
		<div class="eddie">
			<p v-html="t( 'fx.book.p1' )"/>
			<p v-html="t( 'fx.book.p2' )" />
			<p v-html="t( 'fx.book.p3' )"/>
			<p v-html="t( 'fx.book.p4' )"/>
		</div>
	</template>

	<template #descriptionPart>

		<h2 id="geschichte">{{ t( "fx.sections.part1.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'fx.sections.part1.p1' )" />
			<p v-html="t( 'fx.sections.part1.p2' )" />
			<p v-html="t( 'fx.sections.part1.p3' )" />
		</div>

		<h2 id="basic-denke" class="mt-8">{{ t( "fx.sections.part2.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'fx.sections.part2.p1' )"/>
			<ol>
				<li><b>{{ t( "fx.sections.part2.s1Title" ) }}</b>: {{ t( "fx.sections.part2.s1" ) }}</li>
				<li><b>{{ t( "fx.sections.part2.s2Title" ) }}</b>: {{ t( "fx.sections.part2.s2" ) }}</li>
				<li><b>{{ t( "fx.sections.part2.s3Title" ) }}</b>: {{ t( "fx.sections.part2.s3" ) }}</li>
				<li><b>{{ t( "fx.sections.part2.s4Title" ) }}</b>: {{ t( "fx.sections.part2.s4" ) }}</li>
			</ol>
			<p class="muted">
				{{ t( "fx.sections.part2.note" ) }}
			</p>
		</div>

		<h2 class="mt-8">{{ t( "fx.sections.part3.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'fx.sections.part3.p1' )"/>
			<div class="kbox">
				<div v-for="(line, idx) in miniProgram" :key="idx" class="mono">{{ line }}</div>
			</div>
			<p class="muted">
				{{ t( "fx.sections.part3.note" ) }}
			</p>
		</div>

		<h2>{{ t( "fx.sections.part4.title" ) }}</h2>
		<div class="eddie d-flex flex-column ga-3">
			<v-sheet border class="pa-3" rounded="lg">
				<div class="text-subtitle-1 font-weight-medium mb-2">{{ t( "fx.sections.part4.quickStart" ) }}</div>
				<ol class="mb-0">
					<li>{{ t( "fx.sections.part4.q1" ) }}</li>
					<li>{{ t( "fx.sections.part4.q2" ) }}</li>
					<li>{{ t( "fx.sections.part4.q3" ) }}</li>
					<li>{{ t( "fx.sections.part4.q4" ) }}</li>
				</ol>
			</v-sheet>

			<v-sheet border class="pa-3" rounded="lg">
				<div class="text-subtitle-1 font-weight-medium mb-2">{{ t( "fx.sections.part4.patterns" ) }}</div>
				<v-table density="compact">
					<thead>
						<tr>
							<th>{{ t( "fx.sections.part4.table.pattern" ) }}</th>
							<th>{{ t( "fx.sections.part4.table.logic" ) }}</th>
							<th>{{ t( "fx.sections.part4.table.note" ) }}</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="item in patterns" :key="item.title">
							<td class="mono">{{ item.title }}</td>
							<td class="mono">{{ item.logic }}</td>
							<td>{{ item.note }}</td>
						</tr>
					</tbody>
				</v-table>
			</v-sheet>
		</div>
	</template>

	<template #interactivePart>
		<h2 id="interaktiver-rechner">{{ t( "fx.interactive.title" ) }}</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p v-html="t( 'fx.interactive.p1' )"/>
			<v-alert type="info" variant="tonal">
				{{ t( "fx.interactive.tip" ) }}
			</v-alert>
		</div>
		<FX7000G />
	</template>

	<template #footer>
		<p class="muted">
			<a href="https://github.com/Krevo/CasioBasicInterpreter">{{ t( "fx.footer" ) }}</a>
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "@/utils/i18n.mjs";

import FX7000G from "./FX_7000G.vue";
import titleImg from "./FX.webp";

const { t } = useI18n( "book1.FX" );

const subChapter = computed( () => ( {
	einleitung:             t( "fx.subChapter.einleitung" ),
	geschichte:             t( "fx.subChapter.geschichte" ),
	"basic-denke":          t( "fx.subChapter.basicDenke" ),
	"interaktiver-rechner": t( "fx.subChapter.interaktiverRechner" )
} ) );

const miniProgram = computed( () => [
	"Cls",
	t( "fx.demo.line1" ),
	"?->A",
	"Locate 1,3,\"A^2=\"",
	"Locate 6,3,A^2",
	"Locate 1,4,\"sqrt(A)=\"",
	"Locate 9,4,Sqrt A"
] );

const patterns = computed( () => [
	{
		title: t( "fx.patterns.p1.title" ),
		logic: t( "fx.patterns.p1.logic" ),
		note:  t( "fx.patterns.p1.note" )
	},
	{
		title: t( "fx.patterns.p2.title" ),
		logic: t( "fx.patterns.p2.logic" ),
		note:  t( "fx.patterns.p2.note" )
	},
	{
		title: t( "fx.patterns.p3.title" ),
		logic: t( "fx.patterns.p3.logic" ),
		note:  t( "fx.patterns.p3.note" )
	},
	{
		title: t( "fx.patterns.p4.title" ),
		logic: t( "fx.patterns.p4.logic" ),
		note:  t( "fx.patterns.p4.note" )
	}
] );
</script>
