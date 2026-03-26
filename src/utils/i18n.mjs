import {
	inject, readonly, ref
} from "vue";
import { parse } from "yaml";
import { katexHTML } from "./katex.js";

const I18N_KEY = Symbol( "eddie-i18n" );
const STORAGE_KEY = "eddie.locale";
const FALLBACK_LOCALE = "en";
const SUPPORTED_LOCALES = [ "de", "en", "sw", "fi" ];
const KATEX_MARKER_RE = /<katex\b((?:[^"'/>]|"[^"]*"|'[^']*')*)\s*\/?>/gi;

const rawModules = {
	...import.meta.glob( "../**/*.yaml", {
		eager:  true,
		import: "default",
		query:  "?raw"
	} ),
	...import.meta.glob( "../**/*.yml", {
		eager:  true,
		import: "default",
		query:  "?raw"
	} )
};

const catalog = new Map();

for ( const [ path, raw ] of Object.entries( rawModules ) ) {
	const match = path.match( /^\.\.\/(.+)\/([a-z]{2})\.ya?ml$/i );

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
		const pathLocale = window.location.pathname.match( /^\/([a-z]{2})(?=\/|$)/i )?.[ 1 ];

		if ( pathLocale ) {
			return normalizeLocale( pathLocale );
		}

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

function resolveLocaleArgument( value ) {
	if ( typeof value === "string" ) {
		return normalizeLocale( value );
	}

	if ( value && typeof value === "object" && "value" in value ) {
		return normalizeLocale( value.value );
	}

	return locale.value;
}

function escapeRegExp( value ) {
	return String( value ?? "" ).replace( /[.*+?^${}()|[\]\\]/g, "\\$&" );
}

function parseWithNumberFormat(
	raw,
	{
		decimal,
		group
	}
) {
	let normalized = String( raw ?? "" ).trim()
		.replace( /[\s\u00A0\u202F']/g, "" );

	if ( !normalized ) {
		return null;
	}

	if ( group && group !== decimal ) {
		normalized = normalized.replace( new RegExp( escapeRegExp( group ), "g" ), "" );
	}

	if ( decimal && decimal !== "." ) {
		normalized = normalized.replace( new RegExp( escapeRegExp( decimal ), "g" ), "." );
	}

	if ( !/^[-+]?(\d+(\.\d+)?|\.\d+)$/.test( normalized ) ) {
		return null;
	}

	const parsed = Number( normalized );
	return Number.isFinite( parsed ) ? parsed : null;
}

function getNumberFormatsForLocale( targetLocale = locale.value ) {
	const parts = new Intl.NumberFormat( resolveLocaleArgument( targetLocale ) ).formatToParts( 12345.6 );
	const decimal = parts.find( ( part ) => part.type === "decimal" )?.value ?? ".";
	const group = parts.find( ( part ) => part.type === "group" )?.value ?? ",";
	const formats = [
		{
			decimal,
			group
		},
		{
			decimal: ",",
			group:   "."
		},
		{
			decimal: ".",
			group:   ","
		},
		{
			decimal: ",",
			group:   ""
		},
		{
			decimal: ".",
			group:   ""
		}
	];

	return formats.filter( ( format,
		index,
		all ) => all.findIndex( ( candidate ) => candidate.decimal === format.decimal && candidate.group === format.group ) === index );
}

function chooseClosestNumber(
	values,
	fallback
) {
	return values.slice()
		.sort( ( a, b ) => Math.abs( a - fallback ) - Math.abs( b - fallback ) )[ 0 ];
}

export function parseLocalizedNumber(
	raw,
	{
		locale: targetLocale = locale.value,
		fallback = Number.NaN
	} = {}
) {
	if ( typeof raw === "number" ) {
		return Number.isFinite( raw ) ? raw : null;
	}

	const normalized = String( raw ?? "" ).trim();

	if ( !normalized ) {
		return null;
	}

	const candidates = [];

	for ( const format of getNumberFormatsForLocale( targetLocale ) ) {
		const parsed = parseWithNumberFormat(
			normalized,
			format
		);

		if ( parsed !== null && !candidates.some( ( value ) => value === parsed ) ) {
			candidates.push( parsed );
		}
	}

	if ( !candidates.length ) {
		return null;
	}

	return Number.isFinite( fallback ) ?
		chooseClosestNumber(
			candidates, fallback
		) :
		candidates[ 0 ];
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

function escapeHtmlAttribute( value ) {
	return String( value ?? "" )
		.replaceAll( "&", "&amp;" )
		.replaceAll( "\"", "&quot;" )
		.replaceAll( "<", "&lt;" )
		.replaceAll( ">", "&gt;" );
}

function encodeBase64Utf8( value ) {
	if ( typeof value !== "string" ) {
		return "";
	}

	if ( typeof Buffer !== "undefined" ) {
		return Buffer.from( value, "utf8" )
			.toString( "base64" );
	}

	if ( typeof TextEncoder !== "undefined" && typeof btoa === "function" ) {
		let binary = "";

		for ( const byte of new TextEncoder().encode( value ) ) {
			binary += String.fromCharCode( byte );
		}

		return btoa( binary );
	}

	return "";
}

function parseMarkerAttributes( source = "" ) {
	const attrs = {};
	const attrRe = /([:@\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
	let match = null;

	while ( ( match = attrRe.exec( source ) ) ) {
		const name = String( match[ 1 ] ?? "" )
			.trim()
			.toLowerCase();

		if ( !name ) {
			continue;
		}

		attrs[ name ] = match[ 2 ] ?? match[ 3 ] ?? match[ 4 ] ?? true;
	}

	return attrs;
}

function parseBooleanAttribute(
	attrs,
	name,
	defaultValue = false
) {
	if ( !( name in attrs ) ) {
		return defaultValue;
	}

	if ( attrs[ name ] === true ) {
		return true;
	}

	const normalized = String( attrs[ name ] ?? "" )
		.trim()
		.toLowerCase();

	return ![ "0", "false", "no", "off" ].includes( normalized );
}

function renderKatexMarker( attrSource = "" ) {
	const attrs = parseMarkerAttributes( attrSource );
	const sourceTex = typeof attrs.tex === "string" ? attrs.tex : "";

	if ( !sourceTex ) {
		return "";
	}

	const aligned = parseBooleanAttribute( attrs, "aligned" );
	const display = parseBooleanAttribute( attrs, "inline" ) ?
		false :
		parseBooleanAttribute( attrs, "display" );
	const tagName = attrs.as === "div" || display ? "div" : "span";
	const renderTex = aligned ?
		`\\begin{aligned}${sourceTex}\\end{aligned}` :
		sourceTex;
	const html = katexHTML( renderTex, display );
	const sourceTexB64 = encodeBase64Utf8( sourceTex );
	const renderTexB64 = encodeBase64Utf8( renderTex );

	return `<${tagName} data-katex-aligned="${aligned ? "1" : "0"}" data-katex-display="${display ? "1" : "0"}" data-katex-render-tex="${escapeHtmlAttribute( renderTex )}" data-katex-render-tex-b64="${escapeHtmlAttribute( renderTexB64 )}" data-katex-tex="${escapeHtmlAttribute( sourceTex )}" data-katex-tex-b64="${escapeHtmlAttribute( sourceTexB64 )}">${html}</${tagName}>`;
}

function renderRichMessage( message ) {
	if ( typeof message !== "string" || !message.toLowerCase().includes( "<katex" ) ) {
		return message;
	}

	return message.replace( KATEX_MARKER_RE, ( _match,
		attrSource = "" ) => renderKatexMarker( attrSource ) );
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

	return message == null ?
		`${namespace}.${key}` :
		renderRichMessage( message );
}

export function th(
	namespace, key, params = {}
) {
	const message = resolveMessage(
		namespace, key, params
	);

	return message == null ?
		`${namespace}.${key}` :
		renderRichMessage( message );
}

export function tm( namespace, key = "" ) {
	const scopedCatalog = catalog.get( namespace ) ?? {};
	return getNestedValue( scopedCatalog[ locale.value ] ?? scopedCatalog[ FALLBACK_LOCALE ] ?? {}, key );
}

export function useI18n( namespace ) {
	const injected = inject( I18N_KEY, null );
	const api = injected ?? i18nApi;
	const scopedTranslate = ( key,
		params = {} ) => api.t(
		namespace, key, params
	);

	scopedTranslate.html = ( key,
		params = {} ) => api.th(
		namespace, key, params
	);

	return {
		locale:    api.locale,
		parseLocalizedNumber: api.parseLocalizedNumber,
		setLocale: api.setLocale,
		t:         scopedTranslate,
		th:        ( key,
			params = {} ) => api.th(
			namespace, key, params
		),
		tm: ( key = "" ) => api.tm( namespace, key )
	};
}

export const i18nApi = {
	availableLocales: SUPPORTED_LOCALES,
	locale:           readonly( locale ),
	getLocale,
	parseLocalizedNumber,
	setLocale,
	t,
	th,
	tm
};

export default {
	install( app ) {
		setHtmlLanguage( locale.value );
		const globalTranslate = (
			namespace,
			key,
			params = {}
		) => t(
			namespace, key, params
		);

		globalTranslate.html = (
			namespace,
			key,
			params = {}
		) => th(
			namespace, key, params
		);

		app.provide( I18N_KEY, i18nApi );
		app.provide( "i18n", i18nApi );
		app.config.globalProperties.$i18n = i18nApi;
		app.config.globalProperties.$t = globalTranslate;
		app.config.globalProperties.$th = (
			namespace,
			key,
			params = {}
		) => th(
			namespace, key, params
		);
	}
};
