<template>
<AppFrame
	short="SE"
	:sub-chapter="{
		'kleine-einschlafubungen': 'Kleine Einschlafübungen',
		'muster-statt-grubeln': 'Muster statt Grübeln'
	}"
	title="Eddie rechnet: Gute-Nacht-Rechenroutine"
>

	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="`Eddie`">
				<img alt="Eddie rechnet" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>

		<h2 id="muster-statt-grubeln">Worum geht's?</h2>
		<div class="eddie">
			<p>
				Die Idee ist simpel: kurze, abgeschlossene Rechenmuster beruhigen den Kopf besser als
				endloses Gedankenkreisen. Statt „noch schnell scrollen“ machst du zwei bis vier kleine
				Mathe-Schritte und hörst dann bewusst auf.
			</p>
			<p>
				Diese Seite nimmt die Inhalte aus <em>Gute-Nacht-Rechenroutine (Wanderhütte-Edition)</em>
				auf und macht daraus Mini-Übungen für den Abend.
			</p>
		</div>

		<h2 id="kleine-einschlafubungen" class="mt-8">Die 12 Rituale</h2>
		<div class="eddie">
			<v-expansion-panels variant="accordion">
				<v-expansion-panel v-for="item in routines" :key="item.id">
					<v-expansion-panel-title>{{ item.title }}</v-expansion-panel-title>
					<v-expansion-panel-text class="d-flex flex-column ga-2">
						<div>{{ item.text }}</div>
					</v-expansion-panel-text>
				</v-expansion-panel>
			</v-expansion-panels>
		</div>
	</template>

	<template #interactivePart>
		<h2>Mini-Übungsmodus</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p>
				Wähle einen Modus, rechne eine Aufgabe und höre nach einer richtigen Lösung auf.
				Genau das ist die Routine.
			</p>
			<v-select
				v-model="mode"
				class="w-100"
				hide-details="auto"
				item-title="label"
				item-value="value"
				:items="modes"
				label="Übungsmodus"
			/>
			<div class="d-flex flex-wrap ga-3 align-center w-100 px-2">
				<v-btn color="primary" variant="flat" @click="nextExercise">Neue Übung</v-btn>
				<v-btn variant="tonal" @click="revealSolution = !revealSolution">
					{{ revealSolution ? "Lösung ausblenden" : "Lösung zeigen" }}
				</v-btn>
			</div>

			<v-sheet v-if="exercise" class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium">{{ exercise.title }}</div>
				<div class="mt-1">{{ exercise.prompt }}</div>
				<div class="muted mt-1">{{ exercise.hint }}</div>
			</v-sheet>

			<v-radio-group v-if="exercise" v-model="selectedOption" class="mt-1">
				<v-radio
					v-for="opt in exercise.options"
					:key="opt.id"
					:label="opt.label"
					:value="opt.id"
				/>
			</v-radio-group>

			<div class="d-flex flex-wrap ga-3">
				<v-btn color="primary"
					:disabled="!exercise || !selectedOption"
					variant="flat"
					@click="checkAnswer"
				>
					Prüfen
				</v-btn>
				<v-btn variant="text" @click="resetChoice">Auswahl löschen</v-btn>
			</div>

			<v-alert v-if="feedback" :type="feedback.ok ? 'success' : 'warning'" variant="tonal">
				{{ feedback.text }}
			</v-alert>
		</div>
	</template>

	<template #calculationPart>
		<h2>Rechendetails</h2>
		<div class="eddie d-flex flex-column ga-3">
			<v-sheet v-if="exercise" class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">Lösungsweg</div>
				<div class="mono mb-2">{{ exercise.formula }}</div>
				<div v-for="(line, idx) in exercise.steps" :key="idx" class="mono">{{ line }}</div>
			</v-sheet>

			<v-sheet v-if="exercise && revealSolution" class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">Direkte Lösung</div>
				<div class="mono">Richtig ist: {{ correctLabel }}</div>
			</v-sheet>
		</div>
	</template>
</AppFrame>
</template>

<script setup>
/* eslint-disable vue/max-len */
import { computed, ref } from "vue";
import titleImg from "@/images/SE.webp";

const routines = [
	{
		id:    1,
		title: "1. Dreieckszahlen-Atemzug",
		text:  "Stell dir vor, du zählst kleine Steine aufeinander. Erst einen, dann in der nächsten Reihe zwei, dann drei – so entstehen Dreiecke aus Punkten. Beim Einatmen sagst du leise „eins“, beim Ausatmen „eins plus zwei gleich drei“. So gehst du Schritt für Schritt weiter: 1, 1+2=3, 1+2+3=6 und so fort. Nach zehn Reihen bist du bei 55 angekommen – eine runde, beruhigende Zahl. Das ist der Punkt, an dem du stoppst und dir sagst: „Genug gebaut, jetzt schlafe ich.“"
	},
	{
		id:    2,
		title: "2. Paar-Summen bis 100",
		text:  "Die alte Gauss-Trickaufgabe: 1+99, 2+98, 3+97. Jedes Paar gibt 100, und es sind genau 50 solcher Paare. Du brauchst nicht alle wirklich zu addieren, es reicht, das Muster zu erkennen. Das Schöne ist: Aus einem scheinbar endlosen Zählen wird eine einfache Abkürzung. Und während du dir denkst „50 mal 100 = 5000“, merkst du, wie sich dein Atem beruhigt. Der Gedanke ist abgeschlossen – Zeit zum Einschlafen."
	},
	{
		id:    3,
		title: "3. Fibonacci-Schlafleiter",
		text:  "Die Fibonacci-Zahlen beginnen harmlos: 1, 1, 2, 3, 5, 8 … Immer addiert man die letzten beiden, um die nächste zu bekommen. Stell dir die Reihe als Leiter vor, deren Sprossen immer ein kleines bisschen weiter auseinanderliegen. Bis 21 kommst du locker hoch, danach wird’s anstrengend. Also hörst du bei 21 auf und stellst dir vor, wie du dich auf dieser Sprosse einfach hinlegst. Von hier aus kannst du in den Schlaf rutschen."
	},
	{
		id:    4,
		title: "4. Geräusch-Wahrscheinlichkeit",
		text:  "Alle paar Minuten knackst ein Ast draußen – das kann einen wachhalten. Also dreh den Spieß um und rechne dir die Chancen aus: Wenn die Wahrscheinlichkeit bei 20 % liegt, in einer Minute etwas zu hören, wie groß ist die Chance auf Stille in den nächsten fünf Minuten? Du multiplizierst 0,8×0,8×0,8×0,8×0,8 = etwa 0,33. Das heißt: Ein Drittel der Zeit ist es einfach nur still. Diese Erkenntnis lässt dich loslassen: Stille ist nichts Besonderes, sondern der Normalfall."
	},
	{
		id:    5,
		title: "5. Uhrenmodulo",
		text:  "Nimm jedes Knacken im Wald wie den Schlag einer Uhr. Du zählst 0, 3, 6, 9, 12 – und wieder zurück bei 0. Das Prinzip nennt sich „modulo“, aber du musst es gar nicht kompliziert verstehen: Es ist nur ein Zählen im Kreis. Jedes Geräusch bringt dich einen Schritt weiter, bis du nach vier, fünf Schritten wieder am Anfang bist. Das macht den Wald berechenbar, wie ein Ticken. Und wenn der Kreis geschlossen ist, darfst du dich im Schlafsack umdrehen."
	},
	{
		id:    6,
		title: "6. Prim-Picknick",
		text:  "Primzahlen sind wie die unteilbaren Beeren im Wald – sie lassen sich nur durch sich selbst und durch 1 „pflücken“. Fang bei 2 an: 2, 3, 5, 7, 11, 13. Sag sie langsam und stell dir kleine Körbchen vor, in die du sie legst. Ganz wichtig: Die 1 kommt nicht ins Körbchen, sie gehört nicht dazu. Nach einer Handvoll Primzahlen hörst du auf – das Spiel ist nicht unendlich. Die Körbchen stehen nun da, und du darfst die Augen schließen."
	},
	{
		id:    7,
		title: "7. Bretter im Dach – Rechteckzahlen",
		text:  "Schau an die Dachbalken der Hütte. Stell dir vor, sie bilden ein Gitter mit vier Reihen und drei Spalten. Wie viele Rechtecke kannst du darin finden? Das klingt riesig, aber es gibt einen Trick: Du wählst zwei horizontale Linien und zwei vertikale Linien aus – und schon ist ein Rechteck bestimmt. Mit fünf Linien horizontal und vier vertikal gibt das 10×6=60 Rechtecke. 60 klingt ordentlich, vollständig – danach ist der Gedanke abgeschlossen."
	},
	{
		id:    8,
		title: "8. Grauzahl-Gähnen (Gray Code)",
		text:  "Der Gray Code ist eine Reihenfolge von Binärzahlen, bei der sich immer nur eine Ziffer ändert. Fang mit 0000 an, dann 0001, 0011, 0010, 0110. Stell dir vor, du schaltest kleine Lampen an und aus, aber nie mehr als eine gleichzeitig. Das ergibt ein gleichmäßiges, fast hypnotisches Blinken. Nach vier oder fünf Schritten reicht es völlig, du musst nicht alle durchgehen. Das „Flip-Flop“ beruhigt den Kopf – Zeit für ein Gähnen."
	},
	{
		id:    9,
		title: "9. Quadratsummen-Atemzug",
		text:  "Zähle im Kopf die ersten Quadratzahlen: 1²=1, 2²=4, 3²=9, 4²=16. Zusammen sind das 30. Sag es dir beim Einatmen und Ausatmen, als ob du die Zahlen an der Hüttenwand aufmalst. Wenn du magst, denk an die Formel, die solche Summen in einem Zug berechnet – aber zwing dich nicht. Wichtig ist nur: Die Reihe hat ein klares Ende, und mit ihm dein Gedankengang. Fertig, Augen zu."
	},
	{
		id:    10,
		title: "10. Wald-Markierungen (Kombinatorik-Bild)",
		text:  "Stell dir sechs Bäume im Kreis vor. Du verbindest jeden Baum mit jedem anderen durch eine Linie. Am Ende hast du 15 Verbindungen – das kannst du dir wie ein Netz aus Spinnfäden vorstellen. Zuerst ist es wirr, aber dann merkst du: Es sind genau so viele, wie es sein sollen, nicht mehr und nicht weniger. Und wenn du magst, kannst du die Linien langsam im Kopf ausradieren. Zurück bleiben nur die Bäume und die Stille."
	},
	{
		id:    11,
		title: "11. Euler-Spaziergang",
		text:  "Stell dir die Hütte als Punkte und Verbindungen vor: Türen, Fenster, Balken. Ein „Spaziergang“ bedeutet, jede Verbindung genau einmal zu gehen. Mach dir eine kleine Regel: maximal drei Schritte, dann ist Schluss. So bleibst du im Leichten, im Überschaubaren. Du kannst dich dabei wie auf einem Brettspiel fühlen, das nach drei Zügen automatisch endet. Und wenn es endet, ist das dein Signal: Schlafenszeit."
	},
	{
		id:    12,
		title: "12. Mini-Arithmetik-Kette",
		text:  "Starte bei 100 und zieh Schritt für Schritt kleinere Zahlen ab: minus 7, minus 6, minus 5 … bis du bei 72 landest. Jede Rechnung ist wie ein kleiner Stein, der ins Wasser plumpst. Du hörst es noch, aber nach dem letzten Stein wird es ruhig. 72 ist deine Endstation, da steigst du aus. Kein Weiterrechnen, kein Neuanfang. Einfach 72 nehmen – und wegdösen."
	}
];

const modes = [
	{ label: "Mix", value: "mix" },
	{ label: "Dreieckszahlen", value: "tri" },
	{ label: "Gauss-Paare", value: "gauss" },
	{ label: "Fibonacci", value: "fib" },
	{ label: "Stille-Wahrscheinlichkeit", value: "silence" },
	{ label: "Modulo-Uhr", value: "mod" }
];

const mode = ref( "mix" );
const exercise = ref( null );
const selectedOption = ref( "" );
const revealSolution = ref( false );
const feedback = ref( null );

function randInt( min, max ) {
	return min + Math.floor( Math.random() * ( max - min + 1 ) );
}

function shuffle( arr ) {
	const a = [ ...arr ];

	for ( let i = a.length - 1; i > 0; i-- ) {
		const j = Math.floor( Math.random() * ( i + 1 ) );
		[ a[ i ], a[ j ] ] = [ a[ j ], a[ i ] ];
	}

	return a;
}

function mkOptions(
	correct, candidates, suffix = ""
) {
	const uniq = [];

	for ( const c of [ correct, ...candidates ] ) {
		const val = Number( c );

		if ( !Number.isFinite( val ) ) {
			continue;
		}

		if ( uniq.some( ( x ) => Math.abs( x - val ) < 1e-9 ) ) {
			continue;
		}

		uniq.push( val );

		if ( uniq.length === 4 ) {
			break;
		}
	}

	while ( uniq.length < 4 ) {
		uniq.push( correct + uniq.length + 1 );
	}

	return shuffle( uniq ).map( ( n, idx ) => ( {
		id:    String( idx + 1 ),
		value: n,
		label: `${Number.isInteger( n ) ? n : n.toFixed( 1 ).replace( ".", "," )}${suffix}`
	} ) );
}

function makeTriangleExercise() {
	const n = randInt( 6, 15 );
	const correct = n * ( n + 1 ) / 2;
	const options = mkOptions( correct, [ correct - n, correct + n, correct + 2 * n ] );
	return {
		title:   "Dreieckszahlen-Atemzug",
		prompt:  `Berechne die Summe 1 + 2 + ... + ${n}.`,
		hint:    "Nutze die Formel n(n+1)/2.",
		formula: `S = n(n+1)/2 mit n=${n}`,
		steps:   [
			`${n} · ${n + 1} = ${n * ( n + 1 )}`,
			`${n * ( n + 1 )} / 2 = ${correct}`
		],
		options,
		correctValue: correct
	};
}

function makeGaussExercise() {
	const n = [ 39, 59, 79, 99 ][ randInt( 0, 3 ) ];
	const correct = n * ( n + 1 ) / 2;
	const pairSum = n + 1;
	const pairs = ( n - 1 ) / 2;
	const middle = ( n + 1 ) / 2;
	const options = mkOptions( correct, [ correct - pairSum, correct + pairSum, correct + middle ] );
	return {
		title:   "Paar-Summen (Gauss)",
		prompt:  `Bestimme 1 + 2 + ... + ${n}.`,
		hint:    `Paare bilden: (1+${n}), (2+${n - 1}), ...`,
		formula: `S = ${pairs}·${pairSum} + ${middle}`,
		steps:   [
			`${pairs} Paare mit Summe ${pairSum}: ${pairs} · ${pairSum} = ${pairs * pairSum}`,
			`Mittelzahl addieren: ${pairs * pairSum} + ${middle} = ${correct}`
		],
		options,
		correctValue: correct
	};
}

function makeFibonacciExercise() {
	const seq = [ 1, 1, 2, 3, 5, 8, 13, 21, 34, 55 ];
	const idx = randInt( 2, 6 );
	const a = seq[ idx ];
	const b = seq[ idx + 1 ];
	const c = seq[ idx + 2 ];
	const correct = b + c;
	const options = mkOptions( correct, [ correct - b, correct + a, correct + 2 ] );
	return {
		title:        "Fibonacci-Schlafleiter",
		prompt:       `Wie geht die Folge weiter: ${a}, ${b}, ${c}, ?`,
		hint:         "Die nächste Zahl ist immer Summe der letzten beiden.",
		formula:      `nächste = ${b} + ${c}`,
		steps:        [ `${b} + ${c} = ${correct}` ],
		options,
		correctValue: correct
	};
}

function makeSilenceExercise() {
	const p = [ 0.1, 0.15, 0.2, 0.25, 0.3 ][ randInt( 0, 4 ) ];
	const m = randInt( 3, 6 );
	const q = 1 - p;
	const correct = Math.round( Math.pow( q, m ) * 1000 ) / 10;
	const options = mkOptions(
		correct, [ correct - 4.5, correct + 3.5, correct + 8.0 ], " %"
	);
	return {
		title:   "Geräusch-Wahrscheinlichkeit",
		prompt:  `Pro Minute ist die Geräuschwahrscheinlichkeit ${Math.round( p * 100 )} %. Wie groß ist die Chance auf durchgehende Stille in ${m} Minuten?`,
		hint:    "Für Stille pro Minute gilt (1-p). Für mehrere Minuten multiplizieren.",
		formula: `P(Stille) = (1-${p})^${m}`,
		steps:   [
			`pro Minute Stille: ${q.toFixed( 2 )}`,
			`${q.toFixed( 2 )}^${m} = ${ Math.pow( q, m ).toFixed( 4 )}`,
			`in Prozent: ${correct.toFixed( 1 ).replace( ".", "," )} %`
		],
		options,
		correctValue: correct,
		suffix:       "%"
	};
}

function makeModuloExercise() {
	const step = [ 3, 4, 5, 7 ][ randInt( 0, 3 ) ];
	const k = randInt( 4, 10 );
	const mod = 12;
	const correct = step * k % mod;
	const options = mkOptions( correct, [ ( correct + step ) % mod, ( correct + 6 ) % mod, ( correct + 9 ) % mod ] );
	return {
		title:        "Uhrenmodulo",
		prompt:       `Starte bei 0 und zähle in ${step}-Schritten modulo 12. Wo landest du nach ${k} Schritten?`,
		hint:         "Rechne (Schrittweite · Schritte) mod 12.",
		formula:      `(${step} · ${k}) mod 12`,
		steps:        [ `${step * k} mod 12 = ${correct}` ],
		options,
		correctValue: correct
	};
}

function buildExercise( kind ) {
	const generators = {
		tri:     makeTriangleExercise,
		gauss:   makeGaussExercise,
		fib:     makeFibonacciExercise,
		silence: makeSilenceExercise,
		mod:     makeModuloExercise
	};

	if ( kind !== "mix" && generators[ kind ] ) {
		return generators[ kind ]();
	}

	const all = Object.values( generators );
	return all[ randInt( 0, all.length - 1 ) ]();
}

function nextExercise() {
	exercise.value = buildExercise( mode.value );
	selectedOption.value = "";
	feedback.value = null;
	revealSolution.value = false;
}

function resetChoice() {
	selectedOption.value = "";
	feedback.value = null;
}

function checkAnswer() {
	if ( !exercise.value || !selectedOption.value ) {
		return;
	}

	const selected = exercise.value.options.find( ( o ) => o.id === selectedOption.value );
	const ok = selected && Math.abs( selected.value - exercise.value.correctValue ) < 1e-9;
	feedback.value = {
		ok,
		text: ok ?
			"Genau. Das reicht für heute - Muster erkannt, Kopf aus." :
			"Noch nicht. Schau in den Lösungsweg und rechne einmal ruhig nach."
	};
}

const correctLabel = computed( () => {
	if ( !exercise.value ) {
		return "–";
	}

	const item = exercise.value.options.find( ( o ) => Math.abs( o.value - exercise.value.correctValue ) < 1e-9 );
	return item?.label || String( exercise.value.correctValue );
} );

nextExercise();
</script>

<style scoped>
.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
}
</style>
