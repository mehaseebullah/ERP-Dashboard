<script setup>
import { computed, onMounted, ref } from 'vue';
import { useChartOfAccounts } from '@/store/chart_of_accounts';
import { useSwal } from '@/composables/useSwal';
import { storeToRefs } from 'pinia';
import { parseTitle } from '@/helpers/utils';

const accountStore = useChartOfAccounts();
const { accounts, accountGroups } = storeToRefs(accountStore);
const swal = useSwal();

const headers = [
  {
    title: 'Title',
    key: 'title',
  },
  {
    title: 'Code',
    key: 'code',
  },
  {
    title: 'Group',
    key: 'accountGroupTitle',
  },
  {
    title: 'Actions',
    key: 'actions',
  },
];
const formModal = {
  title: '',
  code: '',
  accountGroupId: null
};

const formData = ref({ ...formModal });
const isEdit = ref(false);
const showDrawer = ref(false);

async function newAccount() {
  formData.value = { ...formModal };
  isEdit.value = false;
  showDrawer.value = true;
}

async function createAccount() {
  await accountStore.createAccount(formData.value);
  showDrawer.value = false;
  formData.value = { ...formModal };
}

async function editAccount(item) {
  formData.value = { ...item };
  isEdit.value = true;
  showDrawer.value = true;
}

async function updateAccount() {
  await accountStore.updateAccount(formData.value);
  showDrawer.value = false;
  formData.value = { ...formModal };
  isEdit.value = false;
}

async function deleteAccount(id) {
  swal.confirm('Are you sure you want to delete this account?').then(async (result) => {
    if (result.isConfirmed) {
      await accountStore.deleteAccount({ id });
      showDrawer.value = false;
    }
  });
}

onMounted(async () => {
  accountStore.fetchAllChartOfAccounts();
  accountStore.fetchAllAccountGroups();
  accountStore.fetchAccountTypes();
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar color="secondary" density="compact">
        <v-spacer></v-spacer>
        <v-btn @click="newAccount()">Create Account</v-btn>
      </v-toolbar>
      <v-data-table :loading="$loading('fetchAccounts')" :headers="headers" :items="accounts">
        <template v-slot:item.actions="{ item }">
          <div v-if="!item.isSystem">
            <v-btn size="small" variant="text" :disabled="item.isSystem" @click="editAccount(item)" icon="mdi-pencil">
            </v-btn>
            <v-btn
              size="small"
              variant="text"
              :disabled="item.isSystem"
              @click="deleteAccount(item.id)"
              icon="mdi-delete"
            >
            </v-btn>
          </div>
          <span v-else>--</span>
        </template>
      </v-data-table>
    </v-card>
    <main-drawer v-model="showDrawer" width="800" title="CREATE ACCOUNT" :toolbar="{ color: 'primary' }">
      <v-form class="pa-5" @submit.prevent="isEdit ? updateAccount() : createAccount()">
        <v-text-field v-model="formData.title" label="Title" variant="outlined"></v-text-field>
        <v-text-field v-model="formData.code" label="Code" variant="outlined"></v-text-field>
        <v-select
          :items="accountGroups"
          item-title="title"
          item-value="id"
          v-model="formData.accountGroupId"
          :loading="$loading('fetchAccountGroups')"
          label="Group"
          variant="outlined"
        ></v-select>
        <div class="d-flex justify-end">
          <v-btn v-if="isEdit" :loading="$loading('updateAccount')" type="submit" color="primary">Update Account</v-btn>
          <v-btn v-else :loading="$loading('createAccount')" type="submit" color="primary">Create Account</v-btn>
        </div>
      </v-form>
    </main-drawer>
  </v-container>
</template>
