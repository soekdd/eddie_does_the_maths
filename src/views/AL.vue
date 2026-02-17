<!-- eslint-disable vue/max-len -->
<template>
<AppFrame
	:sub-chapter="{
		'analytical-engine': 'Analytical Engine',
		'bernoulli-zahlen': 'Bernoulli-Zahlen',
		'gcd': 'gcd'
	}"
	title="Eddie rechnet: Kartenspiele mit Ada Lovelace"
>

	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="`Eddie`">
				<img alt="Eddie rechnet" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h2>Kartenspiel mit Ada</h2>
		<div class="eddie">
			<p>
				Heute rechne ich wie Ada. Ada wollte mit Hilfe von Charles Babbages Rechenmaschine
				eine Reihe sogenannter Bernoulli-Zahlen berechnen.
			</p>
		</div>

		<h2 id="analytical-engine">Teil 1 — Was ist Adas "Computer"?</h2>
		<div class="eddie">
			<p>
				Adas Maschine heisst <b>Analytical Engine</b>. Sie wurde historisch nie vollständig gebaut,
				aber das Modell ist glasklar: eine universelle Rechenmaschine.
			</p>
			<ul>
				<li>
					<b>Store (Speicher):</b> nummerierte Fächer für Zahlen, z.B. <Katex inline tex="V[0]" />.
				</li>
				<li>
					<b>Mill (Mühle):</b> Rechenwerk für Plus, Minus, Mal, Geteilt.
				</li>
			</ul>
			<p>Gesteuert wird die Maschine über Lochkarten:</p>
			<ol>
				<li>Operationskarten (Addiere, Subtrahiere, Multipliziere, Dividiere)</li>
				<li>Zahlkarten (Konstanten)</li>
				<li>Variablenkarten (lies/schreibe <Katex inline tex="V[i]" />)</li>
			</ol>
			<p class="muted">
				Programmlogik mit Schleifen und Abzweigungen ist damit bereits möglich.
			</p>
		</div>

		<h2 id="bernoulli-zahlen">Teil 2 — Was sind Bernoulli-Zahlen?</h2>
		<div class="eddie">
			<p>
				Bernoulli-Zahlen <Katex inline tex="B_0,B_1,B_2,\dots" /> sind eine spezielle Zahlenfolge,
				die in vielen Summenformeln auftaucht, besonders bei Potenzsummen wie
				<Katex inline tex="1^p+2^p+\dots+n^p" />.
				Sie sind also eine Art „Bausteine“ für kompakte geschlossene Formeln.
			</p>

			<p>
				Ein klassisches Beispiel ist die Faulhaber-Formel:
			</p>

			<div class="kbox">
				<Katex
					as="div"
					display
					tex="\sum_{m=1}^{n} m^p = \frac{1}{p+1}\sum_{k=0}^{p}(-1)^k\binom{p+1}{k}B_k\,n^{p+1-k}"
				/>
			</div>

			<p>
				Mit der in der Mathematik ueblichen Konvention <Katex inline tex="B_1=-\frac12" />
				beginnt die Folge z.B. so:
			</p>

			<div class="kbox">
				<div class="mono"><Katex inline tex="B_0=1,\;B_1=-\frac12,\;B_2=\frac16,\;B_4=-\frac1{30},\;B_6=\frac1{42}" /></div>
				<div class="mono">und fuer diese Konvention gilt: <Katex inline tex="B_3=B_5=B_7=\dots=0" />.</div>
			</div>

			<p>
				Unser Emulator darunter rechnet bewusst im <i>Note‑G‑Stil</i> mit den Startwerten
				<Katex inline tex="B_1,B_3,B_5" /> und der mechanischen Form
				<Katex inline tex="B_{2n-1}=-(A_0+A_1B_1+A_3B_3+A_5B_5)" />.
				Das ist eine historische, didaktische Nachbildung des Kartenablaufs.
			</p>

			<p>
				Beispiel aus dem Emulator fuer <Katex inline tex="n=4" />:
			</p>

			<div class="kbox">
				<Katex
					as="div"
					display
					tex="A_0=-\frac{7}{18},\;A_1=4,\;A_3=14,\;A_5=\frac{28}{3}"
				/>
				<Katex
					as="div"
					display
					tex="B_7=-\Bigl(-\frac{7}{18}+4\!\left(-\frac12\right)+14\!\left(\frac16\right)+\frac{28}{3}\!\left(-\frac1{30}\right)\Bigr)=\frac{11}{30}"
				/>
			</div>
		</div>

		<h2>Teil 3 — Ich "programmiere" Ada: B0, B1, B2</h2>
		<div class="eddie">
			<h3>Schritt 0 - Startwert</h3>
			<p>
				Zahlkarte <b>1</b>, dann Variablenkarte <b>-&gt; V[0]</b>.
				Damit gilt <Katex inline tex="V[0]=B_0=1" />.
			</p>

			<h3>Schritt 1 - B1</h3>
			<p>Für <Katex inline tex="m=1" /> gilt:</p>
			<div class="kbox">
				<Katex as="div" display tex="B_0 + 2B_1 = 0" />
				<Katex as="div" display tex="B_1 = -\frac{B_0}{2} = -\frac12" />
			</div>
			<p>
				Im Store steht danach: <Katex inline tex="V[1]=B_1=-\frac12" />.
			</p>

			<h3>Schritt 2 - B2</h3>
			<p>Für <Katex inline tex="m=2" />:</p>
			<div class="kbox">
				<Katex as="div" display tex="B_0 + 3B_1 + 3B_2 = 0" />
				<Katex as="div" display tex="3B_2 = -B_0 - 3B_1" />
				<Katex as="div" display tex="B_2=\frac{-B_0-3B_1}{3}=\frac16" />
			</div>
			<p>
				Im Store steht danach: <Katex inline tex="V[2]=B_2=\frac16" />.
			</p>
		</div>

		<h2>Historischer Druckfehler: der erste Bug?</h2>
		<div class="eddie">
			<p>
				In Adas gedruckter <i>Note G</i> gibt es eine bekannte vertauschte Division.
				Sie wird oft als einer der frühesten dokumentierten Programmierfehler erzählt:
				ein Quotient steht auf dem Kopf.
			</p>
			<div class="kbox">
				<Katex
					as="div"
					display
					tex="\text{gedruckt (Bug): }\frac{2n+1}{2n-1}\qquad\text{korrekt: }\frac{2n-1}{2n+1}"
				/>
			</div>
		</div>

		<h2>Warum das mehr ist als Zahlenspielerei</h2>
		<div class="eddie">
			<p>
				Bernoulli-Zahlen stecken in Summenformeln wie
				<Katex inline tex="1+2+\dots+n" /> oder
				<Katex inline tex="1^2+2^2+\dots+n^2" />.
			</p>
			<p>
				Die Idee ist zentral: Karten erzeugen nicht nur Zahlen, sondern Muster.
			</p>
		</div>

		<h2>Noch mal in superkurz</h2>
		<div class="eddie">
			<ul>
				<li><b>Store:</b> nummerierte Fächer <Katex inline tex="V[i]" /></li>
				<li><b>Mill:</b> rechnet mit ausgelesenen Werten</li>
				<li><b>Lochkarten:</b> Operation, Zahl, Variable</li>
				<li><b>Programm:</b> Kartenfolge = Rechenfolge, inkl. Schleifen/Abzweigungen</li>
				<li>
					<b>Startwerte:</b>
					<Katex inline tex="B_0=1,\;B_1=-\frac12,\;B_2=\frac16" />
				</li>
			</ul>
		</div>

		<h2 id="gcd" class="mt-2">Teil 4 — Eddie kürzt Brüche mit Ada</h2>
		<div class="eddie">
			<p>
				Brüche kürzen geht über den grössten gemeinsamen Teiler:
			</p>
			<div class="kbox">
				<Katex
					as="div"
					display
					tex="\frac{48}{18}=\frac{8}{3},\quad \text{weil }\gcd(48,18)=6."
				/>
			</div>
		</div>

		<h2>Algorithmus in Worten</h2>
		<div class="eddie">
			<ol>
				<li>Nimm zwei Zahlen <Katex inline tex="a" /> und <Katex inline tex="b" />.</li>
				<li>
					Solange <Katex inline tex="b\neq 0" />:
					<ul>
						<li>teile <Katex inline tex="a" /> durch <Katex inline tex="b" /></li>
						<li>behalte nur den Rest <Katex inline tex="r" /></li>
						<li>setze <Katex inline tex="a:=b,\;b:=r" /></li>
					</ul>
				</li>
				<li>Am Ende ist <Katex inline tex="a=\gcd(a,b)" />.</li>
			</ol>
		</div>

		<h2>Jetzt in Karten: gcd(48,18)</h2>
		<div class="eddie">
			<h3>Start</h3>
			<p>
				Zahlkarte <b>48</b> in <b>V[a]</b>, Zahlkarte <b>18</b> in <b>V[b]</b>.
			</p>

			<h3>Schleife 1</h3>
			<div class="kbox">
				<Katex as="div" display tex="48 \div 18 \Rightarrow r=12,\; a:=18,\; b:=12" />
			</div>

			<h3>Schleife 2</h3>
			<div class="kbox">
				<Katex as="div" display tex="18 \div 12 \Rightarrow r=6,\; a:=12,\; b:=6" />
			</div>

			<h3>Schleife 3</h3>
			<div class="kbox">
				<Katex as="div" display tex="12 \div 6 \Rightarrow r=0,\; a:=6,\; b:=0" />
			</div>

			<h3>Ende</h3>
			<p>
				Da <Katex inline tex="b=0" />, gilt:
				<Katex inline tex="\gcd(48,18)=6" />.
			</p>
		</div>

		<h2>Was wir gelernt haben</h2>
		<div class="eddie">
			<ul>
				<li>Lochkarten können Schleifen abbilden.</li>
				<li>Die Analytical Engine kann Restbildung (Modulo) verwenden.</li>
				<li>Damit kann sie Brüche systematisch kürzen.</li>
				<li>Das Modell ist mechanisch, aber bereits voll programmatisch.</li>
			</ul>
		</div>
	</template>

	<template #interactivePart>
		<v-card class="pa-2">
			<v-select
				v-model="selectedProgram"
				density="compact"
				hide-details
				item-title="title"
				item-value="value"
				:items="programOptions"
				label="Programm auswählen"
			/>
		</v-card>
		<AL_Bernoulli v-if="selectedProgram === 'bernoulli'" />
		<AL_ReduceFractions v-else-if="selectedProgram === 'reduceFractions'" />
		<AL_Horner v-else-if="selectedProgram === 'horner'" />
		<AL_Sqrt v-else-if="selectedProgram === 'sqrt'" />
		<AL_PrimeTest v-else />
	</template>
</AppFrame>
</template>

<script setup>
import { ref } from "vue";
import titleImg from "@/images/AL.webp";
import AL_Bernoulli from "./AL_Bernoulli.vue";
import AL_ReduceFractions from "./AL_ReduceFractions.vue";
import AL_Horner from "./AL_Horner.vue";
import AL_Sqrt from "./AL_Sqrt.vue";
import AL_PrimeTest from "./AL_PrimeTest.vue";

const selectedProgram = ref( "bernoulli" );
const programOptions = [
	{ title: "Bernoulli-Zahlen (Note G)", value: "bernoulli" },
	{ title: "Brüche kürzen (ggT)", value: "reduceFractions" },
	{ title: "Polynom (Horner-Schema)", value: "horner" },
	{ title: "Quadratwurzel (Heron/Newton)", value: "sqrt" },
	{ title: "Primzahltest (Trial Division)", value: "primeTest" }
];
</script>
