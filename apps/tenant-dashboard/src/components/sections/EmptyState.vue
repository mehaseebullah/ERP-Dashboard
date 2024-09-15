<script setup></script>
<template>
  <div class="pa-5 h-100 d-flex align-center justify-center flex-column">
    <slot name="icon">
      <v-icon size="50" color="primary" class="mb-3">mdi-file-document-outline</v-icon>
    </slot>
    <slot name="title"></slot>
    <slot name="subtitle">
      <p class="text-body-1">No data available to display</p>
    </slot>
    <slot name="actions"> </slot>
  </div>
</template>
