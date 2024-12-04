<script setup>
import { jwtDecode } from 'jwt-decode';
import { useConfigStore } from '@/store/config';
import { onMounted, inject, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const modules = ref([]);
const configStore = useConfigStore();
const router = useRouter();

// State for user details
const username = ref('Guest');
const profilePicture = ref('https://randomuser.me/api/portraits/women/81.jpg');

const decodeJwt = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error('Invalid JWT Token', error);
    return null;
  }
};

const logout = () => {
  localStorage.clear();
  router.push('/');
};

onMounted(() => {
  const jwtToken = localStorage.getItem('prog_access_token'); // Retrieve token from localStorage
  if (jwtToken) {
    const decodedToken = decodeJwt(jwtToken);
    // console.log('decoded token is : ', decodedToken);

    if (decodedToken) {
      username.value = decodedToken.Username || 'Guest'; // Adjust the key as per your token structure
      profilePicture.value = decodedToken.ProfilePicturePath || 'https://randomuser.me/api/portraits/women/81.jpg'; // Adjust the key as per your token structure
    }
  }
  // modules.value = inject('modules');
});
</script>
<template>
  <v-navigation-drawer v-model="configStore.showSidebar" elevation="4" floating>
    <template v-slot:prepend>
      <v-list-item lines="two" :prepend-avatar="profilePicture" :title="username" subtitle="Logged in"></v-list-item>
    </template>

    <v-divider></v-divider>

    <v-list color="primary" density="compact" nav>
      <v-list-item exact to="/home" prepend-icon="mdi-home-city" title="Home"></v-list-item>
      <v-list-item to="/workspace" prepend-icon="mdi-account-group" title="Workspace"></v-list-item>
      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-wrench" title="Settings"></v-list-item>
        </template>
        <v-list-item title="Change Password"></v-list-item>
      </v-list-group>
    </v-list>
    <template v-slot:append>
      <div class="pa-2">
        <v-btn block @click="logout"> Logout </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>
