<template>
<AppFrame
	:sub-chapter="{
		
	}"
	title="Eddie rechnet: Landkarten Geometrie"
>

	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer title="Eddie">
				<img loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">Dresden, 9. September 1984</h3>
		<div class="eddie">
			<p>Karten lügen nicht, sie sagen nur nie alles.
				Papas Stimme kommt mir wieder in den Sinn: <em>„Wenn du etwas nicht zeigen darfst, ändere nicht den Inhalt, sondern die Form</em></p>
			<p> Holomorphe Abbildungen sind genau das. Keine Tarnkappe, kein Radiergummi. Eher ein Übersetzer.</p>
			<p>Eine solche Abbildung verbiegt die Welt, ohne sie zu zerbrechen. Winkel bleiben Winkel. Richtungen
				bleiben lesbar. Nur das Drumherum rutscht an andere Stellen. Für jemanden, der nur hinschaut, sieht
				das Ergebnis abstrakt aus: Kurven, Netze, Zahlen. Für jemanden, der versteht, bleibt die Geometrie
				vollständig erhalten.</p>
			<p>Das ist ihr Wesen:</p>
			<p>Nichts verschwindet.<br>Aber nur wer den Schlüssel kennt, weiß, <b>wo</b> es ist.</p>
			<p>Und manchmal ist das genug.</p>
		</div>
	</template>

	<template #descriptionPart>
		<h2 id="beschreibung">In 4 Schritten zur versteckten Karte</h2>
		<div class="eddie d-flex flex-column ga-6">
			<section>
				<figure class="exampleFigure">
					<ImageZoomer no-zoom title="Schritt 1: Grundkarte">
						<FINetwork
							v-model="selectedMap"
							:grid="false"
							label="name"
							:label-size="20"
							transform="none"
						/>
					</ImageZoomer>
				</figure>
				<h3>Schritt 1: Maßstabgerechte Grunddarstellung</h3>
				<p>
					Wir starten mit einer normalen, maßstabgerechten Netzwerk-Karte: Städte als Knotenpunkte,
					Verbindungen als Linien. Entscheidend ist der Linienstil, denn er codiert schon hier die Art der
					Verbindung:
				</p>
				<ul>
					<li><b>Dicke Linie</b>: Straße und Bahn existieren parallel</li>
					<li><b>Dünne Linie</b>: nur Straße</li>
					<li><b>Gestrichelte Linie</b>: nur Bahn</li>
				</ul>
				<p>
					Im Code wird das aus zwei Kantenmengen (<code>roads</code>, <code>rails</code>) zu einer gemeinsamen
					Kante zusammengeführt. Je nachdem, ob beide oder nur eine vorhanden ist, bekommt die Kante eine andere
					CSS-Klasse.
				</p>
			</section>

			<section>
				<figure class="exampleFigure">
					<ImageZoomer no-zoom title="Schritt 2: Abkürzungscode">
						<FINetwork
							v-model="selectedMap"
							:grid="false"
							label="abbr"
							:label-size="30"
							transform="none"
						/>
					</ImageZoomer>
				</figure>
				<h3>Schritt 2: Namen durch festen Code ersetzen</h3>
				<p>
					Als Nächstes entfernen wir Klartext-Namen und nutzen stattdessen einen zweibuchstabigen Code pro
					Stadt. Der Code ist nicht zufällig, sondern folgt einer festen, nachvollziehbaren Regel. Bei
					Kollisionen gilt Priorität nach Größe: größere Städte dürfen ihre naheliegenden Anfangsbuchstaben
					eher behalten als kleinere, ähnlich der Logik von Kfz-Kennzeichen.
				</p>
				<p>
					Das reduziert sofort die Lesbarkeit für Außenstehende, bleibt aber für Eingeweihte reproduzierbar und
					prüfbar.
				</p>
			</section>

			<section>
				<figure class="exampleFigure">
					<ImageZoomer no-zoom title="Schritt 3: Holomorph verzerrte Karte">
						<FINetwork
							v-model="selectedMap"
							:grid="true"
							label="abbr"
							:label-size="30"
							transform="expScaled"
						/>
					</ImageZoomer>
				</figure>
				<h3>Schritt 3: Holomorphe Transformation</h3>
				<p>
					Jetzt kommt der eigentliche geometrische Schlüssel: Wir transformieren alle Knoten in der komplexen
					Ebene durch eine holomorphe Abbildung. Der große Vorteil: lokal bleiben Winkel erhalten
					(Konformität), also bleiben Richtungsbeziehungen interpretierbar, obwohl das Gesamtbild visuell stark
					verändert wird.
				</p>
				<p>
					Praktisch läuft das in vier klaren Schritten: (1) Geokoordinaten in eine komplexe Ebene normieren,
					(2) Abbildung <code>f(z)</code> wählen, z. B. <code>expScaled</code> oder <code>weierstrass</code>,
					(3) alle Knoten durch <code>f(z)</code> schicken, (4) die transformierten Punkte wieder ins SVG
					projizieren und die Edges als gerade Linien neu einzeichnen.
				</p>
				<p>
					Das Ergebnis ist eine Karte, die für Unbeteiligte fremd wirkt, intern aber weiter rechnerisch
					konsistent bleibt. Mit eingeblendetem Koordinatensystem kann man die Transformation zusätzlich
					analytisch nachvollziehen.
				</p>
				<div class="kbox mb-3">
					<Katex
						as="div"
						display
						tex="z = x + i y,\quad w = f(z)"
					/>
					<Katex
						as="div"
						display
						tex="f'(z_0)\neq 0 \;\Rightarrow\; f(z_0+\Delta z)\approx f(z_0)+f'(z_0)\,\Delta z"
					/>
					<Katex
						as="div"
						display
						tex="\arg(\Delta w)\approx \arg\!\left(f'(z_0)\right)+\arg(\Delta z)"
					/>
					<Katex
						as="div"
						display
						tex="z_k=\operatorname{norm}(\mathrm{lat}_k,\mathrm{lon}_k),\quad w_k=f(z_k),\quad p_k=\operatorname{svg}(w_k)"
					/>
					<Katex
						as="div"
						display
						tex="\text{Beispiel:}\quad f(z)=\exp(0.85\,z)"
					/>
				</div>
			</section>
			<section>
				<figure class="exampleFigure">
					<ImageZoomer no-zoom title="Schritt 3: Holomorph verzerrte Karte">
						<FINetwork
							v-model="selectedMap"
							distraction
							:grid="true"
							label="abbr"
							:label-size="30"
							transform="expScaled"
						/>
					</ImageZoomer>
				</figure>
				<h3>Schritt 4: Ablenkung</h3>
				<p>Nun schadet es nicht, noch ein wenig für Ablenkung zu sorgen. Ein paar Dreiecke ausfüllen,
					einen Kreis durch die 3 größten Städte konstruieren und ein paar (fast) rechte Winkel einzeichnen.</p>
				<p><b>Und verschwunden ist die Karte und fertig ist die Geometrieaufgabe.</b></p>
			</section>
		</div>
	</template>

	<template #interactivePart>

	</template>

	<template #summaryPart>
		<section>
			<h3>Zum selbst ausprobieren:</h3>
			<div class="wrap">
				<FINetwork
					v-model="selectedMap"
					interactive-mode
					:label-size="30"
				/>
			</div>
		</section>
		<section>
			<h3>Was für Vektorgrafiken funktioniert, klappt auch für normale Karten</h3>
			<FIMap/>
		</section>
	</template>

	<template #footer>
     
	</template>
</AppFrame>
</template>

<script setup>
import { ref } from "vue";
import titleImg from "@/images/FI.webp";
import FINetwork from "./FI_Network.vue";
import FIMap from "./FI_Map.vue";

const selectedMap = ref( "FI" );
</script>

<style scoped>
.wrap {
  --fi-surface: rgb(var(--v-theme-surface, 255, 255, 255));
  --fi-on-surface: rgb(var(--v-theme-on-surface, 17, 17, 17));
  --fi-outline: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.16);
  --fi-outline-strong: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.26);
  --fi-muted: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.75);
  --fi-primary: rgb(var(--v-theme-primary, 25, 118, 210));
  --fi-on-primary: rgb(var(--v-theme-on-primary, 255, 255, 255));
  --fi-panel: rgba(var(--v-theme-surface, 255, 255, 255), 0.86);
  --fi-canvas: rgba(var(--v-theme-surface, 255, 255, 255), 0.97);

  display: grid;
  gap: 12px;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  color: var(--fi-on-surface);
}
</style>
