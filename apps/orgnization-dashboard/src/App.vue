<script setup>
import { RouterView } from 'vue-router';
import router from './routes';
import { shallowRef } from 'vue';
import layouts from './layouts';

const layout = shallowRef('div');
router.beforeEach((to) => {
  layout.value = layouts[to?.meta?.layout] || 'div';
});
</script>
<template>
  <v-app>
    <component :is="layout">
      <router-view />
    </component>
  </v-app>
</template>
