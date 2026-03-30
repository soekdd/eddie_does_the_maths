<!-- i18n-ally-scope: useI18n("book1.O4") -->
<template>
<AppFrame
	:sub-chapter
	:title="t( 'title' )"
	:vue-date="__VITE_SFC_MTIME_MS__"
>

	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer is-ai :title="t( 'imageTitle' )">
				<img :alt="t( 'imageAlt' )" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">{{ t( "introDate" ) }}</h3>
		<div class="eddie">
			<p v-html="t( 'book.p1' )" />
			<p v-html="t( 'book.p2' )"/>
			<p v-html="t( 'book.p3' )"/>
			<p v-html="t( 'book.p4' )"/>
		</div>
	</template>

	<template #descriptionPart>
		<h2 id="aufgabenstellung">{{ t( "sections.part1.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part1.p1' )" />
			<p v-html="t( 'sections.part1.p2' )" />
			<div class="kbox">
				<Katex
					as="div"
					display
					:tex="t( 'sections.part1.proveBox' )"
				/>
			</div>
		</div>

		<h2 id="crashkurs" class="mt-8">{{ t( "sections.part2.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part2.p1' )" />
			<div class="kbox">
				<Katex
					as="div"
					display
					tex="(p_1,\dots,p_9)=(2,3,5,7,11,13,17,19,23),\quad \text{also } n=9."
				/>
			</div>
			<p v-html="t( 'sections.part2.p2' )" />
			<div class="kbox">
				<Katex as="div" display tex="x=\prod_{j=1}^{n} p_j^{e_j}\quad \text{mit } e_j\in\mathbb N_0." />
			</div>
			<p v-html="t( 'sections.part2.p3' )"/>
			<ul>
				<li v-html="t( 'sections.part2.l1' )" />
				<li v-html="t( 'sections.part2.l2' )" />
			</ul>
			<p v-html="t( 'sections.part2.p4' )"/>
			<ol>
				<li>{{ t( "sections.part2.o1" ) }}</li>
				<li>{{ t( "sections.part2.o2" ) }}</li>
			</ol>
		</div>

		<h2 id="paritatsvektoren" class="mt-8">{{ t( "sections.part3.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part3.p1' )" />
			<h3>{{ t( "sections.part3.aTitle" ) }}</h3>
			<p v-html="t( 'sections.part3.aText1' )" />
			<div class="kbox">
				<Katex as="div" display tex="x=q\cdot r^2," />
			</div>
			<p v-html="t( 'sections.part3.aText2' )" />

			<h3>{{ t( "sections.part3.bTitle" ) }}</h3>
			<p v-html="t( 'sections.part3.bText1' )"/>
			<div class="kbox">
				<Katex as="div" display tex="\varepsilon(x)=(e_1,\dots,e_n)\bmod 2\in\{0,1\}^n." />
			</div>
			<p v-html="t( 'sections.part3.bText2' )"/>
			<p><b>{{ t( "sections.part3.bMemo" ) }}</b></p>
			<div class="kbox">
				<Katex as="div" display :tex="t( 'sections.part3.bMemoBox' )" />
			</div>
			<p v-html="t( 'sections.part3.bText3' )" />
		</div>

		<h2 id="allgemein" class="mt-8">{{ t( "sections.part4.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part4.p1' )"/>
			<p v-html="t( 'sections.part4.p2' )" />
			<p v-html="t( 'sections.part4.p3' )" />
			<div class="kbox">
				<Katex as="div" display tex="|M|\ge 3\cdot 2^n+1," />
			</div>
			<p v-html="t( 'sections.part4.p4' )" />
			<div class="kbox">
				<Katex as="div" display tex="abcd=t^4." />
			</div>
			<p v-html="t( 'sections.part4.p5' )" />
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="3\cdot 2^9+1&=3\cdot 512+1=1537\\|M|=1985&\ge 1537."
				/>
			</div>
			<p v-html="t( 'sections.part4.p6' )"/>
			<p v-html="t( 'sections.part4.p7' )" />
		</div>

		<h2 id="schubfachprinzip" class="mt-8">{{ t( "sections.part5.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part5.p1' )"/>
			<h3>{{ t( "sections.part5.stageATitle" ) }}</h3>
			<p v-html="t( 'sections.part5.stageAText1' )" />
			<p v-html="t( 'sections.part5.stageAText2' )" />
			<p v-html="t( 'sections.part5.stageAText3' )"/>
			<div class="kbox">
				<Katex as="div" display tex="P=\sum_v\left\lfloor \frac{c_v}{2}\right\rfloor." />
			</div>
			<p v-html="t( 'sections.part5.stageAText4' )" />
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="P&\ge \sum_v\frac{c_v-1}{2}\\&=\frac{\sum_v c_v-\sum_v 1}{2}\\&=\frac{|M|-2^n}{2}."
				/>
			</div>
			<p v-html="t( 'sections.part5.stageAText5' )" />
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="P&\ge \frac{(3\cdot 2^n+1)-2^n}{2}\\&=2^n+\frac12\\&\Rightarrow P\ge 2^n+1."
				/>
			</div>
			<p v-html="t( 'sections.part5.stageAText6' )" />
			<p v-html="t( 'sections.part5.stageAText7' )" />

			<h3 class="mt-6">{{ t( "sections.part5.stageBTitle" ) }}</h3>
			<p v-html="t( 'sections.part5.stageBText1' )" />
			<div class="kbox">
				<Katex as="div" display tex="u=\prod_{j=1}^n p_j^{f_j},\qquad \varepsilon(u)=(f_1,\dots,f_n)\bmod 2\in\{0,1\}^n." />
			</div>
			<p v-html="t( 'sections.part5.stageBText2' )" />
			<p v-html="t( 'sections.part5.stageBText3' )" />
			<div class="kbox">
				<Katex as="div" display tex="abcd=(u^2)(v^2)=(uv)^2=(s^2)^2=s^4." />
			</div>
			<p v-html="t( 'sections.part5.stageBText4' )" />
			<p v-html="t( 'sections.part5.stageBText5' )"/>
		</div>

		<h2 id="beispiel" class="mt-8">{{ t( "sections.part6.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part6.p1' )"/>
			<div class="kbox">
				<Katex as="div" display tex="\{6,24,54,216,8,75\}." />
			</div>
			<p v-html="t( 'sections.part6.p2' )" />
			<div class="kbox">
				<Katex as="div" display tex="6\cdot24\cdot54\cdot216=36^4." />
			</div>
			<EddieComment :subtitle="t( 'sections.part6.commentTitle' )">
				<p v-html="t( 'sections.part6.commentText' )"/>
			</EddieComment>
		</div>
	</template>

	<template #interactivePart>
		<h2>{{ t( "sections.interactive.title" ) }}</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p v-html="t( 'sections.interactive.intro' )" />

			<div class="d-flex flex-wrap ga-3 align-center">
				<v-text-field
					v-model="countInput"
					hide-details="auto"
					:label="t( 'sections.interactive.countLabel' )"
					max="5000"
					min="4"
					style="max-width: 220px"
					type="number"
				/>
				<v-btn color="primary" variant="flat" @click="runConstruction">
					{{ t( "sections.interactive.check" ) }}
				</v-btn>
				<v-btn variant="tonal" @click="randomExample">
					{{ t( "sections.interactive.random" ) }}
				</v-btn>
			</div>

			<v-alert v-if="error" type="error" variant="tonal">
				{{ error }}
			</v-alert>

			<v-alert v-if="result" :type="result.guaranteed ? 'info' : 'warning'" variant="tonal">
				<Katex :tex="`|M|=${result.count}`" />,
				{{ t( "sections.interactive.thresholdLabel" ) }}
				<Katex :tex="`3\\cdot 2^9+1=${result.threshold}`" />.
				<span v-if="result.guaranteed">{{ t( "sections.interactive.theoremGuaranteed" ) }}</span>
				<span v-else>{{ t( "sections.interactive.theoremExperiment" ) }}</span>
			</v-alert>

			<v-sheet v-if="result" border class="pa-3 rounded">
				<div class="d-flex flex-column ga-2">
					<div>
						<strong>{{ t( "sections.interactive.stageA" ) }}</strong>
						{{ t( "sections.interactive.stageAText", {
							pairs:   result.squarePairCount,
							classes: result.parityClassCount
						} ) }}
					</div>
					<div>
						<strong>{{ t( "sections.interactive.stageB" ) }}</strong>
						{{ t( "sections.interactive.stageBText", {
							classes: result.rootParityClassCount
						} ) }}
					</div>
					<div>
						<strong>{{ t( "sections.interactive.resultLabel" ) }}</strong>
						<span v-if="result.found" class="text-success">{{ t( "sections.interactive.found" ) }}</span>
						<span v-else class="text-warning">{{ t( "sections.interactive.notFound" ) }}</span>
					</div>
				</div>
			</v-sheet>
		</div>
	</template>

	<template #calculationPart>
		<h2>{{ t( "sections.calculation.title" ) }}</h2>
		<div class="eddie d-flex flex-column ga-3">
			<v-sheet v-if="result" border class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">{{ t( "sections.calculation.parityTitle" ) }}</div>
				<v-table density="compact">
					<thead>
						<tr>
							<th>{{ t( "sections.calculation.class" ) }}</th>
							<th>{{ t( "sections.calculation.oddPrimes" ) }}</th>
							<th class="text-right">{{ t( "sections.calculation.count" ) }}</th>
							<th class="text-right">{{ t( "sections.calculation.pairContribution" ) }}</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="row in result.parityClassRows" :key="row.key">
							<td><code>{{ row.key }}</code></td>
							<td>{{ describeKey( row.key ) }}</td>
							<td class="text-right mono">{{ row.count }}</td>
							<td class="text-right mono">{{ row.pairs }}</td>
						</tr>
					</tbody>
				</v-table>
			</v-sheet>

			<v-sheet v-if="result" border class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">{{ t( "sections.calculation.rootTitle" ) }}</div>
				<v-table density="compact">
					<thead>
						<tr>
							<th>{{ t( "sections.calculation.class" ) }}</th>
							<th>{{ t( "sections.calculation.oddPrimes" ) }}</th>
							<th class="text-right">{{ t( "sections.calculation.pairCount" ) }}</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="row in result.rootClassRows" :key="row.key">
							<td><code>{{ row.key }}</code></td>
							<td>{{ describeKey( row.key ) }}</td>
							<td class="text-right mono">{{ row.count }}</td>
						</tr>
					</tbody>
				</v-table>
			</v-sheet>

			<v-sheet v-if="result && result.found" border class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">{{ t( "sections.calculation.witnessTitle" ) }}</div>
				<div class="mono">{{ t( "sections.calculation.witness.a", { value: result.witness.a } ) }}</div>
				<div class="mono">{{ t( "sections.calculation.witness.b", { value: result.witness.b } ) }}</div>
				<div class="mono">{{ t( "sections.calculation.witness.c", { value: result.witness.c } ) }}</div>
				<div class="mono">{{ t( "sections.calculation.witness.d", { value: result.witness.d } ) }}</div>
				<div class="mono mt-2">{{ t( "sections.calculation.witness.product", { value: result.witness.product } ) }}</div>
				<div class="mono">{{ t( "sections.calculation.witness.t", { value: result.witness.t } ) }}</div>
				<div class="mono">{{ t( "sections.calculation.witness.check", { value: result.witness.checkValue } ) }}</div>
			</v-sheet>
		</div>
	</template>

	<template #footer>
		<p class="muted">
			{{ t( "footer.label" ) }}
			<a href="https://prase.cz/kalva/imo/isoln/isoln854.html">{{ t( "footer.link" ) }}</a>
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "@/utils/i18n.mjs";
import titleImg from "./O4.webp";

const { t, tm } = useI18n( "book1.O4" );

const subChapter = computed( () => tm( "subChapter" ) ?? {} );

const PRIMES = [ 2, 3, 5, 7, 11, 13, 17, 19, 23 ];
const PRIMES_BIG = PRIMES.map( ( p ) => BigInt( p ) );
const THRESHOLD = 3 * 2 ** PRIMES.length + 1;

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
		throw new Error( t( "sections.interactive.errors.generator", { max: maxCount } ) );
	}

	const items = [];

	for ( let idx = 0; idx < count; idx++ ) {
		const exponents = decodeBase(
			idx, 4, PRIMES.length
		);
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
		.map( ( [ key, arr ] ) => ( {
			key,
			count: arr.length
		} ) )
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

		if ( !sumExp.every( ( e ) => e % 4 === 0 ) ) {
			continue;
		}

		const root4Exp = sumExp.map( ( e ) => e / 4 );
		const tValue = numberFromExponents( root4Exp );
		const product = four.reduce( ( acc, item ) => acc * item.value, 1n );

		witness = {
			a:          p1.a.value.toString(),
			b:          p1.b.value.toString(),
			c:          p2.a.value.toString(),
			d:          p2.b.value.toString(),
			product:    product.toString(),
			t:          tValue.toString(),
			checkValue: ( tValue * tValue * tValue * tValue ).toString()
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
			throw new Error( t( "sections.interactive.errors.integer" ) );
		}

		if ( count < 4 ) {
			throw new Error( t( "sections.interactive.errors.min" ) );
		}

		if ( count > 5000 ) {
			throw new Error( t( "sections.interactive.errors.max" ) );
		}

		const items = generateSmoothSet( count );
		result.value = analyze( items );
	} catch ( e ) {
		error.value = e?.message ? String( e.message ) : String( e );
	}
}

function randomExample() {
	const c = 200 + Math.floor( Math.random() * 2200 );
	countInput.value = String( c );
	runConstruction();
}

runConstruction();
</script>

<style scoped>
ol > li { margin: 0.35rem 0; }
</style>
