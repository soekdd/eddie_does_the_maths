<template>
  <v-container class="py-6" fluid>
    <v-row>
      <v-col cols="12" md="5">
        <v-card rounded="xl" class="pa-4">
          <v-card-title class="text-h6">Ada-Karten: Quadratwurzel</v-card-title>
          <v-card-subtitle>
            Heron/Newton-Iteration mit Karten für <b>DIV, ADD, DIV</b>.
          </v-card-subtitle>

          <v-divider class="my-4" />

          <v-row dense>
            <v-col cols="12">
              <v-alert density="compact" type="info" variant="tonal" class="mb-2">
                <template v-if="result">
                  Nach {{ result.iterations }} Iterationen:
                  <b><Katex :tex="`x\\approx${toKaTeXFrac(result.approxFrac)}`" /></b>
                </template>
                <template v-else>
                  Wähle <Katex tex="N" />, Startwert <Katex tex="x_0" /> und Iterationszahl.
                </template>
              </v-alert>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="nInput"
                label="N (ganzzahlig, >0)"
                density="comfortable"
                placeholder="2"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="iterInput"
                label="Iterationen"
                density="comfortable"
                placeholder="6"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="x0Input"
                label="Startwert x0 (Bruch erlaubt, z.B. 1 oder 3/2)"
                density="comfortable"
                placeholder="1"
              />
            </v-col>

            <v-col cols="12">
              <v-alert density="compact" type="warning" variant="tonal">
                Iterationsformel: <Katex tex="x_{k+1}=\frac{1}{2}\left(x_k+\frac{N}{x_k}\right)" />.
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
          <v-card-title class="text-h6">Formel (Heron/Newton)</v-card-title>
          <v-card-text>
            <KaTeXBlock :tex="formulaTex" />
            <div class="text-body-2 mt-3">
              Mit jedem Durchlauf nähert sich <Katex tex="x_k" /> der Wurzel <Katex tex="\sqrt{N}" /> an.
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
                <div class="text-caption mb-1">Näherung</div>
                <div class="text-h5 font-weight-bold">{{ result.approxFrac }}</div>
                <div class="mt-2"><KaTeXBlock :tex="result.evalTex" /></div>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-card variant="tonal" rounded="xl" class="pa-4">
                <div class="text-caption mb-1">Dezimal & Fehler</div>
                <div class="text-h6 font-weight-medium">{{ result.approxDecimal }}</div>
                <div class="text-body-2 mt-1">Fehler: {{ result.errorDecimal }}</div>
                <div class="text-caption mt-2">(auf 6 Nachkommastellen gerundet)</div>
              </v-card>
            </v-col>

            <v-col cols="12">
              <v-chip class="me-2" color="green" variant="tonal">
                Iterationen: {{ result.iterations }}
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
                        <tr><td><code>V2</code></td><td>2</td><td class="mono text-right">{{ storeView(2) }}</td></tr>
                        <tr><td><code>V3</code></td><td>N</td><td class="mono text-right">{{ storeView(3) }}</td></tr>
                        <tr><td><code>V4</code></td><td>x0</td><td class="mono text-right">{{ storeView(4) }}</td></tr>
                        <tr><td><code>V5</code></td><td>1</td><td class="mono text-right">{{ storeView(5) }}</td></tr>
                      </tbody>
                    </v-table>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card variant="tonal" rounded="lg" class="pa-2">
                    <div class="text-subtitle-2 px-2 py-1">Working columns</div>
                    <v-table density="compact">
                      <tbody>
                        <tr><td><code>V11</code></td><td>x_k</td><td class="mono text-right">{{ storeView(11) }}</td></tr>
                        <tr><td><code>V12</code></td><td>N/x_k</td><td class="mono text-right">{{ storeView(12) }}</td></tr>
                        <tr><td><code>V13</code></td><td>Summe</td><td class="mono text-right">{{ storeView(13) }}</td></tr>
                        <tr><td><code>V14</code></td><td>x_{k+1}</td><td class="mono text-right">{{ storeView(14) }}</td></tr>
                        <tr><td><code>V16</code></td><td>Loopzähler</td><td class="mono text-right">{{ storeView(16) }}</td></tr>
                      </tbody>
                    </v-table>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card variant="tonal" rounded="lg" class="pa-2">
                    <div class="text-subtitle-2 px-2 py-1">Result columns</div>
                    <v-table density="compact">
                      <tbody>
                        <tr><td><code>V21</code></td><td>Näherung</td><td class="mono text-right">{{ storeView(21) }}</td></tr>
                        <tr><td><code>V22</code></td><td>x^2</td><td class="mono text-right">{{ storeView(22) }}</td></tr>
                        <tr><td><code>V23</code></td><td>x^2-N</td><td class="mono text-right">{{ storeView(23) }}</td></tr>
                      </tbody>
                    </v-table>
                  </v-card>
                </v-col>
              </v-row>

              <v-alert class="mt-3" type="info" variant="tonal" density="compact">
                Ein Iterationszyklus ist exakt: <code>DIV</code> → <code>ADD</code> → <code>DIV</code>.
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

const bigAbs = (x) => (x < 0n ? -x : x);

function gcd(a, b) {
  a = bigAbs(a);
  b = bigAbs(b);
  while (b !== 0n) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}

class Rat {
  constructor(num, den = 1n) {
    if (den === 0n) throw new Error("Division by zero (den=0).");
    if (den < 0n) {
      num = -num;
      den = -den;
    }
    const g = gcd(num, den);
    this.num = num / g;
    this.den = den / g;
  }

  static ofInt(n) {
    return new Rat(BigInt(n), 1n);
  }

  add(r) {
    return new Rat(this.num * r.den + r.num * this.den, this.den * r.den);
  }

  sub(r) {
    return new Rat(this.num * r.den - r.num * this.den, this.den * r.den);
  }

  mul(r) {
    return new Rat(this.num * r.num, this.den * r.den);
  }

  div(r) {
    if (r.num === 0n) throw new Error("Division by zero.");
    return new Rat(this.num * r.den, this.den * r.num);
  }

  toString() {
    if (this.den === 1n) return this.num.toString();
    return `${this.num.toString()}/${this.den.toString()}`;
  }

  toDecimalRounded(digits = 6) {
    const sign = this.num < 0n ? "-" : "";
    let n = bigAbs(this.num);
    let d = this.den;

    let intPart = n / d;
    const rem = n % d;

    const scale = 10n ** BigInt(digits);
    let frac = (rem * scale) / d;
    const tailRem = (rem * scale) % d;

    if (2n * tailRem >= d) frac += 1n;
    if (frac >= scale) {
      intPart += 1n;
      frac -= scale;
    }

    return `${sign}${intPart.toString()},${frac.toString().padStart(digits, "0")}`;
  }
}

class RatVM {
  constructor({ storeSize = 96, trace = false } = {}) {
    this.V = Array.from({ length: storeSize + 1 }, () => Rat.ofInt(0));
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
      if (x.I != null) return Rat.ofInt(x.I);
      throw new Error("Bad operand: " + JSON.stringify(x));
    };

    const a = read(card.a);
    const b = read(card.b);

    let r = Rat.ofInt(0);
    switch (card.op) {
      case "ADD": r = a.add(b); break;
      case "SUB": r = a.sub(b); break;
      case "MUL": r = a.mul(b); break;
      case "DIV": r = a.div(b); break;
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

function parseRatInput(v, label) {
  const t = String(v ?? "").trim();
  if (!t) throw new Error(`${label}: leer.`);

  if (/^[-+]?\d+$/.test(t)) {
    return new Rat(BigInt(t), 1n);
  }

  if (/^[-+]?\d+\s*\/\s*[-+]?\d+$/.test(t)) {
    const [a, b] = t.split("/").map((x) => x.trim());
    const den = BigInt(b);
    if (den === 0n) throw new Error(`${label}: Nenner darf nicht 0 sein.`);
    return new Rat(BigInt(a), den);
  }

  throw new Error(`${label}: Nur ganze Zahl oder Bruch a/b erlaubt.`);
}

function toKaTeXFrac(fracStr) {
  const s = String(fracStr);
  if (!s.includes("/")) return s;
  const [a, b] = s.split("/");
  return String.raw`\frac{${a}}{${b}}`;
}

function buildSqrtDeck(iterations) {
  const deck = [];
  let line = 1;

  deck.push({ line: line++, op: "ADD", a: { V: 4 }, b: { V: 1 }, dest: 11, label: "x:=x0" });
  deck.push({ line: line++, op: "ADD", a: { V: 1 }, b: { V: 1 }, dest: 16, label: "iter:=0" });

  for (let k = 1; k <= iterations; k++) {
    deck.push({ line: line++, op: "DIV", a: { V: 3 }, b: { V: 11 }, dest: 12, label: `[${k}] t:=N/x` });
    deck.push({ line: line++, op: "ADD", a: { V: 11 }, b: { V: 12 }, dest: 13, label: `[${k}] s:=x+t` });
    deck.push({ line: line++, op: "DIV", a: { V: 13 }, b: { V: 2 }, dest: 14, label: `[${k}] xn:=s/2` });
    deck.push({ line: line++, op: "ADD", a: { V: 14 }, b: { V: 1 }, dest: 11, label: `[${k}] x:=xn` });
    deck.push({ line: line++, op: "ADD", a: { V: 16 }, b: { V: 5 }, dest: 16, label: `[${k}] iter++` });
  }

  deck.push({ line: line++, op: "ADD", a: { V: 11 }, b: { V: 1 }, dest: 21, label: "output x" });
  deck.push({ line: line++, op: "MUL", a: { V: 21 }, b: { V: 21 }, dest: 22, label: "x^2" });
  deck.push({ line: line++, op: "SUB", a: { V: 22 }, b: { V: 3 }, dest: 23, label: "x^2-N" });

  return deck;
}

const DEFAULT_N = "2";
const DEFAULT_X0 = "1";
const DEFAULT_ITERS = "6";

const nInput = ref(DEFAULT_N);
const x0Input = ref(DEFAULT_X0);
const iterInput = ref(DEFAULT_ITERS);

const running = ref(false);
const error = ref("");
const result = ref(null);

const deck = ref([]);
const traceText = ref("");
const store = ref(null);
const tab = ref("deck");

const formulaTex = String.raw`
x_{k+1}=\frac{1}{2}\left(x_k+\frac{N}{x_k}\right)\\
\text{Start }x_0>0,\;\text{dann }x_k\to\sqrt{N}
`;

function storeView(i) {
  if (!store.value) return "";
  const v = store.value[i];
  return v == null ? "0" : v.toString();
}

function reset() {
  nInput.value = DEFAULT_N;
  x0Input.value = DEFAULT_X0;
  iterInput.value = DEFAULT_ITERS;
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
    const N = parseBigIntInput(nInput.value, "N");
    const iterationsBig = parseBigIntInput(iterInput.value, "Iterationen");
    const x0 = parseRatInput(x0Input.value, "x0");

    if (N <= 0n) throw new Error("N muss größer als 0 sein.");
    if (iterationsBig < 1n || iterationsBig > 20n) throw new Error("Iterationen bitte zwischen 1 und 20.");
    if (x0.num === 0n) throw new Error("x0 darf nicht 0 sein.");

    const iterations = Number(iterationsBig);

    const vm = new RatVM({ storeSize: 96, trace: true });
    vm.setV(1, Rat.ofInt(0));
    vm.setV(2, Rat.ofInt(2));
    vm.setV(3, Rat.ofInt(N));
    vm.setV(4, x0);
    vm.setV(5, Rat.ofInt(1));

    const d = buildSqrtDeck(iterations);
    deck.value = d;

    vm.run(d);

    const approx = vm.getV(21);
    const err = vm.getV(23);

    result.value = {
      n: N.toString(),
      iterations: iterations.toString(),
      approxFrac: approx.toString(),
      approxDecimal: approx.toDecimalRounded(6),
      errorFrac: err.toString(),
      errorDecimal: err.toDecimalRounded(6),
      evalTex: String.raw`x\approx\sqrt{${N.toString()}}\approx${toKaTeXFrac(approx.toString())}`
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
