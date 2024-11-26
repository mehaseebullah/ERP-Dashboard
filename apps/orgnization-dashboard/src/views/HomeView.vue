<script setup>
import { onMounted, ref } from 'vue';
import { useHomeStore } from '@/store/home';
import { useSwal } from '@/composables/useSwal';
import { storeToRefs } from 'pinia';
const homeStore = useHomeStore();
const { balanceSheetPerAccountType } = storeToRefs(homeStore);
const swal = useSwal();

onMounted(() => {
  homeStore.fetchTrialBalance();
});
</script>

<template>
  <v-container>
    <div v-if="$loading('fetchTrialBalance')" class="d-flex justify-center pa-5">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <v-sheet v-else>
      <v-row :loading="$loading('fetchTrialBalance')">
        <v-col cols="6" v-for="(item, index) in balanceSheetPerAccountType" :key="index">
          <v-card bordered>
            <v-toolbar color="secondary" density="compact">
              <v-toolbar-title>{{ item.accountType }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-title class="text-right pr-5">{{ item.total }}</v-toolbar-title>
            </v-toolbar>
            <v-list>
              <v-list-item v-for="(innerItem, index) in item.accountGroupList" :key="index">
                <div class="d-flex">
                  <v-list-item-subtitle>{{ innerItem.accountGroup }}</v-list-item-subtitle>
                  <v-spacer></v-spacer>
                  <v-list-item-subtitle>{{ innerItem.balance }}</v-list-item-subtitle>
                </div>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>
