<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useSwal } from '@/composables/useSwal';
import { storeToRefs } from 'pinia';
import { useRoleStore } from '@/store/role';
import { useRoute } from 'vue-router';
import { hasPermission } from '@/helpers/utils';

const route = useRoute();
const permissionCodes = route.meta.permissionCodes || [];

// to check permissions based on action type
const canCreate = computed(() => hasPermission('Create', permissionCodes));
const canRead = computed(() => hasPermission('Read', permissionCodes));
const canUpdate = computed(() => hasPermission('Update', permissionCodes));
const canDelete = computed(() => hasPermission('Delete', permissionCodes));

const roleStore = useRoleStore();
const { organizationsRoles } = storeToRefs(roleStore);
const { organizationRolePermissions } = storeToRefs(roleStore);

const swal = useSwal();
const loadingPermissions = ref(true);
const selectedCodes = ref([]);
const showRoles = ref(false);
const isLoading = ref(false);

const headers = ref([
  {
    title: 'Organization',
    key: 'organizationName',
    sortable: true,
  },
  {
    title: 'RoleName',
    key: 'roleName',
    sortable: true,
  },
  {
    title: 'Description',
    key: 'description',
    sortable: true,
  },

  {
    title: 'Invoke Permissions',
    key: 'actions',
    sortable: false,
  },
]);

const roleModal = {
  roleId: null,
  roleName: '',
  description: '',
  pRoleId: null,
  organizationName: '',
};

const roleData = ref({ ...roleModal });

const cancelEdit = () => {
  selectedCodes.value = [];
  organizationRolePermissions.value = [];
  roleData.value = { ...roleModal };
  loadingPermissions.value = true;
  showRoles.value = false; // Hide dialog
};

// Watch for changes in the drawer's visibility (v-model="showRoles")
watch(showRoles, (newValue) => {
  if (!newValue) {
    cancelEdit(); // Call cancelEdit when drawer is closed
  }
});

async function openInvokePermissionsDialog(item) {
  roleData.value = { ...item }; //to populate role data
  fetchRolePermissions(roleData.value.roleId);
  showRoles.value = true;
}

async function fetchAllRoles() {
  try {
    isLoading.value = true;
    await roleStore.fetchAllRoles();
  } catch (error) {
    swal.error('Error fetching users roles:', error);
  } finally {
    isLoading.value = false;
  }
}

async function fetchRolePermissions(roleId) {
  await roleStore.fetchRolePermissions(roleId);
  loadingPermissions.value = false;
  organizationRolePermissions.value.forEach((feature) => {
    if (feature.isPermission === 1 && !selectedCodes.value.includes(feature.code)) {
      selectedCodes.value.push(feature.code); // Add the feature code to selectedCodes
    }
  });
}
async function invokeRolePermission(RoleId, OrganizationId) {
  await roleStore.invokeRolePermission(RoleId, OrganizationId, selectedCodes.value);
  organizationRolePermissions.value.forEach((feature) => {
    if (feature.isPermission === 1 && !selectedCodes.value.includes(feature.code)) {
      selectedCodes.value.push(feature.code); // Add the feature code to selectedCodes
    }
  });
  showRoles.value = false;
  fetchAllRoles();
}

// Group permissions by feature
const groupedFeatures = computed(() => {
  const groups = organizationRolePermissions.value.reduce((acc, perm) => {
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

onMounted(async () => {
  if (canRead.value) await fetchAllRoles();
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar color="secondary" density="compact">
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-table v-if="canRead">
        <v-data-table
          :loading="$loading('fetchAllRoles')"
          :headers="headers"
          :items="organizationsRoles"
          item-value="roleId"
        >
          <template v-slot:item.actions="{ item }">
            <v-row class="d-flex align-center justify-center">
              <v-icon class="me-2" size="small" @click="openInvokePermissionsDialog(item)"> mdi-lock </v-icon>
            </v-row>
          </template>
        </v-data-table>
      </v-table>
      <v-card-text
        v-if="!canRead"
        class="d-flex flex-column justify-center align-center text-center"
        style="height: 300px"
      >
        <v-icon size="48" class="mb-4">mdi-lock</v-icon>
        <h1>You do not have permission to read this content</h1>
      </v-card-text>
    </v-card>

    <main-drawer v-model="showRoles" width="1025" title="Invoke Permissions" :toolbar="{ color: 'primary' }">
      <v-card flat
        ><v-card-text>
          <template v-if="loadingPermissions">
            <!-- Loader component -->
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </template>
          <template v-else>
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
                          <v-checkbox :label="feature.permissionType" :value="feature.code" v-model="selectedCodes" />
                        </v-col>
                      </v-row>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>

            <v-card>
              <v-card-text>
                <v-form>
                  <v-row class="justify-end">
                    <v-btn @click="invokeRolePermission(roleData.roleId, roleData.organizationId)" color="primary">
                      Update
                    </v-btn>
                    <v-btn @click="cancelEdit" color="primary" class="ml-4">Cancel</v-btn>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </template>
        </v-card-text>
      </v-card>
    </main-drawer>
  </v-container>
</template>
<style scoped>
.mt-3 {
  margin-top: 1rem;
}
</style>
