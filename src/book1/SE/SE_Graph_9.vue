<template>
<div class="seGaussWrap">
	<Katex display tex="\sum_{k=1}^{n} k^2 = \frac{n(n+1)(2n+1)}{6}"/>
	<p class="muted faulhaber">{{ t( "graphs.faulhaber.caption" ) }}</p>
</div>
</template>
<script setup>
import { useI18n } from "@/utils/i18n.mjs";

const { t } = useI18n( "book1/SE" );
</script>
<style scoped>
.faulhaber {
    width: 100%;
    text-align: center;
}
</style>
