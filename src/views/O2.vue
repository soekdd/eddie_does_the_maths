<template>
<AppFrame
	:sub-chapter="{
		'entscheidungsbaum': 'Entscheidungsbaum',
		'wahrscheinlichkeiten': 'Wahrscheinlichkeiten',
		'rechner': 'Rechner'
	}"
	title="Eddie rechnet: IMO 1985 Aufgabe A2"
>

	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="`Eddie`">
				<img alt="Eddie rechnet" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>

		<h2>Teil 1 — Aufgabenstellung</h2>
		<div class="eddie">
			<p class="muted"><i>IMO 1985 – Aufgabe A2: „Am Ende hat alles eine Farbe“</i></p>

			<v-alert type="info" variant="tonal">
				<strong>Eddie:</strong> Das ist so eine Aufgabe, die erst „bunt“ aussieht – und dann merkst du:
				Die Regeln machen aus dem ganzen Set eine einzige riesige Farb-Familie. Einmal verbunden, immer verbunden.
			</v-alert>

			<p>
				Seien <Katex :tex="'n\\ \\text{und}\\ k'" /> teilerfremde positive ganze Zahlen mit <Katex :tex="'k&lt;n'" />.
				Die Menge <Katex :tex="'M=\\{1,2,3,\\dots,n-1\\}'" /> werde so gefärbt, dass jede Zahl entweder <em>blau</em>
				oder <em>weiß</em> ist.
			</p>

			<v-sheet class="pa-3 rounded">
				<div class="d-flex flex-column ga-2">
					<div>
						<strong>Regel (Spiegel):</strong> Für jedes <Katex :tex="'i\\in M'" /> haben <Katex :tex="'i'" /> und
						<Katex :tex="'n-i'" /> die <strong>gleiche</strong> Farbe.
					</div>
					<div>
						<strong>Regel (Abstand zu k):</strong> Für jedes <Katex :tex="'i\\in M'" /> mit <Katex :tex="'i\\neq k'" /> haben
						<Katex :tex="'i'" /> und <Katex :tex="'|i-k|'" /> die <strong>gleiche</strong> Farbe.
					</div>
				</div>
			</v-sheet>

			<p><strong>Zu zeigen:</strong> Alle Zahlen in <Katex :tex="'M'" /> müssen dieselbe Farbe haben.</p>
		</div>

		<h2 id="wahrscheinlichkeiten" class="mt-8">Teil 2 — Eddies Idee</h2>
		<div class="eddie">
			<p>
				Stell dir vor, du gehst nicht „1,2,3,…“ entlang, sondern du springst in Schritten von <Katex :tex="'k'" />
				(modulo <Katex :tex="'n'" />). Weil <Katex :tex="'\\gcd(n,k)=1'" /> gilt, triffst du dabei <em>alle</em> Zahlen
				<Katex :tex="'1\\ldots n-1'" /> genau einmal – in irgendeiner Reihenfolge.
			</p>
			<v-alert type="success" variant="tonal">
				<strong>Merksatz:</strong> Teilerfremd heißt hier: Die „k-Sprung“-Route besucht jeden Knoten. Wenn außerdem
				jeder Sprung die Farbe nicht ändern darf, dann ist am Ende alles gleichfarbig.
			</v-alert>
		</div>

		<h2 id="entscheidungsbaum" class="mt-8">Teil 3 — Beweis in drei Schritten</h2>
		<div class="eddie">
			<v-expansion-panels variant="accordion">
				<v-expansion-panel>
					<v-expansion-panel-title>
						Schritt 1 – Die Vielfachen von k bilden alle Reste modulo n
					</v-expansion-panel-title>
					<v-expansion-panel-text class="d-flex flex-column ga-3">
						<div>
							Aus <Katex :tex="'\\gcd(n,k)=1'" /> folgt:
							<Katex :tex="'0,\\ k,\\ 2k,\\dots,(n-1)k'" /> sind modulo <Katex :tex="'n'" /> alle verschieden.
						</div>
						<div>
							Also ist die Liste
							<Katex :tex="'k,\\ 2k,\\dots,(n-1)k'" />
							modulo <Katex :tex="'n'" /> einfach eine Umordnung von
							<Katex :tex="'1,2,\\dots,n-1'" />.
						</div>
						<v-sheet class="pa-3 rounded">
							<div class="text-subtitle-2 mb-2">Warum „alle verschieden“?</div>
							<div>
								Wenn <Katex :tex="'ak\\equiv bk\\pmod n'" />, dann <Katex :tex="'(a-b)k\\equiv 0\\pmod n'" />.
								Weil <Katex :tex="'k'" /> keinen gemeinsamen Teiler mit <Katex :tex="'n'" /> hat, muss
								<Katex :tex="'a-b\\equiv 0\\pmod n'" /> gelten – also <Katex :tex="'a\\equiv b\\pmod n'" />.
							</div>
						</v-sheet>
					</v-expansion-panel-text>
				</v-expansion-panel>

				<v-expansion-panel>
					<v-expansion-panel-title>
						Schritt 2 – Zwei aufeinanderfolgende „k-Sprünge“ haben dieselbe Farbe
					</v-expansion-panel-title>
					<v-expansion-panel-text class="d-flex flex-column ga-3">
						<div>
							Nimm zwei aufeinanderfolgende Sprungwerte:
							<Katex :tex="'r\\equiv ik\\pmod n'" /> und <Katex :tex="'s\\equiv (i+1)k\\pmod n'" />.
							Dann gilt stets <Katex :tex="'s\\equiv r+k\\pmod n'" />.
						</div>

						<v-sheet class="pa-3 rounded">
							<div class="text-subtitle-2 mb-2">Fallunterscheidung (genau wie im Original, nur mit Eddie-Lampe)</div>

							<div class="d-flex flex-column ga-2">
								<div>
									<strong>Fall A:</strong> <Katex :tex="'s=r+k'" /> (also kein Überlauf über <Katex :tex="'n'" />).<br />
									Dann ist <Katex :tex="'r=s-k=|s-k|'" />. Da <Katex :tex="'s\\neq k'" /> (sonst käme ein 0-Rest vor),
									erzwingt die Regel „Abstand zu k“: <Katex :tex="'s'" /> und <Katex :tex="'|s-k|=r'" /> sind gleichfarbig.
								</div>

								<div>
									<strong>Fall B:</strong> <Katex :tex="'s=r+k-n'" /> (Überlauf).<br />
									Dann ist <Katex :tex="'r=s+n-k=n-(k-s)'" />.
									Mit der Spiegel-Regel haben <Katex :tex="'n-(k-s)'" /> und <Katex :tex="'k-s'" /> dieselbe Farbe,
									also <Katex :tex="'r'" /> und <Katex :tex="'k-s'" />.
									Und mit der Abstand-Regel haben <Katex :tex="'s'" /> und <Katex :tex="'|s-k|=k-s'" /> dieselbe Farbe.
									Also ist <Katex :tex="'r'" /> gleichfarbig zu <Katex :tex="'s'" />.
								</div>
							</div>
						</v-sheet>

						<div>
							Ergebnis: Für jedes <Katex :tex="'i=1,2,\\dots,n-2'" /> haben die beiden aufeinanderfolgenden Reste
							<Katex :tex="'ik\\ (\\bmod n)'" /> und <Katex :tex="'(i+1)k\\ (\\bmod n)'" /> dieselbe Farbe.
						</div>
					</v-expansion-panel-text>
				</v-expansion-panel>

				<v-expansion-panel>
					<v-expansion-panel-title>
						Schritt 3 – Damit sind alle Zahlen in M gleichfarbig
					</v-expansion-panel-title>
					<v-expansion-panel-text class="d-flex flex-column ga-3">
						<div>
							Die Reste <Katex :tex="'k,2k,\\dots,(n-1)k\\ (\\bmod n)'" /> sind (bis auf Reihenfolge) genau
							<Katex :tex="'1,2,\\dots,n-1'" />.
						</div>
						<div>
							Weil in dieser Kette jede Nachbarzahl dieselbe Farbe hat, sind <em>alle</em> Glieder gleichfarbig.
							Und damit: <Katex :tex="'1,2,\\dots,n-1'" /> haben alle dieselbe Farbe.
						</div>
						<v-alert type="success" variant="tonal">
							<strong>Fertig.</strong> Keine Chance für „zwei Lager“ – die Regeln kleben alles zusammen.
						</v-alert>
					</v-expansion-panel-text>
				</v-expansion-panel>
			</v-expansion-panels>
		</div>
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
				<div class="d-flex flex-wrap ga-2">
					<v-chip v-for="(x, idx) in chain"
						:key="idx"
						size="small"
						variant="tonal"
					>
						{{ x }}
					</v-chip>
				</div>
			</v-sheet>

			<v-expansion-panels class="mt-2" variant="accordion">
				<v-expansion-panel>
					<v-expansion-panel-title>Warum haben Nachbarn in der Kette dieselbe Farbe? (Details)</v-expansion-panel-title>
					<v-expansion-panel-text class="d-flex flex-column ga-3">
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
import { computed, ref } from "vue";
import titleImg from "@/images/O2.webp";

/** --- Interaktivteil --- */
const n = ref( 10 );
const k = ref( 3 );
const error = ref( "" );
const result = ref( null );

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

// Initialer Check
runCheck();
</script>

<style scoped>
ol > li { margin: 0.35rem 0; }
</style>
