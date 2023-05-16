<template>
  <div class="pa-5">
    <div v-if="showAddCategory">
      <v-btn prepend-icon="mdi-arrow-left" variant="text" @click="showAddCategory = false">Categories</v-btn>
      <AddProductCategory></AddProductCategory>
    </div>
    <div v-else>
      <v-toolbar color="primary" density="compact" title="Product Categories" class="mb-2">
        <v-btn color="accent" variant="flat" @click="showAddCategory = true">Add Category</v-btn>
      </v-toolbar>
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="categories"
        item-value="title"
        class="elevation-1"
      ></v-data-table>
    </div>
  </div>
</template>

<script setup>
import AddProductCategory from './AddProductCategory.vue';
import { ref } from 'vue';

const showAddCategory = ref(false);
const itemsPerPage = 5;
const headers = [
  {
    title: 'Title',
    align: 'start',
    key: 'title',
  },
  { title: 'Description', align: 'start', key: 'description' },
];
const categories = [
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
