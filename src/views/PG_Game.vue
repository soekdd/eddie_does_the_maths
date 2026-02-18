<!-- RandomHandWithSolver.vue -->
<template>
<v-card class="pa-4" elevation="4">
	<div class="d-flex align-center justify-space-between mb-3">
		<div>
			<div class="text-h6">Zufallsblatt</div>
			<div class="text-body-2 text-medium-emphasis">
				Handgröße: {{ handCodes.length }} Karten
			</div>
		</div>
		<div class="d-flex ga-2">
			<v-btn
				color="primary"
				:variant="selectedHandSize === 3 ? 'flat' : 'outlined'"
				@click="newRandomHand( 3 )"
			>
				{{ compactButtonLabels ? "3" : "3 Karten" }}
			</v-btn>
			<v-btn
				color="primary"
				:variant="selectedHandSize === 4 ? 'flat' : 'outlined'"
				@click="newRandomHand( 4 )"
			>
				{{ compactButtonLabels ? "4" : "4 Karten" }}
			</v-btn>
			<v-btn
				color="primary"
				:variant="selectedHandSize === 5 ? 'flat' : 'outlined'"
				@click="newRandomHand( 5 )"
			>
				{{ compactButtonLabels ? "5" : "5 Karten" }}
			</v-btn>
		</div>
	</div>

	<div class="handStage">
		<div class="hand">
			<div
				v-for="(c, idx) in cards"
				:key="c.code"
				class="cardWrap"
				:style="pose(idx, cards.length).wrapper"
			>
				<PokerCard
					:rank="c.rank"
					:rotation="pose(idx, cards.length).rotation"
					:suit="c.suit"
				/>
			</div>
		</div>
	</div>

	<v-divider class="my-4" />

	<v-alert v-if="note"
		class="mb-3"
		type="info"
		variant="tonal"
	>
		{{ note }}
	</v-alert>

	<div class="d-flex flex-wrap align-center ga-3">
		<v-chip color="secondary" variant="tonal">
			Bewertung: {{ resultTitle }}
		</v-chip>
		<div v-if="resultDescr" class="text-body-2">
			{{ resultDescr }}
		</div>
	</div>

	<div v-if="missingToFive > 0 && completionCodes.length" class="mt-2 text-body-2 text-medium-emphasis">
		Ergänzungskarten (optimal):
		<span class="completionMiniCards">
			<PokerCard
				v-for="c in completionCards"
				:key="`completion-${c.code}`"
				mini
				:rank="c.rank"
				:suit="c.suit"
			/>
		</span>
	</div>
	<div
		v-if="completionDrawProbability !== null"
		class="mt-1 text-body-2 text-medium-emphasis"
	>
		Wahrscheinlichkeit, genau diese Ergänzungskarten zu ziehen:
		<Katex
			as="div"
			:display="true"
			:tex="completionDrawTex"
		/>
	</div>

	<div v-else-if="missingToFive === 0" class="mt-2 text-body-2 text-medium-emphasis">
		(Direkt bewertet – exakt 5 Karten.)
	</div>
</v-card>
</template>

<script setup lang="ts">
import {
	computed, onMounted, ref
} from "vue";
import { useDisplay } from "vuetify";
import PokerCard from "./PG_Card.vue";
import PokerSolver from "pokersolver";
const { Hand } = PokerSolver as any;

type SuitChar = "s" | "h" | "d" | "c";

const handCodes = ref<string[]>( [] ); // z.B. ["As","Td","7h"]
const best5Codes = ref<string[]>( [] ); // beste 5er-Vervollständigung (falls Hand < 5)
const solved = ref<any | null>( null );
const note = ref<string>( "" );
const selectedHandSize = ref<3 | 4 | 5>( 5 );
const { width } = useDisplay();
const compactButtonLabels = computed( () => width.value <= 700 );

function buildDeck(): string[] {
	const ranks = [ "2","3","4","5","6","7","8","9","T","J","Q","K","A" ];
	const suits: SuitChar[] = [ "s","h","d","c" ];
	const deck: string[] = [];

	for ( const r of ranks ) {
		for ( const s of suits ) {
			deck.push( `${r}${s}` );
		}
	}

	return deck;
}

function shuffle<T>( arr: T[] ): T[] {
	const a = arr.slice();

	for ( let i = a.length - 1; i > 0; i-- ) {
		const j = Math.floor( Math.random() * ( i + 1 ) );
		[ a[ i ], a[ j ] ] = [ a[ j ], a[ i ] ];
	}

	return a;
}

function suitToGerman( s: SuitChar ): string {
	switch ( s ) {
		case "s": return "Pik";
		case "h": return "Herz";
		case "d": return "Karo";
		case "c": return "Kreuz";
	}
}

function rankToDisplay( r: string ): number | string {
	if ( r === "T" ) {
		return 10;
	}

	if ( r === "J" ) {
		return "Bube";
	}

	if ( r === "Q" ) {
		return "Dame";
	}

	if ( r === "K" ) {
		return "König";
	}

	if ( r === "A" ) {
		return "Ass";
	}

	return Number( r );
}

function parseCard( code: string ) {
	const r = code[ 0 ];
	const s = code[ 1 ] as SuitChar;
	return {
		code,
		suit: suitToGerman( s ),
		rank: rankToDisplay( r )
	};
}

const cards = computed( () => handCodes.value.map( parseCard ) );
const missingToFive = computed( () => Math.max( 0, 5 - handCodes.value.length ) );
const remainingDeckCount = computed( () => 52 - handCodes.value.length );
const completionCodes = computed( () => {
	const set = new Set( handCodes.value );
	return best5Codes.value.filter( c => !set.has( c ) );
} );
const completionCards = computed( () => completionCodes.value.map( parseCard ) );

function nChooseK( n: number, k: number ): number {
	if ( k < 0 || k > n ) {
		return 0;
	}

	const kk = Math.min( k, n - k );
	let out = 1;

	for ( let i = 1; i <= kk; i++ ) {
		out = out * ( n - kk + i ) / i;
	}

	return out;
}

const completionDrawProbability = computed<number | null>( () => {
	const missing = missingToFive.value;
	const remaining = remainingDeckCount.value;

	if ( missing <= 0 || completionCodes.value.length !== missing ) {
		return null;
	}

	const denominator = nChooseK( remaining, missing );

	if ( denominator <= 0 ) {
		return null;
	}

	return 1 / denominator;
} );

function toTexNumber( value: number, decimals: number ): string {
	return Number( value.toFixed( decimals ) ).toString();
}

const completionDrawTex = computed( () => {
	const p = completionDrawProbability.value;

	if ( p === null || p <= 0 ) {
		return "";
	}

	const n = remainingDeckCount.value;
	const k = missingToFive.value;
	const denominator = nChooseK( n, k );
	const denominatorText = Math.round( denominator ).toString();
	const percent = p * 100;
	const percentDigits = percent >= 1 ? 2 : percent >= 0.1 ? 3 : 4;
	const percentText = toTexNumber( percent, percentDigits );
	const lhs = String.raw`P(\text{genau diese Ergänzungskarten})`;
	const rhs = String.raw`\frac{1}{\binom{${n}}{${k}}}=\frac{1}{${denominatorText}}\approx ${percentText}\%`;
	return `${lhs}=${rhs}`;
} );

function evaluateWithPokerSolver( current: string[] ) {
	const deck = buildDeck();
	const remaining = deck.filter( c => !current.includes( c ) );
	const missing = 5 - current.length;

	// genau 5 Karten -> direkt lösen
	if ( missing <= 0 ) {
		best5Codes.value = current.slice( 0, 5 );
		solved.value = Hand.solve( best5Codes.value );
		note.value = "";
		return;
	}

	// 3–4 Karten -> "bestmögliche 5er-Hand" durch Ergänzen aus Restdeck (optimistisch)
	let bestHand: any | null = null;
	let bestCodesLocal: string[] = [];

	const beats = ( candidate: any, incumbent: any | null ) => {
		if ( !incumbent ) {
			return true;
		}

		const winners = Hand.winners( [ candidate, incumbent ] );
		// nur updaten, wenn candidate eindeutig gewinnt (kein Tie)
		return winners.length === 1 && winners[ 0 ] === candidate;
	};

	if ( missing === 1 ) {
		for ( const c1 of remaining ) {
			const codes = [ ...current, c1 ];
			const h = Hand.solve( codes );

			if ( beats( h, bestHand ) ) {
				bestHand = h;
				bestCodesLocal = codes;
			}
		}
	} else if ( missing === 2 ) {
		for ( let i = 0; i < remaining.length - 1; i++ ) {
			for ( let j = i + 1; j < remaining.length; j++ ) {
				const c1 = remaining[ i ];
				const c2 = remaining[ j ];
				const codes = [ ...current, c1, c2 ];
				const h = Hand.solve( codes );

				if ( beats( h, bestHand ) ) {
					bestHand = h;
					bestCodesLocal = codes;
				}
			}
		}
	} else {
		// bei 3-5 Karten kommt das hier nicht vor
		bestHand = null;
		bestCodesLocal = [];
	}

	best5Codes.value = bestCodesLocal;
	solved.value = bestHand;
	note.value =
    `Hinweis: Du siehst ${current.length} Karten. Bewertung ist die *bestmögliche* 5-Karten-Hand, ` +
    `wenn man die fehlenden ${missing} Karte(n) optimal aus dem Restdeck ergänzen dürfte.`;
}

function newRandomHand( size: 3 | 4 | 5 = selectedHandSize.value ) {
	selectedHandSize.value = size;
	const deck = shuffle( buildDeck() );
	const hand = deck.slice( 0, size );
	handCodes.value = hand;
	evaluateWithPokerSolver( hand );
}

function pose( i: number, n: number ) {
	const mid = ( n - 1 ) / 2;
	const spread = 9; // Grad pro Schritt
	const xStep = 34; // Pixel pro Schritt
	const yStep = 6; // leichte Bogenform
	const dx = ( i - mid ) * xStep;
	const dy = Math.abs( i - mid ) * yStep;
	const rot = ( i - mid ) * spread;
	return {
		wrapper: {
			transform: `translateX(calc(-50% + ${dx}px)) translateY(${dy}px)`,
			zIndex:    100 + i
		} as any,
		rotation: rot
	};
}

const resultTitle = computed( () => {
	if ( !solved.value ) {
		return "—";
	}

	// pokersolver liefert i.d.R. { name, descr, ... }
	return solved.value.name ?? "Ergebnis";
} );

const resultDescr = computed( () => {
	if ( !solved.value ) {
		return "";
	}

	return solved.value.descr ?? "";
} );

onMounted( () => {
	newRandomHand( selectedHandSize.value );
} );
</script>

<style scoped>
.handStage {
  height: 190px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hand {
  position: relative;
  width: 420px; /* genug Platz fürs Fächern */
  height: 170px;
}

.cardWrap {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.completionMiniCards {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: 8px;
  vertical-align: middle;
}
</style>
