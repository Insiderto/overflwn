import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Export the main config for the library
export default defineConfig({
	plugins: [react({
		jsxRuntime: "automatic",
		jsxImportSource: "react",
		babel: {
			plugins: [
				["@babel/plugin-transform-react-jsx", { runtime: "automatic" }]
			]
		}
	}), tailwindcss(), dts({ 
		include: ["lib"],
		outDir: "dist",
		tsconfigPath: "./tsconfig.lib.json"
	})],
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
	build: {
		copyPublicDir: false,
		lib: {
			// Main entry point for the entire library
			entry: resolve(__dirname, "lib/main.ts"),
			name: "overflwn",
			formats: ["es", "umd"],
		},
		rollupOptions: {
			external: ["react", "react-dom", "react/jsx-runtime"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
					"react/jsx-runtime": "jsxRuntime"
				}
			},
		},
		// Generate TypeScript declaration files
		emptyOutDir: true,
	},
});
