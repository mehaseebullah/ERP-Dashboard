<script setup>
import { RouterView } from 'vue-router';
</script>
<template>
  <v-layout style="height: 100vh">
    <PrimaryMenu></PrimaryMenu>
    <DashboardHeader></DashboardHeader>
    <v-main>
      <div class="w-100 h-100 custom-scroll" style="overflow: auto">
        <router-view :key="$route.path"></router-view>
      </div>
    </v-main>
  </v-layout>
</template>
