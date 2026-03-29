<!-- i18n-ally-scope: useI18n("book1.AL") -->
<template>
<ALCalculation
	:deck
	:error
	:formula-tex
	:formula-title="t( 'sqrt.formulaTitle' )"
	:running
	:subtitle="t( 'sqrt.subtitle' )"
	:tab
	:title="t( 'sqrt.title' )"
	:trace-text
	@reset="reset"
	@run="run"
	@update:tab="tab = $event"
>
	<template #intro>
		<template v-if="result">
			{{ t( "sqrt.intro.result", { iterations: result.iterations } ) }}
			<b><Katex :tex="`x\\approx${toKaTeXFrac(result.approxFrac)}`" /></b>
		</template>
		<template v-else>
			<span v-html="t( 'sqrt.intro.empty' )" />
		</template>
	</template>

	<template #inputs>
		<v-col cols="12" sm="6">
			<v-text-field
				v-model="nInput"
				density="comfortable"
				:label="t( 'sqrt.inputs.n' )"
				placeholder="2"
			/>
		</v-col>

		<v-col cols="12" sm="6">
			<v-text-field
				v-model="iterInput"
				density="comfortable"
				:label="t( 'sqrt.inputs.iterations' )"
				placeholder="6"
			/>
		</v-col>

		<v-col cols="12">
			<v-text-field
				v-model="x0Input"
				density="comfortable"
				:label="t( 'sqrt.inputs.x0' )"
				placeholder="1"
			/>
		</v-col>
	</template>

	<template #warning>
		<span v-html="t( 'sqrt.warning' )" />
	</template>

	<template #formulaNote>
		<span v-html="t( 'sqrt.formulaNote' )" />
	</template>

	<template #result>
		<v-row v-if="result" dense>
			<v-col cols="12" md="6">
				<v-card class="pa-4" rounded="xl" variant="tonal">
					<div class="text-caption mb-1">{{ t( "sqrt.result.approximation" ) }}</div>
					<div class="text-h5 font-weight-bold">{{ result.approxFrac }}</div>
					<div class="mt-2"><Katex as="div" :display="true" :tex="result.evalTex" /></div>
				</v-card>
			</v-col>

			<v-col cols="12" md="6">
				<v-card class="pa-4" rounded="xl" variant="tonal">
					<div class="text-caption mb-1">{{ t( "sqrt.result.decimalError" ) }}</div>
					<div class="text-h6 font-weight-medium">{{ result.approxDecimal }}</div>
					<div class="text-body-2 mt-1">{{ t( "sqrt.result.error", { value: result.errorDecimal } ) }}</div>
					<div class="text-caption mt-2">{{ t( "sqrt.result.decimalNote" ) }}</div>
				</v-card>
			</v-col>

			<v-col cols="12">
				<v-chip class="me-2" color="green" variant="tonal">
					{{ t( "sqrt.result.iterations", { count: result.iterations } ) }}
				</v-chip>
				<v-chip variant="tonal">{{ t( "sqrt.result.cards", { count: deck?.length ?? 0 } ) }}</v-chip>
			</v-col>
		</v-row>
	</template>

	<template #store>
		<v-row dense>
			<v-col cols="12" md="4">
				<v-card class="pa-2" rounded="lg" variant="tonal">
					<div class="text-subtitle-2 px-2 py-1">{{ t( "common.dataColumns" ) }}</div>
					<v-table density="compact">
						<tbody>
							<tr><td><code>V1</code></td><td>0</td><td class="mono text-right">{{ storeView(1) }}</td></tr>
							<tr><td><code>V2</code></td><td>2</td><td class="mono text-right">{{ storeView(2) }}</td></tr>
							<tr><td><code>V3</code></td><td>N</td><td class="mono text-right">{{ storeView(3) }}</td></tr>
							<tr><td><code>V4</code></td><td>x0</td><td class="mono text-right">{{ storeView(4) }}</td></tr>
							<tr><td><code>V5</code></td><td>1</td><td class="mono text-right">{{ storeView(5) }}</td></tr>
						</tbody>
					</v-table>
				</v-card>
			</v-col>

			<v-col cols="12" md="4">
				<v-card class="pa-2" rounded="lg" variant="tonal">
					<div class="text-subtitle-2 px-2 py-1">{{ t( "common.workingColumns" ) }}</div>
					<v-table density="compact">
						<tbody>
							<tr><td><code>V11</code></td><td>x_k</td><td class="mono text-right">{{ storeView(11) }}</td></tr>
							<tr><td><code>V12</code></td><td>N/x_k</td><td class="mono text-right">{{ storeView(12) }}</td></tr>
							<tr><td><code>V13</code></td><td>{{ t( "sqrt.store.sum" ) }}</td><td class="mono text-right">{{ storeView(13) }}</td></tr>
							<tr><td><code>V14</code></td><td>x_{k+1}</td><td class="mono text-right">{{ storeView(14) }}</td></tr>
							<tr>
								<td><code>V16</code></td>
								<td>{{ t( "sqrt.store.loopCounter" ) }}</td>
								<td class="mono text-right">{{ storeView(16) }}</td>
							</tr>
						</tbody>
					</v-table>
				</v-card>
			</v-col>

			<v-col cols="12" md="4">
				<v-card class="pa-2" rounded="lg" variant="tonal">
					<div class="text-subtitle-2 px-2 py-1">{{ t( "common.resultColumns" ) }}</div>
					<v-table density="compact">
						<tbody>
							<tr>
								<td><code>V21</code></td>
								<td>{{ t( "sqrt.store.approximation" ) }}</td>
								<td class="mono text-right">{{ storeView(21) }}</td>
							</tr>
							<tr><td><code>V22</code></td><td>x^2</td><td class="mono text-right">{{ storeView(22) }}</td></tr>
							<tr><td><code>V23</code></td><td>x^2-N</td><td class="mono text-right">{{ storeView(23) }}</td></tr>
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
			<span v-html="t( 'sqrt.store.info' )" />
		</v-alert>
	</template>
</ALCalculation>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "@/utils/i18n.mjs";

import ALCalculation from "./AL_Calculation.vue";

const { t } = useI18n( "book1.AL" );

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

class Rat {
	constructor( num, den = 1n ) {
		if ( den === 0n ) {
			throw new Error( t( "common.errors.divisionByZeroCard" ) );
		}

		if ( den < 0n ) {
			num = -num;
			den = -den;
		}

		const g = gcd( num, den );
		this.num = num / g;
		this.den = den / g;
	}

	static ofInt( n ) {
		return new Rat( BigInt( n ), 1n );
	}

	add( r ) {
		return new Rat( this.num * r.den + r.num * this.den, this.den * r.den );
	}

	sub( r ) {
		return new Rat( this.num * r.den - r.num * this.den, this.den * r.den );
	}

	mul( r ) {
		return new Rat( this.num * r.num, this.den * r.den );
	}

	div( r ) {
		if ( r.num === 0n ) {
			throw new Error( t( "common.errors.divisionByZeroCard" ) );
		}

		return new Rat( this.num * r.den, this.den * r.num );
	}

	toString() {
		if ( this.den === 1n ) {
			return this.num.toString();
		}

		return `${this.num.toString()}/${this.den.toString()}`;
	}

	toDecimalRounded( digits = 6 ) {
		const sign = this.num < 0n ? "-" : "";
		let n = bigAbs( this.num );
		let d = this.den;

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
}

class RatVM {
	constructor( { storeSize = 96, trace = false } = {} ) {
		this.V = Array.from( { length: storeSize + 1 }, () => Rat.ofInt( 0 ) );
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
				return Rat.ofInt( x.I );
			}

			throw new Error( t( "common.errors.badOperand", { value: JSON.stringify( x ) } ) );
		};

		const a = read( card.a );
		const b = read( card.b );

		let r = Rat.ofInt( 0 );

		switch ( card.op ) {
			case "ADD": r = a.add( b ); break;
			case "SUB": r = a.sub( b ); break;
			case "MUL": r = a.mul( b ); break;
			case "DIV": r = a.div( b ); break;
			default:
				throw new Error( t( "common.errors.unknownOp", { value: card.op } ) );
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
	const text = String( v ?? "" ).trim();

	if ( !text ) {
		throw new Error( t( "common.errors.empty", { label } ) );
	}

	if ( !/^[-+]?\d+$/.test( text ) ) {
		throw new Error( t( "common.errors.integer", { label } ) );
	}

	return BigInt( text );
}

function parseRatInput( v, label ) {
	const text = String( v ?? "" ).trim();

	if ( !text ) {
		throw new Error( t( "common.errors.empty", { label } ) );
	}

	if ( /^[-+]?\d+$/.test( text ) ) {
		return new Rat( BigInt( text ), 1n );
	}

	if ( /^[-+]?\d+\s*\/\s*[-+]?\d+$/.test( text ) ) {
		const [ a, b ] = text.split( "/" ).map( ( x ) => x.trim() );
		const den = BigInt( b );

		if ( den === 0n ) {
			throw new Error( t( "sqrt.errors.denominatorZero", { label } ) );
		}

		return new Rat( BigInt( a ), den );
	}

	throw new Error( t( "sqrt.errors.ratFormat", { label } ) );
}

function toKaTeXFrac( fracStr ) {
	const s = String( fracStr );

	if ( !s.includes( "/" ) ) {
		return s;
	}

	const [ a, b ] = s.split( "/" );
	return String.raw`\frac{${a}}{${b}}`;
}

function buildSqrtDeck( iterations ) {
	const deck = [];
	let line = 1;

	deck.push( {
		line: line++, op: "ADD", a: { V: 4 }, b: { V: 1 }, dest: 11, label: t( "sqrt.deck.initX" )
	} );
	deck.push( {
		line: line++, op: "ADD", a: { V: 1 }, b: { V: 1 }, dest: 16, label: t( "sqrt.deck.initIter" )
	} );

	for ( let k = 1; k <= iterations; k++ ) {
		deck.push( {
			line: line++, op: "DIV", a: { V: 3 }, b: { V: 11 }, dest: 12, label: t( "sqrt.deck.div", { step: k } )
		} );
		deck.push( {
			line: line++, op: "ADD", a: { V: 11 }, b: { V: 12 }, dest: 13, label: t( "sqrt.deck.add", { step: k } )
		} );
		deck.push( {
			line: line++, op: "DIV", a: { V: 13 }, b: { V: 2 }, dest: 14, label: t( "sqrt.deck.halve", { step: k } )
		} );
		deck.push( {
			line: line++, op: "ADD", a: { V: 14 }, b: { V: 1 }, dest: 11, label: t( "sqrt.deck.next", { step: k } )
		} );
		deck.push( {
			line: line++, op: "ADD", a: { V: 16 }, b: { V: 5 }, dest: 16, label: t( "sqrt.deck.iter", { step: k } )
		} );
	}

	deck.push( {
		line: line++, op: "ADD", a: { V: 11 }, b: { V: 1 }, dest: 21, label: t( "sqrt.deck.output" )
	} );
	deck.push( {
		line: line++, op: "MUL", a: { V: 21 }, b: { V: 21 }, dest: 22, label: t( "sqrt.deck.square" )
	} );
	deck.push( {
		line: line++, op: "SUB", a: { V: 22 }, b: { V: 3 }, dest: 23, label: t( "sqrt.deck.delta" )
	} );

	return deck;
}

const DEFAULT_N = "2";
const DEFAULT_X0 = "1";
const DEFAULT_ITERS = "6";

const nInput = ref( DEFAULT_N );
const x0Input = ref( DEFAULT_X0 );
const iterInput = ref( DEFAULT_ITERS );

const running = ref( false );
const error = ref( "" );
const result = ref( null );

const deck = ref( [] );
const traceText = ref( "" );
const store = ref( null );
const tab = ref( "deck" );

const formulaTex = computed( () => String.raw`
x_{k+1}=\frac{1}{2}\left(x_k+\frac{N}{x_k}\right)\\
\text{start }x_0>0,\;\text{then }x_k\to\sqrt{N}
` );

function storeView( i ) {
	if ( !store.value ) {
		return "";
	}

	const v = store.value[ i ];
	return v == null ? "0" : v.toString();
}

function reset() {
	nInput.value = DEFAULT_N;
	x0Input.value = DEFAULT_X0;
	iterInput.value = DEFAULT_ITERS;
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
		const N = parseBigIntInput( nInput.value, "N" );
		const iterationsBig = parseBigIntInput( iterInput.value, t( "sqrt.inputs.iterations" ) );
		const x0 = parseRatInput( x0Input.value, "x0" );

		if ( N <= 0n ) {
			throw new Error( t( "sqrt.errors.positiveN" ) );
		}

		if ( iterationsBig < 1n || iterationsBig > 20n ) {
			throw new Error( t( "sqrt.errors.iterationsRange" ) );
		}

		if ( x0.num === 0n ) {
			throw new Error( t( "sqrt.errors.x0Zero" ) );
		}

		const iterations = Number( iterationsBig );

		const vm = new RatVM( { storeSize: 96, trace: true } );
		vm.setV( 1, Rat.ofInt( 0 ) );
		vm.setV( 2, Rat.ofInt( 2 ) );
		vm.setV( 3, Rat.ofInt( N ) );
		vm.setV( 4, x0 );
		vm.setV( 5, Rat.ofInt( 1 ) );

		const d = buildSqrtDeck( iterations );
		deck.value = d;

		vm.run( d );

		const approx = vm.getV( 21 );
		const err = vm.getV( 23 );

		result.value = {
			n:             N.toString(),
			iterations:    iterations.toString(),
			approxFrac:    approx.toString(),
			approxDecimal: approx.toDecimalRounded( 6 ),
			errorFrac:     err.toString(),
			errorDecimal:  err.toDecimalRounded( 6 ),
			evalTex:       String.raw`x\approx\sqrt{${N.toString()}}\approx${toKaTeXFrac( approx.toString() )}`
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
