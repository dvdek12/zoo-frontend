import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
    const isDark = ref(false);

    function init() {
        // Read from localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setTheme(true);
        } else {
            setTheme(false);
        }
    }

    function toggleTheme() {
        setTheme(!isDark.value);
    }

    function setTheme(dark) {
        isDark.value = dark;
        if (dark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }

    return {
        isDark,
        init,
        toggleTheme,
        setTheme
    };
});
