import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/pages/HomePage.vue'
import Login from '../views/pages/LoginForm.vue'
import Events from '../views/pages/EventsPage.vue'
import MakeEvent from '../views/pages/MakeEventPage.vue'
import Register from '../views/pages/RegisterPage.vue'
import updateEvent from '@/views/pages/updateEvent.vue'
import askQuestionPage from '@/views/pages/askQuestionPage.vue'

const Authorization = (to, from, next) => {
  const userLoggedIn = localStorage.getItem('session_token')
  if (userLoggedIn) {
    next()
    return
  }
}
const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/Register', component: Register },
  { path: '/MakeEvent', component: MakeEvent, beforeEnter: Authorization },
  { path: '/event/:id', component: Events },
  { path: '/event/:id/edit', component: updateEvent, beforeEnter: Authorization },
  { path: '/event/:id/askQuestion', component: askQuestionPage, beforeEnter: Authorization }
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router
