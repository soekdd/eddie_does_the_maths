<template>
<div class="fsGraph">
	<svg
		aria-label="Zeitverlauf der Fischpopulation im Beverton-Holt-Modell"
		class="chart"
		role="img"
		:viewBox="`0 0 ${CHART.width} ${CHART.height}`"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect class="bg"
			height="100%"
			width="100%"
			x="0"
			y="0"
		/>

		<line
			v-for="tick in yTicks"
			:key="`y-grid-${tick.value}`"
			class="gridLine"
			:x1="CHART.left"
			:x2="CHART.width - CHART.right"
			:y1="tick.y"
			:y2="tick.y"
		/>
		<line
			v-for="tick in xTicks"
			:key="`x-grid-${tick.value}`"
			class="gridLine gridLineVertical"
			:x1="tick.x"
			:x2="tick.x"
			:y1="CHART.top"
			:y2="CHART.height - CHART.bottom"
		/>

		<line
			class="axis"
			:x1="CHART.left"
			:x2="CHART.left"
			:y1="CHART.top"
			:y2="CHART.height - CHART.bottom"
		/>
		<line
			class="axis"
			:x1="CHART.left"
			:x2="CHART.width - CHART.right"
			:y1="CHART.height - CHART.bottom"
			:y2="CHART.height - CHART.bottom"
		/>

		<line
			v-if="hasPositiveEquilibrium"
			class="equilibrium"
			:x1="CHART.left"
			:x2="CHART.width - CHART.right"
			:y1="equilibriumY"
			:y2="equilibriumY"
		/>

		<polyline class="curve" :points="populationPoints"/>
		<circle class="dot"
			:cx="finalPoint.x"
			:cy="finalPoint.y"
			r="3.4"
		/>

		<text
			v-for="tick in yTicks"
			:key="`y-label-${tick.value}`"
			class="axisLabel axisLabelY"
			:x="CHART.left - 8"
			:y="tick.y + 4"
		>
			{{ fmt( tick.value, 0 ) }}
		</text>
		<text
			v-for="tick in xTicks"
			:key="`x-label-${tick.value}`"
			class="axisLabel axisLabelX"
			:x="tick.x"
			:y="CHART.height - CHART.bottom + 18"
		>
			{{ tick.value }}
		</text>

		<text class="axisTitle" :x="CHART.width / 2" :y="CHART.height - 6">
			Zeit t (Jahre)
		</text>
		<text class="axisTitle axisTitleY" x="14" :y="CHART.height / 2">
			Population N(t)
		</text>
	</svg>

	<div class="legend">
		<div class="legendItem"><span class="swatch swatchCurve"></span><span>Population N(t)</span></div>
		<div class="legendItem"><span class="swatch swatchEq"></span><span>Gleichgewicht N*</span></div>
	</div>
</div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps( {
	n0:      { type: Number, default: 40 },
	b:       { type: Number, default: 2.2 },
	c:       { type: Number, default: 0.02 },
	horizon: { type: Number, default: 20 }
} );

const CHART = {
	width:  760,
	height: 360,
	left:   58,
	right:  24,
	top:    18,
	bottom: 44
};

const n0 = computed( () => clampNumber(
	props.n0, 0, 5000
) );
const b = computed( () => clampNumber(
	props.b, 0, 5
) );
const c = computed( () => clampNumber(
	props.c, 0.0001, 1
) );
const horizon = computed( () => clampInt(
	props.horizon, 1, 60
) );

const series = computed( () => {
	const values = [ n0.value ];

	for ( let t = 0; t < horizon.value; t++ ) {
		const current = values[ t ];
		const next = b.value * current / ( 1 + c.value * current );
		values.push( next );
	}

	return values;
} );

const finalPopulation = computed( () => series.value[ series.value.length - 1 ] );
const equilibrium = computed( () => b.value > 1 ? ( b.value - 1 ) / c.value : 0 );
const hasPositiveEquilibrium = computed( () => b.value > 1 );

const maxPopulation = computed( () => {
	const maxSeries = Math.max( ...series.value );
	const max = Math.max( maxSeries, equilibrium.value );

	return Number.isFinite( max ) && max > 0 ? max : 1;
} );

const plotWidth = computed( () => CHART.width - CHART.left - CHART.right );
const plotHeight = computed( () => CHART.height - CHART.top - CHART.bottom );

const populationPoints = computed( () => series.value.map( ( value, t ) => {
	const point = toChartPoint( t, value );

	return `${point.x},${point.y}`;
} )
	.join( " " ) );

const finalPoint = computed( () => toChartPoint( horizon.value, finalPopulation.value ) );
const equilibriumY = computed( () => toY( equilibrium.value ) );

const xTicks = computed( () => {
	const ticks = [];
	const step = Math.max( 1, Math.ceil( horizon.value / 6 ) );

	for ( let t = 0; t <= horizon.value; t += step ) {
		ticks.push( {
			value: t,
			x:     toX( t )
		} );
	}

	if ( ticks[ ticks.length - 1 ]?.value !== horizon.value ) {
		ticks.push( {
			value: horizon.value,
			x:     toX( horizon.value )
		} );
	}

	return ticks;
} );

const yTicks = computed( () => {
	const ticks = [];
	const step = maxPopulation.value / 5;

	for ( let i = 0; i <= 5; i++ ) {
		const value = i * step;

		ticks.push( {
			value,
			y: toY( value )
		} );
	}

	return ticks;
} );

function toChartPoint( t, value ) {
	return {
		x: toX( t ),
		y: toY( value )
	};
}

function toX( t ) {
	return CHART.left + t / horizon.value * plotWidth.value;
}

function toY( value ) {
	return CHART.top + ( 1 - value / maxPopulation.value ) * plotHeight.value;
}

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

function fmt( value, digits = 2 ) {
	if ( !Number.isFinite( value ) ) {
		return "0";
	}

	return Number( value ).toFixed( digits )
		.replace( ".", "," );
}
</script>

<style scoped>
.fsGraph {
	--fs-surface: rgb(var(--v-theme-surface, 255, 255, 255));
	--fs-on-surface: rgb(var(--v-theme-on-surface, 17, 17, 17));
	--fs-primary: rgb(var(--v-theme-primary, 17, 105, 224));
	--fs-success: rgb(var(--v-theme-success, 45, 123, 61));
	--fs-grid: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.16);
	--fs-axis: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.82);
	--fs-label: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.72);
	--fs-title: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.9);
	--fs-border: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.2);
	--fs-curve-dot-stroke: rgb(var(--v-theme-surface, 255, 255, 255));

	display: flex;
	flex-direction: column;
	gap: 14px;
}

.chart {
	background: linear-gradient(
		180deg,
		rgba(var(--v-theme-surface, 255, 255, 255), 1) 0%,
		rgba(var(--v-theme-primary, 17, 105, 224), 0.06) 100%
	);
	border: 1px solid var(--fs-border);
	border-radius: 12px;
	height: auto;
	width: 100%;
}

.bg {
	fill: transparent;
}

.gridLine {
	stroke: var(--fs-grid);
	stroke-width: 1;
}

.gridLineVertical {
	stroke-dasharray: 4 4;
}

.axis {
	stroke: var(--fs-axis);
	stroke-width: 1.4;
}

.curve {
	fill: none;
	stroke: var(--fs-primary);
	stroke-width: 2.7;
}

.equilibrium {
	stroke: var(--fs-success);
	stroke-dasharray: 7 5;
	stroke-width: 2;
}

.dot {
	fill: var(--fs-primary);
	stroke: var(--fs-curve-dot-stroke);
	stroke-width: 1.2;
}

.axisLabel {
	fill: var(--fs-label);
	font-size: 11px;
}

.axisLabelY {
	text-anchor: end;
}

.axisLabelX {
	text-anchor: middle;
}

.axisTitle {
	fill: var(--fs-title);
	font-size: 12px;
	font-weight: 600;
	text-anchor: middle;
}

.axisTitleY {
	transform-box: fill-box;
	transform-origin: 14px 180px;
	transform: rotate(-90deg);
}

.legend {
	display: flex;
	flex-wrap: wrap;
	gap: 12px 18px;
}

.legendItem {
	align-items: center;
	display: inline-flex;
	gap: 8px;
}

.swatch {
	border-radius: 999px;
	display: inline-block;
	height: 8px;
	width: 22px;
}

.swatchCurve {
	background: var(--fs-primary);
}

.swatchEq {
	background: var(--fs-success);
}
</style>
