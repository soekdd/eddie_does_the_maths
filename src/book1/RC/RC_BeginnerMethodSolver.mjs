/*
 * Layer-by-layer algorithm adapted from pglass/cube (MIT).
 * See RC_SOLVER_LICENSE.md for attribution and license text.
 */

const FACE_DEFINITIONS = {
	B: { axis: "z", layer: -1 },
	D: { axis: "y", layer: -1 },
	F: { axis: "z", layer: 1 },
	L: { axis: "x", layer: -1 },
	R: { axis: "x", layer: 1 },
	U: { axis: "y", layer: 1 }
};
const FACE_VECTORS = {
	B: {
		x: 0, y: 0, z: -1
	},
	D: {
		x: 0, y: -1, z: 0
	},
	F: {
		x: 0, y: 0, z: 1
	},
	L: {
		x: -1, y: 0, z: 0
	},
	R: {
		x: 1, y: 0, z: 0
	},
	U: {
		x: 0, y: 1, z: 0
	}
};
const ROTATION_FACE_MAPS = {
	X: {
		B: "U", D: "B", F: "D", L: "L", R: "R", U: "F"
	},
	Y: {
		B: "L", D: "D", F: "R", L: "F", R: "B", U: "U"
	},
	Z: {
		B: "B", D: "R", F: "F", L: "D", R: "U", U: "L"
	}
};
const SLICE_EXPANSIONS = {
	E:  [ "Di", "Yi", "U" ],
	Ei: [ "D", "Y", "Ui" ],
	M:  [ "Li", "Xi", "R" ],
	Mi: [ "L", "X", "Ri" ],
	S:  [ "Fi", "Z", "B" ],
	Si: [ "F", "Zi", "Bi" ]
};
const PHASE_IDS = [
	"cross",
	"first-layer-corners",
	"second-layer",
	"last-layer-cross",
	"last-layer-corner-position",
	"last-layer-corner-orientation",
	"last-layer-edges"
];

function cloneVector( vector ) {
	return {
		x: vector.x,
		y: vector.y,
		z: vector.z
	};
}

function addVectors( ...vectors ) {
	return vectors.reduce( ( result, vector ) => ( {
		x: result.x + vector.x,
		y: result.y + vector.y,
		z: result.z + vector.z
	} ), {
		x: 0, y: 0, z: 0
	} );
}

function sameVector( left,
	right ) {
	return left.x === right.x && left.y === right.y && left.z === right.z;
}

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

function invertToken( token ) {
	return token.endsWith( "i" ) ? token.slice( 0, -1 ) : `${token}i`;
}

function invertFaceMap( map ) {
	return Object.fromEntries( Object.entries( map ).map( ( [ from, to ] ) => [ to, from ] ) );
}

function colorOnAxis( piece,
	axis ) {
	return piece.stickers.find( ( sticker ) => sticker.normal[ axis ] !== 0 )?.color ?? null;
}

function assertState( condition,
	message ) {
	if ( !condition ) {
		throw new Error( message );
	}
}

class SolverCube {
	constructor( cubies ) {
		this.pieces = cubies.map( ( cubie ) => ( {
			position: cloneVector( cubie.position ),
			stickers: cubie.stickers.map( ( sticker ) => ( {
				color:  sticker.color,
				normal: cloneVector( sticker.normal )
			} ) )
		} ) );
	}

	rotatePieces(
		pieces,
		axis,
		direction
	) {
		for ( const piece of pieces ) {
			piece.position = rotateVector(
				piece.position, axis, direction
			);

			for ( const sticker of piece.stickers ) {
				sticker.normal = rotateVector(
					sticker.normal, axis, direction
				);
			}
		}
	}

	applyToken( token ) {
		const inverse = token.endsWith( "i" );
		const base = inverse ? token.slice( 0, -1 ) : token;
		const face = FACE_DEFINITIONS[ base ];

		if ( face ) {
			const direction = inverse ? face.layer : -face.layer;
			this.rotatePieces(
				this.pieces.filter( ( piece ) => piece.position[ face.axis ] === face.layer ),
				face.axis,
				direction
			);
			return;
		}

		const sliceDefinitions = {
			E: { axis: "y", direction: 1 },
			M: { axis: "x", direction: 1 },
			S: { axis: "z", direction: -1 }
		};
		const slice = sliceDefinitions[ base ];

		if ( slice ) {
			this.rotatePieces(
				this.pieces.filter( ( piece ) => piece.position[ slice.axis ] === 0 ),
				slice.axis,
				inverse ? -slice.direction : slice.direction
			);
			return;
		}

		const rotationAxes = {
			X: "x", Y: "y", Z: "z"
		};
		const axis = rotationAxes[ base ];

		if ( axis ) {
			this.rotatePieces(
				this.pieces, axis, inverse ? 1 : -1
			);
			return;
		}

		throw new Error( `Unsupported solver move: ${token}` );
	}

	sequence( sequence ) {
		for ( const token of sequence.trim()
			.split( /\s+/ )
			.filter( Boolean ) ) {
			this.applyToken( token );
		}
	}

	findPiece( ...colors ) {
		return this.pieces.find( ( piece ) =>
			piece.stickers.length === colors.length &&
			colors.every( ( color ) => piece.stickers.some( ( sticker ) => sticker.color === color ) ) );
	}

	getPiece( vector ) {
		return this.pieces.find( ( piece ) => sameVector( piece.position, vector ) );
	}

	centerColor( faceName ) {
		const vector = FACE_VECTORS[ faceName ];
		return this.getPiece( vector )?.stickers[ 0 ]?.color ?? null;
	}

	isSolved() {
		return Object.entries( FACE_VECTORS ).every( ( [ name, vector ] ) => {
			const definition = FACE_DEFINITIONS[ name ];
			const centerColor = this.centerColor( name );
			return this.pieces
				.filter( ( piece ) => piece.position[ definition.axis ] === definition.layer )
				.every( ( piece ) => colorOnAxis( piece, definition.axis ) === centerColor );
		} );
	}
}

function getFaceTokenFromVector( vector ) {
	return Object.entries( FACE_VECTORS ).find( ( [ , faceVector ] ) => sameVector( vector, faceVector ) )?.[ 0 ];
}

export function convertInternalMoves( rawMoves ) {
	const expanded = rawMoves.flatMap( ( entry ) => {
		const expansion = SLICE_EXPANSIONS[ entry.token ];
		return ( expansion ?? [ entry.token ] ).map( ( token ) => ( {
			phase: entry.phase,
			token
		} ) );
	} );
	let faceMap = Object.fromEntries( Object.keys( FACE_DEFINITIONS ).map( ( name ) => [ name, name ] ) );
	const moves = [];

	for ( const entry of expanded ) {
		const inverse = entry.token.endsWith( "i" );
		const base = inverse ? entry.token.slice( 0, -1 ) : entry.token;
		const face = FACE_DEFINITIONS[ base ];

		if ( face ) {
			const mappedName = faceMap[ base ];
			const mappedFace = FACE_DEFINITIONS[ mappedName ];
			moves.push( {
				axis:      mappedFace.axis,
				direction: inverse ? mappedFace.layer : -mappedFace.layer,
				duration:  120,
				layer:     mappedFace.layer,
				name:      mappedName,
				phase:     entry.phase,
				turns:     1
			} );
			continue;
		}

		const rotationMap = ROTATION_FACE_MAPS[ base ];

		if ( !rotationMap ) {
			throw new Error( `Cannot convert solver move: ${entry.token}` );
		}

		const effectiveMap = inverse ? invertFaceMap( rotationMap ) : rotationMap;
		faceMap = Object.fromEntries( Object.keys( FACE_DEFINITIONS )
			.map( ( name ) => [ name, faceMap[ effectiveMap[ name ] ] ] ) );
	}

	return compressMoves( moves );
}

function compressMoves( moves ) {
	const compressed = [];

	for ( const move of moves ) {
		const previous = compressed.at( -1 );

		if ( !previous || previous.name !== move.name || previous.phase !== move.phase ) {
			compressed.push( { ...move } );
			continue;
		}

		const quarterTurns = previous.direction * previous.turns + move.direction;
		const normalized = ( quarterTurns % 4 + 4 ) % 4;

		if ( normalized === 0 ) {
			compressed.pop();
		} else if ( normalized === 1 ) {
			Object.assign( previous, {
				direction: 1,
				turns:     1
			} );
		} else if ( normalized === 2 ) {
			Object.assign( previous, {
				direction: 1,
				turns:     2
			} );
		} else {
			Object.assign( previous, {
				direction: -1,
				turns:     1
			} );
		}
	}

	return compressed;
}

export class BeginnerMethodSolver {
	static id = "beginner";

	solve( { cubies } ) {
		this.cube = new SolverCube( cubies );
		this.rawMoves = [];
		this.activePhase = "";
		this.maxIterations = 16;
		this.leftPiece = this.cube.findPiece( this.cube.centerColor( "L" ) );
		this.rightPiece = this.cube.findPiece( this.cube.centerColor( "R" ) );
		this.upPiece = this.cube.findPiece( this.cube.centerColor( "U" ) );
		this.downPiece = this.cube.findPiece( this.cube.centerColor( "D" ) );

		this.runPhase( PHASE_IDS[ 0 ], () => this.cross() );
		this.runPhase( PHASE_IDS[ 1 ], () => this.crossCorners() );
		this.runPhase( PHASE_IDS[ 2 ], () => this.secondLayer() );
		this.runPhase( PHASE_IDS[ 3 ], () => this.backFaceEdges() );
		this.runPhase( PHASE_IDS[ 4 ], () => this.lastLayerCornersPosition() );
		this.runPhase( PHASE_IDS[ 5 ], () => this.lastLayerCornersOrientation() );
		this.runPhase( PHASE_IDS[ 6 ], () => this.lastLayerEdges() );

		assertState( this.cube.isSolved(), "BeginnerMethodSolver did not reach a solved state" );

		const moves = convertInternalMoves( this.rawMoves );
		return {
			phases: PHASE_IDS.map( ( id ) => ( {
				id,
				moves: moves.filter( ( move ) => move.phase === id )
			} ) )
		};
	}

	runPhase( id,
		callback ) {
		this.activePhase = id;
		callback();
	}

	move( sequence ) {
		const tokens = sequence.trim()
			.split( /\s+/ )
			.filter( Boolean );

		for ( const token of tokens ) {
			this.rawMoves.push( {
				phase: this.activePhase,
				token
			} );
			this.cube.applyToken( token );
		}
	}

	loopUntil(
		predicate,
		move,
		message
	) {
		for ( let count = 0; count < this.maxIterations; count += 1 ) {
			if ( predicate() ) {
				return;
			}

			this.move( move );
		}

		throw new Error( message );
	}

	cross() {
		const front = this.cube.centerColor( "F" );
		const left = this.cube.centerColor( "L" );
		const right = this.cube.centerColor( "R" );
		const up = this.cube.centerColor( "U" );
		const down = this.cube.centerColor( "D" );
		const frontLeft = this.cube.findPiece( front, left );
		const frontRight = this.cube.findPiece( front, right );
		const frontUp = this.cube.findPiece( front, up );
		const frontDown = this.cube.findPiece( front, down );

		this.placeCrossSide(
			frontLeft, this.leftPiece, left, "L L", "E L Ei Li"
		);
		this.placeCrossSide(
			frontRight, this.rightPiece, right, "R R", "Ei R E Ri"
		);
		this.move( "Z" );
		this.placeCrossSide(
			frontDown, this.downPiece, this.cube.centerColor( "L" ), "L L", "E L Ei Li"
		);
		this.placeCrossSide(
			frontUp, this.upPiece, this.cube.centerColor( "R" ), "R R", "Ei R E Ri"
		);
		this.move( "Zi" );
	}

	placeCrossSide(
		edge,
		facePiece,
		faceColor,
		directMove,
		flippedMove
	) {
		if ( edge.position.x === facePiece.position.x && edge.position.y === facePiece.position.y &&
			edge.position.z === 1 && colorOnAxis( edge, "z" ) === this.cube.centerColor( "F" ) ) {
			return;
		}

		let undoMove = "";

		if ( edge.position.z === 0 ) {
			const faceVector = cloneVector( edge.position );
			faceVector.x = 0;
			const clockwise = getFaceTokenFromVector( faceVector );
			const counterclockwise = invertToken( clockwise );
			const clockwisePositions = [
				addVectors( FACE_VECTORS.L, FACE_VECTORS.U ),
				addVectors( FACE_VECTORS.R, FACE_VECTORS.D )
			];

			if ( clockwisePositions.some( ( position ) => sameVector( edge.position, position ) ) ) {
				this.move( clockwise );
				undoMove = counterclockwise;
			} else {
				this.move( counterclockwise );
				undoMove = clockwise;
			}
		} else if ( edge.position.z === 1 ) {
			const faceVector = cloneVector( edge.position );
			faceVector.z = 0;
			const clockwise = getFaceTokenFromVector( faceVector );
			const counterclockwise = invertToken( clockwise );

			this.move( `${counterclockwise} ${counterclockwise}` );

			if ( edge.position.x !== facePiece.position.x ) {
				undoMove = `${clockwise} ${clockwise}`;
			}
		}

		assertState( edge.position.z === -1, "Cross edge did not reach the back layer" );
		this.loopUntil(
			() => edge.position.x === facePiece.position.x && edge.position.y === facePiece.position.y,
			"B",
			"Cross edge could not be aligned"
		);

		if ( undoMove ) {
			this.move( undoMove );
		}

		this.move( colorOnAxis( edge, "x" ) === faceColor ? directMove : flippedMove );
	}

	crossCorners() {
		const front = this.cube.centerColor( "F" );
		const left = this.cube.centerColor( "L" );
		const right = this.cube.centerColor( "R" );
		const up = this.cube.centerColor( "U" );
		const down = this.cube.centerColor( "D" );
		const corners = [
			[ this.cube.findPiece(
				front, right, down
			), this.rightPiece, this.downPiece ],
			[ this.cube.findPiece(
				front, right, up
			), this.upPiece, this.rightPiece ],
			[ this.cube.findPiece(
				front, left, up
			), this.leftPiece, this.upPiece ],
			[ this.cube.findPiece(
				front, left, down
			), this.downPiece, this.leftPiece ]
		];

		for ( const [ corner, rightPiece, downPiece ] of corners ) {
			this.placeFrontRightDownCorner(
				corner, rightPiece, downPiece, this.cube.centerColor( "F" )
			);
			this.move( "Z" );
		}
	}

	placeFrontRightDownCorner(
		corner,
		rightPiece,
		downPiece,
		frontColor
	) {
		if ( corner.position.z === 1 ) {
			const faceVector = cloneVector( corner.position );
			faceVector.x = 0;
			faceVector.z = 0;
			const clockwise = getFaceTokenFromVector( faceVector );
			const counterclockwise = invertToken( clockwise );
			let count = 0;
			let undoMove = counterclockwise;

			while ( corner.position.z !== -1 && count < this.maxIterations ) {
				this.move( clockwise );
				count += 1;
			}

			if ( count > 1 ) {
				for ( let index = 0; index < count; index += 1 ) {
					this.move( counterclockwise );
				}

				count = 0;

				while ( corner.position.z !== -1 && count < this.maxIterations ) {
					this.move( counterclockwise );
					count += 1;
				}

				undoMove = clockwise;
			}

			this.move( "B" );

			for ( let index = 0; index < count; index += 1 ) {
				this.move( undoMove );
			}
		}

		this.loopUntil(
			() => corner.position.x === rightPiece.position.x && corner.position.y === downPiece.position.y,
			"B",
			"First-layer corner could not be aligned"
		);

		if ( colorOnAxis( corner, "x" ) === frontColor ) {
			this.move( "B D Bi Di" );
		} else if ( colorOnAxis( corner, "y" ) === frontColor ) {
			this.move( "Bi Ri B R" );
		} else {
			this.move( "Ri B B R Bi Bi D Bi Di" );
		}
	}

	secondLayer() {
		const right = this.cube.centerColor( "R" );
		const left = this.cube.centerColor( "L" );
		const up = this.cube.centerColor( "U" );
		const down = this.cube.centerColor( "D" );
		const edges = [
			this.cube.findPiece( left, down ),
			this.cube.findPiece( right, down ),
			this.cube.findPiece( right, up ),
			this.cube.findPiece( left, up )
		];

		for ( const edge of edges ) {
			this.placeMiddleLeftDownEdge(
				edge, this.cube.centerColor( "L" ), this.cube.centerColor( "D" )
			);
			this.move( "Z" );
		}
	}

	placeMiddleLeftDownEdge(
		edge,
		leftColor,
		downColor
	) {
		if ( edge.position.z === 0 ) {
			let rotations = 0;

			while ( ( edge.position.x !== -1 || edge.position.y !== -1 ) && rotations < 4 ) {
				this.move( "Z" );
				rotations += 1;
			}

			this.move( "B L Bi Li Bi Di B D" );

			for ( let index = 0; index < rotations; index += 1 ) {
				this.move( "Zi" );
			}
		}

		assertState( edge.position.z === -1, "Middle edge did not reach the back layer" );

		if ( colorOnAxis( edge, "z" ) === leftColor ) {
			this.loopUntil(
				() => edge.position.y === -1, "B", "Middle edge could not align with down"
			);
			this.move( "B L Bi Li Bi Di B D" );
		} else if ( colorOnAxis( edge, "z" ) === downColor ) {
			this.loopUntil(
				() => edge.position.x === -1, "B", "Middle edge could not align with left"
			);
			this.move( "Bi Di B D B L Bi Li" );
		} else {
			throw new Error( "Middle edge has an invalid orientation" );
		}
	}

	backFaceEdges() {
		this.move( "X X" );
		const frontColor = () => this.cube.centerColor( "F" );
		const isFront = ( vector ) => colorOnAxis( this.cube.getPiece( vector ), "z" ) === frontColor();
		const up = addVectors( FACE_VECTORS.U, FACE_VECTORS.F );
		const left = addVectors( FACE_VECTORS.L, FACE_VECTORS.F );
		const down = addVectors( FACE_VECTORS.D, FACE_VECTORS.F );
		const right = addVectors( FACE_VECTORS.R, FACE_VECTORS.F );
		const solved = () => [ up, left, down, right ].every( isFront );
		const elbow = () => isFront( up ) && isFront( left );
		const line = () => isFront( left ) && isFront( right );
		const dot = () => [ up, left, down, right ].every( ( vector ) => !isFront( vector ) );

		for ( let count = 0; !solved() && count < this.maxIterations; count += 1 ) {
			if ( dot() || elbow() ) {
				this.move( "D F R Fi Ri Di" );
			} else if ( line() ) {
				this.move( "D R F Ri Fi Di" );
			} else {
				this.move( "F" );
			}
		}

		assertState( solved(), "Last-layer cross could not be formed" );
		this.move( "Xi Xi" );
	}

	lastLayerCornersPosition() {
		this.move( "X X" );
		const swap12 = "Li Fi L D F Di Li F L F F ";
		const swap13 = "F Li Fi L D F Di Li F L F ";
		const front = this.cube.centerColor( "F" );
		const right = this.cube.centerColor( "R" );
		const left = this.cube.centerColor( "L" );
		const up = this.cube.centerColor( "U" );
		const down = this.cube.centerColor( "D" );
		const corner1 = this.cube.findPiece(
			front, right, down
		);
		const corner2 = this.cube.findPiece(
			front, left, down
		);
		const corner3 = this.cube.findPiece(
			front, right, up
		);
		const corner4 = this.cube.findPiece(
			front, left, up
		);

		if ( sameVector( corner4.position, {
			x: 1, y: -1, z: 1
		} ) ) {
			this.move( `${swap12} Zi ${swap12} Z` );
		} else if ( sameVector( corner4.position, {
			x: 1, y: 1, z: 1
		} ) ) {
			this.move( `Z ${swap13} Zi` );
		} else if ( sameVector( corner4.position, {
			x: -1, y: -1, z: 1
		} ) ) {
			this.move( `Zi ${swap12} Z` );
		}

		assertState( sameVector( corner4.position, {
			x: -1, y: 1, z: 1
		} ), "Last-layer corner 4 could not be positioned" );

		if ( sameVector( corner2.position, {
			x: 1, y: 1, z: 1
		} ) ) {
			this.move( `${swap13} ${swap12}` );
		} else if ( sameVector( corner2.position, {
			x: 1, y: -1, z: 1
		} ) ) {
			this.move( swap12 );
		}

		if ( sameVector( corner3.position, {
			x: 1, y: -1, z: 1
		} ) ) {
			this.move( swap13 );
		}

		assertState( sameVector( corner1.position, {
			x: 1, y: -1, z: 1
		} ), "Last-layer corners could not be positioned" );
		this.move( "Xi Xi" );
	}

	lastLayerCornersOrientation() {
		this.move( "X X" );
		const frontColor = () => this.cube.centerColor( "F" );
		const piece = ( x,
			y ) => this.cube.getPiece( {
			x, y, z: 1
		} );
		const states = [
			() => colorOnAxis( piece( 1, 1 ), "y" ) === frontColor() && colorOnAxis( piece( -1, -1 ), "y" ) === frontColor() && colorOnAxis( piece( 1, -1 ), "x" ) === frontColor(),
			() => colorOnAxis( piece( -1, 1 ), "y" ) === frontColor() && colorOnAxis( piece( 1, 1 ), "x" ) === frontColor() && colorOnAxis( piece( 1, -1 ), "y" ) === frontColor(),
			() => colorOnAxis( piece( -1, -1 ), "y" ) === frontColor() && colorOnAxis( piece( 1, -1 ), "y" ) === frontColor() && colorOnAxis( piece( -1, 1 ), "z" ) === frontColor() && colorOnAxis( piece( 1, 1 ), "z" ) === frontColor(),
			() => colorOnAxis( piece( -1, 1 ), "y" ) === frontColor() && colorOnAxis( piece( -1, -1 ), "y" ) === frontColor() && colorOnAxis( piece( 1, 1 ), "z" ) === frontColor() && colorOnAxis( piece( 1, -1 ), "z" ) === frontColor(),
			() => colorOnAxis( piece( -1, 1 ), "y" ) === frontColor() && colorOnAxis( piece( 1, -1 ), "x" ) === frontColor(),
			() => colorOnAxis( piece( 1, 1 ), "y" ) === frontColor() && colorOnAxis( piece( 1, -1 ), "y" ) === frontColor() && colorOnAxis( piece( -1, -1 ), "x" ) === frontColor() && colorOnAxis( piece( -1, 1 ), "x" ) === frontColor(),
			() => [ piece( 1, 1 ), piece( 1, -1 ), piece( -1, -1 ), piece( -1, 1 ) ].every( ( corner ) => colorOnAxis( corner, "x" ) === frontColor() ),
			() => [ piece( 1, 1 ), piece( 1, -1 ), piece( -1, -1 ), piece( -1, 1 ) ].every( ( corner ) => colorOnAxis( corner, "z" ) === frontColor() )
		];
		const algorithm1 = "Ri Fi R Fi Ri F F R F F";
		const algorithm2 = "R F Ri F R F F Ri F F";

		for ( let count = 0; !states[ 7 ]() && count < this.maxIterations; count += 1 ) {
			if ( states[ 0 ]() ) {
				this.move( algorithm1 );
			} else if ( states[ 1 ]() ) {
				this.move( algorithm2 );
			} else if ( states[ 2 ]() ) {
				this.move( `${algorithm2} F F ${algorithm1}` );
			} else if ( states[ 3 ]() ) {
				this.move( `${algorithm2} ${algorithm1}` );
			} else if ( states[ 4 ]() ) {
				this.move( `${algorithm1} F ${algorithm2}` );
			} else if ( states[ 5 ]() ) {
				this.move( `${algorithm1} Fi ${algorithm1}` );
			} else if ( states[ 6 ]() ) {
				this.move( `${algorithm1} F F ${algorithm1}` );
			} else {
				this.move( "F" );
			}
		}

		assertState( states[ 7 ](), "Last-layer corners could not be oriented" );
		const backRightUp = this.cube.findPiece(
			this.cube.centerColor( "F" ),
			this.cube.centerColor( "R" ),
			this.cube.centerColor( "U" )
		);
		this.loopUntil(
			() => sameVector( backRightUp.position, {
				x: 1, y: 1, z: 1
			} ),
			"F",
			"Last-layer corners could not be aligned"
		);
		this.move( "Xi Xi" );
	}

	lastLayerEdges() {
		this.move( "X X" );
		const front = this.cube.centerColor( "F" );
		const right = this.cube.centerColor( "R" );
		const left = this.cube.centerColor( "L" );
		const up = this.cube.centerColor( "U" );
		const down = this.cube.centerColor( "D" );
		const edges = {
			down:  this.cube.findPiece( front, down ),
			left:  this.cube.findPiece( front, left ),
			right: this.cube.findPiece( front, right ),
			up:    this.cube.findPiece( front, up )
		};
		const cycle = "R R F D Ui R R Di U F R R";
		const hPattern = "Ri S Ri Ri S S Ri Fi Fi R Si Si Ri Ri Si R Fi Fi";
		const fish = `Di Li ${hPattern} L D`;
		const state1 = () => Object.values( edges ).every( ( edge ) => colorOnAxis( edge, "z" ) !== this.cube.centerColor( "F" ) );
		const state2 = () => Object.values( edges ).some( ( edge ) => colorOnAxis( edge, "z" ) === this.cube.centerColor( "F" ) );

		if ( state1() ) {
			this.handleLastLayerState1( hPattern );
		}

		if ( state2() ) {
			this.handleLastLayerState2( cycle );
		}

		const hPattern1 = () => colorOnAxis( this.cube.getPiece( addVectors( FACE_VECTORS.L, FACE_VECTORS.F ) ), "x" ) !== this.cube.centerColor( "L" ) &&
			colorOnAxis( this.cube.getPiece( addVectors( FACE_VECTORS.R, FACE_VECTORS.F ) ), "x" ) !== this.cube.centerColor( "R" ) &&
			colorOnAxis( this.cube.getPiece( addVectors( FACE_VECTORS.D, FACE_VECTORS.F ) ), "y" ) === this.cube.centerColor( "D" ) &&
			colorOnAxis( this.cube.getPiece( addVectors( FACE_VECTORS.U, FACE_VECTORS.F ) ), "y" ) === this.cube.centerColor( "U" );
		const hPattern2 = () => colorOnAxis( this.cube.getPiece( addVectors( FACE_VECTORS.L, FACE_VECTORS.F ) ), "x" ) === this.cube.centerColor( "L" ) &&
			colorOnAxis( this.cube.getPiece( addVectors( FACE_VECTORS.R, FACE_VECTORS.F ) ), "x" ) === this.cube.centerColor( "R" ) &&
			colorOnAxis( this.cube.getPiece( addVectors( FACE_VECTORS.D, FACE_VECTORS.F ) ), "y" ) === this.cube.centerColor( "F" ) &&
			colorOnAxis( this.cube.getPiece( addVectors( FACE_VECTORS.U, FACE_VECTORS.F ) ), "y" ) === this.cube.centerColor( "F" );
		const fishPattern = () => colorOnAxis( this.cube.getPiece( addVectors( FACE_VECTORS.F, FACE_VECTORS.D ) ), "z" ) === this.cube.centerColor( "D" ) &&
			colorOnAxis( this.cube.getPiece( addVectors( FACE_VECTORS.F, FACE_VECTORS.R ) ), "z" ) === this.cube.centerColor( "R" ) &&
			colorOnAxis( this.cube.getPiece( addVectors( FACE_VECTORS.F, FACE_VECTORS.D ) ), "y" ) === this.cube.centerColor( "F" ) &&
			colorOnAxis( this.cube.getPiece( addVectors( FACE_VECTORS.F, FACE_VECTORS.R ) ), "x" ) === this.cube.centerColor( "F" );

		for ( let count = 0; !this.cube.isSolved() && count < this.maxIterations; count += 1 ) {
			for ( let rotation = 0; rotation < 4; rotation += 1 ) {
				if ( fishPattern() ) {
					this.move( fish );

					if ( this.cube.isSolved() ) {
						return;
					}
				} else {
					this.move( "Z" );
				}
			}

			if ( hPattern1() ) {
				this.move( hPattern );
			} else if ( hPattern2() ) {
				this.move( `Z ${hPattern} Zi` );
			} else {
				this.move( cycle );
			}
		}

		assertState( this.cube.isSolved(), "Last-layer edges could not be solved" );
		this.move( "Xi Xi" );
	}

	handleLastLayerState1( hPattern ) {
		const leftFront = addVectors( FACE_VECTORS.L, FACE_VECTORS.F );
		let count = 0;

		while ( colorOnAxis( this.cube.getPiece( leftFront ), "z" ) !== this.cube.centerColor( "L" ) && count < 4 ) {
			this.move( "F" );
			count += 1;
		}

		assertState( count < 4, "Last-layer state 1 could not be aligned" );
		this.move( hPattern );

		for ( let index = 0; index < count; index += 1 ) {
			this.move( "Fi" );
		}
	}

	handleLastLayerState2( cycle ) {
		const positions = [
			[ addVectors( FACE_VECTORS.L, FACE_VECTORS.F ), "L", "x" ],
			[ addVectors( FACE_VECTORS.R, FACE_VECTORS.F ), "R", "x" ],
			[ addVectors( FACE_VECTORS.U, FACE_VECTORS.F ), "U", "y" ],
			[ addVectors( FACE_VECTORS.D, FACE_VECTORS.F ), "D", "y" ]
		];
		let correctEdge = null;

		for ( let count = 0; !correctEdge && count < this.maxIterations; count += 1 ) {
			correctEdge = positions
				.map( ( [ vector, face, axis ] ) => ( {
					axis,
					face,
					piece: this.cube.getPiece( vector )
				} ) )
				.find( ( entry ) => colorOnAxis( entry.piece, "z" ) === this.cube.centerColor( "F" ) &&
					colorOnAxis( entry.piece, entry.axis ) === this.cube.centerColor( entry.face ) );

			if ( !correctEdge ) {
				this.move( cycle );

				if ( count % 3 === 2 ) {
					this.move( "Z" );
				}
			}
		}

		assertState( correctEdge, "Last-layer state 2 has no correct edge" );
		this.loopUntil(
			() => sameVector( correctEdge.piece.position, addVectors( FACE_VECTORS.L, FACE_VECTORS.F ) ),
			"Z",
			"Correct last-layer edge could not be aligned"
		);
	}
}
