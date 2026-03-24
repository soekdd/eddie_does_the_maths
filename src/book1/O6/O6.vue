<template>
<AppFrame
	:languages="[ 'de', 'en' ]"
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
			<p v-html="t( 'book.p1' )" />
			<p v-html="t( 'book.p2' )" />
			<p v-html="t( 'book.p3' )" />
			<p v-html="t( 'book.p4' )" />
		</div>
	</template>

	<template #descriptionPart>
		<h2 id="rekursion">{{ t( "sections.part1.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part1.p1')"/>
			<div class="kbox">
				<Katex as="div" display tex="x_{n+1}=x_n\left(x_n+\frac{1}{n}\right),\quad n=1,2,3,\dots" />
			</div>
			<p>
				{{ t( "sections.part1.p2a" ) }} <b>{{ t( "sections.part1.p2b" ) }}</b>
				{{ t( "sections.part1.p2c" ) }} <Katex tex="x_1" /> {{ t( "sections.part1.p2d" ) }}
			</p>
			<div class="kbox">
				<Katex as="div" display :tex="t( 'sections.part1.proveBox' )" />
			</div>
			<p>{{ t( "sections.part1.p3" ) }}</p>
			<p>
				{{ t( "sections.part1.p4a" ) }} <Katex tex="x_n" /> {{ t( "sections.part1.p4b" ) }}
				<Katex tex="x_{n+1}" /> {{ t( "sections.part1.p4c" ) }}
			</p>
		</div>

		<h2 id="monotonie" class="mt-8">{{ t( "sections.part2.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "sections.part2.p1" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="f_n(t):=t\left(t+\frac{1}{n}\right),\qquad n\ge1." />
			</div>
			<div class="kbox">
				<Katex as="div" display tex="T_1(x):=x,\qquad T_{n+1}(x):=f_n\!\left(T_n(x)\right)." />
			</div>
			<p>{{ t( "sections.part2.p2a" ) }} <Katex tex="x_1=x" /> {{ t( "sections.part2.p2b" ) }} <Katex tex="x_n=T_n(x)" />.</p>
			<div class="kbox">
				<Katex as="div" display :tex="t( 'sections.part2.derivativeBox' )" />
			</div>
			<p v-html="t( 'sections.part2.p3' )"/>
			<div class="kbox">
				<Katex as="div" display :tex="t( 'sections.part2.boundaryBox' )" />
			</div>
		</div>

		<h2 id="existenz-eindeutigkeit" class="mt-8">{{ t( "sections.part3.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part3.p1' )" />
			<div class="kbox">
				<Katex as="div" display tex="0<x_n<x_n\!\left(x_n+\frac{1}{n}\right)=x_{n+1}<1\quad\Longrightarrow\quad 1-\frac{1}{n}<x_n<1." />
			</div>
			<p v-html="t( 'sections.part3.p2' )" />
			<div class="kbox">
				<Katex as="div" display tex="x_{n+1}-x_n=x_n\!\left(x_n+\frac{1}{n}-1\right)>0\quad\Longrightarrow\quad x_n<x_{n+1}." />
			</div>
			<p v-html="t( 'sections.part3.p3' )"/>
			<div class="kbox">
				<Katex as="div" display tex="0<x_n<x_{n+1}<1\ \Longleftrightarrow\ 1-\frac{1}{n}<x_n<1." />
			</div>
			<p v-html="t( 'sections.part3.p4' )"/>
			<p>
				{{ t( "sections.part3.p5a" ) }} <Katex tex="n=1" /> {{ t( "sections.part3.p5b" ) }}
				<Katex tex="0<x_1<1" />; {{ t( "sections.part3.p5c" ) }} <Katex tex="a_1:=0" />
				{{ t( "sections.part3.p5d" ) }} <Katex tex="b_1:=1" />. {{ t( "sections.part3.p5e" ) }}
				<Katex tex="n\ge2" /> {{ t( "sections.part3.p5f" ) }} <Katex tex="a_n,b_n\in(0,1)" />
				{{ t( "sections.part3.p5g" ) }}
			</p>
			<div class="kbox">
				<Katex as="div" display tex="T_n(a_n)=1-\frac{1}{n},\qquad T_n(b_n)=1." />
			</div>
			<p v-html="t( 'sections.part3.p6' )"/>
			<p>{{ t( "sections.part3.p7" ) }} <Katex tex="n\ge2" />):</p>
			<ul>
				<li>
					<em><Katex tex="(a_n)" /> {{ t( "sections.part3.l1Title" ) }}</em>
					<div class="kbox">
						<Katex as="div" display tex="T_{n+1}(a_n)=T_n(a_n)\!\left(T_n(a_n)+\frac{1}{n}\right)." />
					</div>
					<div class="kbox">
						<Katex as="div" display tex="T_{n+1}(a_n)=\left(1-\frac{1}{n}\right)\!\left(1-\frac{1}{n}+\frac{1}{n}\right)=1-\frac{1}{n}" />
						<Katex as="div" display tex="<1-\frac{1}{n+1}=T_{n+1}(a_{n+1})." />
					</div>
					{{ t( "sections.part3.l1Text" ) }} <Katex tex="T_{n+1}" /> {{ t( "sections.part3.l1Text2" ) }} <Katex tex="a_n<a_{n+1}" />.
				</li>
				<li>
					<em><Katex tex="(b_n)" /> {{ t( "sections.part3.l2Title" ) }}</em>
					<div class="kbox">
						<Katex as="div" display tex="T_{n+1}(b_n)=T_n(b_n)\!\left(T_n(b_n)+\frac{1}{n}\right)=1\!\left(1+\frac{1}{n}\right)>1." />
					</div>
					<div class="kbox">
						<Katex as="div" display tex="T_{n+1}(b_n)>1=T_{n+1}(b_{n+1})." />
					</div>
					{{ t( "sections.part3.l2Text" ) }} <Katex tex="T_{n+1}" /> {{ t( "sections.part3.l2Text2" ) }} <Katex tex="b_{n+1}<b_n" />.
				</li>
			</ul>
			<p>
				{{ t( "sections.part3.p8" ) }} <Katex tex="I_n=[a_n,b_n]" /> {{ t( "sections.part3.p8b" ) }}
				<Katex tex="n\ge2" />) {{ t( "sections.part3.p8c" ) }}
			</p>
			<div class="kbox">
				<Katex as="div" display tex="a_2<a_3<\dots<b_3<b_2,\qquad I_{n+1}\subset I_n\ (n\ge2)." />
			</div>
			<p>{{ t( "sections.part3.p9" ) }} <Katex tex="\bigcap_{n\ge2}I_n" /> {{ t( "sections.part3.p9b" ) }}</p>
		</div>

		<h2 class="mt-8">{{ t( "sections.part4.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part4.p1' )"/>
			<p>{{ t( "sections.part4.p2" ) }} <Katex tex="k=1,\dots,n" />:</p>
			<div class="kbox">
				<Katex as="div" display tex="u_k:=T_k(a_n),\qquad v_k:=T_k(b_n),\qquad d_k:=v_k-u_k." />
			</div>
			<div class="kbox">
				<Katex as="div" display tex="d_1=b_n-a_n,\qquad d_n=T_n(b_n)-T_n(a_n)=1-\left(1-\frac{1}{n}\right)=\frac{1}{n}." />
			</div>
			<p>{{ t( "sections.part4.p3" ) }} <Katex tex="k=1,\dots,n-1" /> {{ t( "sections.part4.p3b" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="v_{k+1}-u_{k+1}=v_k\!\left(v_k+\frac1k\right)-u_k\!\left(u_k+\frac1k\right)." />
			</div>
			<div class="kbox">
				<Katex as="div" display tex="=(v_k-u_k)\!\left(u_k+v_k+\frac1k\right)=d_k\!\left(u_k+v_k+\frac1k\right)." />
			</div>
			<p>{{ t( "sections.part4.p4" ) }}</p>
			<div class="kbox">
				<Katex as="div" display :tex="t( 'sections.part4.positiveBox' )" />
			</div>
			<div class="kbox">
				<Katex as="div" display tex="b_n>a_k\ \Longrightarrow\ v_k=T_k(b_n)>T_k(a_k)=1-\frac{1}{k}." />
			</div>
			<div class="kbox">
				<Katex as="div" display tex="v_k+\frac{1}{k}>1\ \Longrightarrow\ u_k+v_k+\frac{1}{k}>1." />
			</div>
			<p>{{ t( "sections.part4.p5" ) }} <Katex tex="k=1,\dots,n-1" />: <Katex tex="d_{k+1}>d_k" />.</p>
			<div class="kbox">
				<Katex as="div" display tex="d_1<d_2<\dots<d_n=\frac{1}{n}." />
			</div>
			<div class="kbox">
				<Katex as="div" display tex="0<b_n-a_n=d_1<\frac{1}{n}\xrightarrow[n\to\infty]{}0." />
			</div>
			<p>{{ t( "sections.part4.p6" ) }} <Katex tex="\bigcap_{n\ge2}I_n" /> {{ t( "sections.part4.p6b" ) }} <Katex tex="x^*" />.</p>
			<p v-html="t( 'sections.part4.p7' )"/>
			<div class="kbox">
				<Katex as="div" display tex="1-\frac{1}{n}=T_n(a_n)<T_n(x^*)<T_n(b_n)=1\quad(n\ge2)." />
			</div>
			<p v-html="t( 'sections.part4.p8' )"/>
			<div class="kbox">
				<Katex as="div" display :tex="t( 'sections.part4.conclusionBox' )" />
			</div>
			<p v-html="t( 'sections.part4.p9' )"/>
			<div class="kbox">
				<Katex as="div" display tex="|x_1-y_1|\le b_n-a_n<\frac1n\quad(n\ge2)." />
			</div>
			<p v-html="t( 'sections.part4.p10' )"/>
		</div>

		<EddieComment :subtitle="t( 'sections.part4.commentTitle' )">
			<p>{{ t( "sections.part4.commentText" ) }}</p>
		</EddieComment>
	</template>

	<template #interactivePart>
		<h2>{{ t( "sections.interactive.title" ) }}</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p v-html="t( 'sections.interactive.intro' )" />

			<div class="d-flex flex-wrap ga-3 align-center">
				<v-text-field
					v-model="nInput"
					hide-details="auto"
					:label="t( 'sections.interactive.nLabel' )"
					max="120"
					min="2"
					style="max-width: 180px"
					type="number"
				/>
				<v-text-field
					v-model="x1Input"
					hide-details="auto"
					:label="t( 'sections.interactive.x1Label' )"
					style="max-width: 220px"
				/>
				<v-btn color="primary" variant="flat" @click="runCheck">{{ t( "sections.interactive.check" ) }}</v-btn>
				<v-btn variant="tonal" @click="setMidpoint">{{ t( "sections.interactive.midpoint" ) }}</v-btn>
				<v-btn variant="tonal" @click="randomAround">{{ t( "sections.interactive.randomNear" ) }}</v-btn>
			</div>

			<v-alert v-if="error" type="error" variant="tonal">
				{{ error }}
			</v-alert>

			<v-alert v-if="result" type="info" variant="tonal">
				<div class="d-flex flex-column ga-1">
					<div>
						<Katex :tex="`A_N=${fmt(result.AN, 10)}`" />,<br>
						<Katex :tex="`B_N=${fmt(result.BN, 10)}`" />
					</div>
					<div>
						{{ t( "sections.interactive.width" ) }}:
						<Katex :tex="`B_N-A_N=${fmt(result.width, 10)}`" />,<br>
						{{ t( "sections.interactive.comparison" ) }}:
						<Katex :tex="`\\frac1N=${fmt(1 / result.N, 10)}`" />.
					</div>
				</div>
			</v-alert>

			<v-alert
				v-if="result"
				:type="result.okAll ? 'success' : 'warning'"
				variant="tonal"
			>
				<div v-if="result.okAll">
					{{ t( "sections.interactive.okPrefix" ) }}
					<code>x1={{ fmt(result.x1, 10) }}</code>
					{{ t( "sections.interactive.okMiddle" ) }}
					<code>n={{ result.N }}</code>:
					<Katex tex="0<x_n<x_{n+1}<1" />.
				</div>
				<div v-else>
					{{ t( "sections.interactive.failPrefix" ) }}
					<code>n={{ result.failAt }}</code>.
					{{ t( "sections.interactive.failValues" ) }}
					<code>x_n={{ fmt(result.failXn, 10) }}</code>,
					<code>x_{n+1}={{ fmt(result.failXn1, 10) }}</code>.
				</div>
			</v-alert>
		</div>
	</template>

	<template #calculationPart>
		<h2>{{ t( "sections.calculation.title" ) }}</h2>
		<div class="eddie d-flex flex-column ga-3">
			<v-sheet v-if="result" border class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">{{ t( "sections.calculation.boundsTitle" ) }}</div>
				<v-table density="compact">
					<thead>
						<tr>
							<th>n</th>
							<th class="text-right">a_n</th>
							<th class="text-right">b_n</th>
							<th class="text-right">b_n-a_n</th>
							<th class="text-right">1/n</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="row in result.boundsRows" :key="row.n">
							<td class="mono">{{ row.n }}</td>
							<td class="mono text-right">{{ fmt(row.a, 10) }}</td>
							<td class="mono text-right">{{ fmt(row.b, 10) }}</td>
							<td class="mono text-right">{{ fmt(row.w, 10) }}</td>
							<td class="mono text-right">{{ fmt(1 / row.n, 10) }}</td>
						</tr>
					</tbody>
				</v-table>
			</v-sheet>

			<v-sheet v-if="result" border class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">{{ t( "sections.calculation.sequenceTitle" ) }}</div>
				<v-table density="compact">
					<thead>
						<tr>
							<th>n</th>
							<th class="text-right">x_n</th>
							<th class="text-right">x_{n+1}</th>
							<th class="text-right">{{ t( "sections.calculation.check" ) }}</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="row in result.seqRows" :key="row.n">
							<td class="mono">{{ row.n }}</td>
							<td class="mono text-right">{{ fmt(row.xn, 10) }}</td>
							<td class="mono text-right">{{ fmt(row.xn1, 10) }}</td>
							<td class="mono text-right">{{ row.ok ? t( "sections.calculation.ok" ) : t( "sections.calculation.fail" ) }}</td>
						</tr>
					</tbody>
				</v-table>
			</v-sheet>
		</div>
	</template>

	<template #footer>
		<p class="muted">
			{{ t( "footer.label" ) }}
			<a href="https://prase.cz/kalva/imo/isoln/isoln856.html">{{ t( "footer.link" ) }}</a>
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "@/utils/i18n.mjs";

import titleImg from "./O6.webp";

const { t: rawT, tm: rawTm } = useI18n( "book1/O6" );
const t = ( key,
	params = {} ) => rawT( `${key}`, params );
const tm = ( key = "" ) => rawTm( key ? `${key}` : "o6" );

const EPS = 1e-13;

const nInput = ref( "25" );
const x1Input = ref( "0.57" );

const error = ref( "" );
const result = ref( null );
const subChapter = computed( () => tm( "subChapter" ) ?? {} );

function parseNumber( v, label ) {
	const s = String( v ?? "" ).trim()
		.replace( ",", "." );

	if ( !s ) {
		throw new Error( t( "sections.interactive.errors.empty", { label } ) );
	}

	const x = Number( s );

	if ( !Number.isFinite( x ) ) {
		throw new Error( t( "sections.interactive.errors.invalid", { label } ) );
	}

	return x;
}

function recurrenceStep( x, n ) {
	return x * ( x + 1 / n );
}

function Sn( x, n ) {
	let y = x;

	for ( let k = 1; k <= n; k++ ) {
		y = recurrenceStep( y, k );
	}

	return y;
}

function bisectionForSn( n, target ) {
	let lo = 0;
	let hi = 1;
	let flo = Sn( lo, n ) - target;
	const fhi = Sn( hi, n ) - target;

	if ( Math.abs( flo ) < EPS ) {
		return lo;
	}

	if ( Math.abs( fhi ) < EPS ) {
		return hi;
	}

	if ( flo * fhi > 0 ) {
		throw new Error( t( "sections.interactive.errors.bisection", {
			n,
			target
		} ) );
	}

	for ( let iter = 0; iter < 120; iter++ ) {
		const mid = 0.5 * ( lo + hi );
		const fm = Sn( mid, n ) - target;

		if ( Math.abs( fm ) < EPS || hi - lo < 1e-14 ) {
			return mid;
		}

		if ( flo * fm <= 0 ) {
			hi = mid;
		} else {
			lo = mid;
			flo = fm;
		}
	}

	return 0.5 * ( lo + hi );
}

function computeBounds( N ) {
	const rows = [];
	let AN = -Infinity;
	let BN = Infinity;

	for ( let n = 1; n <= N; n++ ) {
		const a = bisectionForSn( n, 1 - 1 / n );
		const b = bisectionForSn( n, 1 );
		const w = b - a;
		AN = Math.max( AN, a );
		BN = Math.min( BN, b );
		rows.push( {
			n, a, b, w
		} );
	}

	return {
		rows,
		AN,
		BN,
		width: BN - AN
	};
}

function computeSequenceRows( x1, N ) {
	const x = [ 0, x1 ];

	for ( let n = 1; n <= N; n++ ) {
		x[ n + 1 ] = recurrenceStep( x[ n ], n );
	}

	const rows = [];
	let fail = null;

	for ( let n = 1; n <= N; n++ ) {
		const xn = x[ n ];
		const xn1 = x[ n + 1 ];
		const ok = xn > 0 && xn < xn1 && xn1 < 1;
		rows.push( {
			n, xn, xn1, ok
		} );

		if ( !ok && fail === null ) {
			fail = {
				n, xn, xn1
			};
		}
	}

	return {
		rows,
		fail
	};
}

function runCheck() {
	error.value = "";
	result.value = null;

	try {
		const N = parseNumber( nInput.value, "N" );
		const x1 = parseNumber( x1Input.value, "x1" );

		if ( !Number.isInteger( N ) ) {
			throw new Error( t( "sections.interactive.errors.integerN" ) );
		}

		if ( N < 2 || N > 120 ) {
			throw new Error( t( "sections.interactive.errors.rangeN" ) );
		}

		const bounds = computeBounds( N );
		const seq = computeSequenceRows( x1, N );

		result.value = {
			N,
			x1,
			AN:         bounds.AN,
			BN:         bounds.BN,
			width:      bounds.width,
			boundsRows: bounds.rows,
			seqRows:    seq.rows,
			okAll:      seq.fail === null,
			failAt:     seq.fail?.n ?? null,
			failXn:     seq.fail?.xn ?? null,
			failXn1:    seq.fail?.xn1 ?? null
		};
	} catch ( e ) {
		error.value = e?.message ? String( e.message ) : String( e );
	}
}

function setMidpoint() {
	if ( !result.value ) {
		runCheck();

		if ( !result.value ) {
			return;
		}
	}

	const m = 0.5 * ( result.value.AN + result.value.BN );
	x1Input.value = String( m );
	runCheck();
}

function randomAround() {
	if ( !result.value ) {
		runCheck();

		if ( !result.value ) {
			return;
		}
	}

	const {
		AN, BN, width
	} = result.value;
	const left = AN - 0.6 * width;
	const right = BN + 0.6 * width;
	const x = left + Math.random() * ( right - left );
	x1Input.value = String( x );
	runCheck();
}

function fmt( v, digits = 6 ) {
	if ( !Number.isFinite( v ) ) {
		return "–";
	}

	return v.toFixed( digits );
}

runCheck();
</script>

<style scoped>
ol > li { margin: 0.35rem 0; }
</style>
