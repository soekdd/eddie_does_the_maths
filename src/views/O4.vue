<template>
<AppFrame warning>
	<template #title>
		<div class="badge">O4</div>
		<div>
			<h1>Eddie rechnet: IMO 1985 Aufgabe 4</h1>
			<p class="sub">Schubfachprinzip • Paritätsvektoren • vierte Potenz</p>
		</div>
	</template>

	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="`Eddie`">
				<img alt="Eddie rechnet" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>

		<h2>Teil 1 — Aufgabenstellung (deutsch)</h2>
		<div class="eddie">
			<p>
				Gegeben sei eine Menge <Katex tex="M" /> aus <b>1985 verschiedenen positiven ganzen Zahlen</b>.
				Keine dieser Zahlen besitzt einen Primteiler größer als <Katex tex="23" />.
			</p>
			<p>
				Zu zeigen ist: In <Katex tex="M" /> gibt es eine Teilmenge mit <b>4 Elementen</b>,
				deren Produkt eine <b>vierte Potenz</b> einer ganzen Zahl ist.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\exists\ a,b,c,d\in M:\quad abcd = t^4\ \text{für ein}\ t\in\mathbb{Z}." />
			</div>
		</div>

		<h2 class="mt-8">Teil 2 — Idee in zwei Stufen</h2>
		<div class="eddie">
			<p>
				Der Trick ist, nicht direkt auf <Katex tex="4" /> modulo zu gehen, sondern erst viele
				Quadrate zu bauen und daraus dann eine vierte Potenz.
			</p>
			<ol>
				<li>
					<b>Stufe A:</b> Aus vielen Zahlen bilden wir viele Paare, deren Produkt ein Quadrat ist.
				</li>
				<li>
					<b>Stufe B:</b> Unter diesen Quadrat-Paaren finden wir zwei Paare, die "gleich" sind,
					sodass das Produkt aller vier Zahlen eine vierte Potenz wird.
				</li>
			</ol>
			<p>
				Das Werkzeug in beiden Stufen ist das <b>Schubfachprinzip</b>.
			</p>
		</div>

		<h2 class="mt-8">Teil 3 — Warum 1985 locker reicht</h2>
		<div class="eddie">
			<p>
				Die erlaubten Primzahlen sind:
				<Katex tex="2,3,5,7,11,13,17,19,23" />,
				also insgesamt <Katex tex="n=9" /> Stück.
			</p>
			<p>
				Für eine allgemeine Primmenge mit <Katex tex="n" /> Primzahlen reicht bereits
				<Katex tex="3\cdot 2^n + 1" /> Zahlen.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="3\cdot 2^9 + 1 = 1537\le 1985." />
			</div>
			<p>
				Damit sind wir deutlich über der Schwelle und können den Zwei-Stufen-Argumentbau anwenden.
			</p>
		</div>

		<h2 class="mt-8">Teil 4 — Beweisskizze in Formeln</h2>
		<div class="eddie">
			<v-expansion-panels variant="accordion">
				<v-expansion-panel>
					<v-expansion-panel-title>Stufe A: viele Quadrat-Paare</v-expansion-panel-title>
					<v-expansion-panel-text class="d-flex flex-column ga-3">
						<div>
							Schreibe jede Zahl als
							<Katex tex="x=p_1^{r_1}\cdots p_n^{r_n}" />
							und betrachte nur die Paritäten von
							<Katex tex="(r_1,\dots,r_n)\bmod 2" />.
						</div>
						<div>
							Davon gibt es <Katex tex="2^n" /> Klassen. Zwei Zahlen in derselben Klasse haben
							im Produkt überall gerade Exponenten, also ein Quadrat.
						</div>
						<div class="kbox">
							<Katex as="div" display tex="x\sim y\Rightarrow xy=s^2." />
						</div>
					</v-expansion-panel-text>
				</v-expansion-panel>

				<v-expansion-panel>
					<v-expansion-panel-title>Stufe B: aus Quadraten eine vierte Potenz</v-expansion-panel-title>
					<v-expansion-panel-text class="d-flex flex-column ga-3">
						<div>
							Nimm zwei Quadrat-Paare:
							<Katex tex="ab=u^2" /> und <Katex tex="cd=v^2" />.
							Wenn die Paritätsklasse von <Katex tex="u" /> und <Katex tex="v" /> gleich ist,
							dann ist <Katex tex="uv" /> ein Quadrat.
						</div>
						<div class="kbox">
							<Katex as="div" display tex="abcd=(u^2)(v^2)=(uv)^2=t^4." />
						</div>
						<div>
							Auch hier wieder Schubfachprinzip über <Katex tex="2^n" /> Paritätsklassen.
						</div>
					</v-expansion-panel-text>
				</v-expansion-panel>
			</v-expansion-panels>
		</div>
	</template>

	<template #interactivePart>
		<h2>Spielplatz: Konstruktion per Schubfachprinzip</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p>
				Wir erzeugen eine Menge mit nur Primteilern <Katex tex="\le 23" /> und bauen die zwei Stufen
				explizit nach. Damit siehst du den Beweis "in Aktion".
			</p>

			<div class="d-flex flex-wrap ga-3 align-center">
				<v-text-field
					v-model="countInput"
					label="Anzahl Zahlen in M"
					type="number"
					min="4"
					max="5000"
					style="max-width: 220px"
					hide-details="auto"
				/>
				<v-btn @click="runConstruction" color="primary" variant="flat">
					Konstruieren & prüfen
				</v-btn>
				<v-btn @click="randomExample" variant="tonal">
					Zufallsgröße
				</v-btn>
			</div>

			<v-alert v-if="error" type="error" variant="tonal">
				{{ error }}
			</v-alert>

			<v-alert v-if="result" :type="result.guaranteed ? 'info' : 'warning'" variant="tonal">
				<Katex :tex="`|M|=${result.count}`" />,
				Schwellwert: <Katex :tex="`3\\cdot 2^9+1=${result.threshold}`" />.
				<span v-if="result.guaranteed">Theorem garantiert die Existenz.</span>
				<span v-else>Unterhalb der Schwelle ist es ein Experiment (kann klappen, muss nicht).</span>
			</v-alert>

			<v-sheet v-if="result" class="pa-3 rounded" border>
				<div class="d-flex flex-column ga-2">
					<div>
						<strong>Stufe A:</strong>
						{{ result.squarePairCount }} Quadrat-Paare aus {{ result.parityClassCount }} Paritätsklassen.
					</div>
					<div>
						<strong>Stufe B:</strong>
						{{ result.rootParityClassCount }} Klassen für Quadratwurzeln-Parität.
					</div>
					<div>
						<strong>Ergebnis:</strong>
						<span v-if="result.found" class="text-success">4er-Teilmenge gefunden, Produkt ist vierte Potenz.</span>
						<span v-else class="text-warning">Keine 4er-Teilmenge mit dieser Konstruktion gefunden.</span>
					</div>
				</div>
			</v-sheet>
		</div>
	</template>

	<template #calculationPart>
		<h2>Rechendetails</h2>
		<div class="eddie d-flex flex-column ga-3">
			<v-sheet v-if="result" class="pa-3 rounded" border>
				<div class="text-subtitle-1 font-weight-medium mb-2">Paritätsklassen der Zahlen (Top 12)</div>
				<v-table density="compact">
					<thead>
						<tr>
							<th>Klasse (Bitvektor)</th>
							<th>odd Primexponenten</th>
							<th class="text-right">Anzahl</th>
							<th class="text-right">Paarbeitrag</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="row in result.parityClassRows" :key="row.key">
							<td><code>{{ row.key }}</code></td>
							<td>{{ describeKey(row.key) }}</td>
							<td class="text-right mono">{{ row.count }}</td>
							<td class="text-right mono">{{ row.pairs }}</td>
						</tr>
					</tbody>
				</v-table>
			</v-sheet>

			<v-sheet v-if="result" class="pa-3 rounded" border>
				<div class="text-subtitle-1 font-weight-medium mb-2">Paritätsklassen der Quadratwurzeln (Top 12)</div>
				<v-table density="compact">
					<thead>
						<tr>
							<th>Klasse (Bitvektor)</th>
							<th>odd Primexponenten</th>
							<th class="text-right">Anzahl Paare</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="row in result.rootClassRows" :key="row.key">
							<td><code>{{ row.key }}</code></td>
							<td>{{ describeKey(row.key) }}</td>
							<td class="text-right mono">{{ row.count }}</td>
						</tr>
					</tbody>
				</v-table>
			</v-sheet>

			<v-sheet v-if="result && result.found" class="pa-3 rounded" border>
				<div class="text-subtitle-1 font-weight-medium mb-2">Gefundene 4er-Teilmenge</div>
				<div class="mono">a = {{ result.witness.a }}</div>
				<div class="mono">b = {{ result.witness.b }}</div>
				<div class="mono">c = {{ result.witness.c }}</div>
				<div class="mono">d = {{ result.witness.d }}</div>
				<div class="mono mt-2">abcd = {{ result.witness.product }}</div>
				<div class="mono">4. Wurzel-Kandidat t = {{ result.witness.t }}</div>
				<div class="mono">Check: t^4 = {{ result.witness.checkValue }}</div>
			</v-sheet>
		</div>
	</template>
</AppFrame>
</template>

<script setup>
import { ref } from "vue";
import titleImg from "@/images/O4.webp";

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23];
const PRIMES_BIG = PRIMES.map((p) => BigInt(p));
const THRESHOLD = 3 * (2 ** PRIMES.length) + 1; // 1537 bei n=9

const countInput = ref("1537");
const error = ref("");
const result = ref(null);

function parityKey(exponents) {
	return exponents.map((e) => e % 2).join("");
}

function decodeBase(index, base, len) {
	const out = Array(len).fill(0);
	let x = index;
	for (let i = 0; i < len; i++) {
		out[i] = x % base;
		x = Math.floor(x / base);
	}
	return out;
}

function powBigInt(base, exp) {
	let out = 1n;
	for (let i = 0; i < exp; i++) out *= base;
	return out;
}

function numberFromExponents(exponents) {
	let n = 1n;
	for (let i = 0; i < exponents.length; i++) {
		if (exponents[i] > 0) n *= powBigInt(PRIMES_BIG[i], exponents[i]);
	}
	return n;
}

function describeKey(key) {
	const primes = [];
	for (let i = 0; i < key.length; i++) {
		if (key[i] === "1") primes.push(PRIMES[i]);
	}
	return primes.length ? `{${primes.join(", ")}}` : "{}";
}

function generateSmoothSet(count) {
	const maxCount = 4 ** PRIMES.length;
	if (count > maxCount) {
		throw new Error(`Für den Generator sind maximal ${maxCount} eindeutige Zahlen vorgesehen.`);
	}

	const items = [];
	for (let idx = 0; idx < count; idx++) {
		const exponents = decodeBase(idx, 4, PRIMES.length); // Exponenten 0..3
		items.push({
			id: idx + 1,
			exponents,
			value: numberFromExponents(exponents),
			key: parityKey(exponents)
		});
	}
	return items;
}

function analyze(items) {
	const classMap = new Map();
	for (const item of items) {
		if (!classMap.has(item.key)) classMap.set(item.key, []);
		classMap.get(item.key).push(item);
	}

	const parityClassRows = Array.from(classMap.entries())
		.map(([key, arr]) => ({
			key,
			count: arr.length,
			pairs: Math.floor(arr.length / 2)
		}))
		.sort((a, b) => b.count - a.count)
		.slice(0, 12);

	const squarePairs = [];
	for (const arr of classMap.values()) {
		for (let i = 0; i + 1 < arr.length; i += 2) {
			const a = arr[i];
			const b = arr[i + 1];
			const rootParity = a.exponents.map((ea, j) => ((ea + b.exponents[j]) / 2) % 2);
			squarePairs.push({
				a,
				b,
				rootKey: rootParity.join(""),
				rootParity
			});
		}
	}

	const rootMap = new Map();
	for (const pair of squarePairs) {
		if (!rootMap.has(pair.rootKey)) rootMap.set(pair.rootKey, []);
		rootMap.get(pair.rootKey).push(pair);
	}

	const rootClassRows = Array.from(rootMap.entries())
		.map(([key, arr]) => ({ key, count: arr.length }))
		.sort((a, b) => b.count - a.count)
		.slice(0, 12);

	let witness = null;
	for (const arr of rootMap.values()) {
		if (arr.length < 2) continue;
		const p1 = arr[0];
		const p2 = arr[1];
		const four = [p1.a, p1.b, p2.a, p2.b];

		const sumExp = Array(PRIMES.length).fill(0);
		for (const item of four) {
			for (let j = 0; j < PRIMES.length; j++) sumExp[j] += item.exponents[j];
		}

		const isFourth = sumExp.every((e) => e % 4 === 0);
		if (!isFourth) continue;

		const root4Exp = sumExp.map((e) => e / 4);
		const t = numberFromExponents(root4Exp);
		const product = four.reduce((acc, item) => acc * item.value, 1n);

		witness = {
			a: p1.a.value.toString(),
			b: p1.b.value.toString(),
			c: p2.a.value.toString(),
			d: p2.b.value.toString(),
			product: product.toString(),
			t: t.toString(),
			checkValue: (t * t * t * t).toString()
		};
		break;
	}

	return {
		count: items.length,
		parityClassCount: classMap.size,
		squarePairCount: squarePairs.length,
		rootParityClassCount: rootMap.size,
		parityClassRows,
		rootClassRows,
		found: !!witness,
		witness,
		threshold: THRESHOLD,
		guaranteed: items.length >= THRESHOLD
	};
}

function runConstruction() {
	error.value = "";
	result.value = null;

	try {
		const count = Number(countInput.value);
		if (!Number.isInteger(count)) throw new Error("Bitte eine ganze Zahl eingeben.");
		if (count < 4) throw new Error("Mindestens 4 Zahlen sind nötig.");
		if (count > 5000) throw new Error("Bitte maximal 5000 eingeben (für flüssige Darstellung).");

		const items = generateSmoothSet(count);
		result.value = analyze(items);
	} catch (e) {
		error.value = e?.message ? String(e.message) : String(e);
	}
}

function randomExample() {
	const c = 200 + Math.floor(Math.random() * 2200); // 200..2399
	countInput.value = String(c);
	runConstruction();
}

runConstruction();
</script>

<style scoped>
ol > li { margin: 0.35rem 0; }
</style>
