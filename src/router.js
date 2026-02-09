import { createRouter, createWebHashHistory } from 'vue-router'

import DG from '@/views/DG.vue'
import ST from '@/views/ST.vue'
import OA from '@/views/OA.vue'
import CatchAll from '@/views/CatchAll.vue'
import Welcome from '@/views/Welcome.vue'

export const router = createRouter({
  // Keep this working for both dev-server and static file hosting.
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'Welcome', component: Welcome, 
      meta: { title: 'Welcome' } },
    { path: '/ST', name: 'ST', component: ST,
      meta: { title: 'Spieltheorie am Busbahnhof', index: true, order: 10 } },
    { path: '/DG', name: 'DG', component: DG, 
      meta: { title: 'Diophantische Gleichung', index: true, order: 20 } },
      { path: '/OA', name: 'OA', component: OA,
      meta: { title: 'IMO 1985 Aufgabe 1', index: true, order: 30 } },
    { path: '/:pathMatch(.*)*', name: 'CatchAll', component: CatchAll,
      meta: { title: 'Thema in Arbeit' } },
  ],
})

// Page title from route meta
router.afterEach((to) => {
  const title = typeof to?.meta?.title === 'string' ? to.meta.title : ''
  if (typeof document !== 'undefined') {
    document.title = title ? `Eddie rechnet: ${title}` : 'Eddie rechnet'
  }
})
