<script setup>
import { ref } from 'vue';

const hasWorkspace = ref(true);
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
        ><p class="mt-2">You have not yet created any workspace. Please create one to continue</p></template
      >
      <template #actions>
        <v-btn class="mt-10" size="large" dense flat color="primary" to="/workspace/add">Create Workspace</v-btn>
      </template>
    </EmptyState>
    <div class="d-flex flex-column ga-4" v-else>
      <v-card>
        <v-toolbar density="compact" color="primary" title="WorkSpace Details"></v-toolbar>
        <div class="pa-5 d-flex flex-column ga-4">
          <div class="d-flex align-center ga-4">
            <div class="font-weight-bold">WorkSpace Name:</div>
            <div>ABC Business</div>
          </div>
          <div class="d-flex align-center ga-4">
            <div class="font-weight-bold">Associated Domain:</div>
            <div>No domain associated</div>
          </div>
        </div>
      </v-card>
      <v-card>
        <v-toolbar density="compact" color="primary" title="WorkSpace Admin Details"></v-toolbar>
        <div class="pa-5 d-flex flex-column ga-4">
          <div class="d-flex align-center ga-4">
            <div class="font-weight-bold">Username:</div>
            <div>useradmin</div>
          </div>
          <div class="d-flex align-center ga-4">
            <div class="font-weight-bold">Email:</div>
            <div>admin@admin.com</div>
          </div>
          <div class="d-flex align-center ga-4">
            <div class="font-weight-bold">Password:</div>
            <div>**************</div>
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
