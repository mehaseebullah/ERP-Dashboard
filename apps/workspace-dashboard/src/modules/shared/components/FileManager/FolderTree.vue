<template>
  <v-list class="pa-5">
    <FolderTreeGroups :items="myItems" @setActive="setActive"></FolderTreeGroups>
  </v-list>
</template>
<script>
import FolderTreeGroups from './FolderTreeGroups.vue';
import _ from 'lodash';
export default {
  name: 'FolderTree',
  components: {
    FolderTreeGroups: FolderTreeGroups,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      activeItem: null,
      myItems: this.items,
    };
  },
  methods: {
    traverse(itms) {
      itms.map((i) => {
        if (_.isEqual({ ...i }, { ...this.activeItem })) {
          i.isActive = true;
        } else {
          i.isActive = false;
        }
        if (i?.children?.length) {
          this.traverse(i.children);
        }
      });
    },
    setActive(it) {
      this.activeItem = it;
      this.traverse(this.myItems);
    },
  },
};
</script>
