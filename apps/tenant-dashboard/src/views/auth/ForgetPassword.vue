<script setup>
import { ref, inject } from 'vue';
import { onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';
import ResetPassword from './ResetPassword.vue';
import rules from '@/helpers/rules';
import { before } from 'lodash';

const swal = inject('$swal');
const $loading = inject('$loading');
const authStore = useAuthStore();
const email = ref('');
const showResetComponent = ref(false);
const showOtp = ref(false);
const otpValue = ref('');
const form = ref();
const otpform = ref();

onMounted(() => {});

const forgetPassword = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    try {
      const res = await authStore.forgetPassword({ Email: email.value });
      if (res.statusCode === 404) {
        swal.error(res.message);
      } else if (res.statusCode === 200) {
        showOtp.value = true;
      } else {
        swal.error(res.message);
        showOtp.value = true;
      }
    } catch (error) {
      swal.error('An error occurred during the password reset process:', error);
    }
  } else {
    swal.error('Please enter the correct email');
  }
};

const resetPassword = () => {
  showResetComponent.value = true;
  showOtp.value = false;
};
const verifyOTP = async () => {
  if (otpValue.value) {
    try {
      const res = await authStore.verifyOTP({ OtpCode: otpValue.value, verificationType: '7' });
      if (res.statusCode === 200) {
        resetPassword();
      }
    } catch (error) {
      swal.error('An error occurred during the password reset process:', error);
    }
  } else {
    swal.error('Please enter the correct OTP');
  }
};
</script>
<template>
  <ResetPassword v-if="showResetComponent == true" :email="email" />
  <v-form ref="form" class="px-16 w-100" v-else-if="!showOtp">
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
          :rules="[rules.required, rules.email]"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-end" cols="12">
        <v-btn :loading="$loading('forgetPassword')" @click="forgetPassword" color="primary">SEND REQUEST</v-btn>
      </v-col>
    </v-row>
  </v-form>
  <v-form ref="otpform" class="px-16 w-100" v-else>
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
        <v-btn :loading="$loading('verifyOTP')" @click="verifyOTP" class="" color="primary">Verify OTP</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<style lang="scss" scoped></style>
