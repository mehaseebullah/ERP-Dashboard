<template>
  <v-form>
    <v-container>
      <v-toolbar density="compact" color="primary" class="mb-5" title="Add Customer"></v-toolbar>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field label="Full name" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="Phone No" required></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field label="Email" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="Address" required></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-right" cols="12" md="12">
          <v-btn type="reset" color="error" class="mr-2">Reset</v-btn>
          <v-btn type="submit" color="primary">Submit</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
