import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/dist/sweetalert2.min.css';
import './colors.css';

export function useSwal() {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  const api = {
    success(title, options = {}) {
      Toast.fire({
        icon: 'success',
        title,
        ...options,
      });
    },
    error(title, options = {}) {
      Toast.fire({
        icon: 'error',
        title,
        ...options,
      });
    },
    warning(title, options = {}) {
      Toast.fire({
        icon: 'warning',
        title,
        ...options,
      });
    },
    info(title, options = {}) {
      Toast.fire({
        icon: 'info',
        title,
        ...options,
      });
    },
    question(title, options = {}) {
      Toast.fire({
        icon: 'question',
        title,
        ...options,
      });
    },
    confirm(title, options = {}) {
      return Swal.fire({
        title,
        showCancelButton: true,
        ...options,
      });
    },
  };

  Object.assign(Swal, api);
  return Swal;
}
