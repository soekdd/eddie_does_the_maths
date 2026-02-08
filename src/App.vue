<script setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

const { width } = useDisplay()

// Vuetify's built-in "mobile" flag defaults to < lg (1280px), which is too wide for our
// header-wrapping case. Match the app's existing "mobile-ish" breakpoint (see eddie.css).
const isMobile = computed(() => width.value < 860)
const appBarHeight = computed(() => (isMobile.value ? 108 : 72))
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
