<script setup>
// import jwt_decode from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';
import { useConfigStore } from '@/store/config';
// import { storeToRefs } from 'pinia';
import { onMounted, inject, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
const modules = ref([]);
const configStore = useConfigStore();
// const { modules } = storeToRefs(configStore);

const sort = computed(() => (m) => m.sort((a, b) => a.position - b.position));
const router = useRouter();

// State for user details
const username = ref('Guest');
const profilePicture = ref('https://randomuser.me/api/portraits/women/81.jpg');

const decodeJwt = (token) => {
  try {
    const decoded = jwtDecode(token);
    // console.log('Decoded Token:', decoded);
    return decoded;
  } catch (error) {
    console.error('Invalid JWT Token', error);
    return null;
  }
};

const logout = () => {
  localStorage.removeItem('access_token');
  window.location.reload();
};
onMounted(() => {
  const jwtToken = localStorage.getItem('access_token'); // Retrieve token from localStorage
  if (jwtToken) {
    const decodedToken = decodeJwt(jwtToken);
    if (decodedToken) {
      username.value = decodedToken.Username || 'Guest'; // Adjust the key as per your token structure
      profilePicture.value = decodedToken.ProfilePicturePath || 'https://randomuser.me/api/portraits/women/81.jpg'; // Adjust the key as per your token structure
    }
  }
  modules.value = inject('modules');
});
</script>
<template>
  <v-navigation-drawer v-model="configStore.showSidebar" elevation="4" floating>
    <template v-slot:prepend>
      <v-list-item lines="two" :prepend-avatar="profilePicture" :title="username" subtitle="Logged in"></v-list-item>
      <v-divider></v-divider>
    </template>
    <div class="h-100 custom-scroll" style="overflow-y: auto">
      <v-list>
        <template v-for="module in sort(modules.filter((x) => x.isMenu == true))" :key="module.title">
          <v-list-group v-if="module?.menu?.children?.length">
            <template v-slot:activator="{ props }">
              <v-list-item :prepend-icon="module?.icon" v-bind="props" :title="module?.menu?.title"></v-list-item>
            </template>
            <template v-for="child in sort(module.menu.children.filter((x) => x.isMenu == true))" :key="child">
              <v-list-item :prepend-icon="child?.icon" :to="child?.url" :title="child?.title"></v-list-item>
            </template>
          </v-list-group>
          <v-list-item
            v-else
            exact
            :to="module.menu.url"
            :prepend-icon="module.icon"
            :title="module.menu.title"
          ></v-list-item>
        </template>
      </v-list>
    </div>
    <template v-slot:append>
      <div class="pa-2">
        <v-btn block @click="logout"> Logout </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>
