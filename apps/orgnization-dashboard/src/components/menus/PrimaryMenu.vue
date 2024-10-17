<script setup>
import { useConfigStore } from '@/store/config';
// import { storeToRefs } from 'pinia';
import { onMounted, inject, ref, computed } from 'vue';
import {  useRouter } from 'vue-router';
const modules = ref([]);
const configStore = useConfigStore();
// const { modules } = storeToRefs(configStore);

const sort = computed(() => (m) => m.sort((a, b) => a.position - b.position));
const router = useRouter();
const logout=()=>{
localStorage.removeItem('access_token');
window.location.reload();
}
onMounted(() => {
  modules.value = inject('modules');
});
</script>
<template>
  <v-navigation-drawer v-model="configStore.showSidebar" elevation="4" floating>
    <template v-slot:prepend>
      <v-list-item lines="two" prepend-avatar="https://randomuser.me/api/portraits/women/81.jpg" title="Jane Smith"
        subtitle="Logged in"></v-list-item>
      <v-divider></v-divider>
    </template>
    <div class="h-100 custom-scroll" style="overflow-y: auto">
      <v-list>
        <template v-for="module in sort(modules.filter(x=>x.isMenu==true))" :key="module.title">
          <v-list-group v-if="module?.menu?.children?.length">
            <template v-slot:activator="{ props }">
              <v-list-item :prepend-icon="module?.icon" v-bind="props" :title="module?.menu?.title"></v-list-item>
            </template>
            <template v-for="child in sort(module.menu.children.filter(x=>x.isMenu==true))" :key="child">
              <v-list-item :prepend-icon="child?.icon" :to="child?.url" :title="child?.title"></v-list-item>
            </template>
          </v-list-group>
          <v-list-item v-else exact :to="module.menu.url" :prepend-icon="module.icon"
            :title="module.menu.title"></v-list-item>
        </template>
      </v-list>
    </div>
    <template v-slot:append>
      <div class="pa-2">
        <v-btn block @click="logout">
          Logout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>
