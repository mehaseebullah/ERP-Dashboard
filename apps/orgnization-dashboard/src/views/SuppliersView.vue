<script setup>
import { onMounted, ref } from 'vue';
import { useSupplierStore } from '@/store/supplier';
import { useSwal } from '@/composables/useSwal';
import { storeToRefs } from 'pinia';
const supplierStore = useSupplierStore();
const { suppliers } = storeToRefs(supplierStore);
const swal = useSwal();

const headers = [
  {
    title: 'First Name',
    key: 'firstName',
    sortable: true,
  },
  {
    title: 'Last Name',
    key: 'lastName',
  },
  {
    title: 'Email',
    key: 'emailAddress',
  },
  {
    title: 'Phone',
    key: 'contactNumber',
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
  firstName: '',
  lastName: '',
  emailAddress: '',
  contactNumber: '',
  address: ''
};

const formData = ref({ ...formModal });
const isEdit = ref(false);
const showDrawer = ref(false);

async function newSupplier() {
  formData.value = { ...formModal };
  isEdit.value = false;
  showDrawer.value = true;
}

async function createSupplier() {
  await supplierStore.createSupplier(formData.value);
  showDrawer.value = false;
  formData.value = { ...formModal };
  isEdit.value = false;
}

async function editSupplier(item) {
  formData.value = { ...item };
  isEdit.value = true;
  showDrawer.value = true;
}

async function updateSupplier() {
  await supplierStore.updateSupplier(formData.value);
  showDrawer.value = false;
  formData.value = { ...formModal };
  isEdit.value = false;
}

async function deleteSupplier(id) {
  swal.confirm('Are you sure you want to delete this supplier?').then(async (result) => {
    if (result.isConfirmed) {
      await supplierStore.deleteSupplier({ id });
      showDrawer.value = false;
    }
  });
}

onMounted(() => {
  supplierStore.fetchSuppliers();
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar color="secondary" density="compact">
        <v-spacer></v-spacer>
        <v-btn @click="newSupplier()">Create Supplier</v-btn>
      </v-toolbar>
      <v-data-table :loading="$loading('fetchSuppliers')" :headers="headers" :items="suppliers">
        <template v-slot:item.actions="{ item }">
          <v-icon class="me-2" size="small" @click="editSupplier(item)"> mdi-pencil </v-icon>
          <v-icon size="small" @click="deleteSupplier(item.id)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <main-drawer v-model="showDrawer" width="800" title="CREATE SUPPLIER" :toolbar="{ color: 'primary' }">
      <v-form class="pa-5" @submit.prevent="isEdit ? updateSupplier() : createSupplier()">
        <v-text-field v-model="formData.firstName" label="First Name" variant="outlined"></v-text-field>
        <v-text-field v-model="formData.lastName" label="Last Name" variant="outlined"></v-text-field>
        <v-text-field v-model="formData.emailAddress" label="Email" variant="outlined"></v-text-field>
        <v-text-field v-model="formData.contactNumber" label="Phone" variant="outlined"></v-text-field>
        <v-textarea v-model="formData.address" label="Address" variant="outlined"></v-textarea>
        <div class="d-flex justify-end">
          <v-btn v-if="isEdit" :loading="$loading('updateSupplier')" type="submit" color="primary">Update</v-btn>
          <v-btn v-else :loading="$loading('createSupplier')" type="submit" color="primary">Create</v-btn>
        </div>
      </v-form>
    </main-drawer>
  </v-container>
</template>
