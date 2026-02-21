<template>
<div class="bzGraphWrap">
	<svg
		aria-label="Wippe zum Vergleich der Bemessungslasten Fd,M und Fd,K"
		class="bzGraphSvg"
		preserveAspectRatio="xMidYMid meet"
		role="img"
		viewBox="0 0 1000 510"
	>
		<defs>
			<marker
				id="bz-arrow-down"
				markerHeight="8"
				markerWidth="8"
				orient="auto"
				refX="7"
				refY="4"
				viewBox="0 0 8 8"
			>
				<path d="M0,0 L8,4 L0,8 Z" style="fill:rgb(var(--v-theme-error));" />
			</marker>
		</defs>

		<rect
			class="bg"
			height="560"
			width="1000"
			x="0"
			y="0"
		/>

		<line
			class="ground"
			x1="90"
			x2="910"
			y1="400"
			y2="400"
		/>

		<polygon class="fulcrum" points="500,330 444,400 556,400" />
		<circle
			class="pivot"
			cx="500"
			cy="330"
			r="8"
		/>

		<g :transform="tiltTransform">
			<rect
				class="plank"
				height="20"
				rx="10"
				ry="10"
				width="640"
				x="180"
				y="320"
			/>

			<line
				class="loadArrow"
				x1="220"
				x2="220"
				y1="245"
				y2="318"
			/>
			<line
				class="loadArrow"
				x1="780"
				x2="780"
				y1="245"
				y2="318"
			/>

			<image
				class="loadImg"
				:height="imageSize"
				:href="elefantImg"
				preserveAspectRatio="xMidYMid meet"
				:width="imageSize"
				x="100"
				y="58"
			/>
			<image
				class="loadImg"
				:height="imageSize"
				:href="armadilloImg"
				preserveAspectRatio="xMidYMid meet"
				:width="imageSize"
				x="600"
				y="68"
			/>
		</g>

		<foreignObject
			height="42"
			width="330"
			x="140"
			y="42"
		>
			<div class="kLabel loadLabel" xmlns="http://www.w3.org/1999/xhtml">
				<Katex inline tex="F_{d,M}" />
				<span>{{ ` = ${fmt( fdM )} kN` }}</span>
			</div>
		</foreignObject>

		<foreignObject
			height="42"
			width="330"
			x="620"
			y="42"
		>
			<div class="kLabel loadLabel" xmlns="http://www.w3.org/1999/xhtml">
				<Katex inline tex="F_{d,K}" />
				<span>{{ ` = ${fmt( fdK )} kN` }}</span>
			</div>
		</foreignObject>

		<foreignObject
			height="54"
			width="840"
			x="80"
			y="436"
		>
			<div class="kLabel resultLabel" xmlns="http://www.w3.org/1999/xhtml">
				<template v-if="inBalance">
					<span>Wippe in Waage: </span>
					<Katex inline tex="F_{d,M}" />
					<span> und </span>
					<Katex inline tex="F_{d,K}" />
					<span> sind ungefähr gleich</span>
				</template>
				<template v-else-if="tiltDeg < 0">
					<span>Wippe kippt nach links: </span>
					<Katex inline tex="F_{d,M}" />
					<span> ist größer</span>
				</template>
				<template v-else>
					<span>Wippe kippt nach rechts: </span>
					<Katex inline tex="F_{d,K}" />
					<span> ist größer</span>
				</template>
			</div>
		</foreignObject>
	</svg>
</div>
</template>

<script setup>
import { computed } from "vue";
import armadilloImg from "@/images/BZ_Armadillo.webp";
import elefantImg from "@/images/BZ_Elefant.webp";
const imageSize = 280;
const props = defineProps( {
	fdM: {
		type:    Number,
		default: 0
	},
	fdK: {
		type:    Number,
		default: 0
	}
} );

const fdM = computed( () => Math.max( 0, Number( props.fdM ) || 0 ) );
const fdK = computed( () => Math.max( 0, Number( props.fdK ) || 0 ) );

const balanceTolerance = 0.08;
const maxTiltDeg = 14;

const relativeDiff = computed( () => {
	const maxLoad = Math.max(
		fdM.value, fdK.value, 1e-6
	);
	return ( fdK.value - fdM.value ) / maxLoad;
} );

const inBalance = computed( () => Math.abs( relativeDiff.value ) <= balanceTolerance );

const tiltDeg = computed( () => {
	if ( inBalance.value ) {
		return 0;
	}

	const raw = relativeDiff.value * maxTiltDeg;
	return Math.max( -maxTiltDeg, Math.min( maxTiltDeg, raw ) );
} );

const tiltTransform = computed( () => `rotate(${tiltDeg.value} 500 330)` );

function fmt( value ) {
	return Number( value ).toFixed( 2 )
		.replace( ".", "," );
}
</script>

<style scoped>
.bzGraphWrap {
	width: 100%;
	border: 1px solid rgba(var(--v-theme-on-surface), 0.16);
	border-radius: 10px;
	overflow: hidden;
}

.bzGraphSvg {
	display: block;
	width: 100%;
	height: auto;
}

.bg {
	fill: rgba(var(--v-theme-surface), 1);
}

.ground {
	stroke: rgba(var(--v-theme-on-surface), 0.5);
	stroke-linecap: round;
	stroke-width: 4;
}

.fulcrum {
	fill: rgba(var(--v-theme-primary), 0.22);
	stroke: rgba(var(--v-theme-primary), 0.85);
	stroke-width: 2;
}

.pivot {
	fill: rgba(var(--v-theme-on-surface), 0.78);
}

.plank {
	fill: rgba(var(--v-theme-primary), 0.72);
	stroke: rgba(var(--v-theme-primary), 1);
	stroke-width: 2;
}

.loadArrow {
	stroke: rgb(var(--v-theme-error));
	stroke-width: 4;
	marker-end: url(#bz-arrow-down);
}

.loadImg {
	opacity: 0.55;
}

.loadLabel {
	display: flex;
	align-items: center;
	gap: 6px;
	color: rgba(var(--v-theme-on-surface), 0.9);
	font-size: 28px;
	font-weight: 700;
}

.resultLabel {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	color: rgba(var(--v-theme-on-surface), 0.88);
	font-size: 27px;
	font-weight: 700;
	text-align: center;
}

@media (max-width: 860px) {
	.loadLabel {
		font-size: 22px;
	}

	.resultLabel {
		font-size: 21px;
	}
}
</style>
