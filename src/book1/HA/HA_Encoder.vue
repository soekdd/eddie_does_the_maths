<template>
<div class="haEncoder">
	<v-row dense>
		<v-col cols="12" lg="7">
			<v-card class="pa-4" rounded="xl">
				<div class="panelHeader">
					<div>
						<div class="text-h6">{{ t( "encoder.editorTitle" ) }}</div>
						<div class="text-body-2 text-medium-emphasis">
							{{ t( "encoder.editorHint" ) }}
						</div>
					</div>
					<div class="actionRow">
						<v-btn
							rounded="xl"
							variant="tonal"
							@click="clearEditor"
						>
							{{ t( "encoder.actions.clear" ) }}
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
					:label="t( 'encoder.examplesLabel' )"
					prepend-inner-icon="mdi-playlist-star"
					variant="outlined"
					@update:model-value="applyExample"
				/>

				<div class="editorShell">
					<EditorContent :editor />
					<div v-if="!plainText.trim()" class="editorPlaceholder">
						{{ t( "encoder.placeholder" ) }}
					</div>
				</div>

				<div class="mt-5">
					<div class="text-subtitle-1 font-weight-medium">{{ t( "encoder.paletteTitle" ) }}</div>
					<div class="text-body-2 text-medium-emphasis mb-3">
						{{ t( "encoder.paletteHint" ) }}
					</div>

					<v-expansion-panels v-model="openPanels" variant="accordion">
						<v-expansion-panel
							v-for="group in phraseGroups"
							:key="group.id"
							:value="group.id"
						>
							<v-expansion-panel-title>
								{{ group.title }}
							</v-expansion-panel-title>
							<v-expansion-panel-text>
								<div class="phraseGrid">
									<v-tooltip
										v-for="item in group.items"
										:key="`${group.id}-${item.key}`"
										location="bottom"
										:text="item.description"
									>
										<template #activator="{ props: tooltipProps }">
											<v-btn
												v-bind="tooltipProps"
												class="phraseButton"
												:color="item.color ?? 'primary'"
												variant="tonal"
												@click="insertSnippet( item.insertText )"
											>
												{{ item.label }}
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
				<div class="text-h6">{{ t( "encoder.translationTitle" ) }}</div>
				<div class="text-body-2 text-medium-emphasis mb-4">
					{{ t( "encoder.translationHint" ) }}
				</div>

				<v-alert
					v-if="!plainText.trim()"
					class="mb-4"
					type="info"
					variant="tonal"
				>
					{{ t( "encoder.emptyTranslation" ) }}
				</v-alert>

				<template v-else>
					<v-sheet border class="pa-3" rounded="lg">
						<div class="text-caption text-medium-emphasis mb-2">
							{{ t( "encoder.encodedLabel" ) }}
						</div>
						<code class="encodedText">{{ encoded.codeText || "—" }}</code>
					</v-sheet>
					<HAMorseCodeDisplay
						class="mt-4"
						:show-source="false"
						:text="encoded.codeText"
					/>

					<v-sheet
						v-if="encoded.unmappedPhrases.length"
						border
						class="mt-4 pa-3"
						rounded="lg"
					>
						<div class="text-caption text-medium-emphasis mb-2">
							{{ t( "encoder.unmappedTitle" ) }}
						</div>
						<div class="unmappedList">
							<span
								v-for="( phrase, index ) in encoded.unmappedPhrases"
								:key="`unmapped-${index}`"
								class="unknownText"
							>
								{{ index > 0 ? " | " : "" }}{{ phrase }}
							</span>
						</div>
					</v-sheet>

					<div class="tokenTableWrap mt-4">
						<v-table density="compact">
							<thead>
								<tr>
									<th>{{ t( "encoder.table.phrase" ) }}</th>
									<th>{{ t( "encoder.table.type" ) }}</th>
									<th>{{ t( "encoder.table.code" ) }}</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="( item, index ) in encoded.items"
									:key="`encoded-${index}`"
								>
									<td>{{ item.phrase }}</td>
									<td>
										<v-chip
											:color="tokenTypeColor( item.type )"
											size="small"
											variant="tonal"
										>
											{{ item.typeLabel }}
										</v-chip>
									</td>
									<td>
										<code
											:class="{
												encodedCode: true,
												unknownText: item.type === 'unknown'
											}"
										>
											{{ item.code || "—" }}
										</code>
									</td>
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
import { EditorContent, useEditor } from "@tiptap/vue-3";
import { useI18n } from "@/utils/i18n.mjs";
import HAMorseCodeDisplay from "./HA_MorseCodeDisplay.vue";
import { buildCommentDecorationSet } from "./HA_commentDecorations.mjs";
import { findSpecialSymbolByInput, HA_SPECIAL_TOKEN_SET } from "./HA_specialSymbols.mjs";

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
		titleKey: "encoder.paletteGroups.templates",
		color:    "secondary",
		tokens:   TEMPLATE_IDS
	},
	{
		id:       "q-codes",
		titleKey: "encoder.paletteGroups.qCodes",
		color:    "primary",
		tokens:   Q_CODE_TOKENS
	},
	{
		id:       "cw",
		titleKey: "encoder.paletteGroups.cwCodes",
		color:    "info",
		tokens:   CW_CODE_TOKENS
	}
];

const CONTEXTUAL_CODE_TOKENS = new Set( [
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

const EMPTY_RESULT = Object.freeze( {
	codeText:        "",
	items:           [],
	unmappedPhrases: []
} );

const { t, tm } = useI18n( "book1/HA" );

const openPanels = ref( "templates" );
const plainText = ref( "" );
const selectedExample = ref( null );

const snippetEntries = computed( () => tm( "encoder.snippets" ) ?? {} );
const qCodeEntries = computed( () => tm( "decoder.qCodes" ) ?? {} );
const cwCodeEntries = computed( () => tm( "decoder.cwCodes" ) ?? {} );
const typeLabels = computed( () => tm( "encoder.typeLabels" ) ?? {} );
const exampleItems = computed( () => tm( "encoder.examples" ) ?? [] );
const targetedCallPrefixes = computed( () => tm( "encoder.patterns.targetedCallPrefixes" ) ?? [] );

const contextualPrefixes = computed( () => [
	{
		token:  "QTH",
		prefix: t( "encoder.patterns.locationPrefix" )
	},
	{
		token:  "WX",
		prefix: t( "encoder.patterns.weatherPrefix" )
	},
	{
		token:  "PWR",
		prefix: t( "encoder.patterns.powerPrefix" )
	},
	{
		token:  "ANT",
		prefix: t( "encoder.patterns.antennaPrefix" )
	},
	{
		token:  "QRA",
		prefix: t( "encoder.patterns.namePrefix" )
	},
	{
		token:  "QRG",
		prefix: t( "encoder.patterns.frequencyPrefix" )
	},
	{
		token:  "OP",
		prefix: t( "encoder.patterns.operatorPrefix" )
	},
	{
		token:  "RIG",
		prefix: t( "encoder.patterns.equipmentPrefix" )
	},
	{
		token:  "CONDX",
		prefix: t( "encoder.patterns.conditionPrefix" )
	},
	{
		token:  "NR",
		prefix: t( "encoder.patterns.numberPrefix" )
	},
	{
		token:  "TEMP",
		prefix: t( "encoder.patterns.temperaturePrefix" )
	},
	{
		token:  "QTR",
		prefix: t( "encoder.patterns.timePrefix" )
	}
] );

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

const editor = useEditor( {
	content:    createDocFromText( props.modelValue ),
	extensions: [
		StarterKit.configure( {
			blockquote:     false,
			bulletList:     false,
			codeBlock:      false,
			heading:        false,
			horizontalRule: false,
			listItem:       false,
			orderedList:    false
		} )
	],
	editorProps: {
		decorations: ( state ) => buildCommentDecorationSet( state.doc ),
		attributes: {
			autocapitalize: "sentences",
			autocomplete:   "off",
			autocorrect:    "off",
			class:          "haEncoderEditor",
			spellcheck:     "false"
		}
	},
	onCreate: ( { editor: instance } ) => {
		plainText.value = extractPlainText( instance );
	},
	onUpdate: ( { editor: instance } ) => {
		plainText.value = extractPlainText( instance );
	}
} );

function normalizeWhitespace( value ) {
	return String( value ?? "" )
		.replace( /\s+/g, " " )
		.trim();
}

function normalizeMatch( value ) {
	return normalizeWhitespace( value ).toLowerCase();
}

function normalizeCodeValue( value ) {
	return normalizeWhitespace( value ).toUpperCase();
}

function splitPrefixedLine( line ) {
	const match = String( line ?? "" ).match( /^(\s*)(.*)$/s );

	return {
		linePrefix: match?.[ 1 ] ?? "",
		content:    match?.[ 2 ] ?? ""
	};
}

function isCommentLine( content ) {
	return String( content ?? "" ).trimStart().startsWith( "#" );
}

function escapeRegExp( value ) {
	return String( value ?? "" ).replace( /[.*+?^${}()|[\]\\]/g, "\\$&" );
}

function getDescriptionAliases( description ) {
	return String( description ?? "" )
		.split( "/" )
		.map( ( alias ) => normalizeWhitespace( alias ) )
		.filter( Boolean );
}

function getDescriptionMatchAliases( description ) {
	const normalizedDescription = normalizeWhitespace( description );

	return Array.from( new Set( [
		normalizedDescription,
		...getDescriptionAliases( description )
	].filter( Boolean ) ) );
}

function getPrimaryAlias( description ) {
	return getDescriptionAliases( description )[ 0 ] ?? normalizeWhitespace( description );
}

function isCallsign( token ) {
	return /^[A-Z0-9]{1,4}\d[A-Z0-9]{1,4}(?:\/[A-Z0-9]{1,4})?$/.test( token );
}

function isCQTargetPrefix( token ) {
	return /^(?=.*[A-Z])[A-Z0-9]{1,3}$/.test( token ) &&
		!isCallsign( token ) &&
		!qCodeEntries.value?.[ token ] &&
		!cwCodeEntries.value?.[ token ] &&
		!HA_SPECIAL_TOKEN_SET.has( token ) &&
		token !== "RST";
}

function isNumberWithUnit( token ) {
	return /^\d+(?:[.,]\d+)?(?:[A-Z%]+)?$/.test( token );
}

function isKnownCodeToken( token ) {
	return Boolean(
		qCodeEntries.value?.[ token ] ||
		cwCodeEntries.value?.[ token ] ||
		HA_SPECIAL_TOKEN_SET.has( token ) ||
		token === "RST"
	);
}

function buildSpecialSymbolMatch( phrase ) {
	const entry = findSpecialSymbolByInput( phrase );

	if ( !entry ) {
		return null;
	}

	return {
		phrase,
		type:      "pattern",
		typeLabel: getTypeLabel( "pattern" ),
		code:      entry.token,
		mapped:    true
	};
}

function looksLikeEncodedLine( value ) {
	const tokens = normalizeCodeValue( value ).split( " " ).filter( Boolean );

	if ( !tokens.length ) {
		return false;
	}

	for ( let index = 0; index < tokens.length; index += 1 ) {
		const token = tokens[ index ];
		const previousToken = tokens[ index - 1 ] ?? "";

		if (
			isKnownCodeToken( token ) ||
			( previousToken === "RST" && /^\d{2,3}$/.test( token ) ) ||
			( previousToken === "CQ" && isCQTargetPrefix( token ) ) ||
			isCallsign( token ) ||
			isNumberWithUnit( token ) ||
			( CONTEXTUAL_CODE_TOKENS.has( previousToken ) && !isKnownCodeToken( token ) )
		) {
			continue;
		}

		return false;
	}

	return true;
}

function buildPaletteItem(
	groupId,
	token,
	fallbackColor
) {
	if ( groupId === "templates" ) {
		const entry = snippetEntries.value?.[ token ];

		if ( !entry ) {
			return null;
		}

		return {
			key:         token,
			label:       entry.label ?? entry.phrase ?? token,
			insertText:  entry.insertText ?? `${entry.phrase} | `,
			description: entry.code ??
				entry.phrase ??
				token,
			color: entry.color ?? fallbackColor
		};
	}

	const source = groupId === "q-codes" ? qCodeEntries.value : cwCodeEntries.value;
	const entry = source?.[ token ];

	if ( !entry ) {
		return null;
	}

	const label = getPrimaryAlias( entry.description );

	return {
		key:         token,
		label:       `${label} · ${token}`,
		insertText:  `${label} | `,
		description: token,
		color:       entry.color ?? fallbackColor
	};
}

const phraseGroups = computed( () => PALETTE_GROUPS.map( ( group ) => ( {
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

function buildTemplateMatch( phrase ) {
	const normalizedPhrase = normalizeMatch( phrase );

	for ( const templateId of TEMPLATE_IDS ) {
		const entry = snippetEntries.value?.[ templateId ];

		if ( entry && normalizeMatch( entry.phrase ) === normalizedPhrase ) {
			return {
				phrase,
				type:      "snippet",
				typeLabel: getTypeLabel( "snippet" ),
				code:      normalizeCodeValue( entry.code ),
				mapped:    true
			};
		}
	}

	return null;
}

function buildMeaningMatch( phrase ) {
	const normalizedPhrase = normalizeMatch( phrase );

	for ( const token of Q_CODE_TOKENS ) {
		const entry = qCodeEntries.value?.[ token ];

		if ( !entry ) {
			continue;
		}

		for ( const alias of getDescriptionMatchAliases( entry.description ) ) {
			if ( normalizeMatch( alias ) === normalizedPhrase ) {
				return {
					phrase,
					type:      "q-code",
					typeLabel: getTypeLabel( "q-code" ),
					code:      token,
					mapped:    true
				};
			}
		}
	}

	for ( const token of CW_CODE_TOKENS ) {
		const entry = cwCodeEntries.value?.[ token ];

		if ( !entry ) {
			continue;
		}

		for ( const alias of getDescriptionMatchAliases( entry.description ) ) {
			if ( normalizeMatch( alias ) === normalizedPhrase ) {
				return {
					phrase,
					type:      "cw-abbrev",
					typeLabel: getTypeLabel( "cw-abbrev" ),
					code:      token,
					mapped:    true
				};
			}
		}
	}

	return null;
}

function buildLabeledValueMatch( phrase ) {
	const valueTemplate = t( "decoder.patterns.value", { token: "__TOKEN__" } );
	const regex = new RegExp( `^${escapeRegExp( valueTemplate )
		.replace( "__TOKEN__", "(.+?)" )}$`, "i" );
	const match = normalizeWhitespace( phrase ).match( regex );

	if ( !match ) {
		return null;
	}

	const token = normalizeCodeValue( match[ 1 ] );

	if ( !isNumberWithUnit( token ) ) {
		return null;
	}

	return {
		phrase,
		type:      "pattern",
		typeLabel: getTypeLabel( "pattern" ),
		code:      token,
		mapped:    true
	};
}

function buildLabeledCallsignMatch( phrase ) {
	const callsignTemplate = t( "decoder.patterns.callsign", { token: "__TOKEN__" } );
	const regex = new RegExp( `^${escapeRegExp( callsignTemplate )
		.replace( "__TOKEN__", "(.+?)" )}$`, "i" );
	const match = normalizeWhitespace( phrase ).match( regex );

	if ( !match ) {
		return null;
	}

	const callsign = normalizeCodeValue( match[ 1 ] );

	if ( !isCallsign( callsign ) ) {
		return null;
	}

	return {
		phrase,
		type:      "pattern",
		typeLabel: getTypeLabel( "pattern" ),
		code:      callsign,
		mapped:    true
	};
}

function buildCallPatternMatch( phrase ) {
	const template = t( "decoder.patterns.callPattern", {
		caller: "__CALLER__",
		called: "__CALLED__"
	} );
	const regex = new RegExp( `^${escapeRegExp( template )
		.replace( "__CALLER__", "(.+?)" )
		.replace( "__CALLED__", "(.+?)" )}$`,
	"i" );
	const match = normalizeWhitespace( phrase ).match( regex );

	if ( !match ) {
		return null;
	}

	const caller = normalizeCodeValue( match[ 1 ] );
	const called = normalizeCodeValue( match[ 2 ] );

	if ( !isCallsign( caller ) || !isCallsign( called ) ) {
		return null;
	}

	return {
		phrase,
		type:      "pattern",
		typeLabel: getTypeLabel( "pattern" ),
		code:      `${called} DE ${caller}`,
		mapped:    true
	};
}

function buildTargetedCQMatch( phrase ) {
	const normalizedPhrase = normalizeWhitespace( phrase );
	const directMatch = normalizedPhrase.match( /^CQ\s+([A-Z0-9]{1,3})$/i );

	if ( directMatch ) {
		const target = normalizeCodeValue( directMatch[ 1 ] );

		if ( isCQTargetPrefix( target ) ) {
			return {
				phrase,
				type:      "pattern",
				typeLabel: getTypeLabel( "pattern" ),
				code:      `CQ ${target}`,
				mapped:    true
			};
		}
	}

	for ( const prefix of targetedCallPrefixes.value ) {
		const match = normalizedPhrase.match( new RegExp( `^${escapeRegExp( prefix )}(.+)$`, "i" ) );

		if ( !match ) {
			continue;
		}

		const target = normalizeCodeValue( match[ 1 ] );

		if ( !isCQTargetPrefix( target ) ) {
			continue;
		}

		return {
			phrase,
			type:      "pattern",
			typeLabel: getTypeLabel( "pattern" ),
			code:      `CQ ${target}`,
			mapped:    true
		};
	}

	return null;
}

function buildSignalReportMatch( phrase ) {
	const normalizedPhrase = normalizeWhitespace( phrase );
	const directMatch = normalizedPhrase.match( /^RST\s+(\d{2,3})(?::.*)?$/i );

	if ( directMatch ) {
		return {
			phrase,
			type:      "pattern",
			typeLabel: getTypeLabel( "pattern" ),
			code:      `RST ${directMatch[ 1 ]}`,
			mapped:    true
		};
	}

	const prefix = t( "encoder.patterns.signalReportPrefix" );
	const prefixMatch = normalizedPhrase.match( new RegExp( `^${escapeRegExp( prefix )}(\\d{2,3})$`, "i" ) );

	if ( !prefixMatch ) {
		return null;
	}

	return {
		phrase,
		type:      "pattern",
		typeLabel: getTypeLabel( "pattern" ),
		code:      `RST ${prefixMatch[ 1 ]}`,
		mapped:    true
	};
}

function buildContextualMatch( phrase ) {
	const normalizedPhrase = normalizeWhitespace( phrase );

	for ( const entry of contextualPrefixes.value ) {
		const candidatePrefixes = new Set( [ entry.prefix ] );
		const description = qCodeEntries.value?.[ entry.token ]?.description ??
			cwCodeEntries.value?.[ entry.token ]?.description ??
			"";

		getDescriptionMatchAliases( description ).forEach( ( alias ) => {
			candidatePrefixes.add( `${alias}: ` );
		} );

		for ( const prefix of candidatePrefixes ) {
			const match = normalizedPhrase.match( new RegExp( `^${escapeRegExp( prefix )}(.+)$`, "i" ) );

			if ( !match ) {
				continue;
			}

			const payload = normalizeCodeValue( match[ 1 ] );

			if ( !payload ) {
				continue;
			}

			return {
				phrase,
				type:      "pattern",
				typeLabel: getTypeLabel( "pattern" ),
				code:      `${entry.token} ${payload}`,
				mapped:    true
			};
		}
	}

	return null;
}

function buildLiteralTokenMatch( phrase ) {
	const normalizedPhrase = normalizeWhitespace( phrase );
	const token = normalizeCodeValue( phrase );

	if (
		!normalizedPhrase ||
		normalizedPhrase !== token ||
		token.includes( " " ) ||
		!/^[A-Z0-9?]+$/.test( token )
	) {
		return null;
	}

	return {
		phrase,
		type:      "pattern",
		typeLabel: getTypeLabel( "pattern" ),
		code:      token,
		mapped:    true
	};
}

function buildCallsignMatch( phrase ) {
	const callsign = normalizeCodeValue( phrase );

	if ( !isCallsign( callsign ) ) {
		return null;
	}

	return {
		phrase,
		type:      "pattern",
		typeLabel: getTypeLabel( "pattern" ),
		code:      callsign,
		mapped:    true
	};
}

function encodePhrase( phrase ) {
	return buildTemplateMatch( phrase ) ??
		buildLabeledCallsignMatch( phrase ) ??
		buildCallPatternMatch( phrase ) ??
		buildTargetedCQMatch( phrase ) ??
		buildSignalReportMatch( phrase ) ??
		buildContextualMatch( phrase ) ??
		buildSpecialSymbolMatch( phrase ) ??
		buildMeaningMatch( phrase ) ??
		buildLabeledValueMatch( phrase ) ??
		buildLiteralTokenMatch( phrase ) ??
		buildCallsignMatch( phrase ) ??
		{
			phrase,
			type:      "unknown",
			typeLabel: getTypeLabel( "unknown" ),
			code:      "",
			mapped:    false
		};
}

function encodeSequence( text ) {
	const lines = normalizeLineEndings( text ).split( "\n" );
	const encodedLines = lines.map( ( line ) => {
		const sourceLine = String( line ?? "" );
		const {
			linePrefix,
			content
		} = splitPrefixedLine( sourceLine );
		const trimmedContent = content.trim();

		if ( !trimmedContent ) {
			return {
				codeLine:        sourceLine,
				items:           [],
				unmappedPhrases: []
			};
		}

		if ( isCommentLine( content ) ) {
			return {
				codeLine:        sourceLine,
				items:           [],
				unmappedPhrases: []
			};
		}

		if ( !content.includes( "|" ) && looksLikeEncodedLine( content ) ) {
			return {
				codeLine:        `${linePrefix}${normalizeCodeValue( content )}`,
				items:           [],
				unmappedPhrases: []
			};
		}

		const phrases = content
			.split( "|" )
			.map( ( part ) => normalizeWhitespace( part ) )
			.filter( Boolean );
		const items = phrases.map( ( phrase ) => encodePhrase( phrase ) );

		return {
			codeLine: `${linePrefix}${items.filter( ( item ) => item.mapped && item.code )
				.map( ( item ) => item.code )
				.join( " " )}`,
			items,
			unmappedPhrases: items.filter( ( item ) => !item.mapped ).map( ( item ) => item.phrase )
		};
	} );
	const items = encodedLines.flatMap( ( line ) => line.items );
	const unmappedPhrases = encodedLines.flatMap( ( line ) => line.unmappedPhrases );

	return {
		codeText: encodedLines.map( ( line ) => line.codeLine ).join( "\n" ),
		items,
		unmappedPhrases
	};
}

const encoded = computed( () => plainText.value.trim() ?
	encodeSequence( plainText.value ) :
	EMPTY_RESULT );

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
	() => encoded.value.codeText, ( nextValue ) => {
		emit( "update:output", nextValue );
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
		snippet:     "secondary",
		"q-code":    "primary",
		"cw-abbrev": "info",
		pattern:     "success",
		unknown:     "error"
	}[ type ] ?? "grey";
}
</script>

<style scoped>
.haEncoder {
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

.phraseGrid {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}

.phraseButton {
	height: auto;
	max-width: 100%;
	padding-block: 8px;
	text-transform: none;
}

.encodedText,
.encodedCode,
.unmappedList {
	display: block;
	font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
	line-height: 1.6;
	white-space: pre-wrap;
	word-break: break-word;
}

.unknownText {
	color: rgb(var(--v-theme-error));
	font-weight: 700;
}

.tokenTableWrap {
	overflow-x: auto;
}

:deep(.phraseButton .v-btn__content) {
	line-height: 1.3;
	text-align: left;
	white-space: normal;
}

:deep(.haEncoderEditor) {
	border: 1px solid rgba( 0, 0, 0, 0.12 );
	border-radius: 18px;
	min-height: 220px;
	outline: none;
	padding: 18px;
}

:deep(.haEncoderEditor p) {
	margin: 0;
}

:deep(.haEncoderEditor .haCommentLine) {
	color: rgb(var(--v-theme-success));
}

:deep(.haEncoderEditor .haQxxToken) {
	color: rgb(var(--v-theme-info));
	font-weight: 600;
}

:deep(.haEncoderEditor .haQerToken) {
	color: rgb(var(--v-theme-error));
	font-weight: 700;
}

:deep(.haEncoderEditor:focus) {
	border-color: rgba(var(--v-theme-primary), 0.5);
	box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.12);
}

@media ( max-width: 960px ) {
	.panelHeader {
		flex-direction: column;
	}
}
</style>
