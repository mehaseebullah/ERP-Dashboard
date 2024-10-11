<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useUnitStore } from '@/store/unit';
import { useSwal } from '@/composables/useSwal';
import { useProductCategoryStore } from '@/store/product_category';
import { useProductStore } from '@/store/product';
import { useManufacturerStore } from '@/store/manufacturer';

const unitStore = useUnitStore();
const categoryStore = useProductCategoryStore();
const productStore = useProductStore();
const manufacturerStore = useManufacturerStore();
const { units } = storeToRefs(unitStore);
const { categories } = storeToRefs(categoryStore);
const { products } = storeToRefs(productStore);
const { manufacturers } = storeToRefs(manufacturerStore);
const swal = useSwal();

const headers = [
  {
    title: 'Title',
    key: 'title',
    sortable: true,
  },
  {
    title: 'SKU',
    key: 'sku',
    sortable: true,
  },
  {
    title: 'Manufacturer',
    key: 'manufacturer',
    sortable: true,
  },
  {
    title: 'Category',
    key: 'category',
    sortable: true,
  },
  {
    title: 'Unit',
    key: 'unit',
    sortable: true,
  },
  {
    title: 'Description',
    key: 'description',
    sortable: true,
  },
  {
    title: 'Purchase Price',
    key: 'purchasePrice',
    sortable: true,
  },
  {
    title: 'Sale Price',
    key: 'salePrice',
    sortable: true,
  },
  {
    title: 'Image',
    key: 'filePath',
  },
  {
    title: 'Actions',
    key: 'actions',
  },
];
const formModal = {
  title: '',
  sku: '',
  description: '',
  categoryId: null,
  unitId: null,
  manufacturerId: null,
  purchasePrice: 0.0,
  salePrice: 0.0,
  file: '',
};

const formData = ref({ ...formModal });
const isEdit = ref(false);
const showDrawer = ref(false);

const imagePreview = ref(null);

const handleImageUpload = (event) => {
  console.log('in handle');

  const file = event.target.files[0];
  if (file) {
    console.log('file found');
    formData.value.file = file;
    console.log(formData.value.file);

    imagePreview.value = URL.createObjectURL(file);
  }
};

async function newProduct() {
  formData.value = { ...formModal };
  isEdit.value = false;
  showDrawer.value = true;
}

async function createProduct() {
  await productStore.createProduct(formData.value);
  showDrawer.value = false;
  formData.value = { ...formModal };
  isEdit.value = false;
}

async function editProduct(item) {
  formData.value = { ...item };
  isEdit.value = true;
  showDrawer.value = true;
}

async function updateProduct() {
  await productStore.updateProduct(formData.value);
  showDrawer.value = false;
  formData.value = { ...formModal };
  isEdit.value = false;
}

async function deleteProduct(id) {
  swal.confirm('Are you sure you want to delete this unit?').then(async (result) => {
    if (result.isConfirmed) {
      await productStore.deleteProduct({ id });
      showDrawer.value = false;
    }
  });
}

onMounted(async () => {
  unitStore.fetchUnits();
  categoryStore.fetchProductCategories();
  productStore.fetchProducts();
  manufacturerStore.fetchManufacturers();
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar color="secondary" density="compact">
        <v-spacer></v-spacer>
        <v-btn @click="newProduct()">Create Product</v-btn>
      </v-toolbar>
      <v-data-table :loading="$loading('fetchProducts')" :headers="headers" :items="products">
        <template v-slot:item.filePath="{ item }">
          <v-img :src="item.filePath" alt="Product Image" max-width="100" max-height="100" contain />

          <!-- <img :src="item.filePath" alt="Product Image" width="100" height="100" /> -->
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon class="me-2" size="small" @click="editProduct(item)"> mdi-pencil </v-icon>
          <v-icon size="small" @click="deleteProduct(item.id)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <main-drawer v-model="showDrawer" width="800" title="CREATE PRODUCT" :toolbar="{ color: 'primary' }">
      <v-form class="pa-5" @submit.prevent="isEdit ? updateProduct() : createProduct()">
        <v-text-field v-model="formData.title" label="Title" variant="outlined"></v-text-field>
        <v-text-field v-model="formData.sku" label="SKU" variant="outlined"></v-text-field>
        <v-select
          :items="manufacturers"
          item-title="title"
          item-value="id"
          v-model="formData.manufacturerId"
          :loading="$loading('fetchManufacturers')"
          label="Manufacturer"
          variant="outlined"
        ></v-select>
        <v-select
          :items="categories"
          item-title="title"
          item-value="id"
          v-model="formData.categoryId"
          :loading="$loading('fetchProductCategories')"
          label="Category"
          variant="outlined"
        ></v-select>
        <v-select
          :items="units"
          item-title="title"
          item-value="id"
          v-model="formData.unitId"
          :loading="$loading('fetchUnits')"
          label="Unit"
          variant="outlined"
        ></v-select>
        <v-textarea v-model="formData.description" label="Description" variant="outlined" rows="2"></v-textarea>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="formData.salePrice"
              type="number"
              label="Sale Price"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="formData.purchasePrice"
              type="number"
              label="Purchase Price"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Image Selection -->
        <input type="file" @change="handleImageUpload" />

        <!-- Display Selected Image -->
        <!-- v-if="imagePreview" -->

        <div>
          <img :src="imagePreview" alt="Selected Image" width="200" />
        </div>
        <div class="d-flex justify-end mt-5">
          <v-btn v-if="isEdit" :loading="$loading('updateProduct')" type="submit" color="primary">Update</v-btn>
          <v-btn v-else :loading="$loading('createProduct')" type="submit" color="primary">Create</v-btn>
        </div>
      </v-form>
    </main-drawer>
  </v-container>
</template>
<!-- <file-upload title="Upload Files" v-model="state.files" multiple></file-upload> -->
