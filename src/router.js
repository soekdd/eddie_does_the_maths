import { createRouter, createWebHashHistory } from 'vue-router'

import DG from '@/views/DG.vue'
import CatchAll from '@/views/CatchAll.vue'
import Welcome from '@/views/Welcome.vue'

export const router = createRouter({
  // Keep this working for both dev-server and static file hosting.
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'Welcome', component: Welcome, 
      meta: { title: 'Welcome' } },
    { path: '/DG', name: 'DG', component: DG, 
      meta: { title: 'Diophantische Gleichung', index: true, order: 10 } },
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
