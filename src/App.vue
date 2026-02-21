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
					<img alt="Home" class="homeBadgeIcon" :src="faviconPng" />
				</router-link>
				<template v-if="showFormalTitle">
					<div v-if="shortText" class="badge">{{ shortText }}</div>
					<div>
						<h1 v-if="titleText" class="titleRow">
							<span>{{ titleText }}</span>
							<v-tooltip
								v-if="difficultyStars"
								location="bottom"
								:text="difficultyLabel"
							>
								<template #activator="{ props: tooltipProps }">
									<span class="difficultyStars" :class="{ 'is-wip': routeIsWip }" v-bind="tooltipProps">
										{{ difficultyStars }}
									</span>
								</template>
							</v-tooltip>
						</h1>
						<p v-if="subChapterEntries.length" class="sub">
							<template v-for="( chapter, index ) in subChapterEntries" :key="chapter.id">
								<router-link :to="{ path: route.path, hash: `#${chapter.id}` }">
									{{ chapter.label }}
								</router-link>
								<span v-if="index < subChapterEntries.length - 1"> • </span>
							</template>
						</p>
					</div>
				</template>
				<slot v-else name="title" />
			</div>
		</v-container>
	</v-app-bar>

	<v-main>
		<v-container class="wrap mainWrap">
			<v-alert
				v-if="showError"
				border="start"
				class="wipAlert"
				:density="isMobile ? 'compact' : 'comfortable'"
				type="error"
				variant="tonal"
			>
				{{ errorMessage }}
			</v-alert>

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

			<Page v-if="showBookCard">
				<slot name="bookPart" />
			</Page>
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
				<v-row class="gridRow" dense>
					<v-col
						v-if="hasSummaryPart"
						cols="12"
						:md="12"
					>
						<slot name="summaryPart" />
					</v-col>
				</v-row>
			</section>
			<section class="card">
				<ForumThreadPocketBase
					:forum-key="shortText"
				/>
			</section>

			<footer class="foot">
				<slot name="footer" />
				<div class="legalRow">
					<a class="legalLink" href="https://github.com/soekdd/eddie_does_the_maths">GitHub</a>
					<span class="legalSep">·</span>
					<button
						class="legalLink"
						type="button"
						@click="showReportErrorDialog = true"
					>
						Fehler melden
					</button>
					<span class="legalSep">·</span>
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
					<span v-if="buildDateText" class="legalSep">·</span>
					<time
						v-if="buildDateText"
						class="legalBuild"
						:datetime="buildDateRaw"
					>
						Build: {{ buildDateText }}
					</time>
				</div>
			</footer>
		</v-container>
	</v-main>

	<v-dialog
		v-model="showReportErrorDialog"
		content-class="legalDialogContent"
		max-width="900"
		scrollable
	>
		<v-card>
			<v-card-title class="text-h6">Fehler melden</v-card-title>
			<v-card-text class="legalContent" v-html="reportErrorHTML" />
			<v-card-actions>
				<v-spacer />
				<v-btn variant="text" @click="showReportErrorDialog = false">
					Schließen
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>

	<v-dialog
		v-model="showImpressumDialog"
		content-class="legalDialogContent"
		max-width="900"
		scrollable
	>
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

	<v-dialog
		v-model="showPrivacyDialog"
		content-class="legalDialogContent"
		max-width="900"
		scrollable
	>
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
<script setup>
import {
	computed, onMounted, ref, useSlots
} from "vue";
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import reportErrorHTML from "./utils/disclaimer/report_errors_de.html?raw";
import impressumHtml from "./utils/disclaimer/impressum_de.html?raw";
import privacyPolicyHtml from "./utils/disclaimer/privacy_policy_de.html?raw";
import faviconPng from "./images/favicon.png";
import ForumThreadPocketBase from "./components/ForumThreadPocketBase.vue";
import Page from "./components/Page.vue";

const props = defineProps( {
	title:      { type: String, default: "" },
	subChapter: {
		type:    Object,
		default: () => ( {} )
	}
} );

const { width } = useDisplay();
const slots = useSlots();
const route = useRoute();

// Vuetify's built-in "mobile" flag defaults to < lg (1280px), which is too wide for our
// header-wrapping case. Match the app's existing "mobile-ish" breakpoint (see eddie.css).
const isMobile = computed( () => width.value < 860 );
const appBarHeight = computed( () => isMobile.value ? 108 : 72 );

const errorMessage = computed( () => {
	if ( route.meta?.error === true ) {
		return "Achtung: Dieser Inhalt ist bekanntermaßen noch fehlerhaft. " +
				"Texte, Grafiken und Rechenwege können falsch sein.";
	}

	if ( typeof route.meta?.error === "string" ) {
		return route.meta.error.trim();
	}

	return "";
} );

const warningMessage = computed( () => {
	if ( route.meta?.warning === true ) {
		return "Hinweis: An diesem Inhalt wird noch gearbeitet. " +
				"Texte, Grafiken und Rechenwege können sich noch ändern.";
	}

	if ( typeof route.meta?.warning === "string" ) {
		return route.meta.warning.trim();
	}

	return "";
} );

const routeIsWip = computed( () => route.meta?.wip === true );
const showError = computed( () => !routeIsWip.value && Boolean( errorMessage.value ) );
const showWarning = computed( () => !routeIsWip.value && Boolean( warningMessage.value ) );
const hasInteractivePart = computed( () => Boolean( slots.interactivePart ) );
const hasBookPart = computed( () => Boolean( slots.bookPart ) );
const hasCalculationPart = computed( () => Boolean( slots.calculationPart ) );
const hasSummaryPart = computed( () => Boolean( slots.summaryPart ) );
const showBookCard = computed( () => hasBookPart.value );
const showPartsCard = computed( () => hasInteractivePart.value || hasCalculationPart.value || hasSummaryPart.value );
const showReportErrorDialog = ref( false );
const showImpressumDialog = ref( false );
const showPrivacyDialog = ref( false );
const showHomeBadge = computed( () => route.path !== "/" );
const shortText = computed( () => {
	const routeName = typeof route.name === "string" ? route.name : "";
	const normalizedRouteName = routeName.trim().toUpperCase();
	return normalizedRouteName.slice( 0, 2 );
} );
const difficultyValue = computed( () => {
	const asNumber = Number( route.meta?.difficulty );

	if ( !Number.isInteger( asNumber ) || asNumber < 1 || asNumber > 3 ) {
		return null;
	}

	return asNumber;
} );
const difficultyStars = computed( () => {
	if ( difficultyValue.value === 1 ) {
		return "★☆☆";
	}

	if ( difficultyValue.value === 2 ) {
		return "★★☆";
	}

	if ( difficultyValue.value === 3 ) {
		return "★★★";
	}

	return "";
} );
const difficultyLabel = computed( () => {
	if ( difficultyValue.value === 1 ) {
		return "Schwierigkeitsgrad: leicht";
	}

	if ( difficultyValue.value === 2 ) {
		return "Schwierigkeitsgrad: mittel";
	}

	if ( difficultyValue.value === 3 ) {
		return "Schwierigkeitsgrad: schwer";
	}

	return "";
} );
const titleText = computed( () => props.title.trim() );
const subChapterEntries = computed( () => Object.entries( props.subChapter ?? {} )
	.map( ( [ id, label ] ) => ( {
		id:    String( id ).trim(),
		label: String( label ?? "" ).trim()
	} ) )
	.filter( ( entry ) => entry.id && entry.label ) );
const showFormalTitle = computed( () =>
	Boolean( shortText.value || titleText.value || subChapterEntries.value.length ) );
const buildDateRaw = String( import.meta.env.VITE_BUILD_DATE ?? "" ).trim();
const buildDateText = computed( () => {
	if ( !buildDateRaw ) {
		return "";
	}

	const parsedDate = new Date( buildDateRaw );

	if ( Number.isNaN( parsedDate.getTime() ) ) {
		return buildDateRaw;
	}

	const formattedDate = new Intl.DateTimeFormat( "de-DE", {
		dateStyle: "medium",
		timeStyle: "short",
		timeZone:  "UTC"
	} ).format( parsedDate );

	return `${formattedDate} GMT`;
} );

onMounted( () => {
	if ( route.hash ) {
		return;
	}

	window.scrollTo( {
		top:      0,
		left:     0,
		behavior: "auto"
	} );
} );
</script>
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

.legalBuild {
  opacity: 0.8;
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

:global(.v-theme--eddieLight .legalDialogContent > .v-card) {
  box-shadow:
    0 18px 42px rgba(15, 23, 42, 0.26),
    0 6px 16px rgba(15, 23, 42, 0.12) !important;
}

:global(.v-theme--eddieDark .legalDialogContent > .v-card) {
  box-shadow:
    0 0 0 1px rgba(var(--v-theme-primary, 125, 211, 252), 0.24),
    0 0 24px rgba(var(--v-theme-primary, 125, 211, 252), 0.42),
    0 0 48px rgba(var(--v-theme-info, 56, 189, 248), 0.28) !important;
}

.homeBadgeLink {
  text-decoration: none;
}

.homeBadgeIcon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.titleRow {
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.difficultyStars {
  margin-left:1em;
  cursor: help;
  color: rgb(var(--v-theme-warning));
  letter-spacing: 0.08em;
  user-select: none;
  line-height: 1;
}

.difficultyStars.is-wip {
  opacity: 0.5;
}
</style>
