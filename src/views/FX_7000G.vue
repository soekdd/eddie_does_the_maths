<template>
<v-container fluid>
	<v-row align="start" class="ga-0" justify="center">
		<!-- Calculator body -->
		<v-col class="pa-0"
			cols="12"
			lg="6"
			md="6"
		>
			<v-card class="calc-body pa-4" elevation="10">
				<!-- top label area -->
				<div class="calc-top d-flex align-center justify-space-between mb-3">
					<div class="brand">
						<div class="brand-line1">CASIO</div>
						<div class="brand-line2">fx-7000G <span class="brand-badge">EDDIE EDITION</span></div>
					</div>

					<div class="status text-caption">
						<div><strong>Interpreter:</strong> {{ cbiReady ? "bereit" : "lädt…" }}</div>
						<div><strong>Mode:</strong> {{ calcMode === "direct" ? `CALC (${directAngleMode})` : "BASIC" }}</div>
						<div><strong>Status:</strong> {{ status }}</div>
					</div>
				</div>

				<!-- LCD -->
				<div class="lcd-wrap mb-4">
					<div class="lcd-frame">
						<div class="lcd-glass">
							<div class="lcd-canvas-stack">
								<!-- Krevo helper expects exactly these IDs -->
								<canvas id="canvas1"
									class="lcd-canvas lcd-text"
									height="374"
									width="758"
								></canvas>
								<canvas id="canvas2"
									class="lcd-canvas lcd-graph"
									height="374"
									width="758"
								></canvas>
								<canvas id="canvas3"
									class="lcd-canvas lcd-backdrop"
									height="374"
									width="758"
								></canvas>
								<canvas id="canvasRun"
									class="lcd-canvas lcd-run"
									height="374"
									width="758"
								></canvas>

								<!-- LCD overlay (scanlines / pixel grid) -->
								<div class="lcd-overlay"></div>
							</div>
						</div>
					</div>
				</div>

				<!-- Soft-row hint (purely optical) -->
				<div class="softkeys-hint d-flex justify-space-between text-caption mb-2">
           
				</div>

				<!-- Keypad -->
				<div class="keypad">
					<div v-for="(row, rIdx) in keyRows" :key="rIdx" class="key-row">
						<div
							v-for="key in row"
							:key="key.id"
							class="key-slot"
							:class="[ key.wide ? 'key-wide' : '' ]"
						>
							<div class="key-legend">
								<div v-if="key.shift" class="key-shift" v-html="katexHtml(key.shift, true)"></div>
								<div v-if="key.alpha" class="key-alpha" v-html="katexHtml(key.alpha, true)"></div>
							</div>

							<v-btn
								class="key-btn"
								:class="[ key.kind ? `key-${key.kind}` : 'key-std' ]"
								density="compact"
								:disabled="!key.enabled"
								variant="elevated"
								@mousedown.prevent="onKeyDown(key)"
								@mouseleave="onKeyUp(key)"
								@mouseup.prevent="onKeyUp(key)"
								@touchend.prevent="onKeyUp(key)"
								@touchstart.prevent="onKeyDown(key)"
							>
								<div class="key-face">
									<div class="key-main" v-html="katexHtml(key.main)"></div>
								</div>
							</v-btn>
						</div>
					</div>
				</div>
			</v-card>
		</v-col>

		<!-- BASIC editor (separate field as requested) -->
		<v-col cols="12" lg="6" md="6">
			<v-card class="pa-4" elevation="6">
				<div class="d-flex align-center justify-space-between mb-2">
					<div class="text-h6 mr-4">BASIC</div>
					<div class="text-caption">
						Tipp: <code>INPUT</code> Werte kannst du dann über die Zifferntasten + <code>EXE</code> eingeben.
					</div>
				</div>

				<v-select
					v-model="selectedProgramId"
					class="mb-3"
					density="compact"
					hide-details
					:items="programItems"
					label="Vorgefertigtes Programm"
					variant="outlined"
				/>

				<v-textarea
					v-model="programSrc"
					auto-grow
					class="mb-3"
					label="Programmtext"
					rows="18"
					spellcheck="false"
					variant="outlined"
				/>

				<div class="d-flex ga-2 mb-3">
					<v-btn color="info"
						:disabled="!cbiReady"
						variant="elevated"
						@click="toggleCalculatorMode"
					>
						{{ calcMode === "direct" ? "BASIC" :"CALC" }}
					</v-btn>
					<v-btn color="primary"
						:disabled="!cbiReady"
						variant="elevated"
						@click="runProgram"
					>
						Run
					</v-btn>
					<v-btn color="secondary"
						:disabled="!cbiReady"
						variant="elevated"
						@click="stopProgram"
					>
						Stop
					</v-btn>
					<v-btn color="error"
						:disabled="!cbiReady"
						variant="elevated"
						@click="hardReset"
					>
						Reset
					</v-btn>
				</div>

				<v-alert v-if="lastFinish"
					class="mb-0"
					type="info"
					variant="tonal"
				>
					<div class="text-caption">
						<strong>Finish:</strong> {{ lastFinish }}
					</div>
				</v-alert>
			</v-card>
		</v-col>
	</v-row>
</v-container>
</template>

<script setup lang="ts">
import {
	computed, nextTick, onBeforeUnmount, onMounted, ref, watch
} from "vue";
import katex from "katex";
import "katex/dist/katex.min.css";
import { ensureCbiLoaded } from "@/utils/cbi/cbi.mjs";

type FinishCb = ( errorCode: number, message: string, programs?: any, where?: string, lineNum?: number ) => void;

declare global {
  interface Window {
    // Krevo bundle globals (from cbi.js)
    jsccRun?: ( src: string, finishCb?: FinishCb ) => void;

    cbiInit?: () => void;
    setRes?: ( res: "hi" | "low" ) => void;
    chooseColorScheme?: ( name: "black&white" | "blue&green" | "multicolor" ) => void;

    // input helpers
    calcKeyDown?: ( keyCode: number ) => void;
    calcKeyUp?: () => void;

    // interpreter/screen helpers (globals in the bundle)
    reset?: () => void;
    preset?: () => void;
    cls?: () => void;
    cleartext?: () => void;
    locate?: ( col: number, line: number, text: string, colorIdx?: number ) => void;

    // timing / run state (globals in the bundle)
    idTimerMain?: any;
    paused?: boolean;
    Ans?: any;

    // keyboard handlers (so we can remove them on unmount)
    calcHandleOnKeyDown?: ( e: KeyboardEvent ) => void;
    calcHandleOnKeyUp?: ( e: KeyboardEvent ) => void;

    // cbi internals (plain globals from cbi.js) used to mirror BASIC text rendering in RUN mode
    txtCharW?: number;
    txtCharH?: number;
    casioScreenW?: number;
    casioScreenH?: number;
    zoomW?: number;
    zoomH?: number;
    fonts?: any;
    currentFontDeltaIndx?: number;
    currentTextColorIdx?: number;
    currentPalette?: number[][];
  }
}

const cbiReady = ref( false );
const status = ref( "idle" );
const lastFinish = ref<string>( "" );

type CalcMode = "basic" | "direct";
type AngleMode = "Deg" | "Rad" | "Grad";

const calcMode = ref<CalcMode>( "direct" );
const directAngleMode = ref<AngleMode>( "Deg" );
const directShift = ref( false );
const directExpr = ref( "" );
const directCursor = ref( 0 );
const directAns = ref( 0 );
const directResult = ref( "" );
const directError = ref( "" );
const directBusy = ref( false );
const directHistory = ref<string[]>( [] );
const directHistoryPos = ref( -1 );
let directRepaintTimer: number | undefined;

const LCD_TEXT_WIDTH = 21;
const LCD_TEXT_HEIGHT = 7;

type ProgramPreset = {
	id: string;
	name: string;
	source: string;
};

const programPresets: ProgramPreset[] = [
	{
		id:     "hello",
		name:   "Hello World",
		source: [
			"Cls",
			"Locate 1,1,\"HELLO WORLD\"",
			"For 1->I To 5",
			"Locate 1,I+2,I",
			"Locate 5,I+2,I*I",
			"Next",
			"Stop"
		].join( "\n" )
	},
	{
		id:     "graphTest",
		name:   "Grafik-Test",
		source: [
			"Cls",
			"Locate 1,1,\"GRAFIK TEST\"",
			"ClrGraph",
			"For 1->X To 95",
			"PxlOn 32,X",
			"Next",
			"For 1->Y To 63",
			"PxlOn Y,48",
			"Next",
			"Circle 48,32,14",
			"Stop"
		].join( "\n" )
	},
	{
		id:     "sinCos",
		name:   "Sinus und Kosinus",
		source: `ViewWindow -2π, 2π, π÷4, -1.6, 1.6, 0.5
GridOn
AxesOn
Rad
Cls

.2->S

For Xmin->X to Xmax+S Step S
  F-Line X-S, cos (X-S), X, cos X
Next

For Xmin->X to Xmax+S Step S
  F-Line X-S, sin (X-S), X, sin X
Next

GridOff
AxesOff`
	},
	{
		id:     "mazes",
		name:   "Labyrint",
		source: `ViewWindow 0,126,0,62,0,0
For 0->B To 13
  For 0->A To 25
    RanInt#(0,1)->C
    F-line 5A,5(B+C),5(A+1),5(B+1-C)
  Next
Next`
	},
	{
		id:     "kochCurveLoopD3",
		name:   "Koch-Kurve (Schleife D3)",
		source: [
			"Cls",
			"Locate 1,1,\"KOCH LOOP D3\"",
			"ClrGraph",
			"Range 0,95,5,0,63,5",
			"Deg",
			"54->L",
			"20->X",
			"47->Y",
			"0->A",
			"For 1->Z To 3",
			"For 1->I To 4",
			"For 1->J To 4",
			"For 1->K To 4",
			"X+L/27*Cos(A)->M",
			"Y+L/27*Sin(A)->N",
			"F-Line X,Y,M,N",
			"M->X",
			"N->Y",
			"If K=1",
			"Then",
			"A+60->A",
			"IfEnd",
			"If K=2",
			"Then",
			"A-120->A",
			"IfEnd",
			"If K=3",
			"Then",
			"A+60->A",
			"IfEnd",
			"Next",
			"If J=1",
			"Then",
			"A+60->A",
			"IfEnd",
			"If J=2",
			"Then",
			"A-120->A",
			"IfEnd",
			"If J=3",
			"Then",
			"A+60->A",
			"IfEnd",
			"Next",
			"If I=1",
			"Then",
			"A+60->A",
			"IfEnd",
			"If I=2",
			"Then",
			"A-120->A",
			"IfEnd",
			"If I=3",
			"Then",
			"A+60->A",
			"IfEnd",
			"Next",
			"A-120->A",
			"Next",
			"Stop"
		].join( "\n" )
	},
	{
		id:     "kochCurveLoopD4",
		name:   "Koch-Kurve (Schleife D4)",
		source: [
			"Cls",
			"Locate 1,1,\"KOCH LOOP D4\"",
			"ClrGraph",
			"Range 0,95,5,0,63,5",
			"Deg",
			"54->L",
			"20->X",
			"47->Y",
			"0->A",
			"For 1->Z To 3",
			"For 1->I To 4",
			"For 1->J To 4",
			"For 1->K To 4",
			"For 1->Q To 4",
			"X+L/81*Cos(A)->M",
			"Y+L/81*Sin(A)->N",
			"F-Line X,Y,M,N",
			"M->X",
			"N->Y",
			"If Q=1",
			"Then",
			"A+60->A",
			"IfEnd",
			"If Q=2",
			"Then",
			"A-120->A",
			"IfEnd",
			"If Q=3",
			"Then",
			"A+60->A",
			"IfEnd",
			"Next",
			"If K=1",
			"Then",
			"A+60->A",
			"IfEnd",
			"If K=2",
			"Then",
			"A-120->A",
			"IfEnd",
			"If K=3",
			"Then",
			"A+60->A",
			"IfEnd",
			"Next",
			"If J=1",
			"Then",
			"A+60->A",
			"IfEnd",
			"If J=2",
			"Then",
			"A-120->A",
			"IfEnd",
			"If J=3",
			"Then",
			"A+60->A",
			"IfEnd",
			"Next",
			"If I=1",
			"Then",
			"A+60->A",
			"IfEnd",
			"If I=2",
			"Then",
			"A-120->A",
			"IfEnd",
			"If I=3",
			"Then",
			"A+60->A",
			"IfEnd",
			"Next",
			"A-120->A",
			"Next",
			"Stop"
		].join( "\n" )
	},
	{
		id:     "vigenere295",
		name:   "Vigenere 295 (A=0..Z=25)",
		source: [
			"Cls",
			"Locate 1,1,\"VIG 295\"",
			"Locate 1,2,\"A(0-25)?\"",
			"?->A",
			"Locate 1,3,\"POS I?\"",
			"?->I",
			"I-Int((I-1)/3)*3->J",
			"2->S",
			"If J=2",
			"Then",
			"9->S",
			"IfEnd",
			"If J=0",
			"Then",
			"5->S",
			"IfEnd",
			"A+S->C",
			"If C>=26",
			"Then",
			"C-26->C",
			"IfEnd",
			"Locate 1,5,\"SHIFT=\"",
			"Locate 7,5,S",
			"Locate 1,6,\"C=\"",
			"Locate 3,6,C",
			"Stop"
		].join( "\n" )
	},
	{
		id:     "fractionReduce",
		name:   "Bruch kürzen",
		source: [
			"Cls",
			"Locate 1,3,\"BRUCH KUERZEN\"",
			"Locate 1,4,\"ZAEHLER?\"",
			"?->N",
			"Locate 1,5,\"NENNER?\"",
			"?->D",
			"If D=0",
			"Then",
			"Locate 1,5,\"NENNER=0\"",
			"Stop",
			"IfEnd",
			"If D<0",
			"Then",
			"-N->N",
			"-D->D",
			"IfEnd",
			"Abs(N)->A",
			"D->B",
			"While B<>0",
			"A-Int(A/B)*B->T",
			"B->A",
			"T->B",
			"WhileEnd",
			"N/A->P",
			"D/A->Q",
			"Locate 1,6,\"R=\"",
			"Locate 3,6,P",
			"Locate 6,6,\"/\"",
			"Locate 8,6,Q",
			"Stop"
		].join( "\n" )
	},
	{
		id:     "primes",
		name:   "Primzahlen bis Reset",
		source: [
			"Cls",
			"Locate 1,1,\"PRIMZAHLEN\"",
			"2->N",
			"1->C",
			"While 1",
			"1->P",
			"For 2->D To Int(N/2)",
			"If Int(N/D)=N/D",
			"Then",
			"0->P",
			"IfEnd",
			"Next",
			"If P=1",
			"Then",
			"C+1->C",
			"Locate 1,3,\"N=\"",
			"Locate 3,3,N",
			"Locate 1,4,\"ANZ=\"",
			"Locate 5,4,C",
			"IfEnd",
			"N+1->N",
			"WhileEnd"
		].join( "\n" )
	},
	{
		id:     "pi",
		name:   "PI Näherung bis Reset",
		source: [
			"Cls",
			"Locate 1,1,\"PI LEIBNIZ\"",
			"0->S",
			"1->K",
			"0->I",
			"While 1",
			"S+K/(2*I+1)->S",
			"I+1->I",
			"-K->K",
			"4*S->P",
			"Locate 1,3,\"N=\"",
			"Locate 3,3,I",
			"Locate 1,4,\"PI=\"",
			"Locate 4,4,P",
			"WhileEnd"
		].join( "\n" )
	}
];

const selectedProgramId = ref( programPresets[ 0 ]?.id ?? "" );
const programItems = computed( () =>
	programPresets.map( ( p ) => ( { title: p.name, value: p.id } ) ) );
const selectedProgramSource = computed( () =>
	programPresets.find( ( p ) => p.id === selectedProgramId.value )?.source ?? "" );
const programSrc = ref<string>( selectedProgramSource.value );

watch(
	selectedProgramId,
	() => {
		programSrc.value = selectedProgramSource.value;
	},
	{ immediate: true }
);

function katexHtml( expr: string, small = false ) {
	// very small labels: allow plain text + LaTeX
	try {
		const isLatex = /[\\^_{}]/.test( expr ) || expr.includes( "\\" );

		if ( !isLatex ) {
			return `<span class="${small ? "k-small" : ""}">${escapeHtml( expr )}</span>`;
		}

		return katex.renderToString( expr, {
			throwOnError: false,
			displayMode:  false,
			strict:       "ignore"
		} );
	} catch {
		return `<span class="${small ? "k-small" : ""}">${escapeHtml( expr )}</span>`;
	}
}

function escapeHtml( s: string ) {
	return s.replace( /[&<>"']/g, ( c ) => ( {
		"&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
	}[ c ] as string ) );
}

async function initCbi() {
	status.value = "loading";

	try {
		const loaded = await ensureCbiLoaded();

		if ( !loaded ) {
			cbiReady.value = false;
			status.value = "missing jsccRun";
			return;
		}
	} catch ( error ) {
		console.error( "Failed to load cbi wrapper", error );
		cbiReady.value = false;
		status.value = "failed to load cbi";
		return;
	}

	await nextTick();

	// Initialize display (binds to canvas1/2/3 and sets res)
	window.cbiInit?.();

	// Optional: force hi-res (fx-7000G look). Safe if already set.
	window.setRes?.( "hi" );
	// Mirror upstream default mode and ensure background/palette state is initialized.
	window.chooseColorScheme?.( "multicolor" );

	cbiReady.value = typeof window.jsccRun === "function";
	status.value = cbiReady.value ? "ready" : "missing jsccRun";
}

function lcdFit( text: string, width = LCD_TEXT_WIDTH ) {
	return String( text ?? "" ).slice( 0, width );
}

function formatDirectNumber( value: number ) {
	if ( !Number.isFinite( value ) ) {
		return String( value );
	}

	const normalized = Number.parseFloat( value.toPrecision( 12 ) );
	return String( normalized );
}

function setDirectLayerVisibility( isDirect: boolean ) {
	const runCanvas = document.getElementById( "canvasRun" ) as HTMLCanvasElement | null;
	const textCanvas = document.getElementById( "canvas1" ) as HTMLCanvasElement | null;
	const graphCanvas = document.getElementById( "canvas2" ) as HTMLCanvasElement | null;

	if ( runCanvas ) {
		runCanvas.style.display = isDirect ? "block" : "none";
	}

	// In RUN mode we hide CBI layers to avoid race conditions with its own swap logic.
	if ( isDirect ) {
		if ( textCanvas ) {
			textCanvas.style.display = "none";
		}

		if ( graphCanvas ) {
			graphCanvas.style.display = "none";
		}
	} else {
		if ( textCanvas ) {
			textCanvas.style.display = "";
		}

		if ( graphCanvas ) {
			graphCanvas.style.display = "none";
		}
	}
}

function renderDirectCanvas(
	lines: string[], cursorCol: number, cursorLine: number
) {
	const runCanvas = document.getElementById( "canvasRun" ) as HTMLCanvasElement | null;
	const cbiTextCanvas = document.getElementById( "canvas1" ) as HTMLCanvasElement | null;
	const canvas = runCanvas || cbiTextCanvas;

	if ( !canvas ) {
		return;
	}

	setDirectLayerVisibility( true );

	// Keep RUN canvas pixel grid in sync with CBI text canvas so character geometry matches BASIC mode.
	if ( runCanvas && cbiTextCanvas &&
   ( runCanvas.width !== cbiTextCanvas.width || runCanvas.height !== cbiTextCanvas.height ) ) {
		runCanvas.width = cbiTextCanvas.width;
		runCanvas.height = cbiTextCanvas.height;
	}

	const ctx = canvas.getContext( "2d" );

	if ( !ctx ) {
		return;
	}

	const w = canvas.width;
	const h = canvas.height;

	const charW = Math.max( 1, Math.floor( window.txtCharW ?? w / LCD_TEXT_WIDTH ) );
	const charH = Math.max( 1, Math.floor( window.txtCharH ?? h / LCD_TEXT_HEIGHT ) );
	const screenW = Math.max( 1, Math.floor( window.casioScreenW ?? charW * LCD_TEXT_WIDTH ) );
	const screenH = Math.max( 1, Math.floor( window.casioScreenH ?? charH * LCD_TEXT_HEIGHT ) );
	const zoomW = Math.max( 1, Math.floor( window.zoomW ?? Math.round( w / screenW ) ) );
	const zoomH = Math.max( 1, Math.floor( window.zoomH ?? Math.round( h / screenH ) ) );

	ctx.save();
	ctx.imageSmoothingEnabled = false;

	const bg = window.currentPalette?.[ 0 ];
	ctx.fillStyle = Array.isArray( bg ) && bg.length === 3 ? `rgb(${bg[ 0 ]},${bg[ 1 ]},${bg[ 2 ]})` : "#f5f7ef";
	ctx.fillRect(
		0, 0, w, h
	);

	const fontDelta = Math.max( 0, Math.floor( window.currentFontDeltaIndx ?? 1 ) );
	const textColorIdx = Math.max( 1, Math.floor( window.currentTextColorIdx ?? 1 ) );
	const fontSheet = window.fonts?.[ fontDelta ]?.[ textColorIdx - 1 ] as HTMLImageElement | undefined;
	const canUseSpriteFont = Boolean( fontSheet?.complete && fontSheet.naturalWidth > 0 );

	if ( canUseSpriteFont ) {
		for ( let line = 0; line < LCD_TEXT_HEIGHT; line += 1 ) {
			const text = lcdFit( lines[ line ] ?? "" ).padEnd( LCD_TEXT_WIDTH, " " );

			for ( let col = 0; col < LCD_TEXT_WIDTH; col += 1 ) {
				const ch = text.charCodeAt( col );
				ctx.drawImage(
          fontSheet as HTMLImageElement,
          1 + ch * charW,
          0,
          charW,
          charH,
          col * charW * zoomW,
          line * charH * zoomH,
          charW * zoomW,
          charH * zoomH
				);
			}
		}

		// Blink underscore cursor at CBI cell coordinates for BASIC-like appearance.
		if ( Math.floor( Date.now() / 500 ) % 2 === 0 ) {
			const u = "_".charCodeAt( 0 );
			const col = Math.max( 1, Math.min( LCD_TEXT_WIDTH, cursorCol ) );
			const line = Math.max( 1, Math.min( LCD_TEXT_HEIGHT, cursorLine ) );
			ctx.drawImage(
        fontSheet as HTMLImageElement,
        1 + u * charW,
        0,
        charW,
        charH,
        ( col - 1 ) * charW * zoomW,
        ( line - 1 ) * charH * zoomH,
        charW * zoomW,
        charH * zoomH
			);
		}
	} else {
		// Fallback if cbi sprites are not available yet: keep exact 21x7 grid and conservative glyph size.
		ctx.fillStyle = "#1a2616";
		ctx.textBaseline = "top";
		ctx.font = `${Math.max( 12, Math.floor( charH * zoomH * 0.8 ) )}px "Courier New", monospace`;
		const cellW = Math.floor( w / LCD_TEXT_WIDTH );
		const cellH = Math.floor( h / LCD_TEXT_HEIGHT );

		for ( let i = 0; i < Math.min( lines.length, LCD_TEXT_HEIGHT ); i += 1 ) {
			const line = lcdFit( lines[ i ] ?? "" );
			ctx.fillText(
				line, 0, i * cellH
			);
		}

		if ( Math.floor( Date.now() / 500 ) % 2 === 0 ) {
			const cx = Math.max( 0, Math.min( LCD_TEXT_WIDTH - 1, cursorCol - 1 ) ) * cellW;
			const cy = Math.max( 0, Math.min( LCD_TEXT_HEIGHT - 1, cursorLine - 1 ) ) * cellH;
			ctx.fillRect(
				cx, cy + Math.floor( cellH * 0.82 ), Math.max( 2, Math.floor( cellW * 0.7 ) ), 2
			);
		}
	}

	ctx.restore();
}

function renderDirectScreen() {
	if ( !cbiReady.value || calcMode.value !== "direct" ) {
		return;
	}

	const expr = directExpr.value;
	const cursor = Math.max( 0, Math.min( directCursor.value, expr.length ) );
	const exprWidth = LCD_TEXT_WIDTH - 1; // one column for the ">" prompt
	const maxStart = Math.max( 0, expr.length - exprWidth );
	const start = Math.min( maxStart, Math.max( 0, cursor - Math.floor( exprWidth / 2 ) ) );
	const visibleExpr = expr.slice( start, start + exprWidth );
	const cursorCol = Math.min( LCD_TEXT_WIDTH, Math.max( 2, cursor - start + 2 ) );

	const lines = [
		lcdFit( `RUN ${directAngleMode.value}${directShift.value ? " SHIFT" : ""}` ),
		lcdFit( `>${visibleExpr}` ),
		lcdFit( `Ans=${formatDirectNumber( directAns.value )}` ),
		directError.value ?
			lcdFit( `Err ${directError.value}` ) : directResult.value ?
				lcdFit( `= ${directResult.value}` ) : "EXE=calc DEL=back",
		"MODE/BASIC UP/DN mem",
		directBusy.value ? "Berechne..." : "AC clear ENG angle",
		"sin cos tan log ln"
	];
	renderDirectCanvas(
		lines, cursorCol, 2
	);
}

function setCbiKeyboardListeners( active: boolean ) {
	const kd = window.calcHandleOnKeyDown as any;
	const ku = window.calcHandleOnKeyUp as any;

	if ( !kd || !ku ) {
		return;
	}

	if ( window.removeEventListener ) {
		window.removeEventListener( "keydown", kd );
		window.removeEventListener( "keyup", ku );
	}

	if ( active && window.addEventListener ) {
		window.addEventListener(
			"keydown", kd, false
		);
		window.addEventListener(
			"keyup", ku, false
		);
	}
}

function startDirectRepaint() {
	if ( directRepaintTimer !== undefined ) {
		clearInterval( directRepaintTimer );
	}

	directRepaintTimer = window.setInterval( () => {
		if ( calcMode.value === "direct" ) {
			renderDirectScreen();
		}
	}, 80 );
}

function stopDirectRepaint() {
	if ( directRepaintTimer !== undefined ) {
		clearInterval( directRepaintTimer );
		directRepaintTimer = undefined;
	}
}

function setCalculatorMode( mode: CalcMode ) {
	calcMode.value = mode;
	directShift.value = false;
	directError.value = "";
	directResult.value = "";
	directBusy.value = false;
	stopProgram();

	if ( mode === "direct" ) {
		setCbiKeyboardListeners( false );
		setDirectLayerVisibility( true );
		startDirectRepaint();

		try {
			// reset interpreter state/timers so BASIC internals stay quiescent in RUN mode.
			window.reset?.();
		} catch {
			// ignore
		}

		status.value = "direct ready";
		renderDirectScreen();
		return;
	}

	setCbiKeyboardListeners( true );
	setDirectLayerVisibility( false );
	stopDirectRepaint();
	status.value = "ready";
	hardReset();
}

function toggleCalculatorMode() {
	setCalculatorMode( calcMode.value === "direct" ? "basic" : "direct" );
}

function cycleAngleMode() {
	if ( directAngleMode.value === "Deg" ) {
		directAngleMode.value = "Rad";
	} else if ( directAngleMode.value === "Rad" ) {
		directAngleMode.value = "Grad";
	} else {
		directAngleMode.value = "Deg";
	}

	renderDirectScreen();
}

function directInsert( token: string ) {
	const current = directExpr.value;
	const cursor = Math.max( 0, Math.min( directCursor.value, current.length ) );
	directExpr.value = current.slice( 0, cursor ) + token + current.slice( cursor );
	directCursor.value = cursor + token.length;
	directHistoryPos.value = -1;
	renderDirectScreen();
}

function directInsertWrapped( prefix: string, suffix: string ) {
	const current = directExpr.value;
	const cursor = Math.max( 0, Math.min( directCursor.value, current.length ) );
	directExpr.value = current.slice( 0, cursor ) + prefix + suffix + current.slice( cursor );
	directCursor.value = cursor + prefix.length;
	directHistoryPos.value = -1;
	renderDirectScreen();
}

function directBackspace() {
	if ( directCursor.value <= 0 ) {
		return;
	}

	const current = directExpr.value;
	const cursor = Math.max( 0, Math.min( directCursor.value, current.length ) );
	directExpr.value = current.slice( 0, cursor - 1 ) + current.slice( cursor );
	directCursor.value = cursor - 1;
	directHistoryPos.value = -1;
	renderDirectScreen();
}

function directDeleteForward() {
	const current = directExpr.value;
	const cursor = Math.max( 0, Math.min( directCursor.value, current.length ) );

	if ( cursor >= current.length ) {
		return;
	}

	directExpr.value = current.slice( 0, cursor ) + current.slice( cursor + 1 );
	directHistoryPos.value = -1;
	renderDirectScreen();
}

function directMoveCursor( delta: number ) {
	const next = Math.max( 0, Math.min( directExpr.value.length, directCursor.value + delta ) );

	if ( next === directCursor.value ) {
		return;
	}

	directCursor.value = next;
	renderDirectScreen();
}

function directClearExpression( clearMemory = false ) {
	directExpr.value = "";
	directCursor.value = 0;
	directResult.value = "";
	directError.value = "";
	directShift.value = false;
	directBusy.value = false;

	if ( clearMemory ) {
		directAns.value = 0;
		directHistory.value = [];
	}

	directHistoryPos.value = -1;
	renderDirectScreen();
}

function directHistoryRecall( step: -1 | 1 ) {
	if ( !directHistory.value.length ) {
		return;
	}

	if ( step === -1 ) {
		directHistoryPos.value = Math.min( directHistoryPos.value + 1, directHistory.value.length - 1 );
	} else {
		directHistoryPos.value = Math.max( directHistoryPos.value - 1, -1 );
	}

	if ( directHistoryPos.value === -1 ) {
		directExpr.value = "";
		directCursor.value = 0;
	} else {
		const snapshot = directHistory.value[ directHistoryPos.value ];
		directExpr.value = snapshot;
		directCursor.value = snapshot.length;
	}

	directResult.value = "";
	directError.value = "";
	renderDirectScreen();
}

function directApplyFunction( normalToken: string, shiftedToken: string ) {
	const token = directShift.value ? shiftedToken : normalToken;
	directShift.value = false;
	directInsert( token );
}

function findMatchingParenForward( expr: string, openIdx: number ) {
	if ( expr[ openIdx ] !== "(" ) {
		return -1;
	}

	let depth = 0;

	for ( let i = openIdx; i < expr.length; i += 1 ) {
		if ( expr[ i ] === "(" ) {
			depth += 1;
		} else if ( expr[ i ] === ")" ) {
			depth -= 1;

			if ( depth === 0 ) {
				return i;
			}
		}
	}

	return -1;
}

function findMatchingParenBackward( expr: string, closeIdx: number ) {
	if ( expr[ closeIdx ] !== ")" ) {
		return -1;
	}

	let depth = 0;

	for ( let i = closeIdx; i >= 0; i -= 1 ) {
		if ( expr[ i ] === ")" ) {
			depth += 1;
		} else if ( expr[ i ] === "(" ) {
			depth -= 1;

			if ( depth === 0 ) {
				return i;
			}
		}
	}

	return -1;
}

function extractPowerExponent( expr: string, caretIdx: number ) {
	const next = caretIdx + 1;

	if ( next >= expr.length ) {
		return null;
	}

	if ( expr[ next ] === "(" ) {
		const close = findMatchingParenForward( expr, next );

		if ( close < 0 ) {
			return null;
		}

		return {
			end:  close + 1,
			text: expr.slice( next + 1, close )
		};
	}

	let end = next;

	while ( end < expr.length && /[0-9+-]/.test( expr[ end ] ) ) {
		end += 1;
	}

	if ( end === next ) {
		return null;
	}

	return {
		end,
		text: expr.slice( next, end )
	};
}

function extractPowerBase( expr: string, caretIdx: number ) {
	const prev = caretIdx - 1;

	if ( prev < 0 ) {
		return null;
	}

	if ( expr[ prev ] === ")" ) {
		const open = findMatchingParenBackward( expr, prev );

		if ( open < 0 ) {
			return null;
		}

		let start = open;

		// Include a possible function name prefix, e.g. sin(...)
		while ( start > 0 && /[A-Za-z#]/.test( expr[ start - 1 ] ) ) {
			start -= 1;
		}

		return {
			start,
			text: expr.slice( start, prev + 1 )
		};
	}

	let start = prev;

	while ( start >= 0 && /[A-Za-z0-9_.]/.test( expr[ start ] ) ) {
		start -= 1;
	}

	start += 1;

	if ( start > prev ) {
		return null;
	}

	return {
		start,
		text: expr.slice( start, prev + 1 )
	};
}

function tryEvaluateSimpleArithmetic( expr: string ) {
	const trimmed = expr.trim();

	if ( !trimmed || !/^[0-9+\-*/().\s]+$/.test( trimmed ) ) {
		return null;
	}

	try {
		const value = Function( `"use strict"; return (${trimmed});` )();
		return typeof value === "number" && Number.isFinite( value ) ? value : null;
	} catch {
		return null;
	}
}

function parseReciprocalIntegerExponent( expr: string ) {
	const match = expr.trim().match( /^1\s*\/\s*\(?\s*([+-]?\d+)\s*\)?$/ );

	if ( !match ) {
		return null;
	}

	const n = Number.parseInt( match[ 1 ], 10 );

	if ( !Number.isInteger( n ) || n === 0 ) {
		return null;
	}

	return n;
}

function computeNthRoot( value: number, n: number ) {
	if ( !Number.isFinite( value ) || !Number.isInteger( n ) || n === 0 ) {
		return NaN;
	}

	if ( value < 0 ) {
		const absN = Math.abs( n );

		if ( absN % 2 === 0 ) {
			return NaN;
		}

		const mag = Math.pow( -value, 1 / absN );
		return n > 0 ? -mag : -1 / mag;
	}

	return Math.pow( value, 1 / n );
}

function expandIntegerPowers( expr: string ) {
	let out = expr;
	let i = 0;
	const MAX_ABS_EXP = 16;

	while ( i < out.length ) {
		if ( out[ i ] !== "^" ) {
			i += 1;
			continue;
		}

		const base = extractPowerBase( out, i );
		const exponent = extractPowerExponent( out, i );

		if ( !base || !exponent ) {
			i += 1;
			continue;
		}

		const expText = exponent.text.trim();
		const wrappedBase = `(${base.text})`;
		let replacement: string | null = null;

		const reciprocalExponent = parseReciprocalIntegerExponent( expText );

		if ( reciprocalExponent !== null ) {
			const baseValue = tryEvaluateSimpleArithmetic( base.text );

			if ( baseValue !== null ) {
				const rootValue = computeNthRoot( baseValue, reciprocalExponent );

				if ( Number.isFinite( rootValue ) ) {
					replacement = formatDirectNumber( rootValue );
				}
			}
		} else if ( /^[-+]?\d+$/.test( expText ) ) {
			const expValue = Number.parseInt( expText, 10 );

			if ( Number.isInteger( expValue ) && Math.abs( expValue ) <= MAX_ABS_EXP ) {
				replacement = "1";

				if ( expValue > 0 ) {
					replacement = Array.from( { length: expValue }, () => wrappedBase ).join( "*" );
				} else if ( expValue < 0 ) {
					const positivePower = Array.from( { length: Math.abs( expValue ) }, () => wrappedBase ).join( "*" );
					replacement = `1/(${positivePower})`;
				}
			}
		}

		if ( replacement === null ) {
			i += 1;
			continue;
		}

		out = out.slice( 0, base.start ) + replacement + out.slice( exponent.end );
		i = base.start + replacement.length;
	}

	return out;
}

function normalizeDirectExpression( expr: string ) {
	const ansLiteral = formatDirectNumber( directAns.value );
	const normalized = expr
		.replace( /×/g, "*" )
		.replace( /÷/g, "/" )
		.replace( /π/gi, "Pi" )
		.replace( /\bAns\b/gi, ansLiteral );

	return expandIntegerPowers( normalized );
}

function evaluateDirectExpression() {
	if ( !cbiReady.value || !window.jsccRun || directBusy.value ) {
		return;
	}

	const rawExpr = directExpr.value.trim();

	if ( !rawExpr ) {
		directResult.value = "";
		directError.value = "";
		renderDirectScreen();
		return;
	}

	directBusy.value = true;
	directError.value = "";
	directResult.value = "";
	directShift.value = false;
	stopProgram();
	status.value = "direct running";

	const src = `${directAngleMode.value}\n${normalizeDirectExpression( rawExpr )}`;
	window.jsccRun( src, (
		errorCode, message, _programs, where, lineNum
	) => {
		directBusy.value = false;

		if ( errorCode === 0 ) {
			const evaluated = Number( window.Ans );

			if ( Number.isFinite( evaluated ) ) {
				directAns.value = evaluated;
				directResult.value = formatDirectNumber( evaluated );
			} else {
				directResult.value = lcdFit( String( window.Ans ?? "" ) );
			}

			if ( !directHistory.value.length || directHistory.value[ 0 ] !== rawExpr ) {
				directHistory.value.unshift( rawExpr );

				if ( directHistory.value.length > 32 ) {
					directHistory.value.length = 32;
				}
			}

			directHistoryPos.value = -1;
			status.value = "direct ready";
		} else {
			const lineInfo = typeof lineNum === "number" && lineNum > 0 ? `L${lineNum}` : "";
			const whereInfo = where ? String( where ).replace( /\s+/g, " " )
				.trim() : "";
			directError.value = lcdFit( [ message, lineInfo, whereInfo ].filter( Boolean ).join( " " ) );
			status.value = "direct error";
		}

		renderDirectScreen();
	} );
}

function handleDirectKey( key: KeyDef ) {
	if ( !cbiReady.value ) {
		return;
	}

	if ( /^[0-9]$/.test( key.id ) ) {
		directInsert( key.id );
		return;
	}

	switch ( key.id ) {
		case "mode":
			toggleCalculatorMode();
			break;
		case "prog":
			setCalculatorMode( "basic" );
			break;
		case "shift":
			directShift.value = !directShift.value;
			renderDirectScreen();
			break;
		case "alpha":
			directInsert( "Ans" );
			break;
		case "left":
			directMoveCursor( -1 );
			break;
		case "right":
			directMoveCursor( 1 );
			break;
		case "up":
			directHistoryRecall( -1 );
			break;
		case "down":
			directHistoryRecall( 1 );
			break;
		case "disp":
			directInsert( "Ran#" );
			break;
		case "graph":
		case "lpar":
			directInsert( "(" );
			break;
		case "range":
		case "rpar":
			directInsert( ")" );
			break;
		case "gt":
		case "comma":
			directInsert( "," );
			break;
		case "colon":
			directInsert( ":" );
			break;
		case "f1":
		case "sin":
			directApplyFunction( "sin(", "Abs(" );
			break;
		case "f2":
		case "cos":
			directApplyFunction( "cos(", "Int(" );
			break;
		case "f3":
		case "tan":
			directApplyFunction( "tan(", "Frac(" );
			break;
		case "f4":
			directApplyFunction( "Mod(", "RanInt#(" );
			break;
		case "f5":
			directApplyFunction( "Ran#", "Pi" );
			break;
		case "f6":
			directApplyFunction( ",", "Ans" );
			break;
		case "x1":
			directInsertWrapped( "1/(", ")" );
			break;
		case "sqrt":
			directInsertWrapped( "sqrt(", ")" );
			break;
		case "sqr":
			directInsert( "^2" );
			break;
		case "log":
			directInsertWrapped( "log(", ")" );
			break;
		case "ln":
			directInsertWrapped( "ln(", ")" );
			break;
		case "pow":
			directInsertWrapped( "^(", ")" );
			break;
		case "root":
			directInsertWrapped( "^(1/(", "))" );
			break;
		case "hyp":
			directInsert( "-" );
			break;
		case "neg":
			directInsert( "-" );
			break;
		case "eng":
			cycleAngleMode();
			break;
		case "del":
			directBackspace();
			break;
		case "ac":
			directClearExpression( directShift.value );
			break;
		case "div":
			directInsert( "/" );
			break;
		case "mul":
			directInsert( "*" );
			break;
		case "minus":
			directInsert( "-" );
			break;
		case "plus":
			directInsert( "+" );
			break;
		case "dot":
			directInsert( "." );
			break;
		case "ans":
			directInsert( "Ans" );
			break;
		case "exe":
			evaluateDirectExpression();
			break;
		default:
			break;
	}
}

function handleDirectKeyboard( e: KeyboardEvent ) {
	if ( calcMode.value !== "direct" ) {
		return;
	}

	if ( e.metaKey || e.ctrlKey || e.altKey ) {
		return;
	}

	let handled = true;
	const key = e.key;

	if ( /^[0-9]$/.test( key ) ) {
		directInsert( key );
	} else {
		switch ( key ) {
			case "Enter":
			case "=":
				evaluateDirectExpression();
				break;
			case "Backspace":
				directBackspace();
				break;
			case "Delete":
				directDeleteForward();
				break;
			case "ArrowLeft":
				directMoveCursor( -1 );
				break;
			case "ArrowRight":
				directMoveCursor( 1 );
				break;
			case "ArrowUp":
				directHistoryRecall( -1 );
				break;
			case "ArrowDown":
				directHistoryRecall( 1 );
				break;
			case "Escape":
				directClearExpression();
				break;
			case "+":
			case "-":
			case "*":
			case "/":
			case ".":
			case "(":
			case ")":
			case ",":
				directInsert( key );
				break;
			case "a":
			case "A":
				directInsert( "Ans" );
				break;
			case "p":
			case "P":
				directInsert( "Pi" );
				break;
			case "s":
			case "S":
				directInsert( "sin(" );
				break;
			case "c":
			case "C":
				directInsert( "cos(" );
				break;
			case "t":
			case "T":
				directInsert( "tan(" );
				break;
			case "i":
			case "I":
				directInsert( "Int(" );
				break;
			case "m":
			case "M":
				directInsert( "Mod(" );
				break;
			default:
				handled = false;
				break;
		}
	}

	if ( !handled ) {
		return;
	}

	e.preventDefault();
	e.stopPropagation();

	if ( typeof e.stopImmediatePropagation === "function" ) {
		e.stopImmediatePropagation();
	}
}

function runProgram() {
	if ( !window.jsccRun ) {
		return;
	}

	if ( calcMode.value !== "basic" ) {
		setCalculatorMode( "basic" );
	}

	lastFinish.value = "";
	status.value = "running";

	const finishCb: FinishCb = (
		errorCode, message, _programs, where, lineNum
	) => {
		const extra =
      typeof lineNum === "number" && lineNum >= 0 ?
      	` (line ${lineNum}${where ? `, ${where}` : ""})` :
      	where ?
      		` (${where})` :
      		"";

		lastFinish.value = `code=${errorCode}: ${message}${extra}`;
		status.value = "ready";
	};

	// Start interpreter
	window.jsccRun( programSrc.value, finishCb );
}

function stopProgram() {
	// stop the scheduled stepping loop
	try {
		if ( window.idTimerMain ) {
			clearTimeout( window.idTimerMain );
			window.idTimerMain = 0;
		}
	} catch {
		// ignore
	}

	window.paused = true;

	if ( calcMode.value === "direct" ) {
		status.value = "direct ready";
	} else {
		status.value = "stopped";
	}
}

function hardReset() {
	stopProgram();

	try {
		window.reset?.();
		window.preset?.();
		window.cls?.();
		window.cleartext?.();
	} catch ( e: any ) {
		status.value = e?.message ?? "reset failed";
		return;
	}

	setDirectLayerVisibility( calcMode.value === "direct" );

	if ( calcMode.value === "direct" ) {
		status.value = "direct ready";
		renderDirectScreen();
	} else {
		status.value = "ready";
	}
}

type KeyKind = "std" | "accent" | "danger" | "num" | "op" | "nav" | "fn";
type KeyDef = {
  id: string;
  main: string; // KaTeX or plain
  shift?: string; // small label
  alpha?: string; // small label
  kind?: KeyKind;
  code?: number; // casio key code used by calcKeyDown
  action?: () => void;
  enabled: boolean;
  wide?: boolean;
};

function onKeyDown( key: KeyDef ) {
	if ( !key.enabled ) {
		return;
	}

	if ( calcMode.value === "direct" ) {
		handleDirectKey( key );
		return;
	}

	if ( key.action ) {
		key.action();
		return;
	}

	if ( typeof key.code === "number" ) {
		window.calcKeyDown?.( key.code );
	}
}

function onKeyUp( key: KeyDef ) {
	if ( !key.enabled ) {
		return;
	}

	if ( calcMode.value === "direct" ) {
		return;
	}

	if ( typeof key.code === "number" ) {
		window.calcKeyUp?.();
	}
}

// In BASIC mode, keys with `code` are forwarded to cbi keyboard handlers.
// In RUN mode, `handleDirectKey()` maps IDs to direct-calculator actions.
const keyRows = computed<KeyDef[][]>( () => {
	const key = (
		id: string, main: string, kind: KeyKind = "std", shift?: string, alpha?: string
	): KeyDef => ( {
		id, main, kind, shift, alpha, enabled: true
	} );

	const k = (
		id: string, main: string, code: number, kind: KeyKind = "std", shift?: string, alpha?: string, wide?: boolean
	): KeyDef => ( {
		id, main, code, kind, shift, alpha, enabled: true, wide
	} );

	const act = (
		id: string, main: string, action:
    () => void, kind: KeyKind = "std", shift?: string, alpha?: string, wide?: boolean
	): KeyDef => ( {
		id, main, action, kind, shift, alpha, enabled: true, wide
	} );

	return [
		// Row 1 (shift/alpha/prog/replay/mode look)
		[
			key(
				"shift", "SHIFT", "accent"
			),
			key(
				"alpha", "ALPHA", "accent"
			),
			key(
				"prog", "Prog", "std"
			),
			k(
				"left", "\\leftarrow", 38, "nav"
			),
			k(
				"right", "\\rightarrow", 27, "nav"
			),
			key(
				"mode", "MODE", "std"
			)
		],
		// Row 2 (disp/graph/range/up/down/g-t)
		[
			key(
				"disp", "Disp", "fn"
			),
			key(
				"graph", "Graph", "fn"
			),
			key(
				"range", "Range", "fn"
			),
			k(
				"up", "\\uparrow", 28, "nav"
			),
			k(
				"down", "\\downarrow", 37, "nav"
			),
			key(
				"gt", "G-T", "fn"
			)
		],
		// Row 3
		[
			key(
				"colon", ":", "std"
			),
			key(
				"eng", "ENG", "std"
			),
			key(
				"sqrt", "\\sqrt{\\,}", "std"
			),
			key(
				"sqr", "x^2", "std"
			),
			key(
				"log", "\\log", "std"
			),
			key(
				"ln", "\\ln", "std"
			)
		],
		// Row 4
		[
			key(
				"x1", "x^{-1}", "std"
			),
			key(
				"comma", ",", "std"
			),
			key(
				"hyp", "hyp", "std"
			),
			key(
				"sin", "\\sin", "std"
			),
			key(
				"cos", "\\cos", "std"
			),
			key(
				"tan", "\\tan", "std"
			)
		],
		// Row 5
		[
			key(
				"neg", "(-)", "std"
			),
			key(
				"right", "\\rightarrow", "nav"
			),
			key(
				"lpar", "(", "std"
			),
			key(
				"rpar", ")", "std"
			),
			key(
				"pow", "x^y", "std"
			),
			key(
				"root", "\\sqrt[y]{x}", "std"
			)
		],
		// Row 6 (7 8 9 DEL AC)
		[
			k(
				"7", "7", 74, "num"
			),
			k(
				"8", "8", 64, "num"
			),
			k(
				"9", "9", 54, "num"
			),
			k(
				"del", "DEL", 44, "danger"
			),
			act(
				"ac", "AC", hardReset, "danger"
			)
		],
		/*
    k(
				"minus", "-", 32, "op"
			),
			key(
				"lpar", "(", "std"
			)
    ,
			
    */
		// Row 6 (4 5 6 × −)
		[
			k(
				"4", "4", 73, "num"
			),
			k(
				"5", "5", 63, "num"
			),
			k(
				"6", "6", 53, "num"
			),
			k(
				"mul", "\\times", 43, "op"
			),
			k(
				"div", "\\div", 33, "op"
			)
		],
		// Row 7 (1 2 3 +)
		[
			k(
				"1", "1", 72, "num"
			),
			k(
				"2", "2", 62, "num"
			),
			k(
				"3", "3", 52, "num"
			),
			k(
				"plus", "+", 42, "op"
			),
			k(
				"minus", "-", 32, "op"
			)
			
		],
		// Row 8 (0 . EXE)
		[
			k(
				"0", "0", 71, "num", undefined, undefined, true
			),
			k(
				"dot", ".", 61, "num"
			),
			key(
				"ans", "Ans", "std"
			),
			k(
				"exe", "EXE", 31, "accent"
			)
		]
	];
} );

onMounted( async() => {
	try {
		await initCbi();
		// Draw initial clean screen and apply default mode wiring.
		hardReset();
		setCalculatorMode( calcMode.value );
		window.addEventListener(
			"keydown", handleDirectKeyboard, true
		);
	} catch ( e: any ) {
		status.value = e?.message ?? "init failed";
		cbiReady.value = false;
	}
} );

onBeforeUnmount( () => {
	stopProgram();
	stopDirectRepaint();
	window.removeEventListener(
		"keydown", handleDirectKeyboard, true
	);

	// remove global listeners that cbiInit attached (optional, but nice)
	if ( window.removeEventListener ) {
		if ( window.calcHandleOnKeyDown ) {
			window.removeEventListener( "keydown", window.calcHandleOnKeyDown as any );
		}

		if ( window.calcHandleOnKeyUp ) {
			window.removeEventListener( "keyup", window.calcHandleOnKeyUp as any );
		}
	}
} );
</script>

<style scoped>
.calc-body {
  position: relative;
  border-radius: 22px!important;
  max-width: 29em;
  background: linear-gradient(180deg, #2b2f36 0%, #1f232a 100%);
  color: #e9eef5;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.34),
    inset 1px 1px 0 rgba(255, 255, 255, 0.16),
    inset -1px -1px 0 rgba(0, 0, 0, 0.38),
    inset 0 10px 18px rgba(255, 255, 255, 0.04),
    inset 0 -10px 18px rgba(0, 0, 0, 0.18)!important;
}

.calc-top .brand-line1 {
  font-weight: 800;
  letter-spacing: .12em;
  font-size: 14px;
  opacity: .9;
}
.calc-top .brand-line2 {
  font-weight: 600;
  font-size: 13px;
  opacity: .9;
}
.brand-badge {
  margin-left: 8px;
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(255, 88, 88, .18);
  border: 1px solid rgba(255, 88, 88, .35);
  font-size: 11px;
}

.lcd-wrap {
  display: flex;
  justify-content: center;
}
.lcd-frame {
  width: 100%;
  border-radius: 16px;
  padding: 14px;
  background: linear-gradient(180deg, #d6d9d6 0%, #c7cbc7 100%);
  box-shadow: inset 0 2px 8px rgba(0,0,0,.25);
}
.lcd-glass {
  border-radius: 10px;
  background: #bfc7b9;
  padding: 10px;
  position: relative;
  overflow: hidden;
  box-shadow:
    inset 0 0 0 2px rgba(20,30,20,.18),
    inset 0 10px 30px rgba(0,0,0,.12);
}

.lcd-canvas-stack {
  position: relative;
  width: 100%;
  aspect-ratio: 758 / 374;
  margin: 0 auto;
}
.lcd-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  filter: contrast(1.08) brightness(.98) saturate(.75);
  border-radius: 6px;
}
.lcd-text,
.lcd-graph {
  z-index: 2;
}
.lcd-run {
  z-index: 2;
  display: none;
}
.lcd-backdrop {
  z-index: 1;
  background: #fff;
}

.lcd-overlay {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  border-radius: 6px;
  /* scanlines + subtle pixel grid */
  background:
    repeating-linear-gradient(
      to bottom,
      rgba(0,0,0,0.06) 0px,
      rgba(0,0,0,0.06) 1px,
      rgba(0,0,0,0.00) 3px
    ),
    repeating-linear-gradient(
      to right,
      rgba(0,0,0,0.035) 0px,
      rgba(0,0,0,0.035) 1px,
      rgba(0,0,0,0.00) 4px
    );
  mix-blend-mode: multiply;
}

.softkeys-hint {
  opacity: .75;
  user-select: none;
}

.keypad {
  --key-height-main: 44px;
  --key-height-top: calc(var(--key-height-main) * 0.6);
  --key-gap: 10px;
  display: flex;
  flex-direction: column;
  gap: var(--key-gap);
  padding: 10px;
  border-radius: 14px;
  background:
    linear-gradient(
      160deg,
      #fcfdfe 0%,
      #e8edf1 16%,
      #f7fafc 33%,
      #cfd6dd 48%,
      #f4f7f9 62%,
      #c6ced5 78%,
      #eef3f6 100%
    ),
    repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.15) 0px,
      rgba(255, 255, 255, 0.15) 2px,
      rgba(126, 136, 146, 0.08) 2px,
      rgba(126, 136, 146, 0.08) 4px
    );
  border: 1px solid rgba(255, 255, 255, 0.72);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 3px rgba(96, 106, 116, 0.3),
    0 1px 2px rgba(24, 28, 33, 0.18);
}
.key-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--key-gap);
}
.key-row:nth-child(n+6) {
  grid-template-columns: repeat(5, 1fr);
}
.key-slot {
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 100%;
  gap: 4px;
}
.key-legend {
  min-height: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 4px;
  line-height: 1;
}
.key-btn {
  border-radius: 12px;
  overflow: hidden;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  min-height: var(--key-height-main);
  text-transform: none;
}
.key-row:nth-child(-n+5) .key-btn {
  min-height: var(--key-height-top);
}
.key-row:nth-child(-n+5) .key-legend {
  min-height: 12px;
}
.key-wide {
  grid-column: span 2;
}

.key-face {
  width: 100%;
  height: 100%;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.key-main {
  font-size: 15px;
  font-weight: 700;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  min-height: 18px;
}
.key-shift, .key-alpha {
  font-size: 9px;
  opacity: .95;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.key-shift { color: #ffb347; text-align: left; }
.key-alpha { color: #ff6b6b; text-align: right; }

.k-small { font-size: 10px; }

.key-std :deep(.v-btn__content) { color: #0f141a; }
.key-std { background: #e8ecef; }

.key-num :deep(.v-btn__content) { color: #f7fbff; }
.key-num { background: #1d2026; }

.key-op :deep(.v-btn__content) { color: #f7fbff; }
.key-op { background: #2a2f3a; }

.key-nav :deep(.v-btn__content) { color: #0f141a; }
.key-nav { background: #e2e6ea; }

.key-fn :deep(.v-btn__content) { color: #0f141a; }
.key-fn { background: #e8ecef; }

.key-accent :deep(.v-btn__content) { color: #0f141a; }
.key-accent { background: #ffd08a; }

.key-danger :deep(.v-btn__content) { color: #0f141a; }
.key-danger { background: #ffb3b3; }
</style>
