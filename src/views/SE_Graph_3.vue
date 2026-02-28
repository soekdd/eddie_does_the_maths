<template>
<div class="seGraphWrap">
	<svg
		aria-label="Fibonacci-Spirale mit Quadraten"
		class="seGraphSvg"
		role="img"
		:viewBox="`0 0 ${viewWidth} ${viewHeight}`"
		@click="reroll"
	>
		<g>
			<rect
				v-for="square in drawnSquares"
				:key="`sq-${square.id}`"
				:fill="square.fill"
				:height="square.size"
				:width="square.size"
				:x="square.x"
				:y="square.y"
			/>
		</g>

		<g>
			<text
				v-for="square in drawnSquares"
				:key="`txt-${square.id}`"
				:font-size="square.fontSize"
				:x="square.textX"
				:y="square.textY"
			>
				{{ square.value }}
			</text>
		</g>

		<path class="spiralPath" :d="spiralPathD"/>
	</svg>

	<div class="seGraphMeta mono">
		<div><b>n</b> = {{ n }} <b>Fibonacci</b> =<br>{{ fibLabel }}</div>
	</div>
	<p class="muted seGraphHint">Klick auf die Grafik</p>
</div>
</template>

<script setup>
import { computed, ref } from "vue";

const viewWidth = 640;
const viewHeight = 360;
const padding = 22;
const quarterTurn = Math.PI / 2;
const arcSteps = 18;

function randomN() {
	return 5 + Math.floor( Math.random() * 7 );
}

const n = ref( randomN() );

function reroll() {
	let nextN = randomN();

	while ( nextN === n.value ) {
		nextN = randomN();
	}

	n.value = nextN;
}

function fibonacci( count ) {
	if ( count <= 0 ) {
		return [];
	}

	if ( count === 1 ) {
		return [ 1 ];
	}

	const values = [ 1, 1 ];

	while ( values.length < count ) {
		const a = values[ values.length - 1 ];
		const b = values[ values.length - 2 ];
		values.push( a + b );
	}

	return values;
}

function buildSquares( fibValues ) {
	if ( fibValues.length === 0 ) {
		return [];
	}

	const squares = [
		{
			id:    0,
			x:     0,
			y:     0,
			size:  fibValues[ 0 ],
			value: fibValues[ 0 ]
		}
	];

	if ( fibValues.length === 1 ) {
		return squares;
	}

	squares.push( {
		id:    1,
		x:     fibValues[ 0 ],
		y:     0,
		size:  fibValues[ 1 ],
		value: fibValues[ 1 ]
	} );

	let minX = 0;
	let minY = 0;
	let maxX = fibValues[ 0 ] + fibValues[ 1 ];
	let maxY = Math.max( fibValues[ 0 ], fibValues[ 1 ] );
	const directions = [ "up", "left", "down", "right" ];

	for ( let i = 2; i < fibValues.length; i++ ) {
		const size = fibValues[ i ];
		const direction = directions[ ( i - 2 ) % directions.length ];
		let x = minX;
		let y = minY;

		if ( direction === "up" ) {
			y = minY - size;
		} else if ( direction === "left" ) {
			x = minX - size;
		} else if ( direction === "down" ) {
			y = maxY;
		} else {
			x = maxX;
		}

		squares.push( {
			id:    i,
			x,
			y,
			size,
			value: size
		} );

		minX = Math.min( minX, x );
		minY = Math.min( minY, y );
		maxX = Math.max( maxX, x + size );
		maxY = Math.max( maxY, y + size );
	}

	return squares;
}

function keyOfPoint( point ) {
	return `${point.x},${point.y}`;
}

function makeArcOptions( square ) {
	const x = square.x;
	const y = square.y;
	const s = square.size;

	const corners = {
		tl: { x, y },
		tr: { x: x + s, y },
		br: { x: x + s, y: y + s },
		bl: { x, y: y + s }
	};

	function option(
		centerName, startName, endName, startAngle, delta
	) {
		const center = corners[ centerName ];
		const start = corners[ startName ];
		const end = corners[ endName ];

		return {
			center,
			radius:   s,
			start,
			end,
			startKey: keyOfPoint( start ),
			endKey:   keyOfPoint( end ),
			startAngle,
			delta
		};
	}

	return [
		option(
			"tl", "tr", "bl", 0, quarterTurn
		),
		option(
			"tl", "bl", "tr", quarterTurn, -quarterTurn
		),
		option(
			"tr", "br", "tl", quarterTurn, quarterTurn
		),
		option(
			"tr", "tl", "br", Math.PI, -quarterTurn
		),
		option(
			"br", "bl", "tr", Math.PI, quarterTurn
		),
		option(
			"br", "tr", "bl", Math.PI + quarterTurn, -quarterTurn
		),
		option(
			"bl", "tl", "br", Math.PI + quarterTurn, quarterTurn
		),
		option(
			"bl", "br", "tl", 0, -quarterTurn
		)
	];
}

function buildArcChain( squares ) {
	const allOptions = squares.map( ( square ) => makeArcOptions( square ) );
	const chosen = new Array( squares.length );

	function tangentAt( arc, atEnd ) {
		const angle = atEnd ? arc.startAngle + arc.delta : arc.startAngle;
		const sign = arc.delta >= 0 ? 1 : -1;
		const x = sign * -Math.sin( angle );
		const y = sign * Math.cos( angle );
		const length = Math.hypot( x, y ) || 1;

		return {
			x: x / length,
			y: y / length
		};
	}

	function sameVector( a, b ) {
		if ( !a || !b ) {
			return false;
		}

		const eps = 1e-6;
		return Math.abs( a.x - b.x ) < eps && Math.abs( a.y - b.y ) < eps;
	}

	function dfs(
		index, expectedStartKey, expectedTangent
	) {
		if ( index >= allOptions.length ) {
			return true;
		}

		for ( const option of allOptions[ index ] ) {
			if ( index > 0 && option.startKey !== expectedStartKey ) {
				continue;
			}

			if ( index > 0 && !sameVector( tangentAt( option, false ), expectedTangent ) ) {
				continue;
			}

			chosen[ index ] = option;

			if ( dfs(
				index + 1, option.endKey, tangentAt( option, true )
			) ) {
				return true;
			}
		}

		return false;
	}

	for ( const firstOption of allOptions[ 0 ] ) {
		chosen[ 0 ] = firstOption;

		if ( dfs(
			1, firstOption.endKey, tangentAt( firstOption, true )
		) ) {
			return chosen;
		}
	}

	return allOptions.map( ( options ) => options[ 0 ] );
}

function buildSpiralPoints( arcChain ) {
	const points = [];

	arcChain.forEach( ( arc, arcIndex ) => {
		for ( let i = 0; i <= arcSteps; i++ ) {
			if ( arcIndex > 0 && i === 0 ) {
				continue;
			}

			const t = i / arcSteps;
			const angle = arc.startAngle + arc.delta * t;
			const px = arc.center.x + arc.radius * Math.cos( angle );
			const py = arc.center.y + arc.radius * Math.sin( angle );

			points.push( { x: px, y: py } );
		}
	} );

	return points;
}

function geometryBounds( squares ) {
	const minX = Math.min( ...squares.map( ( square ) => square.x ) );
	const minY = Math.min( ...squares.map( ( square ) => square.y ) );
	const maxX = Math.max( ...squares.map( ( square ) => square.x + square.size ) );
	const maxY = Math.max( ...squares.map( ( square ) => square.y + square.size ) );

	return {
		minX,
		minY,
		maxX,
		maxY,
		width:  maxX - minX,
		height: maxY - minY
	};
}

const orientationMatrices = [
	{ a: 1, b: 0, c: 0, d: 1 },
	{ a: 0, b: -1, c: 1, d: 0 },
	{ a: -1, b: 0, c: 0, d: -1 },
	{ a: 0, b: 1, c: -1, d: 0 },
	{ a: -1, b: 0, c: 0, d: 1 },
	{ a: 1, b: 0, c: 0, d: -1 },
	{ a: 0, b: 1, c: 1, d: 0 },
	{ a: 0, b: -1, c: -1, d: 0 }
];

function transformPoint( point, matrix ) {
	return {
		x: matrix.a * point.x + matrix.b * point.y,
		y: matrix.c * point.x + matrix.d * point.y
	};
}

function transformSquare( square, matrix ) {
	const corners = [
		{ x: square.x, y: square.y },
		{ x: square.x + square.size, y: square.y },
		{ x: square.x + square.size, y: square.y + square.size },
		{ x: square.x, y: square.y + square.size }
	].map( ( point ) => transformPoint( point, matrix ) );

	const minX = Math.min( ...corners.map( ( point ) => point.x ) );
	const minY = Math.min( ...corners.map( ( point ) => point.y ) );
	const maxX = Math.max( ...corners.map( ( point ) => point.x ) );

	return {
		...square,
		x: minX,
		y: minY,
		size: maxX - minX
	};
}

function orientGeometry( squares, points ) {
	function applyMatrix( matrix ) {
		const orientedSquares = squares.map( ( square ) => transformSquare( square, matrix ) );
		const orientedPoints = points.map( ( point ) => transformPoint( point, matrix ) );
		return {
			squares: orientedSquares,
			points:  orientedPoints
		};
	}

	function matchesGoal( candidate ) {
		const bounds = geometryBounds( candidate.squares );
		const largest = candidate.squares[ candidate.squares.length - 1 ];
		const secondLargest = candidate.squares[ candidate.squares.length - 2 ];
		const largestOnLeft = largest.x === bounds.minX;
		const secondOnTopRight =
			secondLargest.y === bounds.minY &&
			secondLargest.x + secondLargest.size === bounds.maxX;

		return {
			matches: largestOnLeft && secondOnTopRight,
			landscape: bounds.width >= bounds.height
		};
	}

	for ( const matrix of orientationMatrices ) {
		const candidate = applyMatrix( matrix );
		const status = matchesGoal( candidate );

		if ( status.matches && status.landscape ) {
			return candidate;
		}
	}

	for ( const matrix of orientationMatrices ) {
		const candidate = applyMatrix( matrix );
		const status = matchesGoal( candidate );

		if ( status.matches ) {
			return candidate;
		}
	}

	for ( const matrix of orientationMatrices ) {
		const candidate = applyMatrix( matrix );
		const bounds = geometryBounds( candidate.squares );

		if ( bounds.width >= bounds.height ) {
			return candidate;
		}
	}

	return {
		squares,
		points
	};
}

function squareFill( index ) {
	const hue = index * 37 % 360;
	return `hsla(${hue}, 80%, 62%, 0.22)`;
}

function fitToView( squares, points ) {
	const bounds = geometryBounds( squares );
	const drawWidth = Math.max( bounds.width, 1 );
	const drawHeight = Math.max( bounds.height, 1 );
	const scale = Math.min( ( viewWidth - 2 * padding ) / drawWidth,
		( viewHeight - 2 * padding ) / drawHeight );
	const offsetX = ( viewWidth - drawWidth * scale ) / 2;
	const offsetY = ( viewHeight - drawHeight * scale ) / 2;

	function mapPoint( point ) {
		return {
			x: ( point.x - bounds.minX ) * scale + offsetX,
			y: ( point.y - bounds.minY ) * scale + offsetY
		};
	}

	const drawnSquares = squares.map( ( square ) => {
		const x = ( square.x - bounds.minX ) * scale + offsetX;
		const y = ( square.y - bounds.minY ) * scale + offsetY;
		const size = square.size * scale;

		return {
			...square,
			x,
			y,
			size,
			fill:     squareFill( square.id ),
			textX:    x + size / 2,
			textY:    y + size / 2,
			fontSize: Math.max( 7, Math.min( 12, size * 0.26 ) )
		};
	} );

	const drawnPoints = points.map( mapPoint );
	const spiralPathD = drawnPoints.length === 0 ?
		"" :
		`M ${drawnPoints[ 0 ].x} ${drawnPoints[ 0 ].y} ${
			drawnPoints.slice( 1 ).map( ( point ) => `L ${point.x} ${point.y}` )
				.join( " " )
		}`;

	return {
		drawnSquares,
		spiralPathD
	};
}

const fibValues = computed( () => fibonacci( n.value ) );
const fibLabel = computed( () => fibValues.value.join( ", " ) );

const graph = computed( () => {
	const baseSquares = buildSquares( fibValues.value );
	const arcChain = buildArcChain( baseSquares );
	const spiralPoints = buildSpiralPoints( arcChain );
	const landscapeGeometry = orientGeometry( baseSquares, spiralPoints );

	return fitToView( landscapeGeometry.squares, landscapeGeometry.points );
} );

const drawnSquares = computed( () => graph.value.drawnSquares );
const spiralPathD = computed( () => graph.value.spiralPathD );
</script>

<style scoped>
.seGraphWrap {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.seGraphSvg {
	width: min(100%, 700px);
	height: auto;
	cursor: pointer;
	border: 1px solid rgba(var(--v-theme-on-surface), 0.2);
	border-radius: 14px;
	background: rgba(var(--v-theme-surface), 0.88);
}

.seGraphSvg rect {
	stroke: rgba(var(--v-theme-on-surface), 0.4);
	stroke-width: 1.1;
}

.seGraphSvg text {
	fill: rgba(var(--v-theme-on-surface), 0.9);
	font-family: "Fira Code", "Consolas", monospace;
	text-anchor: middle;
	dominant-baseline: central;
}

.spiralPath {
	fill: none;
	stroke: rgba(var(--v-theme-primary), 0.9);
	stroke-width: 2.2;
	stroke-linecap: round;
	stroke-linejoin: round;
}

.seGraphMeta {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	font-size: 0.95rem;
}

.seGraphHint {
	margin: 0;
	font-size: 0.9rem;
}
</style>
