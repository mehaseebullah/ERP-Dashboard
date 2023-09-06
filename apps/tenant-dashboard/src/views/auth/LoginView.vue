<script setup>
import { reactive } from 'vue';

const state = reactive({
  showPass: false,
});

const togglePass = () => {
  state.showPass = !state.showPass;
};
</script>
<template>
  <v-row class="h-100 ma-0">
    <v-col cols="12" md="6" class="d-none d-md-flex h-100 bg-primary justify-center align-center">
      <div class="text-center">
        <h1>Demo</h1>
        <br />
        <h2>Data</h2>
      </div>
    </v-col>
    <v-col class="h-100 d-flex justify-center align-center" cols="12" md="6">
      <v-sheet class="px-16 w-100">
        <v-form>
          <v-row>
            <v-col cols="12">
              <v-text-field
                prepend-inner-icon="mdi-account"
                color="primary"
                label="username"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                prepend-inner-icon="mdi-key"
                color="primary"
                label="password"
                variant="outlined"
                :append-inner-icon="state.showPass ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="togglePass()"
                :type="state.showPass ? 'text' : 'password'"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-btn to="/register" size="small" variant="text">Create new account</v-btn>
            </v-col>
            <v-col class="text-right" cols="6">
              <v-btn color="primary">Login</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-sheet>
    </v-col>
  </v-row>
</template>
