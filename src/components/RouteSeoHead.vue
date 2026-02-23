<template>
<span class="sr-only" />
</template>

<script setup>
import { useHead } from "@unhead/vue";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { normalizeSeoText } from "@/router.js";

const siteName = "Eddie rechnet";
const fallbackDescription = "Interaktive Mathematik mit Eddie: Rechenwege, Visualisierungen und Übungen zum Mitmachen.";
const route = useRoute();

const pageTitle = computed( () => {
	const titleFromRoute = normalizeSeoText( route.meta?.title );
	return titleFromRoute ? `${siteName}: ${titleFromRoute}` : siteName;
} );

const pageDescription = computed( () => {
	const fromMeta = normalizeSeoText( route.meta?.description );

	if ( fromMeta ) {
		return fromMeta;
	}

	const titleFromRoute = normalizeSeoText( route.meta?.title );

	if ( titleFromRoute ) {
		return `Interaktive Mathe-Seite: ${
			titleFromRoute}. Rechenwege, Visualisierungen und Übungen zum Mitmachen.`;
	}

	return fallbackDescription;
} );

useHead( () => ( {
	title: pageTitle.value,
	meta:  [
		{
			name:    "description",
			content: pageDescription.value
		}
	]
} ) );
</script>

<style scoped>
.sr-only {
  display: none;
}
</style>
