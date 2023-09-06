import axios from 'axios';
import cfg from '../config';
import { useAuthStore } from '@/store/auth';

const httpService = axios.create({ baseURL: cfg.apiUrl });

httpService.interceptors.request.use(
  (config) => {
    const { authStore } = useAuthStore();
    let token = authStore?.token;
    if (token) {
      config.headers.Authorization = token;
      //   config.headers.common['Authorization'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default httpService;
