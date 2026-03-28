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

					<v-expansion-panels v-model="openPanels" multiple variant="accordion">
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
	"rst_599",
	"qth_berlin",
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

const EMPTY_RESULT = Object.freeze( {
	codeText:        "",
	items:           [],
	unmappedPhrases: []
} );

const { t, tm } = useI18n( "book1/HA" );

const openPanels = ref( [
	"templates",
	"q-codes",
	"cw"
] );
const plainText = ref( "" );
const selectedExample = ref( null );

const snippetEntries = computed( () => tm( "encoder.snippets" ) ?? {} );
const qCodeEntries = computed( () => tm( "decoder.qCodes" ) ?? {} );
const cwCodeEntries = computed( () => tm( "decoder.cwCodes" ) ?? {} );
const typeLabels = computed( () => tm( "encoder.typeLabels" ) ?? {} );
const exampleItems = computed( () => tm( "encoder.examples" ) ?? [] );

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

function createDocFromText( text ) {
	const lines = String( text ?? "" ).split( /\n+/ );
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
	return instance.state.doc.textBetween(
		0,
		instance.state.doc.content.size,
		" ",
		" "
	)
		.replace( /\s+/g, " " )
		.trim();
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

function escapeRegExp( value ) {
	return String( value ?? "" ).replace( /[.*+?^${}()|[\]\\]/g, "\\$&" );
}

function getDescriptionAliases( description ) {
	return String( description ?? "" )
		.split( "/" )
		.map( ( alias ) => normalizeWhitespace( alias ) )
		.filter( Boolean );
}

function getPrimaryAlias( description ) {
	return getDescriptionAliases( description )[ 0 ] ?? normalizeWhitespace( description );
}

function isCallsign( token ) {
	return /^[A-Z0-9]{1,4}\d[A-Z0-9]{1,4}(?:\/[A-Z0-9]{1,4})?$/.test( token );
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

		for ( const alias of getDescriptionAliases( entry.description ) ) {
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

		for ( const alias of getDescriptionAliases( entry.description ) ) {
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

function buildSignalReportMatch( phrase ) {
	const normalizedPhrase = normalizeWhitespace( phrase );
	const directMatch = normalizedPhrase.match( /^RST\s+(\d{2,3})$/i );

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
		const match = normalizedPhrase.match( new RegExp( `^${escapeRegExp( entry.prefix )}(.+)$`, "i" ) );

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

	return null;
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
		buildCallPatternMatch( phrase ) ??
		buildSignalReportMatch( phrase ) ??
		buildContextualMatch( phrase ) ??
		buildMeaningMatch( phrase ) ??
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
	const phrases = String( text ?? "" )
		.split( "|" )
		.map( ( part ) => normalizeWhitespace( part ) )
		.filter( Boolean );

	if ( !phrases.length ) {
		return EMPTY_RESULT;
	}

	const items = phrases.map( ( phrase ) => encodePhrase( phrase ) );

	return {
		codeText: items.filter( ( item ) => item.mapped && item.code ).map( ( item ) => item.code )
			.join( " " ),
		items,
		unmappedPhrases: items.filter( ( item ) => !item.mapped ).map( ( item ) => item.phrase )
	};
}

const encoded = computed( () => plainText.value.trim() ?
	encodeSequence( plainText.value ) :
	EMPTY_RESULT );

watch(
	() => props.modelValue, ( nextValue ) => {
		if ( normalizeWhitespace( nextValue ) === normalizeWhitespace( plainText.value ) ) {
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

	if ( !instance ) {
		plainText.value = String( text ?? "" );
		return;
	}

	instance.commands.setContent( createDocFromText( text ),
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
