<template>
  <template v-for="(item, index) in items">
    <v-list-group v-if="item.children" :key="index" :prepend-icon="item.isActive ? 'mdi-folder-open' : 'mdi-folder'">
      <template v-slot:activator="{ props }">
        <v-list-item @click="item.isActive = !item.isActive" :title="item.name" v-bind="props"> </v-list-item>
      </template>
      <v-list-item-group>
        <RecursiveListComponent :items="item.children"></RecursiveListComponent>
      </v-list-item-group>
    </v-list-group>
    <v-list-item v-else :key="item" :title="item.name"> </v-list-item>
  </template>
</template>

<script>
export default {
  name: 'RecursiveListComponent',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  components: {
    RecursiveListComponent: this,
  },
  data() {
    return {};
  },
};
</script>
