<template>
<v-container class="py-6" fluid>
	<v-row>
		<v-col cols="12" md="5">
			<v-card class="pa-4" rounded="xl">
				<v-card-title class="text-h6">Ada-Karten: Brüche kürzen</v-card-title>
				<v-card-subtitle>
					Ada-streng: <b>Data / Working / Result</b>-Spalten und Euklid-Loop.
				</v-card-subtitle>

				<v-divider class="my-4" />

				<v-row dense>
					<v-col cols="12">
						<v-alert class="mb-2"
							density="compact"
							type="info"
							variant="tonal"
						>
							<template v-if="result">
								Ergebnis für
								<code>{{ result.numIn }}/{{ result.denIn }}</code>:
								<b><Katex :tex="result.reducedTex" /></b>
								mit <Katex :tex="`\\gcd(${result.absNumIn},${result.absDenIn})=${result.gcd}`" />.
							</template>
							<template v-else>
								Gib Zähler und Nenner ein und führe das Kartenprogramm aus.
							</template>
						</v-alert>
					</v-col>

					<v-col cols="12" sm="6">
						<v-text-field
							v-model="numerator"
							density="comfortable"
							label="Zähler z (ganzzahlig)"
							placeholder="48"
						/>
					</v-col>
					<v-col cols="12" sm="6">
						<v-text-field
							v-model="denominator"
							density="comfortable"
							label="Nenner n (ganzzahlig)"
							placeholder="18"
						/>
					</v-col>

					<v-col cols="12">
						<v-alert density="compact" type="warning" variant="tonal">
							Nenner <Katex tex="n" /> darf nicht <code>0</code> sein. Bei negativem Nenner wird das
							Vorzeichen nach oben gezogen, damit <Katex tex="n>0" /> bleibt.
						</v-alert>
					</v-col>

					<v-col class="d-flex ga-2" cols="12">
						<v-btn color="primary"
							:loading="running"
							rounded="xl"
							@click="run"
						>
							Ausführen
						</v-btn>
						<v-btn rounded="xl" variant="tonal" @click="reset">
							Reset
						</v-btn>
					</v-col>
				</v-row>
			</v-card>

			<v-card class="pa-4 mt-4" rounded="xl">
				<v-card-title class="text-h6">Programm (Euklid-Stil)</v-card-title>
				<v-card-text>
					<KaTeXBlock :tex="programTex" />
					<div class="text-body-2 mt-3">
						Das Kartenprogramm berechnet erst <Katex tex="g=\gcd(z,n)" /> und teilt dann
						<Katex tex="z'=\frac{z}{g},\;n'=\frac{n}{g}" />.
					</div>
				</v-card-text>
			</v-card>
		</v-col>

		<v-col cols="12" md="7">
			<v-card class="pa-4" rounded="xl">
				<v-card-title class="text-h6">Ergebnis</v-card-title>

				<v-divider class="my-4" />

				<div v-if="error" class="mb-3">
					<v-alert density="comfortable" type="error" variant="tonal">
						{{ error }}
					</v-alert>
				</div>

				<v-row v-if="result" dense>
					<v-col cols="12" md="6">
						<v-card class="pa-4" rounded="xl" variant="tonal">
							<div class="text-caption mb-1">Gekürzter Bruch</div>
							<div class="text-h5 font-weight-bold">
								{{ result.numOut }}/{{ result.denOut }}
							</div>
							<div class="mt-2">
								<KaTeXBlock :tex="result.reducedTex" />
							</div>
						</v-card>
					</v-col>

					<v-col cols="12" md="6">
						<v-card class="pa-4" rounded="xl" variant="tonal">
							<div class="text-caption mb-1">ggT und Dezimalwert</div>
							<div class="text-h6 font-weight-medium">
								<Katex :tex="`g=${result.gcd}`" />
							</div>
							<div class="text-h6 font-weight-medium mt-1">
								{{ result.decimal }}
							</div>
							<div class="text-caption mt-2">
								(auf 6 Nachkommastellen gerundet)
							</div>
						</v-card>
					</v-col>

					<v-col cols="12">
						<v-chip class="me-2" color="green" variant="tonal">
							Loops: {{ result.iterations }}
						</v-chip>
						<v-chip variant="tonal">
							Karten: {{ deck?.length ?? 0 }}
						</v-chip>
					</v-col>
				</v-row>

				<v-divider class="my-4" />

				<v-tabs v-model="tab" color="primary">
					<v-tab value="deck">Kartendeck</v-tab>
					<v-tab value="trace">Trace</v-tab>
					<v-tab value="store">Store-Snapshot</v-tab>
				</v-tabs>

				<v-window v-model="tab" class="mt-3">
					<v-window-item value="deck">
						<v-table density="compact">
							<thead>
								<tr>
									<th style="width: 70px;">#</th>
									<th style="width: 90px;">Note-G</th>
									<th>Label</th>
									<th style="width: 110px;">Op</th>
									<th style="width: 150px;">Ziel</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(c, i) in deck" :key="i">
									<td>{{ i + 1 }}</td>
									<td><code>L{{ c.line }}</code></td>
									<td>{{ c.label || "" }}</td>
									<td><code>{{ c.op }}</code></td>
									<td>
										<code v-if="Array.isArray(c.dest)">{{ c.dest.map((d) => "V" + d).join(", ") }}</code>
										<code v-else>V{{ c.dest }}</code>
									</td>
								</tr>
							</tbody>
						</v-table>
					</v-window-item>

					<v-window-item value="trace">
						<v-textarea
							v-model="traceText"
							auto-grow
							label="Karten-Log"
							readonly
							rows="16"
						/>
					</v-window-item>

					<v-window-item value="store">
						<v-row dense>
							<v-col v-for="section in storeLayout"
								:key="section.key"
								cols="12"
								md="4"
							>
								<v-card class="pa-2" rounded="lg" variant="tonal">
									<div class="text-subtitle-2 px-2 py-1">{{ section.title }}</div>
									<v-table density="compact">
										<thead>
											<tr>
												<th>Spalte</th>
												<th>Rolle</th>
												<th class="text-right">Wert</th>
											</tr>
										</thead>
										<tbody>
											<tr v-for="entry in section.entries" :key="`${section.key}-${entry.col}`">
												<td><code>V{{ entry.col }}</code></td>
												<td>{{ entry.label }}</td>
												<td class="mono text-right">{{ storeView(entry.col) }}</td>
											</tr>
										</tbody>
									</v-table>
								</v-card>
							</v-col>
						</v-row>
						<v-alert class="mt-3"
							density="compact"
							type="info"
							variant="tonal"
						>
							Das Programm nutzt den Euklid-Loop (L4…L9), danach werden Zähler und Nenner durch den ggT geteilt.
						</v-alert>
					</v-window-item>
				</v-window>
			</v-card>
		</v-col>
	</v-row>
</v-container>
</template>

<script setup>
import { ref } from "vue";
import katex from "katex";
import "katex/dist/katex.min.css";

const KaTeXBlock = {
	props:    { tex: { type: String, required: true } },
	computed: {
		html() {
			try {
				return katex.renderToString( this.tex, {
					throwOnError: false,
					displayMode:  true
				} );
			} catch ( e ) {
				return `<pre>${String( e )}</pre>`;
			}
		}
	},
	template: "<div v-html=\"html\" class=\"katex-wrap\"></div>"
};

const bigAbs = ( x ) => x < 0n ? -x : x;

function gcd( a, b ) {
	a = bigAbs( a );
	b = bigAbs( b );

	while ( b !== 0n ) {
		const t = a % b;
		a = b;
		b = t;
	}

	return a;
}

class IntVM {
	constructor( { storeSize = 64, trace = false } = {} ) {
		this.V = Array.from( { length: storeSize + 1 }, () => 0n );
		this.trace = trace;
		this.step = 0;
		this.logs = [];
	}

	setV( i, v ) {
		this.V[ i ] = v;
	}

	getV( i ) {
		return this.V[ i ];
	}

	exec( card ) {
		const read = ( x ) => {
			if ( x.V != null ) {
				return this.getV( x.V );
			}

			if ( x.I != null ) {
				return BigInt( x.I );
			}

			throw new Error( "Bad operand: " + JSON.stringify( x ) );
		};

		const a = read( card.a );
		const b = read( card.b );

		let r = 0n;

		switch ( card.op ) {
			case "ADD": r = a + b; break;
			case "SUB": r = a - b; break;
			case "MUL": r = a * b; break;
			case "DIV":
				if ( b === 0n ) {
					throw new Error( "Division durch 0 im Kartenprogramm." );
				}

				r = a / b;
				break;
			default: throw new Error( "Unknown op: " + card.op );
		}

		const dests = Array.isArray( card.dest ) ? card.dest : [ card.dest ];

		for ( const d of dests ) {
			this.setV( d, r );
		}

		this.step++;

		if ( this.trace ) {
			const dLabel = dests.map( ( d ) => `V${d}` ).join( "," );
			this.logs.push( `#${String( this.step ).padStart( 2, "0" )} L${
				card.line} ${card.label || ""} | ${card.op} → ${dLabel} = ${r.toString()}` );
		}
	}

	run( deck ) {
		for ( const c of deck ) {
			this.exec( c );
		}
	}
}

function buildReduceDeck( absNum, absDen ) {
	const deck = [];
	const push = ( line, card ) => deck.push( { line, ...card } );

	push( 1, {
		op: "ADD", a: { V: 5 }, b: { V: 1 }, dest: 11, label: "a:=|z|"
	} );
	push( 2, {
		op: "ADD", a: { V: 6 }, b: { V: 1 }, dest: 12, label: "b:=|n|"
	} );
	push( 3, {
		op: "ADD", a: { I: 0 }, b: { I: 0 }, dest: 16, label: "iter:=0"
	} );

	let a = absNum;
	let b = absDen;
	let guard = 0;

	while ( b !== 0n ) {
		guard++;

		if ( guard > 512 ) {
			throw new Error( "Zu viele Schleifendurchläufe im Euklid-Loop." );
		}

		const q = a / b;
		const t = q * b;
		const r = a - t;

		push( 4, {
			op: "DIV", a: { V: 11 }, b: { V: 12 }, dest: 13, label: `[${guard}] q:=a/b`
		} );
		push( 5, {
			op: "MUL", a: { V: 13 }, b: { V: 12 }, dest: 14, label: `[${guard}] t:=q*b`
		} );
		push( 6, {
			op: "SUB", a: { V: 11 }, b: { V: 14 }, dest: 15, label: `[${guard}] r:=a-t`
		} );
		push( 7, {
			op: "ADD", a: { V: 12 }, b: { V: 1 }, dest: 11, label: `[${guard}] a:=b`
		} );
		push( 8, {
			op: "ADD", a: { V: 15 }, b: { V: 1 }, dest: 12, label: `[${guard}] b:=r`
		} );
		push( 9, {
			op: "ADD", a: { V: 16 }, b: { V: 2 }, dest: 16, label: `[${guard}] iter++`
		} );

		a = b;
		b = r;
	}

	push( 10, {
		op: "ADD", a: { V: 11 }, b: { V: 1 }, dest: 21, label: "g:=a"
	} );
	push( 11, {
		op: "DIV", a: { V: 3 }, b: { V: 21 }, dest: 22, label: "z':=z/g"
	} );
	push( 12, {
		op: "DIV", a: { V: 4 }, b: { V: 21 }, dest: 23, label: "n':=n/g"
	} );

	return deck;
}

const DEFAULT_NUMERATOR = "48";
const DEFAULT_DENOMINATOR = "18";

const numerator = ref( DEFAULT_NUMERATOR );
const denominator = ref( DEFAULT_DENOMINATOR );

const running = ref( false );
const error = ref( "" );
const result = ref( null );

const deck = ref( [] );
const traceText = ref( "" );
const store = ref( null );

const tab = ref( "deck" );

const programTex = String.raw`
a:=|z|,\;b:=|n| \\
\text{while } b\neq 0:\; q:=\left\lfloor\frac{a}{b}\right\rfloor,\; r:=a-qb,\; a:=b,\; b:=r \\
g:=a,\; z':=\frac{z}{g},\; n':=\frac{n}{g}
`;

const storeLayout = [
	{
		key:     "data",
		title:   "Data columns",
		entries: [
			{ col: 1, label: "Konstante 0" },
			{ col: 2, label: "Konstante 1" },
			{ col: 3, label: "z (normalisiert)" },
			{ col: 4, label: "n (>0)" },
			{ col: 5, label: "|z|" },
			{ col: 6, label: "|n|" }
		]
	},
	{
		key:     "working",
		title:   "Working columns",
		entries: [
			{ col: 11, label: "a" },
			{ col: 12, label: "b" },
			{ col: 13, label: "q" },
			{ col: 14, label: "t=q·b" },
			{ col: 15, label: "r" },
			{ col: 16, label: "Loopzähler" }
		]
	},
	{
		key:     "result",
		title:   "Result columns",
		entries: [
			{ col: 21, label: "ggT g" },
			{ col: 22, label: "z'=z/g" },
			{ col: 23, label: "n'=n/g" }
		]
	}
];

function parseBigIntInput( v, label ) {
	const t = String( v ?? "" ).trim();

	if ( !t ) {
		throw new Error( `${label}: leer.` );
	}

	if ( !/^[-+]?\d+$/.test( t ) ) {
		throw new Error( `${label}: Bitte ganze Zahl eingeben.` );
	}

	return BigInt( t );
}

function toKaTeXFrac( fracStr ) {
	const s = String( fracStr );

	if ( !s.includes( "/" ) ) {
		return s;
	}

	const [ a, b ] = s.split( "/" );
	return String.raw`\frac{${a}}{${b}}`;
}

function toDecimalRounded(
	num, den, digits = 6
) {
	const sign = num < 0n ? "-" : "";
	const n = bigAbs( num );
	const d = den;

	let intPart = n / d;
	const rem = n % d;

	const scale = 10n ** BigInt( digits );
	let frac = rem * scale / d;
	const tailRem = rem * scale % d;

	if ( 2n * tailRem >= d ) {
		frac += 1n;
	}

	if ( frac >= scale ) {
		intPart += 1n;
		frac -= scale;
	}

	return `${sign}${intPart.toString()},${frac.toString().padStart( digits, "0" )}`;
}

function storeView( i ) {
	if ( !store.value ) {
		return "";
	}

	const v = store.value[ i ];
	return v == null ? "0" : v.toString();
}

function reset() {
	numerator.value = DEFAULT_NUMERATOR;
	denominator.value = DEFAULT_DENOMINATOR;
	error.value = "";
	result.value = null;
	deck.value = [];
	traceText.value = "";
	store.value = null;
	tab.value = "deck";
}

async function run() {
	running.value = true;
	error.value = "";
	result.value = null;

	try {
		let z = parseBigIntInput( numerator.value, "Zähler" );
		let n = parseBigIntInput( denominator.value, "Nenner" );

		if ( n === 0n ) {
			throw new Error( "Nenner darf nicht 0 sein." );
		}

		if ( n < 0n ) {
			z = -z;
			n = -n;
		}

		const absZ = bigAbs( z );
		const absN = bigAbs( n );

		const vm = new IntVM( { storeSize: 64, trace: true } );

		vm.setV( 1, 0n );
		vm.setV( 2, 1n );
		vm.setV( 3, z );
		vm.setV( 4, n );
		vm.setV( 5, absZ );
		vm.setV( 6, absN );

		const d = buildReduceDeck( absZ, absN );
		deck.value = d;

		vm.run( d );

		const g = vm.getV( 21 );
		const zOut = vm.getV( 22 );
		const nOut = vm.getV( 23 );

		result.value = {
			numIn:    z.toString(),
			denIn:    n.toString(),
			absNumIn: absZ.toString(),
			absDenIn: absN.toString(),
			gcd:      g.toString(),
			numOut:   zOut.toString(),
			denOut:   nOut.toString(),
			reducedTex:
        String.raw`\frac{${z.toString()}}{${n.toString()}}=\frac{${zOut.toString()}}{${nOut.toString()}}`,
			decimal: toDecimalRounded(
				zOut, nOut, 6
			),
			iterations: vm.getV( 16 ).toString()
		};

		traceText.value = vm.logs.join( "\n" );
		store.value = vm.V;
		tab.value = "trace";
	} catch ( e ) {
		error.value = e?.message ? String( e.message ) : String( e );
	} finally {
		running.value = false;
	}
}
</script>

<style scoped>
.katex-wrap :deep(.katex-display) {
  margin: 0.25rem 0;
}
</style>
