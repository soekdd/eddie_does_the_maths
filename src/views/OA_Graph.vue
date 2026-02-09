<template>
  <div class="wrap">
    <div class="toolbar">
      <button class="btn" @click="regenerate">Neu zufällig</button>
      <div class="numbers" v-if="state.ready">
        <div><b>AB</b> = {{ fmt(state.lenAB) }}</div>
        <div><b>AD + BC</b> = {{ fmt(state.lenAD + state.lenBC) }}</div>
        <div>
          <b>Δ</b> = AB − (AD+BC) = <span :class="{ ok: Math.abs(state.delta) < 1e-3 }">{{ fmt(state.delta, 6) }}</span>
        </div>
        <div class="small">
          Zyklisch-Fehler |D auf Umkreis| ≈ {{ fmt(Math.abs(state.cyclicError), 6) }}
        </div>
      </div>
    </div>

    <svg
      v-if="state.ready"
      class="svg"
      :viewBox="`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`"
      role="img"
      aria-label="Zyklisches Viereck mit Tangentialkreis"
    >
      <!-- Geometry drawn in cartesian (y up) -->
      <g transform="scale(1,-1)">
        <!-- circumcircle (dashed) -->
        <circle
          :cx="state.circ.center.x"
          :cy="state.circ.center.y"
          :r="state.circ.r"
          fill="none"
          stroke="#8d8d8d"
          stroke-width="2.2"
          stroke-dasharray="7 7"
        />

        <!-- tangent circle (solid) -->
        <circle
          :cx="state.O.x"
          :cy="state.O.y"
          :r="state.r"
          fill="none"
          stroke="#111"
          stroke-width="2.8"
        />

        <!-- quadrilateral -->
        <polyline
          :points="ptsStr([state.A, state.B, state.C, state.D, state.A])"
          fill="none"
          stroke="#111"
          stroke-width="3.2"
          stroke-linejoin="round"
        />

        <!-- radii to tangency points -->
        <line :x1="state.O.x" :y1="state.O.y" :x2="state.L.x" :y2="state.L.y" stroke="#666" stroke-width="2" stroke-dasharray="5 5"/>
        <line :x1="state.O.x" :y1="state.O.y" :x2="state.M.x" :y2="state.M.y" stroke="#666" stroke-width="2" stroke-dasharray="5 5"/>
        <line :x1="state.O.x" :y1="state.O.y" :x2="state.N.x" :y2="state.N.y" stroke="#666" stroke-width="2" stroke-dasharray="5 5"/>

        <!-- points -->
        <g fill="#111">
          <circle :cx="state.A.x" :cy="state.A.y" r="4.2"/>
          <circle :cx="state.B.x" :cy="state.B.y" r="4.2"/>
          <circle :cx="state.C.x" :cy="state.C.y" r="4.2"/>
          <circle :cx="state.D.x" :cy="state.D.y" r="4.2"/>
          <circle :cx="state.O.x" :cy="state.O.y" r="4.2"/>

          <circle :cx="state.L.x" :cy="state.L.y" r="3.6"/>
          <circle :cx="state.M.x" :cy="state.M.y" r="3.6"/>
          <circle :cx="state.N.x" :cy="state.N.y" r="3.6"/>
        </g>

        <!-- right-angle markers at L, M, N -->
        <polyline :points="rightAngleMarker(state.L, state.O, 12)" fill="none" stroke="#111" stroke-width="2"/>
        <polyline :points="rightAngleMarker(state.M, state.O, 12)" fill="none" stroke="#111" stroke-width="2"/>
        <polyline :points="rightAngleMarker(state.N, state.O, 12)" fill="none" stroke="#111" stroke-width="2"/>

        <!-- line AB (optional emphasize) -->
        <line :x1="state.A.x" :y1="state.A.y" :x2="state.B.x" :y2="state.B.y" stroke="#111" stroke-width="2" opacity="0.25"/>
      </g>

      <!-- Labels (normal SVG coords: y down) -->
      <g class="labels">
        <text :x="state.A.x + 8" :y="-state.A.y + 18">A</text>
        <text :x="state.B.x + 8" :y="-state.B.y + 18">B</text>
        <text :x="state.C.x + 8" :y="-state.C.y - 10">C</text>
        <text :x="state.D.x - 18" :y="-state.D.y - 10">D</text>

        <text :x="state.O.x + 8" :y="-state.O.y + 18">O</text>
        <text :x="state.L.x - 18" :y="-state.L.y - 6">L</text>
        <text :x="state.M.x + 8"  :y="-state.M.y - 10">M</text>
        <text :x="state.N.x + 8"  :y="-state.N.y - 6">N</text>

        <!-- legend -->
        <g :transform="`translate(${viewBox.x + 12}, ${viewBox.y + 280})`">
          <rect x="0" y="0" width="330" height="78" rx="10" ry="10" fill="#fff" stroke="#bbb"/>
          <line x1="14" y1="26" x2="70" y2="26" stroke="#8d8d8d" stroke-width="3" stroke-dasharray="7 7"/>
          <text x="82" y="30">Umkreis durch A,B,C,D (zyklisch)</text>

          <line x1="14" y1="54" x2="70" y2="54" stroke="#111" stroke-width="3"/>
          <text x="82" y="58">Tangentialkreis: berührt AD, DC, BC</text>
        </g>
      </g>
    </svg>

    <div v-else class="loading">Generiere Beispiel…</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from "vue";

type Pt = { x: number; y: number };
type Line = { a: number; b: number; c: number }; // a x + b y = c
type Circle = { center: Pt; r: number };

const state = reactive({
  ready: false,

  // points
  A: { x: 0, y: 0 } as Pt,
  B: { x: 0, y: 0 } as Pt,
  C: { x: 0, y: 0 } as Pt,
  D: { x: 0, y: 0 } as Pt,

  // tangent circle
  O: { x: 0, y: 0 } as Pt,
  r: 50,

  // tangency points
  L: { x: 0, y: 0 } as Pt,
  M: { x: 0, y: 0 } as Pt,
  N: { x: 0, y: 0 } as Pt,

  // circumcircle
  circ: { center: { x: 0, y: 0 }, r: 1 } as Circle,

  // lengths
  lenAB: 0,
  lenAD: 0,
  lenBC: 0,
  delta: 0,
  cyclicError: 0,
});

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}
function dist(p: Pt, q: Pt) {
  return Math.hypot(p.x - q.x, p.y - q.y);
}
function add(p: Pt, q: Pt): Pt {
  return { x: p.x + q.x, y: p.y + q.y };
}
function sub(p: Pt, q: Pt): Pt {
  return { x: p.x - q.x, y: p.y - q.y };
}
function mul(p: Pt, k: number): Pt {
  return { x: p.x * k, y: p.y * k };
}
function norm(v: Pt) {
  const d = Math.hypot(v.x, v.y);
  return d === 0 ? { x: 0, y: 0 } : { x: v.x / d, y: v.y / d };
}
function rot90(v: Pt): Pt {
  return { x: -v.y, y: v.x };
}

function lineThrough(p: Pt, q: Pt): Line {
  const a = q.y - p.y;
  const b = p.x - q.x;
  const c = a * p.x + b * p.y;
  return { a, b, c };
}
function intersect(l1: Line, l2: Line): Pt | null {
  const det = l1.a * l2.b - l2.a * l1.b;
  if (Math.abs(det) < 1e-10) return null;
  const x = (l1.c * l2.b - l2.c * l1.b) / det;
  const y = (l1.a * l2.c - l2.a * l1.c) / det;
  return { x, y };
}

// For circle centered at origin radius r, tangent line at angle phi has equation: x cosφ + y sinφ = r
function tangentLineAt(phi: number, r: number): { M: Pt; line: Line } {
  const M = { x: r * Math.cos(phi), y: r * Math.sin(phi) };
  const a = Math.cos(phi);
  const b = Math.sin(phi);
  const c = r;
  return { M, line: { a, b, c } };
}

// Tangent point from external point P=(p,0) on x-axis to circle center (0,0) radius r; choose upper tangency
function tangentPointFromXAxis(p: number, r: number): Pt | null {
  const ap = Math.abs(p);
  if (ap <= r + 1e-9) return null;
  const x = (r * r) / p;
  const y = r * Math.sqrt(1 - (r * r) / (p * p));
  return { x, y };
}

function circumcircle(p1: Pt, p2: Pt, p3: Pt): Circle | null {
  const ax = p1.x, ay = p1.y;
  const bx = p2.x, by = p2.y;
  const cx = p3.x, cy = p3.y;

  const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
  if (Math.abs(d) < 1e-10) return null;

  const a2 = ax * ax + ay * ay;
  const b2 = bx * bx + by * by;
  const c2 = cx * cx + cy * cy;

  const ux = (a2 * (by - cy) + b2 * (cy - ay) + c2 * (ay - by)) / d;
  const uy = (a2 * (cx - bx) + b2 * (ax - cx) + c2 * (bx - ax)) / d;

  const center = { x: ux, y: uy };
  const r = dist(center, p1);
  if (!Number.isFinite(r) || r < 1e-6 || r > 1e6) return null;
  return { center, r };
}

function ptsStr(points: Pt[]) {
  return points.map(p => `${p.x},${p.y}`).join(" ");
}

// Right angle marker at tangency point T between radius (O->T) and tangent
function rightAngleMarker(T: Pt, O: Pt, s = 12) {
  const rvec = sub(O, T); // towards center
  const v = norm(rvec);   // radius direction (towards O)
  const u = norm(rot90(v)); // tangent direction

  const p1 = T;
  const p2 = add(T, mul(u, s));
  const p3 = add(p2, mul(v, s));
  const p4 = add(T, mul(v, s));
  return ptsStr([p1, p2, p3, p4]);
}

function computeLengthsAndError() {
  state.lenAB = dist(state.A, state.B);
  state.lenAD = dist(state.A, state.D);
  state.lenBC = dist(state.B, state.C);
  state.delta = state.lenAB - (state.lenAD + state.lenBC);
  state.cyclicError = dist(state.D, state.circ.center) - state.circ.r;
}

function solvePhiForCyclicity(A: Pt, B: Pt, r: number, L: Pt, N: Pt) {
  const AD = lineThrough(A, L);
  const BC = lineThrough(B, N);

  function evalPhi(phi: number) {
    const { M, line: DC } = tangentLineAt(phi, r);
    const D = intersect(AD, DC);
    const C = intersect(BC, DC);
    if (!D || !C) return null;
    // prefer "upper" configuration
    if (D.y <= 1e-6 || C.y <= 1e-6) return null;

    const circ = circumcircle(A, B, C);
    if (!circ) return null;
    const res = dist(D, circ.center) - circ.r; // should be 0
    if (!Number.isFinite(res)) return null;
    return { phi, M, C, D, circ, res };
  }

  // scan for a sign change
  const lo = 0.20;
  const hi = Math.PI - 0.20;
  const steps = 220;

  const samples: Array<ReturnType<typeof evalPhi>> = [];
  for (let i = 0; i <= steps; i++) {
    const phi = lo + (hi - lo) * (i / steps);
    const v = evalPhi(phi);
    if (v) samples.push(v);
  }
  if (samples.length < 5) return null;

  let bracket: { a: number; b: number; fa: number; fb: number } | null = null;
  for (let i = 0; i < samples.length - 1; i++) {
    const s1 = samples[i]!;
    const s2 = samples[i + 1]!;
    if (s1.res === 0) {
      bracket = { a: s1.phi, b: s1.phi, fa: 0, fb: 0 };
      break;
    }
    if (s1.res * s2.res < 0) {
      bracket = { a: s1.phi, b: s2.phi, fa: s1.res, fb: s2.res };
      break;
    }
  }
  if (!bracket) return null;

  // bisection
  let a = bracket.a, b = bracket.b;
  let fa = bracket.fa, fb = bracket.fb;

  let best = evalPhi(a) ?? evalPhi(b);
  for (let iter = 0; iter < 70; iter++) {
    const m = (a + b) / 2;
    const fmObj = evalPhi(m);
    if (!fmObj) {
      // if invalid, shrink slightly
      a = a + 1e-4;
      b = b - 1e-4;
      continue;
    }
    const fm = fmObj.res;
    best = fmObj;
    if (Math.abs(fm) < 1e-10) break;
    if (fa * fm < 0) {
      b = m; fb = fm;
    } else {
      a = m; fa = fm;
    }
  }
  return best;
}

function regenerate() {
  state.ready = false;

  for (let attempt = 0; attempt < 220; attempt++) {
    // Place O at origin on AB (x-axis). Choose A left, B right.
    const A0 = rand(90, 150);
    const B0 = rand(90, 150);
    const A: Pt = { x: -A0, y: 0 };
    const B: Pt = { x:  B0, y: 0 };
    const r = Math.min(A0, B0) * rand(0.25, 0.55);

    const L = tangentPointFromXAxis(A.x, r); // A.x negative okay
    const N = tangentPointFromXAxis(B.x, r);
    if (!L || !N) continue;

    // Solve for phi so that A,B,C,D become concyclic.
    const sol = solvePhiForCyclicity(A, B, r, L, N);
    if (!sol) continue;

    // Accept only “nice” shapes (avoid extreme skinny)
    const { C, D, M, circ, res } = sol;
    if (Math.abs(res) > 1e-6) continue;
    if (dist(C, D) < 20) continue;

    // Commit to state
    state.A = A;
    state.B = B;
    state.C = C;
    state.D = D;

    state.O = { x: 0, y: 0 };
    state.r = r;

    state.L = L;
    state.M = M;
    state.N = N;

    state.circ = circ;
    computeLengthsAndError();

    state.ready = true;
    return;
  }

  // fallback (should rarely happen)
  state.ready = false;
  console.warn("Konnte kein gültiges Beispiel finden. Bitte erneut klicken.");
}

// expose regenerate for parent components if you want
defineExpose({ regenerate });

const viewBox = computed(() => {
  if (!state.ready) return { x: -200, y: -200, w: 400, h: 400 };

  const pts: Pt[] = [state.A, state.B, state.C, state.D, state.O, state.L, state.M, state.N];

  // include circumcircle extents
  const cc = state.circ.center;
  const R = state.circ.r;

  let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity;

  function include(p: Pt) {
    xmin = Math.min(xmin, p.x);
    xmax = Math.max(xmax, p.x);
    ymin = Math.min(ymin, p.y);
    ymax = Math.max(ymax, p.y);
  }
  pts.forEach(include);
  include({ x: cc.x - R, y: cc.y - R });
  include({ x: cc.x + R, y: cc.y + R });

  // also include tangent circle extents
  include({ x: state.O.x - state.r, y: state.O.y - state.r });
  include({ x: state.O.x + state.r, y: state.O.y + state.r });

  const pad = 35;

  // Convert cartesian y extents to SVG y-down extents:
  // cartesian y in [ymin, ymax] -> svg y in [-ymax, -ymin]
  const vx = xmin - pad;
  const vy = -ymax - pad;
  const vw = (xmax - xmin) + 2 * pad;
  const vh = (ymax - ymin) + 2 * pad;

  return { x: vx, y: vy, w: vw, h: vh };
});

function fmt(n: number, digits = 3) {
  if (!Number.isFinite(n)) return "–";
  return n.toFixed(digits);
}

onMounted(() => regenerate());
</script>

<style scoped>
.wrap {
  display: grid;
  gap: 12px;
}
.toolbar {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
}
.btn {
  border: 1px solid #bbb;
  background: #fff;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
}
.btn:hover {
  background: #f6f6f6;
}
.numbers {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 13px;
  line-height: 1.35;
}
.small {
  opacity: 0.75;
  margin-top: 4px;
}
.ok {
  color: #0a7a0a;
  font-weight: 700;
}
.svg {
  width: min(900px, 100%);
  height: auto;
  border: 1px solid #e3e3e3;
  border-radius: 14px;
  background: white;
}
.labels text {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  font-size: 16px;
  fill: #111;
  user-select: none;
}
.loading {
  opacity: 0.7;
}
</style>
