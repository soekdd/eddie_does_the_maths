<template>
<AppFrame
	:languages="[ 'de', 'en' ]"
	nomd
	:sub-chapter
	:title="t( 'welcome.title' )"
	:vue-date="__VITE_SFC_MTIME_MS__"
>

	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="t( 'welcome.imageTitle' )">
				<img loading="lazy" :src="welcomeImg" />
			</ImageZoomer>
		</figure>
		<h2 id="willkommen">{{ t( "welcome.heading" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "welcome.p1" ) }}</p>
			<p>{{ t( "welcome.p2" ) }}</p>
			<p v-html="t( 'welcome.p3' )" />
			<p>{{ t( "welcome.p4" ) }}</p>
			<p>{{ t( "welcome.p5" ) }}</p>

			<div class="exampleClear"></div>
		</div>
	</template>

	<template #interactivePart>
		<h2 id="ubersicht">{{ t( "welcome.index" ) }}</h2>
		<ContentIndex />
	</template>
</AppFrame>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "@/i18n.mjs";
import ContentIndex from "@/components/ContentIndex.vue";
import welcomeImg from "@/images/welcome.webp";

const { t, tm } = useI18n( "components/lang" );
const subChapter = computed( () => tm( "welcome.subChapter" ) ?? {} );
</script>
