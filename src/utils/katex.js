import katex from "katex";

function escapeHTML( s ) {
	return String( s )
		.replaceAll( "&", "&amp;" )
		.replaceAll( "<", "&lt;" )
		.replaceAll( ">", "&gt;" )
		.replaceAll( "\"", "&quot;" )
		.replaceAll( "'", "&#039;" );
}

export function katexHTML( tex, displayMode = false ) {
	try {
		return katex.renderToString( tex, { throwOnError: true, displayMode } );
	} catch(e) {
		console.log("Katex Error",tex,e)
		return `<code>${escapeHTML( tex )}</code>`;
	}
}
