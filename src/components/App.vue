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
							<template v-if="difficultyIcon">
								<v-tooltip
									v-if="hasMounted"
									location="bottom"
									:text="difficultyLabel"
								>
									<template #activator="{ props: tooltipProps }">
										<span class="difficultyStars" :class="{ 'is-wip': routeIsWip }" v-bind="tooltipProps">
											<v-icon :icon="difficultyIcon" size="18" />
										</span>
									</template>
								</v-tooltip>
								<span v-else class="difficultyStars" :class="{ 'is-wip': routeIsWip }">
									<v-icon :icon="difficultyIcon" size="18" />
								</span>
							</template>
						</h1>
						<p v-if="subChapterEntries.length" class="sub">
							<template v-for="( chapter ) in subChapterEntries" :key="chapter.id">
								<router-link
									:to="{ path: routePathForHashLinks, hash: `#${chapter.id}` }"
									@click="handleHashLinkClick( `#${chapter.id}` )"
								>
									{{ chapter.label }}
								</router-link>
								<span> • </span>
							</template>
							<router-link
								:to="{ path: routePathForHashLinks, hash: '#forum' }"
								@click="handleHashLinkClick( '#forum' )"
							>
								Forum
							</router-link>
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
				icon="mdi-alert-outline"
				type="warning"
				variant="tonal"
			>
				{{ warningMessage }}
			</v-alert>

			<v-alert
				v-if="showCorrectorAlert"
				border="start"
				class="wipAlert"
				:density="isMobile ? 'compact' : 'comfortable'"
				icon="mdi-file-edit-outline"
				type="success"
				variant="tonal"
			>
				Dieses Kapitel wird aktuell von {{ correctorName }} geprüft.
			</v-alert>

			<Page v-if="showBookCard">
				<slot name="bookPart" />
			</Page>
			<section class="card" if="description">
				<div v-if="!nomd" class="descriptionPartHeader">
					<v-btn
						:append-icon="mdiDownload"
						density="comfortable"
						size="small"
						style="margin: -1em 0"
						variant="text"
						@click="downloadPDF"
					>
						PDF
					</v-btn>
					<MarkdownDownload
						:file-name="descriptionMarkdownFileName"
						target-id="descriptionPartMarkdownSource"
					/>
				</div>
				<div id="descriptionPartMarkdownSource">
					<slot name="descriptionPart" />
				</div>
				<div class="lastUpdate">letzte Änderung: {{fileDate}}</div>
			</section>

			<section v-if="showPartsCard" id="interactiv" class="card">
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
			<section id="forum" class="card">
				<ForumThreadPocketBase
					:forum-key="shortText"
				/>
			</section>

			<footer class="foot">
				<slot name="footer" />
				<div v-if="showCorrectedCredit" class="correctedCredit">
					freundlicher Weise geprüft und korrigiert von {{ correctedName }}
				</div>
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
		v-if="hasMounted"
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
		v-if="hasMounted"
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
		v-if="hasMounted"
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
	computed, nextTick, onMounted, ref, useSlots, watch
} from "vue";
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import {
	mdiDownload, mdiHexagonSlice2, mdiHexagonSlice4, mdiHexagonSlice6
} from "@mdi/js";
import reportErrorHTML from "../utils/disclaimer/report_errors_de.html?raw";
import impressumHtml from "../utils/disclaimer/impressum_de.html?raw";
import privacyPolicyHtml from "../utils/disclaimer/privacy_policy_de.html?raw";
import faviconPng from "../images/favicon.png";
import ForumThreadPocketBase from "./ForumThreadPocketBase.vue";
import MarkdownDownload from "./MarkdownDownload.vue";
import Page from "./Page.vue";

const props = defineProps( {
	title:      { type: String, default: "" },
	nomd:       { type: Boolean, default: false },
	vueDate:    { type: Number || String, default: null },
	subChapter: {
		type:    Object,
		default: () => ( {} )
	}
} );

const { width } = useDisplay();
const slots = useSlots();
const route = useRoute();
const hasMounted = ref( false );

// Vuetify's built-in "mobile" flag defaults to < lg (1280px), which is too wide for our
// header-wrapping case. Match the app's existing "mobile-ish" breakpoint (see eddie.css).
const isMobile = computed( () => hasMounted.value ? width.value < 860 : false );
const appBarHeight = computed( () => isMobile.value ? 108 : 72 );
const fileDate = computed( () => new Date( props.vueDate ).toLocaleString( "de-DE" ) );
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
		return "Hinweis: Dieser Inhalt wurde noch nicht geprüft. " +
				"Texte, Grafiken und Rechenwege können also noch Fehler beinhalten. Mithilfe ist erbeten.";
	}

	if ( typeof route.meta?.warning === "string" ) {
		return route.meta.warning.trim();
	}

	return "";
} );

function normalizeMetaPersonName( value ) {
	if ( typeof value !== "string" ) {
		return "";
	}

	return value.trim();
}

const correctorName = computed( () => normalizeMetaPersonName( route.meta?.corrector ) );
const correctedName = computed( () => normalizeMetaPersonName( route.meta?.corrected ) );
const showCorrectorAlert = computed( () => Boolean( correctorName.value ) );
const showCorrectedCredit = computed( () => Boolean( correctedName.value ) );

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

function normalizePathForHashLinks( pathValue ) {
	const asString = String( pathValue || "/" ).trim();

	if ( asString === "/" ) {
		return "/";
	}

	return asString.endsWith( "/" ) ? asString : `${asString}/`;
}

const routePathForHashLinks = computed( () => normalizePathForHashLinks( route.path ) );
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
const difficultyIcon = computed( () => {
	if ( difficultyValue.value === 1 ) {
		return mdiHexagonSlice2;
	}

	if ( difficultyValue.value === 2 ) {
		return mdiHexagonSlice4;
	}

	if ( difficultyValue.value === 3 ) {
		return mdiHexagonSlice6;
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
const descriptionMarkdownFileName = computed( () => {
	const parts = [ shortText.value, titleText.value ]
		.map( ( value ) => String( value ?? "" ).trim() )
		.filter( Boolean );

	if ( !parts.length ) {
		return "beschreibung";
	}

	return parts.join( "-" );
} );
const buildDateRaw = String( import.meta.env.VITE_BUILD_DATE ?? "" ).trim();
const appBasePath = normalizeBasePath( import.meta.env.BASE_URL || "/" );

function pad2( value ) {
	return String( value ).padStart( 2, "0" );
}

function normalizeBasePath( basePath ) {
	const asString = String( basePath || "/" ).trim();

	if ( !asString || asString === "/" ) {
		return "/";
	}

	let normalized = asString;

	if ( !normalized.startsWith( "/" ) ) {
		normalized = `/${normalized}`;
	}

	if ( !normalized.endsWith( "/" ) ) {
		normalized = `${normalized}/`;
	}

	return normalized;
}

function routePdfSlug( routePath ) {
	const segments = String( routePath || "" )
		.split( "/" )
		.filter( Boolean );

	return segments.length > 0 ? segments[ 0 ] : "index";
}

function downloadPDF() {
	if ( typeof window === "undefined" ) {
		return;
	}

	const pdfSlug = routePdfSlug( route.path );
	const pdfPath = `${appBasePath}pdf/${encodeURIComponent( pdfSlug )}.pdf`;
	const opened = window.open(
		pdfPath, "_blank", "noopener,noreferrer"
	);

	if ( opened ) {
		opened.opener = null;
	}
}

function formatUtcBuildDate( date ) {
	const day = pad2( date.getUTCDate() );
	const month = pad2( date.getUTCMonth() + 1 );
	const year = date.getUTCFullYear();
	const hours = pad2( date.getUTCHours() );
	const minutes = pad2( date.getUTCMinutes() );
	return `${day}.${month}.${year}, ${hours}:${minutes} GMT`;
}

const buildDateText = computed( () => {
	if ( !buildDateRaw ) {
		return "";
	}

	const parsedDate = new Date( buildDateRaw );

	if ( Number.isNaN( parsedDate.getTime() ) ) {
		return buildDateRaw;
	}

	return formatUtcBuildDate( parsedDate );
} );

function getHashId( hash ) {
	if ( typeof hash !== "string" || !hash.startsWith( "#" ) ) {
		return "";
	}

	const raw = hash.slice( 1 );

	if ( !raw ) {
		return "";
	}

	try {
		return decodeURIComponent( raw );
	} catch {
		return raw;
	}
}

function scrollToHashId( hash, behavior = "smooth" ) {
	if ( typeof window === "undefined" || typeof document === "undefined" ) {
		return false;
	}

	const targetId = getHashId( hash );

	if ( !targetId ) {
		return false;
	}

	const target = document.getElementById( targetId );

	if ( !target ) {
		return false;
	}

	target.scrollIntoView( {
		block:  "start",
		inline: "nearest",
		behavior
	} );
	return true;
}

function handleHashLinkClick( hash ) {
	if ( hash === route.hash ) {
		scrollToHashId( hash, "smooth" );
	}
}

watch(
	() => route.hash,
	async( hash ) => {
		if ( !hasMounted.value || !hash ) {
			return;
		}

		await nextTick();
		scrollToHashId( hash, "smooth" );
	},
	{ flush: "post" }
);

onMounted( () => {
	hasMounted.value = true;

	if ( route.hash ) {
		nextTick( () => {
			scrollToHashId( route.hash, "auto" );
		} );
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

.correctedCredit {
  margin-top: 12px;
  font-size: 0.8rem;
  opacity: 0.82;
  text-align: right;
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

.homeBadgeLink.badge {
  overflow: visible;
}

.homeBadgeIcon {
  display: block;
  width: 24px;
  height: 24px;
  box-sizing: border-box;
  object-fit: contain;
  object-position: center;
  padding: 1.5px;
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

.descriptionPartHeader {
	display: flex;
	justify-content: flex-end;
	margin-bottom: 8px;
}

#forum {
	scroll-margin-top: 96px;
}

@media (max-width: 860px) {
	#forum {
		scroll-margin-top: 132px;
	}
}

@media print {
	.descriptionPartHeader {
		display: none;
	}
}
</style>
