<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useSwal } from '@/composables/useSwal';
import { useProductStore } from '@/store/product';
import { usePurchaseInvoiceStore } from '@/store/purchase_invoice';
import { useCustomerStore } from '@/store/customer';

const productStore = useProductStore();
const customerStore = useCustomerStore();
const invoiceStore = usePurchaseInvoiceStore();

const { products } = storeToRefs(productStore);
const { customers } = storeToRefs(customerStore);
const { getSaleInvoices } = storeToRefs(invoiceStore);

const swal = useSwal();

const headers = [
  {
    title: 'Product',
    key: 'product_id',
  },
  {
    title: 'Quantity',
    key: 'quantity',
  },
  {
    title: 'Price',
    key: 'unit_price',
  },
  {
    title: 'Total',
    key: 'total',
  },
  {
    key: 'actions',
  },
];

const formModal = {
  invoice_type: 'sale',
  ref_no: '',
  invoice_date: '',
  description: '',
  customer_supplier_code: '',
  total: 0,
  purchase_total: 0,
  discount: 0,
  details: [],
};

const formData = ref({ ...formModal });
const pos = ref();

watchEffect(() => {
  let total = 0;
  formData.value.details.forEach((entry) => {
    entry.total = entry.unit_price * entry.quantity;
    total += entry.total || 0;
  });
  formData.value.total = total;
});

async function newInvoice() {
  formData.value = { ...formModal };
}

async function createInvoice() {
  const details = formData.value.details.map((entry) => {
    return {
      product_id: entry.product_id,
      quantity: entry.quantity,
      unit_price: entry.unit_price,
      total: entry.total,
      discount: entry.discount,
    };
  });
  await invoiceStore.createInvoice({ ...formData.value, details });
  formData.value = { ...formModal };
}

function requestFullscreen() {
  const elem = pos.value.$el;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

function addProduct(i) {
  if (!i) {
    return;
  }
  const prod = products.value.find((p) => p.id == i);

  formData.value.details.push({
    product_id: prod.id,
    title: prod.title,
    quantity: 1,
    unit_price: prod.sale_price,
    total: prod.sale_price,
    discount: 0,
  });
}

onMounted(async () => {
  customerStore.fetchCustomers();
  productStore.fetchProducts();
  //   invoiceStore.fetchInvoiceList();
});
</script>
<template>
  <v-container class="bg-white" ref="pos">
    <v-row>
      <v-col cols="8" class="bg-grey-lighten-5">
        <div>
          <v-autocomplete
            :items="products"
            class="mx-auto"
            density="comfortable"
            menu-icon=""
            placeholder="Enter product name / SKU"
            prepend-inner-icon="mdi-magnify"
            theme="light"
            auto-select-first
            item-title="title"
            item-value="id"
            item-props
            @update:model-value="addProduct"
          ></v-autocomplete>
        </div>
        <v-data-table hide-default-footer :headers="headers" :items="formData.details">
          <template v-slot:item.product_id="{ item }">
            {{ products.find((p) => p.id == item.product_id)?.title }}
          </template>

          <template v-slot:item.quantity="{ item }">
            <v-text-field
              class="mt-2"
              variant="outlined"
              density="compact"
              type="number"
              style="max-width: 100px"
              v-model.number="item.quantity"
            ></v-text-field>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn variant="text" size="small" icon="mdi-delete"></v-btn>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="4">
        <div class="d-flex align-start justify-center">
          <v-select
            :items="customers"
            item-title="name"
            item-value="code"
            v-model="formData.customer_supplier_code"
            :loading="$loading('fetchCustomers')"
            label="Customer"
            variant="outlined"
            density="compact"
            class="mx-2"
          ></v-select>
          <v-btn color="primary" @click="requestFullscreen()">
            <v-icon size="large">mdi-fullscreen</v-icon>
          </v-btn>
        </div>
        <v-divider color="primary" thickness="3"></v-divider>

        <v-table>
          <tbody>
            <tr>
              <td>Sub Total</td>
              <td>{{ formData.total }}</td>
            </tr>
            <tr>
              <td>Tax</td>
              <td>00.00</td>
            </tr>
            <tr>
              <td>Discount</td>
              <td>
                <v-text-field
                  type="number"
                  v-model.number="formData.discount"
                  variant="outlined"
                  density="compact"
                  class="mt-2"
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <td>Total</td>
              <td>{{ formData.total }}</td>
            </tr>
          </tbody>
        </v-table>

        <v-divider color="primary" thickness="3"></v-divider>
        <div class="d-flex justify-center items-center mt-5">
          <v-btn-group>
            <v-btn style="width: 200px" prepend-icon="mdi-credit-card" color="secondary" flat>Credit Card</v-btn>
            <v-btn style="width: 150px" prepend-icon="mdi-cash" color="primary" flat>Cash</v-btn>
          </v-btn-group>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
