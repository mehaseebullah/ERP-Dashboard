<script setup>
import { reactive, ref, inject } from 'vue';
import rules from '@/helpers/rules';
import { useAuthStore } from '@/store/auth';

const swal = inject('$swal');
const authStore = useAuthStore();

const state = reactive({
  showPass: false,
  showCPass: false,
});

const form = ref();

const formData = reactive({
  username: null,
  email: null,
  password: null,
});

const confirmPassword = (val) => {
  return (!!formData.password && val === formData.password) || 'Password not matched';
};

const doRegister = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    await authStore.register(formData);
    swal.success('Account created successfully');
  } else {
    swal.error('Please fill all fields');
  }
};
</script>
<template>
  <v-row class="h-100 ma-0">
    <v-col cols="12" md="6" class="d-none d-md-flex h-100 bg-primary justify-center align-center">
      <div class="text-center">
        <h1>Demo</h1>
        <br />
        <h2>Data</h2>
      </div>
    </v-col>
    <v-col class="h-100 d-flex justify-center align-center" cols="12" md="6">
      <v-sheet class="px-16 w-100">
        <v-form ref="form" @submit.prevent="doRegister">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.username"
                prepend-inner-icon="mdi-account"
                color="primary"
                label="username"
                variant="outlined"
                :rules="[rules.required, rules.minLength(4)]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.email"
                prepend-inner-icon="mdi-account"
                color="primary"
                label="email"
                variant="outlined"
                :rules="[rules.email]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                prepend-inner-icon="mdi-key"
                v-model="formData.password"
                color="primary"
                label="password"
                variant="outlined"
                :append-inner-icon="state.showPass ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="() => (state.showPass = !state.showPass)"
                :type="state.showPass ? 'text' : 'password'"
                :rules="[rules.required, rules.minLength(6)]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                prepend-inner-icon="mdi-key"
                color="primary"
                label="confirm password"
                variant="outlined"
                :append-inner-icon="state.showCPass ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="() => (state.showCPass = !state.showCPass)"
                :type="state.showCPass ? 'text' : 'password'"
                :rules="[rules.required, confirmPassword]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-btn prepend-icon="mdi-arrow-left" to="/login" size="small" variant="text">Login</v-btn>
            </v-col>
            <v-col class="text-right" cols="6">
              <v-btn type="submit" color="primary">Create Account</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-sheet>
    </v-col>
  </v-row>
</template>
