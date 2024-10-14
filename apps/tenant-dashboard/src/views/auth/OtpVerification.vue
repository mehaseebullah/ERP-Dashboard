<script setup>
import { reactive, ref, inject } from 'vue';
import rules from '@/helpers/rules';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const swal = inject('$swal');
const authStore = useAuthStore();
const otpValue = ref('');
const verificationType = '6';

onMounted(() => {
  const route = useRoute();
  console.log(route.meta.type);
});

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
        <p class="">We sending a OTP to validate your email, Hang on!</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-center" cols="12">
        <v-otp-input v-model="otpValue" type="otp" length="6" rounded variant="outlined" width="500"></v-otp-input>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn @click="verifyOTP" size="x-small" variant="text" color="primary">Verify</v-btn>
        <!-- <v-btn type="submit" class="" color="primary">SEND OTP REQUEST</v-btn> -->
      </v-col>
    </v-row>
  </v-sheet>
</template>

<style lang="css" scoped>
.v-otp-input {
  border-radius: 50px !important;
}
</style>
