<!-- eslint-disable vue/max-len -->
<template>
<AppFrame
	:sub-chapter="{
		impuls: 'Impuls vs. k',
		idee: 'Idee',
		rechenweg: 'Rechenweg',
		beispiel: 'Mini-Beispiel',
		fazit: 'Fazit'
	}"
	title="Eddie rechnet: Baustatik #3 Dynamische Lasten"
>
	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer title="Eddie vergleicht ruhige und knallige Lasten">
				<img alt="Eddie erklärt dynamische Lasten" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>

		<h2 id="impuls">1) Eigentlich müsste man dynamische Lasten über Impuls rechnen</h2>
		<div class="eddie">
			<p>
				Bei einem Stoß ist die Last nicht nur „Gewicht“, sondern vor allem ein zeitlicher Kraftverlauf.
				Streng genommen läuft die Rechnung über den Impuls:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="J=\int_{t_0}^{t_1}F(t)\,\mathrm{d}t=\Delta p=m(v_1-v_0)" />
				<Katex as="div" display tex="\int_{t_0}^{t_1}\big(F_K(t)-m g\big)\,\mathrm{d}t=m(v_1-v_0)" />
				<Katex as="div" display tex="F_{K,\mathrm{mittel}}=m g+\frac{m(v_1-v_0)}{\Delta t}" />
			</div>
			<p>
				Damit sieht man sofort: kurze Abbremszeit <Katex tex="\Delta t" /> bedeutet große Kraftspitzen.
				Wie hoch die Spitze wirklich wird, hängt zusätzlich von Steifigkeit, Dämpfung und Kontaktverlauf ab.
			</p>
			<p>
				Im Entwurfsalltag machen es sich Ingenieure hier gern leicht und ersetzen die vollständige Stoßrechnung
				durch einen Zuschlagfaktor:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="F_d=k\,F_k,\qquad F_k=m g" />
			</div>
			<p>
				Der Faktor <Katex tex="k" /> ist also ein Ersatz für „alles Dynamische“: Geschwindigkeit,
				Abbremszeit, Schwingungsverhalten und Unsicherheiten.
			</p>
		</div>

		<h2 id="idee" class="mt-8">2) Dynamische Lasten - anschaulich gedacht (TGL vs. DIN damals)</h2>
		<div class="eddie">
			<h3>Idee in einem Bild</h3>
			<ul>
				<li><strong>Langsam:</strong> Ein dicker Mann setzt sich aufs Sofa. Schwer, aber eher ruhig.</li>
				<li><strong>Schnell und hart:</strong> Ein Kind springt vom Sofa auf den Boden. Leichter, aber kurzer Knall.</li>
			</ul>
			<p>Für die Rechnung nutzen wir ein didaktisches Denkmodell:</p>
			<ul>
				<li>Grundlast: <Katex tex="F_k" /></li>
				<li>Zuschlag: <Katex tex="k" /></li>
				<li>Bemessungslast: <Katex tex="F_d" /></li>
			</ul>
			<p class="muted">
				Wichtig: Das ist bewusst einfach gehalten und keine exakte Normabschrift.
				Es zeigt nur, was mit „differenziert nach Lastcharakter“ gemeint ist.
			</p>
		</div>

		<h2 id="rechenweg" class="mt-8">Gemeinsame Eingaben für alle Rechenwege:</h2>
		<div class="eddie">
			<ul>
				<li><Katex :tex="`m_M=${kFmt( inputs.mMkg, 0 )}\\,\\mathrm{kg}`" /></li>
				<li><Katex :tex="`m_K=${kFmt( inputs.mKkg, 0 )}\\,\\mathrm{kg}`" /></li>
				<li><Katex :tex="`g\\approx ${kFmt( inputs.gMs2, 2 )}\\,\\mathrm{m/s^2}`" /></li>
				<li>
					<Katex :tex="`k_{\\text{ruhig}}=${kFmt( inputs.kRuhig, 1 )},\\quad k_{\\text{knall}}=${kFmt( inputs.kKnall, 1 )},\\quad k_{\\text{DIN}}=${kFmt( inputs.kDIN, 1 )}`" />
				</li>
			</ul>
			<h3 id="beispiel" class="mt-4">Rechenweg und Zahlenbeispiel</h3>

			<v-row class="mb-2" dense>
				<v-col cols="12" md="4">
					<v-card class="columnHeader pa-3" variant="outlined">
						<h4 class="columnTitle">TGL: dicker Mann (setzt sich, ruhig)</h4>
					</v-card>
				</v-col>
				<v-col cols="12" md="4">
					<v-card class="columnHeader pa-3" variant="outlined">
						<h4 class="columnTitle">TGL: Kind (springt, knallt)</h4>
					</v-card>
				</v-col>
				<v-col cols="12" md="4">
					<v-card class="columnHeader pa-3" variant="outlined">
						<h4 class="columnTitle">DIN (um 1985): pauschal</h4>
					</v-card>
				</v-col>
			</v-row>
			<p class="stepTitle">1) Grundlast</p>
			<v-row dense>
				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">
						
						<Katex as="div" display tex="F_{k,M}=m_M\cdot g" />
						<Katex as="div" display :tex="`F_{k,M}=${kFmt( inputs.mMkg, 0 )}\\cdot ${kFmt( inputs.gMs2, 2 )}\\,\\mathrm{N}=${kFmt( fkMN, 2 )}\\,\\mathrm{N}`" />
						<Katex as="div" display :tex="`F_{k,M}\\approx ${kFmt( fkMkN, 2 )}\\,\\mathrm{kN}`" />
					</v-card>
				</v-col>

				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">
						<Katex as="div" display tex="F_{k,K}=m_K\cdot g" />
						<Katex as="div" display :tex="`F_{k,K}=${kFmt( inputs.mKkg, 0 )}\\cdot ${kFmt( inputs.gMs2, 2 )}\\,\\mathrm{N}=${kFmt( fkKN, 2 )}\\,\\mathrm{N}`" />
						<Katex as="div" display :tex="`F_{k,K}\\approx ${kFmt( fkKkN, 2 )}\\,\\mathrm{kN}`" />
					</v-card>
				</v-col>

				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">

						<Katex as="div" display tex="F_k=m\cdot g" />
						<p class="cellNote">ohne Trennung von „setzt“ und „springt“</p>
						<Katex as="div" display :tex="`F_{k,M}\\approx ${kFmt( fkMkN, 2 )}\\,\\mathrm{kN}`" />
						<Katex as="div" display :tex="`F_{k,K}\\approx ${kFmt( fkKkN, 2 )}\\,\\mathrm{kN}`" />
					</v-card>
				</v-col>
			</v-row>
			<p class="stepTitle">2) Zuschlag</p>
			<v-row dense>
				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">
						<Katex as="div" display :tex="`k_{\\text{ruhig}}=${kFmt( inputs.kRuhig, 1 )}`" />
						<p class="cellNote">kleiner Zuschlag fuer ruhige Last</p>
					</v-card>
				</v-col>
				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">
						<Katex as="div" display :tex="`k_{\\text{knall}}=${kFmt( inputs.kKnall, 1 )}`" />
						<p class="cellNote">groesserer Zuschlag fuer knallige Last</p>
					</v-card>
				</v-col>
				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">
						<Katex as="div" display :tex="`k_{\\text{DIN}}=${kFmt( inputs.kDIN, 1 )}`" />
						<p class="cellNote">gleich, egal wie die Last entsteht</p>
					</v-card>
				</v-col>
			</v-row>
			<p class="stepTitle">3) Bemessungslast</p>
			<v-row dense>
				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">
						
						<Katex as="div" display tex="F_{d,M}=k_{\text{ruhig}}\,F_{k,M}" />
						<Katex as="div" display :tex="`F_{d,M}\\approx ${kFmt( inputs.kRuhig, 1 )}\\cdot ${kFmt( fkMkN, 2 )}=${kFmt( fdM, 2 )}\\,\\mathrm{kN}`" />
					</v-card>
				</v-col>
				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">
						<Katex as="div" display tex="F_{d,K}=k_{\text{knall}}\,F_{k,K}" />
						<Katex as="div" display :tex="`F_{d,K}\\approx ${kFmt( inputs.kKnall, 1 )}\\cdot ${kFmt( fkKkN, 2 )}=${kFmt( fdK, 2 )}\\,\\mathrm{kN}`" />
					</v-card>
				</v-col>
				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">
						<Katex as="div" display tex="F_d=k_{\text{DIN}}\,F_k" />
						<Katex as="div" display :tex="`F_{d,M}\\approx ${kFmt( inputs.kDIN, 1 )}\\cdot ${kFmt( fkMkN, 2 )}=${kFmt( fdDinM, 2 )}\\,\\mathrm{kN}`" />
						<Katex as="div" display :tex="`F_{d,K}\\approx ${kFmt( inputs.kDIN, 1 )}\\cdot ${kFmt( fkKkN, 2 )}=${kFmt( fdDinK, 2 )}\\,\\mathrm{kN}`" />
					</v-card>
				</v-col>
			</v-row>
			<p class="stepTitle">4) Merksatz</p>
			<v-row dense>
				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">
						<p>Schwer, aber gemuetlich.</p>
					</v-card>
				</v-col>
				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">
						<p>Leicht, aber kurz brutal.</p>
					</v-card>
				</v-col>
				<v-col cols="12" md="4">
					<v-card class="compareCard pa-4" variant="outlined">
						<p>Ein Zuschlag fuer alles.</p>
					</v-card>
				</v-col>
			</v-row>

			<p>Was man daran sieht:</p>
			<ul>
				<li>Bei TGL kann ein leichter Sprung fast so schlimm sein wie ein schweres Hinsetzen.</li>
				<li>Bei DIN (damals) bleibt der Sprung automatisch klein, weil er denselben Zuschlag bekommt.</li>
			</ul>
		</div>

		<h2 id="fazit" class="mt-8">Fazit (verstaendlich und ehrlich)</h2>
		<div class="eddie">
			<ul>
				<li><strong>TGL-Denke:</strong> nicht nur „wie schwer“, sondern auch „wie passiert es?“</li>
				<li><strong>DIN (damals):</strong> ein Zuschlag fuer alles, robust und einfach</li>
			</ul>
			<p>
				Kurz gesagt: TGL wirkt feiner (<Katex tex="\text{setzt sich}\neq \text{springt}" />),
				DIN (damals) grober, dafuer leichter anzuwenden. Heute unterschiedet die DIN auch nach Lastcharakter.
			</p>
		</div>
	</template>
	<template #interactivePart>
		<h2>Interaktiv</h2>
		<div class="eddie interactive">
			<v-card class="pa-3" variant="tonal">
				<v-row dense>
					<v-col cols="12" md="6">
						<div class="sliderHeader">
							<span><Katex inline tex="m_M" /> Masse Mann</span>
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
							<span><Katex inline tex="m_K" /> Masse Kind</span>
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
							<span><Katex inline tex="k_{\text{ruhig}}" /> Zuschlag ruhig</span>
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
							<span><Katex inline tex="k_{\text{knall}}" /> Zuschlag knallt</span>
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

			<BZ_Graph
				class="mt-4"
				:fd-k="fdK"
				:fd-m="fdM"
			/>
		</div>
	</template>
</AppFrame>
</template>

<script setup>
import { computed, reactive } from "vue";
import titleImg from "@/images/BZ.webp";
import BZ_Graph from "@/views/BZ_Graph.vue";

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
