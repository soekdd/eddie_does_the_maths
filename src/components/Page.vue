<!-- BookPageCard.vue -->
<template>
<div class="book-page-card" :style="cssVars">
	<!-- Andeutung der geöffneten linken Seite -->
	<div aria-hidden="true" class="book-page-card__left-page-hint" />

	<!-- Sichtbare Kanten der darunterliegenden Seiten (rechts) -->
	<div aria-hidden="true" class="book-page-card__stack" />

	<!-- Rechte Buchseite -->
	<div class="book-page-card__paper">
		<!-- Dezenter Rahmen / Papier-Highlights -->
		<svg
			aria-hidden="true"
			class="book-page-card__svg"
			preserveAspectRatio="none"
			viewBox="0 0 100 100"
		>
			<rect
				fill="none"
				height="97.6"
				rx="4.2"
				ry="4.2"
				stroke="rgba(110, 92, 65, 0.18)"
				stroke-width="0.6"
				width="97.6"
				x="1.2"
				y="1.2"
			/>
			<path
				d="M18,6 C50,2 82,3 94,7"
				fill="none"
				stroke="rgba(255,255,255,0.28)"
				stroke-width="0.8"
			/>
			<path
				d="M18,94 C50,98 82,97 94,93"
				fill="none"
				stroke="rgba(255,255,255,0.22)"
				stroke-width="0.8"
			/>
			<path
				d="M90,7 C95,26 95,74 90,93"
				fill="none"
				stroke="rgba(255,255,255,0.16)"
				stroke-width="0.7"
			/>
		</svg>

		<!-- Buchknick-Schatten / Lichtkante -->
		<div aria-hidden="true" class="book-page-card__fold" />

		<!-- Reservierte Knick-Spalte + Inhalt -->
		<div class="book-page-card__layout">
			<div aria-hidden="true" class="book-page-card__gutter-space" />
			<div class="book-page-card__content">
				<slot />
			</div>
		</div>
	</div>
</div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults( defineProps<{
    padding?: string;
    radius?: number;
    stackWidth?: number;
    gutterSpace?: number; // reservierter Bereich links (kein Slot-Inhalt)
  }>(),
{
	padding:     "20px 22px",
	radius:      18,
	stackWidth:  14,
	gutterSpace: 36
} );

const cssVars = computed( () => ( {
	"--bpc-padding":      props.padding,
	"--bpc-radius":       `${props.radius}px`,
	"--bpc-stack-width":  `${props.stackWidth}px`,
	"--bpc-gutter-space": `${props.gutterSpace}px`
} ) );
</script>

<style scoped>
.book-page-card {
  position: relative;
  display: block;
  box-sizing: border-box;
  isolation: isolate;

  /* Platz rechts für sichtbare Seitenkanten */
  padding-right: calc(var(--bpc-stack-width) + 3px);

  /* links darf die angedeutete Gegenseite leicht herausragen */
  margin-left: 10px;
}

/* Andeutung der geöffneten linken Seite */
.book-page-card__left-page-hint {
  position: absolute;
  left: -14px;
  top: 8px;
  bottom: 8px;
  width: calc(var(--bpc-gutter-space) + 10px);
  z-index: 0;
  pointer-events: none;

  border-radius: 12px 0 0 12px;

  background:
    radial-gradient(
      95% 120% at 100% 50%,
      rgba(0, 0, 0, 0.16) 0%,
      rgba(0, 0, 0, 0.08) 22%,
      rgba(0, 0, 0, 0.00) 62%
    ),
    linear-gradient(
      to right,
      rgba(255, 255, 255, 0.24) 0%,
      rgba(255, 255, 255, 0.10) 35%,
      rgba(255, 255, 255, 0.00) 100%
    ),
    linear-gradient(to bottom, #fbf8ef, #f4efdf);

  box-shadow:
    -3px 2px 8px rgba(0, 0, 0, 0.05),
    inset 1px 0 0 rgba(255, 255, 255, 0.35);

  transform: perspective(240px) rotateY(12deg);
  transform-origin: right center;
  opacity: 0.9;
}

/* Unterliegende Seiten rechts */
.book-page-card__stack {
  position: absolute;
  top: 6px;
  right: 0;
  bottom: 6px;
  width: var(--bpc-stack-width);
  border-radius: 0 12px 12px 0;
  z-index: 0;
  pointer-events: none;

  background:
    linear-gradient(to left, rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0) 75%),
    repeating-linear-gradient(
      to bottom,
      rgba(210, 198, 170, 0.96) 0px,
      rgba(248, 244, 232, 0.96) 2px,
      rgba(202, 190, 164, 0.96) 3px,
      rgba(252, 250, 243, 0.96) 5px
    );

  box-shadow:
    inset 1px 0 0 rgba(255, 255, 255, 0.45),
    inset -1px 0 0 rgba(110, 95, 70, 0.10);

  transform: translateX(1px);
}

.book-page-card__stack::before,
.book-page-card__stack::after {
  content: "";
  position: absolute;
  top: 3px;
  bottom: 3px;
  border-radius: 0 10px 10px 0;
  background:
    linear-gradient(to left, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0) 75%),
    repeating-linear-gradient(
      to bottom,
      rgba(215, 205, 180, 0.90) 0px,
      rgba(250, 247, 237, 0.90) 2px,
      rgba(203, 193, 170, 0.90) 3px,
      rgba(252, 250, 245, 0.90) 5px
    );
}
.book-page-card__stack::before {
  right: 3px;
  width: calc(var(--bpc-stack-width) - 4px);
  opacity: 0.95;
}
.book-page-card__stack::after {
  right: 6px;
  width: calc(var(--bpc-stack-width) - 7px);
  opacity: 0.88;
}

/* Hauptseite (rechte Buchseite) */
.book-page-card__paper {
  position: relative;
  z-index: 1;
  min-height: 32px;
  overflow: hidden;

  border-radius:
    var(--bpc-radius)
    calc(var(--bpc-radius) + 6px)
    calc(var(--bpc-radius) + 8px)
    var(--bpc-radius);

  /* Wichtig: rechte Seite bleibt hell */
  background:
    radial-gradient(140% 95% at 84% 48%, rgba(255, 255, 255, 0.74), rgba(255, 255, 255, 0) 60%),
    linear-gradient(to bottom, #fffef9 0%, #fbf6ea 100%);

  border: 1px solid rgba(110, 92, 65, 0.12);

  box-shadow:
    0 10px 22px rgba(0, 0, 0, 0.10),
    0 2px 5px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.75),
    inset -8px 0 14px rgba(120, 100, 70, 0.05);
}

.book-page-card__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

/* Buchknick: schmaler dunkler Kern + Aufhellung, ohne die Seite "totzudunkeln" */
.book-page-card__fold {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: calc(var(--bpc-gutter-space) + 8px);
  z-index: 2;
  pointer-events: none;

  background:
    /* weiche Falte (sehr lokal) */
    radial-gradient(
      115% 90% at 0% 50%,
      rgba(0, 0, 0, 0.20) 0%,
      rgba(0, 0, 0, 0.10) 16%,
      rgba(0, 0, 0, 0.04) 34%,
      rgba(0, 0, 0, 0.00) 56%
    ),
    /* zusätzliche weiche lineare Falte */
    linear-gradient(
      to right,
      rgba(0, 0, 0, 0.15) 0px,
      rgba(0, 0, 0, 0.07) 8px,
      rgba(0, 0, 0, 0.00) 18px
    );
}

.book-page-card__fold::before {
  /* dunkler Knick-Kern */
  content: "";
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 1px;
  width: 2px;
  border-radius: 2px;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.10),
    rgba(0, 0, 0, 0.26),
    rgba(0, 0, 0, 0.10)
  );
  opacity: 0.9;
}

.book-page-card__fold::after {
  /* Lichtkante rechts neben dem Knick */
  content: "";
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 7px;
  width: 1px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.00),
    rgba(255, 255, 255, 0.45),
    rgba(255, 255, 255, 0.00)
  );
  opacity: 0.95;
}

/* Layout: links reservierte Knick-Spalte, rechts Slot-Inhalt */
.book-page-card__layout {
  position: relative;
  z-index: 3;
  display: grid;
  grid-template-columns: var(--bpc-gutter-space) minmax(0, 1fr);
  min-height: 100%;
}

.book-page-card__gutter-space {
  pointer-events: none;
}

.book-page-card__content {
  min-width: 0;
  padding: var(--bpc-padding);
  color: inherit;
}
</style>