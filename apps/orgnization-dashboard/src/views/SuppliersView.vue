<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useSupplierStore } from '@/store/supplier';
import { useSwal } from '@/composables/useSwal';
import { storeToRefs } from 'pinia';
import { useBalanceSheetStore } from '@/store/balanceSheet';
import rules from '@/helpers/rules';
import { useRoute } from 'vue-router';
import { hasPermission } from '@/helpers/utils';

const route = useRoute();
const permissionCodes = route.meta.permissionCodes || [];

// to check permissions based on action type
const canCreate = computed(() => hasPermission('Create', permissionCodes));
const canRead = computed(() => hasPermission('Read', permissionCodes));
const canUpdate = computed(() => hasPermission('Update', permissionCodes));
const canDelete = computed(() => hasPermission('Delete', permissionCodes));

const supplierStore = useSupplierStore();
const balanceSheetStore = useBalanceSheetStore();

const { suppliers } = storeToRefs(supplierStore);
const { ledgerDetails } = storeToRefs(balanceSheetStore);

const swal = useSwal();
const dialog = ref(false);
const drawerTitle = computed(() => (isEdit.value ? 'UPDATE SUPPLIER' : 'CREATE SUPPLIER'));

const cancelDialog = () => {
  ledgerDetails.value = [];
  dialog.value = false;
};

watch(dialog, (newValue) => {
  if (!newValue) {
    cancelDialog();
  }
});

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

const ledgerHeaders = [
  {
    title: '',
    key: '',
  },
  {
    title: 'Charts of Account',
    key: 'chartsOfAccount',
  },
  {
    title: 'Account Group',
    key: 'accountGroup',
  },
  {
    title: 'Account Type',
    key: 'accountType',
  },
  {
    title: 'Transction Date',
    key: 'tranactionDate',
  },
  {
    title: 'Debit',
    key: 'debit',
  },
  {
    title: 'Credit',
    key: 'credit',
  },
  {
    title: 'Balance',
    key: 'balance',
  },
];

const formModal = {
  firstName: '',
  lastName: '',
  emailAddress: '',
  contactNumber: '',
  address: '',
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
async function fetchSupplierTranstionDetails(accountId) {
  dialog.value = true;
  await balanceSheetStore.fetchLedgerDetails(accountId);
}

async function deleteSupplier(id) {
  swal.confirm('Are you sure you want to delete this supplier?').then(async (result) => {
    if (result.isConfirmed) {
      await supplierStore.deleteSupplier({ id });
      showDrawer.value = false;
    }
  });
}

// Function to calculate the total for fields (like 'debit' etc)
function calculateTotal(items, field) {
  // Check if the items array exists and is not empty
  if (!items || items.length === 0) {
    return 0;
  }
  return items.reduce((sum, item) => sum + (item[field] || 0), 0);
}

onMounted(() => {
  if (canRead.value) supplierStore.fetchSuppliers();
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar color="secondary" density="compact">
        <v-spacer></v-spacer>
        <v-btn v-if="canCreate" @click="newSupplier()">Create Supplier</v-btn>
      </v-toolbar>
      <v-data-table v-if="canRead" :loading="$loading('fetchSuppliers')" :headers="headers" :items="suppliers">
        <template v-slot:item.actions="{ item }">
          <v-icon v-if="canUpdate" class="me-2" size="small" @click="editSupplier(item)"> mdi-pencil </v-icon>
          <v-icon v-if="canDelete" class="me-2" size="small" @click="deleteSupplier(item.id)"> mdi-delete </v-icon>
          <v-icon size="small" @click="fetchSupplierTranstionDetails(item.accountId)">mdi-cash-multiple</v-icon>
        </template>
      </v-data-table>
      <!-- Show message if user does not have read permissions -->
      <v-card-text
        v-if="!canRead"
        class="d-flex flex-column justify-center align-center text-center"
        style="height: 300px"
      >
        <v-icon size="48" class="mb-4">mdi-lock</v-icon>
        <h1>You do not have permission to read this content</h1>
      </v-card-text>
    </v-card>
    <main-drawer v-model="showDrawer" width="800" :title="drawerTitle" :toolbar="{ color: 'primary' }">
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
  <v-container>
    <!-- Popup dialog -->
    <v-dialog v-model="dialog" max-width="100vw" max-height="100vh">
      <v-card :loading="$loading('fetchLedgerDetails')">
        <v-card-title class="text-h5">Transactions Details</v-card-title>

        <v-card-text>
          <v-data-table
            :loading="$loading('fetchLedgerDetails')"
            :headers="ledgerHeaders"
            :items="ledgerDetails"
            item-value="accountTypeCode"
          >
            <template v-slot:body.append>
              <tr>
                <td><strong>Total</strong></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <strong>{{ calculateTotal(ledgerDetails, 'debit') }}</strong>
                </td>
                <td>
                  <strong>{{ calculateTotal(ledgerDetails, 'credit') }}</strong>
                </td>
                <td>
                  <strong>{{ calculateTotal(ledgerDetails, 'balance') }}</strong>
                </td>
              </tr>
            </template>
          </v-data-table>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
