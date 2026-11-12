import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  // Relative assets work on both user Pages and repository Pages.
  base: "./",
});
