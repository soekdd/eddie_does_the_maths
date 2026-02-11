<template>
<AppFrame>
	<template #title>
		<div class="badge">ST</div>
		<div>
			<h1>Eddie rechnet: Spieltheorie am Busbahnhof</h1>
			<p class="sub">Entscheidungsbaum • Wahrscheinlichkeiten • Rechner</p>
		</div>
	</template>

	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="`Eddie`">
				<img alt="Eddie rechnet" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>

		<h2>Teil 1 — Worum’s geht (Kurzfassung)</h2>
		<div class="eddie">
			<p class="muted">
				<i>„Spieltheorie“</i>
			</p>

			<p>
				Ich entscheide nicht aus dem Bauch, sondern rechne mir die <b>Chance auf Freiheit</b> aus. Ich
				zerlege die Szene in <b>Pfad-Entscheidungen</b>, gebe jeder Kante eine Wahrscheinlichkeit, und
				am Ende bleibt eine Zahl, mit der ich leben kann.
			</p>

			<p>Der Baum hat drei Ebenen:</p>
			<ol>
				<li><b>Bus-Situation</b>: Kommt ein Bus (Sueden/Norden) in meinem Zeitfenster?</li>
				<li><b>Fahrer-Test</b>: Nimmt der Fahrer meine D‑Mark?</li>
				<li><b>Verfolger-Risiko</b>: Erwischt er mich oder verpasst er mich?</li>
			</ol>

			<div class="exampleClear"></div>
		</div>

		<h2 class="mt-8">Teil 2 — Wie komme ich an p (Bus kommt)?</h2>
		<div class="eddie">
			<p>
				Ein einfaches Bauch-zu-Zahl‑Modell: Ich betrachte eine Stunde als Zeitfenster und frage:
				<i>Wie viel Prozent dieser Stunde steht ein Bus wirklich da?</i>
			</p>

			<p class="muted">
				Wenn pro Richtung <Katex tex="f" /> Busse pro Stunde kommen und jeder Bus im Schnitt
				<Katex tex="t" /> Minuten am Bahnsteig steht, dann ist der Zeitanteil
				<Katex tex="p \approx \frac{f\,t}{60}" />.
			</p>

			<div class="kbox">
				<div class="mono">
					Beispiel: <code class="mono">t=5</code> Minuten und <code class="mono">f=1</code> pro Stunde
					<span class="mono">→</span>
					<Katex tex="p=\frac{5}{60}\approx 0{,}083" />
				</div>
			</div>
		</div>
		<h2 class="mt-8">Teil 3 — Warum man Wahrscheinlichkeiten nicht addieren darf</h2>
		<figure class="exampleFigure">
			<ImageZoomer :title="`Baum`">
				<ST_Graph a="0.8"
					bus-per-hour="1"
					r="0.2"
					stand-minutes="5"
				/>
			</ImageZoomer>
		</figure>
		<div class="eddie">
			<p>
				Hier ist der typische Denkfehler: Ich habe zwei Chancen (Sueden <Katex tex="S" /> und Norden
				<Katex tex="N" />) und will die Wahrscheinlichkeit, dass <b>mindestens eine</b> davon eintritt:
				<Katex tex="P(S\cup N)" />.
			</p>

			<p>
				Wenn man einfach <Katex tex="p_S+p_N" /> rechnet, kann das schiefgehen, weil man den Fall
				<i>„beide treten ein“</i> doppelt zaehlt. Im Extrem landet man sogar bei
				<Katex tex="p>100\\%" /> (z.B. <Katex tex="0{,}7+0{,}6=1{,}3" />).
			</p>

			<p>
				Sauber geht es ueber das <b>Komplement</b>. Statt „mindestens ein Bus“ rechne ich „kein Bus aus
				Sueden UND kein Bus aus Norden“. Wenn wir (wie im Modell) annehmen, dass die beiden Richtungen
				unabhaengig sind, darf man diese Komplementwahrscheinlichkeiten multiplizieren:
			</p>

			<div class="kbox">
				<Katex
					as="div"
					display
					tex="p_{\text{ges}}=P(S\cup N)=1-P(S^c\cap N^c)=1-P(S^c)\\P(N^c)=1-(1-p_S)(1-p_N)."
				/>
			</div>
		</div>

		<h2 class="mt-8">Teil 4 — Wann man Wahrscheinlichkeiten doch addieren darf</h2>
		<div class="eddie">
			<p class="muted">
				Heute machen wir’s schlanker: <Katex tex="p_S=p_N=p" />, <Katex tex="a_S=a_N=a" />,
				<Katex tex="r_S=r_N=r" />.
			</p>

			<p>
				Warum ist bei kleinem <Katex tex="p" /> die Summe trotzdem (naeherungsweise) erlaubt? Weil die exakte
				Formel aus Teil 3 beim Ausmultiplizieren fast genau zur Summe wird:
				<Katex tex="1-(1-p)^2 = 1-(1-2p+p^2)=2p-p^2" />.
				Der Unterschied zur Addition <Katex tex="2p" /> ist also genau der kleine Korrekturterm
				<Katex tex="p^2" />. Wenn <Katex tex="p" /> nur wenige Prozent ist, ist <Katex tex="p^2" /> noch viel
				kleiner und die Naeherung passt sehr gut.
			</p>

			<ul>
				<li><Katex tex="f" />: Busse pro Stunde <b>pro Richtung</b></li>
				<li><Katex tex="t" />: Standzeit (Minuten)</li>
				<li><Katex tex="p\approx \frac{f\,t}{60}" />: daraus (pro Richtung) die Bus‑Wahrscheinlichkeit</li>
				<li><Katex tex="a" />: Fahrer akzeptiert D‑Mark</li>
				<li><Katex tex="r" />: Erwischt‑Wahrscheinlichkeit</li>
			</ul>

			<p>
				Exakt (mit Teil 3 und <Katex tex="p_S=p_N=p" />) gilt:
				<Katex tex="P(\text{kein Bus})=(1-p)^2" />
				und damit
				<Katex tex="P(\text{mindestens ein Bus})=1-(1-p)^2=2p-p^2" />.
			</p>

			<p class="muted">
				Wenn <Katex tex="p" /> klein ist, ist <Katex tex="p^2" /> noch viel kleiner. Dann darf man
				naeherungsweise addieren:
				<Katex tex="p_{\text{ges}}\approx p_S+p_N" /> bzw. hier <Katex tex="p_{\text{ges}}\approx 2p" />.
			</p>
		</div>

		<h2 class="mt-8">Teil 5 — Erfolgsformel</h2>
		<div class="eddie">
			<p>
				Erst muss ueberhaupt ein Bus kommen (Sueden oder Norden), dann muss der Fahrer meine D‑Mark annehmen,
				und dann darf mich der Verfolger nicht erwischen. Darum ist die Erfolgswahrscheinlichkeit:
			</p>

			<div class="kbox">
				<Katex as="div" display tex="P(\text{Freiheit}) = \bigl(1-(1-p)^2\bigr)\cdot a\cdot (1-r) = (2p-p^2)\,a\,(1-r)." />
			</div>

			<p class="muted">
				Alles andere ist Misserfolg: <Katex tex="P(\text{Misserfolg})=1-P(\text{Freiheit})" />.
			</p>
		</div>

		<h2 class="mt-8">Teil 6 — Mini‑Beispiel</h2>
		<div class="eddie">
			<p class="muted">
				Beispielwerte: <code class="mono">f=1</code> pro Stunde, <code class="mono">t=5</code> Minuten,
				<code class="mono">a=0,8</code>, <code class="mono">r=0,2</code>.
			</p>

			<div class="kbox">
				<div class="mono">
					pro Richtung: p = f·t/60 = {{ fmtDec(exampleOut.p, 3) }} ({{ fmtPct(exampleOut.p) }})
				</div>
				<div class="mono">
					Gesamt: (2p-p²)·a·(1-r) = {{ fmtDec(exampleOut.freedom, 3) }} ({{ fmtPct(exampleOut.freedom) }})
				</div>
			</div>

			<ul>
				<li>Ich sehe sofort, welche Kante am meisten weh tut (p, a oder r).</li>
				<li>Wenn ich “Bus” killen will: <code class="mono">p=0</code>. Wenn ich “Fahrer” killen will: <code class="mono">a=0</code>.</li>
				<li>Und wenn ich “Mielke” kleiner machen will: <code class="mono">r</code> runter.</li>
			</ul>
		</div>
	</template>
	
	<template #interactivePart>
		<h2>Teil 7 — Rechner</h2>

		<v-card class="panel pa-5" variant="tonal">
			<div class="formGrid">
				<v-text-field v-model="busPerHour" inputmode="decimal" label="f (Busse pro Stunde pro Richtung)" />
				<v-text-field v-model="standMinutes" inputmode="decimal" label="t (Standzeit in Minuten)" />
				<v-text-field v-model="a" inputmode="decimal" label="a (Fahrer nimmt DM)" />
				<v-text-field v-model="r" inputmode="decimal" label="r (Erwischt)" />
			</div>

			<div class="actions">
				<v-btn color="primary"
					type="button"
					variant="flat"
					@click="randomize"
				>Zufall</v-btn>
				<v-btn type="button" variant="outlined" @click="reset">Reset</v-btn>
			</div>

			<p class="mini">
				<b>Faustformel:</b> <code class="mono">p ≈ f·t/60</code> (pro Richtung).
				<br />
				<span class="muted">
					Für <code class="mono">a</code> und <code class="mono">r</code> gelten Werte zwischen
					<code class="mono">0</code> und <code class="mono">1</code>. Komma geht auch:
					<code class="mono">0,65</code>.
				</span>
				<br />
				<span class="muted">
					Mit zwei Richtungen gilt exakt: <Katex tex="P(\text{Bus})=1-(1-p)^2" /> (und fuer kleines
					<Katex tex="p" /> gilt naeherungsweise <Katex tex="P(\text{Bus})\approx 2p" />).
				</span>
			</p>
		</v-card>

		<v-card class="panel pa-3 mt-4" variant="tonal">
			<h3>Baum zu deinen Eingaben</h3>
			<ImageZoomer :title="graphTitle">
				<ST_Graph
					:a
					:bus-per-hour
					:r
					:stand-minutes
				/>
			</ImageZoomer>
		</v-card>
	</template>

	<template #calculationPart>
		<v-card class="panel" variant="tonal">
			<div class="resultHeader">
				<v-chip
					class="pill"
					:color="status.kind === 'ok' ? 'success' : status.kind === 'warn' ? 'warning' : 'error'"
					size="small"
				>
					{{ status.text }}
				</v-chip>
				<div class="equation">
					<span class="mono">P(Freiheit) =</span>
					<span v-if="calc.ok" class="mono">{{ fmtPct(calc.freedom) }}</span>
					<span v-else class="mono">…</span>
				</div>
			</div>

			<div class="out">
				<p v-if="!calc.ok" class="muted">{{ calc.message }}</p>

				<div v-else>
					<p v-if="calc.issues.length" class="muted">
						{{ calc.issues.join(' · ') }}
					</p>

					<div class="kbox">
						<div class="mono">f (Busse/h pro Richtung) = {{ fmtDec(calc.f, 2) }}</div>
						<div class="mono">t (Standzeit in Minuten) = {{ fmtDec(calc.t, 1) }}</div>
						<div class="mono">p = f·t/60 = {{ fmtDec(calc.pp, 3) }} ({{ fmtPct(calc.pp) }})</div>
						<div class="mono">
							pBus = 1-(1-p)² = {{ fmtDec(calc.pBus, 3) }} ({{ fmtPct(calc.pBus) }})
						</div>
						<div class="mono">pNone = (1-p)² = {{ fmtDec(calc.pNone, 3) }} ({{ fmtPct(calc.pNone) }})</div>
						<div class="mono">
							P(Freiheit) = pBus·a·(1-r)
						</div>
						<div class="mono">P(Freiheit) = {{ fmtDec(calc.freedom, 3) }} ({{ fmtPct(calc.freedom) }})</div>
						<div class="mono">P(Misserfolg) = {{ fmtDec(calc.failure, 3) }} ({{ fmtPct(calc.failure) }})</div>
					</div>

					<div class="tableScroller">
						<v-table density="compact">
							<thead>
								<tr>
									<th>Ast</th>
									<th class="text-right">Wert</th>
									<th class="text-right">%</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="row in calc.breakdown" :key="row.k">
									<td class="mono">{{ row.k }}</td>
									<td class="mono text-right">{{ fmtDec(row.v, 3) }}</td>
									<td class="mono text-right">{{ fmtPct(row.v) }}</td>
								</tr>
							</tbody>
						</v-table>
					</div>
				</div>
			</div>
		</v-card>
	</template>
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";
import ST_Graph from "./ST_Graph.vue";
import titleImg from "@/images/ST.webp";

// Vereinfachtes Modell:
// pS = pN = p, aS = aN = a, rS = rN = r.
// Dadurch ist P(mindestens ein Bus) = 1-(1-p)^2 = 2p-p^2 und P(Freiheit) = (2p-p^2) a (1-r).
//
// p kann man sich praktisch als "Zeitanteil" denken:
// Wenn pro Richtung f Busse pro Stunde kommen und jeder Bus t Minuten am Bahnsteig steht,
// dann gilt naehrungsweise p ~= f*t/60.
// Beispiel: t=5min und f=1/h -> p = 5/60.
const example = {
	busPerHour:   1,
	standMinutes: 5,
	a:            0.8,
	r:            0.2
};

const busPerHour = ref( String( example.busPerHour ) );
const standMinutes = ref( String( example.standMinutes ) );
const a = ref( String( example.a ) );
const r = ref( String( example.r ) );

const exampleOut = { p: example.busPerHour * example.standMinutes / 60 };
exampleOut.pBus = 1 - ( 1 - exampleOut.p ) ** 2;
exampleOut.freedom = exampleOut.pBus * example.a * ( 1 - example.r );

function parseMaybeFloat( v ) {
	if ( typeof v === "number" ) {
		return Number.isFinite( v ) ? v : null;
	}

	const s = String( v ).trim()
		.replace( ",", "." );

	if ( !s ) {
		return null;
	}

	if ( !/^[-+]?(\d+(\.\d+)?|\.\d+)$/.test( s ) ) {
		return null;
	}

	const n = Number( s );
	return Number.isFinite( n ) ? n : null;
}

function in01( n ) {
	return typeof n === "number" && Number.isFinite( n ) && n >= 0 && n <= 1;
}

function fmtPct( n, digits = 1 ) {
	if ( !Number.isFinite( n ) ) {
		return "–";
	}

	return `${( n * 100 ).toFixed( digits ).replace( ".", "," )}%`;
}

function fmtDec( n, digits = 3 ) {
	if ( !Number.isFinite( n ) ) {
		return "–";
	}

	return n.toFixed( digits ).replace( ".", "," );
}

function reset() {
	busPerHour.value = String( example.busPerHour );
	standMinutes.value = String( example.standMinutes );
	a.value = String( example.a );
	r.value = String( example.r );
}

function rand( min, max ) {
	return Math.random() * ( max - min ) + min;
}

function randomize() {
	const f = rand( 1, 3 );
	const t = rand( 2, 12 );
	busPerHour.value = f.toFixed( 0 );
	standMinutes.value = t.toFixed( 0 );
	a.value = rand( 0.6, 0.95 ).toFixed( 1 );
	r.value = rand( 0.05, 0.15 ).toFixed( 1 );
}

const calc = computed( () => {
	const f = parseMaybeFloat( busPerHour.value );
	const t = parseMaybeFloat( standMinutes.value );
	const aa = parseMaybeFloat( a.value );
	const rr = parseMaybeFloat( r.value );

	if ( [ f, t, aa, rr ].some( ( n ) => n === null ) ) {
		return { ok: false, message: "Bitte Zahlen eingeben. Tipp: 0,65 geht auch." };
	}

	if ( f < 0 || t < 0 ) {
		return { ok: false, message: "Busse/Standszeit muessen >= 0 sein." };
	}

	if ( t > 60 ) {
		return { ok: false, message: "Standzeit muss <= 60 Minuten sein (wir rechnen \"pro Stunde\")." };
	}

	if ( ![ aa, rr ].every( in01 ) ) {
		return { ok: false, message: "Werte muessen im Intervall [0,1] liegen." };
	}

	const pp = f * t / 60;

	if ( pp > 1 ) {
		return { ok: false, message: "f*t/60 ist > 1. Das waere mehr als 100% Bus-Zeit. Werte pruefen." };
	}

	const issues = [];
	const pNone = ( 1 - pp ) ** 2;
	const pBus = 1 - pNone;

	const freedom = pBus * aa * ( 1 - rr );
	const reject = pBus * ( 1 - aa );
	const caught = pBus * aa * rr;
	const failure = 1 - freedom;

	const breakdown = [
		{ k: "p (pro Richtung): f·t/60", v: pp },
		{ k: "Bus gesamt: 1-(1-p)^2", v: pBus },
		{ k: "Kein Bus: (1-p)^2", v: pNone },
		{ k: "Fahrer nein: pBus·(1-a)", v: reject },
		{ k: "Freiheit: pBus·a·(1-r)", v: freedom },
		{ k: "Erwischt: 1-pBus·a·(1-r)", v: failure }
	];

	return {
		ok: true,
		issues,
		f,
		t,
		pp,
		aa,
		rr,
		pBus,
		pNone,
		reject,
		caught,
		freedom,
		failure,
		breakdown
	};
} );

const status = computed( () => {
	if ( !calc.value.ok ) {
		return { kind: "bad", text: "Eingaben pruefen" };
	}

	if ( calc.value.issues.length ) {
		return { kind: "warn", text: "fast gut, aber…" };
	}

	return { kind: "ok", text: "bereit" };
} );

const graphTitle = computed( () => "Entscheidungsbaum: Bus · Fahrer · Verfolger" );
</script>
