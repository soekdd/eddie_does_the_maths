<template>
<AppFrame warning>
	<template #title>
		<div class="badge">FX</div>
		<div>
			<h1>Eddie rechnet: Der fx-7000G</h1>
			<p class="sub">Geschichte • BASIC-Denke • Interaktiver Rechner</p>
		</div>
	</template>

	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="`Eddie`">
				<img alt="Eddie erklärt den fx-7000G" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>

		<h2>Teil 1 — Warum der fx-7000G spannend ist</h2>
		<div class="eddie">
			<p>
				Der <b>Casio fx-7000G</b> war Mitte der 1980er ein echter Meilenstein:
				ein früher grafikfähiger Taschenrechner, auf dem man nicht nur tippt,
				sondern systematisch denkt.
			</p>
			<p>
				Für mich ist das Gerät weniger Nostalgie und mehr Haltung:
				<b>Problem in Schritte zerlegen</b>, in Variablen gießen, Ergebnis prüfen, wiederholen.
			</p>
		</div>

		<h2 class="mt-8">Teil 2 — Eddie-Workflow auf dem Rechner</h2>
		<div class="eddie">
			<p>Wenn ich mit dem fx-7000G arbeite, nutze ich immer denselben Ablauf:</p>
			<ol>
				<li><b>Frage klären</b>: Was soll am Ende rauskommen?</li>
				<li><b>Daten setzen</b>: Werte in Variablen speichern.</li>
				<li><b>Regel bauen</b>: Formeln oder kleine BASIC-Schleifen definieren.</li>
				<li><b>Testen</b>: Mit einfachen Zahlen starten, dann variieren.</li>
			</ol>
			<p class="muted">
				So wird aus „rumprobieren“ ein reproduzierbarer Rechenweg.
			</p>
		</div>

		<h2 class="mt-8">Teil 3 — BASIC in 6 Zeilen</h2>
		<div class="eddie">
			<p>
				Das hier ist ein Mini-Muster: Eingabe lesen, Quadrat und Wurzel ausgeben.
				Genau dieses Schema steckt in vielen Schul- und Olympia-Helfern.
			</p>
			<div class="kbox">
				<div class="mono" v-for="(line, idx) in miniProgram" :key="idx">{{ line }}</div>
			</div>
			<p class="muted">
				Merksatz: Erst kleine, sichere Bausteine. Dann erst große Programme.
			</p>
		</div>

<h2>Teil 5 — Eddie-Spickzettel</h2>
		<div class="eddie d-flex flex-column ga-3">
			<v-sheet class="pa-3" rounded="lg" border>
				<div class="text-subtitle-1 font-weight-medium mb-2">Schneller Start</div>
				<ol class="mb-0">
					<li><code class="mono">RUN</code> für direkte Rechnungen nutzen.</li>
					<li>Bei mehreren Schritten in <code class="mono">BASIC</code> wechseln.</li>
					<li>Mit kleinen Testwerten prüfen, dann erst „echte“ Daten einsetzen.</li>
					<li>Bei Chaos: <code class="mono">Reset</code>, dann sauber neu aufsetzen.</li>
				</ol>
			</v-sheet>

			<v-sheet class="pa-3" rounded="lg" border>
				<div class="text-subtitle-1 font-weight-medium mb-2">Denkmuster</div>
				<v-table density="compact">
					<thead>
						<tr>
							<th>Muster</th>
							<th>Rechenidee</th>
							<th>Eddie-Satz</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="item in patterns" :key="item.title">
							<td class="mono">{{ item.title }}</td>
							<td class="mono">{{ item.logic }}</td>
							<td>{{ item.note }}</td>
						</tr>
					</tbody>
				</v-table>
			</v-sheet>
		</div>
	</template>

	<template #interactivePart>
		<h2> Interaktiv: fx-7000G ausprobieren</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p>
				Hier läuft ein fx-7000G-orientierter Emulator direkt im Browser.
				Du kannst Tasten drücken, BASIC-Text einfügen und Programme ausführen.
			</p>
			<v-alert type="info" variant="tonal">
				Tipp: Starte mit dem Demo-Programm, ändere dann nur eine Zeile und beobachte den Effekt.
			</v-alert>
		</div>
		<FX_7000G />
	</template>

	<template #footer>
		<p class="muted">
			Technik mit Interpreter-Skripten aus <code>public/casio/js</code>.
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import FX_7000G from "./FX_7000G.vue";
import titleImg from "@/images/FX.webp";

const miniProgram = [
	"Cls",
	'Locate 1,1,"ZAHL?"',
	"?->A",
	'Locate 1,3,"A^2="',
	"Locate 6,3,A^2",
	'Locate 1,4,"sqrt(A)="',
	"Locate 9,4,Sqrt A"
];

const patterns = [
	{
		title: "Eingabe -> Ergebnis",
		logic: "?->A | Formel(A)",
		note:  "Wenn der Weg kurz ist, bleibt der Kopf ruhig."
	},
	{
		title: "Wiederholung",
		logic: "For ... Next",
		note:  "Alles, was sich wiederholt, gehört in eine Schleife."
	},
	{
		title: "Fallunterscheidung",
		logic: "If ... Then",
		note:  "Jeder Ast braucht eine klare Bedingung."
	},
	{
		title: "Anzeige",
		logic: "Locate col,row,text",
		note:  "Gute Ausgaben sparen Debug-Zeit."
	}
];
</script>
