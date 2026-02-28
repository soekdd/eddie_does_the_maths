<template>
<AppFrame  :sub-chapter="{
		einleitung:'Einleitung',
		'entscheidungsbaum': 'Entscheidungsbaum',
		'wahrscheinlichkeiten': 'Wahrscheinlichkeiten',
		'rechner': 'Rechner'
	}"
	title="Eddie rechnet: IMO 1985 Aufgabe A2"
	:vue-date="__VITE_SFC_MTIME_MS__"
>

	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer title="Eddie denkt über die Aufgabe A2 der IMO 85 nach">
				<img loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">Joutsa, 4. Juli 1985</h3>
		<div class="eddie">
			<p>Ich höre das Kratzen von dreißig Bleistiften gleichzeitig und finde es plötzlich beruhigend. Das ist
				mein Element: Regeln lesen, Muster finden, fertig.</p><p>
				Hier geht’s nicht um Linien und Kreise, sondern um eine Reihe von Zahlen, die man in zwei Farben
				anstreicht. Klingt wie Kinderkram – aber die Aufgabe legt zwei fiese Regeln fest. Die erste sorgt
				dafür, dass Zahlen, die “spiegelbildlich” zueinander stehen, dieselbe Farbe haben müssen. Die zweite
				kettet noch mehr Zahlen zusammen: Sobald du eine Zahl anders färbst als eine ganz bestimmte
				Lieblingszahl, zwingt dich die Regel, andere mit ihr gleich zu färben.</p><p>
				Und dann kommt der eigentliche Punch: Du sollst zeigen, dass diese Regeln am Ende alles einfärben,
				ohne dass du noch Wahlfreiheit hast. Egal wie du anfängst – du landest bei “alle gleich”.</p><p>
				Hier zeige ich dir die einfache Logik dahinter, Schritt für Schritt, mit Formelkram.</p>
		</div>
	</template>

	<template #descriptionPart>
		<h2>Teil 1 — Aufgabenstellung</h2>
		<div class="eddie">
			<p class="muted"><i>IMO 1985 – Aufgabe A2: „Am Ende hat alles eine Farbe“</i></p>
			<p>
				Seien <Katex tex="n\ \text{und}\ k" /> teilerfremde positive ganze Zahlen mit <Katex tex="k<n" />.
				Die Menge
			</p>
			<div class="kbox">
				<Katex as="div" display tex="M=\{1,2,3,\dots,n-1\}" />
			</div>
			<p>werde so gefärbt, dass jede Zahl entweder <b>blau</b> oder <b>weiß</b> ist.</p>
			<p><b>Regel 1 (Spiegel):</b> Für jedes <Katex tex="i\in M" /> haben <Katex tex="i" /> und <Katex tex="n-i" /> dieselbe Farbe.</p>
			<p>
				<b>Regel 2 (Abstand zu <Katex tex="k" />):</b>
				Für jedes <Katex tex="i\in M" /> mit <Katex tex="i\neq k" />
				haben <Katex tex="i" /> und <Katex tex="|i-k|" /> dieselbe Farbe.
			</p>
			<p><b>Zu zeigen:</b> Alle Zahlen in <Katex tex="M" /> müssen dieselbe Farbe haben.</p>
		</div>

		<h2 id="wahrscheinlichkeiten" class="mt-8">Teil 2 — Idee (ein Rundgang, der alle besucht)</h2>
		<div class="eddie">
			<p>
				Stell dir die Zahlen <Katex tex="0,1,2,\dots,n-1" /> wie Punkte auf einer Uhr vor
				(Rechnen modulo <Katex tex="n" />):
			</p>
			<ul>
				<li>Nach <Katex tex="n-1" /> kommt wieder <Katex tex="0" />.</li>
				<li><Katex tex="x\bmod n" /> bedeutet: Wir schauen nur auf den Rest beim Teilen durch <Katex tex="n" />.</li>
			</ul>
			<p>Jetzt machen wir einen Rundgang in Sprüngen der Länge <Katex tex="k" />:</p>
			<div class="kbox">
				<Katex as="div" display tex="k,\;2k,\;3k,\;\dots,\;(n-1)k \quad (\bmod n)." />
			</div>
			<p>
				Warum ist das spannend? Weil <Katex tex="\gcd(n,k)=1" /> genau heißt, dass
				die Sprünge so günstig sind, dass man dabei alle Reste <Katex tex="1,2,\dots,n-1" />
				trifft (nur in anderer Reihenfolge).
			</p>
			<p>
				Und wenn wir zeigen, dass jede zwei aufeinanderfolgenden besuchten Zahlen dieselbe Farbe haben,
				dann haben am Ende alle dieselbe Farbe.
			</p>
		</div>

		<h2 id="entscheidungsbaum" class="mt-8">Teil 3 — Beweis in klaren Schritten</h2>
		<div class="eddie">
			<h3>Schritt 1 — Die <Katex tex="k" />-Sprünge treffen alle Zahlen <Katex tex="1,\dots,n-1" /></h3>
			<p>Behauptung: Die Reste</p>
			<div class="kbox">
				<Katex as="div" display tex="k,\;2k,\;3k,\;\dots,\;(n-1)k \quad (\bmod n)" />
			</div>
			<p>sind (bis auf Reihenfolge) genau die Zahlen <Katex tex="1,2,\dots,n-1" />.</p>
			<p><b>Begründung:</b> Angenommen, zwei Sprünge landen auf demselben Rest:</p>
			<div class="kbox">
				<Katex as="div" display tex="ak \equiv bk \pmod n." />
			</div>
			<p>Dann gilt</p>
			<div class="kbox">
				<Katex as="div" display tex="(a-b)k \equiv 0 \pmod n," />
			</div>
			<p>
				also teilt <Katex tex="n" /> das Produkt <Katex tex="(a-b)k" />.
				Weil <Katex tex="n" /> und <Katex tex="k" /> teilerfremd sind, folgt
			</p>
			<div class="kbox">
				<Katex as="div" display tex="a-b \equiv 0 \pmod n." />
			</div>
			<p>
				Für <Katex tex="0\le a,b\le n-1" /> bedeutet das <Katex tex="a=b" />.
				Also sind alle Reste verschieden — und damit eine Umordnung von <Katex tex="1,\dots,n-1" />.
			</p>

			<h3 class="mt-6">Schritt 2 — Zwei aufeinanderfolgende Sprünge haben dieselbe Farbe</h3>
			<p>
				Für <Katex tex="i=1,2,\dots,n-1" /> sei <Katex tex="r_i" /> der Rest von <Katex tex="ik" />
				modulo <Katex tex="n" />, als Zahl in <Katex tex="\{0,1,\dots,n-1\}" />.
				Aus Schritt 1 wissen wir:
				<Katex tex="r_1,\dots,r_{n-1}" /> sind genau <Katex tex="1,\dots,n-1" /> (kein <Katex tex="0" />).
			</p>
			<p>Vergleiche zwei Nachbarn <Katex tex="r_i" /> und <Katex tex="r_{i+1}" />. Weil</p>
			<div class="kbox">
				<Katex as="div" display tex="(i+1)k=ik+k" />
			</div>
			<p>gilt modulo <Katex tex="n" />:</p>
			<div class="kbox">
				<Katex as="div" display tex="r_{i+1}\equiv r_i+k \pmod n." />
			</div>
			<p>Das heißt: entweder kein Überlauf oder Überlauf.</p>

			<h4>Fall A: Kein Überlauf</h4>
			<p>Dann ist</p>
			<div class="kbox">
				<Katex as="div" display tex="r_{i+1}=r_i+k." />
			</div>
			<p>Also</p>
			<div class="kbox">
				<Katex as="div" display tex="r_i=r_{i+1}-k=|r_{i+1}-k|." />
			</div>
			<p>
				Da außerdem <Katex tex="r_{i+1}\neq k" /> gilt
				(denn aus <Katex tex="r_{i+1}=k" /> würde
				<Katex tex="(i+1)k\equiv k\pmod n" /> folgen, also
				<Katex tex="ik\equiv 0\pmod n" />. Dann teilt <Katex tex="n" /> das Produkt
				<Katex tex="ik" />. Wegen <Katex tex="\gcd(n,k)=1" /> muss daraus
				<Katex tex="n\mid i" /> folgen – das ist für <Katex tex="1\le i\le n-2" /> unmöglich.),
				dürfen wir Regel 2 anwenden:
				<Katex tex="r_{i+1}" /> und <Katex tex="|r_{i+1}-k|=r_i" /> haben dieselbe Farbe.
			</p>

			<h4>Fall B: Überlauf</h4>
			<p>Dann ist</p>
			<div class="kbox">
				<Katex as="div" display tex="r_{i+1}=r_i+k-n \quad\Rightarrow\quad r_i=r_{i+1}+n-k." />
			</div>
			<p>Setze</p>
			<div class="kbox">
				<Katex as="div" display tex="t:=k-r_{i+1}." />
			</div>
			<p>
				In diesem Fall ist <Katex tex="r_{i+1}<k" />, also <Katex tex="t>0" /> und
				<Katex tex="|r_{i+1}-k|=k-r_{i+1}=t" />.
			</p>
			<p>Jetzt kommen die Regeln:</p>
			<ul>
				<li>Aus Regel 1 folgt: <Katex tex="t" /> und <Katex tex="n-t" /> haben dieselbe Farbe.</li>
				<li>Aber <Katex tex="n-t=n-(k-r_{i+1})=r_{i+1}+n-k=r_i" />.</li>
			</ul>
			<p>Also hat <Katex tex="r_i" /> dieselbe Farbe wie <Katex tex="t" />.</p>
			<p>
				Und aus Regel 2 folgt (weil <Katex tex="r_{i+1}\neq k" />):
				<Katex tex="r_{i+1}" /> hat dieselbe Farbe wie <Katex tex="|r_{i+1}-k|=t" />.
			</p>
			<p>
				Damit sind sowohl <Katex tex="r_i" /> als auch <Katex tex="r_{i+1}" /> gleichfarbig zu <Katex tex="t" />,
				also auch zueinander gleichfarbig.
			</p>
			<p>
				<b>Zwischenergebnis:</b> Für alle <Katex tex="i=1,2,\dots,n-2" />
				haben <Katex tex="r_i" /> und <Katex tex="r_{i+1}" /> dieselbe Farbe.
			</p>

			<h3 class="mt-6">Schritt 3 — Dann sind alle Zahlen gleichfarbig</h3>
			<p>
				Die Folge <Katex tex="r_1,r_2,\dots,r_{n-1}" /> enthält (aus Schritt 1) jede Zahl aus
				<Katex tex="M=\{1,\dots,n-1\}" /> genau einmal.
			</p>
			<p>
				Aus Schritt 2 wissen wir: Jede Nachbarzahl hat dieselbe Farbe.
				Also hat die ganze Kette dieselbe Farbe — und damit haben alle Zahlen in <Katex tex="M" /> dieselbe Farbe.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\boxed{\text{Alle Zahlen in }M\text{ sind gleichfarbig.}}" />
			</div>
		</div>

		<EddieComment subtitle="Kurz gesagt">
			<ol>
				<li>Teilerfremd (<Katex tex="\gcd(n,k)=1" />) sorgt dafür, dass die <Katex tex="k" />-Sprünge alle Zahlen besuchen.</li>
				<li>Die beiden Regeln sorgen dafür, dass bei jedem Sprung die Farbe gleich bleibt (direkt oder über den Spiegel).</li>
				<li>Wenn alle auf einer Route miteinander verbunden sind, kann es am Ende nur eine Farbe geben.</li>
			</ol>
		</EddieComment>
	</template>

	<template #interactivePart>
		<h2 id="rechner">Spielplatz: Prüfe es für konkrete n und k</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p>
				Ich baue die „gleichfarbig“-Regeln als Graph: Kante bedeutet „muss gleiche Farbe haben“.
				Wenn der Graph zusammenhängend ist, erzwingt das eine einzige Farbe.
			</p>

			<div class="d-flex flex-wrap ga-3 align-center">
				<v-text-field
					v-model.number="n"
					hide-details="auto"
					label="n"
					min="2"
					step="1"
					style="max-width: 160px"
					type="number"
				/>
				<v-text-field
					v-model.number="k"
					hide-details="auto"
					label="k"
					:max="Math.max(1, n - 1)"
					:min="1"
					step="1"
					style="max-width: 160px"
					type="number"
				/>
				<v-btn color="primary" variant="flat" @click="runCheck">
					Prüfen
				</v-btn>
				<v-btn variant="tonal" @click="randomCoprime">
					Zufällig teilerfremd
				</v-btn>
			</div>

			<v-alert v-if="error" type="error" variant="tonal">
				{{ error }}
			</v-alert>

			<v-sheet v-if="result" class="pa-3 rounded">
				<div class="d-flex flex-column ga-2">
					<div>
						<strong>Check:</strong>
						<span>gcd(n,k) = {{ result.g }}</span>
						<span class="mx-2">•</span>
						<span>Komponenten = {{ result.components.length }}</span>
						<span class="mx-2">•</span>
						<span>
							Zusammenhängend? <strong>{{ result.components.length === 1 ? "ja" : "nein" }}</strong>
						</span>
					</div>

					<div v-if="result.components.length === 1">
						<v-alert class="mt-2" type="success" variant="tonal">
							Der Graph ist zusammenhängend ⇒ eine Farbe reicht nicht nur „wahrscheinlich“, sie ist <strong>erzwingbar</strong>.
						</v-alert>
					</div>
					<div v-else>
						<v-alert class="mt-2" type="warning" variant="tonal">
							Mehrere Komponenten ⇒ mit diesen Regeln <em>kann</em> man verschiedene Farben auf unterschiedliche Komponenten legen.
							(Das passiert typischerweise, wenn gcd(n,k) ≠ 1 ist.)
						</v-alert>
					</div>

					<div class="mt-2">
						<strong>Komponentengrößen:</strong>
						<span class="ml-2">{{ result.components.map(c => c.length).join(", ") }}</span>
					</div>
				</div>
			</v-sheet>
		</div>
	</template>

	<template #calculationPart>
		<h2>Die k-Sprung-Kette (mod n)</h2>
		<div class="eddie d-flex flex-column ga-2">
			<div class="text-body-2">
				Hier siehst du die Permutation <Katex :tex="'k,2k,\\dots,(n-1)k\\ (\\bmod n)'" />.
				Im Beweis zeigt man: Nachbarn in dieser Liste müssen dieselbe Farbe haben.
			</div>

			<v-sheet class="pa-3 rounded">
				<div class="text-subtitle-2 mb-2">Sprung-Reihenfolge</div>
				<div class="d-flex flex-wrap ga-2">
					<v-chip v-for="(x, idx) in chain"
						:key="idx"
						:color="idx < visitedStepCount ? 'primary' : undefined"
						size="small"
						:variant="idx < visitedStepCount ? 'flat' : 'tonal'"
					>
						{{ x }}
					</v-chip>
				</div>
			</v-sheet>

			<v-sheet class="pa-3 rounded">
				<div class="text-subtitle-2 mb-2">Sortierte Sicht (blau = bereits besucht)</div>
				<div class="d-flex flex-wrap ga-2">
					<v-chip v-for="x in sortedTargets"
						:key="`sorted-${x}`"
						:color="visitedTargetSet.has( x ) ? 'primary' : undefined"
						size="small"
						:variant="visitedTargetSet.has( x ) ? 'flat' : 'tonal'"
					>
						{{ x }}
					</v-chip>
				</div>
				<div class="d-flex flex-wrap align-center ga-2 mt-3">
					<v-btn
						:disabled="!chain.length"
						size="small"
						variant="flat"
						@click="startAnimation"
					>
						{{ visitedStepCount >= chain.length ? "Neu starten" : "Start" }}
					</v-btn>
					<!-- <v-btn
						:disabled="!isAnimating"
						size="small"
						variant="outlined"
						@click="pauseAnimation"
					>
						Pause
					</v-btn>
					<v-btn
						:disabled="isAnimating || !chain.length || visitedStepCount >= chain.length"
						size="small"
						variant="outlined"
						@click="stepAnimation"
					>
						Schritt
					</v-btn> -->
					<v-btn
						:disabled="!chain.length && visitedStepCount === 0"
						size="small"
						variant="tonal"
						@click="resetAnimation"
					>
						Zurücksetzen
					</v-btn>
					<span class="text-caption">
						{{ visitedStepCount }}/{{ chain.length }} Schritte
					</span>
					<span v-if="currentVisitedValue !== null" class="text-caption">
						aktuell: {{ currentVisitedValue }}
					</span>
					<!-- <span class="text-caption">
						besucht: {{ visitedTargetCount }}/{{ sortedTargets.length }}
					</span> -->
				</div>
			</v-sheet>

			<v-expansion-panels class="mt-2" variant="accordion">
				<v-expansion-panel>
					<v-expansion-panel-title>Warum haben Nachbarn in der Kette dieselbe Farbe? (Details)</v-expansion-panel-title>
					<v-expansion-panel-text class="d-flex flex-column ga-3" eager>
						<div class="text-body-2">
							Für jedes <Katex :tex="'i=1\\dots n-2'" /> vergleiche <Katex :tex="'r=ik\\bmod n'" /> und
							<Katex :tex="'s=(i+1)k\\bmod n'" />. Entweder ist <Katex :tex="'s=r+k'" /> oder <Katex :tex="'s=r+k-n'" />.
						</div>

						<v-sheet v-if="transitions.length" class="pa-3 rounded">
							<div class="text-subtitle-2 mb-2">Übergänge (i → i+1)</div>
							<div class="d-flex flex-column ga-2">
								<div
									v-for="t in transitions"
									:key="t.i"
									class="d-flex flex-wrap align-center ga-2"
								>
									<v-chip size="x-small">i={{ t.i }}</v-chip>
									<span><strong>{{ t.r }}</strong> → <strong>{{ t.s }}</strong></span>
									<v-chip size="x-small" variant="tonal">{{ t.caseLabel }}</v-chip>
									<span class="text-body-2">{{ t.explain }}</span>
								</div>
							</div>
						</v-sheet>
					</v-expansion-panel-text>
				</v-expansion-panel>
			</v-expansion-panels>
		</div>
	</template>

	<template #footer>
		<p class="muted">
			Quelle der Aufgabenstellung/Lösungsskizze:
			<a href="https://prase.cz/kalva/imo/isoln/isoln852.html">IMO 1985 A2 (ISL solutions, prase.cz)</a>
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import {
	computed, onBeforeUnmount, ref, watch
} from "vue";
import titleImg from "@/images/O2.webp";

/** --- Interaktivteil --- */
const n = ref( 10 );
const k = ref( 3 );
const error = ref( "" );
const result = ref( null );
const ANIMATION_STEP_MS = 500;
const canUseAnimationTimer = typeof window !== "undefined";
const visitedStepCount = ref( 0 );
const animationTimerId = ref( null );

const chain = computed( () => {
	const nn = Number( n.value );
	const kk = Number( k.value );

	if ( !Number.isInteger( nn ) || !Number.isInteger( kk ) || nn < 2 || kk < 1 || kk >= nn ) {
		return [];
	}

	const out = [];

	for ( let i = 1; i <= nn - 1; i++ ) {
		out.push( mod( i * kk, nn ) );
	}

	return out;
} );

const sortedTargets = computed( () => {
	const nn = Number( n.value );

	if ( !Number.isInteger( nn ) || nn < 2 ) {
		return [];
	}

	return Array.from( { length: nn - 1 }, ( _, idx ) => idx + 1 );
} );

const visitedTargetSet = computed( () => {
	const set = new Set();
	const limit = Math.min( visitedStepCount.value, chain.value.length );

	for ( let idx = 0; idx < limit; idx++ ) {
		const value = chain.value[ idx ];

		if ( Number.isInteger( value ) && value >= 1 ) {
			set.add( value );
		}
	}

	return set;
} );

const visitedTargetCount = computed( () => visitedTargetSet.value.size );
const currentVisitedValue = computed( () => {
	if ( visitedStepCount.value <= 0 || visitedStepCount.value > chain.value.length ) {
		return null;
	}

	return chain.value[ visitedStepCount.value - 1 ];
} );
const isAnimating = computed( () => animationTimerId.value !== null );

const transitions = computed( () => {
	const nn = Number( n.value );
	const kk = Number( k.value );

	if ( !Number.isInteger( nn ) || !Number.isInteger( kk ) || nn < 2 || kk < 1 || kk >= nn ) {
		return [];
	}

	const out = [];

	for ( let i = 1; i <= nn - 2; i++ ) {
		const r = mod( i * kk, nn );
		const s = mod( ( i + 1 ) * kk, nn );

		// s ≡ r + k (mod n)
		// Case A: s = r + k (no wrap) <=> r + k < n and equals s numerically
		// Case B: wrap: s = r + k - n
		const noWrap = r + kk < nn && s === r + kk;

		if ( noWrap ) {
			out.push( {
				i,
				r,
				s,
				caseLabel: "Fall A",
				explain:   "s = r + k ⇒ r = s − k = |s − k|, also zwingt die Abstand-Regel gleiche Farbe."
			} );
		} else {
			out.push( {
				i,
				r,
				s,
				caseLabel: "Fall B",
				explain:
          "Überlauf: s = r + k − n ⇒ r = n − (k − s). Spiegel-Regel: r ~ (k − s). Abstand-Regel: s ~ |s − k| = (k − s)."
			} );
		}
	}

	return out;
} );

function stopAnimation() {
	if ( !canUseAnimationTimer ) {
		return;
	}

	if ( animationTimerId.value !== null ) {
		window.clearInterval( animationTimerId.value );
		animationTimerId.value = null;
	}
}

function resetAnimation() {
	stopAnimation();
	visitedStepCount.value = 0;
}

function stepAnimation() {
	if ( !chain.value.length ) {
		return;
	}

	if ( visitedStepCount.value < chain.value.length ) {
		visitedStepCount.value += 1;
	}
}

function startAnimation() {
	if ( !chain.value.length ) {
		resetAnimation();
		return;
	}

	if ( visitedStepCount.value >= chain.value.length ) {
		visitedStepCount.value = 0;
	}

	if ( !canUseAnimationTimer ) {
		return;
	}

	stopAnimation();
	animationTimerId.value = window.setInterval( () => {
		if ( visitedStepCount.value < chain.value.length ) {
			visitedStepCount.value += 1;
			return;
		}

		stopAnimation();
	}, ANIMATION_STEP_MS );
}

function pauseAnimation() {
	stopAnimation();
}

function mod( a, m ) {
	const r = a % m;
	return r < 0 ? r + m : r;
}

function gcd( a, b ) {
	a = Math.abs( a );
	b = Math.abs( b );

	while ( b !== 0 ) {
		const t = a % b;
		a = b;
		b = t;
	}

	return a;
}

function buildGraph( nn, kk ) {
	// Knoten: 1..n-1
	const adj = Array.from( { length: nn }, () => [] ); // index 0 unused

	const addEdge = ( u, v ) => {
		if ( u === v ) {
			return;
		}

		adj[ u ].push( v );
		adj[ v ].push( u );
	};

	// Regel 1: i ~ n - i
	for ( let i = 1; i <= nn - 1; i++ ) {
		const j = nn - i;

		if ( j >= 1 && j <= nn - 1 ) {
			addEdge( i, j );
		}
	}

	// Regel 2: i ~ |i - k| für i != k
	for ( let i = 1; i <= nn - 1; i++ ) {
		if ( i === kk ) {
			continue;
		}

		const j = Math.abs( i - kk );

		if ( j >= 1 && j <= nn - 1 ) {
			addEdge( i, j );
		}
	}

	return adj;
}

function connectedComponents( adj, nn ) {
	const seen = Array( nn ).fill( false );
	const comps = [];

	for ( let start = 1; start <= nn - 1; start++ ) {
		if ( seen[ start ] ) {
			continue;
		}

		const q = [ start ];
		seen[ start ] = true;
		const comp = [ start ];

		for ( let qi = 0; qi < q.length; qi++ ) {
			const u = q[ qi ];

			for ( const v of adj[ u ] ) {
				if ( !seen[ v ] ) {
					seen[ v ] = true;
					q.push( v );
					comp.push( v );
				}
			}
		}

		comp.sort( ( a, b ) => a - b );
		comps.push( comp );
	}

	comps.sort( ( a, b ) => b.length - a.length );
	return comps;
}

function runCheck() {
	error.value = "";
	result.value = null;

	const nn = Number( n.value );
	const kk = Number( k.value );

	if ( !Number.isInteger( nn ) || !Number.isInteger( kk ) ) {
		error.value = "Bitte n und k als ganze Zahlen eingeben.";
		return;
	}

	if ( nn < 2 ) {
		error.value = "n muss mindestens 2 sein.";
		return;
	}

	if ( kk < 1 || kk >= nn ) {
		error.value = "Es muss gelten: 1 ≤ k < n.";
		return;
	}

	const g = gcd( nn, kk );
	const adj = buildGraph( nn, kk );
	const components = connectedComponents( adj, nn );

	result.value = { g, components };
}

function randomCoprime() {
	error.value = "";
	const nn = Math.max( 5, Math.min( 200, Math.floor( 5 + Math.random() * 46 ) ) ); // 5..50
	let kk = 1 + Math.floor( Math.random() * ( nn - 1 ) );

	while ( gcd( nn, kk ) !== 1 ) {
		kk = 1 + Math.floor( Math.random() * ( nn - 1 ) );
	}

	n.value = nn;
	k.value = kk;
	runCheck();
}

watch(
	chain,
	() => {
		resetAnimation();
		startAnimation();
	},
	{ immediate: true }
);

onBeforeUnmount( () => {
	stopAnimation();
} );

// Initialer Check
runCheck();
</script>

<style scoped>
ol > li { margin: 0.35rem 0; }
</style>
