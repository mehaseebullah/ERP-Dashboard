<script setup>
import HeaderLayout from './HeaderLayout.vue';
import SidebarLayout from './SidebarLayout.vue';
</script>
<template>
  <v-layout>
    <SidebarLayout></SidebarLayout>
    <HeaderLayout></HeaderLayout>
    <v-main style="min-height: 300px">
      <router-view :key="$route.path"></router-view>
    </v-main>
  </v-layout>
</template>
