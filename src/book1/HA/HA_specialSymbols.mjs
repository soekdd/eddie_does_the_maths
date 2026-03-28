export const HA_SPECIAL_SYMBOLS = Object.freeze( [
	{
		inputs: [ "." ],
		morse:  ".-.-.-",
		symbol: ".",
		token:  "AAA"
	},
	{
		inputs: [ "," ],
		morse:  "--..--",
		symbol: ",",
		token:  "MIM"
	},
	{
		inputs: [ "?" ],
		morse:  "..--..",
		symbol: "?",
		token:  "IMI"
	},
	{
		inputs: [ ":" ],
		morse:  "---...",
		symbol: ":",
		token:  "OS"
	},
	{
		inputs: [ ";" ],
		morse:  "-.-.-.",
		symbol: ";",
		token:  "NNN"
	},
	{
		inputs: [ "'" ],
		morse:  ".----.",
		symbol: "'",
		token:  "JN"
	},
	{
		inputs: [ "(", ")", "()" ],
		morse:  "-.--.-",
		symbol: "()",
		token:  "KK"
	},
	{
		inputs: [ "_" ],
		morse:  "..--.-",
		symbol: "_",
		token:  "UK"
	},
	{
		inputs: [ "@" ],
		morse:  ".--.-.",
		symbol: "@",
		token:  "AC"
	},
	{
		inputs: [ "+" ],
		morse:  ".-.-.",
		symbol: "+",
		token:  "AR"
	}
] );

export const HA_SPECIAL_SYMBOL_BY_TOKEN = Object.freeze( Object.fromEntries(
	HA_SPECIAL_SYMBOLS.map( ( entry ) => [
		entry.token,
		entry.symbol
	] )
) );

export const HA_SPECIAL_MORSE_BY_TOKEN = Object.freeze( Object.fromEntries(
	HA_SPECIAL_SYMBOLS.map( ( entry ) => [
		entry.token,
		entry.morse
	] )
) );

export const HA_SPECIAL_TOKEN_SET = new Set( Object.keys( HA_SPECIAL_SYMBOL_BY_TOKEN ) );

export function findSpecialSymbolByInput( value ) {
	const normalized = String( value ?? "" ).trim();

	return HA_SPECIAL_SYMBOLS.find( ( entry ) => entry.inputs.includes( normalized ) ) ?? null;
}
