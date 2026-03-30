<template>
<div
	ref="containerRef"
	class="einsteinHatFill"
	:style="rootStyle"
>
	<svg
		:aria-label
		class="scene"
		preserveAspectRatio="none"
		role="img"
		:viewBox="`0 0 ${viewport.width} ${viewport.height}`"
		xmlns="http://www.w3.org/2000/svg"
	>
		<polygon
			v-for="( tile, index ) in renderedTiles"
			:key="`${tile.label}-${index}`"
			:fill="COLOR_MAP[ tile.label ] ?? FALLBACK_FILL"
			:fill-opacity
			:points="tile.points"
			:stroke="strokeColor"
			stroke-linejoin="round"
			:stroke-opacity
			:stroke-width
		/>
	</svg>
</div>
</template>

<script setup>
import {
	computed, onBeforeUnmount, onMounted, ref, watch
} from "vue";

const COLOR_MAP = Object.freeze( {
	H1: "var(--hat-fill-color-h1)",
	H:  "var(--hat-fill-color-h)",
	T:  "var(--hat-fill-color-t)",
	P:  "var(--hat-fill-color-p)",
	F:  "var(--hat-fill-color-f)"
} );

const FALLBACK_FILL = "var(--hat-fill-color-fallback)";
const SQRT3 = Math.sqrt( 3 );
const HALF_SQRT3 = SQRT3 / 2;
const IDENTITY = [ 1, 0, 0, 0, 1, 0 ];
const MIN_DIMENSION = 1;
const RESIZE_DEBOUNCE_MS = 200;
const SIZE_EPSILON_PX = 0.5;

const props = defineProps( {
	ariaLabel: {
		type:    String,
		default: "Einstein-Hut-Kachelung"
	},
	background: {
		type:    String,
		default: ""
	},
	height: {
		type:    [ Number, String ],
		default: ""
	},
	generationSteps: {
		type:    Number,
		default: 3
	},
	instantFill: {
		type:    Boolean,
		default: false
	},
	stepDelayMs: {
		type:    Number,
		default: 500
	},
	strokeColor: {
		type:    String,
		default: "var(--hat-fill-stroke)"
	},
	strokeOpacity: {
		type:    Number,
		default: 1
	},
	strokeWidth: {
		type:    Number,
		default: 1.1
	},
	fillOpacity: {
		type:    Number,
		default: 1
	},
	worldScale: {
		type:    Number,
		default: 24
	}
} );

const containerRef = ref( null );
const renderedTiles = ref( [] );
const hasFixedHeight = computed( () => props.height !== null &&
	props.height !== undefined &&
	String( props.height ).trim() !== "" );
const cssHeight = computed( () => {
	if ( !hasFixedHeight.value ) {
		return "";
	}

	return typeof props.height === "number" ?
		`${props.height}px` :
		String( props.height );
} );
const rootStyle = computed( () => {
	const style = {};

	if ( props.background ) {
		style[ "--hat-fill-background-override" ] = props.background;
	}

	if ( hasFixedHeight.value ) {
		style.height = cssHeight.value;
		style.minHeight = cssHeight.value;
	}

	return style;
} );
const viewport = ref( {
	height: 1,
	width:  1
} );
const lockedViewportHeight = ref( null );

let animationTimer = null;
let resizeHandle = null;
let resizeObserver = null;

function pt( x, y ) {
	return { x, y };
}

function hexPt( x, y ) {
	return pt( x + 0.5 * y, HALF_SQRT3 * y );
}

function add( a, b ) {
	return pt( a.x + b.x, a.y + b.y );
}

function sub( a, b ) {
	return pt( a.x - b.x, a.y - b.y );
}

function transformPoint( matrix, point ) {
	return pt( matrix[ 0 ] * point.x + matrix[ 1 ] * point.y + matrix[ 2 ],
		matrix[ 3 ] * point.x + matrix[ 4 ] * point.y + matrix[ 5 ] );
}

function multiply( matrixA, matrixB ) {
	return [
		matrixA[ 0 ] * matrixB[ 0 ] + matrixA[ 1 ] * matrixB[ 3 ],
		matrixA[ 0 ] * matrixB[ 1 ] + matrixA[ 1 ] * matrixB[ 4 ],
		matrixA[ 0 ] * matrixB[ 2 ] + matrixA[ 1 ] * matrixB[ 5 ] + matrixA[ 2 ],
		matrixA[ 3 ] * matrixB[ 0 ] + matrixA[ 4 ] * matrixB[ 3 ],
		matrixA[ 3 ] * matrixB[ 1 ] + matrixA[ 4 ] * matrixB[ 4 ],
		matrixA[ 3 ] * matrixB[ 2 ] + matrixA[ 4 ] * matrixB[ 5 ] + matrixA[ 5 ]
	];
}

function invert( matrix ) {
	const determinant = matrix[ 0 ] * matrix[ 4 ] - matrix[ 1 ] * matrix[ 3 ];

	return [
		matrix[ 4 ] / determinant,
		-matrix[ 1 ] / determinant,
		( matrix[ 1 ] * matrix[ 5 ] - matrix[ 2 ] * matrix[ 4 ] ) / determinant,
		-matrix[ 3 ] / determinant,
		matrix[ 0 ] / determinant,
		( matrix[ 2 ] * matrix[ 3 ] - matrix[ 0 ] * matrix[ 5 ] ) / determinant
	];
}

function rotation( angle ) {
	const cos = Math.cos( angle );
	const sin = Math.sin( angle );

	return [ cos, -sin, 0, sin, cos, 0 ];
}

function translation( tx, ty ) {
	return [ 1, 0, tx, 0, 1, ty ];
}

function rotateAbout( point, angle ) {
	return multiply( translation( point.x, point.y ),
		multiply( rotation( angle ), translation( -point.x, -point.y ) ) );
}

function matchSegment( pointA, pointB ) {
	return [
		pointB.x - pointA.x,
		pointA.y - pointB.y,
		pointA.x,
		pointB.y - pointA.y,
		pointB.x - pointA.x,
		pointA.y
	];
}

function matchTwo(
	pointA1, pointB1, pointA2, pointB2
) {
	return multiply( matchSegment( pointA2, pointB2 ),
		invert( matchSegment( pointA1, pointB1 ) ) );
}

function intersect(
	pointA1, pointB1, pointA2, pointB2
) {
	const denominator =
		( pointB2.y - pointA2.y ) * ( pointB1.x - pointA1.x ) -
		( pointB2.x - pointA2.x ) * ( pointB1.y - pointA1.y );
	const uA =
		( ( pointB2.x - pointA2.x ) * ( pointA1.y - pointA2.y ) -
			( pointB2.y - pointA2.y ) * ( pointA1.x - pointA2.x ) ) /
		denominator;

	return pt( pointA1.x + uA * ( pointB1.x - pointA1.x ),
		pointA1.y + uA * ( pointB1.y - pointA1.y ) );
}

const HAT_OUTLINE = [
	hexPt( 0, 0 ),
	hexPt( -1, -1 ),
	hexPt( 0, -2 ),
	hexPt( 2, -2 ),
	hexPt( 2, -1 ),
	hexPt( 4, -2 ),
	hexPt( 5, -1 ),
	hexPt( 4, 0 ),
	hexPt( 3, 0 ),
	hexPt( 2, 2 ),
	hexPt( 0, 3 ),
	hexPt( 0, 2 ),
	hexPt( -1, 2 )
];

class HatTile {
	constructor( label ) {
		this.label = label;
		this.shape = HAT_OUTLINE;
	}
}

class MetaTile {
	constructor( shape, width ) {
		this.shape = shape;
		this.width = width;
		this.children = [];
	}

	addChild( matrix, geom ) {
		this.children.push( {
			T: matrix,
			geom
		} );
	}

	evalChild( index, vertexIndex ) {
		const child = this.children[ index ];

		return transformPoint( child.T, child.geom.shape[ vertexIndex ] );
	}

	recentre() {
		let cx = 0;
		let cy = 0;

		for ( const point of this.shape ) {
			cx += point.x;
			cy += point.y;
		}

		cx /= this.shape.length;
		cy /= this.shape.length;
		this.shape = this.shape.map( ( point ) => pt( point.x - cx, point.y - cy ) );

		const move = translation( -cx, -cy );

		for ( const child of this.children ) {
			child.T = multiply( move, child.T );
		}
	}
}

const H1_HAT = new HatTile( "H1" );
const H_HAT = new HatTile( "H" );
const T_HAT = new HatTile( "T" );
const P_HAT = new HatTile( "P" );
const F_HAT = new HatTile( "F" );

function buildInitialTiles() {
	const hOutline = [
		pt( 0, 0 ),
		pt( 4, 0 ),
		pt( 4.5, HALF_SQRT3 ),
		pt( 2.5, 5 * HALF_SQRT3 ),
		pt( 1.5, 5 * HALF_SQRT3 ),
		pt( -0.5, HALF_SQRT3 )
	];
	const h = new MetaTile( hOutline, 2 );
	h.addChild( matchTwo(
		HAT_OUTLINE[ 5 ], HAT_OUTLINE[ 7 ], hOutline[ 5 ], hOutline[ 0 ]
	),
	H_HAT );
	h.addChild( matchTwo(
		HAT_OUTLINE[ 9 ], HAT_OUTLINE[ 11 ], hOutline[ 1 ], hOutline[ 2 ]
	),
	H_HAT );
	h.addChild( matchTwo(
		HAT_OUTLINE[ 5 ], HAT_OUTLINE[ 7 ], hOutline[ 3 ], hOutline[ 4 ]
	),
	H_HAT );
	h.addChild( multiply( translation( 2.5, HALF_SQRT3 ),
		multiply( [ -0.5, -HALF_SQRT3, 0, HALF_SQRT3, -0.5, 0 ],
			[ 0.5, 0, 0, 0, -0.5, 0 ] ) ),
	H1_HAT );

	const tOutline = [ pt( 0, 0 ), pt( 3, 0 ), pt( 1.5, 3 * HALF_SQRT3 ) ];
	const t = new MetaTile( tOutline, 2 );
	t.addChild( [ 0.5, 0, 0.5, 0, 0.5, HALF_SQRT3 ], T_HAT );

	const pOutline = [
		pt( 0, 0 ),
		pt( 4, 0 ),
		pt( 3, 2 * HALF_SQRT3 ),
		pt( -1, 2 * HALF_SQRT3 )
	];
	const p = new MetaTile( pOutline, 2 );
	p.addChild( [ 0.5, 0, 1.5, 0, 0.5, HALF_SQRT3 ], P_HAT );
	p.addChild( multiply( translation( 0, 2 * HALF_SQRT3 ),
		multiply( [ 0.5, HALF_SQRT3, 0, -HALF_SQRT3, 0.5, 0 ],
			[ 0.5, 0, 0, 0, 0.5, 0 ] ) ),
	P_HAT );

	const fOutline = [
		pt( 0, 0 ),
		pt( 3, 0 ),
		pt( 3.5, HALF_SQRT3 ),
		pt( 3, 2 * HALF_SQRT3 ),
		pt( -1, 2 * HALF_SQRT3 )
	];
	const f = new MetaTile( fOutline, 2 );
	f.addChild( [ 0.5, 0, 1.5, 0, 0.5, HALF_SQRT3 ], F_HAT );
	f.addChild( multiply( translation( 0, 2 * HALF_SQRT3 ),
		multiply( [ 0.5, HALF_SQRT3, 0, -HALF_SQRT3, 0.5, 0 ],
			[ 0.5, 0, 0, 0, 0.5, 0 ] ) ),
	F_HAT );

	return [ h, t, p, f ];
}

function constructPatch(
	h, t, p, f
) {
	const rules = [
		[ "H" ],
		[ 0, 0, "P", 2 ],
		[ 1, 0, "H", 2 ],
		[ 2, 0, "P", 2 ],
		[ 3, 0, "H", 2 ],
		[ 4, 4, "P", 2 ],
		[ 0, 4, "F", 3 ],
		[ 2, 4, "F", 3 ],
		[ 4, 1, 3, 2, "F", 0 ],
		[ 8, 3, "H", 0 ],
		[ 9, 2, "P", 0 ],
		[ 10, 2, "H", 0 ],
		[ 11, 4, "P", 2 ],
		[ 12, 0, "H", 2 ],
		[ 13, 0, "F", 3 ],
		[ 14, 2, "F", 1 ],
		[ 15, 3, "H", 4 ],
		[ 8, 2, "F", 1 ],
		[ 17, 3, "H", 0 ],
		[ 18, 2, "P", 0 ],
		[ 19, 2, "H", 2 ],
		[ 20, 4, "F", 3 ],
		[ 20, 0, "P", 2 ],
		[ 22, 0, "H", 2 ],
		[ 23, 4, "F", 3 ],
		[ 23, 0, "F", 3 ],
		[ 16, 0, "P", 2 ],
		[ 9, 4, 0, 2, "T", 2 ],
		[ 4, 0, "F", 3 ]
	];
	const patch = new MetaTile( [], h.width );
	const shapes = {
		H: h,
		T: t,
		P: p,
		F: f
	};

	for ( const rule of rules ) {
		if ( rule.length === 1 ) {
			patch.addChild( IDENTITY, shapes[ rule[ 0 ] ] );
			continue;
		}

		if ( rule.length === 4 ) {
			const source = patch.children[ rule[ 0 ] ];
			const poly = source.geom.shape;
			const pointA = transformPoint( source.T, poly[ ( rule[ 1 ] + 1 ) % poly.length ] );
			const pointB = transformPoint( source.T, poly[ rule[ 1 ] ] );
			const targetShape = shapes[ rule[ 2 ] ];
			const targetPoly = targetShape.shape;

			patch.addChild( matchTwo(
				targetPoly[ rule[ 3 ] ],
				targetPoly[ ( rule[ 3 ] + 1 ) % targetPoly.length ],
				pointA,
				pointB
			),
			targetShape );
			continue;
		}

		const childA = patch.children[ rule[ 0 ] ];
		const childB = patch.children[ rule[ 2 ] ];
		const pointA = transformPoint( childB.T, childB.geom.shape[ rule[ 3 ] ] );
		const pointB = transformPoint( childA.T, childA.geom.shape[ rule[ 1 ] ] );
		const targetShape = shapes[ rule[ 4 ] ];
		const targetPoly = targetShape.shape;

		patch.addChild( matchTwo(
			targetPoly[ rule[ 5 ] ],
			targetPoly[ ( rule[ 5 ] + 1 ) % targetPoly.length ],
			pointA,
			pointB
		),
		targetShape );
	}

	return patch;
}

function constructMetatiles( patch ) {
	const bps1 = patch.evalChild( 8, 2 );
	const bps2 = patch.evalChild( 21, 2 );
	const rbps = transformPoint( rotateAbout( bps1, -2 * Math.PI / 3 ), bps2 );

	const p72 = patch.evalChild( 7, 2 );
	const p252 = patch.evalChild( 25, 2 );

	const llc = intersect(
		bps1, rbps, patch.evalChild( 6, 2 ), p72
	);
	let width = sub( patch.evalChild( 6, 2 ), llc );

	const newHOutline = [ llc, bps1 ];
	width = transformPoint( rotation( -Math.PI / 3 ), width );
	newHOutline.push( add( newHOutline[ 1 ], width ) );
	newHOutline.push( patch.evalChild( 14, 2 ) );
	width = transformPoint( rotation( -Math.PI / 3 ), width );
	newHOutline.push( sub( newHOutline[ 3 ], width ) );
	newHOutline.push( patch.evalChild( 6, 2 ) );

	const newH = new MetaTile( newHOutline, patch.width * 2 );

	for ( const index of [ 0, 9, 16, 27, 26, 6, 1, 8, 10, 15 ] ) {
		const child = patch.children[ index ];
		newH.addChild( child.T, child.geom );
	}

	const newPOutline = [ p72, add( p72, sub( bps1, llc ) ), bps1, llc ];
	const newP = new MetaTile( newPOutline, patch.width * 2 );

	for ( const index of [ 7, 2, 3, 4, 28 ] ) {
		const child = patch.children[ index ];
		newP.addChild( child.T, child.geom );
	}

	const newFOutline = [
		bps2,
		patch.evalChild( 24, 2 ),
		patch.evalChild( 25, 0 ),
		p252,
		add( p252, sub( llc, bps1 ) )
	];
	const newF = new MetaTile( newFOutline, patch.width * 2 );

	for ( const index of [ 21, 20, 22, 23, 24, 25 ] ) {
		const child = patch.children[ index ];
		newF.addChild( child.T, child.geom );
	}

	const pointA = newHOutline[ 2 ];
	const pointB = add( newHOutline[ 1 ], sub( newHOutline[ 4 ], newHOutline[ 5 ] ) );
	const pointC = transformPoint( rotateAbout( pointB, -Math.PI / 3 ), pointA );
	const newT = new MetaTile( [ pointB, pointC, pointA ], patch.width * 2 );
	newT.addChild( patch.children[ 11 ].T, patch.children[ 11 ].geom );

	newH.recentre();
	newP.recentre();
	newF.recentre();
	newT.recentre();

	return [ newH, newT, newP, newF ];
}

function flattenToHats(
	geom, matrix = IDENTITY, result = []
) {
	if ( geom instanceof HatTile ) {
		const poly = geom.shape.map( ( point ) => transformPoint( matrix, point ) );
		result.push( {
			label: geom.label,
			poly
		} );

		return result;
	}

	for ( const child of geom.children ) {
		flattenToHats(
			child.geom, multiply( matrix, child.T ), result
		);
	}

	return result;
}

function boundsOfPoly( poly ) {
	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;

	for ( const point of poly ) {
		if ( point.x < minX ) {
			minX = point.x;
		}

		if ( point.y < minY ) {
			minY = point.y;
		}

		if ( point.x > maxX ) {
			maxX = point.x;
		}

		if ( point.y > maxY ) {
			maxY = point.y;
		}
	}

	return {
		minX,
		minY,
		maxX,
		maxY
	};
}

function growBounds( bounds, extra ) {
	return {
		minX: bounds.minX - extra,
		minY: bounds.minY - extra,
		maxX: bounds.maxX + extra,
		maxY: bounds.maxY + extra
	};
}

function unionBounds( items ) {
	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;

	for ( const item of items ) {
		const bounds = item.bounds || boundsOfPoly( item.poly );

		if ( bounds.minX < minX ) {
			minX = bounds.minX;
		}

		if ( bounds.minY < minY ) {
			minY = bounds.minY;
		}

		if ( bounds.maxX > maxX ) {
			maxX = bounds.maxX;
		}

		if ( bounds.maxY > maxY ) {
			maxY = bounds.maxY;
		}
	}

	return {
		minX,
		minY,
		maxX,
		maxY
	};
}

function intersects( boundsA, boundsB ) {
	return !(
		boundsA.maxX < boundsB.minX ||
		boundsA.minX > boundsB.maxX ||
		boundsA.maxY < boundsB.minY ||
		boundsA.minY > boundsB.maxY
	);
}

function mapToScreen(
	poly, crop, scale
) {
	return poly.map( ( point ) =>
		pt( ( point.x - crop.minX ) * scale, ( point.y - crop.minY ) * scale ) );
}

function pointsToString( poly ) {
	return poly.map( ( point ) => `${point.x.toFixed( 2 )},${point.y.toFixed( 2 )}` ).join( " " );
}

function tileSortKey( tile ) {
	const bounds = tile.screenBounds;
	const safeX = Math.max( 0, bounds.minX );
	const safeY = Math.max( 0, bounds.minY );

	return ( safeX + safeY ) * 100000 + safeY * 100 + safeX;
}

function generateVisibleTiles(
	width, height, options
) {
	let tiles = buildInitialTiles();

	for ( let index = 0; index < options.generationSteps; index++ ) {
		const patch = constructPatch( ...tiles );
		tiles = constructMetatiles( patch );
	}

	const bigPatch = constructPatch( ...tiles );
	const allHats = flattenToHats( bigPatch );

	for ( const tile of allHats ) {
		tile.bounds = boundsOfPoly( tile.poly );
	}

	const globalBounds = unionBounds( allHats );
	const centerX = ( globalBounds.minX + globalBounds.maxX ) / 2;
	const centerY = ( globalBounds.minY + globalBounds.maxY ) / 2;

	const crop = {
		minX: centerX - width / ( 2 * options.worldScale ),
		minY: centerY - height / ( 2 * options.worldScale ),
		maxX: centerX + width / ( 2 * options.worldScale ),
		maxY: centerY + height / ( 2 * options.worldScale )
	};
	const paddedCrop = growBounds( crop, 3 );

	return allHats
		.filter( ( tile ) => intersects( tile.bounds, paddedCrop ) )
		.map( ( tile ) => {
			const screenPoly = mapToScreen(
				tile.poly, crop, options.worldScale
			);
			const screenBounds = boundsOfPoly( screenPoly );

			return {
				label:  tile.label,
				points: pointsToString( screenPoly ),
				screenBounds
			};
		} )
		.filter( ( tile ) =>
			tile.screenBounds.maxX >= 0 &&
			tile.screenBounds.minX <= width &&
			tile.screenBounds.maxY >= 0 &&
			tile.screenBounds.minY <= height )
		.sort( ( tileA, tileB ) => tileSortKey( tileA ) - tileSortKey( tileB ) );
}

function clampDimension( value ) {
	return Math.max( MIN_DIMENSION, value );
}

function safeGenerationSteps() {
	return Math.max( 0, Math.floor( props.generationSteps ) );
}

function safeStepDelayMs() {
	return Math.max( 1, Math.floor( props.stepDelayMs ) );
}

function safeWorldScale() {
	return Math.max( 0.1, props.worldScale );
}

function stopAnimation() {
	if ( animationTimer !== null ) {
		window.clearInterval( animationTimer );
		animationTimer = null;
	}
}

function stopResizeDebounce() {
	if ( resizeHandle !== null ) {
		window.clearTimeout( resizeHandle );
		resizeHandle = null;
	}
}

function updateViewport( width, height ) {
	const nextWidth = clampDimension( width );
	const nextHeight = clampDimension( height );
	const didChange =
		Math.abs( viewport.value.width - nextWidth ) > SIZE_EPSILON_PX ||
		Math.abs( viewport.value.height - nextHeight ) > SIZE_EPSILON_PX;

	if ( didChange ) {
		viewport.value = {
			height: nextHeight,
			width:  nextWidth
		};
	}

	return didChange;
}

function resolveViewportHeight( measuredHeight ) {
	if ( !hasFixedHeight.value ) {
		lockedViewportHeight.value = null;
		return measuredHeight;
	}

	if ( lockedViewportHeight.value === null ) {
		lockedViewportHeight.value = clampDimension( measuredHeight );
	}

	return lockedViewportHeight.value;
}

function readViewportFromContainer() {
	const el = containerRef.value;

	if ( !el ) {
		return false;
	}

	const rect = el.getBoundingClientRect();

	return updateViewport( rect.width,
		resolveViewportHeight( rect.height ) );
}

function restartAnimation() {
	stopAnimation();
	renderedTiles.value = [];

	const tiles = generateVisibleTiles(
		viewport.value.width,
		viewport.value.height,
		{
			generationSteps: safeGenerationSteps(),
			worldScale:      safeWorldScale()
		}
	);

	if ( !tiles.length ) {
		return;
	}

	if ( props.instantFill ) {
		renderedTiles.value = tiles;
		return;
	}

	let index = 0;

	const appendNextTile = () => {
		const nextTile = tiles[ index ];

		if ( !nextTile ) {
			return;
		}

		renderedTiles.value.push( nextTile );
		index++;
	};

	appendNextTile();

	if ( index >= tiles.length ) {
		return;
	}

	animationTimer = window.setInterval( () => {
		appendNextTile();

		if ( index >= tiles.length ) {
			stopAnimation();
		}
	}, safeStepDelayMs() );
}

function scheduleRestart() {
	if ( props.instantFill ) {
		readViewportFromContainer();
		restartAnimation();
		return;
	}

	stopResizeDebounce();
	resizeHandle = window.setTimeout( () => {
		resizeHandle = null;
		readViewportFromContainer();
		restartAnimation();
	}, RESIZE_DEBOUNCE_MS );
}

watch( () => [
	props.generationSteps,
	props.height,
	props.instantFill,
	props.stepDelayMs,
	props.worldScale
],
() => {
	if ( containerRef.value ) {
		lockedViewportHeight.value = null;
		readViewportFromContainer();
		restartAnimation();
	}
} );

onMounted( () => {
	readViewportFromContainer();
	restartAnimation();

	resizeObserver = new ResizeObserver( ( entries ) => {
		const entry = entries[ 0 ];

		if ( !entry ) {
			return;
		}

		if ( updateViewport( entry.contentRect.width,
			resolveViewportHeight( entry.contentRect.height ) ) ) {
			scheduleRestart();
		}
	} );

	if ( containerRef.value ) {
		resizeObserver.observe( containerRef.value );
	}
} );

onBeforeUnmount( () => {
	stopAnimation();
	stopResizeDebounce();
	resizeObserver?.disconnect();
} );
</script>

<style scoped>
.einsteinHatFill {
	--hat-fill-background: var(--theme-hat-fill-background, rgba(245, 247, 251, 0.68));
	--hat-fill-stroke: var(--theme-hat-fill-stroke, rgba(15, 23, 42, 0.72));
	--hat-fill-color-h1: var(--theme-hat-fill-color-h1, rgba(2, 132, 199, 0.86));
	--hat-fill-color-h: var(--theme-hat-fill-color-h, rgba(125, 211, 252, 0.82));
	--hat-fill-color-t: var(--theme-hat-fill-color-t, rgba(245, 158, 11, 0.72));
	--hat-fill-color-p: var(--theme-hat-fill-color-p, rgba(249, 115, 22, 0.72));
	--hat-fill-color-f: var(--theme-hat-fill-color-f, rgba(132, 204, 22, 0.7));
	--hat-fill-color-fallback: var(--theme-hat-fill-color-fallback, rgba(148, 163, 184, 0.65));
	width: 100%;
	height: 100%;
	min-height: 24rem;
	overflow: hidden;
	background: var(--hat-fill-background-override, var(--hat-fill-background));
}

.scene {
	display: block;
	width: 100%;
	height: 100%;
	background: var(--hat-fill-background-override, var(--hat-fill-background));
}
</style>
