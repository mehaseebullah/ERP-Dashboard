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
    sortable: true,
  },
  {
    title: 'SKU',
    key: 'sku',
    sortable: true,
  },
  {
    title: 'Description',
    key: 'description',
    sortable: true,
  },
  {
    title: 'Sale Count',
    key: 'saleCount',
    sortable: true,
  },
  {
    title: 'Purchase Count',
    key: 'purchaseCount',
    sortable: true,
  },
  {
    title: 'Quantity',
    key: 'quantity',
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
      </v-toolbar>
      <v-data-table :loading="$loading('fetchStocks')" :headers="headers" :items="stocks">
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
      </v-data-table>
    </v-card>
  </v-container>
</template>
