<template>
<v-sheet border class="morseContainer pa-4" rounded="xl">
	<div class="headerRow">
		<div v-if="title" class="text-caption text-medium-emphasis">
			{{ title }}
		</div>
		<v-btn
			:disabled="!canPlay || !audioSupported"
			rounded="xl"
			size="small"
			variant="tonal"
			@click="togglePlayback"
		>
			{{ isPlaying ? "Stop" : "Play" }}
		</v-btn>
	</div>

	<div v-if="showSource" class="text-body-2 mb-3 mt-3">
		{{ normalizedInput || emptyLabel }}
	</div>

	<code class="morseOutput">
		<template v-if="morseText">
			<span
				v-for="( segment, index ) in morseModel.displaySegments"
				:key="`morse-segment-${index}`"
				:class="{
					activeCode: segment.groupIndex !== null && segment.groupIndex === activeGroupIndex,
					codeGroup: segment.groupIndex !== null
				}"
			>
				{{ segment.text }}
			</span>
		</template>
		<template v-else>
			{{ emptyLabel }}
		</template>
	</code>
</v-sheet>
</template>

<script setup>
import {
	computed, onBeforeUnmount, ref, watch
} from "vue";
import { HA_SPECIAL_MORSE_BY_TOKEN } from "./HA_specialSymbols.mjs";

const MORSE_MAP = {
	A:    ".-",
	B:    "-...",
	C:    "-.-.",
	D:    "-..",
	E:    ".",
	F:    "..-.",
	G:    "--.",
	H:    "....",
	I:    "..",
	J:    ".---",
	K:    "-.-",
	L:    ".-..",
	M:    "--",
	N:    "-.",
	O:    "---",
	P:    ".--.",
	Q:    "--.-",
	R:    ".-.",
	S:    "...",
	T:    "-",
	U:    "..-",
	V:    "...-",
	W:    ".--",
	X:    "-..-",
	Y:    "-.--",
	Z:    "--..",
	0:    "-----",
	1:    ".----",
	2:    "..---",
	3:    "...--",
	4:    "....-",
	5:    ".....",
	6:    "-....",
	7:    "--...",
	8:    "---..",
	9:    "----.",
	".":  ".-.-.-",
	",":  "--..--",
	"?":  "..--..",
	"!":  "-.-.--",
	":":  "---...",
	";":  "-.-.-.",
	"(":  "-.--.",
	")":  "-.--.-",
	"\"": ".-..-.",
	"'":  ".----.",
	"&":  ".-...",
	"/":  "-..-.",
	"+":  ".-.-.",
	"-":  "-....-",
	"=":  "-...-",
	_:    "..--.-",
	"@":  ".--.-.",
	$:    "...-..-"
};

const PLAYBACK_WPM = 18;
const DOT_DURATION = 1.2 / PLAYBACK_WPM;
const DASH_DURATION = DOT_DURATION * 3;
const SYMBOL_GAP = DOT_DURATION;
const LETTER_GAP = DOT_DURATION * 3;
const WORD_GAP = DOT_DURATION * 7;

const props = defineProps( {
	emptyLabel: {
		type:    String,
		default: "—"
	},
	showSource: {
		type:    Boolean,
		default: true
	},
	text: {
		type:    String,
		default: ""
	},
	title: {
		type:    String,
		default: "Morsecode"
	}
} );

const isPlaying = ref( false );
const activeGroupIndex = ref( null );
const playbackState = ref( null );
const stopTimerId = ref( null );

function normalizeLineEndings( value ) {
	return String( value ?? "" ).replace( /\r\n?/g, "\n" );
}

function splitPrefixedLine( line ) {
	const match = String( line ?? "" ).match( /^(\s*)(.*)$/s );

	return {
		linePrefix: match?.[ 1 ] ?? "",
		content:    match?.[ 2 ] ?? ""
	};
}

function isCommentLine( content ) {
	return String( content ?? "" ).trimStart()
		.startsWith( "#" );
}

const audioSupported = computed( () => typeof window !== "undefined" &&
	Boolean( window.AudioContext || window.webkitAudioContext ) );
const normalizedInput = computed( () => normalizeLineEndings( props.text ).trim() );
const morseModel = computed( () => {
	const lines = normalizeLineEndings( props.text ).split( "\n" );
	const displaySegments = [];
	const events = [];
	let groupIndex = 0;
	let cursor = 0;

	if ( lines.length === 1 && lines[ 0 ] === "" ) {
		return {
			displaySegments,
			events,
			text: ""
		};
	}

	for ( let lineIndex = 0; lineIndex < lines.length; lineIndex += 1 ) {
		const sourceLine = String( lines[ lineIndex ] ?? "" );
		const {
			linePrefix,
			content
		} = splitPrefixedLine( sourceLine );
		const trimmedContent = content.trim();
		const shouldRenderComment = trimmedContent && isCommentLine( content );
		const words = shouldRenderComment ?
			[] :
			trimmedContent.toUpperCase()
				.split( /\s+/ )
				.filter( Boolean );

		if ( shouldRenderComment ) {
			displaySegments.push( {
				groupIndex: null,
				text:       sourceLine
			} );
		} else {
			if ( linePrefix ) {
				displaySegments.push( {
					groupIndex: null,
					text:       linePrefix
				} );
			}

			for ( let wordIndex = 0; wordIndex < words.length; wordIndex += 1 ) {
				const specialCode = HA_SPECIAL_MORSE_BY_TOKEN[ words[ wordIndex ] ] ?? "";

				if ( specialCode ) {
					displaySegments.push( {
						groupIndex,
						text: specialCode
					} );

					for ( let symbolIndex = 0; symbolIndex < specialCode.length; symbolIndex += 1 ) {
						const symbol = specialCode[ symbolIndex ];
						const duration = symbol === "-" ? DASH_DURATION : DOT_DURATION;

						events.push( {
							duration,
							groupIndex,
							start: cursor
						} );
						cursor += duration;

						if ( symbolIndex < specialCode.length - 1 ) {
							cursor += SYMBOL_GAP;
						}
					}

					groupIndex += 1;

					if ( wordIndex < words.length - 1 ) {
						displaySegments.push( {
							groupIndex: null,
							text:       " / "
						} );
						cursor += WORD_GAP;
					}

					continue;
				}

				const characters = words[ wordIndex ].split( "" );

				for ( let characterIndex = 0; characterIndex < characters.length; characterIndex += 1 ) {
					const character = characters[ characterIndex ];
					const code = MORSE_MAP[ character ] ?? "?";
					const playable = code !== "?";
					const currentGroupIndex = playable ? groupIndex : null;

					displaySegments.push( {
						groupIndex: currentGroupIndex,
						text:       code
					} );

					if ( playable ) {
						for ( let symbolIndex = 0; symbolIndex < code.length; symbolIndex += 1 ) {
							const symbol = code[ symbolIndex ];
							const duration = symbol === "-" ? DASH_DURATION : DOT_DURATION;

							events.push( {
								duration,
								groupIndex: currentGroupIndex,
								start:      cursor
							} );
							cursor += duration;

							if ( symbolIndex < code.length - 1 ) {
								cursor += SYMBOL_GAP;
							}
						}

						groupIndex += 1;
					}

					if ( characterIndex < characters.length - 1 ) {
						displaySegments.push( {
							groupIndex: null,
							text:       " "
						} );
						cursor += LETTER_GAP;
					}
				}

				if ( wordIndex < words.length - 1 ) {
					displaySegments.push( {
						groupIndex: null,
						text:       " / "
					} );
					cursor += WORD_GAP;
				}
			}
		}

		if ( lineIndex < lines.length - 1 ) {
			displaySegments.push( {
				groupIndex: null,
				text:       "\n"
			} );

			if ( words.length > 0 ) {
				cursor += WORD_GAP;
			}
		}
	}

	return {
		displaySegments,
		events,
		text: displaySegments.map( ( segment ) => segment.text ).join( "" )
	};
} );

const morseText = computed( () => morseModel.value.text );
const canPlay = computed( () => morseModel.value.events.length > 0 );

function createNoiseBuffer( context,
	duration = 2 ) {
	const frameCount = Math.max( 1,
		Math.floor( context.sampleRate * duration ) );
	const buffer = context.createBuffer(
		1,
		frameCount,
		context.sampleRate
	);
	const channel = buffer.getChannelData( 0 );

	for ( let index = 0; index < frameCount; index += 1 ) {
		channel[ index ] = ( Math.random() * 2 - 1 ) * 0.9;
	}

	return buffer;
}

function buildPlaybackPlan() {
	return {
		events: morseModel.value.events.map( ( event ) => ( {
			...event,
			level: 0.74 + Math.random() * 0.14
		} ) ),
		totalDuration: morseModel.value.events.length ?
			morseModel.value.events[ morseModel.value.events.length - 1 ].start +
			morseModel.value.events[ morseModel.value.events.length - 1 ].duration :
			0
	};
}

function clearStopTimer() {
	if ( stopTimerId.value !== null && typeof window !== "undefined" ) {
		window.clearTimeout( stopTimerId.value );
		stopTimerId.value = null;
	}
}

async function stopPlayback() {
	clearStopTimer();
	activeGroupIndex.value = null;

	const current = playbackState.value;

	playbackState.value = null;
	isPlaying.value = false;

	if ( !current ) {
		return;
	}

	if ( current.rafId !== null && typeof window !== "undefined" ) {
		window.cancelAnimationFrame( current.rafId );
	}

	for ( const node of current.stopNodes ) {
		try {
			node.stop();
		} catch {
			// Node may already be stopped.
		}
	}

	for ( const node of current.disconnectNodes ) {
		try {
			node.disconnect();
		} catch {
			// Node may already be disconnected.
		}
	}

	if ( current.context?.state !== "closed" ) {
		try {
			await current.context.close();
		} catch {
			// Ignore close failures from already shutting-down contexts.
		}
	}
}

async function startPlayback() {
	if ( !audioSupported.value || !canPlay.value ) {
		return;
	}

	await stopPlayback();

	const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
	const context = new AudioContextCtor();

	if ( context.state === "suspended" ) {
		await context.resume();
	}

	const plan = buildPlaybackPlan();

	if ( !plan.events.length ) {
		await context.close();
		return;
	}

	const masterGain = context.createGain();
	const keyGain = context.createGain();
	const toneMix = context.createGain();
	const toneMainGain = context.createGain();
	const toneUpperGain = context.createGain();
	const keyedNoiseGain = context.createGain();
	const backgroundNoiseGain = context.createGain();
	const compressor = context.createDynamicsCompressor();
	const oscillatorMain = context.createOscillator();
	const oscillatorUpper = context.createOscillator();
	const driftLfo = context.createOscillator();
	const driftGain = context.createGain();
	const keyedNoiseFilter = context.createBiquadFilter();
	const backgroundNoiseFilter = context.createBiquadFilter();
	const keyedNoiseSource = context.createBufferSource();
	const backgroundNoiseSource = context.createBufferSource();
	const noiseBuffer = createNoiseBuffer( context );

	masterGain.gain.value = 0.55;
	keyGain.gain.value = 0;
	toneMainGain.gain.value = 0.2;
	toneUpperGain.gain.value = 0.06;
	keyedNoiseGain.gain.value = 0.045;
	backgroundNoiseGain.gain.value = 0.008;

	compressor.threshold.value = -22;
	compressor.knee.value = 12;
	compressor.ratio.value = 3;
	compressor.attack.value = 0.003;
	compressor.release.value = 0.14;

	oscillatorMain.type = "sine";
	oscillatorMain.frequency.value = 640;
	oscillatorUpper.type = "triangle";
	oscillatorUpper.frequency.value = 1280;
	oscillatorUpper.detune.value = 4;

	driftLfo.type = "sine";
	driftLfo.frequency.value = 5.2;
	driftGain.gain.value = 4.5;

	keyedNoiseFilter.type = "bandpass";
	keyedNoiseFilter.frequency.value = 880;
	keyedNoiseFilter.Q.value = 1.1;
	backgroundNoiseFilter.type = "highpass";
	backgroundNoiseFilter.frequency.value = 1800;
	backgroundNoiseFilter.Q.value = 0.3;

	keyedNoiseSource.buffer = noiseBuffer;
	keyedNoiseSource.loop = true;
	backgroundNoiseSource.buffer = noiseBuffer;
	backgroundNoiseSource.loop = true;

	driftLfo.connect( driftGain );
	driftGain.connect( oscillatorMain.detune );
	driftGain.connect( oscillatorUpper.detune );

	oscillatorMain.connect( toneMainGain );
	oscillatorUpper.connect( toneUpperGain );
	toneMainGain.connect( toneMix );
	toneUpperGain.connect( toneMix );
	toneMix.connect( keyGain );

	keyedNoiseSource.connect( keyedNoiseFilter );
	keyedNoiseFilter.connect( keyedNoiseGain );
	keyedNoiseGain.connect( keyGain );

	backgroundNoiseSource.connect( backgroundNoiseFilter );
	backgroundNoiseFilter.connect( backgroundNoiseGain );
	backgroundNoiseGain.connect( compressor );

	keyGain.connect( compressor );
	compressor.connect( masterGain );
	masterGain.connect( context.destination );

	const startAt = context.currentTime + 0.04;
	const attackTime = 0.0045;
	const releaseTime = 0.009;

	keyGain.gain.setValueAtTime( 0, 0 );

	for ( const event of plan.events ) {
		const eventStart = startAt + event.start;
		const eventEnd = eventStart + event.duration;
		const sustainStart = Math.min( eventEnd,
			eventStart + attackTime );
		const sustainEnd = Math.max( sustainStart,
			eventEnd - releaseTime );

		keyGain.gain.setValueAtTime( 0, eventStart );
		keyGain.gain.linearRampToValueAtTime( event.level,
			sustainStart );
		keyGain.gain.setValueAtTime( event.level,
			sustainEnd );
		keyGain.gain.exponentialRampToValueAtTime( 0.0001,
			eventEnd );
	}

	const stopAt = startAt + plan.totalDuration + 0.12;

	oscillatorMain.start( startAt );
	oscillatorUpper.start( startAt );
	driftLfo.start( startAt );
	keyedNoiseSource.start( startAt );
	backgroundNoiseSource.start( startAt );

	oscillatorMain.stop( stopAt );
	oscillatorUpper.stop( stopAt );
	driftLfo.stop( stopAt );
	keyedNoiseSource.stop( stopAt );
	backgroundNoiseSource.stop( stopAt );

	playbackState.value = {
		context,
		stopNodes: [
			oscillatorMain,
			oscillatorUpper,
			driftLfo,
			keyedNoiseSource,
			backgroundNoiseSource
		],
		disconnectNodes: [
			oscillatorMain,
			oscillatorUpper,
			driftLfo,
			driftGain,
			keyedNoiseSource,
			backgroundNoiseSource,
			keyedNoiseFilter,
			backgroundNoiseFilter,
			toneMainGain,
			toneUpperGain,
			toneMix,
			keyedNoiseGain,
			backgroundNoiseGain,
			keyGain,
			compressor,
			masterGain
		],
		events: plan.events,
		rafId:  null,
		startAt,
		stopAt
	};

	isPlaying.value = true;

	const tick = () => {
		const current = playbackState.value;

		if ( !current || current.context !== context ) {
			return;
		}

		const elapsed = context.currentTime - current.startAt;
		let currentGroup = null;

		for ( const event of current.events ) {
			if ( elapsed < event.start ) {
				break;
			}

			if ( elapsed >= event.start && elapsed < event.start + event.duration ) {
				currentGroup = event.groupIndex;
				break;
			}
		}

		activeGroupIndex.value = currentGroup;

		if ( context.currentTime < current.stopAt ) {
			current.rafId = window.requestAnimationFrame( tick );
		} else {
			activeGroupIndex.value = null;
		}
	};

	playbackState.value.rafId = window.requestAnimationFrame( tick );

	stopTimerId.value = window.setTimeout( () => {
		void stopPlayback();
	},
	Math.ceil( ( stopAt - context.currentTime ) * 1000 ) + 80 );
}

async function togglePlayback() {
	if ( isPlaying.value ) {
		await stopPlayback();
		return;
	}

	await startPlayback();
}

watch( () => props.text, () => {
	if ( isPlaying.value ) {
		void stopPlayback();
	}
} );

onBeforeUnmount( () => {
	void stopPlayback();
} );
</script>

<style scoped>
.morseContainer {
	background:
		linear-gradient( 135deg, rgba(var(--v-theme-primary), 0.06), rgba(var(--v-theme-info), 0.06) );
}

.headerRow {
	align-items: center;
	display: flex;
	gap: 12px;
	justify-content: space-between;
}

.morseOutput {
	display: block;
	font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
	font-size: 1rem;
	line-height: 1.7;
	white-space: pre-wrap;
	word-break: break-word;
}

.codeGroup {
	border-radius: 6px;
	padding-inline: 1px;
	transition:
		background-color 80ms linear,
		color 80ms linear;
}

.activeCode {
	background: rgba(var(--v-theme-error), 0.14);
	color: rgb(var(--v-theme-error));
	font-weight: 700;
}
</style>
