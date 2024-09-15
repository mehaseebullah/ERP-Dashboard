import { ref, computed } from 'vue';

export default function (pinia) {
  return {
    install(app) {
      const overlays = ref([]);
      const loaders = ref([]);
      pinia.use(function (ctx) {
        ctx.store.$onAction((action) => {
          if (action.args?.includes('_overlay')) overlays.value.push(action.name);
          if (!action.args?.includes('_silent')) loaders.value.push(action.name);

          const endLoading = () => {
            if (action.args?.includes('_overlay')) {
              let index = overlays.value.findIndex((a) => a === action.name);
              if (index > -1) overlays.value.splice(index, 1);
            } else {
              let index = loaders.value.findIndex((a) => a === action.name);
              if (index > -1) loaders.value.splice(index, 1);
            }
          };

          action.after(() => {
            endLoading();
          });
          action.onError(() => {
            endLoading();
          });
        });
      });

      const $loading = computed(
        () =>
          (waiter = null) =>
            waiter ? loaders.value.includes(waiter) : loaders.value.length > 0,
      );
      const $overlay = computed(
        () =>
          (waiter = null) =>
            waiter ? overlays.value.includes(waiter) : overlays.value.length > 0,
      );

      app.provide('$loading', $loading);
      app.provide('$overlay', $overlay);
    },
  };
}
