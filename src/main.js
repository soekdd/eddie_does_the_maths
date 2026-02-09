import { createApp, h } from 'vue'
import { RouterView } from 'vue-router'
import { VApp } from 'vuetify/components'
import AppFrame from '@/App.vue'
import 'katex/dist/katex.min.css'
import { router } from '@/router.js'
import { vuetify } from '@/plugins/vuetify'
import '@/styles/eddie.css'

// URL conveniences:
// - Rewrite "/?DG" -> "/#DG" (drops the query string)
// - Rewrite "/#DG" -> "/#/DG" (Vue Router hash history format)
{
  const loc = globalThis.location
  if (loc) {
    const shortQuery = loc.search.match(/^\?([A-Z0-9]{2})$/)?.[1]
    if (shortQuery) loc.replace(`${loc.pathname}#${shortQuery}`)

    const shortHash = loc.hash.match(/^#([A-Z0-9]{2})$/)?.[1]
    if (shortHash) loc.replace(`#/${shortHash}`)
  }
}

// Vuetify theme: follow system dark/light mode automatically.
{
  const mql = globalThis.matchMedia?.('(prefers-color-scheme: dark)')
  const nameFromSystem = () => (mql?.matches ? 'eddieDark' : 'eddieLight')

  const apply = () => {
    const nameRef = vuetify.theme?.global?.name
    if (!nameRef) return
    const next = nameFromSystem()
    if (nameRef.value !== next) nameRef.value = next
  }

  apply()

  if (mql) {
    const onChange = () => apply()
    if (mql.addEventListener) mql.addEventListener('change', onChange)
    else mql.addListener(onChange)

    import.meta.hot?.dispose(() => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange)
      else mql.removeListener(onChange)
    })
  }
}

const Root = {
  name: 'Root',
  render: () => h(VApp, null, { default: () => h(RouterView) }),
}

const app = createApp(Root)

// Global layout component so views don't need to import it explicitly.
app.component('AppFrame', AppFrame)

app.use(router).use(vuetify).mount('#app')
