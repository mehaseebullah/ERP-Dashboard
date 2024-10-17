<script setup>
import { ref, onMounted, computed, watch, reactive, inject } from 'vue';
import rules from '@/helpers/rules';
import { useSwal } from '@/composables/useSwal';
import { api } from '@/helpers/http';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const { users } = storeToRefs(userStore);
const { userRoles } = storeToRefs(userStore);
const { pRoleUsers } = storeToRefs(userStore);
const { userPermissions } = storeToRefs(userStore);
const { userCountries } = storeToRefs(userStore);
const { userGenders } = storeToRefs(userStore);
const { userStates } = storeToRefs(userStore);
const { userCities } = storeToRefs(userStore);

const swal = useSwal();
const selectedCodes = ref([]);
const showUserDialog = ref(false);
const tab = ref(null);
const showEdit = ref(false);
const isEdit = ref(false);
const showDrawer = ref(false);
const isLoading = ref(false);

const state = reactive({
  showPass: false,
  showCPass: false,
});

const form = ref();
const updateForm = ref();
const confirmPassword = (val) => {
  return (!!formData.value.password && val === formData.value.password) || 'Password not matched';
};

// Group permissions by feature
const groupedFeatures = computed(() => {
  const groups = userPermissions.value.reduce((acc, perm) => {
    const featureGroup = acc.find((group) => group[0].feature === perm.feature);
    if (featureGroup) {
      featureGroup.push(perm);
    } else {
      acc.push([perm]);
    }
    return acc;
  }, []);
  return groups;
});

const headers = ref([
  {
    title: 'Profile Picture',
    key: 'fileBase64',
  },
  {
    title: 'Username',
    key: 'username',
    sortable: true,
  },
  {
    title: 'Email',
    key: 'email',
    sortable: true,
  },

  {
    title: 'Role',
    key: 'roles',
    sortable: true,
  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
]);

const formModal = {
  username: '',
  password: '',
  email: '',
  roleId: null,
  reportToId: 0,
};

const formData = ref({ ...formModal });

const profileData = ref({
  id: '',
  username: '',
  email: '',
  roleId: null,
  roles: null,
  reportToId: 0,
  profilePicturePath: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  address: '',
  cityId: null,
  stateId: null,
  zipCode: '',
  countryId: null,
  genderId: null,
  bio: '',
  preferences: '',
});

const imgUploadData = ref({
  Id: null,
  ProfilePicturePath: null,
  File: '',
});

const selectedImage = ref(null); // Temporary variable to store selected image
const fileInput = ref(null);
const triggerFileInput = () => {
  fileInput.value.click();
};

// Function to handle the image upload and display selected image temporarily
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedImage.value = URL.createObjectURL(file);
    imgUploadData.value.File = file;
  }
};

const cancelEdit = () => {
  selectedImage.value = null; // Reset selected image
  showEdit.value = false; // Hide edit mode
};

// Watch for changes in the drawer's visibility (v-model="showEdit")
watch(showEdit, (newValue) => {
  if (!newValue) {
    cancelEdit(); // Call cancelEdit when drawer is closed (cross icon clicked)
  }
});

async function createUser() {
  const { valid } = await form.value.validate();
  if (valid) {
    try {
      await userStore.createUser(formData.value);
      swal.success('User created successfully!');
      showDrawer.value = false;
      formData.value = { ...formModal };
    } catch (error) {
      swal.error('Error creating user!');
    }
  } else {
    swal.error('Please fill all fields');
  }
}

async function fetchUsers() {
  try {
    isLoading.value = true;
    await userStore.fetchUsers();
    if (users.value.length > 0) {
      if (users.value.stateId) fetchStateByCountryId();
      if (users.value.cityId) fetchCitiesByStateId();
    }
  } catch (error) {
    swal.error('Error fetching users:', error);
  } finally {
    isLoading.value = false;
  }
}

async function openEditUserDialog(user) {
  console.log('user id', user.id);
  console.log('user roleid', user.roleId);
  console.log('user reporttoid', user.reportToId);

  profileData.value = { ...user }; //to populate user data
  showUserDialog.value = true; // Show the UserProfileUpdate dialog
  showEdit.value = true;
}

async function updateUser() {
  const { valid } = await updateForm.value.validate();
  if (valid) {
    try {
      showEdit.value = false;
      const updatedUser = { ...profileData.value };
      if (imgUploadData.value.File) {
        imgUploadData.value.Id = updatedUser.id;
        imgUploadData.value.ProfilePicturePath = updatedUser.profilePicturePath;
        await userStore.uploadUserImg(imgUploadData.value);
      }
      await userStore.updateUser(updatedUser);
      swal.success('User updated successfully!');
      showDrawer.value = false;
    } catch (error) {
      swal.error('Error updating user!');
    }
  } else {
    swal.error('Please fill all fields');
  }
}

async function deleteUser(UserId) {
  swal.confirm('Are you sure you want to delete this user?').then(async (result) => {
    if (result.isConfirmed) {
      try {
        await userStore.deleteUser({ UserId });
        swal.success('User deleted successfully!');
      } catch (error) {
        swal.error('Error deleting user!');
      }
    }
  });
}

async function newUser() {
  isEdit.value = false;
  fetchUserRoles();
  formData.value = { ...formModal };
  showDrawer.value = true;
}

async function fetchUserRoles() {
  try {
    await userStore.fetchUserRoles();
  } catch (error) {
    swal.error('Error fetching users Roles:', error);
  }
}

async function fetchUserCountries() {
  try {
    await userStore.fetchUserCountries();
  } catch (error) {
    swal.error('Error fetching users Countries:', error);
  }
}

async function fetchUserStates(Id) {
  try {
    await userStore.fetchUserStates(Id);
  } catch (error) {
    swal.error('Error fetching users States:', error);
  }
}

async function fetchUserCities(Id) {
  try {
    await userStore.fetchUserCities(Id);
  } catch (error) {
    swal.error('Error fetching user Cities:', error);
  }
}
async function fetchUserGenders() {
  try {
    await userStore.fetchUserGenders();
  } catch (error) {
    swal.error('Error fetching user Genders:', error);
  }
}
const fetchStateByCountryId = (id) => {
  if (id) {
    fetchUserStates(id);
    profileData.value.cityId = null;
  } else {
    swal.error('Select Country first');
  }
};
const fetchCitiesByStateId = (id) => {
  if (id) {
    fetchUserCities(id);
  } else {
    swal.error('Plz select state first');
  }
};

async function fetchPermissions(UserId) {
  try {
    await userStore.fetchPermissions(UserId);
    // Pre-select checkboxes where isPermission === 1
    userPermissions.value.forEach((feature) => {
      if (feature.isPermission === 1 && !selectedCodes.value.includes(feature.code)) {
        selectedCodes.value.push(feature.code); // Add the feature code to selectedCodes
      }
    });
  } catch (error) {
    swal.error('Error fetching permissions:', error);
  }
}
async function GetUserByParentRoleId(roleId) {
  let pRoleId = userRoles.value.find((x) => x.roleId == roleId).pRoleId;
  try {
    await userStore.GetUserByParentRoleId(pRoleId);
  } catch (error) {
    swal.error('Error fetching users Roles:', error);
  }
}
onMounted(async () => {
  await fetchUsers();
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar color="secondary" density="compact">
        <v-spacer></v-spacer>
        <v-btn @click="newUser">Create User</v-btn>
      </v-toolbar>
      <v-table>
        <v-data-table :loading="$loading('fetchUsers')" :headers="headers" :items="users">
          <template v-slot:item.fileBase64="{ item }">
            <v-avatar size="60">
              <v-img :src="item.fileBase64 || '/default_Profile_Img.jpg'" />
            </v-avatar>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon
              class="me-2"
              size="small"
              @click="
                openEditUserDialog(item);
                fetchUserCountries();
                fetchUserGenders();
              "
            >
              mdi-pencil
            </v-icon>
            <v-icon size="small" @click="deleteUser(item.id)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-table>
    </v-card>

    <main-drawer v-model="showDrawer" width="800" title="CREATE USER" :toolbar="{ color: 'primary' }">
      <v-card>
        <!-- <v-toolbar flat dense>
          <v-toolbar-title>CREATE USER</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="showDrawer = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar> -->

        <v-card-text>
          <v-form ref="form" class="pa-5" @submit.prevent="createUser()">
            <v-text-field
              prepend-inner-icon="mdi-account"
              v-model="formData.username"
              label="Username"
              variant="outlined"
              :rules="[rules.required, rules.minLength(4)]"
            ></v-text-field>
            <v-text-field
              prepend-inner-icon="mdi-account"
              v-model="formData.email"
              label="Email"
              variant="outlined"
              :rules="[rules.email]"
            ></v-text-field>
            <v-text-field
              prepend-inner-icon="mdi-key"
              v-model="formData.password"
              label="Password"
              variant="outlined"
              :append-inner-icon="state.showPass ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="() => (state.showPass = !state.showPass)"
              :type="state.showPass ? 'text' : 'password'"
              :rules="[rules.required, rules.minLength(6)]"
            ></v-text-field>
            <v-text-field
              prepend-inner-icon="mdi-key"
              label="Confirm Password"
              variant="outlined"
              :append-inner-icon="state.showCPass ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="() => (state.showCPass = !state.showCPass)"
              :type="state.showCPass ? 'text' : 'password'"
              :rules="[rules.required, confirmPassword]"
            ></v-text-field>

            <v-select
              v-model="formData.roleId"
              :items="userRoles"
              item-title="roleName"
              item-value="roleId"
              label="Select Role"
              placeholder="Select a role"
              @update:model-value="GetUserByParentRoleId"
              :rules="[rules.required]"
            />

            <v-select
              v-model="formData.reportToId"
              :items="pRoleUsers"
              item-title="text"
              item-value="id"
              label="Report To"
              placeholder="Please select a user"
              :rules="[rules.required]"
            />

            <div class="d-flex justify-end">
              <v-btn type="submit" color="primary">Create</v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </main-drawer>

    <!-- <v-dialog v-model="showEdit" width="100vw" title="Update USER" :toolbar="{ color: 'primary' }"> -->
    <main-drawer v-model="showEdit" :style="showEdit ? { width: 'calc(100% - 256px)' } : {}" title="Update USER" :toolbar="{ color: 'primary' }">
      <v-card>
        <div class="d-flex flex-row full-width" >
          <v-tabs v-model="tab" color="primary" direction="vertical">
            <v-tab prepend-icon="mdi-account" text="Basic Info" value="option-1"></v-tab>
            <v-tab
              @click="fetchPermissions(profileData.id)"
              prepend-icon="mdi-lock"
              text="Permissions"
              value="option-2"
            ></v-tab>
          </v-tabs>

          <v-tabs-window v-model="tab"  :style="showEdit ? { width: '100%' } : {}" >
            <v-tabs-window-item value="option-1">
              <v-card flat>
                <!-- <v-card-title>User Profile</v-card-title> -->
                <v-card-text>
                  <v-form ref="updateForm">
                    <!-- Basic Info Section -->
                    <v-card class="mb-2">
                      <v-card-text>
                        <v-row class="align-items-center">
                          <v-col cols="12" md="2" class="d-flex flex-column align-items-center position-relative">
                            <v-avatar size="100">
                              <v-img :src="selectedImage || profileData.fileBase64 || '/default_Profile_Img.jpg'" />
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
                              @change="handleImageUpload"
                            />
                          </v-col>

                          <v-col cols="12" md="10">
                            <div class="d-flex flex-column justify-center align-start">
                              <h2 class="mb-3">{{ profileData.username || 'Username' }}</h2>
                              <h3 class="mb-3">Email: {{ profileData.email }}</h3>
                              <h3>ID: {{ profileData.id }}</h3>
                            </div>
                          </v-col>

                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="profileData.firstName"
                              label="First Name"
                              :rules="[rules.required, rules.minLength(2)]"
                            />
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="profileData.lastName"
                              label="Last Name"
                              :rules="[rules.required, rules.minLength(2)]"
                            />
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-select
                              v-model="profileData.genderId"
                              :items="userGenders"
                              item-title="title"
                              item-value="id"
                              label="Select Gender"
                              placeholder="Select Gender"
                              :rules="[rules.required]"
                            />
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field v-model="profileData.roles" label="Role" readonly />
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field v-model="profileData.bio" label="Bio" :rules="[rules.required]" />
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="profileData.preferences"
                              label="Preferences"
                              :rules="[rules.required]"
                            />
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>

                    <!-- Contacts Section -->
                    <v-card class="mb-6">
                      <v-card-title>Contacts</v-card-title>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-text-field v-model="profileData.phoneNumber" label="Phone" :rules="[rules.required]" />
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field v-model="profileData.email" label="Email" readonly />
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>

                    <!-- Address Section -->
                    <v-card class="mb-6">
                      <v-card-title>Address</v-card-title>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-text-field v-model="profileData.address" label="Address" :rules="[rules.required]" />
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-select
                              v-model="profileData.countryId"
                              :items="userCountries"
                              item-title="title"
                              item-value="id"
                              label="Select Country"
                              @update:model-value="fetchStateByCountryId"
                              placeholder="Select a Country"
                            />
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-select
                              v-model="profileData.stateId"
                              :items="userStates"
                              item-title="title"
                              item-value="id"
                              label="State/province/area"
                              placeholder="Select a State/province/area"
                              @update:model-value="fetchCitiesByStateId"
                            />
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-select
                              v-model="profileData.cityId"
                              :items="userCities"
                              item-title="title"
                              item-value="id"
                              label="City"
                              placeholder="Select a City"
                            />
                          </v-col>

                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="profileData.zipCode"
                              label="Zip Code"
                              type="number"
                              :rules="[rules.required]"
                            />
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>

                    <v-btn @click="updateUser" color="primary">Update</v-btn>
                    <v-btn @click="cancelEdit" color="primary" class="ml-4">Cancel</v-btn>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tabs-window-item>

            <v-tabs-window-item value="option-2">
              <v-card flat>
                <v-card-text>
                  <v-row>
                    <!-- Grid for features -->
                    <v-col v-for="(featureGroup, index) in groupedFeatures" :key="index" cols="12" md="6">
                      <v-expansion-panels multiple>
                        <v-expansion-panel>
                          <v-expansion-panel-title>
                            {{ featureGroup[0].feature }}
                          </v-expansion-panel-title>
                          <v-expansion-panel-text>
                            <v-row>
                              <v-col v-for="feature in featureGroup" :key="feature.code" cols="6">
                                <v-checkbox
                                  :label="feature.permissionType"
                                  :value="feature.code"
                                  v-model="selectedCodes"
                                />
                              </v-col>
                            </v-row>
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-col>
                  </v-row>

                  <!-- Display selected codes -->
                  <v-divider></v-divider>
                  <v-card>
                    <v-card-title>Selected Permission Codes</v-card-title>
                    <v-card-text>
                      <div v-if="selectedCodes.length === 0">No permissions selected</div>
                      <ul>
                        <li v-for="code in selectedCodes" :key="code">{{ code }}</li>
                      </ul>
                    </v-card-text>
                  </v-card>
                </v-card-text>
              </v-card>
            </v-tabs-window-item>
          </v-tabs-window>
        </div>
      </v-card>
    </main-drawer>
    <!-- </v-dialog> -->
  </v-container>
</template>
<style scoped>
.mt-3 {
  margin-top: 1rem;
}
</style>
