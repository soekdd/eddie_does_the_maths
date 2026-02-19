<template>
<AppFrame
	:sub-chapter="{
		rekursion: 'Rekursion',
		monotonie: 'Monotonie',
		'existenz-eindeutigkeit': 'Existenz & Eindeutigkeit'
	}"
	title="Eddie rechnet: IMO 1985 Aufgabe B3"
>

	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer title="Eddie denkt über die Aufgabe B3 der IMO 85 nach">
				<img loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>

		<h2 id="rekursion">Teil 1 — Aufgabenstellung</h2>
		<div class="eddie">
			<p>
				Für jede reelle Startzahl <Katex tex="x_1" /> wird eine Folge durch
			</p>
			<div class="kbox">
				<Katex as="div" display tex="x_{n+1}=x_n\left(x_n+\frac1n\right),\quad n=1,2,3,\dots" />
			</div>
			<p>
				definiert. Zu zeigen ist: Es gibt <b>genau einen</b> Startwert <Katex tex="x_1" />, für den
			</p>
			<div class="kbox">
				<Katex as="div" display tex="0<x_n<x_{n+1}<1\quad\text{für alle }n" />
			</div>
			<p>
				gilt.
			</p>
		</div>

		<h2 id="monotonie" class="mt-8">Teil 2 — Umformulierung mit S_n</h2>
		<div class="eddie">
			<p>
				Definiere Hilfsfunktionen
				<Katex tex="S_0(x)=x" /> und
				<Katex tex="S_n(x)=S_{n-1}(x)\left(S_{n-1}(x)+\frac1n\right)" />.
				Dann ist
				<Katex tex="x_{n+1}=S_n(x_1)" />.
			</p>
			<p>
				Für jedes feste <Katex tex="n" /> ist <Katex tex="S_n" /> auf <Katex tex="[0,1]" /> streng wachsend
				(alle Koeffizienten sind nichtnegativ), außerdem
				<Katex tex="S_n(0)=0" /> und <Katex tex="S_n(1)>1" />.
			</p>
		</div>

		<h2 id="existenz-eindeutigkeit" class="mt-8">Teil 3 — Existenz über Intervallschachtelung</h2>
		<div class="eddie">
			<p>
				Definiere <Katex tex="a_n,b_n" /> eindeutig durch
			</p>
			<div class="kbox">
				<Katex as="div" display tex="S_n(a_n)=1-\frac1n,\qquad S_n(b_n)=1." />
			</div>
			<ul>
				<li><Katex tex="a_n" /> ist wachsend,</li>
				<li><Katex tex="b_n" /> ist fallend,</li>
				<li>und stets <Katex tex="a_n<b_n" />.</li>
			</ul>
			<p>
				Also gibt es mindestens ein <Katex tex="x_1" /> mit
				<Katex tex="a_n<x_1<b_n" /> für alle <Katex tex="n" />.
				Daraus folgt
				<Katex tex="1-\frac1n<S_n(x_1)<1" />, also
				<Katex tex="0<x_n<x_{n+1}<1" />.
			</p>
		</div>

		<h2 class="mt-8">Teil 4 — Eindeutigkeit</h2>
		<div class="eddie">
			<p>
				Jeder gültige Startwert muss in allen Intervallen
				<Katex tex="(a_n,b_n)" /> liegen. Deshalb reicht es zu zeigen, dass die Breite
				<Katex tex="b_n-a_n\to 0" /> geht.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="b_n-a_n\le\frac{b_n}{n}<\frac1n\xrightarrow[n\to\infty]{}0." />
			</div>
			<p>
				Damit schrumpfen die Intervalle auf genau einen Punkt zusammen: der gesuchte eindeutige Startwert.
			</p>
		</div>
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
import titleImg from "@/images/O6.webp";

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
