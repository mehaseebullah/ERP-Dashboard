<script setup>
import { ref, onMounted, computed, watch, reactive, inject } from 'vue';
import rules from '@/helpers/rules';
import { useSwal } from '@/composables/useSwal';
import { storeToRefs } from 'pinia';
import { useRoleStore } from '@/store/role';

const roleStore = useRoleStore();

const { users } = storeToRefs(roleStore);

const { userRolePermissions } = storeToRefs(roleStore);

const swal = useSwal();
const selectedCodes = ref([]);
const showUserDialog = ref(false);
const tab = ref(null);
const showEdit = ref(false);
const showRoles = ref(false);
const isEdit = ref(false);
const showDrawer = ref(false);
const isLoading = ref(false);

// Group permissions by feature

const groupedFeatures = computed(() => {
  const groups = userRolePermissions.value.reduce((acc, perm) => {
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
    title: 'Permissions',
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
  roleId: null,
  roles: null,
  reportToId: null,
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

const cancelEdit = () => {
  showRoles.value = false; // Hide edit mode
};

// Watch for changes in the drawer's visibility (v-model="showEdit")
watch(showRoles, (newValue) => {
  if (!newValue) {
    cancelEdit(); // Call cancelEdit when drawer is closed (cross icon clicked)
  }
});

async function openEditUserDialog(user) {
  // console.log('user id', user.id);
  // console.log('user roleid', user.roleId);
  // console.log('user reporttoid', user.reportToId);

  profileData.value = { ...user }; //to populate user data
  // showUserDialog.value = true; // Show the UserProfileUpdate dialog
  showRoles.value = true;
}

async function fetchUsers() {
  try {
    isLoading.value = true;
    await roleStore.fetchUsers();
  } catch (error) {
    swal.error('Error fetching users:', error);
  } finally {
    isLoading.value = false;
  }
}

async function fetchRolePermissions(RoleId) {
  try {
    await roleStore.fetchRolePermissions(RoleId);
    userRolePermissions.value.forEach((feature) => {
      if (feature.isPermission === 1 && !selectedCodes.value.includes(feature.code)) {
        selectedCodes.value.push(feature.code); // Add the feature code to selectedCodes
      }
    });
  } catch (error) {
    swal.error('Error fetching permissions:', error);
  }
}

onMounted(async () => {
  await fetchUsers();
});
</script>
<template>
  <v-container>
    <v-card>
      <v-table>
        <v-data-table :loading="$loading('fetchUsers')" :headers="headers" :items="users">
          <template v-slot:item.fileBase64="{ item }">
            <v-avatar size="60">
              <v-img :src="item.fileBase64 || '/default_Profile_Img.jpg'" />
            </v-avatar>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon class="me-2" size="small" @click="openEditUserDialog(item)"> mdi-pencil </v-icon>
            <!-- <v-icon size="small" @click="deleteUser(item.id)"> mdi-delete </v-icon> -->
          </template>
        </v-data-table>
      </v-table>
    </v-card>

    <main-drawer v-model="showRoles" width="1025" title="Update Permissions" :toolbar="{ color: 'primary' }">
      <v-card>
        <div class="d-flex flex-row">
          <v-tabs v-model="tab" color="primary" direction="vertical">
            <v-tab prepend-icon="mdi-account" text="Basic Info" value="option-1"></v-tab>
            <v-tab
              @click="fetchRolePermissions(profileData.roleId)"
              prepend-icon="mdi-lock"
              text="Permissions"
              value="option-2"
            ></v-tab>
          </v-tabs>

          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="option-1">
              <v-card flat> </v-card>
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
  </v-container>
</template>
<style scoped>
.mt-3 {
  margin-top: 1rem;
}
</style>
