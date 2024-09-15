<script setup>
import { ref } from 'vue';

const showDrawer = ref(false);

const items = [
  {
    name: 'African Elephant',
    species: 'Loxodonta africana',
    diet: 'Herbivore',
    habitat: 'Savanna, Forests',
  },
  // ... more items
];
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar color="secondary" density="compact">
        <v-spacer></v-spacer>
        <v-btn @click="showDrawer = !showDrawer">Create User</v-btn>
      </v-toolbar>
      <v-table>
        <v-data-table :items="items"></v-data-table>
      </v-table>
    </v-card>
    <main-drawer v-model="showDrawer" width="800" title="CREATE USER" :toolbar="{ color: 'primary' }">
      <v-form class="pa-5">
        <v-text-field label="Name" variant="outlined"></v-text-field>
        <v-text-field label="Email" variant="outlined"></v-text-field>
        <v-text-field label="Password" variant="outlined"></v-text-field>
        <v-text-field label="Confirm Password" variant="outlined"></v-text-field>
        <div class="d-flex justify-end">
          <v-btn type="submit" color="primary">Create</v-btn>
        </div>
      </v-form>
    </main-drawer>
  </v-container>
</template>
