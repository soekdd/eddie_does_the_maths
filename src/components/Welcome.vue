<template>
<AppFrame
	:languages="[ 'de', 'en' , 'sw', 'fi' ]"
	nomd
	:sub-chapter
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
			<p v-html="t( 'welcome.p1' )"/>
			<p v-html="t( 'welcome.p2' )"/>
			<p v-html="t( 'welcome.p3' )" />
			<p v-html="t( 'welcome.p4' )"/>
			<p v-html="t( 'welcome.p5' )"/>

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
import { useI18n } from "@/utils/i18n.mjs";
import ContentIndex from "@/components/ContentIndex.vue";
import welcomeImg from "@/images/welcome.webp";

const { t, tm } = useI18n( "components/lang" );
const subChapter = computed( () => tm( "welcome.subChapter" ) ?? {} );
</script>
