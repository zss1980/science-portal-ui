import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

// <https://vitejs.dev/config/>
export default defineConfig((env) => {
  const envars = loadEnv(env.mode, './');
  console.log('Loaded environment:', env.mode);
  console.log('Environment variables:', envars);
  const serverURL = new URL(
    envars.VITE_SERVER_URL ?? '<http://localhost:3001>',
  );
  const serverAPIPath = envars.VITE_SERVER_API_PATH ?? '/api';

  return {
    envDir: './',

    // make the API path globally available in the client
    define: {
      __API_PATH__: JSON.stringify(serverAPIPath),
    },

    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    server: {
      port: 5173,
      proxy: {
        // proxy requests with the API path to the server
        // <http://localhost:5173/api> -> <http://localhost:3001/api>
        [serverAPIPath]: serverURL.origin,
      },
    },
  };
});
