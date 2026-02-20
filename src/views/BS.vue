<!-- eslint-disable vue/max-len -->
<template>
<AppFrame
	:sub-chapter="{
		ziel: 'Ziel',
		steiner: 'Steiner',
		fallen: 'Steiner-Fallen',
		beispiel: 'Beispiel',
		rechnung: 'Rechnung',
		ergebnis: 'Ergebnis',
		bonus: 'Bonus'
	}"
	title="Eddie rechnet: Baustatik #1, Satz von Steiner"
>
	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer title="Eddie zeigt Sini wie die Summe aller Kräfte null ist">
				<img loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>

		<h2 id="ziel">Flächenträgheitsmoment mit dem Satz von Steiner am Beispiel eines Doppelt-T-Träger (I-Profil): </h2>
		<div class="eddie">
			<p>
				<b>Ziel:</b> Wir berechnen das <b>zweite Flächenträgheitsmoment</b> eines Doppelt-T-Querschnitts
				um die <b>starke Achse</b> mit dem Satz von Steiner (Parallelachsen-Satz).
			</p>
			<p>
				Das braucht man z.B. für Biegespannung und Durchbiegung.
			</p>
		</div>

		<h3 id="steiner" class="mt-8">1) Der Satz von Steiner: Was er aussagt und wie man ihn nutzt</h3>
		<div class="eddie">
			<p>
				Das Flächenträgheitsmoment misst nicht nur, wie viel Fläche vorhanden ist, sondern vor allem, in
				welchem Abstand zur betrachteten Achse diese Fläche liegt. Genau hier setzt der Satz von Steiner an:
				Er verschiebt ein bekanntes Trägheitsmoment von der <b>eigenen Schwerpunktachse</b> einer Teilfläche
				auf eine <b>parallele Achse</b> (z.B. die Gesamtachse des Querschnitts).
			</p>
			<div class="kbox">
				<Katex as="div" display tex="I_x = I_{x,S} + A\cdot d^2" />
			</div>
			<figure class="exampleFigure">
				<ImageZoomer title="Doppelt-T-Träger">
					<BS_Graph
						:bf="100"
						:h="200"
						hide-numeric
						:tf="15"
						:tw="8"
						view-height="500"
						view-width="450"
					/>
				</ImageZoomer>
			</figure>
			<p>
				Dabei ist <Katex inline tex="I_{x,S}" /> das Trägheitsmoment um die Schwerpunktachse der Teilfläche,
				<Katex inline tex="A" /> deren Fläche und <Katex inline tex="d" /> der Abstand der beiden Achsen.
				Der Steiner-Anteil <Katex inline tex="A d^2" /> wächst quadratisch mit dem Abstand und dominiert oft
				den gesamten Wert.
			</p>
			<p>
				Für beliebige Geometrien ist das Vorgehen immer gleich:
			</p>
			<ol>
				<li>Querschnitt in einfache Teilflächen zerlegen (Rechtecke, Dreiecke, Kreise, Aussparungen).</li>
				<li>Für jede Teilfläche <Katex inline tex="A_i" /> und <Katex inline tex="I_{x,S,i}" /> bestimmen.</li>
				<li>Abstand <Katex inline tex="d_i" /> der Teilflächenachse zur Gesamtachse berechnen.</li>
				<li>Alle Beiträge summieren: <Katex inline tex="I_x=\sum_i \left(I_{x,S,i}+A_i d_i^2\right)" />.</li>
			</ol>
			<p>
				Bei Aussparungen (Löchern) werden Fläche und Steiner-Anteil mit negativem Vorzeichen abgezogen.
				So lassen sich auch komplexe Profile systematisch berechnen.
			</p>
			<p>
				Für den Doppelt-T-Träger verwenden wir die Zerlegung in drei Rechtecke:
				2 Flansche und 1 Steg. Die Flansche liegen weit von der neutralen Achse entfernt, dadurch ist ihr
				Steiner-Anteil groß. Der Steg liegt zentriert, für ihn gilt meist <Katex inline tex="d=0" />.
			</p>
			<p>Rechteck-Formeln und Geometrie:</p>
			<div class="kbox">
				<Katex as="div" display tex="I_{x,\text{Rechteck}} = \frac{b\,h^3}{12}" />
				<Katex as="div" display tex="A=b\,h" />
				<Katex as="div" display tex="h_w = h - 2t_f" />
			</div>
			<div class="kbox">
				<Katex as="div" display tex="I_x = 2\left(\frac{b_f t_f^3}{12}+b_f t_f\left(\frac{h}{2}-\frac{t_f}{2}\right)^2\right)+\frac{t_w(h-2t_f)^3}{12}" />
			</div>
			<p>
				Genau deshalb ist das I-Profil effizient: viel Material sitzt in den Flanschen mit großem Hebelarm
				und erhöht <Katex inline tex="I_x" /> deutlich stärker als zusätzlicher Stegquerschnitt in der Mitte.
			</p>
		</div>

		<h3 id="fallen" class="mt-8">2) Typische Fehlerquellen (Steiner-Fallen)</h3>
		<div class="eddie">
			<ul>
				<li>Falsches <Katex inline tex="d" />: Abstand immer zwischen Schwerpunktachsen, nicht zwischen Kanten.</li>
				<li><Katex inline tex="h_w" /> vergessen: <Katex inline tex="h_w=h-2t_f" />, nicht <Katex inline tex="h_w=h" />.</li>
				<li>Achsen vertauscht: Für die starke Achse ist die Höhe mit Potenz <Katex inline tex="h^3" /> entscheidend.</li>
			</ul>
		</div>
	</template>

	<template #interactivePart>
		<h2>Interaktiv</h2>
		<div class="eddie interactive">
			<p>
				Wähle einen Träger aus der DR-Liste. Oder erstelle eine eignene Kombinaton aus Werten.
			</p>
			<v-row class="mt-1" dense>
				<v-col cols="12" md="4">
					<v-select
						v-model="selectedSeriesKey"
						density="compact"
						hide-details="auto"
						:items="seriesItems"
						label="Serie"
						variant="outlined"
					/>
				</v-col>
				<v-col cols="12" md="8">
					<v-select
						v-model="selectedProfileDesignation"
						density="compact"
						hide-details="auto"
						:items="profileItems"
						label="Realer Träger"
						variant="outlined"
					/>
				</v-col>
			</v-row>
			<v-card class="px-3 pa-2" variant="tonal">
				<div class="sliderHeader">
					<span><Katex inline tex="h" /> Gesamthöhe</span>
					<v-chip color="primary" size="small" variant="flat">
						{{ formatMm( h ) }}
					</v-chip>
				</div>
				<v-slider
					v-model="hIndex"
					color="primary"
					:max="hValues.length - 1"
					:min="0"
					:step="1"
					thumb-label
				>
					<template #thumb-label>{{ formatMm( h ) }}</template>
				</v-slider>
				<div class="sliderHeader">
					<span><Katex inline tex="b_f" /> Flanschbreite</span>
					<v-chip color="primary" size="small" variant="flat">
						{{ formatMm( bf ) }}
					</v-chip>
				</div>
				<v-slider
					v-model="bfIndex"
					color="primary"
					:max="bfValues.length - 1"
					:min="0"
					:step="1"
					thumb-label
				>
					<template #thumb-label>{{ formatMm( bf ) }}</template>
				</v-slider>
				<div class="sliderHeader">
					<span><Katex inline tex="t_f" /> Flanschdicke</span>
					<v-chip color="primary" size="small" variant="flat">
						{{ formatMm( tf ) }}
					</v-chip>
				</div>
				<v-slider
					v-model="tfIndex"
					color="primary"
					:max="tfValues.length - 1"
					:min="0"
					:step="1"
					thumb-label
				>
					<template #thumb-label>{{ formatMm( tf ) }}</template>
				</v-slider>
				<div class="sliderHeader">
					<span><Katex inline tex="t_w" /> Stegdicke</span>
					<v-chip color="primary" size="small" variant="flat">
						{{ formatMm( tw ) }}
					</v-chip>
				</div>
				<v-slider
					v-model="twIndex"
					color="primary"
					:max="twValues.length - 1"
					:min="0"
					:step="1"
					thumb-label
				>
					<template #thumb-label>{{ formatMm( tw ) }}</template>
				</v-slider>
			</v-card>
			<BS_Graph
				:bf="bf"
				class="mt-4"
				:h="h"
				:tf="tf"
				:tw="tw"
			/>
			<v-alert v-if="matchingProfiles.length"
				class="mt-3"
				density="comfortable"
				type="success"
				variant="tonal"
			>
				Passender Träger: <b>{{ matchingProfilesLabel }}</b>
			</v-alert>
			<v-alert v-else
				class="mt-3"
				density="comfortable"
				type="info"
				variant="tonal"
			>
				Diese Kombination entspricht keinem Eintrag in der DR-Liste.
			</v-alert>

			<v-alert
				v-if="!isGeometryValid"
				class="mt-3"
				density="comfortable"
				type="warning"
				variant="tonal"
			>
				Geometrisch nicht möglich: <Katex inline tex="h_w=h-2t_f" /> ist negativ.
			</v-alert>
		</div>
	</template>

	<template #calculationPart>
		<h3 id="beispiel" class="mt-2">3) Beispielwerte</h3>
		<div class="eddie">
			<ul>
				<li><Katex inline :tex="`h=${kFmt(h,0)}\\,\\text{mm}`" /></li>
				<li><Katex inline :tex="`b_f=${kFmt(bf,0)}\\,\\text{mm}`" /></li>
				<li><Katex inline :tex="`t_f=${kFmt(tf,0)}\\,\\text{mm}`" /></li>
				<li><Katex inline :tex="`t_w=${kFmt(tw,0)}\\,\\text{mm}`" /></li>
			</ul>
			<div class="kbox">
				<Katex as="div" display :tex="texZS" />
				<Katex as="div" display :tex="texD" />
			</div>
		</div>

		<h3 id="rechnung" class="mt-8">4) Rechnung</h3>
		<div class="eddie">
			<h4>4.1 Flansche (mit Steiner)</h4>
			<div class="kbox">
				<Katex as="div" display :tex="texAf" />
				<Katex as="div" display :tex="texIfs" />
				<Katex as="div" display :tex="texAfd2" />
				<Katex as="div" display :tex="texIf" />
				<Katex as="div" display :tex="texIFlanges" />
			</div>

			<h4>4.2 Steg (ohne Steiner)</h4>
			<p>Der Steg liegt auf der Schwerpunktachse, also <Katex inline tex="d=0" />.</p>
			<div class="kbox">
				<Katex as="div" display :tex="texIw" />
			</div>
		</div>

		<h3 id="ergebnis" class="mt-8">5) Ergebnis</h3>
		<div class="eddie">
			<div class="kbox">
				<Katex as="div" display :tex="texIx" />
				<Katex as="div" display :tex="texIxCm4" />
			</div>
		</div>

		<h3 id="bonus" class="mt-8">6) Bonus: Widerstandsmoment</h3>
		<div class="eddie">
			<div class="kbox">
				<Katex as="div" display tex="W_x = \frac{I_x}{c} = \frac{I_x}{h/2}" />
				<Katex as="div" display :tex="texWx" />
				<Katex as="div" display :tex="texWxCm3" />
				<Katex as="div" display tex="\sigma_{\max}=\frac{M_{\max}}{W_x}" />
			</div>
		</div>
	</template>
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";

import titleImg from "@/images/BS.webp";
import DR from "@/utils/DR.mjs";
import BS_Graph from "./BS_Graph.vue";

const allProfiles = Object.values( DR.series ).flat();

function uniqueSorted( values ) {
	return [ ...new Set( values ) ].sort( ( a, b ) => a - b );
}

function startIndex( values, initialValue ) {
	const idx = values.findIndex( ( value ) => value === initialValue );
	return idx >= 0 ? idx : 0;
}

const hValues = uniqueSorted( allProfiles.map( ( profile ) => profile.h ) );
const bfValues = uniqueSorted( allProfiles.map( ( profile ) => profile.bf ) );
const tfValues = uniqueSorted( allProfiles.map( ( profile ) => profile.tf ) );
const twValues = uniqueSorted( allProfiles.map( ( profile ) => profile.tw ) );

const hIndex = ref( startIndex( hValues, 200 ) );
const bfIndex = ref( startIndex( bfValues, 100 ) );
const tfIndex = ref( startIndex( tfValues, 15 ) );
const twIndex = ref( startIndex( twValues, 8 ) );

const h = computed( () => hValues[ hIndex.value ] );
const bf = computed( () => bfValues[ bfIndex.value ] );
const tf = computed( () => tfValues[ tfIndex.value ] );
const tw = computed( () => twValues[ twIndex.value ] );

const seriesItems = Object.keys( DR.series );
const selectedSeriesKey = ref( seriesItems[ 0 ] );

const profilesInSelectedSeries = computed( () => DR.series[ selectedSeriesKey.value ] ?? [] );
const profileItems = computed( () =>
	profilesInSelectedSeries.value.map( ( profile ) => profile.designation ) );

function applyProfileValues( profile ) {
	const nextHIndex = hValues.findIndex( ( value ) => value === profile.h );
	const nextBfIndex = bfValues.findIndex( ( value ) => value === profile.bf );
	const nextTfIndex = tfValues.findIndex( ( value ) => value === profile.tf );
	const nextTwIndex = twValues.findIndex( ( value ) => value === profile.tw );

	if ( nextHIndex >= 0 ) {
		hIndex.value = nextHIndex;
	}

	if ( nextBfIndex >= 0 ) {
		bfIndex.value = nextBfIndex;
	}

	if ( nextTfIndex >= 0 ) {
		tfIndex.value = nextTfIndex;
	}

	if ( nextTwIndex >= 0 ) {
		twIndex.value = nextTwIndex;
	}
}

const selectedProfileDesignation = computed( {
	get() {
		const match = profilesInSelectedSeries.value.find( ( profile ) =>
			profile.h === h.value && profile.bf === bf.value && profile.tf === tf.value && profile.tw === tw.value );
		return match?.designation ?? null;
	},
	set( designation ) {
		if ( !designation ) {
			return;
		}

		const profile = profilesInSelectedSeries.value.find( ( entry ) => entry.designation === designation );

		if ( profile ) {
			applyProfileValues( profile );
		}
	}
} );

const hw = computed( () => h.value - 2 * tf.value );
const zS = computed( () => h.value / 2 );
const d = computed( () => h.value / 2 - tf.value / 2 );
const isGeometryValid = computed( () => hw.value > 0 );

const Af = computed( () => bf.value * tf.value );
const Ifs = computed( () => bf.value * tf.value ** 3 / 12 );
const Afd2 = computed( () => Af.value * d.value ** 2 );
const If = computed( () => Ifs.value + Afd2.value );
const iFlanges = computed( () => 2 * If.value );

const Iw = computed( () => tw.value * hw.value ** 3 / 12 );
const Ix = computed( () => iFlanges.value + Iw.value );

const IxCm4 = computed( () => Ix.value / 1e4 );

const c = computed( () => h.value / 2 );
const Wx = computed( () => Ix.value / c.value );
const WxCm3 = computed( () => Wx.value / 1e3 );

function kFmt( value, digits = 2 ) {
	if ( !Number.isFinite( value ) ) {
		return "0";
	}

	const fixed = value.toFixed( digits );
	const [ intPart, decPart ] = fixed.split( "." );
	const intWithSep = intPart.replace( /\B(?=(\d{3})+(?!\d))/g, "\\," );

	if ( !decPart || /^0+$/.test( decPart ) ) {
		return intWithSep;
	}

	return `${intWithSep}{,}${decPart}`;
}

const I4_SWITCH_MM4 = 100000;
const MM4_PER_CM4 = 1e4;
const W3_SWITCH_MM3 = 100000;
const MM3_PER_CM3 = 1e3;

function pickI4Factor( ...values ) {
	const maxAbs = Math.max( ...values.map( ( value ) => Math.abs( Number( value ) || 0 ) ) );
	return maxAbs > I4_SWITCH_MM4 ? MM4_PER_CM4 : 1;
}

function i4Unit( factor ) {
	return factor === MM4_PER_CM4 ? "\\text{cm}^4" : "\\text{mm}^4";
}

function i4Fmt(
	value, factor, mmDigits = 0, cmDigits = 2
) {
	const digits = factor === MM4_PER_CM4 ? cmDigits : mmDigits;
	return kFmt( value / factor, digits );
}

function pickW3Factor( ...values ) {
	const maxAbs = Math.max( ...values.map( ( value ) => Math.abs( Number( value ) || 0 ) ) );
	return maxAbs > W3_SWITCH_MM3 ? MM3_PER_CM3 : 1;
}

function w3Unit( factor ) {
	return factor === MM3_PER_CM3 ? "\\text{cm}^3" : "\\text{mm}^3";
}

function w3Fmt(
	value, factor, mmDigits = 2, cmDigits = 2
) {
	const digits = factor === MM3_PER_CM3 ? cmDigits : mmDigits;
	return kFmt( value / factor, digits );
}

const texZS = computed( () =>
	`z_S = \\frac{h}{2} = \\frac{${kFmt( h.value, 0 )}}{2} = ${kFmt( zS.value, 1 )}\\,\\text{mm}` );
const texD = computed( () =>
	`d = \\frac{h}{2} - \\frac{t_f}{2} = ${kFmt( zS.value, 1 )} - ${
		kFmt( tf.value / 2, 1 )} = ${kFmt( d.value, 1 )}\\,\\text{mm}` );

const texAf = computed( () =>
	`A_f = b_f t_f = ${kFmt( bf.value, 0 )}\\cdot${kFmt( tf.value, 0 )} = ${kFmt( Af.value, 0 )}\\,\\text{mm}^2` );
const texIfs = computed( () => {
	const factor = pickI4Factor( Ifs.value );
	return `I_{x,f,S} = \\frac{b_f t_f^3}{12} = \\frac{${
		kFmt( bf.value, 0 )}\\cdot ${kFmt( tf.value, 0 )}^3}{12} = ${
		i4Fmt(
			Ifs.value, factor, 0
		)}\\,${i4Unit( factor )}`;
} );
const texAfd2 = computed( () => {
	const factor = pickI4Factor( Afd2.value );
	return `A_f d^2 = ${kFmt( Af.value, 0 )}\\cdot ${
		kFmt( d.value, 1 )}^2 = ${i4Fmt(
		Afd2.value, factor, 2
	)}\\,${i4Unit( factor )}`;
} );
const texIf = computed( () => {
	const factor = pickI4Factor(
		Ifs.value, Afd2.value, If.value
	);
	return `I_{x,f} = I_{x,f,S} + A_f d^2 = ${
		i4Fmt(
			Ifs.value, factor, 0
		)} + ${i4Fmt(
		Afd2.value, factor, 2
	)} = ${
		i4Fmt(
			If.value, factor, 2
		)}\\,${i4Unit( factor )}`;
} );
const texIFlanges = computed( () => {
	const factor = pickI4Factor( If.value, iFlanges.value );
	return `I_{x,\\text{Flansche}} = 2I_{x,f} = 2\\cdot ${
		i4Fmt(
			If.value, factor, 2
		)} = ${i4Fmt(
		iFlanges.value, factor, 2
	)}\\,${i4Unit( factor )}`;
} );

const texIw = computed( () => {
	const factor = pickI4Factor( Iw.value );
	return `I_{x,w} = \\frac{t_w h_w^3}{12} = \\frac{${
		kFmt( tw.value, 0 )}\\cdot ${kFmt( hw.value, 0 )}^3}{12} = ${
		i4Fmt(
			Iw.value, factor, 2
		)}\\,${i4Unit( factor )}`;
} );

const texIx = computed( () => {
	const factor = pickI4Factor(
		iFlanges.value, Iw.value, Ix.value
	);
	return `I_x = I_{x,\\text{Flansche}} + I_{x,w} = ${
		i4Fmt(
			iFlanges.value, factor, 2
		)} + ${i4Fmt(
		Iw.value, factor, 2
	)} = ${i4Fmt(
		Ix.value, factor, 2
	)}\\,${i4Unit( factor )}`;
} );
const texIxCm4 = computed( () => {
	const factor = pickI4Factor( Ix.value );
	return `I_x = ${i4Fmt(
		Ix.value, factor, 2
	)}\\,${i4Unit( factor )}`;
} );

const texWx = computed( () => {
	const iFactor = pickI4Factor( Ix.value );
	const wFactor = pickW3Factor( Wx.value );
	return `W_x = \\frac{I_x}{h/2} = \\frac{${
		i4Fmt(
			Ix.value, iFactor, 2
		)}}{${kFmt( c.value, 1 )}} = ${
		w3Fmt(
			Wx.value, wFactor, 2
		)}\\,${w3Unit( wFactor )}`;
} );
const texWxCm3 = computed( () => {
	const factor = pickW3Factor( Wx.value );
	return `W_x = ${w3Fmt(
		Wx.value, factor, 2
	)}\\,${w3Unit( factor )}`;
} );

const matchingProfiles = computed( () =>
	allProfiles.filter( ( profile ) =>
		profile.h === h.value && profile.bf === bf.value && profile.tf === tf.value && profile.tw === tw.value ) );

const matchingProfilesLabel = computed( () =>
	matchingProfiles.value.map( ( profile ) => profile.designation ).join( ", " ) );

function formatMm( value ) {
	if ( Number.isInteger( value ) ) {
		return `${value} mm`;
	}

	return `${value.toFixed( 1 ).replace( ".", "," )} mm`;
}
</script>

<style scoped>
.interactive .sliderHeader {
	display: flex;
	justify-content: space-between;
	gap: 2px;
	align-items: center;
}
</style>
