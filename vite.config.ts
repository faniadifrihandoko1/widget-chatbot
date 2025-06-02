import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "index.html",
          dest: "", // copy langsung ke dist/
        },
      ],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.tsx"),
      name: "chatWidget",
      fileName: (format) => `chat-widget.${format}.js`,
      formats: ["iife"], // hanya satu format
    },
    rollupOptions: {
      // Mark React as external to avoid re-bundling it
      // This ensures the widget uses the parent application's React instance
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
      plugins: [
        {
          name: "remove-console",
          // Remove console.log statements from the widget
          // This is useful for production builds to clean up the output

          transform(code, id) {
            if (id.includes("node_modules")) {
              return code.replace(/console\.log\(([^)]+)\);?/g, "");
            }
          },
        },
      ],
    },
    emptyOutDir: false,
  },
});
