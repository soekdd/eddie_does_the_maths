<template>
<AppFrame  :sub-chapter="{
		einleitung:'Einleitung',
		'aufgabenstellung': 'Aufgabenstellung',
		'crashkurs': 'Quadrat vs. 4. Potenz',
		'paritatsvektoren': 'Paritätsvektor',
		'allgemein': 'Allgemeine Schranke',
		'schubfachprinzip': 'Schubfachprinzip',
		'beispiel': 'Mini-Beispiel'
	}"
	title="Eddie rechnet: IMO 1985 Aufgabe B1"
	:vue-date="__VITE_SFC_MTIME_MS__"
>

	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer title="Eddie denkt über die Aufgabe B1 der IMO 85 nach">
				<img loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">Joutsa, 5. Juli 1985</h3>
		<div class="eddie">
			<p>Joutsa, zweiter Wettkampftag. Der Stuhl knarzt, als würde er mich verraten wollen. Mein Herz klopft
				zu laut für so einen stillen Raum. Ich starre auf die Aufgabe und merke, wie mein Kopf
				gleichzeitig hier <em>und</em> schon ganz woanders ist. Bei Türen, Wegen, Zeiten. Fluchtplänen.</p><p>
				Auf dem Papier geht es um eine große Menge verschiedener Zahlen. Alle diese Zahlen sind aus
				kleinen Bausteinen zusammengesetzt. Sie dürfen nur durch bestimmte kleine Primzahlen teilbar
				sein. Und jetzt kommt die Behauptung, die wie ein Zaubersatz klingt: In so einer riesigen
				Sammlung findest du garantiert vier Zahlen, deren Produkt “perfekt” ist, so perfekt, dass
				es genau zu einer vierten Potenz passt, also wie eine Zahl, die viermal mit sich selbst
				multipliziert wurde.</p><p>
				Ich weiß: Das ist eigentlich ein Sortier- und Schubladenproblem. Aber heute fühlt sich sogar
				Sortieren an wie Nebel.</p><p>
				Hier mache ich daraus wieder etwas Greifbares: Bausteine zählen, Muster bündeln, und warum
				“vier” hier kein Zufall ist.</p>
		</div>
	</template>

	<template #descriptionPart>
		<h2 id="aufgabenstellung">Teil 1 — Aufgabenstellung</h2>
		<div class="eddie">
			<p>
				Gegeben sei eine Menge <Katex tex="M" /> aus <b>1985 verschiedenen positiven ganzen Zahlen</b>.
				Keine dieser Zahlen besitzt einen Primteiler größer als <Katex tex="23" />.
				Alle Primfaktoren liegen also in
				<Katex tex="\{2,3,5,7,11,13,17,19,23\}" />.
			</p>
			<p>
				Zu zeigen ist: In <Katex tex="M" /> gibt es <b>vier verschiedene Zahlen</b> <Katex tex="a,b,c,d" />,
				deren Produkt eine vierte Potenz ist:
			</p>
			<div class="kbox">
				<Katex
					as="div"
					display
					tex="\exists\,a,b,c,d\in M\ \text{paarweise verschieden}:\quad abcd=t^4\ \text{für ein}\ t\in\mathbb Z."
				/>
			</div>
		</div>

		<h2 id="crashkurs" class="mt-8">Teil 2 — Mini-Crashkurs: Wann Quadrat? Wann vierte Potenz?</h2>
		<div class="eddie">
			<p>
				Sei <Katex tex="p_1,\dots,p_n" /> die Liste der erlaubten Primzahlen. Hier ist
			</p>
			<div class="kbox">
				<Katex
					as="div"
					display
					tex="(p_1,\dots,p_9)=(2,3,5,7,11,13,17,19,23),\quad \text{also } n=9."
				/>
			</div>
			<p>Jede Zahl <Katex tex="x" /> lässt sich eindeutig schreiben als</p>
			<div class="kbox">
				<Katex as="div" display tex="x=\prod_{j=1}^{n} p_j^{e_j}\quad \text{mit } e_j\in\mathbb N_0." />
			</div>
			<p>Dann gilt:</p>
			<ul>
				<li>
					<Katex tex="x" /> ist ein Quadrat genau dann, wenn alle Exponenten gerade sind:
					<Katex tex="e_j\equiv 0 \pmod 2\ \text{für alle }j." />
				</li>
				<li>
					<Katex tex="x" /> ist eine vierte Potenz genau dann, wenn alle Exponenten durch
					<Katex tex="4" /> teilbar sind:
					<Katex tex="e_j\equiv 0 \pmod 4\ \text{für alle }j." />
				</li>
			</ul>
			<p>Die Grundidee des Beweises ist daher zweistufig:</p>
			<ol>
				<li>Zuerst sorgen wir dafür, dass Exponenten gerade werden (Quadrat).</li>
				<li>Dann sorgen wir dafür, dass die Exponenten der Quadrat-Wurzeln wieder gerade sind.</li>
			</ol>
		</div>

		<h2 id="paritatsvektoren" class="mt-8">Teil 3 — Quadratfreier Kern und Paritätsvektor</h2>
		<div class="eddie">
			<p>
				Für jedes <Katex tex="x" /> betrachten wir nur, welche Primzahlen mit ungeradem Exponenten vorkommen.
			</p>
			<h3>(A) Quadratfreier Kern</h3>
			<p>Man kann <Katex tex="x" /> eindeutig zerlegen als</p>
			<div class="kbox">
				<Katex as="div" display tex="x=q\cdot r^2," />
			</div>
			<p>
				wobei <Katex tex="q" /> quadratfrei ist.
				Dann enthält <Katex tex="q" /> genau die Primzahlen, die in <Katex tex="x" /> ungerade oft vorkommen.
			</p>

			<h3>(B) Paritätsvektor</h3>
			<p>Definiere</p>
			<div class="kbox">
				<Katex as="div" display tex="\varepsilon(x)=(e_1,\dots,e_n)\bmod 2\in\{0,1\}^n." />
			</div>
			<p>Dieser Vektor speichert: Exponent ungerade (=1) oder gerade (=0).</p>
			<p><b>Wichtiger Merksatz:</b></p>
			<div class="kbox">
				<Katex as="div" display tex="\varepsilon(x)=\varepsilon(y)\quad\Longrightarrow\quad xy\ \text{ist ein Quadrat}." />
			</div>
			<p>
				Denn dann ist in <Katex tex="xy" /> jeder Exponent <Katex tex="e_j(x)+e_j(y)" /> gerade.
				Es gibt insgesamt nur <Katex tex="2^n" /> Paritätsklassen.
			</p>
		</div>

		<h2 id="allgemein" class="mt-8">Teil 4 — Warum 1985 sicher reicht (allgemeinere Aussage)</h2>
		<div class="eddie">
			<p>Wir zeigen die stärkere Behauptung:</p>
			<p>
				Wichtig: Es ist weiterhin dieselbe Menge <Katex tex="M" /> wie in der Aufgabenstellung;
				wir benutzen ab hier nur noch die schwächere Information, dass
				<Katex tex="|M|\ge 3\cdot 2^n+1" />.
			</p>
			<p>
				Angenommen, alle Zahlen in <Katex tex="M" /> haben ihre Primteiler in
				<Katex tex="\{p_1,\dots,p_n\}" />. Gilt
			</p>
			<div class="kbox">
				<Katex as="div" display tex="|M|\ge 3\cdot 2^n+1," />
			</div>
			<p>
				dann gibt es <Katex tex="a,b,c,d\in M" /> paarweise verschieden und ein
				<Katex tex="t\in\mathbb Z" /> mit
			</p>
			<div class="kbox">
				<Katex as="div" display tex="abcd=t^4." />
			</div>
			<p>Für unsere Aufgabe ist <Katex tex="n=9" />. Also:</p>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="3\cdot 2^9+1&=3\cdot 512+1=1537\\|M|=1985&\ge 1537."
				/>
			</div>
			<p>Damit folgt das IMO-Ergebnis direkt aus der allgemeinen Behauptung.</p>
			<p>
				Ab hier benutzen wir nur noch die Schranke <Katex tex="|M|\ge 3\cdot 2^n+1" />;
				die konkrete Zahl <Katex tex="1985" /> ist nur ein Spezialfall davon.
			</p>
		</div>

		<h2 id="schubfachprinzip" class="mt-8">Teil 5 — Herleitung Schritt für Schritt (zweimal Schubfachprinzip)</h2>
		<div class="eddie">
			<p>
				Schubfachprinzip: Verteilt man mehr Objekte als es Schubfächer gibt,
				dann enthält mindestens ein Schubfach mindestens zwei Objekte.
			</p>
			<h3>Stufe A — Wir bilden viele disjunkte Quadrat-Paare</h3>
			<p>
				Ordne jede Zahl <Katex tex="x\in M" /> nach ihrem Paritätsvektor
				<Katex tex="\varepsilon(x)\in\{0,1\}^n" />.
				Sei <Katex tex="c_v" /> die Anzahl der Zahlen in Klasse <Katex tex="v" />.
			</p>
			<p>
				In jeder Klasse können wir paarweise zusammenfassen (1. mit 2., 3. mit 4., ...).
				Das ergibt in Klasse <Katex tex="v" /> genau <Katex tex="\left\lfloor c_v/2\right\rfloor" />
				disjunkte Quadrat-Paare.
				Jedes so gebildete Paar <Katex tex="(a,b)" /> hat ein Quadrat als Produkt, denn
				<Katex tex="\varepsilon(a)=\varepsilon(b)" /> und damit ist <Katex tex="ab" /> ein Quadrat.
			</p>
			<p>Insgesamt also:</p>
			<div class="kbox">
				<Katex as="div" display tex="P=\sum_v\left\lfloor \frac{c_v}{2}\right\rfloor." />
			</div>
			<p>Mit <Katex tex="\left\lfloor c_v/2\right\rfloor\ge (c_v-1)/2" /> folgt:</p>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="P&\ge \sum_v\frac{c_v-1}{2}\\&=\frac{\sum_v c_v-\sum_v 1}{2}\\&=\frac{|M|-2^n}{2}."
				/>
			</div>
			<p>Setzen wir <Katex tex="|M|\ge 3\cdot 2^n+1" /> ein, dann:</p>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="P&\ge \frac{(3\cdot 2^n+1)-2^n}{2}\\&=2^n+\frac12\\&\Rightarrow P\ge 2^n+1."
				/>
			</div>
			<p>Da <Katex tex="P" /> eine ganze Zahl ist, folgt daraus <Katex tex="P\ge 2^n+1" />.</p>
			<p><b>Ergebnis von Stufe A:</b> Mindestens <Katex tex="2^n+1" /> disjunkte Paare <Katex tex="(a,b)" /> mit <Katex tex="ab=u^2" />.</p>

			<h3 class="mt-6">Stufe B — Aus zwei passenden Quadrat-Paaren wird eine vierte Potenz</h3>
			<p>
				Jedes Paar liefert ein Quadrat <Katex tex="ab=u^2" />
				(mit <Katex tex="u\in\mathbb Z" />, weil <Katex tex="ab" /> ein Quadrat ist).
				Für <Katex tex="u" /> schreiben wir
			</p>
			<div class="kbox">
				<Katex as="div" display tex="u=\prod_{j=1}^n p_j^{f_j},\qquad \varepsilon(u)=(f_1,\dots,f_n)\bmod 2\in\{0,1\}^n." />
			</div>
			<p>
				Es gibt nur <Katex tex="2^n" /> mögliche Wurzel-Paritäten, aber mindestens
				<Katex tex="P\ge 2^n+1" /> Paare.
				Also existieren zwei verschiedene Paare <Katex tex="(a,b)\neq(c,d)" /> mit
				<Katex tex="ab=u^2,\ cd=v^2" /> und <Katex tex="\varepsilon(u)=\varepsilon(v)" />.
			</p>
			<p>
				Dann ist nach dem Merksatz aus Teil 3 das Produkt <Katex tex="uv" /> ein Quadrat,
				also <Katex tex="uv=s^2" />, und damit:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="abcd=(u^2)(v^2)=(uv)^2=(s^2)^2=s^4." />
			</div>
			<p>
				Wichtig: Die Paare aus Stufe A sind disjunkt, also haben zwei verschiedene Paare
				keine gemeinsame Zahl. Damit sind <Katex tex="a,b,c,d" /> automatisch vier verschiedene Elemente.
			</p>
			<p>Damit ist die Behauptung bewiesen.</p>
		</div>

		<h2 id="beispiel" class="mt-8">Teil 6 — Mini-Beispiel (nur zur Anschauung)</h2>
		<div class="eddie">
			<p>Betrachte</p>
			<div class="kbox">
				<Katex as="div" display tex="\{6,24,54,216,8,75\}." />
			</div>
			<p>
				Für die ersten vier Zahlen gilt jeweils <Katex tex="x=6\cdot r^2" />
				(mit gleichem quadratfreiem Kern <Katex tex="6" />).
				Hier erhält man sogar:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="6\cdot24\cdot54\cdot216=36^4." />
			</div>
			<EddieComment subtitle="Mini-Eddie-Kommentar">
				<p>
					Nettes Warm-up, oder? Das Beispiel zeigt die Idee zum Anfassen,
					aber der eigentliche IMO-Beweis läuft oben ganz sauber über die
					zwei Schubfach-Schritte - ohne Ratespiel und ohne Glückstreffer.
				</p>
			</EddieComment>
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
					Prüfen
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
	<template #footer>
		<p class="muted">
			Quelle der Aufgabenstellung/Lösungsskizze:
			<a href="https://prase.cz/kalva/imo/isoln/isoln854.html">IMO 1985 B1 (ISL solutions, prase.cz)</a>
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import { ref } from "vue";
import EddieComment from "@/components/EddieComment.vue";
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
