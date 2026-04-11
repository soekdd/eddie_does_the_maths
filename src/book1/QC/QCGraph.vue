<!-- i18n-ally-scope: useI18n("book1.QC") -->
<template>
<v-card>
	<v-card-title class="d-flex flex-wrap align-center ga-3">
		<div>
			<div class="text-h6">{{ displayTitle }}</div>
			<div class="text-body-2 text-medium-emphasis">{{ subtitle }}</div>
		</div>
	</v-card-title>

	<v-card-text>
		<p
			v-if="intro"
			class="text-body-1 text-medium-emphasis mb-4"
			v-html="intro"
		/>

		<v-alert
			v-if="!currentConfiguration"
			border="start"
			density="comfortable"
			type="info"
			variant="tonal"
		>
			{{ t( "sections.interactive.graphControls.empty" ) }}
		</v-alert>

		<template v-else>
			<v-sheet border class="control-panel mb-4 pa-3">
				<div class="control-row">
					<v-btn-group color="primary" density="comfortable" variant="tonal">
						<v-btn
							class="mr-2"
							:disabled="clampedIndex <= 1"
							prepend-icon="mdi-chevron-left"
							@click="previous"
						>
							{{ t( "sections.interactive.graphControls.previous" ) }}
						</v-btn>
						<v-btn
							append-icon="mdi-chevron-right"
							:disabled="clampedIndex >= total"
							@click="next"
						>
							{{ t( "sections.interactive.graphControls.next" ) }}
						</v-btn>
					</v-btn-group>

					<v-number-input
						v-model="indexFieldValue"
						class="index-field"
						control-variant="stacked"
						density="compact"
						hide-details="auto"
						:label="t( 'sections.interactive.graphControls.index' )"
						:max="total"
						:min="1"
						:precision="0"
						:step="1"
						variant="outlined"
					/>

					<v-chip color="primary" size="default" variant="tonal">
						{{ clampedIndex }} / {{ total }}
					</v-chip>
				</div>

				<div class="text-caption text-medium-emphasis mb-2 mt-3">
					{{ t( "sections.interactive.graphControls.choose" ) }}
				</div>

				<v-slider
					v-model="clampedIndex"
					color="primary"
					hide-details
					:max="Math.max(1, total)"
					:min="1"
					:step="1"
					thumb-label
				/>
			</v-sheet>

			<v-sheet border class="graph-shell" rounded="xl">
				<Transition mode="out-in" :name="transitionName">
					<div :key="stageKey" class="graph-stage" v-html="currentSvg" />
				</Transition>
			</v-sheet>
		</template>
	</v-card-text>
</v-card>
</template>

<script setup lang="ts">
import {
	computed, ref, watch
} from "vue";
import { useI18n } from "@/utils/i18n.mjs";
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
	title:          ""
} );

const emit = defineEmits<{
  ( e: "update:modelValue", value: number ): void
}>();
const { t } = useI18n( "book1.QC" );

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

const indexFieldValue = computed( {
	get() {
		return clampedIndex.value;
	},
	set( value ) {
		const normalized = typeof value === "number" ? value : Number( value );
		clampedIndex.value = Number.isFinite( normalized ) ? normalized : 1;
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

const displayTitle = computed( () => props.title || t( "sections.interactive.graphTitle" ) );

const subtitle = computed( () => {
	const cfg = currentConfiguration.value;

	if ( !cfg ) {
		return t( "sections.interactive.graphControls.noneLoaded" );
	}

	return t( "sections.interactive.graphControls.summary", {
		name:                cfg.name,
		vertexCount:         cfg.vertexCount,
		ringSize:            cfg.ringSize,
		extendableColorings: cfg.extendableColorings
	} );
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
  min-width: 160px;
  max-width: 200px;
}

.control-panel {
}

.control-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.graph-shell {
  width: 100%;
  overflow: auto;
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
