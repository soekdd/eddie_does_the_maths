<template>
<v-card rounded="lg" variant="outlined">
	<v-card-title class="d-flex flex-wrap align-center ga-3">
		<div>
			<div class="text-h6">{{ title }}</div>
			<div class="text-body-2 text-medium-emphasis">{{ subtitle }}</div>
		</div>
	</v-card-title>

	<v-card-text>
		<p
			v-if="intro"
			class="text-body-1 text-medium-emphasis mb-4"
			v-html="intro"
		/>

		<div v-if="!currentConfiguration" class="text-body-1 text-medium-emphasis">
			Keine QC-Konfigurationen vorhanden.
		</div>

		<template v-else>
			<div class="d-flex flex-wrap align-center ga-3 mb-4">
				<v-btn :disabled="clampedIndex <= 1" variant="outlined" @click="previous">
					Zurück
				</v-btn>

				<div class="index-field">
					<v-text-field
						v-model.number="clampedIndex"
						density="compact"
						hide-details
						label="Index"
						:max="total"
						min="1"
						type="number"
					/>
				</div>

				<v-btn :disabled="clampedIndex >= total" variant="outlined" @click="next">
					Weiter
				</v-btn>

				<div class="text-body-2 text-medium-emphasis">
					{{ clampedIndex }} / {{ total }}
				</div>
			</div>

			<v-slider
				v-model="clampedIndex"
				class="mb-4"
				color="primary"
				hide-details
				:max="Math.max(1, total)"
				:min="1"
				:step="1"
				thumb-label
			/>

			<div class="graph-shell">
				<Transition mode="out-in" :name="transitionName">
					<div :key="stageKey" class="graph-stage" v-html="currentSvg" />
				</Transition>
			</div>
		</template>
	</v-card-text>
</v-card>
</template>

<script setup lang="ts">
import {
	computed, ref, watch
} from "vue";
import type { QCConfiguration } from "./parser";
import { renderSVG } from "./visualize";

const props = withDefaults( defineProps<{
  configurations?: QCConfiguration[]
  modelValue?: number
  width?: number
  height?: number
  nodeRadius?: number
  intro?: string
  title?: string
}>(), {
	configurations: () => [],
	modelValue:     1,
	width:          640,
	height:         640,
	nodeRadius:     6,
	intro:          "",
	title:          "QC Graph"
} );

const emit = defineEmits<{
  ( e: "update:modelValue", value: number ): void
}>();

const localIndex = ref( Math.max( 1, props.modelValue ) );
const stageKey = ref( 0 );
const navDirection = ref<"next" | "prev">( "next" );

watch( () => props.modelValue, ( value ) => {
	localIndex.value = Math.max( 1, value );
} );

watch( localIndex, ( value, oldValue ) => {
	navDirection.value = value >= ( oldValue ?? value ) ? "next" : "prev";
	stageKey.value += 1;
	emit( "update:modelValue", value );
} );

const total = computed( () => props.configurations.length );

const clampedIndex = computed( {
	get() {
		if ( total.value === 0 ) {
			return 1;
		}

		return Math.min( Math.max( 1, localIndex.value ), total.value );
	},
	set( value: number ) {
		if ( total.value === 0 ) {
			localIndex.value = 1;
			return;
		}

		localIndex.value = Math.min( Math.max( 1, value ), total.value );
	}
} );

const currentConfiguration = computed( () => {
	if ( total.value === 0 ) {
		return null;
	}

	return props.configurations[ clampedIndex.value - 1 ] ?? null;
} );

const currentSvg = computed( () => {
	const cfg = currentConfiguration.value;

	if ( !cfg ) {
		return "";
	}

	return renderSVG( cfg, {
		width:      props.width,
		height:     props.height,
		showLabels: true,
		nodeRadius: props.nodeRadius
	} );
} );

const subtitle = computed( () => {
	const cfg = currentConfiguration.value;

	if ( !cfg ) {
		return "Keine Konfiguration geladen";
	}

	return `#${cfg.name} · |V|=${cfg.vertexCount} · Ring=${cfg.ringSize} · Ext=${cfg.extendableColorings}`;
} );

const transitionName = computed( () => {
	return navDirection.value === "next" ? "graph-next" : "graph-prev";
} );

function previous() {
	clampedIndex.value = clampedIndex.value - 1;
}

function next() {
	clampedIndex.value = clampedIndex.value + 1;
}
</script>

<style scoped>
.index-field {
  width: 110px;
}

.graph-shell {
  width: 100%;
  overflow: auto;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
  position: relative;
  display: flex;
  justify-content: center;
}

.graph-stage {
  width: max-content;
  padding: 12px;
  margin-inline: auto;
}

.graph-stage :deep(svg) {
  display: block;
  max-width: 100%;
  height: auto;
  margin-inline: auto;
}

.graph-next-enter-active,
.graph-next-leave-active,
.graph-prev-enter-active,
.graph-prev-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}

.graph-next-enter-from {
  opacity: 0;
  transform: translateX(24px) scale(0.98);
}

.graph-next-leave-to {
  opacity: 0;
  transform: translateX(-24px) scale(0.98);
}

.graph-prev-enter-from {
  opacity: 0;
  transform: translateX(-24px) scale(0.98);
}

.graph-prev-leave-to {
  opacity: 0;
  transform: translateX(24px) scale(0.98);
}
</style>
