<template>
<AppFrame
	:sub-chapter="{
		'setting-geometrie': 'Setting',
		'risiko-modell': 'Risiko-Modell',
		aufgabe: 'Aufgabe',
		loesung: 'Lösung',
		interpretation: 'Interpretation',
		interaction: 'Interaktion'
	}"
	title="Eddie rechnet: Optimale Querung"
>
	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer title="Eddie hat ihr Ziel erreicht">
				<img loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">Vaasa, 18. September 1985</h3>
		<div class="eddie">
			<p>Sini legt mir ihren Plan auf den Küchentisch wie eine Schatzkarte, nur dass der Schatz nicht
				Gold ist, sondern <em>ein Ausgang</em>. Ich bin noch halb Schlaf, halb Panik, aber sobald die
				Linien gerade sind, passiert was in mir: Das Zittern wird leiser. Chaos wird zu Geometrie.</p>
			<p>Da ist der Personalausgang. Da sind die Zäune. Da sind die Kameras, kleine Kreise, die mich
				anstarren, als hätten sie schon gewonnen. Und da ist dieser helle Streifen ohne Deckung, der
				sich anfühlt wie ein Scheinwerfer direkt auf meinem Namen.</p>

			<p>Sini sagt: <em>„Lauf doch einfach quer.“</em> Ich sage: <em>„Ja. Und werde gesehen.“</em> Also
				mache ich das, was ich immer mache, wenn mir die Luft zu knapp wird: Ich rechne mir Mut zusammen und denke mir Risikopunkte aus.
				Jeder Meter im Schatten zählt wenig Risikopunkte, jeder Meter im Licht zählt viel. Und plötzlich ist die
				Frage nicht mehr <em>„Wo lang?“</em>, sondern <b>„Wo ist das Minimum?“</b></p>

			<p>Hier zeige ich dir die genaue Wegoptimierung und unten kannst du den Punkt
				selbst ermitteln und ausprobieren, wie sich Risiko und Strecke gegeneinander aufwiegen.</p>
		</div>
	</template>

	<template #descriptionPart>

		<h2>Eddie und die optimale Querung - Matheaufgabe mit klarem Optimum</h2>

		<h3 id="setting-geometrie" class="mt-8">Setting und Geometrie</h3>
		<div class="eddie">
			<p>Der überwachte Hof ist rechteckig:</p>
			<ul>
				<li>Länge entlang der Containerkante (Schatten): <Katex inline tex="L = 70\,\text{m}" /></li>
				<li>Tiefe des Hofs (offen, hell): <Katex inline tex="W = 30\,\text{m}" /></li>
			</ul>

			<p>
				Eddie startet links unten am Hinterausgang des Terminals:
			</p>
			<p>
				Start <Katex inline tex="A=(0,0)" />.
			</p>
			<p>
				Der feste Zielpunkt ist ein Tor in der Mitte der oberen Hofkante, das leicht zu übersteigen ist:
			</p>
			<p>
				Ziel <Katex inline tex="B=\left(\frac{L}{2},W\right)" />.
			</p>
			<p>
				Die linke Hofkante ist durch das Terminalgebäude versperrt. Durch ein Fenster des Sicherheitsdiensts
				ist der Hof einsehbar, daher ist ein Weg direkt am Gebäude entlang unmöglich.
			</p>
			<p>
				Entlang der unteren Kante (bei <Katex inline tex="y=0" />) liegt Schatten (Terminal/Zaun).
				Eddie kann dort unauffällig schleichen. Irgendwo bei
				<Katex inline tex="P=(x,0)\;\text{mit}\;0\le x\le \frac{L}{2}" />
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
				Für die Herleitung verwenden wir allgemein:<br>
				<Katex inline tex="a=\text{Risiko/m im Schatten}" /> und<br>
				<Katex inline tex="b=\text{Risiko/m bei Querung}" />,<br>
				im Beispiel dann <Katex inline tex="a=1,\;b=3" />.
			</p>
			<p>
				Als Story-Fakt: Geht Eddie nicht quer, sondern bleibt komplett an den Hofkanten im Schatten,
				dann ist die Außenroute
				<Katex inline tex="L + W + \frac{L}{2}=\frac{3}{2}L+W" />,
				im konkreten Fall also
				<Katex inline tex="\frac{3}{2}\cdot 70 + 30 = 135\,\text{m}" />.
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
				Sprint-Strecke: Abstand von <Katex inline tex="P=(x,0)" /> nach <Katex inline tex="B=\left(\frac{L}{2},W\right)" />:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="PB=\sqrt{\left(\frac{L}{2}-x\right)^2+W^2}" />
			</div>
			<p>Risiko:</p>
			<div class="kbox">
				<Katex as="div" display tex="R(x)=a\,x+b\sqrt{\left(\frac{L}{2}-x\right)^2+W^2}" />
			</div>

			<h4>2) Ableiten und Nullsetzen</h4>
			<div class="kbox">
				<Katex as="div" display tex="R'(x)=a+b\cdot\frac{x-\frac{L}{2}}{\sqrt{\left(\frac{L}{2}-x\right)^2+W^2}}" />
				<Katex as="div" display tex="R'(x)=0" />
				<Katex as="div" display tex="a=b\cdot\frac{\frac{L}{2}-x}{\sqrt{\left(\frac{L}{2}-x\right)^2+W^2}}" />
			</div>
			<p>Setze <Katex inline tex="u=\frac{L}{2}-x" /> (also <Katex inline tex="u\ge 0" />):</p>
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
				<Katex as="div" display tex="\left(\frac{L}{2}-x\right)^2=\frac{a^2W^2}{b^2-a^2}" />
				<Katex as="div" display tex="x^2-Lx+\left(\frac{L^2}{4}-\frac{a^2W^2}{b^2-a^2}\right)=0" />
				<Katex as="div" display tex="x^*=\frac{L}{2}-\frac{aW}{\sqrt{b^2-a^2}}" />
				<Katex as="div" display tex="\text{mit }r=\frac{b}{a}: \quad x^*=\frac{L}{2}-\frac{W}{\sqrt{r^2-1}}" />
			</div>

			<h4>4) Jetzt mir konkreten Werten</h4>
			<p>Jetzt mit <Katex inline tex="L=70,\;W=30,\;a=1,\;b=3\;(r=3)" />:</p>
			<div class="kbox">
				<Katex
					as="div"
					display
					tex="x^*=\frac{L}{2}-\frac{W}{\sqrt{r^2-1}}=35-\frac{30}{\sqrt{9-1}}=35-\frac{15\sqrt2}{2}\approx 24{,}39\,\text{m}"
				/>
				<Katex
					as="div"
					display
					tex="u^*=\frac{L}{2}-x^*=35-\left(35-\frac{15\sqrt2}{2}\right)=\frac{15\sqrt2}{2}\approx 10{,}61\,\text{m}"
				/>
				<Katex
					as="div"
					display
					tex="PB^*=\sqrt{\frac{225}{2}+900}=\sqrt{\frac{2025}{2}}=\frac{45\sqrt2}{2}\approx 31{,}82\,\text{m}"
				/>
			</div>

			<h4 id="interpretation">5) Interpretation (für die Szene)</h4>
			<p>
				Eddie schleicht rund <Katex inline tex="24{,}39\,\text{m}" /> entlang der Containerkante
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
		<h2 id="interaction">Interaktiv</h2>
		<WO_Graph/>
	</template>
</AppFrame>
</template>

<script setup>
import titleImg from "@/images/WO.webp";
import WO_Graph from "./WO_Graph.vue";
</script>
