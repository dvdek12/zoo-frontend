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

        <!-- Wybiegi — klikalne -->
        <path
          v-for="enc in ENCLOSURES"
          :key="enc.key"
          class="enc-path"
          :class="{
            'enc-selected':  modelValue === enc.key,
            'enc-hover':     hovered === enc.key && modelValue !== enc.key,
            'enc-taken':     takenKeys.includes(enc.key) && modelValue !== enc.key,
          }"
          :d="enc.d"
          @mouseenter="hovered = enc.key"
          @mouseleave="hovered = null"
          @click="toggle(enc.key)"
        />

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

const toggle = (key) => {
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

const ENCLOSURES = [
  { key: 'parrot',  iconPos: { x: 437.5,   y: 226    }, d: 'M444 242L417 210.5V199.5H431L444 210.5H462.5H483L497.5 231L506 274.5L497.5 300.5L462.5 294L444 242Z' },
  { key: 'snake',   iconPos: { x: 374.75,  y: 143.75 }, d: 'M366 173L331 162.5L360 143L387 151L418.5 162.5L455.5 178L482.5 208.5H444.5L430.5 198H415.5V205.5L396.5 190L366 173Z' },
  { key: 'spider',  iconPos: { x: 273.25,  y: 119.75 }, d: 'M275 161.5L252 170L255.5 141.5L279 133.5H307H335.5L358.5 141.5L329.5 161.5L321 160H296.5L275 161.5Z' },
  { key: 'croco',   iconPos: { x: 275.25,  y: 281.75 }, d: 'M296.5 237.5L274.5 203.5V197H285H313.5L341.5 203.5L368 218L391 234L413 264L426.5 287L429 305.5V322L413 339L394.5 344.5L384.5 347.5L377.5 352.5V361.5L382.5 369.5L374.5 375.5L347.5 392.5H317L303.5 408.5L270 430.5L240 416.5L216.5 400L190.5 339L185.5 279L193.5 248.5L202.5 234L232.5 215L250 222L260 234L274.5 257L278 273.5L274.5 297L285 312.5L290.5 307.5L303.5 297V264L296.5 237.5Z' },
  { key: 'zebra',   iconPos: { x: 306.25,  y: 567.75 }, d: 'M255.5 535L212 542.5V546.5L218 568.5L264.5 617L303 664L370.5 699.5L447 617L439.5 590V568.5L447 542.5L464.5 521L452 512.5L434.5 504L411.5 500H396.5H379.5L361 504H343.5C336.667 506.833 322.2 512.5 319 512.5C315.8 512.5 298.667 520.5 290.5 524.5L255.5 535Z' },
  { key: 'giraffe', iconPos: { x: 491.75,  y: 559.75 }, d: 'M480.5 544.5L510.5 535.5L536 544.5L555 550.5L584.5 558.5V563.5V583V607.5L570.5 629.5L555 641.5L529 648L500.5 641.5L484.5 629.5L468.5 614.5L463 587.5L468.5 563.5L480.5 544.5Z' },
  { key: 'monkey',  iconPos: { x: 1009.25, y: 578.25 }, d: 'M944.5 645.5L923.5 703.5L1064 707L1124.5 695L1148 659.5L1159 607V553.5L1142.5 550.5L1128 543.5L1111.5 538.5L1094 526L1077 519.5L1067.5 513.5H1044H1022H999L982 519.5L956.5 526L939.5 533V538.5L944.5 561L952 586.5L949 615.5L944.5 645.5Z' },
  { key: 'sealion', iconPos: { x: 776.25,  y: 572.75 }, d: 'M727.5 601L701.5 542.5L727.5 520.5H784L824 537C843.833 538.833 886.1 542.5 896.5 542.5C906.9 542.5 908.833 547.5 908.5 550L915 592L908.5 648.5L883.5 689L837 680L798 689H744.5L727.5 664L720 630L727.5 601Z' },
  { key: 'bear',    iconPos: { x: 823.25,  y: 305.25 }, d: 'M781.5 214.5L812.5 187L821 172.5H845L860 177.5L874 191L892 199.5L914.5 208L935.5 223L960.5 236L970.5 251L983 269L991.5 291.5L1001 307L1010.5 333L1019 357V386.5V417L1010.5 442L991.5 464.5H977L960.5 474.5L941 485.5L905 494H882.5L868 502L845 494L821 485.5L797.5 479.5L776.5 474.5L756.5 471.5L725 474.5V464.5L712.5 442L697 405.5L691.5 375.5V346L702 321L725 287.5L753 251L781.5 214.5Z' },
  { key: 'lion',    iconPos: { x: 624.75,  y: 594.5  }, d: 'M594.5 637L572 662L633 692.5L689.5 699.5L741.5 690L724.5 664L717.5 630.5V626H713.5H692.5V607L689.5 589L682 568.5L672 553.5H656.5L644 557.5L628.5 562.5H614.5V571.5V589L608.5 611L594.5 637Z' },
  { key: 'panda',   iconPos: { x: 603.25,  y: 415.25 }, d: 'M600 519.5L585 510.5V453L580.5 419V391H595.5H613.5L648.5 375V391L664.5 429.5L672 441.5L681.5 466.5L690 486L681.5 497L664.5 503L648.5 510.5L622.5 519.5H600Z' },
  { key: 'penguin', iconPos: { x: 689.5,   y: 160    }, d: 'M658 227.5L680.5 255H700.5L710.5 248.5L728 222L752.5 192.5L769 171L784.5 158.5L791.5 145.5L784.5 136.5L769 129H752.5L743.5 132.5L724.5 136.5L707.5 142L695 149.5L666.5 162.5L651.5 188.5L658 227.5Z' },
  { key: 'rhino',   iconPos: { x: 556.25,  y: 223.25 }, d: 'M628 181.5L641 147L607.5 131L571.5 124L523 131L489 143L480.5 174L489 207L501 228L509 275.5L501 299L530 307.5L548 322.5L564 349.5L575.5 370L580.5 386.5H613L647.5 370L651.5 353L654.5 341.5L663 315.5L671.5 296.5L686 278L696 264V258L676.5 256.5L657 233L641 239L632.5 218.5L628 181.5Z' },
  { key: 'tiger',   iconPos: { x: 435.25,  y: 379.25 }, d: 'M513.5 483.5L556 501L563 483.5L569 480V464L565.5 452.5L560 449L553.5 438L551 419V395.5V374L542.5 357.5L532 343L517 329.5L502.5 324L483.5 321.5L477.5 329.5L460 339.5H451L429 329.5L412.5 343L388.5 349L381.5 353V359.5L388.5 370.5L385 374L365.5 388L393.5 452.5H435L477.5 467L513.5 483.5Z' },
  { key: 'gazelle', iconPos: { x: 256,     y: 409.5  }, d: 'M231.5 494H196.5L188.5 449.5L191 424.5L205.5 410.5L216 403.5L236 419L269.5 435.5L306 410.5L318.5 395.5H347.5L349.5 394L357 389L363 390.5L387.5 449.5H378.5H364.5L349.5 452L335.5 456L316 461.5L302 467.5L282 478.5L258.5 484.5L231.5 494Z' },
];
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
  fill: rgba(239, 68, 68, 0.15);
  stroke: rgba(239, 68, 68, 0.4);
  stroke-width: 1;
}
</style>
