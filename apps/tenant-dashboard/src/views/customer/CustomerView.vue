<template>
  <div class="pa-5">
    <div v-if="showAddCustomer">
      <v-btn prepend-icon="mdi-arrow-left" variant="text" @click="showAddCustomer = false">Customers</v-btn>
      <AddCustomer></AddCustomer>
    </div>
    <div v-else>
      <v-toolbar color="primary" density="compact" title="Customers" class="mb-2">
        <v-btn color="accent" variant="flat" @click="showAddCustomer = true">Add Customer</v-btn>
      </v-toolbar>
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="customers"
        item-value="name"
        class="elevation-1"
      ></v-data-table>
    </div>
  </div>
</template>

<script setup>
import AddCustomer from './AddCustomer.vue';
import { ref } from 'vue';

const showAddCustomer = ref(false);
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
const customers = [
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
