<script setup>
import { defineProps } from 'vue';
import { reactive, ref, inject } from 'vue';
import rules from '@/helpers/rules';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const swal = inject('$swal');
const authStore = useAuthStore();

const password = ref('');
const confirmPassword = ref('');

onMounted(() => {
  const route = useRoute();
  console.log(route.meta.type);
});

const props = defineProps({
  email: {
    type: String,
    required: true,
  },
});

const resetPassword = async () => {
  if (password.value && confirmPassword.value) {
    try {
      console.log('here it comes reset pass func', password.value, confirmPassword.value);
      await authStore.resetPassword({ email: props.email, password: password.value });
    } catch (error) {
      console.error('An error occurred during the password reset process:', error);
      swal.error('An error occurred. Please try again.');
    }
  } else {
    swal.error('Please enter the correct email');
  }
};
</script>
<template>
  <v-sheet class="px-16 w-100">
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
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="confirmPassword"
          prepend-inner-icon="mdi-key"
          color="primary"
          label="Confirm password"
          variant="outlined"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-end" cols="12">
        <v-btn @click="resetPassword" color="primary">Reset Password</v-btn>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<style lang="scss" scoped></style>
