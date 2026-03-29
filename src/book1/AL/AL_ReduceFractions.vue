<!-- i18n-ally-scope: useI18n("book1.AL") -->
<template>
<ALCalculation
	:deck
	:deck-line-title="t( 'reduceFractions.deckLineTitle' )"
	:error
	:formula-tex="programTex"
	:formula-title="t( 'reduceFractions.formulaTitle' )"
	:running
	:subtitle="t( 'reduceFractions.subtitle' )"
	:tab
	:title="t( 'reduceFractions.title' )"
	:trace-text
	@reset="reset"
	@run="run"
	@update:tab="tab = $event"
>
	<template #intro>
		<template v-if="result">
			{{ t( "reduceFractions.intro.resultPrefix" ) }}
			<code>{{ result.numIn }}/{{ result.denIn }}</code>:
			<b><Katex :tex="result.reducedTex" /></b>
			{{ t( "reduceFractions.intro.resultMiddle" ) }} <Katex :tex="`\\gcd(${result.absNumIn},${result.absDenIn})=${result.gcd}`" />.
		</template>
		<template v-else>
			{{ t( "reduceFractions.intro.empty" ) }}
		</template>
	</template>

	<template #inputs>
		<v-col cols="12" sm="6">
			<v-text-field
				v-model="numerator"
				density="comfortable"
				:label="t( 'reduceFractions.inputs.numerator' )"
				placeholder="48"
			/>
		</v-col>
		<v-col cols="12" sm="6">
			<v-text-field
				v-model="denominator"
				density="comfortable"
				:label="t( 'reduceFractions.inputs.denominator' )"
				placeholder="18"
			/>
		</v-col>
	</template>

	<template #warning>
		<span v-html="t( 'reduceFractions.warning' )" />
	</template>

	<template #formulaNote>
		<span v-html="t( 'reduceFractions.formulaNote' )" />
	</template>

	<template #result>
		<v-row v-if="result" dense>
			<v-col cols="12" md="6">
				<v-card class="pa-4" rounded="xl" variant="tonal">
					<div class="text-caption mb-1">{{ t( "reduceFractions.result.fraction" ) }}</div>
					<div class="text-h5 font-weight-bold">
						{{ result.numOut }}/{{ result.denOut }}
					</div>
					<div class="mt-2">
						<Katex as="div" :display="true" :tex="result.reducedTex" />
					</div>
				</v-card>
			</v-col>

			<v-col cols="12" md="6">
				<v-card class="pa-4" rounded="xl" variant="tonal">
					<div class="text-caption mb-1">{{ t( "reduceFractions.result.gcdDecimal" ) }}</div>
					<div class="text-h6 font-weight-medium">
						<Katex :tex="`g=${result.gcd}`" />
					</div>
					<div class="text-h6 font-weight-medium mt-1">
						{{ result.decimal }}
					</div>
					<div class="text-caption mt-2">{{ t( "reduceFractions.result.decimalNote" ) }}</div>
				</v-card>
			</v-col>

			<v-col cols="12">
				<v-chip class="me-2" color="green" variant="tonal">
					{{ t( "reduceFractions.result.loops", { count: result.iterations } ) }}
				</v-chip>
				<v-chip variant="tonal">
					{{ t( "reduceFractions.result.cards", { count: deck?.length ?? 0 } ) }}
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
			{{ t( "reduceFractions.store.info" ) }}
		</v-alert>
	</template>
</ALCalculation>
</template>

<script setup>
import { ref } from "vue";
import { computed } from "vue";
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
			default: throw new Error( t( "common.errors.unknownOp", { value: card.op } ) );
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
		op: "ADD", a: { V: 5 }, b: { V: 1 }, dest: 11, label: t( "reduceFractions.deck.initA" )
	} );
	push( 2, {
		op: "ADD", a: { V: 6 }, b: { V: 1 }, dest: 12, label: t( "reduceFractions.deck.initB" )
	} );
	push( 3, {
		op: "ADD", a: { I: 0 }, b: { I: 0 }, dest: 16, label: t( "reduceFractions.deck.initIter" )
	} );

	let a = absNum;
	let b = absDen;
	let guard = 0;

	while ( b !== 0n ) {
		guard++;

		if ( guard > 512 ) {
			throw new Error( t( "reduceFractions.errors.loopGuard" ) );
		}

		const q = a / b;
		const t = q * b;
		const r = a - t;

		push( 4, {
			op: "DIV", a: { V: 11 }, b: { V: 12 }, dest: 13, label: t( "reduceFractions.deck.q", { step: guard } )
		} );
		push( 5, {
			op: "MUL", a: { V: 13 }, b: { V: 12 }, dest: 14, label: t( "reduceFractions.deck.t", { step: guard } )
		} );
		push( 6, {
			op: "SUB", a: { V: 11 }, b: { V: 14 }, dest: 15, label: t( "reduceFractions.deck.r", { step: guard } )
		} );
		push( 7, {
			op: "ADD", a: { V: 12 }, b: { V: 1 }, dest: 11, label: t( "reduceFractions.deck.a", { step: guard } )
		} );
		push( 8, {
			op: "ADD", a: { V: 15 }, b: { V: 1 }, dest: 12, label: t( "reduceFractions.deck.b", { step: guard } )
		} );
		push( 9, {
			op: "ADD", a: { V: 16 }, b: { V: 2 }, dest: 16, label: t( "reduceFractions.deck.iter", { step: guard } )
		} );

		a = b;
		b = r;
	}

	push( 10, {
		op: "ADD", a: { V: 11 }, b: { V: 1 }, dest: 21, label: t( "reduceFractions.deck.outputG" )
	} );
	push( 11, {
		op: "DIV", a: { V: 3 }, b: { V: 21 }, dest: 22, label: t( "reduceFractions.deck.outputZ" )
	} );
	push( 12, {
		op: "DIV", a: { V: 4 }, b: { V: 21 }, dest: 23, label: t( "reduceFractions.deck.outputN" )
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

const storeLayout = computed( () => [
	{
		key:     "data",
		title:   t( "common.dataColumns" ),
		entries: [
			{ col: 1, label: t( "horner.store.const0" ) },
			{ col: 2, label: t( "bernoulli.store.const1" ) },
			{ col: 3, label: t( "reduceFractions.store.normalizedNumerator" ) },
			{ col: 4, label: t( "reduceFractions.store.positiveDenominator" ) },
			{ col: 5, label: t( "reduceFractions.store.absNumerator" ) },
			{ col: 6, label: t( "reduceFractions.store.absDenominator" ) }
		]
	},
	{
		key:     "working",
		title:   t( "common.workingColumns" ),
		entries: [
			{ col: 11, label: "a" },
			{ col: 12, label: "b" },
			{ col: 13, label: "q" },
			{ col: 14, label: "t=q·b" },
			{ col: 15, label: "r" },
			{ col: 16, label: t( "reduceFractions.store.loopCounter" ) }
		]
	},
	{
		key:     "result",
		title:   t( "common.resultColumns" ),
		entries: [
			{ col: 21, label: t( "reduceFractions.store.gcd" ) },
			{ col: 22, label: "z'=z/g" },
			{ col: 23, label: "n'=n/g" }
		]
	}
] );

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
		let z = parseBigIntInput( numerator.value, t( "reduceFractions.inputs.numerator" ) );
		let n = parseBigIntInput( denominator.value, t( "reduceFractions.inputs.denominator" ) );

		if ( n === 0n ) {
			throw new Error( t( "reduceFractions.errors.denominatorZero" ) );
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
