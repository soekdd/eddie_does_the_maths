<template>
<AppFrame
	:sub-chapter="{
		einleitung: 'Einleitung',
		'diophantos-raetsel': 'Diophantos-Rätsel',
		'in-formeln': 'In Formeln',
		loesen: 'Lösen',
		stationen: 'Bonus-Stationen',
		'eddies-rechnung': 'Eddies Rechnung',
		'mit-t18': 'Mit T=18',
		'deine-grabplatte': 'Deine Grabplatte'
	}"
	title="Ich rechne: Diophantos' Grabplatte"
>
	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer title="Ich und das Grabplatten-Rätsel">
				<img loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">Stockholm, 26. Oktober 1985</h3>
		<div class="eddie">

			<p>Ich lehne mich am Fensterplatz zurück, während draußen die Stadt den Sonntag
				weiteratmet. In der Rotunde ist es dagegen, als würde die Zeit in Ringen laufen:
				leise Schritte, Papiergeruch, das dumpfe Klacken von Buchdeckeln. Genau hier
				fühlen sich Zahlen nicht wie Schulstoff an, sondern wie Geschichten, die jemand
				vor mir begonnen hat. Ich mag das. Geschichten kann man weiterführen. Man kann
				sie sogar umschreiben.
			</p><p>
				Und Diophantos ist so einer, der mich dabei erwischt, wie ich kurz vergesse, wer ich gerade sein
				muss. Nicht Eddie auf der Flucht, nicht Edmilla im Kostüm, nicht das Mädchen mit dem Hund, der
				im Park den Schnee umgräbt. Sondern einfach ich mit einem Stift, einem Block und dieser nervigen
				Sehnsucht nach Ordnung in allem, was gerade unordentlich ist.
			</p><p>
				Die Inschrift wirkt wie ein Spruch aus einem alten Rätselheft, nur dass hier niemand
				„Lösung auf Seite 84“ drunterdruckt. Also mache ich das, was ich immer mache, wenn mir
				etwas zu groß vorkommt: Ich zerlege es in Teile, bis es wieder in meine Hand passt.
			</p>
		</div>
	</template>

	<template #descriptionPart>
		<h2 id="diophantos-raetsel">Das Grabplatten-Rätsel des Diophantos</h2>
		<div class="eddie">
			<p>Die Originalfassung des Epitaphs:</p>
			<blockquote class="storyQuote">
				<div class="plateHeader">
					<div class="plateLead">Diophantos</div>
					<div class="plateLeadSub">Epitaph</div>
				</div>
				Hier das Grabmal deckt Diophantos, ein Wunder zu schauen:
				<br> Durch des Entschlafenen Kunst lehrt dich sein Alter der Stein.
				<br> Knabe zu bleiben verlieh ein Sechstel des Lebens ein Gott ihm;
				<br> Fügend das Zwölftel hinzu, ließ er ihm sprossen die Wang.
				<br> Steckte ihm drauf auch nach dem Siebtel die Fackel der Hochzeit,
				<br> Und fünf Jahre nachher teilt' er ein Söhnlein ihm zu.
				<br> Weh! unglückliches Kind, so geliebt! Halb hatt' es des Vaters
				<br> Alter erreicht, da nahm's Hades, der schaurige, allzufrüh.
				<br> Noch vier Jahre den Schmerz durch Kunde der Zahlen besänftigend,
				<br> Langte am Ziele des Seins endlich er selber auch an.
			</blockquote>
			<p>Nimmt man den Pathos heraus und behält nur die Algebra, steht da:</p>
			<ul>
				<li><Katex tex="\frac16" /> seiner Lebenszeit für die Kindheit.</li>
				<li>weitere <Katex tex="\frac1{12}" /> bis zum Bartwuchs.</li>
				<li>weitere <Katex tex="\frac17" /> bis zur Hochzeit.</li>
				<li><Katex tex="5" /> Jahre später bekommt er einen Sohn.</li>
				<li>
					Der Sohn lebt <Katex tex="\frac12" /> so lang wie der Vater
					(bezogen auf die Lebenszeit des Vaters).
				</li>
				<li>
					<Katex tex="4" /> Jahre nach dem Tod des Sohnes stirbt
					Diophantos.
				</li>
			</ul>
		</div>

		<h2 id="in-formeln" class="mt-8">1) In Formeln überführen</h2>
		<div class="eddie">
			<p>
				<Katex tex="x" /> als gesamte Lebensdauer von Diophantos
				in Jahren.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\frac16x+\frac1{12}x+\frac17x+5+\frac12x+4=x" />
			</div>
		</div>

		<h2 id="loesen" class="mt-8">2) Lösen</h2>
		<div class="eddie">
			<p>
				Zuerst die Brüche zusammenfassen. Ein gemeinsamer Nenner ist  <Katex tex="84" />
				(damit ist die Lösung fast schon da):
			</p>
			<div class="kbox">
				<Katex
					as="div"
					display
					tex="\frac16=\frac{14}{84},\quad \frac1{12}=\frac7{84},\quad \frac17=\frac{12}{84},\quad \frac12=\frac{42}{84}"
				/>
			</div>
			<div class="kbox">
				<Katex as="div" display tex="\left(\frac{14+7+12+42}{84}\right)x+9=x" />
				<Katex as="div" display tex="\frac{75}{84}x+9=x" />
				<Katex as="div" display tex="x-\frac{75}{84}x=9" />
				<Katex as="div" display tex="\frac9{84}x=9" />
				<Katex as="div" display tex="x=9\cdot\frac{84}{9}=84" />
			</div>
			<p><b>Diophantos wurde also 84 Jahre alt.</b></p>
		</div>

		<h2 id="stationen" class="mt-8">3) Bonus: Die Stationen als konkrete Alterszahlen</h2>
		<div class="eddie">
			<ul>
				<li>
					Ende der Kindheit:
					<Katex tex="\frac16x=14" />
				</li>
				<li>
					Bartwuchs:
					<Katex tex="\left(\frac16+\frac1{12}\right)x=14+7=21" />
				</li>
				<li>
					Hochzeit:
					<Katex tex="\left(\frac16+\frac1{12}+\frac17\right)x=14+7+12=33" />
				</li>
				<li>
					Geburt des Sohnes:
					<Katex tex="33+5=38" />
				</li>
				<li>
					für den Sohn:
					<Katex tex="\frac12x=42" /> Jahre, also ist Diophantos beim Tod des
					Sohnes
					<Katex tex="38+42=80" />
					Jahre alt.
				</li>
				<li>
					für Diophantos' Tod auf:
					<Katex tex="80+4=84" />
				</li>
			</ul>
		</div>

		<h2 id="eddies-rechnung" class="mt-8">Meine eigene „Meilenstein-Rechnung“</h2>
		<div class="eddie">
			<blockquote class="storyQuote">
				<div class="plateHeader">
					<div class="plateLead">Eddie</div>
					<div class="plateLeadSub">Meilenstein-Rechnung</div>
				</div>
				Ein Drittel Kleinkind,<br>
				vier Neuntel bin ich Schulkind,<br>
				ein Sechstel bin ich Spezi der Zahlen,<br>
				davon zwei Drittel als Edmilla getarnt. <br>
				Zwei Monde bin ich frei.<br>
				Den Rest auf der Flucht.
			</blockquote>

			<p>
				Ich interpretiere das als Aufteilung meiner Gesamtzeit
				<Katex tex="T" />.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="T_{\text{klein}}=\frac13T" />
				<Katex as="div" display tex="T_{\text{schule}}=\frac49T" />
				<Katex as="div" display tex="T_{\text{zahlen}}=\frac16T" />
				<Katex
					as="div"
					display
					tex="T_{\text{Edmilla}}=\frac23\cdot T_{\text{zahlen}}=\frac23\cdot\frac16T=\frac19T"
				/>
				<Katex as="div" display tex="T_{\text{frei}}=\frac{2}{12}=\frac16\;\text{Jahr}" />
			</div>
			<p>
				Ich behandle die Edmilla-Zeit als Unterabschnitt der Zahlen-Phase,
				nicht als zusätzlichen Hauptabschnitt.
			</p>
			<p>Den Rest auf der Flucht rechne ich dann so:</p>
			<div class="kbox">
				<Katex as="div" display tex="T_{\text{Flucht}}=T-\left(\frac13T+\frac49T+\frac16T+\frac16\right)" />
				<Katex as="div" display tex="\frac13T+\frac49T+\frac16T=\frac{6}{18}T+\frac{8}{18}T+\frac{3}{18}T=\frac{17}{18}T" />
				<Katex as="div" display tex="T_{\text{Flucht}}=T-\left(\frac{17}{18}T+\frac16\right)=\frac1{18}T-\frac16" />
			</div>
			<p>
				Damit habe ich meinen Text als Gleichungssystem sauber übersetzt.
				Anders als bei Diophantos ist <Katex tex="T" /> hier nicht durch den
				Text selbst festgelegt. Wenn mein Alter gegeben ist, kann ich den
				Flucht-Abschnitt sofort konkret berechnen.
			</p>
		</div>

		<h2 id="mit-t18" class="mt-8">Wenn ich <Katex tex="T=18" /> setze</h2>
		<div class="eddie">
			<p>Wenn ich <Katex tex="T=18" /> setze, folgt eine Fluchtzeit von:</p>
			<div class="kbox">
				<Katex as="div" display tex="T_{\text{Flucht}}=\frac1{18}\cdot 18-\frac16" />
				<Katex as="div" display tex="=1-\frac16=\frac56" />
				<Katex as="div" display tex="\frac56\approx 0{,}83\text{ Jahre}=10\text{ Monate}" />
			</div>
		</div>
	</template>

	<template #interactivePart>
		<h2 id="deine-grabplatte">4) Erstelle dein eigenes Grabplatten-Rätsel</h2>
		<div class="eddie">
			<p>
				Lege deine Lebensstationen als Terme an. Die Gleichung wird automatisch aufgebaut
				und die Alterswerte zu jeder Station werden im Stil einer Grabplatte berechnet.
			</p>
		</div>
		<GD_Plate />
	</template>
</AppFrame>
</template>

<script setup>
import titleImg from "@/images/GD.webp";
import GD_Plate from "./GD_Plate.vue";
</script>

<style scoped>
.storyQuote {
	position: relative;
	overflow: hidden;
    text-align: center;
	max-width: 35em;
	margin: auto 14px;
	padding: 16px 16px 14px;
	border-radius: 16px;
	border: 1px solid rgba(60, 45, 26, 0.5);
	background:
		radial-gradient(120% 100% at 0% 0%, rgba(255, 239, 215, 0.45), transparent 55%),
		linear-gradient(150deg, #7a6651 0%, #ab957d 38%, #725d49 70%, #5d4a3a 100%);
	box-shadow:
		inset 0 1px 0 rgba(255, 248, 235, 0.28),
		inset 0 -18px 22px rgba(35, 24, 14, 0.28),
		0 10px 24px rgba(0, 0, 0, 0.24);
	color: #1f1811;
	font-family: "Cormorant Garamond", "Times New Roman", serif;
	font-size: 1.05rem;
	line-height: 1.35;
}

.storyQuote::before {
	content: "";
	position: absolute;
	inset: 10px;
	border: 1px solid rgba(65, 47, 29, 0.5);
	border-radius: 12px;
	pointer-events: none;
}

.plateHeader {
	position: relative;
	z-index: 1;
	text-align: center;
	margin-bottom: 10px;
}

.plateLead {
	font-size: 1.35rem;
	letter-spacing: 0.04em;
	text-transform: uppercase;
}

.plateLeadSub {
	font-size: 0.95rem;
	letter-spacing: 0.06em;
	opacity: 0.84;
	text-transform: uppercase;
}
</style>
