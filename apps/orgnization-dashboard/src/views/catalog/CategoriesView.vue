<script setup>
import { computed, onMounted, ref } from 'vue';
import { useProductCategoryStore } from '@/store/product_category';
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

const categoryStore = useProductCategoryStore();
const { categories } = storeToRefs(categoryStore);

const swal = useSwal();
const drawerTitle = computed(() => (isEdit.value ? 'UPDATE CATEGORY' : 'CREATE CATEGORY'));

const headers = [
  {
    title: 'Title',
    key: 'title',
    sortable: true,
  },
  {
    title: 'Description',
    key: 'description',
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
const formModal = {
  title: '',
  description: '',
};

const form = ref();
const formData = ref({ ...formModal });
const isEdit = ref(false);
const showDrawer = ref(false);

async function newProductCategory() {
  form.value.resetValidation();
  formData.value = { ...formModal };
  isEdit.value = false;
  showDrawer.value = true;
}

async function createProductCategory() {
  const { valid } = await form.value.validate();
  if (valid) {
    await categoryStore.createProductCategory(formData.value);
    showDrawer.value = false;
    formData.value = { ...formModal };
    isEdit.value = false;
  } else {
    swal.error('Please fill all fields');
  }
}

async function editProductCategory(item) {
  formData.value = { ...item };
  isEdit.value = true;
  showDrawer.value = true;
}

async function updateProductCategory() {
  await categoryStore.updateProductCategory(formData.value);
  showDrawer.value = false;
  formData.value = { ...formModal };
  isEdit.value = false;
}

async function deleteProductCategory(id) {
  swal.confirm('Are you sure you want to delete this ProductCategory?').then(async (result) => {
    if (result.isConfirmed) {
      await categoryStore.deleteProductCategory({ id });
      showDrawer.value = false;
    }
  });
}

onMounted(() => {
  if (canRead.value) categoryStore.fetchPaginatedProductCategories();
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar color="secondary" density="compact">
        <v-spacer></v-spacer>
        <v-btn v-if="canCreate" @click="newProductCategory()">Create Category</v-btn>
      </v-toolbar>
      <v-data-table
        v-if="canRead"
        :loading="$loading('fetchPaginatedProductCategories')"
        :headers="headers"
        :items="categories"
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
        <template v-slot:item.actions="{ item }">
          <v-icon v-if="canUpdate" class="me-2" size="small" @click="editProductCategory(item)"> mdi-pencil </v-icon>
          <v-icon v-if="canDelete" size="small" @click="deleteProductCategory(item.id)"> mdi-delete </v-icon>
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
    <main-drawer v-model="showDrawer" width="800" :title="drawerTitle" :toolbar="{ color: 'primary' }">
      <v-form ref="form" class="pa-5" @submit.prevent="isEdit ? updateProductCategory() : createProductCategory()">
        <v-text-field
          v-model="formData.title"
          label="Title"
          variant="outlined"
          :rules="[rules.required]"
        ></v-text-field>
        <v-textarea
          v-model="formData.description"
          label="Description"
          variant="outlined"
          :rules="[rules.required]"
        ></v-textarea>
        <div class="d-flex justify-end">
          <v-btn v-if="isEdit" :loading="$loading('updateProductCategory')" type="submit" color="primary">Update</v-btn>
          <v-btn v-else :loading="$loading('createProductCategory')" type="submit" color="primary">Create</v-btn>
        </div>
      </v-form>
    </main-drawer>
  </v-container>
</template>
