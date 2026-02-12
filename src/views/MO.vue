<template>
<AppFrame>
	<template #title>
		<div class="badge">O1</div>
		<div>
			<h1>Eddie rechnet: IMO 1985 Aufgaben Übersicht</h1>
			<p class="sub">A1 • A2 • A3 • B1 • B2 • B3</p>
		</div>
	</template>

	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="`Eddie`">
				<img alt="Eddie rechnet" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h2>IMO 1985 – Aufgaben</h2>
		<p class="meta">
			Nur die Aufgaben (keine Lösungen). Quelle:
			<a href="https://prase.cz/kalva/imo/imo85.html" rel="noreferrer" target="_blank">
				prase.cz/kalva/imo/imo85.html
			</a>
		</p>

		<section class="problem">
			<div class="problem-head">
				<h3>A1</h3>
				<RouterLink class="task-link" to="/O1">Zur Aufgabe O1</RouterLink>
			</div>
			<p>
				Ein Kreis hat seinen Mittelpunkt auf der Seite <Katex inline tex="AB" /> des Sehnenvierecks
				<Katex inline tex="ABCD" />. Die drei anderen Seiten berühren den Kreis (sind Tangenten an ihn).
				Beweise:
				<Katex inline tex="AD + BC = AB" />.
			</p>
		</section>

		<section class="problem">
			<div class="problem-head">
				<h3>A2</h3>
				<RouterLink class="task-link" to="/O2">Zur Aufgabe O2</RouterLink>
			</div>
			<p>
				Seien <Katex inline tex="n" /> und <Katex inline tex="k" /> teilerfremde positive ganze Zahlen mit
				<Katex inline tex="k&lt;n" />. Jede Zahl aus der Menge
				<Katex inline tex="M=\{1,2,3,\dots,n-1\}" />
				wird entweder blau oder weiß gefärbt.
			</p>
			<ul>
				<li>
					Für jedes <Katex inline tex="i\in M" /> haben <Katex inline tex="i" /> und
					<Katex inline tex="n-i" /> dieselbe Farbe.
				</li>
				<li>
					Für jedes <Katex inline tex="i\in M" /> mit <Katex inline tex="i\ne k" /> haben
					<Katex inline tex="i" /> und <Katex inline tex="\lvert i-k\rvert" /> dieselbe Farbe.
				</li>
			</ul>
			<p>
				Beweise, dass alle Zahlen in <Katex inline tex="M" /> dieselbe Farbe haben müssen.
			</p>
		</section>

		<section class="problem">
			<div class="problem-head">
				<h3>A3</h3>
				<RouterLink class="task-link" to="/O3">Zur Aufgabe O3</RouterLink>
			</div>
			<p>
				Für ein Polynom
				<Katex inline tex="P(x)=a_0+a_1x+\dots+a_kx^k" />
				mit ganzzahligen Koeffizienten bezeichne <Katex inline tex="o(P)" /> die Anzahl der ungeraden
				Koeffizienten von <Katex inline tex="P" />. Für <Katex inline tex="i=0,1,2,\dots" /> sei
				<Katex inline tex="Q_i(x)=(1+x)^i" />.
			</p>
			<p>
				Beweise: Sind <Katex inline tex="i_1,i_2,\dots,i_n" /> ganze Zahlen mit
				<Katex inline tex="0\le i_1&lt;i_2&lt;\dots&lt;i_n" />, dann gilt
			</p>
			<Katex
				tex="o\!\bigl(Q_{i_1}+Q_{i_2}+\dots+Q_{i_n}\bigr)\;\ge\;o\!\bigl(Q_{i_1}\bigr)."
			/>
		</section>

		<section class="problem">
			<div class="problem-head">
				<h3>B1</h3>
				<RouterLink class="task-link" to="/O4">Zur Aufgabe O4</RouterLink>
			</div>
			<p>
				Gegeben ist eine Menge <Katex inline tex="M" /> aus <Katex inline tex="1985" /> paarweise
				verschiedenen positiven ganzen Zahlen, von denen keine einen Primteiler größer als
				<Katex inline tex="23" /> besitzt.
			</p>
			<p>
				Beweise, dass <Katex inline tex="M" /> eine Teilmenge aus <Katex inline tex="4" /> Elementen enthält,
				deren Produkt eine vierte Potenz einer ganzen Zahl ist.
			</p>
		</section>

		<section class="problem">
			<div class="problem-head">
				<h3>B2</h3>
				<RouterLink class="task-link" to="/O5">Zur Aufgabe O5</RouterLink>
			</div>
			<p>
				Ein Kreis mit Mittelpunkt <Katex inline tex="O" /> geht durch die Eckpunkte
				<Katex inline tex="A" /> und <Katex inline tex="C" /> des Dreiecks <Katex inline tex="ABC" /> und
				schneidet die Strecken <Katex inline tex="AB" /> bzw. <Katex inline tex="BC" /> ein zweites Mal in
				den (verschiedenen) Punkten <Katex inline tex="K" /> bzw. <Katex inline tex="N" />.
			</p>
			<p>
				Die Umkreise der Dreiecke <Katex inline tex="ABC" /> und <Katex inline tex="KBN" /> schneiden sich
				in genau zwei verschiedenen Punkten <Katex inline tex="B" /> und <Katex inline tex="M" />.
				Beweise, dass der Winkel <Katex inline tex="\angle OMB" /> ein rechter Winkel ist, also
				<Katex inline tex="\angle OMB = 90^\circ" />.
			</p>
		</section>

		<section class="problem">
			<div class="problem-head">
				<h3>B3</h3>
				<RouterLink class="task-link" to="/O6">Zur Aufgabe O6</RouterLink>
			</div>
			<p>
				Für jede reelle Zahl <Katex inline tex="x_1" /> wird eine Folge
				<Katex inline tex="x_1,x_2,\dots" /> definiert durch
			</p>
			<Katex tex="x_{n+1}=x_n\left(x_n+\frac{1}{n}\right)\quad (n=1,2,3,\dots)." />
			<p>
				Beweise, dass es genau einen Startwert <Katex inline tex="x_1" /> gibt, für den für alle
				<Katex inline tex="n" /> gilt:
				<Katex inline tex="0&lt;x_n&lt;x_{n+1}&lt;1" />.
			</p>
		</section>
	</template>

	<template #footer>
		<p class="muted">
			Quellen (zum Nachlesen): AoPS Wiki (IMO 1985 Problem 1-6) und die offiziellen ISL-Solutions (prase.cz).
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import titleImg from "@/images/MO.webp";
</script>

<style scoped>
.wrap {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px 56px;
  line-height: 1.6;
}

.meta {
  margin: 8px 0 18px;
  opacity: 0.85;
}

.meta a {
  text-decoration: none;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.35);
}

.problem {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 14px;
  padding: 14px 14px 10px;
  margin: 14px 0;
}

.problem h3 {
  margin: 0 0 8px;
}

.problem-head {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.task-link {
  background: rgba(0, 0, 0, 0.86);
  border-radius: 999px;
  color: #fff;
  font-size: 0.88rem;
  padding: 6px 12px;
  text-decoration: none;
  white-space: nowrap;
}

.task-link:hover {
  background: rgba(0, 0, 0, 0.74);
}

.problem ul {
  margin: 8px 0 8px 18px;
}

.katex-block {
  margin: 10px 0;
  overflow-x: auto;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
