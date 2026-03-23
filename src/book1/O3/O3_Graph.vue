<template>
<div class="o3Graph">
	<svg
		:aria-label
		class="triangle"
		role="img"
		:viewBox="`0 0 ${svgWidth} ${svgHeight}`"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect
			class="bg"
			:height="svgHeight"
			:width="svgWidth"
			x="0"
			y="0"
		/>

		<g class="cells">
			<rect
				v-for="cell in oddCells"
				:key="cell.key"
				class="cell"
				:height="dotSize"
				:rx="rounding"
				:ry="rounding"
				:width="dotSize"
				:x="cell.x"
				:y="cell.y"
			/>
		</g>
	</svg>

	<p v-if="showLegend" class="legend">
		{{ t( "graph.legend" ) }}
		<Katex tex="\binom{n}{k}\equiv 1\pmod 2 \iff (k\,\&\,n)=k" />.
	</p>
</div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "@/i18n.mjs";

const { t } = useI18n( "book1/O3" );

const props = defineProps( {
	rows: {
		type:    Number,
		default: 48
	},
	cellSize: {
		type:    Number,
		default: 14
	},
	padding: {
		type:    Number,
		default: 10
	},
	rounding: {
		type:    Number,
		default: 1.5
	},
	showLegend: {
		type:    Boolean,
		default: true
	},
	ariaLabel: {
		type:    String,
		default: ""
	}
} );

const ariaLabel = computed( () => props.ariaLabel || t( "graph.aria" ) );

const rowCount = computed( () => clampInt(
	props.rows, 1, 256
) );
const step = computed( () => clampNumber(
	props.cellSize, 4, 36
) );
const pad = computed( () => clampNumber(
	props.padding, 0, 80
) );
const dotSize = computed( () => step.value * 0.88 );
const rowStep = computed( () => step.value * 0.92 );
const dotOffset = computed( () => ( step.value - dotSize.value ) / 2 );

const svgWidth = computed( () => rowCount.value * step.value + 2 * pad.value );
const svgHeight = computed( () => rowCount.value * rowStep.value + dotSize.value + 2 * pad.value );

const oddCells = computed( () => {
	const cells = [];

	for ( let n = 0; n < rowCount.value; n++ ) {
		const rowOffset = ( rowCount.value - 1 - n ) * step.value * 0.5;
		const y = pad.value + n * rowStep.value + dotOffset.value;

		for ( let k = 0; k <= n; k++ ) {
			if ( ( k & n ) !== k ) {
				continue;
			}

			cells.push( {
				key: `${n}-${k}`,
				x:   pad.value + rowOffset + k * step.value + dotOffset.value,
				y
			} );
		}
	}

	return cells;
} );

function clampNumber(
	value, min, max
) {
	const number = Number( value );

	if ( !Number.isFinite( number ) ) {
		return min;
	}

	return Math.min( max, Math.max( min, number ) );
}

function clampInt(
	value, min, max
) {
	return Math.round( clampNumber(
		value, min, max
	) );
}
</script>

<style scoped>
.o3Graph {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.triangle {
	display: block;
	width: 100%;
	height: auto;
	border: 1px solid var(--line);
	border-radius: 12px;
	background: var(--panel);
}

.bg {
	fill: rgba(var(--v-theme-on-surface), 0.035);
}

.cell {
	fill: rgb(var(--v-theme-primary));
}

.legend {
	margin: 0;
	font-size: 0.9rem;
	color: var(--muted);
}
</style>
