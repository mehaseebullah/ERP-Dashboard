<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useSwal } from '@/composables/useSwal';
import { useReturnSaleInvoiceStore } from '@/store/sale_return_invoice';
import { useRouter } from 'vue-router';

const returnSaleInvoiceStore = useReturnSaleInvoiceStore();
const { saleReturnInvoices } = storeToRefs(returnSaleInvoiceStore);

const swal = useSwal();
const router = useRouter();
const headers = [
  {
    title: 'Invoice No',
    key: 'invoiceNo',
    sortable: true,
  },
  {
    title: 'Customer',
    key: 'customerName',
    sortable: true,
  },
  {
    title: 'Date',
    key: 'invoiceDate',
    sortable: true,
  },
  {
    title: 'sub Total Amount',
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


async function createInvoice() {
  router.push('add-sale-return-invoice');
}


onMounted(async () => {
  returnSaleInvoiceStore.fetchReturnSaleInvoiceList();
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar title="SALE Order" color="secondary" density="compact">
        <v-spacer></v-spacer>
        <v-btn @click="createInvoice()">Create Sale Return</v-btn>
      </v-toolbar>
      <v-data-table :loading="$loading('fetchReturnSaleList')" :headers="headers" :items="saleReturnInvoices">
        <template v-slot:item.actions="{ item }">
          <v-icon class="me-2" size="small" @click="editInvoice(item)"> mdi-pencil </v-icon>
          <v-icon size="small" @click="deleteInvoice(item.id)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-card>
  
  </v-container>
</template>
<!-- <file-upload title="Upload Files" v-model="state.files" multiple></file-upload> -->
