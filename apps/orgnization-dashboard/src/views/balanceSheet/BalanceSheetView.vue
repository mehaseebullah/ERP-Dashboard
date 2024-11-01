<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useSwal } from '@/composables/useSwal';
import { storeToRefs } from 'pinia';
import { useBalanceSheetStore } from '@/store/balanceSheet';

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

const formModal = {
  accountType: '',
  accountTypeCode: null,
  debit: null,
  credit: null,
  balance: null,
  accountTypeDetails: [
    {
      accountType: '',
      accountGroup: '',
      accountTypeCode: null,
      acccountGroupCode: null,
      lastTranactionDate: '',
      debit: null,
      credit: null,
      balance: null,
      accountGroupDetails: [
        {
          accountType: '',
          accountGroup: '',
          chartsOfAccount: '',
          acccountGroupCode: null,
          accountTypeCode: null,
          acccountCode: null,
          accountId: null,
          lastTranactionDate: '',
          debit: null,
          credit: null,
          balance: null,
        },
      ],
    },
  ],
};

async function fetchLedgerDetails(ChartsOfAccountId) {
  dialog.value = true;
  await balanceSheetStore.fetchLedgerDetails(ChartsOfAccountId);
}
async function handleClick(items) {
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

onMounted(async () => {
  await balanceSheetStore.fetchBalanceSheets();
});
</script>

<template>
  <v-container>
    <v-card>
      <v-toolbar color="secondary" density="compact">
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-data-table
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
    </v-card>
  </v-container>
  <v-container>
    <!-- Popup dialog -->
    <v-dialog v-model="dialog" max-width="100vw" max-height="100vh">
      <v-card :loading="$loading('fetchLedgerDetails')">
        <v-card-title class="text-h5">Ledgers Details</v-card-title>

        <v-card-text>
          <v-row>
            <!-- Loop through each transaction in ledgerDetails -->
            <v-col cols="12" md="6" v-for="(transaction, index) in ledgerDetails" :key="index">
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    {{ transaction.chartsOfAccount }} - {{ transaction.tranactionDate }}
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-card>
                      <v-card-text>
                        <div><strong>Account Group:</strong> {{ transaction.accountGroup }}</div>
                        <div><strong>Account Type:</strong> {{ transaction.accountType }}</div>
                        <div><strong>Debit:</strong> {{ transaction.debit }}</div>
                        <div><strong>Credit:</strong> {{ transaction.credit }}</div>
                        <div><strong>Balance:</strong> {{ transaction.balance }}</div>
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>

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
