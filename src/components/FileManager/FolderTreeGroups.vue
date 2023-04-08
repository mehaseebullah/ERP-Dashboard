<template>
  <ul>
    <li v-for="item in items" :key="item">
      <div class="d-flex">
        <div v-if="item?.children?.length">
          <v-btn
            v-if="!item.showChildren"
            @click="item.showChildren = true"
            variant="text"
            icon="mdi-arrow-right"
            size="small"
            density="compact"
          ></v-btn>
          <v-btn
            v-else
            @click="item.showChildren = false"
            size="small"
            density="compact"
            variant="text"
            icon="mdi-arrow-down"
          ></v-btn>
        </div>
        <v-btn
          :class="{ 'ml-5': !item?.children?.length }"
          density="compact"
          variant="text"
          :color="item.isActive ? 'primary' : ''"
          @click="setActiveItem(item)"
        >
          <v-icon class="mr-2" v-if="item.isActive">mdi-folder-open</v-icon>
          <v-icon class="mr-2" v-else>mdi-folder</v-icon>
          {{ item.name }}
        </v-btn>
      </div>
      <div class="ml-8" v-if="item?.children?.length && item.showChildren">
        <my-nested-tree @setActive="setActiveItem" :items="item.children" />
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'MyNestedTree',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  emits: {
    setActive: null,
  },
  methods: {
    setActiveItem(item) {
      this.$emit('setActive', item);
    },
  },
};
</script>
<style scoped>
ul {
  list-style: none;
}
</style>
