import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": "/src", // Đặt alias ~ trực tiếp vào thư mục src
    },
  },
});
