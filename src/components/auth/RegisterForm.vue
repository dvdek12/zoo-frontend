<template>
  <div>
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-[#1a3b22] mb-1">Create account</h2>
      <p class="text-gray-500 text-sm">Register as a new staff member.</p>
    </div>
    <form class="space-y-5" @submit.prevent="handleRegister">
      <!-- First Name & Last Name -->
      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Imię</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <UserIcon class="w-5 h-5" />
            </div>
            <input
              type="text"
              v-model="regFirstName"
              placeholder="Jan"
              required
              class="w-full pl-10 pr-4 py-4 bg-[#e8e7e3]/60 focus:bg-[#e8e7e3] border border-transparent focus:border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none transition-colors"
            />
          </div>
        </div>
        <div class="flex-1">
          <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Nazwisko</label>
          <input
            type="text"
            v-model="regLastName"
            placeholder="Kowalski"
            required
            class="w-full px-4 py-4 bg-[#e8e7e3]/60 focus:bg-[#e8e7e3] border border-transparent focus:border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <!-- Date of Birth -->
      <div>
        <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Data urodzenia</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <CalendarIcon class="w-5 h-5" />
          </div>
          <input
            type="date"
            v-model="regBirthDate"
            required
            class="w-full pl-10 pr-4 py-4 bg-[#e8e7e3]/60 focus:bg-[#e8e7e3] border border-transparent focus:border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <!-- Email -->
      <div>
        <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Email</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <Mail class="w-5 h-5" />
          </div>
          <input
            type="email"
            v-model="regEmail"
            placeholder="jan.kowalski@gmail.com"
            required
            class="w-full pl-10 pr-4 py-4 bg-[#e8e7e3]/60 focus:bg-[#e8e7e3] border border-transparent focus:border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <!-- Phone (optional) -->
      <div>
        <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
          Telefon <span class="text-gray-400 font-normal normal-case tracking-normal">(opcjonalne)</span>
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <PhoneIcon class="w-5 h-5" />
          </div>
          <input
            type="tel"
            v-model="regPhone"
            placeholder="+48 123 456 789"
            class="w-full pl-10 pr-4 py-4 bg-[#e8e7e3]/60 focus:bg-[#e8e7e3] border border-transparent focus:border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <!-- Password -->
      <div>
        <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Hasło</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <KeyRound class="w-5 h-5" />
          </div>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="regPassword"
            placeholder="Min. 8 znaków"
            required
            class="w-full pl-10 pr-10 py-4 bg-[#e8e7e3]/60 focus:bg-[#e8e7e3] border border-transparent focus:border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none transition-colors"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <EyeOff v-if="showPassword" class="w-5 h-5" />
            <Eye v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full flex items-center justify-center gap-2 bg-[#1b4324] hover:bg-[#113118] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-full font-semibold transition-colors duration-200 mt-2"
      >
        <span v-if="isLoading" class="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
        <template v-else>
          Utwórz konto
          <ArrowRight class="w-5 h-5" />
        </template>
      </button>

      <!-- Komunikaty odpowiedzi -->
      <Transition name="msg-fade">
        <div v-if="messages.length > 0" :class="[
          'mt-4 px-4 py-3 rounded-lg text-sm font-medium',
          isSuccess
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        ]">
          <ul v-if="messages.length > 1" class="list-disc list-inside space-y-1">
            <li v-for="(msg, i) in messages" :key="i">{{ msg }}</li>
          </ul>
          <span v-else>{{ messages[0] }}</span>
        </div>
      </Transition>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../../services/auth.service';
import { Mail, KeyRound, ArrowRight, Eye, EyeOff, User as UserIcon, Calendar as CalendarIcon, Phone as PhoneIcon } from 'lucide-vue-next';

const regFirstName = ref('');
const regLastName = ref('');
const regBirthDate = ref('');
const regEmail = ref('');
const regPhone = ref('');
const regPassword = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const messages = ref([]);
const isSuccess = ref(false);

const router = useRouter();

/**
 * Wyciąga listę komunikatów z różnych formatów odpowiedzi błędu backendu.
 * Backend zwraca: [ { code, description }, ... ]  (tablica na root level)
 */
function parseErrors(error) {
  const data = error?.response?.data;
  if (!data) return ['Wystąpił nieoczekiwany błąd. Spróbuj ponownie.'];

  // ✅ ASP.NET Identity: root-level array [ { code, description } ]
  if (Array.isArray(data)) {
    const msgs = data.map(e => (typeof e === 'object' ? e.description ?? e.message ?? JSON.stringify(e) : String(e)));
    if (msgs.length) return msgs;
  }

  // ASP.NET Identity opakowane: { errors: [ { code, description } ] }
  if (Array.isArray(data.errors)) {
    const msgs = data.errors.map(e => (typeof e === 'object' ? e.description ?? e.message ?? JSON.stringify(e) : String(e)));
    if (msgs.length) return msgs;
  }

  // ModelState / ProblemDetails: { errors: { field: ['msg'] } }
  if (data.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
    const msgs = Object.values(data.errors).flat().map(String);
    if (msgs.length) return msgs;
  }

  if (data.message) return [String(data.message)];
  if (data.title)   return [String(data.title)];
  if (typeof data === 'string' && data.trim()) return [data.trim()];

  return ['Wystąpił nieoczekiwany błąd. Spróbuj ponownie.'];
}

const handleRegister = async () => {
  messages.value = [];
  isLoading.value = true;

  try {
    await AuthService.register(
      regFirstName.value,
      regLastName.value,
      regBirthDate.value,
      regEmail.value,
      regPhone.value,
      regPassword.value
    );

    isSuccess.value = true;
    messages.value = ['Konto zostało utworzone! Możesz się teraz zalogować.'];
    setTimeout(() => router.push('/login'), 1500);

  } catch (error) {
    isSuccess.value = false;
    messages.value = parseErrors(error);
    console.error('[RegisterForm] full error object:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.msg-fade-enter-active,
.msg-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.msg-fade-enter-from,
.msg-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
