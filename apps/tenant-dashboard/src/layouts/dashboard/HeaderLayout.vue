<script setup>
import { useConfigStore } from '../../store/config';
const configStore = useConfigStore();
</script>
<template>
  <v-app-bar title="ERP" border="b" flat>
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="configStore.showSidebar = !configStore.showSidebar"></v-app-bar-nav-icon>
    </template>

    <template v-slot:append>
      <v-btn icon="mdi-dots-vertical"></v-btn>
    </template>
  </v-app-bar>
</template>
