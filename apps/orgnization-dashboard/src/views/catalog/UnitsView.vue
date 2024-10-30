<script setup>
import { onMounted, ref } from 'vue';
import { useUnitStore } from '@/store/unit';
import { useSwal } from '@/composables/useSwal';
import { storeToRefs } from 'pinia';

const unitStore = useUnitStore();
const { units } = storeToRefs(unitStore);

const swal = useSwal();

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

const formData = ref({ ...formModal });
const isEdit = ref(false);
const showDrawer = ref(false);

async function newUnit() {
  formData.value = { ...formModal };
  isEdit.value = false;
  showDrawer.value = true;
}

async function createUnit() {
  await unitStore.createUnit(formData.value);
  showDrawer.value = false;
  formData.value = { ...formModal };
  isEdit.value = false;
}

async function editUnit(item) {
  formData.value = { ...item };
  isEdit.value = true;
  showDrawer.value = true;
}

async function updateUnit() {
  await unitStore.updateUnit(formData.value);
  showDrawer.value = false;
  formData.value = { ...formModal };
  isEdit.value = false;
}

async function deleteUnit(id) {
  swal.confirm('Are you sure you want to delete this unit?').then(async (result) => {
    if (result.isConfirmed) {
      await unitStore.deleteUnit({ id });
      showDrawer.value = false;
    }
  });
}

onMounted(() => {
  // unitStore.fetchUnits();
  unitStore.fetchPaginatedUnits();
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar color="secondary" density="compact">
        <v-spacer></v-spacer>
        <v-btn @click="newUnit()">Create Unit</v-btn>
      </v-toolbar>
      <v-data-table :loading="$loading('fetchPaginatedUnits')" :headers="headers" :items="units">
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
          <v-icon class="me-2" size="small" @click="editUnit(item)"> mdi-pencil </v-icon>
          <v-icon size="small" @click="deleteUnit(item.id)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <main-drawer v-model="showDrawer" width="800" title="CREATE Unit" :toolbar="{ color: 'primary' }">
      <v-form class="pa-5" @submit.prevent="isEdit ? updateUnit() : createUnit()">
        <v-text-field v-model="formData.title" label="Title" variant="outlined"></v-text-field>
        <v-textarea v-model="formData.description" label="Description" variant="outlined"></v-textarea>
        <div class="d-flex justify-end">
          <v-btn v-if="isEdit" :loading="$loading('updateUnit')" type="submit" color="primary">Update</v-btn>
          <v-btn v-else :loading="$loading('createUnit')" type="submit" color="primary">Create</v-btn>
        </div>
      </v-form>
    </main-drawer>
  </v-container>
</template>
