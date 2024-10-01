<script setup>
import { reactive, ref, inject } from 'vue';
import rules from '@/helpers/rules';
import { onMounted } from 'vue';
import { progHubHttpService, tenantAuthHttpService } from '@/helpers/http';

import { useRouter } from 'vue-router';

import { useAuthStore } from '@/store/auth';
const router = useRouter();

const swal = inject('$swal');
const authStore = useAuthStore();

const workspaceData = reactive({
  subDomain: null,
  domain: null,
  title: null,
  username: null,
  password: null,
  description: null,
});

const hasWorkspace = ref(false);

onMounted(() => {
  getWorkspace();
});
const getWorkspace = async () => {
  try {
    const workspaceDetails = await progHubHttpService.get('/Tenant/Workspace/GetWorkspaceByUserId');

    workspaceData.domain = workspaceDetails.data.data[0].domain;
    workspaceData.subDomain = workspaceDetails.data.data[0].subDomain;
    try {
      const userDetails = await tenantAuthHttpService.get('/Tenant/User/GetAdministratorUserDetail');
      swal.success(userDetails.data.message);

      workspaceData.username = userDetails.data.data[0].userName;
      workspaceData.email = userDetails.data.data[0].email;
      workspaceData.title = userDetails.data.data[0].title;
      workspaceData.description = userDetails.data.data[0].description;

      hasWorkspace.value = true;
    } catch (error) {
      swal.error(error.response2.data);
    }
  } catch (err) {
    swal.error(err.response.data);
    swal.error(err.message || 'Something went wrong');
  }
};
</script>
<template>
  <v-container class="h-100">
    <EmptyState v-if="!hasWorkspace">
      <template #icon>
        <v-icon size="50" icon="mdi-plus-box"></v-icon>
      </template>
      <template #title>
        <p class="text-h5 mt-10">No Workspace</p>
      </template>
      <template #subtitle
        ><p class="mt-2">You have not yet created any workspace. Please create one to continue</p>
      </template>
      <template #actions>
        <v-btn class="mt-10" size="large" dense flat color="primary" to="/workspace/add">Create Workspace</v-btn>
      </template>
    </EmptyState>
    <div class="d-flex flex-column ga-4" v-else>
      <v-card>
        <v-toolbar density="compact" color="primary" title="WorkSpace Details"></v-toolbar>

        <div class="pa-5 d-flex flex-column ga-4">
          <div class="d-flex align-center ga-4">
            <div class="font-weight-bold">WorkSpace Domain:</div>
            <div>{{ workspaceData.domain }}</div>
          </div>
          <div class="d-flex align-center ga-4">
            <div class="font-weight-bold">Sub Domain:</div>
            <div>{{ workspaceData.subDomain }}</div>
          </div>
        </div>
      </v-card>
      <v-card>
        <v-toolbar density="compact" color="primary" title="WorkSpace Admin Details"></v-toolbar>
        <div class="pa-5 d-flex flex-column ga-4">
          <div class="d-flex align-center ga-4">
            <div class="font-weight-bold">Username:</div>
            <div>{{ workspaceData.username }}</div>
          </div>
          <div class="d-flex align-center ga-4">
            <div class="font-weight-bold">Password:</div>
            <div>**************</div>
          </div>
          <div class="d-flex align-center ga-4">
            <div class="font-weight-bold">Email:</div>
            <div>{{ workspaceData.email }}</div>
          </div>
          <div class="d-flex align-center ga-4">
            <div class="font-weight-bold">Role:</div>
            <div>{{ workspaceData.title }}</div>
          </div>
          <div class="d-flex align-center ga-4">
            <div class="font-weight-bold">Description:</div>
            <div>{{ workspaceData.description }}</div>
          </div>
        </div>
      </v-card>
      <v-card>
        <v-toolbar density="compact" color="primary" title="WorkSpace Backups"></v-toolbar>
        <div class="pa-5 d-flex flex-column ga-4">
          <v-table>
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left">Size</th>
                <th class="text-left">Date</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Backup 1</td>
                <td>10 MB</td>
                <td>2022-01-01</td>
                <td>
                  <v-btn color="success" size="x-small" icon="mdi-download"> </v-btn>
                  <v-btn class="ml-2" color="error" size="x-small" icon="mdi-delete"> </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </v-card>
    </div>
  </v-container>
</template>

<style lang="scss" scoped></style>
