import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import { computed, ref } from 'vue';
import AuthService from '../services/auth.service';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('jwt') ?? null);
  const userEmail = ref(localStorage.getItem('user_email') ?? null);
  const user = ref(null)

  const isLoggedIn = computed(() => !!token.value);
  const hasRole = (role) => user.value?.role === role;
  
  async function login(email, password) {
    const data = await AuthService.login(email, password);
    token.value = data.token ?? null;
    userEmail.value = data.email ?? email;
    setUser()
    return data;
  }

  async function register(firstName, lastName, birthDate, email, phone, password) {
    return await AuthService.register(firstName, lastName, birthDate, email, phone, password);
  }

  function setUser(){
    if(token.value){
      const decoded = jwtDecode(token.value)
      user.value = {
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      }
    } else {
      user.value = null;
    }
  }

  // Initialize immediately from token
  setUser();
   
  function logout() {
    AuthService.logout();
    token.value = null;
    userEmail.value = null;
  }

  return {
    token,
    userEmail,
    isLoggedIn,
    user,
    hasRole,
    login,
    register,
    logout,
  };
});
