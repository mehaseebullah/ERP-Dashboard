<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useSwal } from '@/composables/useSwal';
import { useProductStore } from '@/store/product';
import { useSupplierStore } from '@/store/supplier';
import { useGenerateInoiceNumber } from '@/store/generate_invoice_number';
import { usePurchaseInvoiceStore } from '@/store/purchase_invoice';
import { useRouter } from 'vue-router';
const productStore = useProductStore();
const supplierStore = useSupplierStore();
const purchaseInvoiceStore = usePurchaseInvoiceStore();
const generateInoiceNumberStore = useGenerateInoiceNumber();
const { products } = storeToRefs(productStore);
const { suppliers } = storeToRefs(supplierStore);
const { purchaseinvoices } = storeToRefs(purchaseInvoiceStore);

const expandedItemLength = ref(0);
const expanded = ref([]);
const swal = useSwal();
const router = useRouter();
const headers = [
  { title: '', key: 'data-table-expand' },
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
    title: 'Description',
    key: 'description',
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
      total: 0.0,
      discount: 0.0,
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
  router.push('add-purchase-invoice');
  // formData.value = JSON.parse(JSON.stringify({ ...formModal }));
  // console.log(formData.value);
  // isEdit.value = false;
  // showDrawer.value = true;
  // formData.value.invoiceNo = await generateInoiceNumberStore.fetchGenerateInvoiceNumber({ Prefix: 'PI' });
}

async function createInvoice() {
  await purchaseInvoiceStore.createPurchaseInvoice(formData.value);
  showDrawer.value = false;
  formData.value = { ...formModal };
  isEdit.value = false;
  purchaseInvoiceStore.fetchPurchaseInvoiceList();
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
  formData.value.piDetails.push({
    productId: null,
    quantity: 0,
    purchasePrice: 0,
    total: 0,
  });
}
async function handleClick(items) {
  const lastItem = items[items.length - 1];
  const PurchaseInvoiceId = lastItem;
  if (expandedItemLength.value == 0) expandedItemLength.value = items.length;
  if (items.length < expandedItemLength.value) {
    expandedItemLength.value = items.length;
    return;
  }
  expandedItemLength.value = items.length;
  if (PurchaseInvoiceId) {
    let currentItemIndex = purchaseinvoices.value.findIndex((x) => x.id == PurchaseInvoiceId);
    PurchaseInvoiceId,
      (purchaseinvoices.value[currentItemIndex] = await purchaseInvoiceStore.fetchPurchaseInvoiceListDetails(
        PurchaseInvoiceId,
        purchaseinvoices.value[currentItemIndex],
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
  supplierStore.fetchSuppliers();
  productStore.fetchProducts();
  purchaseInvoiceStore.fetchPurchaseInvoiceList();
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar title="PURCHASE INVOICE" color="secondary" density="compact">
        <v-spacer></v-spacer>
        <v-btn @click="newInvoice()">Create Invoice</v-btn>
      </v-toolbar>
      <v-data-table
        :loading="$loading('fetchPurchaseInvoiceList')"
        v-model:expanded="expanded"
        :headers="headers"
        :items="purchaseinvoices"
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
                  <v-data-table :headers="getItemHeaders()" :items="item.piDetails">
                    <template v-slot:item.productId="{ item }">{{ item.productId }} </template>
                    <!-- Totals row at the bottom -->
                    <template v-slot:body.append>
                      <tr>
                        <td><strong>Total</strong></td>
                        <td><strong></strong></td>
                        <td>
                          <strong>{{ calculateTotal(item.piDetails, 'purchasePrice') }}</strong>
                        </td>
                        <td>
                          <strong>{{ calculateTotal(item.piDetails, 'discount') }}</strong>
                        </td>
                        <td>
                          <strong>{{ calculateTotal(item.piDetails, 'quantity') }}</strong>
                        </td>
                        <td>
                          <strong>{{ calculateTotal(item.piDetails, 'total') }}</strong>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </td>
          </tr>
        </template>

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
            <v-text-field v-model="formData.invoiceNo" label="Ref No" variant="outlined"></v-text-field>
          </v-col>
        </v-row>
        <v-select
          :items="suppliers"
          item-title="fullName"
          item-value="id"
          v-model="formData.supplierId"
          :loading="$loading('fetchSuppliers')"
          label="Supplier"
          variant="outlined"
        ></v-select>
        <v-textarea v-model="formData.description" label="Description" variant="outlined" rows="2"></v-textarea>
        <template v-for="(entry, index) in formData.piDetails" :key="index">
          <v-row>
            <v-col>
              <v-select
                :items="products"
                item-title="title"
                item-value="id"
                v-model="entry.productId"
                :loading="$loading('fetchProducts')"
                label="Product"
                variant="outlined"
                density="compact"
                @update:model-value="
                  () => (entry.purchasePrice = products.find((p) => p.id == entry.productId)?.purchasePrice)
                "
              ></v-select>
            </v-col>
            <v-col>
              <v-text-field
                type="number"
                density="compact"
                v-model.number="entry.purchasePrice"
                label="Unit Price"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                type="number"
                density="compact"
                v-model.number="entry.quantity"
                label="Quantity"
                variant="outlined"
                @keyup="entry.total = entry.purchasePrice * entry.quantity"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                readonly
                type="number"
                density="compact"
                v-model.number="entry.total"
                label="Total"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col v-if="index > 0" cols="1">
              <v-btn variant="text" size="small" icon="mdi-delete" @click="formData.piDetails.splice(index, 1)"></v-btn>
            </v-col>
          </v-row>
        </template>
        <div class="d-flex justify-end mb-5">
          <v-btn
            variant="text"
            @click="
              formData.piDetails.push({
                productId: null,
                quantity: 0,
                purchasePrice: 0,
                total: 0,
              })
            "
            >Add Entry</v-btn
          >
        </div>
        <div class="d-flex justify-end">
          <v-text-field
            v-model.number="formData.total"
            type="number"
            label="Total Amount"
            variant="outlined"
          ></v-text-field>
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
