<script setup>
import DashboardHeader from '@/components/DashboardHeader.vue';
import PrimaryMenu from '@/components/PrimaryMenu.vue';
import { RouterView } from 'vue-router';
</script>
<template>
  <v-layout>
    <PrimaryMenu></PrimaryMenu>
    <DashboardHeader></DashboardHeader>
    <v-main style="min-height: 300px">
      <router-view :key="$route.path"></router-view>
    </v-main>
  </v-layout>
</template>
