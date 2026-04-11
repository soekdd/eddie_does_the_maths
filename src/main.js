import {
	h, nextTick, onMounted, Suspense
} from "vue";
import { RouterView } from "vue-router";
import { ViteSSG } from "vite-ssg";
import { VApp } from "vuetify/components";
import AppFrame from "@/components/App.vue";
import ImageZoomer from "@/components/ImageZoomer.vue";
import Katex from "@/components/Katex.vue";
import RouteSeoHead from "@/components/RouteSeoHead.vue";
import EddieComment from "@/components/EddieComment.vue";
import i18n, { setLocale } from "@/utils/i18n.mjs";
import "katex/dist/katex.min.css";
import {
	resolveLocaleFromPath, routes, scrollBehavior
} from "@/router.js";
import { vuetify } from "@/utils/vuetify";
import "@/eddie.css";

function rewriteLegacyShortcuts() {
	const loc = globalThis.location;

	if ( !loc ) {
		return;
	}

	const toTopicPath = ( code ) => {
		const basePath = loc.pathname.endsWith( "/" ) ? loc.pathname.slice( 0, -1 ) : loc.pathname;
		return `${basePath}/${code}`.replace( /\/{2,}/g, "/" );
	};

	const shortQuery = loc.search.match( /^\?([A-Z0-9]{2})$/ )?.[ 1 ];

	if ( shortQuery ) {
		loc.replace( toTopicPath( shortQuery ) );
		return;
	}

	const shortHash = loc.hash.match( /^#\/?([A-Z0-9]{2})$/ )?.[ 1 ];

	if ( shortHash ) {
		loc.replace( toTopicPath( shortHash ) );
	}
}

// Keep the active theme synchronized with the OS preference.
function setupThemeSync() {
	const darkModeMql = globalThis.matchMedia?.( "(prefers-color-scheme: dark)" );
	const printMql = globalThis.matchMedia?.( "print" );
	const win = typeof window !== "undefined" ? window : null;
	let isPrinting = false;
	const nameFromSystem = () => darkModeMql?.matches ? "eddieDark" : "eddieLight";

	const apply = () => {
		const theme = vuetify.theme;

		if ( !theme ) {
			return;
		}

		const next = isPrinting ? "eddieLight" : nameFromSystem();
		const current = theme.global?.name?.value;

		if ( current !== next ) {
			theme.change( next );
		}
	};

	const onBeforePrint = () => {
		isPrinting = true;
		apply();
	};

	const onAfterPrint = () => {
		isPrinting = false;
		apply();
	};

	const onPrintModeChange = ( event ) => {
		isPrinting = Boolean( event?.matches );
		apply();
	};

	apply();

	if ( darkModeMql ) {
		const onChange = () => apply();

		if ( darkModeMql.addEventListener ) {
			darkModeMql.addEventListener( "change", onChange );
		} else {
			darkModeMql.addListener( onChange );
		}

		import.meta.hot?.dispose( () => {
			if ( darkModeMql.removeEventListener ) {
				darkModeMql.removeEventListener( "change", onChange );
			} else {
				darkModeMql.removeListener( onChange );
			}
		} );
	}

	if ( printMql ) {
		if ( printMql.addEventListener ) {
			printMql.addEventListener( "change", onPrintModeChange );
		} else {
			printMql.addListener( onPrintModeChange );
		}

		import.meta.hot?.dispose( () => {
			if ( printMql.removeEventListener ) {
				printMql.removeEventListener( "change", onPrintModeChange );
			} else {
				printMql.removeListener( onPrintModeChange );
			}
		} );
	}

	if ( win ) {
		win.addEventListener( "beforeprint", onBeforePrint );
		win.addEventListener( "afterprint", onAfterPrint );

		import.meta.hot?.dispose( () => {
			win.removeEventListener( "beforeprint", onBeforePrint );
			win.removeEventListener( "afterprint", onAfterPrint );
		} );
	}
}

function scrollPageToTop() {
	if ( typeof window === "undefined" || typeof document === "undefined" ) {
		return;
	}

	window.scrollTo( 0, 0 );
	document.documentElement.scrollTop = 0;
	document.body.scrollTop = 0;

	const scrollingElement = document.scrollingElement;

	if ( scrollingElement ) {
		scrollingElement.scrollTop = 0;
	}

	const mainScroller = document.querySelector( ".v-main__scroller" );

	if ( mainScroller instanceof HTMLElement ) {
		mainScroller.scrollTop = 0;
	}
}

function installScrollReset( router ) {
	if ( typeof window === "undefined" ) {
		return;
	}

	if ( "scrollRestoration" in window.history ) {
		window.history.scrollRestoration = "manual";
	}

	router.afterEach( (
		to, from, failure
	) => {
		if ( failure || to.hash || to.path === from.path ) {
			return;
		}

		void nextTick( () => {
			window.requestAnimationFrame( () => {
				scrollPageToTop();
			} );
		} );
	} );
}

const Root = {
	name: "Root",
	setup() {
		if ( !import.meta.env.SSR ) {
			onMounted( () => {
				setupThemeSync();
			} );
		}

		return () => h(
			VApp,
			null,
			{
				default: () => [
					h( RouteSeoHead ),
					h(
						Suspense,
						null,
						{
							default:  () => h( RouterView ),
							fallback: () => h(
								"div",
								{ class: "pa-6 text-body-1 text-medium-emphasis" },
								"Loading..."
							)
						}
					)
				]
			}
		);
	}
};

const pbUrl = "https://pb.soek.de";
const routerBase = import.meta.env.BASE_URL || "/";

export const createApp = ViteSSG(
	Root,
	{
		base: routerBase,
		routes,
		scrollBehavior
	},
	( {
		app, router, isClient
	} ) => {
		setLocale( resolveLocaleFromPath( router.currentRoute.value.path ) );

		app.use( vuetify );
		app.use( i18n );

		// Global layout component so views don't need to import it explicitly.
		app.component( "AppFrame", AppFrame );
		// eslint-disable-next-line vue/multi-word-component-names
		app.component( "Katex", Katex );
		app.component( "EddieComment", EddieComment );
		app.component( "ImageZoomer", ImageZoomer );
		app.provide( "pbUrl", pbUrl );

		if ( isClient ) {
			rewriteLegacyShortcuts();
			installScrollReset( router );
		}
	},
	{
		hydration: true,
		useHead:   true
	}
);
