import solveWithCFOP from "rubiks-cube-solver";
import { convertNotationPhases } from "./RC_solverNotation.mjs";

const FACE_LAYOUTS = [
	{
		axis: "z", column: ( position ) => position.x, layer: 1, name: "f", row: ( position ) => -position.y
	},
	{
		axis: "x", column: ( position ) => -position.z, layer: 1, name: "r", row: ( position ) => -position.y
	},
	{
		axis: "y", column: ( position ) => position.x, layer: 1, name: "u", row: ( position ) => position.z
	},
	{
		axis: "y", column: ( position ) => position.x, layer: -1, name: "d", row: ( position ) => -position.z
	},
	{
		axis: "x", column: ( position ) => position.z, layer: -1, name: "l", row: ( position ) => -position.y
	},
	{
		axis: "z", column: ( position ) => -position.x, layer: -1, name: "b", row: ( position ) => -position.y
	}
];

export function cubiesToFaceletString( cubies ) {
	const colorNames = Object.fromEntries( FACE_LAYOUTS.map( ( face ) => {
		const center = cubies.find( ( cubie ) => cubie.position[ face.axis ] === face.layer &&
			cubie.stickers.length === 1 );
		return [ center.stickers[ 0 ].color, face.name ];
	} ) );

	return FACE_LAYOUTS.map( ( face ) => cubies
		.filter( ( cubie ) => cubie.position[ face.axis ] === face.layer )
		.sort( ( left, right ) => face.row( left.position ) - face.row( right.position ) ||
			face.column( left.position ) - face.column( right.position ) )
		.map( ( cubie ) => {
			const sticker = cubie.stickers.find( ( entry ) => entry.normal[ face.axis ] === face.layer );
			return colorNames[ sticker.color ];
		} )
		.join( "" ) )
		.join( "" );
}

export class CFOPMethodSolver {
	static id = "cfop";

	solve( { cubies } ) {
		const partitions = solveWithCFOP( cubiesToFaceletString( cubies ), { partitioned: true } );
		const phases = [
			{ id: "cross", moves: partitions.cross },
			{ id: "f2l", moves: partitions.f2l },
			{ id: "oll", moves: partitions.oll },
			{ id: "pll", moves: partitions.pll }
		];

		return { phases: convertNotationPhases( phases ) };
	}
}
