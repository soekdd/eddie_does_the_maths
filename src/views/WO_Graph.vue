<!-- FerryRiskPath.vue (Vue 3, <script setup>) -->
<template>
<div class="wrap">
	<div v-if="showControls" class="panel">
		<v-row dense>
			<v-col cols="12">
				<v-row align="center" class="controlRow" dense>
					<v-col cols="12" md="3" sm="3">
						<v-label class="controlLabel">L (m)</v-label>
					</v-col>
					<v-col cols="9" md="7" sm="7">
						<v-slider
							v-model="L"
							class="controlSlider"
							color="primary"
							density="compact"
							hide-details
							max="200"
							min="20"
							step="1"
						/>
					</v-col>
					<v-col class="d-flex justify-end"
						cols="3"
						md="2"
						sm="2"
					>
						<v-chip class="controlValueChip"
							color="primary"
							size="small"
							variant="tonal"
						>{{ L.toFixed(0) }}</v-chip>
					</v-col>
				</v-row>
			</v-col>
			<v-col cols="12">
				<v-row align="center" class="controlRow" dense>
					<v-col cols="12" md="3" sm="3">
						<v-label class="controlLabel">W (m)</v-label>
					</v-col>
					<v-col cols="9" md="7" sm="7">
						<v-slider
							v-model="W"
							class="controlSlider"
							color="primary"
							density="compact"
							hide-details
							max="80"
							min="5"
							step="1"
						/>
					</v-col>
					<v-col class="d-flex justify-end"
						cols="3"
						md="2"
						sm="2"
					>
						<v-chip class="controlValueChip"
							color="primary"
							size="small"
							variant="tonal"
						>{{ W.toFixed(0) }}</v-chip>
					</v-col>
				</v-row>
			</v-col>
			<v-col cols="12">
				<v-row align="center" class="controlRow" dense>
					<v-col cols="12" md="3" sm="3">
						<v-label class="controlLabel">r (Risiko)</v-label>
					</v-col>
					<v-col cols="9" md="7" sm="7">
						<v-slider
							v-model="r"
							class="controlSlider"
							color="primary"
							density="compact"
							hide-details
							max="6"
							min="0.5"
							step="0.1"
						/>
					</v-col>
					<v-col class="d-flex justify-end"
						cols="3"
						md="2"
						sm="2"
					>
						<v-chip class="controlValueChip"
							color="primary"
							size="small"
							variant="tonal"
						>{{ r.toFixed(1) }}</v-chip>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</div>

	<svg
		aria-label="Geometrie des Fährterminal-Hofs und optimaler Weg"
		class="svg"
		preserveAspectRatio="xMidYMid meet"
		role="img"
		:viewBox="`0 0 ${activeViewport.w} ${activeViewport.h}`"
	>
		<!-- Hintergrund -->
		<rect fill="#0b1020"
			:height="activeViewport.h"
			:width="activeViewport.w"
			x="0"
			y="0"
		/>

		<!-- Zeichenebene in Mathe-Koordinaten (y nach oben), in festen Viewport eingepasst -->
		<g :transform="geometryTransform">
			<!-- Hof (Rechteck) -->
			<rect
				fill="#212a43"
				:height="W"
				rx="1.2"
				stroke="#8aa0ff"
				stroke-width="0.6"
				vector-effect="non-scaling-stroke"
				:width="L"
				x="0"
				y="0"
			/>
			<!-- Terminalgebäude am linken Rand (liegt über dem Hof) -->
			<rect
				fill="#202a45"
				:height="buildingHeight"
				opacity="0.98"
				rx="1.1"
				stroke="#8aa0ff"
				stroke-width="0.6"
				vector-effect="non-scaling-stroke"
				:width="buildingWidth"
				:x="buildingX"
				:y="buildingY"
			/>
			<!-- Lichtkegel aus den rechten Gebäudeecken -->
			<path
				:d="lowerBeamPathD"
				fill="rgba(255, 244, 173, 0.20)"
				stroke="rgba(255, 244, 173, 0.28)"
				stroke-width="0.35"
				vector-effect="non-scaling-stroke"
			/>
			<path
				:d="upperBeamPathD"
				fill="rgba(255, 244, 173, 0.20)"
				stroke="rgba(255, 244, 173, 0.28)"
				stroke-width="0.35"
				vector-effect="non-scaling-stroke"
			/>
			<!-- Schattenkante (unten) -->
			<line
				stroke="#2b2f40"
				stroke-width="2.0"
				vector-effect="non-scaling-stroke"
				x1="0"
				:x2="L"
				y1="0"
				y2="0"
			/>
			<rect
				fill="rgba(20, 25, 45, 0.55)"
				:height="shadowBand"
				:width="L"
				x="0"
				y="0"
			/>
			<!-- Schattenkante (rechts) -->
			<line
				stroke="#2b2f40"
				stroke-width="2.0"
				vector-effect="non-scaling-stroke"
				:x1="L"
				:x2="L"
				y1="0"
				:y2="W"
			/>
			<rect
				fill="rgba(20, 25, 45, 0.55)"
				:height="W"
				:width="shadowBand"
				:x="L - shadowBand"
				y="0"
			/>
			<!-- Schattenkante (oben) -->
			<rect
				fill="rgba(20, 25, 45, 0.55)"
				:height="shadowBand"
				:width="L"
				x="0"
				:y="W - shadowBand"
			/>

			<!-- Optional: "Außenrum"-Route (schematisch) -->
			<path
				v-if="showOuterRoute && !useOuterAsOptimal"
				:d="outerPathD"
				fill="none"
				opacity="0.9"
				stroke="#55607a"
				stroke-dasharray="4 3"
				stroke-width="1"
				vector-effect="non-scaling-stroke"
			/>

			<!-- Optimaler Weg -->
			<g v-if="!useOuterAsOptimal">
				<polyline
					fill="none"
					:points="`${A.x},${A.y} ${P.x},${P.y}`"
					stroke="#4cc3ff"
					stroke-linecap="round"
					stroke-width="2.2"
					vector-effect="non-scaling-stroke"
				/>
				<line
					stroke="#ff4d6d"
					stroke-linecap="round"
					stroke-width="2.2"
					vector-effect="non-scaling-stroke"
					:x1="P.x"
					:x2="B.x"
					:y1="P.y"
					:y2="B.y"
				/>
			</g>
			<path
				v-else
				:d="outerPathD"
				fill="none"
				stroke="#4cc3ff"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2.2"
				vector-effect="non-scaling-stroke"
			/>

			<!-- Punkte -->
			<circle :cx="A.x"
				:cy="A.y"
				fill="#d6e4ff"
				r="0.5"
			/>
			<circle v-if="!useOuterAsOptimal"
				:cx="P.x"
				:cy="P.y"
				fill="#d6e4ff"
				r="0.5"
			/>
			<circle :cx="B.x"
				:cy="B.y"
				fill="#d6e4ff"
				r="0.5"
			/>
		</g>

		<!-- Labels (nicht gespiegelt; SVG-Koordinaten, y nach unten) -->
		<g class="labels">
			<text
				class="terminalLabel"
				dominant-baseline="middle"
				text-anchor="middle"
				:transform="rotateMobile
					? undefined : `rotate(-90 ${toSvgX( buildingCenterX, buildingCenterY )} ${toSvgY( buildingCenterX, buildingCenterY )})`"
				:x="toSvgX( buildingCenterX, buildingCenterY )"
				:y="toSvgY( buildingCenterX, buildingCenterY )"
			>
				Terminal
			</text>

			<text class="t" :x="toSvgX( A.x, A.y )" :y="toSvgY( A.x, A.y ) + 64">A (Start)</text>

			<text v-if="!useOuterAsOptimal"
				class="t"
				:x="toSvgX( P.x, P.y ) - 20"
				:y="toSvgY( P.x, P.y ) + 64"
			>
				P (x*={{ xOpt.toFixed(2) }})
			</text>

			<text class="t" :x="toSvgX( B.x, B.y ) - 44" :y="toSvgY( B.x, B.y ) - 40">B (Tor)</text>
		</g>
	</svg>

	<div class="legendHtml">
		<div class="legendItem">
			<span class="swatch shadow"></span>
			<span>Schatten: 1 Riskopunkt / Meter</span>
		</div>
		<div class="legendItem">
			<span class="swatch sprint"></span>
			<span>Querung: {{r}} Risikopunkte / Meter (r)</span>
		</div>
		<div v-if="showOuterRoute && !useOuterAsOptimal" class="legendItem">
			<span class="swatch outer"></span>
			<span>Außenroute (schematisch)</span>
		</div>
	</div>

	<div class="meta">
		<div class="kpi">
			<div>
				<b>Formel:&nbsp;</b>
				<Katex tex="x^* = \frac{L}{2} - \dfrac{W}{\sqrt{r^2 - 1}}\quad (\text{für } r>1)" />
			</div>
			<div><b>x*</b> = {{ xOpt.toFixed(2) }} m &nbsp;|&nbsp; <b>u</b> =&nbsp;L/2-x* = {{ u.toFixed(2) }} m</div>
			<div><b>PB</b> = {{ PB.toFixed(2) }} m &nbsp;|&nbsp; <b>Risiko</b> = {{ Ropt.toFixed(2) }} Punkte</div>
			<div><b>Außenrum (nur Schatten)
			</b> = {{ shadowOnlyDistance.toFixed(2) }} m &nbsp;|&nbsp; <b>Risiko</b> = {{ shadowOnlyRisk.toFixed(2) }} Punkte</div>
			<div><b>Ersparnis vs. außenrum
			</b> = {{ savingsVsShadowOnly.toFixed(2) }} Punkte</div>
			<div><b>Gewählte Route
			</b> = {{ useOuterAsOptimal ? "Außenrum (nur Schatten)" : "Schatten + Querung" }} &nbsp;|
				&nbsp; <b>Minimalrisiko</b> = {{ selectedRisk.toFixed(2) }} Punkte</div>
		</div>
		<div v-if="r <= 1" class="hint">
			Hinweis: r ≤ 1 ⇒ Querung ist nicht riskanter als Schatten; dann ist „so früh wie möglich“ optimal (x*=0).
		</div>
	</div>
</div>
</template>

<script setup>
import {
	computed, onBeforeUnmount, onMounted, ref, watch, watchEffect
} from "vue";
import { useDisplay } from "vuetify";
/**
 * Parametrisierbar:
 *  - L: Länge des Hofs (m)
 *  - W: Tiefe des Hofs (m)
 *  - r: Risikofaktor Querung vs. Schatten (z.B. 3)
 */
const props = defineProps( {
	L:              { type: Number, default: 70 },
	W:              { type: Number, default: 30 },
	r:              { type: Number, default: 3 },
	showControls:   { type: Boolean, default: true },
	showOuterRoute: { type: Boolean, default: false }
} );
const { smAndDown } = useDisplay();
const rotateMobile = computed( () => smAndDown.value );

const L = ref( props.L );
const W = ref( props.W );
const r = ref( props.r );

watchEffect( () => {
	// Falls Props von außen verändert werden
	L.value = props.L;
	W.value = props.W;
	r.value = props.r;
} );

const shadowBand = computed( () => Math.min( 3, W.value * 0.28 ) ); // rein visuell
const viewportLandscape = {
	w: 1200,
	h: 520
};
const viewportPortrait = {
	w: 520,
	h: 1200
};
const activeViewport = computed( () => rotateMobile.value ? viewportPortrait : viewportLandscape );
const fitPadding = 28;
const buildingWidth = 8; // feste Breite in Meterdarstellung

// Punkte im Mathe-Koordinatensystem: A(0,0), B(L/2,W), P(x*,0)
const A = computed( () => ( { x: 0, y: 0 } ) );
const targetX = computed( () => L.value / 2 );
const B = computed( () => ( { x: targetX.value, y: W.value } ) );
const buildingHeight = computed( () => 0.8 * W.value );
const buildingY = computed( () => ( W.value - buildingHeight.value ) / 2 );
const buildingX = computed( () => -0.5 * buildingWidth );
const buildingCenterX = computed( () => buildingX.value + buildingWidth / 2 );
const buildingCenterY = computed( () => buildingY.value + buildingHeight.value / 2 );
const buildingRightX = computed( () => buildingX.value + buildingWidth );
const beamCapRadius = computed( () => Math.max( 3, Math.min( 14, 0.16 * W.value ) ) );
const beamMinX = computed( () => Math.min( L.value - 2, buildingRightX.value + Math.max( 2, 0.07 * L.value ) ) );
const beamMaxX = computed( () => L.value - Math.max( 2, 0.06 * L.value ) );
const beamMinY = computed( () => Math.max( 1.5, 0.08 * W.value ) );
const beamMaxY = computed( () => W.value - Math.max( 1.5, 0.08 * W.value ) );
const beamSpeed = computed( () => Math.max( 8, 0.42 * L.value ) );

const lowerBeamCenter = ref( { x: 0, y: 0 } );
const upperBeamCenter = ref( { x: 0, y: 0 } );
const lowerBeamTarget = ref( { x: 0, y: 0 } );
const upperBeamTarget = ref( { x: 0, y: 0 } );
const lowerBeamDirection = ref( 1 );
const upperBeamDirection = ref( -1 );

let beamAnimationFrameId = 0;
let lastBeamTimestamp = 0;

const randomBetween = ( min, max ) => min + Math.random() * ( max - min );

const clampBeamPoint = ( point ) => ( {
	x: Math.min( beamMaxX.value, Math.max( beamMinX.value, point.x ) ),
	y: Math.min( beamMaxY.value, Math.max( beamMinY.value, point.y ) )
} );

const nextBeamTarget = ( directionRef ) => {
	const xSpan = Math.max( 1, beamMaxX.value - beamMinX.value );
	const edgeBand = Math.max( 0.8, 0.18 * xSpan );
	const targetXValue = directionRef.value > 0 ?
		randomBetween( beamMaxX.value - edgeBand, beamMaxX.value ) :
		randomBetween( beamMinX.value, beamMinX.value + edgeBand );
	const targetYValue = randomBetween( beamMinY.value, beamMaxY.value );
	directionRef.value *= -1;

	return clampBeamPoint( {
		x: targetXValue,
		y: targetYValue
	} );
};

const resetBeamAnimation = () => {
	const midX = ( beamMinX.value + beamMaxX.value ) / 2;
	lowerBeamCenter.value = clampBeamPoint( {
		x: midX,
		y: buildingY.value + 0.24 * W.value
	} );
	upperBeamCenter.value = clampBeamPoint( {
		x: midX,
		y: buildingY.value + buildingHeight.value - 0.24 * W.value
	} );
	lowerBeamDirection.value = 1;
	upperBeamDirection.value = -1;
	lowerBeamTarget.value = nextBeamTarget( lowerBeamDirection );
	upperBeamTarget.value = nextBeamTarget( upperBeamDirection );
};

const advanceBeam = (
	centerRef, targetRef, directionRef, stepDistance
) => {
	const dx = targetRef.value.x - centerRef.value.x;
	const dy = targetRef.value.y - centerRef.value.y;
	const distance = Math.hypot( dx, dy );

	if ( distance <= stepDistance ) {
		centerRef.value = targetRef.value;
		targetRef.value = nextBeamTarget( directionRef );
		return;
	}

	const ratio = stepDistance / distance;
	centerRef.value = {
		x: centerRef.value.x + dx * ratio,
		y: centerRef.value.y + dy * ratio
	};
};

const animateBeams = ( timestamp ) => {
	if ( !lastBeamTimestamp ) {
		lastBeamTimestamp = timestamp;
	}

	const dt = Math.min( 0.002, ( timestamp - lastBeamTimestamp ) / 1000 );
	lastBeamTimestamp = timestamp;

	const stepDistance = beamSpeed.value * dt;
	advanceBeam(
		lowerBeamCenter, lowerBeamTarget, lowerBeamDirection, stepDistance
	);
	advanceBeam(
		upperBeamCenter, upperBeamTarget, upperBeamDirection, stepDistance * 0.97
	);
	beamAnimationFrameId = window.requestAnimationFrame( animateBeams );
};

onMounted( () => {
	resetBeamAnimation();
	beamAnimationFrameId = window.requestAnimationFrame( animateBeams );
} );

onBeforeUnmount( () => {
	if ( beamAnimationFrameId ) {
		window.cancelAnimationFrame( beamAnimationFrameId );
	}
} );

watch( [ L, W ], () => {
	resetBeamAnimation();
	lastBeamTimestamp = 0;
} );

const buildBeamPath = (
	sx, sy, cx, cy, capRadius
) => {
	const dx = cx - sx;
	const dy = cy - sy;
	const length = Math.max( 1e-6, Math.hypot( dx, dy ) );
	const ux = dx / length;
	const uy = dy / length;
	const px = -uy;
	const py = ux;

	const x1 = cx + px * capRadius;
	const y1 = cy + py * capRadius;
	const x2 = cx - px * capRadius;
	const y2 = cy - py * capRadius;

	return `M ${sx} ${sy}
	        L ${x1} ${y1}
	        A ${capRadius} ${capRadius} 0 0 0 ${x2} ${y2}
	        Z`;
};

const lowerBeamPathD = computed( () => buildBeamPath(
	buildingRightX.value - 2,
	buildingY.value + 2,
	lowerBeamCenter.value.x,
	lowerBeamCenter.value.y,
	beamCapRadius.value
) );
const upperBeamPathD = computed( () => buildBeamPath(
	buildingRightX.value - 2,
	buildingY.value + buildingHeight.value - 2 ,
	upperBeamCenter.value.x,
	upperBeamCenter.value.y,
	beamCapRadius.value
) );

const xOpt = computed( () => {
	// Minimiert: R(x)=x + r*sqrt((L/2-x)^2+W^2)
	// r<=1: Querung nicht schlimmer -> x*=0 (sofort quer)
	if ( r.value <= 1 ) {
		return 0;
	}

	const raw = targetX.value - W.value / Math.sqrt( r.value * r.value - 1 );
	// in [0,L/2] clampen
	return Math.min( targetX.value, Math.max( 0, raw ) );
} );

const P = computed( () => ( { x: xOpt.value, y: 0 } ) );

// Hilfsgrößen
const u = computed( () => targetX.value - xOpt.value );
const PB = computed( () => Math.hypot( u.value, W.value ) );
const Ropt = computed( () => xOpt.value + r.value * PB.value );
const shadowOnlyDistance = computed( () => 1.5 * L.value + W.value );
const shadowOnlyRisk = computed( () => shadowOnlyDistance.value ); // 1 Punkt/m im Schatten
const savingsVsShadowOnly = computed( () => shadowOnlyRisk.value - Ropt.value );
const useOuterAsOptimal = computed( () => savingsVsShadowOnly.value < 0 );
const selectedRisk = computed( () => useOuterAsOptimal.value ? shadowOnlyRisk.value : Ropt.value );

// Außenroute entlang der Hofkante: rechts, hoch, links zu B
const outerPathD = computed( () => {
	return `M 0 0
          L ${L.value} 0
          L ${L.value} ${W.value}
          L ${B.value.x} ${B.value.y}`;
} );

const worldBounds = computed( () => {
	return {
		minX: buildingX.value,
		maxX: L.value,
		minY: 0,
		maxY: W.value
	};
} );

const fit = computed( () => {
	const bounds = worldBounds.value;
	const rangeX = Math.max( 1e-6, bounds.maxX - bounds.minX );
	const rangeY = Math.max( 1e-6, bounds.maxY - bounds.minY );
	const fitWidth = activeViewport.value.w - 2 * fitPadding;
	const fitHeight = activeViewport.value.h - 2 * fitPadding;

	if ( !rotateMobile.value ) {
		const sx = fitWidth / rangeX;
		const sy = fitHeight / rangeY;
		const scale = Math.max( 1e-6, Math.min( sx, sy ) );
		const tx = ( activeViewport.value.w - rangeX * scale ) / 2 - bounds.minX * scale;
		const ty = ( activeViewport.value.h - rangeY * scale ) / 2 + bounds.maxY * scale;

		return {
			scale,
			tx,
			ty
		};
	}

	// Mobile: 90° im Uhrzeigersinn drehen und danach einpassen (Breite/Höhe tauschen sich effektiv).
	const sxRot = fitWidth / rangeY;
	const syRot = fitHeight / rangeX;
	const scale = Math.max( 1e-6, Math.min( sxRot, syRot ) );
	const widthRot = rangeY * scale;
	const heightRot = rangeX * scale;
	const left = ( activeViewport.value.w - widthRot ) / 2;
	const top = ( activeViewport.value.h - heightRot ) / 2;
	const tx = left + bounds.maxY * scale;
	const ty = top + bounds.maxX * scale;

	return {
		scale,
		tx,
		ty
	};
} );

const geometryTransform = computed( () => {
	const f = fit.value;

	if ( rotateMobile.value ) {
		return `translate(${f.tx} ${f.ty}) rotate(-90) scale(${f.scale} ${-f.scale})`;
	}

	return `translate(${f.tx} ${f.ty}) scale(${f.scale} -${f.scale})`;
} );

const mapToSvg = ( x, y ) => {
	const f = fit.value;

	if ( rotateMobile.value ) {
		return {
			x: f.tx - y * f.scale,
			y: f.ty - x * f.scale
		};
	}

	return {
		x: f.tx + x * f.scale,
		y: f.ty - y * f.scale
	};
};

const toSvgX = ( x, y ) => mapToSvg( x, y ).x;
const toSvgY = ( x, y ) => mapToSvg( x, y ).y;
</script>

<style scoped>
.wrap {
  display: grid;
  gap: 12px;
  max-width: 980px;
  color: rgb(var(--v-theme-on-surface));
}
.panel {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.16);
  border-radius: 12px;
  padding: 10px 12px;
  color: rgb(var(--v-theme-on-surface));
}
.controlRow {
  margin: 0;
}
.controlLabel {
  color: rgb(var(--v-theme-on-surface));
  font-size: 13px;
  opacity: 0.95;
}
.controlSlider {
  margin: 0;
}
.controlRow :deep(.controlSlider .v-input__control) {
  min-height: 24px;
}
.controlValueChip {
  font-variant-numeric: tabular-nums;
  justify-content: center;
  min-width: 56px;
}
.controlRow :deep(.v-col) {
  padding-top: 2px;
  padding-bottom: 2px;
}
.controlRow :deep(.controlSlider .v-slider-thumb__label) {
  font-variant-numeric: tabular-nums;
}
.svg {
  width: 100%;
  height: min(520px, 62vh);
  border-radius: 14px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.2);
  background: #0b1020;
}
@media (max-width: 600px) {
  .svg {
    height: min(760px, 82vh);
  }
}
.labels .t {
  fill: #d6e4ff;
  font-size: 22px;
  opacity: 0.95;
}
.labels .terminalLabel {
  fill: #d6e4ff;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.4px;
  opacity: 0.9;
}

.legendHtml {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.16);
  border-radius: 12px;
  color: rgb(var(--v-theme-on-surface));
  display: grid;
  font-size: 13px;
  gap: 6px;
  padding: 10px 12px;
}

.legendItem {
  align-items: center;
  display: flex;
  gap: 8px;
}

.swatch {
  border-radius: 2px;
  display: inline-block;
  flex: 0 0 26px;
  height: 0;
}

.swatch.shadow {
  border-top: 2px solid #4cc3ff;
}

.swatch.sprint {
  border-top: 2px solid #ff4d6d;
}

.swatch.outer {
  border-top: 2px dashed #55607a;
}

.meta {
  color: rgb(var(--v-theme-on-surface));
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.16);
  border-radius: 12px;
  padding: 10px 12px;
}
.kpi {
  display: grid;
  gap: 6px;
  font-size: 14px;
  line-height: 1.35;
}
.hint {
  margin-top: 8px;
  opacity: 0.85;
  font-size: 13px;
}
</style>
