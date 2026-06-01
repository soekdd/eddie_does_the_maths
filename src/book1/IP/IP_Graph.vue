<template>
<svg
	:aria-label
	class="inverse-pendulum-skateboard"
	role="img"
	:viewBox
>
	<defs>
		<marker
			id="arrow-head"
			markerHeight="8"
			markerWidth="8"
			orient="auto"
			refX="3"
			refY="3"
		>
			<path d="M0,0 L6,3 L0,6 Z" fill="currentColor" />
		</marker>
		<marker
			id="force-arrow-head"
			markerHeight="8"
			markerWidth="8"
			orient="auto"
			refX="3"
			refY="3"
		>
			<path class="force-arrow-head" d="M0,0 L6,3 L0,6 Z" />
		</marker>
		<marker
			id="force-arrow-head-limited"
			markerHeight="8"
			markerWidth="8"
			orient="auto"
			refX="3"
			refY="3"
		>
			<path class="force-arrow-head-limited" d="M0,0 L6,3 L0,6 Z" />
		</marker>

		<filter id="soft-shadow"
			height="140%"
			width="140%"
			x="-20%"
			y="-20%"
		>
			<feDropShadow dx="0"
				dy="3"
				flood-opacity="0.22"
				stdDeviation="3"
			/>
		</filter>
	</defs>

	<!-- Background -->
	<rect class="bg"
		:height="viewBoxHeight"
		rx="18"
		:width="viewBoxWidth"
		:x="viewBoxX"
		:y="viewBoxY"
	/>

	<!-- Ground / coordinate axis -->
	<line
		class="ground-line"
		:x1="padding"
		:x2="width - padding"
		:y1="groundY"
		:y2="groundY"
	/>
	<line
		class="axis-line"
		:x1="originX"
		:x2="originX"
		:y1="groundY + 24"
		:y2="padding"
	/>
	<text class="axis-label" :x="width - padding - 10" :y="groundY + 22">x</text>
	<text class="axis-label" :x="originX + 8" :y="padding + 12">y</text>

	<!-- Cart position indicator -->
	<g v-if="showPositionGuide" class="position-guide">
		<line :x1="originX"
			:x2="cartCx"
			:y1="groundY + 12"
			:y2="groundY + 12"
		/>
		<text text-anchor="middle" :x="(originX + cartCx) / 2" :y="groundY + 34">
			x = {{ format(positionX) }} m
		</text>
	</g>

	<!-- Skateboard / cart -->
	<g filter="url(#soft-shadow)" :transform="`translate(${cartCx}, ${cartY})`">
		<!-- deck -->
		<path
			class="deck"
			:d="deckPath"
		/>

		<!-- grip tape -->
		<path
			class="grip"
			:d="gripPath"
		/>

		<!-- trucks -->
		<g class="truck">
			<line :x1="-wheelBase / 2"
				:x2="-wheelBase / 2"
				y1="15"
				y2="29"
			/>
			<line :x1="wheelBase / 2"
				:x2="wheelBase / 2"
				y1="15"
				y2="29"
			/>
		</g>

		<!-- wheels -->
		<circle class="wheel"
			:cx="-wheelBase / 2"
			cy="35"
			:r="wheelRadius"
		/>
		<circle class="wheel"
			:cx="wheelBase / 2"
			cy="35"
			:r="wheelRadius"
		/>

		<!-- pivot -->
		<circle class="pivot"
			cx="0"
			:cy="-deckHeight / 2"
			r="7"
		/>
	</g>

	<!-- Pendulum body image: bottom center slightly below pivot, rotating around pivot. -->
	<g class="pendulum-image-layer" :transform="pendulumImageTransform">
		<image
			class="pendulum-image"
			:height="pendulumImageHeight"
			:href="activePendulumImage"
			preserveAspectRatio="xMidYMid meet"
			:style="pendulumImageStyle"
			:width="pendulumImageWidth"
			:x="-pendulumImageWidth / 2"
			:y="-pendulumImageHeight + pendulumImagePivotDrop"
		/>
	</g>

	<!-- Pendulum -->
	<g class="pendulum">
		<line class="rod"
			:x1="pivot.x"
			:x2="massCenter.x"
			:y1="pivot.y"
			:y2="massCenter.y"
		/>
		<circle class="pivot-dot"
			:cx="pivot.x"
			:cy="pivot.y"
			r="5"
		/>
		<text class="local-label" :x="massCenter.x + 14" :y="massCenter.y + 4">
			m = {{ format(mass) }} kg
		</text>
	</g>

	<!-- Upright reference and angle arc -->
	<g v-if="showAngle" class="angle-layer">
		<line class="upright-ref"
			:x1="pivot.x"
			:x2="pivot.x"
			:y1="pivot.y"
			:y2="pivot.y - rodLengthPx"
		/>
		<path v-if="Math.abs(forceU)>0.1"
			class="angle-arc"
			:d="angleArcPath"
			marker-end="url(#arrow-head)"
		/>
		<text class="angle-label" :x="angleLabel.x" :y="angleLabel.y">
			θ = {{ formatDeg(theta) }}°
		</text>
	</g>

	<!-- Force vector -->
	<g v-if="showForce" class="force-layer" :class="{ 'is-limited': forceLimited }">
		<line v-if="Math.abs(forceU)>0.1"
			class="force-arrow"
			:marker-end="forceMarkerEnd"
			:x1="cartCx"
			:x2="cartCx + forceVectorLength"
			:y1="cartY - 56"
			:y2="cartY - 56"
		/>
		<text
			class="force-label"
			text-anchor="middle"
			:x="cartCx + forceVectorLength / 2"
			:y="cartY - 66"
		>
			u = {{ format(forceU) }} N
		</text>
	</g>

	<!-- Length annotation -->
	<g v-if="showLength" class="length-layer">
		<line
			class="length-line"
			:x1="pivot.x + 18"
			:x2="massCenter.x + 18"
			:y1="pivot.y"
			:y2="massCenter.y"
		/>
		<text
			class="length-label"
			:x="(pivot.x + massCenter.x) / 2 + 28"
			:y="(pivot.y + massCenter.y) / 2"
		>
			l = {{ format(lengthL) }} m
		</text>
	</g>

	<!-- Parameter panel -->
	<g v-if="showParameterPanel" class="panel" :transform="`translate(${panelX}, ${panelY})`">
		<rect height="132" rx="12" width="210" />
		<text class="panel-title" x="14" y="24">Modellparameter</text>
		<text x="14" y="50">M = {{ format(cartMass) }} kg</text>
		<text x="14" y="72">m = {{ format(mass) }} kg</text>
		<text x="14" y="94">l = {{ format(lengthL) }} m</text>
		<text x="14" y="116">g = {{ format(gravity) }} m/s²</text>
	</g>
</svg>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useTheme } from "vuetify";
import pendulumImage from "./IP_Pendulum.webp";
import pendulumFallImage from "./IP_Pendulum_fall.webp";

type Point = {
  x: number
  y: number
}

const props = withDefaults( defineProps<{
  /** SVG width in px */
  width?: number
  /** SVG height in px */
  height?: number

  /** Cart/skateboard mass M in kg */
  cartMass?: number
  /** Pendulum mass m in kg */
  mass?: number
  /** Pendulum length l in m, pivot to mass center */
  lengthL?: number
  /** Gravity g in m/s² */
  gravity?: number

  /** Cart position x in m */
  positionX?: number
  /** Pendulum angle theta in radians; 0 is upright, positive leans right */
  theta?: number
  /** Optional force u in N */
  forceU?: number

  /** Drawing scale for horizontal position: px per meter */
  xScale?: number
  /** Drawing scale for pendulum length: px per meter */
  lengthScale?: number

  showAngle?: boolean
  showForce?: boolean
  showLength?: boolean
  showPositionGuide?: boolean
  showParameterPanel?: boolean
  unstable?: boolean
  forceLimited?: boolean
  ariaLabel?: string
}>(), {
	width:              860,
	height:             520,
	cartMass:           4,
	mass:               55,
	lengthL:            1.1,
	gravity:            9.81,
	positionX:          0,
	theta:              0.22,
	forceU:             0,
	xScale:             85,
	lengthScale:        170,
	showAngle:          true,
	showForce:          true,
	showLength:         true,
	showPositionGuide:  true,
	showParameterPanel: true,
	unstable:           false,
	forceLimited:       false,
	ariaLabel:          "Inverses Pendel auf einem Skateboard-Schlitten"
} );

const padding = 48;
const viewBoxX = 0;
const viewBoxY = -50;
const viewBoxWidth = 860;
const viewBoxHeight = 480;
const viewBox = `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`;
const groundY = computed( () => props.height - 76 );
const originX = computed( () => props.width / 2 );

const deckWidth = 210;
const deckHeight = 22;
const wheelBase = 132;
const wheelRadius = 13;
const pendulumImageAspect = 814 / 1130;

const cartCx = computed( () => originX.value + props.positionX * props.xScale );
const cartY = computed( () => groundY.value - 48 );

const rodLengthPx = computed( () => Math.max( 70, props.lengthL * props.lengthScale ) );

const pivot = computed<Point>( () => ( {
	x: cartCx.value,
	y: cartY.value - deckHeight / 2
} ) );

const massCenter = computed<Point>( () => ( {
	x: pivot.value.x + Math.sin( props.theta ) * rodLengthPx.value,
	y: pivot.value.y - Math.cos( props.theta ) * rodLengthPx.value
} ) );
const thetaDeg = computed( () => props.theta * 180 / Math.PI );
const pendulumImageHeight = computed( () => rodLengthPx.value * 2 );
const pendulumImageWidth = computed( () => pendulumImageHeight.value * pendulumImageAspect );
const pendulumImagePivotDrop = computed( () => pendulumImageHeight.value * 0.03 );
const pendulumImageTransform = computed( () =>
	`translate(${pivot.value.x}, ${pivot.value.y}) rotate(${thetaDeg.value})` );
const activePendulumImage = computed( () => props.unstable ? pendulumFallImage : pendulumImage );
const forceMarkerEnd = computed( () =>
	props.forceLimited ? "url(#force-arrow-head-limited)" : "url(#force-arrow-head)" );
const theme = useTheme();
const pendulumImageStyle = computed( () => theme.global.current.value.dark ? { filter: "invert(1)" } : null );

const deckPath = computed( () => {
	const w = deckWidth;
	const h = deckHeight;
	return [
		`M ${-w / 2 + 18} ${-h / 2}`,
		`Q ${-w / 2} ${-h / 2} ${-w / 2 - 15} 0`,
		`Q ${-w / 2} ${h / 2} ${-w / 2 + 18} ${h / 2}`,
		`L ${w / 2 - 18} ${h / 2}`,
		`Q ${w / 2} ${h / 2} ${w / 2 + 15} 0`,
		`Q ${w / 2} ${-h / 2} ${w / 2 - 18} ${-h / 2}`,
		"Z"
	].join( " " );
} );

const gripPath = computed( () => {
	const w = deckWidth - 48;
	const h = deckHeight - 10;
	return `M ${-w / 2} ${-h / 2} Q 0 ${-h / 2 - 6} ${w / 2}` +
        ` ${-h / 2} L ${w / 2} ${h / 2} Q 0 ${h / 2 + 6} ${-w / 2} ${h / 2} Z`;
} );

const angleRadius = computed( () => Math.min( 56, rodLengthPx.value * 0.35 ) );

const angleArcPath = computed( () => {
	const r = angleRadius.value;
	const start = {
		x: pivot.value.x,
		y: pivot.value.y - r
	};
	const end = {
		x: pivot.value.x + Math.sin( props.theta ) * r,
		y: pivot.value.y - Math.cos( props.theta ) * r
	};
	const largeArc = Math.abs( props.theta ) > Math.PI ? 1 : 0;
	const sweep = props.theta >= 0 ? 1 : 0;
	return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
} );

const angleLabel = computed<Point>( () => {
	const halfTheta = props.theta / 2;
	const r = angleRadius.value + 24;
	return {
		x: pivot.value.x + Math.sin( halfTheta ) * r + 6,
		y: pivot.value.y - Math.cos( halfTheta ) * r
	};
} );

const forceVectorLength = computed( () => {
	const maxLen = 120;
	const raw = props.forceU * 3;

	if ( Math.abs( raw ) < 8 ) {
		return props.forceU >= 0 ? 8 : -8;
	}

	return Math.max( -maxLen, Math.min( maxLen, raw ) );
} );

const panelX = computed( () => props.width - 250 );
const panelY = 34;

function format( value: number ): string {
	if ( !Number.isFinite( value ) ) {
		return "–";
	}

	return new Intl.NumberFormat( "de-DE", { maximumFractionDigits: 2 } ).format( value );
}

function formatDeg( rad: number ): string {
	return format( rad * 180 / Math.PI );
}
</script>

<style scoped>
.pendulum-image {
	opacity: 0.55;
}
.inverse-pendulum-skateboard {
  max-width: 100%;
  height: auto;
  color: rgb(var(--v-theme-on-surface));
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.bg {
  fill: rgba(var(--v-theme-surface), 1);
}

.ground-line {
  stroke: rgba(var(--v-theme-on-surface), 0.55);
  stroke-width: 2.5;
  stroke-linecap: round;
}

.axis-line {
  stroke: rgba(var(--v-theme-on-surface), 0.2);
  stroke-width: 1.5;
  stroke-dasharray: 5 6;
}

.axis-label,
.local-label,
.angle-label,
.force-label,
.length-label {
  fill: rgba(var(--v-theme-on-surface), 0.84);
  font-size: 14px;
  dominant-baseline: middle;
}

.position-guide line {
  stroke: rgba(var(--v-theme-on-surface), 0.34);
  stroke-width: 1.5;
  stroke-dasharray: 4 5;
}

.position-guide text {
  fill: rgba(var(--v-theme-on-surface), 0.62);
  font-size: 13px;
}

.deck {
  fill: rgba(var(--v-theme-primary), 0.72);
  stroke: rgba(var(--v-theme-primary), 1);
  stroke-width: 2;
}

.grip {
  fill: rgba(var(--v-theme-on-surface), 0.72);
  opacity: 0.72;
}

.truck line {
  stroke: rgba(var(--v-theme-on-surface), 0.46);
  stroke-width: 5;
  stroke-linecap: round;
}

.wheel {
  fill: rgba(var(--v-theme-on-surface), 0.92);
  stroke: rgba(var(--v-theme-on-surface), 0.46);
  stroke-width: 3;
}

.pivot {
  fill: rgba(var(--v-theme-warning), 0.98);
  stroke: rgba(var(--v-theme-on-surface), 0.72);
  stroke-width: 2;
}

.rod {
  stroke: rgba(var(--v-theme-on-surface), 0.88);
  stroke-width: 7;
  stroke-linecap: round;
}

.pivot-dot {
  fill: rgba(var(--v-theme-surface), 1);
  stroke: rgba(var(--v-theme-on-surface), 0.88);
  stroke-width: 2;
}

.upright-ref {
  stroke: rgba(var(--v-theme-on-surface), 0.36);
  stroke-width: 2;
  stroke-dasharray: 6 6;
}

.angle-arc {
  fill: none;
  stroke: rgb(var(--v-theme-primary));
  stroke-width: 3;
  stroke-linecap: round;
}

.force-arrow-head {
  fill: rgb(var(--v-theme-success));
}

.force-arrow-head-limited {
  fill: rgb(var(--v-theme-error));
}

.force-arrow {
  stroke: rgb(var(--v-theme-success));
  stroke-width: 4;
  stroke-linecap: round;
}

.force-layer.is-limited .force-arrow {
  stroke: rgb(var(--v-theme-error));
}

.force-layer.is-limited .force-label {
  fill: rgb(var(--v-theme-error));
}

.length-line {
  stroke: rgb(var(--v-theme-secondary));
  stroke-width: 2;
  stroke-dasharray: 4 4;
}

.panel rect {
  fill: rgba(var(--v-theme-surface), 0.88);
  stroke: rgba(var(--v-theme-on-surface), 0.18);
  stroke-width: 1.5;
}

.panel text {
  fill: rgba(var(--v-theme-on-surface), 0.84);
  font-size: 14px;
}

.panel .panel-title {
  font-weight: 700;
  font-size: 15px;
  fill: rgba(var(--v-theme-on-surface), 0.92);
}
</style>
