/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
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
  app.use(loader(pinia));
  app.use(pinia);
  app.use(swal);
}
