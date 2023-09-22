<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue';

const message: Ref<string> = ref('Greeting')
</script>
<template>
  <div class="about">
    <h1 class="text-red-500">{{ message }}</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
