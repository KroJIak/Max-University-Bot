/// <reference types="node" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
  const projectRoot = fileURLToPath(new URL('.', import.meta.url));
  const env = loadEnv(mode, projectRoot, '');

  const cloudpubUrl =
    env.CLOUDPUB_URL ||
    env.CLOUDPUB_DOMAIN_URL ||
    env.VITE_CLOUDPUB_URL ||
    env.CLOUDPUB_PUBLIC_URL;

  const allowedHostsSet = new Set<string>(['localhost', '127.0.0.1', '[::1]']);

  if (cloudpubUrl) {
    try {
      const { hostname } = new URL(cloudpubUrl);
      if (hostname) {
        allowedHostsSet.add(hostname);
      }
    } catch (error) {
      console.warn(
        '[vite-config] CLOUDPUB URL в .env не распознан. Проверьте формат (ожидаем полный URL со схемой).'
      );
    }
  }

  if (env.VITE_ALLOWED_HOSTS) {
    env.VITE_ALLOWED_HOSTS.split(',')
      .map((value) => value.trim())
      .filter(Boolean)
      .forEach((host) => allowedHostsSet.add(host));
  }

  const allowedHosts = Array.from(allowedHostsSet);
  const isProdLikeMode = mode !== 'development';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5177,
      strictPort: true,
      cors: true,
      ...(isProdLikeMode && allowedHosts.length > 0
        ? {
            allowedHosts,
          }
        : {
            allowedHosts: true,
          }),
      hmr: {
        protocol: 'ws',
        host: env.VITE_HMR_HOST || undefined,
        port: env.VITE_HMR_PORT ? Number(env.VITE_HMR_PORT) : undefined,
      },
    },
  };
});