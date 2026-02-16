<template>
<AppFrame
	short="SD"
	:sub-chapter="{
		'einleitung': 'Einleitung',
		'bits-zu-basen': 'Bits zu Basen',
		'codons': 'Codons',
		'vergleich': 'Vergleich',
		'frameshift': 'Frameshift',
		'warum': 'Warum mich das packt',
		'gift-code': 'String zu DNA'
	}"
	title="Eddie rechnet: Ich zeig dir deine DNA"
	warning
>
	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="`Eddie und Genetik`">
				<img alt="Eddie über Genetik" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>

		<h2 id="einleitung">Wenn das Leben Code schreibt</h2>
		<div class="eddie">
			<p>
				In Sinis Wohnung liegt so ein Genetikbuch rum, schwer wie ein Ziegelstein,
				und ich kann&rsquo;s nicht lassen: Ich schlage es auf. Und mein Kopf macht sofort,
				was er immer macht: Alles wird zu Strukturen, zu Regeln, zu Code.
			</p>
			<p>
				Plötzlich fühlt sich DNA nicht mehr an wie &bdquo;Bio-Kram&ldquo;, sondern wie ein
				unglaublich elegantes Speicherformat. Nicht geschniegelt wie ein Rechner,
				eher dreckig-genial: eine Maschine, die in einem Wald geboren wurde und
				trotzdem stabil läuft.
			</p>
		</div>

		<h2 id="bits-zu-basen" class="mt-8">Von Bits zu Basen: vier Zeichen statt zwei</h2>
		<div class="eddie">
			<p>
				Computer lieben zwei Zustände: 0 und 1.
				Die Natur sagt: Ich nehme vier. DNA nutzt die Basen <b>A, C, G, T</b>.
				Und sie koppelt sie direkt als Paare: <b>A-T</b> und <b>C-G</b>.
			</p>
			<p>
				Das ist Speicher + Plausibilitätscheck in einem Schritt.
				Wenn du ein <b>A</b> siehst, erwartest du gegenüber ein <b>T</b>.
			</p>
			<p>
				Und jetzt der Informatik-Moment: Vier Symbole passen exakt auf <b>2 Bits</b>.
			</p>
			<div class="kbox">
				<div v-for="row in baseEncodingRows" :key="row.bits" class="mono">
					{{ row.bits }} = {{ row.base }}
				</div>
			</div>
			<p class="muted">
				Eine Base trägt damit informations-theoretisch grob zwei Bits.
			</p>
		</div>

		<h2 id="codons" class="mt-8">Codons sind wie Opcodes</h2>
		<div class="eddie">
			<p>
				Drei Basen hintereinander ergeben ein Codon, also einen Mini-Befehl
				für die Zelle: Welche Aminosäure als Nächstes eingebaut wird.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="3\ \text{Basen} = 3\cdot 2\ \text{Bits} = 6\ \text{Bits}" />
			</div>
			<p>
				Der genetische Code ist dabei absichtlich redundant:
				Mehrere Codons können dieselbe Aminosäure bedeuten.
				Das wirkt erst verschwenderisch, macht das System aber robuster.
			</p>
		</div>

		<h2 class="mt-8">Aminosäuren, Proteine, Gene</h2>
		<div class="eddie">
			<p>
				Aminosäuren sind Bausteine. Ketten daraus werden Proteine.
				Und Proteine sind nicht nur &bdquo;Eiweiß&ldquo;, sondern Werkzeuge:
				Motoren, Schalter, Transporter, Sensoren.
			</p>
			<p>
				Ein Gen ist wie eine Funktion oder ein Modul:
				ein Abschnitt DNA, der ein konkretes Produkt codiert
				(Protein oder RNA). Das Genom ist dann die komplette Codebasis.
			</p>
		</div>

		<h2 id="vergleich" class="mt-8">Vergleichstabelle: Informatik vs. Genetik</h2>
		<div class="tableScroller mt-3">
			<v-table density="compact">
				<thead>
					<tr>
						<th>Informatik</th>
						<th>Genetik</th>
						<th>Was ich daran feiere</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in comparisonRows" :key="row.cs">
						<td><b>{{ row.cs }}</b></td>
						<td><b>{{ row.genetics }}</b></td>
						<td>{{ row.note }}</td>
					</tr>
				</tbody>
			</v-table>
		</div>

		<h2 id="frameshift" class="mt-8">Fehler, die sich wie Albträume anfühlen: Frameshift</h2>
		<div class="eddie">
			<p>
				Wenn in DNA eine Base eingefügt oder gelöscht wird,
				verschiebt sich der Leseraster. Ab da ändern sich alle folgenden Codons.
			</p>
			<p>
				Das ist, als würdest du in einem Maschinenprogramm ab Byte 17 alles um ein Bit verschieben:
				Plötzlich bedeutet derselbe Datenstrom etwas völlig anderes.
			</p>
			<p>
				Und trotzdem existieren wir, weil Zellen Reparaturmechanismen haben:
				Proofreading, Korrekturtrupps, Redundanz.
				ECC-RAM, nur biochemisch.
			</p>
		</div>

		<h2 id="warum" class="mt-8">Warum mich das so packt</h2>
		<div class="eddie">
			<p>
				Genetik beantwortet die große Frage:
				Wie macht man aus Materie ein System, das sich selbst kopiert,
				sich selbst repariert und dabei neue Varianten erzeugt?
			</p>
			<p>
				Computer sind streng: Input rein, Output raus.
				DNA ist frecher. Sie speichert nicht nur, sie experimentiert.
				Manche Bitflips sind Crash, manche egal, manche plötzlich Upgrade.
			</p>
			<p>
				Jedes Mal, wenn ich auf eine Doppelhelix schaue, denke ich:
				Das ist keine Bio-Kette. Das ist ein uralter Text. Und er läuft.
			</p>
			<p class="muted">
				Und ja: darunter kannst du aus einem beliebigen String einen nerdigen DNA-Text bauen.
			</p>
		</div>
	</template>

	<template #interactivePart>
		<h2 id="gift-code">Nerd-Geschenk: String zu DNA</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p>
				Das hier ist ein keine Wissenschaft, sondern nur ein kleiner Geschenkspaß für Nerds.
				Zu jeder Aminosäure existiert eine einbuchstabige Abkürzung. Die nutzen wir, um Namen oder Botschaften als DNA darzustellen.
				Leider existieren für die Buchstaben <b>B, J, X, Z</b> in diesem Kontext keine eindeutige Zuordnung. Diese können wir daher nicht kodieren.
			</p>

			<v-text-field
				v-model="giftInput"
				hide-details="auto"
				label="String eingeben (z.B. SAMIPUNK)"
				variant="outlined"
			/>

			<v-alert v-if="blockedLetters.length" type="warning" variant="tonal">
				Nicht eindeutig kodierbar wegen: <b>{{ blockedLettersText }}</b>.
				Bitte diese Buchstaben entfernen oder ersetzen.
			</v-alert>

			<v-alert v-else-if="!hasLetters" type="info" variant="tonal">
				Bitte mindestens einen Buchstaben von A bis Z eingeben.
			</v-alert>

			<v-alert v-else type="success" variant="tonal">
				Kodierung möglich für <b>{{ encodedRows.length }}</b> Buchstaben.
				{{ ignoredChars.length ? ` Ignoriert: ${ignoredCharsText}.` : "" }}
			</v-alert>

			<div v-if="canEncode" class="kbox">
				<div class="mono">DNA (Codons): {{ dnaCodonsSpaced }}</div>
				<div class="mono">DNA (kompakt): {{ dnaCompact }}</div>
			</div>
			<div v-if="canEncode" class="kbox">
				<div class="mono">Aminosäuren (Kurz): {{ aminoShortSequence }}</div>
				<div>Aminosäuren (Lang): {{ aminoLongSequence }}</div>
			</div>

			<div v-if="canEncode" class="tableScroller">
				<v-table density="compact">
					<thead>
						<tr>
							<th>#</th>
							<th>Buchstabe</th>
							<th>Kurz</th>
							<th>Langbezeichnung</th>
							<th class="mono">DNA-Codon</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(row, index) in encodedRows" :key="`${row.letter}-${index}`">
							<td class="mono">{{ index + 1 }}</td>
							<td><b>{{ row.letter }}</b></td>
							<td class="mono">{{ row.short }}</td>
							<td>{{ row.nameDe }}</td>
							<td class="mono">{{ row.codon }}</td>
						</tr>
					</tbody>
				</v-table>
			</div>
		</div>
	</template>
	<template #calculationPart>
		<SD_DNA v-if="canEncode" :dna="dnaCompact"/>
	</template>
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";

import SD_DNA from "./SD_DNA.vue";
import titleImg from "@/images/SD.webp";

const baseEncodingRows = [
	{ bits: "00", base: "A" },
	{ bits: "01", base: "C" },
	{ bits: "10", base: "G" },
	{ bits: "11", base: "T" }
];

const comparisonRows = [
	{
		cs:       "Bit (0/1)",
		genetics: "Zustand / Variation",
		note:     "Ein einzelner Flip kann große Folgen haben, genau wie eine Mutation."
	},
	{
		cs:       "2 Bits (00/01/10/11)",
		genetics: "Base (A/C/G/T)",
		note:     "Vier Symbole passen perfekt in ein 2-Bit-Alphabet."
	},
	{
		cs:       "Byte (8 Bits)",
		genetics: "4 Basen",
		note:     "Ein Byte entspricht grob vier DNA-Buchstaben."
	},
	{
		cs:       "Word (16/32 Bits)",
		genetics: "k-mer / Abschnitt (z.B. 8-16 Basen)",
		note:     "Größere Muster dienen als Erkennung und Steuerung."
	},
	{
		cs:       "String",
		genetics: "DNA-Sequenz",
		note:     "Zeichenketten, deren Bedeutung aus Leserahmen und Kontext entsteht."
	},
	{
		cs:       "Opcode / Instruktion",
		genetics: "Codon (3 Basen)",
		note:     "Drei Zeichen codieren den nächsten Aminosäure-Schritt."
	},
	{
		cs:       "Assembler -> Maschine",
		genetics: "Transkription/Translation",
		note:     "DNA wird erst in RNA umgeschrieben und dann in Protein übersetzt."
	},
	{
		cs:       "Funktion / Subroutine",
		genetics: "Gen",
		note:     "Ein zusammenhängender Abschnitt mit klarer Aufgabe."
	},
	{
		cs:       "Library",
		genetics: "Genfamilie / konservierte Domänen",
		note:     "Wiederverwendbare Bauteile in leicht unterschiedlichen Varianten."
	},
	{
		cs:       "Konfig / Flags",
		genetics: "Regulatorische Sequenzen",
		note:     "Sie steuern, wann und wie stark ein Gen aktiv ist."
	},
	{
		cs:       "Bug",
		genetics: "Mutation",
		note:     "Kann schaden, neutral bleiben oder einen Vorteil bringen."
	},
	{
		cs:       "Versionsverwaltung",
		genetics: "Evolution",
		note:     "Branches, Forks und Merge-Effekte, nur über sehr lange Zeit."
	}
];

const aminoByLetter = {
	A: {
		short:  "Ala",
		nameDe: "Alanin",
		codon:  "GCT"
	},
	B: {
		short:  "N/D",
		nameDe: "Asx (Asparagin oder Asparaginsäure)",
		codon:  null
	},
	C: {
		short:  "Cys",
		nameDe: "Cystein",
		codon:  "TGT"
	},
	D: {
		short:  "Asp",
		nameDe: "Asparaginsäure",
		codon:  "GAT"
	},
	E: {
		short:  "Glu",
		nameDe: "Glutaminsäure",
		codon:  "GAA"
	},
	F: {
		short:  "Phe",
		nameDe: "Phenylalanin",
		codon:  "TTT"
	},
	G: {
		short:  "Gly",
		nameDe: "Glycin",
		codon:  "GGT"
	},
	H: {
		short:  "His",
		nameDe: "Histidin",
		codon:  "CAT"
	},
	I: {
		short:  "Ile",
		nameDe: "Isoleucin",
		codon:  "ATT"
	},
	J: {
		short:  "—",
		nameDe: "Nicht als Aminosäure-Code verwendet",
		codon:  null
	},
	K: {
		short:  "Lys",
		nameDe: "Lysin",
		codon:  "AAA"
	},
	L: {
		short:  "Leu",
		nameDe: "Leucin",
		codon:  "TTA"
	},
	M: {
		short:  "Met",
		nameDe: "Methionin",
		codon:  "ATG"
	},
	N: {
		short:  "Asn",
		nameDe: "Asparagin",
		codon:  "AAT"
	},
	O: {
		short:  "Pyl",
		nameDe: "Pyrrolysin",
		codon:  "TAG"
	},
	P: {
		short:  "Pro",
		nameDe: "Prolin",
		codon:  "CCT"
	},
	Q: {
		short:  "Gln",
		nameDe: "Glutamin",
		codon:  "CAA"
	},
	R: {
		short:  "Arg",
		nameDe: "Arginin",
		codon:  "CGT"
	},
	S: {
		short:  "Ser",
		nameDe: "Serin",
		codon:  "TCT"
	},
	T: {
		short:  "Thr",
		nameDe: "Threonin",
		codon:  "ACT"
	},
	U: {
		short:  "Sec",
		nameDe: "Selenocystein",
		codon:  "TGA"
	},
	V: {
		short:  "Val",
		nameDe: "Valin",
		codon:  "GTT"
	},
	W: {
		short:  "Trp",
		nameDe: "Tryptophan",
		codon:  "TGG"
	},
	X: {
		short:  "X",
		nameDe: "Unbekannte Aminosäure",
		codon:  null
	},
	Y: {
		short:  "Tyr",
		nameDe: "Tyrosin",
		codon:  "TAT"
	},
	Z: {
		short:  "Q/E",
		nameDe: "Glx (Glutamin oder Glutaminsäure)",
		codon:  null
	}
};

const blockedSet = new Set( Object.entries( aminoByLetter )
	.filter( ( [ , amino ] ) => !amino.codon )
	.map( ( [ letter ] ) => letter ) );

const giftInput = ref( "SAMIPUNK" );

const normalizedInput = computed( () => giftInput.value.toUpperCase() );

const parsedInput = computed( () => {
	const rows = [];
	const blocked = new Set();
	const ignored = new Set();
	let hasLetters = false;

	for ( const char of normalizedInput.value ) {
		const isAsciiLetter = char >= "A" && char <= "Z";

		if ( isAsciiLetter ) {
			hasLetters = true;

			if ( blockedSet.has( char ) ) {
				blocked.add( char );
				continue;
			}

			const amino = aminoByLetter[ char ];

			if ( amino?.codon ) {
				rows.push( {
					letter: char,
					codon:  amino.codon,
					short:  amino.short,
					nameDe: amino.nameDe
				} );
				continue;
			}

			blocked.add( char );
			continue;
		}

		if ( char.trim() ) {
			ignored.add( char );
		}
	}

	return {
		rows,
		hasLetters,
		blocked: [ ...blocked ],
		ignored: [ ...ignored ]
	};
} );

const encodedRows = computed( () => parsedInput.value.rows );
const blockedLetters = computed( () => parsedInput.value.blocked.sort() );
const ignoredChars = computed( () => parsedInput.value.ignored.sort() );
const hasLetters = computed( () => parsedInput.value.hasLetters );
const canEncode = computed( () => {
	return hasLetters.value &&
		blockedLetters.value.length === 0 &&
		encodedRows.value.length > 0;
} );
const dnaCodonsSpaced = computed( () => encodedRows.value.map( ( row ) => row.codon ).join( " " ) );
const dnaCompact = computed( () => encodedRows.value.map( ( row ) => row.codon ).join( "" ) );
const aminoShortSequence = computed( () => encodedRows.value.map( ( row ) => row.short ).join( " - " ) );
const aminoLongSequence = computed( () => encodedRows.value.map( ( row ) => row.nameDe ).join( ", " ) );
const blockedLettersText = computed( () => blockedLetters.value.join( ", " ) );
const ignoredCharsText = computed( () => ignoredChars.value.map( ( char ) => `'${char}'` ).join( ", " ) );
</script>
