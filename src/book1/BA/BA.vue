<template>
<AppFrame
	:languages="[ 'de', 'en' ]"
	:sub-chapter
	:title="t( 'ba.title' )"
	:vue-date="__VITE_SFC_MTIME_MS__"
>
	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="t( 'ba.imageTitle' )">
				<img loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">{{ t( "ba.introDate" ) }}</h3>
		<div class="eddie">
			<p v-html="t( 'ba.book.p1' )" />
			<p v-html="t( 'ba.book.p2' )" />
			<p v-html="t( 'ba.book.p3' )" />
		</div>
	</template>

	<template #descriptionPart>

		<h2>{{ t( "ba.sections.part1.title" ) }}</h2>
		<div class="eddie">
			<p class="text-body-2 text-medium-emphasis">{{ t( "ba.sections.part1.lead" ) }}</p>
		</div>

		<h2 class="mt-8">{{ t( "ba.sections.part2.title" ) }}</h2>
		<div class="eddie">
			<p class="mb-3" v-html="t( 'ba.sections.part2.p1' )" />

			<div class="kbox">
				<div class="text-subtitle-2 mb-2">{{ t( "ba.sections.part2.mapping" ) }}</div>
				<div class="d-flex flex-wrap ga-2">
					<v-chip size="small" variant="tonal">A → 0</v-chip>
					<v-chip size="small" variant="tonal">B → 1</v-chip>
					<v-chip size="small" variant="tonal">…</v-chip>
					<v-chip size="small" variant="tonal">Z → 25</v-chip>
				</div>
			</div>

			<div class="kbox">
				<div class="text-subtitle-2 mb-2">{{ t( "ba.sections.part2.circle" ) }}</div>
				<div class="text-body-2" v-html="t( 'ba.sections.part2.circleText' )" />
				<div class="mt-2">
					<Katex
						as="div"
						display
						:tex="String.raw`\text{Beispiel: } 25+3=28 \equiv 2 \pmod{26}\ \Rightarrow\ Z \xrightarrow{+3} C`"
					/>
				</div>
			</div>

			<v-divider class="my-4" />

			<p class="mb-0" v-html="t( 'ba.sections.part2.cleanup' )" />
		</div>

		<h2 id="casar" class="mt-8">{{ t( "ba.sections.part3.title" ) }}</h2>
		<div class="eddie">
			<p class="mb-3" v-html="t( 'ba.sections.part3.p1' )" />

			<div class="kbox">
				<Katex
					as="div"
					display
					:tex="String.raw`
						\textbf{Verschlüsselung:}\quad C \equiv P + k \pmod{26}
						\\\\
						\textbf{Entschlüsselung:}\quad P \equiv C - k \pmod{26}
					`"
				/>
			</div>

			<v-row>
				<v-col cols="12" md="6">
					<div class="kbox">
						<div class="text-subtitle-2 mb-2">{{ t( "ba.sections.part3.example" ) }}</div>
						<div
							class="text-body-2 mb-2"
							v-html="t( 'ba.sections.part3.plainShift', {
								plain: caesarExample.plain,
								k:     caesarExample.k
							} )"
						/>

						<v-table density="compact">
							<thead>
								<tr>
									<th class="text-left">{{ t( "ba.sections.part3.table.letter" ) }}</th>
									<th class="text-left">{{ t( "ba.sections.part3.table.number" ) }}</th>
									<th class="text-left">{{ t( "ba.sections.part3.table.shift" ) }}</th>
									<th class="text-left">{{ t( "ba.sections.part3.table.cipher" ) }}</th>
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

						<div class="mt-3 text-body-2" v-html="t( 'ba.sections.part3.result', { cipher: caesarExample.cipher } )" />
					</div>
				</v-col>

				<v-col cols="12" md="6">
					<div class="kbox">
						<div class="text-subtitle-2 mb-2">{{ t( "ba.sections.part3.whyTitle" ) }}</div>
						<ul class="text-body-2 mb-0">
							<li v-html="t( 'ba.sections.part3.why1' )" />
							<li v-html="t( 'ba.sections.part3.why2' )" />
							<li v-html="t( 'ba.sections.part3.why3' )" />
						</ul>
					</div>
				</v-col>
			</v-row>
		</div>

		<h2 id="vigenere" class="mt-8">{{ t( "ba.sections.part4.title" ) }}</h2>
		<div class="eddie">
			<p class="mb-3" v-html="t( 'ba.sections.part4.p1' )" />

			<div class="kbox">
				<Katex
					as="div"
					display
					:tex="String.raw`
						C_i \equiv P_i + K_i \pmod{26}
						\\\\\text{wobei } K_i \text{ zyklisch aus dem Schlüssel kommt.}
					`"
				/>
			</div>

			<v-row>
				<v-col cols="12" md="6">
					<div class="kbox">
						<div class="text-subtitle-2 mb-2">{{ t( "ba.sections.part4.classicTitle" ) }}</div>
						<div
							class="text-body-2 mb-2"
							v-html="t( 'ba.sections.part4.classicText', {
								plain: vigWordExample.plain,
								key:   vigWordExample.key
							} )"
						/>

						<v-table density="compact">
							<thead>
								<tr>
									<th class="text-left">{{ t( "ba.sections.part4.table.pos" ) }}</th>
									<th class="text-left">{{ t( "ba.sections.part4.table.p" ) }}</th>
									<th class="text-left">{{ t( "ba.sections.part4.table.k" ) }}</th>
									<th class="text-left">{{ t( "ba.sections.part4.table.c" ) }}</th>
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

						<div class="mt-3 text-body-2" v-html="t( 'ba.sections.part4.classicResult', { cipher: vigWordExample.cipher } )" />
					</div>
				</v-col>

				<v-col cols="12" md="6">
					<div class="kbox">
						<div class="text-subtitle-2 mb-2">{{ t( "ba.sections.part4.numericTitle" ) }}</div>
						<div class="text-body-2 mb-2" v-html="t( 'ba.sections.part4.numericText', { key: vigNumExample.key.join( ',' ) } )" />

						<v-table density="compact">
							<thead>
								<tr>
									<th class="text-left">{{ t( "ba.sections.part4.table.pos" ) }}</th>
									<th class="text-left">{{ t( "ba.sections.part4.table.p" ) }}</th>
									<th class="text-left">{{ t( "ba.sections.part4.table.shift" ) }}</th>
									<th class="text-left">{{ t( "ba.sections.part4.table.c" ) }}</th>
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

						<div
							class="mt-3 text-body-2"
							v-html="t( 'ba.sections.part4.numericResult', {
								plain:  vigNumExample.plain,
								cipher: vigNumExample.cipher
							} )"
						/>
					</div>
				</v-col>
			</v-row>

			<v-divider class="my-4" />

			<v-row>
				<v-col cols="12" md="6">
					<div class="kbox">
						<div class="text-subtitle-2 mb-2">{{ t( "ba.sections.part4.whyTitle" ) }}</div>
						<ul class="text-body-2 mb-0">
							<li v-html="t( 'ba.sections.part4.why1' )" />
							<li v-html="t( 'ba.sections.part4.why2' )" />
							<li v-html="t( 'ba.sections.part4.why3' )" />
						</ul>
					</div>
				</v-col>
				<v-col cols="12" md="6">
					<div class="kbox">
						<div class="text-subtitle-2 mb-2">{{ t( "ba.sections.part4.tipTitle" ) }}</div>
						<div class="text-body-2">{{ t( "ba.sections.part4.tipText" ) }}</div>
						<div class="mt-2">
							<Katex
								as="div"
								display
								:tex="String.raw`\text{Wenn die Schlüssellänge } m \text{ bekannt ist,}`"
							/>
						</div>
						<div>
							<Katex
								as="div"
								display
								:tex="String.raw`
									\text{ dann: }
									\{i \equiv 0 \pmod m\},\{i \equiv 1 \pmod m\},\dots
								`"
							/>
						</div>
					</div>
				</v-col>
			</v-row>
		</div>

		<h2 class="mt-8">{{ t( "ba.sections.part5.title" ) }}</h2>
		<div class="eddie">
			<v-row>
				<v-col cols="12" md="6">
					<div class="kbox">
						<div class="text-subtitle-2 mb-2">{{ t( "ba.sections.part5.caesar" ) }}</div>
						<ul class="text-body-2 mb-0">
							<li>{{ t( "ba.sections.part5.caesar1" ) }}</li>
							<li>{{ t( "ba.sections.part5.caesar2" ) }}</li>
						</ul>
					</div>
				</v-col>
				<v-col cols="12" md="6">
					<div class="kbox">
						<div class="text-subtitle-2 mb-2">{{ t( "ba.sections.part5.vigenere" ) }}</div>
						<ul class="text-body-2 mb-0">
							<li>{{ t( "ba.sections.part5.vigenere1" ) }}</li>
							<li>{{ t( "ba.sections.part5.vigenere2" ) }}</li>
						</ul>
					</div>
				</v-col>
			</v-row>
		</div>
	</template>

	<template #interactivePart>
		<h2 id="c64-emulator">{{ t( "ba.interactive.title" ) }}</h2>
		<div class="eddie d-flex flex-column ga-3">
			<div class="kbox">
				<v-row align="center" dense>
					<v-col cols="12" md="12">
						<v-select
							v-model="selectedProgramId"
							density="compact"
							hide-details
							:items="programItems"
							:label="t( 'ba.interactive.programLabel' )"
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
							{{ t( "ba.interactive.run" ) }}
						</v-btn>

						<v-btn
							:disabled="!emulatorReady || emulatorRunning"
							variant="tonal"
							@click="clearProgramScreen"
						>
							{{ t( "ba.interactive.clear" ) }}
						</v-btn>

						<v-btn
							:disabled="!emulatorReady"
							variant="tonal"
							@click="resetProgramRuntime"
						>
							{{ t( "ba.interactive.reset" ) }}
						</v-btn>

						<v-spacer />

						<v-chip v-if="emulatorReady"
							color="green"
							size="small"
							variant="tonal"
						>
							{{ t( "ba.interactive.ready" ) }}
						</v-chip>
						<v-chip v-else
							color="grey"
							size="small"
							variant="tonal"
						>
							{{ t( "ba.interactive.loading" ) }}
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
					:label="t( 'ba.interactive.source' )"
					rows="12"
					spellcheck="false"
				/>
			</div>
		</div>
	</template>

	<template #calculationPart>
		<h2>{{ t( "ba.interactive.output" ) }}</h2>
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
			<a href="https://github.com/mist64/cbmbasic/">{{ t( "ba.interactive.footer" ) }}</a>
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import {
	ref, computed, watch
} from "vue";
import { useI18n } from "@/utils/i18n.mjs";
import BAEmulator from "./BA_Emulator.vue";
import titleImg from "./BA.webp";

const { t } = useI18n( "book1/BA" );

const emulatorKey = ref( 0 );
const emulatorRef = ref( null );
const emulatorReady = ref( false );
const emulatorRunning = ref( false );
const encodedHAMMessage = "OJUTXTLJNNUTXNZGMIKN";
const subChapter = computed( () => ( {
	einleitung:     t( "ba.subChapter.einleitung" ),
	casar:          t( "ba.subChapter.casar" ),
	vigenere:       t( "ba.subChapter.vigenere" ),
	"c64-emulator": t( "ba.subChapter.c64-emulator" )
} ) );
const programs = [
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
	programs.map( ( p ) => ( {
		title: t( `ba.programs.${p.id}` ),
		value: p.id
	} ) ) );
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

function handleEmulatorStateChange( payload ) {
	emulatorReady.value = payload.ready;
	emulatorRunning.value = payload.running;
}

function handleHardRestart( payload ) {
	console.error( "BA_Emulator hard restart:", payload?.reason ?? payload );
	emulatorReady.value = false;
	emulatorRunning.value = false;
	emulatorKey.value += 1;
}

/** ===== Crypto helpers (A=0..Z=25) ===== */
const ALPH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function normAZ( s ) {
	// nur A-Z behalten
	return s.toUpperCase().replace( /[^A-Z]/g, "" );
}

function ch2n( ch ) {
	return ALPH.indexOf( ch );
}

function n2ch( n ) {
	const x = ( n % 26 + 26 ) % 26;
	return ALPH[ x ];
}

function caesarEncrypt( plain, k ) {
	const p = normAZ( plain );
	let cipher = "";
	const rows = [];

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

function vigenereEncryptWord( plain, key ) {
	const p = normAZ( plain );
	const k0 = normAZ( key );
	const keyRep = Array.from( { length: p.length }, ( _, i ) => k0[ i % k0.length ] );
	let cipher = "";
	const rows = [];

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

function vigenereEncryptNumbers( plain, shifts ) {
	const p = normAZ( plain );
	let cipher = "";
	const rows = [];

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
