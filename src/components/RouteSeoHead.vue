<!-- i18n-ally-scope: useI18n("components.lang") -->
<template>
<span class="sr-only" />
</template>

<script setup>
import { useHead } from "@unhead/vue";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "@/utils/i18n.mjs";
import {
	normalizeSeoText, resolveRouteMetaDescription, resolveRouteMetaTitle
} from "@/router.js";

const route = useRoute();
const { locale, t } = useI18n( "components.lang" );
const siteName = computed( () => t( "routeSeoHead.siteName" ) );

const pageTitle = computed( () => {
	const titleFromRoute = normalizeSeoText( resolveRouteMetaTitle( route.meta, locale.value ) );
	return titleFromRoute ? `${siteName.value}: ${titleFromRoute}` : siteName.value;
} );

const pageDescription = computed( () => normalizeSeoText( resolveRouteMetaDescription( route.meta, locale.value ) ) );

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
