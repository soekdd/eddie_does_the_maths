<template>
<v-card>
	<div class="topbar">
		<div class="left">
			<strong>Laplace Twin Editor</strong>
			<span class="pill" :class="{ ok: giacReady, bad: !giacReady }">
				{{ giacReady ? "Giac bereit" : "Giac lädt / nicht bereit" }}
			</span>
		</div>

		<div class="controls">


			<label class="ctrl toggle">
				<input v-model="autoSync" type="checkbox" />
				Auto-Sync
			</label>
		</div>
	</div>

	<div class="grid">
		<v-sheet class="pane" rounded="0">
			<header class="paneHead">
				<h2>Zeitfunktion f(<input v-model="tVar" class="mini" />)</h2>
				<div class="paneFormula">
					<Katex :tex="ftHeaderTex" />
				</div>
			</header>
			<div class="minirow">
				<v-select
					v-model="selectedFtExample"
					class="exampleSelect"
					density="compact"
					:disabled="busy"
					hide-details
					item-title="title"
					item-value="value"
					:items="ftExampleItems"
					label="Beispiel auswählen"
					variant="outlined"
					@update:model-value="applyFtExample"
				/>
				<v-btn
					:disabled="busy"
					size="small"
					variant="text"
					@click="ft = ''"
				>
					Leeren
				</v-btn>
			</div>
			<v-textarea
				v-model="ft"
				auto-grow
				class="editor"
				hide-details
				no-resize
				rows="10"
				spellcheck="false"
				variant="plain"
				@keydown.ctrl.enter.prevent="toLaplace()"
				@update:model-value="onEdit('t')"
			/>
			<div class="hint px-2">Giac-Syntax, z. B. <code>sin(t)</code> oder <code>t^2*exp(3*t)</code></div>
		</v-sheet>
		<v-sheet class="pane actionPane" rounded="0">
			<v-btn
				class="transformBtn"
				color="primary"
				:disabled="busy || !giacReady"
				variant="elevated"
				@click="toLaplace"
			>
				<span>&rarr;</span>
				<Katex inline :tex="laplaceForwardTex" />
			</v-btn>
			<v-btn
				class="transformBtn"
				color="primary"
				:disabled="busy || !giacReady"
				variant="elevated"
				@click="toTime"
			>
				<span>&larr;</span>
				<Katex inline :tex="laplaceInverseTex" />
			</v-btn>
		</v-sheet>

		<v-sheet class="pane" rounded="0">
			<header class="paneHead">
				<h2>Laplace-Bild F(<input v-model="sVar" class="mini" />)</h2>
				<div class="paneFormula">
					<Katex :tex="FsHeaderTex" />
				</div>
			</header>
			<div class="minirow">
				<v-select
					v-model="selectedFsExample"
					class="exampleSelect"
					density="compact"
					:disabled="busy"
					hide-details
					item-title="title"
					item-value="value"
					:items="FsExampleItems"
					label="Beispiel auswählen"
					variant="outlined"
					@update:model-value="applyFsExample"
				/>
				<v-btn
					:disabled="busy"
					size="small"
					variant="text"
					@click="Fs = ''"
				>
					Leeren
				</v-btn>
			</div>
			<v-textarea
				v-model="Fs"
				auto-grow
				class="editor"
				hide-details
				no-resize
				rows="10"
				spellcheck="false"
				variant="plain"
				@keydown.ctrl.enter.prevent="toTime()"
				@update:model-value="onEdit('s')"
			/>
			<div class="hint px-2">Giac-Syntax, z. B. <code>1/(s^2+1)</code></div>
		</v-sheet>
	</div>

	<div class="status">
		<div v-if="busy">Rechne…</div>
		<div v-else-if="error" class="err">{{ error }}</div>
		<div v-else class="oktxt">{{ lastInfo }}</div>
	</div>
</v-card>
</template>

<script setup lang="ts">
import {
	computed, onMounted, ref
} from "vue";
import giacFactoryAssetUrl from "../utils/giac/giacwasm.js?url";
import giacWasmAssetUrl from "../utils/giac/giacwasm.wasm?url";

/**
 * Giac-WASM integration notes:
 * - We load giacwasm.js / giacwasm.wasm from src/utils/giac via Vite asset URLs
 * - We provide window.Module BEFORE loading so we can control locateFile (wasm path)
 * - After runtime init we wrap the exported C function `caseval(const char*)`
 *
 * The Xcas/Giac author explains that `caseval` is the string-in/string-out entrypoint. :contentReference[oaicite:4]{index=4}
 * Laplace syntax: laplace(expr, t, s) and ilaplace(expr, s, t). :contentReference[oaicite:5]{index=5}
 */

declare global {
  interface Window {
    Module?: any;
    __giacCasevalFn?: ( cmd: string ) => string;
    __giacLoadingPromise?: Promise<void>;
  }
}

const giacReady = ref( false );
const busy = ref( false );
const error = ref<string | null>( null );
const lastInfo = ref( "Bereit." );
const ftPreviewTex = ref<string>( "\\;" );
const FsPreviewTex = ref<string>( "\\;" );

const tVar = ref( "t" );
const sVar = ref( "s" );
const autoSync = ref( true );

const ft = ref( "sin(t)" );
const Fs = ref( "" );

const selectedFtExample = ref<string | null>( null );
const selectedFsExample = ref<string | null>( null );
const ftExampleItems = [
	{ title: "1", value: "1" },
	{ title: "t", value: "{t}" },
	{ title: "t^2", value: "{t}^2" },
	{ title: "exp(-2*t)", value: "exp(-2*{t})" },
	{ title: "sin(t)", value: "sin({t})" },
	{ title: "cos(t)", value: "cos({t})" },
	{ title: "sinh(t)", value: "sinh({t})" },
	{ title: "cosh(t)", value: "cosh({t})" },
	{ title: "t*exp(-t)", value: "{t}*exp(-{t})" },
	{ title: "exp(2*t)*sin(3*t)", value: "exp(2*{t})*sin(3*{t})" }
];
const FsExampleItems = [
	{ title: "1/s", value: "1/{s}" },
	{ title: "1/s^2", value: "1/{s}^2" },
	{ title: "2/s^3", value: "2/{s}^3" },
	{ title: "1/(s+2)", value: "1/({s}+2)" },
	{ title: "s/(s^2+1)", value: "{s}/({s}^2+1)" },
	{ title: "1/(s^2+1)", value: "1/({s}^2+1)" },
	{ title: "s/(s^2-1)", value: "{s}/({s}^2-1)" },
	{ title: "1/(s^2-1)", value: "1/({s}^2-1)" },
	{ title: "1/(s+1)^2", value: "1/({s}+1)^2" },
	{ title: "3/((s-2)^2+9)", value: "3/(({s}-2)^2+9)" }
];

let casevalFn: ( ( cmd: string ) => string ) | null = null;
const GIAC_FACTORY_URL = giacFactoryAssetUrl;
const GIAC_WASM_URL = giacWasmAssetUrl;
const GIAC_ASSET_BASE_URL = GIAC_WASM_URL.slice( 0, GIAC_WASM_URL.lastIndexOf( "/" ) + 1 );
const GIAC_CWRAP_MISSING_ERROR = "Giac Module.cwrap() fehlt – falsches Build oder Script nicht korrekt geladen.";
const GIAC_CASEVAL_MISSING_ERROR = "caseval ist nicht verfügbar.";
const tVarTex = computed( () => tVar.value.trim() || "t" );
const sVarTex = computed( () => sVar.value.trim() || "s" );
const laplaceForwardTex = computed( () =>
	String.raw`\mathcal{L}\{f(${tVarTex.value})\}` );
const laplaceInverseTex = computed( () =>
	String.raw`\mathcal{L}^{-1}\{F(${sVarTex.value})\}` );
const ftHeaderTex = computed( () =>
	String.raw`f(${tVarTex.value})=${ftPreviewTex.value || "\\;"}` );
const FsHeaderTex = computed( () =>
	String.raw`F(${sVarTex.value})=${FsPreviewTex.value || "\\;"}` );

function sanitizeExpr( input: string ): string {
	// tiny convenience: allow "f(t)=..." and keep RHS
	const s = input.trim();
	const eq = s.indexOf( "=" );

	if ( eq >= 0 ) {
		return s.slice( eq + 1 ).trim();
	}

	return s;
}

function withSelectedVariable( expression: string, which: "t" | "s" ): string {
	const selectedVar = which === "t" ? tVarTex.value : sVarTex.value;
	const placeholder = which === "t" ? "{t}" : "{s}";

	return expression.split( placeholder ).join( selectedVar );
}

async function applyFtExample( template: string | null ) {
	if ( !template ) {
		return;
	}

	ft.value = withSelectedVariable( template, "t" );
	selectedFtExample.value = null;
	await refreshPreview( "t" );
	await toLaplace();
}

async function applyFsExample( template: string | null ) {
	if ( !template ) {
		return;
	}

	Fs.value = withSelectedVariable( template, "s" );
	selectedFsExample.value = null;
	await refreshPreview( "s" );
	await toTime();
}

async function giacToLatex( expr: string ) {
	// Giac liefert LaTeX-String für einen Ausdruck via latex(...)
	// Wir trimmen und entfernen ggf. umschließende Quotes.
	const cleaned = sanitizeExpr( expr );

	if ( !cleaned ) {
		return "\\;";
	}

	const out = await giacEval( `latex(${cleaned})` );
	return out?.replace( /^"([\s\S]*)"$/, "$1" )?.trim() || "\\;";
}

async function refreshPreview( which: "t" | "s" ) {
	try {
		const raw = which === "t" ? ft.value : Fs.value;
		const fallbackTex = sanitizeExpr( raw ) || "\\;";

		if ( !giacReady.value ) {
			if ( which === "t" ) {
				ftPreviewTex.value = fallbackTex;
			} else {
				FsPreviewTex.value = fallbackTex;
			}

			return;
		}

		const tex = await giacToLatex( raw );

		if ( which === "t" ) {
			ftPreviewTex.value = tex;
		} else {
			FsPreviewTex.value = tex;
		}
	} catch ( e: any ) {
		const raw = which === "t" ? ft.value : Fs.value;
		const fallbackTex = sanitizeExpr( raw ) || "\\;";

		if ( which === "t" ) {
			ftPreviewTex.value = fallbackTex;
		} else {
			FsPreviewTex.value = fallbackTex;
		}
	}
}


async function loadGiac(): Promise<void> {
	if ( giacReady.value && casevalFn ) {
		return;
	}

	// Reuse runtime across route/component remounts.
	if ( window.__giacCasevalFn ) {
		casevalFn = window.__giacCasevalFn;
		giacReady.value = true;
		return;
	}

	if ( !window.__giacLoadingPromise ) {
		window.__giacLoadingPromise = new Promise<void>( ( resolve, reject ) => {
			// Provide Module before loading giacwasm.js
			window.Module = {
				locateFile: ( path: string ) => {
					// Emscripten asks for "giacwasm.wasm" (or sometimes just "*.wasm")
					if ( path.endsWith( ".wasm" ) ) {
						return GIAC_WASM_URL;
					}

					return GIAC_ASSET_BASE_URL + path;
				},
				print:                ( txt: string ) => console.log( "[giac]", txt ),
				printErr:             ( txt: string ) => console.error( "[giac]", txt ),
				onRuntimeInitialized: () => {
					try {
						const M = window.Module;

						if ( !M || typeof M.cwrap !== "function" ) {
							throw new Error( GIAC_CWRAP_MISSING_ERROR );
						}

						window.__giacCasevalFn = M.cwrap(
							"caseval", "string", [ "string" ]
						);
						resolve();
					} catch ( e: any ) {
						reject( e );
					}
				}
			};

			const script = document.createElement( "script" );
			script.src = GIAC_FACTORY_URL;
			script.async = true;
			script.onerror = () => reject( new Error( "Konnte giacwasm.js aus src/utils/giac nicht laden." ) );
			document.head.appendChild( script );
		} )
			.catch( ( err ) => {
				// Allow retries after a failed navigation-time load.
				window.__giacLoadingPromise = undefined;
				throw err;
			} );
	}

	await window.__giacLoadingPromise;

	casevalFn = window.__giacCasevalFn ?? casevalFn;

	if ( !casevalFn ) {
		const M = window.Module;

		if ( M && typeof M.cwrap === "function" ) {
			casevalFn = M.cwrap(
				"caseval", "string", [ "string" ]
			);
			window.__giacCasevalFn = casevalFn;
		}
	}

	if ( !casevalFn ) {
		throw new Error( GIAC_CASEVAL_MISSING_ERROR );
	}

	giacReady.value = true;
	lastInfo.value = "Giac initialisiert.";
}

async function giacEval( cmd: string ): Promise<string> {
	await loadGiac();

	if ( !casevalFn ) {
		throw new Error( GIAC_CASEVAL_MISSING_ERROR );
	}

	// giac returns a string; we trim lightly
	const out = casevalFn( cmd );
	return ( out ?? "" ).toString().trim();
}

async function toLaplace(): Promise<void> {
	error.value = null;
	busy.value = true;

	try {
		const expr = sanitizeExpr( ft.value );
		// laplace(expr, t, s) — explicit vars so results don't default to x :contentReference[oaicite:6]{index=6}
		const cmd = `laplace(${expr},${tVar.value},${sVar.value})`;
		const out = await giacEval( cmd );
		Fs.value = out;
		lastInfo.value = "Laplace transformiert.";
		await refreshPreview( "s" );
	} catch ( e: any ) {
		error.value = e?.message ?? String( e );
	} finally {
		busy.value = false;
	}
}

async function toTime(): Promise<void> {
	error.value = null;
	busy.value = true;

	try {
		const expr = sanitizeExpr( Fs.value );
		// inverse: ilaplace(expr, s, t) :contentReference[oaicite:7]{index=7}
		const cmd = `ilaplace(${expr},${sVar.value},${tVar.value})`;
		const out = await giacEval( cmd );
		ft.value = out;
		lastInfo.value = "Inverse Laplace transformiert.";
		await refreshPreview( "t" );
	} catch ( e: any ) {
		error.value = e?.message ?? String( e );
	} finally {
		busy.value = false;
	}
}

let debounceTimer: number | null = null;
let lastEdited: "t" | "s" | null = null;

function onEdit( which: "t" | "s" ) {
	lastEdited = which;
	refreshPreview( which );

	if ( !autoSync.value ) {
		return;
	}

	if ( debounceTimer ) {
		window.clearTimeout( debounceTimer );
	}

	debounceTimer = window.setTimeout( async() => {
		// avoid ping-pong by only transforming away from the field the user edits
		if ( busy.value ) {
			return;
		}

		if ( which === "t" ) {
			await toLaplace();
		} else {
			await toTime();
		}
	}, 350 );
}

onMounted( async() => {
	try {
		await loadGiac();
		await refreshPreview( "t" );
		await refreshPreview( "s" );
	} catch ( e: any ) {
		error.value = e?.message ?? String( e );
		await refreshPreview( "t" );
		await refreshPreview( "s" );
	}
} );
</script>

<style scoped>
.topbar {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: rgba(var(--v-theme-surface-variant), 0.35);
  flex-wrap: wrap;
}

.left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pill {
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.2);
}
.pill.ok {
  background: rgba(var(--v-theme-success), 0.14);
  color: rgb(var(--v-theme-on-surface));
}
.pill.bad {
  background: rgba(var(--v-theme-error), 0.14);
  color: rgb(var(--v-theme-on-surface));
}

.controls {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.ctrl {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 12px;
}
.ctrl.toggle { gap: 8px; }

.mini {
  width: 20px;
  padding: 4px 6px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.22);
  border-radius: 8px;
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
}

.grid {
  display: grid;
  grid-template-columns: 5fr 1fr 5fr;
  min-height: 360px;
}
@media (max-width: 920px) {
  .grid { grid-template-columns: 1fr; }
}

.pane {
  display: flex;
  flex-direction: column;
}
.actionPane {
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.paneHead {
  padding: 12px 14px 8px 14px;
  background: rgba(var(--v-theme-surface), 1);
}
.paneHead h3 {
  margin: 0 0 6px 0;
  font-size: 14px;
}
.hint {
  font-size: 12px;
  color: rgba(var(--v-theme-on-surface), 0.72);
}
.paneFormula {
  margin-bottom: 6px;
}
.transformBtn {
  text-transform: none !important;
  height:4em;
  min-width: 9em;
  margin: 0 1em;
   
}
.transformBtn :deep(.v-btn__content) {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  white-space: normal;
  line-height: 1;
  text-transform: none !important;
}


.editor {
  flex: 1;
}
.editor :deep(.v-input__control),
.editor :deep(.v-field),
.editor :deep(.v-field__field),
.editor :deep(.v-field__input),
.editor :deep(textarea) {
  height: 100%;
}
.editor :deep(.v-field) {
  background: rgba(var(--v-theme-surface), 1);
}
.editor :deep(.v-field__input) {
  padding: 12px 14px;
  color: rgb(var(--v-theme-on-surface));
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 13px;
  line-height: 1.45;
  -webkit-mask-image: none;
  mask-image: none;
}
.editor :deep(textarea::placeholder) {
  color: rgba(var(--v-theme-on-surface), 0.5);
}

.minirow {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 10px 14px;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  background: rgba(var(--v-theme-surface-variant), 0.35);
}
.exampleSelect {
  flex: 1;
  min-width: 220px;
}

.status {
  padding: 10px 14px;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  background: rgba(var(--v-theme-surface), 1);
  font-size: 13px;
}
.err { color: rgb(var(--v-theme-error)); }
.oktxt { color: rgb(var(--v-theme-on-surface)); }
</style>
