<template>
<AppFrame warning>
	<template #title>
		<div class="badge">O4</div>
		<div>
			<h1>Eddie rechnet: IMO 1985 Aufgabe 4</h1>
			<p class="sub">Schubfachprinzip • Paritätsvektoren • vierte Potenz</p>
		</div>
	</template>

	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="`Eddie`">
				<img alt="Eddie rechnet" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>

		<h2>Teil 1 — Aufgabenstellung (deutsch)</h2>
		<div class="eddie">
			<p>
				Gegeben sei eine Menge <Katex tex="M" /> aus <b>1985 verschiedenen positiven ganzen Zahlen</b>.
				Keine dieser Zahlen besitzt einen Primteiler größer als <Katex tex="23" />.
			</p>
			<p>
				Zu zeigen ist: In <Katex tex="M" /> gibt es eine Teilmenge mit <b>4 Elementen</b>,
				deren Produkt eine <b>vierte Potenz</b> einer ganzen Zahl ist.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\exists\ a,b,c,d\in M:\quad abcd = t^4\ \text{für ein}\ t\in\mathbb{Z}." />
			</div>
		</div>

		<h2 class="mt-8">Teil 2 — Mini-Crashkurs: Was muss eine vierte Potenz erfüllen?</h2>
		<div class="eddie">
			<p>
				Die erlaubten Primzahlen sind genau
				<Katex tex="2,3,5,7,11,13,17,19,23" />.
				Das entspricht <Katex tex="n=9" /> Primzahlachsen.
			</p>
			<p>
				Für eine Zahl
				<Katex tex="x=\prod_{j=1}^9 p_j^{e_j}" />
				gilt:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="x\text{ ist Quadrat }\Longleftrightarrow e_j\equiv 0\pmod 2\ \forall j." />
				<Katex as="div" display tex="x\text{ ist vierte Potenz }\Longleftrightarrow e_j\equiv 0\pmod 4\ \forall j." />
			</div>
			<p>
				Der Beweis arbeitet deshalb in zwei Schichten: erst Parität modulo <Katex tex="2" />,
				dann nochmal Parität auf der Ebene der Quadratwurzeln.
			</p>
		</div>

		<h2 class="mt-8">Teil 3 — Quadratfreier Kern und Paritätsvektor</h2>
		<div class="eddie">
			<p>
				Eine anschauliche Sicht (wie im Kapiteltext): Zerlege jede Zahl als
				<Katex tex="x=q\cdot r^2" />, wobei <Katex tex="q" /> quadratfrei ist.
				Gleichwertig dazu kann man den <b>Paritätsvektor</b>
				<Katex tex="\varepsilon(x)=(e_1,\dots,e_9)\bmod 2" />
				verwenden.
			</p>
			<p>
				Beide Sichtweisen codieren dieselbe Information:
				Welche Primzahlen mit ungeradem Exponenten auftreten.
				Davon gibt es höchstens
				<Katex tex="2^9=512" /> Klassen.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\varepsilon(x)=\varepsilon(y)\Longrightarrow xy\text{ ist ein Quadrat}." />
			</div>
		</div>

		<h2 class="mt-8">Teil 4 — Warum 1985 sicher reicht</h2>
		<div class="eddie">
			<p>
				Für allgemeines <Katex tex="n" /> reicht
				<Katex tex="3\cdot 2^n + 1" />.
				Bei <Katex tex="n=9" /> also
				<Katex tex="3\cdot 2^9+1=1537" />.
				Da <Katex tex="1985\ge 1537" />, sind wir über der Garantieschwelle.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="3\cdot 2^9 + 1 = 1537\le 1985." />
			</div>
		</div>

		<h2 class="mt-8">Teil 5 — Herleitung Schritt für Schritt</h2>
		<div class="eddie">
			<v-expansion-panels variant="accordion">
				<v-expansion-panel>
					<v-expansion-panel-title>Stufe A: Aus Zahlen werden viele Quadrat-Paare</v-expansion-panel-title>
					<v-expansion-panel-text class="d-flex flex-column ga-3">
						<div>
							Schreibe jede Zahl als
							<Katex tex="x=p_1^{r_1}\cdots p_n^{r_n}" />
							und betrachte nur die Paritäten von
							<Katex tex="(r_1,\dots,r_n)\bmod 2" />.
						</div>
						<div>
							Es gibt nur <Katex tex="2^n" /> Klassen. Zwei Zahlen in derselben Klasse haben
							im Produkt überall gerade Exponenten, also ein Quadrat.
						</div>
						<div class="kbox">
							<Katex as="div" display tex="x\sim y\Rightarrow xy=s^2." />
						</div>
						<div>
							Sei <Katex tex="c_v" /> die Anzahl Zahlen in Klasse <Katex tex="v" />.
							Dann entstehen insgesamt
							<Katex tex="P=\sum_v \left\lfloor c_v/2\right\rfloor" />
							Quadrat-Paare.
						</div>
						<div class="kbox">
							<Katex as="div" display tex="\left\lfloor c_v/2\right\rfloor \ge (c_v-1)/2\Rightarrow P\ge \frac{|M|-2^n}{2}." />
							<Katex as="div" display tex="|M|=3\cdot 2^n+1\Rightarrow P\ge 2^n+1." />
						</div>
					</v-expansion-panel-text>
				</v-expansion-panel>

				<v-expansion-panel>
					<v-expansion-panel-title>Stufe B: Aus Quadrat-Paaren entsteht eine vierte Potenz</v-expansion-panel-title>
					<v-expansion-panel-text class="d-flex flex-column ga-3">
						<div>
							Nimm zwei Quadrat-Paare:
							<Katex tex="ab=u^2" /> und <Katex tex="cd=v^2" />.
							Kodiere nun die Parität der Exponenten von <Katex tex="u" /> und <Katex tex="v" />
							wieder modulo <Katex tex="2" />.
						</div>
						<div>
							Unter den <Katex tex="P\ge 2^n+1" /> Paaren gibt es also (Schubfachprinzip) zwei Paare
							mit gleicher Wurzel-Parität.
							Damit ist <Katex tex="uv" /> ein Quadrat, also <Katex tex="uv=s^2" />.
						</div>
						<div class="kbox">
							<Katex as="div" display tex="abcd=(u^2)(v^2)=(uv)^2=(s^2)^2=s^4." />
						</div>
						<div>
							Wichtig: Zwei beliebige Quadrate ergeben nur wieder ein Quadrat.
							Die zusätzliche Paritätsgleichheit der Wurzeln ist genau der Schritt zur vierten Potenz.
						</div>
					</v-expansion-panel-text>
				</v-expansion-panel>

				<v-expansion-panel>
					<v-expansion-panel-title>Mini-Beispiel (korrigiert geprüft)</v-expansion-panel-title>
					<v-expansion-panel-text class="d-flex flex-column ga-3">
						<div>
							Betrachte
							<Katex tex="\{6,24,54,216,8,75\}" />.
							Für die ersten vier Zahlen gilt jeweils
							<Katex tex="x=6\cdot r^2" /> mit
							<Katex tex="r\in\{1,2,3,6\}" />.
						</div>
						<div class="kbox">
							<Katex as="div" display tex="6\cdot24\cdot54\cdot216=36^4." />
						</div>
						<div>
							Das ist ein gutes Anschauungsbeispiel, aber der eigentliche IMO-Beweis läuft
							über die zwei Schubfach-Stufen oben und nicht über eine spezielle Zahlenwahl.
						</div>
					</v-expansion-panel-text>
				</v-expansion-panel>
			</v-expansion-panels>
		</div>
	</template>

	<template #interactivePart>
		<h2>Spielplatz: Konstruktion per Schubfachprinzip</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p>
				Wir erzeugen eine Menge mit nur Primteilern <Katex tex="\le 23" /> und bauen die zwei Stufen
				explizit nach. Damit siehst du den Beweis "in Aktion".
			</p>

			<div class="d-flex flex-wrap ga-3 align-center">
				<v-text-field
					v-model="countInput"
					hide-details="auto"
					label="Anzahl Zahlen in M"
					max="5000"
					min="4"
					style="max-width: 220px"
					type="number"
				/>
				<v-btn color="primary" variant="flat" @click="runConstruction">
					Konstruieren & prüfen
				</v-btn>
				<v-btn variant="tonal" @click="randomExample">
					Zufallsgröße
				</v-btn>
			</div>

			<v-alert v-if="error" type="error" variant="tonal">
				{{ error }}
			</v-alert>

			<v-alert v-if="result" :type="result.guaranteed ? 'info' : 'warning'" variant="tonal">
				<Katex :tex="`|M|=${result.count}`" />,
				Schwellwert: <Katex :tex="`3\\cdot 2^9+1=${result.threshold}`" />.
				<span v-if="result.guaranteed">Theorem garantiert die Existenz.</span>
				<span v-else>Unterhalb der Schwelle ist es ein Experiment (kann klappen, muss nicht).</span>
			</v-alert>

			<v-sheet v-if="result" border class="pa-3 rounded">
				<div class="d-flex flex-column ga-2">
					<div>
						<strong>Stufe A:</strong>
						{{ result.squarePairCount }} Quadrat-Paare aus {{ result.parityClassCount }} Paritätsklassen.
					</div>
					<div>
						<strong>Stufe B:</strong>
						{{ result.rootParityClassCount }} Klassen für Quadratwurzeln-Parität.
					</div>
					<div>
						<strong>Ergebnis:</strong>
						<span v-if="result.found" class="text-success">4er-Teilmenge gefunden, Produkt ist vierte Potenz.</span>
						<span v-else class="text-warning">Keine 4er-Teilmenge mit dieser Konstruktion gefunden.</span>
					</div>
				</div>
			</v-sheet>
		</div>
	</template>

	<template #calculationPart>
		<h2>Rechendetails</h2>
		<div class="eddie d-flex flex-column ga-3">
			<v-sheet v-if="result" border class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">Paritätsklassen der Zahlen (Top 12)</div>
				<v-table density="compact">
					<thead>
						<tr>
							<th>Klasse (Bitvektor)</th>
							<th>odd Primexponenten</th>
							<th class="text-right">Anzahl</th>
							<th class="text-right">Paarbeitrag</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="row in result.parityClassRows" :key="row.key">
							<td><code>{{ row.key }}</code></td>
							<td>{{ describeKey(row.key) }}</td>
							<td class="text-right mono">{{ row.count }}</td>
							<td class="text-right mono">{{ row.pairs }}</td>
						</tr>
					</tbody>
				</v-table>
			</v-sheet>

			<v-sheet v-if="result" border class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">Paritätsklassen der Quadratwurzeln (Top 12)</div>
				<v-table density="compact">
					<thead>
						<tr>
							<th>Klasse (Bitvektor)</th>
							<th>odd Primexponenten</th>
							<th class="text-right">Anzahl Paare</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="row in result.rootClassRows" :key="row.key">
							<td><code>{{ row.key }}</code></td>
							<td>{{ describeKey(row.key) }}</td>
							<td class="text-right mono">{{ row.count }}</td>
						</tr>
					</tbody>
				</v-table>
			</v-sheet>

			<v-sheet v-if="result && result.found" border class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">Gefundene 4er-Teilmenge</div>
				<div class="mono">a = {{ result.witness.a }}</div>
				<div class="mono">b = {{ result.witness.b }}</div>
				<div class="mono">c = {{ result.witness.c }}</div>
				<div class="mono">d = {{ result.witness.d }}</div>
				<div class="mono mt-2">abcd = {{ result.witness.product }}</div>
				<div class="mono">4. Wurzel-Kandidat t = {{ result.witness.t }}</div>
				<div class="mono">Check: t^4 = {{ result.witness.checkValue }}</div>
			</v-sheet>
		</div>
	</template>
</AppFrame>
</template>

<script setup>
import { ref } from "vue";
import titleImg from "@/images/O4.webp";

const PRIMES = [ 2, 3, 5, 7, 11, 13, 17, 19, 23 ];
const PRIMES_BIG = PRIMES.map( ( p ) => BigInt( p ) );
const THRESHOLD = 3 * 2 ** PRIMES.length + 1; // 1537 bei n=9

const countInput = ref( "1537" );
const error = ref( "" );
const result = ref( null );

function parityKey( exponents ) {
	return exponents.map( ( e ) => e % 2 ).join( "" );
}

function decodeBase(
	index, base, len
) {
	const out = Array( len ).fill( 0 );
	let x = index;

	for ( let i = 0; i < len; i++ ) {
		out[ i ] = x % base;
		x = Math.floor( x / base );
	}

	return out;
}

function powBigInt( base, exp ) {
	let out = 1n;

	for ( let i = 0; i < exp; i++ ) {
		out *= base;
	}

	return out;
}

function numberFromExponents( exponents ) {
	let n = 1n;

	for ( let i = 0; i < exponents.length; i++ ) {
		if ( exponents[ i ] > 0 ) {
			n *= powBigInt( PRIMES_BIG[ i ], exponents[ i ] );
		}
	}

	return n;
}

function describeKey( key ) {
	const primes = [];

	for ( let i = 0; i < key.length; i++ ) {
		if ( key[ i ] === "1" ) {
			primes.push( PRIMES[ i ] );
		}
	}

	return primes.length ? `{${primes.join( ", " )}}` : "{}";
}

function generateSmoothSet( count ) {
	const maxCount = 4 ** PRIMES.length;

	if ( count > maxCount ) {
		throw new Error( `Für den Generator sind maximal ${maxCount} eindeutige Zahlen vorgesehen.` );
	}

	const items = [];

	for ( let idx = 0; idx < count; idx++ ) {
		const exponents = decodeBase(
			idx, 4, PRIMES.length
		); // Exponenten 0..3
		items.push( {
			id:    idx + 1,
			exponents,
			value: numberFromExponents( exponents ),
			key:   parityKey( exponents )
		} );
	}

	return items;
}

function analyze( items ) {
	const classMap = new Map();

	for ( const item of items ) {
		if ( !classMap.has( item.key ) ) {
			classMap.set( item.key, [] );
		}

		classMap.get( item.key ).push( item );
	}

	const parityClassRows = Array.from( classMap.entries() )
		.map( ( [ key, arr ] ) => ( {
			key,
			count: arr.length,
			pairs: Math.floor( arr.length / 2 )
		} ) )
		.sort( ( a, b ) => b.count - a.count )
		.slice( 0, 12 );

	const squarePairs = [];

	for ( const arr of classMap.values() ) {
		for ( let i = 0; i + 1 < arr.length; i += 2 ) {
			const a = arr[ i ];
			const b = arr[ i + 1 ];
			const rootParity = a.exponents.map( ( ea, j ) => ( ea + b.exponents[ j ] ) / 2 % 2 );
			squarePairs.push( {
				a,
				b,
				rootKey: rootParity.join( "" ),
				rootParity
			} );
		}
	}

	const rootMap = new Map();

	for ( const pair of squarePairs ) {
		if ( !rootMap.has( pair.rootKey ) ) {
			rootMap.set( pair.rootKey, [] );
		}

		rootMap.get( pair.rootKey ).push( pair );
	}

	const rootClassRows = Array.from( rootMap.entries() )
		.map( ( [ key, arr ] ) => ( { key, count: arr.length } ) )
		.sort( ( a, b ) => b.count - a.count )
		.slice( 0, 12 );

	let witness = null;

	for ( const arr of rootMap.values() ) {
		if ( arr.length < 2 ) {
			continue;
		}

		const p1 = arr[ 0 ];
		const p2 = arr[ 1 ];
		const four = [ p1.a, p1.b, p2.a, p2.b ];

		const sumExp = Array( PRIMES.length ).fill( 0 );

		for ( const item of four ) {
			for ( let j = 0; j < PRIMES.length; j++ ) {
				sumExp[ j ] += item.exponents[ j ];
			}
		}

		const isFourth = sumExp.every( ( e ) => e % 4 === 0 );

		if ( !isFourth ) {
			continue;
		}

		const root4Exp = sumExp.map( ( e ) => e / 4 );
		const t = numberFromExponents( root4Exp );
		const product = four.reduce( ( acc, item ) => acc * item.value, 1n );

		witness = {
			a:          p1.a.value.toString(),
			b:          p1.b.value.toString(),
			c:          p2.a.value.toString(),
			d:          p2.b.value.toString(),
			product:    product.toString(),
			t:          t.toString(),
			checkValue: ( t * t * t * t ).toString()
		};
		break;
	}

	return {
		count:                items.length,
		parityClassCount:     classMap.size,
		squarePairCount:      squarePairs.length,
		rootParityClassCount: rootMap.size,
		parityClassRows,
		rootClassRows,
		found:                !!witness,
		witness,
		threshold:            THRESHOLD,
		guaranteed:           items.length >= THRESHOLD
	};
}

function runConstruction() {
	error.value = "";
	result.value = null;

	try {
		const count = Number( countInput.value );

		if ( !Number.isInteger( count ) ) {
			throw new Error( "Bitte eine ganze Zahl eingeben." );
		}

		if ( count < 4 ) {
			throw new Error( "Mindestens 4 Zahlen sind nötig." );
		}

		if ( count > 5000 ) {
			throw new Error( "Bitte maximal 5000 eingeben (für flüssige Darstellung)." );
		}

		const items = generateSmoothSet( count );
		result.value = analyze( items );
	} catch ( e ) {
		error.value = e?.message ? String( e.message ) : String( e );
	}
}

function randomExample() {
	const c = 200 + Math.floor( Math.random() * 2200 ); // 200..2399
	countInput.value = String( c );
	runConstruction();
}

runConstruction();
</script>

<style scoped>
ol > li { margin: 0.35rem 0; }
</style>
