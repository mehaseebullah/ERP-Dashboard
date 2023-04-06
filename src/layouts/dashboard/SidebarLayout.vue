<script setup>
const mainStore = useMainStore();
</script>
<template>
  <v-navigation-drawer v-model="mainStore.showSidebar" elevation="4" floating>
    <template v-slot:prepend>
      <v-list-item
        lines="two"
        prepend-avatar="https://randomuser.me/api/portraits/women/81.jpg"
        title="Jane Smith"
        subtitle="Logged in"
      ></v-list-item>
    </template>

    <v-divider></v-divider>

    <v-list active-color="primary" density="compact" nav>
      <v-list-item exact to="/dashboard" prepend-icon="mdi-home-city" title="Home"></v-list-item>
      <v-list-item to="/dashboard/customers" prepend-icon="mdi-account-group" title="Customers"></v-list-item>
      <v-list-item to="/dashboard/suppliers" prepend-icon="mdi-briefcase" title="Suppliers"></v-list-item>
      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-view-list" title="Inventory"></v-list-item>
        </template>
        <v-list-item to="/dashboard/product/categories" title="Product Categories"></v-list-item>
        <v-list-item title="Products"></v-list-item>
        <v-list-item title="Units"></v-list-item>
      </v-list-group>
      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-cart" title="Procurement"></v-list-item>
        </template>
        <v-list-item title="Purchase Order"></v-list-item>
        <v-list-item title="Purchase Invoice"></v-list-item>
        <v-list-item title="Payment"></v-list-item>
      </v-list-group>
      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-basket" title="Sales"></v-list-item>
        </template>
        <v-list-item title="Sale Order"></v-list-item>
        <v-list-item title="Sale Invoice"></v-list-item>
        <v-list-item title="Receipt"></v-list-item>
      </v-list-group>
      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-book" title="Accounting"></v-list-item>
        </template>
        <v-list-item title="Chart of Accounts"></v-list-item>
        <v-list-item title="Journal Entries"></v-list-item>
      </v-list-group>
      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-note" title="Reports"></v-list-item>
        </template>
        <v-list-item title="Trial Balance"></v-list-item>
        <v-list-item title="Balance Sheet"></v-list-item>
      </v-list-group>
      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-wrench" title="Settings"></v-list-item>
        </template>
        <v-list-item title="Change Password"></v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>
