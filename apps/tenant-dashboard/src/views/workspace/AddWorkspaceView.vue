<script setup>

</script>
<template>
    <div class="pa-5">
        <v-form>
            <v-container>
                <v-toolbar density="compact" color="primary" class="mb-5" title=" WorkSpace"></v-toolbar>

                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field label="Domain" required></v-text-field>
                    </v-col>
                  
                </v-row>
             
                <v-row>
                    <v-col class="text-right" cols="12" md="12">
                        <v-btn type="reset" color="error" class="mr-2">Reset</v-btn>
                        <v-btn type="submit" color="primary">Create</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
    </div>
</template>



<style lang="scss" scoped></style>