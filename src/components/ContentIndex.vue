<template>
<div class="contentIndex">
	<p class="muted mb-2">{{ displayTitle }}</p>
	<client-only>
		<v-tabs
			v-if="bookTabs.length"
			v-model="activeBook"
			align-tabs="center"
			class="contentIndexTabs mb-4"
			color="primary"
			density="comfortable"
			show-arrows
		>
			<v-tab
				v-for="book in bookTabs"
				:key="book.value"
				:title="book.title"
				:value="book.value"
				v-html="book.short"
			/>
		</v-tabs>
	</client-only>
	<v-window v-if="bookTabs.length" v-model="activeBook" class="contentIndexWindow">
		<v-window-item
			v-for="book in bookTabs"
			:key="book.value"
			:value="book.value"
		>
			<div 	v-if="itemsByBook[book.value]?.length" class="contentIndexList">
				<v-btn
					v-for="it in itemsByBook[book.value]"
					:key="it.key"
					:aria-disabled="it.wip ? 'true' : 'false'"
					class="index-tile"
					:class="tileClasses(it)"
					:ripple="!it.wip"
					:style="tileStyle(it)"
					:to="it.wip ? undefined : it.to"
					variant="flat"
				>
					<span
						v-if="tileStatusIcon(it)"
						class="tile-status"
						:class="tileStatusClass(it)"
					>
						<v-icon :icon="tileStatusIcon(it)" size="18" />
					</span>
					<template v-if="it.difficulty !== null">
						<v-tooltip
							v-if="hasMounted"
							location="bottom"
							:text="difficultyLabel(it.difficulty)"
						>
							<template #activator="{ props: tooltipProps }">
								<span class="tile-difficulty" :class="{ 'is-wip': it.wip }" v-bind="tooltipProps">
									<v-icon :icon="difficultyIcon(it.difficulty)" size="18" />
								</span>
							</template>
						</v-tooltip>
						<span v-else class="tile-difficulty" :class="{ 'is-wip': it.wip }">
							<v-icon :icon="difficultyIcon(it.difficulty)" size="18" />
						</span>
					</template>
					<span
						v-if="tileCommentCount(it) > 0"
						class="tile-comment-indicator"
					>
						<v-icon
							:class="{ 'tile-comment-icon-recent': tileHasRecentComment(it) }"
							:icon="commentBubbleIcon"
							size="18"
						/>
						<span :class="{ 'tile-comment-count':'tile-comment-count', 'tile-comment-count-recent':
							tileHasRecentComment(it) }"
						>{{ tileCommentCountLabel(it) }}</span>
					</span>
					<span class="tile-title" :class="tileTitleClass(it)">{{ it.title }}</span>
				</v-btn>
			</div>

			<p v-else class="muted">{{ t( "contentIndex.emptyBook" ) }}</p>
		</v-window-item>
	</v-window>

	<p v-else class="muted">{{ t( "contentIndex.emptyAll" ) }}</p>
</div>
</template>
<script setup>
import {
	computed, inject, onMounted, ref, watch
} from "vue";
import {
	mdiAlertCircleOutline, mdiFileEditOutline, mdiAlertOutline, mdiHexagonSlice2, mdiHexagonSlice4, mdiHexagonSlice6,
	mdiMessageOutline, mdiCheckCircleOutline
} from "@mdi/js";
import { useRoute } from "vue-router";
import PocketBase from "pocketbase";
import { useI18n } from "@/i18n.mjs";
import { resolveRouteMetaTitle, routes as appRoutes } from "@/router.js";

const props = defineProps( { title: { type: String, default: "" } } );

const route = useRoute();
const { locale, t } = useI18n( "components/lang" );
const TILE_SIZE_PX = 195;
const RECENT_COMMENT_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const commentBubbleIcon = mdiMessageOutline;
const pbUrl = inject( "pbUrl", "" );
const pb = pbUrl ? new PocketBase( pbUrl ) : null;

if ( pb ) {
	pb.autoCancellation( false );
}

const commentCountByForumKey = ref( {} );
const recentCommentByForumKey = ref( {} );
let commentCountRequestId = 0;

const books = {
	1: {
		index: 1,
		title: "contentIndex.books.one.title",
		short: "contentIndex.books.one.short"
	},
	2: {
		index: 2,
		title: "contentIndex.books.two.title",
		short: "contentIndex.books.two.short"
	}
};
const displayTitle = computed( () => props.title.trim() || t( "contentIndex.defaultTitle" ) );

const imageModules = import.meta.glob( [ "@/images/*.webp", "@/book1/*/*.webp" ], { eager: true, import: "default" } );
const imageByRouteName = Object.entries( imageModules ).reduce( ( acc, [ path, url ] ) => {
	const file = path.split( "/" ).pop()
		?.replace( /\.webp$/i, "" )
		?.toUpperCase();

	if ( file ) {
		acc[ file ] = String( url );
	}

	return acc;
}, {} );

const tileToneByImageUrl = ref( {} );
const toneCache = new Map();

function normalizeBookIndex( value ) {
	const normalized = Number( value );
	return Number.isFinite( normalized ) ? normalized : null;
}

function normalizeDifficulty( value ) {
	const normalized = Number( value );

	if ( !Number.isInteger( normalized ) || normalized < 1 || normalized > 3 ) {
		return null;
	}

	return normalized;
}

function normalizeMetaPersonName( value ) {
	if ( typeof value !== "string" ) {
		return "";
	}

	return value.trim();
}

function toForumKey( value ) {
	return String( value ?? "" ).trim()
		.toUpperCase()
		.slice( 0, 2 );
}

function normalizeRouteLinkPath( path ) {
	const normalizedPath = String( path ?? "/" ).trim() || "/";

	if ( normalizedPath === "/" ) {
		return "/";
	}

	return normalizedPath.endsWith( "/" ) ? normalizedPath : `${normalizedPath}/`;
}

function escapeFilterString( value ) {
	return `"${String( value ).replace( /\\/g, "\\\\" )
		.replace( /"/g, "\\\"" )}"`;
}

function parseIsoDateToTimestamp( value ) {
	const timestamp = Date.parse( String( value ?? "" ) );
	return Number.isFinite( timestamp ) ? timestamp : null;
}

const languageQuery = computed( () => ( {
	...route.query,
	lang: locale.value
} ) );

const bookTabs = computed( () => Object.values( books )
	.map( ( book ) => ( {
		value: normalizeBookIndex( book?.index ),
		title: String( t( String( book?.title ?? "" ) ) ?? "" ),
		short: String( t( String( book?.short ?? book?.title ?? "" ) ) ?? "" )
	} ) )
	.filter( ( tab ) => tab.value !== null && tab.short.trim() )
	.sort( ( a, b ) => a.value - b.value ) );

function resolveActiveBook(
	tabs, routeBook, currentBook
) {
	if ( !tabs.length ) {
		return null;
	}

	const availableBooks = tabs.map( ( tab ) => tab.value );

	if ( availableBooks.includes( currentBook ) ) {
		return currentBook;
	}

	const preferredBook = normalizeBookIndex( routeBook );
	return availableBooks.includes( preferredBook ) ? preferredBook : availableBooks[ 0 ];
}

const activeBook = ref( resolveActiveBook(
	bookTabs.value, route?.meta?.book, null
) );
const hasMounted = ref( false );

onMounted( () => {
	hasMounted.value = true;
} );

const items = computed( () => {
	return appRoutes
		.map( ( r ) => ( {
			route: r,
			title: resolveRouteMetaTitle( r?.meta, locale.value )
		} ) )
		.filter( ( entry ) => entry.route?.meta?.index === true && entry.title.trim() )
		.map( ( { route: r, title } ) => ( {
			key:   String( r.name ?? r.path ),
			title: title.replace( /&shy;/gi, "\u00AD" ),
			to:    {
				path:  normalizeRouteLinkPath( r.path ),
				query: languageQuery.value
			},
			order:      Number.isFinite( r?.meta?.order ) ? Number( r.meta.order ) : null,
			path:       r.path,
			forumKey:   toForumKey( r.name ),
			book:       normalizeBookIndex( r?.meta?.book ),
			difficulty: normalizeDifficulty( r?.meta?.difficulty ),
			warning:    r?.meta?.warning === true || typeof r?.meta?.warning === "string",
			error:      r?.meta?.error === true || typeof r?.meta?.error === "string",
			wip:        r?.meta?.wip === true,
			corrector:  normalizeMetaPersonName( r?.meta?.corrector ),
			corrected:  normalizeMetaPersonName( r?.meta?.corrected ),
			imageKey:   String( r.name ?? "" ).toUpperCase(),
			imageUrl:   imageByRouteName[ String( r.name ?? "" ).toUpperCase() ] ?? null
		} ) )
		.sort( ( a, b ) => {
			if ( a.order !== null && b.order !== null ) {
				if ( a.order !== b.order ) {
					return a.order - b.order;
				}

				return a.path.localeCompare( b.path, "en" );
			}

			if ( a.order !== null ) {
				return -1;
			}

			if ( b.order !== null ) {
				return 1;
			}

			const byTitle = a.title.localeCompare( b.title, locale.value );
			return byTitle !== 0 ? byTitle : a.path.localeCompare( b.path, "en" );
		} );
} );

const itemsByBook = computed( () => Object.fromEntries( bookTabs.value.map( ( tab ) => [
	tab.value, items.value.filter( ( item ) => item.book === tab.value )
] ) ) );

/* watch( [
	bookTabs, () => route?.meta?.book
], ( [ tabs, routeBook ] ) => {
	activeBook.value = resolveActiveBook(
		tabs, routeBook, activeBook.value
	);
} ); */

async function refreshCommentCounts( nextItems ) {
	if ( !pb ) {
		commentCountByForumKey.value = {};
		recentCommentByForumKey.value = {};
		return;
	}

	const forumKeys = Array.from( new Set( nextItems.map( ( item ) => item.forumKey )
		.filter( ( key ) => key.length > 0 ) ) );

	if ( !forumKeys.length ) {
		commentCountByForumKey.value = {};
		recentCommentByForumKey.value = {};
		return;
	}

	const requestId = ++commentCountRequestId;

	try {
		const filter = forumKeys.map( ( key ) => `forumKey = ${escapeFilterString( key )}` ).join( " || " );
		const records = await pb.collection( "forum_comments" ).getFullList( {
			filter,
			fields: "forumKey,created"
		} );

		if ( requestId !== commentCountRequestId ) {
			return;
		}

		const counts = {};
		const recentByForumKey = {};
		const nowMs = Date.now();

		for ( const rec of records ) {
			const forumKey = toForumKey( rec?.forumKey );

			if ( !forumKey ) {
				continue;
			}

			counts[ forumKey ] = ( counts[ forumKey ] ?? 0 ) + 1;

			const createdAtTs = parseIsoDateToTimestamp( rec?.created );

			if ( createdAtTs !== null && nowMs - createdAtTs < RECENT_COMMENT_MAX_AGE_MS ) {
				recentByForumKey[ forumKey ] = true;
			}
		}

		commentCountByForumKey.value = counts;
		recentCommentByForumKey.value = recentByForumKey;
	} catch ( err ) {
		console.warn( t( "contentIndex.comments.loadFailed" ), err );

		if ( requestId === commentCountRequestId ) {
			commentCountByForumKey.value = {};
			recentCommentByForumKey.value = {};
		}
	}
}

watch(
	items, ( nextItems ) => {
		void refreshCommentCounts( nextItems );
	}, { immediate: true }
);

async function detectImageTone( imageUrl ) {
	if ( typeof window === "undefined" ) {
		return "dark";
	}

	return new Promise( ( resolve ) => {
		const img = new Image();
		img.decoding = "async";

		img.onload = () => {
			const canvas = document.createElement( "canvas" );
			const size = 24;
			canvas.width = size;
			canvas.height = size;

			const ctx = canvas.getContext( "2d", { willReadFrequently: true } );

			if ( !ctx ) {
				resolve( "dark" );
				return;
			}

			ctx.drawImage(
				img, 0, 0, size, size
			);
			const { data } = ctx.getImageData(
				0, 0, size, size
			);
			let luminanceSum = 0;

			for ( let i = 0; i < data.length; i += 4 ) {
				const r = data[ i ];
				const g = data[ i + 1 ];
				const b = data[ i + 2 ];
				luminanceSum += 0.2126 * r + 0.7152 * g + 0.0722 * b;
			}

			const avgLuminance = luminanceSum / ( data.length / 4 );
			resolve( avgLuminance >= 145 ? "light" : "dark" );
		};

		img.onerror = () => resolve( "dark" );
		img.src = imageUrl;
	} );
}

async function ensureTone( imageUrl ) {
	if ( !imageUrl || tileToneByImageUrl.value[ imageUrl ] ) {
		return;
	}

	if ( toneCache.has( imageUrl ) ) {
		tileToneByImageUrl.value = {
			...tileToneByImageUrl.value,
			[ imageUrl ]: toneCache.get( imageUrl )
		};
		return;
	}

	const tone = await detectImageTone( imageUrl );
	toneCache.set( imageUrl, tone );
	tileToneByImageUrl.value = {
		...tileToneByImageUrl.value,
		[ imageUrl ]: tone
	};
}

watch(
	items, ( nextItems ) => {
		nextItems.forEach( ( item ) => {
			if ( item.imageUrl ) {
				void ensureTone( item.imageUrl );
			}
		} );
	}, { immediate: true }
);

function tileTone( item ) {
	if ( !item.imageUrl ) {
		return "dark";
	}

	return tileToneByImageUrl.value[ item.imageUrl ] ?? "dark";
}

function tileClasses( item ) {
	return [
		item.imageUrl ? "has-image" : "no-image",
		tileTone( item ) === "light" ? "is-light-image" : "is-dark-image",
		item.wip ? "is-wip" : ""
	];
}

function tileStyle( item ) {
	return {
		"--tile-size":     `${TILE_SIZE_PX}px`,
		"--tile-bg-image": item.imageUrl ? `url("${item.imageUrl}")` : "none"
	};
}

function tileTitleClass( item ) {
	const isLight = tileTone( item ) === "light";

	if ( isLight ) {
		return item.wip ? "tile-title-light-wip" : "tile-title-light";
	}

	return item.wip ? "tile-title-dark-wip" : "tile-title-dark";
}

function difficultyIcon( difficulty ) {
	if ( difficulty === 1 ) {
		return mdiHexagonSlice2;
	}

	if ( difficulty === 2 ) {
		return mdiHexagonSlice4;
	}

	if ( difficulty === 3 ) {
		return mdiHexagonSlice6;
	}

	return "";
}

function difficultyLabel( difficulty ) {
	if ( difficulty === 1 ) {
		return t( "contentIndex.difficulty.easy" );
	}

	if ( difficulty === 2 ) {
		return t( "contentIndex.difficulty.medium" );
	}

	if ( difficulty === 3 ) {
		return t( "contentIndex.difficulty.hard" );
	}

	return "";
}

function tileStatusIcon( item ) {
	if ( item.corrected ) {
		return mdiCheckCircleOutline;
	}

	if ( item.corrector ) {
		return mdiFileEditOutline;
	}

	if ( item.wip ) {
		return "";
	}

	if ( item.error ) {
		return mdiAlertCircleOutline;
	}

	if ( item.warning ) {
		return mdiAlertOutline;
	}

	return "";
}

function tileStatusClass( item ) {
	if ( item.corrected ) {
		return "tile-status-corrected";
	}

	if ( item.corrector ) {
		return "tile-status-corrector";
	}

	if ( item.error ) {
		return "tile-status-error";
	}

	if ( item.warning ) {
		return "tile-status-warning";
	}

	return "";
}

function tileCommentCount( item ) {
	return commentCountByForumKey.value[ item.forumKey ] ?? 0;
}

function tileCommentCountLabel( item ) {
	const count = tileCommentCount( item );
	return count < 10 ? String( count ) : "9+";
}

function tileHasRecentComment( item ) {
	return recentCommentByForumKey.value[ item.forumKey ] === true;
}
</script>
<style scoped>
.contentIndexTabs :deep(.v-tab) {
  text-transform: none;
  font-weight: 500;
  font-size: 120%;
}

.contentIndexWindow {
	overflow: visible;
}

.contentIndexList {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
}

.index-tile {
  position: relative;
  width: var(--tile-size, 180px);
  height: var(--tile-size, 180px);
  min-width: var(--tile-size, 180px);
  max-width: var(--tile-size, 180px);
  border-radius: 18px;
  overflow: hidden;
  text-transform: none;
  background-color: #2d3138;
  background-image:
    linear-gradient(to top, rgba(0, 0, 0, 0.54), rgba(0, 0, 0, 0.14)),
    var(--tile-bg-image);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow:
    0 5px 14px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
  transform: translateZ(0);
  transition:
    transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 220ms ease,
    background-image 140ms linear;
}

.index-tile.is-light-image {
  background-image:
    linear-gradient(to top, rgba(255, 255, 255, 0.52), rgba(255, 255, 255, 0.14)),
    var(--tile-bg-image);
}

.index-tile.no-image {
  background-image: linear-gradient(135deg, #2b3037 0%, #3b4149 100%);
}

.index-tile.is-wip {
  cursor: not-allowed;
}

.index-tile:not(.is-wip):hover {
  transform: translateY(-2px) scale(1.2);
  z-index: 100;
  box-shadow:
    0 10px 22px rgba(0, 0, 0, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.24);
  animation: tile-boing-in 420ms ease-out;
}

.index-tile.has-image:not(.is-wip):hover {
  background-image: var(--tile-bg-image);
}

.index-tile:not(.is-wip):focus-visible {
  transform: scale(1.03);
}

.index-tile.has-image:not(.is-wip):hover {
  box-shadow:
    0 18px 42px rgba(15, 23, 42, 0.26),
    0 6px 16px rgba(15, 23, 42, 0.12);
}

.index-tile.has-image:not(.is-wip):hover {
  box-shadow:
    0 0 0 1px rgba(var(--v-theme-primary, 125, 211, 252), 0.24),
    0 0 24px rgba(var(--v-theme-primary, 125, 211, 252), 0.42),
    0 0 48px rgba(var(--v-theme-info, 56, 189, 248), 0.28);
}

@keyframes tile-boing-in {
  0% {
    transform: translateY(0) scale(1);
  }
  34% {
    transform: translateY(-3px) scale(1.075, 0.965);
  }
  58% {
    transform: translateY(-1px) scale(0.995, 1.02);
  }
  80% {
    transform: translateY(-2px) scale(1.05, 0.985);
  }
  100% {
    transform: translateY(-2px) scale(1.04);
  }
}

.index-tile :deep(.v-btn__content) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  text-align: center;
  padding: 10px;
  white-space: normal;
}

.tile-status {
  position: absolute;
  top: 8px;
  left: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.28);
  z-index: 2;
}

.tile-status-warning {
  color: rgb(var(--v-theme-warning));
}

.tile-status-error {
  color: rgb(var(--v-theme-error));
}

.tile-status-corrector {
  color: rgb(var(--v-theme-success));
}

.tile-status-corrected {
  color: rgb(var(--v-theme-success));
}

.tile-difficulty {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: help;
  color: rgb(var(--v-theme-warning));
  font-size: 0.92rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.28);
  z-index: 2;
}

.tile-difficulty.is-wip {
  opacity: 0.5;
}

.tile-comment-indicator {
  position: absolute;
  top: 34px;
  right: 12px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: #ffffff70;
  text-shadow:
    -1px -1px 0 rgba(0, 0, 0, 0.7),
    1px -1px 0 rgba(0, 0, 0, 0.7),
    -1px 1px 0 rgba(0, 0, 0, 0.7),
    1px 1px 0 rgba(0, 0, 0, 0.7);
}

.tile-comment-count {
  color: #ffffff70;
  position: absolute;
  top: 3px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.5rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
  pointer-events: none;
}

.tile-comment-count-recent, .tile-comment-icon-recent {
  color: #fff !important;
}

.tile-title {
  display: block;
  width: 100%;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.15;
  hyphens: manual;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.tile-title-dark {
  color: #fff;
  text-shadow:
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000,
    0 2px 5px rgba(0, 0, 0, 0.42);
}

.tile-title-dark-wip {
  color: #808285;
  text-shadow:
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000,
    0 2px 5px rgba(0, 0, 0, 0.42);
}

.tile-title-light {
  color: #0f1216;
  text-shadow:
    -1px -1px 0 rgba(255, 255, 255, 0.95),
    1px -1px 0 rgba(255, 255, 255, 0.95),
    -1px 1px 0 rgba(255, 255, 255, 0.95),
    1px 1px 0 rgba(255, 255, 255, 0.95),
    0 1px 4px rgba(255, 255, 255, 0.48);
}

.tile-title-light-wip {
  color: #686d74;
  text-shadow:
    -1px -1px 0 rgba(255, 255, 255, 0.95),
    1px -1px 0 rgba(255, 255, 255, 0.95),
    -1px 1px 0 rgba(255, 255, 255, 0.95),
    1px 1px 0 rgba(255, 255, 255, 0.95),
    0 1px 4px rgba(255, 255, 255, 0.48);
}

@media (max-width: 700px) {
  .index-tile {
    width: 160px;
    height: 160px;
    min-width: 160px;
    max-width: 160px;
  }
}
</style>
