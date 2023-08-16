<template>
  <template v-for="(item, index) in myItems">
    <v-list-group v-if="item.children" :key="index">
      <template v-slot:activator="{ props }">
        <v-list-item
          @click="setActive(item)"
          :title="item.name"
          v-bind="props"
          :prepend-icon="item.isActive ? 'mdi-folder-open' : 'mdi-folder'"
        >
        </v-list-item>
      </template>
      <!-- <v-list-item-group> -->
      <RecursiveListComponent :items="item.children"></RecursiveListComponent>
      <!-- </v-list-item-group> -->
    </v-list-group>
    <v-list-item
      v-else
      @click="setActive(item)"
      :key="item"
      :title="item.name"
      :prepend-icon="item.isActive ? 'mdi-folder-open' : 'mdi-folder'"
    >
    </v-list-item>
  </template>
</template>

<script>
export default {
  name: 'RecursiveListComponent',
  emits: {
    setActive: null,
  },
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
    return {
      myItems: this.items,
    };
  },
  methods: {
    setActive(i) {
      i.isActive = true;
      this.$emit('setActive', i);
    },
  },
};
</script>
