<template>
  <div class="zoo-minimap-wrapper">
    <!-- Etykieta wybranego wybiegu -->
    <div class="minimap-label">
      <template v-if="modelValue">
        <span class="label-dot" />
        <span class="label-text">Wybrano: <strong>{{ ENCLOSURE_LABELS[modelValue] ?? modelValue }}</strong></span>
        <button type="button" class="label-clear" @click="$emit('update:modelValue', null)" title="Odznacz">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </template>
      <template v-else>
        <span class="label-hint">Kliknij obszar na mapie aby wybrać lokalizację</span>
      </template>
    </div>

    <!-- Mapa SVG -->
    <div class="minimap-container">
      <svg
        class="minimap-svg"
        viewBox="0 0 1274 717"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Tło mapy -->
        <image :href="mapBg" x="0" y="0" width="1274" height="717" />

        <!-- Wybiegi — klikalne (zajęte są zablokowane) -->
        <path
          v-for="enc in ENCLOSURES"
          :key="enc.key"
          class="enc-path"
          :class="{
            'enc-selected':  modelValue === enc.key,
            'enc-hover':     hovered === enc.key && modelValue !== enc.key && !isTaken(enc.key),
            'enc-taken':     isTaken(enc.key) && modelValue !== enc.key,
          }"
          :d="enc.d"
          @mouseenter="hovered = enc.key"
          @mouseleave="hovered = null"
          @click="toggle(enc.key)"
        />

        <!-- Lock icon nad zajętymi wybiegami -->
        <g v-for="enc in ENCLOSURES" :key="'lock-' + enc.key" pointer-events="none">
          <template v-if="isTaken(enc.key) && modelValue !== enc.key">
            <circle
              :cx="enc.iconPos.x + 32"
              :cy="enc.iconPos.y + 32"
              r="14"
              fill="rgba(239,68,68,0.85)"
            />
            <!-- Ikona kłódki (uproszczona) -->
            <text
              :x="enc.iconPos.x + 32"
              :y="enc.iconPos.y + 37"
              text-anchor="middle"
              font-size="14"
              fill="white"
            >🔒</text>
          </template>
        </g>

        <!-- Checkmark na wybranym wybiegu -->
        <g v-if="modelValue" pointer-events="none">
          <template v-for="enc in ENCLOSURES" :key="'ck-' + enc.key">
            <g v-if="enc.key === modelValue">
              <circle
                :cx="enc.iconPos.x + 32"
                :cy="enc.iconPos.y + 32"
                r="18"
                fill="#2d6a4f"
                opacity="0.9"
              />
              <path
                :transform="`translate(${enc.iconPos.x + 20}, ${enc.iconPos.y + 20})`"
                d="M4 12l5 5L20 6"
                stroke="white"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
              />
            </g>
          </template>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import mapBg from '../../assets/map.png';

const props = defineProps({
  modelValue: { type: String, default: null },
  /** Klucze zajętych już wybiegów (zostaną oznaczone inaczej) */
  takenKeys:  { type: Array,  default: () => [] },
});

const emit = defineEmits(['update:modelValue']);

const hovered = ref(null);

/** Czy dany key jest zajęty (i nie jest aktualnie edytowanym) */
const isTaken = (key) => props.takenKeys.includes(key);

const toggle = (key) => {
  // Blokuj kliknięcie na zajęty wybieg (chyba że to aktualnie wybrany)
  if (isTaken(key) && props.modelValue !== key) return;
  emit('update:modelValue', props.modelValue === key ? null : key);
};

/** Czytelne nazwy dla etykiety */
const ENCLOSURE_LABELS = {
  parrot:  'Woliera (Papuga)',
  snake:   'Dom gadów (Wąż)',
  spider:  'Insektarium (Pająk)',
  croco:   'Bagno (Krokodyl)',
  zebra:   'Sawanna (Zebra)',
  giraffe: 'Sawanna (Żyrafa)',
  monkey:  'Wyspa Małp',
  sealion: 'Basen (Uchatka)',
  bear:    'Dolina Niedźwiedzia',
  lion:    'Skała Lwa',
  panda:   'Sanktuarium Pandy',
  penguin: 'Zatoka Pingwinów',
  rhino:   'Rezerwat (Nosorożec)',
  tiger:   'Habitat Tygrysa',
  gazelle: 'Równiny (Gazela)',
};

/** Klucze wybiegów z ENCLOSURE_SHAPES (zamiast duplikowania) */
import { ENCLOSURE_SHAPES } from '../../data/enclosureShapes.js';
const ENCLOSURES = ENCLOSURE_SHAPES;
</script>

<style scoped>
.zoo-minimap-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ── Etykieta ── */
.minimap-label {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 24px;
  font-size: 0.8rem;
}
.label-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2d6a4f;
  flex-shrink: 0;
}
.label-text {
  color: #374151;
  flex: 1;
}
:global(.dark) .label-text { color: #d1d5db; }
.label-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fee2e2;
  color: #ef4444;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}
.label-clear:hover { background: #fecaca; }
.label-hint {
  color: #9ca3af;
  font-style: italic;
}

/* ── Kontener mapy ── */
.minimap-container {
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  transition: border-color 0.2s;
  background: #e4e4e0;
}
:global(.dark) .minimap-container { border-color: #374151; }
.minimap-container:focus-within { border-color: #2d6a4f; }

.minimap-svg {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1274 / 717;
}

/* ── Paths wybiegów ── */
.enc-path {
  fill: transparent;
  stroke: none;
  pointer-events: all;
  cursor: pointer;
  transition: fill 0.15s ease;
}
.enc-path:hover,
.enc-hover {
  fill: rgba(255, 255, 255, 0.55);
}
.enc-selected {
  fill: rgba(45, 106, 79, 0.45) !important;
  stroke: #2d6a4f;
  stroke-width: 2;
  filter: drop-shadow(0 0 6px rgba(45, 106, 79, 0.6));
}
.enc-taken {
  fill: rgba(239, 68, 68, 0.18);
  stroke: rgba(239, 68, 68, 0.5);
  stroke-width: 1.5;
  cursor: not-allowed;
  pointer-events: all;
}
</style>
