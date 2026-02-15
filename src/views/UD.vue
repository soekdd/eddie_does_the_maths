<template>
<AppFrame
	short="UD"
	:sub-chapter="{
		'frage': 'Fragestellung',
		'formel': 'Formel',
		'winkel': 'Winkelargument',
		'finnland': 'Finnland'
	}"
	title="Eddie rechnet: Frühstückszettel #3 Uferaufdickung"
	warning
>

	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="`Eddie`">
				<img alt="Eddie und die Vasa" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h2 id="frage">Wie wahrscheinlich ist "maximal 100 m bis zum nächsten See"?</h2>
		<div class="eddie">
			<p>
				Wir wählen zufällig einen Punkt auf der Landfläche (ohne Seen).
				Gesucht ist die Wahrscheinlichkeit, dass der Punkt höchstens
				<Katex tex="h=100\ \mathrm{m}" /> vom nächsten Seeufer entfernt ist.
			</p>
			<p>
				Dazu vergleichen wir
				<Katex tex="A_{\text{Ufer}}(h)" /> mit der gesamten Landfläche
				<Katex tex="A_{\text{Land}}" />.
			</p>
		</div>

		<h2 id="formel" class="mt-8">Formel für die Uferfläche</h2>
		<UD_Graph/>
		<div class="eddie">
			<p>
				Bezeichne mit <Katex tex="d" /> die gesamte Uferlänge und mit <Katex tex="h" /> die Uferbreite.
				Für einen einzelnen See (eine geschlossene Uferlinie) gilt:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="A_{\text{Ufer}}(h)=h\cdot d+\pi h^2" />
			</div>
			<p>
				Der erste Term ist die Summe aller Kantenrechtecke:
				<Katex tex="\sum_i (h\ell_i)=h\sum_i \ell_i = h\,d" />.
			</p>
			<p>
				Der zweite Term ist die gesamte Eckkorrektur
				(konvexe Tortenstücke minus konkave Tortenstücke) und ergibt genau
				<Katex tex="\pi h^2" />.
			</p>
			<p>
				Bei <Katex tex="n" /> getrennten Seen addiert sich dieser Eckterm im additiven Modell zu
				<Katex tex="n\pi h^2" />:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="A_{\text{Ufer,add}}(h)=h\cdot d+n\pi h^2" />
			</div>
			<p class="muted">
				Die reale Uferfläche ist die Vereinigungsfläche aller Uferzonen und damit wegen Überlappung
				nie größer als diese additive Summe.
			</p>
		</div>

		<h2 id="winkel" class="mt-8">Warum konkav/konvex egal ist</h2>
		<div class="eddie">
			<p>
				Sei <Katex tex="\varphi_i" /> der signierte Außendrehwinkel an Ecke <Katex tex="i" />
				(konvex positiv, konkav negativ).
				Die Sektorfläche an dieser Ecke ist
				<Katex tex="\frac{h^2}{2}\varphi_i" />.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="A_{\text{Ecken}}=\frac{h^2}{2}\sum_i \varphi_i" />
				<Katex as="div" display tex="\sum_i \varphi_i = 2\pi \;\Longrightarrow\; A_{\text{Ecken}}=\pi h^2" />
			</div>
			<p>
				Für <Katex tex="n" /> getrennte Seen gilt entsprechend
				<Katex tex="\sum \varphi = 2\pi n" /> und damit im additiven Modell
				<Katex tex="A_{\text{Ecken,add}}=n\pi h^2" />.
			</p>
			<p class="muted">
				Darum bleibt die Formel unabhängig von der Polygonauflösung und auch bei konkaven Teilen gültig.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="P(\mathrm{Distanz}\le h)\approx \frac{A_{\text{Ufer}}(h)}{A_{\text{Land}}}" />
			</div>
		</div>

		<h2 class="mt-8">Zweistufige Betrachtung</h2>
		<div class="eddie">
			<h3>Stufe 1: Additive Näherung</h3>
			<p>
				Im ersten Schritt addieren wir alle lokalen Beiträge unabhängig voneinander:
				Rechteckanteile entlang der Ufer plus Eckanteile. Für viele getrennte Seen ergibt das
				eine einfache, gut interpretierbare Startformel.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="A_{\text{add}}(h)=h\cdot d+n\pi h^2" />
				<Katex as="div" display tex="P_1(h)\approx\frac{A_{\text{add}}(h)}{A_{\text{Land}}}" />
			</div>
			<p class="muted">
				Diese Stufe zählt Überlappungen mehrfach. Darum ist sie für kleine
				<Katex tex="h" /> oft brauchbar, kann für größere <Katex tex="h" />
				aber unplausibel werden.
			</p>

			<h3>Stufe 2: Minkowski-orientierte Korrektur</h3>
			<p>
				Mathematisch ist die gesuchte Uferfläche die Vereinigungsfläche einer Aufdickung
				aller Wasserflächen um den Radius <Katex tex="h" />, abzüglich der Wasserflächen selbst
				und auf Land begrenzt.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="A_{\text{wahr}}(h)=\left|\left((W\oplus B_h)\setminus W\right)\cap L\right|" />
				<Katex as="div" display tex="P(h)=\frac{A_{\text{wahr}}(h)}{A_{\text{Land}}}" />
			</div>
			<p>
				Wenn nur aggregierte Daten vorliegen (<Katex tex="n,d,A_{\text{Land}}" />), nutzen wir als
				pragmatische zweite Stufe eine Überlappungs-Korrektur:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="P_2(h)=1-\exp\!\left(-\frac{A_{\text{add}}(h)}{A_{\text{Land}}}\right)" />
				<Katex as="div" display tex="A_2(h)=A_{\text{Land}}\cdot P_2(h)" />
			</div>
			<p>
				Die Idee dahinter: Setze
				<Katex tex="\lambda(h)=\frac{A_{\text{add}}(h)}{A_{\text{Land}}}" />.
				Dann ist <Katex tex="\lambda" /> die additive mittlere Trefferzahl an einem zufälligen Landpunkt.
				Unter einer zufälligen Überdeckungsannahme ist die Nicht-Treffer-Wahrscheinlichkeit
				etwa <Katex tex="\exp(-\lambda)" />, also
				<Katex tex="P_2=1-\exp(-\lambda)" />.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="P_1(h)=\lambda(h)" />
				<Katex as="div" display tex="P_2(h)=K(\lambda)\,P_1(h)" />
				<Katex as="div" display tex="K(\lambda)=\frac{1-\exp(-\lambda)}{\lambda}\le 1" />
			</div>
			<p class="muted">
				Für kleine <Katex tex="\lambda" /> gilt
				<Katex tex="K(\lambda)=1-\frac{\lambda}{2}+O(\lambda^2)" />:
				Die Korrektur ist dann klein. Für große <Katex tex="\lambda" />
				sättigt <Katex tex="P_2" /> automatisch bei <Katex tex="1" />.
			</p>
			<p class="muted">
				Minkowski liefert die exakte Geometrie über die Vereinigungsfläche
				<Katex tex="(W\oplus B_h)" />. Unser Korrekturfaktor ist nicht selbst ein
				Minkowski-Satz, sondern eine Näherung für Überlappungen, wenn nur Summenwerte
				(<Katex tex="n,d,A_{\text{Land}}" />) und keine vollständigen Geometrien vorliegen.
			</p>
		</div>
	</template>

	<template #interactivePart>
		<h2 id="finnland">Beispiel: Finnlandkarte</h2>
		<div class="eddie">
			<p>
				Der Slider steuert <Katex tex="h" /> direkt die Uferflächen:
			</p>
		</div>
		<UD_Finland/>
	</template>

	<template #calculationPart>
		<h2>Berechnung für Finnland</h2>
		<div class="eddie">
			<p>
				Verwendete Distanzschwelle:
				<Katex :tex="`h=${hDistanceMeters}\\ \\mathrm{m}=${hDistanceKm}\\ \\mathrm{km}`" /> und
				Kontrollwert <Katex :tex="`h=${hStressKm}\\ \\mathrm{km}`" />.
			</p>
			<div id="werteFinnland" class="kbox">
				<Katex
					as="div"
					display
					:tex="texFinnlandLakesCount"
				/>
				<Katex
					as="div"
					display
					:tex="texFinnlandShoreline"
				/>
				<Katex
					as="div"
					display
					:tex="texFinnlandLandArea"
				/>
			</div>
			<h3>Stufe 1: Additive Näherung</h3>
			<div class="kbox">
				<Katex
					as="div"
					display
					tex="A_{\text{add}}(h)=h\cdot d+n\pi h^2"
				/>
				<Katex
					as="div"
					display
					:tex="texStage1Main"
				/>
				<Katex
					as="div"
					display
					:tex="texStage1ProbMain"
				/>
			</div>
			<div class="kbox">
				<Katex
					as="div"
					display
					:tex="texStage1Stress"
				/>
				<Katex
					as="div"
					display
					:tex="texStage1ProbStress"
				/>
			</div>
			<h3>Stufe 2: Überlappungskorrigierte Näherung</h3>
			<div class="kbox">
				<Katex
					as="div"
					display
					tex="P_2(h)=1-\exp\!\left(-\frac{A_{\text{add}}(h)}{A_{\text{Land}}}\right)"
				/>
				<Katex
					as="div"
					display
					tex="A_2(h)=A_{\text{Land}}\cdot P_2(h)"
				/>
				<Katex
					as="div"
					display
					:tex="texStage2Main"
				/>
				<Katex
					as="div"
					display
					:tex="texStage2Stress"
				/>
			</div>
		</div>
	</template>
</AppFrame>
</template>

<script setup>
import { computed } from "vue";
import titleImg from "@/images/UD.webp";
import UD_Graph from "./UD_Graph.vue";
import UD_Finland from "./UD_Finland.vue";

const COUNTRY_DATA = [
	{
		code:        "FI",
		name:        "Finnland",
		lakesCount:  187888,
		shorelineKm: 214896,
		landAreaKm2: 304000
	}
];

const ACTIVE_COUNTRY_CODE = "FI";
const hDistanceMeters = 100;
const hDistanceKm = hDistanceMeters / 1000;
const hStressKm = 1;

const activeCountry = computed( () =>
	COUNTRY_DATA.find( ( c ) => c.code === ACTIVE_COUNTRY_CODE ) ?? COUNTRY_DATA[ 0 ] );

const mainModel = computed( () => computeModelValues( hDistanceKm, activeCountry.value ) );
const stressModel = computed( () => computeModelValues( hStressKm, activeCountry.value ) );
const texFinnlandLakesCount = computed( () =>
	`n_{\\text{Seen}}=${fmtIntMath( activeCountry.value.lakesCount )}` );
const texFinnlandShoreline = computed( () =>
	`d_{\\text{Seen}}=${fmtIntMath( activeCountry.value.shorelineKm )}\\ \\mathrm{km}` );
const texFinnlandLandArea = computed( () =>
	`A_{\\text{Land}}=${fmtIntMath( activeCountry.value.landAreaKm2 )}\\ \\mathrm{km}^2` );

const texStage1Main = computed( () => [
	`A_{\\text{add}}(${mainModel.value.hKm})=${mainModel.value.hKm}\\cdot ${activeCountry.value.shorelineKm}`,
	`+${activeCountry.value.lakesCount}\\pi\\cdot ${mainModel.value.hKm}^2=`,
	`${fmtNum( mainModel.value.addAreaKm2, 3 )}\\ \\mathrm{km}^2`
].join( "" ) );

const texStage1ProbMain = computed( () => [
	`P_{1}\\approx\\frac{A_{\\text{add}}}{A_{\\text{Land}}}=\\frac{${fmtNum( mainModel.value.addAreaKm2, 3 )}}`,
	`{${activeCountry.value.landAreaKm2}}=${fmtNum( mainModel.value.addProbability, 6 )}\\approx `,
	`${fmtNum( mainModel.value.addProbabilityPercent, 2 )}\\%`
].join( "" ) );

const texStage1Stress = computed( () => [
	`A_{\\text{add}}(${stressModel.value.hKm})=${stressModel.value.hKm}\\cdot ${activeCountry.value.shorelineKm}`,
	`+${activeCountry.value.lakesCount}\\pi\\cdot ${stressModel.value.hKm}^2=`,
	`${fmtNum( stressModel.value.addAreaKm2, 3 )}\\ \\mathrm{km}^2`
].join( "" ) );

const texStage1ProbStress = computed( () => [
	`P_{1}(${stressModel.value.hKm})\\approx\\frac{${fmtNum( stressModel.value.addAreaKm2, 3 )}}`,
	`{${activeCountry.value.landAreaKm2}}=${fmtNum( stressModel.value.addProbability, 6 )}\\approx `,
	`${fmtNum( stressModel.value.addProbabilityPercent, 2 )}\\%`
].join( "" ) );

const texStage2Main = computed( () => [
	`P_{2}(${mainModel.value.hKm})=${fmtNum( mainModel.value.poissonProbability, 6 )}\\approx `,
	`${fmtNum( mainModel.value.poissonProbabilityPercent, 2 )}\\%,\\quad A_{2}=`,
	`${fmtNum( mainModel.value.poissonAreaKm2, 3 )}\\ \\mathrm{km}^2`
].join( "" ) );

const texStage2Stress = computed( () => [
	`P_{2}(${stressModel.value.hKm})=${fmtNum( stressModel.value.poissonProbability, 6 )}\\approx `,
	`${fmtNum( stressModel.value.poissonProbabilityPercent, 2 )}\\%,\\quad A_{2}=`,
	`${fmtNum( stressModel.value.poissonAreaKm2, 3 )}\\ \\mathrm{km}^2`
].join( "" ) );

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
	return Number( value ).toFixed( digits )
		.replace( ".", "," );
}
</script>
