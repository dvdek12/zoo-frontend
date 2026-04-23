<template>
  <div class="p-8 h-full flex flex-col">
    <h2 
      v-if="auth.isLoggedIn"
      class="text-[2.5rem] font-bold text-[#1a3b22] tracking-tight mb-8">Good morning, {{ auth.userEmail }}!</h2>
    
    <div class="bg-white rounded-xl shadow-sm p-6 flex-1 max-w-4xl">
      <h3 class="text-2xl font-bold text-[#1a3b22] mb-6">Twoje zadania</h3>
      <!-- Kontener z maksymalną wysokością dopasowaną mniej więcej do 4 elementów z opcją scrolowania -->
      <ul class="space-y-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
        <li 
          v-for="task in tasks" 
          :key="task.id"
          @click="goToTask(task.id)"
          :class="[
            'p-5 rounded-xl border transition-all duration-300 shrink-0 cursor-pointer hover:shadow-lg hover:-translate-y-0.5',
            isToday(task.date) ? 'bg-[#f0f9f4] border-[#2d6a4f] shadow-md border-l-4 border-l-[#2d6a4f]' : '',
            isPast(task.date) ? 'opacity-40 grayscale border-gray-200 bg-gray-50' : '',
            !isToday(task.date) && !isPast(task.date) ? 'border-gray-200 bg-white hover:border-gray-300' : ''
          ]"
        >
          <div class="flex justify-between items-center leading-relaxed">
            <div>
              <div class="flex items-center gap-3 mb-1">
                <h4 
                  :class="[
                    'font-bold text-lg',
                    isToday(task.date) ? 'text-[#1a3b22]' : 'text-gray-800'
                  ]"
                >{{ task.title }}</h4>
                <span v-if="isToday(task.date)" class="bg-[#2d6a4f] text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">Dzisiaj</span>
                <span v-if="isYesterday(task.date)" class="bg-gray-200 text-gray-500 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">Wczoraj</span>
              </div>
              <p class="text-sm text-gray-500 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Termin: {{ formatDate(task.date) }}
              </p>
            </div>
            <div 
              :class="[
                'px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase whitespace-nowrap',
                task.status === 'Zakończone' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              ]"
            >
              {{ task.status }}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const auth = useAuthStore();
const router = useRouter();

const goToTask = (id) => {
  router.push(`/dashboard/${id}`);
};

const dzis = new Date();
const wczoraj = new Date(dzis);
wczoraj.setDate(wczoraj.getDate() - 1);
const przedwczoraj = new Date(dzis);
przedwczoraj.setDate(przedwczoraj.getDate() - 2);
const jutro = new Date(dzis);
jutro.setDate(jutro.getDate() + 1);
const pojutrze = new Date(dzis);
pojutrze.setDate(pojutrze.getDate() + 2);
const zatszydni = new Date(dzis);
zatszydni.setDate(zatszydni.getDate() + 3);

const obslugaDatySzablon = (data) => {
  const rok = data.getFullYear();
  const miesiac = String(data.getMonth() + 1).padStart(2, '0');
  const dzien = String(data.getDate()).padStart(2, '0');
  return `${rok}-${miesiac}-${dzien}`;
};

const tasks = ref([
  { id: 0, title: 'Dezynfekcja klatek dla ptaków', date: obslugaDatySzablon(przedwczoraj), status: 'Zakończone' },
  { id: 1, title: 'Przegląd medyczny lwów', date: obslugaDatySzablon(wczoraj), status: 'Zakończone' },
  { id: 2, title: 'Wybieg dla słoni - czyszczenie i kontrola zabawek', date: obslugaDatySzablon(dzis), status: 'W toku' },
  { id: 3, title: 'Karmienie pingwinów przylądkowych', date: obslugaDatySzablon(dzis), status: 'W toku' },
  { id: 4, title: 'Wymiana wody w akwarium nr 4', date: obslugaDatySzablon(dzis), status: 'Oczekujące' },
  { id: 5, title: 'Spotkanie zespołu ds. naczelnych', date: obslugaDatySzablon(jutro), status: 'Oczekujące' },
  { id: 6, title: 'Dostawa karmy dla roślinożerców', date: obslugaDatySzablon(jutro), status: 'Oczekujące' },
  { id: 7, title: 'Szkolenie BHP dla nowych wolontariuszy', date: obslugaDatySzablon(pojutrze), status: 'Oczekujące' },
  { id: 8, title: 'Inwentaryzacja sprzętu weterynaryjnego', date: obslugaDatySzablon(zatszydni), status: 'Oczekujące' }
]);

const todayString = obslugaDatySzablon(dzis);
const isToday = (dateString) => dateString === todayString;
const isYesterday = (dateString) => dateString === obslugaDatySzablon(wczoraj);
const isPast = (dateString) => dateString < todayString;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};
</script>

<style scoped>
/* Estylia dla nowoczesnego, ukrytego paska przewijania na Chrome/Safari/Edge */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db; 
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af; 
}
/* Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}
</style>
