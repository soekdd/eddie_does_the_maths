<!-- i18n-ally-scope: useI18n("book1.AL") -->
<template>
<ALCalculation
	:deck
	:error
	:formula-tex
	:formula-title="t( 'primeTest.formulaTitle' )"
	:running
	:subtitle="t( 'primeTest.subtitle' )"
	:tab
	:title="t( 'primeTest.title' )"
	:trace-text
	@reset="reset"
	@run="run"
	@update:tab="tab = $event"
>
	<template #intro>
		<template v-if="result">
			<span
				v-if="result.isPrime"
				v-html="t( 'primeTest.intro.prime', { n: result.n } )"
			/>
			<span
				v-else
				v-html="t( 'primeTest.intro.composite', {
					n:       result.n,
					divisor: result.divisor
				} )"
			/>
		</template>
		<template v-else>
			<span v-html="t( 'primeTest.intro.empty' )" />
		</template>
	</template>

	<template #inputs>
		<v-col cols="12">
			<v-text-field
				v-model="nInput"
				density="comfortable"
				:label="t( 'primeTest.inputs.n' )"
				placeholder="91"
			/>
		</v-col>
	</template>

	<template #warning>
		<span v-html="t( 'primeTest.warning' )" />
	</template>

	<template #formulaNote>
		<span v-html="t( 'primeTest.formulaNote' )" />
	</template>

	<template #result>
		<v-row v-if="result" dense>
			<v-col cols="12" md="6">
				<v-card class="pa-4" rounded="xl" variant="tonal">
					<div class="text-caption mb-1">{{ t( "primeTest.result.classification" ) }}</div>
					<div class="text-h5 font-weight-bold">
						{{ result.isPrime ? t( "primeTest.result.prime" ) : t( "primeTest.result.composite" ) }}
					</div>
					<div class="text-body-2 mt-2">
						{{ result.description }}
					</div>
				</v-card>
			</v-col>

			<v-col cols="12" md="6">
				<v-card class="pa-4" rounded="xl" variant="tonal">
					<div class="text-caption mb-1">{{ t( "primeTest.result.details" ) }}</div>
					<div class="text-body-1">{{ t( "primeTest.result.checks", { value: result.checks } ) }}</div>
					<div class="text-body-1">{{ t( "primeTest.result.bound", { value: result.bound } ) }}</div>
					<div v-if="!result.isPrime" class="text-body-1">{{ t( "primeTest.result.divisor", { value: result.divisor } ) }}</div>
				</v-card>
			</v-col>

			<v-col cols="12">
				<v-chip class="me-2" color="green" variant="tonal">
					{{ t( "primeTest.result.checksChip", { count: result.checks } ) }}
				</v-chip>
				<v-chip variant="tonal">{{ t( "primeTest.result.cards", { count: deck?.length ?? 0 } ) }}</v-chip>
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
							<tr><td><code>V2</code></td><td>1</td><td class="mono text-right">{{ storeView(2) }}</td></tr>
							<tr><td><code>V3</code></td><td>n</td><td class="mono text-right">{{ storeView(3) }}</td></tr>
							<tr><td><code>V5</code></td><td>2</td><td class="mono text-right">{{ storeView(5) }}</td></tr>
						</tbody>
					</v-table>
				</v-card>
			</v-col>

			<v-col cols="12" md="4">
				<v-card class="pa-2" rounded="lg" variant="tonal">
					<div class="text-subtitle-2 px-2 py-1">{{ t( "common.workingColumns" ) }}</div>
					<v-table density="compact">
						<tbody>
							<tr><td><code>V11</code></td><td>d</td><td class="mono text-right">{{ storeView(11) }}</td></tr>
							<tr><td><code>V12</code></td><td>d²</td><td class="mono text-right">{{ storeView(12) }}</td></tr>
							<tr><td><code>V13</code></td><td>q=floor(n/d)</td>
								<td class="mono text-right">{{ storeView(13) }}</td></tr>
							<tr><td><code>V14</code></td><td>q*d</td><td class="mono text-right">{{ storeView(14) }}</td></tr>
							<tr><td><code>V15</code></td><td>r</td><td class="mono text-right">{{ storeView(15) }}</td></tr>
							<tr>
								<td><code>V16</code></td>
								<td>{{ t( "primeTest.store.checks" ) }}</td>
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
								<td>{{ t( "primeTest.store.primeFlag" ) }}</td>
								<td class="mono text-right">{{ storeView(21) }}</td>
							</tr>
							<tr>
								<td><code>V22</code></td>
								<td>{{ t( "primeTest.store.divisor" ) }}</td>
								<td class="mono text-right">{{ storeView(22) }}</td>
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
			<span v-html="t( 'primeTest.store.info' )" />
		</v-alert>
	</template>
</ALCalculation>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "@/utils/i18n.mjs";

import ALCalculation from "./AL_Calculation.vue";

const { t } = useI18n( "book1.AL" );

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

			throw new Error( t( "common.errors.badOperand", { value: JSON.stringify( x ) } ) );
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
					throw new Error( t( "common.errors.divisionByZeroCard" ) );
				}

				r = a / b;
				break;
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

function buildPrimeDeck( n ) {
	const deck = [];
	let line = 1;

	deck.push( {
		line:  line++,
		op:    "ADD",
		a:     { V: 5 },
		b:     { V: 1 },
		dest:  11,
		label: t( "primeTest.deck.initD" )
	} );
	deck.push( {
		line:  line++,
		op:    "ADD",
		a:     { V: 2 },
		b:     { V: 1 },
		dest:  21,
		label: t( "primeTest.deck.initPrime" )
	} );
	deck.push( {
		line:  line++,
		op:    "ADD",
		a:     { V: 1 },
		b:     { V: 1 },
		dest:  22,
		label: t( "primeTest.deck.initDivisor" )
	} );
	deck.push( {
		line:  line++,
		op:    "ADD",
		a:     { V: 1 },
		b:     { V: 1 },
		dest:  16,
		label: t( "primeTest.deck.initChecks" )
	} );

	let d = 2n;

	while ( d * d <= n ) {
		deck.push( {
			line:  line++,
			op:    "MUL",
			a:     { V: 11 },
			b:     { V: 11 },
			dest:  12,
			label: t( "primeTest.deck.square", { value: d } )
		} );
		deck.push( {
			line:  line++,
			op:    "DIV",
			a:     { V: 3 },
			b:     { V: 11 },
			dest:  13,
			label: t( "primeTest.deck.quotient", { value: d } )
		} );
		deck.push( {
			line:  line++,
			op:    "MUL",
			a:     { V: 13 },
			b:     { V: 11 },
			dest:  14,
			label: t( "primeTest.deck.product", { value: d } )
		} );
		deck.push( {
			line:  line++,
			op:    "SUB",
			a:     { V: 3 },
			b:     { V: 14 },
			dest:  15,
			label: t( "primeTest.deck.remainder", { value: d } )
		} );
		deck.push( {
			line:  line++,
			op:    "ADD",
			a:     { V: 16 },
			b:     { V: 2 },
			dest:  16,
			label: t( "primeTest.deck.checks", { value: d } )
		} );

		const q = n / d;
		const t = q * d;
		const r = n - t;

		if ( r === 0n ) {
			deck.push( {
				line:  line++,
				op:    "ADD",
				a:     { V: 11 },
				b:     { V: 1 },
				dest:  22,
				label: t( "primeTest.deck.divisor", { value: d } )
			} );
			deck.push( {
				line:  line++,
				op:    "ADD",
				a:     { V: 1 },
				b:     { V: 1 },
				dest:  21,
				label: t( "primeTest.deck.composite", { value: d } )
			} );
			break;
		}

		deck.push( {
			line:  line++,
			op:    "ADD",
			a:     { V: 11 },
			b:     { V: 2 },
			dest:  11,
			label: t( "primeTest.deck.increment", { value: d } )
		} );
		d += 1n;
	}

	return deck;
}

const DEFAULT_N = "91";

const nInput = ref( DEFAULT_N );

const running = ref( false );
const error = ref( "" );
const result = ref( null );

const deck = ref( [] );
const traceText = ref( "" );
const store = ref( null );
const tab = ref( "deck" );

const formulaTex = computed( () => String.raw`
q:=\left\lfloor\frac{n}{d}\right\rfloor,\quad r:=n-q\cdot d\\
r=0\Rightarrow d\mid n\Rightarrow n\text{ ${t( "primeTest.result.composite" )}}
` );

function storeView( i ) {
	if ( !store.value ) {
		return "";
	}

	const v = store.value[ i ];
	return v == null ? "0" : v.toString();
}

function intSqrtFloor( n ) {
	if ( n < 0n ) {
		throw new Error( t( "common.errors.sqrtNonNegative" ) );
	}

	if ( n < 2n ) {
		return n;
	}

	let x0 = n;
	let x1 = ( x0 + n / x0 ) / 2n;

	while ( x1 < x0 ) {
		x0 = x1;
		x1 = ( x0 + n / x0 ) / 2n;
	}

	return x0;
}

function reset() {
	nInput.value = DEFAULT_N;
	running.value = false;
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
		const n = parseBigIntInput( nInput.value, "n" );

		if ( n < 2n ) {
			throw new Error( t( "primeTest.errors.minN" ) );
		}

		const vm = new IntVM( { storeSize: 96, trace: true } );
		vm.setV( 1, 0n );
		vm.setV( 2, 1n );
		vm.setV( 3, n );
		vm.setV( 5, 2n );

		const d = buildPrimeDeck( n );
		deck.value = d;
		vm.run( d );

		const isPrime = vm.getV( 21 ) === 1n;
		const divisor = vm.getV( 22 );
		const checks = vm.getV( 16 );
		const bound = intSqrtFloor( n );

		result.value = {
			n:           n.toString(),
			isPrime,
			divisor:     divisor.toString(),
			checks:      checks.toString(),
			bound:       bound.toString(),
			description: isPrime ?
				t( "primeTest.result.primeDescription", { bound: bound.toString() } ) :
				t( "primeTest.result.compositeDescription", {
					divisor: divisor.toString(),
					n:       n.toString()
				} )
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
