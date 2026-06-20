import { convertNotationPhases } from "./RC_solverNotation.mjs";

const FACE_NAMES = [ "F", "R", "U", "B", "L", "D" ];
const EDGE_CYCLES = [
	[ 1, 8, 5, 9 ],
	[ 0, 11, 4, 8 ],
	[ 1, 2, 3, 0 ],
	[ 3, 10, 7, 11 ],
	[ 2, 9, 6, 10 ],
	[ 5, 4, 7, 6 ]
];
const CORNER_CYCLES = [
	[ 1, 0, 4, 5 ],
	[ 0, 3, 7, 4 ],
	[ 0, 1, 2, 3 ],
	[ 3, 2, 6, 7 ],
	[ 2, 1, 5, 6 ],
	[ 5, 4, 7, 6 ]
];
const ALL_MOVES = Array.from( { length: 18 }, ( _, move ) => move );
const G1_MOVES = ALL_MOVES.filter( ( move ) => ![ 0, 3 ].includes( Math.floor( move / 3 ) ) || move % 3 === 1 );
const G2_MOVES = ALL_MOVES.filter( ( move ) => [ 2, 5 ].includes( Math.floor( move / 3 ) ) || move % 3 === 1 );
const G3_MOVES = ALL_MOVES.filter( ( move ) => move % 3 === 1 );
const PHASE_LIMITS = [ 7, 10, 13, 15 ];
const UNVISITED = 255;
let cachedTables = null;

function createSolvedState() {
	return {
		co: Array( 8 ).fill( 0 ),
		cp: Array.from( { length: 8 }, ( _, index ) => index ),
		eo: Array( 12 ).fill( 0 ),
		ep: Array.from( { length: 12 }, ( _, index ) => index )
	};
}

function cloneState( state ) {
	return {
		co: state.co.slice(),
		cp: state.cp.slice(),
		eo: state.eo.slice(),
		ep: state.ep.slice()
	};
}

function cycleValues( values,
	cycle ) {
	const last = values[ cycle.at( -1 ) ];

	for ( let index = cycle.length - 1; index > 0; index -= 1 ) {
		values[ cycle[ index ] ] = values[ cycle[ index - 1 ] ];
	}

	values[ cycle[ 0 ] ] = last;
}

function quarterTurn( state,
	face ) {
	const edgeCycle = EDGE_CYCLES[ face ];
	const cornerCycle = CORNER_CYCLES[ face ];

	cycleValues( state.ep, edgeCycle );
	cycleValues( state.eo, edgeCycle );
	cycleValues( state.cp, cornerCycle );
	cycleValues( state.co, cornerCycle );

	if ( face === 0 || face === 3 ) {
		for ( const position of edgeCycle ) {
			state.eo[ position ] ^= 1;
		}
	}

	if ( face !== 2 && face !== 5 ) {
		for ( let index = 0; index < cornerCycle.length; index += 1 ) {
			const position = cornerCycle[ index ];
			state.co[ position ] = ( state.co[ position ] + ( index % 2 ? 1 : 2 ) ) % 3;
		}
	}
}

function applyMove( state,
	move ) {
	const face = Math.floor( move / 3 );
	const turns = [ 1, 2, 3 ][ move % 3 ];

	for ( let turn = 0; turn < turns; turn += 1 ) {
		quarterTurn( state, face );
	}
}

function orientationIndex( orientation,
	base ) {
	let index = 0;

	for ( let position = 0; position < orientation.length - 1; position += 1 ) {
		index = index * base + orientation[ position ];
	}

	return index;
}

function indexOrientation(
	index,
	length,
	base
) {
	const orientation = Array( length ).fill( 0 );
	let sum = 0;

	for ( let position = length - 2; position >= 0; position -= 1 ) {
		orientation[ position ] = index % base;
		sum += orientation[ position ];
		index = Math.floor( index / base );
	}

	orientation[ length - 1 ] = ( base - sum % base ) % base;
	return orientation;
}

function permutationIndex( permutation ) {
	let index = 0;

	for ( let left = 0; left < permutation.length; left += 1 ) {
		let smaller = 0;

		for ( let right = left + 1; right < permutation.length; right += 1 ) {
			if ( permutation[ right ] < permutation[ left ] ) {
				smaller += 1;
			}
		}

		index = index * ( permutation.length - left ) + smaller;
	}

	return index;
}

function indexPermutation( index,
	length ) {
	const digits = Array( length ).fill( 0 );
	const available = Array.from( { length }, ( _, value ) => value );

	for ( let position = length - 1; position >= 0; position -= 1 ) {
		const base = length - position;
		digits[ position ] = index % base;
		index = Math.floor( index / base );
	}

	return digits.map( ( digit ) => available.splice( digit, 1 )[ 0 ] );
}

function createCombinationSpace( length,
	selected ) {
	const masks = [];
	const indexByMask = new Int32Array( 1 << length );

	indexByMask.fill( -1 );

	for ( let mask = 0; mask < 1 << length; mask += 1 ) {
		let bits = 0;

		for ( let value = mask; value; value &= value - 1 ) {
			bits += 1;
		}

		if ( bits === selected ) {
			indexByMask[ mask ] = masks.length;
			masks.push( mask );
		}
	}

	return { indexByMask, masks };
}

function maskFromPermutation(
	permutation,
	selectedPieces,
	positions = permutation.map( ( _, index ) => index )
) {
	let mask = 0;

	positions.forEach( ( position, index ) => {
		if ( selectedPieces.has( permutation[ position ] ) ) {
			mask |= 1 << index;
		}
	} );

	return mask;
}

function createOrientationTransitions(
	length,
	base,
	moves,
	key
) {
	const size = base ** ( length - 1 );
	const transitions = Array( 18 );

	for ( const move of moves ) {
		const table = new Uint16Array( size );

		for ( let index = 0; index < size; index += 1 ) {
			const state = createSolvedState();
			state[ key ] = indexOrientation(
				index, length, base
			);
			applyMove( state, move );
			table[ index ] = orientationIndex( state[ key ], base );
		}

		transitions[ move ] = table;
	}

	return transitions;
}

function createPermutationTransitions(
	length,
	moves,
	key
) {
	const size = length === 8 ? 40320 : 24;
	const transitions = Array( 18 );

	for ( const move of moves ) {
		const table = new Uint32Array( size );

		for ( let index = 0; index < size; index += 1 ) {
			const state = createSolvedState();
			state[ key ] = indexPermutation( index, length );
			applyMove( state, move );
			table[ index ] = permutationIndex( state[ key ] );
		}

		transitions[ move ] = table;
	}

	return transitions;
}

function createCombinationTransitions(
	space,
	moves,
	selectedPieces,
	positions
) {
	const transitions = Array( 18 );

	for ( const move of moves ) {
		const table = new Uint16Array( space.masks.length );

		for ( let index = 0; index < space.masks.length; index += 1 ) {
			const state = createSolvedState();
			const selected = [];
			const unselected = [];

			positions.forEach( ( position, localIndex ) => {
				( space.masks[ index ] & 1 << localIndex ? selected : unselected ).push( position );
			} );
			state.ep = Array( 12 ).fill( -1 );
			selected.forEach( ( position, pieceIndex ) => {
				state.ep[ position ] = [ ...selectedPieces ][ pieceIndex ];
			} );
			const otherPieces = Array.from( { length: 12 }, ( _, piece ) => piece )
				.filter( ( piece ) => !selectedPieces.has( piece ) );
			unselected.concat( Array.from( { length: 12 }, ( _, position ) => position )
				.filter( ( position ) => !positions.includes( position ) ) )
				.forEach( ( position, pieceIndex ) => {
					state.ep[ position ] = otherPieces[ pieceIndex ];
				} );
			applyMove( state, move );
			const mask = maskFromPermutation(
				state.ep, selectedPieces, positions
			);
			table[ index ] = space.indexByMask[ mask ];
		}

		transitions[ move ] = table;
	}

	return transitions;
}

function positionOrbits( cycles ) {
	const parent = Array.from( { length: cycles === EDGE_CYCLES ? 12 : 8 }, ( _, index ) => index );
	const find = ( value ) => parent[ value ] === value ? value : parent[ value ] = find( parent[ value ] ) ;

	const unite = ( left, right ) => {
		parent[ find( left ) ] = find( right );
	};

	for ( const cycle of cycles ) {
		unite( cycle[ 0 ], cycle[ 2 ] );
		unite( cycle[ 1 ], cycle[ 3 ] );
	}

	const groups = new Map();

	parent.forEach( ( _, position ) => {
		const root = find( position );
		groups.set( root, [ ... groups.get( root ) ?? [] , position ] );
	} );

	return [ ...groups.values() ].map( ( orbit ) => orbit.sort( ( left, right ) => left - right ) );
}

function createDistanceTable(
	size,
	goals,
	moves,
	nextIndex
) {
	const distance = new Uint8Array( size );
	const queue = new Uint32Array( size );
	let head = 0;
	let tail = 0;

	distance.fill( UNVISITED );

	for ( const goal of goals ) {
		if ( distance[ goal ] === 0 ) {
			continue;
		}

		distance[ goal ] = 0;
		queue[ tail ] = goal;
		tail += 1;
	}

	while ( head < tail ) {
		const index = queue[ head ];
		const nextDistance = distance[ index ] + 1;

		head += 1;

		for ( const move of moves ) {
			const next = nextIndex( index, move );

			if ( distance[ next ] !== UNVISITED ) {
				continue;
			}

			distance[ next ] = nextDistance;
			queue[ tail ] = next;
			tail += 1;
		}
	}

	return distance;
}

function createLocalPermutationTransitions( orbit,
	moves ) {
	const transitions = Array( 18 );
	const localPiece = new Map( orbit.map( ( piece, index ) => [ piece, index ] ) );

	for ( const move of moves ) {
		const table = new Uint8Array( 24 );

		for ( let index = 0; index < 24; index += 1 ) {
			const state = createSolvedState();
			const localPermutation = indexPermutation( index, 4 );

			orbit.forEach( ( position, localPosition ) => {
				state.ep[ position ] = orbit[ localPermutation[ localPosition ] ];
			} );
			applyMove( state, move );
			table[ index ] = permutationIndex( orbit.map( ( position ) => localPiece.get( state.ep[ position ] ) ) );
		}

		transitions[ move ] = table;
	}

	return transitions;
}

function createTables() {
	const slicePieces = new Set( [ 8, 9, 10, 11 ] );
	const sliceSpace = createCombinationSpace( 12, 4 );
	const allEdgePositions = Array.from( { length: 12 }, ( _, position ) => position );
	const edgeOrbits = positionOrbits( EDGE_CYCLES );
	const nonSliceOrbits = edgeOrbits.filter( ( orbit ) => !orbit.includes( 8 ) );
	const nonSlicePositions = nonSliceOrbits.flat().sort( ( left, right ) => left - right );
	const selectedEdgeOrbit = new Set( nonSliceOrbits[ 0 ] );
	const tetradSpace = createCombinationSpace( 8, 4 );
	const eoTransitions = createOrientationTransitions(
		12, 2, ALL_MOVES, "eo"
	);
	const coTransitions = createOrientationTransitions(
		8, 3, G1_MOVES, "co"
	);
	const sliceTransitions = createCombinationTransitions(
		sliceSpace, G1_MOVES, slicePieces, allEdgePositions
	);
	const cornerTransitions = createPermutationTransitions(
		8, G2_MOVES, "cp"
	);
	const tetradTransitions = createCombinationTransitions(
		tetradSpace, G2_MOVES, selectedEdgeOrbit, nonSlicePositions
	);
	const halfCornerTransitions = createPermutationTransitions(
		8, G3_MOVES, "cp"
	);
	const cornerRanks = [];
	const cornerRankSet = new Set( [ 0 ] );
	const cornerQueue = [ 0 ];

	while ( cornerQueue.length ) {
		const rank = cornerQueue.shift();
		cornerRanks.push( rank );

		for ( const move of G3_MOVES ) {
			const next = halfCornerTransitions[ move ][ rank ];

			if ( !cornerRankSet.has( next ) ) {
				cornerRankSet.add( next );
				cornerQueue.push( next );
			}
		}
	}

	const compactCornerIndex = new Int16Array( 40320 );

	compactCornerIndex.fill( -1 );
	cornerRanks.forEach( ( rank, index ) => {
		compactCornerIndex[ rank ] = index;
	} );

	const compactCornerTransitions = Array( 18 );

	for ( const move of G3_MOVES ) {
		compactCornerTransitions[ move ] = Uint8Array.from( cornerRanks, ( rank ) =>
			compactCornerIndex[ halfCornerTransitions[ move ][ rank ] ] );
	}

	const localEdgeTransitions = edgeOrbits.map( ( orbit ) =>
		createLocalPermutationTransitions( orbit, G3_MOVES ) );
	const phase1 = createDistanceTable(
		2048, [ 0 ], ALL_MOVES, ( index, move ) => eoTransitions[ move ][ index ]
	);
	const phase2Size = 2187 * sliceSpace.masks.length;
	const solvedSliceMask = maskFromPermutation(
		createSolvedState().ep, slicePieces, allEdgePositions
	);
	const solvedSliceIndex = sliceSpace.indexByMask[ solvedSliceMask ];
	const phase2 = createDistanceTable(
		phase2Size, [ solvedSliceIndex ], G1_MOVES, ( index, move ) => {
			const co = Math.floor( index / sliceSpace.masks.length );
			const slice = index % sliceSpace.masks.length;
			return coTransitions[ move ][ co ] * sliceSpace.masks.length + sliceTransitions[ move ][ slice ];
		}
	);
	const phase3Size = 40320 * tetradSpace.masks.length;
	const solvedTetradMask = maskFromPermutation(
		createSolvedState().ep, selectedEdgeOrbit, nonSlicePositions
	);
	const solvedTetradIndex = tetradSpace.indexByMask[ solvedTetradMask ];
	const phase3Goals = cornerRanks.map( ( rank ) => rank * tetradSpace.masks.length + solvedTetradIndex );
	const phase3 = createDistanceTable(
		phase3Size, phase3Goals, G2_MOVES, ( index, move ) => {
			const corner = Math.floor( index / tetradSpace.masks.length );
			const tetrad = index % tetradSpace.masks.length;
			return cornerTransitions[ move ][ corner ] * tetradSpace.masks.length + tetradTransitions[ move ][ tetrad ];
		}
	);
	const edgePermutationSize = 24 ** edgeOrbits.length;
	const phase4Size = cornerRanks.length * edgePermutationSize;
	const phase4 = createDistanceTable(
		phase4Size, [ compactCornerIndex[ 0 ] * edgePermutationSize ], G3_MOVES, ( index, move ) => {
			const corner = Math.floor( index / edgePermutationSize );
			let remainder = index % edgePermutationSize;
			const edgeIndexes = [];

			for ( let orbit = edgeOrbits.length - 1; orbit >= 0; orbit -= 1 ) {
				edgeIndexes[ orbit ] = remainder % 24;
				remainder = Math.floor( remainder / 24 );
			}

			const nextCorner = compactCornerTransitions[ move ][ corner ];
			const nextEdges = edgeIndexes.map( ( edgeIndex, orbit ) =>
				localEdgeTransitions[ orbit ][ move ][ edgeIndex ] );
			return nextEdges.reduce( ( result, edgeIndex ) => result * 24 + edgeIndex, nextCorner );
		}
	);

	return {
		compactCornerIndex,
		edgeOrbits,
		phase1,
		phase2,
		phase3,
		phase4,
		selectedEdgeOrbit,
		slicePieces,
		sliceSpace,
		tetradSpace,
		nonSlicePositions
	};
}

function phaseIndex(
	state,
	phase,
	tables
) {
	if ( phase === 0 ) {
		return orientationIndex( state.eo, 2 );
	}

	if ( phase === 1 ) {
		const sliceMask = maskFromPermutation( state.ep, tables.slicePieces );
		return orientationIndex( state.co, 3 ) * tables.sliceSpace.masks.length +
			tables.sliceSpace.indexByMask[ sliceMask ];
	}

	if ( phase === 2 ) {
		const tetradMask = maskFromPermutation(
			state.ep, tables.selectedEdgeOrbit, tables.nonSlicePositions
		);
		return permutationIndex( state.cp ) * tables.tetradSpace.masks.length +
			tables.tetradSpace.indexByMask[ tetradMask ];
	}

	const edgeIndexes = tables.edgeOrbits.map( ( orbit ) => {
		const localPiece = new Map( orbit.map( ( piece, index ) => [ piece, index ] ) );
		return permutationIndex( orbit.map( ( position ) => localPiece.get( state.ep[ position ] ) ) );
	} );
	return edgeIndexes.reduce( ( result, edgeIndex ) => result * 24 + edgeIndex,
		tables.compactCornerIndex[ permutationIndex( state.cp ) ] );
}

function moveToken( move ) {
	return `${FACE_NAMES[ Math.floor( move / 3 ) ]}${[ "", "2", "'" ][ move % 3 ]}`;
}

function historyMoveIndex( move ) {
	const face = FACE_NAMES.indexOf( move.name );

	if ( face < 0 ) {
		throw new Error( `Unsupported Thistlethwaite history move: ${move.name}` );
	}

	if ( ( move.turns ?? 1 ) === 2 ) {
		return face * 3 + 1;
	}

	return face * 3 + ( move.direction === -move.layer ? 0 : 2 );
}

function solvePhase(
	state,
	phase,
	tables
) {
	const moves = [ ALL_MOVES, G1_MOVES, G2_MOVES, G3_MOVES ][ phase ];
	const distance = [ tables.phase1, tables.phase2, tables.phase3, tables.phase4 ][ phase ];
	const solution = [];
	let index = phaseIndex(
		state, phase, tables
	);

	if ( index < 0 || distance[ index ] === UNVISITED ) {
		throw new Error( `Thistlethwaite phase ${phase + 1} received an unreachable state` );
	}

	while ( distance[ index ] > 0 ) {
		const targetDistance = distance[ index ] - 1;
		let selected = null;

		for ( const move of moves ) {
			const candidate = cloneState( state );

			applyMove( candidate, move );
			const candidateIndex = phaseIndex(
				candidate, phase, tables
			);

			if ( distance[ candidateIndex ] === targetDistance ) {
				selected = {
					candidate, candidateIndex, move
				};
				break;
			}
		}

		if ( !selected ) {
			throw new Error( `Thistlethwaite phase ${phase + 1} could not descend its pruning table` );
		}

		Object.assign( state, selected.candidate );
		index = selected.candidateIndex;
		solution.push( moveToken( selected.move ) );
	}

	if ( solution.length > PHASE_LIMITS[ phase ] ) {
		throw new Error( `Thistlethwaite phase ${phase + 1} exceeded its move bound` );
	}

	return solution;
}

function stateIsSolved( state ) {
	return state.co.every( ( value ) => value === 0 ) &&
		state.eo.every( ( value ) => value === 0 ) &&
		state.cp.every( ( value, index ) => value === index ) &&
		state.ep.every( ( value, index ) => value === index );
}

export class ThistlethwaiteSolver {
	static id = "thistlethwaite";

	solve( { history } ) {
		cachedTables ??= createTables();

		const state = createSolvedState();

		for ( const historyMove of history ) {
			applyMove( state, historyMoveIndex( historyMove ) );
		}

		const phases = [
			{
				id:    "edge-orientation",
				moves: solvePhase(
					state, 0, cachedTables
				)
			},
			{
				id:    "domino-reduction",
				moves: solvePhase(
					state, 1, cachedTables
				)
			},
			{
				id:    "half-turn-reduction",
				moves: solvePhase(
					state, 2, cachedTables
				)
			},
			{
				id:    "half-turn-only",
				moves: solvePhase(
					state, 3, cachedTables
				)
			}
		];
		const moveCount = phases.reduce( ( total, phase ) => total + phase.moves.length, 0 );

		if ( moveCount > 52 || !stateIsSolved( state ) ) {
			throw new Error( "Thistlethwaite failed its 52-move solution guarantee" );
		}

		return { phases: convertNotationPhases( phases ) };
	}
}
