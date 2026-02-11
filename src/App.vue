<script setup>
import { computed, useSlots } from "vue";
import { useDisplay } from "vuetify";

const props = defineProps( {
	// Show a "work in progress" banner for content that isn't finished yet.
	// Usage:
	// - <AppFrame warning> ... </AppFrame> (default text)
	// - <AppFrame warning="Custom text"> ... </AppFrame>
	warning: { type: [ Boolean, String ], default: false }
} );

const { width } = useDisplay();
const slots = useSlots();

// Vuetify's built-in "mobile" flag defaults to < lg (1280px), which is too wide for our
// header-wrapping case. Match the app's existing "mobile-ish" breakpoint (see eddie.css).
const isMobile = computed( () => width.value < 860 );
const appBarHeight = computed( () => isMobile.value ? 108 : 72 );

const warningMessage = computed( () => {
	if ( props.warning === true ) {
		return "Hinweis: An diesem Inhalt wird noch gearbeitet. " +
			"Texte, Grafiken und Rechenwege können sich noch ändern.";
	}

	if ( typeof props.warning === "string" ) {
		return props.warning.trim();
	}

	return "";
} );

const showWarning = computed( () => Boolean( warningMessage.value ) );
const hasInteractivePart = computed( () => Boolean( slots.interactivePart ) );
const hasCalculationPart = computed( () => Boolean( slots.calculationPart ) );
const showPartsCard = computed( () => hasInteractivePart.value || hasCalculationPart.value );
</script>

<template>
<div class="frame">
	<v-app-bar class="topBar" flat :height="appBarHeight">
		<v-container class="wrap">
			<router-link class="brandLink" to="/">
				<div class="brand">
					<slot name="title" />
				</div>
			</router-link>
		</v-container>
	</v-app-bar>

	<v-main>
		<v-container class="wrap mainWrap">
			<v-alert
				v-if="showWarning"
				border="start"
				class="wipAlert"
				:density="isMobile ? 'compact' : 'comfortable'"
				type="warning"
				variant="tonal"
			>
				{{ warningMessage }}
			</v-alert>

			<section class="card">
				<slot name="descriptionPart" />
			</section>

			<section v-if="showPartsCard" class="card">
				<v-row class="gridRow" dense>
					<v-col
						v-if="hasInteractivePart"
						cols="12"
						:md="hasCalculationPart ? 5 : 12"
					>
						<slot name="interactivePart" />
					</v-col>
					<v-col
						v-if="hasCalculationPart"
						cols="12"
						:md="hasInteractivePart ? 7 : 12"
					>
						<slot name="calculationPart" />
					</v-col>
				</v-row>
			</section>

			<footer class="foot">
				<slot name="footer" />
			</footer>
		</v-container>
	</v-main>
</div>
</template>

<style scoped>
.wipAlert {
  margin-top: 16px;
}
</style>
