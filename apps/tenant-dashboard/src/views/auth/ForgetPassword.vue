<script setup>
import { reactive, ref, inject } from 'vue';
import rules from '@/helpers/rules';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import ResetPassword from './ResetPassword.vue';

const swal = inject('$swal');
const authStore = useAuthStore();

const email = ref('');
const showResetComponent = ref(false);
const showOtp = ref(false);
const otpValue = ref('');

onMounted(() => {
  const route = useRoute();
  console.log(route.meta.type);
});

const forgetPassword = async () => {
  if (email.value) {
    try {
      await authStore.forgetPassword({ Email: email.value });
      showOtp.value = true;
    } catch (error) {
      console.error('An error occurred during the password reset process:', error);
      swal.error('An error occurred. Please try again.');
    }
  } else {
    swal.error('Please enter the correct email');
  }
};

const resetPassword = () => {
  showResetComponent.value = true; // Show the ResetPassword component
  showOtp.value = false;
};
const verifyOTP = async () => {
  if (otpValue.value) {
    await authStore.verifyOTP({ OtpCode: otpValue.value, verificationType: '7' });
    resetPassword();
  } else {
    swal.error('Please enter the correct OTP');
  }
};
</script>
<template>
  <ResetPassword v-if="showResetComponent == true" :email="email" />
  <v-sheet class="px-16 w-100" v-else-if="!showOtp">
    <v-row>
      <v-col cols="12">
        <div class="text-center">
          <h2 class="mb-4">Forgot Password?</h2>
          <p class="mb-4">Please enter your email to reset your password.</p>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="email"
          prepend-inner-icon="mdi-account"
          color="primary"
          label="email"
          variant="outlined"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-end" cols="12">
        <v-btn type="submit" @click="forgetPassword" color="primary">SEND REQUEST</v-btn>
      </v-col>
    </v-row>
  </v-sheet>
  <v-sheet class="px-16 w-100" v-else>
    <v-row>
      <v-col cols="12">
        <div class="text-center">
          <h2 class="mb-4">Please verify your Otp to reset your password.</h2>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-center" cols="12">
        <v-otp-input v-model="otpValue" type="otp" length="6" rounded variant="outlined" width="500"></v-otp-input>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn @click="verifyOTP" class="" color="primary">Verify OTP</v-btn>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<style lang="scss" scoped></style>
