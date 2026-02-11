<template>
<AppFrame>
	<template #title>
		<div class="badge">AL</div>
		<div>
			<h1>Eddie rechnet: Kartenspiele mit Ada Lovelace</h1>
			<p class="sub">Analytical Engine • Bernoulli-Zahlen • gcd</p>
		</div>
	</template>

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

		<h2>Was ist Adas "Computer"?</h2>
		<div class="eddie">
			<p>
				Adas Maschine heisst <b>Analytical Engine</b>. Sie wurde historisch nie vollstaendig gebaut,
				aber das Modell ist glasklar: eine universelle Rechenmaschine.
			</p>
			<ul>
				<li>
					<b>Store (Speicher):</b> nummerierte Faecher fuer Zahlen, z.B. <Katex inline tex="V[0]" />.
				</li>
				<li>
					<b>Mill (Muehle):</b> Rechenwerk fuer Plus, Minus, Mal, Geteilt.
				</li>
			</ul>
			<p>Gesteuert wird die Maschine ueber Lochkarten:</p>
			<ol>
				<li>Operationskarten (Addiere, Subtrahiere, Multipliziere, Dividiere)</li>
				<li>Zahlkarten (Konstanten)</li>
				<li>Variablenkarten (lies/schreibe <Katex inline tex="V[i]" />)</li>
			</ol>
			<p class="muted">
				Programmlogik mit Schleifen und Abzweigungen ist damit bereits moeglich.
			</p>
		</div>

		<h2>Was sind Bernoulli-Zahlen?</h2>
		<div class="eddie">
			<p>
				Bernoulli-Zahlen <Katex inline tex="B_0,B_1,B_2,\dots" /> sind eine Zahlenfolge, die in
				Formeln fuer Summen von Potenzen auftaucht.
			</p>
			<div class="kbox">
				<div class="mono"><Katex inline tex="B_0=1" /></div>
				<div class="mono">danach jeweils rekursiv aus den vorherigen <Katex inline tex="B_m" /></div>
			</div>
		</div>

		<h2>Ich "programmiere" Ada: B0, B1, B2</h2>
		<div class="eddie">
			<h3>Schritt 0 - Startwert</h3>
			<p>
				Zahlkarte <b>1</b>, dann Variablenkarte <b>-&gt; V[0]</b>.
				Damit gilt <Katex inline tex="V[0]=B_0=1" />.
			</p>

			<h3>Schritt 1 - B1</h3>
			<p>Fuer <Katex inline tex="m=1" /> gilt:</p>
			<div class="kbox">
				<Katex as="div" display tex="B_0 + 2B_1 = 0" />
				<Katex as="div" display tex="B_1 = -\frac{B_0}{2} = -\frac12" />
			</div>
			<p>
				Im Store steht danach: <Katex inline tex="V[1]=B_1=-\frac12" />.
			</p>

			<h3>Schritt 2 - B2</h3>
			<p>Fuer <Katex inline tex="m=2" />:</p>
			<div class="kbox">
				<Katex as="div" display tex="B_0 + 3B_1 + 3B_2 = 0" />
				<Katex as="div" display tex="3B_2 = -B_0 - 3B_1" />
				<Katex as="div" display tex="B_2=\frac{-B_0-3B_1}{3}=\frac16" />
			</div>
			<p>
				Im Store steht danach: <Katex inline tex="V[2]=B_2=\frac16" />.
			</p>
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
				<li><b>Store:</b> nummerierte Faecher <Katex inline tex="V[i]" /></li>
				<li><b>Mill:</b> rechnet mit ausgelesenen Werten</li>
				<li><b>Lochkarten:</b> Operation, Zahl, Variable</li>
				<li><b>Programm:</b> Kartenfolge = Rechenfolge, inkl. Schleifen/Abzweigungen</li>
				<li>
					<b>Startwerte:</b>
					<Katex inline tex="B_0=1,\;B_1=-\frac12,\;B_2=\frac16" />
				</li>
			</ul>
		</div>

		<h2>Eddie kuerzt Brueche mit Ada</h2>
		<div class="eddie">
			<p>
				Brueche kuerzen geht ueber den groessten gemeinsamen Teiler:
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
				<li>Lochkarten koennen Schleifen abbilden.</li>
				<li>Die Analytical Engine kann Restbildung (Modulo) verwenden.</li>
				<li>Damit kann sie Brueche systematisch kuerzen.</li>
				<li>Das Modell ist mechanisch, aber bereits voll programmatisch.</li>
			</ul>
		</div>
	</template>

	<template #footer>
		<p class="muted">
			Quelle: <code class="mono">eddie/03_Eddie_rechnet/160_Kartenspiel_mit_Ada.md</code>
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import titleImg from "@/images/AL.webp";
</script>
