<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { QCConfiguration } from './parser'
import { renderSVG } from './visualize'

const props = withDefaults(defineProps<{
  configurations?: QCConfiguration[]
  modelValue?: number
  width?: number
  height?: number
  nodeRadius?: number
  title?: string
}>(), {
  configurations: () => [],
  modelValue: 1,
  width: 640,
  height: 640,
  nodeRadius: 6,
  title: 'QC Graph'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const localIndex = ref(Math.max(1, props.modelValue))
const showLabels = ref(true)
const animateNext = ref(true)
const stageKey = ref(0)
const navDirection = ref<'next' | 'prev'>('next')

watch(() => props.modelValue, (value) => {
  localIndex.value = Math.max(1, value)
})

watch(localIndex, (value, oldValue) => {
  navDirection.value = value >= (oldValue ?? value) ? 'next' : 'prev'
  stageKey.value += 1
  emit('update:modelValue', value)
})

const total = computed(() => props.configurations.length)

const clampedIndex = computed({
  get() {
    if (total.value === 0) return 1
    return Math.min(Math.max(1, localIndex.value), total.value)
  },
  set(value: number) {
    if (total.value === 0) {
      localIndex.value = 1
      return
    }
    localIndex.value = Math.min(Math.max(1, value), total.value)
  }
})

const currentConfiguration = computed(() => {
  if (total.value === 0) return null
  return props.configurations[clampedIndex.value - 1] ?? null
})

const currentSvg = computed(() => {
  const cfg = currentConfiguration.value
  if (!cfg) return ''
  return renderSVG(cfg, {
    width: props.width,
    height: props.height,
    showLabels: showLabels.value,
    nodeRadius: props.nodeRadius
  })
})

const subtitle = computed(() => {
  const cfg = currentConfiguration.value
  if (!cfg) return 'Keine Konfiguration geladen'
  return `#${cfg.name} · |V|=${cfg.vertexCount} · Ring=${cfg.ringSize} · Ext=${cfg.extendableColorings}`
})

const transitionName = computed(() => {
  if (!animateNext.value) return ''
  return navDirection.value === 'next' ? 'graph-next' : 'graph-prev'
})

function previous() {
  clampedIndex.value = clampedIndex.value - 1
}

function next() {
  clampedIndex.value = clampedIndex.value + 1
}
</script>

<template>
  <v-card rounded="lg" variant="outlined">
    <v-card-title class="d-flex flex-wrap align-center ga-3">
      <div>
        <div class="text-h6">{{ title }}</div>
        <div class="text-body-2 text-medium-emphasis">{{ subtitle }}</div>
      </div>
      <v-spacer />
      <v-switch
        v-model="showLabels"
        color="primary"
        density="compact"
        hide-details
        label="Labels"
      />
      <v-switch
        v-model="animateNext"
        color="primary"
        density="compact"
        hide-details
        label="Animate next"
      />
    </v-card-title>

    <v-card-text>
      <div v-if="!currentConfiguration" class="text-body-1 text-medium-emphasis">
        Keine QC-Konfigurationen vorhanden.
      </div>

      <template v-else>
        <div class="d-flex flex-wrap align-center ga-3 mb-4">
          <v-btn variant="outlined" @click="previous" :disabled="clampedIndex <= 1">
            Zurück
          </v-btn>

          <div class="index-field">
            <v-text-field
              v-model.number="clampedIndex"
              type="number"
              density="compact"
              hide-details
              label="Index"
              min="1"
              :max="total"
            />
          </div>

          <v-btn variant="outlined" @click="next" :disabled="clampedIndex >= total">
            Weiter
          </v-btn>

          <div class="text-body-2 text-medium-emphasis">
            {{ clampedIndex }} / {{ total }}
          </div>
        </div>

        <v-slider
          v-model="clampedIndex"
          :min="1"
          :max="Math.max(1, total)"
          :step="1"
          thumb-label
          color="primary"
          hide-details
          class="mb-4"
        />

        <div class="graph-shell">
          <Transition :name="transitionName" mode="out-in">
            <div :key="stageKey" class="graph-stage" v-html="currentSvg" />
          </Transition>
        </div>
      </template>
    </v-card-text>
  </v-card>
</template>

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
}

.graph-stage {
  min-width: max-content;
  padding: 12px;
}

.graph-stage :deep(svg) {
  display: block;
  max-width: 100%;
  height: auto;
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
