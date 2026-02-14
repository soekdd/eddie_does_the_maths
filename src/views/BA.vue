<template>
<AppFrame
	short="BA"
	:sub-chapter="{
		'casar': 'Cäsar',
		'vigenere': 'Vigenère',
		'c64-emulator': 'C64 Emulator'
	}"
	title="Eddie rechnet: BASIC for runaways"
>

	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="`Eddie`">
				<img alt="Eddie rechnet" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>

		<h2>Teil 1 — Cäsar &amp; Vigenère</h2>
		<div class="eddie">
			<p class="text-body-2 text-medium-emphasis">
				Zwei Klassiker: einmal „Alphabet verschieben“, einmal „Verschieben mit rotierendem Schlüssel“.
			</p>
		</div>

		<h2 class="mt-8">Teil 2 — Grundidee: Buchstaben als Zahlen</h2>
		<div class="eddie">
			<p class="mb-3">
				Wir arbeiten fast immer mit dem Alphabet <strong>A–Z</strong> und machen daraus Zahlen.
				Am beliebtesten ist:
			</p>

			<div class="kbox">
				<div class="text-subtitle-2 mb-2">Zuordnung</div>
				<div class="d-flex flex-wrap ga-2">
					<v-chip size="small" variant="tonal">A → 0</v-chip>
					<v-chip size="small" variant="tonal">B → 1</v-chip>
					<v-chip size="small" variant="tonal">…</v-chip>
					<v-chip size="small" variant="tonal">Z → 25</v-chip>
				</div>
			</div>

			<div class="kbox">
				<div class="text-subtitle-2 mb-2">Rechnen „im Kreis“</div>
				<div class="text-body-2">
					Nach Z kommt wieder A. Mathematisch ist das Rechnen <em>modulo 26</em>.
				</div>
				<div class="mt-2"
					v-html="katexBlock(String.raw`\text{Beispiel: } 25+3=28 \equiv 2 \pmod{26}\ \Rightarrow\ Z \xrightarrow{+3} C`)"
				>
				</div>
			</div>

			<v-divider class="my-4" />

			<p class="mb-0">
				Und ja: In echten Texten muss man vorher meist „aufräumen“:
				Großbuchstaben, Umlaute ersetzen (Ä→AE, Ö→OE, Ü→UE), Satzzeichen raus –
				oder man behandelt sie getrennt.
			</p>
		</div>

		<h2 id="casar" class="mt-8">Teil 3 — Cäsar-Verschlüsselung</h2>
		<div class="eddie">
			<p class="mb-3">
				Cäsar ist die Minimalversion: ein fester Shift <span class="font-weight-medium">k</span>.
				Jeder Buchstabe wird um <span class="font-weight-medium">k</span> Stellen weitergeschoben.
			</p>

			<div class="kbox"
				v-html="katexBlock(String.raw`
				\textbf{Verschlüsselung:}\quad C \equiv P + k \pmod{26}
				\\\\
				\textbf{Entschlüsselung:}\quad P \equiv C - k \pmod{26}
			`)"
			></div>

			<v-row>
				<v-col cols="12" md="6">
					<div class="kbox">
						<div class="text-subtitle-2 mb-2">Beispiel</div>
						<div class="text-body-2 mb-2">
							Klartext: <code>{{ caesarExample.plain }}</code> &nbsp;|&nbsp; Shift: <code>k={{ caesarExample.k }}</code>
						</div>

						<v-table density="compact">
							<thead>
								<tr>
									<th class="text-left">Buchstabe</th>
									<th class="text-left">Zahl</th>
									<th class="text-left">+k</th>
									<th class="text-left">Cipher</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(r, i) in caesarExample.rows" :key="i">
									<td><code>{{ r.p }}</code></td>
									<td><code>{{ r.pn }}</code></td>
									<td><code>{{ r.cn }}</code></td>
									<td><code>{{ r.c }}</code></td>
								</tr>
							</tbody>
						</v-table>

						<div class="mt-3 text-body-2">
							Ergebnis: <code>{{ caesarExample.cipher }}</code>
						</div>
					</div>
				</v-col>

				<v-col cols="12" md="6">
					<div class="kbox">
						<div class="text-subtitle-2 mb-2">Warum Cäsar oft schnell fällt</div>
						<ul class="text-body-2 mb-0">
							<li>Es gibt nur <strong>25</strong> sinnvolle Schlüssel (k=1…25).</li>
							<li>Man kann einfach alles durchprobieren („Bruteforce“).</li>
							<li>Oder man nutzt <strong>Häufigkeiten</strong>: E, N, I, R, S… treten oft auf.</li>
						</ul>
					</div>
				</v-col>
			</v-row>
		</div>

		<h2 id="vigenere" class="mt-8">Teil 4 — Vigenère-Verschlüsselung</h2>
		<div class="eddie">
			<p class="mb-3">
				Vigenère ist wie Cäsar – nur mit einem <strong>rotierenden Schlüssel</strong>.
				Statt immer denselben Shift zu nehmen, hast du eine Folge von Shifts, die sich wiederholt.
			</p>

			<div class="kbox"
				v-html="katexBlock(String.raw`
				C_i \equiv P_i + K_i \pmod{26}
				\\\\\text{wobei } K_i \text{ zyklisch aus dem Schlüssel kommt.}
			`)"
			></div>

			<v-row>
				<v-col cols="12" md="6">
					<div class="kbox">
						<div class="text-subtitle-2 mb-2">Beispiel (klassisch mit Wortschlüssel)</div>
						<div class="text-body-2 mb-2">
							Klartext: <code>{{ vigWordExample.plain }}</code><br />
							Schlüssel: <code>{{ vigWordExample.key }}</code> (wird wiederholt)
						</div>

						<v-table density="compact">
							<thead>
								<tr>
									<th class="text-left">Pos</th>
									<th class="text-left">P</th>
									<th class="text-left">K</th>
									<th class="text-left">C</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="r in vigWordExample.rows" :key="r.i">
									<td><code>{{ r.i }}</code></td>
									<td><code>{{ r.p }}</code></td>
									<td><code>{{ r.k }}</code></td>
									<td><code>{{ r.c }}</code></td>
								</tr>
							</tbody>
						</v-table>

						<div class="mt-3 text-body-2">
							Ergebnis: <code>{{ vigWordExample.cipher }}</code>
						</div>
					</div>
				</v-col>

				<v-col cols="12" md="6">
					<div class="kbox">
						<div class="text-subtitle-2 mb-2">Beispiel (Zahlenschlüssel wie „2,9,5“)</div>
						<div class="text-body-2 mb-2">
							Hier ist der Schlüssel direkt eine Zahlenfolge:
							<code>{{ vigNumExample.key.join(",") }}</code> (wiederholt).
						</div>

						<v-table density="compact">
							<thead>
								<tr>
									<th class="text-left">Pos</th>
									<th class="text-left">P</th>
									<th class="text-left">Shift</th>
									<th class="text-left">C</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="r in vigNumExample.rows" :key="r.i">
									<td><code>{{ r.i }}</code></td>
									<td><code>{{ r.p }}</code></td>
									<td><code>{{ r.shift }}</code></td>
									<td><code>{{ r.c }}</code></td>
								</tr>
							</tbody>
						</v-table>

						<div class="mt-3 text-body-2">
							Klartext: <code>{{ vigNumExample.plain }}</code><br />
							Cipher: <code>{{ vigNumExample.cipher }}</code>
						</div>
					</div>
				</v-col>
			</v-row>

			<v-divider class="my-4" />

			<v-row>
				<v-col cols="12" md="6">
					<div class="kbox">
						<div class="text-subtitle-2 mb-2">Warum Vigenère stärker ist</div>
						<ul class="text-body-2 mb-0">
							<li>Kein einzelner Shift → Häufigkeiten „verwischen“.</li>
							<li>Die Sicherheit hängt stark von der <strong>Schlüssellänge</strong> ab.</li>
							<li>Kurze Schlüssel sind knackbar (Kasiski/Friedman), lange sind deutlich zäher.</li>
						</ul>
					</div>
				</v-col>
				<v-col cols="12" md="6">
					<div class="kbox">
						<div class="text-subtitle-2 mb-2">Eddie-Tipp fürs Denken</div>
						<div class="text-body-2">
							Stell dir vor, du hast mehrere Cäsar-Chiffren, die sich abwechseln.
							Wenn du die Periodenlänge kennst, zerfällt das Problem wieder in mehrere kleine Cäsar-Aufgaben.
						</div>
						<div class="mt-2"
							v-html="katexBlock(String.raw`
							\text{Wenn die Schlüssellänge } m \text{ bekannt ist,}`)"
						></div>
						<div v-html="katexBlock(String.raw`
							\text{ dann: }
							\{i \equiv 0 \pmod m\},\{i \equiv 1 \pmod m\},\dots
						`)"
						></div>
					</div>
				</v-col>
			</v-row>
		</div>

		<h2 class="mt-8">Teil 5 — Merksätze</h2>
		<div class="eddie">
			<v-row>
				<v-col cols="12" md="6">
					<div class="kbox">
						<div class="text-subtitle-2 mb-2">Cäsar</div>
						<ul class="text-body-2 mb-0">
							<li>Ein Shift für alles.</li>
							<li>Schnell zu knacken (25 Versuche oder Frequenzanalyse).</li>
						</ul>
					</div>
				</v-col>
				<v-col cols="12" md="6">
					<div class="kbox">
						<div class="text-subtitle-2 mb-2">Vigenère</div>
						<ul class="text-body-2 mb-0">
							<li>Shift-Folge (Schlüssel) wiederholt sich.</li>
							<li>Schlüssellänge ist die Schwachstelle – kurze Schlüssel sind angreifbar.</li>
						</ul>
					</div>
				</v-col>
			</v-row>
		</div>
	</template>

	<template #interactivePart>
		<h2 id="c64-emulator">BASIC-Emulator</h2>
		<div class="eddie d-flex flex-column ga-3">
			<div class="kbox">
				<v-row align="center" dense>
					<v-col cols="12" md="12">
						<v-select
							v-model="selectedProgramId"
							density="compact"
							hide-details
							:items="programItems"
							label="BASIC-Programm"
						/>
					</v-col>
				</v-row>
				<v-row align="center" dense>
					<v-col class="d-flex ga-2 align-center" cols="12" md="12">
						<v-btn
							color="primary"
							:disabled="!emulatorReady || emulatorRunning"
							@click="runSelectedProgram"
						>
							RUN
						</v-btn>

						<v-btn
							:disabled="!emulatorReady || emulatorRunning"
							variant="tonal"
							@click="clearProgramScreen"
						>
							CLEAR
						</v-btn>

						<v-btn
							:disabled="!emulatorReady"
							variant="tonal"
							@click="resetProgramRuntime"
						>
							RESET
						</v-btn>

						<v-spacer />

						<v-chip v-if="emulatorReady"
							color="green"
							size="small"
							variant="tonal"
						>
							basic ready
						</v-chip>
						<v-chip v-else
							color="grey"
							size="small"
							variant="tonal"
						>
							loading…
						</v-chip>
					</v-col>
				</v-row>
			</div>

			<div class="kbox">
				<v-textarea
					v-model="sourceEditor"
					auto-grow
					class="basic-source-editor"
					:disabled="emulatorRunning"
					label="BASIC Quelltext"
					rows="12"
					spellcheck="false"
				/>
			</div>
		</div>
	</template>

	<template #calculationPart>
		<h2>Emulator-Ausgabe</h2>
		<div class="eddie">
			<BAEmulator
				:key="emulatorKey"
				ref="emulatorRef"
				:blink-cursor="true"
				@hard-restart="handleHardRestart"
				@state-change="handleEmulatorStateChange"
			/>
		</div>
	</template>

	<template #footer>
		<p class="muted">
			<a href="https://github.com/mist64/cbmbasic/">Thanks to Michael Steil and James Abbatiello from cbmbasic</a>
		</p>
	</template>
</AppFrame>
</template>

<script setup lang="ts">
import {
	ref, computed, watch
} from "vue";
import BAEmulator from "./BA_Emulator.vue";
import titleImg from "@/images/BA.webp";
type BasicProgram = { id: string; name: string; source: string };
type BAEmulatorExpose = {
	runProgram: ( source: string ) => Promise<void>;
	clearScreen: () => void;
	softReset: () => void;
};

const emulatorKey = ref( 0 );
const emulatorRef = ref<BAEmulatorExpose | null>( null );
const emulatorReady = ref( false );
const emulatorRunning = ref( false );
const encodedHAMMessage = "OJUTXTLJNNUTXNZGMIKN";
const programs: BasicProgram[] = [
	{
		id:     "hello",
		name:   "Hello World",
		source: [
			"10 PRINT CHR$(147)",
			"20 PRINT \"**** C64 BASIC ****\"",
			"30 PRINT",
			"40 PRINT \"HELLO WORLD!\"",
			"50 PRINT",
			"60 FOR I=1 TO 5: PRINT \"I=\";I;\"  I^2=\";I*I: NEXT",
			"70 PRINT",
			"80 PRINT \"READY.\""
		]
			.join( "\n" )
	},
	{
		id:     "ceasar",
		name:   "Ceasar Decryption",
		source: [
			"10 PRINT CHR$(147)",
			`20 C$="${encodedHAMMessage}"`,
			"30 PRINT \"CAESAR BRUTEFORCE FUER:\"",
			"40 PRINT C$",
			"50 PRINT",
			"60 FOR K=1 TO 25",
			"70 O$=\"\"",
			"80 FOR I=1 TO LEN(C$)",
			"90 A=ASC(MID$(C$,I,1))-65",
			"100 D=A-K",
			"110 IF D<0 THEN D=D+26",
			"120 O$=O$+CHR$(D+65)",
			"130 NEXT I",
			"140 PRINT \"SHIFT \";K;\": \";O$",
			"150 NEXT K",
			"160 PRINT",
			"170 PRINT \"READY.\""
		]
			.join( "\n" )
	},
	{
		id:     "vigenereDe",
		name:   "Vigenère Decryption",
		source: [
			"10 PRINT CHR$(147)",
			`20 C$="${encodedHAMMessage}"`,
			"30 PRINT \"VIGENERE TEST FUER:\"",
			"40 PRINT C$",
			"50 PRINT",
			"60 K$=\"29568\"",
			"70 GOSUB 200",
			"80 PRINT",
			"90 K$=\"295\"",
			"100 GOSUB 200",
			"110 PRINT",
			"120 PRINT \"READY.\"",
			"130 END",
			"200 PRINT \"KEY \";K$;\": \";",
			"205 L=LEN(K$)",
			"210 FOR I=1 TO LEN(C$)",
			"220 A=ASC(MID$(C$,I,1))-65",
			"230 J=I-INT((I-1)/L)*L",
			"240 S=VAL(MID$(K$,J,1))",
			"250 D=A-S",
			"260 IF D<0 THEN D=D+26",
			"270 PRINT CHR$(D+65);",
			"280 NEXT I",
			"290 RETURN"
		]
			.join( "\n" )
	},
	{
		id:     "vigenereEn",
		name:   "Vigenère Encryption",
		source: [
			"10 PRINT CHR$(147)",
			"20 K$=\"295\"",
			"30 P$=\"MAPROOJAILLOVEUEDDIE\": GOSUB 200",
			"40 P$=\"ERISSAFE\": GOSUB 200",
			"50 P$=\"ERSTILLONTOUR\": GOSUB 200",
			"60 PRINT",
			"70 PRINT \"READY.\"",
			"80 END",
			"200 PRINT P$;\" -> \";",
			"210 L=LEN(K$)",
			"220 FOR I=1 TO LEN(P$)",
			"230 A=ASC(MID$(P$,I,1))-65",
			"240 J=I-INT((I-1)/L)*L",
			"250 S=VAL(MID$(K$,J,1))",
			"260 E=A+S",
			"270 IF E>25 THEN E=E-26",
			"280 PRINT CHR$(E+65);",
			"290 NEXT I",
			"300 PRINT",
			"310 RETURN"
		]
			.join( "\n" )
	},
	{
		id:     "vigenereEnInput",
		name:   "Vigenère Encryption (mit INPUT)",
		source: [
			"10 PRINT CHR$(147)",
			"20 K$=\"295\"",
			"30 PRINT \"VIGENERE ENCRYPTION\"",
			"40 PRINT \"KEY: 295\"",
			"50 PRINT \"NUR A-Z WIRD VERARBEITET\"",
			"60 INPUT \"KLARTEXT\";P$",
			"70 Q$=\"\"",
			"80 FOR I=1 TO LEN(P$)",
			"90 A=ASC(MID$(P$,I,1))",
			"100 IF A>=97 AND A<=122 THEN A=A-32",
			"110 IF A>=65 AND A<=90 THEN Q$=Q$+CHR$(A)",
			"120 NEXT I",
			"130 IF LEN(Q$)=0 THEN PRINT \"KEIN A-Z GEFUNDEN\":GOTO 60",
			"140 PRINT",
			"150 PRINT Q$;\" -> \";",
			"160 L=LEN(K$)",
			"170 FOR I=1 TO LEN(Q$)",
			"180 A=ASC(MID$(Q$,I,1))-65",
			"190 J=I-INT((I-1)/L)*L",
			"200 S=VAL(MID$(K$,J,1))",
			"210 E=A+S",
			"220 IF E>25 THEN E=E-26",
			"230 PRINT CHR$(E+65);",
			"240 NEXT I",
			"250 PRINT",
			"260 PRINT",
			"270 PRINT \"READY.\""
		]
			.join( "\n" )
	},
	{
		id:     "fractionReduce",
		name:   "Bruch kuerzen (mit INPUT)",
		source: [
			"10 PRINT CHR$(147)",
			"20 PRINT \"BRUCH KUERZEN - RESET ZUM STOPP\"",
			"30 PRINT \"EINGABE ALS: ZAEHLER,NENNER (BEISPIEL 12,18)\"",
			"40 INPUT \"ZAEHLER,NENNER\";N,Z",
			"50 IF Z<>0 THEN 90",
			"60 PRINT \"NENNER DARF NICHT 0 SEIN.\"",
			"70 PRINT",
			"80 GOTO 40",
			"90 SG=1",
			"100 IF N>=0 THEN 120",
			"110 N=-N:SG=-SG",
			"120 IF Z>=0 THEN 140",
			"130 Z=-Z:SG=-SG",
			"140 A=N:B=Z",
			"150 IF B=0 THEN 190",
			"160 T=A-INT(A/B)*B",
			"170 A=B",
			"180 B=T:GOTO 150",
			"190 G=A",
			"200 KN=N/G",
			"210 KZ=Z/G",
			"220 IF SG<0 THEN KN=-KN",
			"230 PRINT \"GEKUERZT: \";KN;\"/\";KZ",
			"240 PRINT"
		]
			.join( "\n" )
	},
	{
		id:     "primes",
		name:   "Primzahlen bis Reset",
		source: [
			"10 PRINT CHR$(147)",
			"20 PRINT \"PRIMZAHLEN - RESET ZUM STOPP\"",
			"30 PRINT 2",
			"40 N=3",
			"50 P=1",
			"60 FOR D=3 TO INT(SQR(N)) STEP 2",
			"70 IF N/D=INT(N/D) THEN P=0",
			"80 NEXT D",
			"90 IF P=1 THEN PRINT N",
			"100 N=N+2",
			"110 GOTO 50"
		]
			.join( "\n" )
	},
	{
		id:     "pi",
		name:   "PI-Stellen bis Reset",
		source: [
			"10 PRINT CHR$(147)",
			"20 PRINT \"PI-STELLEN (WACHSENDE PRAEZISION)\"",
			"30 PRINT \"RESET ZUM STOPP\"",
			"40 MAXM=4200:SP=560",
			"50 DIM F(MAXM)",
			"60 PD=0:M=0",
			"70 M=M+SP",
			"80 IF M<=MAXM THEN 90",
			"82 PRINT",
			"84 PRINT \"*** SPEICHERLIMIT ERREICHT ***\"",
			"86 PRINT \"RESET ZUM STOPP\"",
			"88 GOTO 88",
			"90 FOR I=1 TO M:F(I)=2000:NEXT",
			"100 E=0:PP=1",
			"110 FOR C=M TO 14 STEP -14",
			"120 D=0:G=C*2",
			"130 FOR B=C TO 1 STEP -1",
			"140 D=D*B+F(B)*10000",
			"150 T=INT(D/(G-1))",
			"160 F(B)=D-T*(G-1)",
			"170 D=T:G=G-2",
			"180 NEXT B",
			"190 Q=E+INT(D/10000)",
			"200 IF C<>M THEN 260",
			"210 P$=MID$(STR$(Q),2)",
			"220 IF LEN(P$)=1 THEN P$=\"000\"+P$",
			"230 IF LEN(P$)=2 THEN P$=\"00\"+P$",
			"240 IF LEN(P$)=3 THEN P$=\"0\"+P$",
			"250 IF PD<>0 THEN 260",
			"252 PRINT LEFT$(P$,1);\".\";",
			"254 S$=MID$(P$,2)",
			"256 GOSUB 900",
			"258 PP=4:GOTO 310",
			"260 S$=MID$(STR$(Q),2)",
			"270 IF LEN(S$)=1 THEN S$=\"000\"+S$",
			"280 IF LEN(S$)=2 THEN S$=\"00\"+S$",
			"290 IF LEN(S$)=3 THEN S$=\"0\"+S$",
			"300 GOSUB 900:PP=PP+4",
			"310 E=D-INT(D/10000)*10000",
			"320 NEXT C",
			"330 PD=PP-1",
			"340 REM",
			"350 GOTO 70",
			"900 L=LEN(S$)",
			"910 IF PD>=PP+L-1 THEN RETURN",
			"920 J1=1",
			"930 IF PD>=PP THEN J1=PD-PP+2",
			"940 FOR J=J1 TO L:PRINT MID$(S$,J,1);:NEXT",
			"950 RETURN"
		]
			.join( "\n" )
	}
];
const selectedProgramId = ref( programs[ 0 ]?.id ?? "" );
const programItems = computed( () =>
	programs.map( ( p ) => ( { title: p.name, value: p.id } ) ) );
const selectedProgramSource =
	computed( () => programs.find( ( p ) => p.id === selectedProgramId.value )?.source ?? "" );
const sourceEditor = ref( selectedProgramSource.value );

watch(
	selectedProgramId,
	() => {
		sourceEditor.value = selectedProgramSource.value;
	},
	{ immediate: true }
);

async function runSelectedProgram() {
	if ( !emulatorRef.value ) {
		return;
	}

	await emulatorRef.value.runProgram( sourceEditor.value );
}

function clearProgramScreen() {
	emulatorRef.value?.clearScreen();
}

function resetProgramRuntime() {
	emulatorRef.value?.softReset();
}

function handleEmulatorStateChange( payload: { ready: boolean; running: boolean } ) {
	emulatorReady.value = payload.ready;
	emulatorRunning.value = payload.running;
}

function handleHardRestart( payload: { reason: string } ) {
	console.error( "BA_Emulator hard restart:", payload?.reason ?? payload );
	emulatorReady.value = false;
	emulatorRunning.value = false;
	emulatorKey.value += 1;
}

import katex from "katex";

/** ===== KaTeX helper ===== */
function katexBlock( tex: string ) {
	return katex.renderToString( tex, {
		displayMode:  true,
		throwOnError: false,
		strict:       "ignore"
	} );
}

/** ===== Crypto helpers (A=0..Z=25) ===== */
const ALPH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function normAZ( s: string ): string {
	// nur A-Z behalten
	return s.toUpperCase().replace( /[^A-Z]/g, "" );
}

function ch2n( ch: string ): number {
	return ALPH.indexOf( ch );
}

function n2ch( n: number ): string {
	const x = ( n % 26 + 26 ) % 26;
	return ALPH[ x ];
}

function caesarEncrypt( plain: string, k: number ) {
	const p = normAZ( plain );
	let cipher = "";
	const rows: Array<{ p: string; pn: number; cn: number; c: string }> = [];

	for ( const ch of p ) {
		const pn = ch2n( ch );
		const cn = ( pn + k ) % 26;
		const c = n2ch( cn );
		cipher += c;
		rows.push( {
			p: ch, pn, cn, c
		} );
	}

	return {
		plain: p, k, cipher, rows
	};
}

function vigenereEncryptWord( plain: string, key: string ) {
	const p = normAZ( plain );
	const k0 = normAZ( key );
	const keyRep = Array.from( { length: p.length }, ( _, i ) => k0[ i % k0.length ] );
	let cipher = "";
	const rows: Array<{ i: number; p: string; k: string; c: string }> = [];

	for ( let i = 0; i < p.length; i++ ) {
		const pn = ch2n( p[ i ] );
		const kn = ch2n( keyRep[ i ] );
		const cn = ( pn + kn ) % 26;
		const c = n2ch( cn );
		cipher += c;
		rows.push( {
			i: i + 1, p: p[ i ], k: keyRep[ i ], c
		} );
	}

	return {
		plain: p, key: k0, cipher, rows
	};
}

function vigenereEncryptNumbers( plain: string, shifts: number[] ) {
	const p = normAZ( plain );
	let cipher = "";
	const rows: Array<{ i: number; p: string; shift: number; c: string }> = [];

	for ( let i = 0; i < p.length; i++ ) {
		const pn = ch2n( p[ i ] );
		const sh = shifts[ i % shifts.length ];
		const cn = ( pn + sh ) % 26;
		const c = n2ch( cn );
		cipher += c;
		rows.push( {
			i: i + 1, p: p[ i ], shift: sh, c
		} );
	}

	return {
		plain: p, key: shifts, cipher, rows
	};
}

/** ===== Examples ===== */
const caesarExample = computed( () => caesarEncrypt( "EDDIE", 3 ) );

// Klassisches Standardbeispiel (zeigt gut das Prinzip):
// ATTACKATDAWN + LEMON -> LXFOPVEFRNHR
const vigWordExample = computed( () => vigenereEncryptWord( "ATTACK AT DAWN", "LEMON" ) );

// Zahlenfolge wie im Kapitel-Feeling (z.B. 2,9,5):
const vigNumExample = computed( () => vigenereEncryptNumbers( "MAMA AND PAPA", [ 2, 9, 5 ] ) );
</script>

<style scoped>
code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace;
  font-size: 0.95em;
}

.basic-source-editor :deep(textarea) {
	font-family: "Courier New", Courier, monospace;
}
</style>
