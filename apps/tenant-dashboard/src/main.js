/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import AppCpmponent from './App.vue';

// Composables
import { createApp } from 'vue';

// Plugins
import { registerPlugins } from './core/plugins';
import { registerRouter } from './router';

const app = createApp(AppCpmponent);

registerPlugins(app);
registerRouter(app);

app.mount('#app');
