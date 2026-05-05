<template>
  <div>
    <input v-model="animalName" placeholder="Wpisz zwierzę (np. Lion)" @keyup.enter="search" />
    <button @click="search">Szukaj</button>

    <div v-if="isLoading">Ładowanie...</div>
    <div v-if="error" style="color: red">{{ error }}</div>
    <pre v-if="results.length">{{ results }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAnimalSearch } from '../composables/useAnimalSearch';

const animalName = ref('');
const { results, isLoading, error, searchAnimals } = useAnimalSearch();

const search = () => searchAnimals(animalName.value);
</script>
