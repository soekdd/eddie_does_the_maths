<!-- i18n-ally-scope: useI18n("book1.RC") -->
<template>
<AppFrame
	nomd
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
			<p v-html="t( 'book.p1' )"/>
			<p v-html="t( 'book.p2' )"/>
			<p v-html="t( 'book.p3' )"/>
		</div>
	</template>
	<template #descriptionPart>
		<RCRubikCube />
	</template>
</AppFrame>
</template>

<script setup>
import { useI18n } from "@/utils/i18n.mjs";
import RCRubikCube from "./RC_RubikCube.vue";
import titleImg from "./RC.webp";

const { t } = useI18n( "book1.RC" );
</script>
