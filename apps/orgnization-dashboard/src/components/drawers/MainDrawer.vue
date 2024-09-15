<script setup>
const props = defineProps(['title', 'toolbar']);
const model = defineModel();
</script>
<template>
  <Teleport to="body">
    <v-navigation-drawer
      v-model="model"
      v-bind="{ ...$attrs }"
      temporary
      style="position: absolute; top: 0; height: 100vh; overflow-y: hidden"
      location="right"
      floating
    >
      <v-toolbar v-bind="props.toolbar">
        <v-btn icon="mdi-close" variant="text" @click="model = false"></v-btn>

        <v-toolbar-title>{{ props.title }}</v-toolbar-title>

        <v-spacer></v-spacer>
      </v-toolbar>
      <div class="custom-scroll" style="overflow-y: auto; height: calc(100vh - 64px)">
        <slot></slot>
      </div>
    </v-navigation-drawer>
  </Teleport>
</template>
<style></style>
