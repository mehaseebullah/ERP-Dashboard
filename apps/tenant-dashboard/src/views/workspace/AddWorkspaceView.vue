<script setup></script>
<template>
  <v-container class="h-100 overflow-y">
    <v-form>
      <div class="d-flex flex-column ga-4">
        <v-card>
          <v-toolbar density="compact" color="primary" class="mb-5" title="WorkSpace Details"></v-toolbar>
          <div class="pa-5">
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field label="Workspace Name" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field label="Domain" required></v-text-field>
              </v-col>
            </v-row>
          </div>
        </v-card>
        <v-card>
          <v-toolbar density="compact" color="primary" class="mb-5" title="Workspace Admin Details"></v-toolbar>
          <div class="pa-5">
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field label="Username" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field label="Email" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field label="Password" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field label="Verify Password" required></v-text-field>
              </v-col>
            </v-row>
          </div>
        </v-card>
        <v-row class="mt-4">
          <v-col class="text-right" cols="12" md="12">
            <v-btn type="reset" color="error" class="mr-2">Cancel</v-btn>
            <v-btn type="submit" color="primary">Create Workspace</v-btn>
          </v-col>
        </v-row>
      </div>
    </v-form>
  </v-container>
</template>

<style lang="scss" scoped></style>
