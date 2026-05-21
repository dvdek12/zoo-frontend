<script setup>
import mapBg from '../assets/map.png';
import { ENCLOSURE_SHAPES } from '../data/enclosureShapes.js';

const props = defineProps({
  highlightedEnclosure: { type: String, default: null },
  /**
   * Mapa: mapKey → { id, name, animals: [{ id, name, iconUrl }] }
   * Budowana w MapView z danych API.
   */
  enclosureData: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['selectEnclosure', 'enclosureDragEnter', 'enclosureDragLeave', 'enclosureDrop']);

// Kształty wybiegów — importowane ze wspólnego pliku (używa też EnclosureCard)
// Alias lokalny dla zgodności wstecznej
const ENCLOSURES = ENCLOSURE_SHAPES;

const ICON_SIZE = 38;
const RADIUS = ICON_SIZE / 2;
const STEP = 22; // spacing between overlapping icons

/**
 * Zwraca dane do renderowania clustra dla danego enclosure.
 * Jeśli wybieg nie istnieje w bazie (brak mapKey), zwraca { mode: 'none' }
 */
const getCluster = (enc) => {
  const data = props.enclosureData[enc.key];
  if (!data) return { mode: 'none' };

  const animals = data.animals ?? [];
  const count = animals.length;
  
  if (count === 0) return { mode: 'empty' };

  const maxIcons = 3;
  const displayAnimals = animals.slice(0, maxIcons);
  const hasBadge = count > maxIcons;
  const badgeCount = count - maxIcons;

  const numItems = displayAnimals.length + (hasBadge ? 1 : 0);
  const totalWidth = (numItems - 1) * STEP + ICON_SIZE;
  // Centrujemy na podstawie enc.iconPos (które pierwotnie zakładało box 52x52, stąd +26)
  const startX = enc.iconPos.x + 26 - (totalWidth / 2);
  const startY = enc.iconPos.y + 26 - RADIUS;

  const items = [];

  // Rysujemy od prawej do lewej, żeby lewe ikony przykrywały prawe (nakładanie się)
  if (hasBadge) {
    items.push({
      type: 'badge',
      text: `+${badgeCount}`,
      x: startX + maxIcons * STEP,
      y: startY
    });
  }

  for (let i = displayAnimals.length - 1; i >= 0; i--) {
    items.push({
      type: 'avatar',
      animal: displayAnimals[i],
      x: startX + i * STEP,
      y: startY
    });
  }

  return { mode: 'cluster', items };
};
</script>

<template>
  <div class="map-container flex items-center justify-center w-full h-full">
    <svg
      class="interactive-map w-full h-full max-h-full max-w-full"
      viewBox="0 0 1274 717"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Globalny clipPath dla okrągłych avatarów -->
      <defs>
        <clipPath id="circle-clip" clipPathUnits="objectBoundingBox">
          <circle cx="0.5" cy="0.5" r="0.5" />
        </clipPath>
      </defs>

      <image :href="mapBg" x="0" y="0" width="1274" height="717" />

      <!-- Wybiegi — path SVG z obsługą D&D -->
      <path
        v-for="enc in ENCLOSURE_SHAPES"
        :key="enc.key"
        class="enclosure-path"
        :class="{ 'enclosure-drag-over': highlightedEnclosure === enc.key }"
        :d="enc.d"
        fill="#D9D9D9"
        @click="emit('selectEnclosure', enc.key)"
        @dragenter.prevent="emit('enclosureDragEnter', enc.key)"
        @dragover.prevent
        @dragleave="emit('enclosureDragLeave', enc.key)"
        @drop.prevent="emit('enclosureDrop', enc.key)"
      />

      <!-- Clustry ikon per wybieg -->
      <g
        v-for="enc in ENCLOSURE_SHAPES"
        :key="'cluster-' + enc.key"
        pointer-events="none"
      >
        <!-- Brak wybiegu w bazie -> nic nie rysujemy -->
        
        <!-- Pusty wybieg (dodany w bazie, ale 0 zwierząt) -->
        <g v-if="getCluster(enc).mode === 'empty'">
          <rect
            :x="enc.iconPos.x"
            :y="enc.iconPos.y + 10"
            width="52"
            height="32"
            rx="16"
            fill="rgba(255,255,255,0.25)"
            stroke="rgba(255,255,255,0.6)"
            stroke-width="1.5"
            class="empty-placeholder"
          />
        </g>

        <!-- Wybieg ze zwierzętami (1 do N) -->
        <g v-else-if="getCluster(enc).mode === 'cluster'">
          <g v-for="(item, idx) in getCluster(enc).items" :key="idx" class="cluster-item">
            
            <template v-if="item.type === 'badge'">
              <circle
                :cx="item.x + RADIUS"
                :cy="item.y + RADIUS"
                :r="RADIUS"
                fill="#2d2d2d"
                stroke="#1a1a1a"
                stroke-width="2.5"
              />
              <text
                :x="item.x + RADIUS"
                :y="item.y + RADIUS + 4"
                fill="white"
                font-size="13"
                font-weight="bold"
                font-family="Inter, sans-serif"
                text-anchor="middle"
              >{{ item.text }}</text>
            </template>

            <template v-else-if="item.type === 'avatar'">
              <image
                :href="item.animal.iconUrl || '/map-icons/paw.png'"
                :x="item.x"
                :y="item.y"
                :width="ICON_SIZE"
                :height="ICON_SIZE"
                clip-path="url(#circle-clip)"
                preserveAspectRatio="xMidYMid slice"
              />
              <circle
                :cx="item.x + RADIUS"
                :cy="item.y + RADIUS"
                :r="RADIUS"
                fill="none"
                stroke="#1a1a1a"
                stroke-width="2.5"
              />
            </template>
            
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.map-container { position: relative; }

.interactive-map { display: block; }

.enclosure-path {
  fill: transparent;
  stroke: none;
  pointer-events: all;
  cursor: pointer;
  transition: fill 0.2s ease, filter 0.2s ease;
}

.enclosure-path:hover {
  fill: rgba(255, 255, 255, 0.18);
}

.enclosure-drag-over {
  fill: rgba(74, 222, 128, 0.45) !important;
  stroke: #4ade80 !important;
  stroke-width: 2;
  filter: drop-shadow(0 0 10px rgba(74, 222, 128, 0.7));
}

.empty-placeholder {
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
}

.cluster-item {
  filter: drop-shadow(2px 0 3px rgba(0,0,0,0.4));
}
</style>