<template>
<AppFrame
	:languages="[ 'de', 'en' ]"
	:sub-chapter
	:title="t( 'dg.title' )"
	:vue-date="__VITE_SFC_MTIME_MS__"
>

	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="t( 'dg.imageTitle' )">
				<img loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">{{ t( "dg.introDate" ) }}</h3>
		<div class="eddie">
			<p v-html="t( 'dg.book.p1' )" />
			<p v-html="t( 'dg.book.p2' )" />
			<p v-html="t( 'dg.book.p3' )" />
		</div>
	</template>

	<template #descriptionPart>
		<h2 id="einfuhrungsbeispiel">{{ t( "dg.sections.part1.title" ) }}</h2>

		<div class="eddie">
			<p>{{ t( "dg.sections.part1.p1" ) }}</p>
			<p v-html="t( 'dg.sections.part1.p2' )" />
			<p v-html="t( 'dg.sections.part1.p3' )" />

			<Katex as="div" display tex="17k + 6s = 200,\quad k,s\in\mathbb{N}_0" />

			<p v-html="t( 'dg.sections.part1.p4' )" />

			<div class="exampleClear"></div>

			<div class="kbox">
				<Katex as="div" display tex="(k,s)\in\{(4,22),(10,5)\}" />
			</div>

			<div class="tableScroller">
				<v-table density="compact">
					<thead>
						<tr>
							<th>t</th>
							<th>{{ t( "dg.sections.part1.cows" ) }}</th>
							<th>{{ t( "dg.sections.part1.pigs" ) }}</th>
							<th>{{ t( "dg.sections.part1.check" ) }}</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="mono">0</td>
							<td class="mono">4</td>
							<td class="mono">22</td>
							<td class="mono">17·4 + 6·22 = 200</td>
						</tr>
						<tr>
							<td class="mono">1</td>
							<td class="mono">10</td>
							<td class="mono">5</td>
							<td class="mono">17·10 + 6·5 = 200</td>
						</tr>
					</tbody>
				</v-table>
			</div>

			<p class="muted" v-html="t( 'dg.sections.part1.hint' )" />
		</div>

		<h2 id="erklarung" class="mt-8">{{ t( "dg.sections.part2.title" ) }}</h2>

		<figure class="exampleFigure">
			<ImageZoomer :title="t( 'dg.sections.part2.graphTitle', { a: example.a, b: example.b, c: example.c } )">
				<DGGraph
					:a="example.a"
					:b="example.b"
					:c="example.c"
					:x-label="t( 'dg.sections.part2.xLabel' )"
					x-var="k"
					:y-label="t( 'dg.sections.part2.yLabel' )"
					y-var="s"
				/>
			</ImageZoomer>
		</figure>

		<div class="eddie">
			<p v-html="t( 'dg.sections.part2.p1' )" />
			<p v-html="t( 'dg.sections.part2.p2' )" />
			<p v-html="t( 'dg.sections.part2.p3' )" />
			<p v-html="t( 'dg.sections.part2.p4' )" />
			<Katex
				as="div"
				display
				tex="x_0 = u\cdot \frac{c}{g},\quad y_0 = v\cdot \frac{c}{g}"
			/>
			<p v-html="t( 'dg.sections.part2.p5' )" />
			<p v-html="t( 'dg.sections.part2.p6' )" />
			<Katex
				as="div"
				display
				tex="x = x_0 + \frac{b}{g}\,t,\quad y = y_0 - \frac{a}{g}\,t,\quad t\in\mathbb{Z}"
			/>
			<p v-html="t( 'dg.sections.part2.p7' )" />

			<EddieComment :subtitle="t( 'dg.sections.part2.commentTitle' )">
				<p>{{ t( "dg.sections.part2.commentBody" ) }}</p>
			</EddieComment>
		</div>
	</template>

	<template #interactivePart>
		<h2 id="rechner" v-html="t( 'dg.sections.part3.title' )" />

		<v-card class="panel pa-5">
			<v-form autocomplete="off" @submit.prevent="submit">
				<div class="formGrid">
					<v-text-field v-model="a" inputmode="numeric" label="a" />
					<v-text-field v-model="b" inputmode="numeric" label="b" />
					<v-text-field v-model="c" inputmode="numeric" label="c" />
				</div>

				<div class="actions">
					<v-btn color="primary" type="submit" variant="flat">{{ t( "dg.sections.part3.calc" ) }}</v-btn>
					<v-btn type="button" variant="outlined" @click="randomize">{{ t( "dg.sections.part3.random" ) }}</v-btn>
					<v-btn type="button" variant="text" @click="reset">{{ t( "dg.sections.part3.reset" ) }}</v-btn>
				</div>

				<p class="mini" v-html="t( 'dg.sections.part3.mini' )" />
			</v-form>
		</v-card>

		<v-card class="panel pa-3 mt-4">
			<h3>{{ t( "dg.sections.part3.graphInput" ) }}</h3>
			<ImageZoomer :title="t( 'dg.sections.part3.graphTitle', { a: String( a ), b: String( b ), c: String( c ) } )">
				<DGGraph :a :b :c />
			</ImageZoomer>
			<p class="mini muted">{{ t( "dg.sections.part3.graphHint" ) }}</p>
		</v-card>
	</template>

	<template #calculationPart>
		<v-card class="panel">
			<div class="resultHeader">
				<v-chip
					class="pill"
					:color="
						status.kind === 'ok'
							? 'success'
							: status.kind === 'bad'
								? 'error'
								: status.kind === 'warn'
									? 'warning'
									: undefined
					"
					size="small"
				>
					{{ status.text }}
				</v-chip>
				<div class="equation">
					<Katex :tex="equationTex" />
				</div>
			</div>

			<div class="out">
				<h3 v-if="output.title">{{ output.title }}</h3>
				<div v-if="output.bodyIsKatex" class="kbox">
					<Katex as="div" display :tex="output.body" />
				</div>
				<p v-else class="muted">{{ output.body }}</p>
			</div>

			<div v-if="steps" class="stepWrap">
				<h3 id="schritt-fur-schritt">{{ t( "dg.steps.title" ) }}</h3>

				<v-expansion-panels multiple variant="accordion">
					<v-expansion-panel :value="0">
						<v-expansion-panel-title>{{ t( "dg.steps.s1" ) }}</v-expansion-panel-title>
						<v-expansion-panel-text eager>
							<div class="kbox">
								<Katex
									as="div"
									display
									:tex="`g=\\gcd(${fmt( steps.a )},${fmt( steps.b )})=${fmt( steps.g )}`"
								/>
							</div>
							<div class="kbox">
								<Katex
									as="div"
									display
									:tex="`${fmt( steps.g )}\\mid ${fmt( steps.c )}\\Rightarrow\\text{${t( 'dg.steps.divisible' )}}`"
								/>
							</div>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<v-expansion-panel>
						<v-expansion-panel-title>{{ t( "dg.steps.s2" ) }}</v-expansion-panel-title>
						<v-expansion-panel-text eager>
							<p class="muted">{{ t( "dg.steps.uv" ) }}</p>
							<div class="kbox">
								<Katex
									as="div"
									display
									:tex="`${fmt( steps.a )}\\cdot ${fmt( steps.uNorm )} + ${
										fmt( steps.b )}\\cdot ${fmt( steps.vNorm )} = ${fmt( steps.g )}`"
								/>
							</div>

							<p class="muted">{{ t( "dg.steps.trace" ) }}</p>
							<div class="tableScroller">
								<v-table density="compact">
									<thead>
										<tr>
											<th>{{ t( "dg.steps.step" ) }}</th>
											<th>q</th>
											<th>old_r</th>
											<th>r</th>
											<th>old_s</th>
											<th>s</th>
											<th>old_t</th>
											<th>t</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(st, idx) in steps.euclidSteps.slice( 1 )" :key="idx">
											<td class="mono">{{ idx + 1 }}</td>
											<td class="mono">{{ st.q }}</td>
											<td class="mono">{{ st.old_r }}</td>
											<td class="mono">{{ st.r }}</td>
											<td class="mono">{{ st.old_s }}</td>
											<td class="mono">{{ st.s }}</td>
											<td class="mono">{{ st.old_t }}</td>
											<td class="mono">{{ st.t }}</td>
										</tr>
										<tr v-if="steps.euclidSteps.length <= 1">
											<td class="muted" colspan="8">{{ t( "dg.steps.noSteps" ) }}</td>
										</tr>
									</tbody>
								</v-table>
							</div>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<v-expansion-panel :value="2">
						<v-expansion-panel-title>{{ t( "dg.steps.s3" ) }}</v-expansion-panel-title>
						<v-expansion-panel-text eager>
							<p class="muted">{{ t( "dg.steps.scaleText" ) }}</p>
							<div class="kbox">
								<Katex
									as="div"
									display
									:tex="`x_0=u\\cdot\\frac{c}{g}=${fmt( steps.x0Euclid )}\\quad,\\quad y_0=v\\cdot\\frac{c}{g}=${
										fmt( steps.y0Euclid )}`"
								/>
							</div>
							<div class="kbox">
								<Katex
									as="div"
									display
									:tex="`${fmt( steps.a )}\\cdot ${fmt( steps.x0Euclid )} + ${
										fmt( steps.b )}\\cdot ${fmt( steps.y0Euclid )} = ${fmt( steps.c )}`"
								/>
							</div>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<v-expansion-panel :value="3">
						<v-expansion-panel-title>{{ t( "dg.steps.s4" ) }}</v-expansion-panel-title>
						<v-expansion-panel-text eager>
							<div class="kbox">
								<Katex as="div" display :tex="`x=x_0+\\frac{b}{g}t=${fmt( steps.x0 )}+${fmt( steps.dx )}t`" />
							</div>
							<div class="kbox">
								<Katex as="div" display :tex="`y=y_0-\\frac{a}{g}t=${fmt( steps.y0 )}-${fmt( steps.dy )}t`" />
							</div>
							<p v-if="steps.tShift !== 0" class="muted">
								{{ t( "dg.steps.normalized", { tShift: steps.tShift } ) }}
							</p>
							<p class="muted" v-html="t( 'dg.steps.withT' )" />
						</v-expansion-panel-text>
					</v-expansion-panel>
				</v-expansion-panels>
			</div>

			<div v-if="lastSolution" class="tableWrap">
				<h3 id="losungstabelle">{{ t( "dg.table.title" ) }}</h3>

				<v-row dense>
					<v-col cols="12" md="4">
						<v-text-field v-model="tableControls.tMin" inputmode="numeric" :label="t( 'dg.table.tFrom' )" />
					</v-col>
					<v-col cols="12" md="4">
						<v-text-field v-model="tableControls.tMax" inputmode="numeric" :label="t( 'dg.table.tTo' )" />
					</v-col>
					<v-col cols="12" md="4" />
				</v-row>

				<v-row dense>
					<v-col cols="12" md="4">
						<v-checkbox v-model="tableControls.rangeFilter" :label="t( 'dg.table.rangeOnly' )" />
					</v-col>
					<v-col cols="12" md="4">
						<v-text-field v-model="tableControls.xAbs" inputmode="numeric" :label="t( 'dg.table.xAbs' )" />
					</v-col>
					<v-col cols="12" md="4">
						<v-text-field v-model="tableControls.yAbs" inputmode="numeric" :label="t( 'dg.table.yAbs' )" />
					</v-col>
				</v-row>

				<p class="muted tableMeta">{{ table.meta }}</p>

				<div class="tableScroller">
					<v-table density="compact">
						<thead>
							<tr>
								<th>{{ t( "dg.table.t" ) }}</th>
								<th>{{ t( "dg.table.x" ) }}</th>
								<th>{{ t( "dg.table.y" ) }}</th>
								<th>{{ t( "dg.table.check" ) }} <Katex tex="ax+by" /></th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="r in table.rows" :key="r.t">
								<td class="mono">{{ r.t }}</td>
								<td class="mono">{{ r.x }}</td>
								<td class="mono">{{ r.y }}</td>
								<td class="mono" :class="r.check === lastSolution.c ? 'okText' : 'badText'">
									{{ r.check }}
								</td>
							</tr>
							<tr v-if="table.rows.length === 0">
								<td class="muted" colspan="4">{{ t( "dg.table.noHits" ) }}</td>
							</tr>
						</tbody>
					</v-table>
				</div>
			</div>
		</v-card>
	</template>

	<template #footer>
		<p class="muted">
			{{ t( "dg.footer" ) }}
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import {
	computed, reactive, ref, watch
} from "vue";
import { useI18n } from "@/i18n.mjs";
import DGGraph from "./DG_Graph.vue";
import Katex from "@/components/Katex.vue";
import {
	egcdWithSteps, fmt, gcd, parseIntStrict
} from "./DG_diophantine";
import titleImg from "./DG.webp";

const { t } = useI18n( "book1/DG" );

const subChapter = computed( () => ( {
	einleitung:          t( "dg.subChapter.einleitung" ),
	einfuhrungsbeispiel: t( "dg.subChapter.einfuhrungsbeispiel" ),
	erklarung:           t( "dg.subChapter.erklarung" ),
	rechner:             t( "dg.subChapter.rechner" )
} ) );

const example = {
	a: 17, b: 6, c: 200
};

const a = ref( "17" );
const b = ref( "6" );
const c = ref( "200" );

const status = reactive( {
	kind: "",
	text: t( "dg.result.ready" )
} );

const equationTex = computed( () => {
	const an = parseIntStrict( a.value );
	const bn = parseIntStrict( b.value );
	const cn = parseIntStrict( c.value );

	if ( an === null || bn === null || cn === null ) {
		return "ax + by = c";
	}

	return `${fmt( an )}x + ${fmt( bn )}y = ${fmt( cn )}`;
} );

const output = ref( {
	title:       "",
	body:        t( "dg.result.prompt" ),
	bodyIsKatex: false
} );

const steps = ref( null );

const tableControls = reactive( {
	tMin:        "-5",
	tMax:        "5",
	rangeFilter: false,
	xAbs:        "50",
	yAbs:        "50"
} );

const table = reactive( {
	meta:    "",
	rows:    [],
	clipped: false
} );

const lastSolution = ref( null );

function setStatus( kind, text ) {
	status.kind = kind || "";
	status.text = text;
}

function mod( n, m ) {
	return ( n % m + m ) % m;
}

function normalizeParticularSolution( {
	x0, y0, dx, dy
} ) {
	const stepX = Math.abs( dx );
	const stepY = Math.abs( dy );
	const normalizeX = stepX <= stepY;

	if ( normalizeX ) {
		const x0Norm = mod( x0, stepX );
		const tShift = ( x0Norm - x0 ) / dx;
		const y0Norm = y0 - dy * tShift;
		return {
			tShift, x0: x0Norm, y0: y0Norm, normalizedBy: "x"
		};
	}

	const y0Norm = mod( y0, stepY );
	const tShift = ( y0 - y0Norm ) / dy;
	const x0Norm = x0 + dx * tShift;
	return {
		tShift, x0: x0Norm, y0: y0Norm, normalizedBy: "y"
	};
}

function randInt( min, max ) {
	return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}

function randomExample() {
	const aa = randInt( -30, 30 ) || 14;
	const bb = randInt( -30, 30 ) || 21;
	const g = gcd( aa, bb ) || 1;
	const makeSolvable = Math.random() < 0.75;
	let cc = randInt( -60, 60 );

	if ( makeSolvable ) {
		cc = cc - cc % g;
	} else if ( g !== 0 && cc % g === 0 ) {
		cc += 1;
	}

	return {
		a: aa, b: bb, c: cc
	};
}

function reset() {
	a.value = "17";
	b.value = "6";
	c.value = "200";
	setStatus( "", t( "dg.result.ready" ) );
	output.value = {
		title:       "",
		body:        t( "dg.result.prompt" ),
		bodyIsKatex: false
	};
	steps.value = null;
	lastSolution.value = null;
	table.meta = "";
	table.rows = [];
	table.clipped = false;
}

function solveAndRender(
	an, bn, cn
) {
	steps.value = null;
	lastSolution.value = null;
	table.meta = "";
	table.rows = [];
	table.clipped = false;

	if ( an === 0 && bn === 0 ) {
		if ( cn === 0 ) {
			setStatus( "warn", t( "dg.result.infinite" ) );
			output.value = {
				title:       t( "dg.result.effective" ),
				body:        "0 = 0",
				bodyIsKatex: true
			};
		} else {
			setStatus( "bad", t( "dg.result.none" ) );
			output.value = {
				title:       t( "dg.result.effective" ),
				body:        `0 = ${fmt( cn )}`,
				bodyIsKatex: true
			};
		}

		return;
	}

	if ( an === 0 ) {
		if ( cn % bn !== 0 ) {
			setStatus( "bad", t( "dg.result.none" ) );
			output.value = {
				title: t( "dg.result.becauseA0" ),
				body:  [
					`${fmt( bn )}y = ${fmt( cn )}`,
					"\\;\\Rightarrow\\;\\text{nicht teilbar}",
					"\\Rightarrow \\text{keine L\\\"osung}"
				].join( "" ),
				bodyIsKatex: true
			};
			return;
		}

		const y0 = cn / bn;
		setStatus( "ok", t( "dg.result.solvable" ) );
		output.value = {
			title:       t( "dg.result.becauseA0" ),
			body:        `y = ${fmt( y0 )}\\quad\\text{und}\\quad x=t\\ \\text{frei}`,
			bodyIsKatex: true
		};
		return;
	}

	if ( bn === 0 ) {
		if ( cn % an !== 0 ) {
			setStatus( "bad", t( "dg.result.none" ) );
			output.value = {
				title: t( "dg.result.becauseB0" ),
				body:  [
					`${fmt( an )}x = ${fmt( cn )}`,
					"\\;\\Rightarrow\\;\\text{nicht teilbar}",
					"\\Rightarrow \\text{keine L\\\"osung}"
				].join( "" ),
				bodyIsKatex: true
			};
			return;
		}

		const x0 = cn / an;
		setStatus( "ok", t( "dg.result.solvable" ) );
		output.value = {
			title:       t( "dg.result.becauseB0" ),
			body:        `x = ${fmt( x0 )}\\quad\\text{und}\\quad y=t\\ \\text{frei}`,
			bodyIsKatex: true
		};
		return;
	}

	const g = gcd( an, bn );

	if ( cn % g !== 0 ) {
		setStatus( "bad", t( "dg.result.none" ) );
		output.value = {
			title:       t( "dg.result.gcdCheck" ),
			body:        `g=\\gcd(${fmt( an )},${fmt( bn )})=${fmt( g )},\\quad ${fmt( g )}\\nmid ${fmt( cn )}`,
			bodyIsKatex: true
		};
		return;
	}

	const euclidInfo = egcdWithSteps( an, bn );
	let g2 = euclidInfo.g;
	let u = euclidInfo.x;
	let v = euclidInfo.y;

	const sign = g2 < 0 ? -1 : 1;
	g2 = Math.abs( g2 );
	const uNorm = u * sign;
	const vNorm = v * sign;

	const scale = cn / g2;
	const x0Euclid = uNorm * scale;
	const y0Euclid = vNorm * scale;

	const dx = bn / g;
	const dy = an / g;

	const normalized = normalizeParticularSolution( {
		x0: x0Euclid, y0: y0Euclid, dx, dy
	} );
	const x0 = normalized.x0;
	const y0 = normalized.y0;

	setStatus( "ok", t( "dg.result.solvable" ) );
	output.value = {
		title: t( "dg.result.resultTitle" ),
		body:  [
			`(x_0,y_0)=(${fmt( x0 )},${fmt( y0 )})`,
			`\\quad\\text{und}\\quad x=${fmt( x0 )}+${fmt( dx )}t,`,
			`\\ y=${fmt( y0 )}-${fmt( dy )}t`
		].join( "" ),
		bodyIsKatex: true
	};

	steps.value = {
		a:            an,
		b:            bn,
		c:            cn,
		g,
		euclidSteps:  euclidInfo.steps,
		uNorm,
		vNorm,
		x0Euclid,
		y0Euclid,
		x0,
		y0,
		dx,
		dy,
		tShift:       normalized.tShift,
		normalizedBy: normalized.normalizedBy
	};

	lastSolution.value = {
		a: an, b: bn, c: cn, x0, y0, dx, dy
	};
	updateTable();
}

function submit() {
	const an = parseIntStrict( a.value );
	const bn = parseIntStrict( b.value );
	const cn = parseIntStrict( c.value );

	if ( an === null || bn === null || cn === null ) {
		setStatus( "warn", t( "dg.result.inputQuestion" ) );
		output.value = {
			title:       "",
			body:        t( "dg.result.inputBody" ),
			bodyIsKatex: false
		};
		steps.value = null;
		lastSolution.value = null;
		table.meta = "";
		table.rows = [];
		table.clipped = false;
		return;
	}

	solveAndRender(
		an, bn, cn
	);
}

function randomize() {
	const ex = randomExample();
	a.value = String( ex.a );
	b.value = String( ex.b );
	c.value = String( ex.c );
	submit();
}

function updateTable() {
	const sol = lastSolution.value;

	if ( !sol ) {
		return;
	}

	const tMin = parseIntStrict( tableControls.tMin );
	const tMax = parseIntStrict( tableControls.tMax );
	const xAbs = parseIntStrict( tableControls.xAbs );
	const yAbs = parseIntStrict( tableControls.yAbs );

	if ( tMin === null || tMax === null || xAbs === null || yAbs === null ) {
		table.meta = t( "dg.table.invalidInput" );
		table.rows = [];
		table.clipped = false;
		return;
	}

	const lo = Math.min( tMin, tMax );
	const hi = Math.max( tMin, tMax );
	const rows = [];

	for ( let t = lo; t <= hi; t++ ) {
		const x = sol.x0 + sol.dx * t;
		const y = sol.y0 - sol.dy * t;

		if ( tableControls.rangeFilter ) {
			if ( Math.abs( x ) > xAbs || Math.abs( y ) > yAbs ) {
				continue;
			}
		}

		rows.push( {
			t, x, y, check: sol.a * x + sol.b * y
		} );
	}

	const maxShow = 500;
	table.clipped = rows.length > maxShow;
	table.rows = table.clipped ? rows.slice( 0, maxShow ) : rows;

	table.meta = t( "dg.table.meta", {
		lo,
		hi,
		count:   rows.length,
		clipped: table.clipped ? t( "dg.table.clipped", { maxShow } ) : "",
		filter:  tableControls.rangeFilter ? t( "dg.table.filter", { xAbs, yAbs } ) : ""
	} );
}

watch( () => [
	lastSolution.value,
	tableControls.tMin,
	tableControls.tMax,
	tableControls.rangeFilter,
	tableControls.xAbs,
	tableControls.yAbs
],
() => updateTable() );
</script>
