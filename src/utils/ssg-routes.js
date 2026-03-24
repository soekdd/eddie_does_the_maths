export const supportedLocales = [ "de", "en", "sw", "fi" ];

/**
 * SSG helper for concrete dynamic paths.
 *
 * Static routes are taken directly from the Vue Router table.
 * If later routes like "/artikel/:slug" are introduced, add their concrete
 * URLs here (for example from local markdown/content manifests).
 */
export const explicitDynamicRoutes = [
	// "/artikel/mein-erster-artikel",
	// "/kapitel/intro"
];

export const localizedExplicitDynamicRoutes = supportedLocales.flatMap( ( locale ) =>
	explicitDynamicRoutes.map( ( path ) => {
		const normalizedPath = String( path || "/" ).trim() || "/";

		if ( normalizedPath === "/" ) {
			return `/${locale}/`;
		}

		return `/${locale}${normalizedPath.startsWith( "/" ) ? normalizedPath : `/${normalizedPath}`}`;
	} ) );
