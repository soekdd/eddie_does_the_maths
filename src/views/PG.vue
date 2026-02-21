<template>
<AppFrame
	:sub-chapter="{
		'einleitung': 'Einleitung',
		'poker': 'Poker',
		'wahrscheinlichkeiten': 'Wahrscheinlichkeiten',
		'bayes': 'Bayes',
		'ev': 'EV'
	}"
	title="Eddie rechnet: Five Card Draw - 7 statistische Aufgaben"
>
	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer title="Eddie zockt die Jungs ab">
				<img loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">Joutsa, 6. Juli 1985</h3>
		<div class="eddie"><p>Ich sitze zwischen den Jungs, als wäre ich nur harmlose Deko am Tisch.
			Genau deshalb lassen sie mich so nah ran: Kleidchen, braver Blick, “ich kann das gar nicht”.
			Und ja, die Regeln muss ich wirklich noch verstehen. Aber ein Blatt ist kein Mysterium.
			Es ist Mathe. Welche Kombinationen möglich sind. Wie oft ich sie treffe. Wie wahrscheinlich
			eine bestimmte Karte im Draw überhaupt noch im Deck liegt. Das folgt festen Gesetzen, und die
			begreife ich schneller als Aaron “All-in” sagen kann.
		</p><p>
			Wir spielen Five-Card-Draw, ohne offene Karten. Heißt: Rechnen im Kopf, und der Rest ist Psychologie.
			Ich achte auf Timing (zu schnelles Setzen ist oft Panik), auf Hände (zu viel Rumfummeln schreit Bluff),
			auf Stimmen (plötzlich zu locker = gespielt). Und ich stelle Fragen, nur um zu sehen, wer ausweicht.
		</p><p>
			Hier zeige ich dir, wie du bei Five-Draw sauber rechnest – und unten kannst du ein
			interaktives Blatt selbst ausprobieren.
		</p>
		</div>
	</template>

	<template #descriptionPart>
		<h2 id="poker">Five Card Draw - Aufgabenblock</h2>
		<div class="eddie">
			<p>
				Im <b>Five Card Draw</b> (5 Karten aus einem 52er-Deck, Reihenfolge egal) lassen sich
				Entscheidungen sehr gut über <b>Wahrscheinlichkeiten</b> und <b>Erwartungswerte</b>
				modellieren.
			</p>
			<p class="mono">
				Wichtiger Zählhinweis für die Draw-Aufgaben: Bei einer 1-Karten-Ziehung sind
				<b>47 Karten ziehbar</b>, also <Katex inline tex="52-5=47" />.
				Grund: 4 gehaltene Karten <i>und</i> die abgeworfene Karte sind nicht im Ziehstapel.
			</p>
		</div>

		<section class="task">
			<figure class="exampleFigure">
				<ImageZoomer no-zoom title="Beispielhand: Zwei Paare">
					<PGHand
						:cards="[
							{ code: 'Ks', suit: 'Pik',   rank: 'Dame' },
							{ code: 'Kd', suit: 'Herz',  rank: 'Dame' },
						]"
					/>
				</ImageZoomer>
			</figure>
			<h3 id="wahrscheinlichkeiten">Aufgabe 1 - Das klassische Paar: Lohnt sich "3 ziehen"?</h3>
			<div class="eddie">
				<p>
					<b>Situation:</b> Eddie hält nach dem Deal ein Paar und wirft die anderen drei Karten weg.
					Sie zieht <b>3 neue Karten</b>.
				</p>
				<p><b>Fragen:</b></p>
				<ol>
					<li>Wie wahrscheinlich verbessert sie sich zu Two Pair, Drilling, Full House, Vierling?</li>
					<li>Wie oft bleibt sie bei nur einem Paar?</li>
				</ol>
				<p>
					<b>Lösung (exakt):</b> Insgesamt gibt es
					<Katex inline tex="\binom{52-5}{3}=\binom{47}{3}=16{,}215" /> Ziehungen.
				</p>
				<div class="kbox">
					<div class="mono">Two Pair: 2592/16215 ≈ 15,985%</div>
					<div class="mono">Drilling: 1854/16215 ≈ 11,434%</div>
					<div class="mono">Full House: 165/16215 ≈ 1,018%</div>
					<div class="mono">Vierling: 45/16215 ≈ 0,278%</div>
					<div class="mono">Bleibt Paar: 11559/16215 ≈ 71,286%</div>
				</div>
				<p class="muted"><i>Story-Hook:</i> "Sieben von zehn Mal bleib ich beim Paar."</p>
			</div>
		</section>

		<section class="task">
			<figure class="exampleFigure">
				<ImageZoomer no-zoom  title="Beispielhand: Zwei Paare">
					<PGHand
						:cards="[
							{ code: '4c', suit: 'Kreuz', rank: 4 },
							{ code: '4h', suit: 'Herz',  rank: 4 },
							{ code: 'Ks', suit: 'Pik',   rank: 'König' },
							{ code: 'Kd', suit: 'Karo',  rank: 'König' }
						]"
					/>
				</ImageZoomer>
			</figure>
			<h3>Aufgabe 2 - Zwei Paare: Zieh ich 1 Karte oder bleib ich stehen?</h3>
			<div class="eddie">
				<p>
					<b>Situation:</b> Eddie hat zwei Paare plus Kicker,
					wirft den Kicker weg und zieht <b>1 Karte</b>.
				</p>
				<p><b>Frage:</b> Wie wahrscheinlich wird daraus ein Full House?</p>
				<div class="kbox">
					<p class="mono">
						Ziehbare Karten: <Katex inline tex="52-5=47" /> (nicht 48), denn die 5. Handkarte wurde abgeworfen.
						Outs: 2 Könige + 2 Vieren = 4 von 47
					</p>
					<Katex as="div" display tex="P(\text{Full House})=\frac{4}{47}\approx 8{,}51\%" />
				</div>
			</div>
		</section>

		<section class="task">
			<h3>Aufgabe 3 - Vier Karten zum Flush: Wie gut ist der 1-Karten-Draw?</h3>
			<div class="eddie">
				<p>
					<b>Situation:</b> Eddie hat 4 Karten einer Farbe und zieht <b>1 Karte</b>.
				</p>
				<p><b>Frage:</b> Wie oft trifft sie den Flush?</p>
				<div class="kbox">
					<p class="mono">Ziehbare Karten: <Katex inline tex="52-5=47" />, davon 9 in der gesuchten Farbe.</p>
					<Katex as="div" display tex="P(\text{Flush})=\frac{9}{47}\approx 19{,}15\%" />
				</div>
			</div>
		</section>

		<section class="task">
			<h3>Aufgabe 4 - Vier Karten zur Strasse: Open-Ended vs. Gutshot</h3>
			<div class="eddie">
				<p>
					<b>Situation:</b> Eddie hat 4 Karten zur Strasse und zieht <b>1 Karte</b>.
				</p>
				<ul>
					<li>Open-ended Draw, z.B. 6-7-8-9 (es fehlt 5 oder 10)</li>
					<li>Gutshot Draw, z.B. 6-7-9-10 (es fehlt 8)</li>
				</ul>
				<div class="kbox">
					<p class="mono">Auch hier gilt beim 1-Karten-Draw: <Katex inline tex="52-5=47" /> ziehbare Karten.</p>
					<Katex as="div" display tex="P(\text{Straight, open-ended})=\frac{8}{47}\approx 17{,}02\%" />
					<Katex as="div" display tex="P(\text{Straight, gutshot})=\frac{4}{47}\approx 8{,}51\%" />
				</div>
			</div>
		</section>

		<section class="task">
			<figure class="exampleFigure">
				<ImageZoomer title="Eddie Pokerqueen">
					<img loading="lazy" :src="eddieImg" />
				</ImageZoomer>
			</figure>
			<h3 id="bayes">Aufgabe 5 - Bayes aus Ziehzahl: Gegner zieht 1 Karte</h3>
			<div class="eddie">
				<p>
					<b>Modellannahme (vereinfacht):</b>
				</p>
				<ul>
					<li>Wer Two Pair hat, zieht genau 1 Karte (auf Full House).</li>
					<li>Wer 4-Flush hat, zieht genau 1 Karte (auf Flush).</li>
					<li>Andere Hände ziehen in diesem Modell nicht genau 1 Karte.</li>
				</ul>
				<p>
					<b>Beobachtung:</b> Gegner zieht 1 Karte.
					Gesucht ist <Katex inline tex="P(\text{Two Pair}\mid \text{zieht 1})" />.
				</p>
				<div class="kbox">
					<Katex as="div" display tex="P(\text{Two Pair})=\frac{123{.}552}{2{.}598{.}960}\approx 4{,}754\%" />
					<Katex as="div" display tex="N(\text{4-Flush})=4\cdot \binom{13}{4}\cdot 39=111{.}540" />
					<Katex as="div" display tex="P(\text{4-Flush})=\frac{111{.}540}{2{.}598{.}960}\approx 4{,}292\%" />
					<Katex as="div" display tex="P(\text{Two Pair}\mid 1)\approx 0{,}5255" />
				</div>
				<p class="mono">Also: ca. 52,6% Two Pair vs. 47,4% 4-Flush.</p>
			</div>
		</section>

		<section class="task">
			<h3>Aufgabe 6 - Bluff-Mathe: Wie oft muss er funktionieren?</h3>
			<div class="eddie">
				<p>
					<b>Situation:</b> Nach dem Draw ist der Pot <Katex inline tex="P" />.
					Eddie blufft mit Einsatz <Katex inline tex="B" />.
				</p>
				<p><b>Frage:</b> Welche Mindest-Foldrate <Katex inline tex="f" /> braucht sie für Break-even?</p>
				<div class="kbox">
					<Katex as="div" display tex="f\cdot P-(1-f)\cdot B=0\Rightarrow f=\frac{B}{P+B}" />
					<Katex as="div" display tex="P=20,\;B=10\Rightarrow f=\frac{10}{30}=\frac{1}{3}\approx 33{,}3\%" />
				</div>
			</div>
		</section>

		<section class="task">
			<h3 id="ev">Aufgabe 7 - EV statt Bauchgefühl: Welche Linie ist besser?</h3>
			<div class="eddie">
				<p>
					<b>Situation:</b> Eddie hat ein Paar und kann wählen:
				</p>
				<ul>
					<li>Linie A: 3 Karten ziehen (klassisch)</li>
					<li>Linie B: 0 ziehen (stehen bleiben), um Stärke zu repräsentieren</li>
				</ul>
				<p>
					Gegner callt nach dem Draw nur ab Two Pair.
				</p>
				<div class="kbox">
					<Katex
						as="div"
						display
						tex="P(\text{Two Pair oder besser})\approx 15{,}985\%+11{,}434\%+1{,}018\%+0{,}278\%=28{,}715\%"
					/>
				</div>
				<ol>
					<li>Nutze diese Wahrscheinlichkeit für Linie A.</li>
					<li>Linie B gewinnt nur über Folds.</li>
					<li>Setze Pot, Bet und Calling-Range ein und vergleiche den EV.</li>
					<li>Optional: Monte-Carlo-Simulation als Check.</li>
				</ol>
			</div>
		</section>
	</template>
	<template #interactivePart>
		<PG_Game/>
	</template>

	<template #footer>
		<p class="muted">
			<a href="https://github.com/goldfire/pokersolver">Thanks to James Simpson and GoldFire Studios, Inc. for their Poker Solver (MIT License)</a>
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import titleImg from "@/images/PG.webp";
import eddieImg from "@/images/PG_Eddie.webp";
import PG_Game from "./PG_Game.vue";
import PokerCard from "./PG_Card.vue";
import PGHand from "./PG_Hand.vue";
</script>

<style scoped>
.task {
  margin-top: 14px;
}

.miniPair {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0 4px;
  vertical-align: middle;
}
</style>
