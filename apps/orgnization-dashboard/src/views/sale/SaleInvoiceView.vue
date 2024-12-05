<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useSwal } from '@/composables/useSwal';
import { useProductStore } from '@/store/product';
import { useSaleInvoiceStore } from '@/store/sale_invoice';
import { useCustomerStore } from '@/store/customer';
import { useRouter } from 'vue-router';
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

const productStore = useProductStore();
const customerStore = useCustomerStore();
const saleInvoiceStore = useSaleInvoiceStore();

const { products } = storeToRefs(productStore);
const { customers } = storeToRefs(customerStore);
const { saleInvoices } = storeToRefs(saleInvoiceStore);

const expandedItemLength = ref(0);
const swal = useSwal();
const router = useRouter();
const headers = [
  { title: '', key: 'data-table-expand' },
  {
    title: 'Invoice No',
    key: 'invoiceNo',
    sortable: true,
  },
  {
    title: 'Supplier Name',
    key: 'supplierName',
    sortable: true,
  },
  {
    title: 'Invoice Date',
    key: 'invoiceDate',
    sortable: true,
  },
  {
    title: 'Description',
    key: 'description',
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
    title: 'Created',
    key: 'createdBy',
    sortable: true,
  },
  {
    title: 'Modified',
    key: 'updatedBy',
    sortable: true,
  },
  {
    title: 'Actions',
    key: 'actions',
  },
];

// Headers for the nested grid (Items table)
const getItemHeaders = () => [
  { title: 'Product Name', key: 'title', sortable: true },
  { title: 'Quantity', key: 'quantity', sortable: true },
  { title: 'Purchase Price', key: 'purchasePrice', sortable: true },
  { title: 'Discount', key: 'discount', sortable: true },
  { title: 'Total', key: 'total', sortable: true },
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
  router.push('add-sale-invoice');
  // formData.value = { ...formModal };
  // isEdit.value = false;
  // showDrawer.value = true;
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
      await saleInvoiceStore.deletePurchaseInvoice({ id });
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

async function handleClick(items) {
  const lastItem = items[items.length - 1];
  const SaleInvoiceId = lastItem;
  if (expandedItemLength.value == 0) expandedItemLength.value = items.length;
  if (items.length < expandedItemLength.value) {
    expandedItemLength.value = items.length;
    return;
  }
  expandedItemLength.value = items.length;
  if (SaleInvoiceId) {
    let currentItemIndex = saleInvoices.value.findIndex((x) => x.id == SaleInvoiceId);
    SaleInvoiceId,
      (saleInvoices.value[currentItemIndex] = await saleInvoiceStore.fetchSaleInvoiceListDetails(
        SaleInvoiceId,
        saleInvoices.value[currentItemIndex],
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
  if (canRead.value) saleInvoiceStore.fetchSaleInvoiceList();
  if (canCreate.value || canUpdate.value) {
    customerStore.fetchCustomers();
    productStore.fetchProducts();
  }
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar title="SALE INVOICE" color="secondary" density="compact">
        <v-spacer></v-spacer>
        <v-btn v-if="canCreate" @click="newInvoice()">Create Invoice</v-btn>
      </v-toolbar>
      <v-data-table
        v-if="canRead"
        :loading="$loading('fetchSaleInvoiceList')"
        :headers="headers"
        :items="saleInvoices"
        item-value="id"
        show-expand
        @update:expanded="handleClick"
      >
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

        <!-- Expandable Row for Order Details   -->
        <template v-slot:expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <v-card flat>
                <v-card-text>
                  <v-data-table
                    :loading="$loading('fetchSaleInvoiceListDetails')"
                    :headers="getItemHeaders()"
                    :items="item.siDetails"
                  >
                    <template v-slot:item.productId="{ item }">{{ item.productId }} </template>
                    <!-- Totals row at the bottom -->
                    <template v-slot:body.append>
                      <tr>
                        <td><strong></strong></td>
                        <td>
                          <strong>{{ calculateTotal(item.siDetails, 'quantity') }}</strong>
                        </td>
                        <td>
                          <strong>{{ calculateTotal(item.siDetails, 'purchasePrice') }}</strong>
                        </td>
                        <td>
                          <strong>{{ calculateTotal(item.siDetails, 'discount') }}</strong>
                        </td>

                        <td>
                          <strong>{{ calculateTotal(item.siDetails, 'total') }}</strong>
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
          <v-icon v-if="canUpdate" class="me-2" size="small" @click="editInvoice(item)"> mdi-pencil </v-icon>
          <v-icon v-if="canDelete" size="small" @click="deleteInvoice(item.id)"> mdi-delete </v-icon>
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
        <v-select
          :items="customers"
          item-title="fullName"
          item-value="id"
          v-model="formData.customerId"
          :loading="$loading('fetchSuppliers')"
          label="Customer"
          variant="outlined"
        ></v-select>
        <v-textarea v-model="formData.description" label="Description" variant="outlined" rows="2"></v-textarea>
        <template v-for="(entry, index) in formData.siDetails" :key="index">
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
                @update:model-value="updateEntryPrices(entry)"
              ></v-select>
            </v-col>
            <v-col>
              <v-text-field
                type="number"
                density="compact"
                v-model.number="entry.salePrice"
                label="Unit Price"
                @keyup="updateEntryTotal(entry)"
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
                @keyup="updateEntryTotal(entry)"
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
              <v-btn variant="text" size="small" icon="mdi-delete" @click="formData.siDetails.splice(index, 1)"></v-btn>
            </v-col>
          </v-row>
        </template>
        <div class="d-flex justify-end mb-5">
          <v-btn
            variant="text"
            @click="
              formData.siDetails.push({
                productId: null,
                purchasePrice: 0.0,
                quantity: 0,
                salePrice: 0.0,
                total: 0.0,
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
