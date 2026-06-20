import { convertInternalMoves } from "./RC_BeginnerMethodSolver.mjs";

const WIDE_MOVE_EXPANSIONS = {
	b: [ "B", "Si" ],
	d: [ "D", "E" ],
	f: [ "F", "S" ],
	l: [ "L", "M" ],
	r: [ "R", "Mi" ],
	u: [ "U", "Ei" ]
};
const DIRECT_MOVE_DEFINITIONS = {
	B: { axis: "z", layer: -1 },
	D: { axis: "y", layer: -1 },
	E: {
		axis: "y", direction: 1, layer: 0
	},
	F: { axis: "z", layer: 1 },
	L: { axis: "x", layer: -1 },
	M: {
		axis: "x", direction: 1, layer: 0
	},
	R: { axis: "x", layer: 1 },
	S: {
		axis: "z", direction: -1, layer: 0
	},
	U: { axis: "y", layer: 1 }
};

function invertInternalToken( token ) {
	return token.endsWith( "i" ) ? token.slice( 0, -1 ) : `${token}i`;
}

function flattenNotation( value ) {
	if ( Array.isArray( value ) ) {
		return value.flatMap( flattenNotation );
	}

	return String( value ?? "" ).trim()
		.split( /\s+/ )
		.filter( Boolean );
}

function expandNotationToken( sourceToken ) {
	const normalized = sourceToken.replace( /prime/gi, "'" );
	const base = normalized[ 0 ];
	const inverse = normalized.includes( "'" );
	const turns = normalized.includes( "2" ) ? 2 : 1;
	let sequence = WIDE_MOVE_EXPANSIONS[ base ] ?? [ base.toUpperCase() ];

	if ( inverse ) {
		sequence = sequence.slice()
			.reverse()
			.map( invertInternalToken );
	}

	return Array.from( { length: turns }, () => sequence )
		.flat();
}

export function convertNotationPhases( phases,
	duration = 120 ) {
	const internalMoves = phases.flatMap( ( phase ) => flattenNotation( phase.moves )
		.flatMap( expandNotationToken )
		.map( ( token ) => ( {
			phase: phase.id,
			token
		} ) ) );
	const converted = convertInternalMoves( internalMoves );

	return phases.map( ( phase ) => ( {
		id:    phase.id,
		moves: converted
			.filter( ( move ) => move.phase === phase.id )
			.map( ( move ) => ( {
				...move,
				duration
			} ) )
	} ) );
}

export function convertDirectNotationPhases( phases,
	duration = 120 ) {
	return phases.map( ( phase ) => ( {
		id:    phase.id,
		moves: flattenNotation( phase.moves )
			.flatMap( expandNotationToken )
			.map( ( token ) => {
				const inverse = token.endsWith( "i" );
				const base = inverse ? token.slice( 0, -1 ) : token;
				const definition = DIRECT_MOVE_DEFINITIONS[ base ];

				if ( !definition ) {
					throw new Error( `Cannot convert direct solver move: ${token}` );
				}

				const normalDirection = definition.direction ?? -definition.layer;
				return {
					axis:      definition.axis,
					direction: inverse ? -normalDirection : normalDirection,
					duration,
					layer:     definition.layer,
					name:      base,
					phase:     phase.id,
					turns:     1
				};
			} )
	} ) );
}
