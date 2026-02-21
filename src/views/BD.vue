<!-- eslint-disable vue/max-len -->
<template>
<AppFrame
	:sub-chapter="{
		system: 'System',
		eigengewicht: 'Eigengewicht',
		schnittgroessen: 'Schnittgrößen',
		sicherheitsansatz: 'DIN vs. TGL',
		nachweis: 'Querschnittsnachweis',
		zahlenbeispiel: 'Zahlenbeispiel',
		bewertung: 'Bewertung',
		interaktiv: 'Interaktiv'
	}"
	title="Eddie rechnet: Baustatik #2 DIN vs. TGL"
>
	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer title="Eddie und Vidar albern über Sicherheitsbeiwerte">
				<img alt="Eddie mit Stahlträger" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>

		<h2 id="system">Punktlast mittig + Eigengewicht auf beidseitig gelenkig gelagertem Stahlträger</h2>
		<div class="eddie">
			<p>
				Wir betrachten einen einfach gelagerten Träger (beidseitig drehbar/gelenkig)
				mit Stützweite <Katex tex="L" />, einer Punktlast
				<Katex tex="P" /> in Feldmitte (<Katex tex="x=L/2" />) und
				einer gleichmäßig verteilten Streckenlast aus Eigengewicht
				<Katex tex="q_g\,[\mathrm{kN/m}]" />.
			</p>
			<p>
				Der Nachweis erfolgt über den Biegemomenten-Tragfähigkeitsvergleich:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="M_{Ed}\le M_{Rd}" />
			</div>
			<p>
				Dabei koppeln wir Einwirkungen (Lasten mit Sicherheitsbeiwerten <Katex tex="\gamma" />)
				und Widerstand (Materialseite mit <Katex tex="f_{yd}=f_y/\gamma_M" />).
			</p>
			<p class="muted">
				Heute führt die DIN ebenfalls getrennte Sicherheitsbeiwerte.
				Doch wir sind ja im Jahre 1985, da war das bei vielen DIN-Normen noch nicht so.
				Deshalb wird hier die Aufgabenlogik mit gleich faktorisierten DIN-Lastanteilen einer
				TGL-Variante mit niedrigerem Eigengewichtsbeiwert gegenübergestellt.
			</p>
		</div>

		<h2 id="eigengewicht" class="mt-8">2) Eigengewicht als Streckenlast <Katex tex="q_g" /></h2>
		<div class="eddie">
			<p>Das Eigengewicht pro Meter folgt aus der Querschnittsfläche <Katex tex="A" />:</p>
			<div class="kbox">
				<Katex as="div" display tex="q_g=\rho_{\text{Stahl}}\,g\,A" />
				<Katex as="div" display tex="q_g\,[\mathrm{kN/m}]=\frac{\rho g}{1000}\,A" />
			</div>
			<p>
				mit <Katex tex="\rho_{\text{Stahl}}\approx 7850\,\mathrm{kg/m^3}" /> und
				<Katex tex="g\approx 9{,}81\,\mathrm{m/s^2}" />.
			</p>
			<p>
				Wichtig: <Katex tex="q_g" /> hängt vom gewählten Querschnitt ab. Der Entwurf ist daher leicht iterativ.
			</p>
			<ol>
				<li>Querschnitt annehmen und <Katex tex="q_g" /> berechnen.</li>
				<li><Katex tex="M_{Ed}" /> bestimmen und erforderliches <Katex tex="W" /> ableiten.</li>
				<li>Querschnitt anpassen und erneut prüfen.</li>
			</ol>
		</div>
		<figure class="exampleFigure">
			<ImageZoomer title="Einfache Punktlast + Eigengewicht">
				<BD_Graph v-bind="graphProps" reduced />
			</ImageZoomer>
		</figure>
		<h2 id="schnittgroessen" class="mt-8">3) Schnittgrößen (charakteristisch) für Punktlast + Gleichlast</h2>
		<div class="eddie">
			<h3>3.1 Auflagerreaktionen</h3>
			<p>Aus Symmetrie folgt:</p>
			<div class="kbox">
				<Katex as="div" display tex="R_A=R_B=\frac{P}{2}+\frac{q_g L}{2}" />
			</div>

			<h3>3.2 Querkraft (maximal am Auflager)</h3>
			<div class="kbox">
				<Katex as="div" display tex="V_{k,\max}=\frac{P}{2}+\frac{q_g L}{2}" />
			</div>

			<h3>3.3 Biegemoment (maximal in Feldmitte)</h3>
			<div class="kbox">
				<Katex as="div" display tex="M_{P,\max}=\frac{P L}{4}" />
				<Katex as="div" display tex="M_{g,\max}=\frac{q_g L^2}{8}" />
				<Katex as="div" display tex="M_{k,\max}=\frac{P L}{4}+\frac{q_g L^2}{8}" />
			</div>
		</div>

		<h2 id="sicherheitsansatz" class="mt-8">4) Sicherheitsansatz der Einwirkungen: DIN vs. TGL</h2>
		<div class="eddie">
			<v-row dense>
				<v-col cols="12" md="6">
					<h3>4.1 DIN-Ansatz: gleicher Faktor auf beide Lastanteile</h3>
					<div class="kbox">
						<Katex as="div" display tex="P_d=\gamma_{\text{DIN}}P" />
						<Katex as="div" display tex="q_{g,d}=\gamma_{\text{DIN}}q_g" />
						<Katex as="div" display tex="M_{Ed,\text{DIN}}=\gamma_{\text{DIN}}\left(\frac{P L}{4}+\frac{q_g L^2}{8}\right)" />
					</div>
					<p>
						Dieser gleichfaktorige Ansatz in der DIN ist heute nicht mehr üblich.
					</p>
				</v-col>
				<v-col cols="12" md="6">
					<h3>4.2 TGL-Ansatz: Verkehrslast wie DIN, Eigengewicht niedriger</h3>
					<div class="kbox">
						<Katex as="div" display tex="P_d=\gamma_Q P" />
						<Katex as="div" display tex="q_{g,d}=\gamma_G q_g,\qquad \gamma_G<\gamma_{\text{DIN}}" />
						<Katex as="div" display tex="M_{Ed,\text{TGL}}=\gamma_Q\frac{P L}{4}+\gamma_G\frac{q_g L^2}{8}" />
					</div>
					<p>
						Die Idee: Eigengewicht ist meist genauer bekannt als Verkehrslast und kann deshalb geringer faktorisiert werden.
					</p>
				</v-col>
			</v-row>

			<h3>4.3 Mathematischer Kernausdruck</h3>
			<div class="kbox">
				<Katex as="div" display tex="M_{Ed,\text{DIN}}-M_{Ed,\text{TGL}}=(\gamma_{\text{DIN}}-\gamma_G)\,\frac{q_g L^2}{8}" />
			</div>
			<p>
				Der Unterschied entsteht nur über den Eigengewichtsanteil und wächst bei großen Spannweiten oder schweren Trägern.
			</p>
		</div>

		<h2 id="nachweis" class="mt-8">5) Querschnittsnachweis über Widerstandsmoment <Katex tex="W" /></h2>
		<div class="eddie">
			<div class="kbox">
				<Katex as="div" display tex="\sigma_{Ed}=\frac{M_{Ed}}{W}\le f_{yd}" />
				<Katex as="div" display tex="W\ge W_{\text{erf}}=\frac{M_{Ed}}{f_{yd}}" />
				<Katex as="div" display tex="f_{yd}=\frac{f_y}{\gamma_M}" />
			</div>
			<p>
				Die Gegenüberstellung DIN/TGL bleibt konsistent, solange <Katex tex="f_{yd}" /> identisch behandelt wird.
			</p>
		</div>
		<figure class="exampleFigure">
			<ImageZoomer title="Dimmensionierung eines I-Trägers">
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
		<h2 id="zahlenbeispiel" class="mt-8">6) Zahlenbeispiel</h2>
		<div class="eddie">
			<h3>6.1 Gewählte Parameter</h3>
			<ul>
				<li><Katex :tex="`L=${fmtMath( inputs.Lm, 0 )}\\,\\mathrm{m}`" /></li>
				<li><Katex :tex="`P=${fmtMath( inputs.PkN, 0 )}\\,\\mathrm{kN}`" /> (Punktlast in Feldmitte)</li>
				<li>
					DIN: <Katex :tex="`\\gamma_{\\text{DIN}}=${fmtMath( inputs.gammaDIN, 2 )}`" />
					(auf beide Lasten gleich)
				</li>
				<li>
					TGL:
					<Katex :tex="`\\gamma_Q=${fmtMath( inputs.gammaQ, 2 )},\\;\\gamma_G=${fmtMath( inputs.gammaG, 2 )}`" />
				</li>
				<li>
					Stahl:
					<Katex :tex="`f_y=${fmtMath( materialBase.fyNmm2, 0 )}\\,\\mathrm{N/mm^2},\\;\\gamma_M=${fmtMath( materialBase.gammaM, 1 )}\\Rightarrow f_{yd}=${fmtMath( fyd, 0 )}\\,\\mathrm{N/mm^2}`" />
				</li>
			</ul>
			<p>Geschweißter I-Träger (Dimensionierung über <Katex tex="t_f" />):</p>
			<div class="kbox">
				<Katex
					as="div"
					display
					:tex="`h=${fmtMath( sectionBase.hMm, 0 )}\\,\\mathrm{mm},\\quad b=${fmtMath( sectionBase.bMm, 0 )}\\,\\mathrm{mm},\\quad t_w=${fmtMath( sectionBase.twMm, 0 )}\\,\\mathrm{mm}`"
				/>
			</div>

			<h3>6.2 Eigengewicht aus Geometrie</h3>
			<div class="kbox">
				<Katex as="div" display tex="A = 2bt_f + t_w\,(h-2t_f)" />
				<Katex as="div" display tex="q_g=\frac{\rho g}{1000}\,A\;[\mathrm{kN/m}]" />
			</div>

			<v-row dense>
				<v-col cols="12" md="6">
					<h3>6.3 DIN-Entwurf (gleiches <Katex tex="\gamma" />)</h3>
					<p>Praktisch gerundet: <Katex :tex="`t_f=${fmtMath( tfDinMm, 0 )}\\,\\mathrm{mm}`" />.</p>
					<div class="kbox">
						<Katex as="div" display :tex="texDinAreaEq" />
						<Katex as="div" display :tex="texDinAreaVal" />
						<Katex as="div" display :tex="texDinQgVal" />
						<Katex as="div" display :tex="texDinMassVal" />
						<Katex as="div" display :tex="texMP" />
						<Katex as="div" display :tex="texDinMgVal" />
						<Katex as="div" display :tex="texDinMed1" />
						<Katex as="div" display :tex="texDinMed2" />
						<Katex as="div" display :tex="texDinMed3" />
						<Katex as="div" display tex="W_{\text{erf,DIN}}=\frac{M_{Ed,\text{DIN}}\cdot 10^6}{f_{yd}}" />
						<Katex as="div" display :tex="texDinWReqVal" />
						<Katex as="div" display :tex="texDinWReqRes" />
						<Katex as="div" display :tex="texDinWRes" />
					</div>
					<p><strong>{{ isDinOk ? "DIN erfüllt." : "DIN nicht erfüllt." }}</strong></p>
				</v-col>
				<v-col cols="12" md="6">
					<h3>6.4 TGL-Entwurf (Eigengewicht niedriger faktorisiert)</h3>
					<p>Praktisch gerundet: <Katex :tex="`t_f=${fmtMath( tfTglMm, 0 )}\\,\\mathrm{mm}`" />.</p>
					<div class="kbox">
						<Katex as="div" display :tex="texTglAreaEq" />
						<Katex as="div" display :tex="texTglAreaVal" />
						<Katex as="div" display :tex="texTglQgVal" />
						<Katex as="div" display :tex="texTglMassVal" />
						<Katex as="div" display :tex="texMPOnly" />
						<Katex as="div" display :tex="texTglMgVal" />
						<Katex as="div" display :tex="texTglMed1" />
						<Katex as="div" display :tex="texTglMed2" />
						<Katex as="div" display :tex="texTglMed3" />
						<Katex as="div" display tex="W_{\text{erf,TGL}}=\frac{M_{Ed,\text{TGL}}\cdot 10^6}{f_{yd}}" />
						<Katex as="div" display :tex="texTglWReqVal" />
						<Katex as="div" display :tex="texTglWReqRes" />
						<Katex as="div" display :tex="texTglWRes" />
					</div>
					<p><strong>{{ isTglOk ? "TGL erfüllt." : "TGL nicht erfüllt." }}</strong></p>
				</v-col>
			</v-row>

			<h3>6.5 Sichtbares Ergebnis</h3>
			<ul>
				<li>DIN benötigt in dieser Konstellation: <Katex :tex="`t_f=${fmtMath( tfDinMm, 0 )}\\,\\mathrm{mm}`" /></li>
				<li>TGL erlaubt: <Katex :tex="`t_f=${fmtMath( tfTglMm, 0 )}\\,\\mathrm{mm}`" /></li>
			</ul>
			<p>
				Der TGL-Träger ist damit rechnerisch schwächer: geringeres erforderliches
				<Katex tex="W" /> (hier etwa <Katex :tex="`${fmtMath( wReqReductionPercent, 1, true )}\\%`" /> weniger) und geringeres Eigengewicht
				(ca. <Katex :tex="`${fmtMath( qgDinKgM, 0 )}-${fmtMath( qgTglKgM, 0 )}\\approx ${fmtMath( weightDeltaKgM, 1, true )}\\,\\mathrm{kg/m}`" />).
			</p>
		</div>

		<h2 id="bewertung" class="mt-8">7) Abschließende Bewertung</h2>
		<div class="eddie">
			<h3>7.1 Warum der TGL-Gedanke plausibel wirkt</h3>
			<p>
				Eigengewicht ist oft besser bekannt (kleinere Streuung) als Verkehrslast.
				Daher ist ein kleinerer Zuschlag für <Katex tex="G" /> und ein größerer für
				<Katex tex="Q" /> aus probabilistischer Sicht nachvollziehbar.
			</p>

			<h3>7.2 Warum rechnerisch schwächere Bauteile herauskommen</h3>
			<div class="kbox">
				<Katex as="div" display tex="\Delta M_{Ed}=(\gamma_{\text{DIN}}-\gamma_G)\,\frac{q_g L^2}{8}" />
			</div>
			<p>
				Wenn <Katex tex="M_{Ed}" /> sinkt, sinkt auch <Katex tex="W_{\text{erf}}" />.
				Damit werden kleinere Profile bzw. dünnere Flansche zulässig. Wie im interaktiven Teil sichtbar, führt das gelegentlich zu einem leichteren Träger. Ingesamt ist der Unterschied aber moderat (hier ca. 10% weniger Eigengewicht).
			</p>

			<h3>7.3 Sicherheitsphilosophischer Haken</h3>
			<p>
				Schwächer bedeutet nicht automatisch unsicher, solange Last- und Widerstandsseite konsistent kalibriert sind.
				Wenn jedoch nur der Eigengewichtsfaktor reduziert wird und alles andere gleich bleibt,
				sinkt die rechnerische Reserve gegen nicht modellierte Effekte
				(z.B. Korrosion, Imperfektionen, Montagezustände, Zusatzlasten, Dynamik).
			</p>
			<p>
				Dazu passt auch die historische Entwicklung: Die DIN wurde später angepasst und rechnet heute
				ebenfalls mit getrennten Sicherheitsbeiwerten für ständige und veränderliche Einwirkungen.
			</p>
			<p class="muted">
				Der gleichfaktorige DIN-Weg wirkt oft grober, ist aber robust gegenüber Modelllücken.
				Der differenzierte TGL-Weg ist eleganter, setzt jedoch voraus, dass die Modellannahmen gut passen.
			</p>
		</div>
	</template>

	<template #interactivePart>
		<h2 id="interaktiv">Interaktive Systemdarstellung</h2>
		<div class="eddie">
			<p>
				Die Eingaben steuern die Lastannahmen und Sicherheitsbeiwerte.
				Die SVG-Skizze zeigt das statische System in üblicher TM-Darstellung für DIN- und TGL-Fall.
			</p>
		</div>

		<v-sheet border class="pa-4" rounded="lg">
			<v-row dense>
				<v-col cols="12" md="6">
					<h3 class="text-subtitle-1 mb-2">System und Lasten</h3>

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
					>
						Für DIN und TGL wird jeweils
						<Katex tex="t_f" /> aus dem Nachweis berechnet; daraus folgt
						das Eigengewicht <Katex tex="q_g" />.
					</v-alert>
				</v-col>

				<v-col cols="12" md="6">
					<h3 class="text-subtitle-1 mb-2">Querschnitt und Material</h3>
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
						<Katex as="div" display :tex="`t_{f,\\text{DIN}}=${fmtMath( tfDinMm, 0 )}\\,\\mathrm{mm}`" />
						<Katex as="div" display :tex="`t_{f,\\text{TGL}}=${fmtMath( tfTglMm, 0 )}\\,\\mathrm{mm}`" />
						<Katex as="div" display :tex="`q_{g,\\text{DIN}}=${fmtMath( qgDinKNm, 3, true )}\\,\\mathrm{kN/m}`" />
						<Katex as="div" display :tex="`q_{g,\\text{TGL}}=${fmtMath( qgTglKNm, 3, true )}\\,\\mathrm{kN/m}`" />
						<Katex as="div" display :tex="`\\Delta t_f=${fmtMath( tfStepMm, 0 )}\\,\\mathrm{mm}\\;\\text{(Rundung)}`" />
					</div>
				</v-col>
			</v-row>
		</v-sheet>

		<BD_Graph class="mt-4" v-bind="graphProps" />
	</template>
</AppFrame>
</template>

<script setup>
import {
	computed,
	reactive
} from "vue";

import titleImg from "@/images/BD.webp";
import BD_Graph from "./BD_Graph.vue";
import BS_Graph from "./BS_Graph.vue";

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
