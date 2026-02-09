<script setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

const props = defineProps({
  // Show a "work in progress" banner for content that isn't finished yet.
  // Usage:
  // - <AppFrame warning> ... </AppFrame> (default text)
  // - <AppFrame warning="Custom text"> ... </AppFrame>
  warning: { type: [Boolean, String], default: false },
})

const { width } = useDisplay()

// Vuetify's built-in "mobile" flag defaults to < lg (1280px), which is too wide for our
// header-wrapping case. Match the app's existing "mobile-ish" breakpoint (see eddie.css).
const isMobile = computed(() => width.value < 860)
const appBarHeight = computed(() => (isMobile.value ? 108 : 72))

const warningMessage = computed(() => {
  if (props.warning === true) {
    return 'Hinweis: An diesem Inhalt wird noch gearbeitet. Texte, Grafiken und Rechenwege können sich noch ändern.'
  }
  if (typeof props.warning === 'string') return props.warning.trim()
  return ''
})

const showWarning = computed(() => Boolean(warningMessage.value))
</script>

<template>
  <div class="frame">
    <v-app-bar class="topBar" flat :height="appBarHeight">
      <v-container class="wrap">
        <router-link to="/" class="brandLink">
          <div class="brand">
            <slot name="title" />
          </div>
        </router-link>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="wrap mainWrap">
        <v-alert
          v-if="showWarning"
          class="wipAlert"
          type="warning"
          variant="tonal"
          border="start"
          :density="isMobile ? 'compact' : 'comfortable'"
        >
          {{ warningMessage }}
        </v-alert>

        <section class="card">
          <slot name="descriptionPart" />
        </section>

        <section class="card">
          <v-row class="gridRow" dense>
            <v-col cols="12" md="5">
              <slot name="interactivePart" />
            </v-col>
            <v-col cols="12" md="7">
              <slot name="calculationPart" />
            </v-col>
          </v-row>
        </section>

        <footer class="foot">
          <slot name="footer" />
        </footer>
      </v-container>
    </v-main>
  </div>
</template>

<style scoped>
.wipAlert {
  margin-top: 16px;
}
</style>
