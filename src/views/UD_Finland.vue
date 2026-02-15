<template>
<div class="udFinnland">
	<div class="controls">
		<label class="meta" for="shoreWidth">
			Uferbreite h:
		</label>
		<input
			id="shoreWidth"
			v-model.number="shoreWidth"
			:max="maxBorder"
			:min="minBorder"
			step="0.5"
			type="range"
		/>
	</div>

	<div ref="svgHost" class="mapFrame" v-html="finlandSvgRaw"></div>
</div>
</template>

<script setup>
import {
	onMounted,
	ref,
	watch
} from "vue";

import finlandSvgRaw from "./UD_Finland.svg?raw";

const SVG_NS = "http://www.w3.org/2000/svg";

const props = defineProps( {
	initialBorder: { type: Number, default: 7 },
	minBorder:     { type: Number, default: 1 },
	maxBorder:     { type: Number, default: 22 },
	shoreColor:    { type: String, default: "#f4cf45" },
	waterColor:    { type: String, default: "#c6ecff" }
} );

const shoreWidth = ref( props.initialBorder );
const svgHost = ref( null );

watch( () => props.initialBorder, ( next ) => {
	if ( Number.isFinite( next ) ) {
		shoreWidth.value = next;
	}
} );

watch( [
	shoreWidth,
	() => props.shoreColor,
	() => props.waterColor
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
	shoreStroke.setAttribute( "stroke", props.shoreColor );
	shoreStroke.setAttribute( "stroke-width", String( shoreWidth.value * 2 ) );
	shoreStroke.setAttribute( "stroke-linecap", "round" );
	shoreStroke.setAttribute( "stroke-linejoin", "round" );
	shoreStroke.setAttribute( "vector-effect", "non-scaling-stroke" );

	const lakeFill = svg.ownerDocument.createElementNS( SVG_NS, "path" );

	lakeFill.setAttribute( "d", lakesD );
	lakeFill.setAttribute( "id", "LakesWaterFill" );
	lakeFill.setAttribute( "fill", props.waterColor );
	lakeFill.setAttribute( "fill-opacity", "1" );
	lakeFill.setAttribute( "stroke", "none" );

	lakes.parentNode.insertBefore( shoreStroke, lakes.nextSibling );
	lakes.parentNode.insertBefore( lakeFill, shoreStroke.nextSibling );
}
</script>

<style scoped>
.udFinnland {
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
	flex: 1;
	max-width: 340px;
}

.meta {
	color: #30435b;
	font-size: 0.95rem;
	font-weight: 600;
}

.mapFrame {
	background: #f9fbff;
	border: 1px solid #d6dcef;
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
	fill: #7fbf63;
}
</style>
