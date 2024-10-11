<script setup>
import { ref, onMounted } from 'vue';

import { useSwal } from '@/composables/useSwal';
import { api } from '@/helpers/http';

const features = ref([
  { title: 'Product', codes: ['pro-edit', 'pro-add'] },
  { title: 'Category', codes: ['cat-read', 'cat-delete'] },
]);

const selectedPermissions = ref([]);
const isChangePasswordPopupVisible = ref(false);

const swal = useSwal();
const showEdit = ref(false);
const users = ref([]);
const userRoles = ref([]);
const userCountries = ref([]);
const userGender = ref([]);
const userStates = ref([]);
const userCity = ref([]);
const selectedRole = ref(null);
const selectedCountryId = ref(null);
const selectedStateId = ref(null);
const selectedCity = ref(null);
const country = '';

const showUserDialog = ref(false);
const selectedUser = ref(null);
const tab = ref(null);
const isEdit = ref(false);
const showDrawer = ref(false);
const isLoading = ref(false);

const headers = ref([
  {
    title: 'Profile Picture',
    key: 'profilePicturePath',
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
  reportToId: null,
};

const formData = ref({ ...formModal });

const profileData = ref({
  id: '',
  username: '',
  email: '',
  roles: null,
  reportToId: null,
  profilePicturePath: '/default_Profile_Img.jpg',
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

async function createUser() {
  try {
    const newUser = { ...formData.value };

    const { data } = await api.post('/Tenant/User/Create', newUser);
    users.value.push(data.data);
    swal.success('User created successfully!');
    showDrawer.value = false;
    fetchUser();
  } catch (error) {
    swal.error('Error creating user!');
    console.error('Error creating user:', error);
  }
}

async function openEditUserDialog(user) {
  //only to populate user update form
  profileData.value.id = user.id;
  profileData.value.email = user.email;
  profileData.value.username = user.username;
  profileData.value.firstName = user.firstName;
  profileData.value.lastName = user.lastName;
  profileData.value.address = user.address;
  profileData.value.bio = user.bio;
  profileData.value.preferences = user.preferences;
  profileData.value.roles = user.roles;
  profileData.value.reportToId = user.reportToId;
  profileData.value.countryId = user.reportToId;
  // profileData.value.stateId = user.stateId;
  // profileData.value.cityId = user.cityId;
  profileData.value.genderId = user.genderId;
  profileData.value.phoneNumber = user.phoneNumber;
  profileData.value.zipCode = user.zipCode;

  showUserDialog.value = true; // Show the UserProfileUpdate dialog
  showEdit.value = true;
}

async function updateUser() {
  try {
    showEdit.value = false;
    const updatedUser = { ...profileData.value };

    console.log(updatedUser);

    const response = await api.put('/Tenant/User/Update', updatedUser); // Update API endpoint
    swal.success('User updated successfully!');
    showDrawer.value = false;
    fetchUser();
  } catch (error) {
    swal.error('Error updating user!');
    console.error('Error updating user:', error);
  }
}

async function deleteUser(UserId) {
  try {
    console.log(UserId);
    const response = await api.delete(`/Tenant/User/Delete/${UserId}`);

    // users.value = users.value.filter((user) => user.id !== UserId);
    fetchUser();
    swal.success('User deleted successfully!');
  } catch (error) {
    swal.error('Error deleting user!');
    console.error('Error deleting user:', error);
  }
}

async function newUser() {
  isEdit.value = false;
  formData.value = { ...formModal };
  showDrawer.value = true;
}

async function fetchUser() {
  try {
    isLoading.value = true;
    const { data } = await api.get('/Tenant/User/GetAllUsers');
    users.value = data?.data || []; // assign fetched data to the users array
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    isLoading.value = false;
  }
}

async function fetchUserRoles() {
  try {
    const response = await api.get('/Tenant/User/AllRoles');
    userRoles.value = response?.data?.data;
  } catch (error) {
    swal.error('Error fetching users Roles:', error);
    console.error('Error fetching users Roles:', error);
  }
}

async function fetchUserCountries() {
  try {
    const DefinitionTypeKeyCode = 'CNT';
    const response = await api.get(
      `/Tenant/TenantDefinitions/GetDefinitionByDefinitionTypeKeyCode/${DefinitionTypeKeyCode}`,
    );
    userCountries.value = response?.data?.data;
  } catch (error) {
    swal.error('Error fetching users Countries:', error);
    console.error('Error fetching users Countries:', error);
  }
}

async function fetchUserStates(Id) {
  try {
    const response = await api.get(`/Tenant/TenantDefinitions/GetDefinitionByParentDefinitionId/${Id}`);

    userStates.value = response?.data?.data;
  } catch (error) {
    swal.error('Error fetching users States:', error);
    console.error('Error fetching users States:', error);
  }
}

async function fetchUserCity(Id) {
  try {
    const response = await api.get(`/Tenant/TenantDefinitions/GetDefinitionByParentDefinitionId/${Id}`);

    userCity.value = response?.data?.data;
  } catch (error) {
    swal.error('Error fetching users City:', error);
    console.error('Error fetching users City:', error);
  }
}
async function fetchUserGender() {
  try {
    const DefinitionTypeKeyCode = 'GENDER';

    const response = await api.get(
      `/Tenant/TenantDefinitions/GetDefinitionByDefinitionTypeKeyCode/${DefinitionTypeKeyCode}`,
    );

    userGender.value = response?.data?.data;
  } catch (error) {
    swal.error('Error fetching users Gender:', error);
    console.error('Error fetching users Gender:', error);
  }
}
const handleSelectStateClick = (id) => {
  if (id) {
    fetchUserStates(id);
    profileData.value.cityId = null;
  } else {
    swal.error('Plz select Country first');
  }
};
const handleSelectCityClick = (id) => {
  if (id) {
    fetchUserCity(id);
  } else {
    swal.error('Plz select state first');
  }
};

onMounted(async () => {
  fetchUser();
  fetchUserRoles();
  fetchUserCountries();
  fetchUserGender();
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
        <!-- <v-data-table :items="items"></v-data-table> -->
        <v-data-table :loading="$loading('fetchUser')" :headers="headers" :items="users">
          <template v-slot:item.profilePicturePath="{ item }">
            <v-img
              :src="item.profilePicturePath || '/default_Profile_Img.jpg'"
              alt="Profile"
              max-width="100"
              max-height="60"
              class="me-2"
            />
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon class="me-2" size="small" @click="openEditUserDialog(item)"> mdi-pencil </v-icon>
            <v-icon size="small" @click="deleteUser(item.id)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-table>
    </v-card>

    <main-drawer v-model="showDrawer" width="800" title="CREATE USER" :toolbar="{ color: 'primary' }">
      <v-form class="pa-5" @submit.prevent="createUser()">
        <v-text-field v-model="formData.username" label="Name" variant="outlined"></v-text-field>
        <v-text-field v-model="formData.email" label="Email" variant="outlined"></v-text-field>
        <v-text-field v-model="formData.password" label="Password" variant="outlined" type="password"></v-text-field>
        <v-text-field label="Confirm Password" variant="outlined" type="password"></v-text-field>

        <v-select
          v-model="formData.roleId"
          :items="userRoles"
          item-title="roleName"
          item-value="roleId"
          label="Select Role"
          placeholder="Select a role"
        />

        <v-select
          v-model="formData.reportToId"
          :items="userCountries"
          item-title="title"
          item-value="id"
          label="Select Country"
          placeholder="Select a Country"
        />

        <div class="d-flex justify-end">
          <v-btn type="submit" color="primary">Create</v-btn>
        </div>
      </v-form>
    </main-drawer>

    <main-drawer v-model="showEdit" width="1025" title="Update USER" :toolbar="{ color: 'primary' }">
      <v-card>
        <div class="d-flex flex-row">
          <v-tabs v-model="tab" color="primary" direction="vertical">
            <v-tab prepend-icon="mdi-account" text="Basic Info" value="option-1"></v-tab>
            <v-tab prepend-icon="mdi-lock" text="Permissions" value="option-2"></v-tab>
          </v-tabs>

          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="option-1">
              <v-card flat>
                <!-- <v-card-title>User Profile</v-card-title> -->
                <v-card-text>
                  <v-form>
                    <!-- Basic Info Section -->
                    <v-card class="mb-2">
                      <v-card-text>
                        <v-row>
                          <v-col justify="center" align-self="center" cols="12" md="2">
                            <v-avatar size="100">
                              <v-img :src="profileData.profilePicturePath" />
                            </v-avatar>
                          </v-col>
                          <v-col cols="12" md="10">
                            <div class="d-flex flex-column">
                              <div class="d-flex flex-column">
                                <h2>{{ profileData.username || 'Username' }}</h2>
                                <h3 class="mr-2">Email: {{ profileData.email }}</h3>
                                <h3 class="mr-2">ID: {{ profileData.id }}</h3>
                              </div>

                              <div class="d-inline-block mt-2">
                                <v-btn color="primary" small style="min-width: auto; padding: 4px 8px">
                                  <v-icon left size="18">mdi-lock</v-icon>
                                  Change Password
                                </v-btn>
                              </div>
                            </div>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field v-model="profileData.firstName" label="First Name" />
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field v-model="profileData.lastName" label="Last Name" />
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-select
                              v-model="profileData.genderId"
                              :items="userGender"
                              item-title="title"
                              item-value="id"
                              label="Select Gender"
                              placeholder="Select Gender"
                            />
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field v-model="profileData.roles" label="Role" readonly />
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field v-model="profileData.bio" label="Bio" />
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field v-model="profileData.preferences" label="Preferences" />
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
                            <v-text-field v-model="profileData.phoneNumber" label="Phone" />
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field v-model="profileData.email" label="Email" />
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
                            <v-text-field v-model="profileData.address" label="Address" />
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-select
                              v-model="profileData.reportToId"
                              :items="userCountries"
                              item-title="title"
                              item-value="id"
                              label="Select Country"
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
                              @click="handleSelectStateClick(profileData.reportToId)"
                            />
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-select
                              v-model="profileData.cityId"
                              :items="userCity"
                              item-title="title"
                              item-value="id"
                              label="City"
                              placeholder="Select a City"
                              @click="handleSelectCityClick(profileData.stateId)"
                            />
                          </v-col>

                          <v-col cols="12" md="6">
                            <v-text-field v-model="profileData.zipCode" label="Zip Code" type="number" />
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>

                    <v-btn @click="updateUser" color="primary">Update</v-btn>
                    <v-btn @click="showEdit = false" color="primary" class="ml-4">Cancel</v-btn>
                  </v-form>

                  <v-dialog v-model="isChangePasswordPopupVisible" max-width="500px">
                    <v-card>
                      <v-card-title>Change Password</v-card-title>
                      <v-card-actions>
                        <v-btn text @click="closeChangePassword">Cancel</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-card-text>
              </v-card>
            </v-tabs-window-item>

            <v-tabs-window-item value="option-2">
              <v-card flat>
                <v-card-text>
                  <div id="app">
                    <!-- Accordion for features and permissions -->
                    <v-expansion-panels multiple>
                      <v-expansion-panel v-for="(feature, index) in features" :key="index">
                        <v-expansion-panel-title>
                          {{ feature.title }}
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <div v-for="code in feature.codes" :key="code">
                            <v-checkbox :label="code" :value="code" v-model="selectedPermissions" />
                          </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>

                    <!-- Display selected permissions -->
                    <div class="mt-3">
                      <h4>Selected Permissions:</h4>
                      <p>{{ selectedPermissions }}</p>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-tabs-window-item>
          </v-tabs-window>
        </div>
      </v-card>
    </main-drawer>
  </v-container>
</template>
<style scoped>
.mt-3 {
  margin-top: 1rem;
}
</style>
