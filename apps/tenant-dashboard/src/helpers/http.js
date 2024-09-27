import axios from 'axios';
import cfg from '../config';
import { useAuthStore } from '@/store/auth';

const httpService = axios.create({ baseURL: cfg.apiUrl });

httpService.interceptors.request.use(
  (config) => {
    const { authStore } = useAuthStore();

    //let token = authStore?.token;
    let token = localStorage.getItem('access_token');
    // let token =
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiIyMDAwMyIsIlVzZXJuYW1lIjoiZGVtbzEzIiwiRW1haWwiOiJkZW1vMTNAZ21haWwuY29tIiwiREJUeXBlIjoiMSIsIkRhdGFiYXNlSWQiOiIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJUZW5hbnQiLCJleHAiOjE3Mjc0NDU2MzV9.Chh-iDlsNZELMD3o8bX7p_vSjKOXAGhFSDph_ggZmRk';
    console.log('here... authstore local storage http', token, localStorage.getItem('access_token'));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // config.headers.common['Authorization'] = `Bearer ${token}`;
      //   config.headers.common['Authorization'] = token;
    }
    return config;
  },
  (error) => {
    console.log('here...');

    return Promise.reject(error);
  },
);

export default httpService;
