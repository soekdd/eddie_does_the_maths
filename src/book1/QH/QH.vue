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

		<h3 id="vorlesung">{{ t( "introDate" ) }}</h3>
		<div class="eddie">
			<p v-html="t( 'book.p1' )" />
			<p v-html="t( 'book.p2' )" />
			<p v-html="t( 'book.p3' )" />
		</div>
	</template>
	<template #descriptionPart>
		<h2 id="quantisierung" class="mt-8">{{ t( "sections.part1.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "sections.part1.p1" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="R_{xy}=\frac{V_H}{I}=\frac{h}{\nu e^2}=\frac{R_{\mathrm K}}{\nu},\qquad \nu\in\mathbb{N}." />
			</div>
			<ul>
				<li><Katex tex="R_{xy}" />: {{ t( "sections.part1.l1" ) }}</li>
				<li><Katex tex="V_H" />: {{ t( "sections.part1.l2a" ) }}, <Katex tex="I" />: {{ t( "sections.part1.l2b" ) }}</li>
				<li><Katex tex="h" />: {{ t( "sections.part1.l3" ) }}</li>
				<li><Katex tex="e" />: {{ t( "sections.part1.l4" ) }}</li>
				<li><Katex tex="\nu" />: {{ t( "sections.part1.l5" ) }}</li>
				<li><Katex tex="R_{\mathrm K}=h/e^2" />: {{ t( "sections.part1.l6" ) }} <Katex tex="25\,812.807\ \Omega" />.</li>
			</ul>
			<p v-html="t( 'sections.part1.p2' )" />
			<div class="kbox">
				<Katex as="div" display tex="R_{xx}\approx 0." />
			</div>
			<p>{{ t( "sections.part1.p3" ) }}</p>

			<div class="tableScroller mt-3">
				<v-table density="compact">
					<thead>
						<tr>
							<th><Katex tex="\nu" /></th>
							<th class="text-right"><Katex tex="R_{xy}=R_{\mathrm K}/\nu\ [\Omega]" /></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="row in plateauRows" :key="row.nu">
							<td class="mono">{{ row.nu }}</td>
							<td class="mono text-right">{{ fmt( row.rxy, 6 ) }}</td>
						</tr>
					</tbody>
				</v-table>
			</div>
		</div>

		<h2 id="metrologie" class="mt-8">{{ t( "sections.part2.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "sections.part2.p1" ) }}</p>
			<p v-html="t( 'sections.part2.p2' )" />
		</div>

		<h2 id="ohmfrage" class="mt-8">{{ t( "sections.part3.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part3.p1' )" />
			<ul>
				<li v-html="t( 'sections.part3.l1' )" />
				<li v-html="t( 'sections.part3.l2' )" />
				<li v-html="t( 'sections.part3.l3' )" />
			</ul>
			<p class="muted" v-html="t( 'sections.part3.p2' )" />
		</div>
	</template>

	<template #interactivePart>
		<h2 id="interaktiv">{{ t( "sections.interactive.title" ) }}</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p v-html="t( 'sections.interactive.intro' )" />

			<v-card class="panel pa-4">
				<v-row dense>
					<v-col cols="12" md="6">
						<div class="text-subtitle-2 mb-1">{{ t( "sections.interactive.fillFactor" ) }} <Katex tex="\nu" /></div>
						<v-slider
							v-model="nu"
							hide-details
							max="8"
							min="1"
							step="1"
							thumb-label
						/>
					</v-col>
					<v-col cols="12" md="6">
						<v-text-field
							v-model.number="measuredRxy"
							hide-details="auto"
							:label="t( 'sections.interactive.measuredRxy' )"
							type="number"
						/>
					</v-col>
					<v-col cols="12" md="6">
						<v-text-field
							v-model.number="measuredRxxMilliOhm"
							hide-details="auto"
							:label="t( 'sections.interactive.measuredRxx' )"
							type="number"
						/>
					</v-col>
					<v-col class="d-flex align-end ga-2 flex-wrap" cols="12" md="6">
						<v-btn color="primary" variant="flat" @click="setIdealMeasurement">
							{{ t( "sections.interactive.setIdeal" ) }}
						</v-btn>
						<v-btn variant="tonal" @click="addMeasurementNoise">
							{{ t( "sections.interactive.addNoise" ) }}
						</v-btn>
					</v-col>
				</v-row>
			</v-card>

			<v-alert :type="status.type" variant="tonal">
				{{ status.text }}
			</v-alert>
		</div>
	</template>

	<template #calculationPart>
		<h2>{{ t( "sections.calculation.title" ) }}</h2>
		<div class="eddie d-flex flex-column ga-3">
			<v-sheet border class="pa-3 rounded">
				<div class="kbox">
					<div class="mono">{{ t( "sections.calculation.rk" ) }} = {{ fmt( rk, 9 ) }} Ohm</div>
					<div class="mono">{{ t( "sections.calculation.nu" ) }} = {{ nu }}</div>
					<div class="mono">{{ t( "sections.calculation.targetRxy" ) }} = {{ fmt( targetRxy, 9 ) }} Ohm</div>
					<div class="mono">{{ t( "sections.calculation.measuredRxy" ) }} = {{ fmt( measuredRxy, 9 ) }} Ohm</div>
					<div class="mono">{{ t( "sections.calculation.deltaR" ) }} = {{ fmt( deltaRxy, 9 ) }} Ohm</div>
					<div class="mono">{{ t( "sections.calculation.relative" ) }} = {{ fmt( ppmError, 3 ) }} ppm</div>
					<div class="mono">{{ t( "sections.calculation.rxx" ) }} = {{ fmt( measuredRxxMilliOhm, 3 ) }} mOhm</div>
					<div class="mono">{{ t( "sections.calculation.sigma" ) }} = {{ fmt( sigmaXY, 9 ) }} S</div>
				</div>
			</v-sheet>

			<v-sheet border class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">{{ t( "sections.calculation.interpretationTitle" ) }}</div>
				<ul class="mb-0">
					<li v-html="t( 'sections.calculation.i1' )" />
					<li v-html="t( 'sections.calculation.i2' )" />
					<li>{{ t( "sections.calculation.i3" ) }}</li>
				</ul>
			</v-sheet>
		</div>
	</template>

	<template #footer />
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "@/utils/i18n.mjs";
import titleImg from "./QH.webp";

const { t, tm } = useI18n( "book1/QH" );

const H_EXACT = 6.62607015e-34;
const E_EXACT = 1.602176634e-19;
const rk = H_EXACT / ( E_EXACT * E_EXACT );

const nu = ref( 2 );
const measuredRxy = ref( rk / nu.value );
const measuredRxxMilliOhm = ref( 0.08 );
const subChapter = computed( () => tm( "subChapter" ) ?? {} );

const plateauRows = computed( () => Array.from( { length: 8 }, ( _, i ) => {
	const level = i + 1;
	return {
		nu:  level,
		rxy: rk / level
	};
} ) );

const targetRxy = computed( () => rk / nu.value );
const deltaRxy = computed( () => measuredRxy.value - targetRxy.value );
const ppmError = computed( () => deltaRxy.value / targetRxy.value * 1e6 );
const sigmaXY = computed( () => nu.value * ( E_EXACT * E_EXACT / H_EXACT ) );

const status = computed( () => {
	const absPpm = Math.abs( ppmError.value );

	if ( measuredRxxMilliOhm.value > 2 ) {
		return {
			type: "warning",
			text: t( "sections.interactive.status.largeRxx" )
		};
	}

	if ( absPpm < 0.1 ) {
		return {
			type: "success",
			text: t( "sections.interactive.status.success" )
		};
	}

	if ( absPpm < 10 ) {
		return {
			type: "info",
			text: t( "sections.interactive.status.near" )
		};
	}

	return {
		type: "warning",
		text: t( "sections.interactive.status.off" )
	};
} );

function setIdealMeasurement() {
	measuredRxy.value = targetRxy.value;
	measuredRxxMilliOhm.value = 0.05;
}

function addMeasurementNoise() {
	const noisePpm = ( Math.random() * 2 - 1 ) * 8;
	measuredRxy.value = targetRxy.value * ( 1 + noisePpm * 1e-6 );
	measuredRxxMilliOhm.value = 0.05 + Math.random() * 1.2;
}

function fmt( value, digits = 3 ) {
	if ( !Number.isFinite( value ) ) {
		return "-";
	}

	return Number( value ).toFixed( digits );
}
</script>

<style scoped>
.mono {
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
}
</style>
