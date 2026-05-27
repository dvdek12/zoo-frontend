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
import TicketsView from '../views/manager/TicketsView.vue'
import { useAuthStore } from '../stores/auth'
import { useBreadcrumbStore } from '../stores/breadcrumb'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // Resetuj scroll okna do góry przy każdej nawigacji.
  // Obsługuje strony klienckie (window scroll). Strony managera
  // mają własny kontener scroll — resetowany w MainLayout.vue.
  scrollBehavior: () => ({ top: 0, behavior: 'instant' }),
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
      meta: { requiresEmployee: true, breadcrumb: 'Dashboard' }
    },
    {
      path: '/dashboard/:taskId',
      name: 'taskDetail',
      component: TaskDetailView,
      meta: { requiresEmployee: true, breadcrumb: (route) => `Task #${route.params.taskId}` }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresEmployee: true, breadcrumb: 'Profile' }
    },
    {
      path: '/map',
      name: 'map',
      component: MapView,
      meta: { requiresEmployee: true, breadcrumb: 'Map', hideBreadcrumb: true }
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportsView,
      meta: { requiresEmployee: true, breadcrumb: 'Reports' }
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
      meta: { requiresManager: true, breadcrumb: 'Animals' }
    },
    {
      path: '/animals/:id',
      name: 'animalDetail',
      component: AnimalDetailView,
      meta: { requiresManager: true, breadcrumb: (route) => `Animal #${route.params.id}` }
    },
    {
      path: '/employees',
      name: 'employees',
      component: EmployeesView,
      meta: { requiresManager: true, breadcrumb: 'Employees' }
    },
    {
      path: '/employees/:id',
      name: 'employeeDetail',
      component: EmployeeDetailsView,
      meta: { requiresManager: true, breadcrumb: (route) => `Employee #${route.params.id}` }
    },
    {
      path: '/enclosures',
      name: 'enclosures',
      component: EnclosuresView,
      meta: { requiresManager: true, breadcrumb: 'Enclosures' }
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TasksView,
      meta: { requiresManager: true, breadcrumb: 'Tasks' }
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: TicketsView,
      meta: { requiresManager: true, breadcrumb: 'Tickets' }
    }
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore();
  // Wyczyść dynamiczny tytuł breadcrumba przy każdej nawigacji
  useBreadcrumbStore().clearLabel();
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
