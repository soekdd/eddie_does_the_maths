import {
	inject, readonly, ref
} from "vue";
import { parse } from "yaml";

const I18N_KEY = Symbol( "eddie-i18n" );
const STORAGE_KEY = "eddie.locale";
const FALLBACK_LOCALE = "de";
const SUPPORTED_LOCALES = [ "de", "en" ];

const rawModules = {
	...import.meta.glob( "./**/*.yaml", {
		eager:  true,
		import: "default",
		query:  "?raw"
	} ),
	...import.meta.glob( "./**/*.yml", {
		eager:  true,
		import: "default",
		query:  "?raw"
	} )
};

const catalog = new Map();

for ( const [ path, raw ] of Object.entries( rawModules ) ) {
	const match = path.match( /^\.\/(.+)\/([a-z]{2})\.ya?ml$/i );

	if ( !match ) {
		continue;
	}

	const namespace = match[ 1 ];
	const locale = normalizeLocale( match[ 2 ] );
	const parsed = parse( String( raw ?? "" ) ) ?? {};
	const bucket = catalog.get( namespace ) ?? {};

	bucket[ locale ] = parsed;
	catalog.set( namespace, bucket );
}

const locale = ref( detectInitialLocale() );

function normalizeLocale( value ) {
	const normalized = String( value ?? "" )
		.trim()
		.toLowerCase()
		.split( /[-_]/ )[ 0 ];

	return SUPPORTED_LOCALES.includes( normalized ) ? normalized : FALLBACK_LOCALE;
}

function detectInitialLocale() {
	if ( typeof window !== "undefined" ) {
		const urlLang = new URLSearchParams( window.location.search ).get( "lang" );

		if ( urlLang ) {
			return normalizeLocale( urlLang );
		}

		const stored = window.localStorage?.getItem( STORAGE_KEY );

		if ( stored ) {
			return normalizeLocale( stored );
		}

		const browserLang = window.navigator?.language || window.navigator?.languages?.[ 0 ];

		if ( browserLang ) {
			return normalizeLocale( browserLang );
		}
	}

	return FALLBACK_LOCALE;
}

function setHtmlLanguage( value ) {
	if ( typeof document !== "undefined" ) {
		document.documentElement.lang = value;
	}
}

function getNestedValue( value, key ) {
	if ( !key ) {
		return value;
	}

	return String( key )
		.split( "." )
		.reduce( ( current, part ) => current?.[ part ], value );
}

function formatMessage( message, params = {} ) {
	if ( typeof message !== "string" ) {
		return message;
	}

	return message.replace( /\{(\w+)\}/g, ( _, name ) =>
		params[ name ] == null ? `{${name}}` : String( params[ name ] ) );
}

function resolveMessage(
	namespace,
	key,
	params
) {
	const scopedCatalog = catalog.get( namespace ) ?? {};
	const current = getNestedValue( scopedCatalog[ locale.value ], key );

	if ( current != null ) {
		return formatMessage( current, params );
	}

	const fallback = getNestedValue( scopedCatalog[ FALLBACK_LOCALE ], key );

	if ( fallback != null ) {
		return formatMessage( fallback, params );
	}

	return null;
}

export function setLocale( value ) {
	const nextLocale = normalizeLocale( value );

	locale.value = nextLocale;
	setHtmlLanguage( nextLocale );

	if ( typeof window !== "undefined" ) {
		window.localStorage?.setItem( STORAGE_KEY, nextLocale );
	}
}

export function getLocale() {
	return locale.value;
}

export function t(
	namespace, key, params = {}
) {
	const message = resolveMessage(
		namespace, key, params
	);

	return message == null ? `${namespace}.${key}` : message;
}

export function tm( namespace, key = "" ) {
	const scopedCatalog = catalog.get( namespace ) ?? {};
	return getNestedValue( scopedCatalog[ locale.value ] ?? scopedCatalog[ FALLBACK_LOCALE ] ?? {}, key );
}

export function useI18n( namespace ) {
	const injected = inject( I18N_KEY, null );
	const api = injected ?? i18nApi;

	return {
		locale:    api.locale,
		setLocale: api.setLocale,
		t:         ( key,
			params = {} ) => api.t(
			namespace, key, params
		),
		tm: ( key = "" ) => api.tm( namespace, key )
	};
}

export const i18nApi = {
	availableLocales: SUPPORTED_LOCALES,
	locale:           readonly( locale ),
	getLocale,
	setLocale,
	t,
	tm
};

export default {
	install( app ) {
		setHtmlLanguage( locale.value );
		app.provide( I18N_KEY, i18nApi );
		app.provide( "i18n", i18nApi );
		app.config.globalProperties.$i18n = i18nApi;
		app.config.globalProperties.$t = (
			namespace,
			key,
			params = {}
		) => t(
			namespace, key, params
		);
	}
};
