<template>
<div
	ref="rubikCubeElement"
	:aria-label="t( 'controls.cubeAria' )"
	class="rubikCube"
	:class="isDarkTheme ? 'rubikCube--dark' : 'rubikCube--light'"
	role="application"
	@pointercancel="endDrag"
	@pointerdown="startDrag"
	@pointermove="dragCube"
	@pointerup="endDrag"
>
	<TresCanvas
		alpha
		antialias
		class="rubikCubeCanvas"
		:clear-alpha="0"
		:shadows="true"
	>
		<TresPerspectiveCamera
			:far="100"
			:fov="CAMERA_FOV"
			:look-at="[ 0, 0, 0 ]"
			:near="0.1"
			:position="CAMERA_POSITION"
		/>
		<TresAmbientLight :intensity="1.8" />
		<TresDirectionalLight
			:cast-shadow="true"
			:intensity="4.2"
			:position="[ 5, 8, 7 ]"
		/>
		<TresDirectionalLight
			:intensity="2"
			:position="[ -5, -2, 4 ]"
		/>

		<TresGroup :rotation="displayCubeRotation">
			<TresGroup v-if="activeMove" :rotation="moveRotation">
				<TresGroup
					v-for="cubie in movingCubies"
					:key="cubie.id"
					:position="positionArray( cubie.position )"
				>
					<TresMesh cast-shadow receive-shadow>
						<TresBoxGeometry :args="[ 0.94, 0.94, 0.94 ]" />
						<TresMeshStandardMaterial :color="BODY_COLOR" :roughness="0.68" />
					</TresMesh>
					<TresMesh
						v-for="sticker in cubie.stickers"
						:key="stickerKey( sticker )"
						:position="stickerPosition( sticker.normal )"
						:rotation="stickerRotation( sticker.normal )"
					>
						<TresPlaneGeometry :args="[ 0.76, 0.76 ]" />
						<TresMeshStandardMaterial
							:color="sticker.color"
							:metalness="0.02"
							:roughness="0.48"
						/>
					</TresMesh>
				</TresGroup>
			</TresGroup>

			<TresGroup
				v-for="cubie in stationaryCubies"
				:key="cubie.id"
				:position="positionArray( cubie.position )"
			>
				<TresMesh cast-shadow receive-shadow>
					<TresBoxGeometry :args="[ 0.94, 0.94, 0.94 ]" />
					<TresMeshStandardMaterial :color="BODY_COLOR" :roughness="0.68" />
				</TresMesh>
				<TresMesh
					v-for="sticker in cubie.stickers"
					:key="stickerKey( sticker )"
					:position="stickerPosition( sticker.normal )"
					:rotation="stickerRotation( sticker.normal )"
				>
					<TresPlaneGeometry :args="[ 0.76, 0.76 ]" />
					<TresMeshStandardMaterial
						:color="sticker.color"
						:metalness="0.02"
						:roughness="0.48"
					/>
				</TresMesh>
			</TresGroup>
		</TresGroup>
	</TresCanvas>

	<div
		ref="solutionCounterElement"
		:aria-hidden="solutionMoveCount === null"
		class="solutionCounter"
		:class="{ 'solutionCounter--hidden': solutionMoveCount === null }"
	>
		{{ t( "controls.moveCount", { count: solutionMoveCount ?? 0 } ) }}
	</div>

	<div
		v-for="face in FACE_MOVES"
		v-show="!controlsDisabled"
		:key="face.name"
		class="faceControl"
		:style="faceControlStyles[ face.name ]"
		@pointerdown.stop
	>
		<span class="faceControlLabel">{{ face.name }}</span>
		<button
			:aria-label="t( 'controls.faceCounterclockwise', { face: face.name } )"
			class="turnButton"
			:disabled="controlsDisabled"
			:title="t( 'controls.faceCounterclockwise', { face: face.name } )"
			type="button"
			@click.stop="turnFace( face, false )"
		>
			&#8634;
		</button>
		<button
			:aria-label="t( 'controls.faceClockwise', { face: face.name } )"
			class="turnButton"
			:disabled="controlsDisabled"
			:title="t( 'controls.faceClockwise', { face: face.name } )"
			type="button"
			@click.stop="turnFace( face, true )"
		>
			&#8635;
		</button>
	</div>
</div>
</template>

<script setup>
import {
	computed, onBeforeUnmount, onMounted, ref
} from "vue";
import { TresCanvas } from "@tresjs/core";
import { useTheme } from "vuetify";
import { useI18n } from "@/utils/i18n.mjs";
import { createCubeSolver, isCubeSolved } from "./RC_solvers.mjs";
import {
	Euler, MathUtils, PerspectiveCamera, Vector3
} from "three";

const BODY_COLOR = "#111318";
const CAMERA_FOV = 38;
const CAMERA_POSITION = [ 6.4, 5.4, 7.2 ];
const CONTROL_HALF_HEIGHT = 18;
const CONTROL_HALF_WIDTH = 46;
const CONTROL_EDGE_PADDING = 48;
const CONTROL_RADIUS = 4;
const SCRAMBLE_MOVE_COUNT = 20;
const SCRAMBLE_TURN_DURATION_MS = 60;
const SOLUTION_ROTATION_SPEED = Math.PI / 10;
const STICKER_OFFSET = 0.476;
const TURN_DURATION_MS = 220;
const FACE_MOVES = [
	{
		name: "U", axis: "y", layer: 1
	},
	{
		name: "D", axis: "y", layer: -1
	},
	{
		name: "L", axis: "x", layer: -1
	},
	{
		name: "R", axis: "x", layer: 1
	},
	{
		name: "F", axis: "z", layer: 1
	},
	{
		name: "B", axis: "z", layer: -1
	}
];
const FACE_STICKERS = [
	{
		axis: "x", layer: 1, color: "#d62828"
	},
	{
		axis: "x", layer: -1, color: "#f77f00"
	},
	{
		axis: "y", layer: 1, color: "#f8f9fa"
	},
	{
		axis: "y", layer: -1, color: "#ffd500"
	},
	{
		axis: "z", layer: 1, color: "#2a9d4b"
	},
	{
		axis: "z", layer: -1, color: "#1769d2"
	}
];

function axisVector( axis,
	layer ) {
	return {
		x: axis === "x" ? layer : 0,
		y: axis === "y" ? layer : 0,
		z: axis === "z" ? layer : 0
	};
}

function createCubies() {
	const result = [];

	for ( let x = -1; x <= 1; x += 1 ) {
		for ( let y = -1; y <= 1; y += 1 ) {
			for ( let z = -1; z <= 1; z += 1 ) {
				if ( x === 0 && y === 0 && z === 0 ) {
					continue;
				}

				const position = {
					x, y, z
				};
				const stickers = FACE_STICKERS
					.filter( ( face ) => position[ face.axis ] === face.layer )
					.map( ( face ) => ( {
						color:  face.color,
						normal: axisVector( face.axis, face.layer )
					} ) );

				result.push( {
					id: `cubie-${x}-${y}-${z}`,
					position,
					stickers
				} );
			}
		}
	}

	return result;
}

const cubies = ref( createCubies() );
const activeMove = ref( null );
const animatedAngle = ref( 0 );
const cubeRotation = ref( [ 0, 0, 0 ] );
const dragState = ref( null );
const isRunningSequence = ref( false );
const moveHistory = ref( [] );
const rubikCubeElement = ref( null );
const solutionCounterElement = ref( null );
const solutionMoveCount = ref( null );
const solutionRotationZ = ref( 0 );
const viewportSize = ref( {
	height: 660,
	width:  860
} );
const counterBounds = ref( {
	bottom: 0,
	left:   0,
	right:  0,
	top:    0
} );
const projectionCamera = new PerspectiveCamera(
	CAMERA_FOV, viewportSize.value.width / viewportSize.value.height, 0.1, 100
);
projectionCamera.position.fromArray( CAMERA_POSITION );
projectionCamera.lookAt(
	0, 0, 0
);
projectionCamera.updateMatrixWorld();
const { t } = useI18n( "book1.RC" );
const theme = useTheme();
const isDarkTheme = computed( () => theme.global.current.value.dark );
let animationFrame = 0;
let animationResolve = null;
let resizeObserver = null;
let solutionRotationFrame = 0;
let solutionRotationTimestamp = 0;

const movingCubies = computed( () => activeMove.value ? cubies.value.filter( ( cubie ) =>
	cubie.position[ activeMove.value.axis ] === activeMove.value.layer ) : [] );
const stationaryCubies = computed( () => activeMove.value ? cubies.value.filter( ( cubie ) =>
	cubie.position[ activeMove.value.axis ] !== activeMove.value.layer ) : cubies.value );
const moveRotation = computed( () => [
	activeMove.value?.axis === "x" ? animatedAngle.value : 0,
	activeMove.value?.axis === "y" ? animatedAngle.value : 0,
	activeMove.value?.axis === "z" ? animatedAngle.value : 0
] );
const displayCubeRotation = computed( () => [
	cubeRotation.value[ 0 ],
	cubeRotation.value[ 1 ],
	cubeRotation.value[ 2 ] + solutionRotationZ.value
] );
const controlsDisabled = computed( () => Boolean( activeMove.value ) || isRunningSequence.value );
const solveDisabled = computed( () => controlsDisabled.value || moveHistory.value.length === 0 );
const methodSolveDisabled = computed( () => controlsDisabled.value || isCubeSolved( cubies.value ) );
const faceControlStyles = computed( () => {
	const { height, width } = viewportSize.value;
	const rotation = new Euler( ...displayCubeRotation.value );
	const styles = {};

	projectionCamera.aspect = width / height;
	projectionCamera.updateProjectionMatrix();

	for ( const face of FACE_MOVES ) {
		const normal = axisVector( face.axis, face.layer );
		const projected = new Vector3(
			normal.x * CONTROL_RADIUS,
			normal.y * CONTROL_RADIUS,
			normal.z * CONTROL_RADIUS
		)
			.applyEuler( rotation )
			.project( projectionCamera );
		const x = MathUtils.clamp(
			( projected.x + 1 ) * width / 2,
			CONTROL_EDGE_PADDING,
			width - CONTROL_EDGE_PADDING
		);
		let y = MathUtils.clamp(
			( 1 - projected.y ) * height / 2,
			CONTROL_EDGE_PADDING / 2,
			height - CONTROL_EDGE_PADDING / 2
		);
		const counter = counterBounds.value;
		const overlapsCounter = solutionMoveCount.value !== null &&
			x + CONTROL_HALF_WIDTH >= counter.left &&
			x - CONTROL_HALF_WIDTH <= counter.right &&
			y + CONTROL_HALF_HEIGHT >= counter.top &&
			y - CONTROL_HALF_HEIGHT <= counter.bottom;

		if ( overlapsCounter ) {
			y = counter.top - CONTROL_HALF_HEIGHT - 8;
		}

		styles[ face.name ] = {
			left: `${x}px`,
			top:  `${y}px`
		};
	}

	return styles;
} );

function positionArray( position ) {
	return [ position.x, position.y, position.z ];
}

function stickerPosition( normal ) {
	return [
		normal.x * STICKER_OFFSET,
		normal.y * STICKER_OFFSET,
		normal.z * STICKER_OFFSET
	];
}

function stickerRotation( normal ) {
	if ( normal.x !== 0 ) {
		return [ 0, normal.x * Math.PI / 2, 0 ];
	}

	if ( normal.y !== 0 ) {
		return [ -normal.y * Math.PI / 2, 0, 0 ];
	}

	return normal.z > 0 ? [ 0, 0, 0 ] : [ 0, Math.PI, 0 ];
}

function stickerKey( sticker ) {
	const { normal } = sticker;
	return `${sticker.color}-${normal.x}-${normal.y}-${normal.z}`;
}

function rotateVector(
	vector,
	axis,
	direction
) {
	const {
		x, y, z
	} = vector;

	if ( axis === "x" ) {
		return direction > 0 ? {
			x, y: -z, z: y
		} : {
			x, y: z, z: -y
		};
	}

	if ( axis === "y" ) {
		return direction > 0 ? {
			x: z, y, z: -x
		} : {
			x: -z, y, z: x
		};
	}

	return direction > 0 ? {
		x: -y, y: x, z
	} : {
		x: y, y: -x, z
	};
}

function applyMove( move ) {
	for ( let turn = 0; turn < ( move.turns ?? 1 ); turn += 1 ) {
		for ( const cubie of cubies.value ) {
			if ( cubie.position[ move.axis ] !== move.layer ) {
				continue;
			}

			cubie.position = rotateVector(
				cubie.position, move.axis, move.direction
			);

			for ( const sticker of cubie.stickers ) {
				sticker.normal = rotateVector(
					sticker.normal, move.axis, move.direction
				);
			}
		}
	}
}

function easeInOut( progress ) {
	return progress < 0.5 ? 2 * progress * progress : 1 - Math.pow( -2 * progress + 2, 2 ) / 2;
}

function animateMove( move ) {
	if ( activeMove.value ) {
		return Promise.resolve( false );
	}

	const startedAt = performance.now();

	activeMove.value = move;
	animatedAngle.value = 0;

	return new Promise( ( resolve ) => {
		animationResolve = resolve;

		const animate = ( timestamp ) => {
			const duration = move.duration ?? TURN_DURATION_MS;
			const progress = MathUtils.clamp(
				( timestamp - startedAt ) / duration, 0, 1
			);
			animatedAngle.value = move.direction * Math.PI / 2 * ( move.turns ?? 1 ) * easeInOut( progress );

			if ( progress < 1 ) {
				animationFrame = requestAnimationFrame( animate );
				return;
			}

			applyMove( move );
			activeMove.value = null;
			animatedAngle.value = 0;
			animationFrame = 0;
			animationResolve = null;
			resolve( true );
		};

		animationFrame = requestAnimationFrame( animate );
	} );
}

async function turnFace( face,
	clockwise ) {
	const move = {
		...face,
		direction: clockwise ? -face.layer : face.layer
	};
	const completed = await animateMove( move );

	if ( completed ) {
		moveHistory.value.push( move );
	}
}

function createScrambleMoves() {
	const moves = [];

	while ( moves.length < SCRAMBLE_MOVE_COUNT ) {
		const candidates = FACE_MOVES.filter( ( face ) => face.axis !== moves.at( -1 )?.axis );
		const face = candidates[ Math.floor( Math.random() * candidates.length ) ];
		const clockwise = Math.random() >= 0.5;

		moves.push( {
			...face,
			direction: clockwise ? -face.layer : face.layer
		} );
	}

	return moves;
}

async function scrambleCube() {
	if ( controlsDisabled.value ) {
		return false;
	}

	const scrambleMoves = createScrambleMoves();

	solutionMoveCount.value = null;
	cubies.value = createCubies();
	moveHistory.value = [];
	isRunningSequence.value = true;

	try {
		for ( const move of scrambleMoves ) {
			const completed = await animateMove( {
				...move,
				duration: SCRAMBLE_TURN_DURATION_MS
			} );

			if ( !completed ) {
				return false;
			}

			moveHistory.value.push( move );
		}
	} finally {
		isRunningSequence.value = false;
	}

	return true;
}

async function solveWithMethod( solverId ) {
	const disabled = solverId === "history" ? solveDisabled.value : methodSolveDisabled.value;

	if ( disabled ) {
		return false;
	}

	await runSolver( solverId );
	return true;
}

async function runSolver( solverId ) {
	const solver = createCubeSolver( solverId );
	const plan = solver.solve( {
		cubies:  cubies.value,
		history: moveHistory.value
	} );
	const solution = plan.phases.flatMap( ( phase ) => phase.moves );

	isRunningSequence.value = true;
	moveHistory.value = [];
	solutionMoveCount.value = 0;
	startSolutionRotation();

	try {
		for ( const move of solution ) {
			const completed = await animateMove( move );

			if ( !completed ) {
				break;
			}

			solutionMoveCount.value += 1;
		}
	} finally {
		stopSolutionRotation();
		isRunningSequence.value = false;
	}
}

function startSolutionRotation() {
	solutionRotationTimestamp = performance.now();

	const rotate = ( timestamp ) => {
		const elapsedSeconds = Math.min( timestamp - solutionRotationTimestamp, 100 ) / 1000;

		solutionRotationTimestamp = timestamp;
		solutionRotationZ.value += elapsedSeconds * SOLUTION_ROTATION_SPEED;
		solutionRotationFrame = requestAnimationFrame( rotate );
	};

	solutionRotationFrame = requestAnimationFrame( rotate );
}

function stopSolutionRotation( preserveOrientation = true ) {
	if ( solutionRotationFrame ) {
		cancelAnimationFrame( solutionRotationFrame );
		solutionRotationFrame = 0;
	}

	if ( preserveOrientation ) {
		cubeRotation.value = [
			cubeRotation.value[ 0 ],
			cubeRotation.value[ 1 ],
			MathUtils.euclideanModulo( cubeRotation.value[ 2 ] + solutionRotationZ.value + Math.PI,
				Math.PI * 2 ) - Math.PI
		];
	}

	solutionRotationZ.value = 0;
}

function startDrag( event ) {
	if ( event.button !== undefined && event.button !== 0 ) {
		return;
	}

	event.currentTarget.setPointerCapture?.( event.pointerId );
	dragState.value = {
		pointerId: event.pointerId,
		x:         event.clientX,
		y:         event.clientY
	};
}

function dragCube( event ) {
	const drag = dragState.value;

	if ( !drag || drag.pointerId !== event.pointerId ) {
		return;
	}

	const deltaX = event.clientX - drag.x;
	const deltaY = event.clientY - drag.y;

	cubeRotation.value = [
		MathUtils.clamp(
			cubeRotation.value[ 0 ] + deltaY * 0.009, -1.45, 1.45
		),
		cubeRotation.value[ 1 ] + deltaX * 0.009,
		cubeRotation.value[ 2 ]
	];
	drag.x = event.clientX;
	drag.y = event.clientY;
}

function endDrag( event ) {
	if ( dragState.value?.pointerId !== event.pointerId ) {
		return;
	}

	event.currentTarget.releasePointerCapture?.( event.pointerId );
	dragState.value = null;
}

function updateViewportSize() {
	const element = rubikCubeElement.value;
	const counter = solutionCounterElement.value;

	if ( !element ) {
		return;
	}

	viewportSize.value = {
		height: element.clientHeight,
		width:  element.clientWidth
	};

	if ( counter ) {
		const elementRect = element.getBoundingClientRect();
		const counterRect = counter.getBoundingClientRect();

		counterBounds.value = {
			bottom: counterRect.bottom - elementRect.top,
			left:   counterRect.left - elementRect.left,
			right:  counterRect.right - elementRect.left,
			top:    counterRect.top - elementRect.top
		};
	}
}

onMounted( () => {
	updateViewportSize();

	if ( globalThis.ResizeObserver ) {
		resizeObserver = new globalThis.ResizeObserver( updateViewportSize );
		resizeObserver.observe( rubikCubeElement.value );
		resizeObserver.observe( solutionCounterElement.value );
	}
} );

defineExpose( {
	controlsDisabled,
	methodSolveDisabled,
	scramble: scrambleCube,
	solve:    solveWithMethod,
	solveDisabled
} );

onBeforeUnmount( () => {
	resizeObserver?.disconnect();
	stopSolutionRotation( false );

	if ( animationFrame ) {
		cancelAnimationFrame( animationFrame );
		animationResolve?.( false );
	}
} );
</script>

<style scoped>
.rubikCube {
	border: 1px solid;
	border-radius: 18px;
	cursor: grab;
	height: clamp(430px, 64vw, 660px);
	overflow: hidden;
	position: relative;
	touch-action: none;
	user-select: none;
	width: 100%;
}

.rubikCube--dark {
	background:
		radial-gradient(circle at 50% 42%, rgba(78, 119, 178, 0.2), transparent 42%),
		linear-gradient(145deg, rgba(8, 13, 24, 0.92), rgba(24, 34, 52, 0.88));
	border-color: rgba(142, 171, 213, 0.3);
}

.rubikCube--light {
	background:
		radial-gradient(circle at 50% 42%, rgba(90, 139, 204, 0.16), transparent 44%),
		linear-gradient(145deg, rgba(250, 252, 255, 0.98), rgba(218, 229, 244, 0.94));
	border-color: rgba(75, 101, 139, 0.28);
}

.rubikCube:active {
	cursor: grabbing;
}

.rubikCubeCanvas {
	height: 100% !important;
	width: 100% !important;
}

.solutionCounter {
	background: rgba(12, 18, 29, 0.84);
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 8px;
	bottom: 14px;
	color: #fff;
	font: 600 0.875rem/1 system-ui, sans-serif;
	font-variant-numeric: tabular-nums;
	min-width: 74px;
	opacity: 1;
	padding: 9px 12px;
	pointer-events: none;
	position: absolute;
	right: 14px;
	text-align: center;
	transition: opacity 120ms ease;
	z-index: 3;
}

.solutionCounter--hidden {
	opacity: 0;
	visibility: hidden;
}

.faceControl {
	align-items: center;
	background: rgba(12, 18, 29, 0.8);
	border: 1px solid rgba(255, 255, 255, 0.22);
	border-radius: 999px;
	box-shadow: 0 3px 12px rgba(0, 0, 0, 0.28);
	cursor: default;
	display: flex;
	gap: 3px;
	padding: 3px;
	position: absolute;
	transform: translate(-50%, -50%);
}

.faceControlLabel {
	color: #fff;
	font: 700 0.75rem/1 system-ui, sans-serif;
	padding: 0 3px 0 5px;
}

.turnButton {
	align-items: center;
	background: rgba(255, 255, 255, 0.12);
	border: 0;
	border-radius: 50%;
	color: #fff;
	cursor: pointer;
	display: inline-flex;
	font: 700 1rem/1 system-ui, sans-serif;
	height: 28px;
	justify-content: center;
	padding: 0;
	transition: background 120ms ease, transform 120ms ease;
	width: 28px;
}

.turnButton:hover:not(:disabled),
.turnButton:focus-visible {
	background: rgba(94, 160, 255, 0.62);
	outline: 2px solid rgba(255, 255, 255, 0.85);
	transform: scale(1.08);
}

.turnButton:disabled {
	cursor: wait;
	opacity: 0.45;
}

@media (max-width: 600px) {
	.rubikCube {
		height: 470px;
	}
}
</style>
