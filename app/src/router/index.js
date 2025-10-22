import { createRouter, createWebHistory } from 'vue-router'
import TravelPlanner from '../views/TravelPlanner.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'travel-planner',
      component: TravelPlanner,
    },
  ],
})

export default router
