<template>
  <div class="pa-5">
    <div v-if="showAddUnit">
      <v-btn prepend-icon="mdi-arrow-left" variant="text" @click="showAddUnit = false">Units</v-btn>
      <AddProductUnit></AddProductUnit>
    </div>
    <div v-else>
      <v-toolbar color="primary" density="compact" title="Product Units" class="mb-2">
        <v-btn color="accent" variant="flat" @click="showAddUnit = true">Add Unit</v-btn>
      </v-toolbar>
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="units"
        item-value="title"
        class="elevation-1"
      ></v-data-table>
    </div>
  </div>
</template>

<script setup>
import AddProductUnit from './AddProductUnit.vue';

const showAddUnit = ref(false);
const itemsPerPage = 5;
const headers = [
  {
    title: 'Title',
    align: 'start',
    key: 'title',
  },
  { title: 'Description', align: 'start', key: 'description' },
];
const units = [
  {
    title: 'xyz',
    description: 'abc hello desc',
  },
  {
    title: 'xyz',
    description: 'abc hello desc',
  },
  {
    title: 'xyz',
    description: 'abc hello desc',
  },
];
</script>
