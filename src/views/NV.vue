<template>
<AppFrame
	:sub-chapter="{
		einleitung: 'Einleitung',
		lektionen: '9 Navigations-Lektionen',
		interaktiv: 'Interaktiv'
	}"
	title="Eddie rechnet: Navigation im Wald"
>
	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer title="Eddies Navigations-Cheat-Sheet">
				<img loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">Vaasaloppet, 24. Juli 1985</h3>
		<div class="eddie">
			<p>Regen im Gesicht, Matsch in den Knien, und mein Gehirn macht plötzlich wieder auf Streber:
				<em>Paces</em>, Winkel, Achsen. Eben noch heule ich wie ein kaputtes Kind in diesem Moor-Schachbrett
				aus Gräben, im nächsten Moment höre ich Papas Stimme: „Hundert Schritte, siebzig Meter.“ Ich beiße
				die Zähne zusammen, erkläre einen Graben zur <em>x-Achse</em> und tue so, als wäre ich nicht komplett
				verloren, sondern nur… vorübergehend umsortiert.</p>
			<p>Genau hier setze ich an: In <b>9 Lektionen</b> kläre ich auf, was Papa mir in der Dresdner Heide
				eingebläut hat – wie man sich im Wald wiederfindet, wenn Karte und Nerven gleichzeitig durchweichen.
				<em>Daneben ansetzen</em>, Markierungen, Wind als Kompass, Schrittmaß statt Panik.</p>
			<p>Und ganz unten gibt’s interaktive Rechenhilfen, damit du deine eigenen Paces und Wege testen
				kannst, ohne dabei im Graben zu landen. Hoffentlich.</p>
		</div>
	</template>

	<template #descriptionPart>
		<h2 id="lektionen" class="mt-8">9 Navigations-Lektionen</h2>
		<div class="eddie">
			<v-expansion-panels v-model="openLessonPanel" variant="accordion">
				<v-expansion-panel v-for="item in lessons" :key="item.id">
					<v-expansion-panel-title>{{ item.title }}</v-expansion-panel-title>
					<v-expansion-panel-text class="lessonBody">
						<p v-for="(paragraph, pIdx) in item.text" :key="`${item.id}-p-${pIdx}`">
							{{ paragraph }}
						</p>

						<div v-if="item.formulas.length" class="kbox mb-3">
							<Katex
								v-for="(formula, fIdx) in item.formulas"
								:key="`${item.id}-f-${fIdx}`"
								as="div"
								display
								:tex="formula"
							/>
						</div>

						<h4 class="lessonHeading">Schritte zum Selbstnachmachen</h4>
						<ol class="lessonSteps">
							<li v-for="(step, sIdx) in item.steps" :key="`${item.id}-s-${sIdx}`">
								{{ step }}
							</li>
						</ol>

						<h4 class="lessonHeading">Mini-Übung</h4>
						<ul class="lessonList">
							<li v-for="(task, tIdx) in item.practice" :key="`${item.id}-t-${tIdx}`">
								{{ task }}
							</li>
						</ul>

						<p v-if="item.note" class="muted mt-2">
							{{ item.note }}
						</p>
					</v-expansion-panel-text>
				</v-expansion-panel>
			</v-expansion-panels>

			<p class="muted mt-4">
				Hinweis: Die Faustregeln nutzen Nordhalbkugel-Annahmen. Bei Uhrentricks
				im Sommer ggf. eine Stunde korrigieren. Alle Werte sind Näherungen.
			</p>
		</div>
	</template>

	<template #interactivePart>
		<h2 id="interaktiv">Interaktive Navigationstools</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p>
				Wähle ein Werkzeug und probiere die jeweilige Methode direkt aus.
				Alle vier Module sind so gebaut, dass du den Rechenweg Schritt fuer Schritt nachvollziehen kannst.
			</p>
			<v-select
				v-model="interactiveMode"
				class="w-100"
				hide-details="auto"
				item-title="label"
				item-value="value"
				:items="interactiveModes"
				label="Interaktives Werkzeug"
			/>
			<component :is="activeInteractiveComponent" />
		</div>
	</template>
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";
import titleImg from "@/images/NV.webp";
import NV_Azimut from "./NV_Azimut.vue";
import NV_Bayes from "./NV_Bayes.vue";
import NV_Schnitt from "./NV_Schnitt.vue";
import NV_Zeit from "./NV_Zeit.vue";

const lessons = [
	{
		id:    1,
		title: "1. Orientierung (Himmelsrichtung)",
		text:  [
			"Wenn du ohne Kompass startest, solltest du immer mindestens zwei voneinander " +
			"unabhängige Verfahren kombinieren: Uhrentrick, Schattenstab und " +
			"Mittagshöhe ergänzen sich gut.",
			"Die Kernidee ist immer gleich: zuerst eine grobe Nord-Süd-Achse bauen, " +
			"dann mit einer zweiten Beobachtung kontrollieren. So vermeidest du, dass " +
			"ein einzelner Messfehler deinen ganzen Kurs kippt.",
			"Für den Alltag reicht eine Unsicherheit von etwa 10 bis 15 Grad oft aus, " +
			"solange du anschliessend mit Landmarken und Rückblicken nachkalibrierst."
		],
		formulas: [
			"\\text{Südachse}\\approx \\frac{1}{2}\\angle(\\text{Stundenzeiger},12)",
			"\\tan(h)=\\frac{L}{s}",
			"\\varphi\\approx 90^\\circ-h+\\delta"
		],
		steps: [
			"Uhrzeit und Sonnenstand notieren, Uhr waagerecht halten, Winkel " +
			"zwischen Stundenzeiger und 12 markieren, halbieren.",
			"Einen Stab senkrecht stellen, Schattenspitze markieren, nach 20 Minuten " +
			"zweite Markierung setzen: Verbindung ist West-Ost.",
			"Nord-Süd-Achse als Senkrechte zur West-Ost-Linie einzeichnen.",
			"Mit Mittagshöhe gegenprüfen: Stablänge L und Schattenlänge s messen, " +
			"h aus tan(h)=L/s berechnen.",
			"Erst dann den Marschkurs festlegen und nach 10 bis 15 Minuten erneut prüfen."
		],
		practice: [
			"Baue einen 1-m-Schattenstab und miss L und s zur gleichen Uhrzeit an drei Tagen.",
			"Vergleiche Uhrentrick-Achse und Schattenstab-Achse als Winkelabweichung.",
			"Dokumentiere, wie stark Wolken und unebener Boden die Messung verschieben."
		],
		note: "Im Sommerzeitbetrieb kann eine Stundenkorrektur nötig sein."
	},
	{
		id:    2,
		title: "2. Standortbestimmung (Schnittverfahren)",
		text:  [
			"Standortbestimmung wird robust, wenn du geometrische Informationen " +
			"kombinierst: Winkel (Peilungen), Distanzen (Schätzung oder Karte) " +
			"und Linienobjekte wie Wege oder Bachläufe.",
			"Ein einzelner Schnittpunkt wirkt exakt, ist es aber selten. In der Praxis " +
			"entsteht eher ein kleiner Fehlerbereich. Genau den solltest du bewusst " +
			"einzeichnen und nicht ignorieren.",
			"Je günstiger der Schnittwinkel zweier Peilungen, desto stabiler wird " +
			"die Rückrechnung auf den eigenen Standort."
		],
		formulas: [
			"\\mathbf{r}_A(t)=\\mathbf{A}+t\\begin{pmatrix}\\cos\\alpha_A\\\\\\sin\\alpha_A\\end{pmatrix}",
			"\\mathbf{r}_B(u)=\\mathbf{B}+u\\begin{pmatrix}\\cos\\alpha_B\\\\\\sin\\alpha_B\\end{pmatrix}",
			"(x-x_i)^2+(y-y_i)^2=d_i^2"
		],
		steps: [
			"Zwei deutlich getrennte Landmarken auf der Karte identifizieren und ihre " +
			"Koordinaten markieren.",
			"Von deinem Standort aus beide Landmarken peilen und Winkel zur Nordrichtung messen.",
			"In der Karte für jede Landmarke eine Rückwärtslinie eintragen; " +
			"der Schnitt gibt den primären Standort.",
			"Falls Distanzschätzung möglich ist: Kreis um Landmarke mit Radius d_i " +
			"einzeichnen und gegen den Peilschnitt plausibilisieren.",
			"Bei drei Messungen den kleinsten gemeinsamen Fehlerbereich als Standort nehmen."
		],
		practice: [
			"Führe einmal nur mit zwei Peilungen und einmal mit zwei Peilungen plus Distanz aus.",
			"Vergleiche die Fläche des Fehlerbereichs in beiden Fällen.",
			"Wiederhole bei schlechtem und bei gutem Schnittwinkel."
		],
		note: "Schnittwinkel zwischen 30 und 150 Grad sind für die Praxis stabil."
	},
	{
		id:    3,
		title: "3. Distanzen und Massstab",
		text:  [
			"Viele Navigationsfehler kommen nicht aus der Richtung, sondern aus " +
			"falsch geschätzten Distanzen. Darum zürst sauber vom Kartenmassstab " +
			"in reale Meter umrechnen.",
			"Schrittzählung (Pacing) funktioniert nur, wenn du deine eigene " +
			"Schrittlänge für verschiedene Geländetypen kalibriert hast.",
			"Bei Hangpassagen trennt man konseqünt in Schrägstrecke und " +
			"horizontale Projektion. Für die Karte zählt die Projektion."
		],
		formulas: [
			"d_{Natur}=d_{Karte}\\cdot M",
			"d_{pace}=N\\cdot p",
			"L_{hor}=L\\cos(\\theta)",
			"s=\\frac{\\Delta h}{\\Delta x}"
		],
		steps: [
			"Kartenstrecke mit Lineal oder Faden messen und mit Massstabszahl M multiplizieren.",
			"Eigene Doppelschrittlänge p auf 100 m Teststrecke bestimmen und notieren.",
			"Im Gelände N Doppelschritte zählen und Distanz mit d=N*p schätzen.",
			"Bei Hangneigung theta Schrägstrecke mit cos(theta) auf Horizontalstrecke korrigieren.",
			"Steigung aus Höhenlinien prüfen: delta h durch horizontale Distanz delta x teilen."
		],
		practice: [
			"Kalibriere p auf Weg, Waldpfad und weichem Untergrund separat.",
			"Vergleiche d_Karte und d_pace auf drei Teilstücken deiner Route.",
			"Finde die Strecke mit der grössten Abweichung und begründe den Fehler."
		],
		note: "Pacing driftet bei Müdigkeit und in dichtem Unterholz deutlich."
	},
	{
		id:    4,
		title: "4. Zeitabschätzungen",
		text:  [
			"Zeitplanung braucht ein Grundmodell plus Korrekturen. Naismith ist " +
			"ein robustes Startmodell, Tobler ist oft realistischer bei stärker " +
			"wechselnder Steigung.",
			"Das Entscheidende ist nicht die perfekte Gleichung, sondern dass du " +
			"regelmässig Ist-Zeit gegen Soll-Zeit vergleichst und früh nachsteuerst.",
			"Plane immer mit Segmenten: lieber drei kurze Etappen mit Checkpunkten " +
			"als ein grosser Block ohne Kontrolle."
		],
		formulas: [
			"t_{Naismith}[h]=\\frac{d_{km}}{5}+\\frac{h_{auf}}{600}",
			"v_{Tobler}=6\\,e^{-3.5\\lvert s+0.05\\rvert}",
			"t=\\frac{d}{v}"
		],
		steps: [
			"Route in Teilsegmente zerlegen: Distanz d_i und Aufstieg h_i pro Segment bestimmen.",
			"Für jedes Segment t_Naismith berechnen und als Sollwert notieren.",
			"Optional Tobler-Geschwindigkeit je Segmentsteigung s_i bestimmen.",
			"Nach jedem Segment reale Zeit messen und Differenz zu Sollwert dokumentieren.",
			"Bei wiederholter Verzogerung Kurs anpassen: kürzer, sicherer oder früherer Abbruch."
		],
		practice: [
			"Rechne dieselbe Route einmal mit Naismith und einmal mit Tobler durch.",
			"Vergleiche beide Prognosen mit deiner realen Gehzeit.",
			"Leite daraus einen persönlichen Korrekturfaktor für künftige Touren ab."
		],
		note: "Auf nassem Boden oder mit Gepäck steigen die Zeiten oft um 10 bis 30 Prozent."
	},
	{
		id:    5,
		title: "5. Kurs halten (Azimut)",
		text:  [
			"Ein sauber geplanter Azimut nützt nur, wenn du ihn unterwegs " +
			"stabil hältst. Kleine Winkelabweichungen wachsen über Distanz " +
			"schnell zu grossen seitlichen Fehlern.",
			"Deshalb arbeitest du mit Zwischenzielen: kurzer Leitstrahl, " +
			"dann neu ausrichten. Das ist genauer als einen langen Kurs " +
			"blind durchzuziehen.",
			"Rechne Karte, geographisch Nord und magnetisch Nord bewusst um, " +
			"statt dich auf Gefühl zu verlassen."
		],
		formulas: [
			"\\alpha_{mag}=\\alpha_{karte}-D",
			"e\\approx d\\sin(\\Delta\\alpha)",
			"\\Delta\\alpha_{corr}\\approx \\arctan\\!\\left(\\frac{e}{d_{rest}}\\right)"
		],
		steps: [
			"Azimut auf der Karte bestimmen und Deklination D für die Region nachschlagen.",
			"In magnetischen Kurs umrechnen und auf Kompass oder Ersatzverfahren einstellen.",
			"Auf 50 bis 100 m ein Zwischenziel auf dem Leitstrahl wählen und anlaufen.",
			"Nach jedem Teilstück seitliche Abweichung e abschätzen und gegebenenfalls korrigieren.",
			"Bei schlechter Sicht Distanzabschnitte verkürzen und häufiger neu ausrichten."
		],
		practice: [
			"Laufe denselben Azimut einmal in 300-m-Abschnitten und einmal in 80-m-Abschnitten.",
			"Miss die Endabweichung beider Varianten gegen einen Zielpunkt.",
			"Teste, wie stark 5 Grad Kursfehler auf 1 km seitlich auswirken."
		],
		note: "Bei Ostdeklination wird in dieser Konvention D subtrahiert."
	},
	{
		id:    6,
		title: "6. Wahrscheinlichkeiten und Fusion",
		text:  [
			"Im unklaren Gelände gibt es selten nur einen plausiblen Standort. " +
			"Statt sofort zu raten, bewertest du mehrere Hypothesen mit " +
			"Wahrscheinlichkeiten.",
			"Bayes hilft dir, neue Beobachtungen systematisch einzubauen. " +
			"Gewichtete Mittelung hilft dir, mehrere Messquellen mit " +
			"unterschiedlicher Genauigkeit zu kombinieren.",
			"Das Ziel ist nicht mathematische Perfektion, sondern ein " +
			"transparentes, wiederholbares Entscheidungsverfahren."
		],
		formulas: [
			"P(H_i\\mid E)=\\frac{P(E\\mid H_i)P(H_i)}{\\sum_j P(E\\mid H_j)P(H_j)}",
			"\\hat{x}=\\frac{\\sum_i w_i x_i}{\\sum_i w_i},\\quad w_i=\\frac{1}{\\sigma_i^2}",
			"\\sigma_{\\hat{x}}=\\frac{1}{\\sqrt{\\sum_i w_i}}"
		],
		steps: [
			"Mögliche Standorte H_i auf der Karte als Kandidatenmenge markieren.",
			"Prior P(H_i) vergeben, z. B. nach Route, Zeit und Geländelogik.",
			"Neue Beobachtung E erfassen, z. B. Bachrichtung oder Höhenband.",
			"Likelihood P(E|H_i) je Standort einschätzen und Posterior berechnen.",
			"Messwerte mit bekannter Streuung sigma_i über Gewichte 1/sigma_i^2 mitteln."
		],
		practice: [
			"Lege drei Standortkandidaten fest und führe zwei Bayes-Updates nacheinander aus.",
			"Vergleiche Ergebnis mit und ohne Gewichtung der Messqualität.",
			"Dokumentiere, wann eine Hypothese klar dominiert und wann nicht."
		],
		note: "Eine gute Struktur ist wichtiger als genaue Kommazahlen."
	},
	{
		id:    7,
		title: "7. Geländegeometrie",
		text:  [
			"Höhenlinien tragen mehr Information als nur Höhe: aus ihrer Form " +
			"liest du Steilheit, Rücken, Rinnen und bevorzugte Bewegungsachsen.",
			"Die Falllinie steht immer orthogonal zu den Konturlinien. Damit kannst " +
			"du Hangrichtung und Querungsrisiko direkt aus der Karte abschätzen.",
			"Für Fernsicht und Landmarkenplanung hilft ein einfacher Horizontansatz " +
			"mit Beobachterhöhen."
		],
		formulas: [
			"\\lVert\\nabla z\\rVert\\approx \\frac{\\Delta h}{\\Delta n}",
			"\\beta=\\operatorname{atan2}\\!\\left(-\\frac{\\partial z}{\\partial x}," +
			"-\\frac{\\partial z}{\\partial y}\\right)",
			"d_{sicht}[km]\\approx 3.57\\left(\\sqrt{h_1}+\\sqrt{h_2}\\right)"
		],
		steps: [
			"Karte auf den aktuellen Standort ausrichten und Konturabstände vergleichen.",
			"Eng stehende Linien als steile Bereiche markieren, breite Abstände als flacheres Gelände.",
			"Fallrichtung als Senkrechte zur Kontur einzeichnen und mit realem Hangbild abgleichen.",
			"Sichtweite für Landmarken mit Beobachterhöhen h1 und h2 abschätzen.",
			"Route so legen, dass kritische Querungen und Sackgänge früh erkennbar sind."
		],
		practice: [
			"Nimm ein Hanggebiet und markiere drei mögliche Auf- und Abstiegslinien.",
			"Begrunde für jede Linie Steilheit, Sicht und Sicherheitsreserve.",
			"Prüfe vor Ort, ob die Kartendeutung mit dem Geländeeindruck passt."
		],
		note: "Vegetation und Mikrogelände können die reine Konturinterpretation überlagern."
	},
	{
		id:    8,
		title: "8. Routenwahl (Optimierung)",
		text:  [
			"Routenwahl ist ein Optimierungsproblem: kürzeste Distanz ist nicht " +
			"automatisch schnellste oder sicherste Route.",
			"Im Wegenetz minimierst du typischerweise Zeitkosten. Im freien Gelände " +
			"setzt du eine kombinierte Kostenfunktion aus Distanz, Höhenarbeit und Risiko an.",
			"Wichtig ist, dass deine Kriterien vor dem Start feststehen, sonst optimierst " +
			"du unterwegs dauernd gegen wechselnde Bauchgefühle."
		],
		formulas: [
			"C(\\pi)=\\sum_{e\\in\\pi} t_e",
			"f(n)=g(n)+h(n)\\quad (\\text{A*})",
			"C=w_d\\,d+w_h\\,\\Delta h+w_r\\,R"
		],
		steps: [
			"Route als Graph modellieren: Knoten (Entscheidungspunkte), Kanten (Segmente).",
			"Jeder Kante Zeit oder Kosten zuordnen, nicht nur Distanz.",
			"Mit Dijkstra oder A* einen primären Kandidatenweg berechnen.",
			"Alternative Routen mit gleicher Methodik auswerten und Kosten vergleichen.",
			"Vor dem Start eine Abbruch- oder Umplanungsgrenze definieren."
		],
		practice: [
			"Berechne für dieselbe Strecke eine schnelle und eine risikoarme Variante.",
			"Variiere Gewichte w_d, w_h, w_r und beobachte den Routensprung.",
			"Leite daraus ein persönliches Gewichteset für verschiedene Wetterlagen ab."
		],
		note: "Modelle helfen nur, wenn die Eingangsdaten regelmässig aktualisiert werden."
	},
	{
		id:    9,
		title: "9. Plausibilitätschecks und Fehler",
		text:  [
			"Navigation bleibt fehlerbehaftet. Entscheidend ist, Fehler " +
			"früh zu erkennen, quantitativ einzugrenzen und dann konsequent " +
			"zu korrigieren.",
			"Statt auf den einen vermeintlich exakten Punkt zu starren, " +
			"arbeitest du mit Fehlerkorridoren und Plausibilitätsregeln.",
			"Rückbilanz (out-and-back) ist ein starker Realitätscheck: " +
			"wenn die Zahlen nicht zusammenpassen, stimmt etwas nicht."
		],
		formulas: [
			"\\gamma=\\lvert\\alpha_1-\\alpha_2\\rvert",
			"\\sigma_{\\perp}\\approx d\\,\\sigma_{\\alpha}\\quad (\\sigma_{\\alpha}\\,\\text{in rad})",
			"\\sigma_{ges}=\\sqrt{\\sigma_d^2+(d\\,\\sigma_{\\alpha})^2}",
			"e_{close}=\\lVert\\mathbf{x}_{retour}-\\mathbf{x}_{start}\\rVert"
		],
		steps: [
			"Bei jedem Standort-Update Schnittwinkel gamma prüfen und ungünstige Geometrie markieren.",
			"Winkel- und Distanzunsicherheiten in einen gemeinsamen Fehlerkorridor überführen.",
			"Nach jedem Segment Soll-Ist-Vergleich für Richtung, Distanz und Zeit machen.",
			"Wenn drei Plausibilitätskriterien gleichzeitig reissen: sofort stoppen und neu aufsetzen.",
			"Rückweg oder Schleifenabschluss mit closure error e_close dokumentieren."
		],
		practice: [
			"Nimm ein altes Tracklog und berechne nachträglich den closure error.",
			"Simuliere den Effekt von +3 Grad und +8 Grad Winkelrauschen.",
			"Definiere für dich persönliche Alarmgrenzen für Umkehr oder Neuplanung."
		],
		note: "Plausibilitätschecks sparen oft mehr Zeit als hektisches Weiterlaufen."
	}
];

const interactiveModes = [
	{
		label: "Schnittverfahren",
		value: "schnitt"
	},
	{
		label: "Azimut",
		value: "azimut"
	},
	{
		label: "Zeitabschätzung",
		value: "zeit"
	},
	{
		label: "Bayes und Fusion",
		value: "bayes"
	}
];

const interactiveMode = ref( "schnitt" );
const openLessonPanel = ref( 0 );

const interactiveComponentMap = {
	schnitt: NV_Schnitt,
	azimut:  NV_Azimut,
	zeit:    NV_Zeit,
	bayes:   NV_Bayes
};

const activeInteractiveComponent = computed( () => {
	return interactiveComponentMap[ interactiveMode.value ] ?? NV_Schnitt;
} );
</script>

<style scoped>
.lessonBody {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.lessonHeading {
	margin: 4px 0 0;
	font-size: 0.95rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.02em;
}

.lessonSteps {
	margin: 0;
	padding-left: 1.15rem;
}

.lessonList {
	margin: 0;
	padding-left: 1.15rem;
}
</style>
