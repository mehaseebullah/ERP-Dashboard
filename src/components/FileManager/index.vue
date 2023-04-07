<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container>
    <v-toolbar color="primary" density="compact">
      <v-btn prepend-icon="mdi-plus" variant="text">New Folder</v-btn>
      <v-btn prepend-icon="mdi-upload" variant="text">Upload</v-btn>
      <v-btn prepend-icon="mdi-reload" variant="text">Refresh</v-btn>
      <v-spacer></v-spacer>
      <v-btn size="small" icon="mdi-view-list"></v-btn>
      <v-btn size="small" icon="mdi-information-outline"></v-btn>
    </v-toolbar>
    <div class="border border-t-0 overflow-hidden">
      <v-row>
        <v-col cols="3">
          <v-list>
            <FolderTree :items="items"></FolderTree>
          </v-list>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="9">
          <div>hello</div>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
<script setup>
import FolderTree from './FolderTree.vue';
const items = [
  {
    name: 'Folder 1',
    isActive: false,
    children: [
      {
        name: 'Folder 1.1',
        isActive: false,
        children: [
          {
            name: 'File 1.1.1',
          },
          {
            name: 'File 1.1.2',
          },
        ],
      },
      {
        name: 'File 1.2',
      },
    ],
  },
  {
    name: 'Folder 2',
    isActive: false,
    children: [
      {
        name: 'File 2.1',
      },
      {
        name: 'File 2.2',
      },
    ],
  },
  {
    name: 'File 3',
  },
];
const files = [
  {
    color: 'blue',
    icon: 'mdi-clipboard-text',
    subtitle: 'Jan 20, 2014',
    title: 'Vacation itinerary',
  },
  {
    color: 'amber',
    icon: 'mdi-gesture-tap-button',
    subtitle: 'Jan 10, 2014',
    title: 'Kitchen remodel',
  },
];
const folders = [
  {
    subtitle: 'Jan 9, 2014',
    title: 'Photos',
  },
  {
    subtitle: 'Jan 17, 2014',
    title: 'Recipes',
  },
  {
    subtitle: 'Jan 28, 2014',
    title: 'Work',
  },
];
</script>
