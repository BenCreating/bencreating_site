import { defineConfig } from "vite"
import { resolve } from "path"

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        edit: resolve(__dirname, "gift/edit.html"),
        preview: resolve(__dirname, "gift/preview.html"),
        view: resolve(__dirname, "gift/view.html"),
      }
    }
  }
})
