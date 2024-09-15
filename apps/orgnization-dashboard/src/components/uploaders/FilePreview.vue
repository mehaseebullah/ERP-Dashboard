<script setup>
import { onMounted, ref, computed } from 'vue';

const props = defineProps({
  file: Object,
});

const imgEl = ref();

const fileType = computed(() => {
  return props.file.type;
});

onMounted(() => {
  var reader = new FileReader();
  reader.onload = function (e) {
    if (imgEl.value) {
      imgEl.value.src = e.target.result;
    }
  };
  reader.readAsDataURL(props.file);
});
</script>

<template>
  <div v-if="fileType?.includes('image')">
    <img ref="imgEl" class="file" />
  </div>
  <div v-else>
    <v-icon size="100" class="file" icon="mdi-file-document"></v-icon>
  </div>
</template>

<style scoped>
.file {
  width: 100px;
  height: 100px;
}
</style>
