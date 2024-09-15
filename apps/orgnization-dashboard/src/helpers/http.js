import axios from 'axios';
import cfg from '../config';
import { useAuthStore } from '@/store/auth';
import { useSwal } from '@/composables/useSwal';

const api = axios.create({
  baseURL: cfg.apiUrl,
  headers: {
    'Cache-Control': 'max-age=0',
    Authorization: localStorage.getItem('access_token'),
  },
});
const http = axios.create({
  baseURL: cfg.apiUrl,
});

// const httpService = axios.create({ baseURL: cfg.apiUrl });

api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('access_token');
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

api.interceptors.response.use(
  (response) => {
    const swal = useSwal();
    if (response?.data?.message && response?.data?.status == 'ok') {
      swal.success(response.data.message);
    } else if (response?.data?.message) {
      swal.error(response.data.message);
    }
    return response;
  },
  (error) => {
    const swal = useSwal();
    if (error?.response?.data?.message && error?.response?.data?.status == 'error') {
      swal.error(error?.response.data.message);
    }
    return Promise.reject(error);
  },
);

export { http, api };
