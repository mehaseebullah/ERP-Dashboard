<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useSwal } from '@/composables/useSwal';
import { useProductStore } from '@/store/product';
import { useSaleInvoiceStore } from '@/store/sale_invoice';
import { useCustomerStore } from '@/store/customer';

const productStore = useProductStore();
const customerStore = useCustomerStore();
const saleInvoiceStore = useSaleInvoiceStore();

const { products } = storeToRefs(productStore);
const { customers } = storeToRefs(customerStore);
const { saleInvoices } = storeToRefs(saleInvoiceStore);

const swal = useSwal();

const headers = [
  {
    title: 'invoice No',
    key: 'invoiceNo',
    sortable: true,
  },
  {
    title: 'customer',
    key: 'customerName',
    sortable: true,
  },
  {
    title: 'Date',
    key: 'invoiceDate',
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
const formModal = {
  invoiceNo: '',
  description: '',
  customerId: null,
  total: 0.0,
  subTotal: 0.0,
  pTotal: 0,
  discount: 0,
  siDetails: [
    {
      productId: null,
      quantity: 0,
      salePrice: 0.0,
      purchasePrice: 0.0,
      purchaseTotal: 0.0,
      total: 0,
      discount: 0,
    },
  ],
};

const formData = ref({ ...formModal });
const isEdit = ref(false);
const showDrawer = ref(false);

watchEffect(() => {
  let total = 0;
  let purchaseTotal = 0;
  if (formData.value.siDetails) {
    formData.value.siDetails.forEach((entry) => {
      total += entry.total || 0;
      purchaseTotal += entry.purchaseTotal || 0;
    });
    formData.value.total = total;
    formData.value.subTotal = total;

    formData.value.pTotal = purchaseTotal;
  }
});

async function newInvoice() {
  formData.value = { ...formModal };
  isEdit.value = false;
  showDrawer.value = true;
}

async function createInvoice() {
  router.push('add-sale-invoice');
  // const details = formData.value.siDetails.map((entry) => {
  //   return {
  //     productId: entry.productId,
  //     quantity: entry.quantity,
  //     salePrice: entry.salePrice,
  //     total: entry.total,
  //     discount: entry.discount,
  //   };
  // });
  // await saleInvoiceStore.createInvoice({ ...formData.value, details });
  // showDrawer.value = false;
  // formData.value = { ...formModal };
  // isEdit.value = false;
}

async function editInvoice(item) {
  formData.value = { ...item };
  isEdit.value = true;
  showDrawer.value = true;
}

async function updateInvoice() {
  await saleInvoiceStore.updateInvoice(formData.value);
  showDrawer.value = false;
  formData.value = { ...formModal };
  isEdit.value = false;
}

async function deleteInvoice(id) {
  swal.confirm('Are you sure you want to delete this unit?').then(async (result) => {
    if (result.isConfirmed) {
      await invoiceStore.deletePurchaseInvoice({ id });
      showDrawer.value = false;
    }
  });
}

function updateEntryPrices(entry) {
  const p = products.value.find((p) => p.id == entry.productId);
  entry.salePrice = p?.salePrice;
  entry.purchasePrice = p?.purchasePrice;
}

function updateEntryTotal(entry) {
  entry.total = entry.salePrice * entry.quantity;
  entry.purchaseTotal = entry.purchasePrice * entry.quantity;
}

onMounted(async () => {
  customerStore.fetchCustomers();
  productStore.fetchProducts();
  saleInvoiceStore.fetchSaleInvoiceList();
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar title="SALE INVOICES" color="secondary" density="compact">
        <v-spacer></v-spacer>
        <v-btn @click="newInvoice()">Create Invoice</v-btn>
      </v-toolbar>
      <v-data-table :loading="$loading('fetchPurchaseInvoiceList')" :headers="headers" :items="saleInvoices">
        <template v-slot:item.supplierId="{ item }">
          {{ suppliers.find((s) => s.id == item.supplierId)?.fullName }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon class="me-2" size="small" @click="editInvoice(item)"> mdi-pencil </v-icon>
          <v-icon size="small" @click="deleteInvoice(item.id)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <main-drawer v-model="showDrawer" width="800" title="SALE INVOICE" :toolbar="{ color: 'primary' }">
      <v-form class="pa-5" @submit.prevent="isEdit ? updateInvoice() : createInvoice()">
        <v-row>
          <v-col>
            <v-text-field type="date" v-model="formData.invoiceDate" label="Date" variant="outlined"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="formData.refNo" label="Ref No" variant="outlined"></v-text-field>
          </v-col>
        </v-row>
        <v-select :items="customers" item-title="fullName" item-value="id" v-model="formData.customerId"
          :loading="$loading('fetchSuppliers')" label="Customer" variant="outlined"></v-select>
        <v-textarea v-model="formData.description" label="Description" variant="outlined" rows="2"></v-textarea>
        <template v-for="(entry, index) in formData.siDetails" :key="index">
          <v-row>
            <v-col>
              <v-select :items="products" item-title="title" item-value="id" v-model="entry.productId"
                :loading="$loading('fetchProducts')" label="Product" variant="outlined" density="compact"
                @update:model-value="updateEntryPrices(entry)"></v-select>
            </v-col>
            <v-col>
              <v-text-field type="number" density="compact" v-model.number="entry.salePrice" label="Unit Price"
                @keyup="updateEntryTotal(entry)" variant="outlined"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field type="number" density="compact" v-model.number="entry.quantity" label="Quantity"
                variant="outlined" @keyup="updateEntryTotal(entry)"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field readonly type="number" density="compact" v-model.number="entry.total" label="Total"
                variant="outlined"></v-text-field>
            </v-col>
            <v-col v-if="index > 0" cols="1">
              <v-btn variant="text" size="small" icon="mdi-delete" @click="formData.siDetails.splice(index, 1)"></v-btn>
            </v-col>
          </v-row>
        </template>
        <div class="d-flex justify-end mb-5">
          <v-btn variant="text" @click="
            formData.siDetails.push({
              productId: null,
              purchasePrice: 0.0,
              quantity: 0,
              salePrice: 0.0,
              total: 0.0,
            })
            ">Add Entry</v-btn>
        </div>
        <div class="d-flex justify-end">
          <v-text-field v-model.number="formData.total" type="number" label="Total Amount"
            variant="outlined"></v-text-field>
        </div>

        <div class="d-flex justify-end mt-5">
          <v-btn v-if="isEdit" :loading="$loading('updatePurchaseInvoice')" type="submit" color="primary">Update</v-btn>
          <v-btn v-else :loading="$loading('createPurchaseInvoice')" type="submit" color="primary">Create</v-btn>
        </div>
      </v-form>
    </main-drawer>
  </v-container>
</template>
<!-- <file-upload title="Upload Files" v-model="state.files" multiple></file-upload> -->
