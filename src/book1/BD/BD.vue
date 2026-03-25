<!-- eslint-disable vue/max-len -->
<template>
<AppFrame
	:languages="[ 'de', 'en' ]"
	:sub-chapter
	:title="t( 'bd.title' )"
	:vue-date="__VITE_SFC_MTIME_MS__"
>
	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="t( 'bd.imageTitle' )">
				<img :alt="t( 'bd.imageAlt' )" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">{{ t( "bd.introDate" ) }}</h3>
		<div class="eddie">
			<p v-html="t( 'bd.book.p1' )" />
			<p v-html="t( 'bd.book.p2' )" />
			<p v-html="t( 'bd.book.p3' )" />
		</div>
	</template>
	<template #descriptionPart>
		<h2 id="system">{{ t( "bd.sections.part1.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'bd.sections.part1.p1' )" />
			<p v-html="t( 'bd.sections.part1.p2' )"/>
			<div class="kbox">
				<Katex as="div" display tex="M_{Ed}\le M_{Rd}" />
			</div>
			<p v-html="t( 'bd.sections.part1.p3' )" />
			<p class="muted" v-html="t( 'bd.sections.part1.p4' )" />
		</div>

		<h2 id="eigengewicht" class="mt-8" v-html="t( 'bd.sections.part2.title' )" />
		<div class="eddie">
			<p v-html="t( 'bd.sections.part2.p1' )" />
			<div class="kbox">
				<Katex aligned
					as="div"
					display
					:tex="t( 'bd.sections.part2.selfWeightBox' )"
				/>
			</div>
			<p v-html="t( 'bd.sections.part2.p2' )" />
			<p v-html="t( 'bd.sections.part2.p3' )" />
			<ol>
				<li v-html="t( 'bd.sections.part2.step1' )" />
				<li v-html="t( 'bd.sections.part2.step2' )" />
				<li v-html="t( 'bd.sections.part2.step3' )" />
			</ol>
		</div>
		<figure class="exampleFigure">
			<ImageZoomer :title="t( 'bd.sections.part2.graphTitle' )">
				<BDGraph v-bind="graphProps" reduced />
			</ImageZoomer>
		</figure>
		<h2 id="schnittgroessen" class="mt-8">{{ t( "bd.sections.part3.title" ) }}</h2>
		<div class="eddie">
			<h3>{{ t( "bd.sections.part3.step31" ) }}</h3>
			<p v-html="t( 'bd.sections.part3.p1' )"/>
			<div class="kbox">
				<Katex as="div" display tex="R_A=R_B=\frac{P}{2}+\frac{q_g L}{2}" />
			</div>

			<h3>{{ t( "bd.sections.part3.step32" ) }}</h3>
			<div class="kbox">
				<Katex as="div" display tex="V_{k,\max}=\frac{P}{2}+\frac{q_g L}{2}" />
			</div>

			<h3>{{ t( "bd.sections.part3.step33" ) }}</h3>
			<div class="kbox">
				<Katex aligned
					as="div"
					display
					tex="M_{P,\max}&=\frac{P L}{4}\\M_{g,\max}&=\frac{q_g L^2}{8}\\M_{k,\max}&=\frac{P L}{4}+\frac{q_g L^2}{8}"
				/>
			</div>
		</div>

		<h2 id="sicherheitsansatz" class="mt-8">{{ t( "bd.sections.part4.title" ) }}</h2>
		<div class="eddie">
			<v-row dense>
				<v-col cols="12" md="6">
					<h3>{{ t( "bd.sections.part4.step41" ) }}</h3>
					<div class="kbox">
						<Katex aligned
							as="div"
							display
							tex="P_d&=\gamma_{\text{DIN}}P\\q_{g,d}&=\gamma_{\text{DIN}}q_g\\M_{Ed,\text{DIN}}&=\gamma_{\text{DIN}}\left(\frac{P L}{4}+\frac{q_g L^2}{8}\right)"
						/>
					</div>
					<p v-html="t( 'bd.sections.part4.p1' )"/>
				</v-col>
				<v-col cols="12" md="6">
					<h3>{{ t( "bd.sections.part4.step42" ) }}</h3>
					<div class="kbox">
						<Katex aligned
							as="div"
							display
							tex="P_d&=\gamma_Q P\\q_{g,d}&=\gamma_G q_g,\qquad \gamma_G<\gamma_{\text{DIN}}\\M_{Ed,\text{TGL}}&=\gamma_Q\frac{P L}{4}+\gamma_G\frac{q_g L^2}{8}\\"
						/>
					</div>
					<p v-html="t( 'bd.sections.part4.p2' )"/>
				</v-col>
			</v-row>

			<h3>{{ t( "bd.sections.part4.step43" ) }}</h3>
			<div class="kbox">
				<Katex as="div" display tex="M_{Ed,\text{DIN}}-M_{Ed,\text{TGL}}=(\gamma_{\text{DIN}}-\gamma_G)\,\frac{q_g L^2}{8}" />
			</div>
			<p v-html="t( 'bd.sections.part4.p3' )"/>
		</div>

		<h2 id="nachweis" class="mt-8" v-html="t( 'bd.sections.part5.title' )" />
		<div class="eddie">
			<div class="kbox">
				<Katex aligned
					as="div"
					display
					tex="\sigma_{Ed}&=\frac{M_{Ed}}{W}\le f_{yd}\\W\ge W_{\text{erf}}&=\frac{M_{Ed}}{f_{yd}}\\f_{yd}&=\frac{f_y}{\gamma_M}"
				/>
			</div>
			<p v-html="t( 'bd.sections.part5.p1' )" />
		</div>
		<figure class="exampleFigure">
			<ImageZoomer :title="t( 'bd.sections.part5.graphTitle' )">
				<BSGraph
					:bf="100"
					:h="200"
					hide-numeric
					:tf="15"
					:tw="8"
					:view-height="500"
					:view-width="450"
				/>
			</ImageZoomer>
		</figure>
		<h2 id="zahlenbeispiel" class="mt-8">{{ t( "bd.sections.part6.title" ) }}</h2>
		<div class="eddie">
			<h3>{{ t( "bd.sections.part6.step61" ) }}</h3>
			<ul>
				<li><Katex :tex="`L=${fmtMath( inputs.Lm, 0 )}\\,\\mathrm{m}`" /></li>
				<li><Katex :tex="`P=${fmtMath( inputs.PkN, 0 )}\\,\\mathrm{kN}`" /> ({{ t( "bd.sections.part6.pointLoadMid" ) }})</li>
				<li>
					DIN: <Katex :tex="`\\gamma_{\\text{DIN}}=${fmtMath( inputs.gammaDIN, 2 )}`" />
					({{ t( "bd.sections.part6.sameLoads" ) }})
				</li>
				<li>
					TGL:
					<Katex :tex="`\\gamma_Q=${fmtMath( inputs.gammaQ, 2 )},\\;\\gamma_G=${fmtMath( inputs.gammaG, 2 )}`" />
				</li>
				<li>
					{{ t( "bd.sections.part6.steelLabel" ) }}:
					<Katex :tex="`f_y=${fmtMath( materialBase.fyNmm2, 0 )}\\,\\mathrm{N/mm^2},\\;\\gamma_M=${fmtMath( materialBase.gammaM, 1 )}\\Rightarrow f_{yd}=${fmtMath( fyd, 0 )}\\,\\mathrm{N/mm^2}`" />
				</li>
			</ul>
			<p v-html="t( 'bd.sections.part6.weldedBeam' )" />
			<div class="kbox">
				<Katex
					as="div"
					display
					:tex="`h=${fmtMath( sectionBase.hMm, 0 )}\\,\\mathrm{mm},\\quad b=${fmtMath( sectionBase.bMm, 0 )}\\,\\mathrm{mm},\\quad t_w=${fmtMath( sectionBase.twMm, 0 )}\\,\\mathrm{mm}`"
				/>
			</div>

			<h3>{{ t( "bd.sections.part6.step62" ) }}</h3>
			<div class="kbox">
				<Katex aligned
					as="div"
					display
					tex="A &= 2bt_f + t_w\,(h-2t_f)\\q_g&=\frac{\rho g}{1000}\,A\;[\mathrm{kN/m}]"
				/>
			</div>

			<v-row dense>
				<v-col cols="12" md="6">
					<h3 v-html="t( 'bd.sections.part6.step63' )" />
					<p>{{ t( "bd.sections.part6.practicalRounded" ) }} <Katex :tex="`t_f=${fmtMath( tfDinMm, 0 )}\\,\\mathrm{mm}`" />.</p>
					<div class="kbox">
						<Katex
							aligned
							as="div"
							display
							:tex="texDinDesignBlock"
						/>
					</div>
					<p><strong>{{ isDinOk ? t( "bd.sections.part6.dinOk" ) : t( "bd.sections.part6.dinNotOk" ) }}</strong></p>
				</v-col>
				<v-col cols="12" md="6">
					<h3 v-html="t( 'bd.sections.part6.step64' )" />
					<p>{{ t( "bd.sections.part6.practicalRounded" ) }} <Katex :tex="`t_f=${fmtMath( tfTglMm, 0 )}\\,\\mathrm{mm}`" />.</p>
					<div class="kbox">
						<Katex
							aligned
							as="div"
							display
							:tex="texTglDesignBlock"
						/>
					</div>
					<p><strong>{{ isTglOk ? t( "bd.sections.part6.tglOk" ) : t( "bd.sections.part6.tglNotOk" ) }}</strong></p>
				</v-col>
			</v-row>

			<h3>{{ t( "bd.sections.part6.step65" ) }}</h3>
			<ul>
				<li>{{ t( "bd.sections.part6.dinNeeds" ) }} <Katex :tex="`t_f=${fmtMath( tfDinMm, 0 )}\\,\\mathrm{mm}`" /></li>
				<li>{{ t( "bd.sections.part6.tglAllows" ) }} <Katex :tex="`t_f=${fmtMath( tfTglMm, 0 )}\\,\\mathrm{mm}`" /></li>
			</ul>
			<p
				v-html="t( 'bd.sections.part6.p1', {
					wReduction: `${fmtMath( wReqReductionPercent, 1, true )}\\%`,
					qgDin:      fmtMath( qgDinKgM, 0 ),
					qgTgl:      fmtMath( qgTglKgM, 0 ),
					weightDelta: fmtMath( weightDeltaKgM, 1, true )
				} )"
			/>
		</div>

		<h2 id="bewertung" class="mt-8">{{ t( "bd.sections.part7.title" ) }}</h2>
		<div class="eddie">
			<h3>{{ t( "bd.sections.part7.step71" ) }}</h3>
			<p v-html="t( 'bd.sections.part7.p1' )" />

			<h3>{{ t( "bd.sections.part7.step72" ) }}</h3>
			<div class="kbox">
				<Katex as="div" display tex="\Delta M_{Ed}=(\gamma_{\text{DIN}}-\gamma_G)\,\frac{q_g L^2}{8}" />
			</div>
			<p v-html="t( 'bd.sections.part7.p2' )" />

			<h3>{{ t( "bd.sections.part7.step73" ) }}</h3>
			<p v-html="t( 'bd.sections.part7.p3' )" />
			<p v-html="t( 'bd.sections.part7.p4' )"/>
			<p class="muted">{{ t( "bd.sections.part7.p5" ) }}</p>
		</div>
	</template>

	<template #interactivePart>
		<h2 id="interaktiv">{{ t( "bd.interactive.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'bd.interactive.intro' )"/>
		</div>

		<v-sheet border class="pa-4" rounded="lg">
			<v-row dense>
				<v-col cols="12" md="6">
					<h3 class="text-subtitle-1 mb-2">{{ t( "bd.interactive.systemLoads" ) }}</h3>

					<v-row align="center" class="controlRow" dense>
						<v-col cols="12" md="4" sm="4">
							<v-label class="controlLabel"><Katex tex="L" /> [m]</v-label>
						</v-col>
						<v-col cols="9" md="6" sm="6">
							<v-slider v-model="inputs.Lm"
								color="primary"
								density="compact"
								hide-details
								:max="50"
								:min="5"
								step="0.5"
							/>
						</v-col>
						<v-col class="d-flex justify-end"
							cols="3"
							md="2"
							sm="2"
						>
							<v-chip color="primary" size="small" variant="tonal">{{ fmtUi( inputs.Lm, 1 ) }}</v-chip>
						</v-col>
					</v-row>

					<v-row align="center" class="controlRow" dense>
						<v-col cols="12" md="4" sm="4">
							<v-label class="controlLabel"><Katex tex="P" /> [kN]</v-label>
						</v-col>
						<v-col cols="9" md="6" sm="6">
							<v-slider v-model="inputs.PkN"
								color="primary"
								density="compact"
								hide-details
								:max="600"
								:min="20"
								step="5"
							/>
						</v-col>
						<v-col class="d-flex justify-end"
							cols="3"
							md="2"
							sm="2"
						>
							<v-chip color="primary" size="small" variant="tonal">{{ fmtUi( inputs.PkN, 0 ) }}</v-chip>
						</v-col>
					</v-row>

					<v-row align="center" class="controlRow" dense>
						<v-col cols="12" md="4" sm="4">
							<v-label class="controlLabel"><Katex tex="\gamma_{\text{DIN}}" /></v-label>
						</v-col>
						<v-col cols="9" md="6" sm="6">
							<v-slider v-model="inputs.gammaDIN"
								color="primary"
								density="compact"
								hide-details
								:max="1.8"
								:min="1"
								step="0.01"
							/>
						</v-col>
						<v-col class="d-flex justify-end"
							cols="3"
							md="2"
							sm="2"
						>
							<v-chip color="primary" size="small" variant="tonal">{{ fmtUi( inputs.gammaDIN, 2 ) }}</v-chip>
						</v-col>
					</v-row>

					<v-row align="center" class="controlRow" dense>
						<v-col cols="12" md="4" sm="4">
							<v-label class="controlLabel"><Katex tex="\gamma_Q" /></v-label>
						</v-col>
						<v-col cols="9" md="6" sm="6">
							<v-slider v-model="inputs.gammaQ"
								color="primary"
								density="compact"
								hide-details
								:max="1.8"
								:min="1"
								step="0.01"
							/>
						</v-col>
						<v-col class="d-flex justify-end"
							cols="3"
							md="2"
							sm="2"
						>
							<v-chip color="primary" size="small" variant="tonal">{{ fmtUi( inputs.gammaQ, 2 ) }}</v-chip>
						</v-col>
					</v-row>

					<v-row align="center" class="controlRow" dense>
						<v-col cols="12" md="4" sm="4">
							<v-label class="controlLabel"><Katex tex="\gamma_G" /></v-label>
						</v-col>
						<v-col cols="9" md="6" sm="6">
							<v-slider v-model="inputs.gammaG"
								color="primary"
								density="compact"
								hide-details
								:max="1.5"
								:min="1"
								step="0.01"
							/>
						</v-col>
						<v-col class="d-flex justify-end"
							cols="3"
							md="2"
							sm="2"
						>
							<v-chip color="primary" size="small" variant="tonal">{{ fmtUi( inputs.gammaG, 2 ) }}</v-chip>
						</v-col>

					</v-row>
					<v-alert
						class="mb-3 mt-4"
						density="comfortable"
						type="info"
						variant="tonal"
						v-html="t( 'bd.interactive.alert' )"
					/>
				</v-col>

				<v-col cols="12" md="6">
					<h3 class="text-subtitle-1 mb-2">{{ t( "bd.interactive.sectionMaterial" ) }}</h3>
					<div class="kbox">
						<Katex
							as="div"
							display
							:tex="`h=${fmtMath( sectionBase.hMm, 0 )}\\,\\mathrm{mm},\\quad b=${fmtMath( sectionBase.bMm, 0 )}\\,\\mathrm{mm},\\quad t_w=${fmtMath( sectionBase.twMm, 0 )}\\,\\mathrm{mm}`"
						/>
						<Katex
							as="div"
							display
							:tex="`f_y=${fmtMath( materialBase.fyNmm2, 0 )}\\,\\mathrm{N/mm^2},\\quad \\gamma_M=${fmtMath( materialBase.gammaM, 1 )},\\quad \\rho=${fmtMath( materialBase.rhoSteel, 0 )}\\,\\mathrm{kg/m^3},\\quad g=${fmtMath( materialBase.gravityMs, 2 )}\\,\\mathrm{m/s^2}`"
						/>
						<Katex
							aligned
							as="div"
							display
							:tex="texSectionSummaryBlock"
						/>
					</div>
				</v-col>
			</v-row>
		</v-sheet>

		<BDGraph class="mt-4" v-bind="graphProps" />
	</template>
</AppFrame>
</template>

<script setup>
import {
	computed,
	h,
	reactive
} from "vue";
import { useI18n } from "@/utils/i18n.mjs";

import titleImg from "./BD.webp";
import BDGraph from "./BD_Graph.vue";
import BSGraph from "../BS/BS_Graph.vue";

const { t } = useI18n( "book1/BD" );

const subChapter = computed( () => ( {
	einleitung:        t( "bd.subChapter.einleitung" ),
	eigengewicht:      t( "bd.subChapter.eigengewicht" ),
	schnittgroessen:   t( "bd.subChapter.schnittgroessen" ),
	sicherheitsansatz: t( "bd.subChapter.sicherheitsansatz" ),
	nachweis:          t( "bd.subChapter.nachweis" ),
	zahlenbeispiel:    t( "bd.subChapter.zahlenbeispiel" ),
	bewertung:         t( "bd.subChapter.bewertung" ),
	interaktiv:        t( "bd.subChapter.interaktiv" )
} ) );
const inputs = reactive( {
	Lm:       25,
	PkN:      100,
	gammaDIN: 1.35,
	gammaQ:   1.35,
	gammaG:   1.10
} );

const sectionBase = Object.freeze( {
	hMm:  500,
	bMm:  180,
	twMm: 10
} );
const materialBase = Object.freeze( {
	fyNmm2:    235,
	gammaM:    1.0,
	rhoSteel:  7850,
	gravityMs: 9.81
} );
const tfStepMm = 5;
const tfMinMm = 8;
const tfMaxMm = 180;

const fyd = computed( () => materialBase.fyNmm2 / materialBase.gammaM );

const hM = computed( () => sectionBase.hMm / 1000 );
const bM = computed( () => sectionBase.bMm / 1000 );
const twM = computed( () => sectionBase.twMm / 1000 );

function areaM2FromTfMm( tfMm ) {
	const tfM = tfMm / 1000;
	return 2 * bM.value * tfM + twM.value * ( hM.value - 2 * tfM );
}

function qgKNmFromTfMm( tfMm ) {
	return materialBase.rhoSteel * materialBase.gravityMs / 1000 * areaM2FromTfMm( tfMm );
}

function sectionIxMm4( tfMm ) {
	const hwMm = sectionBase.hMm - 2 * tfMm;
	const flangeISelf = sectionBase.bMm * tfMm ** 3 / 12;
	const flangeArea = sectionBase.bMm * tfMm;
	const flangeDistance = sectionBase.hMm / 2 - tfMm / 2;
	const webI = sectionBase.twMm * hwMm ** 3 / 12;

	return 2 * ( flangeISelf + flangeArea * flangeDistance ** 2 ) + webI;
}

function sectionWCm3( tfMm ) {
	const ixMm4 = sectionIxMm4( tfMm );
	const wMm3 = ixMm4 / ( sectionBase.hMm / 2 );
	return wMm3 / 1e3;
}

const mPkNm = computed( () => inputs.PkN * inputs.Lm / 4 );

function demandDinAtTfMm( tfMm ) {
	const qgKNm = qgKNmFromTfMm( tfMm );
	const mGKnm = qgKNm * inputs.Lm ** 2 / 8;
	const mEdKnm = inputs.gammaDIN * ( mPkNm.value + mGKnm );
	const wReqCm3 = mEdKnm * 1e6 / fyd.value / 1e3;

	return {
		qgKNm,
		mGKnm,
		mEdKnm,
		wReqCm3
	};
}

function demandTglAtTfMm( tfMm ) {
	const qgKNm = qgKNmFromTfMm( tfMm );
	const mGKnm = qgKNm * inputs.Lm ** 2 / 8;
	const mEdKnm = inputs.gammaQ * mPkNm.value + inputs.gammaG * mGKnm;
	const wReqCm3 = mEdKnm * 1e6 / fyd.value / 1e3;

	return {
		qgKNm,
		mGKnm,
		mEdKnm,
		wReqCm3
	};
}

function solveTfMm( demandAtTfMm ) {
	let tfFound = tfMaxMm;

	for ( let tfMm = tfMinMm; tfMm <= tfMaxMm; tfMm += 1 ) {
		const wCm3 = sectionWCm3( tfMm );
		const wReqCm3 = demandAtTfMm( tfMm ).wReqCm3;

		if ( wCm3 >= wReqCm3 ) {
			tfFound = tfMm;
			break;
		}
	}

	return Math.min( tfMaxMm, Math.ceil( tfFound / tfStepMm ) * tfStepMm );
}

const tfDinMm = computed( () => solveTfMm( demandDinAtTfMm ) );
const tfTglMm = computed( () => solveTfMm( demandTglAtTfMm ) );
const tfDinM = computed( () => tfDinMm.value / 1000 );
const tfTglM = computed( () => tfTglMm.value / 1000 );

const areaDinM2 = computed( () => areaM2FromTfMm( tfDinMm.value ) );
const areaTglM2 = computed( () => areaM2FromTfMm( tfTglMm.value ) );

const qgDinKNm = computed( () => qgKNmFromTfMm( tfDinMm.value ) );
const qgTglKNm = computed( () => qgKNmFromTfMm( tfTglMm.value ) );
const qgDinKgM = computed( () => materialBase.rhoSteel * areaDinM2.value );
const qgTglKgM = computed( () => materialBase.rhoSteel * areaTglM2.value );
const reactionDinKN = computed( () => inputs.PkN / 2 + qgDinKNm.value * inputs.Lm / 2 );
const reactionTglKN = computed( () => inputs.PkN / 2 + qgTglKNm.value * inputs.Lm / 2 );

const mGDinKnm = computed( () => qgDinKNm.value * inputs.Lm ** 2 / 8 );
const mGTglKnm = computed( () => qgTglKNm.value * inputs.Lm ** 2 / 8 );

const mEdDinKnm = computed( () => inputs.gammaDIN * ( mPkNm.value + mGDinKnm.value ) );
const mEdTglKnm = computed( () => inputs.gammaQ * mPkNm.value + inputs.gammaG * mGTglKnm.value );

const wReqDinCm3 = computed( () => mEdDinKnm.value * 1e6 / fyd.value / 1e3 );
const wReqTglCm3 = computed( () => mEdTglKnm.value * 1e6 / fyd.value / 1e3 );
const wDinCm3 = computed( () => sectionWCm3( tfDinMm.value ) );
const wTglCm3 = computed( () => sectionWCm3( tfTglMm.value ) );

const isDinOk = computed( () => wDinCm3.value >= wReqDinCm3.value );
const isTglOk = computed( () => wTglCm3.value >= wReqTglCm3.value );

const wReqReductionPercent = computed( () => ( 1 - wReqTglCm3.value / wReqDinCm3.value ) * 100 );
const weightDeltaKgM = computed( () => qgDinKgM.value - qgTglKgM.value );
const graphProps = computed( () => ( {
	Lm:            inputs.Lm,
	pointLoadKN:   inputs.PkN,
	qgDinKNm:      qgDinKNm.value,
	qgTglKNm:      qgTglKNm.value,
	reactionDinKN: reactionDinKN.value,
	reactionTglKN: reactionTglKN.value
} ) );

function fmtUi( value, digits = 0 ) {
	const num = Number( value );

	if ( !Number.isFinite( num ) ) {
		return "0";
	}

	return num.toFixed( digits ).replace( ".", "," );
}

function fmtMath(
	value, digits = 2, trim = false
) {
	if ( !Number.isFinite( Number( value ) ) ) {
		return "0";
	}

	const fixed = Number( value ).toFixed( digits );
	let [ intPart, decPart ] = fixed.split( "." );

	if ( trim && decPart ) {
		decPart = decPart.replace( /0+$/, "" );
	}

	intPart = intPart.replace( /\B(?=(\d{3})+(?!\d))/g, "\\," );

	if ( !decPart ) {
		return intPart;
	}

	return `${intPart}{,}${decPart}`;
}

const texDinAreaEq = computed( () =>
	`A=2(${fmtMath(
		bM.value, 3, true
	)})(${fmtMath(
		tfDinM.value, 3, true
	)})+${fmtMath(
		twM.value, 3, true
	)}(${
		fmtMath(
			hM.value, 3, true
		)}-2\\cdot ${fmtMath(
		tfDinM.value, 3, true
	)})` );
const texDinAreaVal = computed( () => `A=${fmtMath(
	areaDinM2.value, 4, true
)}\\,\\mathrm{m^2}` );
const texDinQgVal = computed( () => `q_g\\approx ${fmtMath(
	qgDinKNm.value, 3, true
)}\\,\\mathrm{kN/m}` );
const texDinMassVal = computed( () => `(\\approx ${fmtMath( qgDinKgM.value, 0 )}\\,\\mathrm{kg/m})` );
const texDinMgVal = computed( () =>
	`M_g=\\frac{${fmtMath(
		qgDinKNm.value, 3, true
	)}\\cdot ${fmtMath( inputs.Lm, 0 )}^2}{8}=${fmtMath(
		mGDinKnm.value, 2, true
	)}\\,\\mathrm{kNm}` );
const texDinMed1 = computed( () => `M_{Ed,\\text{DIN}}=${fmtMath( inputs.gammaDIN, 2 )}\\,(M_P+M_g)` );
const texDinMed2 = computed( () =>
	`M_{Ed,\\text{DIN}}=${fmtMath( inputs.gammaDIN, 2 )}\\,(${fmtMath(
		mPkNm.value, 2, true
	)}+${fmtMath(
		mGDinKnm.value, 2, true
	)})` );
const texDinMed3 = computed( () => `M_{Ed,\\text{DIN}}=${fmtMath(
	mEdDinKnm.value, 2, true
)}\\,\\mathrm{kNm}` );
const texDinWReqVal = computed( () =>
	`W_{\\text{erf,DIN}}=\\frac{${fmtMath(
		mEdDinKnm.value, 2, true
	)}\\cdot 10^6}{${fmtMath(
		fyd.value, 2, true
	)}}` );
const texDinWReqRes = computed( () =>
	`W_{\\text{erf,DIN}}\\approx ${fmtMath( wReqDinCm3.value, 0 )}\\,\\mathrm{cm^3}` );
const texDinWRes = computed( () => `W\\approx ${fmtMath( wDinCm3.value, 0 )}\\,\\mathrm{cm^3}` );

const texTglAreaEq = computed( () =>
	`A=2(${fmtMath(
		bM.value, 3, true
	)})(${fmtMath(
		tfTglM.value, 3, true
	)})+${fmtMath(
		twM.value, 3, true
	)}(${
		fmtMath(
			hM.value, 3, true
		)}-2\\cdot ${fmtMath(
		tfTglM.value, 3, true
	)})` );
const texTglAreaVal = computed( () => `A=${fmtMath(
	areaTglM2.value, 4, true
)}\\,\\mathrm{m^2}` );
const texTglQgVal = computed( () => `q_g\\approx ${fmtMath(
	qgTglKNm.value, 3, true
)}\\,\\mathrm{kN/m}` );
const texTglMassVal = computed( () => `(\\approx ${fmtMath( qgTglKgM.value, 0 )}\\,\\mathrm{kg/m})` );
const texMP = computed( () =>
	`M_P=\\frac{${fmtMath( inputs.PkN, 0 )}\\cdot ${fmtMath( inputs.Lm, 0 )}}{4}=${fmtMath(
		mPkNm.value, 2, true
	)}\\,\\mathrm{kNm}` );
const texMPOnly = computed( () => `M_P=${fmtMath(
	mPkNm.value, 2, true
)}\\,\\mathrm{kNm}` );
const texTglMgVal = computed( () =>
	`M_g=\\frac{${fmtMath(
		qgTglKNm.value, 3, true
	)}\\cdot ${fmtMath( inputs.Lm, 0 )}^2}{8}=${fmtMath(
		mGTglKnm.value, 2, true
	)}\\,\\mathrm{kNm}` );
const texTglMed1 = computed( () => "M_{Ed,\\text{TGL}}=\\gamma_Q M_P+\\gamma_G M_g" );
const texTglMed2 = computed( () =>
	`M_{Ed,\\text{TGL}}=${fmtMath( inputs.gammaQ, 2 )}\\cdot ${fmtMath(
		mPkNm.value, 2, true
	)}+${fmtMath( inputs.gammaG, 2 )}\\cdot ${fmtMath(
		mGTglKnm.value, 2, true
	)}` );
const texTglMed3 = computed( () => `M_{Ed,\\text{TGL}}=${fmtMath(
	mEdTglKnm.value, 2, true
)}\\,\\mathrm{kNm}` );
const texTglWReqVal = computed( () =>
	`W_{\\text{erf,TGL}}=\\frac{${fmtMath(
		mEdTglKnm.value, 2, true
	)}\\cdot 10^6}{${fmtMath(
		fyd.value, 2, true
	)}}` );
const texTglWReqRes = computed( () =>
	`W_{\\text{erf,TGL}}\\approx ${fmtMath( wReqTglCm3.value, 0 )}\\,\\mathrm{cm^3}` );
const texTglWRes = computed( () => `W\\approx ${fmtMath( wTglCm3.value, 0 )}\\,\\mathrm{cm^3}` );

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

const texDinDesignBlock = computed( () => texAlignedBlock( [
	texDinAreaEq.value,
	texDinAreaVal.value,
	texDinQgVal.value,
	texDinMassVal.value,
	texMP.value,
	texDinMgVal.value,
	texDinMed1.value,
	texDinMed2.value,
	texDinMed3.value,
	"W_{\\text{erf,DIN}}=\\frac{M_{Ed,\\text{DIN}}\\cdot 10^6}{f_{yd}}",
	texDinWReqVal.value,
	texDinWReqRes.value,
	texDinWRes.value
] ) );

const texTglDesignBlock = computed( () => texAlignedBlock( [
	texTglAreaEq.value,
	texTglAreaVal.value,
	texTglQgVal.value,
	texTglMassVal.value,
	texMPOnly.value,
	texTglMgVal.value,
	texTglMed1.value,
	texTglMed2.value,
	texTglMed3.value,
	"W_{\\text{erf,TGL}}=\\frac{M_{Ed,\\text{TGL}}\\cdot 10^6}{f_{yd}}",
	texTglWReqVal.value,
	texTglWReqRes.value,
	texTglWRes.value
] ) );

const texSectionSummaryBlock = computed( () => texAlignedBlock( [
	`t_{f,\\text{DIN}}=${fmtMath( tfDinMm.value, 0 )}\\,\\mathrm{mm}`,
	`t_{f,\\text{TGL}}=${fmtMath( tfTglMm.value, 0 )}\\,\\mathrm{mm}`,
	`q_{g,\\text{DIN}}=${fmtMath(
		qgDinKNm.value, 3, true
	)}\\,\\mathrm{kN/m}`,
	`q_{g,\\text{TGL}}=${fmtMath(
		qgTglKNm.value, 3, true
	)}\\,\\mathrm{kN/m}`,
	`\\Delta t_f=${fmtMath( tfStepMm, 0 )}\\,\\mathrm{mm}\\;\\text{(Rundung)}`
] ) );
</script>

<style scoped>
.controlRow {
	margin-bottom: 2px;
}

.controlLabel {
	display: inline-flex;
	align-items: center;
	min-height: 32px;
	font-weight: 600;
}
</style>
