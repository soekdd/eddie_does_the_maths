import { fileURLToPath, URL } from "node:url";
import path from "node:path";

import vue from "@vitejs/plugin-vue";
import fg from "fast-glob";
import sharp from "sharp";
import { defineConfig } from "vite";
import vuetify from "vite-plugin-vuetify";
import { localizedExplicitDynamicRoutes } from "./src/utils/ssg-routes.js";
import fs from "node:fs";

const buildDate = String( process.env.VITE_BULD_DATE || "" ).trim();
const projectRoot = fileURLToPath( new URL( ".", import.meta.url ) );
const thumbnailVirtualModuleId = "virtual:eddie-image-thumbnails";
const resolvedThumbnailVirtualModuleId = `\0${thumbnailVirtualModuleId}`;
const sourceImagesDirectory = path.join( projectRoot, "src" );
const thumbnailPublicDirectory = path.join(
	projectRoot, "public", "thumbnails"
);
const THUMBNAIL_WIDTH_PX = 360;

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

function toPosixPath( value ) {
	return value.split( path.sep ).join( "/" );
}

async function thumbnailNeedsUpdate( sourcePath, thumbnailPath ) {
	try {
		const [ sourceStat, thumbnailStat ] = await Promise.all( [
			fs.promises.stat( sourcePath ),
			fs.promises.stat( thumbnailPath )
		] );

		return sourceStat.mtimeMs > thumbnailStat.mtimeMs;
	} catch {
		return true;
	}
}

function imageThumbnailPlugin() {
	let sourceImages = [];

	return {
		name: "eddie-image-thumbnails",
		async buildStart() {
			sourceImages = await fg( "src/**/*.webp", {
				absolute:  true,
				cwd:       projectRoot,
				onlyFiles: true
			} );

			await Promise.all( sourceImages.map( async( sourcePath ) => {
				const relativePath = toPosixPath( path.relative( sourceImagesDirectory, sourcePath ) );
				const thumbnailPath = path.join( thumbnailPublicDirectory, relativePath );

				if ( ! await thumbnailNeedsUpdate( sourcePath, thumbnailPath ) ) {
					return;
				}

				await fs.promises.mkdir( path.dirname( thumbnailPath ), { recursive: true } );
				await sharp( sourcePath )
					.rotate()
					.resize( { width: THUMBNAIL_WIDTH_PX, withoutEnlargement: true } )
					.webp( { quality: 82 } )
					.toFile( thumbnailPath );
			} ) );
		},
		resolveId( id ) {
			return id === thumbnailVirtualModuleId ? resolvedThumbnailVirtualModuleId : null;
		},
		load( id ) {
			if ( id !== resolvedThumbnailVirtualModuleId ) {
				return null;
			}

			const imports = sourceImages.map( ( sourcePath, index ) =>
				`import image${index} from ${JSON.stringify( sourcePath )};` );
			const entries = sourceImages.map( ( sourcePath, index ) => {
				const relativePath = toPosixPath( path.relative( sourceImagesDirectory, sourcePath ) );

				return `[ image${index} ]: thumbnailBasePath + ${JSON.stringify( relativePath )}`;
			} );

			return [
				...imports,
				"const thumbnailBasePath = import.meta.env.BASE_URL + \"thumbnails/\";",
				`export const thumbnailByOriginal = Object.freeze( { ${entries.join( ", " )} } );`
			].join( "\n" );
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
	plugins:    [ imageThumbnailPlugin(), sfcMtimePlugin(), vue(), vuetify( { autoImport: true } ) ],
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
			const concreteDynamic = localizedExplicitDynamicRoutes.filter( isConcretePath );

			return Array.from( new Set( [
				...concreteFromDefaults,
				...concreteFromRouter,
				...concreteDynamic
			] ) );
		}
	}
} );
