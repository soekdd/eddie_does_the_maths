<template>
<div class="graphWrap">
	<svg
		aria-label="Interaktive Querschnittszeichnung eines Doppelt-T-Trägers mit Bemaßung"
		class="graphSvg"
		preserveAspectRatio="xMidYMid meet"
		role="img"
		:viewBox="`0 0 ${viewWidth} ${viewHeight}`"
	>
		<defs>
			<marker
				id="dim-arrow"
				markerHeight="8"
				markerWidth="8"
				orient="auto-start-reverse"
				refX="8"
				refY="4"
				viewBox="0 0 8 8"
			>
				<path
					d="M 0 0 L 8 4 L 0 8 z"
					fill="currentColor"
				/>
			</marker>
		</defs>

		<rect
			class="bg"
			:height="viewHeight"
			:width="viewWidth"
			x="0"
			y="0"
		/>

		<g class="beam">
			<rect
				:height="tf"
				:width="bf"
				:x="beamX"
				:y="beamY"
			/>
			<rect
				:height="webHeight"
				:width="tw"
				:x="webX"
				:y="webY"
			/>
			<rect
				:height="tf"
				:width="bf"
				:x="beamX"
				:y="bottomFlangeY"
			/>
		</g>

		<g class="dims">
			<!-- h -->
			<line
				class="ext"
				:x1="beamX"
				:x2="hDimX"
				:y1="beamY"
				:y2="beamY"
			/>
			<line
				class="ext"
				:x1="beamX"
				:x2="hDimX"
				:y1="beamY + h"
				:y2="beamY + h"
			/>
			<line
				class="dim"
				:x1="hDimX"
				:x2="hDimX"
				:y1="beamY"
				:y2="beamY + h"
			/>
			<g :transform="`rotate(-90 ${hLabelCx} ${hLabelCy})`">
				<foreignObject
					:height="labelBoxHeight"
					:width="labelBoxWidth"
					:x="hLabelCx - labelBoxWidth / 2"
					:y="hLabelCy - labelBoxHeight / 2"
				>
					<div class="kLabel" xmlns="http://www.w3.org/1999/xhtml">
						<Katex inline tex="h" />
						<span v-if="!hideNumeric"> = {{ formatMm( h ) }}</span>
					</div>
				</foreignObject>
			</g>

			<!-- b_f -->
			<line
				class="ext"
				:x1="beamX"
				:x2="beamX"
				:y1="beamY"
				:y2="bfDimY"
			/>
			<line
				class="ext"
				:x1="beamX + bf"
				:x2="beamX + bf"
				:y1="beamY"
				:y2="bfDimY"
			/>
			<line
				class="dim"
				:x1="beamX"
				:x2="beamX + bf"
				:y1="bfDimY"
				:y2="bfDimY"
			/>
			<foreignObject
				:height="labelBoxHeight"
				:width="labelBoxWidth"
				:x="bfLabelCx - labelBoxWidth / 2"
				:y="bfLabelCy - labelBoxHeight / 2"
			>
				<div class="kLabel" xmlns="http://www.w3.org/1999/xhtml">
					<Katex inline tex="b_f" />
					<span v-if="!hideNumeric"> = {{ formatMm( bf ) }}</span>
				</div>
			</foreignObject>

			<!-- t_f -->
			<line
				class="ext"
				:x1="beamX + bf"
				:x2="tfDimX"
				:y1="beamY"
				:y2="beamY"
			/>
			<line
				class="ext"
				:x1="beamX + bf"
				:x2="tfDimX"
				:y1="beamY + tf"
				:y2="beamY + tf"
			/>
			<line
				class="dim-core"
				:x1="tfDimX"
				:x2="tfDimX"
				:y1="beamY"
				:y2="beamY + tf"
			/>
			<line
				class="dim-outside"
				:x1="tfDimX"
				:x2="tfDimX"
				:y1="beamY - dimOutsideLead"
				:y2="beamY"
			/>
			<line
				class="dim-outside"
				:x1="tfDimX"
				:x2="tfDimX"
				:y1="beamY + tf + dimOutsideLead"
				:y2="beamY + tf"
			/>
			<g :transform="`rotate(-90 ${tfLabelCx} ${tfLabelCy})`">
				<foreignObject
					:height="labelBoxHeight"
					:width="labelBoxWidth"
					:x="tfLabelCx - labelBoxWidth / 2"
					:y="tfLabelCy - labelBoxHeight / 2"
				>
					<div class="kLabel" xmlns="http://www.w3.org/1999/xhtml">
						<Katex inline tex="t_f" />
						<span v-if="!hideNumeric"> = {{ formatMm( tf ) }}</span>
					</div>
				</foreignObject>
			</g>

			<!-- t_w -->
			<line
				class="ext"
				:x1="webX"
				:x2="webX"
				:y1="twDimY - 18"
				:y2="twDimY + 18"
			/>
			<line
				class="ext"
				:x1="webX + tw"
				:x2="webX + tw"
				:y1="twDimY - 18"
				:y2="twDimY + 18"
			/>
			<line
				class="dim-core"
				:x1="webX"
				:x2="webX + tw"
				:y1="twDimY"
				:y2="twDimY"
			/>
			<line
				class="dim-outside"
				:x1="webX - dimOutsideLead"
				:x2="webX"
				:y1="twDimY"
				:y2="twDimY"
			/>
			<line
				class="dim-outside"
				:x1="webX + tw + dimOutsideLead"
				:x2="webX + tw"
				:y1="twDimY"
				:y2="twDimY"
			/>
			<foreignObject
				:height="labelBoxHeight"
				:width="labelBoxWidth"
				:x="twLabelCx"
				:y="twLabelCy - labelBoxHeight / 2"
			>
				<div class="kLabel" xmlns="http://www.w3.org/1999/xhtml">
					<Katex inline tex="t_w" />
					<span v-if="!hideNumeric"> = {{ formatMm( tw ) }}</span>
				</div>
			</foreignObject>
		</g>
	</svg>
</div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps( {
	h: {
		type:     Number,
		required: true
	},
	bf: {
		type:     Number,
		required: true
	},
	tf: {
		type:     Number,
		required: true
	},
	tw: {
		type:     Number,
		required: true
	},
	hideNumeric: {
		type:    Boolean,
		default: false
	},
	viewWidth: {
		type:    Number,
		default: 691
	},
	viewHeight: {
		type:    Number,
		default: 1320
	}
} );

const h = computed( () => Math.max( props.h, 1 ) );
const bf = computed( () => Math.max( props.bf, 1 ) );
const tf = computed( () => Math.max( props.tf, 1 ) );
const tw = computed( () => Math.max( props.tw, 1 ) );
const viewWidth = computed( () => Math.max( props.viewWidth, 1 ) );
const viewHeight = computed( () => Math.max( props.viewHeight, 1 ) );

const beamX = computed( () => viewWidth.value / 2 - bf.value / 2 );
const beamY = computed( () => viewHeight.value / 2 - h.value / 2 );
const webX = computed( () => viewWidth.value / 2 - tw.value / 2 );
const webY = computed( () => beamY.value + tf.value );
const webHeight = computed( () => Math.max( h.value - 2 * tf.value, 0 ) );
const bottomFlangeY = computed( () => beamY.value + h.value - tf.value );

const hDimX = computed( () => beamX.value - 95 );
const bfDimY = computed( () => beamY.value - 75 );
const tfDimX = computed( () => beamX.value + bf.value + 95 );
const twDimY = computed( () => beamY.value + h.value / 2 );
const dimOutsideLead = 24;

const hideNumeric = computed( () => props.hideNumeric );
const labelBoxWidth = 220;
const labelBoxHeight = 44;

const hLabelCx = computed( () => hDimX.value - 28 );
const hLabelCy = computed( () => beamY.value + h.value / 2 );
const bfLabelCx = computed( () => beamX.value + bf.value / 2 );
const bfLabelCy = computed( () => bfDimY.value - 28 );
const tfLabelCx = computed( () => tfDimX.value + 48 );
const tfLabelCy = computed( () => beamY.value + tf.value / 2 );
const twLabelCx = computed( () => webX.value + tw.value + dimOutsideLead + 20 );
const twLabelCy = computed( () => twDimY.value - 18 );

function formatMm( value ) {
	if ( Number.isInteger( value ) ) {
		return `${value} mm`;
	}

	return `${value.toFixed( 1 ).replace( ".", "," )} mm`;
}
</script>

<style scoped>
.graphWrap {
	background: rgb(var(--v-theme-surface));
	border: 1px solid rgba(var(--v-theme-on-surface), 0.16);
	border-radius: 10px;
}

.graphSvg {
	display: block;
	width: 100%;
	height: auto;
	max-height: 80vh;
}

.bg {
	fill: rgba(var(--v-theme-primary), 0.08);
}

.beam rect {
	fill: rgba(var(--v-theme-primary), 0.24);
	stroke: rgb(var(--v-theme-primary));
	stroke-width: 1.8;
	vector-effect: non-scaling-stroke;
}

.dims {
	color: rgba(var(--v-theme-on-surface), 0.92);
}

.dims .ext {
	stroke: rgba(var(--v-theme-on-surface), 0.58);
	stroke-width: 1.4;
	vector-effect: non-scaling-stroke;
}

.dims .dim {
	stroke: currentColor;
	stroke-width: 1.6;
	marker-start: url(#dim-arrow);
	marker-end: url(#dim-arrow);
	vector-effect: non-scaling-stroke;
}

.dims .dim-core {
	stroke: currentColor;
	stroke-width: 1.6;
	vector-effect: non-scaling-stroke;
}

.dims .dim-outside {
	stroke: currentColor;
	stroke-width: 1.6;
	marker-end: url(#dim-arrow);
	vector-effect: non-scaling-stroke;
}

.dims .kLabel {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	width: 100%;
	height: 100%;
	color: rgb(var(--v-theme-on-surface));
	font-size: 34px;
	font-weight: 600;
	white-space: nowrap;
	text-shadow: 0 0 2px rgba(var(--v-theme-surface), 0.96);
}

.dims .kLabel :deep(.katex) {
	font-size: 1.05em;
}
</style>
