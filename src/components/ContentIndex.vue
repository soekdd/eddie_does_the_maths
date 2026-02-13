<script setup>
import {
	computed, ref, watch
} from "vue";
import { useRouter } from "vue-router";

const props = defineProps( { title: { type: String, default: "Die aktuell ausgearbeiteten Inhalte sind:" } } );

const router = useRouter();
const TILE_SIZE_PX = 195;

const imageModules = import.meta.glob( "@/images/*.webp", { eager: true, import: "default" } );
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

const items = computed( () => {
	const routes = router.getRoutes();

	return routes
		.filter( ( r ) => r?.meta?.index === true && typeof r.meta?.title === "string" && r.meta.title.trim() )
		.map( ( r ) => ( {
			key:      String( r.name ?? r.path ),
			title:    String( r.meta.title ).replace( /&shy;/gi, "\u00AD" ),
			to:       r.name ? { name: r.name } : r.path,
			order:    Number.isFinite( r?.meta?.order ) ? Number( r.meta.order ) : null,
			path:     r.path,
			wip:      r?.meta?.wip === true,
			imageKey: String( r.name ?? "" ).toUpperCase(),
			imageUrl: imageByRouteName[ String( r.name ?? "" ).toUpperCase() ] ?? null
		} ) )
		.sort( ( a, b ) => {
			if ( a.order !== null && b.order !== null ) {
				return a.order - b.order;
			}

			if ( a.order !== null ) {
				return -1;
			}

			if ( b.order !== null ) {
				return 1;
			}

			return a.title.localeCompare( b.title, "de" );
		} );
} );

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
</script>

<template>
<div class="contentIndex">
	<p class="muted mb-2">{{ title }}</p>

	<div v-if="items.length" class="contentIndexList">
		<v-btn
			v-for="it in items"
			:key="it.key"
			:aria-disabled="it.wip ? 'true' : 'false'"
			class="index-tile"
			:class="tileClasses(it)"
			:ripple="!it.wip"
			:style="tileStyle(it)"
			:to="it.wip ? undefined : it.to"
			variant="flat"
		>
			<span class="tile-title" :class="tileTitleClass(it)">{{ it.title }}</span>
		</v-btn>
	</div>

	<p v-else class="muted">Noch keine Inhalte registriert.</p>
</div>
</template>

<style scoped>
.contentIndexList {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
}

.index-tile {
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
