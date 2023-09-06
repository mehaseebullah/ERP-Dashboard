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
import { registerPlugins } from './plugins';

const app = createApp(AppCpmponent);

registerPlugins(app);

app.mount('#app');
