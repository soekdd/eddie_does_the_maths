import cubeSolver from "cube-solver";
import { convertDirectNotationPhases } from "./RC_solverNotation.mjs";

const OUTER_FACES = {
	B: { axis: "z", layer: -1 },
	D: { axis: "y", layer: -1 },
	F: { axis: "z", layer: 1 },
	L: { axis: "x", layer: -1 },
	R: { axis: "x", layer: 1 },
	U: { axis: "y", layer: 1 }
};
const SECOND_BLOCK_ACTIONS = createActions( [ "U", "R", "M" ] );
const LSE_ACTIONS = createActions( [ "U", "M" ] );
const CMLL_CORNER_CYCLE = [ "U", "R", "U'", "L'", "U", "R'", "U'", "L" ];
const CMLL_POSITION_ACTIONS = [
	...createActions( [ "U" ] ),
	{ tokens: CMLL_CORNER_CYCLE },
	{ tokens: invertTokens( CMLL_CORNER_CYCLE ) }
];
const NORMALS = [
	{
		x: -1, y: 0, z: 0
	},
	{
		x: 1, y: 0, z: 0
	},
	{
		x: 0, y: -1, z: 0
	},
	{
		x: 0, y: 1, z: 0
	},
	{
		x: 0, y: 0, z: -1
	},
	{
		x: 0, y: 0, z: 1
	}
];

function rotateVector(
	vector,
	axis,
	direction
) {
	const {
		x, y, z
	} = vector;

	if ( axis === "x" ) {
		return direction > 0 ? {
			x, y: -z, z: y
		} : {
			x, y: z, z: -y
		};
	}

	if ( axis === "y" ) {
		return direction > 0 ? {
			x: z, y, z: -x
		} : {
			x: -z, y, z: x
		};
	}

	return direction > 0 ? {
		x: -y, y: x, z
	} : {
		x: y, y: -x, z
	};
}

function sameVector( left,
	right ) {
	return left.x === right.x && left.y === right.y && left.z === right.z;
}

function vectorKey( vector ) {
	return `${vector.x}${vector.y}${vector.z}`;
}

function clonePiece( piece ) {
	return {
		homeNormals: Object.fromEntries( Object.entries( piece.homeNormals )
			.map( ( [ color, normal ] ) => [ color, { ...normal } ] ) ),
		homePosition: { ...piece.homePosition },
		key:          piece.key,
		position:     { ...piece.position },
		stickers:     piece.stickers.map( ( sticker ) => ( {
			color:  sticker.color,
			normal: { ...sticker.normal }
		} ) )
	};
}

function buildPieces( cubies ) {
	const colorHomes = Object.fromEntries( cubies
		.filter( ( cubie ) => cubie.stickers.length === 1 )
		.map( ( cubie ) => [ cubie.stickers[ 0 ].color, { ...cubie.position } ] ) );

	return cubies.map( ( cubie ) => {
		const homeNormals = Object.fromEntries( cubie.stickers.map( ( sticker ) => [
			sticker.color,
			{ ...colorHomes[ sticker.color ] }
		] ) );
		const homePosition = cubie.stickers.reduce( ( position, sticker ) => ( {
			x: position.x + colorHomes[ sticker.color ].x,
			y: position.y + colorHomes[ sticker.color ].y,
			z: position.z + colorHomes[ sticker.color ].z
		} ), {
			x: 0, y: 0, z: 0
		} );

		return {
			homeNormals,
			homePosition,
			key: cubie.stickers.map( ( sticker ) => sticker.color )
				.sort()
				.join( ":" ),
			position: { ...cubie.position },
			stickers: cubie.stickers.map( ( sticker ) => ( {
				color:  sticker.color,
				normal: { ...sticker.normal }
			} ) )
		};
	} );
}

function isPieceSolved( piece ) {
	return sameVector( piece.position, piece.homePosition ) && piece.stickers.every( ( sticker ) =>
		sameVector( sticker.normal, piece.homeNormals[ sticker.color ] ) );
}

function isPositionSolved( piece ) {
	return sameVector( piece.position, piece.homePosition );
}

function parseToken( token ) {
	const base = token[ 0 ].toUpperCase();
	return {
		base,
		inverse: token.includes( "'" ),
		turns:   token.includes( "2" ) ? 2 : 1
	};
}

function applyToken( pieces,
	token ) {
	const {
		base, inverse, turns
	} = parseToken( token );
	const outerFace = OUTER_FACES[ base ];
	const definition = outerFace ?? { axis: "x", layer: 0 };
	const clockwiseDirection = outerFace ? -outerFace.layer : 1;
	const direction = inverse ? -clockwiseDirection : clockwiseDirection;

	for ( let turn = 0; turn < turns; turn += 1 ) {
		for ( const piece of pieces ) {
			if ( piece.position[ definition.axis ] !== definition.layer ) {
				continue;
			}

			piece.position = rotateVector(
				piece.position, definition.axis, direction
			);

			for ( const sticker of piece.stickers ) {
				sticker.normal = rotateVector(
					sticker.normal, definition.axis, direction
				);
			}
		}
	}
}

function applyTokens( pieces,
	tokens ) {
	for ( const token of tokens ) {
		applyToken( pieces, token );
	}
}

function invertToken( token ) {
	if ( token.includes( "2" ) ) {
		return token;
	}

	return token.includes( "'" ) ? token.replace( "'", "" ) : `${token}'`;
}

function invertTokens( tokens ) {
	return tokens.slice()
		.reverse()
		.map( invertToken );
}

function createActions( generators ) {
	return generators.flatMap( ( generator ) => [
		{ tokens: [ generator ] },
		{ tokens: [ `${generator}'` ] },
		{ tokens: [ `${generator}2` ] }
	] );
}

function encodePieces( pieces,
	includeOrientation = true ) {
	return pieces.slice()
		.sort( ( left, right ) => left.key.localeCompare( right.key ) )
		.map( ( piece ) => {
			const position = vectorKey( piece.position );

			if ( !includeOrientation ) {
				return `${piece.key}@${position}`;
			}

			const orientation = piece.stickers.slice()
				.sort( ( left, right ) => left.color.localeCompare( right.color ) )
				.map( ( sticker ) => `${sticker.color}:${vectorKey( sticker.normal )}` )
				.join( "," );
			return `${piece.key}@${position}/${orientation}`;
		} )
		.join( "|" );
}

function solvedPieces( pieces ) {
	return pieces.map( ( piece ) => ( {
		...clonePiece( piece ),
		position: { ...piece.homePosition },
		stickers: piece.stickers.map( ( sticker ) => ( {
			color:  sticker.color,
			normal: { ...piece.homeNormals[ sticker.color ] }
		} ) )
	} ) );
}

function reconstructPath(
	meetingKey,
	forwardNodes,
	backwardNodes,
	actions
) {
	const forwardActions = [];
	let node = forwardNodes.get( meetingKey );

	while ( node.parent !== null ) {
		forwardActions.unshift( actions[ node.action ].tokens );
		node = forwardNodes.get( node.parent );
	}

	const backwardActions = [];
	node = backwardNodes.get( meetingKey );

	while ( node.parent !== null ) {
		backwardActions.push( invertTokens( actions[ node.action ].tokens ) );
		node = backwardNodes.get( node.parent );
	}

	return [ ...forwardActions, ...backwardActions ].flat();
}

function bidirectionalSearch(
	startPieces,
	actions,
	{
		includeOrientation = true,
		maxNodes = 500000
	} = {}
) {
	const goalPieces = solvedPieces( startPieces );
	const encode = ( pieces ) => encodePieces( pieces, includeOrientation );
	const startKey = encode( startPieces );
	const goalKey = encode( goalPieces );

	if ( startKey === goalKey ) {
		return [];
	}

	const forwardNodes = new Map( [ [ startKey, {
		action: null, parent: null, pieces: startPieces.map( clonePiece )
	} ] ] );
	const backwardNodes = new Map( [ [ goalKey, {
		action: null, parent: null, pieces: goalPieces
	} ] ] );
	let forwardFrontier = [ startKey ];
	let backwardFrontier = [ goalKey ];

	while ( forwardFrontier.length && backwardFrontier.length ) {
		const expandForward = forwardFrontier.length <= backwardFrontier.length;
		const ownNodes = expandForward ? forwardNodes : backwardNodes;
		const otherNodes = expandForward ? backwardNodes : forwardNodes;
		const frontier = expandForward ? forwardFrontier : backwardFrontier;
		const nextFrontier = [];

		for ( const parentKey of frontier ) {
			const parent = ownNodes.get( parentKey );

			for ( let actionIndex = 0; actionIndex < actions.length; actionIndex += 1 ) {
				const pieces = parent.pieces.map( clonePiece );

				applyTokens( pieces, actions[ actionIndex ].tokens );
				const key = encode( pieces );

				if ( ownNodes.has( key ) ) {
					continue;
				}

				ownNodes.set( key, {
					action: actionIndex,
					parent: parentKey,
					pieces
				} );
				nextFrontier.push( key );

				if ( otherNodes.has( key ) ) {
					return reconstructPath(
						key, forwardNodes, backwardNodes, actions
					);
				}

				if ( forwardNodes.size + backwardNodes.size > maxNodes ) {
					throw new Error( "Roux search exceeded its state limit" );
				}
			}
		}

		if ( expandForward ) {
			forwardFrontier = nextFrontier;
		} else {
			backwardFrontier = nextFrontier;
		}
	}

	throw new Error( "Roux search did not find a solution" );
}

function vectorIndex( vector ) {
	return ( vector.x + 1 ) * 9 + ( vector.y + 1 ) * 3 + vector.z + 1;
}

function indexVector( index ) {
	return {
		x: Math.floor( index / 9 ) - 1,
		y: Math.floor( index % 9 / 3 ) - 1,
		z: index % 3 - 1
	};
}

function encodeCompactPiece( position,
	normal ) {
	const normalIndex = NORMALS.findIndex( ( candidate ) => sameVector( candidate, normal ) );
	return vectorIndex( position ) * NORMALS.length + normalIndex;
}

function transformCompactCode( code,
	token ) {
	const {
		base, inverse, turns
	} = parseToken( token );
	const definition = OUTER_FACES[ base ] ?? { axis: "x", layer: 0 };
	const clockwiseDirection = OUTER_FACES[ base ] ? -definition.layer : 1;
	const direction = inverse ? -clockwiseDirection : clockwiseDirection;
	let position = indexVector( Math.floor( code / NORMALS.length ) );
	let normal = NORMALS[ code % NORMALS.length ];

	for ( let turn = 0; turn < turns; turn += 1 ) {
		if ( position[ definition.axis ] === definition.layer ) {
			position = rotateVector(
				position, definition.axis, direction
			);
			normal = rotateVector(
				normal, definition.axis, direction
			);
		}
	}

	return encodeCompactPiece( position, normal );
}

function compactState( pieces,
	solved = false ) {
	return pieces.slice()
		.sort( ( left, right ) => left.key.localeCompare( right.key ) )
		.map( ( piece ) => {
			const sticker = piece.stickers[ 0 ];
			return encodeCompactPiece( solved ? piece.homePosition : piece.position,
				solved ? piece.homeNormals[ sticker.color ] : sticker.normal );
		} );
}

function reconstructCompactPath(
	meetingKey,
	forwardNodes,
	backwardNodes,
	actions
) {
	const forwardActions = [];
	let node = forwardNodes.get( meetingKey );

	while ( node.parent !== null ) {
		forwardActions.unshift( actions[ node.action ].tokens );
		node = forwardNodes.get( node.parent );
	}

	const backwardActions = [];
	node = backwardNodes.get( meetingKey );

	while ( node.parent !== null ) {
		backwardActions.push( invertTokens( actions[ node.action ].tokens ) );
		node = backwardNodes.get( node.parent );
	}

	return [ ...forwardActions, ...backwardActions ].flat();
}

function compactBidirectionalSearch(
	pieces,
	actions,
	maxNodes = 1000000
) {
	const transitions = actions.map( ( action ) => Array.from( { length: 162 }, ( _, code ) =>
		action.tokens.reduce( transformCompactCode, code ) ) );
	const transform = ( state, actionIndex ) => state
		.map( ( code ) => transitions[ actionIndex ][ code ] );
	const key = ( state ) => String.fromCharCode( ...state );
	const startState = compactState( pieces );
	const goalState = compactState( pieces, true );
	const startKey = key( startState );
	const goalKey = key( goalState );

	if ( startKey === goalKey ) {
		return [];
	}

	const forwardNodes = new Map( [ [ startKey, {
		action: null, parent: null, state: startState
	} ] ] );
	const backwardNodes = new Map( [ [ goalKey, {
		action: null, parent: null, state: goalState
	} ] ] );
	let forwardFrontier = [ startKey ];
	let backwardFrontier = [ goalKey ];

	while ( forwardFrontier.length && backwardFrontier.length ) {
		const expandForward = forwardFrontier.length <= backwardFrontier.length;
		const ownNodes = expandForward ? forwardNodes : backwardNodes;
		const otherNodes = expandForward ? backwardNodes : forwardNodes;
		const frontier = expandForward ? forwardFrontier : backwardFrontier;
		const nextFrontier = [];

		for ( const parentKey of frontier ) {
			const parent = ownNodes.get( parentKey );

			for ( let actionIndex = 0; actionIndex < actions.length; actionIndex += 1 ) {
				const state = transform( parent.state, actionIndex );
				const stateKey = key( state );

				if ( ownNodes.has( stateKey ) ) {
					continue;
				}

				ownNodes.set( stateKey, {
					action: actionIndex,
					parent: parentKey,
					state
				} );
				nextFrontier.push( stateKey );

				if ( otherNodes.has( stateKey ) ) {
					return reconstructCompactPath(
						stateKey, forwardNodes, backwardNodes, actions
					);
				}

				if ( forwardNodes.size + backwardNodes.size > maxNodes ) {
					throw new Error( "Roux LSE search exceeded its state limit" );
				}
			}
		}

		if ( expandForward ) {
			forwardFrontier = nextFrontier;
		} else {
			backwardFrontier = nextFrontier;
		}
	}

	throw new Error( "Roux LSE search did not find a solution" );
}

function historyToNotation( history ) {
	return history.map( ( move ) => {
		if ( ( move.turns ?? 1 ) === 2 ) {
			return `${move.name}2`;
		}

		return move.direction === -move.layer ? move.name : `${move.name}'`;
	} )
		.join( " " );
}

function selectBlockPieces( pieces,
	x ) {
	return pieces.filter( ( piece ) => piece.stickers.length > 1 &&
		piece.homePosition.x === x && piece.homePosition.y < 1 );
}

function selectTopCorners( pieces ) {
	return pieces.filter( ( piece ) => piece.stickers.length === 3 && piece.homePosition.y === 1 );
}

function selectLSEPieces( pieces ) {
	const referenceCorner = selectTopCorners( pieces )[ 0 ];
	return pieces.filter( ( piece ) => piece.homePosition.x === 0 ||
		 piece.stickers.length === 2 && piece.homePosition.y === 1 )
		.concat( referenceCorner );
}

function assertPiecesSolved( pieces,
	message ) {
	if ( !pieces.every( isPieceSolved ) ) {
		throw new Error( message );
	}
}

function solveCMLL( pieces ) {
	const topCorners = selectTopCorners( pieces );
	const positionMoves = bidirectionalSearch(
		topCorners, CMLL_POSITION_ACTIONS, {
			includeOrientation: false,
			maxNodes:           10000
		}
	);
	const moves = [ ...positionMoves ];

	applyTokens( pieces, positionMoves );

	const upCenter = pieces.find( ( piece ) => piece.stickers.length === 1 && piece.homePosition.y === 1 );
	const upColor = upCenter.stickers[ 0 ].color;

	for ( let cornerIndex = 0; cornerIndex < 4; cornerIndex += 1 ) {
		let twists = 0;
		let corner = pieces.find( ( piece ) => sameVector( piece.position, {
			x: 1, y: 1, z: 1
		} ) );
		let upSticker = corner.stickers.find( ( sticker ) => sticker.color === upColor );

		while ( ( !upSticker || upSticker.normal.y !== 1 ) && twists < 6 ) {
			const algorithm = [ "R'", "D'", "R", "D" ];

			applyTokens( pieces, algorithm );
			moves.push( ...algorithm );
			twists += 1;
			corner = pieces.find( ( piece ) => sameVector( piece.position, {
				x: 1, y: 1, z: 1
			} ) );
			upSticker = corner.stickers.find( ( sticker ) => sticker.color === upColor );
		}

		if ( !upSticker || upSticker.normal.y !== 1 ) {
			throw new Error( "Roux CMLL corner orientation did not converge" );
		}

		applyToken( pieces, "U" );
		moves.push( "U" );
	}

	assertPiecesSolved( topCorners, "Roux CMLL did not solve the last-layer corners" );
	return moves;
}

export class RouxMethodSolver {
	static id = "roux";

	solve( {
		cubies,
		history
	} ) {
		const pieces = buildPieces( cubies );
		const firstBlock = selectBlockPieces( pieces, -1 );
		const secondBlock = selectBlockPieces( pieces, 1 );
		const firstBlockNotation = cubeSolver.solve( historyToNotation( history ), "fb" );
		const firstBlockMoves = String( firstBlockNotation || "" ).trim()
			.split( /\s+/ )
			.filter( Boolean );

		applyTokens( pieces, firstBlockMoves );
		assertPiecesSolved( firstBlock, "Roux First Block was not solved" );

		const secondBlockMoves = bidirectionalSearch( secondBlock, SECOND_BLOCK_ACTIONS );

		applyTokens( pieces, secondBlockMoves );
		assertPiecesSolved( [ ...firstBlock, ...secondBlock ], "Roux Second Block was not solved" );

		const cmllMoves = solveCMLL( pieces );
		assertPiecesSolved( [ ...firstBlock, ...secondBlock ], "Roux CMLL disrupted a solved block" );

		const lseMoves = compactBidirectionalSearch( selectLSEPieces( pieces ), LSE_ACTIONS );

		applyTokens( pieces, lseMoves );
		assertPiecesSolved( pieces, "Roux LSE did not solve the cube" );

		const phases = [
			{ id: "first-block", moves: firstBlockMoves },
			{ id: "second-block", moves: secondBlockMoves },
			{ id: "cmll", moves: cmllMoves },
			{ id: "lse", moves: lseMoves }
		];

		return { phases: convertDirectNotationPhases( phases ) };
	}
}
