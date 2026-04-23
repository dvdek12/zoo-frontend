import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import AuthService from '../services/auth.service';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('jwt') ?? null);
  const userEmail = ref(localStorage.getItem('user_email') ?? null);

  const isLoggedIn = computed(() => !!token.value);
  
  async function login(email, password) {
    const data = await AuthService.login(email, password);
    token.value = data.token ?? null;
    userEmail.value = data.email ?? email;
    return data;
  }

  async function register(firstName, lastName, birthDate, email, phone, password) {
    return await AuthService.register(firstName, lastName, birthDate, email, phone, password);
  }
   
  function logout() {
    AuthService.logout();
    token.value = null;
    userEmail.value = null;
  }

  return {
    token,
    userEmail,
    isLoggedIn,
    login,
    register,
    logout,
  };
});
