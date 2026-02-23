<script setup>
import { computed } from "vue";

import { katexHTML } from "@/utils/katex";

const props = defineProps( {
	tex:     { type: String, required: true },
	display: { type: Boolean, default: false },
	as:      { type: String, default: "span" }
} );

const html = computed( () => katexHTML( props.tex, props.display ) );
const safeAs = computed( () => {
	const tag = typeof props.as === "string" ? props.as.trim() : "";
	return tag || "span";
} );
</script>

<template>
<component :is="safeAs" v-html="html" />
</template>
