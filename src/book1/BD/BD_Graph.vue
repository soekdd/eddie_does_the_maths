<template>
<div class="bdGraphWrap">
	<svg
		aria-label="Träger-System: beidseitig gelenkig gelagert, Punktlast in Feldmitte und Streckenlast aus Eigengewicht"
		class="bdGraphSvg"
		role="img"
		:viewBox="graphViewBox"
	>
		<defs>
			<marker
				id="bdg-arrow-down"
				markerHeight="8"
				markerWidth="8"
				orient="auto"
				refX="7"
				refY="4"
				viewBox="0 0 8 8"
			>
				<path d="M0,0 L8,4 L0,8 Z" style="fill:rgb(var(--v-theme-error));" />
			</marker>
			<marker
				id="bdg-arrow-up"
				markerHeight="8"
				markerWidth="8"
				orient="auto"
				refX="7"
				refY="4"
				viewBox="0 0 8 8"
			>
				<path d="M0,0 L8,4 L0,8 Z" style="fill:rgb(var(--v-theme-primary));" />
			</marker>
			<marker
				id="bdg-arrow-dim"
				markerHeight="8"
				markerWidth="8"
				orient="auto"
				refX="7"
				refY="4"
				viewBox="0 0 8 8"
			>
				<path d="M0,0 L8,4 L0,8 Z" style="fill:rgba(var(--v-theme-on-surface),0.75);" />
			</marker>
		</defs>

		<rect class="bg"
			height="620"
			width="1100"
			x="0"
			y="0"
		/>

		<text v-if="!reduced"
			class="systemTitle"
			text-anchor="middle"
			:x="( xA + xB ) / 2"
			y="36"
		>
			Einfeldträger (beidseitig gelenkig) mit P in Feldmitte und q_g
		</text>

		<line class="beam"
			:x1="xA"
			:x2="xB"
			:y1="yBeam"
			:y2="yBeam"
		/>
		<text class="nodeLabel" :x="xA - 18" :y="yBeam - 10">A</text>
		<text class="nodeLabel" :x="xB + 8" :y="yBeam - 10">B</text>

		<polygon class="support pin" :points="pinPoints()" />
		<line class="ground"
			:x1="xA - 50"
			:x2="xA + 50"
			:y1="ySupportBase + 34"
			:y2="ySupportBase + 34"
		/>

		<polygon class="support roller" :points="rollerPoints()" />
		<circle class="rollerWheel"
			:cx="xB - 18"
			:cy="ySupportBase + 42"
			r="6"
		/>
		<circle class="rollerWheel"
			:cx="xB"
			:cy="ySupportBase + 42"
			r="6"
		/>
		<circle class="rollerWheel"
			:cx="xB + 18"
			:cy="ySupportBase + 42"
			r="6"
		/>
		<line class="ground"
			:x1="xB - 55"
			:x2="xB + 55"
			:y1="ySupportBase + 52"
			:y2="ySupportBase + 52"
		/>

		<line class="loadGuide"
			:x1="xA"
			:x2="xB"
			:y1="yDistLoadTop"
			:y2="yDistLoadTop"
		/>
		<line
			v-for="( xArrow, idx ) in distributedArrowXs"
			:key="`qg-${idx}`"
			class="loadArrow"
			:x1="xArrow"
			:x2="xArrow"
			:y1="yDistLoadTop"
			:y2="yBeam - 8"
		/>
		<text class="label"
			text-anchor="middle"
			:x="( xA + xB ) / 2 - 200"
			:y="yDistLoadTop - 24"
		>
			Eigengewicht des Trägers
		</text>

		<line class="pointLoad"
			:x1="xMid"
			:x2="xMid"
			:y1="yPointLoadTop"
			:y2="yBeam - 8"
		/>
		<text class="label" :x="xMid + 14" :y="yPointLoadTop + 10">
			{{ reduced ? "Punktlast P" : `Punktlast P = ${fmt( pointLoadKN, 1, true )} kN` }}
		</text>

		<line class="reaction"
			:x1="xA"
			:x2="xA"
			:y1="ySupportBase + 66"
			:y2="yBeam + 8"
		/>
		<line class="reaction"
			:x1="xB"
			:x2="xB"
			:y1="ySupportBase + 66"
			:y2="yBeam + 8"
		/>
		<text class="label"
			text-anchor="end"
			:x="xA - 8"
			:y="ySupportBase + 86"
		>R_A</text>
		<text class="label" :x="xB + 8" :y="ySupportBase + 86">R_B</text>

		<line class="extLine"
			:x1="xA"
			:x2="xA"
			:y1="yBeam"
			:y2="yDim"
		/>
		<line class="extLine"
			:x1="xB"
			:x2="xB"
			:y1="yBeam"
			:y2="yDim"
		/>
		<line class="dimLine"
			:x1="xA"
			:x2="xB"
			:y1="yDim"
			:y2="yDim"
		/>
		<line class="midTick"
			:x1="xMid"
			:x2="xMid"
			:y1="yDim - 9"
			:y2="yDim + 9"
		/>
		<text class="label dimLabel"
			text-anchor="middle"
			:x="xMid"
			:y="yDim - 10"
		>
			{{ reduced ? "L" : `L = ${fmt( Lm, 2, true )} m` }}
		</text>
		<text class="label small"
			text-anchor="middle"
			:x="( xA + xMid ) / 2"
			:y="yDim + 23"
		>L/2</text>
		<text class="label small"
			text-anchor="middle"
			:x="( xMid + xB ) / 2"
			:y="yDim + 23"
		>L/2</text>

		<g v-if="!reduced">
			<line class="separator"
				:x1="130"
				:x2="970"
				y1="420"
				y2="420"
			/>
			<text class="compareHeader"
				text-anchor="middle"
				x="550"
				y="452"
			>Wertevergleich DIN vs. TGL</text>

			<rect class="dinChip"
				height="16"
				rx="3"
				ry="3"
				width="16"
				x="165"
				y="470"
			/>
			<text class="valueDin" x="190" y="483">
				{{ `DIN: q_g = ${fmt( qgDinKNm, 3, true )} kN/m, R_A = R_B = ${fmt( reactionDinKN, 2, true )} kN` }}
			</text>

			<rect class="tglChip"
				height="16"
				rx="3"
				ry="3"
				width="16"
				x="165"
				y="500"
			/>
			<text class="valueTgl" x="190" y="513">
				{{ `TGL: q_g = ${fmt( qgTglKNm, 3, true )} kN/m, R_A = R_B = ${fmt( reactionTglKN, 2, true )} kN` }}
			</text>
		</g>
	</svg>
</div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps( {
	Lm: {
		type:    Number,
		default: 25
	},
	pointLoadKN: {
		type:    Number,
		default: 100
	},
	qgDinKNm: {
		type:    Number,
		default: 2.1
	},
	qgTglKNm: {
		type:    Number,
		default: 2.0
	},
	reactionDinKN: {
		type:    Number,
		default: 76
	},
	reactionTglKN: {
		type:    Number,
		default: 75
	},
	reduced: {
		type:    Boolean,
		default: false
	}
} );

const Lm = computed( () => Math.max( 0.1, Number( props.Lm ) || 0.1 ) );
const pointLoadKN = computed( () => Math.max( 0, Number( props.pointLoadKN ) || 0 ) );
const qgDinKNm = computed( () => Math.max( 0, Number( props.qgDinKNm ) || 0 ) );
const qgTglKNm = computed( () => Math.max( 0, Number( props.qgTglKNm ) || 0 ) );
const reactionDinKN = computed( () => Math.max( 0, Number( props.reactionDinKN ) || 0 ) );
const reactionTglKN = computed( () => Math.max( 0, Number( props.reactionTglKN ) || 0 ) );
const reduced = computed( () => props.reduced === true );

const xA = 130;
const xB = 970;
const xMid = ( xA + xB ) / 2;
const yBeam = 250;
const ySupportBase = 268;
const yDistLoadTop = 150;
const yPointLoadTop = 80;
const yDim = 370;
const viewBoxWidth = 1100;
const viewBoxHeightFull = 620;
const viewBoxHeightReduced = 430;
const graphViewBox = computed( () =>
	`0 0 ${viewBoxWidth} ${reduced.value ? viewBoxHeightReduced : viewBoxHeightFull}` );

const distributedArrowCount = computed( () => {
	const count = Math.round( Lm.value / 2 );
	return Math.max( 7, Math.min( 16, count ) );
} );

const distributedArrowXs = computed( () => {
	const count = distributedArrowCount.value;
	const step = ( xB - xA ) / ( count - 1 );

	return Array.from( { length: count }, ( _, i ) => xA + i * step );
} );

function pinPoints() {
	const topY = ySupportBase + 2;
	const baseY = ySupportBase + 34;
	return `${xA},${topY} ${xA - 24},${baseY} ${xA + 24},${baseY}`;
}

function rollerPoints() {
	const topY = ySupportBase + 2;
	const baseY = ySupportBase + 30;
	return `${xB},${topY} ${xB - 24},${baseY} ${xB + 24},${baseY}`;
}

function fmt(
	value, digits = 2, trim = false
) {
	const num = Number( value );

	if ( !Number.isFinite( num ) ) {
		return "0";
	}

	let fixed = num.toFixed( digits );

	if ( trim ) {
		fixed = fixed.replace( /(?:\.0+|(\.\d+?)0+)$/, "$1" );
	}

	return fixed.replace( ".", "," );
}
</script>

<style scoped>
.bdGraphWrap {
	border: 1px solid rgba(var(--v-theme-on-surface), 0.16);
	border-radius: 10px;
	background: rgb(var(--v-theme-surface));
	overflow: hidden;
}

.bdGraphSvg {
	display: block;
	width: 100%;
	height: auto;
}

.bg {
	fill: rgba(var(--v-theme-surface), 1);
}

.beam {
	stroke: rgba(var(--v-theme-on-surface), 0.9);
	stroke-width: 6;
}

.support {
	fill: rgba(var(--v-theme-primary), 0.18);
	stroke: rgba(var(--v-theme-primary), 0.9);
	stroke-width: 2;
}

.rollerWheel {
	fill: rgba(var(--v-theme-primary), 0.2);
	stroke: rgba(var(--v-theme-primary), 0.9);
	stroke-width: 1.6;
}

.ground {
	stroke: rgba(var(--v-theme-on-surface), 0.65);
	stroke-width: 1.7;
	stroke-dasharray: 6 5;
}

.loadGuide {
	stroke: rgba(var(--v-theme-on-surface), 0.5);
	stroke-width: 1.5;
}

.loadArrow {
	stroke: rgb(var(--v-theme-error));
	stroke-width: 2;
	marker-end: url(#bdg-arrow-down);
}

.pointLoad {
	stroke: rgb(var(--v-theme-error));
	stroke-width: 2.8;
	marker-end: url(#bdg-arrow-down);
}

.reaction {
	stroke: rgb(var(--v-theme-primary));
	stroke-width: 2.2;
	marker-end: url(#bdg-arrow-up);
}

.extLine {
	stroke: rgba(var(--v-theme-on-surface), 0.6);
	stroke-width: 1.4;
}

.dimLine {
	stroke: rgba(var(--v-theme-on-surface), 0.75);
	stroke-width: 1.4;
	marker-start: url(#bdg-arrow-dim);
	marker-end: url(#bdg-arrow-dim);
}

.midTick {
	stroke: rgba(var(--v-theme-on-surface), 0.8);
	stroke-width: 1.4;
}

.separator {
	stroke: rgba(var(--v-theme-on-surface), 0.24);
	stroke-width: 1.2;
}

.label,
.nodeLabel,
.systemTitle,
.compareHeader,
.valueDin,
.valueTgl {
	fill: rgba(var(--v-theme-on-surface), 0.92);
	font-family: "Avenir Next", "Segoe UI", sans-serif;
}

.label {
	font-size: 15px;
}

.label.small {
	font-size: 13px;
}

.nodeLabel {
	font-size: 15px;
	font-weight: 700;
}

.systemTitle {
	font-size: 18px;
	font-weight: 600;
}

.dimLabel {
	font-weight: 600;
}

.compareHeader {
	font-size: 16px;
	font-weight: 700;
}

.valueDin,
.valueTgl {
	font-size: 15px;
	font-weight: 600;
}

.valueDin {
	fill: rgba(var(--v-theme-primary), 0.95);
}

.valueTgl {
	fill: rgba(var(--v-theme-warning), 0.98);
}

.dinChip {
	fill: rgba(var(--v-theme-primary), 0.95);
}

.tglChip {
	fill: rgba(var(--v-theme-warning), 0.98);
}
</style>
