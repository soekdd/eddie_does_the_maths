<!-- i18n-ally-scope: useI18n("book1.BZ") -->
<!-- eslint-disable vue/max-len -->
<template>
<AppFrame
	:sub-chapter
	:title="t( 'bz.title' )"
	:vue-date="__VITE_SFC_MTIME_MS__"
>
	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="t( 'bz.imageTitle' )">
				<img :alt="t( 'bz.imageAlt' )" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">{{ t( "bz.introDate" ) }}</h3>
		<div class="eddie">
			<p v-html="t( 'bz.book.p1' )" />
			<p v-html="t( 'bz.book.p2' )" />
			<p v-html="t( 'bz.book.p3' )" />
			<p v-html="t( 'bz.book.p4' )" />

		</div>
	</template>

	<template #descriptionPart>

		<h2 id="impuls">{{ t( "bz.sections.part1.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'bz.sections.part1.p1' )"/>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					:tex="texImpulseBlock"
				/>
			</div>
			<p v-html="t( 'bz.sections.part1.p2' )" />
			<p v-html="t( 'bz.sections.part1.p3' )"/>
			<div class="kbox">
				<Katex as="div" display tex="F_d=k\,F_k,\qquad F_k=m g" />
			</div>
			<p v-html="t( 'bz.sections.part1.p4' )" />
		</div>

		<h2 id="idee" class="mt-8">{{ t( "bz.sections.part2.title" ) }}</h2>
		<div class="eddie">
			<h3>{{ t( "bz.sections.part2.imageIdea" ) }}</h3>
			<ul>
				<li v-html="t( 'bz.sections.part2.slow' )" />
				<li v-html="t( 'bz.sections.part2.fast' )" />
			</ul>
			<p v-html="t( 'bz.sections.part2.p1' )"/>
			<ul>
				<li v-html="t( 'bz.sections.part2.baseLoad' )" />
				<li v-html="t( 'bz.sections.part2.surcharge' )" />
				<li v-html="t( 'bz.sections.part2.designLoad' )" />
			</ul>
			<p class="muted">{{ t( "bz.sections.part2.note" ) }}</p>
		</div>

		<h2 id="rechenweg" class="mt-8">{{ t( "bz.sections.part3.title" ) }}</h2>
		<div class="eddie">
			<ul>
				<li><Katex :tex="`m_M=${kFmt( inputs.mMkg, 0 )}\\,\\mathrm{kg}`" /></li>
				<li><Katex :tex="`m_K=${kFmt( inputs.mKkg, 0 )}\\,\\mathrm{kg}`" /></li>
				<li><Katex :tex="`g\\approx ${kFmt( inputs.gMs2, 2 )}\\,\\mathrm{m/s^2}`" /></li>
				<li>
					<Katex :tex="`${texKCalm}=${kFmt( inputs.kRuhig, 1 )},\\quad ${texKBang}=${kFmt( inputs.kKnall, 1 )},\\quad ${texKDin}=${kFmt( inputs.kDIN, 1 )}`" />
				</li>
			</ul>
			<h3 id="beispiel" class="mt-4">{{ t( "bz.sections.part3.step31" ) }}</h3>

			<v-row class="mb-2" dense>
				<v-col cols="12" md="4">
					<v-card class="columnHeader pa-3" variant="outlined">
						<h4 class="columnTitle">{{ t( "bz.sections.part3.col1" ) }}</h4>
					</v-card>
				</v-col>
				<v-col cols="12" md="4">
					<v-card class="columnHeader pa-3" variant="outlined">
						<h4 class="columnTitle">{{ t( "bz.sections.part3.col2" ) }}</h4>
					</v-card>
				</v-col>
				<v-col cols="12" md="4">
					<v-card class="columnHeader pa-3" variant="outlined">
						<h4 class="columnTitle">{{ t( "bz.sections.part3.col3" ) }}</h4>
					</v-card>
				</v-col>
			</v-row>
			<p class="stepTitle">{{ t( "bz.sections.part3.step1" ) }}</p>
			<v-row dense>
				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">
						<Katex
							aligned
							as="div"
							display
							:tex="`F_{k,M} &= m_M\\cdot g \\\\ F_{k,M} &= ${kFmt( inputs.mMkg, 0 )}\\cdot ${kFmt( inputs.gMs2, 2 )}\\,\\mathrm{N}=${kFmt( fkMN, 2 )}\\,\\mathrm{N} \\\\ F_{k,M} &\\approx ${kFmt( fkMkN, 2 )}\\,\\mathrm{kN}`"
						/>
					</v-card>
				</v-col>

				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">
						<Katex
							aligned
							as="div"
							display
							:tex="`F_{k,K} &= m_K\\cdot g \\\\ F_{k,K} &= ${kFmt( inputs.mKkg, 0 )}\\cdot ${kFmt( inputs.gMs2, 2 )}\\,\\mathrm{N}=${kFmt( fkKN, 2 )}\\,\\mathrm{N} \\\\ F_{k,K} &\\approx ${kFmt( fkKkN, 2 )}\\,\\mathrm{kN}`"
						/>
					</v-card>
				</v-col>

				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">

						<Katex as="div" display tex="F_k=m\cdot g" />
						<p class="cellNote">{{ t( "bz.sections.part3.cell1Note" ) }}</p>
						<Katex
							aligned
							as="div"
							display
							:tex="`F_{k,M} &\\approx ${kFmt( fkMkN, 2 )}\\,\\mathrm{kN} \\\\ F_{k,K} &\\approx ${kFmt( fkKkN, 2 )}\\,\\mathrm{kN}`"
						/>
					</v-card>
				</v-col>
			</v-row>
			<p class="stepTitle">{{ t( "bz.sections.part3.step2" ) }}</p>
			<v-row dense>
				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">
						<Katex as="div" display :tex="`${texKCalm}=${kFmt( inputs.kRuhig, 1 )}`" />
						<p class="cellNote">{{ t( "bz.sections.part3.cell2Left" ) }}</p>
					</v-card>
				</v-col>
				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">
						<Katex as="div" display :tex="`${texKBang}=${kFmt( inputs.kKnall, 1 )}`" />
						<p class="cellNote">{{ t( "bz.sections.part3.cell2Mid" ) }}</p>
					</v-card>
				</v-col>
				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">
						<Katex as="div" display :tex="`k_{\\text{DIN}}=${kFmt( inputs.kDIN, 1 )}`" />
						<p class="cellNote">{{ t( "bz.sections.part3.cell2Right" ) }}</p>
					</v-card>
				</v-col>
			</v-row>
			<p class="stepTitle">{{ t( "bz.sections.part3.step3" ) }}</p>
			<v-row dense>
				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">
						<Katex
							aligned
							as="div"
							display
							:tex="`F_{d,M} &= ${texKCalm}\\,F_{k,M} \\\\ F_{d,M} &\\approx ${kFmt( inputs.kRuhig, 1 )}\\cdot ${kFmt( fkMkN, 2 )}=${kFmt( fdM, 2 )}\\,\\mathrm{kN}`"
						/>
					</v-card>
				</v-col>
				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">
						<Katex
							aligned
							as="div"
							display
							:tex="`F_{d,K} &= ${texKBang}\\,F_{k,K} \\\\ F_{d,K} &\\approx ${kFmt( inputs.kKnall, 1 )}\\cdot ${kFmt( fkKkN, 2 )}=${kFmt( fdK, 2 )}\\,\\mathrm{kN}`"
						/>
					</v-card>
				</v-col>
				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">
						<Katex
							aligned
							as="div"
							display
							:tex="`F_d &= k_{\\text{DIN}}\\,F_k \\\\ F_{d,M} &\\approx ${kFmt( inputs.kDIN, 1 )}\\cdot ${kFmt( fkMkN, 2 )}=${kFmt( fdDinM, 2 )}\\,\\mathrm{kN} \\\\ F_{d,K} &\\approx ${kFmt( inputs.kDIN, 1 )}\\cdot ${kFmt( fkKkN, 2 )}=${kFmt( fdDinK, 2 )}\\,\\mathrm{kN}`"
						/>
					</v-card>
				</v-col>
			</v-row>
			<p class="stepTitle">{{ t( "bz.sections.part3.step4" ) }}</p>
			<v-row dense>
				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">
						<p v-html="t( 'bz.sections.part3.max1' )"/>
					</v-card>
				</v-col>
				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">
						<p v-html="t( 'bz.sections.part3.max2' )"/>
					</v-card>
				</v-col>
				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">
						<p v-html="t( 'bz.sections.part3.max3' )"/>
					</v-card>
				</v-col>
			</v-row>

			<p v-html="t( 'bz.sections.part3.summaryLead' )"/>
			<ul>
				<li>{{ t( "bz.sections.part3.summary1" ) }}</li>
				<li>{{ t( "bz.sections.part3.summary2" ) }}</li>
			</ul>
		</div>

		<h2 id="fazit" class="mt-8">{{ t( "bz.sections.part4.title" ) }}</h2>
		<div class="eddie">
			<ul>
				<li v-html="t( 'bz.sections.part4.f1' )" />
				<li v-html="t( 'bz.sections.part4.f2' )" />
			</ul>
			<p v-html="t( 'bz.sections.part4.p1' )" />
		</div>
	</template>
	<template #interactivePart>
		<h2>{{ t( "bz.interactive.title" ) }}</h2>
		<div class="eddie interactive">
			<v-card class="pa-3" variant="tonal">
				<v-row dense>
					<v-col cols="12" md="6">
						<div class="sliderHeader">
							<span><Katex inline tex="m_M" /> {{ t( "bz.interactive.massMan" ) }}</span>
							<v-chip color="primary" size="small" variant="flat">
								{{ `${uiFmt( inputs.mMkg, 0 )} kg` }}
							</v-chip>
						</div>
						<v-slider
							v-model="inputs.mMkg"
							color="primary"
							:max="220"
							:min="60"
							:step="1"
							thumb-label
						>
							<template #thumb-label>{{ `${uiFmt( inputs.mMkg, 0 )} kg` }}</template>
						</v-slider>
					</v-col>

					<v-col cols="12" md="6">
						<div class="sliderHeader">
							<span><Katex inline tex="m_K" /> {{ t( "bz.interactive.massChild" ) }}</span>
							<v-chip color="primary" size="small" variant="flat">
								{{ `${uiFmt( inputs.mKkg, 0 )} kg` }}
							</v-chip>
						</div>
						<v-slider
							v-model="inputs.mKkg"
							color="primary"
							:max="80"
							:min="15"
							:step="1"
							thumb-label
						>
							<template #thumb-label>{{ `${uiFmt( inputs.mKkg, 0 )} kg` }}</template>
						</v-slider>
					</v-col>

					<v-col cols="12" md="6">
						<div class="sliderHeader">
							<span><Katex inline :tex="texKCalm" /> {{ t( "bz.interactive.surchargeCalm" ) }}</span>
							<v-chip color="primary" size="small" variant="flat">
								{{ uiFmt( inputs.kRuhig, 2 ) }}
							</v-chip>
						</div>
						<v-slider
							v-model="inputs.kRuhig"
							color="primary"
							:max="2.2"
							:min="1.0"
							:step="0.05"
							thumb-label
						>
							<template #thumb-label>{{ uiFmt( inputs.kRuhig, 2 ) }}</template>
						</v-slider>
					</v-col>

					<v-col cols="12" md="6">
						<div class="sliderHeader">
							<span><Katex inline :tex="texKBang" /> {{ t( "bz.interactive.surchargeBang" ) }}</span>
							<v-chip color="primary" size="small" variant="flat">
								{{ uiFmt( inputs.kKnall, 2 ) }}
							</v-chip>
						</div>
						<v-slider
							v-model="inputs.kKnall"
							color="primary"
							:max="4.5"
							:min="1.0"
							:step="0.05"
							thumb-label
						>
							<template #thumb-label>{{ uiFmt( inputs.kKnall, 2 ) }}</template>
						</v-slider>
					</v-col>
				</v-row>
			</v-card>

			<BZGraph
				class="mt-4"
				:fd-k
				:fd-m
			/>
		</div>
	</template>
</AppFrame>
</template>

<script setup>
import { computed, reactive } from "vue";
import { useI18n } from "@/utils/i18n.mjs";
import titleImg from "./BZ.webp";
import BZGraph from "./BZ_Graph.vue";

const { t } = useI18n( "book1.BZ" );

const subChapter = computed( () => ( {
	einleitung: t( "bz.subChapter.einleitung" ),
	impuls:     t( "bz.subChapter.impuls" ),
	idee:       t( "bz.subChapter.idee" ),
	rechenweg:  t( "bz.subChapter.rechenweg" ),
	beispiel:   t( "bz.subChapter.beispiel" ),
	fazit:      t( "bz.subChapter.fazit" )
} ) );

const texKCalm = computed( () => `k_{\\text{${t( "bz.katex.calm" )}}}` );
const texKBang = computed( () => `k_{\\text{${t( "bz.katex.bang" )}}}` );
const texKDin = "k_{\\text{DIN}}";
const texImpulseBlock = computed( () => `J &= \\int_{t_0}^{t_1}F(t)\\,\\mathrm{d}t=\\Delta p=m(v_1-v_0) \\\\
\\int_{t_0}^{t_1}\\big(F_K(t)-m g\\big)\\,\\mathrm{d}t &= m(v_1-v_0) \\\\
F_{K,\\mathrm{${t( "bz.katex.mean" )}}} &= m g+\\frac{m(v_1-v_0)}{\\Delta t}` );

const inputs = reactive( {
	mMkg:   120,
	mKkg:   35,
	gMs2:   9.81,
	kRuhig: 1.1,
	kKnall: 4.2,
	kDIN:   1.5
} );

const fkMN = computed( () => inputs.mMkg * inputs.gMs2 );
const fkKN = computed( () => inputs.mKkg * inputs.gMs2 );
const fkMkN = computed( () => fkMN.value / 1000 );
const fkKkN = computed( () => fkKN.value / 1000 );

const fdM = computed( () => inputs.kRuhig * fkMkN.value );
const fdK = computed( () => inputs.kKnall * fkKkN.value );
const fdDinM = computed( () => inputs.kDIN * fkMkN.value );
const fdDinK = computed( () => inputs.kDIN * fkKkN.value );

function kFmt( value,
	digits = 2 ) {
	return Number( value ).toFixed( digits )
		.replace( ".", "{,}" );
}

function uiFmt( value,
	digits = 2 ) {
	return Number( value ).toFixed( digits )
		.replace( ".", "," );
}
</script>

<style scoped>
.sliderHeader {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 10px;
	margin-bottom: 4px;
}

.compareCard {
	height: 100%;
}

.columnHeader {
	background: rgba(var(--v-theme-primary), 0.08);
}

.cellNote {
	font-size: 0.92rem;
	color: rgba(var(--v-theme-on-surface), 0.72);
	margin-top: -4px;
}

.columnTitle {
	font-size: 1.05rem;
	margin-bottom: 8px;
}

.stepTitle {
	font-weight: 700;
	margin-top: 0;
	margin-bottom: 2px;
}

@media (max-width: 860px) {
	.columnTitle {
		font-size: 1rem;
	}
}
</style>
