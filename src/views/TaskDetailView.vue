<template>
  <div class="p-8 h-full flex flex-col">
    <div class="mb-6 flex items-center">
      <router-link to="/dashboard" class="text-[#2d6a4f] hover:text-[#1a3b22] font-semibold flex items-center gap-2 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Wróć do pulpitu
      </router-link>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-8 flex-1 max-w-4xl">
      <div v-if="task">
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-3xl font-bold text-[#1a3b22]">{{ task.title }}</h2>
          <div 
            :class="[
              'px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase whitespace-nowrap',
              task.status === 'Zakończone' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
            ]"
          >
            {{ task.status }}
          </div>
        </div>
        
        <p class="text-gray-500 mb-8 flex items-center gap-2 text-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Termin zadania: {{ formatDate(task.date) }}
        </p>

        <div class="prose max-w-none mb-10">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Opis i instrukcje</h3>
          <p class="text-gray-600 leading-relaxed text-lg mb-4">
            Szczegółowe instrukcje i uwagi merytoryczne dotyczące wybranego zadania w ogrodzie zoologicznym. Ze względu na bezpieczeństwo i specyfikę pracy zwierząt każda praca musi zostać udokumentowana.
          </p>
          <ul class="list-disc pl-5 text-gray-600 mb-6 space-y-2">
            <li>Należy przestrzegać rygorystycznych norm BHP przed przystąpieniem do czynności.</li>
            <li>Upewnić się, że sektor jest odpowiednio zabezpieczony.</li>
            <li>Po wykonaniu pracy należy zgłosić ewentualne nieprawidłowości kierownikowi sekcji.</li>
          </ul>
        </div>
        
        <div class="flex gap-4 border-t pt-8 border-gray-100">
          <button v-if="task.status !== 'Zakończone'" class="px-6 py-3 bg-[#2d6a4f] text-white rounded-lg font-bold hover:bg-[#1a3b22] transition-colors shadow-md flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Oznacz jako zakończone
          </button>
          <button class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors shadow-sm focus:ring-2 focus:ring-gray-300">
            Zgłoś problem / Potrzebna pomoc
          </button>
        </div>
      </div>
      <div v-else class="text-center py-20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-2xl font-bold text-gray-400 mb-2">Nie znaleziono zadania</h2>
        <p class="text-gray-500">Zadanie o podanym identyfikatorze nie istnieje lub zostało usunięte.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';

const route = useRoute();
const taskId = route.params.taskId;

// Mock danych (analogicznie do DashboardView)
const task = ref(null);

const p = (daysOffset) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const rok = d.getFullYear();
  const miesiac = String(d.getMonth() + 1).padStart(2, '0');
  const dzien = String(d.getDate()).padStart(2, '0');
  return `${rok}-${miesiac}-${dzien}`;
};

const tasksMock = [
  { id: 0, title: 'Dezynfekcja klatek dla ptaków', date: p(-2), status: 'Zakończone' },
  { id: 1, title: 'Przegląd medyczny lwów', date: p(-1), status: 'Zakończone' },
  { id: 2, title: 'Wybieg dla słoni - czyszczenie i kontrola zabawek', date: p(0), status: 'W toku' },
  { id: 3, title: 'Karmienie pingwinów przylądkowych', date: p(0), status: 'W toku' },
  { id: 4, title: 'Wymiana wody w akwarium nr 4', date: p(0), status: 'Oczekujące' },
  { id: 5, title: 'Spotkanie zespołu ds. naczelnych', date: p(1), status: 'Oczekujące' },
  { id: 6, title: 'Dostawa karmy dla roślinożerców', date: p(1), status: 'Oczekujące' },
  { id: 7, title: 'Szkolenie BHP dla nowych wolontariuszy', date: p(2), status: 'Oczekujące' },
  { id: 8, title: 'Inwentaryzacja sprzętu weterynaryjnego', date: p(3), status: 'Oczekujące' }
];

onMounted(() => {
  task.value = tasksMock.find(t => t.id === Number(taskId)) || null;
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};
</script>
