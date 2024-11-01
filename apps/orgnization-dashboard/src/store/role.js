import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useRoleStore = defineStore({
  id: 'roleStore',
  state: () => ({
    organizationsRoles: [],
    organizationRolePermissions: [],
  }),
  actions: {
    async fetchRolePermissions(RoleId) {
      const { data } = await api.get(`/Tenant/Account/GetRolePermissions/${RoleId}`);
      this.organizationRolePermissions = data?.data || [];
      return this.organizationRolePermissions;
    },
    async invokeRolePermission(RoleId, OrganizationId, selectedCodes) {
      console.log(selectedCodes);

      const { data } = await api.post(
        `/Tenant/Account/InvokeRolePermission/${OrganizationId}/${RoleId}`,
        selectedCodes,
      );

      return data?.data;
    },
    async fetchAllRoles() {
      const { data } = await api.get('/Tenant/User/AllRoles');
      this.organizationsRoles = data?.data || [];
      return this.organizationsRoles;
    },
  },
});
