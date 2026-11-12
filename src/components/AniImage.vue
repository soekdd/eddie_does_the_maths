<template>
<span class="aniImage">
	<img :alt :loading :src />
	<video
		v-if="videoUrl"
		ref="videoRef"
		aria-hidden="true"
		:class="{ playing: isPlaying }"
		disablepictureinpicture
		disableremoteplayback
		muted
		playsinline
		preload="auto"
		:src="videoUrl"
		tabindex="-1"
		@canplay="startVideo"
		@ended="finishVideo"
		@error="finishVideo"
		@playing="isPlaying = true"
	/>
</span>
</template>

<script setup>
import {
	onBeforeUnmount, onMounted, ref, watch
} from "vue";

const props = defineProps( {
	src:          { type: String, required: true },
	hasAnimation: { type: Boolean, default: false },
	alt:          { type: String, default: "" },
	loading:      { type: String, default: "lazy" }
} );

const images = import.meta.glob( "../**/*.webp", { eager: true, import: "default" } );
const animations = import.meta.glob( "../**/*.mp4", { eager: true, import: "default" } );
const animationByImage = Object.fromEntries( Object.entries( images )
	.map( ( [ path, imageUrl ] ) => [ imageUrl, animations[ path.replace( /\.webp$/, ".mp4" ) ] ] )
	.filter( ( [ , animationUrl ] ) => animationUrl ) );

const mounted = ref( false );
const videoRef = ref( null );
const videoUrl = ref( null );
const isPlaying = ref( false );
let objectUrl = null;
let started = false;

function finishVideo() {
	isPlaying.value = false;
	videoUrl.value = null;
	started = false;

	if ( objectUrl ) {
		URL.revokeObjectURL( objectUrl );
		objectUrl = null;
	}
}

function startVideo() {
	if ( started || !videoRef.value ) {
		return;
	}

	started = true;
	videoRef.value.play().catch( finishVideo );
}

watch(
	[ () => props.src, () => props.hasAnimation, mounted ], async(
		[ src, hasAnimation, isMounted ], _, onCleanup
	) => {
		finishVideo();

		const animationUrl = animationByImage[ src ];

		if ( !isMounted || !hasAnimation || !animationUrl ) {
			return;
		}

		const controller = new AbortController();

		onCleanup( () => controller.abort() );

		try {
			const response = await fetch( animationUrl, { signal: controller.signal } );

			if ( !response.ok ) {
				return;
			}

			const blob = await response.blob();

			if ( !controller.signal.aborted ) {
				objectUrl = URL.createObjectURL( blob );
				videoUrl.value = objectUrl;
			}
		} catch {
		// The image stays visible if the animation cannot be loaded.
		}
	}, { immediate: true }
);

onMounted( () => {
	mounted.value = true;
} );
onBeforeUnmount( finishVideo );
</script>

<style scoped>
.aniImage {
	position: relative;
	display: block;
	width: 100%;
}

.aniImage img {
	display: block;
	width: 100%;
	height: auto;
	border-radius: inherit;
}

.aniImage video {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: contain;
	border-radius: inherit;
	visibility: hidden;
	pointer-events: none;
}

.aniImage video.playing {
	visibility: visible;
}
</style>
