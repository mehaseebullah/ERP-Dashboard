import axios from 'axios';
import cfg from '../config';
import useStores from '@/stores';

const httpService = axios.create({ baseURL: cfg.apiUrl });

httpService.interceptors.request.use(
  (config) => {
    const { authStore } = useStores();
    let token = authStore.token;
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
