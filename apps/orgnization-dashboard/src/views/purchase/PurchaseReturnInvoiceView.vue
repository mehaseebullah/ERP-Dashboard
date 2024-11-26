<script setup>
import { computed, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useSwal } from '@/composables/useSwal';
import { usePurchaseReturnInvoiceStore } from '@/store/purchase_return_invoice';
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

const purchaseReturnInvoiceStore = usePurchaseReturnInvoiceStore();
const { purchaseReturnInvoices } = storeToRefs(purchaseReturnInvoiceStore);

const expandedItemLength = ref(0);
const swal = useSwal();
const router = useRouter();

const headers = [
  { title: '', key: 'data-table-expand' },
  {
    title: 'Invoice No',
    key: 'invoiceNo',
    sortable: true,
  },
  {
    title: 'Supplier Name',
    key: 'supplierName',
    sortable: true,
  },
  {
    title: 'Date',
    key: 'invoiceDate',
    sortable: true,
  },
  {
    title: 'Description',
    key: 'description',
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
  // { title: 'Product Id', key: 'productId', sortable: true },
  { title: 'Product Name', key: 'title', sortable: true },
  { title: 'Quantity', key: 'quantity', sortable: true },
  { title: 'Purchase Price', key: 'purchasePrice', sortable: true },
  { title: 'Discount', key: 'discount', sortable: true },
  { title: 'Total', key: 'total', sortable: true },
];

async function newPurchaseReturnInvoice() {
  router.push('add-purchase-return-invoice');
}
async function deletePurchaseReturnInvoice(id) {
  swal.confirm('Are you sure you want to delete this unit?').then(async (result) => {
    if (result.isConfirmed) {
      await purchaseReturnInvoiceStore.deletePurchaseReturnInvoice({ id });
    }
  });
}

async function handleClick(items) {
  console.log('id', items);

  const lastItem = items[items.length - 1];
  const ReturnPurchaseInvoiceId = lastItem;
  if (expandedItemLength.value == 0) expandedItemLength.value = items.length;
  if (items.length < expandedItemLength.value) {
    expandedItemLength.value = items.length;
    return;
  }
  expandedItemLength.value = items.length;
  if (ReturnPurchaseInvoiceId) {
    let currentItemIndex = purchaseReturnInvoices.value.findIndex((x) => x.id == ReturnPurchaseInvoiceId);
    ReturnPurchaseInvoiceId,
      (purchaseReturnInvoices.value[currentItemIndex] =
        await purchaseReturnInvoiceStore.fetchPurchaseReturnInvoiceListDetails(
          ReturnPurchaseInvoiceId,
          purchaseReturnInvoices.value[currentItemIndex],
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
  if (canRead.value) purchaseReturnInvoiceStore.fetchPurchaseReturnInvoiceList();
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar title="PURCHASE RETURN INVOICE" color="secondary" density="compact">
        <v-spacer></v-spacer>
        <v-btn v-if="canCreate" @click="newPurchaseReturnInvoice()">Create Invoice</v-btn>
      </v-toolbar>
      <v-data-table
        v-if="canRead"
        :loading="$loading('fetchPurchaseReturnInvoiceList')"
        :headers="headers"
        :items="purchaseReturnInvoices"
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
                    :loading="$loading('fetchPurchaseReturnInvoiceListDetails')"
                    :headers="getItemHeaders()"
                    :items="item.priDetails"
                  >
                    <template v-slot:item.productId="{ item }">{{ item.productId }} </template>
                    <!-- Totals row at the bottom -->
                    <template v-slot:body.append>
                      <tr>
                        <!-- <td><strong></strong></td> -->
                        <td><strong></strong></td>
                        <td>
                          <strong>{{ calculateTotal(item.priDetails, 'quantity') }}</strong>
                        </td>
                        <td>
                          <strong>{{ calculateTotal(item.priDetails, 'purchasePrice') }}</strong>
                        </td>
                        <td>
                          <strong>{{ calculateTotal(item.priDetails, 'discount') }}</strong>
                        </td>

                        <td>
                          <strong>{{ calculateTotal(item.priDetails, 'total') }}</strong>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </td>
          </tr>
        </template>
        <template v-slot:item.supplierName="{ item }">
          {{ item.supplierName }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon v-if="canUpdate" class="me-2" size="small" @click="editPurchaseOrder(item)"> mdi-pencil </v-icon>
          <v-icon v-if="canDelete" size="small" @click="deletePurchaseReturnInvoice(item.id)"> mdi-delete </v-icon>
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
