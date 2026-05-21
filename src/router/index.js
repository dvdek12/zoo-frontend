import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import TaskDetailView from '../views/TaskDetailView.vue'
import ProfileView from '../views/ProfileView.vue'
import LoginView from '../views/LoginView.vue'
import ReportsView from '../views/ReportsView.vue'
import MapView from '../views/MapView.vue'
import ClientHomeView from '../views/ClientHomeView.vue'
import AnimalDetailView from '../views/manager/AnimalDetailsView.vue'
import AnimalsView from '../views/manager/AnimalsView.vue'
import EmployeesView from '../views/manager/EmployeesView.vue'
import EmployeeDetailsView from '../views/manager/EmployeeDetailsView.vue'
import EnclosuresView from '../views/manager/EnclosuresView.vue'
import TasksView from '../views/manager/TasksView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ClientHomeView,
      meta: { layout: 'client' }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresEmployee: true }
    },
    {
      path: '/dashboard/:taskId',
      name: 'taskDetail',
      component: TaskDetailView,
      meta: { requiresEmployee: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresEmployee: true }
    },
    {
      path: '/map',
      name: 'map',
      component: MapView,
      meta: { requiresEmployee: true }
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportsView,
      meta: { requiresEmployee: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/animals',
      name: 'animals',
      component: AnimalsView,
      meta: { requiresManager: true }
    },
    {
      path: '/animals/:id',
      name: 'animalDetail',
      component: AnimalDetailView,
      meta: { requiresManager: true }
    },
    {
      path: '/employees',
      name: 'employees',
      component: EmployeesView,
      meta: { requiresManager: true }
    },
    {
      path: '/employees/:id',
      name: 'employeeDetail',
      component: EmployeeDetailsView,
      meta: { requiresManager: true }
    },
    {
      path: '/enclosures',
      name: 'enclosures',
      component: EnclosuresView,
      meta: { requiresManager: true }
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TasksView,
      meta: { requiresManager: true }
    }
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  const isEmployee = auth.hasAnyRole('Employee')
  const isManager = auth.hasAnyRole('Manager')

  // Zalogowany użytkownik próbuje wejść na /login → przekieruj wg roli
  if (to.name === 'login' && auth.isLoggedIn) {
    return (isEmployee || isManager) ? { name: 'dashboard' } : { name: 'home' }
  }

  // Trasa chroniona dla pracowników
  if (to.meta.requiresEmployee) {
    if (!auth.isLoggedIn) return { name: 'login' }
    if (!isEmployee && !isManager) return { name: 'home' }
  }

  // Trasa chroniona tylko dla managerów
  if (to.meta.requiresManager) {
    if (!auth.isLoggedIn) return { name: 'login' }
    if (!isManager) return { name: 'dashboard' } // Employee bez uprawnień → z powrotem do dashboard
  }
})

export default router
