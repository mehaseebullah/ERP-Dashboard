<script setup>
import { reactive, ref, inject } from 'vue';
import rules from '@/helpers/rules';
import { useAuthStore } from '@/store/auth';

const swal = inject('$swal');
const authStore = useAuthStore();

const state = reactive({
  showPass: false,
});

const form = ref();

const formData = reactive({
  username: null,
  password: null,
  domain: null,
});

const doLogin = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    await authStore.login(formData);
  } else {
    swal.error('Please fill all fields');
  }
};
</script>
<template>
  <v-sheet class="px-16 w-100">
    <v-form ref="form" @submit.prevent="doLogin">
      <v-row>
        <v-col cols="12">
          <v-text-field
            prepend-inner-icon="mdi-account"
            v-model="formData.username"
            color="primary"
            label="Username"
            variant="outlined"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="">
          <v-text-field
            prepend-inner-icon="mdi-key"
            v-model="formData.password"
            color="primary"
            label="Password"
            variant="outlined"
            :append-inner-icon="state.showPass ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="() => (state.showPass = !state.showPass)"
            :type="state.showPass ? 'text' : 'password'"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            prepend-inner-icon="mdi-account"
            v-model="formData.domain"
            color="primary"
            label="domain"
            variant="outlined"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6">
          <div class="d-flex flex-column align-start">
            <v-btn to="/register" size="x-small" color="primary" variant="text" class="m-0 p-0"
              >Create new account</v-btn
            >
            <v-btn to="/forgetpassword" size="x-small" color="primary" variant="text" class="m-0 p-0"
              >Forget Password</v-btn
            >
          </div>
        </v-col>
        <v-col class="text-right" cols="6">
          <v-btn type="submit" color="primary">Login</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-sheet>
</template>
