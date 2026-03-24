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
			<p>{{ t( "book.p1" ) }}</p>
			<p>{{ t( "book.p2" ) }}</p>
			<p>{{ t( "book.p3" ) }}</p>
		</div>
	</template>

	<template #descriptionPart>
		<h2>{{ t( "sections.part1.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part1.p1' )" />
		</div>

		<h2 id="vorstufe-plus-klassisches-mehrdepot-modell" class="mt-8">{{ t( "sections.part2.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "sections.part2.p1" ) }}</p>
			<p class="muted">{{ t( "sections.part2.p2" ) }}</p>
		</div>

		<h2 id="depot-strategie" class="mt-8">{{ t( "sections.part3.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "sections.part3.p1" ) }}</p>

			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="\Delta x_j&=\frac{vC}{2c}\cdot\frac{1}{2j-1} \\ D_m=\sum_{j=1}^{m}\Delta x_j&=\frac{vC}{2c}\sum_{j=1}^{m}\frac{1}{2j-1}"
				/>
			</div>

			<p>{{ t( "sections.part3.p2" ) }}</p>
		</div>

		<h2 class="mt-8">{{ t( "sections.part4.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "sections.part4.p1" ) }}</p>

			<div class="kbox">
				<Katex as="div" display tex="d + 2c\frac{x}{v} \le C" />
				<Katex as="div" display tex="D_{\max}=x+\frac{v}{2c}\left(kd + C - c\frac{x}{v}\right)" />
			</div>
		</div>
	</template>

	<template #summaryPart>
		<h2>{{ t( "sections.summary.title" ) }}</h2>
		<RDGraph mode="classic" :rows="classicCalc.rows" />
	</template>
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "@/utils/i18n.mjs";
import titleImg from "./RD.webp";
import RDGraph from "./RD_Graph.vue";

const { t, tm } = useI18n( "book1/RD" );

const mode = ref( "classic" );
const modeItems = [
	{ title: "Klassisch (Mehrdepot, Reihe)", value: "classic" },
	{ title: "Vorstufe (ein Depot)", value: "light" }
];

const CInput = ref( 3 );
const cInput = ref( 1 );
const vInput = ref( 20 );
const xInput = ref( 20 );
const dInput = ref( 1 );
const kInput = ref( 3 );

const classicCInput = ref( 3 );
const classiccInput = ref( 1 );
const classicVInput = ref( 20 );
const mInput = ref( 6 );
const subChapter = computed( () => tm( "subChapter" ) ?? {} );

function parseMaybeFloat( v ) {
	if ( typeof v === "number" ) {
		return Number.isFinite( v ) ? v : null;
	}

	const s = String( v ).trim()
		.replace( ",", "." );

	if ( !s ) {
		return null;
	}

	if ( !/^[-+]?(\d+(\.\d+)?|\.\d+)$/.test( s ) ) {
		return null;
	}

	const n = Number( s );
	return Number.isFinite( n ) ? n : null;
}

function parseMaybeInt( v ) {
	const n = parseMaybeFloat( v );

	if ( n === null || !Number.isInteger( n ) ) {
		return null;
	}

	return n;
}

const lightCalc = computed( () => {
	const C = parseMaybeFloat( CInput.value );
	const c = parseMaybeFloat( cInput.value );
	const speed = parseMaybeFloat( vInput.value );
	const x = parseMaybeFloat( xInput.value );
	const d = parseMaybeFloat( dInput.value );
	const k = parseMaybeInt( kInput.value );

	if ( C === null || c === null || speed === null || x === null || d === null || k === null ) {
		return { error: t( "calculator.errors.fillAll" ) };
	}

	if ( C <= 0 || c <= 0 || speed <= 0 ) {
		return { error: t( "calculator.errors.positive" ) };
	}

	if ( x < 0 || d < 0 || k < 0 ) {
		return { error: t( "calculator.errors.nonNegative" ) };
	}

	const shuttleRoundUse = 2 * c * x / speed;
	const finalToDepotUse = c * x / speed;
	const shuttleFeasible = d + shuttleRoundUse <= C + 1e-12;
	const finalReachFeasible = finalToDepotUse <= C + 1e-12;

	const L = k * d;
	const D0 = speed * C / ( 2 * c );
	const Dmax = x + speed / ( 2 * c ) * ( L + C - finalToDepotUse );
	const gain = Dmax - D0;

	let ok = true;
	let warning = "";

	if ( !finalReachFeasible ) {
		ok = false;
		warning = t( "calculator.warnings.tooFar" );
	} else if ( !shuttleFeasible ) {
		ok = false;
		warning = t( "calculator.warnings.shuttle" );
	}

	const rows = [];

	for ( let kk = 0; kk <= 8; kk++ ) {
		const Lk = kk * d;
		const Dk = x + speed / ( 2 * c ) * ( Lk + C - finalToDepotUse );
		rows.push( {
			k:    kk,
			L:    Lk,
			D:    Dk,
			gain: Dk - D0
		} );
	}

	return {
		error: "",
		ok,
		warning,
		L,
		D0,
		Dmax,
		gain,
		rows
	};
} );

const classicCalc = computed( () => {
	const C = parseMaybeFloat( classicCInput.value );
	const c = parseMaybeFloat( classiccInput.value );
	const speed = parseMaybeFloat( classicVInput.value );
	const m = parseMaybeInt( mInput.value );

	if ( C === null || c === null || speed === null || m === null ) {
		return { error: t( "calculator.errors.fillAllM" ) };
	}

	if ( C <= 0 || c <= 0 || speed <= 0 ) {
		return { error: t( "calculator.errors.positive" ) };
	}

	if ( m <= 0 ) {
		return { error: t( "calculator.errors.mMin" ) };
	}

	const D0 = speed * C / ( 2 * c );
	let Hodd = 0;
	let Dm = 0;
	let lastGain = 0;
	const rows = [];

	for ( let j = 1; j <= m; j++ ) {
		const term = 1 / ( 2 * j - 1 );
		const delta = D0 * term;
		Hodd += term;
		Dm += delta;
		lastGain = delta;
		rows.push( {
			j,
			term,
			delta,
			cum: Dm
		} );
	}

	return {
		error: "",
		D0,
		Hodd,
		Dm,
		lastGain,
		rows
	};
} );

function applyLapplandPreset() {
	CInput.value = 3;
	cInput.value = 1;
	vInput.value = 20;
	xInput.value = 20;
	dInput.value = 1;
	kInput.value = 3;
}

function applyClassicPreset() {
	classicCInput.value = 3;
	classiccInput.value = 1;
	classicVInput.value = 20;
	mInput.value = 6;
}

function setMaxFeasibleX() {
	const C = parseMaybeFloat( CInput.value );
	const c = parseMaybeFloat( cInput.value );
	const speed = parseMaybeFloat( vInput.value );
	const d = parseMaybeFloat( dInput.value );

	if ( C === null || c === null || speed === null || d === null || C <= 0 || c <= 0 || speed <= 0 || d < 0 ) {
		return;
	}

	const xByShuttle = speed / ( 2 * c ) * ( C - d );
	const xByReach = speed / c * C;
	const xMax = Math.max( 0, Math.min( xByShuttle, xByReach ) );
	xInput.value = xMax;
}

function fmt( n, digits = 3 ) {
	if ( !Number.isFinite( n ) ) {
		return "-";
	}

	return n.toFixed( digits ).replace( ".", "," );
}
</script>
