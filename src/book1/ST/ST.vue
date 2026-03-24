<!-- eslint-disable vue/max-len -->
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
			<p>{{ t( "book.p4" ) }}</p>
		</div>
	</template>

	<template #descriptionPart>
		<h2 id="entscheidungsbaum">{{ t( "sections.part1.title" ) }}</h2>
		<div class="eddie">
			<p class="muted"><i>{{ t( "sections.part1.kicker" ) }}</i></p>
			<p>{{ t( "sections.part1.p1" ) }}</p>
			<p>{{ t( "sections.part1.p2" ) }}</p>
			<ol>
				<li v-for="item in treeLevels" :key="item">{{ item }}</li>
			</ol>
			<div class="exampleClear"></div>
		</div>

		<h2 id="wahrscheinlichkeiten" class="mt-8">{{ t( "sections.part2.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "sections.part2.p1" ) }}</p>
			<p class="muted">
				{{ t( "sections.part2.p2a" ) }}
				<Katex tex="f" />
				{{ t( "sections.part2.p2b" ) }}
				<Katex tex="t" />
				{{ t( "sections.part2.p2c" ) }}
				<Katex tex="p \approx \frac{f\,t}{60}" />.
			</p>

			<div class="kbox">
				<div class="mono">
					{{ t( "sections.part2.example" ) }}
					<code class="mono">t=5</code>
					{{ t( "sections.part2.and" ) }}
					<code class="mono">f=1</code>
					{{ t( "sections.part2.perHour" ) }}
					<span class="mono">→</span>
					<Katex tex="p=\frac{5}{60}\approx 0{,}083" />
				</div>
			</div>
		</div>

		<h2 class="mt-8">{{ t( "sections.part3.title" ) }}</h2>
		<figure class="exampleFigure">
			<ImageZoomer :title="t( 'sections.part3.figureTitle' )">
				<STGraph a="0.8"
					bus-per-hour="1"
					r="0.2"
					stand-minutes="5"
				/>
			</ImageZoomer>
		</figure>
		<div class="eddie">
			<p>{{ t( "sections.part3.p1a" ) }} <Katex tex="S" /> {{ t( "sections.part3.p1b" ) }} <Katex tex="N" /> {{ t( "sections.part3.p1c" ) }} <Katex tex="P(S\cup N)" />.</p>
			<p>{{ t( "sections.part3.p2a" ) }} <Katex tex="p_S+p_N" /> {{ t( "sections.part3.p2b" ) }} <i>{{ t( "sections.part3.both" ) }}</i> {{ t( "sections.part3.p2c" ) }} <Katex tex="p>100\%" /> {{ t( "sections.part3.p2d" ) }} <Katex tex="0{,}7+0{,}6=1{,}3" />).</p>
			<p>{{ t( "sections.part3.p3a" ) }} <b>{{ t( "sections.part3.complement" ) }}</b>. {{ t( "sections.part3.p3b" ) }} {{ t( "sections.part3.p3c" ) }}</p>
			<div class="kbox">
				<Katex
					as="div"
					display
					tex="\begin{aligned}
p_{\text{ges}} &= P(S\cup N) \\
&= 1-P(S^c\cap N^c) \\
&= 1-P(S^c)P(N^c) \\
&= 1-(1-p_S)(1-p_N)
\end{aligned}"
				/>
			</div>
		</div>

		<h2 class="mt-8">{{ t( "sections.part4.title" ) }}</h2>
		<div class="eddie">
			<p class="muted">
				{{ t( "sections.part4.p1a" ) }}
				<Katex tex="p_S=p_N=p" />,
				<Katex tex="a_S=a_N=a" />,
				<Katex tex="r_S=r_N=r" />.
			</p>
			<p>{{ t( "sections.part4.p2a" ) }} <Katex tex="p" /> {{ t( "sections.part4.p2b" ) }} <Katex tex="1-(1-p)^2 = 1-(1-2p+p^2)=2p-p^2" />. {{ t( "sections.part4.p2c" ) }} <Katex tex="2p" /> {{ t( "sections.part4.p2d" ) }} <Katex tex="p^2" />. {{ t( "sections.part4.p2e" ) }} <Katex tex="p" /> {{ t( "sections.part4.p2f" ) }} <Katex tex="p^2" /> {{ t( "sections.part4.p2g" ) }}</p>
			<ul>
				<li><Katex tex="f" />: {{ t( "sections.part4.list.f" ) }}</li>
				<li><Katex tex="t" />: {{ t( "sections.part4.list.t" ) }}</li>
				<li><Katex tex="p\approx \frac{f\,t}{60}" />: {{ t( "sections.part4.list.p" ) }}</li>
				<li><Katex tex="a" />: {{ t( "sections.part4.list.a" ) }}</li>
				<li><Katex tex="r" />: {{ t( "sections.part4.list.r" ) }}</li>
			</ul>
			<p>{{ t( "sections.part4.p3a" ) }} <Katex :tex="`P(\\text{${t('graph.labels.noBus')}})=(1-p)^2`" /> {{ t( "sections.part4.p3b" ) }} <Katex :tex="`P(\\text{${t('graph.labels.oneBus')}})=1-(1-p)^2=2p-p^2`" />.</p>
			<p class="muted">{{ t( "sections.part4.p4a" ) }} <Katex tex="p" /> {{ t( "sections.part4.p4b" ) }} <Katex tex="p^2" /> {{ t( "sections.part4.p4c" ) }} <Katex tex="p_{\text{ges}}\approx p_S+p_N" /> {{ t( "sections.part4.p4d" ) }} <Katex tex="p_{\text{ges}}\approx 2p" />.</p>
		</div>

		<h2 class="mt-8">{{ t( "sections.part5.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "sections.part5.p1" ) }}</p>
			<div class="kbox">
				<Katex as="div" display :tex="`P(\\text{${t('graph.labels.freedom')}}) = \\bigl(1-(1-p)^2\\bigr)\\cdot a\\cdot (1-r) = (2p-p^2)\\,a\\,(1-r).`" />
			</div>
			<p class="muted">{{ t( "sections.part5.p2" ) }} <Katex :tex="`P(\\text{${t('graph.labels.failure')}})=1-P(\\text{${t('graph.labels.freedom')}})`" />.</p>
		</div>

		<h2 class="mt-8">{{ t( "sections.part6.title" ) }}</h2>
		<div class="eddie">
			<p class="muted">{{ t( "sections.part6.p1" ) }}</p>
			<div class="kbox">
				<div class="mono">{{ t( "sections.part6.row1" ) }} {{ fmtDec( exampleOut.p, 3 ) }} ({{ fmtPct( exampleOut.p ) }})</div>
				<div class="mono">{{ t( "sections.part6.row2" ) }} {{ fmtDec( exampleOut.freedom, 3 ) }} ({{ fmtPct( exampleOut.freedom ) }})</div>
			</div>
			<EddieComment :subtitle="t( 'sections.part6.commentTitle' )">
				<ul>
					<li>{{ t( "sections.part6.comment1" ) }}</li>
					<li>{{ t( "sections.part6.comment2a" ) }} <code class="mono">p=0</code>. {{ t( "sections.part6.comment2b" ) }} <code class="mono">a=0</code>.</li>
					<li>{{ t( "sections.part6.comment3a" ) }} <code class="mono">r</code> {{ t( "sections.part6.comment3b" ) }}</li>
				</ul>
			</EddieComment>
		</div>
	</template>

	<template #interactivePart>
		<h2 id="rechner">{{ t( "calculator.title" ) }}</h2>

		<v-card class="panel pa-5">
			<div class="formGrid">
				<v-text-field v-model="busPerHour" inputmode="decimal" :label="t( 'calculator.fields.f' )" />
				<v-text-field v-model="standMinutes" inputmode="decimal" :label="t( 'calculator.fields.t' )" />
				<v-text-field v-model="a" inputmode="decimal" :label="t( 'calculator.fields.a' )" />
				<v-text-field v-model="r" inputmode="decimal" :label="t( 'calculator.fields.r' )" />
			</div>

			<div class="actions">
				<v-btn color="primary"
					type="button"
					variant="flat"
					@click="randomize"
				>{{ t( "calculator.random" ) }}</v-btn>
				<v-btn type="button" variant="outlined" @click="reset">{{ t( "calculator.reset" ) }}</v-btn>
			</div>

			<p class="mini">
				<b>{{ t( "calculator.ruleLabel" ) }}</b> <code class="mono">p ≈ f·t/60</code> {{ t( "calculator.ruleText" ) }}
				<br />
				<span class="muted">{{ t( "calculator.note1a" ) }} <code class="mono">a</code> {{ t( "calculator.note1b" ) }} <code class="mono">r</code> {{ t( "calculator.note1c" ) }} <code class="mono">0</code> {{ t( "calculator.note1d" ) }} <code class="mono">1</code>. {{ t( "calculator.note1e" ) }} <code class="mono">0,65</code>.</span>
				<br />
				<span class="muted">{{ t( "calculator.note2a" ) }} <Katex tex="P(\text{Bus})=1-(1-p)^2" /> {{ t( "calculator.note2b" ) }} <Katex tex="p" /> {{ t( "calculator.note2c" ) }} <Katex tex="P(\text{Bus})\approx 2p" />).</span>
			</p>
		</v-card>

		<v-card class="panel pa-3 mt-4">
			<h3>{{ t( "calculator.graphHeading" ) }}</h3>
			<ImageZoomer :title="graphTitle">
				<STGraph
					:a
					:bus-per-hour
					:r
					:stand-minutes
				/>
			</ImageZoomer>
		</v-card>
	</template>

	<template #calculationPart>
		<v-card class="panel">
			<div class="resultHeader">
				<v-chip
					class="pill"
					:color="status.kind === 'ok' ? 'success' : status.kind === 'warn' ? 'warning' : 'error'"
					size="small"
				>
					{{ status.text }}
				</v-chip>
				<div class="equation">
					<span class="mono">{{ t( "results.freedomEq" ) }}</span>
					<span v-if="calc.ok" class="mono">{{ fmtPct( calc.freedom ) }}</span>
					<span v-else class="mono">…</span>
				</div>
			</div>

			<div class="out">
				<p v-if="!calc.ok" class="muted">{{ calc.message }}</p>

				<div v-else>
					<p v-if="calc.issues.length" class="muted">
						{{ calc.issues.join( " · " ) }}
					</p>

					<div class="kbox">
						<div class="mono">{{ t( "results.rowF" ) }} {{ fmtDec( calc.f, 2 ) }}</div>
						<div class="mono">{{ t( "results.rowT" ) }} {{ fmtDec( calc.t, 1 ) }}</div>
						<div class="mono">{{ t( "results.rowP" ) }} {{ fmtDec( calc.pp, 3 ) }} ({{ fmtPct( calc.pp ) }})</div>
						<div class="mono">{{ t( "results.rowBus" ) }} {{ fmtDec( calc.pBus, 3 ) }} ({{ fmtPct( calc.pBus ) }})</div>
						<div class="mono">{{ t( "results.rowNone" ) }} {{ fmtDec( calc.pNone, 3 ) }} ({{ fmtPct( calc.pNone ) }})</div>
						<div class="mono">{{ t( "results.rowFreedomFormula" ) }}</div>
						<div class="mono">{{ t( "results.rowFreedom" ) }} {{ fmtDec( calc.freedom, 3 ) }} ({{ fmtPct( calc.freedom ) }})</div>
						<div class="mono">{{ t( "results.rowFailure" ) }} {{ fmtDec( calc.failure, 3 ) }} ({{ fmtPct( calc.failure ) }})</div>
					</div>

					<div class="tableScroller">
						<v-table density="compact">
							<thead>
								<tr>
									<th>{{ t( "results.table.branch" ) }}</th>
									<th class="text-right">{{ t( "results.table.value" ) }}</th>
									<th class="text-right">%</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="row in calc.breakdown" :key="row.k">
									<td class="mono">{{ row.k }}</td>
									<td class="mono text-right">{{ fmtDec( row.v, 3 ) }}</td>
									<td class="mono text-right">{{ fmtPct( row.v ) }}</td>
								</tr>
							</tbody>
						</v-table>
					</div>
				</div>
			</div>
		</v-card>
	</template>
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "@/utils/i18n.mjs";
import STGraph from "./ST_Graph.vue";
import titleImg from "./ST.webp";

const {
	t, tm, locale
} = useI18n( "book1/ST" );

const subChapter = computed( () => tm( "subChapter" ) ?? {} );
const treeLevels = computed( () => tm( "sections.part1.levels" ) ?? [] );

const example = {
	busPerHour:   1,
	standMinutes: 5,
	a:            0.8,
	r:            0.2
};

const busPerHour = ref( String( example.busPerHour ) );
const standMinutes = ref( String( example.standMinutes ) );
const a = ref( String( example.a ) );
const r = ref( String( example.r ) );

const exampleOut = { p: example.busPerHour * example.standMinutes / 60 };
exampleOut.pBus = 1 - ( 1 - exampleOut.p ) ** 2;
exampleOut.freedom = exampleOut.pBus * example.a * ( 1 - example.r );

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

function in01( n ) {
	return typeof n === "number" && Number.isFinite( n ) && n >= 0 && n <= 1;
}

function fmtPct( n, digits = 1 ) {
	if ( !Number.isFinite( n ) ) {
		return "-";
	}

	return new Intl.NumberFormat( locale.value === "de" ? "de-DE" : "en-US", {
		style:                 "percent",
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	} ).format( n );
}

function fmtDec( n, digits = 3 ) {
	if ( !Number.isFinite( n ) ) {
		return "-";
	}

	return new Intl.NumberFormat( locale.value === "de" ? "de-DE" : "en-US", {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	} ).format( n );
}

function reset() {
	busPerHour.value = String( example.busPerHour );
	standMinutes.value = String( example.standMinutes );
	a.value = String( example.a );
	r.value = String( example.r );
}

function rand( min, max ) {
	return Math.random() * ( max - min ) + min;
}

function randomize() {
	const f = rand( 1, 3 );
	const t = rand( 2, 12 );
	busPerHour.value = f.toFixed( 0 );
	standMinutes.value = t.toFixed( 0 );
	a.value = rand( 0.6, 0.95 ).toFixed( 1 );
	r.value = rand( 0.05, 0.15 ).toFixed( 1 );
}

const calc = computed( () => {
	const frequency = parseMaybeFloat( busPerHour.value );
	const dwellMinutes = parseMaybeFloat( standMinutes.value );
	const acceptance = parseMaybeFloat( a.value );
	const risk = parseMaybeFloat( r.value );

	if ( [
		frequency,
		dwellMinutes,
		acceptance,
		risk
	].some( ( n ) => n === null ) ) {
		return { ok: false, message: t( "errors.enterNumbers" ) };
	}

	if ( frequency < 0 || dwellMinutes < 0 ) {
		return { ok: false, message: t( "errors.nonNegative" ) };
	}

	if ( dwellMinutes > 60 ) {
		return { ok: false, message: t( "errors.maxMinutes" ) };
	}

	if ( ![
		acceptance,
		risk
	].every( in01 ) ) {
		return { ok: false, message: t( "errors.range01" ) };
	}

	const pp = frequency * dwellMinutes / 60;

	if ( pp > 1 ) {
		return { ok: false, message: t( "errors.pAboveOne" ) };
	}

	const issues = [];
	const pNone = ( 1 - pp ) ** 2;
	const pBus = 1 - pNone;

	const freedom = pBus * acceptance * ( 1 - risk );
	const reject = pBus * ( 1 - acceptance );
	const failure = 1 - freedom;

	const breakdown = [
		{ k: t( "results.breakdown.p" ), v: pp },
		{ k: t( "results.breakdown.bus" ), v: pBus },
		{ k: t( "results.breakdown.none" ), v: pNone },
		{ k: t( "results.breakdown.reject" ), v: reject },
		{ k: t( "results.breakdown.freedom" ), v: freedom },
		{ k: t( "results.breakdown.failure" ), v: failure }
	];

	return {
		ok: true,
		issues,
		f:  frequency,
		t:  dwellMinutes,
		pp,
		aa: acceptance,
		rr: risk,
		pBus,
		pNone,
		reject,
		freedom,
		failure,
		breakdown
	};
} );

const status = computed( () => {
	if ( !calc.value.ok ) {
		return { kind: "bad", text: t( "status.bad" ) };
	}

	if ( calc.value.issues.length ) {
		return { kind: "warn", text: t( "status.warn" ) };
	}

	return { kind: "ok", text: t( "status.ok" ) };
} );

const graphTitle = computed( () => t( "calculator.graphTitle" ) );
</script>
