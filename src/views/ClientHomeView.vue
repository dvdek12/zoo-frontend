<template>
  <div class="w-full flex flex-col relative scroll-smooth">
    
    <!-- Hero Section -->
    <section id="home" class="relative w-full h-[85vh] flex items-center justify-center">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img src="/panda_bg.png" alt="Panda Background" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-r from-[#0a1a0f]/90 via-[#0a1a0f]/60 to-[#0a1a0f]/80"></div>
      </div>
      
      <!-- Content -->
      <div class="relative z-10 text-center px-6 max-w-4xl text-white">
        <h1 class="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight drop-shadow-xl text-white">
          Odkryj Dziki Świat <br/><span class="text-green-400">Natury</span>
        </h1>
        <p class="text-lg md:text-xl font-light leading-relaxed text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow-md">
          ZooNe to miejsce, w którym rytm natury spotyka się z dbałością o każdy detal.
          Zaplanuj swoją wizytę, kup bilet online i przeżyj niezapomnianą przygodę pełną wiedzy, relaksu i fascynujących odkryć.
        </p>
        <div class="flex items-center justify-center gap-4">
          <a href="#tickets" class="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-bold shadow-lg transition-all transform hover:scale-105 duration-200">
            Kup Bilet
          </a>
          <a href="#contact" class="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-bold shadow-lg transition-all duration-200">
            Jak dojechać?
          </a>
        </div>
      </div>
    </section>

    <!-- Tickets Section -->
    <section id="tickets" class="py-24 bg-[#fbfbfa]">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-extrabold text-[#1a3b22] mb-4">Cennik Biletów</h2>
          <p class="text-gray-500">Kupując online unikasz stania w kolejkach do kas. Bilety zachowują ważność 30 dni.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Ticket Card 1 -->
          <div class="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col hover:-translate-y-2 transition-transform duration-300">
            <h3 class="text-xl font-bold text-gray-800 mb-2">Bilet Ulgowy</h3>
            <p class="text-sm text-gray-500 mb-6">Dla dzieci, studentów i seniorów.</p>
            <div class="mb-8">
              <span class="text-5xl font-extrabold text-[#1a3b22]">25</span>
              <span class="text-xl text-gray-400 font-medium ml-1">PLN</span>
            </div>
            <ul class="text-sm text-gray-600 space-y-3 mb-8 flex-1">
              <li class="flex items-center gap-2">
                <span class="text-green-500">✔</span> Ważny cały dzień
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-500">✔</span> Dostęp do wszystkich stref
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-500">✔</span> Darmowy audioprzewodnik (app)
              </li>
            </ul>
            <button class="w-full bg-[#1a3b22] hover:bg-[#112918] text-white py-3 rounded-xl font-semibold transition-colors shadow-md">
              Wybierz
            </button>
          </div>

          <!-- Ticket Card 2 (Popular) -->
          <div class="bg-[#1a3b22] rounded-3xl p-8 shadow-[0_12px_40px_rgb(26,59,34,0.2)] border border-[#234c2c] flex flex-col relative transform md:-translate-y-4 hover:-translate-y-6 transition-transform duration-300 text-white">
            <div class="absolute top-0 right-8 transform -translate-y-1/2 bg-green-400 text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Najpopularniejszy
            </div>
            <h3 class="text-xl font-bold mb-2">Bilet Normalny</h3>
            <p class="text-sm text-green-200 mb-6">Standardowy bilet dla dorosłych.</p>
            <div class="mb-8">
              <span class="text-5xl font-extrabold text-white">45</span>
              <span class="text-xl text-green-300 font-medium ml-1">PLN</span>
            </div>
            <ul class="text-sm text-green-100 space-y-3 mb-8 flex-1">
              <li class="flex items-center gap-2">
                <span class="text-green-400">✔</span> Ważny cały dzień
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-400">✔</span> Dostęp do wszystkich stref
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-400">✔</span> Darmowy audioprzewodnik (app)
              </li>
            </ul>
            <button class="w-full bg-green-500 hover:bg-green-400 text-black py-3 rounded-xl font-bold transition-colors shadow-lg">
              Wybierz
            </button>
          </div>

          <!-- Ticket Card 3 -->
          <div class="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col hover:-translate-y-2 transition-transform duration-300">
            <h3 class="text-xl font-bold text-gray-800 mb-2">Bilet Rodzinny</h3>
            <p class="text-sm text-gray-500 mb-6">Dla 2 dorosłych + do 3 dzieci.</p>
            <div class="mb-8">
              <span class="text-5xl font-extrabold text-[#1a3b22]">110</span>
              <span class="text-xl text-gray-400 font-medium ml-1">PLN</span>
            </div>
            <ul class="text-sm text-gray-600 space-y-3 mb-8 flex-1">
              <li class="flex items-center gap-2">
                <span class="text-green-500">✔</span> Ważny cały dzień
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-500">✔</span> Zniżki w punktach gastro
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-500">✔</span> Darmowy parking
              </li>
            </ul>
            <button class="w-full bg-[#1a3b22] hover:bg-[#112918] text-white py-3 rounded-xl font-semibold transition-colors shadow-md">
              Wybierz
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Info/Contact Section -->
    <section id="contact" class="py-24 bg-white border-t border-gray-100">
      <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 class="text-4xl font-extrabold text-[#1a3b22] mb-6">Odwiedź nas</h2>
          <p class="text-gray-600 leading-relaxed mb-8">
            ZooNe znajduje się na obrzeżach miasta, z doskonałym dojazdem komunikacją miejską. Ogród jest otwarty przez cały rok, a my dbamy o najwyższy standard życia naszych zwierząt i wspaniałe doświadczenia dla naszych gości.
          </p>
          
          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                <MapPin class="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h4 class="font-bold text-gray-900">Adres</h4>
                <p class="text-gray-500 text-sm">ul. Przyrodnicza 15<br/>45-000 Zielone Miasto</p>
              </div>
            </div>
            
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                <Clock class="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h4 class="font-bold text-gray-900">Godziny otwarcia</h4>
                <p class="text-gray-500 text-sm">Codziennie: 9:00 - 18:00<br/>Kasy czynne do 17:00</p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                <Phone class="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h4 class="font-bold text-gray-900">Kontakt</h4>
                <p class="text-gray-500 text-sm">+48 123 456 789<br/>kontakt@zoone.pl</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Fake Map Placeholder -->
        <div class="w-full h-[400px] bg-gray-100 rounded-3xl border border-gray-200 overflow-hidden relative group">
          <div class="absolute inset-0 bg-[#e8eedd] flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <MapIcon class="w-16 h-16 text-[#8ea785] mb-4 drop-shadow-sm" />
            <span class="font-bold text-[#5c7255]">Mapa Dojazdu</span>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { MapPin, Clock, Phone, Map as MapIcon } from 'lucide-vue-next';
</script>

<style>
html {
  scroll-behavior: smooth;
}
</style>
