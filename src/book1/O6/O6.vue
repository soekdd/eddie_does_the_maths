<template>
<AppFrame  :sub-chapter="{
		einleitung:'Einleitung',
		rekursion: 'Rekursion',
		monotonie: 'Monotonie',
		'existenz-eindeutigkeit': 'Existenz & Eindeutigkeit'
	}"
	title="Eddie rechnet: IMO 1985 Aufgabe B3"
	:vue-date="__VITE_SFC_MTIME_MS__"
>

	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer title="Eddie denkt über die Aufgabe B3 der IMO 85 nach">
				<img loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">Joutsa, 5. Juli 1985</h3>
		<div class="eddie">
			<p>Joutsa, zweiter Wettkampftag. Mir ist, als hätte jemand Watte in meinen Kopf gestopft. Ich
				lese den Text zweimal und merke: Ich verstehe ihn und gleichzeitig rutsche ich weg. Als
				würde mein Gehirn auf einem nassen Bootssteg stehen.</p><p>
				Hier geht es um eine Zahlenfolge. Du startest mit einer Zahl, und dann erzeugst du die
				nächste aus der vorherigen, immer nach derselben Vorschrift. Wie ein Automat: du fütterst
				ihn mit dem aktuellen Wert und bekommst den nächsten ausgespuckt.</p><p>
				Das Gemeine ist: Je nachdem, womit du startest, benimmt sich diese Folge komplett anders.
				Sie kann zu groß werden, sie kann falsch abbiegen, sie kann aus dem “sicheren Bereich”
				rausfallen. Und die Aufgabe behauptet: Es gibt genau <strong>einen</strong> einzigen Startwert, d
				er alles richtig macht. Dann bleibt die Folge immer zwischen null und eins und sie wächst
				trotzdem Schritt für Schritt.<br data-end="6012" data-start="6009">
				Das ist eigentlich wunderschön: eine einzige perfekte Startzahl, die genau die Balance trifft.
				Aber ausgerechnet heute denke ich bei “einziger Startwert” nicht an Schönheit, sondern an
				Risiko. An <em >nur eine Chance</em>.</p><p>
				Hier erkläre ich das ganz schlicht: Warum fast alle Starts scheitern und warum genau
				einer durchrutscht. Hoffe ich, dass auch ich heute durchkomme.</p>
		</div>
	</template>

	<template #descriptionPart>

		<h2 id="rekursion">Teil 1 — Aufgabenstellung</h2>
		<div class="eddie">
			<p>
				Für jede reelle Startzahl <Katex tex="x_1" /> wird eine Folge durch
			</p>
			<div class="kbox">
				<Katex as="div" display tex="x_{n+1}=x_n\left(x_n+\frac{1}{n}\right),\quad n=1,2,3,\dots" />
			</div>
			<p>
				definiert. Zu zeigen ist: Es gibt <b>genau einen</b> Startwert <Katex tex="x_1" />, für den
			</p>
			<div class="kbox">
				<Katex as="div" display tex="0<x_n<x_{n+1}<1\quad\text{für alle }n" />
			</div>
			<p>
				In Worten bedeutet das:
				Jedes Folgenglied ist positiv, bleibt kleiner als 1 und ist immer größer als das vorherige.
				Die Folge wächst also, aber sie darf nie die 1 erreichen oder überschreiten.
			</p>
			<p>
				Man kann sich die Vorschrift wie einen kleinen Rechner vorstellen:
				Du gibst den aktuellen Wert <Katex tex="x_n" /> hinein und bekommst den nächsten Wert
				<Katex tex="x_{n+1}" /> heraus.
				Die Aufgabe fragt dabei nicht nur nach irgendeinem passenden Startwert,
				sondern nach genau einem einzigen.
			</p>
		</div>

		<h2 id="monotonie" class="mt-8">Teil 2 — Umformulierung mit Hilfsfunktionen</h2>
		<div class="eddie">
			<p>
				Für den Beweis führen wir zuerst Hilfsfunktionen (Iterationsfunktionen) ein:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="f_n(t):=t\left(t+\frac{1}{n}\right),\qquad n\ge1." />
			</div>
			<div class="kbox">
				<Katex as="div" display tex="T_1(x):=x,\qquad T_{n+1}(x):=f_n\!\left(T_n(x)\right)." />
			</div>
			<p>
				Damit gilt bei Startwert <Katex tex="x_1=x" /> stets <Katex tex="x_n=T_n(x)" />.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="f_n'(t)=2t+\frac1n>0\quad\text{für }t\in[0,1]." />
			</div>
			<p>
				Damit ist jede Funktion <Katex tex="f_n" /> auf <Katex tex="[0,1]" /> stetig und streng wachsend.
				Als Komposition solcher Funktionen ist auch jede Funktion <Katex tex="T_n" /> stetig und streng wachsend.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="T_n(0)=0,\qquad T_1(1)=1,\qquad T_n(1)>1\ \text{für }n\ge2." />
			</div>
		</div>

		<h2 id="existenz-eindeutigkeit" class="mt-8">Teil 3 — Existenz über Intervallschachtelung</h2>
		<div class="eddie">
			<p>
				<strong>Vorbetrachtung:</strong> Angenommen, ein Startwert <Katex tex="x_1" /> erfüllt bereits
				<Katex tex="0<x_n<x_{n+1}<1" /> für alle <Katex tex="n" />.
				Dann folgt für jedes feste <Katex tex="n" />:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="0<x_n<x_n\!\left(x_n+\frac{1}{n}\right)=x_{n+1}<1\quad\Longrightarrow\quad 1-\frac{1}{n}<x_n<1." />
			</div>
			<p>
				Das ist die notwendige Richtung.
				Umgekehrt nehmen wir an, dass für alle <Katex tex="n\ge1" /> gilt
				<Katex tex="1-\frac{1}{n}<x_n<1" />.
				Dann ist <Katex tex="x_n>0" /> für alle <Katex tex="n" />.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="x_{n+1}-x_n=x_n\!\left(x_n+\frac{1}{n}-1\right)>0\quad\Longrightarrow\quad x_n<x_{n+1}." />
			</div>
			<p>
				Außerdem liefert die Annahme mit Index <Katex tex="n+1" /> direkt
				<Katex tex="x_{n+1}<1" />.
				Daher gilt für alle <Katex tex="n\ge1" />:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="0<x_n<x_{n+1}<1\ \Longleftrightarrow\ 1-\frac{1}{n}<x_n<1." />
			</div>
			<p>
				Damit dürfen wir äquivalent nach einem Startwert mit
				<Katex tex="1-\frac{1}{n}<T_n(x_1)<1" /> für alle <Katex tex="n" /> suchen.
			</p>
			<p>
				Für <Katex tex="n=1" /> genügt die Grundbedingung <Katex tex="0<x_1<1" />; wir setzen daher
				<Katex tex="a_1:=0" /> und <Katex tex="b_1:=1" />.
				Für jedes <Katex tex="n\ge2" /> definieren wir <Katex tex="a_n,b_n\in(0,1)" /> durch:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="T_n(a_n)=1-\frac{1}{n},\qquad T_n(b_n)=1." />
			</div>
			<p>
				Wegen Stetigkeit und strenger Monotonie von <Katex tex="T_n" /> sind <Katex tex="a_n,b_n" />
				eindeutig bestimmt und es gilt <Katex tex="a_n<b_n" />.
			</p>
			<p>
				Jetzt die Monotoniebeweise (für <Katex tex="n\ge2" />):
			</p>
			<ul>
				<li>
					<em><Katex tex="(a_n)" /> ist streng wachsend.</em>
					<div class="kbox">
						<Katex as="div" display tex="T_{n+1}(a_n)=T_n(a_n)\!\left(T_n(a_n)+\frac{1}{n}\right)." />
					</div>
					<div class="kbox">
						<Katex as="div" display tex="T_{n+1}(a_n)=\left(1-\frac{1}{n}\right)\!\left(1-\frac{1}{n}+\frac{1}{n}\right)=1-\frac{1}{n}" />
						<Katex as="div" display tex="<1-\frac{1}{n+1}=T_{n+1}(a_{n+1})." />
					</div>
					Da <Katex tex="T_{n+1}" /> streng wachsend ist, folgt <Katex tex="a_n<a_{n+1}" />.
				</li>
				<li>
					<em><Katex tex="(b_n)" /> ist streng fallend.</em>
					<div class="kbox">
						<Katex as="div" display tex="T_{n+1}(b_n)=T_n(b_n)\!\left(T_n(b_n)+\frac{1}{n}\right)=1\!\left(1+\frac{1}{n}\right)>1." />
					</div>
					<div class="kbox">
						<Katex as="div" display tex="T_{n+1}(b_n)>1=T_{n+1}(b_{n+1})." />
					</div>
					Wegen der strengen Monotonie von <Katex tex="T_{n+1}" /> folgt <Katex tex="b_{n+1}<b_n" />.
				</li>
			</ul>
			<p>
				Damit sind die abgeschlossenen Intervalle <Katex tex="I_n=[a_n,b_n]" />
				(für <Katex tex="n\ge2" />) geschachtelt:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="a_2<a_3<\dots<b_3<b_2,\qquad I_{n+1}\subset I_n\ (n\ge2)." />
			</div>
			<p>
				Nach dem Intervallschachtelungsprinzip ist <Katex tex="\bigcap_{n\ge2}I_n" /> nichtleer.
				Die Existenz ist damit gezeigt.
			</p>
		</div>

		<h2 class="mt-8">Teil 4 — Eindeutigkeit (mit Distanzbeweis)</h2>
		<div class="eddie">
			<p>
				Für die Eindeutigkeit müssen wir zeigen, dass die Intervalllängen gegen 0 gehen.
				Wir fixieren ein <Katex tex="n\ge2" /> und betrachten das zugehörige Intervall
				<Katex tex="I_n=[a_n,b_n]" />, dessen Länge <Katex tex="b_n-a_n" /> wir abschätzen wollen.
				Wenn wir zeigen, dass diese Länge für große <Katex tex="n" /> gegen 0 geht,
				folgt die Eindeutigkeit.
			</p>
			<p>
				Setze für <Katex tex="k=1,\dots,n" />:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="u_k:=T_k(a_n),\qquad v_k:=T_k(b_n),\qquad d_k:=v_k-u_k." />
			</div>
			<div class="kbox">
				<Katex as="div" display tex="d_1=b_n-a_n,\qquad d_n=T_n(b_n)-T_n(a_n)=1-\left(1-\frac{1}{n}\right)=\frac{1}{n}." />
			</div>
			<p>
				Für <Katex tex="k=1,\dots,n-1" /> rechnen wir explizit:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="v_{k+1}-u_{k+1}=v_k\!\left(v_k+\frac1k\right)-u_k\!\left(u_k+\frac1k\right)." />
			</div>
			<div class="kbox">
				<Katex as="div" display tex="=(v_k-u_k)\!\left(u_k+v_k+\frac1k\right)=d_k\!\left(u_k+v_k+\frac1k\right)." />
			</div>
			<p>
				Nun zeigen wir, dass der Faktor streng größer als 1 ist:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="d_k>0\quad\text{(da }a_n<b_n\text{ und }T_k\text{ streng wachsend ist).}" />
			</div>
			<div class="kbox">
				<Katex as="div" display tex="b_n>a_k\ \Longrightarrow\ v_k=T_k(b_n)>T_k(a_k)=1-\frac{1}{k}." />
			</div>
			<div class="kbox">
				<Katex as="div" display tex="v_k+\frac{1}{k}>1\ \Longrightarrow\ u_k+v_k+\frac{1}{k}>1." />
			</div>
			<p>
				Damit folgt für alle <Katex tex="k=1,\dots,n-1" />:
				<Katex tex="d_{k+1}>d_k" />.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="d_1<d_2<\dots<d_n=\frac{1}{n}." />
			</div>
			<div class="kbox">
				<Katex as="div" display tex="0<b_n-a_n=d_1<\frac{1}{n}\xrightarrow[n\to\infty]{}0." />
			</div>
			<p>
				Die Intervalllängen der geschachtelten Intervalle gehen also gegen 0.
				Daher besteht <Katex tex="\bigcap_{n\ge2}I_n" /> aus genau einem Punkt, nenne ihn
				<Katex tex="x^*" />.
			</p>
			<p>
				Weil die Intervalle geschachtelt sind, gilt
				<Katex tex="a_n<a_{n+1}\le x^*" /> und <Katex tex="x^*\le b_{n+1}<b_n" />.
				Also liegt <Katex tex="x^*" /> für jedes <Katex tex="n\ge2" /> strikt im Inneren:
				<Katex tex="a_n<x^*<b_n" />.
				Mit der strengen Monotonie von <Katex tex="T_n" /> folgt dann:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="1-\frac{1}{n}=T_n(a_n)<T_n(x^*)<T_n(b_n)=1\quad(n\ge2)." />
			</div>
			<p>
				Für <Katex tex="n=1" /> gilt zusätzlich
				<Katex tex="a_1=0<a_2\le x^*\le b_2<b_1=1" />, also <Katex tex="0<x^*<1" />.
				Mit der Äquivalenz aus Teil 3 folgt damit:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="x_n=T_n(x^*)\quad\Longrightarrow\quad 0<x_n<x_{n+1}<1\ \text{für alle }n." />
			</div>
			<p>
				Zum Schluss die formale Eindeutigkeit:
				Haben <Katex tex="x_1" /> und <Katex tex="y_1" /> die Eigenschaft, dann liegen beide für jedes
				<Katex tex="n\ge2" /> in <Katex tex="(a_n,b_n)" />.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="|x_1-y_1|\le b_n-a_n<\frac1n\quad(n\ge2)." />
			</div>
			<p>
				Da dies für alle <Katex tex="n\ge2" /> gilt, folgt <Katex tex="|x_1-y_1|=0" />,
				also <Katex tex="x_1=y_1" />.
			</p>
		</div>

		<EddieComment subtitle="Fazit mit Grinsen">
			<p>
				Am Ende ist es fast schon frech schön: unendlich viele Startwerte probieren,
				aber nur einer trifft exakt die Spur zwischen „zu klein“ und „zu groß“.
				Wenn der sitzt, marschiert die Folge brav aufwärts und bleibt trotzdem unter 1.
				Ein mathematischer Präzisionsstart.
			</p>
		</EddieComment>
	</template>

	<template #interactivePart>
		<h2>Spielplatz: Näherung für den eindeutigen Startwert</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p>
				Wir berechnen für ein gewähltes <Katex tex="N" /> die numerischen Schranken
				<Katex tex="A_N=\max_{1\le n\le N}a_n" /> und
				<Katex tex="B_N=\min_{1\le n\le N}b_n" />.
				Das Intervall <Katex tex="[A_N,B_N]" /> enthält den eindeutigen Startwert.
			</p>

			<div class="d-flex flex-wrap ga-3 align-center">
				<v-text-field
					v-model="nInput"
					hide-details="auto"
					label="N (Anzahl Stufen)"
					max="120"
					min="2"
					style="max-width: 180px"
					type="number"
				/>
				<v-text-field
					v-model="x1Input"
					hide-details="auto"
					label="Testwert x1"
					style="max-width: 220px"
				/>
				<v-btn color="primary" variant="flat" @click="runCheck">Berechnen</v-btn>
				<v-btn variant="tonal" @click="setMidpoint">x1 = (A_N+B_N)/2</v-btn>
				<v-btn variant="tonal" @click="randomAround">Zufall nahe Intervall</v-btn>
			</div>

			<v-alert v-if="error" type="error" variant="tonal">
				{{ error }}
			</v-alert>

			<v-alert v-if="result" type="info" variant="tonal">
				<div class="d-flex flex-column ga-1">
					<div>
						<Katex :tex="`A_N=${fmt(result.AN, 10)}`" />,<br>
						<Katex :tex="`B_N=${fmt(result.BN, 10)}`" />
					</div>
					<div>
						Breite:
						<Katex :tex="`B_N-A_N=${fmt(result.width, 10)}`" />,<br>
						Vergleich:
						<Katex :tex="`\\frac1N=${fmt(1 / result.N, 10)}`" />.
					</div>
				</div>
			</v-alert>

			<v-alert
				v-if="result"
				:type="result.okAll ? 'success' : 'warning'"
				variant="tonal"
			>
				<div v-if="result.okAll">
					Für <code>x1={{ fmt(result.x1, 10) }}</code> gilt numerisch bis <code>n={{ result.N }}</code>:
					<Katex tex="0<x_n<x_{n+1}<1" />.
				</div>
				<div v-else>
					Bedingung verletzt bei <code>n={{ result.failAt }}</code>.
					Werte: <code>x_n={{ fmt(result.failXn, 10) }}</code>,
					<code>x_{n+1}={{ fmt(result.failXn1, 10) }}</code>.
				</div>
			</v-alert>
		</div>
	</template>

	<template #calculationPart>
		<h2>Tabellen</h2>
		<div class="eddie d-flex flex-column ga-3">
			<v-sheet v-if="result" border class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">Schrankenfolgen</div>
				<v-table density="compact">
					<thead>
						<tr>
							<th>n</th>
							<th class="text-right">a_n</th>
							<th class="text-right">b_n</th>
							<th class="text-right">b_n-a_n</th>
							<th class="text-right">1/n</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="row in result.boundsRows" :key="row.n">
							<td class="mono">{{ row.n }}</td>
							<td class="mono text-right">{{ fmt(row.a, 10) }}</td>
							<td class="mono text-right">{{ fmt(row.b, 10) }}</td>
							<td class="mono text-right">{{ fmt(row.w, 10) }}</td>
							<td class="mono text-right">{{ fmt(1 / row.n, 10) }}</td>
						</tr>
					</tbody>
				</v-table>
			</v-sheet>

			<v-sheet v-if="result" border class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">Folge für den Testwert x1</div>
				<v-table density="compact">
					<thead>
						<tr>
							<th>n</th>
							<th class="text-right">x_n</th>
							<th class="text-right">x_{n+1}</th>
							<th class="text-right">Check</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="row in result.seqRows" :key="row.n">
							<td class="mono">{{ row.n }}</td>
							<td class="mono text-right">{{ fmt(row.xn, 10) }}</td>
							<td class="mono text-right">{{ fmt(row.xn1, 10) }}</td>
							<td class="mono text-right">{{ row.ok ? "ok" : "fail" }}</td>
						</tr>
					</tbody>
				</v-table>
			</v-sheet>
		</div>
	</template>

	<template #footer>
		<p class="muted">
			Quelle der Aufgabenstellung/Lösungsskizze:
			<a href="https://prase.cz/kalva/imo/isoln/isoln856.html">IMO 1985 B3 (ISL solutions, prase.cz)</a>
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import { ref } from "vue";
import titleImg from "./O6.webp";

const EPS = 1e-13;

const nInput = ref( "25" );
const x1Input = ref( "0.57" );

const error = ref( "" );
const result = ref( null );

function parseNumber( v, label ) {
	const s = String( v ?? "" ).trim()
		.replace( ",", "." );

	if ( !s ) {
		throw new Error( `${label}: leer.` );
	}

	const x = Number( s );

	if ( !Number.isFinite( x ) ) {
		throw new Error( `${label}: ungültige Zahl.` );
	}

	return x;
}

function recurrenceStep( x, n ) {
	return x * ( x + 1 / n );
}

function Sn( x, n ) {
	let y = x;

	for ( let k = 1; k <= n; k++ ) {
		y = recurrenceStep( y, k );
	}

	return y;
}

function bisectionForSn( n, target ) {
	let lo = 0;
	let hi = 1;
	let flo = Sn( lo, n ) - target;
	let fhi = Sn( hi, n ) - target;

	if ( Math.abs( flo ) < EPS ) {
		return lo;
	}

	if ( Math.abs( fhi ) < EPS ) {
		return hi;
	}

	if ( flo * fhi > 0 ) {
		throw new Error( `Bisection failed for n=${n}, target=${target}.` );
	}

	for ( let iter = 0; iter < 120; iter++ ) {
		const mid = 0.5 * ( lo + hi );
		const fm = Sn( mid, n ) - target;

		if ( Math.abs( fm ) < EPS || hi - lo < 1e-14 ) {
			return mid;
		}

		if ( flo * fm <= 0 ) {
			hi = mid;
			fhi = fm;
		} else {
			lo = mid;
			flo = fm;
		}
	}

	return 0.5 * ( lo + hi );
}

function computeBounds( N ) {
	const rows = [];
	let AN = -Infinity;
	let BN = Infinity;

	for ( let n = 1; n <= N; n++ ) {
		const a = bisectionForSn( n, 1 - 1 / n );
		const b = bisectionForSn( n, 1 );
		const w = b - a;
		AN = Math.max( AN, a );
		BN = Math.min( BN, b );
		rows.push( {
			n, a, b, w
		} );
	}

	return {
		rows,
		AN,
		BN,
		width: BN - AN
	};
}

function computeSequenceRows( x1, N ) {
	const x = [ 0, x1 ];

	for ( let n = 1; n <= N; n++ ) {
		x[ n + 1 ] = recurrenceStep( x[ n ], n );
	}

	const rows = [];
	let fail = null;

	for ( let n = 1; n <= N; n++ ) {
		const xn = x[ n ];
		const xn1 = x[ n + 1 ];
		const ok = xn > 0 && xn < xn1 && xn1 < 1;
		rows.push( {
			n, xn, xn1, ok
		} );

		if ( !ok && fail === null ) {
			fail = {
				n, xn, xn1
			};
		}
	}

	return { rows, fail };
}

function runCheck() {
	error.value = "";
	result.value = null;

	try {
		const N = parseNumber( nInput.value, "N" );
		const x1 = parseNumber( x1Input.value, "x1" );

		if ( !Number.isInteger( N ) ) {
			throw new Error( "N muss ganzzahlig sein." );
		}

		if ( N < 2 || N > 120 ) {
			throw new Error( "N bitte zwischen 2 und 120 wählen." );
		}

		const bounds = computeBounds( N );
		const seq = computeSequenceRows( x1, N );

		result.value = {
			N,
			x1,
			AN:         bounds.AN,
			BN:         bounds.BN,
			width:      bounds.width,
			boundsRows: bounds.rows,
			seqRows:    seq.rows,
			okAll:      seq.fail === null,
			failAt:     seq.fail?.n ?? null,
			failXn:     seq.fail?.xn ?? null,
			failXn1:    seq.fail?.xn1 ?? null
		};
	} catch ( e ) {
		error.value = e?.message ? String( e.message ) : String( e );
	}
}

function setMidpoint() {
	if ( !result.value ) {
		runCheck();

		if ( !result.value ) {
			return;
		}
	}

	const m = 0.5 * ( result.value.AN + result.value.BN );
	x1Input.value = String( m );
	runCheck();
}

function randomAround() {
	if ( !result.value ) {
		runCheck();

		if ( !result.value ) {
			return;
		}
	}

	const {
		AN, BN, width
	} = result.value;
	const left = AN - 0.6 * width;
	const right = BN + 0.6 * width;
	const x = left + Math.random() * ( right - left );
	x1Input.value = String( x );
	runCheck();
}

function fmt( v, digits = 6 ) {
	if ( !Number.isFinite( v ) ) {
		return "–";
	}

	return v.toFixed( digits );
}

runCheck();
</script>

<style scoped>
ol > li { margin: 0.35rem 0; }
</style>
