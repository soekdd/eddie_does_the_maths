<template>
<div class="gdPlateBuilder">
	<v-row dense>
		<v-col cols="12" md="5">
			<v-card class="pa-4" rounded="xl">
				<h3 class="text-h6 mb-2">Term-Editor</h3>
				<p class="text-body-2 mb-3">
					Jeder Term ist entweder ein Bruchteil von <Katex tex="x" /> oder eine feste Jahreszahl.
				</p>

				<div class="d-flex flex-wrap ga-2 mb-3">
					<v-btn color="primary" variant="flat" @click="openNewTerm">
						Term hinzufügen
					</v-btn>
					<v-btn
						:disabled="terms.length === 0"
						variant="tonal"
						@click="clearTerms"
					>
						Alle Terme löschen
					</v-btn>
				</div>

				<v-alert class="mb-3" :type="status.type" variant="tonal">
					{{ status.message }}
				</v-alert>

				<v-list v-if="terms.length" class="termList" lines="two">
					<v-list-item
						v-for="(term, index) in terms"
						:key="term.id"
						class="pr-0"
						:subtitle="term.description"
						:title="`${index + 1}. ${describeTerm( term )}`"
					>
						<template #append>
							<div class="d-flex ga-1">
								<v-btn
									icon="$edit"
									size="small"
									variant="text"
									@click="openEditTerm( index )"
								/>
								<v-btn
									color="error"
									icon="$delete"
									size="small"
									variant="text"
									@click="deleteTerm( index )"
								/>
							</div>
						</template>
					</v-list-item>
				</v-list>
				<p v-else class="text-body-2 text-medium-emphasis">
					Noch keine Terme. Starte mit einem Bruch oder einer konstanten Zeit.
				</p>
			</v-card>
		</v-col>

		<v-col cols="12" md="7">
			<section class="plateCard">
				<header class="plateHeader">
					<div class="plateLead">Hier ruht ein Zahlenfreund</div>
					<div class="plateLeadSub">Sein Alter verrät die Rechnung</div>
				</header>

				<div class="plateEquation">
					<Katex :tex="equationTex" />
					<Katex v-if="solutionTex" :tex="solutionTex" />
				</div>

				<ol v-if="stageRows.length" class="inscriptionList">
					<li v-for="row in stageRows" :key="row.id">
						<p class="inscriptionText">
							Nach <span class="termAccent">{{ row.termLabel }}</span>:
							{{ row.description }}
						</p>
						<p v-if="row.cumulativeAge !== null" class="inscriptionAge">
							+{{ formatYears( row.increment ) }} Jahre · Alter:
							{{ formatYears( row.cumulativeAge ) }} Jahre
						</p>
						<p v-else class="inscriptionAge inscriptionAgeMuted">
							Alter erscheint, sobald die Gleichung lösbar ist.
						</p>
					</li>
				</ol>
				<p v-else class="plateHint">
					Füge links Terme hinzu, dann graviert sich die Inschrift hier automatisch.
				</p>

				<footer v-if="totalLifetime !== null" class="plateFooter">
					Gesamtes Alter:
					<strong>{{ formatYears( totalLifetime ) }} Jahre</strong>
				</footer>
			</section>
		</v-col>
	</v-row>

	<v-dialog v-model="editorOpen" max-width="560">
		<v-card>
			<v-card-title>
				{{ editingIndex >= 0 ? "Term bearbeiten" : "Neuen Term erstellen" }}
			</v-card-title>
			<v-card-text>
				<v-radio-group v-model="draft.kind" inline>
					<v-radio label="Bruch von x" value="fraction" />
					<v-radio label="Konstante Jahre" value="constant" />
				</v-radio-group>

				<v-select
					v-if="draft.kind === 'fraction'"
					v-model="draft.fractionId"
					class="mb-3"
					hide-details="auto"
					item-title="label"
					item-value="id"
					:items="FRACTION_OPTIONS"
					label="Einfachen Bruch wählen"
				/>

				<v-text-field
					v-else
					v-model="draft.constantYears"
					class="mb-3"
					label="Jahre"
					min="0.1"
					step="0.5"
					type="number"
				/>

				<v-text-field
					v-model="draft.description"
					label="Lebensabschnitt (Freitext)"
					placeholder="z. B. bis zur Hochzeit"
				/>

				<v-alert v-if="draftError"
					class="mt-3"
					type="error"
					variant="tonal"
				>
					{{ draftError }}
				</v-alert>
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn variant="text" @click="closeEditor">Abbrechen</v-btn>
				<v-btn color="primary" variant="flat" @click="saveDraft">
					{{ editingIndex >= 0 ? "Speichern" : "Hinzufügen" }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</div>
</template>

<script setup>
import {
	computed,
	reactive,
	ref
} from "vue";

const FRACTION_OPTIONS = [
	{
		id:          "1/12",
		label:       "1/12 der Lebensdauer",
		numerator:   1,
		denominator: 12
	},
	{
		id:          "1/10",
		label:       "1/10 der Lebensdauer",
		numerator:   1,
		denominator: 10
	},
	{
		id:          "1/9",
		label:       "1/9 der Lebensdauer",
		numerator:   1,
		denominator: 9
	},
	{
		id:          "1/8",
		label:       "1/8 der Lebensdauer",
		numerator:   1,
		denominator: 8
	},
	{
		id:          "1/7",
		label:       "1/7 der Lebensdauer",
		numerator:   1,
		denominator: 7
	},
	{
		id:          "1/6",
		label:       "1/6 der Lebensdauer",
		numerator:   1,
		denominator: 6
	},
	{
		id:          "1/5",
		label:       "1/5 der Lebensdauer",
		numerator:   1,
		denominator: 5
	},
	{
		id:          "1/4",
		label:       "1/4 der Lebensdauer",
		numerator:   1,
		denominator: 4
	},
	{
		id:          "1/3",
		label:       "1/3 der Lebensdauer",
		numerator:   1,
		denominator: 3
	},
	{
		id:          "2/3",
		label:       "2/3 der Lebensdauer",
		numerator:   2,
		denominator: 3
	},
	{
		id:          "3/4",
		label:       "3/4 der Lebensdauer",
		numerator:   3,
		denominator: 4
	},
	{
		id:          "1/2",
		label:       "1/2 der Lebensdauer",
		numerator:   1,
		denominator: 2
	}
];

const EPS = 1e-9;
const yearFormatter = new Intl.NumberFormat( "de-DE", { maximumFractionDigits: 2 } );

const terms = ref( [] );
const editorOpen = ref( false );
const editingIndex = ref( -1 );
const draftError = ref( "" );
let nextId = 1;

const draft = reactive( {
	kind:          "fraction",
	fractionId:    FRACTION_OPTIONS[ 0 ].id,
	constantYears: "5",
	description:   ""
} );

function fractionById( fractionId ) {
	return FRACTION_OPTIONS.find( ( option ) => option.id === fractionId ) ?? null;
}

function fractionValue( fractionId ) {
	const fraction = fractionById( fractionId );

	if ( !fraction ) {
		return 0;
	}

	return fraction.numerator / fraction.denominator;
}

function toKatexNumber( value ) {
	if ( Math.abs( value - Math.round( value ) ) < EPS ) {
		return String( Math.round( value ) );
	}

	return Number( value.toFixed( 3 ) ).toString();
}

function normalizeYears( rawValue ) {
	const normalized = String( rawValue ?? "" )
		.trim()
		.replace( ",", "." );
	const parsed = Number( normalized );

	if ( !Number.isFinite( parsed ) ) {
		return null;
	}

	return parsed;
}

function formatYears( value ) {
	if ( value === null || value === undefined || !Number.isFinite( value ) ) {
		return "?";
	}

	const normalized = Math.abs( value - Math.round( value ) ) < EPS ?
		Math.round( value ) :
		Number( value.toFixed( 2 ) );

	return yearFormatter.format( normalized );
}

function describeTerm( term ) {
	if ( term.kind === "fraction" ) {
		const fraction = fractionById( term.fractionId );

		if ( !fraction ) {
			return "Ungültiger Bruch";
		}

		return `${fraction.numerator}/${fraction.denominator} von x`;
	}

	return `${formatYears( term.constantYears )} Jahre`;
}

function termEquationTex( term ) {
	if ( term.kind === "fraction" ) {
		const fraction = fractionById( term.fractionId );

		if ( !fraction ) {
			return "0";
		}

		return `\\frac{${fraction.numerator}}{${fraction.denominator}}x`;
	}

	return toKatexNumber( term.constantYears );
}

function stageLabel( term ) {
	if ( term.kind === "fraction" ) {
		const fraction = fractionById( term.fractionId );

		if ( !fraction ) {
			return "einem unbekannten Bruch";
		}

		return `${fraction.numerator}/${fraction.denominator} seiner Lebenszeit`;
	}

	return `${formatYears( term.constantYears )} Jahren`;
}

function resetDraft() {
	draft.kind = "fraction";
	draft.fractionId = FRACTION_OPTIONS[ 0 ].id;
	draft.constantYears = "5";
	draft.description = "";
	draftError.value = "";
}

function openNewTerm() {
	editingIndex.value = -1;
	resetDraft();
	editorOpen.value = true;
}

function openEditTerm( index ) {
	const term = terms.value[ index ];

	if ( !term ) {
		return;
	}

	editingIndex.value = index;
	draft.kind = term.kind;
	draft.fractionId = term.kind === "fraction" ?
		term.fractionId :
		FRACTION_OPTIONS[ 0 ].id;
	draft.constantYears = term.kind === "constant" ?
		String( term.constantYears ) :
		"5";
	draft.description = term.description;
	draftError.value = "";
	editorOpen.value = true;
}

function closeEditor() {
	editorOpen.value = false;
	draftError.value = "";
}

function buildTermFromDraft() {
	const description = draft.description.trim();

	if ( !description ) {
		draftError.value = "Bitte gib einen Lebensabschnitt als Freitext ein.";
		return null;
	}

	if ( draft.kind === "fraction" ) {
		const fraction = fractionById( draft.fractionId );

		if ( !fraction ) {
			draftError.value = "Bitte wähle einen gültigen Bruch aus.";
			return null;
		}

		return {
			kind:          "fraction",
			fractionId:    fraction.id,
			constantYears: 0,
			description
		};
	}

	const constantYears = normalizeYears( draft.constantYears );

	if ( constantYears === null || constantYears <= 0 ) {
		draftError.value = "Konstante Jahre müssen eine positive Zahl sein.";
		return null;
	}

	return {
		kind:       "constant",
		fractionId: null,
		constantYears,
		description
	};
}

function saveDraft() {
	const newTermData = buildTermFromDraft();

	if ( !newTermData ) {
		return;
	}

	if ( editingIndex.value >= 0 ) {
		const oldTerm = terms.value[ editingIndex.value ];

		if ( oldTerm ) {
			terms.value.splice(
				editingIndex.value, 1, {
					...oldTerm,
					...newTermData
				}
			);
		}
	} else {
		terms.value.push( {
			id: nextId++,
			...newTermData
		} );
	}

	closeEditor();
}

function deleteTerm( index ) {
	terms.value.splice( index, 1 );
}

function clearTerms() {
	terms.value = [];
	editingIndex.value = -1;
}

const fractionSum = computed( () => terms.value.reduce( ( sum, term ) => {
	return sum + ( term.kind === "fraction" ? fractionValue( term.fractionId ) : 0 );
}, 0 ) );

const constantSum = computed( () => terms.value.reduce( ( sum, term ) => {
	return sum + ( term.kind === "constant" ? term.constantYears : 0 );
}, 0 ) );

const denominator = computed( () => 1 - fractionSum.value );

const totalLifetime = computed( () => {
	if ( terms.value.length === 0 ) {
		return null;
	}

	if ( denominator.value <= EPS ) {
		return null;
	}

	if ( constantSum.value <= EPS ) {
		return null;
	}

	const life = constantSum.value / denominator.value;

	if ( !Number.isFinite( life ) || life <= 0 ) {
		return null;
	}

	return life;
} );

const stageRows = computed( () => {
	const life = totalLifetime.value;
	let cumulative = 0;

	return terms.value.map( ( term ) => {
		let increment = null;
		let cumulativeAge = null;

		if ( life !== null ) {
			increment = term.kind === "fraction" ?
				life * fractionValue( term.fractionId ) :
				term.constantYears;
			cumulative += increment;
			cumulativeAge = cumulative;
		}

		return {
			id:          term.id,
			termLabel:   stageLabel( term ),
			description: term.description,
			increment,
			cumulativeAge
		};
	} );
} );

const equationTex = computed( () => {
	const left = terms.value.length ?
		terms.value.map( termEquationTex ).join( "+" ) :
		"0";
	return `${left}=x`;
} );

const solutionTex = computed( () => {
	if ( totalLifetime.value === null ) {
		return "";
	}

	return `x=\\frac{${toKatexNumber( constantSum.value )}}` +
		`{${toKatexNumber( denominator.value )}}` +
		`\\approx ${toKatexNumber( totalLifetime.value )}`;
} );

const status = computed( () => {
	if ( terms.value.length === 0 ) {
		return {
			type:    "info",
			message: "Lege deine Termliste an. Sobald sie lösbar ist, wird das Alter automatisch berechnet."
		};
	}

	if ( fractionSum.value >= 1 - EPS ) {
		return {
			type:    "warning",
			message: "Die Bruchanteile sind zusammen mindestens 1. So kann kein positives Gesamtalter berechnet werden."
		};
	}

	if ( constantSum.value <= EPS ) {
		return {
			type:    "warning",
			message: "Füge mindestens einen konstanten Term (z. B. 5 Jahre) hinzu, damit x bestimmbar ist."
		};
	}

	if ( totalLifetime.value === null ) {
		return {
			type:    "warning",
			message: "Die aktuelle Termliste ist noch nicht sauber lösbar."
		};
	}

	return {
		type:    "success",
		message: `Aus den Termen folgt ein Gesamtalter von ${formatYears( totalLifetime.value )} Jahren.`
	};
} );
</script>

<style scoped>
.gdPlateBuilder {
	width: 100%;
}

.termList {
	background: rgba(255, 255, 255, 0.04);
	border: 1px solid rgba(var(--v-theme-on-surface, 20, 20, 20), 0.15);
	border-radius: 12px;
}

.plateCard {
	position: relative;
	overflow: hidden;
	padding: 18px 18px 14px;
	border-radius: 16px;
	border: 1px solid rgba(60, 45, 26, 0.5);
	background:
		radial-gradient(120% 100% at 0% 0%, rgba(255, 239, 215, 0.45), transparent 55%),
		linear-gradient(150deg, #7a6651 0%, #ab957d 38%, #725d49 70%, #5d4a3a 100%);
	box-shadow:
		inset 0 1px 0 rgba(255, 248, 235, 0.28),
		inset 0 -18px 22px rgba(35, 24, 14, 0.28),
		0 10px 24px rgba(0, 0, 0, 0.24);
	color: #1f1811;
	font-family: "Cormorant Garamond", "Times New Roman", serif;
}

.plateCard::before {
	content: "";
	position: absolute;
	inset: 10px;
	border: 1px solid rgba(65, 47, 29, 0.5);
	border-radius: 12px;
	pointer-events: none;
}

.plateHeader {
	position: relative;
	z-index: 1;
	text-align: center;
	margin-bottom: 10px;
}

.plateLead {
	font-size: 1.35rem;
	letter-spacing: 0.04em;
	text-transform: uppercase;
}

.plateLeadSub {
	font-size: 0.95rem;
	letter-spacing: 0.06em;
	opacity: 0.84;
	text-transform: uppercase;
}

.plateEquation {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	gap: 6px;
	padding: 8px 10px;
	border-radius: 10px;
	background: rgba(255, 252, 245, 0.27);
	margin-bottom: 12px;
}

.inscriptionList {
	position: relative;
	z-index: 1;
	margin: 0;
	padding-left: 20px;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.inscriptionText {
	margin: 0;
	line-height: 1.35;
	font-size: 1.05rem;
}

.termAccent {
	font-weight: 700;
}

.inscriptionAge {
	margin: 2px 0 0;
	font-size: 0.92rem;
	opacity: 0.92;
}

.inscriptionAgeMuted {
	font-style: italic;
	opacity: 0.75;
}

.plateHint {
	position: relative;
	z-index: 1;
	margin: 0;
	opacity: 0.85;
	font-size: 1rem;
}

.plateFooter {
	position: relative;
	z-index: 1;
	margin-top: 12px;
	padding-top: 10px;
	border-top: 1px solid rgba(65, 47, 29, 0.35);
	font-size: 1.05rem;
}
</style>
