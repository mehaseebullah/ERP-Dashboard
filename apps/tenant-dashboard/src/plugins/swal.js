import { useSwal } from '@/composables/useSwal';

export default {
  install(app) {
    const Swal = useSwal();
    app.config.globalProperties.$swal = Swal;
    app.provide('$swal', Swal);
  },
};
