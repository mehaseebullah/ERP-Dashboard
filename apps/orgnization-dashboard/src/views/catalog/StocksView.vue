<script setup>
import { onMounted, ref } from 'vue';
import { useStocks } from '@/store/stocks';
import { useSwal } from '@/composables/useSwal';
import { storeToRefs } from 'pinia';

const stocksStore = useStocks();
const { stocks } = storeToRefs(stocksStore);

const swal = useSwal();

const headers = [
  {
    title: 'Product Name',
    key: 'productName',
    sortable: true
  },
  {
    title: 'SKU',
    key: 'sku',
    sortable: true
  },
  {
    title: 'Description',
    key: 'description',
    sortable: true
  },
  {
    title: 'Sale Count',
    key: 'saleCount',
    sortable: true
  },
  {
    title: 'Purchase Count',
    key: 'purchaseCount',
    sortable: true
  },
  {
    title: 'Quantity',
    key: 'quantity',
    sortable: true
  },
  {
    title: 'Created At',
    key: 'createdAt',
    sortable: true
  },
  {
    title: 'Created By',
    key: 'createdBy',
    sortable: true
  },
  {
    title: 'Updated At',
    key: 'updatedAt',
    sortable: true
  },
  {
    title: 'Updated By',
    key: 'updatedBy',
    sortable: true
  }
];



onMounted(() => {
    stocksStore.fetchStocks();
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar color="secondary" density="compact">
        <v-spacer></v-spacer>
        <!-- <v-btn @click="newUnit()">Create Unit</v-btn> -->
      </v-toolbar>
      <v-data-table :loading="$loading('fetchUnits')" :headers="headers" :items="stocks">
      
      </v-data-table>
    </v-card>
   
  </v-container>
</template>
