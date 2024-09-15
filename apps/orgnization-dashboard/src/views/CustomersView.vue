<script setup>
import { onMounted, ref } from 'vue';
import { useCustomerStore } from '@/store/customer';
import { useSwal } from '@/composables/useSwal';

const customerStore = useCustomerStore();
const swal = useSwal();

const headers = [
  {
    title: 'Name',
    key: 'name',
    sortable: true,
  },
  {
    title: 'Email',
    key: 'email',
  },
  {
    title: 'Phone',
    key: 'phone',
  },
  {
    title: 'Address',
    key: 'address',
  },
  {
    title: 'Actions',
    key: 'actions',
  },
];
const formModal = {
  name: '',
  email: '',
  phone: '',
  address: '',
};

const formData = ref({ ...formModal });
const isEdit = ref(false);
const showDrawer = ref(false);
const customers = ref([]);

async function loadCustomers() {
  customers.value = await customerStore.fetchCustomers();
}

async function newCustomer() {
  formData.value = { ...formModal };
  isEdit.value = false;
  showDrawer.value = true;
}

async function createCustomer() {
  await customerStore.createCustomer(formData.value);
  showDrawer.value = false;
  formData.value = { ...formModal };
  isEdit.value = false;
  loadCustomers();
}

async function editCustomer(item) {
  formData.value = { ...item };
  isEdit.value = true;
  showDrawer.value = true;
}

async function updateCustomer() {
  await customerStore.updateCustomer(formData.value);
  showDrawer.value = false;
  formData.value = { ...formModal };
  isEdit.value = false;
  loadCustomers();
}

async function deleteCustomer(id) {
  swal.confirm('Are you sure you want to delete this customer?').then(async (result) => {
    if (result.isConfirmed) {
      await customerStore.deleteCustomer({ id });
      showDrawer.value = false;
      loadCustomers();
    }
  });
}

onMounted(() => {
  loadCustomers();
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar color="secondary" density="compact">
        <v-spacer></v-spacer>
        <v-btn @click="newCustomer()">Create Customer</v-btn>
      </v-toolbar>
      <v-data-table :loading="$loading('fetchCustomers')" :headers="headers" :items="customers">
        <template v-slot:item.actions="{ item }">
          <v-icon class="me-2" size="small" @click="editCustomer(item)"> mdi-pencil </v-icon>
          <v-icon size="small" @click="deleteCustomer(item.id)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <main-drawer v-model="showDrawer" width="800" title="CREATE CUSTOMER" :toolbar="{ color: 'primary' }">
      <v-form class="pa-5" @submit.prevent="isEdit ? updateCustomer() : createCustomer()">
        <v-text-field v-model="formData.name" label="Name" variant="outlined"></v-text-field>
        <v-text-field v-model="formData.email" label="Email" variant="outlined"></v-text-field>
        <v-text-field v-model="formData.phone" label="Phone" variant="outlined"></v-text-field>
        <v-textarea v-model="formData.address" label="Address" variant="outlined"></v-textarea>
        <div class="d-flex justify-end">
          <v-btn v-if="isEdit" :loading="$loading('updateCustomer')" type="submit" color="primary">Update</v-btn>
          <v-btn v-else :loading="$loading('createCustomer')" type="submit" color="primary">Create</v-btn>
        </div>
      </v-form>
    </main-drawer>
  </v-container>
</template>
