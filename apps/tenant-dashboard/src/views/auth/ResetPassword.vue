<script setup>
import { reactive, defineProps, ref, inject, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';
import rules from '@/helpers/rules';

const swal = inject('$swal');
const $loading = inject('$loading');
const authStore = useAuthStore();
const form = ref();

const state = reactive({
  showPass: false,
  showCPass: false,
});

const password = ref('');
const cPassword = ref('');

const confirmPassword = (val) => {
  return (!!password.value && val === password.value) || 'Password not matched';
};

onMounted(() => {});

const props = defineProps({
  email: {
    type: String,
    required: true,
  },
});

const resetPassword = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    try {
      await authStore.resetPassword({ email: props.email, password: password.value });
    } catch (error) {
      swal.error('An error occurred during the password reset process:', error);
    }
  } else {
    swal.error('Please enter all fields correctly');
  }
};
</script>
<template>
  <v-form ref="form" class="px-16 w-100">
    <v-row>
      <v-col cols="12">
        <div class="text-center">
          <h2 class="mb-4">Reset Password for</h2>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div class="text-center">
          <h2 class="mb-4">{{ email }}</h2>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="password"
          prepend-inner-icon="mdi-key"
          color="primary"
          label="Password"
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
          v-model="cPassword"
          prepend-inner-icon="mdi-key"
          color="primary"
          label="Confirm password"
          variant="outlined"
          :append-inner-icon="state.showCPass ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="() => (state.showCPass = !state.showCPass)"
          :type="state.showCPass ? 'text' : 'password'"
          :rules="[rules.required, confirmPassword]"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-end" cols="12">
        <v-btn :loading="$loading('resetPassword')" @click="resetPassword" color="primary">Reset Password</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<style lang="scss" scoped></style>
