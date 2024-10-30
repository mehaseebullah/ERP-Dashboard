import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useOrganizationStore = defineStore({
  id: 'organizationStore',
  state: () => ({
    organizations: [],
  }),
  actions: {
    async fetchOrganizations() {
      const { data } = await api.get('/Tenant/Organization/GetAllOrganization');
      this.organizations = data?.data || [];
      return this.organizations;
    },
    async createOrganization({ title, description, File }) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('File', File);

      const { data } = await api.post('/Tenant/Organization/Create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      this.fetchOrganizations();
      return data?.data;
    },

    async updateOrganization({ id, title, description, isActive, File }) {
      const formData = new FormData();
      formData.append('Id', id);
      formData.append('Title', title);
      formData.append('Description', description);
      formData.append('IsActive', isActive);
      formData.append('File', File);

      const { data } = await api.put('/Tenant/Organization/Update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      this.fetchOrganizations();
      return data?.data;
    },
    async deleteOrganization(OrganizationId) {
      const { data } = await api.delete(`/Tenant/Organization/Delete/${OrganizationId}`);
      this.fetchOrganizations();
      return data?.data;
    },

    async GetOrganizationById(OrganizationId) {
      const { data } = await api.get(`/Tenant/Organization/GetOrganizationById/${OrganizationId}`);
      // this.pRoleUsers = data?.data || [];
      return data?.data;
    },
  },
});
