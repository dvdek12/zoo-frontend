<template>
  <DataTable
    :columns="columns"
    :rows="animals"
    row-key="id"
    :clickable="true"
    @row-click="$emit('row-click', $event)"
  >
    <!-- Icon -->
    <template #cell-icon="{ row }">
      <AnimalIconCell :icon-id="row.iconId" :name="row.name" />
    </template>

    <!-- Name -->
    <template #cell-name="{ row }">
      <span
        class="font-bold text-gray-900 dark:text-white text-lg"
        v-html="highlight(row.name, query)"
      />
    </template>

    <!-- Species -->
    <template #cell-species="{ row }">
      <span
        class="text-gray-500 dark:text-gray-400 italic text-sm"
        v-html="highlight(row.species, query)"
      />
    </template>

    <!-- Status -->
    <template #cell-status="{ row }">
      <span
        class="bg-[#f0f9f4] dark:bg-[#132a1e] text-[#2d6a4f] dark:text-green-400 text-xs font-bold px-3 py-1.5 rounded-full border border-[#2d6a4f]/20 shadow-sm"
        v-html="highlight(row.status, query)"
      />
    </template>

    <!-- Attributes -->
    <template #cell-attributes="{ row }">
      <div class="flex flex-wrap gap-1.5 items-center">
        <span
          v-for="attr in row.attributes.slice(0, MAX_ATTRS)"
          :key="attr.id ?? attr.name"
          class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded border border-gray-200 dark:border-gray-600"
        >
          <span class="font-semibold" v-html="highlight(attr.name, query)" />
          <template v-if="attr.value">:
            <span v-html="highlight(String(attr.value), query)" />
          </template>
        </span>
        <span
          v-if="row.attributes.length > MAX_ATTRS"
          :title="row.attributes.slice(MAX_ATTRS).map(a => a.name).join(', ')"
          class="px-2 py-0.5 bg-[#f0f9f4] dark:bg-[#132a1e] text-[#2d6a4f] dark:text-green-400 text-xs font-semibold rounded border border-[#2d6a4f]/20 cursor-default"
        >
          +{{ row.attributes.length - MAX_ATTRS }} more
        </span>
        <span v-if="row.attributes.length === 0" class="text-xs text-gray-400 italic">None</span>
      </div>
    </template>

    <!-- Actions -->
    <template #cell-actions="{ row }">
      <button
        class="text-gray-400 hover:text-red-500 transition-colors p-2"
        title="Delete"
        @click.stop="$emit('delete', row.id)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </template>

    <!-- Empty state -->
    <template #empty>
      <img
        :src="sadPandaImg"
        alt="Sad panda"
        class="w-80 opacity-55 grayscale mb-4"
        draggable="false"
      />
      <p class="text-lg font-semibold text-gray-400 dark:text-gray-500 mb-1">No animals in the zoo</p>
      <p class="text-sm text-gray-300 dark:text-gray-600 text-center max-w-xs">
        Our panda is sad — there are no animals here.<br>Add the first one by clicking the button above.
      </p>
    </template>
  </DataTable>
</template>

<script setup>
import { defineComponent, h, toRef } from 'vue';
import DataTable from '../DataTable.vue';
import sadPandaImg from '../../assets/sad_panda.png';
import { useHighlight } from '../../composables/useHighlight';
import { useIcon } from '../../composables/useIcon';

defineProps({
  animals: {
    type: Array,
    required: true,
  },
  query: {
    type: String,
    default: '',
  },
});

defineEmits(['delete', 'row-click']);

const { highlight } = useHighlight();

const MAX_ATTRS = 3;

const columns = [
  { key: 'icon',       label: 'Icon',       width: 'w-16',  align: 'center' },
  { key: 'name',       label: 'Name' },
  { key: 'species',    label: 'Species' },
  { key: 'status',     label: 'Status' },
  { key: 'attributes', label: 'Attributes' },
  { key: 'actions',    label: 'Actions',    width: 'w-24',  align: 'right' },
];

/**
 * Subcomponent rendering the animal icon.
 * Uses useIcon per-instance (each row has its own loading state).
 */
const AnimalIconCell = defineComponent({
  name: 'AnimalIconCell',
  props: {
    iconId: { type: Number, default: null },
    name:   { type: String, default: '' },
  },
  setup(props) {
    const iconIdRef = toRef(props, 'iconId');
    const { iconUrl, isLoading } = useIcon(iconIdRef);
    return { iconUrl, isLoading };
  },
  render() {
    if (this.isLoading) {
      return h('div', { class: 'w-10 h-10 rounded-xl mx-auto bg-gray-100 dark:bg-gray-700 animate-pulse' });
    }
    if (this.iconUrl) {
      return h('img', {
        src: this.iconUrl,
        alt: this.name,
        class: 'w-10 h-10 rounded-xl object-cover mx-auto shadow-sm border border-gray-100 dark:border-gray-700 transition-transform group-hover:scale-110 duration-200',
      });
    }
    return h('div', {
      class: 'w-10 h-10 rounded-xl mx-auto flex items-center justify-center bg-gradient-to-br from-[#2d6a4f] to-[#1a3b22] shadow-sm transition-transform group-hover:scale-110 duration-200',
    }, [h('span', { class: 'text-white font-bold text-sm select-none' }, (this.name?.[0] ?? '?').toUpperCase())]);
  },
});
</script>
