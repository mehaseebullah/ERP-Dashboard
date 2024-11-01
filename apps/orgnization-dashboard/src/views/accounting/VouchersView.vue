<script setup>
import { computed, watch, onMounted, ref } from 'vue';
import { useVoucherStore } from '@/store/voucher';
import { useChartOfAccounts } from '@/store/chart_of_accounts';
import { useSwal } from '@/composables/useSwal';
import { storeToRefs } from 'pinia';
import { parseTitle } from '@/helpers/utils';

const coaStore = useChartOfAccounts();
const { accounts } = storeToRefs(coaStore);
const voucherStore = useVoucherStore();
const { vouchers, voucherTypes } = storeToRefs(voucherStore);
const swal = useSwal();
const drawerTitle = computed(() => (isEdit.value ? 'UPDATE VOUCHER' : 'CREATE VOUCHER'));
const expandedItemLength = ref(0);
const expanded = ref([]);

const headers = [
  { title: '', key: 'data-table-expand' },
  {
    title: 'Voucher Type',
    key: 'voucherType',
  },
  {
    title: 'Description',
    key: 'description',
  },
  {
    title: 'Voucher Date',
    key: 'voucherDate',
  },
  {
    title: 'Voucher No',
    key: 'voucherNo',
  },
  {
    title: 'Actions',
    key: 'actions',
  },
];

// Headers for the nested grid (Items table)
const getItemHeaders = () => [
  { title: '', key: '', sortable: true },
  { title: 'Debit', key: 'debit', sortable: true },
  { title: 'Credit', key: 'credit', sortable: true },
  { title: 'Remarks', key: 'remarks', sortable: true },
  { title: 'Created', key: 'createdBy', sortable: true },
  { title: 'Modified', key: 'updatedBy', sortable: true },
];

const formModal = {
  voucherId: null,
  voucherNo: null,
  voucherTypeId: null,
  voucherDate: null,
  description: '',
  ledgerDetailDTO: [
    {
      accountId: '',
      debit: 0,
      credit: 0,
      remarks: '',
    },
  ],
};

const formData = ref({ ...formModal });
const isEdit = ref(false);
const showDrawer = ref(false);

const cancelEdit = () => {
  formData.value = { ...formModal };
  showDrawer.value = false;
};

// Watch for changes in the drawer's visibility (v-model="showEdit")
watch(showDrawer, (newValue) => {
  if (!newValue) {
    cancelEdit(); // Call cancelEdit when drawer is closed (cross icon clicked)
  }
});

async function newVoucher() {
  formData.value = { ...formModal };
  isEdit.value = false;
  showDrawer.value = true;
}

async function createVoucher() {
  await voucherStore.createVoucher(formData.value);
  showDrawer.value = false;
  formData.value = { ...formModal };
}

async function updateVoucher() {
  await voucherStore.updateVoucher(formData.value);
  expanded.value = [];
  vouchers.value = [];
  expandedItemLength.value = 0;
  showDrawer.value = false;
  formData.value = { ...formModal };
  isEdit.value = false;
}

async function deleteVoucher(id) {
  swal.confirm('Are you sure you want to delete this entry?').then(async (result) => {
    if (result.isConfirmed) {
      await voucherStore.deleteVoucher({ id });
      showDrawer.value = false;
    }
  });
}

async function fetchLedgerDetails(VoucherId) {
  let currentItemIndex = vouchers.value.findIndex((x) => x.id == VoucherId);
  vouchers.value[currentItemIndex] = await voucherStore.fetchLedgersByVoucherId(
    VoucherId,
    vouchers.value[currentItemIndex],
  );
  // console.log('voucher item updated', vouchers.value[currentItemIndex]);
  formData.value = { ...vouchers.value[currentItemIndex] };
}

async function handleClick(items) {
  const lastItem = items[items.length - 1];

  const VoucherId = lastItem;
  if (expandedItemLength.value == 0) expandedItemLength.value = items.length;
  if (items.length < expandedItemLength.value) {
    expandedItemLength.value = items.length;
    return;
  }
  expandedItemLength.value = items.length;
  if (VoucherId) {
    await fetchLedgerDetails(VoucherId);
  }
}

async function editVoucher(item) {
  if (!item.ledgerDetailDTO) {
    fetchLedgerDetails(item.id);
  } else {
    formData.value = { ...item };
  }
  showDrawer.value = true;
  isEdit.value = true;
}

// Function to calculate the total for fields (like 'debit' etc)
function calculateTotal(items, field) {
  // Check if the items array exists and is not empty
  if (!items || items.length === 0) {
    return 0;
  }
  return items.reduce((sum, item) => sum + (item[field] || 0), 0);
}

onMounted(async () => {
  voucherStore.fetchVoucherList();
  voucherStore.fetchVoucherTypes();
  coaStore.fetchAllChartOfAccounts();
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar color="secondary" density="compact">
        <v-spacer></v-spacer>
        <v-btn @click="newVoucher()">Create Voucher</v-btn>
      </v-toolbar>
      <v-data-table
        :loading="$loading('fetchVoucherList')"
        :headers="headers"
        :items="vouchers"
        v-model:expanded="expanded"
        @update:expanded="handleClick"
      >
        <!-- Expandable Row for Order Details   -->
        <template v-slot:expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <v-card flat>
                <v-card-text>
                  <v-data-table :headers="getItemHeaders()" :items="item.ledgerDetailDTO">
                    <template v-slot:item.createdBy="{ item }">
                      <v-row no-gutters>
                        <v-col cols="12">{{ item.createdBy }}</v-col>
                        <v-col cols="12">{{ item.createdAt }}</v-col>
                      </v-row>
                    </template>
                    <template v-slot:item.updatedBy="{ item }">
                      <v-row no-gutters>
                        <v-col cols="12">{{ item.updatedBy }}</v-col>
                        <v-col cols="12">{{ item.updatedAt }}</v-col>
                      </v-row>
                    </template>
                    <!-- <template v-slot:item.voucherId="{ item }">{{ item.voucherId }} </template> -->
                    <!-- Totals row at the bottom -->
                    <template v-slot:body.append>
                      <tr>
                        <td><strong>Total</strong></td>
                        <td>
                          <strong>{{ calculateTotal(item.ledgerDetailDTO, 'debit') }}</strong>
                        </td>
                        <td>
                          <strong>{{ calculateTotal(item.ledgerDetailDTO, 'credit') }}</strong>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </td>
          </tr>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn size="small" variant="text" :disabled="item.is_system" @click="editVoucher(item)" icon="mdi-pencil">
          </v-btn>
          <v-btn
            size="small"
            variant="text"
            :disabled="item.isSystem"
            @click="deleteVoucher(item.id)"
            icon="mdi-delete"
          >
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <main-drawer v-model="showDrawer" width="800" :title="drawerTitle" :toolbar="{ color: 'primary' }">
      <v-form class="pa-5" @submit.prevent="isEdit ? updateVoucher() : createVoucher()">
        <v-text-field
          v-model="formData.voucherDate"
          label="Date"
          type="date"
          variant="outlined"
          :loading="$loading('fetchLedgersByVoucherId')"
        ></v-text-field>
        <v-text-field
          v-model="formData.voucherNo"
          label="Voucher No"
          variant="outlined"
          :loading="$loading('fetchLedgersByVoucherId')"
        ></v-text-field>
        <v-select
          :items="voucherTypes"
          item-title="title"
          item-value="id"
          v-model="formData.voucherTypeId"
          :loading="$loading('fetchLedgersByVoucherId')"
          label="Type"
          variant="outlined"
        >
        </v-select>
        <v-textarea
          v-model="formData.description"
          label="Description"
          variant="outlined"
          rows="2"
          :loading="$loading('fetchLedgersByVoucherId')"
        ></v-textarea>
        <template v-for="(entry, index) in formData.ledgerDetailDTO" :key="index">
          <v-row>
            <v-col>
              <v-select
                :items="accounts"
                item-title="title"
                item-value="id"
                v-model="entry.accountId"
                :loading="$loading('fetchLedgersByVoucherId')"
                label="Account"
                variant="outlined"
                density="compact"
              ></v-select>
            </v-col>
            <v-col>
              <v-text-field
                type="number"
                density="compact"
                v-model.number="entry.debit"
                label="Debit"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                type="number"
                density="compact"
                v-model.number="entry.credit"
                label="Credit"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col v-if="index > 0" cols="1">
              <v-btn
                variant="text"
                size="small"
                icon="mdi-delete"
                @click="formData.ledgerDetailDTO.splice(index, 1)"
              ></v-btn>
            </v-col>
          </v-row>
        </template>
        <div class="d-flex justify-end mb-5">
          <v-btn variant="text" @click="formData.ledgerDetailDTO.push({ accountId: '', debit: 0.0, credit: 0.0 })"
            >Add Entry</v-btn
          >
        </div>
        <div class="d-flex justify-end">
          <v-btn v-if="isEdit" :loading="$loading('updateVoucher')" type="submit" color="primary">Update</v-btn>
          <v-btn v-else :loading="$loading('createVoucher')" type="submit" color="primary">Create</v-btn>
        </div>
      </v-form>
    </main-drawer>
  </v-container>
</template>
