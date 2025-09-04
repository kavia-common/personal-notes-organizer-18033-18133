import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

/**
 * Vite dev server configuration
 * - host: true exposes the dev server on all interfaces and permits proxy hostnames.
 * - strictPort: true ensures it stays on 3000 (CI/proxy expects this).
 * - origin/hmr: use VITE_PUBLIC_URL when available (for proxied environments),
 *   otherwise fallback to localhost. This avoids host check and HMR websocket issues.
 * - No hardcoded allowedHosts: Vite 6 handles host checks differently; removing
 *   incompatible options prevents connection refusal via proxy hosts.
 */
export default defineConfig(() => {
  // Safely read PUBLIC URL only from globalThis (ESLint/Node-safe)
  const envVitePublicUrl =
    (typeof globalThis !== 'undefined' && globalThis.VITE_PUBLIC_URL) || '';

  // Derive HMR settings if PUBLIC_URL is present (e.g., https://...kavia.ai:3000)
  let hmr = undefined;
  let origin = undefined;

  if (envVitePublicUrl) {
    try {
      const URLCtor = typeof globalThis !== 'undefined' ? globalThis.URL : undefined;
      const u = URLCtor ? new URLCtor(envVitePublicUrl) : null;
      if (u) {
        origin = `${u.protocol}//${u.host}`;
        hmr = {
          protocol: u.protocol.replace(':', ''),
          host: u.hostname,
          port: u.port ? Number(u.port) : u.protocol === 'https:' ? 443 : 80,
        };
      }
    } catch {
      // If PUBLIC_URL is invalid, ignore and let Vite defaults apply
    }
  }

  return {
    plugins: [preact()],
    server: {
      host: true, // listen on all addresses and accept any hostname
      port: 3000,
      strictPort: true,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      watch: {
        usePolling: true,
      },
      hmr,
      origin,
    },
  };
});
