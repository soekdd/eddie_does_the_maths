<template>
<v-card>
	<v-card-title class="d-flex flex-wrap align-center ga-3">
		<div>
			<div class="text-h6">{{ displayTitle }}</div>
			<div class="text-body-2 text-medium-emphasis">{{ displaySubtitle }}</div>
		</div>
	</v-card-title>

	<v-card-text>
		<p
			v-if="intro"
			class="text-body-1 text-medium-emphasis mb-4"
			v-html="intro"
		/>

		<v-sheet border class="graph-shell" rounded="xl">
			<div class="graph-stage" v-html="svgMarkup" />
		</v-sheet>
	</v-card-text>
</v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import rawMap from "./map85.svg?raw";

interface Point {
	x: number
	y: number
}

interface LabelOffset {
	dx: number
	dy: number
	anchor?: "start" | "middle" | "end"
}

interface MapPath {
	id: CountryId
	d: string
	centroid: Point
}

interface CurvedEdge {
	from: CountryId
	to: CountryId
	// Relative to the `from` node position.
	x1: number
	y1: number
	// Relative to the `to` node position.
	x2: number
	y2: number
}

type CountryId =
	| "AL"
	| "AT"
	| "BE"
	| "BG"
	| "CH"
	| "CS"
	| "DD"
	| "DE"
	| "DK"
	| "ES"
	| "FI"
	| "FR"
	| "GR"
	| "HU"
	| "IT"
	| "LU"
	| "NL"
	| "NO"
	| "PL"
	| "PT"
	| "RO"
	| "SE"
	| "SU"
	| "TR"
	| "YU"

const FOUR_COLOR_PALETTE = [
	"rgb(var(--v-theme-error))",
	"rgb(var(--v-theme-primary))",
	"rgb(var(--v-theme-warning))",
	"rgb(var(--v-theme-success))"
];
const EDGE_COLOR = "rgb(var(--v-theme-on-surface))";
const LABEL_COLOR = "rgb(var(--v-theme-on-surface))";
const NODE_STROKE_COLOR = "rgba(var(--v-theme-on-surface), 0.82)";
const COUNTRY_FILL_OPACITY = 0.5;
const COUNTRY_STROKE_OPACITY = 0.28;
const EDGE_STROKE_OPACITY = 0.7;

const props = withDefaults( defineProps<{
	intro?: string
	title?: string
	subtitle?: string
	width?: number
	height?: number
	nodeRadius?: number
}>(), {
	intro:      "",
	title:      "",
	subtitle:   "",
	width:      720,
	height:     720,
	nodeRadius: 5
} );

const adjacency: Record<CountryId, CountryId[]> = {
	NO: [ "SE", "FI", "SU" ],
	DE: [ "DK", "NL", "BE", "LU", "FR", "CH", "AT", "CS", "DD" ],
	PT: [ "ES" ],
	ES: [ "PT", "FR" ],
	BE: [ "NL", "DE", "LU", "FR" ],
	IT: [ "FR", "CH", "AT", "YU" ],
	GR: [ "AL", "YU", "BG", "TR" ],
	TR: [ "GR", "BG" ],
	LU: [ "BE", "DE", "FR" ],
	FR: [ "ES", "BE", "LU", "DE", "CH", "IT" ],
	NL: [ "BE", "DE" ],
	DK: [ "DE", "SE" ],
	PL: [ "DD", "CS", "SU" ],
	CS: [ "DE", "DD", "PL", "SU", "HU", "AT" ],
	HU: [ "AT", "CS", "SU", "RO", "YU" ],
	RO: [ "HU", "SU", "BG", "YU" ],
	BG: [ "RO", "YU", "GR", "TR" ],
	SU: [ "NO", "FI", "PL", "CS", "HU", "RO" ],
	DD: [ "DE", "PL", "CS" ],
	AL: [ "YU", "GR" ],
	FI: [ "NO", "SE", "SU" ],
	SE: [ "NO", "FI", "DK" ],
	CH: [ "FR", "DE", "AT", "IT" ],
	AT: [ "DE", "CH", "IT", "YU", "HU", "CS" ],
	YU: [ "IT", "AT", "HU", "RO", "BG", "GR", "AL" ]
};

const nodePositionOverrides: Partial<Record<CountryId, Point>> = {
	BE: { x: 228, y: 406 },
	CH: { x: 262, y: 477 },
	CS: { x: 352, y: 418 },
	DD: { x: 330, y: 373 },
	PL: { x: 410, y: 363 },
	AT: { x: 365, y: 453 },
	HU: { x: 405, y: 463 },
	DK: { x: 318, y: 312 },
	SE: { x: 365, y: 242 },
	FI: { x: 428, y: 209 },
	NO: { x: 295, y: 240 },
	DE: { x: 268, y: 399 },
	FR: { x: 200, y: 439 },
	IT: { x: 330, y: 556 },
	LU: { x: 250, y: 422 },
	NL: { x: 235, y: 374 },
	PT: { x: 22, y: 586 },
	RO: { x: 497, y: 496 },
	BG: { x: 480, y: 536 },
	SU: { x: 516, y: 301 },
	YU: { x: 445, y: 521 },
	TR: { x: 624, y: 551 }
};

const labelOffsets: Partial<Record<CountryId, LabelOffset>> = {
	AL: {
		dx: -12, dy: 2, anchor: "end"
	},
	AT: {
		dx: -12, dy: 20, anchor: "end"
	},
	BE: {
		dx: -12, dy: 4, anchor: "end"
	},
	BG: { dx: 12, dy: 16 },
	CH: {
		dx: -12, dy: 16, anchor: "end"
	},
	CS: {
		dx: 5, dy: -14, anchor: "middle"
	},
	DD: {
		dx: 0, dy: -10, anchor: "middle"
	},
	DE: {
		dx: 0, dy: -14, anchor: "middle"
	},
	DK: {
		dx: 0, dy: -14, anchor: "end"
	},
	ES: {
		dx: -4, dy: 16, anchor: "middle"
	},
	FI: {
		dx: -10, dy: 0, anchor: "end"
	},
	FR: {
		dx: -14, dy: 0, anchor: "end"
	},
	GR: {
		dx: -16, dy: 0, anchor: "end"
	},
	HU: { dx: 18, dy: 6 },
	IT: { dx: 12, dy: 14 },
	LU: {
		dx: -5, dy: 20, anchor: "end"
	},
	NL: {
		dx: -12, dy: -10, anchor: "end"
	},
	NO: {
		dx: -12, dy: -10, anchor: "end"
	},
	PL: {
		dx: 0, dy: -14, anchor: "middle"
	},
	PT: {
		dx: -10, dy: 0, anchor: "end"
	},
	RO: { dx: 16, dy: -6 },
	SE: {
		dx: -10, dy: 6, anchor: "end"
	},
	SU: { dx: 10, dy: -10 },
	TR: { dx: 12, dy: 6 },
	YU: {
		dx: -5, dy: 18, anchor: "end"
	}
};

const curvedEdges: CurvedEdge[] = [
	{
		from: "NO",
		to:   "SU",
		x1:   13,
		y1:   -272,
		x2:   -24,
		y2:   -395
	},
	{
		from: "NO",
		to:   "FI",
		x1:   13,
		y1:   -202,
		x2:   4,
		y2:   -283
	},{
		from: "NO",
		to:   "SE",
		x1:   13,
		y1:   -52,
		x2:   -13,
		y2:   -53
	},
	{
		from: "FR",
		to:   "IT",
		x1:   5,
		y1:   80,
		x2:   -25,
		y2:   -50
	},
	{
		from: "CH",
		to:   "IT",
		x1:   5,
		y1:   20,
		x2:   -25,
		y2:   -50
	},
	{
		from: "DE",
		to:   "CS",
		x1:   5,
		y1:   5,
		x2:   -15,
		y2:   15
	},
	{
		from: "CS",
		to:   "SU",
		x1:   150,
		y1:   60,
		x2:   0,
		y2:   0
	},
	{
		from: "HU",
		to:   "SU",
		x1:   40,
		y1:   0,
		x2:   0,
		y2:   75
	},
	{
		from: "RO",
		to:   "SU",
		x1:   0,
		y1:   0,
		x2:   0,
		y2:   75
	},
	{
		from: "DE",
		to:   "CH",
		x1:   20,
		y1:   30,
		x2:   0,
		y2:   0
	},
	{
		from: "AT",
		to:   "IT",
		x1:   -90,
		y1:   30,
		x2:   0,
		y2:   -20
	},
	{
		from: "AT",
		to:   "YU",
		x1:   -10,
		y1:   50,
		x2:   10,
		y2:   0
	},
	{
		from: "FR",
		to:   "ES",
		x1:   -10,
		y1:   120,
		x2:   0,
		y2:   0
	},
	{
		from: "YU",
		to:   "IT",
		x1:   -150,
		y1:   -50,
		x2:   -15,
		y2:   -60
	},
	{
		from: "SE",
		to:   "FI",
		x1:   -60,
		y1:   -180,
		x2:   10,
		y2:   -200
	},
	{
		from: "GR",
		to:   "TR",
		x1:   -10,
		y1:   -90,
		x2:   -20,
		y2:   -0
	},
	{
		from: "DE",
		to:   "DK",
		x1:   20,
		y1:   -40,
		x2:   -50,
		y2:   10
	},
	{
		from: "DE",
		to:   "FR",
		x1:   10,
		y1:   40,
		x2:   40,
		y2:   30
	},
	{
		from: "FI",
		to:   "SU",
		x1:   80,
		y1:   -80,
		x2:   0,
		y2:   0
	}

];

function edgeKey( leftId: CountryId, rightId: CountryId ) {
	return leftId < rightId ? `${leftId}:${rightId}` : `${rightId}:${leftId}`;
}

function extractViewBox( svg: string ) {
	const match = svg.match( /viewBox="([^"]+)"/ );

	if ( !match ) {
		throw new Error( "map85.svg is missing a viewBox" );
	}

	const values = match[ 1 ].trim().split( /\s+/ )
		.map( Number );

	if ( values.length !== 4 || values.some( ( value ) => !Number.isFinite( value ) ) ) {
		throw new Error( `Invalid viewBox in map85.svg: ${match[ 1 ]}` );
	}

	return {
		minX:   values[ 0 ],
		minY:   values[ 1 ],
		width:  values[ 2 ],
		height: values[ 3 ]
	};
}

function averagePointFromPath( pathData: string ): Point {
	const numbers = [ ...pathData.matchAll( /[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g ) ].map( ( match ) => Number( match[ 0 ] ) );
	let sumX = 0;
	let sumY = 0;
	let count = 0;

	for ( let index = 0; index + 1 < numbers.length; index += 2 ) {
		sumX += numbers[ index ];
		sumY += numbers[ index + 1 ];
		count += 1;
	}

	if ( count === 0 ) {
		throw new Error( "Could not compute centroid for an SVG path" );
	}

	return {
		x: sumX / count,
		y: sumY / count
	};
}

function extractPaths( svg: string ) {
	const matches = [ ...svg.matchAll( /<path id="([^"]+)" d="([^"]+)"/g ) ];

	return matches.map( ( [ , id, d ] ) => ( {
		id,
		d
	} ) );
}

const balancedColors: Record<CountryId, number> = {
	AL: 2,
	AT: 3,
	BE: 2,
	BG: 1,
	CH: 2,
	CS: 2,
	DD: 3,
	DE: 0,
	DK: 1,
	ES: 0,
	FI: 0,
	FR: 3,
	GR: 3,
	HU: 1,
	IT: 1,
	LU: 1,
	NL: 1,
	NO: 2,
	PL: 0,
	PT: 3,
	RO: 2,
	SE: 3,
	SU: 3,
	TR: 0,
	YU: 0
};

const viewBox = extractViewBox( rawMap );
const parsedPaths = extractPaths( rawMap );
const pathIds = parsedPaths.map( ( entry ) => entry.id );
const adjacencyIds = Object.keys( adjacency ) as CountryId[];

if ( parsedPaths.length !== adjacencyIds.length ) {
	throw new Error( `Expected ${adjacencyIds.length} countries in map85.svg, got ${parsedPaths.length}` );
}

for ( const id of adjacencyIds ) {
	if ( !pathIds.includes( id ) ) {
		throw new Error( `Missing path "${id}" in map85.svg` );
	}
}

for ( const id of pathIds ) {
	if ( !( id in adjacency ) ) {
		throw new Error( `Unexpected country "${id}" in map85.svg` );
	}
}

for ( const [ id, neighbors ] of Object.entries( adjacency ) as [ CountryId, CountryId[] ][] ) {
	for ( const neighborId of neighbors ) {
		if ( !adjacency[ neighborId ].includes( id ) ) {
			throw new Error( `Adjacency is not symmetric for ${id} and ${neighborId}` );
		}
	}
}

const curvedEdgeByKey = new Map<string, CurvedEdge>();

for ( const curvedEdge of curvedEdges ) {
	if ( !adjacency[ curvedEdge.from ].includes( curvedEdge.to ) ) {
		throw new Error( `Curved edge ${curvedEdge.from}-${curvedEdge.to} is not part of the graph` );
	}

	const key = edgeKey( curvedEdge.from, curvedEdge.to );

	if ( curvedEdgeByKey.has( key ) ) {
		throw new Error( `Curved edge ${curvedEdge.from}-${curvedEdge.to} is defined more than once` );
	}

	curvedEdgeByKey.set( key, curvedEdge );
}

const mapPaths = parsedPaths.map( ( entry ) => {
	const id = entry.id as CountryId;
	const centroid = averagePointFromPath( entry.d );

	return {
		id,
		d:        entry.d,
		centroid: nodePositionOverrides[ id ] ?? centroid
	} satisfies MapPath;
} );

const countryById = new Map( mapPaths.map( ( path ) => [ path.id, path ] ) );
const colors = balancedColors;
const edgePairs = Object.entries( adjacency )
	.flatMap( ( [ id, neighbors ] ) => {
		return neighbors.map( ( neighborId ) => [ id as CountryId, neighborId ] as const );
	} )
	.filter( ( [ id, neighborId ] ) => id < neighborId );

const displayTitle = computed( () => props.title || "Europa 1985" );
const displaySubtitle = computed( () => {
	return props.subtitle || `${mapPaths.length} Länder, ${edgePairs.length} Grenzbeziehungen, 4 Farben`;
} );

const svgMarkup = computed( () => {
	const countries = mapPaths.map( ( path ) => {
		const fill = FOUR_COLOR_PALETTE[ colors[ path.id ] ];
		return [
			`<path d="${path.d}"`,
			` fill="${fill}" fill-opacity="${COUNTRY_FILL_OPACITY}"`,
			` stroke="${fill}" stroke-opacity="${COUNTRY_STROKE_OPACITY}"`,
			" stroke-width=\"1.1\" />"
		].join( "" );
	} ).join( "\n" );

	const edges = edgePairs.map( ( [ leftId, rightId ] ) => {
		const left = countryById.get( leftId );
		const right = countryById.get( rightId );

		if ( !left || !right ) {
			throw new Error( `Missing node position for edge ${leftId}-${rightId}` );
		}

		const curvedEdge = curvedEdgeByKey.get( edgeKey( leftId, rightId ) );

		if ( curvedEdge ) {
			const from = countryById.get( curvedEdge.from );
			const to = countryById.get( curvedEdge.to );

			if ( !from || !to ) {
				throw new Error( `Missing node position for curved edge ${curvedEdge.from}-${curvedEdge.to}` );
			}

			const control1X = from.centroid.x + curvedEdge.x1;
			const control1Y = from.centroid.y + curvedEdge.y1;
			const control2X = to.centroid.x + curvedEdge.x2;
			const control2Y = to.centroid.y + curvedEdge.y2;

			return [
				`<path d="M ${from.centroid.x} ${from.centroid.y}`,
				` C ${control1X} ${control1Y},`,
				` ${control2X} ${control2Y},`,
				` ${to.centroid.x} ${to.centroid.y}"`,
				" fill=\"none\"",
				` stroke="${EDGE_COLOR}" stroke-opacity="${EDGE_STROKE_OPACITY}"`,
				" stroke-width=\"1.1\" />"
			].join( "" );
		}

		return [
			`<line x1="${left.centroid.x}" y1="${left.centroid.y}"`,
			` x2="${right.centroid.x}" y2="${right.centroid.y}"`,
			` stroke="${EDGE_COLOR}" stroke-opacity="${EDGE_STROKE_OPACITY}"`,
			" stroke-width=\"1.1\" />"
		].join( "" );
	} ).join( "\n" );

	const nodes = mapPaths.map( ( path ) => {
		const fill = FOUR_COLOR_PALETTE[ colors[ path.id ] ];
		const label = labelOffsets[ path.id ] ?? {
			dx:     8,
			dy:     4,
			anchor: "start"
		};
		const labelX = path.centroid.x + label.dx;
		const labelY = path.centroid.y + label.dy;
		const anchor = label.anchor ?? "start";

		return [
			[
				`<circle cx="${path.centroid.x}" cy="${path.centroid.y}"`,
				` r="${props.nodeRadius}" fill="${fill}"`,
				` stroke="${NODE_STROKE_COLOR}" stroke-width="1.25" />`
			].join( "" ),
			[
				`<text x="${labelX}" y="${labelY}" font-size="10"`,
				` text-anchor="${anchor}" fill="${LABEL_COLOR}">${path.id}</text>`
			].join( "" )
		].join( "\n" );
	} ).join( "\n" );

	return `<?xml version="1.0"?>
<svg width="${props.width}" height="${props.height}" viewBox="${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}" xmlns="http://www.w3.org/2000/svg">
${countries}
${edges}
${nodes}
</svg>`;
} );
</script>

<style scoped>
.graph-shell {
  width: 100%;
  overflow: auto;
  background: rgb(var(--v-theme-surface));
  position: relative;
  display: flex;
  justify-content: center;
}

.graph-stage {
  width: max-content;
  padding: 12px;
  margin-inline: auto;
}

.graph-stage :deep(svg) {
  display: block;
  max-width: 100%;
  height: auto;
  margin-inline: auto;
}
</style>
