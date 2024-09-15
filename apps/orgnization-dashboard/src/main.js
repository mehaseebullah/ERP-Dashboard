/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

import './assets/main.css';

// Components
import AppCpmponent from './App.vue';

// Composables
import { createApp } from 'vue';

// Plugins
import { registerPlugins } from './plugins';

(async () => {
  const app = await registerPlugins(createApp(AppCpmponent));
  app.mount('#app');
})();
