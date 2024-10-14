<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useSwal } from '@/composables/useSwal';
import { useProductStore } from '@/store/product';
import { usePurchaseReturnInvoiceStore } from '@/store/purchase_return_invoice';
import { usePurchaseInvoiceStore } from '@/store/purchase_invoice';
import { useSupplierStore } from '@/store/supplier';
import { useGenerateInoiceNumber } from '@/store/generate_invoice_number';

const productStore = useProductStore();
const supplieStore = useSupplierStore();
const purchaseReturnInvoiceStore = usePurchaseReturnInvoiceStore();
const PurchaseInvoiceStore = usePurchaseInvoiceStore();
const generateInoiceNumberStore = useGenerateInoiceNumber();
const { products } = storeToRefs(productStore);
const { suppliers } = storeToRefs(supplieStore);

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
    key: 'purchasePrice',
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
  invoiceNo: '',
  description: '',
  supplierId: null,
  piId: 1,
  subTotal: 0.0,
  total: 0.0,
  discount: 0.0,
  rpiDetails: [],
  paid: 0.0,
  remainingAmount: 0.0,
  returnAmount: 0.0
};
const piNumber = ref("");
const formData = ref({ ...formModal });
const pos = ref();

watchEffect(() => {
  let total = 0, totalDiscount = 0, subTotal = 0;
  formData.value.rpiDetails.forEach((entry) => {
    let perItemAmount = entry.purchasePrice * entry.quantity;
    entry.total = perItemAmount - entry.discount;
    total += entry.total || 0;
    subTotal += perItemAmount || 0;
    totalDiscount += entry.discount || 0;
  });
  formData.value.total = total;
  formData.value.subTotal = subTotal;
  formData.value.discount = totalDiscount;
  if (formData.value.paid >= formData.value.total) {
    formData.value.remainingAmount = 0.0;
    formData.value.returnAmount = formData.value.paid - formData.value.total;
  }
  else {
    formData.value.returnAmount = 0.0;
    formData.value.remainingAmount = formData.value.total - formData.value.paid;
  }
});

async function newInvoice() {
  formData.value = { ...formModal };
}
async function newInvoiceNum() {

  formData.value = JSON.parse(JSON.stringify({ ...formModal }));
  formData.value.invoiceNo = await generateInoiceNumberStore.fetchGenerateInvoiceNumber({ Prefix: 'PRI' });
}
async function createInvoice() {
  if (formData.value.remainingAmount > 0 && !formData.value.supplierId) {
    swal.info('please pay full amount or select a supplier');
    return;
  }
  if (!formData.value.piId) {
    swal.info('please put purchase invoice number');
    return;
  }

  const data = await purchaseReturnInvoiceStore.createPurchaseReturnInvoice(formData.value);
  if (data.statusCode == 404)
    return;
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
  if (formData.value.rpiDetails.length > 0) {
    currentIndex = formData.value.rpiDetails.findIndex((p) => p.productId == productId);
  }
  if (currentIndex == -1) {
    const prod = products.value.find((p) => p.id == productId);

    formData.value.rpiDetails.push({
      productId: prod.id,
      title: prod.title,
      quantity: 1,
      purchasePrice: prod.purchasePrice,
      total: prod.purchasePrice,
      discount: 0.0,
    });
  }
  else {
    formData.value.rpiDetails[currentIndex]['quantity'] += 1;
  }
}
async function getPurchaseInvoiceByPINumber(piNumber) {
  console.log('getPurchaseOrderByPONumber')
  try {
    if (!piNumber)
      return;
    const { data } = await PurchaseInvoiceStore.fetchPurchaseInvoiceByPINumber(piNumber);
    if (data) {
      let pi = data[0];
      await newInvoice();
      await newInvoiceNum()
      formData.value.supplierId = pi.supplierId;
      formData.value.subTotal = pi.subTotal;
      formData.value.total = pi.total;
      formData.value.discount = pi.discount;
      formData.value.piId = pi.id;
      formData.value.rpiDetails = JSON.parse(pi.poDetails)
    } else {
      let invoiceNo = formData.value.invoiceNo;
      await newInvoiceNum();
      formData.value.invoiceNo = invoiceNo;

    }
  } catch (e) {
    console.error(e)
  }

}
onMounted(async () => {
  newInvoiceNum();
  supplieStore.fetchSuppliers();
  productStore.fetchProducts();
  console.log(products, suppliers)
  //   invoiceStore.fetchInvoiceList();
});
</script>
<template>
  <v-container class="bg-white" ref="pos">
    <v-row>
      <v-col cols="8" class="bg-grey-lighten-5">
        <v-row>
          <v-col cols="9" class="bg-grey-lighten-5">
            <v-autocomplete :items="products" class="mx-auto" density="comfortable" menu-icon=""
              placeholder="Enter product name / SKU" prepend-inner-icon="mdi-magnify" theme="light" auto-select-first
              item-title="title" item-value="id" item-props @update:model-value="addProduct"></v-autocomplete>
          </v-col>
          <v-col cols="3" class="bg-grey-lighten-5">
            <v-text-field @keyup.enter="getPurchaseInvoiceByPINumber(piNumber)" placeholder="PI Number" class="mx-auto"
              variant="outlined" density="comfortable" theme="light" type="text" v-model="piNumber"></v-text-field>
          </v-col>
        </v-row>
        <v-data-table hide-default-footer :headers="headers" :items="formData.rpiDetails">
          <template v-slot:item.title="{ item }">
            {{ item.title }}
          </template>

          <template v-slot:item.quantity="{ item }">
            <v-text-field class="mt-2" variant="outlined" density="compact" type="number" style="max-width: 100px"
              v-model.number="item.quantity"></v-text-field>
          </template>
          <template v-slot:item.purchasePrice="{ item }">
            <v-text-field class="mt-2" variant="outlined" density="compact" type="number" style="max-width: 100px"
              v-model.number="item.purchasePrice"></v-text-field>
          </template>
          <template v-slot:item.discount="{ item }">
            <v-text-field class="mt-2" variant="outlined" density="compact" type="number" style="max-width: 100px"
              v-model.number="item.discount"></v-text-field>
          </template>
          <template v-slot:item.total="{ item }">
            {{ item.total }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn variant="text" size="small" icon="mdi-delete"></v-btn>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="4">
        <div class="d-flex align-start justify-center">
          <v-select :items="suppliers" item-title="fullName" item-value="id" v-model="formData.supplierId"
            :loading="$loading('fetchSuppliers')" label="Supplier" variant="outlined" density="compact"
            class="mx-2"></v-select>
          <v-btn color="primary" @click="requestFullscreen()">
            <v-icon size="large">mdi-fullscreen</v-icon>
          </v-btn>
        </div>
        <div class="d-flex align-start">{{ formData.invoiceNo }}</div>
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
            <tr>
              <td>Paid</td>
              <td> <v-text-field type="number" v-model.number="formData.paid" variant="outlined" density="compact"
                  class="mt-2"></v-text-field></td>
            </tr>
            <tr>
              <td>Remaining Amount</td>
              <td>{{ formData.remainingAmount }}</td>
            </tr>
            <tr>
              <td>Return Amount</td>
              <td>{{ formData.returnAmount }}</td>
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
