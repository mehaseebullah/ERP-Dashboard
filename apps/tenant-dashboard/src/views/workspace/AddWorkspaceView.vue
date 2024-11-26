<script setup>
import { reactive, ref, inject } from 'vue';
import rules from '@/helpers/rules';
import { useRouter } from 'vue-router';
import { useWorkspaceStore } from '@/store/workspace';

const router = useRouter();
const swal = inject('$swal');
const $loading = inject('$loading');
const workspaceStore = useWorkspaceStore();

const state = reactive({
  showPass: false,
  showCPass: false,
});

const form = ref();

const formData = reactive({
  subDomain: null,
  domain: null,
  title: null,
  username: null,
  email: null,
  password: null,
});

const confirmPassword = (val) => {
  return (!!formData.password && val === formData.password) || 'Password not matched';
};

const createWorkspace = async () => {
  const { valid } = await form.value.validate();

  if (valid) {
    try {
      const res = await workspaceStore.createWorkspace(formData);

      if (res?.statusCode === 201) {
        swal.success(res.message || 'Workspace created successfully');
        router.push('/workspace');
      } else if (res?.statusCode === 409) {
        swal.error(res?.message || 'Workspace Already exists');
      } else {
        throw new Error(res?.message || 'Something went wrong');
      }
    } catch (err) {
      swal.error(err?.message || 'Something went wrong');
    }
  } else {
    swal.error('Please fill all fields');
  }
};
</script>
<template>
  <v-container class="h-100 overflow-y">
    <v-form ref="form" @submit.prevent="createWorkspace()">
      <div class="d-flex flex-column ga-4">
        <v-card>
          <v-toolbar density="compact" color="primary" class="mb-5" title="WorkSpace Details"></v-toolbar>
          <div class="pa-5">
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field v-model="formData.domain" label="Domain" :rules="[rules.required]"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field v-model="formData.subDomain" label="Subdomain" :rules="[rules.required]"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field v-model="formData.title" label="Title" :rules="[rules.required]"></v-text-field>
              </v-col>
            </v-row>
          </div>
        </v-card>
        <v-card>
          <v-toolbar density="compact" color="primary" class="mb-5" title="Workspace Admin Details"></v-toolbar>
          <div class="pa-5">
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="formData.username"
                  label="Username"
                  :rules="[rules.required, rules.minLength(4)]"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="formData.email"
                  label="Email"
                  :rules="[rules.required, rules.email]"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="formData.password"
                  label="Password"
                  :append-inner-icon="state.showPass ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="() => (state.showPass = !state.showPass)"
                  :type="state.showPass ? 'text' : 'password'"
                  :rules="[rules.required, rules.minLength(6)]"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                  label="Verify Password"
                  :append-inner-icon="state.showCPass ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="() => (state.showCPass = !state.showCPass)"
                  :type="state.showCPass ? 'text' : 'password'"
                  :rules="[rules.required, confirmPassword]"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
        </v-card>
        <v-row class="mt-4">
          <v-col class="text-right" cols="12" md="12">
            <v-btn type="reset" color="error" class="mr-2">Cancel</v-btn>
            <v-btn :loading="$loading('createWorkspace')" type="submit" color="primary">Create Workspace</v-btn>
          </v-col>
        </v-row>
      </div>
    </v-form>
  </v-container>
</template>

<style lang="scss" scoped></style>
