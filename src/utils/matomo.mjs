// IDs must match the Action dimensions configured for this website in Matomo.
const languageDimension = Number( import.meta.env.VITE_MATOMO_LANGUAGE_DIMENSION_ID || 1 );
const chapterDimension = Number( import.meta.env.VITE_MATOMO_CHAPTER_DIMENSION_ID || 2 );

export function installMatomoTracking( router ) {
	let previousPath;
	let previousUrl;

	const track = ( to ) => {
		// Hash/query changes do not represent a new chapter. Also deduplicates
		// the initial afterEach callback and router.isReady().
		if ( to.path === previousPath ) {
			return;
		}

		const [ language, chapter ] = to.path.split( "/" ).filter( Boolean );
		const url = new URL( router.resolve( { path: to.path } ).href, window.location.href ).href;
		const queue = window._paq = window._paq || [];

		if ( previousUrl ) {
			queue.push( [ "setReferrerUrl", previousUrl ] );
		}

		queue.push( [ "setCustomUrl", url ] );

		for ( const [ id, value ] of [ [ languageDimension, language ], [ chapterDimension, chapter ] ] ) {
			queue.push( value ? [ "setCustomDimension", id, value ] : [ "deleteCustomDimension", id ] );
		}

		queue.push( [ "trackPageView", [ language, chapter ].filter( Boolean ).join( " / " ) ] );
		previousPath = to.path;
		previousUrl = url;
	};

	router.afterEach( (
		to, from, failure
	) => {
		if ( !failure ) {
			track( to );
		}
	} );
	void router.isReady().then( () => track( router.currentRoute.value ) );
}
