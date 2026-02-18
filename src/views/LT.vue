<template>
<AppFrame
	:sub-chapter="{
		streit:             'Eddie vs. Zarah',
		'warum-laplace':    'Warum Laplace?',
		vorgehen:           'Vorgehen',
		'beispielrechnung': 'Beispielrechnung',
		fazit:              'Fazit',
		interactivePart:'Laplace-Transformator'
	}"
	title="Eddie rechnet: Laplace-Transformation"
>

	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="`Eddie und Zarah lösen Differentialgleichungen`">
				<img alt="Eddie und Zarah lösen Differentialgleichungen" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3>Differentialgleichungen - Klassischer Lösungsweg vs. Laplace-Transformation</h3>

		<h2 id="streit" class="mt-8">1) Ein Streit mit Stil - Eddie vs. Zarah</h2>
		<div class="eddie">
			<blockquote class="storyQuote">
				<p><b>Ort:</b> WG-Küche in Stockholm, Winter 1986.</p>
				<p>Auf dem Tisch: Kaffee, kariertes Papier, ein Hund schnarcht unter dem Tisch.</p>
			</blockquote>

			<p>
				<b>Eddie:</b>
				„Also bitte. Eine lineare Differentialgleichung erster Ordnung löst man mit dem
				<b>klassischen Lösungsansatz im Zeitbereich</b>. Trennen, integrieren, fertig.“
			</p>

			<p>
				<b>Zarah:</b>
				„Zeitbereich ist was für Romantiker. Ich nehm’ die Laplace-Transformation. Einmal ins
				Frequenz- bzw. Bildbereich transformieren, algebraisch lösen, rücktransformieren - und gut.“
			</p>

			<p><b>Eddie:</b> „Du flüchtest doch nur vor dem Integrieren.“</p>
			<p>
				<b>Zarah:</b>
				„Nein. Ich ersetze Differentialgleichungen durch Algebra. Das ist wie aus einem Sumpf in eine
				gepflasterte Straße wechseln.“
			</p>
			<p><b>Eddie (grinsend):</b> „Feigling.“</p>
			<p><b>Zarah:</b> „Pragmatikerin.“</p>
		</div>

		<h2 id="warum-laplace" class="mt-8">2) Warum funktioniert Laplace in der Elektrotechnik (fast) immer?</h2>
		<div class="eddie">
			<p>
				In der Elektrotechnik treten fast ausschließlich
				<b>lineare Differentialgleichungen mit konstanten Koeffizienten</b>
				auf, z. B.:
			</p>

			<ul>
				<li>RC-Glieder</li>
				<li>RL-Glieder</li>
				<li>RLC-Schwingkreise</li>
				<li>Regelstrecken</li>
			</ul>

			<p>Solche Systeme sind:</p>
			<ol>
				<li>linear</li>
				<li>zeitinvariant</li>
				<li>durch Anfangswerte eindeutig bestimmt</li>
				<li>meist durch stückweise stetige Eingangssignale angeregt</li>
			</ol>

			<p>Die Laplace-Transformation besitzt die entscheidende Eigenschaft:</p>
			<div class="kbox">
				<Katex as="div" display tex="\mathcal{L}\{f'(t)\} = sF(s) - f(0)" />
			</div>

			<p>
				Damit wird aus einer Differentialgleichung eine
				<b>algebraische Gleichung im s-Bereich</b>.
			</p>

			<h3>Warum ist das so mächtig?</h3>
			<ul>
				<li>Ableitungen werden zu Multiplikationen mit <Katex tex="s" />.</li>
				<li>Anfangswerte erscheinen automatisch.</li>
				<li>Faltungen werden zu Multiplikationen.</li>
				<li>Übertragungsfunktionen entstehen direkt.</li>
				<li>Stabilität erkennt man an den Polen.</li>
			</ul>

			<h3>Wo liegen die Grenzen?</h3>
			<p>Laplace funktioniert besonders gut bei:</p>
			<ul>
				<li>linearen Systemen</li>
				<li>konstanten Koeffizienten</li>
				<li>Signalen exponentieller Ordnung</li>
			</ul>

			<p>Schwierigkeiten entstehen bei:</p>
			<ul>
				<li>nichtlinearen Systemen</li>
				<li>zeitvariablen Systemen</li>
				<li>chaotischen Dynamiken</li>
				<li>stark numerischen Simulationen großer Netzwerke</li>
			</ul>

			<p>Dort helfen meist nur numerische Verfahren.</p>
		</div>

		<h2 id="vorgehen" class="mt-8">3) Vorgehen bei der Laplace-Methode</h2>
		<div class="eddie">
			<p>Gegeben eine Anfangswertaufgabe:</p>
			<ol>
				<li>
					<b>Schritt 1: Transformieren</b><br>
					Differentialgleichung in den s-Bereich übertragen.
				</li>
				<li>
					<b>Schritt 2: Algebraisch lösen</b><br>
					Nach <Katex tex="Y(s)" /> auflösen.
				</li>
				<li>
					<b>Schritt 3: Partialbruchzerlegung</b><br>
					Falls nötig, zur Vorbereitung der Rücktransformation.
				</li>
				<li>
					<b>Schritt 4: Rücktransformation</b><br>
					Mit bekannten Transformationspaaren zurück in den Zeitbereich.
				</li>
			</ol>
		</div>

		<h2 id="beispielrechnung" class="mt-8">4) Beispielrechnung</h2>
		<div class="eddie">
			<p>Gegeben:</p>
			<div class="kbox">
				<Katex as="div" display tex="y'(t) + 2y(t) = 4" />
			</div>
			<p>mit</p>
			<div class="kbox">
				<Katex as="div" display tex="y(0) = 1" />
			</div>

			<div class="exampleSplit">
				<section class="methodCard">
					<h3>Lösung 1 - Klassischer Lösungsweg im Zeitbereich (Eddie)</h3>

					<h4>Homogene Gleichung</h4>
					<div class="kbox">
						<Katex as="div" display tex="y'_h + 2y_h = 0" />
						<Katex as="div" display tex="y_h = Ce^{-2t}" />
					</div>

					<h4>Partikuläre Lösung</h4>
					<p>Da rechte Seite konstant:</p>
					<div class="kbox">
						<Katex as="div" display tex="y_p = A" />
						<Katex as="div" display tex="2A = 4" />
						<Katex as="div" display tex="A = 2" />
					</div>

					<h4>Gesamtlösung</h4>
					<div class="kbox">
						<Katex as="div" display tex="y(t) = Ce^{-2t} + 2" />
						<Katex as="div" display tex="1 = C + 2" />
						<Katex as="div" display tex="C = -1" />
					</div>

					<h4>Endlösung</h4>
					<div class="kbox">
						<Katex as="div" display tex="\boxed{y(t) = 2 - e^{-2t}}" />
					</div>
				</section>

				<section class="methodCard">
					<h3>Lösung 2 - Laplace-Methode (Zarah)</h3>

					<p>Ausgangsgleichung:</p>
					<div class="kbox">
						<Katex as="div" display tex="y' + 2y = 4" />
					</div>

					<p>Laplace-Transformation:</p>
					<div class="kbox">
						<Katex as="div" display tex="sY(s) - y(0) + 2Y(s) = \frac{4}{s}" />
						<Katex as="div" display tex="sY(s) - 1 + 2Y(s) = \frac{4}{s}" />
						<Katex as="div" display tex="(s+2)Y(s) = \frac{4}{s} + 1" />
						<Katex as="div" display tex="Y(s) = \frac{4}{s(s+2)} + \frac{1}{s+2}" />
					</div>

					<h4>Partialbruchzerlegung</h4>
					<div class="kbox">
						<Katex as="div" display tex="\frac{4}{s(s+2)} = \frac{2}{s} - \frac{2}{s+2}" />
						<Katex as="div" display tex="Y(s) = \frac{2}{s} - \frac{1}{s+2}" />
					</div>

					<h4>Rücktransformation</h4>
					<div class="kbox">
						<Katex as="div" display tex="\boxed{y(t) = 2 - e^{-2t}}" />
					</div>
				</section>
			</div>
		</div>

		<h2 id="fazit" class="mt-8">Fazit</h2>
		<div class="eddie">
			<p>Beide Wege führen zur gleichen Lösung.</p>

			<div class="tableWrap">
				<table class="compareTable">
					<thead>
						<tr>
							<th>Eddie</th>
							<th>Zarah</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Intuitiv</td>
							<td>Systematisch</td>
						</tr>
						<tr>
							<td>Zeitbereich</td>
							<td>Bildbereich</td>
						</tr>
						<tr>
							<td>Gut für einzelne Gleichungen</td>
							<td>Ideal für Systeme</td>
						</tr>
						<tr>
							<td>Gefühl für Dynamik</td>
							<td>Ideal für Elektrotechnik</td>
						</tr>
					</tbody>
				</table>
			</div>

			<p><b>Eddie:</b> „Ich sehe die Lösung wachsen.“</p>
			<p><b>Zarah:</b> „Und ich sehe die Pole.“</p>
			<p>Beide lachen.</p>
		</div>
	</template>

	<template #interactivePart>

	</template>

	<template #summaryPart>
		<LT_Transform id="interactivePart"/>
	</template>

	<template #footer>
		<p class="muted">
			<a href="http://www-fourier.ujf-grenoble.fr/~parisse/giac.html">Thanks to Universität Joseph Fourier Grenoble for giac (GPLv3)</a>
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import titleImg from "@/images/LT.webp";
import LT_Transform from "./LT_Transform.vue";
</script>

<style scoped>
.storyQuote {
	border-left: 4px solid rgba(var(--v-theme-primary, 25, 118, 210), 0.9);
	background: rgba(var(--v-theme-primary, 25, 118, 210), 0.08);
	border-radius: 10px;
	padding: 10px 12px;
	margin: 0 0 14px;
}

.storyQuote p {
	margin: 0.3em 0;
}

.exampleSplit {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 12px;
	align-items: start;
}

.methodCard {
	background: rgba(var(--v-theme-surface, 255, 255, 255), 0.88);
	border: 1px solid rgba(var(--v-theme-on-surface, 17, 17, 17), 0.18);
	border-radius: 12px;
	padding: 12px;
}

.methodCard h3 {
	margin-top: 0;
}

.tableWrap {
	overflow-x: auto;
}

.compareTable {
	width: 100%;
	border-collapse: collapse;
	margin: 8px 0 12px;
}

.compareTable th,
.compareTable td {
	border: 1px solid rgba(var(--v-theme-on-surface, 17, 17, 17), 0.16);
	padding: 8px 10px;
	text-align: left;
}

.compareTable th {
	background: rgba(var(--v-theme-primary, 25, 118, 210), 0.12);
}

@media (max-width: 960px) {
	.exampleSplit {
		grid-template-columns: 1fr;
	}
}
</style>
