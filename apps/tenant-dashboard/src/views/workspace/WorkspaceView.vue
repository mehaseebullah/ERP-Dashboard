<script setup>
import { reactive, ref, inject } from 'vue';
import { onMounted } from 'vue';
import { useWorkspaceStore } from '@/store/workspace';
import { storeToRefs } from 'pinia';

const swal = inject('$swal');
const $loading = inject('$loading');
const workspaceStore = useWorkspaceStore();
const { workspaceDetails, userDetails } = storeToRefs(workspaceStore);
const hasWorkspace = ref(false);

const workspaceData = reactive({
  subDomain: null,
  domain: null,
  title: null,
  username: null,
  password: null,
  description: null,
});

const getWorkspace = async () => {
  try {
    const res1 = await workspaceStore.getWorkspaceByUserId();
    swal.success(res1.message);

    if (workspaceDetails.value.domain) {
      hasWorkspace.value = true;
      workspaceData.domain = workspaceDetails.value.domain;
      workspaceData.subDomain = workspaceDetails.value.subDomain;

      try {
        const res2 = await workspaceStore.getAdministratorUserDetail();
        swal.success(res2.message);
        workspaceData.username = userDetails.value.userName;
        workspaceData.email = userDetails.value.email;
        workspaceData.title = userDetails.value.title;
        workspaceData.description = userDetails.value.description;
      } catch (error) {
        swal.error(error);
      }
    }
  } catch (err) {
    swal.error('WorkSpace not found');
  }
};

onMounted(() => {
  getWorkspace();
});
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
      <template #subtitle>
        <p class="mt-2">You have not yet created any workspace. Please create one to continue</p>
      </template>
      <template #actions>
        <v-btn class="mt-10" size="large" dense flat color="primary" to="/workspace/add">Create Workspace</v-btn>
      </template>
    </EmptyState>
    <div class="d-flex flex-column ga-4" v-else>
      <v-card>
        <v-toolbar density="compact" color="primary" title="WorkSpace Details"></v-toolbar>
        <v-card-text>
          <!-- Loader -->
          <div v-if="$loading('getWorkspaceByUserId')" class="d-flex justify-center pa-5">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <div v-else class="pa-5 d-flex flex-column ga-4">
            <div class="d-flex align-center ga-4">
              <div class="font-weight-bold">WorkSpace Domain:</div>
              <div>{{ workspaceData.domain }}</div>
            </div>
            <div class="d-flex align-center ga-4">
              <div class="font-weight-bold">Sub Domain:</div>
              <div>{{ workspaceData.subDomain }}</div>
            </div>
          </div>
        </v-card-text>
      </v-card>
      <v-card>
        <v-toolbar density="compact" color="primary" title="WorkSpace Admin Details"></v-toolbar>
        <v-card-text>
          <!-- Loader -->
          <div v-if="$loading('getAdministratorUserDetail')" class="d-flex justify-center pa-5">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <div v-else class="pa-5 d-flex flex-column ga-4">
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
        </v-card-text>
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
