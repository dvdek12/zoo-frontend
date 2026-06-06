<template>
  <div
    class="enclosure-card group relative rounded-[1.5rem] overflow-hidden border transition-all duration-300 cursor-default"
    :style="{ borderColor: shape ? shape.color + '33' : '#e5e7eb' }"
  >
    <!-- ── FULL MAP (dimmed) + highlighted shape ───────────────── -->
    <div class="shape-area relative overflow-hidden" style="height: 148px;">

      <!-- Full SVG map with dimming -->
      <svg
        class="absolute inset-0 w-full h-full"
        viewBox="0 0 1274 717"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter :id="`glow-${enclosure.id}`" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <!-- Layer 1: map background -->
        <image href="/src/assets/map.png" x="0" y="0" width="1274" height="717" />

        <!-- Layer 2: strong black overlay on the whole map -->
        <rect x="0" y="0" width="1274" height="717" fill="rgba(0,0,0,0.78)" />

        <!-- Layer 3 (when mapKey is assigned): barely visible outlines of other enclosures -->
        <template v-if="shape">
          <path
            v-for="s in ALL_SHAPES"
            v-show="s.key !== shape.key"
            :key="s.key"
            :d="s.d"
            fill="rgba(255,255,255,0.04)"
            stroke="rgba(255,255,255,0.13)"
            stroke-width="0.8"
          />

          <!-- Layer 4: glow of the selected shape -->
          <path
            :d="shape.d"
            :fill="shape.color + 'aa'"
            :stroke="shape.color"
            stroke-width="8"
            stroke-linejoin="round"
            :filter="`url(#glow-${enclosure.id})`"
          />

          <!-- Layer 5: actual shape — solid, high contrast -->
          <path
            :d="shape.d"
            :fill="shape.color + 'ee'"
            :stroke="'white'"
            stroke-width="1.5"
            stroke-linejoin="round"
            opacity="0.95"
          />
        </template>
      </svg>

      <!-- Fallback if mapKey is missing -->
      <div v-if="!shape" class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-50 text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <span class="text-xs font-medium">No location on the map</span>
      </div>

      <!-- Action buttons — top left on hover -->
      <div class="absolute top-3 left-3 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          @click.stop="$emit('edit', enclosure)"
          class="p-1.5 rounded-lg bg-white/90 backdrop-blur-sm shadow text-blue-500 hover:bg-blue-50 transition-colors"
          title="Edit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          @click.stop="$emit('delete', enclosure.id)"
          class="p-1.5 rounded-lg bg-white/90 backdrop-blur-sm shadow text-red-400 hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- ── INFO ─────────────────────────────────────────────── -->
    <div class="px-4 py-3 bg-white dark:bg-gray-800">
      <h3 class="text-[15px] font-extrabold text-[#1a3b22] dark:text-white leading-tight line-clamp-1 mb-1">
        {{ enclosure.name }}
      </h3>

      <div class="flex items-center gap-2 mb-2">
        <span
          class="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full"
          :style="
            shape
              ? { background: shape.color + '18', color: shape.color }
              : { background: '#f0fdf4', color: '#15803d' }
          "
        >
          {{ typeName }}
        </span>
      </div>

      <p class="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 leading-relaxed">
        {{ enclosure.description || 'No description.' }}
      </p>

      <div class="mt-3 pt-2.5 border-t flex items-center justify-between" :style="{ borderColor: shape ? shape.color + '22' : '#f3f4f6' }">
        <span class="text-[10px] text-gray-400 font-medium">ID: {{ enclosure.id }}</span>
        <span v-if="enclosure.mapKey" class="text-[10px] font-bold" :style="{ color: shape ? shape.color : '#6b7280' }">
          ⬡ {{ enclosure.mapKey }}
        </span>
        <span v-else class="text-[10px] text-gray-300 italic">no mapKey</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ENCLOSURE_SHAPES, getShapeByKey } from '../../data/enclosureShapes.js';

const props = defineProps({
  enclosure: { type: Object, required: true },
  typeName:  { type: String, required: true },
});

defineEmits(['edit', 'delete']);

const ALL_SHAPES = ENCLOSURE_SHAPES;
const shape = computed(() => getShapeByKey(props.enclosure.mapKey ?? props.enclosure.MapKey));
</script>

<style scoped>
.enclosure-card {
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.enclosure-card:hover {
  box-shadow: 0 8px 25px rgba(0,0,0,0.10), 0 3px 10px rgba(0,0,0,0.06);
  transform: translateY(-2px);
}
</style>
