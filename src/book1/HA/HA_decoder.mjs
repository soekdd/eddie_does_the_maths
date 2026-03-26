/**
 * Ham/CW sequence decoder
 * - decodes common Q-codes, CW abbreviations, prosigns, RST
 * - does NOT try to decrypt hidden payloads
 * - unknown tokens are preserved and flagged
 */

const Q_CODES = {
	QTH: "Standort / Aufenthaltsort der Station",
	QRM: "Störung durch andere Stationen",
	QRN: "atmosphärische Störungen / Rauschen",
	QSB: "Schwund / Fading",
	QSL: "Bestätigung / ich bestätige",
	QSO: "Funkverbindung / Kontakt",
	QRZ: "Wer hat mich gerufen?",
	QSY: "Frequenzwechsel",
	QRX: "Bitte warten / Stand by",
	QRV: "bereit / empfangsbereit",
	QRP: "niedrige Sendeleistung",
	QRO: "hohe Sendeleistung",
	QRT: "Betrieb beenden / gehe von der Frequenz",
	QTC: "ich habe Nachrichten für dich",
	QSP: "weiterleiten / bitte weiterleiten"
};

const CW_ABBREVIATIONS = {
	DE:    "von / hier ist",
	CQ:    "allgemeiner Anruf",
	K:     "kommen / Antwort erbeten",
	KN:    "nur die angesprochene Station soll antworten",
	AR:    "Ende der Aussendung",
	SK:    "Ende der Verbindung",
	BK:    "Unterbrechung / break",
	R:     "Roger / verstanden / empfangen",
	TNX:   "danke",
	TKS:   "danke",
	FER:   "für",
	FB:    "sehr gut / ausgezeichnet",
	CPY:   "kopiere / verstanden",
	CPI:   "kopiere / verstanden",
	PSE:   "bitte",
	ES:    "und",
	OM:    "Funkfreund / old man",
	YL:    "junge Frau",
	XYL:   "Ehefrau / Partnerin",
	AGN:   "noch einmal / again",
	RPT:   "wiederholen",
	RPRT:  "Bericht / report",
	RIG:   "Funkgerät / Ausrüstung",
	PWR:   "Sendeleistung",
	ANT:   "Antenne",
	WX:    "Wetter",
	HR:    "hier",
	HW:    "wie?",
	NR:    "Nummer oder nahe / mehrdeutig",
	NW:    "jetzt",
	GM:    "Guten Morgen",
	GA:    "Guten Tag oder mach weiter / mehrdeutig",
	GE:    "Guten Abend",
	GN:    "Gute Nacht",
	GD:    "gut",
	GUD:   "gut",
	GL:    "viel Glück",
	CFM:   "ich bestätige",
	TU:    "danke",
	NIL:   "nichts / keine",
	LIL:   "wenig / leicht",
	CONDX: "Ausbreitungsbedingungen",
	TEMP:  "Temperatur",
	OP:    "Operator / Funker",
	OPR:   "Operator / Funker",
	RX:    "Empfänger",
	TX:    "Sender",
	RCVR:  "Empfänger",
	73:    "beste Grüße",
	88:    "Liebe und Küsse"
};

/**
 * broad-but-practical callsign recognizer
 * catches many ham-style callsigns like Y41ZL, SM5ABC, OH6ABC, DL1XYZ
 */
function isCallsign( token ) {
	return /^(?:[A-Z]{1,2}\d[A-Z0-9]{1,4}|\d[A-Z]{1,3}\d[A-Z0-9]{1,4})$/.test( token );
}

function isRSTToken( token ) {
	return /^[1-5][1-9][1-9]$/.test( token );
}

function isNumberWithUnit( token ) {
	return /^\d+(?:W|KW|C|M|KM|DB)?$/i.test( token );
}

function normalize( input ) {
	return input
		.toUpperCase()
		.replace( /[.,;:/]+/g, " " )
		.replace( /\s+/g, " " )
		.trim();
}

function decodeRST( rst ) {
	const [ r, s, t ] = rst.split( "" ).map( Number );

	const readability = {
		1: "unlesbar",
		2: "kaum lesbar",
		3: "schwer lesbar",
		4: "lesbar mit Mühe",
		5: "mittel lesbar"
	};

	const strength = {
		1: "sehr schwach",
		2: "schwach",
		3: "eher schwach",
		4: "ordentlich",
		5: "ziemlich gut",
		6: "gut",
		7: "kräftig",
		8: "stark",
		9: "sehr stark"
	};

	const tone = {
		1: "sehr rauer Ton",
		2: "rauer Ton",
		3: "unsauberer Ton",
		4: "etwas rau",
		5: "brauchbar",
		6: "ordentlich",
		7: "ziemlich rein",
		8: "nahezu rein",
		9: "vollkommen rein"
	};

	return {
		code:    rst,
		natural: `RST ${rst}: Lesbarkeit ${readability[ r ] ?? "?"}, Signalstärke ${strength[ s ] ?? "?"}, Ton ${tone[ t ] ?? "?"}`
	};
}

function decodeToken(
	token, index, tokens
) {
	if ( Q_CODES[ token ] ) {
		return {
			token, type: "q-code", natural: Q_CODES[ token ]
		};
	}

	if ( CW_ABBREVIATIONS[ token ] ) {
		return {
			token, type: "cw-abbrev", natural: CW_ABBREVIATIONS[ token ]
		};
	}

	if ( isRSTToken( token ) ) {
		return {
			token, type: "rst", natural: decodeRST( token ).natural
		};
	}

	if ( token === "RST" && isRSTToken( tokens[ index + 1 ] || "" ) ) {
		return {
			token, type: "label", natural: "Signalbericht folgt"
		};
	}

	if ( isCallsign( token ) ) {
		return {
			token, type: "callsign", natural: `Rufzeichen ${token}`
		};
	}

	if ( isNumberWithUnit( token ) ) {
		return {
			token, type: "value", natural: `Wert ${token}`
		};
	}

	return {
		token, type: "unknown", natural: `(unbekannt oder freier Text: ${token})`
	};
}

function decodeSequence( input ) {
	const normalized = normalize( input );
	const tokens = normalized.split( " " );
	const decoded = tokens.map( ( token, index ) => decodeToken(
		token, index, tokens
	) );

	return {
		normalized,
		tokens:      decoded,
		naturalText: buildNaturalText( decoded )
	};
}

function buildNaturalText( decodedTokens ) {
	const parts = [];
	let i = 0;

	while ( i < decodedTokens.length ) {
		const cur = decodedTokens[ i ];
		const next = decodedTokens[ i + 1 ];
		const next2 = decodedTokens[ i + 2 ];

		// Pattern: CALLSIGN DE CALLSIGN
		if (
			cur?.type === "callsign" &&
      next?.token === "DE" &&
      next2?.type === "callsign"
		) {
			parts.push( `${next2.token} ruft ${cur.token}` );
			i += 3;
			continue;
		}

		// Pattern: RST 579
		if ( cur?.token === "RST" && next?.type === "rst" ) {
			parts.push( next.natural );
			i += 2;
			continue;
		}

		// Pattern: QTH <word>
		if ( cur?.token === "QTH" && next && next.type !== "q-code" && next.type !== "cw-abbrev" ) {
			parts.push( `Standort: ${next.token}` );
			i += 2;
			continue;
		}

		// Pattern: WX <word>
		if ( cur?.token === "WX" && next && next.type !== "q-code" && next.type !== "cw-abbrev" ) {
			parts.push( `Wetter: ${next.token}` );
			i += 2;
			continue;
		}

		// Pattern: PWR 100W
		if ( cur?.token === "PWR" && next?.type === "value" ) {
			parts.push( `Sendeleistung: ${next.token}` );
			i += 2;
			continue;
		}

		// Pattern: ANT DIPOLE
		if ( cur?.token === "ANT" && next ) {
			parts.push( `Antenne: ${next.token}` );
			i += 2;
			continue;
		}

		// default
		parts.push( cur.natural );
		i += 1;
	}

	return parts.join( " | " );
}

// ---- demo ----
const sample = "SM5ABC DE Y41ZL TNX FER CALL RST 559 QTH DRESDEN PWR 100W ANT DIPOLE WX FINE KN";
const result = decodeSequence( sample );

console.log( "NORMALIZED:" );
console.log( result.normalized );
console.log( "\nTOKENS:" );
console.table( result.tokens );
console.log( "\nNATURAL:" );
console.log( result.naturalText );