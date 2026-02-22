<template>
<AppFrame
	:sub-chapter="{
		einleitung:'Einleitung',
		'geometrie': 'Geometrie',
		'tangenten': 'Tangenten',
		'zyklisch': 'zyklisch',
		'kongruenz': 'Kongruenz'
	}"
	title="Eddie rechnet: IMO 1985 Aufgabe A1"
>

	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer title="Eddie denkt über die Aufgabe A1 der IMO 85 nach">
				<img loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">Joutsa, 4. Juli 1985</h3>
		<div class="eddie">
			<p>Der Raum riecht nach Papier, Holz und diesem dünnen Kaffee, den die Aufsicht heimlich schlürft.
				Ich sitze gerade, Stift bereit, und ich hab dieses freche Gefühl: <em>Heute rechne ich sie alle an die Wand.</em>
			</p><p>
				Auf dem Blatt wartet eine Zeichnung, die aussieht wie “harmloses Geometrie-Gekritzel”, bis man merkt, dass
				sie eine Falle ist. Es geht um ein Viereck, dessen Ecken auf einem Kreis liegen. Auf einer Seite sitzt der
				Mittelpunkt eines zweiten Kreises, und dieser Kreis streift die anderen drei Seiten nur ganz leicht, wie mit
				der Fingerspitze.</p><p>
				Die Aufgabe will, dass ich zeige: Bestimmte Streckenlängen an diesem Viereck hängen zwingend zusammen,
				als hätte die Figur eine versteckte Bilanz, die immer aufgeht.</p><p>
				Hier nehme ich dich an die Hand: Was man in der Zeichnung “sehen” muss – ohne Zaubertricks, nur sauber hinschauen.</p>
		</div>
	</template>

	<template #descriptionPart>
		<h2 id="geometrie">Aufgabenstellung</h2>
		<div class="eddie">
			<p>
				Ein Kreis hat seinen Mittelpunkt auf der Seite <Katex tex="AB" /> eines <b>zyklischen</b>
				Vierecks <Katex tex="ABCD" /> (also: <Katex tex="A,B,C,D" /> liegen auf einem gemeinsamen
				Umkreis). Die drei anderen Seiten <Katex tex="BC" />, <Katex tex="CD" /> und <Katex tex="DA" />
				sind Tangenten an diesen Kreis.
			</p>

			<p class="muted">Zu zeigen ist die simple Längenformel:</p>
			<div class="kbox">
				<Katex as="div" display tex="\boxed{AD + BC = AB}" />
			</div>

			<div class="exampleClear"></div>
		</div>

		<h2>Was man sich sofort feststellt:</h2>
		<div class="eddie">
			<p>
				Die Aufgabe wirkt wie Geometrie-Zauberei, ist aber eigentlich “Buchhaltung” mit Strecken:
			</p>
			<ul>
				<li><b>Tangenten</b> liefern Gleichheiten wie <Katex tex="DL=DM" /> und <Katex tex="CN=CM" />.</li>
				<li><b>Mittelpunkt auf</b> <Katex tex="AB" /> liefert Winkelhalbierenden-Ideen.</li>
				<li><b>Zyklisch</b> liefert <Katex tex="\angle DAB + \angle DCB = 180^\circ" />.</li>
			</ul>
			<p class="muted">
				Der Trick im Beweis ist, eine “fremde” Strecke per Kongruenz in eine “passende” Strecke zu
				verwandeln und dann <Katex tex="AB" /> als Summe zu zerlegen.
			</p>
		</div>
		<h2>Lösung</h2>
		<div class="eddie">
			<h3>0) Notation: Berührpunkte und Mittelpunkt</h3>
			<p>
				Der Tangentialkreis berührt
				<Katex tex="AD" /> in <Katex tex="L" />,
				<Katex tex="CD" /> in <Katex tex="M" />,
				<Katex tex="BC" /> in <Katex tex="N" />.
				Sein Mittelpunkt ist <Katex tex="O" /> und liegt auf <Katex tex="AB" />.
			</p>

			<p><b>Tangenten-Merksätze:</b></p>
			<ol>
				<li>
					Radius steht senkrecht auf Tangente:
					<Katex tex="OL\perp AD,\; OM\perp CD,\; ON\perp BC" />.
				</li>
				<li>
					Tangenten von einem Außenpunkt sind gleich lang:
					<Katex tex="DL=DM" /> und <Katex tex="CN=CM" />.
				</li>
			</ol>

			<h3>1) Der Trick: Punkt X auf der Verlängerung von AD</h3>
			<p>
				Nimm auf dem Strahl <Katex tex="AD" /> (jenseits von <Katex tex="D" />) einen Punkt
				<Katex tex="X" /> so, dass
				<Katex tex="AX=AO" />.
				Damit bauen wir gleich zwei rechtwinklige Dreiecke, die sich sauber vergleichen lassen.
			</p>

			<h3 id="tangenten">2) Winkelhalbierenden aus Tangenten: CO und DO</h3>
			<p class="muted">
				Weil der Kreis zwei Geraden tangiert, ist der Abstand des Mittelpunkts zu beiden Geraden gleich
				(nämlich der Radius). Damit liegt <Katex tex="O" /> auf der Winkelhalbierenden.
			</p>
			<div class="kbox">
				<Katex
					as="div"
					display
					tex="\angle OCM=\angle NCO,\quad \angle OCM=\frac{\angle DCB}{2}."
				/>
				<Katex
					as="div"
					display
					tex="\angle ODL=\angle MDC,\quad \angle ODL=\frac{\angle CDA}{2}."
				/>
			</div>

			<h3 id="zyklisch">3) Zyklisch: Gegenwinkel sind Supplementwinkel</h3>
			<div class="kbox">
				<Katex as="div" display tex="\angle DAB + \angle DCB = 180^\circ." />
				<Katex as="div" display tex="\frac{\angle DCB}{2}=90^\circ-\frac{\angle DAB}{2}." />
			</div>

			<h3 id="kongruenz">4) Kongruenz: Dreiecke O L X und O M C</h3>
			<p>Wir vergleichen die rechtwinkligen Dreiecke <Katex tex="\triangle OLX" /> und <Katex tex="\triangle OMC" />:</p>
			<ul>
				<li><Katex tex="\angle OLX = 90^\circ" /> (weil <Katex tex="OL\perp AD" /> und <Katex tex="X\in AD" />)</li>
				<li><Katex tex="\angle OMC = 90^\circ" /> (weil <Katex tex="OM\perp CD" /> und <Katex tex="C,M\in CD" />)</li>
				<li><Katex tex="OL=OM" /> (Radien)</li>
			</ul>

			<p class="muted">
				Der entscheidende Winkel-Transfer ist:
				<Katex tex="\angle OXL = \angle OCM" />.
				(Das kommt aus den Winkelhalbierenden + der Halbwinkelbeziehung aus dem zyklischen Viereck.)
			</p>

			<div class="kbox">
				<Katex as="div" display tex="\triangle OLX \cong \triangle OMC \;\Rightarrow\; LX=MC." />
			</div>

			<h3>5) Längen zerlegen: AO = AL + MC</h3>
			<p>
				Auf der Geraden <Katex tex="AD" /> gilt <Katex tex="AX = AL + LX" />.
				Aber <Katex tex="AX=AO" /> (Konstruktion) und <Katex tex="LX=MC" /> (Kongruenz), also:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="AO = AL + MC." />
			</div>

			<h3>6) Spiegelbildlich: OB = BN + MD</h3>
			<p>
				Analog auf der rechten Seite bekommt man:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="OB = BN + MD." />
			</div>

			<h3>7) Tangenten-Gleichheiten einsetzen</h3>
			<p>
				Wir benutzen die zwei Lego-Steine:
				<Katex tex="MC=CN" /> und <Katex tex="MD=DL" />.
			</p>

			<h3>8) Finale: AB auseinanderziehen</h3>
			<p>
				Weil <Katex tex="O" /> auf <Katex tex="AB" /> liegt, gilt <Katex tex="AB=AO+OB" />.
				Setze die Zerlegungen ein und ersetze per Tangenten-Gleichheit:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="AB=(AL+MC)+(BN+MD)=AL+CN+BN+DL." />
				<Katex as="div" display tex="AL+DL=AD,\quad CN+BN=BC." />
				<Katex as="div" display tex="\boxed{AB=AD+BC}." />
			</div>

			<h3>Mini-Eddie-Kommentar: Warum das so gut ist</h3>
			<p>
				Das ist IMO-Geometrie, aber vom Prinzip her ganz trocken:
			</p>
			<ul>
				<li>Tangenten geben dir harte Streckengleichheiten (<Katex tex="DL=DM" />, <Katex tex="CN=CM" />).</li>
				<li>Der Mittelpunkt als gleicher Abstand zu zwei Geraden gibt Winkelhalbierenden.</li>
				<li>Zyklisch gibt dir die saubere Winkelbeziehung.</li>
			</ul>
			<p class="muted">
				Danach ist es nur noch: eine Kongruenz bauen, zwei Summen schreiben, zwei Male ersetzen,
				fertig.
			</p>
		</div>
	</template>

	<template #interactivePart>
		<h2>Interaktiv</h2>
		<div class="eddie">
			<p class="muted">
				Klick auf <b>Neu zufällig</b>. Unten siehst du numerisch, dass <Katex tex="AB = (AD+BC)" />.
			</p>
		</div>
		<div class="toolbar">
			<v-btn class="btn mt-3" @click="regenerateGraph">Neu zufällig</v-btn>
			<div v-if="graphState?.ready" class="kbox px-5 mx-5">
				<div class="mono"><b>AB</b> = {{ fmt(graphState.lenAB) }}</div>
				<div class="mono"><b>AD</b> = {{ fmt(graphState.lenAD) }}</div>
				<div class="mono"><b>BC</b> = {{ fmt(graphState.lenBC) }}</div>
				<div class="mono"><b>AD + BC</b> = {{ fmt(graphState.lenAD + graphState.lenBC) }}</div>
			</div>
		</div>
		<image-zoomer :title="`IMO85/1`">
			<O1_Graph ref="graphRef" />
		</image-zoomer>
	</template>

	<template #footer>
		<p class="muted">
			Quelle der Aufgabenstellung/Lösungsskizze:
			<a href="https://prase.cz/kalva/imo/isoln/isoln851.html">IMO 1985 A1 (ISL solutions, prase.cz)</a>
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";

import O1_Graph from "./O1_Graph.vue";
import titleImg from "@/images/O1.webp";

const graphRef = ref( null );
const graphState = computed( () => graphRef.value?.state ?? null );

function regenerateGraph() {
	graphRef.value?.regenerate?.();
}

function fmt( n, digits = 3 ) {
	if ( !Number.isFinite( n ) ) {
		return "–";
	}

	return n.toFixed( digits );
}
</script>

<style scoped>
.toolbar {
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 10px;
}

.numbers {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 13px;
  line-height: 1.35;
}
</style>
