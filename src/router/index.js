import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useBreadcrumbStore } from '../stores/breadcrumb'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0, behavior: 'instant' }),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/ClientHomeView.vue'),
      meta: { layout: 'client' },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresEmployee: true, breadcrumb: 'Dashboard' },
    },
    {
      path: '/dashboard/:taskId',
      name: 'taskDetail',
      component: () => import('../views/TaskDetailView.vue'),
      meta: { requiresEmployee: true, breadcrumb: (route) => `Task #${route.params.taskId}` },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresEmployee: true, breadcrumb: 'Profile' },
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/MapView.vue'),
      meta: { requiresEmployee: true, breadcrumb: 'Map', hideBreadcrumb: true },
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/ReportsView.vue'),
      meta: { requiresEmployee: true, breadcrumb: 'Reports' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/animals',
      name: 'animals',
      component: () => import('../views/manager/AnimalsView.vue'),
      meta: { requiresManager: true, breadcrumb: 'Animals' },
    },
    {
      path: '/animals/:id',
      name: 'animalDetail',
      component: () => import('../views/manager/AnimalDetailsView.vue'),
      meta: { requiresManager: true, breadcrumb: (route) => `Animal #${route.params.id}` },
    },
    {
      path: '/employees',
      name: 'employees',
      component: () => import('../views/manager/EmployeesView.vue'),
      meta: { requiresManager: true, breadcrumb: 'Employees' },
    },
    {
      path: '/employees/:id',
      name: 'employeeDetail',
      component: () => import('../views/manager/EmployeeDetailsView.vue'),
      meta: { requiresManager: true, breadcrumb: (route) => `Employee #${route.params.id}` },
    },
    {
      path: '/enclosures',
      name: 'enclosures',
      component: () => import('../views/manager/EnclosuresView.vue'),
      meta: { requiresManager: true, breadcrumb: 'Enclosures' },
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('../views/manager/TasksView.vue'),
      meta: { requiresManager: true, breadcrumb: 'Tasks' },
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: () => import('../views/manager/TicketsView.vue'),
      meta: { requiresManager: true, breadcrumb: 'Tickets' },
    },
    {
      path: '/food',
      name: 'food',
      component: () => import('../views/manager/FoodView.vue'),
      meta: { requiresManager: true, breadcrumb: 'Food' },
    },
  ],
})

router.beforeEach((to) => {
  const auth       = useAuthStore()
  useBreadcrumbStore().clearLabel()
  const isEmployee = auth.hasAnyRole('Employee')
  const isManager  = auth.hasAnyRole('Manager')

  if (to.name === 'login' && auth.isLoggedIn) {
    return (isEmployee || isManager) ? { name: 'dashboard' } : { name: 'home' }
  }
  if (to.meta.requiresEmployee) {
    if (!auth.isLoggedIn) return { name: 'login' }
    if (!isEmployee && !isManager) return { name: 'home' }
  }
  if (to.meta.requiresManager) {
    if (!auth.isLoggedIn) return { name: 'login' }
    if (!isManager) return { name: 'dashboard' }
  }
})

export default router
