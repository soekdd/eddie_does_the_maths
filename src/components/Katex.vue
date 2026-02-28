<script setup>
import { computed } from "vue";

import { katexHTML } from "@/utils/katex";

const props = defineProps( {
	tex:     { type: String, required: true },
	display: { type: Boolean, default: false },
	aligned: { type: Boolean, default: false },
	as:      { type: String, default: "span" }
} );

function encodeBase64Utf8( value ) {
	if ( typeof value !== "string" ) {
		return "";
	}

	if ( typeof Buffer !== "undefined" ) {
		return Buffer.from( value, "utf8" ).toString( "base64" );
	}

	if ( typeof TextEncoder !== "undefined" && typeof btoa === "function" ) {
		let binary = "";

		for ( const byte of new TextEncoder().encode( value ) ) {
			binary += String.fromCharCode( byte );
		}

		return btoa( binary );
	}

	return "";
}

const sourceTex = computed( () => props.tex );
const renderTex = computed( () => props.aligned ?
	`\\begin{aligned}${sourceTex.value}\\end{aligned}` : sourceTex.value );
const sourceTexB64 = computed( () => encodeBase64Utf8( sourceTex.value ) );
const renderTexB64 = computed( () => encodeBase64Utf8( renderTex.value ) );
const displayFlag = computed( () => props.display ? "1" : "0" );
const alignedFlag = computed( () => props.aligned ? "1" : "0" );
const html = computed( () => katexHTML( renderTex.value, props.display ) );

const safeAs = computed( () => {
	const tag = typeof props.as === "string" ? props.as.trim() : "";
	return tag || "span";
} );

</script>

<template>
<client-only>
	<component
		:is="safeAs"
		:data-katex-aligned="alignedFlag"
		:data-katex-display="displayFlag"
		:data-katex-render-tex="renderTex"
		:data-katex-render-tex-b64="renderTexB64"
		:data-katex-tex="sourceTex"
		:data-katex-tex-b64="sourceTexB64"
		v-html="html"
	/>
</client-only>
</template>
