<script setup>
import { ref, onMounted, watch } from 'vue';
import rules from '@/helpers/rules';
import { useSwal } from '@/composables/useSwal';
import { storeToRefs } from 'pinia';
import { useOrganizationStore } from '@/store/organization';

const organizationStore = useOrganizationStore();
const { organizations } = storeToRefs(organizationStore);

const swal = useSwal();
const selectedCodes = ref([]);
const showOrganizationDialog = ref(false);

const tab = ref(null);
const showEdit = ref(false);
const isEdit = ref(false);
const showDrawer = ref(false);
const isLoading = ref(false);

const loader = ref(false);
const form = ref();
const updateForm = ref();

const headers = ref([
  {
    title: '',
    key: 'fileBase64',
  },

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
    title: 'Created At',
    key: 'createdAt',
    sortable: true,
  },
  {
    title: 'Updated At',
    key: 'updatedAt',
    sortable: true,
  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
]);

const formModal = {
  title: '',
  description: '',
  File: null,
};

const formData = ref({ ...formModal });

const profileData = ref({
  id: '',
  title: '',
  description: '',
  isActive: null,
  isDeleted: null,
  filePath: null,
  File: null,
});

const selectedImage = ref(null); // Temporary variable to store selected image
const fileInput = ref(null);
const triggerFileInput = () => {
  fileInput.value.click();
};

// Function to handle the image upload in create drawer and display selected image temporarily
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedImage.value = URL.createObjectURL(file);
    formData.value.File = file;
  }
};

// Function to handle the image upload in update drawer and display selected image temporarily
const handleUpdateImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedImage.value = URL.createObjectURL(file);
    profileData.value.File = file;
  }
};

const cancelEdit = () => {
  selectedCodes.value = [];
  selectedImage.value = null; // Reset selected image
  tab.value = 'option-1';
  formData.value = { ...formModal };
  showEdit.value = false; // Hide edit mode
};

// Watch for changes in the drawer's visibility (v-model="showEdit")
watch(showEdit, (newValue) => {
  if (!newValue) {
    cancelEdit(); // Call cancelEdit when drawer is closed (cross icon clicked)
  }
});

async function fetchOrganizations() {
  try {
    isLoading.value = true;
    await organizationStore.fetchOrganizations();
  } catch (error) {
    swal.error('Error fetching organizations:', error);
  } finally {
    isLoading.value = false;
  }
}

async function createOrganization() {
  const { valid } = await form.value.validate();
  if (valid) {
    try {
      loader.value = true;
      await organizationStore.createOrganization(formData.value);
      loader.value = false;
      showDrawer.value = false;
      formData.value = { ...formModal };
      selectedImage.value = null;
      swal.success('Organization created successfully!');
    } catch (error) {
      swal.error(error);
      loader.value = false;
    }
  } else {
    swal.error('Please fill all fields');
  }
}

async function updateOrganization() {
  const { valid } = await updateForm.value.validate();
  if (valid) {
    try {
      loader.value = true;
      const updatedOrganization = { ...profileData.value };
      await organizationStore.updateOrganization(updatedOrganization);
      loader.value = false;
      showEdit.value = false;
      swal.success('Organization updated successfully!');
      showDrawer.value = false;
      selectedImage.value = null;
    } catch (error) {
      swal.error(error);
      loader.value = false;
    }
  } else {
    swal.error('Please fill all fields');
  }
}

async function deleteOrganization(OrganizationId) {
  swal.confirm('Are you sure you want to delete this organization?').then(async (result) => {
    if (result.isConfirmed) {
      await organizationStore.deleteOrganization(OrganizationId);
    }
  });
}

async function newUser() {
  isEdit.value = false;
  formData.value = { ...formModal };
  showDrawer.value = true;
}

async function openEditOrganizationDialog(user) {
  profileData.value = { ...user }; //to populate organization data
  showOrganizationDialog.value = true; // Show the OrganizationUpdate dialog
  showEdit.value = true;
}

onMounted(async () => {
  await fetchOrganizations();
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar color="secondary" density="compact">
        <v-spacer></v-spacer>
        <v-btn @click="newUser">Create Organization</v-btn>
      </v-toolbar>
      <v-table>
        <v-data-table :loading="$loading('fetchOrganizations')" :headers="headers" :items="organizations">
          <template v-slot:item.fileBase64="{ item }">
            <v-avatar size="60">
              <v-img :src="item.fileBase64 || '/default_organization_logo.jpg'" />
            </v-avatar>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon class="me-2" size="small" @click="openEditOrganizationDialog(item)"> mdi-pencil </v-icon>
            <v-icon size="small" @click="deleteOrganization(item.id)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-table>
    </v-card>

    <main-drawer v-model="showDrawer" width="800" title="CREATE ORGANIZATION" :toolbar="{ color: 'primary' }">
      <v-card>
        <v-card-text>
          <v-form ref="form" class="pa-5" @submit.prevent="createOrganization()">
            <v-text-field
              prepend-inner-icon="mdi-briefcase"
              v-model="formData.title"
              label="Title"
              variant="outlined"
              :rules="[rules.required, rules.minLength(4)]"
            ></v-text-field>
            <v-textarea
              label="Description"
              v-model="formData.description"
              placeholder="Enter a brief description of the organization"
              rows="4"
              outlined
              :rules="[rules.required, rules.maxLength(1000)]"
            ></v-textarea>
            <v-avatar size="100">
              <v-img :src="selectedImage || '/default_organization_logo.jpg'" />
              <v-icon
                @click="triggerFileInput"
                class="position-absolute"
                style="top: 0; right: 0; bottom: 0; margin: auto; color: white; background: white; border-radius: 50%"
                color="black"
                small
              >
                mdi-pencil
              </v-icon>
            </v-avatar>

            <!-- Hidden file input -->
            <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="handleImageUpload" />

            <div class="d-flex justify-end">
              <v-btn type="submit" color="primary">
                <template v-if="loader">
                  <!-- Loader component -->
                  <v-progress-circular indeterminate color="white"></v-progress-circular>
                </template>
                <template v-else> Create</template></v-btn
              >
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </main-drawer>

    <main-drawer
      v-model="showEdit"
      :style="showEdit ? { width: 'calc(100% - 256px)' } : {}"
      title="Update ORGANIZATION"
      :toolbar="{ color: 'primary' }"
    >
      <v-card>
        <div class="d-flex flex-row full-width">
          <v-tabs v-model="tab" color="primary" direction="vertical">
            <v-tab prepend-icon="mdi-account" text="Organization Info" value="option-1"></v-tab>
          </v-tabs>

          <v-tabs-window v-model="tab" :style="showEdit ? { width: '100%' } : {}">
            <v-tabs-window-item value="option-1">
              <v-card flat>
                <v-card-text>
                  <v-form ref="updateForm">
                    <!-- Organization Info Section -->
                    <v-card class="mb-2">
                      <v-card-text>
                        <v-row class="align-items-center">
                          <v-col cols="12" md="2" class="d-flex flex-column align-items-center position-relative">
                            <v-avatar size="100">
                              <v-img
                                :src="selectedImage || profileData.fileBase64 || '/default_organization_logo.jpg'"
                              />
                              <v-icon
                                @click="triggerFileInput"
                                class="position-absolute"
                                style="
                                  top: 0;
                                  right: 0;
                                  bottom: 0;
                                  margin: auto;
                                  color: white;
                                  background: white;
                                  border-radius: 50%;
                                "
                                color="black"
                                small
                              >
                                mdi-pencil
                              </v-icon>
                            </v-avatar>

                            <!-- Hidden file input -->
                            <input
                              ref="fileInput"
                              type="file"
                              accept="image/*"
                              style="display: none"
                              @change="handleUpdateImageUpload"
                            />
                          </v-col>

                          <v-col cols="12" md="10">
                            <div class="d-flex flex-column justify-center align-start">
                              <h2 class="mt-10">{{ profileData.title || 'Title' }}</h2>
                            </div>
                          </v-col>

                          <v-col cols="12" md="12">
                            <v-text-field
                              v-model="profileData.title"
                              label="Title"
                              :rules="[rules.required, rules.minLength(4)]"
                            />
                          </v-col>
                          <v-col cols="12" md="12">
                            <v-textarea
                              label="Description"
                              v-model="profileData.description"
                              placeholder="Enter a brief description of the organization"
                              rows="4"
                              outlined
                              :rules="[rules.required, rules.maxLength(1000)]"
                            ></v-textarea>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-checkbox v-model="profileData.isActive" label="Is Active"></v-checkbox>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>

                    <v-btn @click="updateOrganization" color="primary"
                      ><template v-if="loader">
                        <!-- Loader component -->
                        <v-progress-circular indeterminate color="white"></v-progress-circular>
                      </template>
                      <template v-else> Update </template></v-btn
                    >
                    <v-btn @click="cancelEdit" color="primary" class="ml-4">Cancel</v-btn>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tabs-window-item>
          </v-tabs-window>
        </div>
      </v-card>
    </main-drawer>
  </v-container>
</template>
<style scoped></style>
