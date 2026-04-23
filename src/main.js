import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt')

        if(token){
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)
createApp(App).use(router).mount('#app')
