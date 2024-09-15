<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

onMounted(() => {
  const route = useRoute();
  console.log(route.meta.type);
});
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
        <v-otp-input type="otp" length="5" rounded variant="outlined" width="500"></v-otp-input>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn type="submit" class="" color="primary">SEND RESET REQUEST</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn to="/" size="x-small" variant="text">resend</v-btn>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<style lang="css" scoped>
.v-otp-input {
  border-radius: 50px !important;
}
</style>
