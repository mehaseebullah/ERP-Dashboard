/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { markRaw } from 'vue';
import { loadFonts } from './webfontloader';
import vuetify from './vuetify';
import router from '../routes';
import pinia from '../store';
import swal from './swal';
import loader from './loader';

export function registerPlugins(app) {
  loadFonts();
  app.use(router);
  app.use(vuetify);
  pinia.use(({ store }) => {
    store.$router = markRaw(router);
  });
  app.use(loader(pinia));
  app.use(pinia);
  app.use(swal);
}
