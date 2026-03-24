<!-- RandomHandWithSolver.vue -->
<template>
<v-card class="pa-4" elevation="4">
	<div class="d-flex align-center justify-space-between mb-3">
		<div>
			<div class="text-h6">{{ t( "game.title" ) }}</div>
			<div class="text-body-2 text-medium-emphasis">
				{{ t( "game.handSize", {
					count: handCodes.length
				} ) }}
			</div>
		</div>
		<div class="d-flex ga-2">
			<v-btn
				color="primary"
				:variant="selectedHandSize === 3 ? 'flat' : 'outlined'"
				@click="newRandomHand( 3 )"
			>
				{{ compactButtonLabels ? "3" : t( "game.size3" ) }}
			</v-btn>
			<v-btn
				color="primary"
				:variant="selectedHandSize === 4 ? 'flat' : 'outlined'"
				@click="newRandomHand( 4 )"
			>
				{{ compactButtonLabels ? "4" : t( "game.size4" ) }}
			</v-btn>
			<v-btn
				color="primary"
				:variant="selectedHandSize === 5 ? 'flat' : 'outlined'"
				@click="newRandomHand( 5 )"
			>
				{{ compactButtonLabels ? "5" : t( "game.size5" ) }}
			</v-btn>
		</div>
	</div>

	<PGHand
		:can-remove-card
		:cards
		@remove-card="removeCardAt"
	/>

	<v-divider class="my-4" />

	<v-alert
		v-if="note"
		class="mb-3"
		type="info"
		variant="tonal"
	>
		{{ note }}
	</v-alert>

	<div class="d-flex flex-wrap align-center ga-3">
		<v-chip color="secondary" variant="tonal">
			{{ t( "game.rating" ) }}: {{ resultTitle }}
		</v-chip>
		<div v-if="resultDescr" class="text-body-2">
			{{ resultDescr }}
		</div>
	</div>

	<div v-if="missingToFive > 0 && completionOptionsCards.length" class="mt-2 text-body-2 text-medium-emphasis">
		<span class="completionOptions">
			{{ t( "game.requiredCards" ) }}:
			<template v-for="( option, optionIndex ) in completionOptionsCards" :key="`completion-option-${optionIndex}`">
				<span v-if="optionIndex > 0" class="completionOr">{{ t( "game.or" ) }}</span>
				<span class="completionMiniCards">
					<PokerCard
						v-for="c in option"
						:key="`completion-${optionIndex}-${c.code}`"
						class="completionMiniCard"
						mini
						:rank="c.rank"
						:suit="c.suit"
						@click.stop="addCompletionCard( c.code )"
					/>
				</span>
			</template>
		</span>
	</div>
	<div
		v-if="completionDrawProbability !== null"
		class="mt-1 text-body-2 text-medium-emphasis"
	>
		{{ t( "game.drawProbability" ) }}:
		<Katex
			as="div"
			:display="true"
			:tex="completionDrawTex"
		/>
	</div>

	<div v-else-if="missingToFive === 0" class="mt-2 text-body-2 text-medium-emphasis">
		({{ t( "game.directlyRated" ) }})
	</div>
</v-card>
</template>

<script setup lang="ts">
import {
	computed, onMounted, ref
} from "vue";
import { useDisplay } from "vuetify";
import { useI18n } from "@/utils/i18n.mjs";
import PokerCard from "./PG_Card.vue";
import PGHand from "./PG_Hand.vue";
import PokerSolver from "pokersolver";

const { Hand } = PokerSolver as any;
const {
	locale, t, tm
} = useI18n( "book1/PG" );

type SuitChar = "s" | "h" | "d" | "c";

const handCodes = ref<string[]>( [] );
const bestCompletionOptions = ref<string[][]>( [] );
const solved = ref<any | null>( null );
const note = ref<string>( "" );
const selectedHandSize = ref<3 | 4 | 5>( 5 );
const { width } = useDisplay();
const compactButtonLabels = computed( () => width.value <= 700 );

function buildDeck(): string[] {
	const ranks = [ "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A" ];
	const suits: SuitChar[] = [ "s", "h", "d", "c" ];
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

function localizedSuit( s: SuitChar ): string {
	switch ( s ) {
		case "s": return t( "cards.suits.spades" );
		case "h": return t( "cards.suits.hearts" );
		case "d": return t( "cards.suits.diamonds" );
		case "c": return t( "cards.suits.clubs" );
	}
}

function rankToDisplay( r: string ): number | string {
	if ( r === "T" ) {
		return 10;
	}

	if ( r === "J" ) {
		return t( "cards.ranks.jack" );
	}

	if ( r === "Q" ) {
		return t( "cards.ranks.queen" );
	}

	if ( r === "K" ) {
		return t( "cards.ranks.king" );
	}

	if ( r === "A" ) {
		return t( "cards.ranks.ace" );
	}

	return Number( r );
}

function parseCard( code: string ) {
	const r = code[ 0 ];
	const s = code[ 1 ] as SuitChar;
	return {
		code,
		suit: localizedSuit( s ),
		rank: rankToDisplay( r )
	};
}

const cards = computed( () => handCodes.value.map( parseCard ) );
const canRemoveCard = computed( () => handCodes.value.length === 5 );
const missingToFive = computed( () => Math.max( 0, 5 - handCodes.value.length ) );
const remainingDeckCount = computed( () => 52 - handCodes.value.length );
const completionOptionsCards = computed( () =>
	bestCompletionOptions.value.map( ( option ) => option.map( parseCard ) ) );

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
	const favorable = bestCompletionOptions.value.length;

	if ( missing <= 0 || favorable <= 0 ) {
		return null;
	}

	const denominator = nChooseK( remaining, missing );

	if ( denominator <= 0 ) {
		return null;
	}

	return favorable / denominator;
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
	const favorable = bestCompletionOptions.value.length;
	const denominator = nChooseK( n, k );
	const denominatorText = Math.round( denominator ).toString();
	const percent = p * 100;
	const percentDigits = percent >= 1 ? 2 : percent >= 0.1 ? 3 : 4;
	const percentText = toTexNumber( percent, percentDigits );
	const lhs = locale.value === "de" ?
		String.raw`P(\text{optimale Ergänzung})` :
		String.raw`P(\text{optimal completion})`;
	const rhs = String.raw`\frac{${favorable}}{\binom{${n}}{${k}}}` +
		String.raw`=\frac{${favorable}}{${denominatorText}}\approx ${percentText}\%`;
	return `${lhs}=${rhs}`;
} );

function evaluateWithPokerSolver( current: string[] ) {
	const deck = buildDeck();
	const remaining = deck.filter( ( c ) => !current.includes( c ) );
	const missing = 5 - current.length;

	if ( missing <= 0 ) {
		bestCompletionOptions.value = [];
		solved.value = Hand.solve( current.slice( 0, 5 ) );
		note.value = t( "game.fullDeckNote" );
		return;
	}

	let bestHand: any | null = null;
	let bestOptionsLocal: string[][] = [];

	const compare = ( candidate: any, incumbent: any | null ): "better" | "tie" | "worse" => {
		if ( !incumbent ) {
			return "better";
		}

		const winners = Hand.winners( [ candidate, incumbent ] );

		if ( winners.length === 1 && winners[ 0 ] === candidate ) {
			return "better";
		}

		if ( winners.includes( candidate ) && winners.includes( incumbent ) ) {
			return "tie";
		}

		return "worse";
	};

	if ( missing === 1 ) {
		for ( const c1 of remaining ) {
			const additions = [ c1 ];
			const codes = [ ...current, ...additions ];
			const h = Hand.solve( codes );
			const relation = compare( h, bestHand );

			if ( relation === "better" ) {
				bestHand = h;
				bestOptionsLocal = [ additions ];
			} else if ( relation === "tie" ) {
				bestOptionsLocal.push( additions );
			}
		}
	} else if ( missing === 2 ) {
		for ( let i = 0; i < remaining.length - 1; i++ ) {
			for ( let j = i + 1; j < remaining.length; j++ ) {
				const additions = [ remaining[ i ], remaining[ j ] ];
				const codes = [ ...current, ...additions ];
				const h = Hand.solve( codes );
				const relation = compare( h, bestHand );

				if ( relation === "better" ) {
					bestHand = h;
					bestOptionsLocal = [ additions ];
				} else if ( relation === "tie" ) {
					bestOptionsLocal.push( additions );
				}
			}
		}
	} else {
		bestHand = null;
		bestOptionsLocal = [];
	}

	bestCompletionOptions.value = bestOptionsLocal;
	solved.value = bestHand;
	note.value = t( "game.partialDeckNote", {
		count: current.length,
		missing
	} );
}

function newRandomHand( size: 3 | 4 | 5 = selectedHandSize.value ) {
	selectedHandSize.value = size;
	const deck = shuffle( buildDeck() );
	const hand = deck.slice( 0, size );
	handCodes.value = hand;
	evaluateWithPokerSolver( hand );
}

function removeCardAt( index: number ) {
	if ( !canRemoveCard.value ) {
		return;
	}

	const next = handCodes.value.filter( ( _, idx ) => idx !== index );
	handCodes.value = next;
	selectedHandSize.value = 4;
	evaluateWithPokerSolver( next );
}

function addCompletionCard( code: string ) {
	if ( handCodes.value.length >= 5 || handCodes.value.includes( code ) ) {
		return;
	}

	const next = [ ...handCodes.value, code ];
	handCodes.value = next;
	selectedHandSize.value = Math.min( 5, next.length ) as 3 | 4 | 5;
	evaluateWithPokerSolver( next );
}

const resultTitle = computed( () => {
	if ( !solved.value ) {
		return t( "game.noResult" );
	}

	const labels = tm( "solver.names" ) as Record<string, string> | undefined;
	return labels?.[ solved.value.name ] ?? solved.value.name ?? t( "game.result" );
} );

const resultDescr = computed( () => {
	if ( !solved.value ) {
		return "";
	}

	return translateSolverDescr( solved.value.descr ?? "" );
} );

function translateSolverDescr( descr: string ) {
	if ( !descr || locale.value === "en" ) {
		return descr;
	}

	const names = tm( "solver.names" ) as Record<string, string> | undefined;
	const ranks = tm( "solver.ranks" ) as Record<string, string> | undefined;

	const rankLabel = ( raw: string ) => {
		const cleaned = raw.replace( /[^0-9AJQKT]/gi, "" ).toUpperCase();
		return ranks?.[ cleaned ] ?? cleaned;
	};

	let match = descr.match( /^([A-Za-z ]+), ([0-9AJQKT]+)'s & ([0-9AJQKT]+)'s$/ );

	if ( match ) {
		return `${names?.[ match[ 1 ] ] ?? match[ 1 ]}, ${rankLabel( match[ 2 ] )}er und ${rankLabel( match[ 3 ] )}er`;
	}

	match = descr.match( /^([A-Za-z ]+), ([0-9AJQKT]+)'s over ([0-9AJQKT]+)'s$/ );

	if ( match ) {
		return `${names?.[ match[ 1 ] ] ?? match[ 1 ]}, ${rankLabel( match[ 2 ] )}er über ${rankLabel( match[ 3 ] )}er`;
	}

	match = descr.match( /^([A-Za-z ]+), ([0-9AJQKT]+)'s$/ );

	if ( match ) {
		return `${names?.[ match[ 1 ] ] ?? match[ 1 ]}, ${rankLabel( match[ 2 ] )}er`;
	}

	match = descr.match( /^([A-Za-z ]+), ([0-9AJQKT]+)[shdc]? High$/i );

	if ( match ) {
		return `${names?.[ match[ 1 ] ] ?? match[ 1 ]}, ${rankLabel( match[ 2 ] )} hoch`;
	}

	match = descr.match( /^([0-9AJQKT]+)[shdc]? High$/i );

	if ( match ) {
		return `${rankLabel( match[ 1 ] )} hoch`;
	}

	if ( descr === "Straight, Wheel" ) {
		return t( "solver.wheel" );
	}

	return names?.[ descr ] ?? descr;
}

onMounted( () => {
	newRandomHand( selectedHandSize.value );
} );
</script>

<style scoped>
.completionMiniCards {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	vertical-align: middle;
}

.completionMiniCard {
	cursor: pointer;
}

.completionOptions {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	flex-wrap: wrap;
}

.completionOr {
	font-weight: 600;
}
</style>
