<template>
<div class="imageZoomer">
	<div ref="activatorRef"
		class="zoomerActivator"
		role="button"
		tabindex="0"
		@click="open = true"
		@keydown="onKeydown"
	>
		<slot :alt="effectiveImgAlt" />
		<span class="zoomerHint">{{ title }}</span>
	</div>

	<v-dialog
		v-model="open"
		:content-class="smAndDown ? 'zoomerDialogMobile' : undefined"
		:fullscreen="smAndDown"
		:height="dialogHeight"
		:max-width="dialogMaxWidth"
		:width="dialogWidth"
		@after-enter="fitToViewport"
	>
		<v-card class="zoomerCard" :class="{ fullscreen: smAndDown }">
			<v-card-title class="zoomerTitle">
				<div class="zoomerTitleText">
					{{ title || 'Zoom' }}
				</div>
				<v-spacer />
				<v-btn
					aria-label="Schließen"
					class="zoomerClose"
					icon
					rounded="circle"
					size="large"
					title="Schließen"
					variant="tonal"
					@click="open = false"
				>
					<span aria-hidden="true" class="zoomerCloseGlyph">×</span>
				</v-btn>
			</v-card-title>
			<v-divider />
			<v-card-text class="zoomerBody">
				<div ref="contentBoxRef" aria-label="Zoom-Inhalt" class="zoomerContent">
					<div
						ref="fitBoxRef"
						class="zoomerFit"
						:style="fitStyle"
						@click="open = false"
					>
						<slot :alt="effectiveImgAlt" />
					</div>
				</div>
			</v-card-text>
		</v-card>
	</v-dialog>
</div>
</template>

<script setup>
import {
	computed, nextTick, onBeforeUnmount, onMounted, ref, watch
} from "vue";
import { useDisplay } from "vuetify";

const props = defineProps( {
	title:    { type: String, default: "" },
	imgAlt:   { type: String, default: "" },
	//hint:     { type: String, default: "Zum Zoomen klicken" },
	maxWidth: { type: [ Number, String ], default: 1400 }
} );

const open = ref( false );
const { smAndDown } = useDisplay();

const dialogMaxWidth = computed( () => smAndDown.value ? undefined : props.maxWidth );
const dialogWidth = computed( () => smAndDown.value ? undefined : "calc(100dvw - 48px)" );
const dialogHeight = computed( () => smAndDown.value ? undefined : "calc(100dvh - 48px)" );

const contentBoxRef = ref( null );
const fitBoxRef = ref( null );
const activatorRef = ref( null );
const fitStyle = ref( {} );
const effectiveImgAlt = computed( () => props.imgAlt || props.title || "" );

let ro = null;

function onKeydown( e ) {
	if ( e.key === "Enter" || e.key === " " ) {
		e.preventDefault();
		open.value = true;
	}
}

function getAspectRatioFromFirstMedia( rootEl ) {
	if ( !rootEl ) {
		return null;
	}

	const el = rootEl.querySelector( "svg, img, canvas" );

	if ( !el ) {
		return null;
	}

	// SVG: prefer viewBox dimensions.
	if ( el instanceof SVGSVGElement ) {
		const vb = el.viewBox?.baseVal;

		if ( vb?.width > 0 && vb?.height > 0 ) {
			return vb.width / vb.height;
		}

		const vbAttr = el.getAttribute( "viewBox" );

		if ( vbAttr ) {
			const parts = vbAttr.trim().split( /\s+/ )
				.map( Number );

			if ( parts.length === 4 && parts[ 2 ] > 0 && parts[ 3 ] > 0 ) {
				return parts[ 2 ] / parts[ 3 ];
			}
		}

		const w = Number( el.getAttribute( "width" ) );
		const h = Number( el.getAttribute( "height" ) );

		if ( w > 0 && h > 0 ) {
			return w / h;
		}
	}

	// IMG
	if ( el instanceof HTMLImageElement ) {
		if ( el.naturalWidth > 0 && el.naturalHeight > 0 ) {
			return el.naturalWidth / el.naturalHeight;
		}
	}

	// CANVAS
	if ( el instanceof HTMLCanvasElement ) {
		if ( el.width > 0 && el.height > 0 ) {
			return el.width / el.height;
		}
	}

	// Fallback to current box.
	const r = el.getBoundingClientRect();

	if ( r.width > 0 && r.height > 0 ) {
		return r.width / r.height;
	}

	return null;
}

function fitToViewport() {
	if ( !open.value ) {
		return;
	}

	const box = contentBoxRef.value;
	const fit = fitBoxRef.value;

	if ( !box || !fit ) {
		return;
	}

	const cw = box.clientWidth;
	const ch = box.clientHeight;

	if ( cw <= 0 || ch <= 0 ) {
		return;
	}

	const ratio = getAspectRatioFromFirstMedia( fit );

	if ( !ratio || !Number.isFinite( ratio ) || ratio <= 0 ) {
		return;
	}

	// "Contain" sizing: choose width/height that fits entirely, preserving aspect ratio.
	let w = cw;
	let h = w / ratio;

	if ( h > ch ) {
		h = ch;
		w = h * ratio;
	}

	fitStyle.value = { width: `${w}px`, height: `${h}px` };
}

function stopObservers() {
	ro?.disconnect();
	ro = null;
}

function applyAltToImages( rootEl ) {
	if ( !rootEl || !effectiveImgAlt.value ) {
		return;
	}

	const images = rootEl.querySelectorAll( "img" );

	images.forEach( ( img ) => {
		if ( !img.getAttribute( "alt" ) ) {
			img.setAttribute( "alt", effectiveImgAlt.value );
		}
	} );
}

function applyAltEverywhere() {
	applyAltToImages( activatorRef.value );
	applyAltToImages( fitBoxRef.value );
}

watch( open, async( v ) => {
	if ( !v ) {
		stopObservers();
		fitStyle.value = {};
		return;
	}

	await nextTick();
	fitToViewport();
	applyAltEverywhere();

	stopObservers();

	if ( contentBoxRef.value ) {
		ro = new ResizeObserver( () => fitToViewport() );
		ro.observe( contentBoxRef.value );
	}
} );

watch( effectiveImgAlt, async() => {
	await nextTick();
	applyAltEverywhere();
} );

onMounted( async() => {
	await nextTick();
	applyAltEverywhere();
} );

onBeforeUnmount( () => stopObservers() );
</script>

<style scoped>
.imageZoomer {
  width: 100%;
}

.zoomerActivator {
  position: relative;
  display: block;
  cursor: zoom-in;
  outline: none;
}

.zoomerActivator:focus-visible {
  border-radius: 14px;
  box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.35);
}

.zoomerHint {
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.14);
  background: rgba(var(--v-theme-surface), 0.85);
  color: rgba(var(--v-theme-on-surface), 0.82);
  font-size: 12px;
  font-weight: 700;
  backdrop-filter: blur(6px);
  pointer-events: none;
}

.zoomerCard {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  background: rgb(var(--v-theme-surface));
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-height: 100%;
}

.zoomerCard.fullscreen {
  height: 100%;
  max-height: 100%;
}

.zoomerCard.fullscreen .zoomerBody {
  padding: 0;
}

.zoomerTitle {
  position: sticky;
  top: 0;
  z-index: 1;
  background: rgb(var(--v-theme-surface));
  display: flex;
  align-items: center;
}

.zoomerTitleText {
  font-weight: 900;
}

.zoomerCloseGlyph {
  font-size: 26px;
  line-height: 1;
  font-weight: 900;
  transform: translateY(-1px);
}

.zoomerBody {
  padding: 14px;
  flex: 1;
  overflow: hidden;
  display: flex;
  min-height: 0;
}

.zoomerContent {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 0;
}

.zoomerFit {
  flex: 0 0 auto;
  max-width: 100%;
  max-height: 100%;
  min-width: 0;
  min-height: 0;
}

.zoomerFit :deep(svg),
.zoomerFit :deep(img),
.zoomerFit :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}

:global(.zoomerDialogMobile.v-overlay__content) {
  margin: 0 !important;
  width: 100vw !important;
  max-width: 100vw !important;
  height: 100dvh !important;
  max-height: 100dvh !important;
}
</style>
