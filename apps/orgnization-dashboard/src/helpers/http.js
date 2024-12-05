import axios from 'axios';
import cfg from '../config';
import { useAuthStore } from '@/store/auth';
import { useSwal } from '@/composables/useSwal';
import router from '@/routes';

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
    // console.log('test');
    const swal = useSwal();
    if (response?.data?.message && (response?.statusText == 'OK' || response?.statusText == 'Created')) {
      swal.success(response.data.message);
    } else if (response?.data?.message) {
      swal.error(response.data.message);
    }
    return response;
  },
  (error) => {
    console.log('tstes');
    const swal = useSwal();

    if (error?.response?.status == '401') {
      localStorage.removeItem('access_token');
      router.push('/auth/login');
    } else if (error?.response?.data?.message && error?.response?.status == '404') {
      swal.error(error?.response.data.message);
    } else if (error?.response?.data?.message && error?.response?.status == '409') {
      swal.error(error?.response.data.message);
    } else if (error?.response?.data && error?.response?.status == '400') {
      let content = '';
      for (let item in error?.response?.data?.errors) content += `${error?.response?.data.errors[item]}`;
      swal.error(content);
    }

    return Promise.reject(error);
  },
);

export { http, api };
