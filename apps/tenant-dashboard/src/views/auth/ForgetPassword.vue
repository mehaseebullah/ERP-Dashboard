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
const showReset = ref(false);
const otpValue = ref('');
//const userVerified = ref(false);

onMounted(() => {
  const route = useRoute();
  console.log(route.meta.type);
});

//new addition
const forgetPassword = async () => {
  if (email.value) {
    try {
      console.log('here it comes forget pass func', email.value);
      await authStore.forgetPassword({ Email: email.value });
      //verifyOtp();
      //resetPassword();
    } catch (error) {
      console.error('An error occurred during the password reset process:', error);
      swal.error('An error occurred. Please try again.');
    }
  } else {
    swal.error('Please enter the correct email');
  }
};

const resetPassword = () => {
  showReset.value = true; // Show the ResetPassword component
};
const verifyOTP = async () => {
  console.log('here it comes otp verifi page verify func', otpValue.value);

  if (otpValue.value) {
    await authStore.verifyOTP({ OtpCode: otpValue.value });
    resetPassword();
  } else {
    swal.error('Please enter the correct OTP');
  }
};
</script>
<template>
  <ResetPassword v-if="showReset" :email="email" />
  <v-sheet class="px-16 w-100" v-else>
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
    <!-- <v-row>
      <v-col class="text-end" cols="12">
        <v-btn type="submit" color="primary">SEND RESET REQUEST</v-btn>
      </v-col>
    </v-row> -->
    <v-row>
      <v-col class="text-center" cols="12">
        <v-otp-input v-model="otpValue" type="otp" length="6" rounded variant="outlined" width="500"></v-otp-input>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn @click="verifyOTP" class="" color="primary">SEND OTP REQUEST</v-btn>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<style lang="scss" scoped></style>
