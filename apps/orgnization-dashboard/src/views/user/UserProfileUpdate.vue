<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { defineProps, watch } from 'vue';
import { useSwal } from '@/composables/useSwal';

import { api } from '@/helpers/http';

const swal = useSwal();

const users = ref([]);
const showDrawer = ref(false);
const isLoading = ref(false);
const headers = ref([
  {
    title: 'Username',
    key: 'username',
    sortable: true,
  },
  {
    title: 'Email',
    key: 'email',
    sortable: true,
  },
  {
    title: 'Profile Picture',
    key: 'profilePicturePath',
    sortable: true,
  },
  {
    title: 'Role',
    key: 'roles',
    sortable: true,
  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
  // ... more items
]);

const formModal = {
  id: null,
  username: '',
  email: '',
  password: '',
  reportToId: 0,
  role: '',

  firstName: '',
  lastName: '',
  phoneNumber: '',
  address: '',
  cityId: 0,
  stateId: 0,
  zipCode: '',
  countryId: 0,
  genderId: 0,
  bio: '',
  preferences: '',
};

// const userUpdateData = {
//   firstName: '',
//   lastName: '',
//   phoneNumber: '',
//   address: '',
//   //cityId: 0,
//   //stateId: 0,
//   zipCode: '',
//   //countryId: 0,
//   //genderId: 0,
//   bio: '',
//   preferences: '',
//   id: 0,
//   //reportToId: 0,
// };
// const formData = ref({ ...formModal });
// const isEdit = ref(false);

const props = defineProps({
  user: Object,
  show: Boolean,
});

const userData = ref({ ...props.user });

// Watch for changes in the user prop to update userData
watch(
  () => props.user,
  (newUser) => {
    userData.value = { ...newUser };
  },
);

async function updateUser() {
  // try {
  //   const updatedUser = { ...formData.value }; // Get the updated user data
  //   // Remove password if not updated
  //   if (!updatedUser.password) delete updatedUser.password;
  //   // const { data } = await api.put(`/Tenant/User/Update/${formData.value.id}`, updatedUser); // Update API endpoint
  //   const { data } = await api.put('/Tenant/User/Update', userUpdateData); // Update API endpoint
  //   // Update the user in the users array
  //   const index = users.value.findIndex((u) => u.id === formData.value.id);
  //   if (index !== -1) users.value[index] = data.data;
  //   swal.success('User updated successfully!');
  //   showDrawer.value = false;
  // } catch (error) {
  //   swal.error('Error updating user!');
  //   console.error('Error updating user:', error);
  // }
}

onMounted(async () => {
  //fetchUser();
});
</script>

<!-- UserProfileUpdate.vue -->
<template>
  <v-dialog v-model="show" max-width="600">
    <v-card>
      <v-card-title>Edit User</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="updateUser">
          <v-text-field v-model="userData.firstName" label="First Name"></v-text-field>
          <v-text-field v-model="userData.lastName" label="Last Name"></v-text-field>
          <v-text-field v-model="userData.phoneNumber" label="Phone Number"></v-text-field>
          <v-text-field v-model="userData.address" label="Address"></v-text-field>
          <v-text-field v-model="userData.cityId" label="City ID" type="number"></v-text-field>
          <v-text-field v-model="userData.stateId" label="State ID" type="number"></v-text-field>
          <v-text-field v-model="userData.zipCode" label="Zip Code"></v-text-field>
          <v-text-field v-model="userData.countryId" label="Country ID" type="number"></v-text-field>
          <v-text-field v-model="userData.genderId" label="Gender ID" type="number"></v-text-field>
          <v-textarea v-model="userData.bio" label="Bio"></v-textarea>
          <v-textarea v-model="userData.preferences" label="Preferences"></v-textarea>

          <!-- Display read-only fields -->
          <v-text-field v-model="userData.username" label="Username" readonly></v-text-field>
          <v-text-field v-model="userData.email" label="Email" readonly></v-text-field>
          <v-text-field v-model="userData.reportToId" label="Report To ID" readonly type="number"></v-text-field>
          <v-text-field v-model="userData.id" label="User ID" readonly type="number"></v-text-field>

          <v-btn type="submit" color="primary">Update</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
