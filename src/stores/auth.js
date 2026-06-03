import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import { computed, ref } from 'vue';
import AuthService from '../services/auth.service';
import { startNotificationHub, stopNotificationHub } from '../services/notification.service';


export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('jwt') ?? null);
  const userEmail = ref(localStorage.getItem('user_email') ?? null);
  const user = ref(null)

  const isLoggedIn = computed(() => !!token.value);
  // roles is always an array, e.g. ['Employee', 'Manager']
  const hasRole = (role) => user.value?.roles?.includes(role) ?? false;
  const hasAnyRole = (...rolesToCheck) => rolesToCheck.some(r => hasRole(r));
  
  async function login(email, password) {
    const data = await AuthService.login(email, password);
    token.value = data.token ?? null;
    userEmail.value = data.email ?? email;
    await startNotificationHub( () => token.value, (notification) => {
        console.log("Received notification:", notification);
      }
    );
    setUser();
    return data;
  }

  async function register(firstName, lastName, birthDate, email, phone, password) {
    return await AuthService.register(firstName, lastName, birthDate, email, phone, password);
  }

  function setUser(){
    if(token.value){
      const decoded = jwtDecode(token.value)
      const rawRoles = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      // JWT może zwrócić string (1 rola) lub tablicę (wiele ról) — normalizujemy do tablicy
      const roles = rawRoles
        ? Array.isArray(rawRoles) ? rawRoles : [rawRoles]
        : []
      user.value = { roles };
    }
  }

  setUser();
   
  function logout() {
    stopNotificationHub();
    localStorage.removeItem('jwt');
    localStorage.removeItem('user_email');
    token.value = null;
    userEmail.value = null;
    user.value = null;
  }

  return {
    token,
    userEmail,
    isLoggedIn,
    user,
    hasRole,
    hasAnyRole,
    login,
    register,
    logout,
  };
});
