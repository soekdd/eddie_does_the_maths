<template>
<main aria-label="Poker cards PDF sheet" class="cardsPdf">
	<section
		v-for="( sheet, sheetIndex ) in sheets"
		:key="`sheet-${sheetIndex}`"
		class="sheet"
	>
		<div
			v-for="card in sheet"
			:key="card.key"
			class="cardSlot"
		>
			<PokerCard
				v-if="!card.blank"
				class="printCard"
				:rank="card.rank"
				:suit="card.suit"
			/>
			<div
				v-else
				aria-hidden="true"
				class="printCard blankCard"
			/>
		</div>
	</section>
</main>
</template>

<script setup>
import {
	computed,
	nextTick,
	onMounted
} from "vue";
import { i18nApi } from "@/utils/i18n.mjs";
import PokerCard from "./PG_Card.vue";

const suits = [ "pik", "herz", "karo", "kreuz" ];
const ranks = [ "A", "K", "Q", "J", 10, 9, 8, 7, 6, 5, 4, 3, 2 ];
const cardsPerSheet = 1;

const params = new URLSearchParams( window.location.search );
const locale = params.get( "locale" );

if ( locale ) {
	i18nApi.setLocale( locale );
}

const cards = suits.flatMap( ( suit ) => ranks.map( ( rank ) => ( {
	key: `${suit}-${rank}`,
	suit,
	rank
} ) ) );

const blankCards = Array.from( { length: 3 },
	( _, index ) => ( {
		key:   `blank-${index}`,
		blank: true
	} ) );

const pdfCards = [
	...cards,
	...blankCards
];

const sheets = computed( () => Array.from( { length: Math.ceil( pdfCards.length / cardsPerSheet ) },
	( _,
		index ) => pdfCards.slice( index * cardsPerSheet,
		( index + 1 ) * cardsPerSheet ) ) );

onMounted( async() => {
	await nextTick();
	await document.fonts?.ready;

	await Promise.all( Array.from( document.images )
		.map( ( image ) => {
			if ( image.complete ) {
				return Promise.resolve();
			}

			return new Promise( ( resolve ) => {
				image.addEventListener(
					"load", resolve, { once: true }
				);
				image.addEventListener(
					"error", resolve, { once: true }
				);
			} );
		} ) );

	window.__PG_CARDS_READY__ = true;
} );
</script>

<style scoped>
@page {
	size: 65mm 97mm;
	margin: 0;
}

:global(html),
:global(body),
:global(#app) {
	margin: 0;
	min-height: 100%;
	background: #fff;
}

:global(*) {
	box-sizing: border-box;
	-webkit-print-color-adjust: exact;
	print-color-adjust: exact;
}

.cardsPdf {
	background: #fff;
	color: #111;
}

.sheet {
	width: 65mm;
	height: 97mm;
	display: grid;
	grid-template-columns: 65mm;
	grid-auto-rows: 97mm;
	align-content: center;
	justify-content: center;
	page-break-after: always;
	break-after: page;
}

.sheet:last-child {
	page-break-after: auto;
	break-after: auto;
}

.cardSlot {
	width: 65mm;
	height: 97mm;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
}

:deep(.printCard.poker-card) {
	width: 51mm !important;
	height: 83mm !important;
	aspect-ratio: auto !important;
	border-radius: 4mm;
	box-shadow: none !important;
}

.blankCard {
	width: 51mm;
	height: 83mm;
	background: #fff;
	border: 1px solid rgba(0, 0, 0, 0.12);
	border-radius: 4mm;
}

:deep(.printCard .corner.tl) {
	top: 8mm;
	left: 8mm;
	transform: scale(1.2);
	transform-origin: center;
}

:deep(.printCard .corner.br) {
	right: 8mm;
	bottom: 8mm;
	transform: rotate(180deg) scale(1.2);
	transform-origin: center;
}

:deep(.printCard .rank) {
	font-size: 7mm;
}

:deep(.printCard .suit) {
	font-size: 8.5mm;
}

:deep(.printCard .centerSuit) {
	font-size: 28mm;
	transform: scale(1.2);
	transform-origin: center;
}

:deep(.printCard .centerFigure) {
	width: auto !important;
	height: 70% !important;
	max-width: none !important;
}

:deep(.printCard .centerPips) {
	width: 19mm;
	transform: scale(1.2);
	transform-origin: center;
}

:deep(.printCard .pip) {
	font-size: 10mm;
}

:deep(.printCard .pipRow.count-1) {
	margin: -4mm 0;
}

:deep(.printCard .pipRow.count-small2) {
	margin: 5mm 0;
}

:deep(.printCard .aceLabel) {
	top: 10mm;
	max-width: 32mm;
	font-size: 3.4mm;
	transform: translateX(-50%) scale(1.2);
	transform-origin: center;
}

:deep(.printCard .aceLabelBottom) {
	top: auto;
	bottom: 10mm;
	transform: translateX(-50%) rotate(180deg) scale(1.2);
}
</style>
