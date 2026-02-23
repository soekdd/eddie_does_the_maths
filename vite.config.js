import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import vuetify from "vite-plugin-vuetify";
import { explicitDynamicRoutes } from "./src/ssg-routes.js";

const buildDate = String( process.env.VITE_BUILD_DATE || "" ).trim();

function normalizeBasePath( basePath ) {
	const asString = String( basePath || "/" ).trim();

	if ( !asString || asString === "/" ) {
		return "/";
	}

	let normalized = asString;

	if ( !normalized.startsWith( "/" ) ) {
		normalized = `/${normalized}`;
	}

	if ( !normalized.endsWith( "/" ) ) {
		normalized = `${normalized}/`;
	}

	return normalized;
}

const appBase = normalizeBasePath( process.env.VITE_PUBLIC_BASE || "/" );
const isConcretePath = ( path ) =>
	typeof path === "string" &&
	path.startsWith( "/" ) &&
	!path.includes( ":" ) &&
	!path.includes( "*" );

export default defineConfig( {
	base:       appBase,
	define:     {
		"import.meta.env.VITE_BUILD_DATE": JSON.stringify( buildDate ),
		__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true
	},
	plugins:    [ vue(), vuetify( { autoImport: true } ) ],
	resolve:    { alias: { "@": fileURLToPath( new URL( "./src", import.meta.url ) ) } },
	ssr:        { noExternal: [ "vuetify" ] },
	ssgOptions: {
		dirStyle: "nested",
		includedRoutes( paths, routeRecords ) {
			const concreteFromRouter = ( routeRecords ?? [] )
				.map( ( route ) => route?.path )
				.filter( isConcretePath );
			const concreteFromDefaults = ( paths ?? [] ).filter( isConcretePath );
			const concreteDynamic = explicitDynamicRoutes.filter( isConcretePath );

			return Array.from( new Set( [
				...concreteFromDefaults,
				...concreteFromRouter,
				...concreteDynamic
			] ) );
		}
	}
} );
