import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import vuetify from "vite-plugin-vuetify";

const buildDate = new Date().toISOString();

export default defineConfig( {
	base:    "./",
	define:  { "import.meta.env.VITE_BUILD_DATE": JSON.stringify( buildDate ) },
	plugins: [ vue(), vuetify( { autoImport: true } ) ],
	resolve: { alias: { "@": fileURLToPath( new URL( "./src", import.meta.url ) ) } }
} );
