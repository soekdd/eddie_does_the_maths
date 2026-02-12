<script setup>
import {
	computed, onMounted, ref, useSlots
} from "vue";
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import impressumHtml from "./utils/disclaimer/impressum_de.html?raw";
import privacyPolicyHtml from "./utils/disclaimer/privacy_policy_de.html?raw";
import faviconPng from "./images/favicon.png";

const props = defineProps( {
	// Show a "work in progress" banner for content that isn't finished yet.
	// Usage:
	// - <AppFrame warning> ... </AppFrame> (default text)
	// - <AppFrame warning="Custom text"> ... </AppFrame>
	warning: { type: [ Boolean, String ], default: false }
} );

const { width } = useDisplay();
const slots = useSlots();
const route = useRoute();

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
const showImpressumDialog = ref( false );
const showPrivacyDialog = ref( false );
const showHomeBadge = computed( () => route.path !== "/" );

onMounted( () => {
	window.scrollTo( {
		top:      0,
		left:     0,
		behavior: "auto"
	} );
} );
</script>

<template>
<div class="frame">
	<v-app-bar class="topBar pa-0" flat :height="appBarHeight">
		<v-container class="wrap pa-0">
			<div class="brand">
				<router-link
					v-if="showHomeBadge"
					aria-label="Home"
					class="homeBadgeLink badge"
					title="Home"
					to="/"
				>
					<img alt="" class="homeBadgeIcon" :src="faviconPng" />
				</router-link>
				<slot name="title" />
			</div>
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
				<div class="legalRow">
					<button
						class="legalLink"
						type="button"
						@click="showImpressumDialog = true"
					>
						Impressum
					</button>
					<span class="legalSep">·</span>
					<button
						class="legalLink"
						type="button"
						@click="showPrivacyDialog = true"
					>
						Datenschutzerklärung
					</button>
				</div>
			</footer>
		</v-container>
	</v-main>

	<v-dialog v-model="showImpressumDialog" max-width="900" scrollable>
		<v-card>
			<v-card-title class="text-h6">Impressum</v-card-title>
			<v-card-text class="legalContent" v-html="impressumHtml" />
			<v-card-actions>
				<v-spacer />
				<v-btn variant="text" @click="showImpressumDialog = false">
					Schließen
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>

	<v-dialog v-model="showPrivacyDialog" max-width="900" scrollable>
		<v-card>
			<v-card-title class="text-h6">Datenschutzerklärung</v-card-title>
			<v-card-text class="legalContent" v-html="privacyPolicyHtml" />
			<v-card-actions>
				<v-spacer />
				<v-btn variant="text" @click="showPrivacyDialog = false">
					Schließen
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</div>
</template>

<style scoped>
.wipAlert {
  margin-top: 16px;
}

.legalRow {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
}

.legalLink {
  border: 0;
  background: transparent;
  padding: 0;
  font: inherit;
  color: inherit;
  text-decoration: underline;
  cursor: pointer;
}

.legalSep {
  opacity: 0.6;
}

.legalContent {
  max-height: 60vh;
}

.legalContent :deep(h3) {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.legalContent :deep(p),
.legalContent :deep(address),
.legalContent :deep(ul) {
  margin-bottom: 0.75rem;
}

.homeBadgeLink {
  text-decoration: none;
}

.homeBadgeIcon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
</style>
