<template>
<AppFrame>
	<template #title>
		<div class="badge">BA</div>
		<div>
			<h1>Eddie rechnet: BASIC for runaways

			</h1>
			<p class="sub">Cäsar • Vigenère • C64 Emulator</p>
		</div>
	</template>

		<template #descriptionPart>					
        	<figure class="exampleFigure">
			<ImageZoomer :title="`Eddie`">
				<img alt="Eddie rechnet" loading="lazy" :src="titleImg" />
			</ImageZoomer>
			</figure>

            <h2>Cäsar &amp; Vigenère</h2>
            <div class="text-body-2 text-medium-emphasis">
              Zwei Klassiker: einmal „Alphabet verschieben“, einmal „Verschieben mit rotierendem Schlüssel“.
            </div>
        

        <!-- Grundlagen -->
        <v-card class="mb-6" rounded="lg" elevation="2">
          <v-card-title class="text-h6">Grundidee: Buchstaben als Zahlen</v-card-title>
          <v-card-text>
            <p class="mb-3">
              Wir arbeiten fast immer mit dem Alphabet <strong>A–Z</strong> und machen daraus Zahlen.
              Am beliebtesten ist:
            </p>

            
                <v-sheet rounded="lg" class="pa-3" border>
                  <div class="text-subtitle-2 mb-2">Zuordnung</div>
                  <div class="d-flex flex-wrap ga-2">
                    <v-chip size="small" variant="tonal">A → 0</v-chip>
                    <v-chip size="small" variant="tonal">B → 1</v-chip>
                    <v-chip size="small" variant="tonal">…</v-chip>
                    <v-chip size="small" variant="tonal">Z → 25</v-chip>
                  </div>
                </v-sheet>
            
                <v-sheet rounded="lg" class="pa-3 mt-2" border>
                  <div class="text-subtitle-2 mb-2">Rechnen „im Kreis“</div>
                  <div class="text-body-2">
                    Nach Z kommt wieder A. Mathematisch ist das Rechnen <em>modulo 26</em>.
                  </div>
                  <div class="mt-2" v-html="katexBlock(String.raw`\text{Beispiel: } 25+3=28 \equiv 2 \pmod{26}\ \Rightarrow\ Z \xrightarrow{+3} C`)"></div>
                </v-sheet>
            

            <v-divider class="my-4" />

            <p class="mb-0">
              Und ja: In echten Texten muss man vorher meist „aufräumen“:
              Großbuchstaben, Umlaute ersetzen (Ä→AE, Ö→OE, Ü→UE), Satzzeichen raus –
              oder man behandelt sie getrennt.
            </p>
          </v-card-text>
        </v-card>

        <!-- Cäsar -->
        <v-card class="mb-6" rounded="lg" elevation="2">
          <v-card-title class="text-h6">1) Cäsar-Verschlüsselung</v-card-title>
          <v-card-text>
            <p class="mb-3">
              Cäsar ist die Minimalversion: ein fester Shift <span class="font-weight-medium">k</span>.
              Jeder Buchstabe wird um <span class="font-weight-medium">k</span> Stellen weitergeschoben.
            </p>

            <div class="mb-3" v-html="katexBlock(String.raw`
              \textbf{Verschlüsselung:}\quad C \equiv P + k \pmod{26}
              \qquad\qquad
              \textbf{Entschlüsselung:}\quad P \equiv C - k \pmod{26}
            `)"></div>

            <v-row>
              <v-col cols="12" md="6">
                <v-sheet rounded="lg" border class="pa-3">
                  <div class="text-subtitle-2 mb-2">Beispiel</div>
                  <div class="text-body-2 mb-2">
                    Klartext: <code>{{ caesarExample.plain }}</code> &nbsp;|&nbsp; Shift: <code>k={{ caesarExample.k }}</code>
                  </div>

                  <v-table density="compact">
                    <thead>
                      <tr>
                        <th class="text-left">Buchstabe</th>
                        <th class="text-left">Zahl</th>
                        <th class="text-left">+k</th>
                        <th class="text-left">Cipher</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(r, i) in caesarExample.rows" :key="i">
                        <td><code>{{ r.p }}</code></td>
                        <td><code>{{ r.pn }}</code></td>
                        <td><code>{{ r.cn }}</code></td>
                        <td><code>{{ r.c }}</code></td>
                      </tr>
                    </tbody>
                  </v-table>

                  <div class="mt-3 text-body-2">
                    Ergebnis: <code>{{ caesarExample.cipher }}</code>
                  </div>
                </v-sheet>
              </v-col>

              <v-col cols="12" md="6">
                <v-sheet rounded="lg" border class="pa-3">
                  <div class="text-subtitle-2 mb-2">Warum Cäsar oft schnell fällt</div>
                  <ul class="text-body-2 mb-0">
                    <li>Es gibt nur <strong>25</strong> sinnvolle Schlüssel (k=1…25).</li>
                    <li>Man kann einfach alles durchprobieren („Bruteforce“).</li>
                    <li>Oder man nutzt <strong>Häufigkeiten</strong>: E, N, I, R, S… treten oft auf.</li>
                  </ul>
                </v-sheet>
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <v-expansion-panels variant="accordion">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  Mini-Übung: Entschlüssele <code>HGGLE</code> mit Shift <code>k=3</code>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="text-body-2 mb-2">
                    Entschlüsselung ist „-3“. Also H→E, G→D, G→D, L→I, E→B.
                  </div>
                  <div class="text-body-2">
                    Lösung: <code>EDDIB</code> (Achtung: Das ist nur ein Beispiel, nicht „das“ Wort.)
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>

        <!-- Vigenère -->
        <v-card class="mb-6" rounded="lg" elevation="2">
          <v-card-title class="text-h6">2) Vigenère-Verschlüsselung</v-card-title>
          <v-card-text>
            <p class="mb-3">
              Vigenère ist wie Cäsar – nur mit einem <strong>rotierenden Schlüssel</strong>.
              Statt immer denselben Shift zu nehmen, hast du eine Folge von Shifts, die sich wiederholt.
            </p>

            <div class="mb-3" v-html="katexBlock(String.raw`
              C_i \equiv P_i + K_i \pmod{26}
              \qquad\text{wobei } K_i \text{ zyklisch aus dem Schlüssel kommt.}
            `)"></div>

            <v-row>
              <v-col cols="12" md="6">
                <v-sheet rounded="lg" border class="pa-3">
                  <div class="text-subtitle-2 mb-2">Beispiel (klassisch mit Wortschlüssel)</div>
                  <div class="text-body-2 mb-2">
                    Klartext: <code>{{ vigWordExample.plain }}</code><br />
                    Schlüssel: <code>{{ vigWordExample.key }}</code> (wird wiederholt)
                  </div>

                  <v-table density="compact">
                    <thead>
                      <tr>
                        <th class="text-left">Pos</th>
                        <th class="text-left">P</th>
                        <th class="text-left">K</th>
                        <th class="text-left">C</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="r in vigWordExample.rows" :key="r.i">
                        <td><code>{{ r.i }}</code></td>
                        <td><code>{{ r.p }}</code></td>
                        <td><code>{{ r.k }}</code></td>
                        <td><code>{{ r.c }}</code></td>
                      </tr>
                    </tbody>
                  </v-table>

                  <div class="mt-3 text-body-2">
                    Ergebnis: <code>{{ vigWordExample.cipher }}</code>
                  </div>
                </v-sheet>
              </v-col>

              <v-col cols="12" md="6">
                <v-sheet rounded="lg" border class="pa-3">
                  <div class="text-subtitle-2 mb-2">Beispiel (Zahlenschlüssel wie „2,9,5“)</div>
                  <div class="text-body-2 mb-2">
                    Hier ist der Schlüssel direkt eine Zahlenfolge:
                    <code>{{ vigNumExample.key.join(",") }}</code> (wiederholt).
                  </div>

                  <v-table density="compact">
                    <thead>
                      <tr>
                        <th class="text-left">Pos</th>
                        <th class="text-left">P</th>
                        <th class="text-left">Shift</th>
                        <th class="text-left">C</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="r in vigNumExample.rows" :key="r.i">
                        <td><code>{{ r.i }}</code></td>
                        <td><code>{{ r.p }}</code></td>
                        <td><code>{{ r.shift }}</code></td>
                        <td><code>{{ r.c }}</code></td>
                      </tr>
                    </tbody>
                  </v-table>

                  <div class="mt-3 text-body-2">
                    Klartext: <code>{{ vigNumExample.plain }}</code><br />
                    Cipher: <code>{{ vigNumExample.cipher }}</code>
                  </div>
                </v-sheet>
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <v-row>
              <v-col cols="12" md="6">
                <v-sheet rounded="lg" border class="pa-3">
                  <div class="text-subtitle-2 mb-2">Warum Vigenère stärker ist</div>
                  <ul class="text-body-2 mb-0">
                    <li>Kein einzelner Shift → Häufigkeiten „verwischen“.</li>
                    <li>Die Sicherheit hängt stark von der <strong>Schlüssellänge</strong> ab.</li>
                    <li>Kurze Schlüssel sind knackbar (Kasiski/Friedman), lange sind deutlich zäher.</li>
                  </ul>
                </v-sheet>
              </v-col>
              <v-col cols="12" md="6">
                <v-sheet rounded="lg" border class="pa-3">
                  <div class="text-subtitle-2 mb-2">Eddie-Tipp fürs Denken</div>
                  <div class="text-body-2">
                    Stell dir vor, du hast mehrere Cäsar-Chiffren, die sich abwechseln.
                    Wenn du die Periodenlänge kennst, zerfällt das Problem wieder in mehrere kleine Cäsar-Aufgaben.
                  </div>
                  <div class="mt-2" v-html="katexBlock(String.raw`
                    \text{Wenn die Schlüssellänge } m \text{ bekannt ist, dann: }
                    \{i \equiv 0 \pmod m\},\{i \equiv 1 \pmod m\},\dots
                  `)"></div>
                </v-sheet>
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <v-expansion-panels variant="accordion">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  Mini-Übung: Verschlüssele <code>EDDIE</code> mit Schlüssel <code>KEY</code>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="text-body-2 mb-2">
                    Schlüssel wiederholen: KEYKE<br />
                    K=10, E=4, Y=24 (bei A=0). Dann positionweise addieren mod 26.
                  </div>
                  <div class="text-body-2">
                    Tipp: Mach es erstmal als Tabelle „P, K, C“ wie oben.
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>

        <!-- Abschluss -->
        <v-card rounded="lg" elevation="2">
          <v-card-title class="text-h6">Merksätze</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-sheet rounded="lg" class="pa-3" border>
                  <div class="text-subtitle-2 mb-2">Cäsar</div>
                  <ul class="text-body-2 mb-0">
                    <li>Ein Shift für alles.</li>
                    <li>Schnell zu knacken (25 Versuche oder Frequenzanalyse).</li>
                  </ul>
                </v-sheet>
              </v-col>
              <v-col cols="12" md="6">
                <v-sheet rounded="lg" class="pa-3" border>
                  <div class="text-subtitle-2 mb-2">Vigenère</div>
                  <ul class="text-body-2 mb-0">
                    <li>Shift-Folge (Schlüssel) wiederholt sich.</li>
                    <li>Schlüssellänge ist die Schwachstelle – kurze Schlüssel sind angreifbar.</li>
                  </ul>
                </v-sheet>
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <div class="text-body-2 text-medium-emphasis">
              Nächster Schritt (wenn du willst): Wir bauen daraus eine kleine interaktive Seite,
              die Cäsar und Vigenère live verschlüsselt/entschlüsselt – und später hängen wir dann
              die BASIC-Programme dran.
            </div>
          </v-card-text>
        </v-card>
		    
		</template>

	<template #interactivePart>
  		<BAEmulator
		          :key="emulatorKey"
		          :blink-cursor="true"
		          @hard-restart="handleHardRestart"
		/>
	</template>


	<template #footer>
     
	</template>
</AppFrame>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import BAEmulator from "./BA_Emulator.vue";
import titleImg from "@/images/BA.webp";
const emulatorKey = ref( 0 );

function handleHardRestart( payload ) {
	console.error( "BA_Emulator hard restart:", payload?.reason ?? payload );
	emulatorKey.value += 1;
}

import katex from "katex";

/** ===== KaTeX helper ===== */
function katexBlock(tex: string) {
  return katex.renderToString(tex, {
    displayMode: true,
    throwOnError: false,
    strict: "ignore",
  });
}

/** ===== Crypto helpers (A=0..Z=25) ===== */
const ALPH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function normAZ(s: string): string {
  // nur A-Z behalten
  return s.toUpperCase().replace(/[^A-Z]/g, "");
}
function ch2n(ch: string): number {
  return ALPH.indexOf(ch);
}
function n2ch(n: number): string {
  const x = ((n % 26) + 26) % 26;
  return ALPH[x];
}

function caesarEncrypt(plain: string, k: number) {
  const p = normAZ(plain);
  let cipher = "";
  const rows: Array<{ p: string; pn: number; cn: number; c: string }> = [];
  for (const ch of p) {
    const pn = ch2n(ch);
    const cn = (pn + k) % 26;
    const c = n2ch(cn);
    cipher += c;
    rows.push({ p: ch, pn, cn, c });
  }
  return { plain: p, k, cipher, rows };
}

function vigenereEncryptWord(plain: string, key: string) {
  const p = normAZ(plain);
  const k0 = normAZ(key);
  const keyRep = Array.from({ length: p.length }, (_, i) => k0[i % k0.length]);
  let cipher = "";
  const rows: Array<{ i: number; p: string; k: string; c: string }> = [];
  for (let i = 0; i < p.length; i++) {
    const pn = ch2n(p[i]);
    const kn = ch2n(keyRep[i]);
    const cn = (pn + kn) % 26;
    const c = n2ch(cn);
    cipher += c;
    rows.push({ i: i + 1, p: p[i], k: keyRep[i], c });
  }
  return { plain: p, key: k0, cipher, rows };
}

function vigenereEncryptNumbers(plain: string, shifts: number[]) {
  const p = normAZ(plain);
  let cipher = "";
  const rows: Array<{ i: number; p: string; shift: number; c: string }> = [];
  for (let i = 0; i < p.length; i++) {
    const pn = ch2n(p[i]);
    const sh = shifts[i % shifts.length];
    const cn = (pn + sh) % 26;
    const c = n2ch(cn);
    cipher += c;
    rows.push({ i: i + 1, p: p[i], shift: sh, c });
  }
  return { plain: p, key: shifts, cipher, rows };
}

/** ===== Examples ===== */
const caesarExample = computed(() => caesarEncrypt("EDDIE", 3));

// Klassisches Standardbeispiel (zeigt gut das Prinzip):
// ATTACKATDAWN + LEMON -> LXFOPVEFRNHR
const vigWordExample = computed(() => vigenereEncryptWord("ATTACK AT DAWN", "LEMON"));

// Zahlenfolge wie im Kapitel-Feeling (z.B. 2,9,5):
const vigNumExample = computed(() => vigenereEncryptNumbers("MAMA AND PAPA", [2, 9, 5]));
</script>

<style scoped>
code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace;
  font-size: 0.95em;
}
</style>