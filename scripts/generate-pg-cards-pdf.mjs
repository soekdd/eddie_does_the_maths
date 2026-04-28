import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFile as execFileCallback } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import vue from "@vitejs/plugin-vue";
import puppeteer from "puppeteer";
import { createServer } from "vite";
import vuetify from "vite-plugin-vuetify";

const execFile = promisify( execFileCallback );

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const projectRoot = path.resolve( __dirname, ".." );

function readArg( name, fallback ) {
	const prefix = `--${name}=`;
	const value = process.argv.find( ( arg ) => arg.startsWith( prefix ) );

	return value ? value.slice( prefix.length ) : fallback;
}

const output = path.resolve( projectRoot,
	readArg( "output", "dist/pg-cards.pdf" ) );
const backgroundOutput = path.resolve( projectRoot,
	readArg( "background-output", "dist/pg-cards_background.pdf" ) );
const backgroundSource = path.resolve( projectRoot,
	readArg( "background-source", "scripts/card_background.pdf" ) );
const locale = readArg( "locale", "de" );
const pageCount = 55;
const pageWidthPt = 184.08;
const pageHeightPt = 275.04;

function readJpegSize( jpeg ) {
	let offset = 2;

	while ( offset < jpeg.length ) {
		if ( jpeg[ offset ] !== 0xFF ) {
			break;
		}

		const marker = jpeg[ offset + 1 ];
		const length = jpeg.readUInt16BE( offset + 2 );

		if ( marker >= 0xC0 && marker <= 0xC3 ) {
			return {
				height: jpeg.readUInt16BE( offset + 5 ),
				width:  jpeg.readUInt16BE( offset + 7 )
			};
		}

		offset += 2 + length;
	}

	throw new Error( "Could not read rendered background JPEG dimensions." );
}

function createPdfFromRepeatedJpeg( {
	jpeg,
	outputPath,
	pages
} ) {
	const imageSize = readJpegSize( jpeg );
	const pageObjectIds = Array.from( { length: pages },
		( _, index ) => 5 + index );
	const chunks = [];
	const offsets = [ 0 ];
	let byteOffset = 0;

	const append = ( chunk ) => {
		const buffer = Buffer.isBuffer( chunk ) ? chunk : Buffer.from( chunk, "latin1" );

		chunks.push( buffer );
		byteOffset += buffer.length;
	};

	const appendObject = ( id, body ) => {
		offsets[ id ] = byteOffset;
		append( `${id} 0 obj\n${body}\nendobj\n` );
	};

	append( "%PDF-1.7\n%\xE2\xE3\xCF\xD3\n" );
	appendObject( 1, "<< /Type /Catalog /Pages 2 0 R >>" );
	appendObject( 2, `<< /Type /Pages /Kids [${pageObjectIds.map( ( id ) => `${id} 0 R` )
		.join( " " )}] /Count ${pages} >>` );

	offsets[ 3 ] = byteOffset;
	append( `3 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imageSize.width} /Height ${imageSize.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n` );
	append( jpeg );
	append( "\nendstream\nendobj\n" );

	const drawBackground = `q\n${pageWidthPt} 0 0 ${pageHeightPt} 0 0 cm\n/Bg Do\nQ\n`;

	offsets[ 4 ] = byteOffset;
	append( `4 0 obj\n<< /Length ${Buffer.byteLength( drawBackground, "ascii" )} >>\nstream\n${drawBackground}endstream\nendobj\n` );

	for ( const pageId of pageObjectIds ) {
		appendObject( pageId,
			`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidthPt} ${pageHeightPt}] /Resources << /XObject << /Bg 3 0 R >> >> /Contents 4 0 R >>` );
	}

	const xrefOffset = byteOffset;
	const objectCount = pageObjectIds.at( -1 ) + 1;

	append( `xref\n0 ${objectCount}\n` );
	append( "0000000000 65535 f \n" );

	for ( let id = 1; id < objectCount; id++ ) {
		append( `${String( offsets[ id ] ).padStart( 10, "0" )} 00000 n \n` );
	}

	append( `trailer\n<< /Size ${objectCount} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n` );

	return fs.writeFile( outputPath, Buffer.concat( chunks ) );
}

async function createBackgroundPdf() {
	const tempDir = await fs.mkdtemp( path.join( os.tmpdir(), "pg-cards-background-" ) );
	const renderedBackground = path.join( tempDir, "background.jpg" );

	try {
		await execFile( "gs", [
			"-q",
			"-dNOSAFER",
			"-dBATCH",
			"-dNOPAUSE",
			"-dFirstPage=1",
			"-dLastPage=1",
			"-dTextAlphaBits=4",
			"-dGraphicsAlphaBits=4",
			"-sDEVICE=jpeg",
			"-r600",
			`-sOutputFile=${renderedBackground}`,
			backgroundSource
		] );

		const jpeg = await fs.readFile( renderedBackground );

		await fs.mkdir( path.dirname( backgroundOutput ), { recursive: true } );
		await createPdfFromRepeatedJpeg( {
			jpeg,
			outputPath: backgroundOutput,
			pages:      pageCount
		} );

		console.log( `Created ${path.relative( projectRoot, backgroundOutput )}` );
	} finally {
		await fs.rm( tempDir, {
			force:     true,
			recursive: true
		} );
	}
}

const server = await createServer( {
	root:       projectRoot,
	base:       "/",
	logLevel:   "error",
	configFile: false,
	plugins:    [ vue(), vuetify( { autoImport: true } ) ],
	resolve:    { alias: { "@": path.resolve( projectRoot, "src" ) } },
	server:     {
		host: "127.0.0.1",
		port: 0
	},
	appType: "mpa"
} );

let browser;

try {
	await server.listen();

	const address = server.httpServer.address();
	const port = typeof address === "object" ? address.port : 5173;
	const url = `http://127.0.0.1:${port}/src/book1/PG/PG_CardsPdf.html?locale=${encodeURIComponent( locale )}`;

	browser = await puppeteer.launch( { headless: "new" } );

	const page = await browser.newPage();
	await page.goto( url, { waitUntil: "networkidle0" } );
	await page.waitForFunction( () => window.__PG_CARDS_READY__ === true );
	await fs.mkdir( path.dirname( output ), { recursive: true } );
	await page.pdf( {
		path:              output,
		width:             "65mm",
		height:            "97mm",
		printBackground:   true,
		preferCSSPageSize: true
	} );

	console.log( `Created ${path.relative( projectRoot, output )}` );
	await createBackgroundPdf();
} finally {
	await browser?.close();
	await server.close();
}
