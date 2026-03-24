import { createRouter, createWebHistory } from "vue-router";
import { getLocale, setLocale } from "@/utils/i18n.mjs";

import DG from "@/book1/DG/DG.vue";
import ST from "@/book1/ST/ST.vue";
import MO from "@/book1/MO/MO.vue";
import O1 from "@/book1/O1/O1.vue";
import O2 from "@/book1/O2/O2.vue";
import O3 from "@/book1/O3/O3.vue";
import O4 from "@/book1/O4/O4.vue";
import O5 from "@/book1/O5/O5.vue";
import O6 from "@/book1/O6/O6.vue";
import FI from "@/book1/FI/FI.vue";
import PG from "@/book1/PG/PG.vue";
import AL from "@/book1/AL/AL.vue";
import BA from "@/book1/BA/BA.vue";
import BS from "@/book1/BS/BS.vue";
import BD from "@/book1/BD/BD.vue";
import BZ from "@/book1/BZ/BZ.vue";
import NV from "@/book1/NV/NV.vue";
import SE from "@/book1/SE/SE.vue";
import RD from "@/book1/RD/RD.vue";
import SD from "@/book1/SD/SD.vue";
import FX from "@/book1/FX/FX.vue";
import GD from "@/book1/GD/GD.vue";
import UD from "@/book1/UD/UD.vue";
import VA from "@/book1/VA/VA.vue";
import QH from "@/book1/QH/QH.vue";
import FS from "@/book1/FS/FS.vue";
import LT from "@/book1/LT/LT.vue";
import WO from "@/book1/WO/WO.vue";
import CatchAll from "@/components/CatchAll.vue";
import Welcome from "@/components/Welcome.vue";
const error = true;
const warning = true;
const wip = true;
const FALLBACK_LOCALE = "en";
const SUPPORTED_LOCALES = [ "de", "en", "sw", "fi" ];
const DEFAULT_ROUTE_LOCALES = [ "de", "en" ];
const LOCALE_ROUTE_PATTERN = SUPPORTED_LOCALES.join( "|" );
const fallbackDescription = {
	de: "Interaktive Mathematik mit Eddie: Rechenwege, Visualisierungen und Übungen zum Mitmachen.",
	en: "Interactive mathematics with Eddie: calculations, visualizations, and hands-on exercises."
};

function normalizeMetaLocale( value ) {
	return String( value ?? FALLBACK_LOCALE ).trim()
		.toLowerCase()
		.split( /[-_]/ )[ 0 ] || FALLBACK_LOCALE;
}

function normalizeSupportedLocale( value ) {
	const normalized = normalizeMetaLocale( value );
	return SUPPORTED_LOCALES.includes( normalized ) ? normalized : FALLBACK_LOCALE;
}

export { SUPPORTED_LOCALES };

export function stripLocalePrefix( pathValue ) {
	const normalizedPath = String( pathValue || "/" ).trim() || "/";
	const match = normalizedPath.match( new RegExp( `^/(${LOCALE_ROUTE_PATTERN})(?=/|$)` ) );

	if ( !match ) {
		return normalizedPath;
	}

	const stripped = normalizedPath.slice( match[ 0 ].length );
	return stripped ? stripped.startsWith( "/" ) ? stripped : `/${stripped}` : "/";
}

export function localizePath( pathValue,
	localeValue ) {
	const locale = normalizeSupportedLocale( localeValue );
	const strippedPath = stripLocalePrefix( pathValue );

	if ( strippedPath === "/" ) {
		return `/${locale}`;
	}

	return `/${locale}${strippedPath}`;
}

export function resolveLocaleFromPath( pathValue ) {
	const normalizedPath = String( pathValue || "/" ).trim() || "/";
	const match = normalizedPath.match( new RegExp( `^/(${LOCALE_ROUTE_PATTERN})(?=/|$)` ) );
	return normalizeSupportedLocale( match?.[ 1 ] || FALLBACK_LOCALE );
}

function buildLocalizedRedirect( to,
	nextLocale ) {
	const nextQuery = { ...to.query };
	delete nextQuery.lang;

	return {
		path:    withTrailingSlash( localizePath( to.path, nextLocale ) ),
		hash:    to.hash,
		params:  to.params,
		query:   nextQuery,
		replace: true
	};
}

function normalizeConcretePath( pathValue ) {
	const normalizedPath = String( pathValue || "/" ).trim() || "/";
	return normalizedPath === "/" ? "/" : normalizedPath.endsWith( "/" ) ? normalizedPath.slice( 0, -1 ) : normalizedPath;
}

function withTrailingSlash( pathValue ) {
	const normalizedPath = String( pathValue || "/" ).trim() || "/";

	if ( normalizedPath.includes( ":" ) ) {
		return normalizedPath;
	}

	return normalizedPath === "/" || normalizedPath.endsWith( "/" ) ? normalizedPath : `${normalizedPath}/`;
}

function localizedRouteName( name,
	locale ) {
	const normalizedName = String( name ?? "" ).trim();
	return normalizedName ? `${normalizedName}__${locale}` : undefined;
}

function getRouteSupportedLocales( route ) {
	const routeLocales = Array.isArray( route?.meta?.languages ) ? route.meta.languages : DEFAULT_ROUTE_LOCALES;
	const normalizedLocales = routeLocales
		.map( normalizeSupportedLocale )
		.filter( (
			value, index, values
		) => value && values.indexOf( value ) === index );

	return normalizedLocales.length > 0 ? normalizedLocales : [ FALLBACK_LOCALE ];
}

function findContentRouteForBasePath( pathValue ) {
	const normalizedPath = normalizeConcretePath( stripLocalePrefix( pathValue ) );
	const catchAllRoute = contentRoutes.find( ( route ) => route.path === "/:pathMatch(.*)*" ) ?? null;
	const matchedRoute = contentRoutes.find( ( route ) =>
		route.path !== "/:pathMatch(.*)*" && normalizeConcretePath( route.path ) === normalizedPath );

	return matchedRoute ?? catchAllRoute;
}

function resolveRouteLocaleForPath( pathValue,
	requestedLocale ) {
	const matchedRoute = findContentRouteForBasePath( pathValue );
	const supportedRouteLocales = getRouteSupportedLocales( matchedRoute );
	const normalizedRequestedLocale = normalizeSupportedLocale( requestedLocale );

	return supportedRouteLocales.includes( normalizedRequestedLocale ) ?
		normalizedRequestedLocale :
		supportedRouteLocales.includes( FALLBACK_LOCALE ) ?
			FALLBACK_LOCALE :
			supportedRouteLocales[ 0 ];
}

function detectBrowserLocale() {
	if ( typeof navigator === "undefined" ) {
		return FALLBACK_LOCALE;
	}

	const browserLocales = Array.isArray( navigator.languages ) ?
		navigator.languages :
		[ navigator.language ];

	for ( const browserLocale of browserLocales ) {
		const normalized = normalizeSupportedLocale( browserLocale );

		if ( SUPPORTED_LOCALES.includes( normalized ) ) {
			return normalized;
		}
	}

	return FALLBACK_LOCALE;
}

export function normalizeSeoText( value ) {
	if ( typeof value !== "string" ) {
		return "";
	}

	return value
		.replace( /&shy;/gi, "" )
		.replace( /\u00ad/g, "" )
		.trim();
}

export function resolveLocalizedMetaText( value,
	locale = getLocale() ) {
	if ( typeof value === "string" ) {
		return value;
	}

	if ( !value || typeof value !== "object" ) {
		return "";
	}

	const nextLocale = normalizeMetaLocale( locale );
	const localized = value[ nextLocale ];

	if ( typeof localized === "string" && localized.trim() ) {
		return localized;
	}

	const fallback = value[ FALLBACK_LOCALE ];

	if ( typeof fallback === "string" && fallback.trim() ) {
		return fallback;
	}

	return "";
}

export function resolveRouteMetaTitle( meta,
	locale = getLocale() ) {
	return resolveLocalizedMetaText( meta?.title, locale );
}

export function resolveRouteMetaDescription( meta,
	locale = getLocale() ) {
	const nextLocale = normalizeMetaLocale( locale );
	const fromMeta = normalizeSeoText( resolveLocalizedMetaText( meta?.description, nextLocale ) );

	if ( fromMeta ) {
		return fromMeta;
	}

	const title = normalizeSeoText( resolveRouteMetaTitle( meta, nextLocale ) );

	if ( title ) {
		return nextLocale === "en" ?
			`Interactive math page: ${title}. Calculations, visualizations, and hands-on exercises.` :
			`Interaktive Mathe-Seite: ${title}. Rechenwege, Visualisierungen und Übungen zum Mitmachen.`;
	}

	return fallbackDescription[ nextLocale ] ?? fallbackDescription[ FALLBACK_LOCALE ];
}

export const scrollBehavior = (
	to, _from, savedPosition
) => {
	if ( savedPosition ) {
		return savedPosition;
	}

	if ( to.hash ) {
		const hashOffset = globalThis.matchMedia?.( "(max-width: 860px)" )?.matches ? 132 : 96;

		return {
			el:       to.hash,
			top:      hashOffset,
			behavior: "smooth"
		};
	}

	return {
		top:      0,
		left:     0,
		behavior: "auto"
	};
};

export const contentRoutes = [
	{
		path:      "/",
		name:      "ER",
		component: Welcome,
		meta:      {
			languages: [ "de", "en", "sw", "fi" ],
			title:     {
				de: "Welcome",
				en: "Welcome"
			}
		}
	},
	{
		path:      "/ST",
		name:      "ST",
		component: ST,
		meta:      {
			difficulty: 1,
			title:      {
				de: "Spiel&shy;theorie am Bus&shy;bahnhof",
				en: "Game Theory at the Bus Station"
			},
			index: true,
			book:  1,
			order: 10
		}
	},
	{
		path:      "/DG",
		name:      "DG",
		component: DG,
		meta:      {
			difficulty: 2,
			title:      {
				de: "Dio&shy;phan&shy;tische Gleichung",
				en: "Diophantine Equation"
			},
			index: true,
			book:  1,
			order: 20
		}
	},
	{
		path:      "/MO",
		name:      "MO",
		component: MO,
		meta:      {
			difficulty: 3,
			title:      {
				de: "IMO 1985 Aufgaben 1-6",
				en: "IMO 1985 Problems 1-6"
			},
			index: false
		}
	},
	{
		path:      "/O1",
		name:      "O1",
		component: O1,
		meta:      {
			difficulty: 3,
			title:      {
				de: "IMO 1985 Aufgabe A1",
				en: "IMO 1985 Problem A1"
			},
			index: true,
			book:  1,
			order: 30
		}
	},
	{
		path:      "/O2",
		name:      "O2",
		component: O2,
		meta:      {
			difficulty: 3,
			title:      {
				de: "IMO 1985 Aufgabe A2",
				en: "IMO 1985 Problem A2"
			},
			index: true,
			book:  1,
			order: 40
		}
	},
	{
		path:      "/O3",
		name:      "O3",
		component: O3,
		meta:      {
			difficulty: 3,
			title:      {
				de: "IMO 1985 Aufgabe A3",
				en: "IMO 1985 Problem A3"
			},
			index: true,
			book:  1,
			order: 50
		}
	},
	{
		path:      "/O4",
		name:      "O4",
		component: O4,
		meta:      {
			difficulty: 3,
			title:      {
				de: "IMO 1985 Aufgabe B1",
				en: "IMO 1985 Problem B1"
			},
			index: true,
			book:  1,
			order: 60
		}
	},
	{
		path:      "/O5",
		name:      "O5",
		component: O5,
		meta:      {
			difficulty: 3,
			title:      {
				de: "IMO 1985 Aufgabe B2",
				en: "IMO 1985 Problem B2"
			},
			index: true,
			book:  1,
			order: 70
		}
	},
	{
		path:      "/O6",
		name:      "O6",
		component: O6,
		meta:      {
			difficulty: 3,
			title:      {
				de: "IMO 1985 Aufgabe B3",
				en: "IMO 1985 Problem B3"
			},
			index: true,
			book:  1,
			order: 80
		}
	},
	{
		path:      "/FI",
		name:      "FI",
		component: FI,
		meta:      {
			difficulty: 2,
			title:      {
				de: "Land&shy;karten Geo&shy;metrie",
				en: "Map Geometry"
			},
			index: true,
			book:  1,
			order: 90
		}
	},
	{
		path:      "/PG",
		name:      "PG",
		component: PG,
		meta:      {
			difficulty: 1,
			title:      {
				de: "Mit Eddie zum Poker&shy;genie",
				en: "Become a Poker Genius with Eddie"
			},
			index: true,
			book:  1,
			order: 100
		}
	},
	{
		path:      "/NV",
		name:      "NV",
		component: NV,
		meta:      {
			difficulty: 1,
			title:      {
				de: "Navi&shy;gation im Wald",
				en: "Navigation in the Forest"
			},
			index: true,
			book:  1,
			order: 120
		}
	},
	{
		path:      "/SE",
		name:      "SE",
		component: SE,
		meta:      {
			difficulty: 1,
			title:      {
				de: "Gute-Nacht-Rechen&shy;routine",
				en: "Bedtime Calculation Routine"
			},
			index: true,
			book:  1,
			order: 125
		}
	},
	{
		path:      "/FS",
		name:      "FS",
		component: FS,
		meta:      {
			difficulty: 2,
			title:      {
				de: "Fischsee",
				en: "Fish Lake"
			},
			index: true,
			book:  1,
			order: 130
		}
	},
	{
		path:      "/RD",
		name:      "RD",
		component: RD,
		meta:      {
			difficulty: 2,
			title:      {
				de: "Rentier-Depot",
				en: "Reindeer Depot"
			},
			index: true,
			book:  1,
			order: 140
		}
	},
	{
		path:      "/UD",
		name:      "UD",
		component: UD,
		meta:      {
			difficulty: 3,
			title:      {
				de: "Minkow&shy;skis Ufer&shy;auf&shy;dickung",
				en: "Minkowski's Shore Thickening"
			},
			index: true,
			book:  1,
			order: 150
		}
	},
	{
		path:      "/BA",
		name:      "BA",
		component: BA,
		meta:      {
			difficulty: 1,
			title:      {
				de: "BASIC for Runaways",
				en: "BASIC for Runaways"
			},
			index: true,
			book:  1,
			order: 160
		}
	},
	{
		path:      "/SD",
		name:      "SD",
		component: SD,
		meta:      {
			difficulty: 1,
			title:      {
				de: "Ich zeig dir deine DNA",
				en: "Let Me Show You Your DNA"
			},
			index: true,
			book:  1,
			order: 170
		}
	},
	{
		path:      "/BS",
		name:      "BS",
		component: BS,
		meta:      {
			difficulty: 2,
			title:      {
				de: "Baustatik #1, Satz v. Steiner",
				en: "Structural Analysis #1, Steiner's Theorem"
			},
			index: true,
			book:  1,
			order: 180
		}
	},
	{
		path:      "/AL",
		name:      "AL",
		component: AL,
		meta:      {
			difficulty: 2,
			title:      {
				de: "Karten&shy;spiel mit Ada Lovelace",
				en: "Card Game with Ada Lovelace"
			},
			index: true,
			book:  1,
			order: 190
		}
	},
	{
		path:      "/WO",
		name:      "WO",
		component: WO,
		meta:      {
			difficulty: 2,
			title:      {
				de: "Weg&shy;optimierung",
				en: "Route Optimization"
			},
			index: true,
			book:  1,
			order: 200
		}
	},
	{
		path:      "/BD",
		name:      "BD",
		component: BD,
		meta:      {
			difficulty: 2,
			title:      {
				de: "Baustatik #2, DIN vs. TGL",
				en: "Structural Analysis #2, DIN vs. TGL"
			},
			index: true,
			book:  1,
			order: 205
		}
	},
	{
		path:      "/FX",
		name:      "FX",
		component: FX,
		meta:      {
			difficulty: 1,
			title:      {
				de: "Mein fx-7000G",
				en: "My fx-7000G"
			},
			index: true,
			book:  1,
			order: 210
		}
	},
	{
		path:      "/VA",
		name:      "VA",
		component: VA,
		meta:      {
			difficulty: 2,
			title:      {
				de: "Warum die Vasa sinken musste",
				en: "Why the Vasa Had to Sink"
			},
			index: true,
			book:  1,
			order: 220
		}
	},
	{
		path:      "/BZ",
		name:      "BZ",
		component: BZ,
		meta:      {
			difficulty: 1,
			title:      {
				de: "Baustatik #3 Dynamik",
				en: "Structural Analysis #3, Dynamics"
			},
			index: true,
			book:  1,
			order: 230
		}
	},
	{
		path:      "/GD",
		name:      "GD",
		component: GD,
		meta:      {
			difficulty: 1,
			title:      {
				de: "Diophantos Grab&shy;platte",
				en: "Diophantus' Tombstone"
			},
			index: true,
			book:  1,
			order: 240
		}
	},
	{
		path:      "/QH",
		name:      "QH",
		component: QH,
		meta:      {
			difficulty: 2,
			title:      {
				de: "Der Quanten-Hall-Effekt",
				en: "The Quantum Hall Effect"
			},
			index: true,
			book:  1,
			order: 250
		}
	},
	{
		path:      "/LT",
		name:      "LT",
		component: LT,
		meta:      {
			difficulty: 3,
			title:      {
				de: "Laplace-Trans&shy;formation",
				en: "Laplace Transform"
			},
			index: true,
			book:  1,
			order: 260
		}
	},
	{
		path:      "/ZR",
		name:      "ZR",
		component: CatchAll,
		meta:      {
			difficulty: 2,
			title:      {
				de: "Atomare Zerfalls&shy;reihen",
				en: "Atomic Decay Chains"
			},
			index: true,
			book:  2,
			order: 10,
			wip
		}
	},
	{
		path:      "/AW",
		name:      "AW",
		component: CatchAll,
		meta:      {
			difficulty: 2,
			title:      {
				de: "Aus&shy;sage&shy;wahrs&shy;cheinlichkeit",
				en: "Probability of Statements"
			},
			index: true,
			book:  2,
			order: 20,
			wip
		}
	},{
		path:      "/KK",
		name:      "KK",
		component: CatchAll,
		meta:      {
			difficulty: 2,
			title:      {
				de: "Spaß mit Kugel&shy;koordinaten",
				en: "Fun with Spherical Coordinates"
			},
			index: true,
			book:  2,
			order: 20,
			wip
		}
	},
	{
		path:      "/O7",
		name:      "O7",
		component: CatchAll,
		meta:      {
			wip,
			difficulty: 3,
			title:      {
				de: "IMO 1987 Aufgabe A1",
				en: "IMO 1987 Problem A1"
			},
			index: true,
			book:  2,
			order: 30
		}
	},
	{
		path:      "/O8",
		name:      "O8",
		component: CatchAll,
		meta:      {
			wip,
			difficulty: 3,
			title:      {
				de: "IMO 1987 Aufgabe A2",
				en: "IMO 1987 Problem A2"
			},
			index: true,
			book:  2,
			order: 30
		}
	},
	{
		path:      "/O9",
		name:      "O9",
		component: CatchAll,
		meta:      {
			wip,
			difficulty: 3,
			title:      {
				de: "IMO 1987 Aufgabe A3",
				en: "IMO 1987 Problem A3"
			},
			index: true,
			book:  2,
			order: 30
		}
	},
	{
		path:      "/OA",
		name:      "OA",
		component: CatchAll,
		meta:      {
			wip,
			difficulty: 3,
			title:      {
				de: "IMO 1987 Aufgabe B1",
				en: "IMO 1987 Problem B1"
			},
			index: true,
			book:  2,
			order: 30
		}
	},
	{
		path:      "/OB",
		name:      "OB",
		component: CatchAll,
		meta:      {
			wip,
			difficulty: 3,
			title:      {
				de: "IMO 1987 Aufgabe B2",
				en: "IMO 1987 Problem B2"
			},
			index: true,
			book:  2,
			order: 30
		}
	},
	{
		path:      "/OC",
		name:      "OC",
		component: CatchAll,
		meta:      {
			wip,
			difficulty: 3,
			title:      {
				de: "IMO 1987 Aufgabe B3",
				en: "IMO 1987 Problem B3"
			},
			index: true,
			book:  2,
			order: 30
		}
	},
	{
		path:      "/:pathMatch(.*)*",
		name:      "CatchAll",
		component: CatchAll,
		meta:      {
			title: {
				de: "Thema in Arbeit",
				en: "Topic in Progress"
			}
		}
	}
];

const localizedRoutes = SUPPORTED_LOCALES.flatMap( ( locale ) =>
	contentRoutes
		.filter( ( route ) => getRouteSupportedLocales( route ).includes( locale ) )
		.map( ( route ) => ( {
			...route,
			path: withTrailingSlash( localizePath( route.path, locale ) ),
			name: localizedRouteName( route.name, locale )
		} ) ) );

export const routes = [
	{
		path:     "/",
		name:     "LocaleRoot",
		redirect: ( to ) => {
			const queryLocale = typeof to.query.lang === "string" ? to.query.lang : "";
			const nextLocale = resolveRouteLocaleForPath( "/", queryLocale || detectBrowserLocale() );
			const nextQuery = { ...to.query };
			delete nextQuery.lang;

			return {
				path:    withTrailingSlash( localizePath( "/", nextLocale ) ),
				query:   nextQuery,
				hash:    to.hash,
				replace: true
			};
		}
	},
	...localizedRoutes,
	{
		path:      `/:locale(${LOCALE_ROUTE_PATTERN})/:pathMatch(.*)*`,
		name:      "LocalizedCatchAll",
		component: CatchAll,
		beforeEnter: ( to ) => {
			const matchedRoute = findContentRouteForBasePath( to.path );

			if ( !matchedRoute || matchedRoute.path === "/:pathMatch(.*)*" ) {
				return true;
			}

			const requestedLocale = typeof to.params.locale === "string" ? to.params.locale : resolveLocaleFromPath( to.path );
			const nextLocale = resolveRouteLocaleForPath( to.path, requestedLocale );

			if ( requestedLocale !== nextLocale ) {
				return buildLocalizedRedirect( to, nextLocale );
			}

			return true;
		},
		meta:      {
			languages: SUPPORTED_LOCALES,
			title:     {
				de: "Thema in Arbeit",
				en: "Topic in Progress"
			}
		}
	}
];

export function createClientRouter() {
	const router = createRouter( {
		history: createWebHistory( import.meta.env.BASE_URL ),
		scrollBehavior,
		routes
	} );

	router.beforeEach( ( to ) => {
		const rawPath = typeof to.path === "string" && to.path.trim() ? to.path : "/";
		const pathLocaleMatch = rawPath.match( new RegExp( `^/(${LOCALE_ROUTE_PATTERN})(?=/|$)` ) );
		const queryLocale = typeof to.query.lang === "string" ? to.query.lang : "";
		const requestedLocale = pathLocaleMatch?.[ 1 ] || queryLocale || detectBrowserLocale();
		const nextLocale = resolveRouteLocaleForPath( rawPath, requestedLocale );

		if ( pathLocaleMatch ) {
			if ( pathLocaleMatch[ 1 ] !== nextLocale ) {
				return buildLocalizedRedirect( to, nextLocale );
			}

			setLocale( nextLocale );

			if ( queryLocale ) {
				const nextQuery = { ...to.query };
				delete nextQuery.lang;

				return {
					path:    withTrailingSlash( rawPath ),
					hash:    to.hash,
					params:  to.params,
					query:   nextQuery,
					replace: true
				};
			}

			return true;
		}

		return {
			path:   withTrailingSlash( localizePath( rawPath, nextLocale ) ),
			hash:   to.hash,
			params: to.params,
			query:  Object.fromEntries( Object.entries( to.query )
				.filter( ( [ key ] ) => key !== "lang" ) ),
			replace: true
		};
	} );

	return router;
}

// Backward-compatible export for pure SPA entry points.
export const router = typeof window !== "undefined" ? createClientRouter() : undefined;
