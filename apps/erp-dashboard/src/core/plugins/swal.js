import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/dist/sweetalert2.min.css';

export default {
  install(app, options = {}) {
    const swalLocalInstance = Swal.mixin(options);

    const swalFunction = function (...args) {
      return swalLocalInstance.fire.call(swalLocalInstance, ...args);
    };

    Object.assign(swalFunction, Swal);

    Object.keys(Swal)
      //@ts-ignore
      .filter((key) => typeof Swal[key] === 'function')
      .forEach((methodName) => {
        //@ts-ignore
        swalFunction[methodName] = swalLocalInstance[methodName].bind(swalLocalInstance);
      });
    app.config.globalProperties.$swal = swalFunction;
    app.provide('$swal', swalFunction);
  },
};
