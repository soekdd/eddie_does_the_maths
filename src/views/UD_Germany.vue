<template>
<div class="udGermany">
	<div class="controls">
		<label class="meta" for="shoreWidthGermany">
			Uferbreite h:
		</label>
		<input
			id="shoreWidthGermany"
			v-model.number="shoreWidth"
			:max="maxBorder"
			:min="minBorder"
			step="0.5"
			type="range"
		/>
	</div>

	<div ref="svgHost" class="mapFrame" v-html="germanySvgRaw"></div>
</div>
</template>

<script setup>
import {
	computed,
	onMounted,
	ref,
	watch
} from "vue";

import germanySvgRaw from "./UD_Germany.svg?raw";

const SVG_NS = "http://www.w3.org/2000/svg";

const props = defineProps( {
	initialBorder: { type: Number, default: 7 },
	minBorder:     { type: Number, default: 1 },
	maxBorder:     { type: Number, default: 22 },
	shoreColor:    { type: String, default: null },
	waterColor:    { type: String, default: null }
} );

const shoreWidth = ref( props.initialBorder );
const svgHost = ref( null );
const THEME_SHORE_COLOR = "rgb(var(--v-theme-warning, 245, 158, 11))";
const THEME_WATER_COLOR = "rgb(var(--v-theme-info, 37, 99, 235))";
const resolvedShoreColor = computed( () => props.shoreColor || THEME_SHORE_COLOR );
const resolvedWaterColor = computed( () => props.waterColor || THEME_WATER_COLOR );

watch( () => props.initialBorder, ( next ) => {
	if ( Number.isFinite( next ) ) {
		shoreWidth.value = next;
	}
} );

watch( [
	shoreWidth,
	resolvedShoreColor,
	resolvedWaterColor
],
() => updateLakesOverlay() );

onMounted( () => updateLakesOverlay() );

function updateLakesOverlay() {
	const host = svgHost.value;

	if ( !host ) {
		return;
	}

	const svg = host.querySelector( "svg" );

	if ( !svg ) {
		return;
	}

	const lakes = svg.querySelector( "#Lakes" );

	if ( !lakes || !lakes.parentNode ) {
		return;
	}

	const oldStroke = svg.querySelector( "#LakesShoreStroke" );
	const oldFill = svg.querySelector( "#LakesWaterFill" );

	oldStroke?.remove();
	oldFill?.remove();

	lakes.setAttribute( "fill", "none" );
	lakes.setAttribute( "stroke", "none" );
	lakes.style.fill = "none";
	lakes.style.stroke = "none";

	const lakesD = lakes.getAttribute( "d" ) ?? "";

	if ( !lakesD ) {
		return;
	}

	const shoreStroke = svg.ownerDocument.createElementNS( SVG_NS, "path" );

	shoreStroke.setAttribute( "d", lakesD );
	shoreStroke.setAttribute( "id", "LakesShoreStroke" );
	shoreStroke.setAttribute( "fill", "none" );
	shoreStroke.setAttribute( "stroke", resolvedShoreColor.value );
	shoreStroke.setAttribute( "stroke-width", String( shoreWidth.value * 2 ) );
	shoreStroke.setAttribute( "stroke-linecap", "round" );
	shoreStroke.setAttribute( "stroke-linejoin", "round" );
	shoreStroke.setAttribute( "vector-effect", "non-scaling-stroke" );

	const lakeFill = svg.ownerDocument.createElementNS( SVG_NS, "path" );

	lakeFill.setAttribute( "d", lakesD );
	lakeFill.setAttribute( "id", "LakesWaterFill" );
	lakeFill.setAttribute( "fill", resolvedWaterColor.value );
	lakeFill.setAttribute( "fill-opacity", "1" );
	lakeFill.setAttribute( "stroke", "none" );

	lakes.parentNode.insertBefore( shoreStroke, lakes.nextSibling );
	lakes.parentNode.insertBefore( lakeFill, shoreStroke.nextSibling );
}
</script>

<style scoped>
.udGermany {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.controls {
	align-items: center;
	display: flex;
	gap: 12px;
}

.controls input {
	accent-color: rgb(var(--v-theme-primary, 2, 132, 199));
	flex: 1;
	max-width: 340px;
}

.meta {
	color: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.82);
	font-size: 0.95rem;
	font-weight: 600;
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
</style>
