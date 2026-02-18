<!-- FerryRiskPath.vue (Vue 3, <script setup>) -->
<template>
<div class="wrap">
	<div v-if="showControls" class="panel">
		<div class="row">
			<label>L (m)</label>
			<input v-model.number="L"
				max="200"
				min="20"
				step="1"
				type="range"
			/>
			<span class="val">{{ L.toFixed(0) }}</span>
		</div>
		<div class="row">
			<label>W (m)</label>
			<input v-model.number="W"
				max="80"
				min="5"
				step="1"
				type="range"
			/>
			<span class="val">{{ W.toFixed(0) }}</span>
		</div>
		<div class="row">
			<label>r (Risiko quer / Schatten)</label>
			<input v-model.number="r"
				max="6"
				min="0.5"
				step="0.1"
				type="range"
			/>
			<span class="val">{{ r.toFixed(1) }}</span>
		</div>
	</div>

	<svg
		aria-label="Geometrie des Fährterminal-Hofs und optimaler Weg"
		class="svg"
		preserveAspectRatio="xMidYMid meet"
		role="img"
		:viewBox="`0 0 ${viewport.w} ${viewport.h}`"
	>
		<!-- Hintergrund -->
		<rect fill="#0b1020"
			:height="viewport.h"
			:width="viewport.w"
			x="0"
			y="0"
		/>

		<!-- Zeichenebene in Mathe-Koordinaten (y nach oben), in festen Viewport eingepasst -->
		<g :transform="geometryTransform">
			<!-- Hof (Rechteck) -->
			<rect
				fill="#111a33"
				:height="W"
				rx="1.2"
				stroke="#8aa0ff"
				stroke-width="0.6"
				vector-effect="non-scaling-stroke"
				:width="L"
				x="0"
				y="0"
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

			<!-- Optional: "Außenrum"-Route (schematisch) -->
			<path
				v-if="showOuterRoute"
				:d="outerPathD"
				fill="none"
				opacity="0.9"
				stroke="#55607a"
				stroke-dasharray="4 3"
				stroke-width="1"
				vector-effect="non-scaling-stroke"
			/>

			<!-- Optimaler Weg -->
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

			<!-- Punkte -->
			<circle :cx="A.x"
				:cy="A.y"
				fill="#d6e4ff"
				r="1.5"
			/>
			<circle :cx="P.x"
				:cy="P.y"
				fill="#d6e4ff"
				r="1.5"
			/>
			<circle :cx="B.x"
				:cy="B.y"
				fill="#d6e4ff"
				r="1.5"
			/>
		</g>

		<!-- Labels (nicht gespiegelt; SVG-Koordinaten, y nach unten) -->
		<g class="labels">
			<text class="t" :x="toSvgX( A.x )" :y="toSvgY( A.y ) + 84">A (Start)</text>

			<text class="t" :x="toSvgX( P.x ) - 20" :y="toSvgY( P.y ) + 84">
				P (x*={{ xOpt.toFixed(2) }})
			</text>

			<text class="t" :x="toSvgX( B.x ) - 44" :y="toSvgY( B.y ) - 40">B (Tor)</text>
		</g>
	</svg>

	<div class="legendHtml">
		<div class="legendItem">
			<span class="swatch shadow"></span>
			<span>Schatten: 1 / m</span>
		</div>
		<div class="legendItem">
			<span class="swatch sprint"></span>
			<span>Querung: r / m</span>
		</div>
		<div v-if="showOuterRoute" class="legendItem">
			<span class="swatch outer"></span>
			<span>Außenroute (schematisch)</span>
		</div>
	</div>

	<div class="meta">
		<div class="kpi">
			<div>
				<b>Formel:&nbsp;</b>
				<Katex tex="x^* = L - \dfrac{W}{\sqrt{r^2 - 1}}\quad (\text{für } r>1)" />
			</div>
			<div><b>x*</b> = {{ xOpt.toFixed(2) }} m &nbsp;|&nbsp; <b>u</b> =&nbsp;L-x* = {{ u.toFixed(2) }} m</div>
			<div><b>PB</b> = {{ PB.toFixed(2) }} m &nbsp;|&nbsp; <b>Risiko</b> = {{ Ropt.toFixed(2) }} Punkte</div>
		</div>
		<div v-if="r <= 1" class="hint">
			Hinweis: r ≤ 1 ⇒ Querung ist nicht riskanter als Schatten; dann ist „so früh wie möglich“ optimal (x*=0).
		</div>
	</div>
</div>
</template>

<script setup>
import {
	computed, ref, watchEffect
} from "vue";
/**
 * Parametrisierbar:
 *  - L: Länge des Hofs (m)
 *  - W: Tiefe des Hofs (m)
 *  - r: Risikofaktor Querung vs. Schatten (z.B. 3)
 */
const props = defineProps( {
	L:              { type: Number, default: 40 },
	W:              { type: Number, default: 30 },
	r:              { type: Number, default: 3 },
	showControls:   { type: Boolean, default: true },
	showOuterRoute: { type: Boolean, default: false }
} );

const L = ref( props.L );
const W = ref( props.W );
const r = ref( props.r );

watchEffect( () => {
	// Falls Props von außen verändert werden
	L.value = props.L;
	W.value = props.W;
	r.value = props.r;
} );

const shadowBand = computed( () => Math.min( 3, W.value * 0.18 ) ); // rein visuell
const viewport = {
	w: 1200,
	h: 520
};
const fitPadding = 28;

// Punkte im Mathe-Koordinatensystem: A(0,0), B(L,W), P(x*,0)
const A = computed( () => ( { x: 0, y: 0 } ) );
const B = computed( () => ( { x: L.value, y: W.value } ) );

const xOpt = computed( () => {
	// Minimiert: R(x)=x + r*sqrt((L-x)^2+W^2)
	// r<=1: Querung nicht schlimmer -> x*=0 (sofort quer)
	if ( r.value <= 1 ) {
		return 0;
	}

	const raw = L.value - W.value / Math.sqrt( r.value * r.value - 1 );
	// in [0,L] clampen
	return Math.min( L.value, Math.max( 0, raw ) );
} );

const P = computed( () => ( { x: xOpt.value, y: 0 } ) );

// Hilfsgrößen
const u = computed( () => L.value - xOpt.value );
const PB = computed( () => Math.hypot( u.value, W.value ) );
const Ropt = computed( () => xOpt.value + r.value * PB.value );

const outerExtra = computed( () => Math.max( 8, Math.min( 18, ( L.value + W.value ) * 0.08 ) ) );

// Schematische Außenroute: unten raus, links hoch, oben rüber, rechts runter (nur Visual)
const outerPathD = computed( () => {
	const extra = outerExtra.value;
	// Start (0,0) -> links runter (kleiner Knick) -> außen hoch -> außen rechts -> Ziel
	// rein illustrativ, nicht maßstäblich für "5x"
	return `M 0 0
          L ${-extra} 0
          L ${-extra} ${W.value + extra}
          L ${L.value + extra} ${W.value + extra}
          L ${L.value} ${W.value}`;
} );

const worldBounds = computed( () => {
	const extra = props.showOuterRoute ? outerExtra.value : 0;

	return {
		minX: -extra,
		maxX: L.value + extra,
		minY: 0,
		maxY: W.value + extra
	};
} );

const fit = computed( () => {
	const bounds = worldBounds.value;
	const rangeX = Math.max( 1e-6, bounds.maxX - bounds.minX );
	const rangeY = Math.max( 1e-6, bounds.maxY - bounds.minY );
	const sx = ( viewport.w - 2 * fitPadding ) / rangeX;
	const sy = ( viewport.h - 2 * fitPadding ) / rangeY;
	const scale = Math.max( 1e-6, Math.min( sx, sy ) );
	const tx = ( viewport.w - rangeX * scale ) / 2 - bounds.minX * scale;
	const ty = ( viewport.h - rangeY * scale ) / 2 + bounds.maxY * scale;

	return {
		scale,
		tx,
		ty
	};
} );

const geometryTransform = computed( () => {
	const f = fit.value;
	return `translate(${f.tx} ${f.ty}) scale(${f.scale} -${f.scale})`;
} );

const toSvgX = ( x ) => fit.value.tx + x * fit.value.scale;
const toSvgY = ( y ) => fit.value.ty - y * fit.value.scale;
</script>

<style scoped>
.wrap {
  display: grid;
  gap: 12px;
  max-width: 980px;
}
.panel {
  background: #0e1733;
  border: 1px solid rgba(138, 160, 255, 0.25);
  border-radius: 12px;
  padding: 10px 12px;
  color: #d6e4ff;
}
.row {
  display: grid;
  grid-template-columns: 220px 1fr 70px;
  gap: 10px;
  align-items: center;
  margin: 6px 0;
}
.row label {
  font-size: 13px;
  opacity: 0.95;
}
.row input[type="range"] {
  width: 100%;
}
.val {
  text-align: right;
  font-variant-numeric: tabular-nums;
  opacity: 0.95;
}
.svg {
  width: 100%;
  height: min(520px, 62vh);
  border-radius: 14px;
  border: 1px solid rgba(138, 160, 255, 0.25);
  background: #0b1020;
}
.labels .t {
  fill: #d6e4ff;
  font-size: 42px;
  opacity: 0.95;
}

.legendHtml {
  background: #0e1733;
  border: 1px solid rgba(138, 160, 255, 0.25);
  border-radius: 12px;
  color: #d6e4ff;
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
  color: #d6e4ff;
  background: #0e1733;
  border: 1px solid rgba(138, 160, 255, 0.25);
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
