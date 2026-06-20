import { BeginnerMethodSolver } from "./RC_BeginnerMethodSolver.mjs";
import { CFOPMethodSolver } from "./RC_CFOPMethodSolver.mjs";
import { RouxMethodSolver } from "./RC_RouxMethodSolver.mjs";
import { ThistlethwaiteSolver } from "./RC_ThistlethwaiteSolver.mjs";

export class HistorySolver {
	static id = "history";

	solve( { history } ) {
		return {
			phases: [ {
				id:    "history",
				moves: history.slice()
					.reverse()
					.map( ( move ) => ( {
						...move,
						direction: -move.direction
					} ) )
			} ]
		};
	}
}

const solverTypes = new Map();

export function registerCubeSolver( SolverType ) {
	const id = String( SolverType?.id ?? "" ).trim();

	if ( !id || typeof SolverType.prototype?.solve !== "function" ) {
		throw new TypeError( "A cube solver needs a static id and a solve(context) method" );
	}

	solverTypes.set( id, SolverType );
}

export function createCubeSolver( id ) {
	const SolverType = solverTypes.get( id );

	if ( !SolverType ) {
		throw new Error( `Unknown Rubik's Cube solver: ${id}` );
	}

	return new SolverType();
}

export function isCubeSolved( cubies ) {
	const centers = cubies.filter( ( cubie ) => cubie.stickers.length === 1 );

	return centers.every( ( center ) => {
		const centerSticker = center.stickers[ 0 ];
		const { normal } = centerSticker;
		const axis = normal.x !== 0 ? "x" : normal.y !== 0 ? "y" : "z";
		const layer = normal[ axis ];
		const faceStickers = cubies.flatMap( ( cubie ) => cubie.stickers )
			.filter( ( sticker ) => sticker.normal[ axis ] === layer );

		return faceStickers.length === 9 && faceStickers.every( ( sticker ) => sticker.color === centerSticker.color );
	} );
}

registerCubeSolver( HistorySolver );
registerCubeSolver( BeginnerMethodSolver );
registerCubeSolver( CFOPMethodSolver );
registerCubeSolver( RouxMethodSolver );
registerCubeSolver( ThistlethwaiteSolver );
