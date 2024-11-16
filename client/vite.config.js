import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  endPrefix: "REACT_APP_",
  plugins: [react()],
});
