<template>
  <v-card class="pa-4">
    <v-row dense align="center">
      <v-col cols="12" md="5">
        <v-select
          v-model="selectedId"
          :items="programItems"
          label="BASIC-Programm"
          density="compact"
          hide-details
        />
      </v-col>

      <v-col cols="12" md="7" class="d-flex ga-2 align-center">
        <v-btn
          :disabled="!ready || running"
          @click="runSelected"
          color="primary"
        >
          RUN
        </v-btn>

        <v-btn
          :disabled="!ready || running"
          @click="clearScreen"
          variant="tonal"
        >
          CLEAR
        </v-btn>

        <v-btn
          :disabled="!ready || running"
          @click="softReset"
          variant="tonal"
        >
          RESET
        </v-btn>

        <v-spacer />

        <v-chip v-if="ready" color="green" variant="tonal" size="small">
          cbmbasic ready
        </v-chip>
        <v-chip v-else color="grey" variant="tonal" size="small">
          loading…
        </v-chip>
      </v-col>
    </v-row>

    <div class="c64-wrap mt-4">
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

    <v-row dense class="mt-3">
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
    </v-row>

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
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

type DemoProgram = { id: string; name: string; source: string };

const props = withDefaults(
  defineProps<{
    /**
     * URL zur Emscripten-Factory (cbmbasic.js), z.B. "/cbmbasic/cbmbasic.js"
     * Muss ein ES Module sein, das default-exported: (ModuleOverrides) => Promise<Module>
     */
    cbmbasicFactoryUrl?: string;

    /**
     * Basis-URL für wasm/weitere Assets, falls dein Emscripten-Build locateFile nutzt.
     * Beispiel: "/cbmbasic/"
     */
    wasmBaseUrl?: string;

    /**
     * Cursor blinken lassen
     */
    blinkCursor?: boolean;
  }>(),
  {
    cbmbasicFactoryUrl: "/cbmbasic/cbmbasic.js",
    wasmBaseUrl: "/cbmbasic/",
    blinkCursor: true,
  }
);

const COLS = 40;
const ROWS = 25;
const SIZE = COLS * ROWS;

// Ein paar Demos (klein & text-only)
const programs = ref<DemoProgram[]>([
  {
    id: "hello",
    name: "Hello World",
    source: [
      "10 PRINT CHR$(147)",
      "20 PRINT \"**** C64 BASIC (cbmbasic) ****\"",
      "30 PRINT",
      "40 PRINT \"HELLO WORLD!\"",
      "50 PRINT",
      "60 FOR I=1 TO 5: PRINT \"I=\";I;\"  I^2=\";I*I: NEXT",
      "70 PRINT",
      "80 PRINT \"READY.\"",
    ].join("\n"),
  },
  {
    id: "locate",
    name: "LOCATE Demo (SYS 1)",
    source: [
      "10 SYS 1",
      "20 PRINT CHR$(147)",
      "30 LOCATE 2,10: PRINT \"E D D I E\"",
      "40 LOCATE 4,6:  PRINT \"MATHE IST EIN SCHLUESSEL\"",
      "50 LOCATE 6,6:  PRINT \"(TEXTMODE ONLY)\"",
      "60 LOCATE 10,0: PRINT \"READY.\"",
    ].join("\n"),
  },
  {
    id: "stars",
    name: "Sternchen",
    source: [
      "10 PRINT CHR$(147)",
      "20 FOR Y=1 TO 10",
      "30 S$=\"\"",
      "40 FOR X=1 TO Y",
      "50 S$=S$+\"*\"",
      "60 NEXT X",
      "70 PRINT S$",
      "80 NEXT Y",
      "90 PRINT",
      "100 PRINT \"READY.\"",
    ].join("\n"),
  },
]);

const programItems = computed(() =>
  programs.value.map((p) => ({ title: p.name, value: p.id }))
);
const selectedId = ref(programs.value[0]?.id ?? "");

const ready = ref(false);
const running = ref(false);
const lastError = ref<string>("");

// --- Screen state ---
const screenText = ref("");
const cursorX = ref(0);
const cursorY = ref(0);
let mem = new Uint16Array(SIZE); // 0..255 character codes; wir nutzen primär ASCII 32..126

function resetMem() {
  mem.fill(32);
  cursorX.value = 0;
  cursorY.value = 0;
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

function putByte(b: number) {
  // wichtige PETSCII/Control-Codes, minimal:
  if (b === 10 || b === 13) {
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
  if (!props.blinkCursor) {
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

  // cbmbasic factory dynamisch laden (aus /public)
  const factoryModule = await import(/* @vite-ignore */ props.cbmbasicFactoryUrl);
  const create = factoryModule?.default ?? factoryModule?.createCbmbasic;
  if (typeof create !== "function") {
    throw new Error(
      `cbmbasic factory export nicht gefunden. Erwartet default-export Funktion in ${props.cbmbasicFactoryUrl}`
    );
  }

  // Emscripten Module Overrides
  mod = await create({
    noInitialRun: true,
    // falls dein Build locateFile nutzt:
    locateFile: (path: string) => {
      const base = props.wasmBaseUrl.endsWith("/") ? props.wasmBaseUrl : props.wasmBaseUrl + "/";
      return base + path;
    },
  });

  // stdout/stderr byteweise hooken
  mod.FS.init(stdinGetChar, stdoutPutChar, stderrPutChar);

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

function getSelectedProgram(): DemoProgram | undefined {
  return programs.value.find((p) => p.id === selectedId.value);
}

async function runSelected() {
  const p = getSelectedProgram();
  if (!p || !mod) return;

  running.value = true;
  lastError.value = "";
  resetMem();

  try {
    // Programm als Datei schreiben und cbmbasic damit starten:
    const path = "/program.bas";
    try {
      mod.FS.unlink(path);
    } catch {
      /* ignore */
    }
    mod.FS.writeFile(path, p.source, { encoding: "utf8" });

    // run
    mod.callMain([path]);
  } catch (e: any) {
    lastError.value = e?.message ?? String(e);
  } finally {
    running.value = false;
    scheduleRender();
  }
}

function sendInput() {
  const line = inputLine.value;
  if (!line) return;

  // cbmbasic erwartet normale Textzeile + CR (C64: 13)
  for (let i = 0; i < line.length; i++) stdinQueue.value.push(line.charCodeAt(i) & 0xff);
  stdinQueue.value.push(13);

  inputLine.value = "";
}

onMounted(async () => {
  resetMem();
  startBlink();

  try {
    await loadCbmbasic();
    softReset();
  } catch (e: any) {
    lastError.value = e?.message ?? String(e);
  }
});

onBeforeUnmount(() => {
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
  padding: 0.8em 0.8ch;
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
