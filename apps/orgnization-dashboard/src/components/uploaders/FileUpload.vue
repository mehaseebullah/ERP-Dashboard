<script setup>
import { ref } from 'vue';
import FilePreview from './FilePreview.vue';

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  multiple: { type: Boolean, default: false },
  title: { type: String, default: 'Attachments' },
});
const emit = defineEmits(['update:modelValue']);

const fileInput = ref();
const files = ref(props.modelValue);

function fileChange(e) {
  if (props.multiple) {
    files.value = [...files.value, ...e.target.files];
  } else {
    files.value.push(e.target.files[0]);
  }
  emit('update:modelValue', files.value);
}
</script>
<template>
  <v-card>
    <v-toolbar color="secondary" density="compact">
      <v-spacer></v-spacer>
      <input class="d-none" @change="fileChange" ref="fileInput" type="file" :multiple="props.multiple" />
      <v-btn variant="text" size="small" @click.stop="fileInput.click()" append-icon="mdi-upload">Upload</v-btn>
    </v-toolbar>

    <v-list v-if="files.length" lines="one">
      <v-list-item v-for="f in files" :key="f.name">
        <template v-slot:title>
          {{ f.name }} <br />
          <span class="text-caption">{{ f.size }} bytes</span>
        </template>
        <template v-slot:subtitle>
          <v-btn size="x-small" variant="text" color="error" @click="files.splice(files.indexOf(f), 1)">Remove</v-btn>
        </template>
        <template v-slot:prepend>
          <FilePreview class="mr-2" :file="f"></FilePreview>
        </template>
      </v-list-item>
    </v-list>
    <EmptyState v-else>
      <template #subtitle> No file selected </template>
    </EmptyState>
  </v-card>
</template>
