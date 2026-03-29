<!-- i18n-ally-scope: useI18n("book1.UD") -->
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
			<p v-html="t( 'book.p1' )"/>
			<p v-html="t( 'book.p2' )"/>
			<p v-html="t( 'book.p3' )"/>
		</div>
	</template>

	<template #descriptionPart>
		<h2 id="frage">{{ t( "sections.part1.title" ) }}</h2>
		<div class="eddie">
			<p>
				{{ t( "sections.part1.p1Before" ) }}
				<Katex tex="h=100\ \mathrm{m}" />
				{{ t( "sections.part1.p1After" ) }}
			</p>
			<p>
				{{ t( "sections.part1.p2Before" ) }}
				<Katex :tex="t( 'sections.part1.shoreAreaVar' )" />
				{{ t( "sections.part1.p2Middle" ) }}
				<Katex :tex="t( 'sections.part1.landAreaVar' )" />.
			</p>
		</div>

		<h2 id="formel" class="mt-8">{{ t( "sections.part2.title" ) }}</h2>
		<UDGraph />
		<div class="eddie">
			<p>
				{{ t( "sections.part2.p1Before" ) }}
				<Katex tex="d" />
				{{ t( "sections.part2.p1Middle" ) }}
				<Katex tex="h" />
				{{ t( "sections.part2.p1After" ) }}
			</p>
			<div class="kbox">
				<Katex as="div" display :tex="t( 'sections.part2.shoreAreaBox' )" />
			</div>
			<p>
				{{ t( "sections.part2.p2Before" ) }}
				<Katex tex="\sum_i (h\ell_i)=h\sum_i \ell_i = h\,d" />.
			</p>
			<p>
				{{ t( "sections.part2.p3Before" ) }}
				<Katex tex="\pi h^2" />.
			</p>
			<p>
				{{ t( "sections.part2.p4Before" ) }}
				<Katex tex="n" />
				{{ t( "sections.part2.p4Middle" ) }}
				<Katex tex="n\pi h^2" />:
			</p>
			<div class="kbox">
				<Katex as="div" display :tex="t( 'sections.part2.shoreAreaAddBox' )" />
			</div>
			<p class="muted">{{ t( "sections.part2.note" ) }}</p>
		</div>

		<h2 id="winkel" class="mt-8">{{ t( "sections.part3.title" ) }}</h2>
		<div class="eddie">
			<p>
				{{ t( "sections.part3.p1Before" ) }}
				<Katex tex="\varphi_i" />
				{{ t( "sections.part3.p1Middle" ) }}
				<Katex tex="i" />
				{{ t( "sections.part3.p1After" ) }}
				<Katex tex="\frac{h^2}{2}\varphi_i" />.
			</p>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					:tex="t( 'sections.part3.cornersBox' )"
				/>
			</div>
			<p>
				{{ t( "sections.part3.p2Before" ) }}
				<Katex tex="n" />
				{{ t( "sections.part3.p2Middle" ) }}
				<Katex tex="\sum \varphi = 2\pi n" />
				{{ t( "sections.part3.p2After" ) }}
				<Katex :tex="t( 'sections.part3.cornersAddVar' )" />.
			</p>
			<p class="muted">{{ t( "sections.part3.note" ) }}</p>
			<div class="kbox">
				<Katex as="div" display :tex="t( 'sections.part3.distanceProbBox' )" />
			</div>
		</div>

		<h2 class="mt-8">{{ t( "sections.part4.title" ) }}</h2>
		<div class="eddie">
			<h3>{{ t( "sections.part4.stage1Title" ) }}</h3>
			<p v-html="t( 'sections.part4.stage1Text' )"/>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					:tex="t( 'sections.part4.stage1Box' )"
				/>
			</div>
			<p class="muted">
				{{ t( "sections.part4.stage1NoteBefore" ) }}
				<Katex tex="h" />
				{{ t( "sections.part4.stage1NoteMiddle" ) }}
				<Katex tex="h" />
				{{ t( "sections.part4.stage1NoteAfter" ) }}
			</p>

			<h3>{{ t( "sections.part4.stage2Title" ) }}</h3>
			<p>
				{{ t( "sections.part4.stage2TextBefore" ) }}
				<Katex tex="h" />
				{{ t( "sections.part4.stage2TextAfter" ) }}
			</p>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					:tex="t( 'sections.part4.stage2ActualBox' )"
				/>
			</div>
			<p>
				{{ t( "sections.part4.stage2ApproxBefore" ) }}
				<Katex :tex="t( 'sections.part4.aggregateVars' )" />
				{{ t( "sections.part4.stage2ApproxAfter" ) }}
			</p>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					:tex="t( 'sections.part4.stage2PoissonBox' )"
				/>
			</div>
			<p>
				{{ t( "sections.part4.stage2IdeaBefore" ) }}
				<Katex :tex="t( 'sections.part4.lambdaBox' )" />.
				{{ t( "sections.part4.stage2IdeaMiddle" ) }}
				<Katex tex="\lambda" />
				{{ t( "sections.part4.stage2IdeaAfter" ) }}
				<Katex tex="\exp(-\lambda)" />
				{{ t( "sections.part4.stage2IdeaEnd" ) }}
				<Katex tex="P_2=1-\exp(-\lambda)" />.
			</p>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="P_1(h) &= \lambda(h) \\ P_2(h) &= K(\lambda)\,P_1(h) \\ K(\lambda) &= \frac{1-\exp(-\lambda)}{\lambda}\le 1"
				/>
			</div>
			<p class="muted">
				{{ t( "sections.part4.stage2SmallBefore" ) }}
				<Katex tex="\lambda" />
				{{ t( "sections.part4.stage2SmallMiddle" ) }}
				<Katex tex="K(\lambda)=1-\frac{\lambda}{2}+O(\lambda^2)" />:
				{{ t( "sections.part4.stage2SmallAfter" ) }}
				<Katex tex="\lambda" />
				{{ t( "sections.part4.stage2SmallEnd" ) }}
				<Katex tex="P_2" />
				{{ t( "sections.part4.stage2SmallTail" ) }}
				<Katex tex="1" />.
			</p>
			<p class="muted">
				{{ t( "sections.part4.stage2DisclaimerBefore" ) }}
				<Katex tex="(W\oplus B_h)" />
				{{ t( "sections.part4.stage2DisclaimerMiddle" ) }}
				<Katex :tex="t( 'sections.part4.aggregateVars' )" />
				{{ t( "sections.part4.stage2DisclaimerAfter" ) }}
			</p>
		</div>
	</template>

	<template #interactivePart>
		<h2 id="finnland">{{ t( "interactive.exampleTitle", { country: activeCountry.name } ) }}</h2>
		<v-select
			v-model="selectedCountryCode"
			class="mb-4"
			density="comfortable"
			hide-details
			item-title="name"
			item-value="code"
			:items="countryOptions"
			:label="t( 'interactive.countryLabel' )"
			variant="outlined"
		/>
		<div class="eddie">
			<p>
				{{ t( "interactive.sliderIntroBefore" ) }}
				<Katex tex="h" />
				{{ t( "interactive.sliderIntroAfter" ) }}
			</p>
		</div>
		<v-row align="center" class="controls" dense>
			<v-col cols="12" md="3" sm="3">
				<v-label class="meta">{{ t( "interactive.shoreWidthLabel" ) }}</v-label>
			</v-col>
			<v-col cols="9" md="7" sm="7">
				<v-slider
					v-model="shoreWidth"
					color="primary"
					density="compact"
					hide-details
					:max="maxBorder"
					:min="minBorder"
					step="0.5"
				/>
			</v-col>
			<v-col class="d-flex justify-end"
				cols="3"
				md="2"
				sm="2"
			>
				<v-chip color="primary" size="small" variant="tonal">
					{{ hDistanceMetersLabel }} m
				</v-chip>
			</v-col>
		</v-row>
		<UDMap
			:country="activeCountry.mapCountry"
			:h-distance-meters
			:probability-percent="mainModel.poissonProbabilityPercent"
			:shore-width
		/>
		<div class="eddie">
			<p v-html="t( 'interactive.scaleNote' )"/>
		</div>
	</template>

	<template #calculationPart>
		<h2>{{ t( "calculation.title", { country: activeCountry.name } ) }}</h2>
		<div class="eddie">
			<p>
				{{ t( "calculation.thresholdBefore" ) }}
				<Katex :tex="`h=${hDistanceMeters}\\ \\mathrm{m}=${hDistanceKmTex}\\ \\mathrm{km}`" />
				{{ t( "calculation.thresholdAfter" ) }}
				<Katex :tex="`h=${hStressKm}\\ \\mathrm{km}`" />.
			</p>
			<div id="werteLand" class="kbox">
				<Katex
					aligned
					as="div"
					display
					:tex="texAlignedBlock([ texCountryLakesCount, texCountryShoreline, texCountryLandArea ])"
				/>
			</div>
			<h3>{{ t( "calculation.stage1Title" ) }}</h3>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					:tex="texAlignedBlock([ 'A_{\\text{add}}(h)=h\\cdot d+n\\pi h^2', texStage1Main, texStage1ProbMain ])"
				/>
			</div>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					:tex="texAlignedBlock([ texStage1Stress, texStage1ProbStress ])"
				/>
			</div>
			<h3>{{ t( "calculation.stage2Title" ) }}</h3>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					:tex="texAlignedBlock([ 'P_2(h)=1-\\exp\\!\\left(-\\frac{A_{\\text{add}}(h)}{A_{\\text{Land}}}\\right)', 'A_2(h)=A_{\\text{Land}}\\cdot P_2(h)', texStage2Main, texStage2Stress ])"
				/>
			</div>
		</div>
	</template>

	<template #footer>
		<p class="muted">
			<a href="https://matheplanet.com/default3.html?topic=267213=103">{{ t( "footerLink" ) }}</a>
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import {
	computed,
	ref
} from "vue";
import { useI18n } from "@/utils/i18n.mjs";
import titleImg from "./UD.webp";
import UDGraph from "./UD_Graph.vue";
import UDMap from "./UD_Map.vue";

const {
	locale,
	t,
	tm
} = useI18n( "book1.UD" );

const BASE_COUNTRY_DATA = [
	{
		code:        "FI",
		mapCountry:  "finland",
		lakesCount:  187888,
		shorelineKm: 214896,
		landAreaKm2: 304000
	},
	{
		code:        "DE",
		mapCountry:  "germany",
		lakesCount:  12000,
		shorelineKm: 11000,
		landAreaKm2: 353674
	}
];

const selectedCountryCode = ref( BASE_COUNTRY_DATA[ 0 ]?.code ?? "FI" );
const shoreWidth = ref( 2.5 );
const minBorder = 0;
const maxBorder = 50;
const hStressKm = 1;

const subChapter = computed( () => tm( "subChapter" ) ?? {} );
const numberFormatter0 = computed( () => new Intl.NumberFormat( locale.value, { maximumFractionDigits: 0 } ) );

const countryOptions = computed( () => BASE_COUNTRY_DATA.map( ( country ) => ( {
	...country,
	name: t( `countries.${country.code}.name` )
} ) ) );

const activeCountry = computed( () => {
	const selected = countryOptions.value.find( ( country ) => country.code === selectedCountryCode.value );
	return selected ?? countryOptions.value[ 0 ];
} );

const hDistanceKm = computed( () => {
	const span = maxBorder - minBorder;

	if ( span <= 0 ) {
		return 0;
	}

	const normalized = ( shoreWidth.value - minBorder ) / span;
	return Math.min( 1, Math.max( 0, normalized ) );
} );

const hDistanceKmTex = computed( () => fmtTexNum( hDistanceKm.value, 3 ) );
const hDistanceMeters = computed( () => Math.round( hDistanceKm.value * 1000 ) );
const hDistanceMetersLabel = computed( () => numberFormatter0.value.format( hDistanceMeters.value ) );

const mainModel = computed( () => computeModelValues( hDistanceKm.value, activeCountry.value ) );
const stressModel = computed( () => computeModelValues( hStressKm, activeCountry.value ) );

const texCountryLakesCount = computed( () =>
	`n_{\\text{Seen}}=${fmtIntMath( activeCountry.value.lakesCount )}` );
const texCountryShoreline = computed( () =>
	`d_{\\text{Seen}}=${fmtIntMath( activeCountry.value.shorelineKm )}\\ \\mathrm{km}` );
const texCountryLandArea = computed( () =>
	`A_{\\text{Land}}=${fmtIntMath( activeCountry.value.landAreaKm2 )}\\ \\mathrm{km}^2` );

const texStage1Main = computed( () => [
	`A_{\\text{add}}(${fmtTexNum( mainModel.value.hKm, 3 )})=`,
	`${fmtTexNum( mainModel.value.hKm, 3 )}\\cdot ${fmtIntMath( activeCountry.value.shorelineKm )}`,
	`+${fmtIntMath( activeCountry.value.lakesCount )}\\pi\\cdot ${fmtTexNum( mainModel.value.hKm, 3 )}^2=`,
	`${fmtNum( mainModel.value.addAreaKm2, 3 )}\\ \\mathrm{km}^2`
].join( "" ) );

const texStage1ProbMain = computed( () => [
	`P_{1}\\approx\\frac{A_{\\text{add}}}{A_{\\text{Land}}}=\\frac{${fmtNum( mainModel.value.addAreaKm2, 3 )}}`,
	`{${fmtIntMath( activeCountry.value.landAreaKm2 )}}=${fmtNum( mainModel.value.addProbability, 6 )}\\approx `,
	`${fmtNum( mainModel.value.addProbabilityPercent, 2 )}\\%`
].join( "" ) );

const texStage1Stress = computed( () => [
	`A_{\\text{add}}(${fmtTexNum( stressModel.value.hKm, 3 )})=`,
	`${fmtTexNum( stressModel.value.hKm, 3 )}\\cdot ${fmtIntMath( activeCountry.value.shorelineKm )}`,
	`+${fmtIntMath( activeCountry.value.lakesCount )}\\pi\\cdot ${fmtTexNum( stressModel.value.hKm, 3 )}^2=`,
	`${fmtNum( stressModel.value.addAreaKm2, 3 )}\\ \\mathrm{km}^2`
].join( "" ) );

const texStage1ProbStress = computed( () => [
	`P_{1}(${fmtTexNum( stressModel.value.hKm, 3 )})\\approx\\frac{${fmtNum( stressModel.value.addAreaKm2, 3 )}}`,
	`{${fmtIntMath( activeCountry.value.landAreaKm2 )}}=${fmtNum( stressModel.value.addProbability, 6 )}\\approx `,
	`${fmtNum( stressModel.value.addProbabilityPercent, 2 )}\\%`
].join( "" ) );

const texStage2Main = computed( () => [
	`P_{2}(${fmtTexNum( mainModel.value.hKm, 3 )})=${fmtNum( mainModel.value.poissonProbability, 6 )}\\approx `,
	`${fmtNum( mainModel.value.poissonProbabilityPercent, 2 )}\\%,\\quad A_{2}=`,
	`${fmtNum( mainModel.value.poissonAreaKm2, 3 )}\\ \\mathrm{km}^2`
].join( "" ) );

const texStage2Stress = computed( () => [
	`P_{2}(${fmtTexNum( stressModel.value.hKm, 3 )})=${fmtNum( stressModel.value.poissonProbability, 6 )}\\approx `,
	`${fmtNum( stressModel.value.poissonProbabilityPercent, 2 )}\\%,\\quad A_{2}=`,
	`${fmtNum( stressModel.value.poissonAreaKm2, 3 )}\\ \\mathrm{km}^2`
].join( "" ) );

const addAlignmentTab = ( formula ) => {
	if ( formula.includes( "&" ) ) {
		return formula;
	}

	const equalIndex = formula.indexOf( "=" );
	const approxIndex = formula.indexOf( "\\approx" );

	if ( equalIndex !== -1 && ( approxIndex === -1 || equalIndex < approxIndex ) ) {
		return `${formula.slice( 0, equalIndex )}&=${formula.slice( equalIndex + 1 )}`;
	}

	if ( approxIndex !== -1 ) {
		return formula.replace( "\\approx", "&\\approx" );
	}

	return formula;
};

const texAlignedBlock = ( formulas ) =>
	formulas.map( addAlignmentTab ).join( " \\\\ " );

function computeModelValues( hKm, country ) {
	const addAreaKm2 = hKm * country.shorelineKm + country.lakesCount * Math.PI * hKm * hKm;
	const addProbability = addAreaKm2 / country.landAreaKm2;
	const poissonProbability = 1 - Math.exp( -addProbability );
	const poissonAreaKm2 = country.landAreaKm2 * poissonProbability;

	return {
		hKm,
		addAreaKm2,
		addProbability,
		addProbabilityPercent:     addProbability * 100,
		poissonProbability,
		poissonProbabilityPercent: poissonProbability * 100,
		poissonAreaKm2
	};
}

function fmtIntMath( value ) {
	return Math.round( Number( value ) )
		.toString()
		.replace( /\B(?=(\d{3})+(?!\d))/g, "\\," );
}

function fmtNum( value, digits = 2 ) {
	const fixed = Number( value ).toFixed( digits );
	return locale.value === "de" ? fixed.replace( ".", "," ) : fixed;
}

function fmtTexNum( value, digits = 3 ) {
	const compact = Number( value ).toFixed( digits )
		.replace( /(?:\.0+|(\.\d+?)0+)$/, "$1" );
	return locale.value === "de" ? compact.replace( ".", "," ) : compact;
}
</script>

<style scoped>
.controls {
	margin-bottom: 8px;
}

.meta {
	color: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.82);
	font-size: 0.95rem;
	font-weight: 600;
}
</style>
