import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/letter',
      name: 'LetterTrain',
      component: () => import('../views/LetterTrain.vue')
    },
    {
      path: '/word',
      name: 'WordTrain',
      component: () => import('../views/WordTrain.vue')
    },
    {
      path: '/essay-en',
      name: 'EssayEn',
      component: () => import('../views/EssayEn.vue')
    },
    {
      path: '/essay-cn',
      name: 'EssayCn',
      component: () => import('../views/EssayCn.vue')
    },
    {
      path: '/stats',
      name: 'DataStat',
      component: () => import('../views/DataStat.vue')
    }
  ]
})

export default router
