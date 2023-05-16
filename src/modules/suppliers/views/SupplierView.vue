<template>
  <div class="pa-5">
    <div v-if="showAddSupplier">
      <v-btn prepend-icon="mdi-arrow-left" variant="text" @click="showAddSupplier = false">Suppliers</v-btn>
      <AddSupplier></AddSupplier>
    </div>
    <div v-else>
      <v-toolbar color="primary" density="compact" title="Suppliers" class="mb-2">
        <v-btn color="accent" variant="flat" @click="showAddSupplier = true">Add Suppliers</v-btn>
      </v-toolbar>
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="suppliers"
        item-value="name"
        class="elevation-1"
      ></v-data-table>
    </div>
  </div>
</template>

<script setup>
import AddSupplier from './AddSupplier.vue';
import { ref } from 'vue';

const showAddSupplier = ref(false);
const itemsPerPage = 5;
const headers = [
  {
    title: 'Name',
    align: 'start',
    key: 'name',
  },
  { title: 'Phone No', align: 'end', key: 'phoneNo' },
  { title: 'Email', align: 'end', key: 'email' },
  { title: 'Address', align: 'end', key: 'address' },
];
const suppliers = [
  {
    name: 'xyz',
    phoneNo: '+9231310000',
    email: 'abc@xyz.com',
    address: 'abc hello street',
  },
  {
    name: 'xyz',
    phoneNo: '+9231310000',
    email: 'abc@xyz.com',
    address: 'abc hello street',
  },
  {
    name: 'xyz',
    phoneNo: '+9231310000',
    email: 'abc@xyz.com',
    address: 'abc hello street',
  },
  {
    name: 'xyz',
    phoneNo: '+9231310000',
    email: 'abc@xyz.com',
    address: 'abc hello street',
  },
];
</script>
