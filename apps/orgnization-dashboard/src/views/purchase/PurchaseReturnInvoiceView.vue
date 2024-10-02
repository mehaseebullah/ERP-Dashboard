<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useSwal } from '@/composables/useSwal';
import { usePurchaseReturnInvoiceStore } from '@/store/purchase_return_invoice';
import { useRouter } from 'vue-router';
const purchaseReturnInvoiceStore = usePurchaseReturnInvoiceStore();
const { purchaseReturnInvoices } = storeToRefs(purchaseReturnInvoiceStore);

const swal = useSwal();
const router = useRouter();
const headers = [
  {
    title: 'Invoice No',
    key: 'invoiceNo',
    sortable: true,
  },
  {
    title: 'supplier Name',
    key: 'supplierName',
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
    title: 'Actions',
    key: 'actions',
  },
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

onMounted(async () => {
  purchaseReturnInvoiceStore.fetchPurchaseReturnInvoiceList();
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar title="PURCHASE RETURN INVOICE" color="secondary" density="compact">
        <v-spacer></v-spacer>
        <v-btn @click="newPurchaseReturnInvoice()">Create Invoice</v-btn>
      </v-toolbar>
      <v-data-table :loading="$loading('fetchPurchaseReturnInvoiceList')" :headers="headers" :items="purchaseReturnInvoices">
        <template v-slot:item.supplierName="{ item }">
          {{ item.supplierName }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon class="me-2" size="small" @click="editPurchaseOrder(item)"> mdi-pencil </v-icon>
          <v-icon size="small" @click="deletePurchaseReturnInvoice(item.id)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<!-- <file-upload title="Upload Files" v-model="state.files" multiple></file-upload> -->
