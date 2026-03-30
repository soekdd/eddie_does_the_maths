<!-- i18n-ally-scope: useI18n("book1.HA") -->
<template>
<div class="haDecoder">
	<v-row dense>
		<v-col cols="12" lg="7">
			<v-card class="pa-4" rounded="xl">
				<div class="panelHeader">
					<div>
						<div class="text-h6">{{ t( "decoder.editorTitle" ) }}</div>
						<div class="text-body-2 text-medium-emphasis">
							{{ t( "decoder.editorHint" ) }}
						</div>
					</div>
					<div class="actionRow">
						<v-btn
							rounded="xl"
							variant="tonal"
							@click="clearEditor"
						>
							{{ t( "decoder.actions.clear" ) }}
						</v-btn>
					</div>
				</div>

				<v-select
					v-model="selectedExample"
					class="mb-4"
					clearable
					density="comfortable"
					hide-details
					item-title="label"
					item-value="value"
					:items="exampleItems"
					:label="t( 'decoder.examplesLabel' )"
					prepend-inner-icon="mdi-playlist-star"
					variant="outlined"
					@update:model-value="applyExample"
				/>

				<div class="editorShell">
					<EditorContent :editor />
					<div v-if="!plainText.trim()" class="editorPlaceholder">
						{{ t( "decoder.placeholder" ) }}
					</div>
				</div>

				<div class="mt-5">
					<div class="text-subtitle-1 font-weight-medium">{{ t( "decoder.paletteTitle" ) }}</div>
					<div class="text-body-2 text-medium-emphasis mb-3">
						{{ t( "decoder.paletteHint" ) }}
					</div>

					<v-expansion-panels v-model="openPanels" variant="accordion">
						<v-expansion-panel
							v-for="group in codeGroups"
							:key="group.id"
							:value="group.id"
						>
							<v-expansion-panel-title>
								{{ group.title }}
							</v-expansion-panel-title>
							<v-expansion-panel-text>
								<div class="codeGrid">
									<v-tooltip
										v-for="item in group.items"
										:key="`${group.id}-${item.token}`"
										location="bottom"
										:text="item.description"
									>
										<template #activator="{ props: tooltipProps }">
											<v-btn
												v-bind="tooltipProps"
												class="codeButton"
												:color="item.color ?? 'primary'"
												size="small"
												variant="tonal"
												@click="insertSnippet( item.insertText )"
											>
												{{ item.token }}
											</v-btn>
										</template>
									</v-tooltip>
								</div>
							</v-expansion-panel-text>
						</v-expansion-panel>
					</v-expansion-panels>
				</div>
			</v-card>
		</v-col>

		<v-col cols="12" lg="5">
			<v-card class="pa-4" rounded="xl">
				<div class="text-h6">{{ t( "decoder.translationTitle" ) }}</div>
				<div class="text-body-2 text-medium-emphasis mb-4">
					{{ t( "decoder.translationHint" ) }}
				</div>

				<v-alert
					v-if="!decoded.normalized"
					class="mb-4"
					type="info"
					variant="tonal"
				>
					{{ t( "decoder.emptyTranslation" ) }}
				</v-alert>

				<template v-else>
					<HAMorseCodeDisplay
						class="mt-4"
						:show-source="false"
						:text="decoded.normalized"
					/>

					<v-sheet class="mt-4 pa-4 naturalCard" rounded="lg">
						<div class="text-caption text-medium-emphasis mb-2">
							{{ t( "decoder.translationTitle" ) }}
						</div>
						<div class="outputEditorShell">
							<EditorContent :editor="naturalOutputEditor" />
						</div>
					</v-sheet>

					<v-sheet
						v-if="decoded.hasPayloadTrigger && decoded.payloadText"
						border
						class="mt-4 pa-3"
						rounded="lg"
					>
						<div class="text-caption text-medium-emphasis mb-2">
							{{ t( "decoder.secretPayloadTitle" ) }}
						</div>
						<code class="payloadText">{{ decoded.payloadText }}</code>
					</v-sheet>

					<div class="tokenTableWrap mt-4">
						<v-table density="compact">
							<thead>
								<tr>
									<th>{{ t( "decoder.table.token" ) }}</th>
									<th>{{ t( "decoder.table.type" ) }}</th>
									<th>{{ t( "decoder.table.meaning" ) }}</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="( item, index ) in decoded.tokens"
									:key="`${item.token}-${index}`"
								>
									<td><code>{{ item.token }}</code></td>
									<td>
										<v-chip
											:color="tokenTypeColor( item.type )"
											size="small"
											variant="tonal"
										>
											{{ item.typeLabel }}
										</v-chip>
									</td>
									<td>{{ item.natural }}</td>
								</tr>
							</tbody>
						</v-table>
					</div>
				</template>
			</v-card>
		</v-col>
	</v-row>
</div>
</template>

<script setup>
import {
	computed, ref, watch
} from "vue";
import StarterKit from "@tiptap/starter-kit";
import { Decoration } from "@tiptap/pm/view";
import { EditorContent, useEditor } from "@tiptap/vue-3";
import { useI18n } from "@/utils/i18n.mjs";
import HAMorseCodeDisplay from "./HA_MorseCodeDisplay.vue";
import { buildCommentDecorationSet } from "./HA_commentDecorations.mjs";
import { HA_SPECIAL_SYMBOL_BY_TOKEN, HA_SPECIAL_TOKEN_SET } from "./HA_specialSymbols.mjs";

const props = defineProps( {
	modelValue: {
		type:    String,
		default: ""
	}
} );

const emit = defineEmits( [
	"update:modelValue",
	"update:output"
] );

const TEMPLATE_IDS = [
	"cq_general_call",
	"cq_sm",
	"cq_oh",
	"cq_y4",
	"cq_dl",
	"rst_599",
	"qth_dresden",
	"pwr_100w",
	"ant_dipole",
	"wx_sunny",
	"best_regards",
	"only_reply"
];

const Q_CODE_TOKENS = [
	"QAP",
	"QER",
	"QRA",
	"QRG",
	"QRL",
	"QRM",
	"QRN",
	"QRP",
	"QRQ",
	"QRS",
	"QRV",
	"QRX",
	"QRZ",
	"QRT",
	"QRO",
	"QSB",
	"QSL",
	"QSO",
	"QSP",
	"QSY",
	"QTC",
	"QTH",
	"QTR"
];

const CW_CODE_TOKENS = [
	"73",
	"88",
	"AGN",
	"ANT",
	"AR",
	"AS",
	"BK",
	"CALL",
	"CFM",
	"CL",
	"CPI",
	"CPY",
	"CQ",
	"CONDX",
	"CUL",
	"DE",
	"DR",
	"ES",
	"FB",
	"FER",
	"GA",
	"GD",
	"GE",
	"GL",
	"GM",
	"GN",
	"GUD",
	"HI",
	"HR",
	"HW",
	"IMI",
	"K",
	"KN",
	"LIL",
	"MSG",
	"NIL",
	"NR",
	"NW",
	"OM",
	"OP",
	"OPR",
	"PSE",
	"PWR",
	"R",
	"RCVR",
	"RIG",
	"RPRT",
	"RPT",
	"RX",
	"SK",
	"SOS",
	"SRI",
	"TEMP",
	"TEST",
	"TKS",
	"TNX",
	"TU",
	"TX",
	"UR",
	"VY",
	"WX",
	"XYL",
	"YL"
];

const PALETTE_GROUPS = [
	{
		id:       "templates",
		titleKey: "decoder.paletteGroups.templates",
		color:    "secondary",
		tokens:   TEMPLATE_IDS
	},
	{
		id:       "q-codes",
		titleKey: "decoder.paletteGroups.qCodes",
		color:    "primary",
		tokens:   Q_CODE_TOKENS
	},
	{
		id:       "cw",
		titleKey: "decoder.paletteGroups.cwCodes",
		color:    "info",
		tokens:   CW_CODE_TOKENS
	}
];

const CONTEXTUAL_FOLLOWUP_TOKENS = new Set( [
	"ANT",
	"CONDX",
	"NR",
	"OP",
	"OPR",
	"PWR",
	"QRA",
	"QRG",
	"QTH",
	"QTR",
	"RIG",
	"TEMP",
	"WX"
] );

const CONTEXT_PREFIX_KEYS = {
	ANT: "decoder.patterns.antennaPrefix",
	PWR: "decoder.patterns.powerPrefix",
	QRA: "decoder.patterns.namePrefix",
	QRG: "decoder.patterns.frequencyPrefix",
	QTH: "decoder.patterns.locationPrefix",
	QTR: "decoder.patterns.timePrefix",
	WX:  "decoder.patterns.weatherPrefix"
};

const PAYLOAD_BLACKLIST = new Set( [
	"MOST",
	"QER?",
	"SRI",
	"SOME",
	"LETTERS",
	"MISSED",
	"STILL",
	"NOT",
	"UNDERSTOOD",
	"IMP",
	"PATIENCE",
	"ALL",
	"NO",
	"PROB",
	"DRESDEN",
	"STRANGE",
	"NOT"
] );

const EMPTY_RESULT = Object.freeze( {
	hasPayloadTrigger: false,
	normalized:      "",
	naturalLines:    [],
	naturalSegments: [],
	tokens:          [],
	naturalText:     "",
	payloadText:     ""
} );

const { t, tm } = useI18n( "book1.HA" );

const openPanels = ref( "templates" );
const plainText = ref( "" );
const selectedExample = ref( null );

const snippetEntries = computed( () => tm( "decoder.snippets" ) ?? {} );
const qCodeEntries = computed( () => tm( "decoder.qCodes" ) ?? {} );
const cwCodeEntries = computed( () => tm( "decoder.cwCodes" ) ?? {} );
const rstEntries = computed( () => tm( "decoder.rst" ) ?? {} );
const typeLabels = computed( () => tm( "decoder.typeLabels" ) ?? {} );
const exampleItems = computed( () => tm( "decoder.examples" ) ?? [] );

function normalizeLineEndings( value ) {
	return String( value ?? "" ).replace( /\r\n?/g, "\n" );
}

function createDocFromText( text ) {
	const lines = normalizeLineEndings( text ).split( "\n" );
	const paragraphs = lines.length === 1 && lines[ 0 ] === "" ?
		[ { type: "paragraph" } ] :
		lines.map( ( line ) => line ?
			{
				type:    "paragraph",
				content: [ {
					type: "text",
					text: line
				} ]
			} :
			{ type: "paragraph" } );

	return {
		type:    "doc",
		content: paragraphs
	};
}

function extractPlainText( instance ) {
	const lines = [];

	instance.state.doc.forEach( ( node ) => {
		lines.push( node.textContent );
	} );

	return lines.join( "\n" );
}

function createTextEditorExtensions() {
	return [
		StarterKit.configure( {
			blockquote:     false,
			bulletList:     false,
			codeBlock:      false,
			heading:        false,
			horizontalRule: false,
			listItem:       false,
			orderedList:    false
		} )
	];
}

function createTextEditorAttributes( className,
	autocapitalize = "off" ) {
	return {
		autocapitalize,
		autocomplete: "off",
		autocorrect:  "off",
		class:        className,
		spellcheck:   "false"
	};
}

const editor = useEditor( {
	content:     createDocFromText( props.modelValue ),
	extensions:  createTextEditorExtensions(),
	editorProps: {
		decorations: ( state ) => buildCommentDecorationSet( state.doc ),
		attributes:  createTextEditorAttributes( "haDecoderTextEditor haDecoderEditor",
			"characters" )
	},
	onCreate: ( { editor: instance } ) => {
		plainText.value = extractPlainText( instance );
	},
	onUpdate: ( { editor: instance } ) => {
		plainText.value = extractPlainText( instance );
	}
} );

function normalize( text ) {
	return String( text ?? "" )
		.toUpperCase()
		.replace( /\s+/g, " " )
		.trim();
}

function splitPrefixedLine( line ) {
	const match = String( line ?? "" ).match( /^(\s*)(.*)$/s );

	return {
		linePrefix: match?.[ 1 ] ?? "",
		content:    match?.[ 2 ] ?? ""
	};
}

function isCommentLine( content ) {
	return String( content ?? "" ).trimStart()
		.startsWith( "#" );
}

function isCallsign( token ) {
	return /^[A-Z0-9]{1,4}\d[A-Z0-9]{1,4}(?:\/[A-Z0-9]{1,4})?$/.test( token );
}

function isRSTToken( token ) {
	return token === "RST";
}

function isNumberWithUnit( token ) {
	return /^\d+(?:[.,]\d+)?(?:[A-Z%]+)?$/.test( token );
}

function isCQTargetPrefix( token ) {
	return /^(?=.*[A-Z])[A-Z0-9]{1,3}$/.test( token ) &&
		!isCallsign( token ) &&
		!isKnownCode( token );
}

function isKnownCode( token ) {
	return Boolean( qCodeEntries.value?.[ token ] ||
		cwCodeEntries.value?.[ token ] ||
		HA_SPECIAL_TOKEN_SET.has( token ) ||
		isRSTToken( token ) );
}

function resolvePaletteEntry( groupId,
	token ) {
	if ( groupId === "templates" ) {
		return snippetEntries.value?.[ token ] ?? null;
	}

	if ( groupId === "q-codes" ) {
		return qCodeEntries.value?.[ token ] ?? null;
	}

	if ( groupId === "cw" ) {
		return cwCodeEntries.value?.[ token ] ?? null;
	}

	return null;
}

function buildPaletteItem(
	groupId,
	token,
	fallbackColor
) {
	const entry = resolvePaletteEntry( groupId,
		token );

	if ( !entry ) {
		return null;
	}

	if ( groupId === "templates" ) {
		return {
			token:       entry.token ?? token,
			insertText:  entry.insertText ?? `${token} `,
			description: entry.description ??
				entry.token ??
				token,
			color: entry.color ?? fallbackColor
		};
	}

	return {
		token,
		insertText:  `${token} `,
		description: entry.description ?? token,
		color:       entry.color ?? fallbackColor
	};
}

const codeGroups = computed( () => PALETTE_GROUPS.map( ( group ) => ( {
	id:    group.id,
	title: t( group.titleKey ),
	items: group.tokens.map( ( token ) => buildPaletteItem(
		group.id,
		token,
		group.color
	) ).filter( Boolean )
} ) ) );

function getTypeLabel( type ) {
	return typeLabels.value?.[ type ] ?? type;
}

function decodeRST( token ) {
	if ( !/^\d{2,3}$/.test( token ) ) {
		return t( "decoder.patterns.value", { token } );
	}

	const digits = token.split( "" );
	const readability = rstEntries.value?.readability?.[ digits[ 0 ] ] ?? digits[ 0 ];
	const strength = rstEntries.value?.strength?.[ digits[ 1 ] ] ?? digits[ 1 ];
	const tone = digits[ 2 ] ?
		rstEntries.value?.tone?.[ digits[ 2 ] ] ?? digits[ 2 ] :
		"-";

	return t( "decoder.rst.template", {
		code: token,
		readability,
		strength,
		tone
	} );
}

function decodeToken( token,
	previousToken = "" ) {
	if ( HA_SPECIAL_SYMBOL_BY_TOKEN[ token ] ) {
		return {
			token,
			type:      "cw-abbrev",
			typeLabel: getTypeLabel( "cw-abbrev" ),
			natural:   HA_SPECIAL_SYMBOL_BY_TOKEN[ token ]
		};
	}

	if ( qCodeEntries.value?.[ token ] ) {
		return {
			token,
			type:      "q-code",
			typeLabel: getTypeLabel( "q-code" ),
			natural:   qCodeEntries.value[ token ].description ?? token
		};
	}

	if ( cwCodeEntries.value?.[ token ] ) {
		return {
			token,
			type:      "cw-abbrev",
			typeLabel: getTypeLabel( "cw-abbrev" ),
			natural:   cwCodeEntries.value[ token ].description ?? token
		};
	}

	if ( isRSTToken( token ) ) {
		return {
			token,
			type:      "rst",
			typeLabel: getTypeLabel( "rst" ),
			natural:   t( "decoder.patterns.signalReportFollows" )
		};
	}

	if ( previousToken === "RST" && /^\d{2,3}$/.test( token ) ) {
		return {
			token,
			type:      "rst",
			typeLabel: getTypeLabel( "rst" ),
			natural:   decodeRST( token )
		};
	}

	if ( previousToken === "CQ" && isCQTargetPrefix( token ) ) {
		return {
			token,
			type:      "label",
			typeLabel: getTypeLabel( "label" ),
			natural:   t( "decoder.patterns.targetPrefix", { token } )
		};
	}

	if ( isCallsign( token ) ) {
		return {
			token,
			type:      "callsign",
			typeLabel: getTypeLabel( "callsign" ),
			natural:   t( "decoder.patterns.callsign", { token } )
		};
	}

	if ( isNumberWithUnit( token ) ) {
		return {
			token,
			type:      "value",
			typeLabel: getTypeLabel( "value" ),
			natural:   t( "decoder.patterns.value", { token } )
		};
	}

	return {
		token,
		type:      "free-text",
		typeLabel: getTypeLabel( "free-text" ),
		natural:   token
	};
}

function createSegment( text,
	unknown = false ) {
	return {
		text: String( text ?? "" ),
		unknown
	};
}

function isContextualFollowup( current,
	next ) {
	return Boolean( current &&
		next &&
		CONTEXTUAL_FOLLOWUP_TOKENS.has( current.token ) &&
		!isKnownCode( next.token ) );
}

function getContextPrefix( current ) {
	const explicitKey = CONTEXT_PREFIX_KEYS[ current.token ];

	if ( explicitKey ) {
		return t( explicitKey );
	}

	return `${current.natural}: `;
}

function isPayloadToken( token ) {
	return Boolean( token ) && !PAYLOAD_BLACKLIST.has( token );
}

function buildUnknownSegmentDecorations( doc,
	naturalLines,
	highlightUnknownSegments = false ) {
	if ( !highlightUnknownSegments ) {
		return [];
	}

	const decorations = [];
	let lineIndex = 0;

	doc.descendants( ( node, pos ) => {
		if ( !node.isTextblock ) {
			return;
		}

		const lineSegments = naturalLines[ lineIndex ] ?? [];
		let offset = 0;

		lineSegments.forEach( ( segment ) => {
			const segmentText = String( segment?.text ?? "" );

			if ( segment.unknown && segmentText ) {
				decorations.push( Decoration.inline(
					pos + 1 + offset,
					pos + 1 + offset + segmentText.length,
					{ class: "haUnknownToken" }
				) );
			}

			offset += segmentText.length;
		} );

		lineIndex += 1;
	} );

	return decorations;
}

function buildNaturalText( decodedTokens,
	hasPayloadTrigger = false ) {
	const parts = [];
	const payloadTokens = [];
	let index = 0;

	while ( index < decodedTokens.length ) {
		const current = decodedTokens[ index ];
		const next = decodedTokens[ index + 1 ];
		const third = decodedTokens[ index + 2 ];

		if (
			current?.type === "callsign" &&
			next?.token === "DE" &&
			third?.type === "callsign"
		) {
			parts.push( createSegment( t( "decoder.patterns.callPattern", {
				caller: third.token,
				called: current.token
			} ) ) );
			index += 3;
			continue;
		}

		if ( current?.token === "RST" && next?.type === "rst" ) {
			parts.push( createSegment( next.natural ) );
			index += 2;
			continue;
		}

		if ( current?.token === "CQ" && next?.type === "label" ) {
			parts.push( createSegment( t( "decoder.patterns.targetedCallPattern", { target: next.token } ) ) );
			index += 2;
			continue;
		}

		if ( isContextualFollowup( current,
			next ) ) {
			parts.push( createSegment( `${getContextPrefix( current )}${next.token}` ) );
			index += 2;
			continue;
		}

		const unknown = current?.type === "free-text";

		parts.push( createSegment( current?.natural ?? "",
			unknown ) );

		if ( hasPayloadTrigger && unknown && isPayloadToken( current.token ) ) {
			payloadTokens.push( current.token );
		}

		index += 1;
	}

	const naturalSegments = [];

	parts.forEach( ( part,
		partIndex ) => {
		if ( partIndex > 0 ) {
			naturalSegments.push( createSegment( " | " ) );
		}

		naturalSegments.push( part );
	} );

	return {
		segments:    naturalSegments,
		text:        naturalSegments.map( ( segment ) => segment.text ).join( "" ),
		payloadText: payloadTokens.join( " " )
	};
}

function decodeSequence( text ) {
	const lines = normalizeLineEndings( text ).split( "\n" );
	const hasPayloadTrigger = lines.some( ( line ) => {
		const { content } = splitPrefixedLine( line );
		const trimmedContent = content.trim();

		if ( !trimmedContent || isCommentLine( content ) ) {
			return false;
		}

		return normalize( content ).split( " " ).includes( "QER" );
	} );
	const decodedLines = lines.map( ( line ) => {
		const sourceLine = String( line ?? "" );
		const {
			linePrefix,
			content
		} = splitPrefixedLine( sourceLine );
		const trimmedContent = content.trim();

		if ( !trimmedContent ) {
			return {
				normalizedLine:  sourceLine,
				naturalSegments: sourceLine ? [ createSegment( sourceLine ) ] : [],
				tokens:          [],
				naturalText:     sourceLine,
				payloadText:     ""
			};
		}

		if ( isCommentLine( content ) ) {
			return {
				normalizedLine:  sourceLine,
				naturalSegments: [ createSegment( sourceLine ) ],
				tokens:          [],
				naturalText:     sourceLine,
				payloadText:     ""
			};
		}

		const normalizedContent = normalize( content );
		const rawTokens = normalizedContent.split( " " ).filter( Boolean );
		const decodedTokens = rawTokens.map( ( token,
			index ) => decodeToken( token,
			rawTokens[ index - 1 ] ?? "" ) );
		const natural = buildNaturalText( decodedTokens,
			hasPayloadTrigger );
		const naturalSegments = linePrefix ?
			[
				createSegment( linePrefix ),
				...natural.segments
			] :
			natural.segments;

		return {
			normalizedLine: `${linePrefix}${normalizedContent}`,
			naturalSegments,
			tokens:         decodedTokens,
			naturalText:    `${linePrefix}${natural.text}`,
			payloadText:    natural.payloadText
		};
	} );
	const naturalSegments = [];

	decodedLines.forEach( ( line,
		index ) => {
		if ( index > 0 ) {
			naturalSegments.push( createSegment( "\n" ) );
		}

		naturalSegments.push( ...line.naturalSegments );
	} );

	return {
		hasPayloadTrigger,
		naturalLines: decodedLines.map( ( line ) => line.naturalSegments ),
		normalized:   decodedLines.map( ( line ) => line.normalizedLine ).join( "\n" ),
		naturalSegments,
		tokens:       decodedLines.flatMap( ( line ) => line.tokens ),
		naturalText:  decodedLines.map( ( line ) => line.naturalText ).join( "\n" ),
		payloadText:  decodedLines.map( ( line ) => line.payloadText ).filter( Boolean )
			.join( "\n" )
	};
}

const decoded = computed( () => plainText.value.trim() ?
	decodeSequence( plainText.value ) :
	EMPTY_RESULT );
const naturalDisplayText = computed( () => decoded.value.naturalText || "—" );

const naturalOutputEditor = useEditor( {
	content:     createDocFromText( naturalDisplayText.value ),
	editable:    false,
	extensions:  createTextEditorExtensions(),
	editorProps: {
		decorations: ( state ) => buildCommentDecorationSet( state.doc,
			buildUnknownSegmentDecorations( state.doc,
				decoded.value.naturalLines,
				decoded.value.hasPayloadTrigger ) ),
		attributes: createTextEditorAttributes( "haDecoderTextEditor haReadonlyEditor haDecoderOutputEditor" )
	}
} );

watch(
	() => props.modelValue, ( nextValue ) => {
		if ( normalizeLineEndings( nextValue ) === normalizeLineEndings( plainText.value ) ) {
			return;
		}

		setEditorText( nextValue );
	}, { immediate: true }
);

watch( plainText, ( nextValue ) => {
	emit( "update:modelValue", nextValue );
} );

watch(
	() => decoded.value.naturalText, ( nextValue ) => {
		emit( "update:output", nextValue );
	}, { immediate: true }
);

watch(
	[
		() => naturalOutputEditor.value,
		() => naturalDisplayText.value
	], ( [
		instance,
		nextValue
	] ) => {
		if ( !instance ) {
			return;
		}

		instance.commands.setContent( createDocFromText( nextValue ),
			false );
	}, { immediate: true }
);

function setEditorText( text ) {
	const instance = editor.value;
	const normalizedText = normalizeLineEndings( text );

	if ( !instance ) {
		plainText.value = normalizedText;
		return;
	}

	instance.commands.setContent( createDocFromText( normalizedText ),
		false );
	plainText.value = extractPlainText( instance );
}

function clearEditor() {
	selectedExample.value = null;
	setEditorText( "" );
}

function applyExample( value ) {
	if ( typeof value !== "string" || !value.trim() ) {
		return;
	}

	setEditorText( value );
}

function insertSnippet( snippet ) {
	const instance = editor.value;

	if ( !instance ) {
		return;
	}

	const beforeSelection = instance.state.doc.textBetween(
		0,
		instance.state.selection.from,
		" ",
		" "
	);
	const needsLeadingSpace = beforeSelection.length > 0 && !/\s$/.test( beforeSelection );
	const insertText = `${needsLeadingSpace ? " " : ""}${snippet}`;

	instance.chain().focus()
		.insertContent( insertText )
		.run();
}

function tokenTypeColor( type ) {
	return {
		"q-code":    "primary",
		"cw-abbrev": "info",
		rst:         "success",
		label:       "secondary",
		callsign:    "warning",
		value:       "deep-orange",
		"free-text": "grey"
	}[ type ] ?? "grey";
}
</script>

<style scoped>
.haDecoder {
	width: 100%;
}

.panelHeader {
	align-items: flex-start;
	display: flex;
	gap: 16px;
	justify-content: space-between;
}

.actionRow {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
}

.editorShell {
	margin-top: 16px;
	min-height: 220px;
	position: relative;
}

.editorPlaceholder {
	color: rgba( 0, 0, 0, 0.45 );
	left: 18px;
	pointer-events: none;
	position: absolute;
	top: 18px;
}

.codeGrid {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}

.outputEditorShell {
	min-height: 28px;
}

.codeButton {
	font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
	letter-spacing: 0.02em;
	text-transform: none;
}

.normalizedText,
.payloadText {
	display: block;
	font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
	line-height: 1.6;
	white-space: pre-wrap;
	word-break: break-word;
}

.naturalCard {
	background: linear-gradient( 135deg, rgba(var(--v-theme-primary), 0.08), rgba(var(--v-theme-info), 0.08) );
}

.unknownText {
	color: rgb(var(--v-theme-error));
	font-weight: 700;
}

.tokenTableWrap {
	overflow-x: auto;
}

:deep(.haDecoderEditor) {
	border: 1px solid rgba( 0, 0, 0, 0.12 );
	border-radius: 18px;
	min-height: 220px;
	outline: none;
	padding: 18px;
}

:deep(.haDecoderTextEditor p) {
	margin: 0;
}

:deep(.haDecoderTextEditor .haCommentLine) {
	color: rgb(var(--v-theme-success));
}

:deep(.haDecoderTextEditor .haQxxToken) {
	color: rgb(var(--v-theme-info));
	font-weight: 600;
}

:deep(.haDecoderTextEditor .haQerToken) {
	color: rgb(var(--v-theme-error));
	font-weight: 700;
}

:deep(.haDecoderEditor:focus) {
	border-color: rgba(var(--v-theme-primary), 0.5);
	box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.12);
}

:deep(.haReadonlyEditor) {
	min-height: 0;
	outline: none;
	padding: 0;
}

:deep(.haDecoderOutputEditor) {
	font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
	line-height: 1.6;
	white-space: pre-wrap;
	word-break: break-word;
}

:deep(.haDecoderOutputEditor .haUnknownToken) {
	color: rgb(var(--v-theme-error));
	font-weight: 700;
}

@media ( max-width: 960px ) {
	.panelHeader {
		flex-direction: column;
	}
}
</style>
