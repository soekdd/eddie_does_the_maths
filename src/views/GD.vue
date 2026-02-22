<template>
<AppFrame
	:sub-chapter="{
		einleitung: 'Einleitung',
		'diophantos-raetsel': 'Diophantos-Rätsel',
		'in-formeln': 'In Formeln',
		loesen: 'Lösen',
		stationen: 'Bonus-Stationen',
		'eddies-rechnung': 'Eddies Rechnung',
		'mit-t18': 'Mit T=18'
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
			<p>
				Ich habe einen alten Zettel auf dem Tisch. Der Text klingt für mich
				mehr wie ein Rätsel als wie ein Nachruf: Bruchteile eines Lebens,
				ein Sohn, ein paar Jahre dazwischen und am Ende eine einzige Frage.
			</p>
			<p>
				Genau mein Ding. Ich rechne das zuerst klassisch algebraisch für
				Diophantos durch und übersetze danach meine eigene
				„Grabplatten-Rechnung“ in saubere Gleichungen.
			</p>
		</div>
	</template>

	<template #descriptionPart>
		<h2 id="diophantos-raetsel">Ich lese das Grabplatten-Rätsel des Diophantos</h2>
		<div class="eddie">
			<p>In der Originalfassung des Epitaphs lese ich:</p>
			<blockquote class="storyQuote">
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
			<p>Wenn ich den Pathos rausnehme und nur die Algebra behalte, steht da:</p>
			<ul>
				<li>Ich setze <Katex tex="\frac16" /> seiner Lebenszeit für die Kindheit.</li>
				<li>Ich addiere weitere <Katex tex="\frac1{12}" /> bis zum Bartwuchs.</li>
				<li>Ich addiere weitere <Katex tex="\frac17" /> bis zur Hochzeit.</li>
				<li>Ich lese: <Katex tex="5" /> Jahre später bekommt er einen Sohn.</li>
				<li>
					Ich lese: Der Sohn lebt <Katex tex="\frac12" /> so lang wie der Vater
					(bezogen auf die Lebenszeit des Vaters).
				</li>
				<li>
					Ich lese: <Katex tex="4" /> Jahre nach dem Tod des Sohnes stirbt
					Diophantos.
				</li>
			</ul>
		</div>

		<h2 id="in-formeln" class="mt-8">1) Ich überführe alles in Formeln</h2>
		<div class="eddie">
			<p>
				Ich setze <Katex tex="x" /> als gesamte Lebensdauer von Diophantos
				in Jahren.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\frac16x+\frac1{12}x+\frac17x+5+\frac12x+4=x" />
			</div>
		</div>

		<h2 id="loesen" class="mt-8">2) Ich löse die Gleichung</h2>
		<div class="eddie">
			<p>
				Ich nehme <Katex tex="84" /> als gemeinsamen Nenner der Brüche
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
			<p><b>Ich komme damit auf 84 Jahre für Diophantos.</b></p>
		</div>

		<h2 id="stationen" class="mt-8">3) Bonus: Ich rechne die Stationen als konkrete Alterszahlen</h2>
		<div class="eddie">
			<ul>
				<li>
					das Ende der Kindheit:
					<Katex tex="\frac16x=14" />
				</li>
				<li>
					den Bartwuchs:
					<Katex tex="\left(\frac16+\frac1{12}\right)x=14+7=21" />
				</li>
				<li>
					die Hochzeit:
					<Katex tex="\left(\frac16+\frac1{12}+\frac17\right)x=14+7+12=33" />
				</li>
				<li>
					die Geburt des Sohnes:
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
				Ein Drittel bin ich Kleinkind,<br>
				vier Neuntel bin ich Schulkind,<br>
				ein Sechstel bin ich Spezi der Zahlen,<br>
				davon verbringe ich zwei Drittel als Edmilla getarnt.<br>
				Zwei Monde bin ich frei.<br>
				Den Rest bin ich auf der Flucht.
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
			<p>Wenn ich <Katex tex="T=18" /> setze, folgt:</p>
			<div class="kbox">
				<Katex as="div" display tex="T_{\text{Flucht}}=\frac1{18}\cdot 18-\frac16" />
				<Katex as="div" display tex="=1-\frac16=\frac56" />
				<Katex as="div" display tex="\frac56\approx 0{,}83\text{ Jahre}=10\text{ Monate}" />
			</div>
		</div>
	</template>
</AppFrame>
</template>

<script setup>
import titleImg from "@/images/GD.webp";
</script>

<style scoped>
.storyQuote {
	border-left: 4px solid rgba(var(--v-theme-primary, 25, 118, 210), 0.85);
	background: rgba(var(--v-theme-primary, 25, 118, 210), 0.08);
	border-radius: 10px;
	margin: 0 0 14px;
	padding: 10px 12px;
}
</style>
