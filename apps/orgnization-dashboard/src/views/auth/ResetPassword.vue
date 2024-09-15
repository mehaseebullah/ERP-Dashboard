<script setup></script>
<template>
  <v-sheet class="px-16 w-100">
    <v-row>
      <v-col cols="12">
        <div class="text-center">
          <h2 class="mb-4">Reset Password</h2>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field prepend-inner-icon="mdi-key" color="primary" label="Password" variant="outlined"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field
          prepend-inner-icon="mdi-key"
          color="primary"
          label="Confirm password"
          variant="outlined"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-end" cols="12">
        <v-btn type="submit" color="primary">Reset Password</v-btn>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<style lang="scss" scoped></style>
