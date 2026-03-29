<!-- i18n-ally-scope: useI18n("book1.HA") -->
<template>
<AppFrame
	:sub-chapter
	:title="t( 'title' )"
	:vue-date="__VITE_SFC_MTIME_MS__"
>
	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="t( '.imageTitle' )">
				<img :alt="t( 'imageAlt' )" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">{{ t( "subChapter.einleitung" ) }}</h3>
		<div class="eddie">
			{{ t( "bookPart.introText" ) }}
		</div>
	</template>
	<template #descriptionPart>
		<h2 id="frequenzen-baender">{{ t( "description.sections.frequenzen.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'description.sections.frequenzen.p1' )" />

			<div class="haLeadBox">
				{{ t( "description.sections.frequenzen.lead" ) }}
			</div>

			<div class="kbox formulaStack">
				<Katex :tex="tex.cEqualsLambdaF" />
				<Katex :tex="tex.lambdaEqualsCOverF" />
				<Katex :tex="tex.lambdaWithUnits" />
				<Katex :tex="tex.lambdaApprox" />
			</div>

			<p v-html="t( 'description.sections.frequenzen.p2' )" />
			<p v-html="t( 'description.sections.frequenzen.p3' )" />
		</div>

		<h2 id="bandnamen" class="mt-8">{{ t( "description.sections.bandnamen.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'description.sections.bandnamen.p1' )" />

			<div class="kbox formulaStack">
				<Katex :tex="tex.example7MHz" />
				<Katex :tex="tex.example14MHz" />
			</div>

			<p v-html="t( 'description.sections.bandnamen.p2' )" />
		</div>

		<h2 id="zahlenfamilie" class="mt-8">{{ t( "description.sections.zahlenfamilie.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "description.sections.zahlenfamilie.p1" ) }}</p>

			<div class="chipWrap">
				<v-chip
					v-for="chip in familyChips"
					:key="chip"
					color="primary"
					variant="tonal"
				>
					{{ chip }}
				</v-chip>
			</div>

			<p v-html="t( 'description.sections.zahlenfamilie.p2' )" />
		</div>

		<h2 id="banduebersicht" class="mt-8">{{ t( "description.sections.banduebersicht.title" ) }}</h2>
		<div class="eddie">
			<div class="tableWrap">
				<table class="bandTable">
					<thead>
						<tr>
							<th>{{ t( "description.sections.banduebersicht.table.band" ) }}</th>
							<th>{{ t( "description.sections.banduebersicht.table.frequency" ) }}</th>
							<th>{{ t( "description.sections.banduebersicht.table.lambda" ) }}</th>
							<th>{{ t( "description.sections.banduebersicht.table.note" ) }}</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="band in bands" :key="band.name">
							<td>{{ band.name }}</td>
							<td>{{ band.frequency }}</td>
							<td>{{ band.lambda }}</td>
							<td>{{ band.note }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<h2 id="bandlogik" class="mt-8">{{ t( "description.sections.bandlogik.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'description.sections.bandlogik.p1' )" />

			<div class="bandGrid">
				<div v-for="card in bandLogicCards" :key="card.title" class="bandCard">
					<h3>{{ card.title }}</h3>
					<p>{{ card.text }}</p>
				</div>
			</div>
		</div>

		<h2 id="weitere-baender" class="mt-8">{{ t( "description.sections.weitereBaender.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "description.sections.weitereBaender.p1" ) }}</p>

			<ul class="bandList">
				<li v-for="item in extraBands" :key="item.label">
					<b>{{ item.label }}:</b> {{ item.text }}
				</li>
			</ul>

			<p>{{ t( "description.sections.weitereBaender.p2" ) }}</p>
		</div>

		<EddieComment :subtitle="t( 'description.sections.schluss.title' )">
			{{ t( "description.sections.schluss.quote" ) }}
		</EddieComment>
	</template>
	<template #summaryPart>
		<v-sheet border class="mb-6 pa-3" rounded="xl">
			<div class="d-flex flex-wrap align-center justify-space-between ga-3">
				<div class="text-subtitle-1 font-weight-medium">
					{{ t( "title" ) }}
				</div>
				<v-btn-toggle
					v-model="visibleMode"
					color="primary"
					divided
					mandatory
					rounded="xl"
				>
					<v-btn value="encoder">
						{{ t( "subChapter.encoder" ) }}
					</v-btn>
					<v-btn value="decoder">
						{{ t( "subChapter.decoder" ) }}
					</v-btn>
				</v-btn-toggle>
			</div>
		</v-sheet>

		<div v-if="visibleMode === 'encoder'" id="encoder">
			<HAEncoder
				v-model="encoderInput"
				@update:output="handleEncodedOutput"
			/>
		</div>
		<div v-else id="decoder">
			<HADecoder
				v-model="decoderInput"
				@update:output="handleDecodedOutput"
			/>
		</div>
	</template>
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "@/utils/i18n.mjs";
import HAEncoder from "./HA_Encoder.vue";
import HADecoder from "./HA_Decoder.vue";
import titleImg from "./HA.webp";

const { t, tm } = useI18n( "book1.HA" );

const visibleMode = ref( "decoder" );
const encoderInput = ref( "" );
const decoderInput = ref( "" );

function handleEncodedOutput( nextValue ) {
	decoderInput.value = String( nextValue ?? "" );
}

function handleDecodedOutput( nextValue ) {
	encoderInput.value = String( nextValue ?? "" );
}

const subChapter = computed( () => {
	const labels = tm( "subChapter" ) ?? {};

	return {
		"frequenzen-baender":  labels[ "frequenzen-baender" ],
		bandnamen:             labels.bandnamen,
		zahlenfamilie:         labels.zahlenfamilie,
		banduebersicht:        labels.banduebersicht,
		bandlogik:             labels.bandlogik,
		"weitere-baender":     labels[ "weitere-baender" ],
		[ visibleMode.value ]: labels[ visibleMode.value ]
	};
} );

const tex = computed( () => ( {
	cEqualsLambdaF:     String.raw`c = \lambda \cdot f`,
	lambdaEqualsCOverF: String.raw`\lambda = \frac{c}{f}`,
	lambdaWithUnits:    String.raw`\lambda[\mathrm{m}] = \frac{299\,792\,458\ \mathrm{m/s}}` +
			String.raw`{f[\mathrm{MHz}] \cdot 10^6\ \mathrm{s}^{-1}} \approx \frac{299.792458}{f[\mathrm{MHz}]}`,
	lambdaApprox: String.raw`\lambda[\mathrm{m}] \approx \frac{300}{f[\mathrm{MHz}]}`,
	example7MHz:  String.raw`\lambda \approx \frac{300}{7} \approx ${t( "description.formulas.example7Value" )}` +
			String.raw`\ \mathrm{m} \;\Rightarrow\; \text{${t( "description.formulas.band40Label" )}}`,
	example14MHz: String.raw`\lambda \approx \frac{300}{14} \approx ${t( "description.formulas.example14Value" )}` +
			String.raw`\ \mathrm{m} \;\Rightarrow\; \text{${t( "description.formulas.band20Label" )}}`
} ) );

const familyChips = computed( () => tm( "description.sections.zahlenfamilie.chips" ) ?? [] );
const bands = computed( () => tm( "description.sections.banduebersicht.bands" ) ?? [] );
const bandLogicCards = computed( () => tm( "description.sections.bandlogik.cards" ) ?? [] );
const extraBands = computed( () => tm( "description.sections.weitereBaender.items" ) ?? [] );
</script>

<style scoped>
.haLeadBox {
	margin: 1rem 0;
	padding: 0.9rem 1rem;
	border-left: 4px solid rgba(var(--v-theme-primary), 0.55);
	border-radius: 0 12px 12px 0;
	background: rgba(var(--v-theme-primary), 0.08);
}

.formulaStack {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.75rem;
}

.chipWrap {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin: 1rem 0 1.25rem;
}

.tableWrap {
	overflow-x: auto;
	margin: 1rem 0;
}

.bandTable {
	width: 100%;
	border-collapse: collapse;
}

.bandTable th,
.bandTable td {
	padding: 0.75rem 0.85rem;
	border-bottom: 1px solid rgba(0, 0, 0, 0.12);
	text-align: left;
	vertical-align: top;
}

.bandTable th {
	font-weight: 700;
}

.bandGrid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 1rem;
	margin-top: 1rem;
}

.bandCard {
	padding: 1rem;
	border: 1px solid rgba(0, 0, 0, 0.12);
	border-radius: 14px;
	background: rgba(var(--v-theme-primary), 0.05);
}

.bandCard h3 {
	margin-bottom: 0.5rem;
}

.bandCard p {
	margin-bottom: 0;
}

.bandList {
	padding-left: 1.25rem;
}

.bandList li + li {
	margin-top: 0.5rem;
}

.eddie-quote {
  margin: 0;
  padding-left: 1rem;
  border-left: 4px solid rgba(var(--v-theme-primary), 0.55);
  font-style: italic;
  line-height: 1.7;
}
</style>
