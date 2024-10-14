<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useSwal } from '@/composables/useSwal';
import { useProductStore } from '@/store/product';
import { useSaleOrderStore } from '@/store/sale_order';
import { useCustomerStore } from '@/store/customer';
import { useGenerateInoiceNumber } from '@/store/generate_invoice_number';

const productStore = useProductStore();
const customerStore = useCustomerStore();
const saleOrderStore = useSaleOrderStore();
const generateInoiceNumberStore = useGenerateInoiceNumber();
const { products } = storeToRefs(productStore);
const { customers } = storeToRefs(customerStore);

const swal = useSwal();

const headers = [
  {
    title: 'Product',
    key: 'title',
  },
  {
    title: 'Quantity',
    key: 'quantity',
  },
  {
    title: 'Price',
    key: 'salePrice',
  },
  {
    title: 'Discount',
    key: 'discount',
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
  soNo: '',
  description: '',
  customerId: null,
  subTotal: 0.0,
  total: 0.0,
  discount: 0.0,
  soDetails: [],
};

const formData = ref({ ...formModal });
const pos = ref();

watchEffect(() => {
  let total = 0, totalDiscount = 0,subTotal=0;
  formData.value.soDetails.forEach((entry) => {
    let perItemAmount=entry.salePrice * entry.quantity;
    entry.total = perItemAmount - entry.discount;
    total += entry.total || 0;
    subTotal+=perItemAmount||0;
    totalDiscount += entry.discount || 0;
    entry.purchaseTotal=entry.purchasePrice * entry.quantity || 0;
  });
  formData.value.total = total;
  formData.value.subTotal = subTotal;
  formData.value.discount = totalDiscount
});

async function newInvoice() {
  formData.value = { ...formModal };
}
async function newInvoiceNum() {

  formData.value = JSON.parse(JSON.stringify({ ...formModal }));
  formData.value.soNo = await generateInoiceNumberStore.fetchGenerateInvoiceNumber({ Prefix: 'SO' });
}
async function createInvoice() {

  await saleOrderStore.createSaleOrder(formData.value)
  await newInvoice()
  await newInvoiceNum();
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

function addProduct(productId) {
  if (!productId) {
    return;
  }
  let currentIndex = -1;
  if (formData.value.soDetails.length > 0) {
    currentIndex = formData.value.soDetails.findIndex((p) => p.productId == productId);
  }
  if (currentIndex == -1) {
    const prod = products.value.find((p) => p.id == productId);

    formData.value.soDetails.push({
      productId: prod.id,
      title: prod.title,
      quantity: 1,
      purchasePrice: prod.purchasePrice,
      salePrice:prod.salePrice,
      total: prod.purchasePrice,
      discount: 0.0,
    });
  }
  else {
    formData.value.soDetails[currentIndex]['quantity'] += 1;
  }
}

onMounted(async () => {
  newInvoiceNum();
  customerStore.fetchCustomers();
  productStore.fetchProducts();
});
</script>
<template>
  <v-container class="bg-white" ref="pos">
    <v-row>
      <v-col cols="8" class="bg-grey-lighten-5">
        <div>
          <v-autocomplete :items="products" class="mx-auto" density="comfortable" menu-icon=""
            placeholder="Enter product name / SKU" prepend-inner-icon="mdi-magnify" theme="light" auto-select-first
            item-title="title" item-value="id" item-props @update:model-value="addProduct"></v-autocomplete>
        </div>
        <v-data-table hide-default-footer :headers="headers" :items="formData.soDetails">
          <template v-slot:item.title="{ item }">
            {{ item.title }}
          </template>

          <template v-slot:item.quantity="{ item }">
            <v-text-field class="mt-2" variant="outlined" density="compact" type="number" style="max-width: 100px"
              v-model.number="item.quantity"></v-text-field>
          </template>
          <template v-slot:item.salePrice="{ item }">
            <v-text-field class="mt-2" variant="outlined" density="compact" type="number" style="max-width: 100px"
              v-model.number="item.salePrice"></v-text-field>
          </template>
          <template v-slot:item.discount="{ item }">
            <v-text-field class="mt-2" variant="outlined" density="compact" type="number" style="max-width: 100px"
              v-model.number="item.discount"></v-text-field>
          </template>
          <template v-slot:item.total="{ item }">
            {{ item.total }}
          </template>
          <template v-slot:item.actions="{ item, index }">
            <v-col  cols="1">
              <v-btn variant="text" size="small" icon="mdi-delete" @click="formData.soDetails.splice(index, 1)"></v-btn>
            </v-col>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="4">
        <div class="d-flex align-start justify-center">
          <v-select :items="customers" item-title="fullName" item-value="id" v-model="formData.customerId"
            :loading="$loading('fetchSuppliers')" label="Supplier" variant="outlined" density="compact"
            class="mx-2"></v-select>
          <v-btn color="primary" @click="requestFullscreen()">
            <v-icon size="large">mdi-fullscreen</v-icon>
          </v-btn>
        </div>
        <div class="d-flex align-start">{{ formData.soNo }}</div>
        <v-divider color="primary" thickness="3"></v-divider>

        <v-table>
          <tbody>
            <tr>
              <td>Sub Total</td>
              <td>{{ formData.subTotal }}</td>
            </tr>
            <tr>
              <td>Tax</td>
              <td>00.00</td>
            </tr>
            <tr>
              <td>Discount</td>
              <td>
                <v-text-field type="number" v-model.number="formData.discount" variant="outlined" density="compact"
                  class="mt-2"></v-text-field>
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
            <!-- <v-btn v-else :loading="$loading('createPurchaseInvoice')" type="submit" color="primary">Create</v-btn> -->
            <v-btn style="width: 200px" prepend-icon="mdi-credit-card" color="secondary" flat>Credit Card</v-btn>
            <v-btn style="width: 150px" prepend-icon="mdi-cash" @click="createInvoice" color="primary" flat>Cash</v-btn>
          </v-btn-group>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
