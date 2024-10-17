import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useUserStore = defineStore({
  id: 'userStore',
  state: () => ({
    users: [],
    userRoles: [],
    pRoleUsers: [],
    userPermissions: [],
    userCountries: [],
    userStates: [],
    userCities: [],
    userGenders: [],
  }),
  actions: {
    async fetchUsers() {
      const { data } = await api.get('/Tenant/User/GetAllUsers');
      this.users = data?.data || [];
      return this.users;
    },
    async createUser({ username, password, email, roleId, reportToId }) {
      const { data } = await api.post('/Tenant/User/Create', { username, password, email, roleId, reportToId });
      this.fetchUsers();
      return data?.data;
    },
    async uploadUserImg({ Id, ProfilePicturePath, File }) {
      const formData = new FormData();
      formData.append('Id', Id);
      formData.append('File', File);
      formData.append('ProfilePicturePath', ProfilePicturePath);
      const { data } = await api.put('/Tenant/User/UploadFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data?.data;
    },
    async updateUser(updatedUser) {
      const { data } = await api.put('/Tenant/User/Update', updatedUser);
      this.fetchProducts();
      return data?.data;
    },
    async deleteUser({ UserId }) {
      const { data } = await api.delete(`/Tenant/User/Delete/${UserId}`);
      this.fetchUsers();
      return data?.data;
    },
    async fetchUserRoles() {
      const { data } = await api.get('/Tenant/User/AllRoles');
      this.userRoles = data?.data || [];
      return this.userRoles;
    },

    async fetchPermissions(UserId) {
      const { data } = await api.get(`/Tenant/Account/GetUserPermissions/${UserId}`);
      this.userPermissions = data?.data || [];
      return this.userPermissions;
    },
    async GetUserByParentRoleId(pRoleId) {
      const { data } = await api.get(`/Tenant/User/GetUsersByRoleId?RoleId=${pRoleId}`);
      this.pRoleUsers = data?.data || [];
      return this.pRoleUsers;
    },
    async fetchUserCountries() {
      const DefinitionTypeKeyCode = 'CNT';
      const { data } = await api.get(
        `/Tenant/TenantDefinitions/GetDefinitionByDefinitionTypeKeyCode/${DefinitionTypeKeyCode}`,
      );
      this.userCountries = data?.data || [];
      return this.userCountries;
    },
    async fetchUserStates(Id) {
      const { data } = await api.get(`/Tenant/TenantDefinitions/GetDefinitionByParentDefinitionId/${Id}`);
      this.userStates = data?.data || [];
      return this.userStates;
    },
    async fetchUserCities(Id) {
      const { data } = await api.get(`/Tenant/TenantDefinitions/GetDefinitionByParentDefinitionId/${Id}`);
      this.userCities = data?.data || [];
      return this.userCities;
    },

    async fetchUserGenders() {
      const DefinitionTypeKeyCode = 'GENDER';
      const { data } = await api.get(
        `/Tenant/TenantDefinitions/GetDefinitionByDefinitionTypeKeyCode/${DefinitionTypeKeyCode}`,
      );
      this.userGenders = data?.data || [];
      return this.userGenders;
    },
  },
});
