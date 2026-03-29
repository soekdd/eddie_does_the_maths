import { Decoration, DecorationSet } from "@tiptap/pm/view";

function collectBaseDecorations( doc ) {
	const decorations = [];

	doc.descendants( ( node, pos ) => {
		if ( !node.isTextblock ) {
			return;
		}

		const text = node.textContent ?? "";

		if ( /^\s*#/.test( text ) ) {
			decorations.push( Decoration.node( pos,
				pos + node.nodeSize, {
					class: "haCommentLine"
				} ) );
			return;
		}

		for ( const match of text.matchAll( /\S+/g ) ) {
			const token = match[ 0 ] ?? "";
			const offset = match.index ?? -1;

			if ( offset < 0 || !/^Q[A-Z0-9]{2,}\??$/.test( token ) ) {
				continue;
			}

			const from = pos + 1 + offset;
			const to = from + token.length;
			const decorationClass = /^QER\??$/.test( token ) ?
				"haQerToken" :
				"haQxxToken";

			decorations.push( Decoration.inline( from,
				to, {
					class: decorationClass
				} ) );
		}
	} );

	return decorations;
}

export function buildCommentDecorationSet( doc, extraDecorations = [] ) {
	return DecorationSet.create( doc, [
		...collectBaseDecorations( doc ),
		...extraDecorations
	] );
}
