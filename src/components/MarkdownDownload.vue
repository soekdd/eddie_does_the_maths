<template>
<v-btn
	:append-icon="mdiDownload"
	density="comfortable"
	:disabled="isBusy"
	:loading="isBusy"
	size="small"
	style="margin: -1em"
	variant="text"
	@click="downloadMarkdown"
>
	{{ buttonLabel }}
</v-btn>
</template>

<script setup>
import { ref } from "vue";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import { mdiDownload } from "@mdi/js";
const props = defineProps( {
	targetId:    { type: String, required: true },
	fileName:    { type: String, default: "description" },
	buttonLabel: { type: String, default: "Markdown" }
} );

const isBusy = ref( false );

function sanitizeFileName( value ) {
	const normalized = String( value ?? "" )
		.trim()
		.normalize( "NFD" )
		.replace( /[\u0300-\u036f]/gu, "" )
		.replace( /[^a-zA-Z0-9._-]+/gu, "-" )
		.replace( /-+/gu, "-" )
		.replace( /^-+|-+$/gu, "" );

	return normalized || "description";
}

function decodeBase64Utf8( value ) {
	if ( typeof value !== "string" || !value ) {
		return "";
	}

	if ( typeof atob !== "function" ) {
		return "";
	}

	try {
		const binary = atob( value );
		const bytes = Uint8Array.from( binary, ( char ) => char.charCodeAt( 0 ) );

		if ( typeof TextDecoder === "function" ) {
			return new TextDecoder().decode( bytes );
		}

		return binary;
	} catch {
		return "";
	}
}

function decodeHtmlEntities( value ) {
	if ( typeof value !== "string" || !value || typeof document === "undefined" ) {
		return "";
	}

	const helper = document.createElement( "textarea" );
	helper.innerHTML = value;
	return helper.value;
}

function getFirstNonEmpty( ...values ) {
	for ( const value of values ) {
		const normalized = String( value ?? "" ).trim();

		if ( normalized ) {
			return normalized;
		}
	}

	return "";
}

function getKatexSourceTex( element ) {
	const texB64 = decodeBase64Utf8( element.getAttribute( "data-katex-tex-b64" ) ?? "" );
	const texAttr = decodeHtmlEntities( element.getAttribute( "data-katex-tex" ) ?? "" );
	return getFirstNonEmpty( texB64, texAttr );
}

function getKatexRenderTex( element ) {
	const texB64 = decodeBase64Utf8( element.getAttribute( "data-katex-render-tex-b64" ) ?? "" );
	const texAttr = decodeHtmlEntities( element.getAttribute( "data-katex-render-tex" ) ?? "" );
	return getFirstNonEmpty( texB64, texAttr );
}

function getKatexMarkdownTex( element ) {
	const sourceTex = getKatexSourceTex( element );
	const renderTex = getKatexRenderTex( element );
	const isAligned = element.getAttribute( "data-katex-aligned" ) === "1";

	if ( isAligned ) {
		if ( renderTex ) {
			return renderTex;
		}

		if ( sourceTex ) {
			return `\\begin{aligned}${sourceTex}\\end{aligned}`;
		}

		return "";
	}

	return getFirstNonEmpty( sourceTex, renderTex );
}

const katexSelector = [
	"[data-katex-tex]",
	"[data-katex-render-tex]",
	"[data-katex-tex-b64]",
	"[data-katex-render-tex-b64]"
].join( ", " );

function isKatexNode( node ) {
	if ( !node || typeof node !== "object" ) {
		return false;
	}

	if ( !( "nodeType" in node ) || node.nodeType !== 1 ) {
		return false;
	}

	return typeof node.matches === "function" && node.matches( katexSelector );
}

function removeIgnoredElements( root ) {
	const selectors = [
		".exampleFigure",
		"img",
		"script",
		"style",
		"noscript",
		".v-expansion-panel-title__icon",
		".v-icon"
	];

	for ( const selector of selectors ) {
		for ( const element of root.querySelectorAll( selector ) ) {
			element.remove();
		}
	}
}

function normalizeMarkdown( markdown ) {
	return markdown
		.replace( /\n{3,}/gu, "\n\n" )
		.replace( /[ \t]+\n/gu, "\n" )
		.trim() + "\n";
}

function toMarkdown( element ) {
	const root = element.cloneNode( true );
	removeIgnoredElements( root );

	const turndown = new TurndownService( {
		headingStyle:     "atx",
		bulletListMarker: "-",
		codeBlockStyle:   "fenced",
		emDelimiter:      "*"
	} );
	turndown.use( gfm );
	turndown.addRule( "katexToMarkdownMath", {
		filter:      isKatexNode,
		replacement: ( _, node ) => {
			const tex = getKatexMarkdownTex( node );

			if ( !tex ) {
				return "";
			}

			const isDisplay = node.getAttribute( "data-katex-display" ) === "1";
			return isDisplay ? `\n\n$$\n${tex}\n$$\n\n` : `$${tex}$`;
		}
	} );

	const markdown = turndown.turndown( root );
	return normalizeMarkdown( markdown );
}

function triggerDownload( content, fileName ) {
	const blob = new Blob( [ content ], { type: "text/markdown;charset=utf-8" } );
	const url = URL.createObjectURL( blob );
	const link = document.createElement( "a" );
	link.href = url;
	link.download = `${sanitizeFileName( fileName )}.md`;
	document.body.append( link );
	link.click();
	link.remove();
	URL.revokeObjectURL( url );
}

function downloadMarkdown() {
	if ( typeof document === "undefined" ) {
		return;
	}

	const source = document.getElementById( props.targetId );

	if ( !source ) {
		return;
	}

	isBusy.value = true;

	try {
		const markdown = toMarkdown( source );
		triggerDownload( markdown, props.fileName );
	} finally {
		isBusy.value = false;
	}
}
</script>
