<template>
  <AppFrame>
    <template #title>
      <div class="badge">DG</div>
      <div>
        <h1>Eddie rechnet: Lineare diophantische Gleichung</h1>
        <p class="sub">Einführungsbeispiel • Erklärung • Rechner • Schritt-für-Schritt • Lösungstabelle</p>
      </div>
    </template>

    <template #descriptionPart>
      <figure class="exampleFigure">
          <ImageZoomer :title="`Eddie`">
             <img :src="titleImg" alt="Eddie rechnet" loading="lazy" />
          </ImageZoomer>
      </figure>
      <h2>Teil 1 — Einfaches Beispiel</h2>

      <div class="eddie">
        <p>
          Fangen wir mit einen einfachen Beispiel an. Ein Klassiker, wie er mir schon mal bei der Mathe Kreisolympiade begegnet ist:
        </p>

        <p>
          Ein Bauer geht mit <b>200 Talern</b> auf den Markt und will sein ganzes Geld für <b>Kühe</b> und
          <b>Schweine</b> ausgeben. Eine Kuh kostet <b>17</b> Taler, ein Schwein <b>6</b>.
        </p>

        <p>
          Setze <b>k</b> = Anzahl Kühe, <b>s</b> = Anzahl Schweine. Dann ist das genau die diophantische
          Gleichung:
          <Katex as="div" display tex="17k + 6s = 200,\quad k,s\in\mathbb{N}_0" />
        </p>

        <p>
          Weil <Katex tex="\gcd(17,6)=1" /> und <Katex tex="1\mid 200" /> gilt, existieren ganzzahlige
          Lösungen. Aus <Katex tex="17k\equiv 200\pmod 6" /> folgt <Katex tex="k\equiv 4\pmod 6" />, also
          <Katex tex="k=4+6t" />. Dann wird
          <Katex tex="s=\frac{200-17k}{6}=22-17t" />.
        </p>

        <div class="exampleClear"></div>

        <div class="kbox">
          <Katex as="div" display tex="(k,s)\in\{(4,22),(10,5)\}" />
        </div>

        <div class="tableScroller">
          <v-table density="compact">
            <thead>
              <tr>
                <th>t</th>
                <th>Kühe k</th>
                <th>Schweine s</th>
                <th>Check</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="mono">0</td>
                <td class="mono">4</td>
                <td class="mono">22</td>
                <td class="mono">17·4 + 6·22 = 200</td>
              </tr>
              <tr>
                <td class="mono">1</td>
                <td class="mono">10</td>
                <td class="mono">5</td>
                <td class="mono">17·10 + 6·5 = 200</td>
              </tr>
            </tbody>
          </v-table>
        </div>

        <p class="muted">
          Tipp: Trag unten einfach <code>a=17</code>, <code>b=6</code>, <code>c=200</code> ein, dann siehst
          du die gleiche Lösung inkl. Schritt-für-Schritt.
        </p>
      </div>

      <h2 class="mt-8">Teil 2 — Eddie erklärt’s</h2>

              <figure class="exampleFigure">
          <ImageZoomer :title="`Grafik: ${example.a}k + ${example.b}s = ${example.c}`">
            <DG_Graph
              :a="example.a"
              :b="example.b"
              :c="example.c"
              x-label="Kühe (k)"
              y-label="Schweine (s)"
              x-var="k"
              y-var="s"
            />
          </ImageZoomer>
        </figure>

      <div class="eddie">
        <p>
          Wir reden über <b>lineare diophantische Gleichungen</b>:
          <Katex tex="ax + by = c" />. Und jetzt kommt der Twist: <b>x und y sollen ganze Zahlen sein</b>.
          Keine Kommas. Keine Ausreden.
        </p>

        <p>
          Der wichtigste Move ist der <b>ggT</b> (größter gemeinsamer Teiler). Schreib ich kurz als
          <Katex tex="\gcd(a,b)" />. Denn: Die Gleichung hat genau dann Lösungen in ganzen Zahlen, wenn
          <Katex tex="\gcd(a,b)\mid c" /> gilt. Also: Der ggT von a und b muss c sauber teilen. Wenn
          nicht: Game over, keine ganzzahlige Lösung.
        </p>

        <p>
          Warum? Weil <Katex tex="\gcd(a,b)" /> alles teilt, was du aus <Katex tex="a" /> und
          <Katex tex="b" /> per Kombination <Katex tex="ax+by" /> bauen kannst. Wenn <Katex tex="c" />
          da nicht reinpasst, passt’s halt nicht. Mathematik ist manchmal kalt.
        </p>

        <p>
          Wenn’s passt, finden wir sogar eine Lösung. Der Trick heißt <b>erweiterter Euklid</b>: Er
          liefert Zahlen <Katex tex="u,v" /> mit <Katex tex="au + bv = \gcd(a,b)" />. Und dann skalieren
          wir das auf <Katex tex="c" />:
          <Katex
            as="div"
            display
            tex="x_0 = u\cdot \frac{c}{g},\quad y_0 = v\cdot \frac{c}{g}"
          />
          wobei <Katex tex="g=\gcd(a,b)" />.
        </p>

        <p>
          Und weil Mathe gern Serien draus macht, kommen alle Lösungen als Familie:
          <Katex
            as="div"
            display
            tex="x = x_0 + \frac{b}{g}\,t,\quad y = y_0 - \frac{a}{g}\,t,\quad t\in\mathbb{Z}"
          />
          Du darfst also <Katex tex="t" /> frei wählen (aber ganzzahlig!), und bekommst endlos viele
          Lösungen.
        </p>

        <v-expansion-panels variant="accordion" class="hintPanel">
          <v-expansion-panel>
            <v-expansion-panel-title>
              Eddie-Flüstermodus: Was heißt „diophantisch“?
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              Heißt im Kern: „Wir spielen das Ganze im Reich der ganzen Zahlen.“ Benannt nach Diophantos.
              Ja, die Alten hatten auch schon Spaß daran, sich das Leben schwer zu machen.
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </template>

    <template #interactivePart>
      <h2>Teil 3 — Rechner: <Katex tex="ax + by = c" /></h2>

      <v-card class="panel pa-5" >
        <v-form @submit.prevent="submit" autocomplete="off">
          <div class="formGrid">
            <v-text-field v-model="a" label="a" inputmode="numeric" />
            <v-text-field v-model="b" label="b" inputmode="numeric" />
            <v-text-field v-model="c" label="c" inputmode="numeric" />
          </div>

          <div class="actions">
            <v-btn type="submit" color="primary" variant="flat">Rechnen</v-btn>
            <v-btn type="button" variant="outlined" @click="randomize">Zufall</v-btn>
            <v-btn type="button" variant="text" @click="reset">Reset</v-btn>
          </div>

          <p class="mini">
            Ganze Zahlen only. Negative sind okay. Aber <code>a=b=0</code> ist… äh… „Existenzfrage“.
          </p>
        </v-form>
      </v-card>

      <v-card class="panel pa-3 mt-4" >
        <h3>Grafik zu deinen Eingaben</h3>
        <ImageZoomer :title="`Grafik: ${String(a)}x + ${String(b)}y = ${String(c)}`">
          <DG_Graph :a="a" :b="b" :c="c" />
        </ImageZoomer>
        <p class="mini muted">
          Zeigt die positiven ganzzahligen Lösungen (nur wenn a und b das gleiche Vorzeichen haben).
        </p>
      </v-card>
    </template>

    <template #calculationPart>
      <v-card class="panel" >
        <div class="resultHeader">
          <v-chip
            class="pill"
            size="small"
            :color="
              status.kind === 'ok'
                ? 'success'
                : status.kind === 'bad'
                  ? 'error'
                  : status.kind === 'warn'
                    ? 'warning'
                    : undefined
            "
            
          >
            {{ status.text }}
          </v-chip>
          <div class="equation">
            <Katex :tex="equationTex" />
          </div>
        </div>

        <div class="out">
          <h3 v-if="output.title">{{ output.title }}</h3>
          <div v-if="output.bodyIsKatex" class="kbox">
            <Katex as="div" display :tex="output.body" />
          </div>
          <p v-else class="muted">{{ output.body }}</p>
        </div>

        <div v-if="steps" class="stepWrap">
          <h3>Schritt-für-Schritt (ausklappbar)</h3>

          <v-expansion-panels variant="accordion" multiple>
            <v-expansion-panel :value="0">
              <v-expansion-panel-title>1) Lösbarkeitscheck</v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="kbox">
                  <Katex
                    as="div"
                    display
                    :tex="`g=\\gcd(${fmt(steps.a)},${fmt(steps.b)})=${fmt(steps.g)}`"
                  />
                </div>
                <div class="kbox">
                  <Katex as="div" display :tex="`${fmt(steps.g)}\\mid ${fmt(steps.c)}\\Rightarrow\\text{lösbar}`" />
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title>2) Erweiterter Euklid</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p class="muted">Wir suchen u,v mit au+bv=g.</p>
                <div class="kbox">
                  <Katex
                    as="div"
                    display
                    :tex="`${fmt(steps.a)}\\cdot ${fmt(steps.uNorm)} + ${fmt(steps.b)}\\cdot ${fmt(steps.vNorm)} = ${fmt(steps.g)}`"
                  />
                </div>

                <p class="muted">Rechenspur (Zustand vor jedem Update):</p>
                <div class="tableScroller">
                  <v-table density="compact">
                    <thead>
                      <tr>
                        <th>Schritt</th>
                        <th>q</th>
                        <th>old_r</th>
                        <th>r</th>
                        <th>old_s</th>
                        <th>s</th>
                        <th>old_t</th>
                        <th>t</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(st, idx) in steps.euclidSteps.slice(1)" :key="idx">
                        <td class="mono">{{ idx + 1 }}</td>
                        <td class="mono">{{ st.q }}</td>
                        <td class="mono">{{ st.old_r }}</td>
                        <td class="mono">{{ st.r }}</td>
                        <td class="mono">{{ st.old_s }}</td>
                        <td class="mono">{{ st.s }}</td>
                        <td class="mono">{{ st.old_t }}</td>
                        <td class="mono">{{ st.t }}</td>
                      </tr>
                      <tr v-if="steps.euclidSteps.length <= 1">
                        <td colspan="8" class="muted">Keine Schritte (komisch, aber möglich).</td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel :value="2">
              <v-expansion-panel-title>3) Skalieren auf c</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p class="muted">Wenn au+bv=g, dann gilt (c/g)(au+bv)=c.</p>
                <div class="kbox">
                  <Katex
                    as="div"
                    display
                    :tex="`x_0=u\\cdot\\frac{c}{g}=${fmt(steps.x0Euclid)}\\quad,\\quad y_0=v\\cdot\\frac{c}{g}=${fmt(steps.y0Euclid)}`"
                  />
                </div>
                <div class="kbox">
                  <Katex
                    as="div"
                    display
                    :tex="`${fmt(steps.a)}\\cdot ${fmt(steps.x0Euclid)} + ${fmt(steps.b)}\\cdot ${fmt(steps.y0Euclid)} = ${fmt(steps.c)}`"
                  />
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel :value="3">
              <v-expansion-panel-title>4) Allgemeine Lösung</v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="kbox">
                  <Katex as="div" display :tex="`x=x_0+\\frac{b}{g}t=${fmt(steps.x0)}+${fmt(steps.dx)}t`" />
                </div>
                <div class="kbox">
                  <Katex as="div" display :tex="`y=y_0-\\frac{a}{g}t=${fmt(steps.y0)}-${fmt(steps.dy)}t`" />
                </div>
                <p v-if="steps.tShift !== 0" class="muted">
                  Basislösung wurde für die Tabelle normalisiert (t0={{ steps.tShift }}).
                </p>
                <p class="muted">Mit <Katex tex="t\in\mathbb{Z}" />.</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>

        <div v-if="lastSolution" class="tableWrap">
          <h3>Viele Lösungen als Tabelle</h3>

          <v-row dense>
            <v-col cols="12" md="4">
              <v-text-field v-model="tableControls.tMin" label="t von" inputmode="numeric" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="tableControls.tMax" label="t bis" inputmode="numeric" />
            </v-col>
            <v-col cols="12" md="4">
              <!-- <v-btn class="w-100" variant="outlined" @click="updateTable">Tabelle aktualisieren</v-btn> -->
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="12" md="4">
              <v-checkbox v-model="tableControls.rangeFilter" label="nur x,y im Bereich" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="tableControls.xAbs" label="|x| ≤" inputmode="numeric" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="tableControls.yAbs" label="|y| ≤" inputmode="numeric" />
            </v-col>
          </v-row>

          <p class="muted tableMeta">{{ table.meta }}</p>

          <div class="tableScroller">
            <v-table density="compact">
              <thead>
                <tr>
                  <th>t</th>
                  <th>x</th>
                  <th>y</th>
                  <th>Check <Katex tex="ax+by" /></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in table.rows" :key="r.t">
                  <td class="mono">{{ r.t }}</td>
                  <td class="mono">{{ r.x }}</td>
                  <td class="mono">{{ r.y }}</td>
                  <td class="mono" :class="r.check === lastSolution.c ? 'okText' : 'badText'">
                    {{ r.check }}
                  </td>
                </tr>
                <tr v-if="table.rows.length === 0">
                  <td colspan="4" class="muted">Keine Treffer in diesem Bereich.</td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </div>
      </v-card>
    </template>

    <template #footer>
      <p class="muted">
        Hinweis: Die Schritt-für-Schritt-Ansicht zeigt die Logik, nicht nur das Ergebnis. Die Tabelle ist
        praktisch, wenn du „schöne“ Lösungen suchst (z.B. kleine Beträge).
      </p>
    </template>
  </AppFrame>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import DG_Graph from './DG_Graph.vue'
import ImageZoomer from '@/components/ImageZoomer.vue'
import Katex from '@/components/Katex.vue'
import { egcdWithSteps, fmt, gcd, parseIntStrict } from '@/utils/diophantine'
import titleImg from '@/images/DG.webp'

const example = { a: 17, b: 6, c: 200 }

const a = ref('17')
const b = ref('6')
const c = ref('200')

const status = reactive({
  kind: '',
  text: 'bereit',
})

const equationTex = computed(() => {
  const an = parseIntStrict(a.value)
  const bn = parseIntStrict(b.value)
  const cn = parseIntStrict(c.value)
  if (an === null || bn === null || cn === null) return 'ax + by = c'
  return `${fmt(an)}x + ${fmt(bn)}y = ${fmt(cn)}`
})

const output = ref({
  title: '',
  body: 'Gib Werte ein und klick auf Rechnen.',
  bodyIsKatex: false,
})

const steps = ref(null)

const tableControls = reactive({
  tMin: '-5',
  tMax: '5',
  rangeFilter: false,
  xAbs: '50',
  yAbs: '50',
})

const table = reactive({
  meta: '',
  rows: [],
  clipped: false,
})

const lastSolution = ref(null)

function setStatus(kind, text) {
  status.kind = kind || ''
  status.text = text
}

function mod(n, m) {
  return ((n % m) + m) % m
}

// Choose a "nicer" particular solution so that the table shows pleasant values near t=0.
// Strategy: normalize the coordinate with the smaller step size to its smallest nonnegative residue.
function normalizeParticularSolution({ x0, y0, dx, dy }) {
  const stepX = Math.abs(dx)
  const stepY = Math.abs(dy)

  // Prefer normalizing the variable that changes slower (smaller step).
  const normalizeX = stepX <= stepY

  if (normalizeX) {
    const x0Norm = mod(x0, stepX)
    const tShift = (x0Norm - x0) / dx
    const y0Norm = y0 - dy * tShift
    return { tShift, x0: x0Norm, y0: y0Norm, normalizedBy: 'x' }
  }

  const y0Norm = mod(y0, stepY)
  const tShift = (y0 - y0Norm) / dy
  const x0Norm = x0 + dx * tShift
  return { tShift, x0: x0Norm, y0: y0Norm, normalizedBy: 'y' }
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomExample() {
  const aa = randInt(-30, 30) || 14
  const bb = randInt(-30, 30) || 21
  const g = gcd(aa, bb) || 1
  const makeSolvable = Math.random() < 0.75
  let cc = randInt(-60, 60)
  if (makeSolvable) cc = cc - (cc % g)
  else if (g !== 0 && cc % g === 0) cc += 1
  return { a: aa, b: bb, c: cc }
}

function reset() {
  a.value = '17'
  b.value = '6'
  c.value = '200'
  setStatus('', 'bereit')
  output.value = {
    title: '',
    body: 'Gib Werte ein und klick auf Rechnen.',
    bodyIsKatex: false,
  }
  steps.value = null
  lastSolution.value = null
  table.meta = ''
  table.rows = []
  table.clipped = false
}

function solveAndRender(an, bn, cn) {
  steps.value = null
  lastSolution.value = null
  table.meta = ''
  table.rows = []
  table.clipped = false

  // Degenerate
  if (an === 0 && bn === 0) {
    if (cn === 0) {
      setStatus('warn', 'unendlich viele')
      output.value = {
        title: 'Hier steht effektiv:',
        body: '0 = 0',
        bodyIsKatex: true,
      }
    } else {
      setStatus('bad', 'keine')
      output.value = {
        title: 'Hier steht effektiv:',
        body: `0 = ${fmt(cn)}`,
        bodyIsKatex: true,
      }
    }
    return
  }

  // One coefficient zero: solve directly
  if (an === 0) {
    if (cn % bn !== 0) {
      setStatus('bad', 'keine')
      output.value = {
        title: 'Weil a=0:',
        body: `${fmt(bn)}y = ${fmt(cn)}\\;\\Rightarrow\\;\\text{nicht teilbar} \\Rightarrow \\text{keine L\\\"osung}`,
        bodyIsKatex: true,
      }
      return
    }
    const y0 = cn / bn
    setStatus('ok', 'lösbar')
    output.value = {
      title: 'Weil a=0:',
      body: `y = ${fmt(y0)}\\quad\\text{und}\\quad x=t\\ \\text{frei}`,
      bodyIsKatex: true,
    }
    return
  }

  if (bn === 0) {
    if (cn % an !== 0) {
      setStatus('bad', 'keine')
      output.value = {
        title: 'Weil b=0:',
        body: `${fmt(an)}x = ${fmt(cn)}\\;\\Rightarrow\\;\\text{nicht teilbar} \\Rightarrow \\text{keine L\\\"osung}`,
        bodyIsKatex: true,
      }
      return
    }
    const x0 = cn / an
    setStatus('ok', 'lösbar')
    output.value = {
      title: 'Weil b=0:',
      body: `x = ${fmt(x0)}\\quad\\text{und}\\quad y=t\\ \\text{frei}`,
      bodyIsKatex: true,
    }
    return
  }

  const g = gcd(an, bn)
  if (cn % g !== 0) {
    setStatus('bad', 'keine')
    output.value = {
      title: 'ggT-Check:',
      body: `g=\\gcd(${fmt(an)},${fmt(bn)})=${fmt(g)},\\quad ${fmt(g)}\\nmid ${fmt(cn)}`,
      bodyIsKatex: true,
    }
    return
  }

  const euclidInfo = egcdWithSteps(an, bn)
  let g2 = euclidInfo.g
  let u = euclidInfo.x
  let v = euclidInfo.y

  const sign = g2 < 0 ? -1 : 1
  g2 = Math.abs(g2)
  const uNorm = u * sign
  const vNorm = v * sign

  const scale = cn / g2
  const x0Euclid = uNorm * scale
  const y0Euclid = vNorm * scale

  const dx = bn / g
  const dy = an / g

  const normalized = normalizeParticularSolution({ x0: x0Euclid, y0: y0Euclid, dx, dy })
  const x0 = normalized.x0
  const y0 = normalized.y0

  setStatus('ok', 'lösbar')
  output.value = {
    title: 'Ergebnis',
    body: `(x_0,y_0)=(${fmt(x0)},${fmt(y0)})\\quad\\text{und}\\quad x=${fmt(x0)}+${fmt(dx)}t,\\ y=${fmt(y0)}-${fmt(dy)}t`,
    bodyIsKatex: true,
  }

  steps.value = {
    a: an,
    b: bn,
    c: cn,
    g,
    euclidSteps: euclidInfo.steps,
    uNorm,
    vNorm,
    x0Euclid,
    y0Euclid,
    x0,
    y0,
    dx,
    dy,
    tShift: normalized.tShift,
    normalizedBy: normalized.normalizedBy,
  }

  lastSolution.value = { a: an, b: bn, c: cn, x0, y0, dx, dy }
  updateTable()
}

function submit() {
  const an = parseIntStrict(a.value)
  const bn = parseIntStrict(b.value)
  const cn = parseIntStrict(c.value)

  if (an === null || bn === null || cn === null) {
    setStatus('warn', 'Eingabe?')
    output.value = {
      title: '',
      body: 'Ich brauch ganze Zahlen. Also 12 oder -7, nicht 3.14.',
      bodyIsKatex: false,
    }
    steps.value = null
    lastSolution.value = null
    table.meta = ''
    table.rows = []
    table.clipped = false
    return
  }

  solveAndRender(an, bn, cn)
}

function randomize() {
  const ex = randomExample()
  a.value = String(ex.a)
  b.value = String(ex.b)
  c.value = String(ex.c)
  submit()
}

function updateTable() {
  const sol = lastSolution.value
  if (!sol) return

  const tMin = parseIntStrict(tableControls.tMin)
  const tMax = parseIntStrict(tableControls.tMax)
  const xAbs = parseIntStrict(tableControls.xAbs)
  const yAbs = parseIntStrict(tableControls.yAbs)

  if (tMin === null || tMax === null || xAbs === null || yAbs === null) {
    table.meta = 'Eingaben für Tabelle müssen ganze Zahlen sein.'
    table.rows = []
    table.clipped = false
    return
  }

  const lo = Math.min(tMin, tMax)
  const hi = Math.max(tMin, tMax)

  const rows = []
  for (let t = lo; t <= hi; t++) {
    const x = sol.x0 + sol.dx * t
    const y = sol.y0 - sol.dy * t
    if (tableControls.rangeFilter) {
      if (Math.abs(x) > xAbs || Math.abs(y) > yAbs) continue
    }
    rows.push({ t, x, y, check: sol.a * x + sol.b * y })
  }

  const maxShow = 500
  table.clipped = rows.length > maxShow
  table.rows = table.clipped ? rows.slice(0, maxShow) : rows

  table.meta = `Bereich t in [${lo}, ${hi}] | Treffer: ${rows.length}${
    table.clipped ? ` (zeige nur die ersten ${maxShow})` : ''
  }${tableControls.rangeFilter ? ` | Filter: |x|<=${xAbs}, |y|<=${yAbs}` : ''}`
}

watch(
  () => [
    lastSolution.value,
    tableControls.tMin,
    tableControls.tMax,
    tableControls.rangeFilter,
    tableControls.xAbs,
    tableControls.yAbs,
  ],
  () => updateTable()
)
</script>
