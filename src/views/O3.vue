<template>
<AppFrame warning>
	<template #title>
		<div class="badge">O3</div>
		<div>
			<h1>Eddie rechnet: IMO 1985 Aufgabe 3</h1>
			<p class="sub">Binomialkoeffizienten • Parität • Induktion</p>
		</div>
	</template>

	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="`Eddie`">
				<img alt="Eddie rechnet" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>

		<h2>Teil 1 — Aufgabenstellung</h2>
		<div class="eddie">
			<p>
				Für ein Polynom <Katex tex="P(x)=a_0+a_1x+\dots+a_kx^k" /> mit ganzzahligen Koeffizienten
				bezeichne <Katex tex="o(P)" /> die Anzahl der <b>ungeraden</b> Koeffizienten.
				Für <Katex tex="i=0,1,2,\dots" /> sei
				<Katex tex="Q_i(x)=(1+x)^i" />.
			</p>

			<p>
				Zu zeigen ist: Für ganze Zahlen
				<Katex tex="0\le i_1 < i_2 < \dots < i_n" /> gilt
			</p>

			<div class="kbox">
				<Katex as="div" display tex="o\!\left(Q_{i_1}+Q_{i_2}+\dots+Q_{i_n}\right)\ge o\!\left(Q_{i_1}\right)." />
			</div>
		</div>

		<h2 class="mt-8">Teil 2 — Kernidee (Parität statt Größe)</h2>
		<div class="eddie">
			<p>
				Wir schauen nur auf <b>ungerade/gerade</b> (also Modulo 2). Die exakten Größen der
				Binomialkoeffizienten sind zweitrangig.
			</p>

			<ul>
				<li>In <Katex tex="Q_i=(1+x)^i" /> ist der Koeffizient bei <Katex tex="x^r" /> gleich <Katex tex="\binom{i}{r}" />.</li>
				<li>
					Für die Parität gilt (Lucas in Basis 2):
					<Katex tex="\binom{i}{r}" /> ist ungerade genau dann, wenn jede 1-Bit-Stelle von
					<Katex tex="r" /> auch in <Katex tex="i" /> eine 1 ist.
				</li>
				<li>
					Daraus folgt sofort:
					<Katex tex="o(Q_i)=2^{s_2(i)}" />, wobei <Katex tex="s_2(i)" /> die Anzahl der 1-Bits von
					<Katex tex="i" /> ist.
				</li>
			</ul>
		</div>

		<h2 class="mt-8">Teil 3 — Beweisidee (Induktion mit 2er-Fenster)</h2>
		<div class="eddie">
			<v-expansion-panels variant="accordion">
				<v-expansion-panel>
					<v-expansion-panel-title>
						Schritt 1 – Spezialfall: i ist eine Zweierpotenz
					</v-expansion-panel-title>
					<v-expansion-panel-text class="d-flex flex-column ga-3">
						<div>
							Ist <Katex tex="i=2^t" />, dann sind in <Katex tex="(1+x)^i" /> alle inneren
							Binomialkoeffizienten gerade. Ungerade bleiben nur die Ränder:
							<Katex tex="1" /> und <Katex tex="x^i" />.
						</div>
						<div class="kbox">
							<Katex as="div" display tex="(1+x)^{2^t}\equiv 1+x^{2^t}\pmod 2." />
						</div>
					</v-expansion-panel-text>
				</v-expansion-panel>

				<v-expansion-panel>
					<v-expansion-panel-title>
						Schritt 2 – Induktion über den größten Exponenten i_n
					</v-expansion-panel-title>
					<v-expansion-panel-text class="d-flex flex-column ga-3">
						<div>
							Wähle eine Zweierpotenz <Katex tex="m" /> mit
							<Katex tex="m\le i_n < 2m" />.
							Dann betrachtet man die zwei Fälle <Katex tex="i_1\ge m" /> und <Katex tex="i_1<m" />.
						</div>
						<div>
							Die Idee ist, die Summe so zu zerlegen, dass in beiden Fällen ein kleineres Problem entsteht,
							auf das die Induktionsannahme angewendet werden kann.
						</div>
					</v-expansion-panel-text>
				</v-expansion-panel>

				<v-expansion-panel>
					<v-expansion-panel-title>
						Schritt 3 – Fall i_1 \ge m
					</v-expansion-panel-title>
					<v-expansion-panel-text class="d-flex flex-column ga-3">
						<div>
							Dann kann man jeden Exponenten um <Katex tex="m" /> reduzieren:
							<Katex tex="Q_{i_j}=(1+x)^mQ_{i_j-m}" />.
						</div>
						<div class="kbox">
							<Katex as="div" display tex="(1+x)^m\equiv 1+x^m\pmod 2 \Rightarrow o\big((1+x)^mA\big)=2o(A)." />
						</div>
						<div>
							Mit der Induktionsannahme für die reduzierten Exponenten folgt direkt die gewünschte
							Ungleichung.
						</div>
					</v-expansion-panel-text>
				</v-expansion-panel>

				<v-expansion-panel>
					<v-expansion-panel-title>
						Schritt 4 – Fall i_1 &lt; m
					</v-expansion-panel-title>
					<v-expansion-panel-text class="d-flex flex-column ga-3">
						<div>
							Splitte an der Grenze <Katex tex="m" />:
							<Katex tex="Q=A+(1+x)^mB" />, wobei <Katex tex="\deg A,\deg B<m" />.
						</div>
						<div class="kbox">
							<Katex as="div" display tex="o(Q)=o\big(A+(1+x)^mB\big)=o(A+B)+o(B)." />
						</div>
						<div>
							Jetzt nutzt man nur Parität:
							<Katex tex="o(A+B)+o(B)\ge o(A)" />,
							weil ein Koeffizient von <Katex tex="A" /> nur dann ungerade ist, wenn genau einer der
							beiden zugehörigen Koeffizienten in <Katex tex="A+B" /> und <Katex tex="B" /> ungerade ist.
						</div>
						<div>
							Zusammen mit Induktion für <Katex tex="A" /> folgt
							<Katex tex="o(Q)\ge o(Q_{i_1})" />.
						</div>
					</v-expansion-panel-text>
				</v-expansion-panel>
			</v-expansion-panels>
		</div>
	</template>

	<template #interactivePart>
		<h2>Spielplatz: Odd-Koeffizienten zählen</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p>
				Gib Exponenten ein (aufsteigend). Der Rechner bestimmt
				<Katex tex="o(Q_{i_1})" /> und
				<Katex tex="o(Q_{i_1}+\dots+Q_{i_n})" /> und prüft die Ungleichung.
			</p>

			<div class="d-flex flex-wrap ga-3 align-center">
				<v-text-field
					v-model="inputExponents"
					label="Exponenten i1, i2, ..., in"
					hide-details="auto"
					style="max-width: 420px"
				/>
				<v-btn @click="runCheck" color="primary" variant="flat">
					Prüfen
				</v-btn>
				<v-btn @click="randomExample" variant="tonal">
					Zufallsbeispiel
				</v-btn>
			</div>

			<p class="muted">
				Eingabeformat: ganze Zahlen zwischen <code>0</code> und <code>256</code>, z.B.
				<code>1, 3, 4, 7</code>. Duplikate und unsortierte Eingaben werden automatisch bereinigt.
			</p>

			<v-alert v-if="error" type="error" variant="tonal">
				{{ error }}
			</v-alert>

			<v-alert
				v-if="result"
				:type="result.holds ? 'success' : 'warning'"
				variant="tonal"
			>
				<div class="d-flex flex-column ga-1">
					<div>
						<Katex :tex="`o(Q_{${result.i1}})=${result.oddFirst}`" />,
						<Katex :tex="`o(Q_{${result.exponents[0]}}+\\cdots+Q_{${result.exponents[result.exponents.length - 1]}})=${result.oddSum}`" />.
					</div>
					<div>
						Ergebnis: <b>{{ result.holds ? "Ungleichung erfüllt" : "Ungleichung verletzt" }}</b>.
					</div>
				</div>
			</v-alert>

			<v-sheet v-if="result" class="pa-3 rounded" border>
				<div class="d-flex flex-column ga-2">
					<div>
						<strong>Exponenten:</strong>
						<span class="ml-2">{{ result.exponents.join(", ") }}</span>
					</div>
					<div v-if="result.notes.length" class="muted">
						{{ result.notes.join(" · ") }}
					</div>
					<div>
						<strong>2er-Fenster:</strong>
						<Katex :tex="`m=${result.proof.m}`" />
						mit
						<Katex :tex="`${result.proof.m}\\le i_n=${result.maxI}<${2 * result.proof.m}`" />
					</div>
				</div>
			</v-sheet>
		</div>
	</template>

	<template #calculationPart>
		<h2>Paritätstabellen & Beweisspur</h2>
		<div class="eddie d-flex flex-column ga-3">
			<v-sheet v-if="result" class="pa-3 rounded" border>
				<div class="text-subtitle-1 font-weight-medium mb-2">Paritätsdaten pro Summand</div>
				<v-table density="compact">
					<thead>
						<tr>
							<th>Summand</th>
							<th>Binär</th>
							<th class="text-right">o(Qi)</th>
							<th>Ungerade Grade r in Qi</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="row in result.rows" :key="row.i">
							<td><code>Q{{ row.i }}</code></td>
							<td><code>{{ row.binary }}</code></td>
							<td class="text-right mono">{{ row.oddCount }}</td>
							<td class="mono">{{ formatDegrees(row.oddDegrees) }}</td>
						</tr>
					</tbody>
				</v-table>
			</v-sheet>

			<v-sheet v-if="result" class="pa-3 rounded" border>
				<div class="text-subtitle-1 font-weight-medium mb-2">Ungerade Grade in der Gesamtsumme</div>
				<div class="mono">
					{{ result.oddDegreesSum.length ? formatDegrees(result.oddDegreesSum, 32) : "(keine)" }}
				</div>
			</v-sheet>

			<v-sheet v-if="result" class="pa-3 rounded" border>
				<div class="text-subtitle-1 font-weight-medium mb-2">Beweisspur für dieses Beispiel</div>
				<div v-if="result.proof.caseName === 'trivial'" class="mono">
					Trivialfall: <code>i_n = 0</code>, also nur <code>Q_0 = 1</code>.
				</div>
				<div v-else-if="result.proof.caseName === 'A'" class="d-flex flex-column ga-2">
					<div>
						Fall <Katex tex="i_1\ge m" />.
						Reduzierte Exponenten <Katex tex="i_j-m" />:
						<code>{{ result.proof.reduced.join(", ") }}</code>
					</div>
					<div class="mono">
						o(A) = {{ result.proof.oddReduced }} ⇒ o((1+x)^mA) = 2·o(A) = {{ 2 * result.proof.oddReduced }}.
					</div>
				</div>
				<div v-else class="d-flex flex-column ga-2">
					<div>
						Fall <Katex tex="i_1 < m" /> mit Split bei <code>r={{ result.proof.r }}</code>:
						A-Exponenten <code>{{ result.proof.A.join(", ") }}</code>,
						B-Exponenten (reduziert) <code>{{ result.proof.B.join(", ") }}</code>.
					</div>
					<div class="mono">
						o(A+B) + o(B) = {{ result.proof.oAplusB }} + {{ result.proof.oB }} =
						{{ result.proof.oAplusB + result.proof.oB }} ≥ o(A) = {{ result.proof.oA }}.
					</div>
				</div>
			</v-sheet>
		</div>
	</template>

	<template #footer>
		<p class="muted">
			Quelle der Aufgabenstellung/Lösungsskizze:
			<a href="https://prase.cz/kalva/imo/isoln/isoln853.html">IMO 1985 A3 (ISL solutions, prase.cz)</a>
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import { ref } from "vue";
import titleImg from "@/images/O3.webp";

const inputExponents = ref("1, 3, 4, 7");
const error = ref("");
const result = ref(null);

function popcount(n) {
	let x = n;
	let c = 0;
	while (x > 0) {
		c += x & 1;
		x >>= 1;
	}
	return c;
}

function highestPowerOf2LE(n) {
	if (n <= 0) return 1;
	let m = 1;
	while (m * 2 <= n) m *= 2;
	return m;
}

function lucasOdd(i, r) {
	return (r & i) === r;
}

function oddDegreesOfQ(i) {
	const out = [];
	for (let r = 0; r <= i; r++) {
		if (lucasOdd(i, r)) out.push(r);
	}
	return out;
}

function buildParityStats(exponents) {
	const maxI = exponents.length ? exponents[exponents.length - 1] : 0;
	const parity = Array(maxI + 1).fill(0);
	const rows = [];

	for (const i of exponents) {
		const oddDegrees = oddDegreesOfQ(i);
		for (const r of oddDegrees) parity[r] ^= 1;

		rows.push({
			i,
			binary: i.toString(2),
			oddDegrees,
			oddCount: 2 ** popcount(i)
		});
	}

	const oddDegreesSum = [];
	for (let r = 0; r < parity.length; r++) {
		if (parity[r] === 1) oddDegreesSum.push(r);
	}

	return {
		maxI,
		parity,
		rows,
		oddDegreesSum,
		oddSum: oddDegreesSum.length
	};
}

function xorOddCount(parityA, parityB) {
	const len = Math.max(parityA.length, parityB.length);
	let count = 0;
	for (let i = 0; i < len; i++) {
		const a = i < parityA.length ? parityA[i] : 0;
		const b = i < parityB.length ? parityB[i] : 0;
		if ((a ^ b) === 1) count++;
	}
	return count;
}

function parseExponents(raw) {
	const tokens = String(raw ?? "")
		.split(/[\s,;]+/)
		.map((x) => x.trim())
		.filter(Boolean);

	if (!tokens.length) throw new Error("Bitte mindestens einen Exponenten eingeben.");

	const values = [];
	for (const t of tokens) {
		if (!/^\d+$/.test(t)) throw new Error(`Ungültiger Exponent: ${t}`);
		const v = Number(t);
		if (!Number.isInteger(v)) throw new Error(`Ungültiger Exponent: ${t}`);
		if (v < 0 || v > 256) throw new Error(`Exponent ${v} ist außerhalb des Bereichs 0..256.`);
		values.push(v);
	}

	const notes = [];
	const sorted = [...values].sort((a, b) => a - b);
	if (sorted.some((v, idx) => v !== values[idx])) {
		notes.push("Eingabe wurde aufsteigend sortiert.");
	}

	const unique = [];
	for (const v of sorted) {
		if (!unique.length || unique[unique.length - 1] !== v) unique.push(v);
	}
	if (unique.length !== sorted.length) {
		notes.push("Doppelte Exponenten wurden entfernt.");
	}

	return { exponents: unique, notes };
}

function buildProofTrace(exponents) {
	const maxI = exponents[exponents.length - 1];
	if (maxI === 0) {
		return { caseName: "trivial", m: 1 };
	}

	const m = highestPowerOf2LE(maxI);
	const i1 = exponents[0];

	if (i1 >= m) {
		const reduced = exponents.map((x) => x - m);
		const reducedStats = buildParityStats(reduced);
		return {
			caseName: "A",
			m,
			reduced,
			oddReduced: reducedStats.oddSum
		};
	}

	let r = -1;
	for (let idx = 0; idx < exponents.length; idx++) {
		if (exponents[idx] < m) r = idx;
	}

	const A = exponents.slice(0, r + 1);
	const B = exponents.slice(r + 1).map((x) => x - m);

	const statsA = buildParityStats(A);
	const statsB = buildParityStats(B);

	return {
		caseName: "B",
		m,
		r,
		A,
		B,
		oA: statsA.oddSum,
		oB: statsB.oddSum,
		oAplusB: xorOddCount(statsA.parity, statsB.parity)
	};
}

function formatDegrees(arr, limit = 20) {
	if (!arr || !arr.length) return "(keine)";
	if (arr.length <= limit) return arr.join(", ");
	const head = arr.slice(0, limit).join(", ");
	return `${head}, ... (insgesamt ${arr.length})`;
}

function runCheck() {
	error.value = "";
	result.value = null;

	try {
		const { exponents, notes } = parseExponents(inputExponents.value);
		const stats = buildParityStats(exponents);
		const proof = buildProofTrace(exponents);

		result.value = {
			notes,
			exponents,
			i1: exponents[0],
			maxI: stats.maxI,
			rows: stats.rows,
			oddDegreesSum: stats.oddDegreesSum,
			oddFirst: stats.rows[0].oddCount,
			oddSum: stats.oddSum,
			holds: stats.oddSum >= stats.rows[0].oddCount,
			proof
		};
	} catch (e) {
		error.value = e?.message ? String(e.message) : String(e);
	}
}

function randomExample() {
	const size = 2 + Math.floor(Math.random() * 4); // 2..5
	const set = new Set();
	while (set.size < size) {
		set.add(Math.floor(Math.random() * 21)); // 0..20
	}
	const exponents = Array.from(set).sort((a, b) => a - b);
	inputExponents.value = exponents.join(", ");
	runCheck();
}

runCheck();
</script>

<style scoped>
ol > li { margin: 0.35rem 0; }
</style>
