<template>
  <v-form>
    <v-container>
      <v-toolbar density="compact" color="primary" class="mb-5" title="Add Unit"></v-toolbar>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field label="Title" required></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea label="Description"></v-textarea>
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
