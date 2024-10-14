<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useSwal } from '@/composables/useSwal';
import { usePurchaseOrderStore } from '@/store/purchase_order';
import { useRouter } from 'vue-router';
const purchaseOrdersStore = usePurchaseOrderStore();
const { purchaseOrders } = storeToRefs(purchaseOrdersStore);

const swal = useSwal();
const router = useRouter();
const headers = [
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
      <v-data-table :loading="$loading('fetchPurchaseOrderList')" :headers="headers" :items="purchaseOrders">
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
