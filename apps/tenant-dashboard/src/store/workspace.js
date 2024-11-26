import { defineStore } from 'pinia';
import { progHubHttpService, tenantAuthHttpService } from '@/helpers/http';
// import { swal } from 'sweetalert2/dist/sweetalert2';
import { useSwal } from '@/composables/useSwal';
const swal = useSwal();

export const useWorkspaceStore = defineStore({
  id: 'workspaceStore',
  state: () => ({
    workspaceDetails: [],
    userDetails: [],
  }),
  actions: {
    async createWorkspace({ subDomain, domain, title, username, password, email }) {
      const { data } = await progHubHttpService.post('/Tenant/Workspace/Create', {
        subDomain,
        domain,
        title,
        username,
        password,
        moduleFeaturePermission: [],
        email,
      });

      return data;
    },

    async getWorkspaceByUserId() {
      const { data } = await progHubHttpService.get('/Tenant/Workspace/GetWorkspaceByUserId');
      this.workspaceDetails = data?.data[0] || [];
      return data;
    },
    async getAdministratorUserDetail() {
      const { data } = await tenantAuthHttpService.get('/Tenant/User/GetAdministratorUserDetail');
      this.userDetails = data?.data[0] || [];
      return data;
    },
  },
});
