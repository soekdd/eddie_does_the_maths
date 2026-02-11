<template>
  <v-card class="pa-4">
    <div class="c64-wrap">
      <div class="c64-frame">
        <div class="c64-border">
          <div class="c64-screen" role="img" aria-label="C64 text screen">
            <pre class="c64-text">{{ screenText }}</pre>

            <!-- Cursor-Overlay -->
            <div
              v-if="cursorBlinkOn"
              class="c64-cursor"
              :style="cursorStyle"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>

   <!--  <v-row dense class="mt-3">
      <v-col cols="12" md="8">
        <v-text-field
          v-model="inputLine"
          label="Optional: INPUT-Zeile (Enter sendet)"
          density="compact"
          hide-details
          @keydown.enter.prevent="sendInput"
        />
      </v-col>
      <v-col cols="12" md="4" class="d-flex ga-2">
        <v-btn
          :disabled="!inputLine"
          @click="sendInput"
          variant="tonal"
        >
          SEND
        </v-btn>
        <v-btn
          :disabled="stdinQueue.length === 0"
          @click="stdinQueue = []"
          variant="text"
        >
          queue leeren
        </v-btn>
      </v-col>
    </v-row> -->

    <v-alert
      v-if="lastError"
      type="error"
      density="compact"
      class="mt-3"
    >
      {{ lastError }}
    </v-alert>

    <v-alert
      v-else
      type="info"
      density="compact"
      class="mt-3"
    >
      Tipp: Viele Listings starten mit <code>PRINT CHR$(147)</code> (Clear Screen).
    </v-alert>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import cbmbasicFactoryAssetUrl from "../utils/webdist/cbmbasic.mjs?url";
import cbmbasicWasmAssetUrl from "../utils/webdist/cbmbasic.wasm?url";

const DEFAULT_CBMBASIC_FACTORY_URL = cbmbasicFactoryAssetUrl;
const DEFAULT_WASM_URL = cbmbasicWasmAssetUrl;
const DEFAULT_WASM_BASE_URL = DEFAULT_WASM_URL.slice(
  0,
  DEFAULT_WASM_URL.lastIndexOf("/") + 1
);

const props = defineProps<{
  /**
   * URL zur Emscripten-Factory (cbmbasic.mjs)
   * Muss ein ES Module sein, das default-exported: (ModuleOverrides) => Promise<Module>
   */
  cbmbasicFactoryUrl?: string;

  /**
   * Basis-URL für wasm/weitere Assets, falls dein Emscripten-Build locateFile nutzt.
   * Beispiel: "https://.../cbmbasic/"
   */
  wasmBaseUrl?: string;

  /**
   * Cursor blinken lassen
   */
  blinkCursor?: boolean;
}>();
const emit = defineEmits<{
  (e: "hard-restart", payload: { reason: string }): void;
  (e: "state-change", payload: { ready: boolean; running: boolean }): void;
}>();

const resolvedCbmbasicFactoryUrl = computed(
  () => props.cbmbasicFactoryUrl ?? DEFAULT_CBMBASIC_FACTORY_URL
);
const resolvedWasmBaseUrl = computed(
  () => props.wasmBaseUrl ?? DEFAULT_WASM_BASE_URL
);
const resolvedWasmFileUrl = computed(() => {
  if (!props.wasmBaseUrl) {
    return DEFAULT_WASM_URL;
  }
  const base = props.wasmBaseUrl.endsWith("/")
    ? props.wasmBaseUrl
    : props.wasmBaseUrl + "/";
  return base + "cbmbasic.wasm";
});
const blinkCursor = computed(() => props.blinkCursor ?? true);

// C64 text mode: 40 columns x 25 rows.
const COLS = 40;
const ROWS = 25;
const SIZE = COLS * ROWS;

const ready = ref(false);
const running = ref(false);
const lastError = ref<string>("");
let hardRestartRequested = false;

function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message || error.name;
  }
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object") {
    const maybeMessage = (error as { message?: unknown }).message;
    if (typeof maybeMessage === "string" && maybeMessage.trim().length > 0) {
      return maybeMessage;
    }
    try {
      return JSON.stringify(error, null, 2);
    } catch {
      return Object.prototype.toString.call(error);
    }
  }
  return String(error);
}

function isMemoryOutOfBoundsError(message: string): boolean {
  return /\b(memory(\s+access)?\s+out\s+of\s+bounds|wasm.*out\s+of\s+bounds)\b/i.test(
    message
  );
}

function requestHardRestart(reason: string) {
  if (hardRestartRequested) {
    return;
  }
  hardRestartRequested = true;
  ready.value = false;
  running.value = false;
  mod = null;
  stdinQueue.value = [];
  queueMicrotask(() => {
    emit("hard-restart", { reason });
  });
}

function handleRuntimeError(error: unknown): string {
  const message = formatError(error);
  lastError.value = message;
  if (isMemoryOutOfBoundsError(message)) {
    requestHardRestart(message);
  }
  return message;
}

function onGlobalError(event: ErrorEvent) {
  const message = handleRuntimeError(event.error ?? event.message);
  if (isMemoryOutOfBoundsError(message)) {
    event.preventDefault();
  }
}

function onUnhandledRejection(event: PromiseRejectionEvent) {
  const message = handleRuntimeError(event.reason);
  if (isMemoryOutOfBoundsError(message)) {
    event.preventDefault();
  }
}

// --- Screen state ---
const screenText = ref("");
const cursorX = ref(0);
const cursorY = ref(0);
let mem = new Uint16Array(SIZE); // 0..255 character codes; wir nutzen primär ASCII 32..126
let ansiState: "none" | "esc" | "csi" = "none";
let ansiCsiBuffer = "";
let lastWasCR = false;

function resetMem() {
  mem.fill(32);
  cursorX.value = 0;
  cursorY.value = 0;
  lastWasCR = false;
  scheduleRender();
}

function scrollUp() {
  // move rows 1..end to 0..end-1
  mem.copyWithin(0, COLS, SIZE);
  mem.fill(32, SIZE - COLS);
  cursorY.value = ROWS - 1;
}

function newline() {
  cursorX.value = 0;
  cursorY.value += 1;
  if (cursorY.value >= ROWS) scrollUp();
}

function backspace() {
  if (cursorX.value > 0) {
    cursorX.value -= 1;
  } else if (cursorY.value > 0) {
    cursorY.value -= 1;
    cursorX.value = COLS - 1;
  }
  mem[cursorY.value * COLS + cursorX.value] = 32;
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function applyAnsiCursor(row1Based: number, col1Based: number) {
  cursorY.value = clamp(row1Based - 1, 0, ROWS - 1);
  cursorX.value = clamp(col1Based - 1, 0, COLS - 1);
}

function parseAnsiNumber(input: string | undefined): number | undefined {
  if (input === undefined || input === "") return undefined;
  const n = Number.parseInt(input, 10);
  if (!Number.isFinite(n)) return undefined;
  return n;
}

function applyAnsiCsi(finalByte: number, rawParams: string) {
  const final = String.fromCharCode(finalByte);
  const params = rawParams === "" ? [] : rawParams.split(";");

  if (final === "J") {
    const mode = parseAnsiNumber(params[0]) ?? 0;
    // Wir unterstützen aktuell nur "clear screen" (CSI 2J), wie von SYS 1 / LOCATE genutzt.
    if (mode === 2) {
      resetMem();
    }
    return;
  }

  if (final === "H" || final === "f") {
    const row = parseAnsiNumber(params[0]) ?? 1;
    const col = parseAnsiNumber(params[1]) ?? 1;
    applyAnsiCursor(row, col);
  }
}

function consumeAnsiByte(b: number): boolean {
  if (ansiState === "esc") {
    if (b === 91) {
      // '[' -> CSI
      ansiState = "csi";
      ansiCsiBuffer = "";
      return true;
    }
    ansiState = "none";
    return false;
  }

  if (ansiState === "csi") {
    // Parameter bytes for CSI are usually 0x30..0x3F (digits + ';' etc.).
    if (b >= 48 && b <= 63) {
      ansiCsiBuffer += String.fromCharCode(b);
      if (ansiCsiBuffer.length > 32) {
        ansiState = "none";
        ansiCsiBuffer = "";
      }
      return true;
    }

    // Final byte in 0x40..0x7E.
    if (b >= 64 && b <= 126) {
      applyAnsiCsi(b, ansiCsiBuffer);
      ansiState = "none";
      ansiCsiBuffer = "";
      return true;
    }

    ansiState = "none";
    ansiCsiBuffer = "";
    return true;
  }

  return false;
}

function putByte(b: number) {
  if (b !== 10 && b !== 13) {
    lastWasCR = false;
  }

  if (consumeAnsiByte(b)) {
    return;
  }

  if (b === 27) {
    // ESC -> start ANSI sequence parsing.
    ansiState = "esc";
    ansiCsiBuffer = "";
    return;
  }

  // wichtige PETSCII/Control-Codes, minimal:
  if (b === 13) {
    newline();
    lastWasCR = true;
    return;
  }
  if (b === 10) {
    if (lastWasCR) {
      lastWasCR = false;
      return;
    }
    newline();
    return;
  }
  if (b === 8 || b === 20) {
    backspace();
    return;
  }
  if (b === 147) {
    // CHR$(147) -> Clear Screen auf dem C64
    resetMem();
    return;
  }
  if (b < 32) return; // ignorieren (Cursor-Up/Down etc. erstmal nicht)
  if (b > 255) return;

  const idx = cursorY.value * COLS + cursorX.value;
  if (idx >= 0 && idx < SIZE) mem[idx] = b;

  cursorX.value += 1;
  if (cursorX.value >= COLS) newline();
}

function toGlyph(code: number): string {
  // Minimal: ASCII sichtbar, Rest als Leerzeichen.
  if (code >= 32 && code <= 126) return String.fromCharCode(code);
  // einfache Latein-1-Fallbacks (optional sichtbar):
  if (code >= 160 && code <= 255) return String.fromCharCode(code);
  return " ";
}

let renderQueued = false;
function scheduleRender() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    let out = "";
    for (let y = 0; y < ROWS; y++) {
      const base = y * COLS;
      for (let x = 0; x < COLS; x++) out += toGlyph(mem[base + x]);
      if (y < ROWS - 1) out += "\n";
    }
    screenText.value = out;
  });
}

// Cursor overlay
const cursorStyle = computed(() => ({
  left: `${cursorX.value}ch`,
  top: `${cursorY.value}em`,
}));

const cursorBlinkOn = ref(true);
let blinkTimer: number | null = null;

function startBlink() {
  stopBlink();
  if (!blinkCursor.value) {
    cursorBlinkOn.value = true;
    return;
  }
  cursorBlinkOn.value = true;
  blinkTimer = window.setInterval(() => {
    cursorBlinkOn.value = !cursorBlinkOn.value;
  }, 500);
}
function stopBlink() {
  if (blinkTimer !== null) {
    window.clearInterval(blinkTimer);
    blinkTimer = null;
  }
}

// --- cbmbasic (Emscripten) integration ---
type EmscriptenModule = {
  FS: {
    init: (stdin: () => number | null, stdout: (c: number) => void, stderr: (c: number) => void) => void;
    writeFile: (path: string, data: string | Uint8Array, opts?: any) => void;
    unlink: (path: string) => void;
  };
  callMain: (args: string[]) => void;
};

let mod: EmscriptenModule | null = null;

// stdin queue (für INPUT)
const stdinQueue = ref<number[]>([]);
const inputLine = ref("");

function stdinGetChar(): number | null {
  // Emscripten erwartet int (0..255) oder null (EOF).
  if (stdinQueue.value.length === 0) return null;
  return stdinQueue.value.shift() ?? null;
}

function stdoutPutChar(c: number) {
  putByte(c & 0xff);
  scheduleRender();
}

function stderrPutChar(c: number) {
  // Du kannst stderr farblich anders machen – hier einfach auch auf Screen (oder ignorieren).
  stdoutPutChar(c);
}

async function loadCbmbasic() {
  lastError.value = "";
  ready.value = false;

  // cbmbasic factory dynamisch laden (aus src-Asset oder externer URL)
  const factoryModule = await import(
    /* @vite-ignore */ resolvedCbmbasicFactoryUrl.value
  );
  const create = factoryModule?.default ?? factoryModule?.createCbmbasic;
  if (typeof create !== "function") {
    throw new Error(
      `cbmbasic factory export nicht gefunden. Erwartet default-export Funktion in ${resolvedCbmbasicFactoryUrl.value}`
    );
  }

  // Emscripten Module Overrides
  mod = await create({
    noInitialRun: true,
    stdin: stdinGetChar,
    stdout: stdoutPutChar,
    stderr: stderrPutChar,
    // falls dein Build locateFile nutzt:
    locateFile: (path: string) => {
      if (path === "cbmbasic.wasm") {
        // In production builds Vite hashes asset filenames.
        return resolvedWasmFileUrl.value;
      }
      const base = resolvedWasmBaseUrl.value.endsWith("/")
        ? resolvedWasmBaseUrl.value
        : resolvedWasmBaseUrl.value + "/";
      return base + path;
    },
  });

  ready.value = true;
}

function clearScreen() {
  resetMem();
}

function softReset() {
  stdinQueue.value = [];
  resetMem();
  // Optional: typische READY-Zeile
  const readyLine = "READY.";
  for (const ch of readyLine) putByte(ch.charCodeAt(0));
  scheduleRender();
}

async function runProgram(source: string) {
  if (!source) return;
  running.value = true;
  lastError.value = "";
  resetMem();

  try {
    // Immer mit frischer Runtime starten, damit kein alter Zustand weiterlebt.
    await loadCbmbasic();
    softReset();
    if (!mod) {
      throw new Error("cbmbasic wurde nicht initialisiert.");
    }

    // Programm als Datei schreiben und cbmbasic damit starten:
    const path = "/program.bas";
    const normalizedSource = source.replace(/\r?\n/g, "\r");
    const sourceForCbmbasic = normalizedSource.endsWith("\r")
      ? normalizedSource
      : normalizedSource + "\r";
    try {
      mod.FS.unlink(path);
    } catch {
      /* ignore */
    }
    mod.FS.writeFile(path, sourceForCbmbasic, { encoding: "utf8" });

    // run
    mod.callMain([path]);
  } catch (error: unknown) {
    handleRuntimeError(error);
  } finally {
    running.value = false;
    scheduleRender();
  }
}

watch(
  [ready, running],
  ([isReady, isRunning]) => {
    emit("state-change", { ready: isReady, running: isRunning });
  },
  { immediate: true }
);

defineExpose({
  clearScreen,
  runProgram,
  softReset,
});

function sendInput() {
  const line = inputLine.value;
  if (!line) return;

  // cbmbasic erwartet normale Textzeile + CR (C64: 13)
  for (let i = 0; i < line.length; i++) stdinQueue.value.push(line.charCodeAt(i) & 0xff);
  stdinQueue.value.push(13);

  inputLine.value = "";
}

onMounted(async () => {
  hardRestartRequested = false;
  resetMem();
  startBlink();
  window.addEventListener("error", onGlobalError);
  window.addEventListener("unhandledrejection", onUnhandledRejection);

  try {
    await loadCbmbasic();
    softReset();
  } catch (error: unknown) {
    handleRuntimeError(error);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("error", onGlobalError);
  window.removeEventListener("unhandledrejection", onUnhandledRejection);
  stopBlink();
});
</script>

<style scoped>
/* C64-ish look (blauer Screen + hellere Umrandung) */
.c64-wrap {
  display: flex;
  justify-content: center;
}

.c64-frame {
  border-radius: 14px;
  padding: 10px;
  background: #2a2a2a;
  box-shadow: 0 8px 26px rgba(0, 0, 0, 0.35);
}

.c64-border {
  padding: 14px;
  border-radius: 10px;
  background: #6b5fb7; /* helleres "border"-blau */
}

.c64-screen {
  position: relative;
  width: 40ch;
  height: 25em;
  overflow: hidden;
  border-radius: 6px;
  background: #40318d; /* typisches C64-blau */
}

.c64-text {
  margin: 0;
  padding: 0;
  width: 40ch;
  height: 25em;
  color: #b7b3ff; /* helles blau/lila */
  background: transparent;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace;
  font-size: 16px;
  line-height: 1em; /* wichtig für Cursor-Overlay (top: y em) */
  letter-spacing: 0;
  white-space: pre;
  user-select: text;
}

/* blinkender Block-Cursor */
.c64-cursor {
  position: absolute;
  width: 1ch;
  height: 1em;
  background: #b7b3ff;
  mix-blend-mode: difference; /* invertiert an der Cursorstelle schön "c64-ish" */
  pointer-events: none;
}
</style>
