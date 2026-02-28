<template>
<AppFrame
	:sub-chapter="{
		einleitung:'Einleitung',
		'aufgabenstellung': 'Aufgabenstellung',
		'kernidee': 'Kernidee',
		'beweisidee': 'Beweisidee',
		'einordnung': 'Einordnung'
	}"
	title="Eddie rechnet: IMO 1985 Aufgabe A3"
>

	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer title="Eddie denkt über die Aufgabe A3 der IMO 85 nach">
				<img loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">Joutsa, 4. Juli 1985</h3>
		<div class="eddie">
			<p>Ich grinse, als ich das Wort “Polynom” sehe. Das ist wie ein alter Bekannter.
				Ich fühle mich wach, schnell, fast übermütig – als könnte ich mit einem Blick erkennen, wo der
				Trick liegt.</p><p>
				Die Aufgabe ist eigentlich eine Frage nach “gerade oder ungerade”, aber versteckt in einer ganzen
				Familie von Ausdrücken. Stell dir vor, du hast Rechenausdrücke, die aus vielen Zahlen bestehen,
				die an verschiedene “Stellen” gehören. Manche dieser Zahlen sind gerade, manche ungerade. Jetzt
				nimmst du ein paar ganz besondere Ausdrücke, die alle nach dem gleichen Bauplan entstehen (so wie
				beim Aufklappen von Klammern), und addierst sie.</p><p>
				Was soll passieren? Du sollst beweisen, dass beim Addieren etwas nicht “weggezaubert” werden kann:
				Die Anzahl der ungeraden Zahlen in dieser Liste wird nicht kleiner, als sie am Anfang schon war.</p><p>
				Hier übersetze ich das in Bilder im Kopf: Muster, Schichten, und warum sich “ungerade” nicht so
				leicht verstecken lässt.</p>
		</div>
	</template>

	<template #descriptionPart>
		<h2 id="aufgabenstellung">Teil 1 — Aufgabenstellung</h2>
		<div class="eddie">
			<p>
				Für ein Polynom <Katex tex="P(x)=a_0+a_1x+\dots+a_kx^k" /> mit ganzzahligen Koeffizienten
				bezeichne <Katex tex="o(P)" /> die Anzahl der <b>ungeraden</b> Koeffizienten.
				Für <Katex tex="i=0,1,2,\dots" /> sei <Katex tex="Q_i(x)=(1+x)^i" />.
			</p>
			<p>
				Zu zeigen ist: Für ganze Zahlen <Katex tex="0\le i_1 < i_2 < \dots < i_n" /> gilt
			</p>
			<div class="kbox">
				<Katex
					as="div"
					display
					tex="o\!\left(Q_{i_1}+Q_{i_2}+\dots+Q_{i_n}\right)\ge o\!\left(Q_{i_1}\right)."
				/>
			</div>
			<p>
				In Worten: Wenn wir mehrere dieser Polynome addieren, hat die Summe mindestens so viele
				ungerade Koeffizienten wie schon der erste Summand <Katex tex="Q_{i_1}" /> allein.
			</p>
		</div>

		<h2 id="kernidee" class="mt-8">Teil 2 — Kernidee (nur „ungerade/gerade“ zählt)</h2>
		<div class="eddie">
			<p>
				Wir interessieren uns <b>nur</b> dafür, ob ein Koeffizient ungerade oder gerade ist.
				Dafür reicht es, alles modulo 2 zu betrachten.
			</p>
			<ul>
				<li>ungerade <Katex tex="\equiv 1 \pmod 2" /></li>
				<li>gerade <Katex tex="\equiv 0 \pmod 2" /></li>
			</ul>
			<p>
				Beim Addieren gilt modulo 2:
				<Katex tex="1+1\equiv 0" />, <Katex tex="1+0\equiv 1" />.
				Das ist ein „entweder-oder“: Der Koeffizient der Summe ist genau dann ungerade,
				wenn genau einer der beiden Koeffizienten ungerade ist.
			</p>
			<section>
				<figure class="exampleFigure">
					<ImageZoomer title="Sierpinski-Muster aus dem Pascalschen Dreieck modulo 2">
						<O3_Graph
							:cell-size="8.5"
							:padding="8"
							:rows="64"
							:show-legend="false"
						/>
					</ImageZoomer>
				</figure>

				<h3>Ein Bild, das man kennen darf: Pascalsches Dreieck modulo 2</h3>
				<p>Die Binomialkoeffizienten erfüllen:</p>
				<div class="kbox">
					<Katex as="div" display tex="\binom{i}{r}=\binom{i-1}{r-1}+\binom{i-1}{r}." />
				</div>
				<p>
					Modulo 2 heißt das: Ein Eintrag ist ungerade genau dann, wenn die beiden darüber
					verschiedene Parität haben. So entsteht ein auffälliges dreieckiges Muster
					(man sieht es gut, wenn man das Pascalsche Dreieck nur nach ungerade/gerade färbt).
				</p>

				<h3>Zwei Rechenregeln für <Katex tex="(1+x)^i \pmod 2" /></h3>
				<p><b>Lemma 1 (Verdoppeln):</b></p>
				<div class="kbox">
					<Katex as="div" display tex="(1+x)^{2t}\equiv (1+x^2)^t \pmod 2." />
				</div>
				<p>
					Warum? <Katex tex="(1+x)^{2t}=\bigl((1+x)^2\bigr)^t" /> und
					<Katex tex="(1+x)^2=1+2x+x^2\equiv 1+x^2\pmod 2" />.
				</p>

				<p><b>Lemma 2 (Verdoppeln + 1):</b></p>
				<div class="kbox">
					<Katex
						as="div"
						display
						tex="(1+x)^{2t+1}=(1+x)\,(1+x)^{2t}\equiv (1+x)\,(1+x^2)^t\pmod 2."
					/>
				</div>
			</section>
			<h3>Damit kann man <Katex tex="o(Q_i)" /> ohne Spezialwissen bestimmen</h3>
			<p>
				Schreibe <Katex tex="i" /> in Binärdarstellung und sei <Katex tex="s_2(i)" />
				die Anzahl der Einsen. Dann gilt:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="o(Q_i)=2^{\,s_2(i)}." />
			</div>
			<ul>
				<li>
					Aus Lemma 1 folgt <Katex tex="o(Q_{2t})=o(Q_t)" />:
					Bei <Katex tex="(1+x^2)^t" /> bleiben nur Lücken in den Exponenten,
					die Anzahl ungerader Koeffizienten bleibt gleich.
				</li>
				<li>
					Aus Lemma 2 folgt <Katex tex="o(Q_{2t+1})=2\,o(Q_t)" />:
					Multiplikation mit <Katex tex="(1+x)" /> kopiert jeden ungeraden Koeffizienten
					einmal nach links und einmal nach rechts; hier überlappen sich die Kopien nicht,
					weil <Katex tex="(1+x^2)^t" /> nur gerade Exponenten hat und
					<Katex tex="x\,(1+x^2)^t" /> nur ungerade Exponenten.
				</li>
			</ul>
			<p>
				Liest man <Katex tex="i" /> binär von links nach rechts, bedeutet jede 0: Anzahl bleibt,
				jede 1: Anzahl verdoppelt sich. Also wird genau <Katex tex="s_2(i)" />-mal verdoppelt.
			</p>
		</div>

		<h2 id="beweisidee" class="mt-8">Teil 3 — Beweisidee (Induktion mit einem „2er-Fenster“)</h2>
		<div class="eddie">
			<p>
				Wir beweisen die Aussage per Induktion über den größten Exponenten <Katex tex="i_n" />.
			</p>

			<h3>Schritt 1 — Spezialfall: <Katex tex="m" /> ist eine Zweierpotenz</h3>
			<p>
				Sei <Katex tex="m=2^t" />. Dann gilt modulo 2:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="(1+x)^m \equiv 1+x^m \pmod 2." />
			</div>
			<p>
				Wenn <Katex tex="A(x)" /> nur Potenzen <Katex tex="x^0,\dots,x^{m-1}" /> enthält
				(also <Katex tex="\deg A < m" />), dann:
			</p>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					:tex="texStep1Block"
				/>
			</div>
			<p>
				Grund: <Katex tex="A" /> und <Katex tex="x^mA" /> liegen in verschiedenen Exponentenbereichen
				und können sich nicht gegenseitig auslöschen.
			</p>

			<h3>Schritt 2 — Induktionsschritt: wähle ein Fenster <Katex tex="[m,2m)" /></h3>
			<p>
				Wähle eine Zweierpotenz <Katex tex="m" /> mit <Katex tex="m\le i_n < 2m" />
				(z.B. die größte Zweierpotenz, die nicht größer als <Katex tex="i_n" /> ist).
				Dann liegen alle Exponenten entweder unter <Katex tex="m" /> oder in
				<Katex tex="[m,2m)" />.
			</p>

			<h3>Fall A — <Katex tex="i_1\ge m" /></h3>
			<p>
				Setze <Katex tex="A(x):=\sum_{j=1}^n Q_{i_j-m}(x)" />.
				Dann ist <Katex tex="\deg A<m" /> und
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\sum_{j=1}^n Q_{i_j}(x)=(1+x)^mA(x)." />
			</div>
			<p>Damit folgt:</p>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					:tex="texFallABlock"
				/>
			</div>
			<p>
				Also reduziert sich alles auf <Katex tex="o(A)\ge o(Q_{i_1-m})" />,
				wieder mit dem Faktor 2 aus zwei nicht überlappenden Exponentenbereichen,
				und das ist die Induktionsannahme.
			</p>

			<h3>Fall B — <Katex tex="i_1<m" /></h3>
			<p>
				Splitte:
				<Katex as="div" display tex="A(x):=\sum_{i_j<m}Q_{i_j}(x),\qquad B(x):=\sum_{i_j\ge m}Q_{i_j-m}(x)." />
			</p>
			<p>Dann:</p>
			<div class="kbox">
				<Katex as="div" display tex="\sum_{j=1}^n Q_{i_j}(x)=A(x)+(1+x)^mB(x)." />
			</div>
			<p>
				Mit <Katex tex="(1+x)^m\equiv 1+x^m\pmod 2" /> gilt:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="A+(1+x)^mB\equiv A+(1+x^m)B=(A+B)+x^mB." />
			</div>
			<p>Damit kann man direkt zählen:</p>
			<div class="kbox">
				<Katex as="div" display tex="o\bigl(A+(1+x)^mB\bigr)=o(A+B)+o(B)." />
			</div>
			<p>
				Außerdem gilt <Katex tex="o(A+B)+o(B)\ge o(A)" />:
				Betrachte einen Exponenten <Katex tex="r<m" /> mit Koeffizienten <Katex tex="a_r" />
				in <Katex tex="A" /> und <Katex tex="b_r" /> in <Katex tex="B" />.
				Modulo 2 gilt <Katex tex="a_r \equiv (a_r+b_r)+b_r" />.
				Ist <Katex tex="a_r" /> ungerade, dann ist mindestens einer der beiden Koeffizienten
				in <Katex tex="A+B" /> oder <Katex tex="B" /> ungerade; daher deckt
				<Katex tex="o(A+B)+o(B)" /> alle ungeraden Koeffizienten von <Katex tex="A" /> ab.
				Damit:
			</p>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					:tex="texFallBBlock"
				/>
			</div>
			<p>Also insgesamt:</p>
			<div class="kbox">
				<Katex as="div" display tex="o\!\left(\sum_{j=1}^n Q_{i_j}\right)\ge o(Q_{i_1})." />
			</div>
		</div>

		<h2 id="einordnung" class="mt-8">Teil 4 — Was wurde „schwer“ gemacht und was nicht?</h2>
		<div class="eddie">
			<p>
				Die Schwierigkeit steckt hier nicht in einem Spezialtheorem, sondern in zwei gut erklärbaren Ideen:
			</p>
			<ol>
				<li>Modulo 2 denken (ungerade/gerade statt Zahlenwerte).</li>
				<li>
					Zweierpotenzen als Trennlinie:
					<Katex tex="(1+x)^{2^t}\equiv 1+x^{2^t}\pmod 2" />
					erzeugt eine saubere Zerlegung in zwei nicht überlappende Blöcke.
				</li>
			</ol>
			<p>Alles andere sind Induktion und direkte Paritäts-Logik.</p>
		</div>
	</template>

	<template #interactivePart>
		<h2>Spielplatz: Odd-Koeffizienten zählen</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p>
				Gib Exponenten ein (aufsteigend). Der Rechner bestimmt
				<Katex tex="o(Q_{i_1})" /> und
				<Katex tex="o(Q_{i_1}+\dots+Q_{i_n})" /> und prüft die Ungleichung.
			</p>

			<div class="d-flex flex-wrap ga-3 align-center">
				<v-text-field
					v-model="inputExponents"
					hide-details="auto"
					label="Exponenten i1, i2, ..., in"
					style="max-width: 420px"
				/>
				<v-btn color="primary" variant="flat" @click="runCheck">
					Prüfen
				</v-btn>
				<v-btn variant="tonal" @click="randomExample">
					Zufallsbeispiel
				</v-btn>
			</div>

			<p class="muted">
				Eingabeformat: ganze Zahlen zwischen <code>0</code> und <code>256</code>, z.B.
				<code>1, 3, 4, 7</code>. Duplikate und unsortierte Eingaben werden automatisch bereinigt.
			</p>

			<v-alert v-if="error" type="error" variant="tonal">
				{{ error }}
			</v-alert>

			<v-alert
				v-if="result"
				:type="result.holds ? 'success' : 'warning'"
				variant="tonal"
			>
				<div class="d-flex flex-column ga-1">
					<div>
						<Katex :tex="`o(Q_{${result.i1}})=${result.oddFirst}`" />,
						<Katex :tex="`o(Q_{${result.exponents[0]}}+\\cdots+Q_{${
							result.exponents[result.exponents.length - 1]}})=${result.oddSum}`"
						/>.
					</div>
					<div>
						Ergebnis: <b>{{ result.holds ? "Ungleichung erfüllt" : "Ungleichung verletzt" }}</b>.
					</div>
				</div>
			</v-alert>

			<v-sheet v-if="result" class="pa-3 rounded">
				<div class="d-flex flex-column ga-2">
					<div>
						<strong>Exponenten:</strong>
						<span class="ml-2">{{ result.exponents.join(", ") }}</span>
					</div>
					<div v-if="result.notes.length" class="muted">
						{{ result.notes.join(" · ") }}
					</div>
					<div>
						<strong>2er-Fenster:</strong>
						<Katex :tex="`m=${result.proof.m}`" />
						mit
						<Katex :tex="`${result.proof.m}\\le i_n=${result.maxI}<${2 * result.proof.m}`" />
					</div>
				</div>
			</v-sheet>
		</div>
	</template>

	<template #calculationPart>
		<h2>Paritätstabellen & Beweisspur</h2>
		<div class="eddie d-flex flex-column ga-3">
			<v-sheet v-if="result" class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">Paritätsdaten pro Summand</div>
				<v-table density="compact">
					<thead>
						<tr>
							<th>Summand</th>
							<th>Binär</th>
							<th class="text-right">o(Qi)</th>
							<th>Ungerade Grade r in Qi</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="row in result.rows" :key="row.i">
							<td><code>Q{{ row.i }}</code></td>
							<td><code>{{ row.binary }}</code></td>
							<td class="text-right mono">{{ row.oddCount }}</td>
							<td class="mono">{{ formatDegrees(row.oddDegrees) }}</td>
						</tr>
					</tbody>
				</v-table>
			</v-sheet>

			<v-sheet v-if="result" class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">Ungerade Grade in der Gesamtsumme</div>
				<div class="mono">
					{{ result.oddDegreesSum.length ? formatDegrees(result.oddDegreesSum, 32) : "(keine)" }}
				</div>
			</v-sheet>

			<v-sheet v-if="result" class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">Beweisspur für dieses Beispiel</div>
				<div v-if="result.proof.caseName === 'trivial'" class="mono">
					Trivialfall: <code>i_n = 0</code>, also nur <code>Q_0 = 1</code>.
				</div>
				<div v-else-if="result.proof.caseName === 'A'" class="d-flex flex-column ga-2">
					<div>
						Fall <Katex tex="i_1\ge m" />.
						Reduzierte Exponenten <Katex tex="i_j-m" />:
						<code>{{ result.proof.reduced.join(", ") }}</code>
					</div>
					<div class="mono">
						o(A) = {{ result.proof.oddReduced }} ⇒ o((1+x)^mA) = 2·o(A) = {{ 2 * result.proof.oddReduced }}.
					</div>
				</div>
				<div v-else class="d-flex flex-column ga-2">
					<div>
						Fall <Katex tex="i_1 < m" /> mit Split bei <code>r={{ result.proof.r }}</code>:
						A-Exponenten <code>{{ result.proof.A.join(", ") }}</code>,
						B-Exponenten (reduziert) <code>{{ result.proof.B.join(", ") }}</code>.
					</div>
					<div class="mono">
						o(A+B) + o(B) = {{ result.proof.oAplusB }} + {{ result.proof.oB }} =
						{{ result.proof.oAplusB + result.proof.oB }} ≥ o(A) = {{ result.proof.oA }}.
					</div>
				</div>
			</v-sheet>
		</div>
	</template>

	<template #footer>
		<p class="muted">
			Quelle der Aufgabenstellung/Lösungsskizze:
			<a href="https://prase.cz/kalva/imo/isoln/isoln853.html">IMO 1985 A3 (ISL solutions, prase.cz)</a>
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import { ref } from "vue";
import titleImg from "@/images/O3.webp";
import O3_Graph from "./O3_Graph.vue";

const inputExponents = ref( "1, 3, 4, 7" );
const error = ref( "" );
const result = ref( null );
const texStep1Block = "(1+x)^mA&\\equiv (1+x^m)A=A+x^mA\\\\" +
	"o\\bigl((1+x)^mA\\bigr)&=2\\,o(A).";
const texFallABlock = "o\\!\\left(\\sum_{j=1}^n Q_{i_j}\\right)&=o\\bigl((1+x)^mA\\bigr)=2\\,o(A)\\\\" +
	"o(Q_{i_1})&=o\\bigl((1+x)^mQ_{i_1-m}\\bigr)=2\\,o(Q_{i_1-m}).";
const texFallBBlock = "o\\!\\left(\\sum_{j=1}^n Q_{i_j}\\right)&=o(A+B)+o(B)\\ge o(A)\\\\" +
	"o(A)&\\ge o(Q_{i_1})\\quad\\text{(Induktionsannahme auf }A\\text{)}.";

function popcount( n ) {
	let x = n;
	let c = 0;

	while ( x > 0 ) {
		c += x & 1;
		x >>= 1;
	}

	return c;
}

function highestPowerOf2LE( n ) {
	if ( n <= 0 ) {
		return 1;
	}

	let m = 1;

	while ( m * 2 <= n ) {
		m *= 2;
	}

	return m;
}

function lucasOdd( i, r ) {
	return ( r & i ) === r;
}

function oddDegreesOfQ( i ) {
	const out = [];

	for ( let r = 0; r <= i; r++ ) {
		if ( lucasOdd( i, r ) ) {
			out.push( r );
		}
	}

	return out;
}

function buildParityStats( exponents ) {
	const maxI = exponents.length ? exponents[ exponents.length - 1 ] : 0;
	const parity = Array( maxI + 1 ).fill( 0 );
	const rows = [];

	for ( const i of exponents ) {
		const oddDegrees = oddDegreesOfQ( i );

		for ( const r of oddDegrees ) {
			parity[ r ] ^= 1;
		}

		rows.push( {
			i,
			binary:   i.toString( 2 ),
			oddDegrees,
			oddCount: 2 ** popcount( i )
		} );
	}

	const oddDegreesSum = [];

	for ( let r = 0; r < parity.length; r++ ) {
		if ( parity[ r ] === 1 ) {
			oddDegreesSum.push( r );
		}
	}

	return {
		maxI,
		parity,
		rows,
		oddDegreesSum,
		oddSum: oddDegreesSum.length
	};
}

function xorOddCount( parityA, parityB ) {
	const len = Math.max( parityA.length, parityB.length );
	let count = 0;

	for ( let i = 0; i < len; i++ ) {
		const a = i < parityA.length ? parityA[ i ] : 0;
		const b = i < parityB.length ? parityB[ i ] : 0;

		if ( ( a ^ b ) === 1 ) {
			count++;
		}
	}

	return count;
}

function parseExponents( raw ) {
	const tokens = String( raw ?? "" )
		.split( /[\s,;]+/ )
		.map( ( x ) => x.trim() )
		.filter( Boolean );

	if ( !tokens.length ) {
		throw new Error( "Bitte mindestens einen Exponenten eingeben." );
	}

	const values = [];

	for ( const t of tokens ) {
		if ( !/^\d+$/.test( t ) ) {
			throw new Error( `Ungültiger Exponent: ${t}` );
		}

		const v = Number( t );

		if ( !Number.isInteger( v ) ) {
			throw new Error( `Ungültiger Exponent: ${t}` );
		}

		if ( v < 0 || v > 256 ) {
			throw new Error( `Exponent ${v} ist außerhalb des Bereichs 0..256.` );
		}

		values.push( v );
	}

	const notes = [];
	const sorted = [ ...values ].sort( ( a, b ) => a - b );

	if ( sorted.some( ( v, idx ) => v !== values[ idx ] ) ) {
		notes.push( "Eingabe wurde aufsteigend sortiert." );
	}

	const unique = [];

	for ( const v of sorted ) {
		if ( !unique.length || unique[ unique.length - 1 ] !== v ) {
			unique.push( v );
		}
	}

	if ( unique.length !== sorted.length ) {
		notes.push( "Doppelte Exponenten wurden entfernt." );
	}

	return { exponents: unique, notes };
}

function buildProofTrace( exponents ) {
	const maxI = exponents[ exponents.length - 1 ];

	if ( maxI === 0 ) {
		return { caseName: "trivial", m: 1 };
	}

	const m = highestPowerOf2LE( maxI );
	const i1 = exponents[ 0 ];

	if ( i1 >= m ) {
		const reduced = exponents.map( ( x ) => x - m );
		const reducedStats = buildParityStats( reduced );
		return {
			caseName:   "A",
			m,
			reduced,
			oddReduced: reducedStats.oddSum
		};
	}

	let r = -1;

	for ( let idx = 0; idx < exponents.length; idx++ ) {
		if ( exponents[ idx ] < m ) {
			r = idx;
		}
	}

	const A = exponents.slice( 0, r + 1 );
	const B = exponents.slice( r + 1 ).map( ( x ) => x - m );

	const statsA = buildParityStats( A );
	const statsB = buildParityStats( B );

	return {
		caseName: "B",
		m,
		r,
		A,
		B,
		oA:       statsA.oddSum,
		oB:       statsB.oddSum,
		oAplusB:  xorOddCount( statsA.parity, statsB.parity )
	};
}

function formatDegrees( arr, limit = 20 ) {
	if ( !arr || !arr.length ) {
		return "(keine)";
	}

	if ( arr.length <= limit ) {
		return arr.join( ", " );
	}

	const head = arr.slice( 0, limit ).join( ", " );
	return `${head}, ... (insgesamt ${arr.length})`;
}

function runCheck() {
	error.value = "";
	result.value = null;

	try {
		const { exponents, notes } = parseExponents( inputExponents.value );
		const stats = buildParityStats( exponents );
		const proof = buildProofTrace( exponents );

		result.value = {
			notes,
			exponents,
			i1:            exponents[ 0 ],
			maxI:          stats.maxI,
			rows:          stats.rows,
			oddDegreesSum: stats.oddDegreesSum,
			oddFirst:      stats.rows[ 0 ].oddCount,
			oddSum:        stats.oddSum,
			holds:         stats.oddSum >= stats.rows[ 0 ].oddCount,
			proof
		};
	} catch ( e ) {
		error.value = e?.message ? String( e.message ) : String( e );
	}
}

function randomExample() {
	const size = 2 + Math.floor( Math.random() * 4 ); // 2..5
	const set = new Set();

	while ( set.size < size ) {
		set.add( Math.floor( Math.random() * 21 ) ); // 0..20
	}

	const exponents = Array.from( set ).sort( ( a, b ) => a - b );
	inputExponents.value = exponents.join( ", " );
	runCheck();
}

runCheck();
</script>

<style scoped>
ol > li { margin: 0.35rem 0; }
</style>
