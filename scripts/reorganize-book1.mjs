#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );
const projectRoot = path.resolve( __dirname, ".." );
const srcDir = path.join( projectRoot, "src" );
const viewsDir = path.join( srcDir, "views" );
const imagesDir = path.join( srcDir, "images" );
const book1Dir = path.join( srcDir, "book1" );
const contentIndexPath = path.join( srcDir, "components", "ContentIndex.vue" );

function exists( filePath ) {
	return fs.existsSync( filePath );
}

function listFiles( dirPath ) {
	if ( !exists( dirPath ) ) {
		return [];
	}

	return fs.readdirSync( dirPath, { withFileTypes: true } )
		.filter( ( entry ) => entry.isFile() )
		.map( ( entry ) => entry.name );
}

function walkFiles(
	rootPath, out = []
) {
	if ( !exists( rootPath ) ) {
		return out;
	}

	for ( const entry of fs.readdirSync( rootPath, { withFileTypes: true } ) ) {
		const fullPath = path.join( rootPath, entry.name );

		if ( entry.isDirectory() ) {
			walkFiles( fullPath, out );
			continue;
		}

		out.push( fullPath );
	}

	return out;
}

function moveFile(
	fromPath, toPath
) {
	if ( !exists( fromPath ) ) {
		return false;
	}

	fs.mkdirSync( path.dirname( toPath ), { recursive: true } );

	if ( exists( toPath ) ) {
		return false;
	}

	fs.renameSync( fromPath, toPath );
	return true;
}

function rewriteImports(
	source, codes
) {
	let result = source;

	for ( const code of codes ) {
		result = result.split( `@/views/${code}` )
			.join( `@/book1/${code}/${code}` );
		result = result.split( `@/images/${code}` )
			.join( `@/book1/${code}/${code}` );
	}

	return result;
}

function rewriteMovedFileRelativeImages(
	source, code
) {
	return source.split( `../images/${code}` )
		.join( `./${code}` );
}

function rewriteMovedFileCrossCodeVueImports(
	source, currentCode, codeSet
) {
	return source.replace(
		/(\.\/|\.\.\/)([A-Z0-9]{2}[^"'`\n/]*\.vue)/g,
		( match, _relativePrefix, vueFileName ) => {
			const targetCode = vueFileName.slice( 0, 2 );

			if ( targetCode === currentCode || !codeSet.has( targetCode ) ) {
				return match;
			}

			return `@/book1/${targetCode}/${vueFileName}`;
		}
	);
}

function rewriteMovedFileRelativeUtils( source ) {
	return source.split( "../utils/" )
		.join( "../../utils/" );
}

function updateContentIndex( source ) {
	const imageGlobRe = /import\.meta\.glob\(\s*"@\/images\/\*\.webp"\s*,\s*\{\s*eager:\s*true,\s*import:\s*"default"\s*\}\s*\)/;

	if ( !imageGlobRe.test( source ) ) {
		return source;
	}

	return source.replace(
		imageGlobRe,
		"import.meta.glob( [ \"@/images/*.webp\", \"@/book1/*/*.webp\" ], { eager: true, import: \"default\" } )"
	);
}

const rootViewFiles = listFiles( viewsDir )
	.filter( ( fileName ) => /^[A-Z0-9]{2}\.vue$/.test( fileName ) )
	.sort();

const rootViewCodes = rootViewFiles.map( ( fileName ) => fileName.slice( 0, 2 ) );
const book1Codes = exists( book1Dir )
	? fs.readdirSync( book1Dir, { withFileTypes: true } )
		.filter( ( entry ) => entry.isDirectory() && /^[A-Z0-9]{2}$/.test( entry.name ) )
		.map( ( entry ) => entry.name )
	: [];

const codes = Array.from( new Set( [
	...rootViewCodes,
	...book1Codes
] ) ).sort();
const codeSet = new Set( codes );

if ( codes.length === 0 ) {
	console.log( "Keine zweibuchstabigen Kapitelcodes in src/views oder src/book1 gefunden." );
	process.exit( 0 );
}

fs.mkdirSync( book1Dir, { recursive: true } );

for ( const code of rootViewCodes ) {
	fs.mkdirSync( path.join( book1Dir, code ), { recursive: true } );
}

const allViewFiles = listFiles( viewsDir ).filter( ( fileName ) => fileName.endsWith( ".vue" ) );
let movedViews = 0;
let movedImages = 0;

for ( const code of rootViewCodes ) {
	for ( const fileName of allViewFiles ) {
		if ( !fileName.startsWith( code ) ) {
			continue;
		}

		const fromPath = path.join( viewsDir, fileName );
		const toPath = path.join( book1Dir, code, fileName );

		if ( moveFile( fromPath, toPath ) ) {
			movedViews += 1;
		}
	}
}

const allImageFiles = listFiles( imagesDir );

for ( const code of rootViewCodes ) {
	for ( const fileName of allImageFiles ) {
		if ( !fileName.startsWith( code ) ) {
			continue;
		}

		const fromPath = path.join( imagesDir, fileName );
		const toPath = path.join( book1Dir, code, fileName );

		if ( moveFile( fromPath, toPath ) ) {
			movedImages += 1;
		}
	}
}

const textFiles = walkFiles( srcDir )
	.filter( ( filePath ) => /\.(vue|js|mjs|ts)$/i.test( filePath ) );

let rewrittenFiles = 0;

for ( const filePath of textFiles ) {
	let source = fs.readFileSync( filePath, "utf8" );
	let updated = rewriteImports( source, codes );

	for ( const code of codes ) {
		const movedDir = `${path.join( book1Dir, code )}${path.sep}`;

		if ( filePath.startsWith( movedDir ) ) {
			updated = rewriteMovedFileRelativeImages( updated, code );
			updated = rewriteMovedFileCrossCodeVueImports( updated, code, codeSet );
			updated = rewriteMovedFileRelativeUtils( updated );
			break;
		}
	}

	if ( filePath === contentIndexPath ) {
		updated = updateContentIndex( updated );
	}

	if ( updated !== source ) {
		fs.writeFileSync( filePath, updated, "utf8" );
		rewrittenFiles += 1;
	}
}

const routerTargets = [
	path.join( srcDir, "router.mjs" ),
	path.join( srcDir, "router.js" )
].filter( exists );

if ( routerTargets.length === 0 ) {
	console.log( "Hinweis: Keine router.mjs/router.js unter src gefunden." );
}

console.log( `Codes: ${codes.join( ", " )}` );
console.log( `Verschobene Views: ${movedViews}` );
console.log( `Verschobene Images: ${movedImages}` );
console.log( `Aktualisierte Dateien: ${rewrittenFiles}` );
