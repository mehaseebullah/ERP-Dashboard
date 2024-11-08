<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStocks } from '@/store/stocks';
import { useSwal } from '@/composables/useSwal';
import { storeToRefs } from 'pinia';
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
  if (canRead.value) stocksStore.fetchStocks();
});
</script>

<template>
  <v-container>
    <v-card>
      <v-toolbar title="STOCKS" color="secondary" density="compact">
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-data-table v-if="canRead" :loading="$loading('fetchStocks')" :headers="headers" :items="stocks">
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
