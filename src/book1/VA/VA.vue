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
			<p v-html="t( 'book.p3' )"/>
		</div>
	</template>

	<template #descriptionPart>
		<h2 id="gleichgewicht">{{ t( "sections.part1.title" ) }}</h2>
		<div class="eddie">
			<p>
				{{ t( "sections.part1.p1Before" ) }}
				<Katex tex="1300\,\mathrm{m}" />.
				{{ t( "sections.part1.p1After" ) }}
			</p>
			<p v-html="t( 'sections.part1.p2' )"/>
			<div class="kbox">
				<Katex as="div" display tex="W = m g,\qquad A = \rho_{\mathrm{W}} g V,\qquad W=A\Rightarrow m=\rho_{\mathrm{W}}V." />
			</div>
			<p v-html="t( 'sections.part1.p3' )"/>
			<v-table class="mt-3" density="compact">
				<thead>
					<tr>
						<th>{{ t( "sections.part1.table.symbol" ) }}</th>
						<th>{{ t( "sections.part1.table.meaning" ) }}</th>
						<th class="text-right">{{ t( "sections.part1.table.value" ) }}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in vesselRows" :key="row.id">
						<td><Katex :tex="row.symbol" /></td>
						<td>{{ row.label }}</td>
						<td class="text-right"><Katex :tex="row.value" /></td>
					</tr>
				</tbody>
			</v-table>
		</div>

		<h2 id="metazentrum" class="mt-8">{{ t( "sections.part2.title" ) }}</h2>
		<figure class="exampleFigure">
			<ImageZoomer :title="t( 'sections.part2.imageTitle' )">
				<VAShip nolegend zoom="2" />
			</ImageZoomer>
		</figure>
		<div class="eddie">
			<p>
				{{ t( "sections.part2.p1Before" ) }}
				<Katex tex="G" /> ({{ t( "sections.part2.g" ) }}),
				<Katex tex="B" /> ({{ t( "sections.part2.b" ) }})
				{{ t( "sections.part2.and" ) }}
				<Katex tex="M" /> ({{ t( "sections.part2.m" ) }}).
			</p>
			<ul>
				<li>
					<Katex tex="G" /> <span v-html="t( 'sections.part2.bullets.g' )" />
				</li>
				<li>
					<Katex tex="B" /> <span v-html="t( 'sections.part2.bullets.b' )" />
				</li>
				<li>
					<Katex tex="M" /> <span v-html="t( 'sections.part2.bullets.m' )" />
				</li>
			</ul>
			<p>
				{{ t( "sections.part2.p2Before" ) }}
				<Katex tex="GM" />
				{{ t( "sections.part2.p2After" ) }}
			</p>
			<div class="kbox">
				<Katex as="div" display tex="GM = KM - KG,\qquad BM=\frac{I_{\mathrm{W}}}{V}." />
			</div>
			<p>
				{{ t( "sections.part2.p3Before" ) }}
				<Katex tex="GM>0" />
				{{ t( "sections.part2.p3Middle" ) }}
				<Katex tex="GM" />
				{{ t( "sections.part2.p3After" ) }}
				<Katex tex="KG" />
				{{ t( "sections.part2.p3End" ) }}
			</p>
			<p>
				{{ t( "sections.part2.p4Before" ) }}
				<Katex tex="I_{\mathrm{W}}" />
				{{ t( "sections.part2.p4After" ) }}
			</p>
		</div>

		<h2 id="windmoment" class="mt-8">{{ t( "sections.part3.title" ) }}</h2>
		<div class="eddie">
			<p>
				{{ t( "sections.part3.p1Before" ) }}
				<Katex tex="\varphi" />
				{{ t( "sections.part3.p1After" ) }}
			</p>
			<p>
				{{ t( "sections.part3.p2Before" ) }}
				<Katex tex="\varphi" />
				{{ t( "sections.part3.p2Middle" ) }}
				<Katex tex="\varphi=0^\circ" />
				{{ t( "sections.part3.p2After" ) }}
			</p>
			<p>
				{{ t( "sections.part3.p3Before" ) }}
				<Katex tex="10^\circ\text{ bis }15^\circ" />
				{{ t( "sections.part3.p3After" ) }}
			</p>
			<div class="kbox">
				<Katex as="div" display tex="GZ(\varphi)\approx GM\sin\varphi,\qquad M_{\mathrm{R}}(\varphi)\approx \Delta g\,GM\sin\varphi." />
			</div>
			<p v-html="t( 'sections.part3.p4' )"/>
			<div class="kbox">
				<Katex
					as="div"
					display
					tex="F_{\mathrm{W}}\approx \frac12\rho_{\mathrm{L}} C_D A v^2,\qquad M_{\mathrm{W}}\approx F_{\mathrm{W}}\,h_{\mathrm{CE}}"
				/>
			</div>
			<p>
				{{ t( "sections.part3.p5Before" ) }}
				<Katex tex="M_{\mathrm{W}}\gtrsim M_{\mathrm{R}}" />.
			</p>
			<p v-html="t( 'sections.part3.p6' )"/>
			<div class="kbox">
				<Katex as="div" display tex="\frac{H}{B}\approx\frac{52{,}5}{11{,}7}\approx 4{,}49." />
			</div>
			<p>
				{{ t( "sections.part3.p7Before" ) }}
				<Katex tex="KG" />
				{{ t( "sections.part3.p7After" ) }}
			</p>
		</div>

		<h2 id="downflooding" class="mt-8">{{ t( "sections.part4.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part4.p1' )"/>
			<div class="kbox">
				<Katex as="div" display tex="GM_{\mathrm{eff}}\approx GM-\frac{\rho_{\mathrm{W}}I_{\mathrm{FS}}}{\Delta}." />
			</div>
			<p>
				{{ t( "sections.part4.p2Before" ) }}
				<Katex tex="I_{\mathrm{FS}}" />
				{{ t( "sections.part4.p2Middle" ) }}
				<Katex tex="GM_{\mathrm{eff}}" />
				{{ t( "sections.part4.p2After" ) }}
			</p>
			<p v-html="t( 'sections.part4.p3' )"/>
			<p v-html="t( 'sections.part4.p4' )"/>
			<div class="kbox">
				<Katex as="div" display tex="T\approx 2\pi\sqrt{\frac{I_{\varphi}}{\Delta g\,GM}}\approx 2\pi\sqrt{\frac{k^2}{g\,GM}}." />
			</div>
		</div>

		<h2 id="schluss" class="mt-8">{{ t( "sections.part5.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part5.p1' )"/>
			<ol>
				<li><Katex tex="KG" /> {{ t( "sections.part5.items.kg" ) }}</li>
				<li><Katex tex="I_{\mathrm{W}}" /> {{ t( "sections.part5.items.iw" ) }}</li>
				<li>{{ t( "sections.part5.items.downflooding" ) }}</li>
			</ol>
			<p v-html="t( 'sections.part5.p2' )"/>
			<p class="muted">{{ t( "sections.part5.note" ) }}</p>
		</div>
	</template>

	<template #interactivePart>
		<h2 id="interaktiv">{{ t( "interactive.title" ) }}</h2>
		<div class="eddie d-flex flex-column ga-3">
			<v-card class="panel pa-4">
				<v-select
					v-model="presetId"
					hide-details="auto"
					item-title="title"
					item-value="value"
					:items="geometryPresets"
					:label="t( 'interactive.presetLabel' )"
				/>

				<div class="sectionTitle">{{ t( "interactive.sections.geometry" ) }}</div>
				<v-row dense>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.beam" hide-details="auto" :label="t( 'interactive.fields.beam' )" />
					</v-col>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.depth" hide-details="auto" :label="t( 'interactive.fields.depth' )" />
					</v-col>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.draft" hide-details="auto" :label="t( 'interactive.fields.draft' )" />
					</v-col>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.length" hide-details="auto" :label="t( 'interactive.fields.length' )" />
					</v-col>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.cwp" hide-details="auto" :label="t( 'interactive.fields.cwp' )" />
					</v-col>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.openingHeight" hide-details="auto" :label="t( 'interactive.fields.openingHeight' )" />
					</v-col>
				</v-row>

				<div class="sectionTitle">{{ t( "interactive.sections.mass" ) }}</div>
				<v-row dense>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.displacement" hide-details="auto" :label="t( 'interactive.fields.displacement' )" />
					</v-col>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.kg" hide-details="auto" :label="t( 'interactive.fields.kg' )" />
					</v-col>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.kb" hide-details="auto" :label="t( 'interactive.fields.kb' )" />
					</v-col>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.freeSurface" hide-details="auto" :label="t( 'interactive.fields.freeSurface' )" />
					</v-col>
				</v-row>

				<div class="sectionTitle">{{ t( "interactive.sections.wind" ) }}</div>
				<v-row dense>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.sailArea" hide-details="auto" :label="t( 'interactive.fields.sailArea' )" />
					</v-col>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.windSpeed" hide-details="auto" :label="t( 'interactive.fields.windSpeed' )" />
					</v-col>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.cd" hide-details="auto" :label="t( 'interactive.fields.cd' )" />
					</v-col>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.hCe" hide-details="auto" :label="t( 'interactive.fields.hCe' )" />
					</v-col>
				</v-row>

				<div class="d-flex flex-wrap ga-2 mt-2">
					<v-btn color="primary" variant="flat" @click="loadPreset">{{ t( "interactive.loadPreset" ) }}</v-btn>
					<v-btn variant="tonal" @click="randomizeWind">{{ t( "interactive.randomWind" ) }}</v-btn>
				</div>
			</v-card>

			<v-alert :type="calc.statusKind" variant="tonal">
				{{ calc.statusText }}
				<p v-if="calc.issues.length" class="muted mt-2">
					{{ calc.issues.join( " · " ) }}
				</p>
			</v-alert>
		</div>
		<h2 class="mt-2">{{ t( "interactive.calculationTitle" ) }}</h2>
		<div class="eddie d-flex flex-column ga-3">
			<v-sheet border class="pa-3 rounded">
				<div class="kbox">
					<div class="mono">{{ t( "interactive.formulas.volume" ) }} = {{ fmt( calc.volume, 1 ) }} m³</div>
					<div class="mono">{{ t( "interactive.formulas.iw" ) }} = {{ fmt( calc.iw, 1 ) }} m⁴</div>
					<div class="mono">{{ t( "interactive.formulas.bm" ) }} = {{ fmt( calc.bm, 3 ) }} m</div>
					<div class="mono">{{ t( "interactive.formulas.km" ) }} = {{ fmt( calc.km, 3 ) }} m</div>
					<div class="mono">{{ t( "interactive.formulas.gm" ) }} = {{ fmt( calc.gmRaw, 3 ) }} m</div>
					<div class="mono">{{ t( "interactive.formulas.gmEff" ) }} = {{ fmt( calc.gmEff, 3 ) }} m</div>
				</div>
			</v-sheet>

			<v-sheet border class="pa-3 rounded">
				<div class="kbox">
					<div class="mono">{{ t( "interactive.formulas.windForce" ) }} = {{ fmt( calc.windForce / 1000, 2 ) }} kN</div>
					<div class="mono">{{ t( "interactive.formulas.windMoment" ) }} = {{ fmt( calc.windMoment / 1000, 1 ) }} kN m</div>
					<div class="mono">{{ t( "interactive.formulas.restoringMoment" ) }} = {{ fmt( calc.restoringMoment / 1000, 1 ) }} kN m</div>
					<div class="mono">{{ t( "interactive.formulas.heel" ) }} = {{ fmt( calc.heelDeg, 2 ) }} deg</div>
					<div class="mono">{{ t( "interactive.formulas.downfloodAngle" ) }} = {{ fmt( calc.downfloodAngle, 2 ) }} deg</div>
				</div>
			</v-sheet>

			<v-sheet border class="pa-3 rounded">
				<v-table density="compact">
					<thead>
						<tr>
							<th>{{ t( "interactive.resultTable.metric" ) }}</th>
							<th class="text-right">{{ t( "interactive.resultTable.value" ) }}</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{{ t( "interactive.resultTable.ratio" ) }}</td>
							<td class="mono text-right">{{ fmt( calc.ratio, 3 ) }}</td>
						</tr>
						<tr>
							<td>{{ t( "interactive.resultTable.gz" ) }}</td>
							<td class="mono text-right">{{ fmt( calc.gz, 3 ) }} m</td>
						</tr>
						<tr>
							<td>{{ t( "interactive.resultTable.margin" ) }}</td>
							<td class="mono text-right">{{ fmt( calc.downfloodMargin, 2 ) }} deg</td>
						</tr>
						<tr>
							<td>{{ t( "interactive.resultTable.status" ) }}</td>
							<td class="mono text-right">{{ calc.shipStatus }}</td>
						</tr>
					</tbody>
				</v-table>
			</v-sheet>
		</div>
	</template>

	<template #calculationPart>
		<ImageZoomer :title="t( 'simulationTitle' )">
			<VAShip
				:beam="calc.beam"
				:bm="calc.bm"
				:depth="calc.depth"
				:downflood-angle="calc.downfloodAngle"
				:draft="calc.draft"
				:gm="calc.gmEff"
				:h-ce="calc.hCe"
				:heel-deg="calc.heelDeg"
				:kb="calc.kb"
				:kg="calc.kg"
				:restoring-moment="calc.restoringMoment"
				:sail-area="calc.sailArea"
				:status="calc.shipStatus"
				:wind-moment="calc.windMoment"
				:wind-speed="calc.windSpeed"
			/>
		</ImageZoomer>
	</template>
</AppFrame>
</template>

<script setup>
import {
	computed,
	reactive,
	ref,
	watch
} from "vue";
import { useI18n } from "@/utils/i18n.mjs";
import titleImg from "./VA.webp";
import VAShip from "./VA_Ship.vue";

const RHO_WATER = 1025;
const G = 9.81;

const {
	locale, t, tm
} = useI18n( "book1/VA" );

const presetDefaults = [
	{
		value:         "vasa",
		beam:          11.7,
		depth:         11.0,
		draft:         4.8,
		length:        46.0,
		cwp:           0.70,
		openingHeight: 1.05,
		displacement:  1210,
		kg:            6.9,
		kb:            2.55,
		freeSurface:   0.08,
		sailArea:      1200,
		windSpeed:     12,
		cd:            1.20,
		hCe:           20.0
	},
	{
		value:         "ballast",
		beam:          11.7,
		depth:         11.0,
		draft:         5.1,
		length:        46.0,
		cwp:           0.73,
		openingHeight: 1.45,
		displacement:  1320,
		kg:            5.9,
		kb:            2.70,
		freeSurface:   0.05,
		sailArea:      1120,
		windSpeed:     12,
		cd:            1.12,
		hCe:           18.5
	},
	{
		value:         "beamy",
		beam:          13.5,
		depth:         11.2,
		draft:         5.0,
		length:        46.0,
		cwp:           0.74,
		openingHeight: 1.50,
		displacement:  1380,
		kg:            6.2,
		kb:            2.65,
		freeSurface:   0.04,
		sailArea:      1150,
		windSpeed:     12,
		cd:            1.10,
		hCe:           18.8
	},
	{
		value:         "top-heavy",
		beam:          10.5,
		depth:         10.8,
		draft:         4.6,
		length:        44.0,
		cwp:           0.67,
		openingHeight: 0.85,
		displacement:  1090,
		kg:            7.4,
		kb:            2.35,
		freeSurface:   0.12,
		sailArea:      1260,
		windSpeed:     12,
		cd:            1.25,
		hCe:           21.0
	},
	{
		value:         "modern-slim-stable",
		beam:          9.4,
		depth:         10.6,
		draft:         5.7,
		length:        48.0,
		cwp:           0.82,
		openingHeight: 1.9,
		displacement:  1800,
		kg:            3.6,
		kb:            3.2,
		freeSurface:   0.03,
		sailArea:      950,
		windSpeed:     12,
		cd:            1.02,
		hCe:           16.5
	}
];

const presetId = ref( presetDefaults[ 0 ].value );
const inputs = reactive( {
	beam:          "",
	depth:         "",
	draft:         "",
	length:        "",
	cwp:           "",
	openingHeight: "",
	displacement:  "",
	kg:            "",
	kb:            "",
	freeSurface:   "",
	sailArea:      "",
	windSpeed:     "",
	cd:            "",
	hCe:           ""
} );

const subChapter = computed( () => tm( "subChapter" ) ?? {} );
const geometryPresets = computed( () => presetDefaults.map( ( preset ) => ( {
	...preset,
	title: t( `presets.${preset.value}` )
} ) ) );
const vesselRows = computed( () => tm( "sections.part1.rows" ) ?? [] );

function clamp(
	v, lo, hi
) {
	return Math.min( hi, Math.max( lo, v ) );
}

function degToRad( deg ) {
	return deg * Math.PI / 180;
}

function radToDeg( rad ) {
	return rad * 180 / Math.PI;
}

function fmt( value, digits = 2 ) {
	if ( !Number.isFinite( value ) ) {
		return "-";
	}

	return new Intl.NumberFormat( locale.value, {
		maximumFractionDigits: digits,
		minimumFractionDigits: digits
	} ).format( Number( value ) );
}

function getPreset() {
	return geometryPresets.value.find( ( preset ) => preset.value === presetId.value ) ?? geometryPresets.value[ 0 ];
}

function setInputsFromPreset( preset ) {
	inputs.beam = fmt( preset.beam, 2 );
	inputs.depth = fmt( preset.depth, 2 );
	inputs.draft = fmt( preset.draft, 2 );
	inputs.length = fmt( preset.length, 2 );
	inputs.cwp = fmt( preset.cwp, 3 );
	inputs.openingHeight = fmt( preset.openingHeight, 2 );
	inputs.displacement = fmt( preset.displacement, 1 );
	inputs.kg = fmt( preset.kg, 2 );
	inputs.kb = fmt( preset.kb, 2 );
	inputs.freeSurface = fmt( preset.freeSurface, 2 );
	inputs.sailArea = fmt( preset.sailArea, 0 );
	inputs.windSpeed = fmt( preset.windSpeed, 1 );
	inputs.cd = fmt( preset.cd, 2 );
	inputs.hCe = fmt( preset.hCe, 2 );
}

function loadPreset() {
	setInputsFromPreset( getPreset() );
}

watch(
	presetId,
	() => loadPreset(),
	{ immediate: true }
);

function randomizeWind() {
	const windSpeed = 6 + Math.random() * 20;
	const areaFactor = 0.85 + Math.random() * 0.35;
	const baseArea = getPreset().sailArea;
	inputs.windSpeed = fmt( windSpeed, 1 );
	inputs.sailArea = fmt( baseArea * areaFactor, 0 );
}

function issueForInvalid( label, fallback ) {
	return t( "issues.invalid", {
		label,
		value: fmt( fallback, 2 )
	} );
}

function issueForClamped( label, value ) {
	return t( "issues.clamped", {
		label,
		value: fmt( value, 2 )
	} );
}

function readNumber(
	raw,
	label,
	fallback,
	min = -Number.POSITIVE_INFINITY,
	max = Number.POSITIVE_INFINITY
) {
	const normalized = String( raw ?? "" ).trim()
		.replace( ",", "." );

	if ( !normalized ) {
		return {
			value: clamp(
				fallback, min, max
			),
			issue: ""
		};
	}

	const parsed = Number( normalized );

	if ( !Number.isFinite( parsed ) ) {
		return {
			value: clamp(
				fallback, min, max
			),
			issue: issueForInvalid( label, fallback )
		};
	}

	const bounded = clamp(
		parsed, min, max
	);

	if ( bounded !== parsed ) {
		return {
			value: bounded,
			issue: issueForClamped( label, bounded )
		};
	}

	return { value: bounded, issue: "" };
}

const calc = computed( () => {
	const preset = getPreset();
	const issues = [];
	const labels = tm( "fieldShort" ) ?? {};

	const beamRes = readNumber(
		inputs.beam, labels.beam, preset.beam, 4, 30
	);
	const depthRes = readNumber(
		inputs.depth, labels.depth, preset.depth, 2, 25
	);
	const draftRes = readNumber(
		inputs.draft, labels.draft, preset.draft, 0.4, depthRes.value - 0.1
	);
	const lengthRes = readNumber(
		inputs.length, labels.length, preset.length, 10, 120
	);
	const cwpRes = readNumber(
		inputs.cwp, labels.cwp, preset.cwp, 0.45, 0.98
	);
	const openingRes = readNumber(
		inputs.openingHeight, labels.openingHeight, preset.openingHeight, 0.05, 8
	);
	const dispRes = readNumber(
		inputs.displacement, labels.displacement, preset.displacement, 100, 10000
	);
	const kgRes = readNumber(
		inputs.kg, labels.kg, preset.kg, 0.2, 20
	);
	const kbRes = readNumber(
		inputs.kb, labels.kb, preset.kb, 0.1, 20
	);
	const freeSurfaceRes = readNumber(
		inputs.freeSurface, labels.freeSurface, preset.freeSurface, 0, 5
	);
	const areaRes = readNumber(
		inputs.sailArea, labels.sailArea, preset.sailArea, 0, 8000
	);
	const windRes = readNumber(
		inputs.windSpeed, labels.windSpeed, preset.windSpeed, 0, 60
	);
	const cdRes = readNumber(
		inputs.cd, labels.cd, preset.cd, 0.2, 3.0
	);
	const hCeRes = readNumber(
		inputs.hCe, labels.hCe, preset.hCe, depthRes.value + 0.5, 60
	);

	for ( const result of [
		beamRes,
		depthRes,
		draftRes,
		lengthRes,
		cwpRes,
		openingRes,
		dispRes,
		kgRes,
		kbRes,
		freeSurfaceRes,
		areaRes,
		windRes,
		cdRes,
		hCeRes
	] ) {
		if ( result.issue ) {
			issues.push( result.issue );
		}
	}

	const beam = beamRes.value;
	const depth = depthRes.value;
	const draft = draftRes.value;
	const length = lengthRes.value;
	const cwp = cwpRes.value;
	const openingHeight = openingRes.value;
	const displacementTons = dispRes.value;
	const kg = kgRes.value;
	const kb = kbRes.value;
	const freeSurface = freeSurfaceRes.value;
	const sailArea = areaRes.value;
	const windSpeed = windRes.value;
	const cd = cdRes.value;
	const hCe = hCeRes.value;

	const displacementKg = displacementTons * 1000;
	const volume = displacementKg / RHO_WATER;
	const iw = cwp * length * beam * beam * beam / 12;
	const bm = iw / volume;
	const km = kb + bm;
	const gmRaw = km - kg;
	const gmEff = gmRaw - freeSurface;
	const rhoAir = 1.225;
	const windForce = 0.5 * rhoAir * cd * sailArea * windSpeed * windSpeed;
	const windMoment = windForce * hCe;
	const downfloodAngle = radToDeg( Math.atan2( openingHeight, beam / 2 ) );
	const stableDenominator = displacementKg * G * Math.max( gmEff, 1e-9 );
	const ratio = gmEff > 0 ? windMoment / stableDenominator : Number.POSITIVE_INFINITY;
	const windDrive = windMoment / ( displacementKg * G * Math.max( beam * 0.5, 0.25 ) );

	let heelDeg = 0;

	if ( gmEff <= 0 ) {
		const instability = Math.max( 0, -gmEff );
		const baseHeel = downfloodAngle * 0.55 + 3 + instability * 2.5;
		const windHeel = radToDeg( Math.atan( windDrive * 5 ) );
		heelDeg = clamp(
			baseHeel + windHeel,
			0,
			70
		);
	} else if ( ratio <= 1 ) {
		heelDeg = radToDeg( Math.asin( Math.max( 0, ratio ) ) );
	} else {
		heelDeg = Math.min( 70, 35 + ( ratio - 1 ) * 14 );
	}

	const restoringMoment = gmEff > 0 ?
		displacementKg * G * gmEff * Math.sin( degToRad( heelDeg ) ) :
		0;
	const gz = gmEff > 0 ? gmEff * Math.sin( degToRad( heelDeg ) ) : 0;
	const downfloodMargin = downfloodAngle - heelDeg;

	let statusKind = "success";
	let statusText = t( "status.successText" );
	let shipStatus = t( "status.successShort" );

	if ( gmEff <= 0 ) {
		statusKind = "error";
		statusText = t( "status.unstableText" );
		shipStatus = t( "status.unstableShort" );
	} else if ( heelDeg >= downfloodAngle ) {
		statusKind = "error";
		statusText = t( "status.criticalText" );
		shipStatus = t( "status.criticalShort" );
	} else if ( ratio > 0.85 ) {
		statusKind = "warning";
		statusText = t( "status.warningText" );
		shipStatus = t( "status.warningShort" );
	} else if ( ratio > 0.6 ) {
		statusKind = "info";
		statusText = t( "status.infoText" );
		shipStatus = t( "status.infoShort" );
	}

	return {
		issues,
		beam,
		depth,
		draft,
		length,
		cwp,
		openingHeight,
		displacementTons,
		kg,
		kb,
		freeSurface,
		sailArea,
		windSpeed,
		cd,
		hCe,
		volume,
		iw,
		bm,
		km,
		gmRaw,
		gmEff,
		windForce,
		windMoment,
		downfloodAngle,
		ratio,
		heelDeg,
		restoringMoment,
		gz,
		downfloodMargin,
		statusKind,
		statusText,
		shipStatus
	};
} );
</script>

<style scoped>
.sectionTitle {
	font-size: 0.95rem;
	font-weight: 600;
	margin-top: 14px;
	margin-bottom: 4px;
}
</style>
