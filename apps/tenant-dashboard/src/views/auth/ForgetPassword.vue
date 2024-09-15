<script setup></script>
<template>
  <v-sheet class="px-16 w-100">
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
        <v-text-field prepend-inner-icon="mdi-account" color="primary" label="email" variant="outlined"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-end" cols="12">
        <v-btn type="submit" color="primary">SEND RESET REQUEST</v-btn>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<style lang="scss" scoped></style>
