<template>
  <AppFrame warning>
    <template #title>
      <div class="badge">ST</div>
      <div>
        <h1>Eddie rechnet: Spieltheorie am Busbahnhof</h1>
        <p class="sub">Entscheidungsbaum • Wahrscheinlichkeiten • Rechner</p>
      </div>
    </template>

    <template #descriptionPart>
       <figure class="exampleFigure">
          <ImageZoomer :title="`Eddie`">
             <img :src="titleImg" alt="Eddie rechnet" loading="lazy" />
          </ImageZoomer>
      </figure>

      <h2>Teil 1 — Worum’s geht (Kurzfassung)</h2>
      <div class="eddie">
        <p class="muted">
          <i>„Spieltheorie, aber auf Straßenstaub und kalte Finger runtergebrochen.“</i>
        </p>

        <p>
          Ich entscheide nicht aus dem Bauch, sondern rechne mir die <b>Chance auf Freiheit</b> aus. Ich
          zerlege die Szene in <b>Pfad-Entscheidungen</b>, gebe jeder Kante eine Wahrscheinlichkeit, und
          am Ende bleibt eine Zahl, mit der ich leben kann.
        </p>

        <p>Der Baum hat drei Ebenen:</p>
        <ol>
          <li><b>Bus-Situation</b>: Kommt ein Bus (Sueden/Norden) in meinem Zeitfenster?</li>
          <li><b>Fahrer-Test</b>: Nimmt der Fahrer meine D‑Mark?</li>
          <li><b>Verfolger-Risiko</b>: Erwischt er mich oder verpasst er mich?</li>
        </ol>

        <div class="exampleClear"></div>
      </div>

      <h2 class="mt-8">Teil 1b — Wie komme ich an p (Bus kommt)?</h2>
      <div class="eddie">
        <p>
          Ein einfaches Bauch-zu-Zahl‑Modell: Ich betrachte eine Stunde als Zeitfenster und frage:
          <i>Wie viel Prozent dieser Stunde steht ein Bus wirklich da?</i>
        </p>

        <p class="muted">
          Wenn pro Richtung <Katex tex="f" /> Busse pro Stunde kommen und jeder Bus im Schnitt
          <Katex tex="t" /> Minuten am Bahnsteig steht, dann ist der Zeitanteil
          <Katex tex="p \approx \frac{f\,t}{60}" />.
        </p>

        <div class="kbox">
          <div class="mono">
            Beispiel: <code class="mono">t=5</code> Minuten und <code class="mono">f=1</code> pro Stunde
            <span class="mono">→</span>
            <Katex tex="p=\frac{5}{60}\approx 0{,}083" />
          </div>
        </div>
      </div>

      <h2 class="mt-8">Teil 2 — Vereinfachung (damit’s flott geht)</h2>
      <div class="eddie">
        <p class="muted">
          Heute machen wir’s schlanker: <Katex tex="p_S=p_N=p" />, <Katex tex="a_S=a_N=a" />,
          <Katex tex="r_S=r_N=r" />.
        </p>

        <ul>
          <li><Katex tex="f" />: Busse pro Stunde <b>pro Richtung</b></li>
          <li><Katex tex="t" />: Standzeit (Minuten)</li>
          <li><Katex tex="p\approx \frac{f\,t}{60}" />: daraus (pro Richtung) die Bus‑Wahrscheinlichkeit</li>
          <li><Katex tex="a" />: Fahrer akzeptiert D‑Mark</li>
          <li><Katex tex="r" />: Erwischt‑Wahrscheinlichkeit</li>
        </ul>

        <p class="muted">
          Dann ist <Katex tex="P(\text{kein Bus})=1-2p" />.
        </p>
      </div>

      <h2 class="mt-8">Teil 3 — Erfolgsformel</h2>
      <div class="eddie">
        <p>
          Es gibt zwei Erfolgswege (Sueden und Norden), und beide sind gleich stark. Darum könnte man auf zwei
          gleichen Pfaden schließen und einfach ein Faktor 2 ansetzen. Doch richtig korrekt ist das nicht. Denn
          wenn wir Wahrscheinlichkeiten einfach addieren, kann es schnell passieren, dass wir eine Wahrscheinlichkeit 
          von über 100% erhalten. Der korrekte Weg ist, die Reziproke zu Multiplizieren. Bei kleinen Wahrscheinlichkeiten 
          komme beide Wege annähernd auf das gleiche Ergebis.
        </p>

        <div class="kbox">
          <Katex as="div" display tex="P(\text{Freiheit}) = 2p\cdot a\cdot (1-r)." />
        </div>

        <p class="muted">
          Alles andere ist Misserfolg: <Katex tex="P(\text{Misserfolg})=1-P(\text{Freiheit})" />.
        </p>
      </div>

      <h2 class="mt-8">Teil 4 — Mini‑Beispiel</h2>
      <div class="eddie">
        <p class="muted">
          Beispielwerte: <code class="mono">f=1</code> pro Stunde, <code class="mono">t=5</code> Minuten,
          <code class="mono">a=0,8</code>, <code class="mono">r=0,2</code>.
        </p>

        <div class="kbox">
          <div class="mono">
            pro Richtung: p = f·t/60 = {{ fmtDec(exampleOut.p, 3) }} ({{ fmtPct(exampleOut.p) }})
          </div>
          <div class="mono">
            Gesamt: 2·p·a·(1-r) = {{ fmtDec(exampleOut.freedom, 3) }} ({{ fmtPct(exampleOut.freedom) }})
          </div>
        </div>

        <ul>
          <li>Ich sehe sofort, welche Kante am meisten weh tut (p, a oder r).</li>
          <li>Wenn ich “Bus” killen will: <code class="mono">p=0</code>. Wenn ich “Fahrer” killen will: <code class="mono">a=0</code>.</li>
          <li>Und wenn ich “Mielke” kleiner machen will: <code class="mono">r</code> runter.</li>
        </ul>
      </div>
    </template>

    <template #interactivePart>
      <h2>Teil 5 — Rechner</h2>

      <v-card class="panel pa-5" variant="tonal">
        <div class="formGrid">
          <v-text-field v-model="busPerHour" label="f (Busse pro Stunde pro Richtung)" inputmode="decimal" />
          <v-text-field v-model="standMinutes" label="t (Standzeit in Minuten)" inputmode="decimal" />
          <v-text-field v-model="a" label="a (Fahrer nimmt DM)" inputmode="decimal" />
          <v-text-field v-model="r" label="r (Erwischt)" inputmode="decimal" />
        </div>

        <div class="actions">
          <v-btn type="button" color="primary" variant="flat" @click="randomize">Zufall</v-btn>
          <v-btn type="button" variant="outlined" @click="reset">Reset</v-btn>
        </div>

        <p class="mini">
          <b>Faustformel:</b> <code class="mono">p ≈ f·t/60</code> (pro Richtung).
          <br />
          <span class="muted">
            Für <code class="mono">a</code> und <code class="mono">r</code> gelten Werte zwischen
            <code class="mono">0</code> und <code class="mono">1</code>. Komma geht auch:
            <code class="mono">0,65</code>.
          </span>
          <br />
          <span class="muted">
            Weil es zwei Richtungen gibt, muss am Ende <code class="mono">p</code> <=
            <code class="mono">0,5</code> sein, sonst wird <code class="mono">1-2p</code> negativ.
          </span>
        </p>
      </v-card>

      <v-card class="panel pa-3 mt-4" variant="tonal">
        <h3>Baum zu deinen Eingaben</h3>
        <ImageZoomer :title="graphTitle">
          <ST_Graph :standMinutes :busPerHour :a :r />
        </ImageZoomer>
        <ImageZoomer :title="graphTitle">
          <ST_Graph2 :p="calc.ok ? calc.pp : 0" :a="a" :r="r" />
        </ImageZoomer>
      </v-card>
    </template>

    <template #calculationPart>
      <v-card class="panel" variant="tonal">
        <div class="resultHeader">
          <v-chip
            class="pill"
            size="small"
            :color="status.kind === 'ok' ? 'success' : status.kind === 'warn' ? 'warning' : 'error'"
          >
            {{ status.text }}
          </v-chip>
          <div class="equation">
            <span class="mono">P(Freiheit) =</span>
            <span v-if="calc.ok" class="mono">{{ fmtPct(calc.freedom) }}</span>
            <span v-else class="mono">…</span>
          </div>
        </div>

        <div class="out">
          <p v-if="!calc.ok" class="muted">{{ calc.message }}</p>

          <div v-else>
            <p class="muted" v-if="calc.issues.length">
              {{ calc.issues.join(' · ') }}
            </p>

            <div class="kbox">
              <div class="mono">f (Busse/h pro Richtung) = {{ fmtDec(calc.f, 2) }}</div>
              <div class="mono">t (Standzeit in Minuten) = {{ fmtDec(calc.t, 1) }}</div>
              <div class="mono">p = f·t/60 = {{ fmtDec(calc.pp, 3) }} ({{ fmtPct(calc.pp) }})</div>
              <div class="mono">pNone = 1 - 2p = {{ fmtDec(calc.pNone, 3) }} ({{ fmtPct(calc.pNone) }})</div>
              <div class="mono">
                pro Richtung: p·a·(1-r) = {{ fmtDec(calc.perBranch, 3) }} ({{ fmtPct(calc.perBranch) }})
              </div>
              <div class="mono">P(Freiheit) = {{ fmtDec(calc.freedom, 3) }} ({{ fmtPct(calc.freedom) }})</div>
              <div class="mono">P(Misserfolg) = {{ fmtDec(calc.failure, 3) }} ({{ fmtPct(calc.failure) }})</div>
            </div>

            <div class="tableScroller">
              <v-table density="compact">
                <thead>
                  <tr>
                    <th>Ast</th>
                    <th class="text-right">Wert</th>
                    <th class="text-right">%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in calc.breakdown" :key="row.k">
                    <td class="mono">{{ row.k }}</td>
                    <td class="mono text-right">{{ fmtDec(row.v, 3) }}</td>
                    <td class="mono text-right">{{ fmtPct(row.v) }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </div>
        </div>
      </v-card>
    </template>

    <template #footer>
      <p class="muted">
        Eddie-Notiz: In diesem vereinfachten Modell sind Sueden und Norden absichtlich gleich. Das spart
        Variablen und macht die Rechnung schnell. Wenn du wieder Richtungstaktik willst, muessen wir die
        Symmetrie wieder aufbrechen.
      </p>
    </template>
  </AppFrame>
</template>

<script setup>
import { computed, ref } from 'vue'
import ImageZoomer from '@/components/ImageZoomer.vue'
import Katex from '@/components/Katex.vue'
import ST_Graph from './ST_Graph.vue'
import ST_Graph2 from './ST_Graph2.vue'
import titleImg from '@/images/ST.webp'

// Vereinfachtes Modell:
// pS = pN = p, aS = aN = a, rS = rN = r.
// Dadurch ist P(kein Bus) = 1 - 2p und P(Freiheit) = 2 p a (1-r).
//
// p kann man sich praktisch als "Zeitanteil" denken:
// Wenn pro Richtung f Busse pro Stunde kommen und jeder Bus t Minuten am Bahnsteig steht,
// dann gilt naehrungsweise p ~= f*t/60.
// Beispiel: t=5min und f=1/h -> p = 5/60.
const example = {
  busPerHour: 1,
  standMinutes: 5,
  a: 0.8,
  r: 0.2,
}

const busPerHour = ref(String(example.busPerHour))
const standMinutes = ref(String(example.standMinutes))
const a = ref(String(example.a))
const r = ref(String(example.r))

const exampleOut = {
  p: (example.busPerHour * example.standMinutes) / 60,
}
exampleOut.perBranch = exampleOut.p * example.a * (1 - example.r)
exampleOut.freedom = 2 * exampleOut.perBranch

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

function fmtPct(n, digits = 1) {
  if (!Number.isFinite(n)) return '–'
  return `${(n * 100).toFixed(digits).replace('.', ',')}%`
}

function fmtDec(n, digits = 3) {
  if (!Number.isFinite(n)) return '–'
  return n.toFixed(digits).replace('.', ',')
}

function reset() {
  busPerHour.value = String(example.busPerHour)
  standMinutes.value = String(example.standMinutes)
  a.value = String(example.a)
  r.value = String(example.r)
}

function rand(min, max) {
  return Math.random() * (max - min) + min
}

function randomize() {
  const f = rand(0.2, 3.5)
  const t = rand(2, 12)
  // Ensure p<=0.5 (2p<=1) in the simplified two-direction model.
  const p = (f * t) / 60
  if (p > 0.5) {
    standMinutes.value = (30 / f).toFixed(1)
    busPerHour.value = f.toFixed(2)
  } else {
    busPerHour.value = f.toFixed(2)
    standMinutes.value = t.toFixed(1)
  }
  a.value = rand(0.2, 0.95).toFixed(2)
  r.value = rand(0.05, 0.85).toFixed(2)
}

const calc = computed(() => {
  const f = parseMaybeFloat(busPerHour.value)
  const t = parseMaybeFloat(standMinutes.value)
  const aa = parseMaybeFloat(a.value)
  const rr = parseMaybeFloat(r.value)

  if ([f, t, aa, rr].some((n) => n === null)) {
    return { ok: false, message: 'Bitte Zahlen eingeben. Tipp: 0,65 geht auch.' }
  }
  if (f < 0 || t < 0) {
    return { ok: false, message: 'Busse/Standszeit muessen >= 0 sein.' }
  }
  if (t > 60) {
    return { ok: false, message: 'Standzeit muss <= 60 Minuten sein (wir rechnen "pro Stunde").' }
  }
  if (![aa, rr].every(in01)) {
    return { ok: false, message: 'Werte muessen im Intervall [0,1] liegen.' }
  }

  const pp = (f * t) / 60
  if (pp > 1) {
    return { ok: false, message: 'f*t/60 ist > 1. Das waere mehr als 100% Bus-Zeit. Werte pruefen.' }
  }

  // p ist "pro Richtung" (Sueden und Norden). Darum muss 2p <= 1 gelten.
  if (pp > 0.5) {
    return {
      ok: false,
      message: 'Im Modell gibt es zwei Richtungen. Darum muss p <= 0,5 sein (sonst wird 1-2p negativ).',
    }
  }

  const issues = []
  const pNone = 1 - 2 * pp

  const perBranch = pp * aa * (1 - rr)
  const freedom = 2 * perBranch
  const reject = 2 * pp * (1 - aa)
  const caught = 2 * pp * aa * rr
  const failure = 1 - freedom

  const breakdown = [
    { k: 'p (pro Richtung): f·t/60', v: pp },
    { k: 'Kein Bus: 1-2p', v: pNone },
    { k: 'Fahrer nein: 2·p·(1-a)', v: reject },
    { k: 'Erwischt: 2·p·a·r', v: caught },
    { k: 'Freiheit: 2·p·a·(1-r)', v: freedom },
  ]

  return {
    ok: true,
    issues,
    f,
    t,
    pp,
    aa,
    rr,
    pNone,
    perBranch,
    reject,
    caught,
    freedom,
    failure,
    breakdown,
  }
})

const status = computed(() => {
  if (!calc.value.ok) return { kind: 'bad', text: 'Eingaben pruefen' }
  if (calc.value.issues.length) return { kind: 'warn', text: 'fast gut, aber…' }
  return { kind: 'ok', text: 'bereit' }
})

const graphTitle = computed(() => 'Entscheidungsbaum: Bus · Fahrer · Verfolger')
</script>
