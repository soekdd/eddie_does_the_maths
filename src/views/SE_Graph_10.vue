<template>
<div class="seGraphWrap">
	<svg
		aria-label="Komplettgraph mit n Punkten"
		class="seGraphSvg"
		role="img"
		:viewBox="`0 0 ${size} ${size}`"
		@click="reroll"
	>
		<g>
			<line
				v-for="edge in edgeLines"
				:key="edge.key"
				:x1="edge.x1"
				:x2="edge.x2"
				:y1="edge.y1"
				:y2="edge.y2"
			/>
		</g>

		<g>
			<circle
				v-for="point in points"
				:key="point.id"
				:cx="point.x"
				:cy="point.y"
				r="nodeRadius"
			/>
		</g>
	</svg>

	<div class="seGraphMeta mono">
		<div><b>n</b> = {{ n }}</div>
		<div><b>Verbindungen</b> = {{ edgeCount }}</div>
	</div>
	<p class="muted seGraphHint">Klick auf die Grafik</p>
</div>
</template>

<script setup>
import { computed, ref } from "vue";

const size = 360;
const nodeRadius = 5;
const center = size / 2;
const radius = 130;

function randomN() {
	return 5 + Math.floor( Math.random() * 6 );
}

const n = ref( 6 );

function reroll() {
	n.value = randomN();
}

const points = computed( () => {
	const angleStep = 2 * Math.PI / n.value;
	const startAngle = -Math.PI / 2;

	return Array.from( { length: n.value }, ( _, index ) => {
		const angle = startAngle + index * angleStep;

		return {
			id: index,
			x:  center + radius * Math.cos( angle ),
			y:  center + radius * Math.sin( angle )
		};
	} );
} );

const edgeLines = computed( () => {
	const result = [];

	for ( let i = 0; i < points.value.length; i++ ) {
		for ( let j = i + 1; j < points.value.length; j++ ) {
			result.push( {
				key: `${i}-${j}`,
				x1:  points.value[ i ].x,
				y1:  points.value[ i ].y,
				x2:  points.value[ j ].x,
				y2:  points.value[ j ].y
			} );
		}
	}

	return result;
} );

const edgeCount = computed( () => edgeLines.value.length );
</script>

<style scoped>
.seGraphWrap {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.seGraphSvg {
	width: min(100%, 460px);
	height: auto;
	cursor: pointer;
	border: 1px solid rgba(var(--v-theme-on-surface), 0.2);
	border-radius: 14px;
	background: rgba(var(--v-theme-surface), 0.85);
}

.seGraphSvg line {
	stroke: rgba(var(--v-theme-primary), 0.42);
	stroke-width: 1.5;
}

.seGraphSvg circle {
	fill: rgb(var(--v-theme-primary));
	stroke: rgba(var(--v-theme-on-primary), 0.75);
	stroke-width: 0.6;
}

.seGraphMeta {
	display: flex;
	gap: 16px;
	font-size: 0.95rem;
}

.seGraphHint {
	margin: 0;
	font-size: 0.9rem;
}
</style>
