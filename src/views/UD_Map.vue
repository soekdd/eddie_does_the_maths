<!-- eslint-disable vue/max-len -->
<template>
<div class="udGermany">
	<div class="mapFrame">
		<svg height="100%"
			style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
			version="1.1"
			:viewBox
			width="100%"
			xml:space="preserve"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:serif="http://www.serif.com/"
			xmlns:xlink="http://www.w3.org/1999/xlink"
		>
			<defs>
				<clipPath :id="landClipPathId">
					<path :d="landPath" />
				</clipPath>
			</defs>
			<g :clip-path="`url(#${landClipPathId})`">
				<path
					id="Land"
					class="land"
					:d="landPath"
				/>
				<path
					id="LakesShoreStroke"
					:d="lakesPath"
					fill="none"
					:stroke="resolvedShoreColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					:stroke-width="props.shoreWidth * 2"
					vector-effect="non-scaling-stroke"
				/>
				<path
					id="LakesWaterFill"
					:d="lakesPath"
					:fill="resolvedWaterColor"
					fill-opacity="1"
					stroke="none"
				/>
			</g>
			<g class="overlayCenter">
				<text class="overlayLine overlayLineTop" x="50%" y="50%">
					h = {{ hDistanceMetersLabel }} m
				</text>
				<text class="overlayLine overlayLineBottom" x="50%" y="50%">
					P = {{ probabilityPercentLabel }} %
				</text>
			</g>
		</svg>
	</div>
</div>
</template>

<script setup>
 
import {
	computed,
	getCurrentInstance
} from "vue";
import countries from "../utils/ud_countries.mjs";

const props = defineProps( {
	country:            { type: String, default: "finland" },
	shoreWidth:         { type: Number, default: 7 },
	hDistanceMeters:    { type: Number, default: 0 },
	probabilityPercent: { type: Number, default: 0 },
	shoreColor:         { type: String, default: null },
	waterColor:         { type: String, default: null }
} );


const instance = getCurrentInstance();
const landClipPathId = `ud-land-clip-${instance?.uid ?? 0}`;
const THEME_SHORE_COLOR = "rgb(var(--v-theme-warning, 245, 158, 11))";
const THEME_WATER_COLOR = "rgb(var(--v-theme-info, 37, 99, 235))";
const resolvedShoreColor = computed( () => props.shoreColor || THEME_SHORE_COLOR );
const resolvedWaterColor = computed( () => props.waterColor || THEME_WATER_COLOR );
const landPath = computed( () => countries[ props.country ].land );
const lakesPath = computed( () => countries[ props.country ].lakes );
const viewBox = computed( () => countries[ props.country ].viewBox );
const hDistanceMetersLabel = computed( () =>
	Number.isFinite( props.hDistanceMeters ) ? Math.round( props.hDistanceMeters ).toString() : "0" );
const probabilityPercentLabel = computed( () =>
	Number.isFinite( props.probabilityPercent ) ?
		Number( props.probabilityPercent ).toFixed( 2 )
			.replace( ".", "," ) :
		"0,00" );
</script>

<style scoped>
.udGermany {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.mapFrame {
	background: rgb(var(--v-theme-surface, 255, 255, 255));
	border: 1px solid rgba(var(--v-theme-on-surface, 17, 17, 17), 0.16);
	border-radius: 12px;
	overflow: hidden;
	width: 100%;
}

.mapFrame :deep(svg) {
	display: block;
	height: auto;
	max-height: 650px;
	width: 100%;
}

.mapFrame :deep(.land) {
	fill: rgb(var(--v-theme-success, 16, 185, 129));
}

.overlayCenter {
	pointer-events: none;
}

.overlayLine {
	fill: rgb(var(--v-theme-on-surface, 17, 17, 17));
	font-family: "Avenir Next", "Segoe UI", sans-serif;
	font-weight: 700;
	paint-order: stroke fill;
	stroke: rgba(var(--v-theme-surface, 255, 255, 255), 0.92);
	stroke-linejoin: round;
	stroke-width: 12;
	text-anchor: middle;
}

.overlayLineTop {
	dominant-baseline: central;
	font-size: 52px;
	transform: translateY(-36px);
}

.overlayLineBottom {
	dominant-baseline: central;
	font-size: 52px;
	transform: translateY(36px);
}
</style>
