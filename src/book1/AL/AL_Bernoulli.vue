<template>
<ALCalculation
	:deck
	:deck-line-title="t( 'reduceFractions.deckLineTitle' )"
	:error
	:formula-tex
	:formula-title="t( 'bernoulli.formulaTitle' )"
	:running
	:subtitle="t( 'bernoulli.subtitle' )"
	:tab
	:title="t( 'bernoulli.title' )"
	:trace-text
	@reset="reset"
	@run="run"
	@update:tab="tab = $event"
>
	<template #intro>
		<template v-if="result">
			{{ t( "bernoulli.intro.resultPrefix" ) }} <code>n={{ n }}</code>
			{{ t( "bernoulli.intro.resultMiddle" ) }} <Katex :tex="`B_{${2 * n - 1}}`" />)
			<b><Katex :tex="toKaTeXFrac(result.frac)" /></b>.
		</template>
		<template v-else>
			<span v-html="t( 'bernoulli.intro.empty' )" />
		</template>
	</template>

	<template #inputs>
		<v-col cols="12">
			<v-text-field
				v-model.number="n"
				density="comfortable"
				:label="t( 'bernoulli.inputs.n' )"
				min="2"
				step="1"
				type="number"
			/>
		</v-col>

		<v-col cols="12">
			<v-expansion-panels variant="accordion">
				<v-expansion-panel>
					<v-expansion-panel-title>{{ t( "bernoulli.inputs.startValuesTitle" ) }}</v-expansion-panel-title>
					<v-expansion-panel-text>
						<v-row dense>
							<v-col cols="12">
								<Katex as="div" :display="true" :tex="'B_1 = -\\frac{1}{2},\\; B_3 = \\frac{1}{6},\\; B_5 = -\\frac{1}{30}'" />
							</v-col>

							<v-col cols="12" sm="4">
								<v-text-field
									v-model="B1"
									density="comfortable"
									:label="t( 'bernoulli.inputs.b1' )"
									placeholder="-1/2"
								/>
							</v-col>
							<v-col cols="12" sm="4">
								<v-text-field
									v-model="B3"
									density="comfortable"
									:label="t( 'bernoulli.inputs.b3' )"
									placeholder="1/6"
								/>
							</v-col>
							<v-col cols="12" sm="4">
								<v-text-field
									v-model="B5"
									density="comfortable"
									:label="t( 'bernoulli.inputs.b5' )"
									placeholder="-1/30"
								/>
							</v-col>

							<v-col cols="12">
								<v-alert density="compact" type="warning" variant="tonal">
									<span v-html="t( 'bernoulli.inputs.warning' )" />
								</v-alert>
							</v-col>
						</v-row>
					</v-expansion-panel-text>
				</v-expansion-panel>
			</v-expansion-panels>
		</v-col>
	</template>

	<template #formulaNote>
		<span v-html="t( 'bernoulli.formulaNote' )" />
	</template>

	<template #result>
		<v-row v-if="result" dense>
			<v-col cols="12" md="6">
				<v-card class="pa-4" rounded="xl" variant="tonal">
					<div class="text-caption mb-1">{{ t( "bernoulli.result.fraction" ) }}</div>
					<div class="text-h5 font-weight-bold">
						{{ result.frac }}
					</div>
					<div class="mt-2">
						<Katex as="div" :display="true" :tex="`B_{${2*n-1}} = ${toKaTeXFrac(result.frac)}`" />
					</div>
				</v-card>
			</v-col>

			<v-col cols="12" md="6">
				<v-card class="pa-4" rounded="xl" variant="tonal">
					<div class="text-caption mb-1">{{ t( "bernoulli.result.decimal" ) }}</div>
					<div class="text-h6 font-weight-medium">
						{{ result.decimal }}
					</div>
					<div class="text-caption mt-2">{{ t( "bernoulli.result.decimalNote" ) }}</div>
				</v-card>
			</v-col>

			<v-col cols="12">
				<v-chip class="me-2" color="green" variant="tonal">
					{{ t( "bernoulli.result.corrected" ) }}
				</v-chip>
				<v-chip variant="tonal">
					{{ t( "bernoulli.result.cards", { count: deck?.length ?? 0 } ) }}
				</v-chip>
			</v-col>
		</v-row>
	</template>

	<template #store>
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
								<th>{{ t( "common.table.column" ) }}</th>
								<th>{{ t( "common.table.role" ) }}</th>
								<th class="text-right">{{ t( "common.table.value" ) }}</th>
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
			{{ t( "bernoulli.store.info" ) }}
		</v-alert>
	</template>
</ALCalculation>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "@/utils/i18n.mjs";

import ALCalculation from "./AL_Calculation.vue";

const { t } = useI18n( "book1/AL" );

// ---------- Rational arithmetic (BigInt) ----------
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
	toDecimal( maxDigits = 30 ) {
		const sign = this.num < 0n ? "-" : "";
		let n = bigAbs( this.num );
		const d = this.den;
		const intPart = n / d;
		let rem = n % d;

		if ( rem === 0n ) {
			return sign + intPart.toString();
		}

		let frac = "";

		for ( let i = 0; i < maxDigits && rem !== 0n; i++ ) {
			rem *= 10n;
			frac += ( rem / d ).toString();
			rem %= d;
		}

		return `${sign}${intPart.toString()}.${frac}`;
	}
}

// ---------- Card VM ----------
class CardVM {
	constructor( { storeSize = 64, trace = false } = {} ) {
		this.V = Array.from( { length: storeSize + 1 }, () => new Rat( 0n, 1n ) ); // 1-based
		this.trace = trace;
		this.step = 0;
		this.logs = [];
	}

	setV( i, rat ) {
		this.V[ i ] = rat;
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

		let r;

		switch ( card.op ) {
			case "ADD": r = a.add( b ); break;
			case "SUB": r = a.sub( b ); break;
			case "MUL": r = a.mul( b ); break;
			case "DIV": r = a.div( b ); break;
			default: throw new Error( t( "common.errors.unknownOp", { value: card.op } ) );
		}

		const dests = Array.isArray( card.dest ) ? card.dest : [ card.dest ];

		for ( const d of dests ) {
			this.setV( d, r );
		}

		this.step++;

		if ( this.trace ) {
			const dLabel = dests.map( ( d ) => `V${d}` ).join( "," );
			this.logs.push( `#${String( this.step ).padStart( 2, "0" )} ${
				card.label || ""} | ${card.op} → ${dLabel} = ${r.toString()}` );
		}
	}

	run( deck ) {
		for ( const c of deck ) {
			this.exec( c );
		}
	}
}

// ---------- Note-G-Deck (Data/Working/Result + Loop 13..23) ----------
function buildNoteGDeck() {
	const deck = [];
	const push = ( line, card ) => deck.push( { line, ...card } );

	// Setup (L1..L12)
	push( 1, {
		op: "MUL", a: { V: 2 }, b: { V: 3 }, dest: [ 4, 5, 6 ], label: t( "bernoulli.deck.l1" )
	} );
	push( 2, {
		op: "SUB", a: { V: 4 }, b: { V: 1 }, dest: 4, label: t( "bernoulli.deck.l2" )
	} );
	push( 3, {
		op: "ADD", a: { V: 5 }, b: { V: 1 }, dest: 5, label: t( "bernoulli.deck.l3" )
	} );
	push( 4, {
		op: "DIV", a: { V: 4 }, b: { V: 5 }, dest: 11, label: t( "bernoulli.deck.l4" )
	} );
	push( 5, {
		op: "DIV", a: { V: 11 }, b: { V: 2 }, dest: 11, label: t( "bernoulli.deck.l5" )
	} );
	push( 6, {
		op: "SUB", a: { I: 0 }, b: { V: 11 }, dest: 11, label: t( "bernoulli.deck.l6" )
	} );
	push( 7, {
		op: "ADD", a: { V: 13 }, b: { V: 11 }, dest: 13, label: t( "bernoulli.deck.l7" )
	} );
	push( 8, {
		op: "DIV", a: { V: 6 }, b: { V: 2 }, dest: 11, label: t( "bernoulli.deck.l8" )
	} );
	push( 9, {
		op: "ADD", a: { I: 0 }, b: { I: 1 }, dest: 17, label: t( "bernoulli.deck.l9" )
	} );
	push( 10, {
		op: "MUL", a: { V: 11 }, b: { V: 21 }, dest: 12, label: t( "bernoulli.deck.l10" )
	} );
	push( 11, {
		op: "ADD", a: { V: 13 }, b: { V: 12 }, dest: 13, label: t( "bernoulli.deck.l11" )
	} );
	push( 12, {
		op: "ADD", a: { V: 17 }, b: { I: 2 }, dest: 17, label: t( "bernoulli.deck.l12" )
	} );

	// Loop body (L13..L23), repeated for B3 and B5.
	const loopSpecs = [
		{
			bCol: 22, bLabel: "B3", f1: 1, f2: 2, d1: 3, d2: 4
		},
		{
			bCol: 23, bLabel: "B5", f1: 3, f2: 4, d1: 5, d2: 6
		}
	];

	for ( const spec of loopSpecs ) {
		push( 13, {
			op: "SUB", a: { V: 6 }, b: { I: spec.f1 }, dest: 7, label: t( "bernoulli.deck.l13", { value: spec.f1 } )
		} );
		push( 14, {
			op: "SUB", a: { V: 6 }, b: { I: spec.f2 }, dest: 8, label: t( "bernoulli.deck.l14", { value: spec.f2 } )
		} );
		push( 15, {
			op: "MUL", a: { V: 11 }, b: { V: 7 }, dest: 11, label: t( "bernoulli.deck.l15" )
		} );
		push( 16, {
			op: "MUL", a: { V: 11 }, b: { V: 8 }, dest: 11, label: t( "bernoulli.deck.l16" )
		} );
		push( 17, {
			op: "ADD", a: { I: 0 }, b: { I: spec.d1 }, dest: 14, label: t( "bernoulli.deck.l17", { value: spec.d1 } )
		} );
		push( 18, {
			op: "ADD", a: { I: 0 }, b: { I: spec.d2 }, dest: 15, label: t( "bernoulli.deck.l18", { value: spec.d2 } )
		} );
		push( 19, {
			op: "MUL", a: { V: 14 }, b: { V: 15 }, dest: 16, label: t( "bernoulli.deck.l19" )
		} );
		push( 20, {
			op: "DIV", a: { V: 11 }, b: { V: 16 }, dest: 11, label: t( "bernoulli.deck.l20" )
		} );
		push( 21, {
			op:    "MUL",
			a:     { V: 11 },
			b:     { V: spec.bCol },
			dest:  12,
			label: t( "bernoulli.deck.l21", { value: spec.bLabel } )
		} );
		push( 22, {
			op: "ADD", a: { V: 13 }, b: { V: 12 }, dest: 13, label: t( "bernoulli.deck.l22" )
		} );
		push( 23, {
			op: "ADD", a: { V: 17 }, b: { I: 2 }, dest: 17, label: t( "bernoulli.deck.l23" )
		} );
	}

	// Final output (L24)
	push( 24, {
		op: "SUB", a: { I: 0 }, b: { V: 13 }, dest: 24, label: t( "bernoulli.deck.l24" )
	} );

	return deck;
}

// ---------- GUI state ----------
const DEFAULT_N = 4;
const DEFAULT_B1 = "-1/2";
const DEFAULT_B3 = "1/6";
const DEFAULT_B5 = "-1/30";

const n = ref( DEFAULT_N );

const B1 = ref( DEFAULT_B1 );
const B3 = ref( DEFAULT_B3 );
const B5 = ref( DEFAULT_B5 );

const running = ref( false );
const error = ref( "" );
const result = ref( null );

const deck = ref( [] );
const traceText = ref( "" );
const store = ref( null );

const tab = ref( "deck" );

const storeLayout = computed( () => [
	{
		key:     "data",
		title:   t( "common.dataColumns" ),
		entries: [
			{ col: 1, label: t( "bernoulli.store.const1" ) },
			{ col: 2, label: t( "bernoulli.store.const2" ) },
			{ col: 3, label: "n" },
			{ col: 21, label: "B1" },
			{ col: 22, label: "B3" },
			{ col: 23, label: "B5" }
		]
	},
	{
		key:     "working",
		title:   t( "common.workingColumns" ),
		entries: [
			{ col: 4, label: "2n-1" },
			{ col: 5, label: "2n+1" },
			{ col: 6, label: "2n" },
			{ col: 7, label: t( "bernoulli.store.factorA" ) },
			{ col: 8, label: t( "bernoulli.store.factorB" ) },
			{ col: 11, label: t( "bernoulli.store.currentA" ) },
			{ col: 12, label: t( "bernoulli.store.term" ) },
			{ col: 14, label: t( "bernoulli.store.denominator1" ) },
			{ col: 15, label: t( "bernoulli.store.denominator2" ) },
			{ col: 16, label: t( "bernoulli.store.denominatorProduct" ) },
			{ col: 17, label: t( "bernoulli.store.kCounter" ) }
		]
	},
	{
		key:     "result",
		title:   t( "common.resultColumns" ),
		entries: [
			{ col: 13, label: t( "bernoulli.store.sum" ) },
			{ col: 24, label: "B_{2n-1}" }
		]
	}
] );

const formulaTex = computed( () => {
	const k = 2 * Number( n.value ) - 1;
	return String.raw`
B_{${k}} \;=\; -\Bigl(A_0 \;+\; A_1\,B_1 \;+\; A_3\,B_3 \;+\; A_5\,B_5\Bigr)
`;
} );

// ---------- helpers ----------
function parseFrac( s ) {
	const text = String( s ?? "" ).trim();

	if ( !text ) {
		throw new Error( t( "common.errors.fractionEmpty" ) );
	}

	if ( /^-?\d+$/.test( text ) ) {
		return new Rat( BigInt( text ), 1n );
	}

	const m = text.match( /^(-?\d+)\s*\/\s*(-?\d+)$/ );

	if ( !m ) {
		throw new Error( t( "common.errors.fractionFormat", { value: text } ) );
	}

	return new Rat( BigInt( m[ 1 ] ), BigInt( m[ 2 ] ) );
}

function toKaTeXFrac( fracStr ) {
	const s = String( fracStr );

	if ( s.includes( "/" ) ) {
		const [ a, b ] = s.split( "/" );
		return String.raw`\frac{${a}}{${b}}`;
	}

	return s;
}

function toDecimalRounded( r, digits = 6 ) {
	const sign = r.num < 0n ? "-" : "";
	let n = bigAbs( r.num );
	const d = r.den;

	let intPart = n / d;
	let rem = n % d;

	if ( digits <= 0 ) {
		if ( 2n * rem >= d ) {
			intPart += 1n;
		}

		return `${sign}${intPart.toString()}`;
	}

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

	const fracStr = frac.toString().padStart( digits, "0" );
	return `${sign}${intPart.toString()},${fracStr}`;
}

function storeView( i ) {
	if ( !store.value ) {
		return "";
	}

	const r = store.value[ i ];
	return r ? r.toString() : "0";
}

function reset() {
	n.value = DEFAULT_N;
	B1.value = DEFAULT_B1;
	B3.value = DEFAULT_B3;
	B5.value = DEFAULT_B5;
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
		const vm = new CardVM( { storeSize: 64, trace: true } );

		// Data columns
		vm.setV( 1, Rat.ofInt( 1 ) ); // 1
		vm.setV( 2, Rat.ofInt( 2 ) ); // 2
		vm.setV( 3, Rat.ofInt( Number( n.value ) ) ); // n

		vm.setV( 21, parseFrac( B1.value ) ); // B1
		vm.setV( 22, parseFrac( B3.value ) ); // B3
		vm.setV( 23, parseFrac( B5.value ) ); // B5

		const d = buildNoteGDeck();
		deck.value = d;

		vm.run( d );

		const out = vm.getV( 24 );
		result.value = {
			frac:    out.toString(),
			decimal: toDecimalRounded( out, 6 )
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
