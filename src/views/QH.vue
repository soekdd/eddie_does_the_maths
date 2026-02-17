<template>
<AppFrame
	:sub-chapter="{
		vorlesung: 'Stockholm 1985',
		quantisierung: 'Quantisierung',
		metrologie: 'Metrologie',
		interaktiv: 'Interaktiv',
		ohmfrage: 'Eddies Frage'
	}"
	title="Eddie rechnet: Der Quanten-Hall-Effekt"
>
	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="`Eddie und Klaus von Klitzing`">
				<img alt="Eddie und der Quanten-Hall-Effekt" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>

		<h2 id="vorlesung">Teil 1 - Stockholm, 9. Dezember 1985</h2>
		<div class="eddie">
			<p>
				Der Saal ist schon voll, als ich reinkomme: nasse Mäntel, Wolle, gedämpftes Murmeln.
				Ein Ordner hebt die Hand und schiebt mich nach hinten:
				<em>„Stehplätze dort, wenn Sie leise sind.“</em>
				Ich nicke, drücke mich an die Seitenwand und verbringe fast die ganze Veranstaltung auf Zehenspitzen.
			</p>
			<p>
				Vorn steht Klaus von Klitzing, mit Kreidestaub am Jackett, und schreibt:
				<Katex tex="R_{\mathrm K}=h/e^2" />.
				Er spricht ruhig, fast wie mein alter Physik-Lehrer. Ich höre vor allem ein Wort immer wieder:
				Stufen. Nicht „irgendein Verlauf“, sondern feste Stufen, die immer wiederkommen.
			</p>
			<p>
				Beim Frageteil bin ich mutig und strecke die Hand.
				<em>
					Wenn <Katex tex="R_{\mathrm K}" /> so universell ist, warum nehmen wir das nicht gleich als
					neuen Ohm-Standard?
				</em>
				Er lächelt und sagt sinngemäß: Physik kann schnell sein, Metrologie
				(also die Messwissenschaft, nicht verwechseln mit Meteorologie, der Wetterkunde) ist absichtlich langsam.
				Ein Standard muss in vielen Laboren gleich gut funktionieren, nicht nur in einem perfekten Experiment.
			</p>
		</div>

		<h2 id="quantisierung" class="mt-8">Teil 2 - Die Mathematik der Stufen</h2>
		<div class="eddie">
			<p>
				Wenn dich die Formel erschlägt: Das ist normal. Lies sie zuerst wie eine Legende zu einer Karte.
				Im starken Magnetfeld und bei tiefen Temperaturen gilt:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="R_{xy}=\frac{V_H}{I}=\frac{h}{\nu e^2}=\frac{R_{\mathrm K}}{\nu},\qquad \nu\in\mathbb{N}." />
			</div>
			<ul>
				<li><Katex tex="R_{xy}" />: Hall-Widerstand, also der quer gemessene Widerstand.</li>
				<li><Katex tex="V_H" />: Hall-Spannung (quer gemessene Spannung), <Katex tex="I" />: Strom.</li>
				<li><Katex tex="h" />: Planck-Konstante (Naturkonstante aus der Quantenphysik).</li>
				<li><Katex tex="e" />: Elementarladung, also die Ladung eines Elektrons.</li>
				<li><Katex tex="\nu" /> (gesprochen „nü“): Füllfaktor, meist eine ganze Zahl 1, 2, 3, ...</li>
				<li><Katex tex="R_{\mathrm K}=h/e^2" />: von-Klitzing-Konstante, ungefähr <Katex tex="25\,812.807\ \Omega" />.</li>
			</ul>
			<p>
				Die Kernaussage ist: <b>nicht jeder Wert ist erlaubt</b>. Stattdessen landen Messungen auf
				Plateaus bei <Katex tex="R_{\mathrm K}/\nu" />.
				Gleichzeitig wird die „Verlust-Komponente“ entlang des Stroms sehr klein:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="R_{xx}\approx 0." />
			</div>
			<p>
				Das Überraschende: kleine Unordnung im Material zerstört den Effekt nicht sofort,
				sondern hilft oft sogar, die Plateaus scharf zu machen.
			</p>

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

		<h2 id="metrologie" class="mt-8">Teil 3 - Nobelpreis und Ohm in der Metrologie</h2>
		<div class="eddie">
			<p>
				Klaus von Klitzing erhielt 1985 den Nobelpreis für Physik für die Entdeckung des
				Quanten-Hall-Effekts. Für die Messtechnik war das ein Wendepunkt:
				Widerstand ließ sich direkt an Naturkonstanten koppeln statt an ein einzelnes Referenzbauteil.
			</p>
			<p>
				Historisch nutzte man ab 1990 den konventionellen Wert
				<Katex tex="R_{\mathrm K\text{-}90}=25\,812.807\ \Omega" />.
				Seit der SI-Neudefinition (2019) sind <Katex tex="h" /> und <Katex tex="e" /> exakt festgelegt.
				Damit ist auch <Katex tex="R_{\mathrm K}=h/e^2" /> exakt bestimmt.
				Genau deshalb passt der Quanten-Hall-Effekt so gut zur Definition von Ohm.
			</p>
		</div>

		<h2 id="ohmfrage" class="mt-8">Teil 4 - Eddies Frage nach dem "kleinstmöglichen Widerstand"</h2>
		<div class="eddie">
			<p>
				Hier stehen zwei unabhängige Kernaussagen nebeneinander:
				<b>Kernaussage A (Standardbasis):</b> <Katex tex="R_{\mathrm K}" /> taugt als Referenz, weil er aus
				Naturkonstanten folgt.
				<b>Kernaussage B (Auswahlkriterium):</b> Ein Standard wird nicht nach "kleinstmöglich",
				sondern nach <b>universell und reproduzierbar</b> ausgewählt.
			</p>
			<ul>
				<li>
					Zu A: <Katex tex="R_{\mathrm K}" /> ist mit rund <Katex tex="25{,}8\ \mathrm{k\Omega}" /> nicht "klein" - und trotzdem ideal
					für Standards. Die Größe ist nicht das Kriterium.
				</li>
				<li>
					Zu A: Beim Quanten-Hall-Effekt ist die Standardstruktur
					<Katex tex="R_{xy}=R_{\mathrm K}/\nu" /> bzw.
					<Katex tex="\sigma_{xy}=\nu e^2/h" />. Man arbeitet mit stabilen Plateaus, nicht mit einer
					einzelnen "Minimal-Ohm"-Zahl.
				</li>
				<li>
					Zu B: <Katex tex="R_{xx}\approx 0" /> ist ein Qualitätszeichen für ein sauberes Plateau,
					aber nicht die Definition des Ohm-Standards selbst.
				</li>
			</ul>
			<p class="muted">
				Kurz: <b>Standardbasis</b> ist <Katex tex="R_{\mathrm K}" /> aus <Katex tex="h" /> und <Katex tex="e" />;
				<b>Auswahlkriterium</b> ist Reproduzierbarkeit der Plateaus, nicht "minimaler Widerstand".
			</p>
		</div>
	</template>

	<template #interactivePart>
		<h2 id="interaktiv">Interaktiv - Plateau-Check</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p>
				Wähle einen Füllfaktor <Katex tex="\nu" /> („nü“, also 1, 2, 3 ...), gib einen gemessenen Hall-Widerstand ein
				und vergleiche mit dem Sollwert <Katex tex="R_{\mathrm K}/\nu" />.
			</p>

			<v-card class="panel pa-4">
				<v-row dense>
					<v-col cols="12" md="6">
						<div class="text-subtitle-2 mb-1">Füllfaktor <Katex tex="\nu" /></div>
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
							label="Gemessenes Rxy [Ohm]"
							type="number"
						/>
					</v-col>
					<v-col cols="12" md="6">
						<v-text-field
							v-model.number="measuredRxxMilliOhm"
							hide-details="auto"
							label="Gemessenes Rxx [mOhm]"
							type="number"
						/>
					</v-col>
					<v-col class="d-flex align-end ga-2 flex-wrap" cols="12" md="6">
						<v-btn color="primary" variant="flat" @click="setIdealMeasurement">
							Ideal setzen
						</v-btn>
						<v-btn variant="tonal" @click="addMeasurementNoise">
							realistische<br>Abweichung
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
		<h2>Rechendetails</h2>
		<div class="eddie d-flex flex-column ga-3">
			<v-sheet border class="pa-3 rounded">
				<div class="kbox">
					<div class="mono">R_K = h/e^2 = {{ fmt( rk, 9 ) }} Ohm</div>
					<div class="mono">nu (Füllfaktor) = {{ nu }}</div>
					<div class="mono">Rxy,soll = R_K/nu = {{ fmt( targetRxy, 9 ) }} Ohm</div>
					<div class="mono">Rxy,gemessen = {{ fmt( measuredRxy, 9 ) }} Ohm</div>
					<div class="mono">Delta R = {{ fmt( deltaRxy, 9 ) }} Ohm</div>
					<div class="mono">relative Abweichung = {{ fmt( ppmError, 3 ) }} ppm</div>
					<div class="mono">Rxx = {{ fmt( measuredRxxMilliOhm, 3 ) }} mOhm</div>
					<div class="mono">sigma_xy = nu*e^2/h = {{ fmt( sigmaXY, 9 ) }} S</div>
				</div>
			</v-sheet>

			<v-sheet border class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">Interpretation</div>
				<ul class="mb-0">
					<li>Für Metrologie braucht man kleines
						<Katex tex="|R_{xy}-R_{\mathrm K}/\nu|" /> und zugleich <Katex tex="R_{xx}\approx 0" />.</li>
					<li>Großes <Katex tex="R_{xx}" /> heißt: kein sauberes Plateau, auch wenn <Katex tex="R_{xy}" /> zufällig nah am Soll liegt.</li>
					<li>Die Standardsprache ist daher: Plateau-Qualität + Reproduzierbarkeit, nicht "minimaler Widerstand".</li>
				</ul>
			</v-sheet>
		</div>
	</template>

	<template #footer>
	</template>
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";
import titleImg from "@/images/QH.webp";

const H_EXACT = 6.62607015e-34;
const E_EXACT = 1.602176634e-19;
const rk = H_EXACT / ( E_EXACT * E_EXACT );

const nu = ref( 2 );
const measuredRxy = ref( rk / nu.value );
const measuredRxxMilliOhm = ref( 0.08 );

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
			text: "Rxx ist deutlich größer als 0: Das sieht nicht wie ein sauberes Hall-Plateau aus."
		};
	}

	if ( absPpm < 0.1 ) {
		return {
			type: "success",
			text: "Sehr nah am Sollwert und kleines Rxx: metrologisch plausibles Plateau."
		};
	}

	if ( absPpm < 10 ) {
		return {
			type: "info",
			text: "In der Nähe eines Plateaus, aber noch sichtbar vom Sollwert entfernt."
		};
	}

	return {
		type: "warning",
		text: "Deutlich neben dem quantisierten Sollwert. Vermutlich kein stabiler Plateaupunkt."
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
