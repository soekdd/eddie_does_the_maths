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
		<h2 id="geometrie">IMO 1985 - Aufgabe A1 (Eddie rechnet)</h2>
		<div class="eddie">
			<h3>Teil 1 - Aufgabenstellung</h3>
			<p>
				Wir haben ein <b>zyklisches Viereck</b> <Katex tex="ABCD" />. Das bedeutet:
				Die Punkte <Katex tex="A,B,C,D" /> liegen auf einem gemeinsamen Kreis (Umkreis).
			</p>
			<p>
				Auf der Seite <Katex tex="AB" /> liegt ein Punkt <Katex tex="O" />.
				Um <Katex tex="O" /> liegt ein Kreis (der "Innenkreis"), der die drei Seiten
				<Katex tex="BC,\quad CD,\quad DA" /> berührt
				(also an jeder dieser Geraden tangential ist).
			</p>
			<p>Zu zeigen ist die Längenformel</p>
			<div class="kbox">
				<Katex as="div" display tex="\boxed{AD + BC = AB.}" />
			</div>
		</div>

		<h2>Teil 2 - Bild im Kopf und Notation</h2>
		<div class="eddie">
			<p>Der Innenkreis berührt</p>
			<ul>
				<li>die Seite <Katex tex="AD" /> im Punkt <Katex tex="L" />,</li>
				<li>die Seite <Katex tex="CD" /> im Punkt <Katex tex="M" />,</li>
				<li>die Seite <Katex tex="BC" /> im Punkt <Katex tex="N" />.</li>
			</ul>
			<p>
				Sein Mittelpunkt ist <Katex tex="O" /> und liegt auf <Katex tex="AB" />.
			</p>
			<p class="muted">
				Man kann sich das so vorstellen: Der Innenkreis "klemmt" zwischen den drei Seiten
				<Katex tex="AD,CD,BC" />, und sein Mittelpunkt landet genau auf <Katex tex="AB" />.
			</p>
		</div>

		<h2 id="tangenten">Teil 3 - Drei Merksätze (die wir ständig benutzen)</h2>
		<div class="eddie">
			<h3>(1) Radius steht senkrecht auf Tangente</h3>
			<p>Wenn eine Gerade eine Kreis-Tangente ist, dann steht der Radius im Berührpunkt senkrecht darauf:</p>
			<div class="kbox">
				<Katex as="div" display tex="OL\perp AD,\quad OM\perp CD,\quad ON\perp BC." />
			</div>

			<h3 class="mt-6">(2) Tangenten von einem Punkt sind gleich lang</h3>
			<p>
				Von einem gemeinsamen Außenpunkt sind die beiden Tangenten an denselben Kreis gleich lang:
			</p>
			<ul>
				<li>
					Von <Katex tex="C" /> aus gehen die Tangenten über <Katex tex="BC" /> (Berührpunkt <Katex tex="N" />)
					und <Katex tex="CD" /> (Berührpunkt <Katex tex="M" />): <Katex tex="CN=CM" />.
				</li>
				<li>
					Von <Katex tex="D" /> aus gehen die Tangenten über <Katex tex="DA" /> (Berührpunkt <Katex tex="L" />)
					und <Katex tex="DC" /> (Berührpunkt <Katex tex="M" />): <Katex tex="DL=DM \Rightarrow MD=DL" />.
				</li>
			</ul>

			<h3 class="mt-6">(3) Zyklisch heißt: Gegenwinkel ergänzen sich zu <Katex tex="180^\circ" /></h3>
			<div class="kbox">
				<Katex as="div" display tex="\angle DAB+\angle DCB=180^\circ,\qquad \angle ABC+\angle ADC=180^\circ." />
			</div>
		</div>

		<h2>Teil 4 - Der Plan (Buchhaltung mit Strecken)</h2>
		<div class="eddie">
			<p>Wir wollen am Ende <Katex tex="AB" /> zerlegen:</p>
			<div class="kbox">
				<Katex as="div" display tex="AB=AO+OB." />
			</div>
			<p>
				Wenn wir zeigen können
				<Katex tex="AO=AL+MC" /> und <Katex tex="OB=BN+MD" />,
				dann folgt sofort
			</p>
			<div class="kbox">
				<Katex as="div" display tex="AB=(AL+MC)+(BN+MD)=AL+BN+MC+MD." />
			</div>
			<p>Und dann ersetzen wir mit Tangenten-Gleichheiten:</p>
			<div class="kbox">
				<Katex as="div" display tex="MC=CN,\quad MD=DL," />
				<Katex as="div" display tex="AL+DL=AD,\quad BN+CN=BC." />
			</div>
			<p>Dann steht automatisch da:</p>
			<div class="kbox">
				<Katex as="div" display tex="AB=AD+BC." />
			</div>
			<p>Es bleibt also nur noch, die beiden Zerlegungen von <Katex tex="AO" /> und <Katex tex="OB" /> zu beweisen.</p>
		</div>

		<h2 id="zyklisch">Teil 5 - Zerlegung von <Katex tex="AO" />: Wir bauen ein passendes rechtwinkliges Dreieck</h2>
		<div class="eddie">
			<h3>Schritt 5.1 - Punkt <Katex tex="X" /> konstruieren</h3>
			<p>
				Wir wählen auf der Geraden <Katex tex="AD" /> hinter <Katex tex="D" /> einen Punkt <Katex tex="X" /> so, dass
				<Katex tex="AX=AO" />. Dann ist <Katex tex="\triangle AOX" /> gleichschenklig mit <Katex tex="AO=AX" />.
			</p>

			<h3 class="mt-6">Schritt 5.2 - Ein Winkel aus dem gleichschenkligen Dreieck</h3>
			<p>
				Im Dreieck <Katex tex="AOX" /> ist der Winkel bei <Katex tex="A" />:
				<Katex tex="\angle XAO = \angle DAO = \angle DAB" />
				(weil <Katex tex="X" /> auf der Geraden <Katex tex="AD" /> liegt und <Katex tex="O" /> auf <Katex tex="AB" />).
			</p>
			<p>
				Da <Katex tex="\triangle AOX" /> gleichschenklig ist, sind die Basiswinkel bei <Katex tex="O" /> und <Katex tex="X" /> gleich:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\angle OXA = \angle AOX = \frac{180^\circ-\angle DAB}{2}=90^\circ-\frac{\angle DAB}{2}." />
			</div>
			<p>
				Wichtig: <Katex tex="A,L,D,X" /> liegen auf einer Geraden, also ist <Katex tex="\angle OXL=\angle OXA" />.
			</p>

			<h3 class="mt-6">Schritt 5.3 - Ein Winkel aus dem zyklischen Viereck und der Winkelhalbierenden</h3>
			<p>
				Weil der Innenkreis die Geraden <Katex tex="BC" /> und <Katex tex="CD" /> berührt, hat der Mittelpunkt
				<Katex tex="O" /> zu beiden Geraden denselben Abstand (nämlich den Radius). Deshalb liegt <Katex tex="O" />
				auf der Winkelhalbierenden bei <Katex tex="C" />. Also halbiert <Katex tex="CO" /> den Winkel
				<Katex tex="\angle DCB" />, und damit gilt:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\angle OCM=\frac{\angle DCB}{2}" />
			</div>
			<p>(denn <Katex tex="CM" /> liegt auf <Katex tex="CD" />)</p>
			<p>Aus der Zyklik (Merksatz (3)) folgt:</p>
			<div class="kbox">
				<Katex as="div" display tex="\angle DCB = 180^\circ-\angle DAB \Rightarrow \frac{\angle DCB}{2}=90^\circ-\frac{\angle DAB}{2}." />
			</div>
			<p>
				Also haben wir
				<Katex tex="\angle OCM = 90^\circ-\frac{\angle DAB}{2} = \angle OXL" />.
			</p>

			<h3 class="mt-6">Schritt 5.4 - Kongruenz zweier rechtwinkliger Dreiecke</h3>
			<p>Betrachte die Dreiecke <Katex tex="\triangle OLX" /> und <Katex tex="\triangle OMC" />.</p>
			<ul>
				<li><Katex tex="\angle OLX=90^\circ" /> (weil <Katex tex="OL\perp AD" /> und <Katex tex="X\in AD" />),</li>
				<li><Katex tex="\angle OMC=90^\circ" /> (weil <Katex tex="OM\perp CD" />),</li>
				<li><Katex tex="OL=OM" /> (beides Radien des Innenkreises),</li>
				<li><Katex tex="\angle OXL=\angle OCM" /> (gerade gezeigt).</li>
			</ul>
			<p>
				Damit sind die Dreiecke kongruent (deckungsgleich; entsprechende Seiten sind gleich lang),
				denn in zwei rechtwinkligen Dreiecken genügen eine Kathete und ein spitzer Winkel. Also:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="LX=MC." />
			</div>

			<h3 class="mt-6">Schritt 5.5 - Jetzt die Längen buchen</h3>
			<p>Auf der Geraden <Katex tex="AD" /> gilt (weil <Katex tex="A-L-X" /> in dieser Reihenfolge liegen):</p>
			<div class="kbox">
				<Katex as="div" display tex="AX = AL + LX." />
			</div>
			<p>Mit <Katex tex="AX=AO" /> und <Katex tex="LX=MC" /> folgt:</p>
			<div class="kbox">
				<Katex as="div" display tex="\boxed{AO = AL + MC.}" />
			</div>
		</div>

		<h2 id="kongruenz">Teil 6 - Zerlegung von <Katex tex="OB" />: dasselbe Spiel auf der anderen Seite</h2>
		<div class="eddie">
			<h3>Schritt 6.1 - Punkt <Katex tex="Y" /> konstruieren</h3>
			<p>
				Wir wählen auf der Geraden <Katex tex="BC" /> hinter <Katex tex="C" /> einen Punkt <Katex tex="Y" /> so, dass
				<Katex tex="BY=BO" />. Dann ist <Katex tex="\triangle BOY" /> gleichschenklig.
			</p>

			<h3 class="mt-6">Schritt 6.2 - Winkel bei <Katex tex="Y" /> aus dem gleichschenkligen Dreieck</h3>
			<p>
				Der Winkel bei <Katex tex="B" /> im Dreieck <Katex tex="BOY" /> ist
				<Katex tex="\angle YBO = \angle CBO = \angle ABC" />
				(weil <Katex tex="Y" /> auf <Katex tex="BC" /> liegt und <Katex tex="O" /> auf <Katex tex="BA" />).
			</p>
			<p>Daher sind die Basiswinkel bei <Katex tex="O" /> und <Katex tex="Y" />:</p>
			<div class="kbox">
				<Katex as="div" display tex="\angle OYB = \frac{180^\circ-\angle ABC}{2}=90^\circ-\frac{\angle ABC}{2}." />
			</div>
			<p>Da <Katex tex="Y,N,B" /> auf einer Geraden liegen, ist <Katex tex="\angle OYN = \angle OYB" />.</p>

			<h3 class="mt-6">Schritt 6.3 - Winkel bei <Katex tex="D" /> über Winkelhalbierende und Zyklik</h3>
			<p>
				Weil der Innenkreis die Geraden <Katex tex="DA" /> und <Katex tex="DC" /> berührt, liegt <Katex tex="O" />
				auf der Winkelhalbierenden bei <Katex tex="D" />. Also:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\angle ODM = \frac{\angle ADC}{2}" />
			</div>
			<p>(denn <Katex tex="DM" /> liegt auf <Katex tex="DC" />)</p>
			<p>Aus der Zyklik gilt:</p>
			<div class="kbox">
				<Katex as="div" display tex="\angle ABC+\angle ADC=180^\circ \Rightarrow \frac{\angle ADC}{2}=90^\circ-\frac{\angle ABC}{2}." />
			</div>
			<p>Damit:</p>
			<div class="kbox">
				<Katex as="div" display tex="\angle ODM = 90^\circ-\frac{\angle ABC}{2} = \angle OYN." />
			</div>

			<h3 class="mt-6">Schritt 6.4 - Kongruenz und Längenbuchhaltung</h3>
			<p>Betrachte <Katex tex="\triangle ONY" /> und <Katex tex="\triangle OMD" />:</p>
			<ul>
				<li><Katex tex="\angle ONY=90^\circ" /> (weil <Katex tex="ON\perp BC" />),</li>
				<li><Katex tex="\angle OMD=90^\circ" /> (weil <Katex tex="OM\perp CD" />),</li>
				<li><Katex tex="ON=OM" /> (Radien),</li>
				<li><Katex tex="\angle OYN=\angle ODM" /> (gerade gezeigt).</li>
			</ul>
			<p>Also sind die Dreiecke kongruent, somit:</p>
			<div class="kbox">
				<Katex as="div" display tex="NY=MD." />
			</div>
			<p>Auf der Geraden <Katex tex="BC" /> gilt (Reihenfolge <Katex tex="B-N-C-Y" />):</p>
			<div class="kbox">
				<Katex as="div" display tex="BY=BN+NY." />
			</div>
			<p>Mit <Katex tex="BY=BO" /> und <Katex tex="NY=MD" /> folgt:</p>
			<div class="kbox">
				<Katex as="div" display tex="\boxed{OB = BN + MD.}" />
			</div>
		</div>

		<h2>Teil 7 - Finale Rechnung (jetzt nur noch einsetzen)</h2>
		<div class="eddie">
			<p>Aus Teil 5 und 6:</p>
			<div class="kbox">
				<Katex as="div" display tex="AB=AO+OB=(AL+MC)+(BN+MD)." />
			</div>
			<p>Mit den Tangenten-Gleichheiten (Merksatz (2)):</p>
			<div class="kbox">
				<Katex as="div" display tex="MC=CN,\quad MD=DL," />
				<Katex as="div" display tex="AB = AL + CN + BN + DL = (AL+DL) + (BN+CN) = AD + BC." />
				<Katex as="div" display tex="\boxed{AD+BC=AB.}" />
			</div>
		</div>

		<h2>Mini-Eddie-Kommentar</h2>
		<div class="eddie">
			<p>Das sieht erst nach Magie aus, ist aber eigentlich nur:</p>
			<ol>
				<li>Tangenten geben Streckengleichheiten (<Katex tex="CN=CM,\ DL=DM" />).</li>
				<li>Zyklisch liefert feste Winkelbeziehungen (Gegenwinkel ergänzen sich).</li>
				<li>
					Mit zwei gut gewählten Punkten <Katex tex="X" /> und <Katex tex="Y" /> baut man zwei Kongruenzen,
					die genau die fehlenden Strecken umetikettieren.
				</li>
				<li>Dann ist es nur noch Buchhaltung.</li>
			</ol>
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
