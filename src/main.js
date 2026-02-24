import { h, onMounted } from "vue";
import { RouterView } from "vue-router";
import { ViteSSG } from "vite-ssg";
import { VApp } from "vuetify/components";
import AppFrame from "@/App.vue";
import ImageZoomer from "@/components/ImageZoomer.vue";
import Katex from "@/components/Katex.vue";
import RouteSeoHead from "@/components/RouteSeoHead.vue";
import "katex/dist/katex.min.css";
import { routes, scrollBehavior } from "@/router.js";
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
	const mql = globalThis.matchMedia?.( "(prefers-color-scheme: dark)" );
	const nameFromSystem = () => mql?.matches ? "eddieDark" : "eddieLight";

	const apply = () => {
		const nameRef = vuetify.theme?.global?.name;

		if ( !nameRef ) {
			return;
		}

		const next = nameFromSystem();

		if ( nameRef.value !== next ) {
			nameRef.value = next;
		}
	};

	apply();

	if ( mql ) {
		const onChange = () => apply();

		if ( mql.addEventListener ) {
			mql.addEventListener( "change", onChange );
		} else {
			mql.addListener( onChange );
		}

		import.meta.hot?.dispose( () => {
			if ( mql.removeEventListener ) {
				mql.removeEventListener( "change", onChange );
			} else {
				mql.removeListener( onChange );
			}
		} );
	}
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
			{ default: () => [ h( RouteSeoHead ), h( RouterView ) ] }
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
	( { app, isClient } ) => {
		app.use( vuetify );

		// Global layout component so views don't need to import it explicitly.
		app.component( "AppFrame", AppFrame );
		// eslint-disable-next-line vue/multi-word-component-names
		app.component( "Katex", Katex );
		app.component( "ImageZoomer", ImageZoomer );
		app.provide( "pbUrl", pbUrl );

		if ( isClient ) {
			rewriteLegacyShortcuts();
		}
	},
	{
		hydration: true,
		useHead:   true
	}
);
