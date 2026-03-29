<!-- i18n-ally-scope: useI18n("book1.SE") -->
<template>
<div class="seGraphWrap">
	<svg
		:aria-label="t( 'graphs.rectangles.aria' )"
		class="seGraphSvg"
		role="img"
		:viewBox="`0 0 ${size} ${size}`"
		@click="reroll"
	>
		<!-- <g>
			<line
				v-for="line in gridLines"
				:key="line.key"
				:class="line.cls"
				:x1="line.x1"
				:x2="line.x2"
				:y1="line.y1"
				:y2="line.y2"
			/>
		</g> -->

		<g>
			<rect
				v-for="rect in rectangles"
				:key="rect.key"
				:height="rect.h"
				:stroke="rect.stroke"
				:width="rect.w"
				:x="rect.x"
				:y="rect.y"
			/>
		</g>
	</svg>

	<div class="seGraphMeta mono">
		<div><b>x</b> = {{ x }}</div>
		<div><b>y</b> = {{ y }}</div>
		<div><b>{{ t( "graphs.rectangles.count" ) }}</b> = {{ rectangleCount }}</div>
	</div>
	<p class="muted seGraphHint">{{ t( "graphs.common.clickHint" ) }}</p>
</div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "@/utils/i18n.mjs";

const { t } = useI18n( "book1.SE" );

const size = 420;
const padding = 46;
const drawWidth = size - 2 * padding;

function randomRange2to5() {
	return 2 + Math.floor( Math.random() * 4 );
}

const x = ref( 4 );
const y = ref( 5 );

function reroll() {
	x.value = randomRange2to5();
	y.value = randomRange2to5();
}

function axisPositions( count ) {
	if ( count <= 1 ) {
		return [ padding + drawWidth / 2 ];
	}

	const step = drawWidth / ( count - 1 );

	return Array.from( { length: count }, ( _, i ) => padding + i * step );
}

function jitter( seed ) {
	const value = Math.sin( seed * 12.9898 ) * 43758.5453;
	const fract = value - Math.floor( value );

	return ( fract - 0.5 ) * 20;
}

function rectangleColor( seed ) {
	const hue = seed * 47 % 360;
	const saturation = 82;
	const lightness = 56 + seed % 3 * 6;

	return `hsla(${hue}, ${saturation}%, ${lightness}%, 0.72)`;
}

const xPos = computed( () => axisPositions( x.value ) );
const yPos = computed( () => axisPositions( y.value ) );

const gridLines = computed( () => {
	const lines = [];

	for ( let i = 0; i < xPos.value.length; i++ ) {
		lines.push( {
			key: `vx-${i}`,
			cls: "gridLine",
			x1:  xPos.value[ i ],
			y1:  padding,
			x2:  xPos.value[ i ],
			y2:  size - padding
		} );
	}

	for ( let j = 0; j < yPos.value.length; j++ ) {
		lines.push( {
			key: `hy-${j}`,
			cls: "gridLine",
			x1:  padding,
			y1:  yPos.value[ j ],
			x2:  size - padding,
			y2:  yPos.value[ j ]
		} );
	}

	return lines;
} );

const rectangles = computed( () => {
	const out = [];
	let seed = 1;

	for ( let xi = 0; xi < xPos.value.length; xi++ ) {
		for ( let xj = xi + 1; xj < xPos.value.length; xj++ ) {
			for ( let yi = 0; yi < yPos.value.length; yi++ ) {
				for ( let yj = yi + 1; yj < yPos.value.length; yj++ ) {
					const dx = jitter( seed );
					const dy = jitter( seed + 97 );

					out.push( {
						key:    `r-${xi}-${xj}-${yi}-${yj}`,
						stroke: rectangleColor( seed ),
						x:      xPos.value[ xi ] + dx,
						y:      yPos.value[ yi ] + dy,
						w:      xPos.value[ xj ] - xPos.value[ xi ],
						h:      yPos.value[ yj ] - yPos.value[ yi ]
					} );

					seed += 1;
				}
			}
		}
	}

	return out;
} );

const rectangleCount = computed( () => rectangles.value.length );
</script>

<style scoped>
.seGraphWrap {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.seGraphSvg {
	width: min(100%, 520px);
	height: auto;
	cursor: pointer;
	border: 1px solid rgba(var(--v-theme-on-surface), 0.2);
	border-radius: 14px;
	background: rgba(var(--v-theme-surface), 0.85);
}

.seGraphSvg .gridLine {
	stroke: rgba(var(--v-theme-on-surface), 0.46);
	stroke-width: 1.2;
}

.seGraphSvg rect {
	fill: none;
	stroke-width: 1.2;
}

.seGraphMeta {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	font-size: 0.95rem;
}

.seGraphHint {
	margin: 0;
	font-size: 0.9rem;
}
</style>
