<template>
<div ref="cardRef" class="pageCard" :style="cardStyle">
	<div class="pageInner">
		<slot name="inner">
			<slot />
		</slot>
	</div>
</div>
</template>

<script setup lang="ts">
/* eslint-disable vue/max-len */
import {
	computed, nextTick, onBeforeUnmount, onMounted, ref
} from "vue";

const BASE = {
	minX:   16.684,
	minY:   20.381,
	width:  499.989,
	height: 524.736
} as const;

const BASE_PATHS = [
	"M17.8,545.117L17.8,520.378L463.613,513.21L516.673,529.591C516.223,530.944 497.094,534.374 452.49,531.57C369.834,526.373 62.99,545.117 62.99,545.117C32.751,543.121 17.8,545.117 17.8,545.117Z",
	"M465.886,46.475L484.827,29.206L513.495,49.216L516.673,529.591L487.171,521.564L474.445,505.643L465.886,46.475Z",
	"M17.8,32.245L17.8,525.813C17.8,525.813 16.684,527.483 24.507,529.164C32.731,530.931 42.797,536.042 42.797,536.042C42.797,536.042 341.305,519.639 437.052,520.363C482.997,520.711 487.172,521.564 487.172,521.564L485.463,24.011C461.991,34.084 409.028,27.24 367.529,25.059C278.556,20.381 55.656,28.558 37.453,43.53C34.751,29.395 17.8,32.245 17.8,32.245Z",
	"M39.787,42.48L37.507,42.568L41.165,538.758L43.451,538.64L39.787,42.48Z"
] as const;

const SIZE_EPSILON_PX = 0.5;

const cardRef = ref<HTMLElement | null>( null );
const boxWidthPx = ref( 1 );
const boxHeightPx = ref( 1 );

let resizeObserver: ResizeObserver | null = null;

function toFixed3( value: number ) {
	return Number( value.toFixed( 3 ) ).toString();
}

function setBoxSize( nextWidthPx: number, nextHeightPx: number ) {
	const width = Math.max( 1, nextWidthPx );
	const height = Math.max( 1, nextHeightPx );

	if ( Math.abs( boxWidthPx.value - width ) > SIZE_EPSILON_PX ) {
		boxWidthPx.value = width;
	}

	if ( Math.abs( boxHeightPx.value - height ) > SIZE_EPSILON_PX ) {
		boxHeightPx.value = height;
	}
}

function readBoxSize() {
	const el = cardRef.value;

	if ( !el ) {
		return;
	}

	const rect = el.getBoundingClientRect();
	setBoxSize( rect.width, rect.height );
}

function buildPageSvgDataUrl( widthPx: number, heightPx: number ) {
	const width = toFixed3( widthPx );
	const height = toFixed3( heightPx );

	const svg = [
		`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${BASE.minX} ${BASE.minY} ${BASE.width} ${BASE.height}" preserveAspectRatio="none">`,
		"<defs>",
		"<linearGradient id=\"g1\" gradientUnits=\"userSpaceOnUse\" x1=\"-221.372\" y1=\"481.603\" x2=\"493.358\" y2=\"470.621\">",
		"<stop offset=\"0\" stop-color=\"rgb(145,145,145)\"/>",
		"<stop offset=\"0.31\" stop-color=\"rgb(145,145,145)\"/>",
		"<stop offset=\"0.51\" stop-color=\"rgb(92,92,92)\"/>",
		"<stop offset=\"0.7\" stop-color=\"rgb(145,145,145)\"/>",
		"<stop offset=\"1\" stop-color=\"rgb(145,145,145)\"/>",
		"</linearGradient>",
		"<linearGradient id=\"g2\" gradientUnits=\"userSpaceOnUse\" x1=\"463.788\" y1=\"280.314\" x2=\"385.331\" y2=\"290.162\">",
		"<stop offset=\"0\" stop-color=\"rgb(146,146,149)\"/>",
		"<stop offset=\"1\" stop-color=\"rgb(185,185,185)\"/>",
		"</linearGradient>",
		"<linearGradient id=\"g3\" gradientUnits=\"userSpaceOnUse\" x1=\"-146.552\" y1=\"286.516\" x2=\"415.749\" y2=\"264.47\">",
		"<stop offset=\"0\" stop-color=\"rgb(220,220,220)\"/>",
		"<stop offset=\"0.07\" stop-color=\"rgb(232,232,232)\"/>",
		"<stop offset=\"0.39\" stop-color=\"rgb(226,226,226)\"/>",
		"<stop offset=\"0.5\" stop-color=\"rgb(188,188,188)\"/>",
		"<stop offset=\"0.64\" stop-color=\"rgb(222,222,222)\"/>",
		"<stop offset=\"0.95\" stop-color=\"rgb(221,221,221)\"/>",
		"<stop offset=\"1\" stop-color=\"rgb(220,220,220)\"/>",
		"</linearGradient>",
		"</defs>",
		`<path d="${BASE_PATHS[ 0 ]}" fill="url(#g1)"/>`,
		`<path d="${BASE_PATHS[ 1 ]}" fill="url(#g2)"/>`,
		`<path d="${BASE_PATHS[ 2 ]}" fill="url(#g3)"/>`,
		`<path d="${BASE_PATHS[ 3 ]}" fill="rgb(146,146,146)" stroke="rgb(184,183,184)" stroke-width="1"/>`,
		"</svg>"
	].join( "" );

	return `url("data:image/svg+xml,${encodeURIComponent( svg )}")`;
}

const cardStyle = computed( () => ( { backgroundImage: buildPageSvgDataUrl( boxWidthPx.value, boxHeightPx.value ) } ) );

onMounted( async() => {
	await nextTick();
	readBoxSize();

	resizeObserver = new ResizeObserver( ( entries ) => {
		const entry = entries[ 0 ];

		if ( !entry ) {
			return;
		}

		setBoxSize( entry.contentRect.width,
			entry.contentRect.height );
	} );

	if ( cardRef.value ) {
		resizeObserver.observe( cardRef.value );
	}
} );

onBeforeUnmount( () => {
	resizeObserver?.disconnect();
} );
</script>

<style scoped>
.pageCard {
	width: 100%;
	position: relative;
	border: 0;
	border-radius: 10px;
	background-color: transparent;
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 100%;
	overflow: hidden;
	padding: 2rem 6rem 1rem 5rem;
}

.pageInner {
	padding: 1.2rem 0.2rem 1.45rem 0.2rem;
	color: #000;
}

.pageInner :deep(*) {
	color: #0b0f1a !important;
}

.pageInner :deep(.zoomerHint) {
	background: #f5f7fb88!important;
}
.pageInner :deep(.exampleFigure) {
	background: #f5f7fb12!important;
}
@media (max-width: 860px) {
	.pageCard {
		padding: 1em 1.5em 1.5em 2em;
	}
}
</style>
