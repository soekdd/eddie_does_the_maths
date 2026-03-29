<!-- i18n-ally-scope: useI18n("book1.O3") -->
<template>
<AppFrame
	:sub-chapter
	:title="t( 'title' )"
	:vue-date="__VITE_SFC_MTIME_MS__"
>

	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="t( 'imageTitle' )">
				<img :alt="t( 'imageAlt' )" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">{{ t( "introDate" ) }}</h3>
		<div class="eddie">
			<p v-html="t( 'book.p1' )"/>
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
					tex="o\!\left(Q_{i_1}+Q_{i_2}+\dots+Q_{i_n}\right)\ge o\!\left(Q_{i_1}\right)."
				/>
			</div>
			<p v-html="t( 'sections.part1.p3' )" />
		</div>

		<h2 id="kernidee" class="mt-8">{{ t( "sections.part2.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part2.p1' )" />
			<ul>
				<li v-html="t( 'sections.part2.l1' )" />
				<li v-html="t( 'sections.part2.l2' )" />
			</ul>
			<p v-html="t( 'sections.part2.p2' )" />
			<section>
				<figure class="exampleFigure">
					<ImageZoomer :title="t( 'sections.part2.graphTitle' )">
						<O3Graph
							:cell-size="8.5"
							:padding="8"
							:rows="64"
							:show-legend="false"
						/>
					</ImageZoomer>
				</figure>

				<h3>{{ t( "sections.part2.graphHeading" ) }}</h3>
				<p v-html="t( 'sections.part2.graphText1' )"/>
				<div class="kbox">
					<Katex as="div" display tex="\binom{i}{r}=\binom{i-1}{r-1}+\binom{i-1}{r}." />
				</div>
				<p v-html="t( 'sections.part2.graphText2' )"/>

				<h3 v-html="t( 'sections.part2.rulesHeading' )" />
				<p><b>{{ t( "sections.part2.lemma1" ) }}</b></p>
				<div class="kbox">
					<Katex as="div" display tex="(1+x)^{2t}\equiv (1+x^2)^t \pmod 2." />
				</div>
				<p v-html="t( 'sections.part2.lemma1Text' )" />

				<p><b>{{ t( "sections.part2.lemma2" ) }}</b></p>
				<div class="kbox">
					<Katex
						as="div"
						display
						tex="(1+x)^{2t+1}=(1+x)\,(1+x)^{2t}\equiv (1+x)\,(1+x^2)^t\pmod 2."
					/>
				</div>
			</section>
			<h3 v-html="t( 'sections.part2.countHeading' )" />
			<p v-html="t( 'sections.part2.countText1' )" />
			<div class="kbox">
				<Katex as="div" display tex="o(Q_i)=2^{\,s_2(i)}." />
			</div>
			<ul>
				<li v-html="t( 'sections.part2.countL1' )" />
				<li v-html="t( 'sections.part2.countL2' )" />
			</ul>
			<p v-html="t( 'sections.part2.countText2' )" />
		</div>

		<h2 id="beweisidee" class="mt-8">{{ t( "sections.part3.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part3.p1' )" />

			<h3 v-html="t( 'sections.part3.step1Title' )" />
			<p v-html="t( 'sections.part3.step1Text1' )" />
			<div class="kbox">
				<Katex as="div" display tex="(1+x)^m \equiv 1+x^m \pmod 2." />
			</div>
			<p v-html="t( 'sections.part3.step1Text2' )" />
			<div class="kbox">
				<Katex aligned
					as="div"
					display
					:tex="texStep1Block"
				/>
			</div>
			<p v-html="t( 'sections.part3.step1Text3' )" />

			<h3 v-html="t( 'sections.part3.step2Title' )" />
			<p v-html="t( 'sections.part3.step2Text' )" />

			<h3 v-html="t( 'sections.part3.caseATitle' )" />
			<p v-html="t( 'sections.part3.caseAText1' )" />
			<div class="kbox">
				<Katex as="div" display tex="\sum_{j=1}^n Q_{i_j}(x)=(1+x)^mA(x)." />
			</div>
			<p v-html="t( 'sections.part3.caseAText2' )"/>
			<div class="kbox">
				<Katex aligned
					as="div"
					display
					:tex="texFallABlock"
				/>
			</div>
			<p v-html="t( 'sections.part3.caseAText3' )" />

			<h3 v-html="t( 'sections.part3.caseBTitle' )" />
			<p v-html="t( 'sections.part3.caseBText1' )"/>
			<div class="kbox">
				<Katex as="div" display tex="A(x):=\sum_{i_j<m}Q_{i_j}(x),\qquad B(x):=\sum_{i_j\ge m}Q_{i_j-m}(x)." />
			</div>
			<p v-html="t( 'sections.part3.caseBText2' )"/>
			<div class="kbox">
				<Katex as="div" display tex="\sum_{j=1}^n Q_{i_j}(x)=A(x)+(1+x)^mB(x)." />
			</div>
			<p v-html="t( 'sections.part3.caseBText3' )" />
			<div class="kbox">
				<Katex as="div" display tex="A+(1+x)^mB\equiv A+(1+x^m)B=(A+B)+x^mB." />
			</div>
			<p v-html="t( 'sections.part3.caseBText4' )"/>
			<div class="kbox">
				<Katex as="div" display tex="o\bigl(A+(1+x)^mB\bigr)=o(A+B)+o(B)." />
			</div>
			<p v-html="t( 'sections.part3.caseBText5' )" />
			<div class="kbox">
				<Katex aligned
					as="div"
					display
					:tex="texFallBBlock"
				/>
			</div>
			<p v-html="t( 'sections.part3.caseBText6' )"/>
			<div class="kbox">
				<Katex as="div" display tex="o\!\left(\sum_{j=1}^n Q_{i_j}\right)\ge o(Q_{i_1})." />
			</div>
		</div>

		<EddieComment :subtitle="t( 'sections.part3.commentTitle' )">
			<p v-html="t( 'sections.part3.commentText' )"/>
			<ol>
				<li v-for="(item, idx) in commentItems" :key="`comment-${idx}`" v-html="item" />
			</ol>
			<p v-html="t( 'sections.part3.commentEnd' )"/>
		</EddieComment>
	</template>

	<template #interactivePart>
		<h2>{{ t( "sections.interactive.title" ) }}</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p v-html="t( 'sections.interactive.intro' )" />

			<div class="d-flex flex-wrap ga-3 align-center">
				<v-text-field
					v-model="inputExponents"
					hide-details="auto"
					:label="t( 'sections.interactive.inputLabel' )"
					style="max-width: 420px"
				/>
				<v-btn color="primary" variant="flat" @click="runCheck">
					{{ t( "sections.interactive.check" ) }}
				</v-btn>
				<v-btn variant="tonal" @click="randomExample">
					{{ t( "sections.interactive.random" ) }}
				</v-btn>
			</div>

			<p class="muted" v-html="t( 'sections.interactive.hint' )" />

			<v-alert v-if="error" type="error" variant="tonal">
				{{ error }}
			</v-alert>

			<v-alert
				v-if="result"
				:type="result.holds ? 'success' : 'warning'"
				variant="tonal"
			>
				<div class="d-flex flex-column ga-1">
					<div>
						<Katex :tex="`o(Q_{${result.i1}})=${result.oddFirst}`" />,
						<Katex
							:tex="`o(Q_{${result.exponents[0]}}+\\cdots+Q_{${result.exponents[result.exponents.length - 1]}})=${result.oddSum}`"
						/>.
					</div>
					<div>
						{{ t( "sections.interactive.resultLabel" ) }}
						<b>{{ result.holds ? t( "sections.interactive.resultOk" ) : t( "sections.interactive.resultBad" ) }}</b>.
					</div>
				</div>
			</v-alert>

			<v-sheet v-if="result" class="pa-3 rounded">
				<div class="d-flex flex-column ga-2">
					<div>
						<strong>{{ t( "sections.interactive.exponents" ) }}</strong>
						<span class="ml-2">{{ result.exponents.join( ", " ) }}</span>
					</div>
					<div v-if="result.notes.length" class="muted">
						{{ result.notes.join( " · " ) }}
					</div>
					<div>
						<strong>{{ t( "sections.interactive.window" ) }}</strong>
						<Katex :tex="`m=${result.proof.m}`" />
						{{ t( "sections.interactive.windowBetween" ) }}
						<Katex :tex="`${result.proof.m}\\le i_n=${result.maxI}<${2 * result.proof.m}`" />
					</div>
				</div>
			</v-sheet>
		</div>
	</template>

	<template #calculationPart>
		<h2>{{ t( "sections.calculation.title" ) }}</h2>
		<div class="eddie d-flex flex-column ga-3">
			<v-sheet v-if="result" class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">{{ t( "sections.calculation.sumData" ) }}</div>
				<v-table density="compact">
					<thead>
						<tr>
							<th>{{ t( "sections.calculation.addend" ) }}</th>
							<th>{{ t( "sections.calculation.binary" ) }}</th>
							<th class="text-right">{{ t( "sections.calculation.oddCount" ) }}</th>
							<th>{{ t( "sections.calculation.oddDegrees" ) }}</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="row in result.rows" :key="row.i">
							<td><code>Q{{ row.i }}</code></td>
							<td><code>{{ row.binary }}</code></td>
							<td class="text-right mono">{{ row.oddCount }}</td>
							<td class="mono">{{ formatDegrees( row.oddDegrees ) }}</td>
						</tr>
					</tbody>
				</v-table>
			</v-sheet>

			<v-sheet v-if="result" class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">{{ t( "sections.calculation.sumOdds" ) }}</div>
				<div class="mono">
					{{ result.oddDegreesSum.length ? formatDegrees( result.oddDegreesSum, 32 ) : t( "sections.calculation.none" ) }}
				</div>
			</v-sheet>

			<v-sheet v-if="result" class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">{{ t( "sections.calculation.proofTrace" ) }}</div>
				<div v-if="result.proof.caseName === 'trivial'" class="mono" v-html="t( 'sections.calculation.trivial' )" />
				<div v-else-if="result.proof.caseName === 'A'" class="d-flex flex-column ga-2">
					<div>
						<span v-html="t( 'sections.calculation.caseA' )" />
						<code>{{ result.proof.reduced.join( ", " ) }}</code>
					</div>
					<div class="mono">
						{{ t( "sections.calculation.caseALine", {
							value:       result.proof.oddReduced,
							doubleValue: 2 * result.proof.oddReduced
						} ) }}
					</div>
				</div>
				<div v-else class="d-flex flex-column ga-2">
					<div v-html="t( 'sections.calculation.caseB', {
						r: result.proof.r,
						a: result.proof.A.join( ', ' ),
						b: result.proof.B.join( ', ' )
					} )"
					/>
					<div class="mono">
						{{ t( "sections.calculation.caseBLine", {
							sumAplusB: result.proof.oAplusB,
							sumB:      result.proof.oB,
							total:     result.proof.oAplusB + result.proof.oB,
							oA:        result.proof.oA
						} ) }}
					</div>
				</div>
			</v-sheet>
		</div>
	</template>

	<template #footer>
		<p class="muted">
			{{ t( "footer.label" ) }}
			<a href="https://prase.cz/kalva/imo/isoln/isoln853.html">{{ t( "footer.link" ) }}</a>
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "@/utils/i18n.mjs";
import titleImg from "./O3.webp";
import O3Graph from "./O3_Graph.vue";

const { t, tm } = useI18n( "book1.O3" );

const subChapter = computed( () => tm( "subChapter" ) ?? {} );
const commentItems = computed( () => tm( "sections.part3.commentItems" ) ?? [] );

const inputExponents = ref( "1, 3, 4, 7" );
const error = ref( "" );
const result = ref( null );
const texStep1Block = "(1+x)^mA&\\equiv (1+x^m)A=A+x^mA\\\\" +
	"o\\bigl((1+x)^mA\\bigr)&=2\\,o(A).";
const texFallABlock = "o\\!\\left(\\sum_{j=1}^n Q_{i_j}\\right)&=o\\bigl((1+x)^mA\\bigr)=2\\,o(A)\\\\" +
	"o(Q_{i_1})&=o\\bigl((1+x)^mQ_{i_1-m}\\bigr)=2\\,o(Q_{i_1-m}).";
const texFallBBlock = computed( () => "o\\!\\left(\\sum_{j=1}^n Q_{i_j}\\right)&=o(A+B)+o(B)\\ge o(A)\\\\" +
	`o(A)&\\ge o(Q_{i_1})\\quad\\text{(${t( "sections.part3.caseBBlockNote" )} }A\\text{)}.` );

function popcount( n ) {
	let x = n;
	let c = 0;

	while ( x > 0 ) {
		c += x & 1;
		x >>= 1;
	}

	return c;
}

function highestPowerOf2LE( n ) {
	if ( n <= 0 ) {
		return 1;
	}

	let m = 1;

	while ( m * 2 <= n ) {
		m *= 2;
	}

	return m;
}

function lucasOdd( i, r ) {
	return ( r & i ) === r;
}

function oddDegreesOfQ( i ) {
	const out = [];

	for ( let r = 0; r <= i; r++ ) {
		if ( lucasOdd( i, r ) ) {
			out.push( r );
		}
	}

	return out;
}

function buildParityStats( exponents ) {
	const maxI = exponents.length ? exponents[ exponents.length - 1 ] : 0;
	const parity = Array( maxI + 1 ).fill( 0 );
	const rows = [];

	for ( const i of exponents ) {
		const oddDegrees = oddDegreesOfQ( i );

		for ( const r of oddDegrees ) {
			parity[ r ] ^= 1;
		}

		rows.push( {
			i,
			binary:   i.toString( 2 ),
			oddDegrees,
			oddCount: 2 ** popcount( i )
		} );
	}

	const oddDegreesSum = [];

	for ( let r = 0; r < parity.length; r++ ) {
		if ( parity[ r ] === 1 ) {
			oddDegreesSum.push( r );
		}
	}

	return {
		maxI,
		parity,
		rows,
		oddDegreesSum,
		oddSum: oddDegreesSum.length
	};
}

function xorOddCount( parityA, parityB ) {
	const len = Math.max( parityA.length, parityB.length );
	let count = 0;

	for ( let i = 0; i < len; i++ ) {
		const a = i < parityA.length ? parityA[ i ] : 0;
		const b = i < parityB.length ? parityB[ i ] : 0;

		if ( ( a ^ b ) === 1 ) {
			count++;
		}
	}

	return count;
}

function parseExponents( raw ) {
	const tokens = String( raw ?? "" )
		.split( /[\s,;]+/ )
		.map( ( x ) => x.trim() )
		.filter( Boolean );

	if ( !tokens.length ) {
		throw new Error( t( "sections.interactive.errors.empty" ) );
	}

	const parsed = tokens.map( ( token ) => Number( token ) );

	if ( parsed.some( ( value ) => !Number.isInteger( value ) ) ) {
		throw new Error( t( "sections.interactive.errors.integer" ) );
	}

	if ( parsed.some( ( value ) => value < 0 || value > 256 ) ) {
		throw new Error( t( "sections.interactive.errors.range" ) );
	}

	return [ ...new Set( parsed ) ].sort( ( a, b ) => a - b );
}

function proveExample( exponents ) {
	const maxI = exponents[ exponents.length - 1 ];

	if ( maxI === 0 ) {
		return {
			caseName: "trivial",
			m:        1
		};
	}

	const m = highestPowerOf2LE( maxI );

	if ( exponents[ 0 ] >= m ) {
		const reduced = exponents.map( ( value ) => value - m );
		return {
			caseName:   "A",
			m,
			reduced,
			oddReduced: buildParityStats( reduced ).oddSum
		};
	}

	let splitIndex = 0;

	while ( splitIndex < exponents.length && exponents[ splitIndex ] < m ) {
		splitIndex++;
	}

	const A = exponents.slice( 0, splitIndex );
	const B = exponents.slice( splitIndex ).map( ( value ) => value - m );
	const parityA = buildParityStats( A );
	const parityB = buildParityStats( B );

	return {
		caseName: "B",
		m,
		r:        splitIndex,
		A,
		B,
		oA:       parityA.oddSum,
		oB:       parityB.oddSum,
		oAplusB:  xorOddCount( parityA.parity, parityB.parity )
	};
}

function runCheck() {
	error.value = "";

	try {
		const exponents = parseExponents( inputExponents.value );
		const stats = buildParityStats( exponents );
		const oddFirst = 2 ** popcount( exponents[ 0 ] );
		const proof = proveExample( exponents );

		result.value = {
			exponents,
			i1:            exponents[ 0 ],
			maxI:          stats.maxI,
			oddFirst,
			oddSum:        stats.oddSum,
			oddDegreesSum: stats.oddDegreesSum,
			rows:          stats.rows,
			holds:         stats.oddSum >= oddFirst,
			notes:         [],
			proof
		};
	} catch ( err ) {
		error.value = err instanceof Error ? err.message : String( err );
		result.value = null;
	}
}

function randomExample() {
	const count = 2 + Math.floor( Math.random() * 5 );
	const values = new Set();

	while ( values.size < count ) {
		values.add( Math.floor( Math.random() * 24 ) );
	}

	inputExponents.value = [ ...values ].sort( ( a, b ) => a - b ).join( ", " );
	runCheck();
}

function formatDegrees( degrees, max = 18 ) {
	if ( degrees.length <= max ) {
		return degrees.join( ", " );
	}

	return `${degrees.slice( 0, max ).join( ", " )}, ...`;
}

runCheck();
</script>
