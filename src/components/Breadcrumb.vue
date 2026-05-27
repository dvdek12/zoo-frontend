<template>
  <nav
    v-if="crumbs.length > 1 && !route.meta.hideBreadcrumb"
    aria-label="Breadcrumb"
    class="flex items-center gap-1 text-xs font-medium px-8 pt-5 pb-0 shrink-0"
  >
    <template v-for="(crumb, index) in crumbs" :key="index">
      <!-- Separator -->
      <svg
        v-if="index > 0"
        class="w-3 h-3 shrink-0 text-white/40"
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

      <!-- Aktywna strona (ostatni crumb) — biały, bez tła -->
      <span
        v-if="index === crumbs.length - 1"
        class="px-1.5 py-0.5 font-bold text-white select-none"
      >
        {{ crumb.label }}
      </span>

      <!-- Klikalny link — transparentny, biały -->
      <router-link
        v-else
        :to="crumb.to"
        class="px-1.5 py-0.5 rounded-md text-white/65 hover:text-white hover:bg-white/10 transition-all duration-150 flex items-center gap-1.5"
      >
        <!-- Ikona domu dla roota -->
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

const parentRoutes = {
  animalDetail:   { label: 'Animals',   to: '/animals' },
  employeeDetail: { label: 'Employees', to: '/employees' },
  taskDetail:     { label: 'Dashboard', to: '/dashboard' },
};

const crumbs = computed(() => {
  const result = [];

  result.push({ label: 'Dashboard', to: '/dashboard' });

  const parent = parentRoutes[route.name];
  if (parent && parent.to !== '/dashboard') {
    result.push(parent);
  }

  const meta = route.meta;
  if (meta?.breadcrumb) {
    const staticLabel =
      typeof meta.breadcrumb === 'function'
        ? meta.breadcrumb(route)
        : meta.breadcrumb;

    const label = breadcrumbStore.dynamicLabel ?? staticLabel;

    if (result.at(-1)?.label !== label) {
      result.push({ label, to: route.path });
    }
  }

  return result;
});
</script>
