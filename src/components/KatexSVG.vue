<script setup>
import { computed } from 'vue'

import { katexHTML } from '@/utils/katex'

const props = defineProps({
  tex: { type: String, required: true },
  display: { type: Boolean, default: false },
  as: { type: String, default: 'span' },
})

const html = computed(() => katexHTML(props.tex, props.display))
</script>

<template>
  <foreignObject>
    <component :is="as" v-html="html" />
  </foreignObject>
</template>

