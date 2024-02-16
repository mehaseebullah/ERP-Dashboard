<script setup>
import { useConfigStore } from '@/store/config';

const configStore = useConfigStore();
</script>
<template>
  <v-navigation-drawer v-model="configStore.showSidebar" elevation="4" floating>
    <template v-slot:prepend>
      <v-list-item
        lines="two"
        prepend-avatar="https://randomuser.me/api/portraits/women/81.jpg"
        title="Jane Smith"
        subtitle="Logged in"
      ></v-list-item>
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
  </v-navigation-drawer>
</template>
