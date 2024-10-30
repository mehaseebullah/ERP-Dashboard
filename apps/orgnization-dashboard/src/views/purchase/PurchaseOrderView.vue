<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useSwal } from '@/composables/useSwal';
import { usePurchaseOrderStore } from '@/store/purchase_order';
import { useRouter } from 'vue-router';
const purchaseOrdersStore = usePurchaseOrderStore();
const { purchaseOrders } = storeToRefs(purchaseOrdersStore);

const swal = useSwal();
const expandedItemLength = ref(0);
const expanded = ref([]);
const router = useRouter();
const headers = [
  { title: '', key: 'data-table-expand' },
  {
    title: 'PO No',
    key: 'poNo',
    sortable: true,
  },
  {
    title: 'supplier Name',
    key: 'supplierName',
    sortable: true,
  },
  {
    title: 'Date',
    key: 'poDate',
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
    title: 'Actions',
    key: 'actions',
  },
];

// Headers for the nested grid (Items table)
const getItemHeaders = () => [
  { title: 'Product Id', key: 'productId', sortable: true },
  { title: 'Title', key: 'title', sortable: true },
  { title: 'Purchase Price', key: 'purchasePrice', sortable: true },
  { title: 'Discount', key: 'discount', sortable: true },
  { title: 'Quantity', key: 'quantity', sortable: true },
  { title: 'Total', key: 'total', sortable: true },
];

async function newPurchaseOrder() {
  router.push('add-purchase-order');
}
async function deletePurchaseOrder(id) {
  swal.confirm('Are you sure you want to delete this unit?').then(async (result) => {
    if (result.isConfirmed) {
      await purchaseOrdersStore.deletePurchaseOrdre({ id });
      showDrawer.value = false;
    }
  });
}

async function handleClick(items) {
  const lastItem = items[items.length - 1];
  const PurchaseOrderId = lastItem;
  if (expandedItemLength.value == 0) expandedItemLength.value = items.length;
  if (items.length < expandedItemLength.value) {
    expandedItemLength.value = items.length;
    return;
  }
  expandedItemLength.value = items.length;
  if (PurchaseOrderId) {
    let currentItemIndex = purchaseOrders.value.findIndex((x) => x.id == PurchaseOrderId);
    PurchaseOrderId,
      (purchaseOrders.value[currentItemIndex] = await purchaseOrdersStore.fetchPurchaseOrderListDetails(
        PurchaseOrderId,
        purchaseOrders.value[currentItemIndex],
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
  purchaseOrdersStore.fetchPurchaseOrderList();
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar title="PURCHASE ORDERS" color="secondary" density="compact">
        <v-spacer></v-spacer>
        <v-btn @click="newPurchaseOrder()">Create Invoice</v-btn>
      </v-toolbar>
      <v-data-table
        :loading="$loading('fetchPurchaseOrderList')"
        v-model:expanded="expanded"
        :headers="headers"
        :items="purchaseOrders"
        item-value="id"
        show-expand
        @update:expanded="handleClick"
      >
        <!-- Expandable Row for Order Details   -->
        <template v-slot:expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <v-card flat>
                <v-card-text>
                  <v-data-table :headers="getItemHeaders()" :items="item.poDetails">
                    <template v-slot:item.productId="{ item }">{{ item.productId }} </template>
                    <!-- Totals row at the bottom -->
                    <template v-slot:body.append>
                      <tr>
                        <td><strong>Total</strong></td>
                        <td><strong></strong></td>
                        <td>
                          <strong>{{ calculateTotal(item.poDetails, 'purchasePrice') }}</strong>
                        </td>
                        <td>
                          <strong>{{ calculateTotal(item.poDetails, 'discount') }}</strong>
                        </td>
                        <td>
                          <strong>{{ calculateTotal(item.poDetails, 'quantity') }}</strong>
                        </td>
                        <td>
                          <strong>{{ calculateTotal(item.poDetails, 'total') }}</strong>
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
          <v-icon class="me-2" size="small" @click="editPurchaseOrder(item)"> mdi-pencil </v-icon>
          <v-icon size="small" @click="deletePurchaseOrder(item.id)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<!-- <file-upload title="Upload Files" v-model="state.files" multiple></file-upload> -->
