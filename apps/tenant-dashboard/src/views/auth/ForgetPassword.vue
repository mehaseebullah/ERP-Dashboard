<script setup>

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
                        <v-text-field prepend-inner-icon="mdi-account" color="primary" label="email"
                            variant="outlined"></v-text-field>
                    </v-col>

                </v-row>
                <v-row>

                    <v-col class="text-end" cols="12">
                        <v-btn type="submit" color="primary">SEND RESET REQUEST</v-btn>
                    </v-col>

                </v-row>

            </v-sheet>

        </v-col>
    </v-row>
</template>


<style lang="scss" scoped></style>