<template>
  <nav
    v-if="crumbs.length > 1 && !route.meta.hideBreadcrumb"
    aria-label="Breadcrumb"
    class="flex items-center gap-1.5 text-xs font-medium px-8 pt-5 pb-0 shrink-0"
  >
    <template v-for="(crumb, index) in crumbs" :key="index">
      <!-- Separator -->
      <svg
        v-if="index > 0"
        class="w-3 h-3 text-gray-300 dark:text-gray-600 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>

      <!-- Last crumb (current page) -->
      <span
        v-if="index === crumbs.length - 1"
        class="px-2.5 py-1 rounded-lg bg-[#2d6a4f]/10 dark:bg-green-400/10 text-[#2d6a4f] dark:text-green-400 font-semibold select-none"
      >
        {{ crumb.label }}
      </span>

      <!-- Clickable crumb -->
      <router-link
        v-else
        :to="crumb.to"
        class="px-2.5 py-1 rounded-lg text-gray-400 dark:text-gray-500 hover:text-[#2d6a4f] dark:hover:text-green-400 hover:bg-[#2d6a4f]/5 dark:hover:bg-green-400/5 transition-all duration-150 flex items-center gap-1.5 group"
      >
        <!-- Home icon for root -->
        <svg
          v-if="index === 0"
          class="w-3.5 h-3.5 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        {{ crumb.label }}
      </router-link>
    </template>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useBreadcrumbStore } from '../stores/breadcrumb';

const route           = useRoute();
const breadcrumbStore = useBreadcrumbStore();

// Map of detail route names → their parent list route
const parentRoutes = {
  animalDetail:   { label: 'Animals',   to: '/animals' },
  employeeDetail: { label: 'Employees', to: '/employees' },
  taskDetail:     { label: 'Dashboard', to: '/dashboard' },
};

const crumbs = computed(() => {
  const result = [];

  // Always start with Dashboard (home for internal users)
  result.push({ label: 'Dashboard', to: '/dashboard' });

  // Inject parent if this is a detail route
  const parent = parentRoutes[route.name];
  if (parent && parent.to !== '/dashboard') {
    result.push(parent);
  }

  // Current route breadcrumb:
  // 1. Dynamic label set by the view (e.g. animal name / employee full name)
  // 2. Static label from route.meta.breadcrumb (function or string)
  const meta = route.meta;
  if (meta?.breadcrumb) {
    const staticLabel =
      typeof meta.breadcrumb === 'function'
        ? meta.breadcrumb(route)
        : meta.breadcrumb;

    // Use dynamic label if available (set by the view after data load)
    const label = breadcrumbStore.dynamicLabel ?? staticLabel;

    if (result.at(-1)?.label !== label) {
      result.push({ label, to: route.path });
    }
  }

  return result;
});
</script>

