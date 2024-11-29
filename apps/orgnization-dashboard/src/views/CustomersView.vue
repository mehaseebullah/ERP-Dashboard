<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useCustomerStore } from '@/store/customer';
import { useSwal } from '@/composables/useSwal';
import { storeToRefs } from 'pinia';
import { useBalanceSheetStore } from '@/store/balanceSheet';
import rules from '@/helpers/rules';
import { useRoute } from 'vue-router';
import { hasPermission } from '@/helpers/utils';
import { useVoucherStore } from '@/store/voucher';
import { useChartOfAccounts } from '@/store/chart_of_accounts';
import { useGenerateInoiceNumber } from '@/store/generate_invoice_number';

const route = useRoute();
const permissionCodes = route.meta.permissionCodes || [];

// to check permissions based on action type
const canCreate = computed(() => hasPermission('Create', permissionCodes));
const canRead = computed(() => hasPermission('Read', permissionCodes));
const canUpdate = computed(() => hasPermission('Update', permissionCodes));
const canDelete = computed(() => hasPermission('Delete', permissionCodes));

const balanceSheetStore = useBalanceSheetStore();
const customerStore = useCustomerStore();
const generateInoiceNumberStore = useGenerateInoiceNumber();
const { customers } = storeToRefs(customerStore);
const { ledgerDetails } = storeToRefs(balanceSheetStore);

const coaStore = useChartOfAccounts();
const { accounts } = storeToRefs(coaStore);
const voucherStore = useVoucherStore();
const { vouchers, voucherTypes } = storeToRefs(voucherStore);

const form = ref();
const payForm = ref();
const swal = useSwal();
const dialog = ref(false);
const drawerTitle = computed(() => (isEdit.value ? 'UPDATE CUSTOMER' : 'CREATE CUSTOMER'));

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
  {
    title: 'Transction Date',
    key: 'tranactionDate',
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

const payFormModal = {
  voucherNo: '',
  voucherTypeCode: 6,
  voucherDate: null,
  description: 'This is for customer',

  ledgerDetailDTO: [
    {
      accountId: null,
      debit: 0.0,
      credit: 0.0, //this
      remarks: '',
    },
    {
      accountCode: '1101',
      debit: 0.0,
      credit: 0.0,
    },
  ],
};

const payFormData = ref({ ...payFormModal });
//const payFormData = ref(JSON.parse(JSON.stringify(payFormModal)));

const isEdit = ref(false);
const showDrawer = ref(false);
const showPayDrawer = ref(false);

const cancelPay = () => {
  payFormData.value = { ...payFormModal };
  // payFormData.value = JSON.parse(JSON.stringify(payFormModal));
  showPayDrawer.value = false;
};

// Watch for changes in the drawer's visibility (v-model="showEdit")
watch(showPayDrawer, (newValue) => {
  if (!newValue) {
    cancelPay(); // Call cancelPay when drawer is closed (cross icon clicked)
  }
});

async function payVoucher() {
  const { valid } = await payForm.value.validate();
  if (valid) {
    payFormData.value.ledgerDetailDTO[1].debit = payFormData.value.ledgerDetailDTO[0].credit;
    await customerStore.payVoucher(payFormData.value);
    // console.log('this is payData', payFormData.value);
    vouchers.value = [];
    showPayDrawer.value = false;
    payFormData.value = { ...payFormModal };
  } else {
    swal.error('Please fill all fields');
  }

  // payFormData.value = JSON.parse(JSON.stringify(payFormModal));
}

async function newCustomer() {
  formData.value = { ...formModal };
  form.value.resetValidation();
  isEdit.value = false;
  showDrawer.value = true;
}

async function createCustomer() {
  const { valid } = await form.value.validate();
  if (valid) {
    await customerStore.createCustomer(formData.value);
    showDrawer.value = false;
    formData.value = { ...formModal };
    isEdit.value = false;
  } else {
    swal.error('Please fill all fields');
  }
}

async function editCustomer(item) {
  formData.value = { ...item };
  isEdit.value = true;
  showDrawer.value = true;
}

async function updateCustomer() {
  const { valid } = await form.value.validate();
  if (valid) {
    await customerStore.updateCustomer(formData.value);
    showDrawer.value = false;
    formData.value = { ...formModal };
    isEdit.value = false;
  } else {
    swal.error('Please fill all fields');
  }
}

async function fetchCustomerTranstionDetails(accountId) {
  dialog.value = true;
  await balanceSheetStore.fetchLedgerDetails(accountId);
}

async function newInvoiceNum() {
  payFormData.value.voucherNo = await generateInoiceNumberStore.fetchGenerateInvoiceNumber({ Prefix: 'VCH' });
}

async function pay(id) {
  payFormData.value = JSON.parse(JSON.stringify({ ...payFormModal }));
  payForm.value.resetValidation();
  // payFormData.value = { ...payFormModal };
  showPayDrawer.value = true;
  await newInvoiceNum();
  payFormData.value.ledgerDetailDTO[0].accountId = id;
}

async function deleteCustomer(id) {
  swal.confirm('Are you sure you want to delete this customer?').then(async (result) => {
    if (result.isConfirmed) {
      await customerStore.deleteCustomer({ id });
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
  if (canRead.value) customerStore.fetchCustomers();
  if (canCreate.value || canUpdate.value) {
    voucherStore.fetchVoucherTypes();
    coaStore.fetchAllChartOfAccounts();
  }
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar color="secondary" density="compact">
        <v-spacer></v-spacer>
        <v-btn v-if="canCreate" @click="newCustomer()">Create Customer</v-btn>
      </v-toolbar>
      <v-data-table v-if="canRead" :loading="$loading('fetchCustomers')" :headers="headers" :items="customers">
        <template v-slot:item.actions="{ item }">
          <v-icon v-if="canUpdate" class="me-2" size="small" @click="editCustomer(item)"> mdi-pencil </v-icon>
          <v-icon v-if="canDelete" class="me-2" size="small" @click="deleteCustomer(item.id)"> mdi-delete </v-icon>
          <v-icon class="me-2" size="small" @click="fetchCustomerTranstionDetails(item.accountId)"
            >mdi-cash-multiple</v-icon
          >
          <v-icon v-if="canUpdate" @click="pay(item.accountId)">mdi-credit-card</v-icon>
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
      <v-form ref="form" class="pa-5" @submit.prevent="isEdit ? updateCustomer() : createCustomer()">
        <v-text-field
          v-model="formData.firstName"
          label="First Name"
          variant="outlined"
          :rules="[rules.required]"
        ></v-text-field>
        <v-text-field
          v-model="formData.lastName"
          label="Last Name"
          variant="outlined"
          :rules="[rules.required]"
        ></v-text-field>
        <v-text-field
          v-model="formData.emailAddress"
          label="Email"
          variant="outlined"
          :rules="[rules.email]"
        ></v-text-field>
        <v-text-field
          v-model="formData.contactNumber"
          label="Phone"
          variant="outlined"
          :rules="[rules.required]"
        ></v-text-field>
        <v-textarea
          v-model="formData.address"
          label="Address"
          variant="outlined"
          :rules="[rules.required]"
        ></v-textarea>
        <div class="d-flex justify-end">
          <v-btn v-if="isEdit" :loading="$loading('updateCustomer')" type="submit" color="primary">Update</v-btn>
          <v-btn v-else :loading="$loading('createCustomer')" type="submit" color="primary">Create</v-btn>
        </div>
      </v-form>
    </main-drawer>

    <main-drawer v-model="showPayDrawer" width="800" title="Pay" :toolbar="{ color: 'primary' }">
      <v-form ref="payForm" class="pa-5" @submit.prevent="payVoucher()">
        <template v-for="(entry, index) in payFormData.ledgerDetailDTO" :key="index">
          <v-row v-if="index === 0">
            <v-col>
              <v-text-field
                type="text"
                density="compact"
                v-model.number="entry.remarks"
                label="Remarks"
                variant="outlined"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>

            <v-col>
              <v-text-field
                type="number"
                density="compact"
                v-model.number="entry.credit"
                label="Amount"
                variant="outlined"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
          </v-row>
        </template>

        <div class="d-flex justify-end">
          <v-btn :loading="$loading('payVoucher')" type="submit" color="primary">Pay</v-btn>
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
