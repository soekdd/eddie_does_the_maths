<template>
<ALCalculation
	:deck
	:error
	:formula-tex
	formula-title="Formel (Horner)"
	:running
	:subtitle="'Kartenfolge für <b>MUL/ADD</b> in einer Horner-Schleife.'"
	:tab
	title="Ada-Karten: Polynom mit Horner"
	:trace-text
	@reset="reset"
	@run="run"
	@update:tab="tab = $event"
>
	<template #intro>
		<template v-if="result">
			<Katex :tex="result.evalTex" />
		</template>
		<template v-else>
			Gib Koeffizienten und einen Wert für <Katex tex="x" /> ein.
		</template>
	</template>

	<template #inputs>
		<v-col cols="12">
			<v-text-field
				v-model="coeffInput"
				density="comfortable"
				label="Koeffizienten (höchster Grad → konstant)"
				placeholder="2, -3, 0, 5"
			/>
		</v-col>

		<v-col cols="12">
			<v-text-field
				v-model="xInput"
				density="comfortable"
				label="x (ganzzahlig)"
				placeholder="4"
			/>
		</v-col>
	</template>

	<template #warning>
		Beispiel: <code>2,-3,0,5</code> bedeutet
		<Katex tex="p(x)=2x^3-3x^2+0x+5" />.
	</template>

	<template #formulaNote>
		Statt Potenzen direkt zu bilden, verwendet das Kartenprogramm nur Multiplikation und Addition.
	</template>

	<template #result>
		<v-row v-if="result" dense>
			<v-col cols="12" md="6">
				<v-card class="pa-4" rounded="xl" variant="tonal">
					<div class="text-caption mb-1">Polynomwert</div>
					<div class="text-h5 font-weight-bold">{{ result.value }}</div>
					<div class="mt-2"><Katex as="div" :display="true" :tex="result.evalTex" /></div>
				</v-card>
			</v-col>

			<v-col cols="12" md="6">
				<v-card class="pa-4" rounded="xl" variant="tonal">
					<div class="text-caption mb-1">Details</div>
					<div class="text-body-1">Grad: {{ result.degree }}</div>
					<div class="text-body-1">x = {{ result.x }}</div>
					<div class="text-caption mt-2">Koeffizienten: {{ result.coefficients }}</div>
				</v-card>
			</v-col>

			<v-col cols="12">
				<v-chip class="me-2" color="green" variant="tonal">
					Horner-Schritte: {{ result.hornerSteps }}
				</v-chip>
				<v-chip variant="tonal">Karten: {{ deck?.length ?? 0 }}</v-chip>
			</v-col>
		</v-row>
	</template>

	<template #store>
		<v-row dense>
			<v-col cols="12" md="4">
				<v-card class="pa-2" rounded="lg" variant="tonal">
					<div class="text-subtitle-2 px-2 py-1">Data columns</div>
					<v-table density="compact">
						<tbody>
							<tr>
								<td><code>V1</code></td>
								<td>Konstante 0</td>
								<td class="mono text-right">{{ storeView(1) }}</td>
							</tr>
							<tr>
								<td><code>V3</code></td>
								<td>x</td>
								<td class="mono text-right">{{ storeView(3) }}</td>
							</tr>
							<tr v-for="entry in coeffStoreEntries" :key="entry.col">
								<td><code>V{{ entry.col }}</code></td>
								<td>{{ entry.label }}</td>
								<td class="mono text-right">{{ storeView(entry.col) }}</td>
							</tr>
						</tbody>
					</v-table>
				</v-card>
			</v-col>

			<v-col cols="12" md="4">
				<v-card class="pa-2" rounded="lg" variant="tonal">
					<div class="text-subtitle-2 px-2 py-1">Working columns</div>
					<v-table density="compact">
						<tbody>
							<tr>
								<td><code>V11</code></td>
								<td>Horner-Akkumulator y</td>
								<td class="mono text-right">{{ storeView(11) }}</td>
							</tr>
						</tbody>
					</v-table>
				</v-card>
			</v-col>

			<v-col cols="12" md="4">
				<v-card class="pa-2" rounded="lg" variant="tonal">
					<div class="text-subtitle-2 px-2 py-1">Result columns</div>
					<v-table density="compact">
						<tbody>
							<tr>
								<td><code>V21</code></td>
								<td>p(x)</td>
								<td class="mono text-right">{{ storeView(21) }}</td>
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
			Jede Koeffizientenkarte erzeugt genau zwei Mill-Operationen: <code>MUL</code>, dann <code>ADD</code>.
		</v-alert>
	</template>
</ALCalculation>
</template>

<script setup>
import { ref } from "vue";

import ALCalculation from "./AL_Calculation.vue";

class IntVM {
	constructor( { storeSize = 96, trace = false } = {} ) {
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
			default:
				throw new Error( "Unknown op: " + card.op );
		}

		this.setV( card.dest, r );
		this.step++;

		if ( this.trace ) {
			this.logs.push( `#${String( this.step ).padStart( 2, "0" )} L${
				card.line} ${card.label || ""} | ${card.op} -> V${card.dest} = ${r.toString()}` );
		}
	}

	run( deck ) {
		for ( const c of deck ) {
			this.exec( c );
		}
	}
}

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

function parseCoeffList( raw ) {
	const parts = String( raw ?? "" )
		.split( "," )
		.map( ( x ) => x.trim() )
		.filter( Boolean );

	if ( parts.length === 0 ) {
		throw new Error( "Koeffizienten: Bitte mindestens einen Wert eingeben." );
	}

	return parts.map( ( p, i ) => {
		if ( !/^[-+]?\d+$/.test( p ) ) {
			throw new Error( `Koeffizient #${i + 1}: bitte ganze Zahl angeben.` );
		}

		return BigInt( p );
	} );
}

function coeffToLatex(
	c, power, isFirst
) {
	const neg = c < 0n;
	const abs = neg ? -c : c;

	if ( abs === 0n ) {
		if ( power === 0 ) {
			return isFirst ? "0" : "+0";
		}

		return isFirst ? "0" : "+0";
	}

	let core = "";

	if ( power === 0 ) {
		core = abs.toString();
	} else if ( power === 1 ) {
		core = abs === 1n ? "x" : `${abs.toString()}x`;
	} else {
		core = abs === 1n ? `x^{${power}}` : `${abs.toString()}x^{${power}}`;
	}

	if ( isFirst ) {
		return neg ? `-${core}` : core;
	}

	return neg ? `-${core}` : `+${core}`;
}

function polynomialLatex( coeffs ) {
	const degree = coeffs.length - 1;
	return coeffs
		.map( ( c, i ) => coeffToLatex(
			c, degree - i, i === 0
		) )
		.join( " " );
}

function buildHornerDeck( coeffCols ) {
	const deck = [];
	let line = 1;

	deck.push( {
		line:  line++,
		op:    "ADD",
		a:     { V: coeffCols[ 0 ] },
		b:     { V: 1 },
		dest:  11,
		label: "init y:=a_m"
	} );

	for ( let i = 1; i < coeffCols.length; i++ ) {
		deck.push( {
			line:  line++,
			op:    "MUL",
			a:     { V: 11 },
			b:     { V: 3 },
			dest:  11,
			label: `[${i}] y:=y*x`
		} );

		deck.push( {
			line:  line++,
			op:    "ADD",
			a:     { V: 11 },
			b:     { V: coeffCols[ i ] },
			dest:  11,
			label: `[${i}] y:=y+a_${coeffCols.length - 1 - i}`
		} );
	}

	deck.push( {
		line:  line++,
		op:    "ADD",
		a:     { V: 11 },
		b:     { V: 1 },
		dest:  21,
		label: "output p(x)"
	} );

	return deck;
}

const DEFAULT_COEFFS = "2,-3,0,5";
const DEFAULT_X = "4";

const coeffInput = ref( DEFAULT_COEFFS );
const xInput = ref( DEFAULT_X );

const running = ref( false );
const error = ref( "" );
const result = ref( null );

const deck = ref( [] );
const traceText = ref( "" );
const store = ref( null );
const coeffStoreEntries = ref( [] );

const tab = ref( "deck" );

const formulaTex = String.raw`
p(x)=a_mx^m+a_{m-1}x^{m-1}+\cdots+a_0\\
y_0:=a_m,\quad y_{k+1}:=y_k\cdot x+a_{m-1-k},\quad p(x)=y_m
`;

function storeView( i ) {
	if ( !store.value ) {
		return "";
	}

	const v = store.value[ i ];
	return v == null ? "0" : v.toString();
}

function reset() {
	coeffInput.value = DEFAULT_COEFFS;
	xInput.value = DEFAULT_X;
	running.value = false;
	error.value = "";
	result.value = null;
	deck.value = [];
	traceText.value = "";
	store.value = null;
	coeffStoreEntries.value = [];
	tab.value = "deck";
}

async function run() {
	running.value = true;
	error.value = "";
	result.value = null;

	try {
		const coeffs = parseCoeffList( coeffInput.value );
		const x = parseBigIntInput( xInput.value, "x" );

		const vm = new IntVM( { storeSize: 96, trace: true } );
		vm.setV( 1, 0n );
		vm.setV( 3, x );

		const degree = coeffs.length - 1;
		const coeffCols = coeffs.map( ( c, i ) => {
			const col = 31 + i;
			vm.setV( col, c );
			return col;
		} );

		coeffStoreEntries.value = coeffCols.map( ( col, i ) => ( {
			col,
			label: `a_${degree - i}`
		} ) );

		const d = buildHornerDeck( coeffCols );
		deck.value = d;
		vm.run( d );

		const value = vm.getV( 21 );
		const polyLatex = polynomialLatex( coeffs );

		result.value = {
			value:        value.toString(),
			x:            x.toString(),
			degree:       degree.toString(),
			coefficients: coeffs.map( ( c ) => c.toString() ).join( ", " ),
			hornerSteps:  Math.max( coeffs.length - 1, 0 ).toString(),
			evalTex:      String.raw`p(${x.toString()})=${polyLatex}=${value.toString()}`
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
