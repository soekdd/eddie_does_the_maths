<template>
<AppFrame
	:sub-chapter="{
		'setting-geometrie': 'Setting',
		'risiko-modell': 'Risiko-Modell',
		aufgabe: 'Aufgabe',
		loesung: 'Lösung',
		interpretation: 'Interpretation'
	}"
	title="Eddie rechnet: Optimale Querung"
>
	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="`Eddie`">
				<img alt="Eddie und die optimale Querung" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>

		<h2>Eddie und die optimale Querung - Matheaufgabe mit klarem Optimum</h2>

		<h3 id="setting-geometrie" class="mt-8">Setting und Geometrie</h3>
		<div class="eddie">
			<p>Der überwachte Hof ist rechteckig:</p>
			<ul>
				<li>Länge entlang der Containerkante (Schatten): <Katex inline tex="L = 40\,\text{m}" /></li>
				<li>Tiefe des Hofs (offen, hell): <Katex inline tex="W = 30\,\text{m}" /></li>
			</ul>

			<p>
				Eddie startet links unten am Hinterausgang des Terminals:
				Start <Katex inline tex="A=(0,0)" />.
			</p>
			<p>
				Der feste Zielpunkt ist ein Tor rechts oben:
				Ziel <Katex inline tex="B=(L,W)" />.
			</p>
			<p>
				Entlang der unteren Kante (bei <Katex inline tex="y=0" />) liegt Schatten (Terminal/Zaun).
				Eddie kann dort unauffällig schleichen. Irgendwo bei
				<Katex inline tex="P=(x,0)\;\text{mit}\;0\le x\le L" />
				entscheidet sie sich, diagonal quer über den Hof direkt zum Tor <Katex inline tex="B" /> zu sprinten.
			</p>
		</div>

		<h3 id="risiko-modell" class="mt-8">Risiko-Modell</h3>
		<div class="eddie">
			<ul>
				<li>Im Schatten: 1 Risikopunkt pro Meter</li>
				<li>Quer über den Hof (offen): 3 Risikopunkte pro Meter</li>
			</ul>
			<p>
				Für die Herleitung verwenden wir allgemein:
				<Katex inline tex="a=\text{Risiko/m im Schatten}" /> und
				<Katex inline tex="b=\text{Risiko/m bei Querung}" />,
				im Beispiel dann <Katex inline tex="a=1,\;b=3" />.
			</p>
			<p>
				Als Story-Fakt: außen komplett rum gäbe es zwar nur Schatten, aber der Umweg ist etwa
				5x so lang wie die direkte Diagonale <Katex inline tex="AB=\sqrt{L^2+W^2}" />,
				im konkreten Fall also
				<Katex inline tex="5\cdot \sqrt{40^2+30^2}=250\,\text{m}" />.
			</p>
		</div>

		<h3 id="aufgabe" class="mt-8">Aufgabe</h3>
		<div class="eddie">
			<p>
				Finde den Wert <Katex inline tex="x" />, für den Eddie die Querung beginnt,
				sodass das Gesamtrisiko minimal wird.
			</p>
		</div>

		<h3 id="loesung" class="mt-8">Lösung</h3>
		<div class="eddie">
			<h4>1) Gesamtrisiko als Funktion</h4>
			<p>Zunächst rein symbolisch mit <Katex inline tex="L,W,a,b" />.</p>
			<p>Schatten-Strecke: <Katex inline tex="x" /></p>
			<p>
				Sprint-Strecke: Abstand von <Katex inline tex="P=(x,0)" /> nach <Katex inline tex="B=(L,W)" />:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="PB=\sqrt{(L-x)^2+W^2}" />
			</div>
			<p>Risiko:</p>
			<div class="kbox">
				<Katex as="div" display tex="R(x)=a\,x+b\sqrt{(L-x)^2+W^2}" />
			</div>

			<h4>2) Ableiten und Nullsetzen</h4>
			<div class="kbox">
				<Katex as="div" display tex="R'(x)=a+b\cdot\frac{x-L}{\sqrt{(L-x)^2+W^2}}" />
				<Katex as="div" display tex="R'(x)=0" />
				<Katex as="div" display tex="a=b\cdot\frac{L-x}{\sqrt{(L-x)^2+W^2}}" />
			</div>
			<p>Setze <Katex inline tex="u=L-x" /> (also <Katex inline tex="u\ge 0" />):</p>
			<div class="kbox">
				<Katex as="div" display tex="a=b\cdot\frac{u}{\sqrt{u^2+W^2}}" />
			</div>

			<h4>3) Quadrieren - Polynom 2. Ordnung</h4>
			<div class="kbox">
				<Katex as="div" display tex="a^2(u^2+W^2)=b^2u^2" />
				<Katex as="div" display tex="a^2W^2=(b^2-a^2)u^2" />
				<Katex as="div" display tex="u^2=\frac{a^2W^2}{b^2-a^2}" />
			</div>
			<p>Zurück zu <Katex inline tex="x" />:</p>
			<div class="kbox">
				<Katex as="div" display tex="(L-x)^2=\frac{a^2W^2}{b^2-a^2}" />
				<Katex as="div" display tex="x^2-2Lx+\left(L^2-\frac{a^2W^2}{b^2-a^2}\right)=0" />
				<Katex as="div" display tex="x^*=L-\frac{aW}{\sqrt{b^2-a^2}}" />
				<Katex as="div" display tex="\text{mit }r=\frac{b}{a}: \quad x^*=L-\frac{W}{\sqrt{r^2-1}}" />
			</div>

			<h4>4) Zahlen erst am Schluss einsetzen</h4>
			<p>Jetzt mit <Katex inline tex="L=40,\;W=30,\;a=1,\;b=3\;(r=3)" />:</p>
			<div class="kbox">
				<Katex
					as="div"
					display
					tex="x^*=40-\frac{30}{\sqrt{9-1}}=40-\frac{30}{\sqrt8}=40-\frac{15}{\sqrt2}=40-\frac{15\sqrt2}{2}\approx 29{,}39\,\text{m}"
				/>
				<Katex
					as="div"
					display
					tex="u^*=L-x^*=\frac{30}{\sqrt8}=\frac{15}{\sqrt2}=\frac{15\sqrt2}{2}\approx 10{,}61\,\text{m}"
				/>
				<Katex
					as="div"
					display
					tex="PB^*=\sqrt{\frac{225}{2}+900}=\sqrt{\frac{2025}{2}}=\frac{45\sqrt2}{2}\approx 31{,}82\,\text{m}"
				/>
			</div>

			<h4 id="interpretation">5) Interpretation (für die Szene)</h4>
			<p>
				Eddie schleicht rund <Katex inline tex="29{,}39\,\text{m}" /> entlang der Containerkante
				und sprintet dann die letzte Diagonale.
			</p>
			<p>
				Dabei ist der horizontale Rest bis zum Tor:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="u^*=\frac{15\sqrt2}{2}\approx 10{,}61\,\text{m}" />
			</div>
			<p>und die Sprintstrecke:</p>
			<div class="kbox">
				<Katex as="div" display tex="PB^*=\frac{45\sqrt2}{2}\approx 31{,}82\,\text{m}" />
			</div>
			<p>
				Anschaulich: Sie bleibt so lange im Schatten, bis sie nur noch ungefähr 10,6 Meter
				seitlich versetzt zum Tor ist - dann lohnt sich der Sprint.
			</p>
		</div>
	</template>
	<template #interactivePart>
		<h2>Interaktiv</h2>
		<WO_Graph/>
	</template>
</AppFrame>
</template>

<script setup>
import titleImg from "@/images/WO.webp";
import WO_Graph from "./WO_Graph.vue";
</script>
