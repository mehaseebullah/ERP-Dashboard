import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useRoleStore = defineStore({
  id: 'roleStore',
  state: () => ({
    users: [],
    userRolePermissions: [],
  }),
  actions: {
    async fetchUsers() {
      const { data } = await api.get('/Tenant/User/GetAllUsers');
      this.users = data?.data || [];
      return this.users;
    },

    async fetchRolePermissions(RoleId) {
      RoleId = 1;
      const { data } = await api.get(`/Tenant/Account/GetRolePermissions/${RoleId}`);
      this.userRolePermissions = data?.data || [];
      return this.userRolePermissions;
    },
  },
});
