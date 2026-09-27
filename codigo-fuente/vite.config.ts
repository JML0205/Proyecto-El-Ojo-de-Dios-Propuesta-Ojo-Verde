import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Build de exportación: modo SPA 100% estático, sin servidor.
export default defineConfig({
  tanstackStart: {
    spa: { enabled: true },
  },
  nitro: false,
});
