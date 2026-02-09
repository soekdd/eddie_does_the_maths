<template>
  <svg
    class="stGraph"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 900 520"
    role="img"
    :aria-label="ariaLabel"
  >
    <defs>
      <marker
        :id="arrowId"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
      </marker>
    </defs>

    <rect class="bg" x="0" y="0" width="900" height="520" />

    <g v-if="!model.ok" class="small">
      <text x="24" y="44" class="halo">{{ model.message }}</text>
    </g>

    <g v-else>
      <text class="equation halo" x="450" y="42" text-anchor="middle">
        P(Freiheit) = 2*p*a*(1-r) = {{ fmtPct(model.freedom, 1) }}
      </text>

      <!-- Edges (drawn as segments so arrowheads behave nicely on corners) -->
      <g class="stEdges">
        <!-- Bus: Norden -->
        <polyline
          v-bind="edgeAttrs"
          class="stEdgeLine"
          :points="linePoints(P.start.x, P.start.y, P.n1.x, P.n1.y)"
          :marker-mid="`url(#${arrowId})`"
          :marker-end="`url(#${arrowId})`"
        />
        <polyline
          v-bind="edgeAttrs"
          class="stEdgeLine"
          :points="linePoints(P.n1.x, P.n1.y, P.bus.x, P.bus.y)"
          :marker-mid="`url(#${arrowId})`"
          :marker-end="`url(#${arrowId})`"
        />

        <!-- Bus: Sueden -->
        <polyline
          v-bind="edgeAttrs"
          class="stEdgeLine"
          :points="linePoints(P.start.x, P.start.y, P.s1.x, P.s1.y)"
          :marker-mid="`url(#${arrowId})`"
          :marker-end="`url(#${arrowId})`"
        />
        <polyline
          v-bind="edgeAttrs"
          class="stEdgeLine"
          :points="linePoints(P.s1.x, P.s1.y, P.bus.x, P.bus.y)"
          :marker-mid="`url(#${arrowId})`"
          :marker-end="`url(#${arrowId})`"
        />

        <!-- Kein Bus -->
        <polyline
          v-bind="edgeAttrs"
          class="stEdgeLine"
          :points="linePoints(P.start.x, P.start.y, P.nb1.x, P.nb1.y)"
          :marker-mid="`url(#${arrowId})`"
          :marker-end="`url(#${arrowId})`"
        />
        <polyline
          v-bind="edgeAttrs"
          class="stEdgeLine"
          :points="linePoints(P.nb1.x, P.nb1.y, P.nb2.x, P.nb2.y)"
          :marker-mid="`url(#${arrowId})`"
          :marker-end="`url(#${arrowId})`"
        />
        <polyline
          v-bind="edgeAttrs"
          class="stEdgeLine"
          :points="linePoints(P.nb2.x, P.nb2.y, P.fail.x, P.fail.y)"
          :marker-mid="`url(#${arrowId})`"
          :marker-end="`url(#${arrowId})`"
        />

        <!-- Fahrer -->
        <polyline
          v-bind="edgeAttrs"
          class="stEdgeLine"
          :points="linePoints(P.bus.x, P.bus.y, P.reject.x, P.reject.y)"
          :marker-mid="`url(#${arrowId})`"
          :marker-end="`url(#${arrowId})`"
        />
        <polyline
          v-bind="edgeAttrs"
          class="stEdgeLine"
          :points="linePoints(P.reject.x, P.reject.y, P.fail.x, P.fail.y)"
          :marker-mid="`url(#${arrowId})`"
          :marker-end="`url(#${arrowId})`"
        />

        <polyline
          v-bind="edgeAttrs"
          class="stEdgeLine"
          :points="linePoints(P.bus.x, P.bus.y, P.accept.x, P.accept.y)"
          :marker-mid="`url(#${arrowId})`"
          :marker-end="`url(#${arrowId})`"
        />

        <!-- Verfolger -->
        <polyline
          v-bind="edgeAttrs"
          class="stEdgeLine"
          :points="linePoints(P.accept.x, P.accept.y, P.caught1.x, P.caught1.y)"
          :marker-mid="`url(#${arrowId})`"
          :marker-end="`url(#${arrowId})`"
        />
        <polyline
          v-bind="edgeAttrs"
          class="stEdgeLine"
          :points="linePoints(P.caught1.x, P.caught1.y, P.fail.x, P.fail.y)"
          :marker-mid="`url(#${arrowId})`"
          :marker-end="`url(#${arrowId})`"
        />

        <polyline
          v-bind="edgeAttrs"
          class="stEdgeLine"
          :points="linePoints(P.accept.x, P.accept.y, P.free.x, P.free.y)"
          :marker-mid="`url(#${arrowId})`"
          :marker-end="`url(#${arrowId})`"
        />
      </g>

      <!-- Labels / probabilities (orientation inspired by concepts/decisiontree.svg) -->
      <g>
        <text
          class="label halo"
          :x="170"
          :y="206"
          :transform="rot(segAngle(P.start, P.n1), 170, 206)"
        >
          Bus kommt gen Norden
        </text>
        <text class="small muted halo" x="175" y="170">{{ fmtPct(model.pp, 0) }}</text>

        <text
          class="label halo"
          :x="170"
          :y="320"
          :transform="rot(segAngle(P.start, P.s1), 170, 320)"
        >
          Bus kommt gen Sueden
        </text>
        <text class="small muted halo" x="175" y="356">{{ fmtPct(model.pp, 0) }}</text>

        <text class="label halo" x="360" y="48" text-anchor="middle">Kein Bus</text>
        <text class="small muted halo" x="360" y="72" text-anchor="middle">{{ fmtPct(model.pNone, 0) }}</text>

        <text
          class="label halo"
          :x="474"
          :y="226"
          :transform="rot(segAngle(P.bus, P.reject), 474, 226)"
        >
          Fahrer nimmt nur Fin-Markka
        </text>
        <text class="small muted halo" x="528" y="198">{{ fmtPct(1 - model.aa, 0) }}</text>

        <text
          class="label halo"
          :x="470"
          :y="310"
          :transform="rot(segAngle(P.bus, P.accept), 470, 310)"
        >
          Fahrer nimmt DM
        </text>
        <text class="small muted halo" x="526" y="330">{{ fmtPct(model.aa, 0) }}</text>

        <text
          class="label halo"
          :x="596"
          :y="292"
          :transform="rot(segAngle(P.accept, P.caught1), 596, 292)"
        >
          Erwischt
        </text>
        <text class="small muted halo" x="626" y="248">{{ fmtPct(model.rr, 0) }}</text>

        <text
          class="label halo"
          :x="594"
          :y="372"
          :transform="rot(segAngle(P.accept, P.free), 594, 372)"
        >
          Mielke verpasst mich
        </text>
        <text class="small muted halo" x="628" y="396">{{ fmtPct(1 - model.rr, 0) }}</text>
      </g>

      <!-- Outcomes (right side) -->
      <g class="outcome" transform="translate(660 60)">
        <g class="icon">
          <!-- handcuffs-ish -->
          <circle cx="20" cy="22" r="18" />
          <circle cx="56" cy="22" r="18" />
          <circle cx="20" cy="22" r="10" />
          <circle cx="56" cy="22" r="10" />
          <path d="M38 22 H38" />
          <path d="M38 22 H40" />
          <path d="M40 22 H42" />
        </g>
        <text class="big halo" x="96" y="34">= {{ fmtPct(model.failure, 1) }}</text>
        <text class="outLabel halo" x="96" y="74">Misserfolg</text>
      </g>

      <g class="outcome" transform="translate(660 330)">
        <g class="icon">
          <!-- cage-ish -->
          <path d="M12 56 H68" />
          <path d="M14 56 V30 C14 16 25 6 40 6 C55 6 66 16 66 30 V56" />
          <path d="M40 6 V56" />
          <path d="M24 56 V28" />
          <path d="M32 56 V26" />
          <path d="M48 56 V26" />
          <path d="M56 56 V28" />
          <path d="M34 18 H46" />
          <path d="M37 4 C37 2 38 1 40 1 C42 1 43 2 43 4" />
        </g>
        <text class="big halo" x="96" y="34">= {{ fmtPct(model.freedom, 1) }}</text>
        <text class="outLabel halo" x="96" y="74">Freiheit</text>
      </g>
    </g>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  p: { type: [Number, String], required: true },
  a: { type: [Number, String], required: true },
  r: { type: [Number, String], required: true },
})

const arrowId = `st-arrow-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)}`

const P = {
  start: { x: 110, y: 260 },
  n1: { x: 240, y: 140 },
  s1: { x: 240, y: 380 },
  bus: { x: 380, y: 260 },

  nb1: { x: 230, y: 60 },
  nb2: { x: 620, y: 60 },

  reject: { x: 540, y: 170 },
  accept: { x: 540, y: 340 },

  caught1: { x: 640, y: 240 },

  fail: { x: 640, y: 110 },
  free: { x: 640, y: 380 },
}

const edgeAttrs = {
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': 3,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
}

function parseMaybeFloat(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null
  const s = String(v).trim().replace(',', '.')
  if (!s) return null
  if (!/^[-+]?(\d+(\.\d+)?|\.\d+)$/.test(s)) return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

function in01(n) {
  return typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 1
}

function fmtPct(n, digits = 0) {
  if (!Number.isFinite(n)) return '–'
  return `${(n * 100).toFixed(digits).replace('.', ',')}%`
}

function segAngle(a, b) {
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
}

function rot(deg, x, y) {
  return `rotate(${deg} ${x} ${y})`
}

function linePoints(x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy)
  const mids = len < 120 ? 1 : len < 220 ? 2 : 3

  const pts = [[x1, y1]]
  for (let i = 1; i <= mids; i++) {
    const t = i / (mids + 1)
    pts.push([x1 + dx * t, y1 + dy * t])
  }
  pts.push([x2, y2])

  return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
}

const model = computed(() => {
  const pp = parseMaybeFloat(props.p)
  const aa = parseMaybeFloat(props.a)
  const rr = parseMaybeFloat(props.r)

  if ([pp, aa, rr].some((n) => n === null)) {
    return { ok: false, message: 'Bitte Zahlen eingeben (0 bis 1). Tipp: 0,65 geht auch.' }
  }
  if (![pp, aa, rr].every(in01)) {
    return { ok: false, message: 'Werte muessen im Intervall [0,1] liegen.' }
  }
  if (pp > 0.5) {
    return { ok: false, message: 'p muss <= 0,5 sein (sonst wird 1-2p negativ).' }
  }

  const pNone = 1 - 2 * pp
  const freedom = 2 * pp * aa * (1 - rr)
  const failure = 1 - freedom

  return {
    ok: true,
    pp,
    aa,
    rr,
    pNone,
    freedom,
    failure,
  }
})

const ariaLabel = computed(() => {
  if (!model.value.ok) return 'Entscheidungsbaum (unguenltige Eingaben)'
  return `Entscheidungsbaum: Freiheit ${fmtPct(model.value.freedom, 1)}, Misserfolg ${fmtPct(model.value.failure, 1)}`
})
</script>

<style scoped>
.stGraph {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 12px;
  overflow: hidden;

  /* Theme-aware colors (Vuetify exposes RGB tuples in CSS variables). */
  --graph-bg: rgb(var(--v-theme-surface, 255, 255, 255));
  --graph-text: rgb(var(--v-theme-on-surface, 17, 17, 17));
  --graph-ink: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.92);
  --graph-muted: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.62);
}

.bg { fill: var(--graph-bg, #fff); }

.stEdges { color: var(--graph-ink, #111); }

.label { fill: var(--graph-text, #111); font: 18px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
.small { fill: var(--graph-text, #111); font: 14px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
.muted { fill: var(--graph-muted, #666); }
.equation { fill: var(--graph-text, #111); font: 18px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-weight: 600; }

.big { fill: var(--graph-text, #111); font: 44px/1 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-weight: 700; }
.outLabel { fill: var(--graph-text, #111); font: 22px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-weight: 600; }

.icon {
  stroke: var(--graph-ink, #111);
  stroke-width: 3;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Text halo so labels stay readable on top of lines. */
.halo {
  paint-order: stroke;
  stroke: var(--graph-bg, #fff);
  stroke-width: 7px;
  stroke-linejoin: round;
}
</style>
