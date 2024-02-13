<script setup></script>
<template>
  <v-app>
    <v-main>
      <v-row class="h-100 ma-0">
        <v-col cols="12" md="6" class="d-none d-md-flex h-100 bg-primary justify-center align-center">
          <div class="text-center">
            <h1>Demo</h1>
            <br />
            <h2>Data</h2>
          </div>
        </v-col>
        <v-col class="h-100 d-flex justify-center align-center" cols="12" md="6">
          <router-view />
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>
