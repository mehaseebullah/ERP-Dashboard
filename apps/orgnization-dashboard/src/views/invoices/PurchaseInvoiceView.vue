<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useSwal } from '@/composables/useSwal';
import { useProductStore } from '@/store/product';
import { useSupplierStore } from '@/store/supplier';
import { usePurchaseInvoiceStore } from '@/store/purchase_invoice';

const productStore = useProductStore();
const supplierStore = useSupplierStore();
const purchaseInvoiceStore = usePurchaseInvoiceStore();

const { products } = storeToRefs(productStore);
const { suppliers } = storeToRefs(supplierStore);
const { purchaseinvoices } = storeToRefs(purchaseInvoiceStore);

const swal = useSwal();

const headers = [
  {
    title: 'invoice No',
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
const formModal = {
  invoiceNo: '',
  description: '',
  supplierId: null,
  subTotal: 0.0,
  total: 0.0,
  discount: 0.0,
  piDetails: [
    {
      productId: null,
      quantity: 0,
      purchasePrice: 0,
      total: 0.0
    },
  ],
};

const formData = ref({ ...formModal });
const isEdit = ref(false);
const showDrawer = ref(false);

watchEffect(() => {
  let total = 0;
  if (formData.value.piDetails) {
    formData.value.piDetails.forEach((entry) => {
      total += entry.total || 0;
    });
    formData.value.subTotal = total;
    formData.value.total = total;
  }
});

async function newInvoice() {
  formData.value = { ...formModal };
  isEdit.value = false;
  showDrawer.value = true;
}

async function createInvoice() {
  await purchaseInvoiceStore.createPurchaseInvoice(formData.value);
  showDrawer.value = false;
  formData.value = { ...formModal };
  isEdit.value = false;
}

async function editInvoice(item) {
  formData.value = { ...item };
  isEdit.value = true;
  showDrawer.value = true;
}

async function updateInvoice() {
  await purchaseInvoiceStore.updatePurchaseInvoice(formData.value);
  showDrawer.value = false;
  formData.value = { ...formModal };
  isEdit.value = false;
}

async function deleteInvoice(id) {
  swal.confirm('Are you sure you want to delete this unit?').then(async (result) => {
    if (result.isConfirmed) {
      await purchaseInvoiceStore.deletePurchaseInvoice({ id });
      showDrawer.value = false;
    }
  });

}
async function addMoreProduct() {

  formData.piDetails.push({
    productId: null,
    quantity: 0,
    purchasePrice: 0,
    total: 0,
  })
}
onMounted(async () => {
  supplierStore.fetchSuppliers();
  productStore.fetchProducts();
  purchaseInvoiceStore.fetchPurchaseInvoiceList();
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar title="PURCHASE INVOICES" color="secondary" density="compact">
        <v-spacer></v-spacer>
        <v-btn @click="newInvoice()">Create Invoice</v-btn>
      </v-toolbar>
      <v-data-table :loading="$loading('fetchPurchaseInvoiceList')" :headers="headers" :items="purchaseinvoices">
        <template v-slot:item.supplierId="{ item }">
          {{ suppliers.find((s) => s.id == item.supplierId)?.fullName }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon class="me-2" size="small" @click="editInvoice(item)"> mdi-pencil </v-icon>
          <v-icon size="small" @click="deleteInvoice(item.id)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <main-drawer v-model="showDrawer" width="800" title="PURCHASE INVOICE" :toolbar="{ color: 'primary' }">
      <v-form class="pa-5" @submit.prevent="isEdit ? updateInvoice() : createInvoice()">
        <v-row>
          <v-col>
            <v-text-field type="date" v-model="formData.invoiceDate" label="Date" variant="outlined"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="formData.refNo" label="Ref No" variant="outlined"></v-text-field>
          </v-col>
        </v-row>
        <v-select :items="suppliers" item-title="fullName" item-value="id" v-model="formData.supplierId"
          :loading="$loading('fetchSuppliers')" label="Supplier" variant="outlined"></v-select>
        <v-textarea v-model="formData.description" label="Description" variant="outlined" rows="2"></v-textarea>
        <template v-for="(entry, index) in formData.piDetails" :key="index">
          <v-row>
            <v-col>
              <v-select :items="products" item-title="title" item-value="id" v-model="entry.productId"
                :loading="$loading('fetchProducts')" label="Product" variant="outlined" density="compact"
                @update:model-value="() => (entry.purchasePrice = products.find((p) => p.id == entry.productId)?.purchasePrice)
                  "></v-select>
            </v-col>
            <v-col>
              <v-text-field type="number" density="compact" v-model.number="entry.purchasePrice" label="Unit Price"
                variant="outlined"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field type="number" density="compact" v-model.number="entry.quantity" label="Quantity"
                variant="outlined" @keyup="entry.total = entry.purchasePrice * entry.quantity"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field readonly type="number" density="compact" v-model.number="entry.total" label="Total"
                variant="outlined"></v-text-field>
            </v-col>
            <v-col v-if="index > 0" cols="1">
              <v-btn variant="text" size="small" icon="mdi-delete" @click="formData.piDetails.splice(index, 1)"></v-btn>
            </v-col>
          </v-row>
        </template>
        <div class="d-flex justify-end mb-5">
          <v-btn variant="text" @click="formData.piDetails.push({
            productId: null,
            quantity: 0,
            purchasePrice: 0,
            total: 0,
          })">Add Entry</v-btn>
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
