<template>
<div class="ipControl">
	<div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-3">
		<div>
			<h2 id="interaktiv" class="mb-1">{{ t( "sections.interactive.title" ) }}</h2>
			<p class="muted mb-0" v-html="t( 'sections.interactive.intro' )" />
		</div>
		<v-chip :color="status.color" variant="tonal">
			{{ status.text }}
		</v-chip>
	</div>

	<div class="graphShell">
		<IPGraph
			:aria-label="t( 'control.graphAria' )"
			:cart-mass="MODEL.cartMass"
			:force-limited="saturated"
			:force-u="displayForce"
			:gravity="MODEL.gravity"
			:height="460"
			:length-l="MODEL.length"
			:mass="MODEL.pendulumMass"
			:position-x="displayX"
			:show-parameter-panel="false"
			:theta="displayTheta"
			:unstable="fallen"
			:width="860"
			:x-scale="76"
		/>
	</div>

	<div class="controlBar">
		<v-btn color="primary" variant="flat" @click="shove( -1 )">
			<v-icon :icon="mdiArrowLeftBold" start />
			{{ t( "control.buttons.shoveLeft" ) }}
		</v-btn>
		<v-btn color="primary" variant="flat" @click="shove( 1 )">
			{{ t( "control.buttons.shoveRight" ) }}
			<v-icon end :icon="mdiArrowRightBold" />
		</v-btn>
		<v-btn variant="tonal" @click="toggleRunning">
			<v-icon :icon="running ? mdiPause : mdiPlay" start />
			{{ running ? t( "control.buttons.pause" ) : t( "control.buttons.play" ) }}
		</v-btn>
		<v-btn variant="tonal" @click="reset">
			<v-icon :icon="mdiRestart" start />
			{{ t( "control.buttons.reset" ) }}
		</v-btn>
	</div>

	<v-row dense>
		<v-col cols="12" md="5">
			<v-sheet border class="pa-3 rounded fill-height">
				<div class="text-subtitle-2 mb-1">{{ t( "control.shoveStrength" ) }}</div>
				<v-slider
					v-model="shoveStrength"
					hide-details
					max="1.5"
					min="0.4"
					step="0.05"
					thumb-label
				/>
				<p class="muted mb-0">{{ t( "control.shoveHint" ) }}</p>
			</v-sheet>
		</v-col>
		<v-col cols="12" md="7">
			<v-sheet border class="pa-3 rounded fill-height">
				<v-table density="compact">
					<tbody>
						<tr>
							<td><Katex tex="\theta" /></td>
							<td class="mono text-right">{{ fmt( thetaDeg, 2 ) }}°</td>
						</tr>
						<tr>
							<td><Katex tex="\dot{\theta}" /></td>
							<td class="mono text-right">{{ fmt( state.thetaDot, 2 ) }} rad/s</td>
						</tr>
						<tr>
							<td><Katex tex="x" /></td>
							<td class="mono text-right">{{ fmt( state.x, 2 ) }} m</td>
						</tr>
						<tr>
							<td><Katex tex="u=-Kz" /></td>
							<td class="mono text-right">{{ fmt( state.force, 1 ) }} N</td>
						</tr>
					</tbody>
				</v-table>
			</v-sheet>
		</v-col>
	</v-row>

	<div class="kbox">
		<Katex
			aligned
			as="div"
			display
			tex="z&=(x,\dot{x},\theta,\dot{\theta})^\top \\ u&=-Kz \\ K&=(-10{,}61,\,-24{,}08,\,-824{,}00,\,-95{,}13)"
		/>
	</div>
</div>
</template>

<script setup>
import {
	computed,
	onBeforeUnmount,
	onMounted,
	reactive,
	ref
} from "vue";
import {
	mdiArrowLeftBold,
	mdiArrowRightBold,
	mdiPause,
	mdiPlay,
	mdiRestart
} from "@mdi/js";
import { useI18n } from "@/utils/i18n.mjs";
import IPGraph from "./IP_Graph.vue";

const MODEL = Object.freeze( {
	cartMass:     8,
	pendulumMass: 55,
	length:       0.95,
	gravity:      9.81,
	maxForce:     220
} );

// Pole-placement gain for the linearized model with poles -1.2, -1.6, -2.2, -2.8.
const K = Object.freeze( [ -10.6095, -24.0838, -824.0045, -95.1322 ] );
const FIXED_DT = 1 / 180;
const MAX_FRAME_DT = 0.08;
const FALL_ANGLE_RAD = 1.25;
const FALL_POSITION_M = 4.2;

const { locale, t } = useI18n( "book1.IP" );
const running = ref( true );
const fallen = ref( false );
const saturated = ref( false );
const shoveStrength = ref( 1.15 );
const state = reactive( {
	x:        0,
	xDot:     0,
	theta:    0.08,
	thetaDot: 0,
	force:    0,
	rawForce: 0
} );

let rafId = 0;
let lastFrameMs = 0;
let accumulator = 0;

const thetaDeg = computed( () => state.theta * 180 / Math.PI );
const displayX = computed( () => clamp(
	state.x, -4.2, 4.2
) );
const displayTheta = computed( () => clamp(
	state.theta, -1.35, 1.35
) );
const displayForce = computed( () => state.force );
const status = computed( () => {
	if ( fallen.value ) {
		return {
			color: "warning",
			text:  t( "control.status.fallen" )
		};
	}

	if ( saturated.value && Math.abs( state.theta ) > 0.18 ) {
		return {
			color: "warning",
			text:  t( "control.status.saturated" )
		};
	}

	if ( Math.abs( state.theta ) < 0.025 && Math.abs( state.thetaDot ) < 0.05 && Math.abs( state.x ) < 0.06 ) {
		return {
			color: "success",
			text:  t( "control.status.stable" )
		};
	}

	return {
		color: "info",
		text:  t( "control.status.active" )
	};
} );

function clamp(
	value,
	min,
	max
) {
	return Math.min( max, Math.max( min, value ) );
}

function readStateVector() {
	return [
		state.x,
		state.xDot,
		state.theta,
		state.thetaDot
	];
}

function controlFor( z ) {
	const rawForce = -( K[ 0 ] * z[ 0 ] + K[ 1 ] * z[ 1 ] + K[ 2 ] * z[ 2 ] + K[ 3 ] * z[ 3 ] );
	const force = clamp(
		rawForce,
		-MODEL.maxForce,
		MODEL.maxForce
	);

	return {
		force,
		rawForce,
		isSaturated: Math.abs( rawForce - force ) > 1e-6
	};
}

function derivatives( z ) {
	const { force } = controlFor( z );
	const [
		_x,
		xDot,
		theta,
		thetaDot
	] = z;
	const sinTheta = Math.sin( theta );
	const cosTheta = Math.cos( theta );
	const denominator = MODEL.cartMass + MODEL.pendulumMass - MODEL.pendulumMass * cosTheta * cosTheta;
	const xDDot = (
		force -
		MODEL.pendulumMass * MODEL.gravity * sinTheta * cosTheta +
		MODEL.pendulumMass * MODEL.length * sinTheta * thetaDot * thetaDot
	) / denominator;
	const thetaDDot = ( MODEL.gravity * sinTheta - cosTheta * xDDot ) / MODEL.length;

	return [
		xDot,
		xDDot,
		thetaDot,
		thetaDDot
	];
}

function addScaled(
	z,
	dz,
	scale
) {
	return z.map( ( value,
		index ) => value + dz[ index ] * scale );
}

function integrate( dt ) {
	const z = readStateVector();
	const k1 = derivatives( z );
	const k2 = derivatives( addScaled(
		z, k1, dt / 2
	) );
	const k3 = derivatives( addScaled(
		z, k2, dt / 2
	) );
	const k4 = derivatives( addScaled(
		z, k3, dt
	) );
	const next = z.map( ( value,
		index ) => value + dt / 6 * ( k1[ index ] + 2 * k2[ index ] + 2 * k3[ index ] + k4[ index ] ) );

	state.x = next[ 0 ];
	state.xDot = next[ 1 ];
	state.theta = next[ 2 ];
	state.thetaDot = next[ 3 ];

	const control = controlFor( next );
	state.force = control.force;
	state.rawForce = control.rawForce;
	saturated.value = control.isSaturated;

	if ( Math.abs( state.theta ) > FALL_ANGLE_RAD || Math.abs( state.x ) > FALL_POSITION_M ) {
		fallen.value = true;
		running.value = false;
	}
}

function tick( nowMs ) {
	const frameDt = lastFrameMs > 0 ?
		Math.min( MAX_FRAME_DT, ( nowMs - lastFrameMs ) / 1000 ) :
		0;

	lastFrameMs = nowMs;

	if ( running.value && !fallen.value ) {
		accumulator += frameDt;

		while ( accumulator >= FIXED_DT ) {
			integrate( FIXED_DT );
			accumulator -= FIXED_DT;
		}
	}

	rafId = requestAnimationFrame( tick );
}

function reset() {
	state.x = 0;
	state.xDot = 0;
	state.theta = 0.08;
	state.thetaDot = 0;
	const control = controlFor( readStateVector() );
	state.force = control.force;
	state.rawForce = control.rawForce;
	saturated.value = control.isSaturated;
	fallen.value = false;
	running.value = true;
	accumulator = 0;
}

function shove( direction ) {
	if ( fallen.value ) {
		reset();
	}

	const sign = direction < 0 ? -1 : 1;
	state.theta += sign * 0.018;
	state.thetaDot += sign * shoveStrength.value;
	state.xDot -= sign * 0.08;
	fallen.value = false;
	running.value = true;
}

function toggleRunning() {
	running.value = !running.value;
}

function fmt( value,
	digits = 2 ) {
	if ( !Number.isFinite( value ) ) {
		return "-";
	}

	return new Intl.NumberFormat( locale.value, {
		maximumFractionDigits: digits,
		minimumFractionDigits: digits
	} ).format( value );
}

onMounted( () => {
	reset();
	lastFrameMs = performance.now();
	rafId = requestAnimationFrame( tick );
} );

onBeforeUnmount( () => {
	if ( rafId ) {
		cancelAnimationFrame( rafId );
	}
} );
</script>

<style scoped>
.ipControl {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.graphShell {
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
}

.controlBar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
