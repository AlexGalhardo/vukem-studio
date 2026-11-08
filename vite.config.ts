import { fileURLToPath } from "node:url";
import inertia from "@inertiajs/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import vukem from "./resources/vite/vukem.js";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./resources/js", import.meta.url)) } },
  plugins: [
    tailwindcss(),
    react(),
    inertia(),
    vukem({ input: ["resources/css/app.css", "resources/js/app.tsx"] }),
  ],
});
