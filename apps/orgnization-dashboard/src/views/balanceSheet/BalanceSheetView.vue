<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useSwal } from '@/composables/useSwal';
import { storeToRefs } from 'pinia';
import { useBalanceSheetStore } from '@/store/balanceSheet';
import { useRoute } from 'vue-router';
import { hasPermission } from '@/helpers/utils';

const route = useRoute();
const permissionCodes = route.meta.permissionCodes || [];

// to check permissions based on action type
const canCreate = computed(() => hasPermission('Create', permissionCodes));
const canRead = computed(() => hasPermission('Read', permissionCodes));
const canUpdate = computed(() => hasPermission('Update', permissionCodes));
const canDelete = computed(() => hasPermission('Delete', permissionCodes));

const balanceSheetStore = useBalanceSheetStore();
const { balanceSheets } = storeToRefs(balanceSheetStore);
const { ledgerDetails } = storeToRefs(balanceSheetStore);

const swal = useSwal();
const dialog = ref(false);

const cancelDialog = () => {
  ledgerDetails.value = [];
  dialog.value = false;
};

watch(dialog, (newValue) => {
  if (!newValue) {
    cancelDialog();
  }
});

const expandedItemLength = ref(0);
const nestedExpandedItemLength = ref(0);
const expanded = ref([]);
const nestedexpanded = ref([]);

const headers = [
  { title: '', key: 'data-table-expand' },
  {
    title: 'Account Type',
    key: 'accountType',
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

// Headers for the nested grid (level 1)
const nestedItemHeaders = () => [
  { title: '', key: 'data-table-expand' },
  { title: 'Debit', key: 'debit', sortable: true },
  { title: 'Credit', key: 'credit', sortable: true },
  { title: 'Balance', key: 'balance', sortable: true },
  { title: 'Account Type', key: 'accountType', sortable: true },
  { title: 'Account Type Code', key: 'accountTypeCode', sortable: true },
  { title: 'Account Group', key: 'accountGroup', sortable: true },
  { title: 'Account Group Code', key: 'acccountGroupCode', sortable: true },
  { title: 'Last Transaction Date', key: 'lastTranactionDate', sortable: true },
];

// Headers for the nested grid within nested grid (level 2)
const subNestedHeaders = () => [
  { title: 'Debit', key: 'debit', sortable: true },
  { title: 'Credit', key: 'credit', sortable: true },
  { title: 'Balance', key: 'balance', sortable: true },
  { title: 'Account Type', key: 'accountType', sortable: true },
  { title: 'Account Group', key: 'accountGroup', sortable: true },
  { title: 'Charts of Account', key: 'chartsOfAccount', sortable: true },
  { title: 'Account Group Code', key: 'accountGroupCode', sortable: true },
  { title: 'Account Type Code', key: 'accountTypeCode', sortable: true },
  { title: 'Account Code', key: 'acccountCode', sortable: true },
  { title: 'Account Id', key: 'accountId', sortable: true },
  { title: 'Last Transaction Date', key: 'lastTranactionDate', sortable: true },
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

// const formModal = {
//   accountType: '',
//   accountTypeCode: null,
//   debit: null,
//   credit: null,
//   balance: null,
//   accountTypeDetails: [
//     {
//       accountType: '',
//       accountGroup: '',
//       accountTypeCode: null,
//       acccountGroupCode: null,
//       lastTranactionDate: '',
//       debit: null,
//       credit: null,
//       balance: null,
//       accountGroupDetails: [
//         {
//           accountType: '',
//           accountGroup: '',
//           chartsOfAccount: '',
//           acccountGroupCode: null,
//           accountTypeCode: null,
//           acccountCode: null,
//           accountId: null,
//           lastTranactionDate: '',
//           debit: null,
//           credit: null,
//           balance: null,
//         },
//       ],
//     },
//   ],
// };

async function fetchLedgerDetails(ChartsOfAccountId) {
  dialog.value = true;
  await balanceSheetStore.fetchLedgerDetails(ChartsOfAccountId);
}

async function handleClick(items) {
  nestedexpanded.value = []; //to collasp all subnested grids when we expand/collasp any parent grid
  nestedExpandedItemLength.value = 0;

  const lastItem = items[items.length - 1];
  const accountTypeCode = lastItem;

  if (expandedItemLength.value == 0) expandedItemLength.value = items.length;
  if (items.length < expandedItemLength.value) {
    expandedItemLength.value = items.length;
    return;
  }
  expandedItemLength.value = items.length;
  if (accountTypeCode) {
    let currentItemIndex = balanceSheets.value.findIndex((x) => x.accountTypeCode == accountTypeCode);
    balanceSheets.value[currentItemIndex] = await balanceSheetStore.fetchAccountTypeDetails(
      accountTypeCode,
      balanceSheets.value[currentItemIndex],
    );
  }
}

async function subNestedHandleClick(items) {
  const lastItem = items[items.length - 1];
  const acccountGroupCode = lastItem;

  if (nestedExpandedItemLength.value == 0) nestedExpandedItemLength.value = items.length;
  if (items.length < nestedExpandedItemLength.value) {
    nestedExpandedItemLength.value = items.length;
    return;
  }
  nestedExpandedItemLength.value = items.length;

  // Use findIndex to locate the object containing the target code
  const accountTypeIndex = balanceSheets.value.findIndex(
    (x) =>
      x.accountTypeDetails &&
      x.accountTypeDetails.some((accountGroup) => accountGroup.acccountGroupCode === acccountGroupCode),
  );

  if (accountTypeIndex === -1) return null; // If no accountType contains the target code, return null

  // Find the exact location within the accountTypeDetails array
  const accountGroupIndex = balanceSheets.value[accountTypeIndex].accountTypeDetails.findIndex(
    (x) => x.acccountGroupCode === acccountGroupCode,
  );

  balanceSheets.value[accountTypeIndex].accountTypeDetails[accountGroupIndex] =
    await balanceSheetStore.fetchAccountGroupDetails(
      acccountGroupCode,
      balanceSheets.value[accountTypeIndex].accountTypeDetails[accountGroupIndex],
    );
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
  if (canRead.value) await balanceSheetStore.fetchBalanceSheets();
});
</script>

<template>
  <v-container>
    <v-card>
      <v-toolbar color="secondary" density="compact">
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-data-table
        v-if="canRead"
        :loading="$loading('fetchBalanceSheets')"
        :headers="headers"
        :items="balanceSheets"
        item-value="accountTypeCode"
        v-model:expanded="expanded"
        @update:expanded="handleClick"
      >
        <!-- Expandable Row for Account Type Details   -->
        <template v-slot:expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <v-card flat>
                <v-card-text>
                  <v-data-table
                    :headers="nestedItemHeaders()"
                    :loading="$loading('fetchAccountTypeDetails')"
                    :items="item.accountTypeDetails"
                    item-value="acccountGroupCode"
                    v-model:expanded="nestedexpanded"
                    @update:expanded="subNestedHandleClick"
                  >
                    <!-- Expandable Row for Account group Details   -->
                    <template v-slot:expanded-row="{ columns, item }">
                      <tr>
                        <td :colspan="columns.length">
                          <v-card flat>
                            <v-card-text>
                              <v-data-table
                                :headers="subNestedHeaders()"
                                :loading="$loading('fetchAccountGroupDetails')"
                                :items="item.accountGroupDetails"
                                item-value="acccountGroupCode"
                              >
                                <template v-slot:item.actions="{ item }">
                                  <v-icon size="small" @click="fetchLedgerDetails(item.accountId)">
                                    mdi-information
                                  </v-icon>
                                </template>
                              </v-data-table>
                            </v-card-text>
                          </v-card>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-card-text
        v-if="!canRead"
        class="d-flex flex-column justify-center align-center text-center"
        style="height: 300px"
      >
        <v-icon size="48" class="mb-4">mdi-lock</v-icon>
        <h1>You do not have permission to read this content</h1>
      </v-card-text>
    </v-card>
  </v-container>

  <v-container>
    <!-- Popup dialog -->
    <v-dialog v-model="dialog" max-width="100vw" max-height="100vh">
      <v-card :loading="$loading('fetchLedgerDetails')">
        <v-card-title class="text-h5">Ledgers Details</v-card-title>

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
<style scoped></style>
