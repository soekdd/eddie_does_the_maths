<template>
<div class="handStage">
	<div class="hand">
		<div
			v-for="(c, idx) in cards"
			:key="c.code"
			class="cardWrap"
			:class="{ hovered: hoveredCardIndex === idx, removable: canRemoveCard }"
			:style="pose(idx, cards.length).wrapper"
			@click="onCardClick( idx )"
			@mouseenter="hoveredCardIndex = idx"
			@mouseleave="hoveredCardIndex = null"
		>
			<div class="cardHoverShell">
				<PokerCard
					:rank="c.rank"
					:rotation="pose(idx, cards.length).rotation"
					:suit="c.suit"
				/>
			</div>
		</div>
	</div>
</div>
</template>

<script setup lang="ts">
import type { CSSProperties } from "vue";
import { ref } from "vue";
import PokerCard from "./PG_Card.vue";

type HandCard = {
	code: string;
	suit: string;
	rank: number | string;
};

const props = withDefaults( defineProps<{
	cards: HandCard[];
	canRemoveCard?: boolean;
}>(), {
	canRemoveCard: false
} );

const emit = defineEmits<{
	( e: "remove-card", index: number ): void;
}>();

const hoveredCardIndex = ref<number | null>( null );

function onCardClick( index: number ) {
	if ( !props.canRemoveCard ) {
		return;
	}

	emit( "remove-card", index );
}

function pose( i: number, n: number ) {
	const mid = ( n - 1 ) / 2;
	const spread = 9; // Grad pro Schritt
	const xStep = 34; // Pixel pro Schritt
	const yStep = 6; // leichte Bogenform
	const dx = ( i - mid ) * xStep;
	const dy = Math.abs( i - mid ) * yStep;
	const rot = ( i - mid ) * spread;
	const isHovered = hoveredCardIndex.value === i;
	return {
		wrapper: {
			transform: `translateX(calc(-50% + ${dx}px)) translateY(${dy}px)`,
			zIndex:    isHovered ? 1000 + n : 100 + i
		} as CSSProperties,
		rotation: rot
	};
}
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

.cardWrap.removable {
  cursor: pointer;
}

.cardHoverShell {
  transform-origin: 50% 100%;
  transition: transform 160ms ease, filter 160ms ease;
}

.cardWrap.hovered .cardHoverShell {
  transform: scale(1.08);
  filter: drop-shadow(0 10px 16px rgba(0, 0, 0, 0.32));
}
</style>
