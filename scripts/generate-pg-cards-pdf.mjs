import path from "node:path";
import { fileURLToPath } from "node:url";

import vue from "@vitejs/plugin-vue";
import puppeteer from "puppeteer";
import { createServer } from "vite";
import vuetify from "vite-plugin-vuetify";

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const projectRoot = path.resolve( __dirname, ".." );

function readArg( name, fallback ) {
	const prefix = `--${name}=`;
	const value = process.argv.find( ( arg ) => arg.startsWith( prefix ) );

	return value ? value.slice( prefix.length ) : fallback;
}

const output = path.resolve( projectRoot,
	readArg( "output", "dist/pg-cards.pdf" ) );
const locale = readArg( "locale", "de" );

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
	await page.pdf( {
		path:              output,
		width:             "65mm",
		height:            "97mm",
		printBackground:   true,
		preferCSSPageSize: true
	} );

	console.log( `Created ${path.relative( projectRoot, output )}` );
} finally {
	await browser?.close();
	await server.close();
}
