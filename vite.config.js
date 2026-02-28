import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import vuetify from "vite-plugin-vuetify";
import { explicitDynamicRoutes } from "./src/ssg-routes.js";
import fs from "node:fs";

const buildDate = String( process.env.VITE_BULD_DATE || "" ).trim();

// vite.config.js

function sfcMtimePlugin( opts = {} ) {
	const ISO = opts.isoName ?? "__VITE_SFC_MTIME_ISO__";
	const MS = opts.msName ?? "__VITE_SFC_MTIME_MS__";

	const hasScriptSetup = /<script\b[^>]*\bsetup\b[^>]*>/i;
	const hasInjectedConst = ( code ) =>
		new RegExp( `\\bconst\\s+${ISO}\\s*=` ).test( code ) ||
		new RegExp( `\\bconst\\s+${MS}\\s*=` ).test( code );

	return {
		name:    "sfc-mtime-inject",
		enforce: "pre", // vor @vitejs/plugin-vue laufen lassen
		transform( code, id ) {
			const [ file, query = "" ] = id.split( "?", 2 );

			// nur "echte" .vue Dateien, nicht die internen ?vue&type=... Requests
			if ( !file.endsWith( ".vue" ) ) {
				return null;
			}

			if ( query.includes( "vue" ) ) {
				return null;
			}

			// doppelte Injektion vermeiden (nur wenn echte const-Definition bereits existiert)
			if ( hasInjectedConst( code ) ) {
				return null;
			}

			let stat;

			try {
				stat = fs.statSync( file );
			} catch {
				return null;
			}

			const iso = stat.mtime.toISOString();
			const ms = Math.floor( stat.mtimeMs );

			const injected = `\nconst ${ISO} = ${JSON.stringify( iso )};\nconst ${MS} = ${ms};\n`;

			if ( hasScriptSetup.test( code ) ) {
				// in vorhandenes <script setup> direkt rein
				return code.replace( hasScriptSetup, ( m ) => `${m}${injected}` );
			}

			// sonst ein neues <script setup> vor <template> einfügen (oder an den Anfang)
			if ( /<template\b/i.test( code ) ) {
				return code.replace( /<template\b/i,
					`<script setup>${injected}</script>\n\n<template` );
			}

			return `<script setup>${injected}</script>\n\n${code}`;
		}
	};
}

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

function resolveBuildOutDir( normalizedBasePath ) {
	const segments = String( normalizedBasePath || "/" )
		.split( "/" )
		.filter( ( segment ) => segment && segment !== "." && segment !== ".." );

	return segments.length > 0 ? `dist/${segments.join( "/" )}` : "dist";
}

const appBase = normalizeBasePath( process.env.VITE_PUBLIC_BASE || "/" );
const buildOutDir = resolveBuildOutDir( appBase );
const isDebugNoMinify = [ "1", "true", "yes", "on" ].includes( String( process.env.VITE_DEBUG_NO_MINIFY || "" ).trim()
	.toLowerCase() );
const buildConfig = {
	outDir: buildOutDir,
	... isDebugNoMinify ?
		{
			cssMinify: false,
			minify:    false,
			sourcemap: true
		} :
		{}
};
const isConcretePath = ( path ) =>
	typeof path === "string" &&
	path.startsWith( "/" ) &&
	!path.includes( ":" ) &&
	!path.includes( "*" );

export default defineConfig( {
	base:   appBase,
	build:  buildConfig,
	define: {
		"import.meta.env.VITE_BUILD_DATE":       JSON.stringify( buildDate ),
		__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true
	},
	plugins:    [ sfcMtimePlugin(), vue(), vuetify( { autoImport: true } ) ],
	resolve:    { alias: { "@": fileURLToPath( new URL( "./src", import.meta.url ) ) } },
	ssr:        { noExternal: [ "vuetify" ] },
	ssgOptions: {
		dirStyle: "nested",
		async onFinished() {
      		const { generatePdfs } = await import( "./src/utils/generate-pdfs.mjs" );
      		await generatePdfs();
    	},
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
