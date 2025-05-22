import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import type { LibraryFormats } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Export the main config for the library
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
	build: {
		lib: {
			// Main entry point for the entire library
			entry: resolve(__dirname, "lib/main.ts"),
			name: "overflwn",
			fileName: (format) => `overflwn.${format}.js`,
			formats: ["es", "umd"] as LibraryFormats[],
		},
		rollupOptions: {
			external: ["react", "react-dom"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
			},
		},
		// Generate TypeScript declaration files
		emptyOutDir: true,
	},
});
