<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useSwal } from '@/composables/useSwal';
import { useReturnSaleInvoiceStore } from '@/store/sale_return_invoice';
import { useRouter } from 'vue-router';
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

const returnSaleInvoiceStore = useReturnSaleInvoiceStore();
const { saleReturnInvoices } = storeToRefs(returnSaleInvoiceStore);

const swal = useSwal();
const router = useRouter();
const expandedItemLength = ref(0);

const headers = [
  { title: '', key: 'data-table-expand' },
  {
    title: 'Invoice No',
    key: 'invoiceNo',
    sortable: true,
  },
  {
    title: 'Customer Name',
    key: 'customerName',
    sortable: true,
  },
  {
    title: 'Date',
    key: 'invoiceDate',
    sortable: true,
  },
  {
    title: 'Sub Total Amount',
    key: 'subTotal',
    sortable: true,
  },
  {
    title: 'Total Amount',
    key: 'total',
    sortable: true,
  },
  {
    title: 'Description',
    key: 'description',
    sortable: true,
  },
  {
    title: 'Created',
    key: 'createdBy',
    sortable: true,
  },
  {
    title: 'Modified',
    key: 'updatedBy',
    sortable: true,
  },
  {
    title: 'Actions',
    key: 'actions',
  },
];

// Headers for the nested grid (Items table)
const getItemHeaders = () => [
  { title: 'Product Id', key: 'productId', sortable: true },
  { title: 'Title', key: 'title', sortable: true },
  { title: 'Purchase Price', key: 'purchasePrice', sortable: true },
  { title: 'Sale Price', key: 'salePrice', sortable: true },
  { title: 'Discount', key: 'discount', sortable: true },
  { title: 'Quantity', key: 'quantity', sortable: true },
  { title: 'Total', key: 'total', sortable: true },
];

async function createInvoice() {
  router.push('add-sale-return-invoice');
}

async function handleClick(items) {
  const lastItem = items[items.length - 1];
  const ReturnSaleInvoiceId = lastItem;
  if (expandedItemLength.value == 0) expandedItemLength.value = items.length;
  if (items.length < expandedItemLength.value) {
    expandedItemLength.value = items.length;
    return;
  }
  expandedItemLength.value = items.length;
  if (ReturnSaleInvoiceId) {
    let currentItemIndex = saleReturnInvoices.value.findIndex((x) => x.id == ReturnSaleInvoiceId);
    ReturnSaleInvoiceId,
      (saleReturnInvoices.value[currentItemIndex] = await returnSaleInvoiceStore.fetchReturnSaleInvoiceListDetails(
        ReturnSaleInvoiceId,
        saleReturnInvoices.value[currentItemIndex],
      ));
  }
}
// Function to calculate the total for fields (like 'purchasePrice' etc)
function calculateTotal(items, field) {
  // Check if the items array exists and is not empty
  if (!items || items.length === 0) {
    return 0;
  }
  return items.reduce((sum, item) => sum + (item[field] || 0), 0);
}
onMounted(async () => {
  if (canRead.value) returnSaleInvoiceStore.fetchReturnSaleInvoiceList();
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar title="SALE RETURN INVOICE" color="secondary" density="compact">
        <v-spacer></v-spacer>
        <v-btn v-if="canCreate" @click="createInvoice()">Create Sale Return</v-btn>
      </v-toolbar>
      <v-data-table
        v-if="canRead"
        :loading="$loading('fetchReturnSaleList')"
        :headers="headers"
        :items="saleReturnInvoices"
        item-value="id"
        show-expand
        @update:expanded="handleClick"
      >
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

        <!-- Expandable Row for Order Details   -->
        <template v-slot:expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <v-card flat>
                <v-card-text>
                  <v-data-table
                    :loading="$loading('fetchReturnSaleInvoiceListDetails')"
                    :headers="getItemHeaders()"
                    :items="item.rsiDetails"
                  >
                    <template v-slot:item.productId="{ item }">{{ item.productId }} </template>
                    <!-- Totals row at the bottom -->
                    <template v-slot:body.append>
                      <tr>
                        <td><strong>Total</strong></td>
                        <td><strong></strong></td>
                        <td>
                          <strong>{{ calculateTotal(item.rsiDetails, 'purchasePrice') }}</strong>
                        </td>
                        <td>
                          <strong>{{ calculateTotal(item.rsiDetails, 'salePrice') }}</strong>
                        </td>
                        <td>
                          <strong>{{ calculateTotal(item.rsiDetails, 'discount') }}</strong>
                        </td>
                        <td>
                          <strong>{{ calculateTotal(item.rsiDetails, 'quantity') }}</strong>
                        </td>
                        <td>
                          <strong>{{ calculateTotal(item.rsiDetails, 'total') }}</strong>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </td>
          </tr>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon v-if="canUpdate" class="me-2" size="small" @click="editInvoice(item)"> mdi-pencil </v-icon>
          <v-icon v-if="canDelete" size="small" @click="deleteInvoice(item.id)"> mdi-delete </v-icon>
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
  </v-container>
</template>
<!-- <file-upload title="Upload Files" v-model="state.files" multiple></file-upload> -->
