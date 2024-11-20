<script setup>
import { ref, inject } from 'vue';
import { onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';

const swal = inject('$swal');
const $loading = inject('$loading');
const authStore = useAuthStore();
const otpValue = ref('');
const verificationType = '6';

onMounted(() => {});

const verifyOTP = async () => {
  if (otpValue.value) {
    await authStore.verifyOTP({ OtpCode: otpValue.value, verificationType: verificationType });
  } else {
    swal.error('Please enter the correct OTP');
  }
};
</script>
<template>
  <v-sheet class="px-16 w-100">
    <v-row>
      <v-col cols="12" class="text-center">
        <h2 class="">Verify Your Account</h2>
        <p class="">We are sending a OTP to validate your email, Hang on!</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-center" cols="12">
        <v-otp-input v-model="otpValue" type="otp" length="6" rounded variant="outlined" width="500"></v-otp-input>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn :loading="$loading('verifyOTP')" @click="verifyOTP" color="primary">Verify</v-btn>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<style lang="css" scoped>
.v-otp-input {
  border-radius: 50px !important;
}
</style>
