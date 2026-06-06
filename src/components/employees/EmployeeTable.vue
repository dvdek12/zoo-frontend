<template>
  <DataTable
    :columns="columns"
    :rows="employees"
    row-key="id"
    :clickable="true"
    @row-click="router.push({ name: 'employeeDetail', params: { id: $event } })"
  >
    <!-- Icon -->
    <template #cell-icon="{ row }">
      <EmployeeIconCell
        :icon-id="row.iconId"
        :first-name="row.firstName"
        :last-name="row.lastName"
      />
    </template>

    <!-- Full Name -->
    <template #cell-fullName="{ row }">
      <span
        class="font-bold text-gray-900 dark:text-white"
        v-html="highlight(row.firstName + ' ' + row.lastName, query)"
      />
    </template>

    <!-- Email -->
    <template #cell-email="{ row }">
      <span
        class="text-gray-600 dark:text-gray-300 text-sm"
        v-html="highlight(row.email, query)"
      />
    </template>

    <!-- Phone number -->
    <template #cell-phoneNumber="{ row }">
      <span
        class="text-gray-500 dark:text-gray-400 text-sm"
        v-html="highlight(row.phoneNumber ?? '—', query)"
      />
    </template>

    <!-- Date of birth -->
    <template #cell-birthDay="{ row }">
      <span class="text-gray-500 dark:text-gray-400 text-sm">{{ formatDate(row.birthDay) }}</span>
    </template>

    <!-- Role -->
    <template #cell-roleName="{ row }">
      <span
        :style="themeStore.getRoleBadgeStyle(row.roleName)"
        class="text-xs font-bold px-3 py-1.5 rounded-full border shadow-sm"
        v-html="highlight(row.roleName ?? 'Employee', query)"
      />
    </template>

    <!-- Empty state -->
    <template #empty>
      <div class="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <p class="text-lg font-semibold text-gray-400 dark:text-gray-500 mb-1">No employees</p>
      <p class="text-sm text-gray-300 dark:text-gray-600 text-center max-w-xs">
        No employees found.<br>Register the first one by clicking the button above.
      </p>
    </template>
  </DataTable>
</template>

<script setup>
import { defineComponent, h, toRef } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from '../DataTable.vue';
import { useHighlight } from '../../composables/useHighlight';
import { useIcon } from '../../composables/useIcon';
import { useThemeStore } from '../../stores/theme';

defineProps({
  employees: {
    type: Array,
    required: true,
  },
  query: {
    type: String,
    default: '',
  },
});

const router     = useRouter();
const { highlight } = useHighlight();
const themeStore = useThemeStore();

const columns = [
  { key: 'icon',        label: 'Icon',          width: 'w-16',  align: 'center' },
  { key: 'fullName',    label: 'Full Name' },
  { key: 'email',       label: 'Email' },
  { key: 'phoneNumber', label: 'Phone number' },
  { key: 'birthDay',    label: 'Date of birth' },
  { key: 'roleName',    label: 'Role' },
];

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
};

/**
 * Employee icon subcomponent — fallback: initials.
 */
const EmployeeIconCell = defineComponent({
  name: 'EmployeeIconCell',
  props: {
    iconId:    { type: Number, default: null },
    firstName: { type: String, default: '' },
    lastName:  { type: String, default: '' },
  },
  setup(props) {
    const iconIdRef = toRef(props, 'iconId');
    const { iconUrl, isLoading } = useIcon(iconIdRef);
    return { iconUrl, isLoading };
  },
  render() {
    if (this.isLoading) {
      return h('div', { class: 'w-10 h-10 rounded-full mx-auto bg-gray-100 dark:bg-gray-700 animate-pulse' });
    }
    if (this.iconUrl) {
      return h('img', {
        src: this.iconUrl,
        alt: `${this.firstName} ${this.lastName}`,
        class: 'w-10 h-10 rounded-full object-cover mx-auto shadow-sm border-2 border-[#2d6a4f]/20 transition-transform group-hover:scale-110 duration-200',
      });
    }
    const initials = ((this.firstName?.[0] ?? '') + (this.lastName?.[0] ?? '')).toUpperCase() || '?';
    return h('div', {
      class: 'w-10 h-10 rounded-full mx-auto flex items-center justify-center bg-gradient-to-br from-[#2d6a4f] to-[#40916c] text-white font-bold text-sm shrink-0 shadow-sm transition-transform group-hover:scale-110 duration-200',
    }, [h('span', { class: 'select-none' }, initials)]);
  },
});
</script>
