<script setup>
import { RouterView } from 'vue-router';
</script>
<template>
  <v-app>
    <component :is="$route.meta.layout">
      <router-view />
    </component>
  </v-app>
</template>
