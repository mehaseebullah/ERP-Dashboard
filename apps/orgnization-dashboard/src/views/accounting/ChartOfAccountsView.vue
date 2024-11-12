<script setup>
import { computed, onMounted, ref } from 'vue';
import { useChartOfAccounts } from '@/store/chart_of_accounts';
import { useSwal } from '@/composables/useSwal';
import { storeToRefs } from 'pinia';
import { parseTitle } from '@/helpers/utils';
import rules from '@/helpers/rules';
import { useRoute } from 'vue-router';
import { hasPermission } from '@/helpers/utils';

const route = useRoute();
const permissionCodes = route.meta.permissionCodes || [];

// to check permissions based on action type
const canCreate = computed(() => hasPermission('Create', permissionCodes));
const canRead = computed(() => hasPermission('Read', permissionCodes));
const canUpdate = computed(() => hasPermission('Update', permissionCodes));
const canDelete = computed(() => hasPermission('Delete', permissionCodes));

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
  accountGroupId: null,
};

const formData = ref({ ...formModal });
const drawerTitle = computed(() => (isEdit.value ? 'UPDATE ACCOUNT' : 'CREATE ACCOUNT'));
const isEdit = ref(false);
const showDrawer = ref(false);
const form = ref();

async function newAccount() {
  formData.value = { ...formModal };
  isEdit.value = false;
  form.value.resetValidation();
  showDrawer.value = true;
}

async function createAccount() {
  const { valid } = await form.value.validate();
  if (valid) {
    try {
      await accountStore.createAccount(formData.value);
      showDrawer.value = false;
      formData.value = { ...formModal };
      swal.success('Account created successfully!');
    } catch (error) {
      // swal.error(error);
    }
  } else {
    swal.error('Please fill all fields');
  }
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
  if (canRead.value) accountStore.fetchAllChartOfAccounts();
  if (canCreate.value || canUpdate.value) accountStore.fetchAllAccountGroups();

  accountStore.fetchAccountTypes();
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar color="secondary" density="compact">
        <v-spacer></v-spacer>
        <v-btn v-if="canCreate" @click="newAccount()">Create Account</v-btn>
      </v-toolbar>
      <v-data-table v-if="canRead" :loading="$loading('fetchAllChartOfAccounts')" :headers="headers" :items="accounts">
        <template v-slot:item.actions="{ item }">
          <div v-if="!item.isSystem">
            <v-btn
              v-if="canUpdate"
              size="small"
              variant="text"
              :disabled="item.isSystem"
              @click="editAccount(item)"
              icon="mdi-pencil"
            >
            </v-btn>
            <v-btn
              v-if="canDelete"
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
      <!-- Show message if user does not have read permissions -->
      <v-card-text
        v-if="!canRead"
        class="d-flex flex-column justify-center align-center text-center"
        style="height: 300px"
      >
        <v-icon size="48" class="mb-4">mdi-lock</v-icon>
        <h1>You do not have permission to read this content</h1>
      </v-card-text>
    </v-card>
    <main-drawer v-model="showDrawer" width="800" :title="drawerTitle" :toolbar="{ color: 'primary' }">
      <v-form ref="form" class="pa-5" @submit.prevent="isEdit ? updateAccount() : createAccount()">
        <v-text-field
          v-model="formData.title"
          label="Title"
          variant="outlined"
          :rules="[rules.required]"
        ></v-text-field>
        <v-text-field v-model="formData.code" label="Code" variant="outlined" :rules="[rules.required]"></v-text-field>
        <v-select
          :items="accountGroups"
          item-title="title"
          item-value="id"
          v-model="formData.accountGroupId"
          :loading="$loading('fetchAccountGroups')"
          label="Group"
          variant="outlined"
          :rules="[rules.required]"
        ></v-select>
        <div class="d-flex justify-end">
          <v-btn v-if="isEdit" :loading="$loading('updateAccount')" type="submit" color="primary">Update Account</v-btn>
          <v-btn v-else :loading="$loading('createAccount')" type="submit" color="primary">Create Account</v-btn>
        </div>
      </v-form>
    </main-drawer>
  </v-container>
</template>
