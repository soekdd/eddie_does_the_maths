<!-- i18n-ally-scope: useI18n("book1.IP") -->
<template>
<svg
	:aria-label="t( 'sections.controller.loopAria' )"
	class="controlLoop"
	role="img"
	viewBox="0 0 920 360"
	xmlns="http://www.w3.org/2000/svg"
>
	<defs>
		<marker
			id="ip-control-loop-arrow"
			markerHeight="10"
			markerWidth="10"
			orient="auto"
			refX="9"
			refY="5"
		>
			<path class="arrowHead" d="M 0 0 L 10 5 L 0 10 z" />
		</marker>
	</defs>

	<rect class="canvas"
		height="360"
		rx="0"
		width="920"
		x="0"
		y="0"
	/>

	<g class="wire">
		<line x1="46"
			x2="127"
			y1="170"
			y2="170"
		/>
		<line x1="183"
			x2="240"
			y1="170"
			y2="170"
		/>
		<line x1="400"
			x2="470"
			y1="170"
			y2="170"
		/>
		<line x1="700"
			x2="850"
			y1="170"
			y2="170"
		/>
		<path d="M 795 170 L 795 292 L 155 292 L 155 199" />
		<line x1="585"
			x2="585"
			y1="50"
			y2="105"
		/>
	</g>

	<circle class="sum"
		cx="155"
		cy="170"
		r="28"
	/>
	<text class="sumLabel" x="155" y="156">+</text>
	<text class="sumLabel" x="155" y="188">-</text>
	<foreignObject class="mathObject"
		height="28"
		width="98"
		x="0"
		y="128"
	>
		<div class="mathLabel" xmlns="http://www.w3.org/1999/xhtml">
			<Katex tex="z_{\mathrm{ref}}=0" />
		</div>
	</foreignObject>
	<foreignObject class="mathObject"
		height="28"
		width="44"
		x="194"
		y="141"
	>
		<div class="mathLabel" xmlns="http://www.w3.org/1999/xhtml">
			<Katex tex="e" />
		</div>
	</foreignObject>
	<text class="small" x="104" y="210">{{ t( "sections.controller.loopSum" ) }}</text>

	<g class="block">
		<rect height="90"
			width="160"
			x="240"
			y="125"
		/>
		<text class="blockTitle" x="320" y="145">{{ t( "sections.controller.loopController" ) }}</text>
		<foreignObject class="mathObject"
			height="52"
			width="130"
			x="255"
			y="161"
		>
			<div class="mathLabel" xmlns="http://www.w3.org/1999/xhtml">
				<Katex aligned tex="u&=K e\\ &= -Kz" />
			</div>
		</foreignObject>
	</g>

	<g class="block plant">
		<rect height="130"
			width="230"
			x="470"
			y="105"
		/>
		<text class="blockTitle" x="585" y="136">{{ t( "sections.controller.loopPlant" ) }}</text>
		<foreignObject class="mathObject"
			height="78"
			width="220"
			x="475"
			y="151"
		>
			<div class="mathLabel plantMath" xmlns="http://www.w3.org/1999/xhtml">
				<Katex aligned :tex="plantTex" />
			</div>
		</foreignObject>
	</g>

	<foreignObject class="mathObject"
		height="30"
		width="96"
		x="382"
		y="132"
	>
		<div class="mathLabel" xmlns="http://www.w3.org/1999/xhtml">
			<Katex tex="u" />
		</div>
	</foreignObject>
	<foreignObject class="mathObject"
		height="28"
		width="38"
		x="716"
		y="130"
	>
		<div class="mathLabel" xmlns="http://www.w3.org/1999/xhtml">
			<Katex tex="z" />
		</div>
	</foreignObject>
	<foreignObject class="mathObject feedback"
		height="28"
		width="72"
		x="336"
		y="299"
	>
		<div class="mathLabel" xmlns="http://www.w3.org/1999/xhtml">
			<Katex tex="H=I" />
		</div>
	</foreignObject>
	<text class="signal feedback" x="480" y="316">{{ t( "sections.controller.loopMeasurement" ) }}</text>
	<foreignObject class="mathObject disturbance"
		height="28"
		width="28"
		x="560"
		y="28"
	>
		<div class="mathLabel" xmlns="http://www.w3.org/1999/xhtml">
			<Katex tex="d" />
		</div>
	</foreignObject>
	<text class="signal disturbance" x="638" y="42">{{ t( "sections.controller.loopDisturbance" ) }}</text>
	<foreignObject class="mathObject closedLoopObject"
		height="34"
		width="230"
		x="345"
		y="59"
	>
		<div class="mathLabel" xmlns="http://www.w3.org/1999/xhtml">
			<Katex tex="\dot z=(A-BK)z" />
		</div>
	</foreignObject>
</svg>
</template>

<script setup>
import { computed } from "vue";
import Katex from "@/components/Katex.vue";
import { useI18n } from "@/utils/i18n.mjs";

const { t } = useI18n( "book1.IP" );

function texText( value ) {
	const replacements = {
		"\\": "\\textbackslash{}",
		"#":  "\\#",
		$:    "\\$",
		"%":  "\\%",
		"&":  "\\&",
		_:    "\\_",
		"{":  "\\{",
		"}":  "\\}"
	};

	return String( value ?? "" ).replace( /[\\#$%&_{}]/g, ( char ) => replacements[ char ] );
}

const plantTex = computed( () => [
	"\\dot z&=Az+Bu",
	"z&=\\begin{pmatrix}x&\\dot{x}&\\theta&\\dot{\\theta}\\end{pmatrix}^{\\mathsf T}",
	`u&=\\text{${texText( t( "sections.controller.loopForce" ) )}}`
].join( "\\\\" ) );
</script>

<style scoped>
.controlLoop {
	display: block;
	width: 100%;
	height: auto;
	color: rgb(var(--v-theme-on-surface, 17, 17, 17));
}

.canvas {
	fill: rgb(var(--v-theme-surface, 255, 255, 255));
}

.wire {
	fill: none;
	marker-end: url("#ip-control-loop-arrow");
	stroke: currentColor;
	stroke-linecap: round;
	stroke-linejoin: round;
	stroke-width: 3;
}

.arrowHead {
	fill: currentColor;
}

.sum,
.block rect {
	fill: rgb(var(--v-theme-surface, 255, 255, 255));
	stroke: currentColor;
	stroke-width: 3;
}

.plant rect {
	fill: rgba(var(--v-theme-primary, 25, 118, 210), 0.07);
}

.sumLabel,
.blockTitle,
.mutedFormula,
.signal,
.small {
	dominant-baseline: middle;
	fill: currentColor;
	font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
	letter-spacing: 0;
	text-anchor: middle;
}

.sumLabel {
	font-size: 24px;
	font-weight: 700;
}

.blockTitle {
	font-size: 18px;
	font-weight: 700;
}

.mutedFormula,
.signal,
.small {
	font-size: 14px;
}

.mutedFormula,
.small {
	opacity: 0.72;
}

.mathObject {
	color: currentColor;
	overflow: visible;
	pointer-events: none;
}

.mathLabel {
	align-items: center;
	display: flex;
	height: 100%;
	justify-content: center;
	line-height: 1;
	width: 100%;
}

.mathLabel :deep(.katex) {
	font-size: 1.04rem;
}

.smallMath :deep(.katex) {
	font-size: 0.82rem;
}

.feedback {
	opacity: 0.8;
}

.disturbance {
	font-style: italic;
}

.closedLoopObject {
	color: rgb(var(--v-theme-primary, 25, 118, 210));
	font-weight: 700;
}

.closedLoopObject :deep(.katex) {
	font-size: 1.12rem;
}
</style>
