<script setup>
import { computed } from "vue";
import { useI18n } from "@/utils/i18n.mjs";

import ContentIndex from "@/components/ContentIndex.vue";

const { t, tm } = useI18n( "components.lang" );
const subChapter = computed( () => tm( "catchAll.subChapter" ) ?? {} );
</script>

<template>
<AppFrame
	:languages="[ 'de', 'en' ]"
	nomd
	:sub-chapter
	:title="t( 'catchAll.title' )"
	:vue-date="__VITE_SFC_MTIME_MS__"
>

	<template #descriptionPart>
		<h2 id="dieses-thema-ist-noch-nicht-ausgearbeitet" v-html="t( 'catchAll.heading' )" />
		<div class="eddie">
			<p v-html="t( 'catchAll.p1' )"/>
			<p v-html="t( 'catchAll.p2' )"/>
		</div>
	</template>

	<template #interactivePart>
		<h2>{{ t( "catchAll.back" ) }}</h2>
		<ContentIndex />
	</template>

	<template #footer>
		<p class="muted" v-html="t( 'catchAll.tip' )" />
	</template>
</AppFrame>
</template>
