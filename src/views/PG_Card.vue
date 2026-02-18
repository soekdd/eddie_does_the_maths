<!-- PokerCard.vue -->
<template>
<v-card class="poker-card"
	:class="{
		red: isRed,
		mini: props.mini
	}"
	elevation="6"
	:style="cardStyle"
>
	<div v-if="props.mini" class="miniContent">
		<div class="miniRank">{{ rankText }}</div>
		<span class="miniSuit">{{ suitIcon }}</span>
	</div>

	<template v-else>
		<!-- Ecke oben links -->
		<div class="corner tl">
			<div class="rank">{{ rankText }}</div>
			<span class="suit">{{ suitIcon }}</span>
		</div>

		<!-- Mitte -->
		<div class="center">
			<img
				v-if="centerFigureSrc"
				:alt="centerFigureAlt"
				class="centerFigure"
				:src="centerFigureSrc"
			/>
			<span v-else class="centerSuit">{{ suitIcon }}</span>
		</div>

		<!-- Ecke unten rechts (um 180° gedreht) -->
		<div class="corner br">
			<div class="rank">{{ rankText }}</div>
			<span class="suit">{{ suitIcon }}</span>
		</div>
	</template>
</v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";

type Rank = number | string;

const props = withDefaults( defineProps<{
    /** "Pik|Herz|Karo|Kreuz" (auch: "spades|hearts|diamonds|clubs") */
    suit: string;
    /** 2–10 oder "Bube|Dame|König|Ass" (auch: "J|Q|K|A") */
    rank: Rank;
    /** Rotation in Grad (z.B. -12 … +12) */
    rotation?: number;
    /** Mini-Karte: nur Wertung + Symbol nebeneinander */
    mini?: boolean;
  }>(),
{
	rotation: 0,
	mini:     false
} );

const normSuit = computed( () => {
	const s = ( props.suit ?? "" ).toLowerCase().trim();

	if ( [ "pik", "piek", "spade", "spades", "♠" ].includes( s ) ) {
		return "pik";
	}

	if ( [ "herz", "heart", "hearts", "♥" ].includes( s ) ) {
		return "herz";
	}

	if ( [ "karo", "diamond", "diamonds", "♦" ].includes( s ) ) {
		return "karo";
	}

	if ( [ "kreuz", "club", "clubs", "♣" ].includes( s ) ) {
		return "kreuz";
	}

	return "pik";
} );

const isRed = computed( () => [ "herz", "karo" ].includes( normSuit.value ) );

const suitIcon = computed( () => {
	switch ( normSuit.value ) {
		case "herz":
			return "♥";
		case "karo":
			return "♦";
		case "kreuz":
			return "♣";
		default:
			return "♠";
	}
} );

const suitAssetCode = computed( () => {
	switch ( normSuit.value ) {
		case "herz":
			return "H";
		case "karo":
			return "C";
		case "kreuz":
			return "K";
		default:
			return "P";
	}
} );

const rankText = computed( () => {
	const r = props.rank;

	if ( typeof r === "number" ) {
		return String( r );
	}

	const s = ( r ?? "" ).toString().trim()
		.toLowerCase();

	// Deutsch
	if ( [ "bube" ].includes( s ) ) {
		return "B";
	}

	if ( [ "dame" ].includes( s ) ) {
		return "D";
	}

	if ( [ "könig", "koenig" ].includes( s ) ) {
		return "K";
	}

	if ( [ "ass" ].includes( s ) ) {
		return "A";
	}

	// International / Kurzformen
	if ( [ "j" ].includes( s ) ) {
		return "B";
	}

	if ( [ "q" ].includes( s ) ) {
		return "D";
	}

	if ( [ "k" ].includes( s ) ) {
		return "K";
	}

	if ( [ "a" ].includes( s ) ) {
		return "A";
	}

	// "7", "10", ...
	return ( r ?? "" ).toString();
} );

const figureRankAssetCode = computed( () => {
	switch ( rankText.value ) {
		case "B":
			return "B";
		case "D":
			return "Q";
		case "K":
			return "K";
		default:
			return "";
	}
} );

const figureImages = import.meta.glob( "../images/PG_Card_*.webp",
	{
		eager:  true,
		import: "default"
	} ) as Record<string, string>;

const centerFigureSrc = computed( () => {
	if ( !figureRankAssetCode.value ) {
		return "";
	}

	const imagePath = `../images/PG_Card_${suitAssetCode.value}${figureRankAssetCode.value}.webp`;

	return figureImages[ imagePath ] ?? "";
} );

const centerFigureAlt = computed( () => `Bildkarte ${rankText.value}${suitIcon.value}` );

const cardStyle = computed( () => ( { transform: `rotate(${props.rotation ?? 0}deg)` } ) );
</script>


<style scoped>
.poker-card {
  width: 120px;
  aspect-ratio: 2.5 / 3.5;
  border-radius: 14px;
  position: relative;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.12);

  /* Für “Fächer in der Hand” wirkt bottom-center meist natürlicher */
  transform-origin: 50% 100%;

  /* Standardfarbe (Pik/Kreuz) */
  color: #1b1b1b;
}

.poker-card.red {
  color: #c62828; /* Herz/Karo */
}

.poker-card.mini {
  width: 30px;
  height: 40px;
  margin-top:-10px;
  aspect-ratio: auto;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: 50% 50%;
}

.miniContent {
  display: flex;
  align-items: center;
  gap: 1px;
  font-weight: 800;
  user-select: none;
}

.miniRank {
  font-size: 19px;
  line-height: 1;
}

.miniSuit {
  font-size: 18px;
  line-height: 1;
  font-family:
    "Noto Sans Symbols 2",
    "Segoe UI Symbol",
    "Apple Symbols",
    sans-serif;
}

.corner {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-weight: 800;
  user-select: none;
}

.corner.tl {
  top: 8px;
  left: 8px;
}

.corner.br {
  bottom: 8px;
  right: 8px;
  transform: rotate(180deg);
}

.rank {
  font-size: 18px;
  line-height: 1;
}

.suit {
  font-size: 14px;
  line-height: 1;
  font-family:
    "Noto Sans Symbols 2",
    "Segoe UI Symbol",
    "Apple Symbols",
    sans-serif;
}

.center {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.centerSuit {
  font-size: 64px;
  line-height: 1;
  opacity: 0.9;
  font-family:
    "Noto Sans Symbols 2",
    "Segoe UI Symbol",
    "Apple Symbols",
    sans-serif;
}

.centerFigure {
  width: 90%;
  height: auto;
  object-fit: contain;
}
</style>
