<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-employee-title"
    >
      <!-- Overlay -->
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        @click="$emit('close')"
      />

      <!-- Modal panel -->
      <div class="relative z-10 w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="px-8 pt-7 pb-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
          <div>
            <h2 id="register-employee-title" class="text-xl font-bold text-[#1a3b22] dark:text-green-400 tracking-tight">
              Zarejestruj pracownika
            </h2>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Uzupełnij dane nowego członka zespołu</p>
          </div>
          <button
            id="close-register-employee-modal"
            @click="$emit('close')"
            class="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="submit" class="overflow-y-auto flex-1 custom-scrollbar">
          <div class="px-8 py-6 flex flex-col gap-5">

            <!-- Imię + Nazwisko -->
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label for="emp-firstname" class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Imię *</label>
                <input
                  id="emp-firstname"
                  v-model="form.firstName"
                  type="text"
                  required
                  maxlength="50"
                  placeholder="Jan"
                  class="input-field"
                  :class="{ 'border-red-400': errors.firstName }"
                />
                <span v-if="errors.firstName" class="text-xs text-red-500">{{ errors.firstName }}</span>
              </div>
              <div class="flex flex-col gap-1.5">
                <label for="emp-lastname" class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Nazwisko *</label>
                <input
                  id="emp-lastname"
                  v-model="form.lastName"
                  type="text"
                  required
                  maxlength="50"
                  placeholder="Kowalski"
                  class="input-field"
                  :class="{ 'border-red-400': errors.lastName }"
                />
                <span v-if="errors.lastName" class="text-xs text-red-500">{{ errors.lastName }}</span>
              </div>
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-1.5">
              <label for="emp-email" class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Email *</label>
              <input
                id="emp-email"
                v-model="form.email"
                type="email"
                required
                placeholder="jan.kowalski@zoo.pl"
                class="input-field"
                :class="{ 'border-red-400': errors.email }"
              />
              <span v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</span>
            </div>

            <!-- Hasło -->
            <div class="flex flex-col gap-1.5">
              <label for="emp-password" class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Hasło *</label>
              <div class="relative">
                <input
                  id="emp-password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="Minimum 8 znaków"
                  class="input-field pr-10"
                  :class="{ 'border-red-400': errors.password }"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  tabindex="-1"
                >
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                </button>
              </div>
              <span v-if="errors.password" class="text-xs text-red-500">{{ errors.password }}</span>
            </div>

            <!-- Data urodzenia -->
            <div class="flex flex-col gap-1.5">
              <label for="emp-birthday" class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Data urodzenia *</label>
              <input
                id="emp-birthday"
                v-model="form.birthDay"
                type="date"
                required
                class="input-field"
                :class="{ 'border-red-400': errors.birthDay }"
              />
              <span v-if="errors.birthDay" class="text-xs text-red-500">{{ errors.birthDay }}</span>
            </div>

            <!-- Telefon -->
            <div class="flex flex-col gap-1.5">
              <label for="emp-phone" class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Telefon <span class="text-gray-400 normal-case font-normal">(opcjonalnie)</span></label>
              <input
                id="emp-phone"
                v-model="form.phoneNumber"
                type="tel"
                placeholder="+48 600 123 456"
                class="input-field"
              />
            </div>

            <!-- Supervisor ID + Role ID (opcjonalne) -->
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label for="emp-supervisor" class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">ID Supervisora <span class="text-gray-400 normal-case font-normal">(opcj.)</span></label>
                <input
                  id="emp-supervisor"
                  v-model.number="form.supervisorId"
                  type="number"
                  min="1"
                  placeholder="np. 1"
                  class="input-field"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label for="emp-role" class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">ID Roli <span class="text-gray-400 normal-case font-normal">(opcj.)</span></label>
                <input
                  id="emp-role"
                  v-model.number="form.roleId"
                  type="number"
                  min="1"
                  placeholder="np. 2"
                  class="input-field"
                />
              </div>
            </div>

            <!-- Icon Upload -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                Zdjęcie / Ikonka
                <span class="text-gray-400 normal-case font-normal ml-1">(opcjonalnie)</span>
              </label>
              <div
                class="relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer p-5"
                :class="[
                  isDraggingIcon
                    ? 'border-[#2d6a4f] bg-[#f0f9f4] dark:bg-[#132a1e]'
                    : 'border-gray-200 dark:border-gray-700 hover:border-[#2d6a4f]/60 bg-gray-50 dark:bg-gray-800/50'
                ]"
                @dragover.prevent="isDraggingIcon = true"
                @dragleave.prevent="isDraggingIcon = false"
                @drop.prevent="onIconDrop"
                @click="$refs.iconFileInput.click()"
              >
                <input
                  ref="iconFileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="onIconFileChange"
                />

                <!-- Preview -->
                <div v-if="iconPreview" class="flex flex-col items-center gap-2">
                  <div class="relative">
                    <img :src="iconPreview" alt="Podgląd" class="w-20 h-20 rounded-2xl object-cover shadow-md border-2 border-[#2d6a4f]/30" />
                    <button
                      type="button"
                      @click.stop="removeIcon"
                      class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                    </button>
                  </div>
                  <p class="text-xs text-[#2d6a4f] dark:text-green-400 font-medium">{{ iconFile?.name }}</p>
                </div>

                <!-- Placeholder -->
                <template v-else>
                  <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div class="text-center">
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Przeciągnij plik lub <span class="text-[#2d6a4f] dark:text-green-400 underline underline-offset-2">kliknij</span></p>
                    <p class="text-xs text-gray-400 mt-0.5">PNG, JPG, WebP — maks. 5 MB</p>
                  </div>
                </template>

                <!-- Upload error -->
                <p v-if="iconUploadError" class="text-xs text-red-500 flex items-center gap-1" @click.stop>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                  {{ iconUploadError }}
                </p>
              </div>
            </div>

            <!-- Server error -->
            <div v-if="serverError" class="flex items-start gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
              <span>{{ serverError }}</span>
            </div>

            <!-- Success -->
            <div v-if="success" class="flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              Pracownik został zarejestrowany pomyślnie!
            </div>
          </div>
        </form>

        <!-- Footer buttons -->
        <div class="px-8 py-5 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 shrink-0 bg-gray-50/50 dark:bg-gray-900/50">
          <button
            id="cancel-register-employee"
            type="button"
            @click="$emit('close')"
            class="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Anuluj
          </button>
          <button
            id="submit-register-employee"
            type="submit"
            :disabled="isLoading"
            @click="submit"
            class="px-5 py-2.5 rounded-xl bg-[#2d6a4f] hover:bg-[#1a3b22] text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transform hover:-translate-y-0.5 disabled:transform-none"
          >
            <svg v-if="isLoading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <span>{{ isLoading ? 'Rejestrowanie…' : 'Zarejestruj' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive } from 'vue';
import employeeService from '../../services/employee.service';
import iconService from '../../services/icon.service';

const emit = defineEmits(['close', 'save']);

// --- ICON UPLOAD ---
const iconFile = ref(null);
const iconPreview = ref(null);
const isDraggingIcon = ref(false);
const iconUploadError = ref(null);
const iconFileInput = ref(null);

const onIconFileChange = (e) => {
  const file = e.target.files?.[0];
  if (file) setIconFile(file);
};

const onIconDrop = (e) => {
  isDraggingIcon.value = false;
  const file = e.dataTransfer.files?.[0];
  if (file) setIconFile(file);
};

const setIconFile = (file) => {
  iconUploadError.value = null;
  if (!file.type.startsWith('image/')) {
    iconUploadError.value = 'Dozwolone są tylko pliki graficzne (PNG, JPG, WebP).';
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    iconUploadError.value = 'Plik jest zbyt duży. Maksymalny rozmiar to 5 MB.';
    return;
  }
  iconFile.value = file;
  iconPreview.value = URL.createObjectURL(file);
};

const removeIcon = () => {
  iconFile.value = null;
  iconPreview.value = null;
  iconUploadError.value = null;
  if (iconFileInput.value) iconFileInput.value.value = '';
};

const showPassword = ref(false);
const isLoading = ref(false);
const serverError = ref(null);
const success = ref(false);

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  birthDay: '',
  phoneNumber: '',
  supervisorId: null,
  roleId: null,
});

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  birthDay: '',
});

const validate = () => {
  let valid = true;
  errors.firstName = form.firstName.trim() ? '' : 'Imię jest wymagane';
  errors.lastName  = form.lastName.trim()  ? '' : 'Nazwisko jest wymagane';
  errors.email     = form.email.trim()     ? '' : 'Email jest wymagany';
  errors.birthDay  = form.birthDay         ? '' : 'Data urodzenia jest wymagana';
  errors.password  = form.password.length >= 1 ? '' : 'Hasło jest wymagane';

  for (const k in errors) { if (errors[k]) valid = false; }
  return valid;
};

const submit = async () => {
  serverError.value = null;
  success.value = false;

  if (!validate()) return;

  const dto = {
    FirstName:    form.firstName.trim(),
    LastName:     form.lastName.trim(),
    Email:        form.email.trim(),
    Password:     form.password,
    BirthDay:     new Date(form.birthDay).toISOString(),
    PhoneNumber:  form.phoneNumber.trim() || undefined,
    SupervisorId: form.supervisorId || undefined,
    RoleId:       form.roleId || undefined,
  };

  isLoading.value = true;
  try {
    // Krok 1: jeśli wybrano ikonkę — wyślij ją najpierw i pobierz iconId
    let iconId = null;
    if (iconFile.value) {
      const iconResult = await iconService.upload(iconFile.value);
      // Backend zwraca obiekt z polem id lub iconId
      iconId = iconResult?.id ?? iconResult?.iconId ?? null;
      console.log('[RegisterEmployeeModal] Icon uploaded, iconId:', iconId);
    }

    // Krok 2: zarejestruj pracownika z IconId (jeśli dostępne)
    const finalDto = {
      ...dto,
      ...(iconId !== null && { IconId: iconId }),
    };

    await employeeService.register(finalDto);
    success.value = true;
    // Emituj zdarzenie po krótkim opóźnieniu (żeby user zobaczył sukces)
    setTimeout(() => emit('save'), 1200);
  } catch (err) {
    serverError.value =
      err?.response?.data?.message ??
      (typeof err?.response?.data === 'string' ? err.response.data : null) ??
      'Nie udało się zarejestrować pracownika. Spróbuj ponownie.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.input-field {
  display: block;
  width: 100%;
  padding: 0.625rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #ffffff;
  color: #111827;
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: colors 0.15s ease;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  outline: none;
}

.input-field::placeholder {
  color: #9ca3af;
}

.input-field:focus {
  box-shadow: 0 0 0 2px #2d6a4f;
  border-color: #2d6a4f;
}

:global(.dark) .input-field {
  border-color: #374151;
  background-color: #1f2937;
  color: #ffffff;
}

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 4px; }
:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #374151; }
</style>
