<template>
<div>
    <input v-model="animalName" placeholder="Wpisz zwierzę (np. Lion)" />
    <button @click="fetchAnimal">Szukaj</button>

    <div v-if="loading">Ładowanie...</div>
    <pre v-if="result">{{ result }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const animalName = ref('');
const result = ref(null);
const loading = ref(false);

const fetchAnimal = async () => {
  loading.value = true;
  try {
    // Adres Twojego lokalnego API .NET
    const response = await axios.get(`https://localhost:7293/api/external-animals/${animalName.value}`);
    result.value = response.data;
    console.log(result.value)
  } catch (error) {
    console.error("Błąd:", error);
  } finally {
    loading.value = false;
  }
};
</script>