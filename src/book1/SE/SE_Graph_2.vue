<!-- i18n-ally-scope: useI18n("book1.SE") -->
<template>
<div class="seGaussWrap">
	<Katex display tex="\sum_{k=1}^{n} k = \frac{n(n+1)}{2}"/>
	<p class="muted gauss">{{ t( "graphs.gauss.caption" ) }}</p>
</div>
</template>
<script setup>
import { useI18n } from "@/utils/i18n.mjs";

const { t } = useI18n( "book1.SE" );
</script>
<style scoped>
.gauss {
    width: 100%;
    text-align: center;
}
</style>
