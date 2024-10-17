import axios from 'axios';
import cfg from '../config';
import { useAuthStore } from '../store/auth';
import { storeToRefs } from 'pinia';

const progHubHttpService = axios.create({ baseURL: cfg.progHubApiUrl }); //prog hub api
const tenantAuthHttpService = axios.create({ baseURL: cfg.tenantAuthApiUrl }); //tenant auth api

progHubHttpService.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    let token = localStorage.getItem('prog_access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // config.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

tenantAuthHttpService.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();

    let token = localStorage.getItem('prog_access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // config.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export { progHubHttpService, tenantAuthHttpService };
