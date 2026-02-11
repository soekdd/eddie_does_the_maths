<template>
  <v-container class="py-6" fluid>
    <v-row>
      <v-col cols="12" md="5">
        <v-card rounded="xl" class="pa-4">
          <v-card-title class="text-h6">Ada-Karten: Primzahltest</v-card-title>
          <v-card-subtitle>
            Trial Division über Restbildung mit <b>DIV/MUL/SUB</b>.
          </v-card-subtitle>

          <v-divider class="my-4" />

          <v-row dense>
            <v-col cols="12">
              <v-alert density="compact" type="info" variant="tonal" class="mb-2">
                <template v-if="result">
                  <span v-if="result.isPrime">
                    <code>{{ result.n }}</code> ist <b>prim</b>.
                  </span>
                  <span v-else>
                    <code>{{ result.n }}</code> ist <b>nicht prim</b>; kleinster Teiler: <b>{{ result.divisor }}</b>.
                  </span>
                </template>
                <template v-else>
                  Gib eine ganze Zahl <Katex tex="n\ge 2" /> ein.
                </template>
              </v-alert>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="nInput"
                label="n (ganzzahlig)"
                density="comfortable"
                placeholder="91"
              />
            </v-col>

            <v-col cols="12">
              <v-alert density="compact" type="warning" variant="tonal">
                Geprüft werden Teiler <Katex tex="d=2,3,\dots,\lfloor\sqrt{n}\rfloor" />.
              </v-alert>
            </v-col>

            <v-col cols="12" class="d-flex ga-2">
              <v-btn color="primary" rounded="xl" @click="run" :loading="running">
                Ausführen
              </v-btn>
              <v-btn variant="tonal" rounded="xl" @click="reset">
                Reset
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <v-card rounded="xl" class="pa-4 mt-4">
          <v-card-title class="text-h6">Formel (Resttest)</v-card-title>
          <v-card-text>
            <KaTeXBlock :tex="formulaTex" />
            <div class="text-body-2 mt-3">
              Ein Teiler liegt vor, wenn der Rest <Katex tex="r" /> gleich 0 ist.
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="7">
        <v-card rounded="xl" class="pa-4">
          <v-card-title class="text-h6">Ergebnis</v-card-title>

          <v-divider class="my-4" />

          <div v-if="error" class="mb-3">
            <v-alert type="error" variant="tonal" density="comfortable">
              {{ error }}
            </v-alert>
          </div>

          <v-row dense v-if="result">
            <v-col cols="12" md="6">
              <v-card variant="tonal" rounded="xl" class="pa-4">
                <div class="text-caption mb-1">Klassifikation</div>
                <div class="text-h5 font-weight-bold">
                  {{ result.isPrime ? "Prim" : "Komposit" }}
                </div>
                <div class="text-body-2 mt-2">
                  {{ result.description }}
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-card variant="tonal" rounded="xl" class="pa-4">
                <div class="text-caption mb-1">Prüfdetails</div>
                <div class="text-body-1">Geprüfte Teiler: {{ result.checks }}</div>
                <div class="text-body-1">Grenze: {{ result.bound }}</div>
                <div class="text-body-1" v-if="!result.isPrime">Erster Teiler: {{ result.divisor }}</div>
              </v-card>
            </v-col>

            <v-col cols="12">
              <v-chip class="me-2" color="green" variant="tonal">
                Checks: {{ result.checks }}
              </v-chip>
              <v-chip variant="tonal">Karten: {{ deck?.length ?? 0 }}</v-chip>
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <v-tabs v-model="tab" color="primary">
            <v-tab value="deck">Kartendeck</v-tab>
            <v-tab value="trace">Trace</v-tab>
            <v-tab value="store">Store-Snapshot</v-tab>
          </v-tabs>

          <v-window v-model="tab" class="mt-3">
            <v-window-item value="deck">
              <v-table density="compact">
                <thead>
                  <tr>
                    <th style="width: 70px;">#</th>
                    <th style="width: 90px;">Line</th>
                    <th>Label</th>
                    <th style="width: 110px;">Op</th>
                    <th style="width: 150px;">Ziel</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(c, i) in deck" :key="i">
                    <td>{{ i + 1 }}</td>
                    <td><code>L{{ c.line }}</code></td>
                    <td>{{ c.label || "" }}</td>
                    <td><code>{{ c.op }}</code></td>
                    <td><code>V{{ c.dest }}</code></td>
                  </tr>
                </tbody>
              </v-table>
            </v-window-item>

            <v-window-item value="trace">
              <v-textarea
                v-model="traceText"
                rows="16"
                auto-grow
                readonly
                label="Karten-Log"
              />
            </v-window-item>

            <v-window-item value="store">
              <v-row dense>
                <v-col cols="12" md="4">
                  <v-card variant="tonal" rounded="lg" class="pa-2">
                    <div class="text-subtitle-2 px-2 py-1">Data columns</div>
                    <v-table density="compact">
                      <tbody>
                        <tr><td><code>V1</code></td><td>0</td><td class="mono text-right">{{ storeView(1) }}</td></tr>
                        <tr><td><code>V2</code></td><td>1</td><td class="mono text-right">{{ storeView(2) }}</td></tr>
                        <tr><td><code>V3</code></td><td>n</td><td class="mono text-right">{{ storeView(3) }}</td></tr>
                        <tr><td><code>V5</code></td><td>2</td><td class="mono text-right">{{ storeView(5) }}</td></tr>
                      </tbody>
                    </v-table>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card variant="tonal" rounded="lg" class="pa-2">
                    <div class="text-subtitle-2 px-2 py-1">Working columns</div>
                    <v-table density="compact">
                      <tbody>
                        <tr><td><code>V11</code></td><td>d</td><td class="mono text-right">{{ storeView(11) }}</td></tr>
                        <tr><td><code>V12</code></td><td>d²</td><td class="mono text-right">{{ storeView(12) }}</td></tr>
                        <tr><td><code>V13</code></td><td>q=floor(n/d)</td><td class="mono text-right">{{ storeView(13) }}</td></tr>
                        <tr><td><code>V14</code></td><td>q*d</td><td class="mono text-right">{{ storeView(14) }}</td></tr>
                        <tr><td><code>V15</code></td><td>r</td><td class="mono text-right">{{ storeView(15) }}</td></tr>
                        <tr><td><code>V16</code></td><td>Checks</td><td class="mono text-right">{{ storeView(16) }}</td></tr>
                      </tbody>
                    </v-table>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card variant="tonal" rounded="lg" class="pa-2">
                    <div class="text-subtitle-2 px-2 py-1">Result columns</div>
                    <v-table density="compact">
                      <tbody>
                        <tr><td><code>V21</code></td><td>Primflag (1/0)</td><td class="mono text-right">{{ storeView(21) }}</td></tr>
                        <tr><td><code>V22</code></td><td>Teiler</td><td class="mono text-right">{{ storeView(22) }}</td></tr>
                      </tbody>
                    </v-table>
                  </v-card>
                </v-col>
              </v-row>

              <v-alert class="mt-3" type="info" variant="tonal" density="compact">
                Rest wird wie bei Euklid berechnet: <code>r = n - floor(n/d)*d</code>.
              </v-alert>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import katex from "katex";
import "katex/dist/katex.min.css";

const KaTeXBlock = {
  props: { tex: { type: String, required: true } },
  computed: {
    html() {
      try {
        return katex.renderToString(this.tex, {
          throwOnError: false,
          displayMode: true
        });
      } catch (e) {
        return `<pre>${String(e)}</pre>`;
      }
    }
  },
  template: `<div v-html="html" class="katex-wrap"></div>`
};

class IntVM {
  constructor({ storeSize = 96, trace = false } = {}) {
    this.V = Array.from({ length: storeSize + 1 }, () => 0n);
    this.trace = trace;
    this.step = 0;
    this.logs = [];
  }

  setV(i, v) {
    this.V[i] = v;
  }

  getV(i) {
    return this.V[i];
  }

  exec(card) {
    const read = (x) => {
      if (x.V != null) return this.getV(x.V);
      if (x.I != null) return BigInt(x.I);
      throw new Error("Bad operand: " + JSON.stringify(x));
    };

    const a = read(card.a);
    const b = read(card.b);

    let r = 0n;
    switch (card.op) {
      case "ADD": r = a + b; break;
      case "SUB": r = a - b; break;
      case "MUL": r = a * b; break;
      case "DIV":
        if (b === 0n) throw new Error("Division durch 0 im Kartenprogramm.");
        r = a / b;
        break;
      default:
        throw new Error("Unknown op: " + card.op);
    }

    this.setV(card.dest, r);
    this.step++;
    if (this.trace) {
      this.logs.push(
        `#${String(this.step).padStart(2, "0")} L${card.line} ${card.label || ""} | ${card.op} -> V${card.dest} = ${r.toString()}`
      );
    }
  }

  run(deck) {
    for (const c of deck) this.exec(c);
  }
}

function parseBigIntInput(v, label) {
  const t = String(v ?? "").trim();
  if (!t) throw new Error(`${label}: leer.`);
  if (!/^[-+]?\d+$/.test(t)) throw new Error(`${label}: Bitte ganze Zahl eingeben.`);
  return BigInt(t);
}

function buildPrimeDeck(n) {
  const deck = [];
  let line = 1;

  deck.push({ line: line++, op: "ADD", a: { V: 5 }, b: { V: 1 }, dest: 11, label: "d:=2" });
  deck.push({ line: line++, op: "ADD", a: { V: 2 }, b: { V: 1 }, dest: 21, label: "isPrime:=1" });
  deck.push({ line: line++, op: "ADD", a: { V: 1 }, b: { V: 1 }, dest: 22, label: "divisor:=0" });
  deck.push({ line: line++, op: "ADD", a: { V: 1 }, b: { V: 1 }, dest: 16, label: "checks:=0" });

  let d = 2n;
  while (d * d <= n) {
    deck.push({ line: line++, op: "MUL", a: { V: 11 }, b: { V: 11 }, dest: 12, label: `[d=${d}] d2` });
    deck.push({ line: line++, op: "DIV", a: { V: 3 }, b: { V: 11 }, dest: 13, label: `[d=${d}] q:=n/d` });
    deck.push({ line: line++, op: "MUL", a: { V: 13 }, b: { V: 11 }, dest: 14, label: `[d=${d}] t:=q*d` });
    deck.push({ line: line++, op: "SUB", a: { V: 3 }, b: { V: 14 }, dest: 15, label: `[d=${d}] r:=n-t` });
    deck.push({ line: line++, op: "ADD", a: { V: 16 }, b: { V: 2 }, dest: 16, label: `[d=${d}] checks++` });

    const q = n / d;
    const t = q * d;
    const r = n - t;

    if (r === 0n) {
      deck.push({ line: line++, op: "ADD", a: { V: 11 }, b: { V: 1 }, dest: 22, label: `[d=${d}] divisor:=d` });
      deck.push({ line: line++, op: "ADD", a: { V: 1 }, b: { V: 1 }, dest: 21, label: `[d=${d}] isPrime:=0` });
      break;
    }

    deck.push({ line: line++, op: "ADD", a: { V: 11 }, b: { V: 2 }, dest: 11, label: `[d=${d}] d++` });
    d += 1n;
  }

  return deck;
}

const DEFAULT_N = "91";

const nInput = ref(DEFAULT_N);

const running = ref(false);
const error = ref("");
const result = ref(null);

const deck = ref([]);
const traceText = ref("");
const store = ref(null);
const tab = ref("deck");

const formulaTex = String.raw`
q:=\left\lfloor\frac{n}{d}\right\rfloor,\quad r:=n-q\cdot d\\
r=0\Rightarrow d\mid n\Rightarrow n\text{ ist nicht prim}
`;

function storeView(i) {
  if (!store.value) return "";
  const v = store.value[i];
  return v == null ? "0" : v.toString();
}

function intSqrtFloor(n) {
  if (n < 0n) throw new Error("sqrt nur für n>=0");
  if (n < 2n) return n;

  let x0 = n;
  let x1 = (x0 + n / x0) / 2n;
  while (x1 < x0) {
    x0 = x1;
    x1 = (x0 + n / x0) / 2n;
  }
  return x0;
}

function reset() {
  nInput.value = DEFAULT_N;
  running.value = false;
  error.value = "";
  result.value = null;
  deck.value = [];
  traceText.value = "";
  store.value = null;
  tab.value = "deck";
}

async function run() {
  running.value = true;
  error.value = "";
  result.value = null;

  try {
    const n = parseBigIntInput(nInput.value, "n");
    if (n < 2n) throw new Error("n muss mindestens 2 sein.");

    const vm = new IntVM({ storeSize: 96, trace: true });
    vm.setV(1, 0n);
    vm.setV(2, 1n);
    vm.setV(3, n);
    vm.setV(5, 2n);

    const d = buildPrimeDeck(n);
    deck.value = d;
    vm.run(d);

    const isPrime = vm.getV(21) === 1n;
    const divisor = vm.getV(22);
    const checks = vm.getV(16);
    const bound = intSqrtFloor(n);

    result.value = {
      n: n.toString(),
      isPrime,
      divisor: divisor.toString(),
      checks: checks.toString(),
      bound: bound.toString(),
      description: isPrime
        ? `Kein Teiler zwischen 2 und ${bound.toString()} gefunden.`
        : `${divisor.toString()} teilt ${n.toString()} ohne Rest.`
    };

    traceText.value = vm.logs.join("\n");
    store.value = vm.V;
    tab.value = "trace";
  } catch (e) {
    error.value = e?.message ? String(e.message) : String(e);
  } finally {
    running.value = false;
  }
}
</script>

<style scoped>
.katex-wrap :deep(.katex-display) {
  margin: 0.25rem 0;
}
</style>
