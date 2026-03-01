<template>
<div class="sePrimeWrap">
	<div class="sePrimeStage"
		role="button"
		tabindex="0"
		@click="next"
		@keydown.enter.prevent="next"
		@keydown.space.prevent="next"
	>
		<div class="primeDigits">
			<v-icon
				v-for="(d, i) in digits"
				:key="`${prime}-${i}`"
				class="digitIcon"
				:icon="digitIcon(d)"
				:size="iconSize"
			/>
		</div>

		<!-- optional: winziges Label unten -->
		<div class="primeMeta mono">
			Primzahl #{{ primeIndex }}
		</div>

		<div class="primeHint muted">Klick (oder Enter/Space)</div>
	</div>
</div>
</template>

<script setup>
import { computed, ref } from "vue";
import {
	mdiNumeric0Box,
	mdiNumeric1Box,
	mdiNumeric2Box,
	mdiNumeric3Box,
	mdiNumeric4Box,
	mdiNumeric5Box,
	mdiNumeric6Box,
	mdiNumeric7Box,
	mdiNumeric8Box,
	mdiNumeric9Box
} from "@mdi/js";

/**
 * Interaktive Primzahlen-Anzeige:
 * Start bei 2, jeder Klick -> nächste Primzahl.
 * Darstellung: Ziffern als MDI "Numeric Box" Icons.
 */

const iconMap = {
	0: mdiNumeric0Box,
	1: mdiNumeric1Box,
	2: mdiNumeric2Box,
	3: mdiNumeric3Box,
	4: mdiNumeric4Box,
	5: mdiNumeric5Box,
	6: mdiNumeric6Box,
	7: mdiNumeric7Box,
	8: mdiNumeric8Box,
	9: mdiNumeric9Box
};

const prime = ref( 2 );
const primeIndex = ref( 1 ); // 2 ist die 1. Primzahl
const iconSize = ref( 90 ); // groß & zentriert (anpassbar)

const digits = computed( () => String( prime.value ).split( "" ) );

function digitIcon( d ) {
	return iconMap[ d ] ?? mdiNumeric0Box;
}

function isPrime( n ) {
	if ( n < 2 ) {
		return false;
	}

	if ( n === 2 ) {
		return true;
	}

	if ( n % 2 === 0 ) {
		return false;
	}

	// trial division bis sqrt(n)
	const limit = Math.floor( Math.sqrt( n ) );

	for ( let i = 3; i <= limit; i += 2 ) {
		if ( n % i === 0 ) {
			return false;
		}
	}

	return true;
}

function nextPrime( after ) {
	let n = after + 1;

	if ( n <= 2 ) {
		return 2;
	}

	// ab 3 nur ungerade testen
	if ( n % 2 === 0 ) {
		n += 1;
	}

	while ( !isPrime( n ) ) {
		n += 2;
	}

	return n;
}

function next() {
	prime.value = nextPrime( prime.value );
	primeIndex.value += 1;
}
</script>

<style scoped>
.sePrimeWrap {
	display: flex;
	justify-content: center;
}

.sePrimeStage {
	width: min(100%, 520px);
	min-height: 260px;

	display: grid;
	place-items: center;

	border: 1px solid rgba(var(--v-theme-on-surface), 0.2);
	border-radius: 14px;
	background: rgba(var(--v-theme-surface), 0.85);

	cursor: pointer;
	user-select: none;
	position: relative;

	padding: 18px 14px;
}

.primeDigits {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	flex-wrap: wrap;
}

.digitIcon {
	/* v-icon ist inline-flex; das hilft beim optischen Zentrieren */
	display: inline-flex;
	margin:-15px;
}

.primeMeta {
	position: absolute;
	left: 14px;
	bottom: 12px;
	font-size: 0.9rem;
	color: rgba(var(--v-theme-on-surface), 0.7);
}

.primeHint {
	position: absolute;
	right: 14px;
	bottom: 12px;
	font-size: 0.9rem;
}

.mono {
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>