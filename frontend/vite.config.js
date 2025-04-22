import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
dotenv.config();

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (e.g., development, production)
  const env = loadEnv(mode, process.cwd());

  // Debugging output to confirm VITE_GOOGLE_CLIENT_ID is being loaded
  console.log('VITE_GOOGLE_CLIENT_ID:', process.env.VITE_GOOGLE_CLIENT_ID);



  return {
    root: 'src',
    plugins: [react()],
    define: {
      'process.env': env, // Pass loaded env variables into the app
    },
  };
});

