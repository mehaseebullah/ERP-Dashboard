<script setup>
import { ref } from 'vue';
</script>
<template>
  <div class="pa-5" style="height: 90vh; display: flex; justify-content: center; align-items: center">
    <div class="d-flex align-center justify-center d-flex flex-column">
      <v-icon icon="mdi-plus-box"></v-icon>
      <p class="mt-3">You have not yet created any workspace. Please create one to continue</p>

      <v-btn class="mt-3" size="small" flat color="primary" to="/addworkspace">Create</v-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
