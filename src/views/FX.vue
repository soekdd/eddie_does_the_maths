<template>
<AppFrame
	:sub-chapter="{
		'geschichte': 'Geschichte',
		'basic-denke': 'BASIC-Denke',
		'interaktiver-rechner': 'Interaktiver Rechner'
	}"
	title="Eddie rechnet: Der fx-7000G"
>

	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer title="Eddie feiert ihren fx-7000G">
				<img loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>

		<h2 id="geschichte">Teil 1 — Warum der fx-7000G spannend ist</h2>
		<div class="eddie">
			<p>
				Stell dir 1985 vor: Du bist ein Kind in der DDR, Computer kennst du nur aus der Ferne,
				aus Erzaehlungen, vielleicht aus einer Zeitschrift. Und plötzlich
				liegt da etwas in der Hand, das man <b>programmieren</b> kann: der <b>Casio fx-7000G</b>.
			</p>
			<p>
				Auch im Westen war das ein Meilenstein: ein früher grafikfähiger Rechner für die Tasche,
				der BASIC und Grafik zusammenbrachte. Nicht nur rechnen, sondern denken in Schritten:
				<b>Problem zerlegen</b>, Variablen setzen, prüfen, verbessern.
			</p>
			<p>
				Die Daten waren für die Zeit stark: Matrix-Display mit <b>96x64 Pixel</b>,
				<b>78 Zahlenspeicher</b>, <b>422 Zeichen Programmspeicher</b>.
				Und der Preis von etwa <b>300 DM</b>&nbsp;(kaufkraftbereinigt, heute etwa 330 €) war fuer diese Funktionsfülle erstaunlich niedrig.
			</p>
		</div>

		<h2 id="basic-denke" class="mt-8">Teil 2 — Eddie-Workflow auf dem Rechner</h2>
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
				<div v-for="(line, idx) in miniProgram" :key="idx" class="mono">{{ line }}</div>
			</div>
			<p class="muted">
				Merksatz: Erst kleine, sichere Bausteine. Dann erst große Programme.
			</p>
		</div>

		<h2>Teil 5 — Eddie-Spickzettel</h2>
		<div class="eddie d-flex flex-column ga-3">
			<v-sheet border class="pa-3" rounded="lg">
				<div class="text-subtitle-1 font-weight-medium mb-2">Schneller Start</div>
				<ol class="mb-0">
					<li><code class="mono">RUN</code> für direkte Rechnungen nutzen.</li>
					<li>Bei mehreren Schritten in <code class="mono">BASIC</code> wechseln.</li>
					<li>Mit kleinen Testwerten prüfen, dann erst „echte“ Daten einsetzen.</li>
					<li>Bei Chaos: <code class="mono">Reset</code>, dann sauber neu aufsetzen.</li>
				</ol>
			</v-sheet>

			<v-sheet border class="pa-3" rounded="lg">
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
		<h2 id="interaktiver-rechner"> Interaktiv: fx-7000G ausprobieren</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p>
				Leider darf ich nicht den echten fx-700G zeigen. Casio hält eifersüchtig am Copyright fest.
				Daher habe ich hier nur die Programmierfähigkeit des fx-7000G und die grundlegenden Funktionen simuliert.
			</p>
			<v-alert type="info" variant="tonal">
				Tipp: Starte mit dem Demo-Programm, ändere dann nur eine Zeile und beobachte den Effekt.
			</v-alert>
		</div>
		<FX_7000G />
	</template>

	<template #footer>
		<p class="muted">
			<a href="https://github.com/Krevo/CasioBasicInterpreter">Thanks to Krevo for his CasioBasicInterpreter (BSD License)</a>
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import FX_7000G from "./FX_7000G.vue";
import titleImg from "@/images/FX.webp";

const miniProgram = [
	"Cls",
	"Locate 1,1,\"ZAHL?\"",
	"?->A",
	"Locate 1,3,\"A^2=\"",
	"Locate 6,3,A^2",
	"Locate 1,4,\"sqrt(A)=\"",
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
