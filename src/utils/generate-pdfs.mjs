import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import fsp from "node:fs/promises";
import sirv from "sirv";
import fg from "fast-glob";
import puppeteer from "puppeteer";

const projectRoot = process.cwd();
const distRootDir = path.join( projectRoot, "dist" );

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

const appBase = normalizeBasePath( process.env.VITE_PUBLIC_BASE || "/math/" );
const baseSegments = appBase.split( "/" ).filter( Boolean );
const buildOutDir = baseSegments.length > 0 ? path.join( distRootDir, ...baseSegments ) : distRootDir;
const outDir = path.join( buildOutDir, "pdf" );
const cacheDir = path.join( distRootDir, ".pdf-cache", ...baseSegments );
const navigationTimeoutMs = Number.parseInt( process.env.PDF_NAV_TIMEOUT_MS || "120000", 10 );

function pdfFileNameFromRoute( route ) {
	return ( route === "/" ? "index" : route.replace( /\//g, "__" ).replace( /^__/, "" ) ) + ".pdf";
}

function resolveSourceVueForPdfFile( pdfFileName ) {
	const slug = path.basename( pdfFileName, ".pdf" );

	// mapping is only defined for <XX>.pdf -> src/book1/<XX>/<XX>.vue
	if ( !slug || slug === "index" || slug.includes( "__" ) || slug.includes( "/" ) || slug.includes( "\\" ) ) {
		return null;
	}

	return path.join(
		projectRoot, "src", "book1", slug, `${slug}.vue`
	);
}

async function statIfFile( filePath ) {
	try {
		const stat = await fsp.stat( filePath );

		return stat.isFile() ? stat : null;
	} catch {
		return null;
	}
}

async function shouldGeneratePdf( sourceVuePath, pdfOutPath, pdfCachePath ) {
	if ( !sourceVuePath ) {
		return { shouldGenerate: false, reason: "no source Vue mapping" };
	}

	let sourceStat;

	try {
		sourceStat = await fsp.stat( sourceVuePath );
	} catch {
		return { shouldGenerate: false, reason: `source Vue missing (${path.relative( projectRoot, sourceVuePath )})` };
	}

	if ( !sourceStat.isFile() ) {
		return { shouldGenerate: false, reason: `source is not a file (${path.relative( projectRoot, sourceVuePath )})` };
	}

	const outPdfStat = await statIfFile( pdfOutPath );
	const cachePdfStat = await statIfFile( pdfCachePath );

	let freshestPdfPath = null;
	let freshestPdfStat = null;

	if ( outPdfStat ) {
		freshestPdfPath = pdfOutPath;
		freshestPdfStat = outPdfStat;
	}

	if ( cachePdfStat && ( !freshestPdfStat || cachePdfStat.mtimeMs > freshestPdfStat.mtimeMs ) ) {
		freshestPdfPath = pdfCachePath;
		freshestPdfStat = cachePdfStat;
	}

	if ( freshestPdfStat && sourceStat.mtimeMs <= freshestPdfStat.mtimeMs ) {
		return {
			shouldGenerate: false,
			reason:         `up-to-date (source <= pdf mtime: ${path.relative( projectRoot, sourceVuePath )})`,
			reusePdfPath:   freshestPdfPath
		};
	}

	return { shouldGenerate: true };
}

function routeFromHtmlFile( rel ) {
	// rel is like: "index.html" or "foo/index.html" or "foo.html"
	if ( rel === "index.html" ) {
		return "/";
	}

	if ( rel.endsWith( "/index.html" ) ) {
		return "/" + rel.replace( /\/index\.html$/, "" );
	}

	if ( rel.endsWith( ".html" ) ) {
		return "/" + rel.replace( /\.html$/, "" );
	}

	return null;
}

function ensureLeadingSlash( p ) {
	return p.startsWith( "/" ) ? p : "/" + p;
}

function routeToBasePath( routePath ) {
	if ( routePath === "/" ) {
		return appBase;
	}

	const baseNoTrailingSlash = appBase.endsWith( "/" ) ? appBase.slice( 0, -1 ) : appBase;

	return `${baseNoTrailingSlash}${ensureLeadingSlash( routePath )}`;
}

// Optional: rewrite /foo -> /foo.html or /foo/index.html (hilft, wenn du dirStyle=flat nutzt)
function rewriteToExisting( reqUrl ) {
	const u = new URL( reqUrl, "http://localhost" );
	const pathname = decodeURIComponent( u.pathname );
	const candidates = [];

	if ( pathname.endsWith( "/" ) ) {
		candidates.push( pathname + "index.html" );
	} else {
		const hasExt = /\.[a-z0-9]+$/i.test( pathname );

		if ( !hasExt ) {
			candidates.push( pathname + ".html" );
			candidates.push( pathname + "/index.html" );
		}
	}

	candidates.push( pathname );

	for ( const c of candidates ) {
		const fsPath = path.join( distRootDir, c.replace( /^\/+/, "" ) );

		if ( fs.existsSync( fsPath ) && fs.statSync( fsPath ).isFile() ) {
			return c + u.search;
		}
	}

	return pathname + u.search;
}

export async function generatePdfs() {
	await fsp.mkdir( outDir, { recursive: true } );

	// Alle HTML-Dateien der gebauten App-Basis sammeln (z.B. dist/math)
	const htmlFiles = await fg( [ "**/*.html", "!pdf/**" ], { cwd: buildOutDir, onlyFiles: true } );
	const routes = htmlFiles
		.map( routeFromHtmlFile )
		.filter( Boolean )
	// typische Sonderfälle
		.filter( r => r !== "/404" && r !== "/200" )
		.sort();

	// Statischen Server auf dist starten (nicht file:// wegen Module/CORS/Assets)
	// Wichtig: Für base=/math wird aus /math/... auf dist/math/... gemappt.
	const serve = sirv( distRootDir, { dev: true, etag: false } );
	const server = http.createServer( ( req, res ) => {
		req.url = rewriteToExisting( req.url || "/" );
		serve( req, res );
	} );

	await new Promise( ( resolve ) => server.listen(
		0, "127.0.0.1", resolve
	) );
	const{ port } = server.address();
	console.log( `running temp server at http://127.0.0.1:${port}` );
	const baseUrl = `http://127.0.0.1:${port}`;

	const browser = await puppeteer.launch( {
		headless: "new"
		// Falls CI/Linux zickt:
		// args: ['--no-sandbox', '--disable-setuid-sandbox'],
	} );

	try {
		for ( const route of routes ) {
			const pdfFileName = pdfFileNameFromRoute( route );
			const filePath = path.join( outDir, pdfFileName );
			const cachePath = path.join( cacheDir, pdfFileName );
			const sourceVuePath = resolveSourceVueForPdfFile( pdfFileName );
			const decision = await shouldGeneratePdf( sourceVuePath, filePath, cachePath );

			if ( !decision.shouldGenerate ) {
				if ( decision.reusePdfPath ) {
					if ( decision.reusePdfPath !== filePath ) {
						await fsp.mkdir( path.dirname( filePath ), { recursive: true } );
						await fsp.copyFile( decision.reusePdfPath, filePath );
					}

					const outPdfStat = await statIfFile( filePath );
					const cachePdfStat = await statIfFile( cachePath );

					if ( outPdfStat && ( !cachePdfStat || outPdfStat.mtimeMs > cachePdfStat.mtimeMs ) ) {
						await fsp.mkdir( cacheDir, { recursive: true } );
						await fsp.copyFile( filePath, cachePath );
					}
				}

				console.log(
					"PDF SKIP:", route, "->", path.relative( projectRoot, filePath ), `(${decision.reason})`
				);
				continue;
			}

			const url = baseUrl + routeToBasePath( route );
			const page = await browser.newPage();
			console.log( "PDF URL:", url );

			await page.goto( url, {
				timeout:   navigationTimeoutMs,
				waitUntil: "networkidle2"
			} );

			// Wenn du spezielle "PDF-ready" Marker hast, hier warten:
			// await page.waitForSelector('[data-pdf-ready="1"]', { timeout: 30_000 })

			// CSS media type auf print (zulässige Werte: screen/print/null). :contentReference[oaicite:2]{index=2}
			await page.emulateMediaType( "print" );

			// preferCSSPageSize + printBackground sind die beiden wichtigsten Optionen. :contentReference[oaicite:3]{index=3}
			await page.pdf( {
				path:              filePath,
				printBackground:   true,
				preferCSSPageSize: true,
				margin:            {
					top:    "12mm",
					right:  "12mm",
					bottom: "12mm",
					left:   "12mm"
				}
				// alternativ/zusätzlich:
				// format: 'A4',
				// margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
			} );

			await fsp.mkdir( cacheDir, { recursive: true } );
			await fsp.copyFile( filePath, cachePath );

			await page.close();
			console.log(
				"PDF OK:", route, "->", path.relative( projectRoot, filePath )
			);
		}
	} finally {
		await browser.close();
		await new Promise( ( resolve ) => server.close( resolve ) );
	}
}
