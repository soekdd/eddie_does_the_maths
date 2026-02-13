const scriptUrl = new URL( "./cbi.js", import.meta.url ).toString();
let loadPromise;

function waitForExistingScript( script ) {
	if ( script.dataset.cbiLoaded === "1" ) {
		return Promise.resolve();
	}

	if ( script.dataset.cbiFailed === "1" ) {
		return Promise.reject( new Error( `Failed to load ${scriptUrl}` ) );
	}

	return new Promise( ( resolve, reject ) => {
		const onLoad = () => {
			script.dataset.cbiLoaded = "1";
			script.dataset.cbiFailed = "0";
			resolve();
		};

		const onError = () => {
			script.dataset.cbiFailed = "1";
			reject( new Error( `Failed to load ${scriptUrl}` ) );
		};

		script.addEventListener(
			"load", onLoad, { once: true }
		);
		script.addEventListener(
			"error", onError, { once: true }
		);
	} );
}

function createAndLoadScript() {
	return new Promise( ( resolve, reject ) => {
		const script = document.createElement( "script" );
		script.src = scriptUrl;
		script.async = true;
		script.dataset.cbiSrc = scriptUrl;
		script.dataset.cbiLoaded = "0";
		script.dataset.cbiFailed = "0";

		script.onload = () => {
			script.dataset.cbiLoaded = "1";
			script.dataset.cbiFailed = "0";
			resolve();
		};

		script.onerror = () => {
			script.dataset.cbiFailed = "1";
			reject( new Error( `Failed to load ${scriptUrl}` ) );
		};

		document.head.appendChild( script );
	} );
}

export async function ensureCbiLoaded() {
	if ( typeof window === "undefined" ) {
		return false;
	}

	if ( typeof window.jsccRun === "function" ) {
		return true;
	}

	if ( loadPromise ) {
		await loadPromise;
		return typeof window.jsccRun === "function";
	}

	loadPromise = ( async() => {
		const existing = document.querySelector( `script[data-cbi-src="${scriptUrl}"]` );

		if ( existing ) {
			await waitForExistingScript( existing );
		} else {
			await createAndLoadScript();
		}
	} )().catch( ( error ) => {
		loadPromise = undefined;
		throw error;
	} );

	await loadPromise;
	return typeof window.jsccRun === "function";
}
