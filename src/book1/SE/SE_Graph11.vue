<template>
<div class="seGraphWrap">
	<div class="seGraphStage">
		<!-- Graph-Toggle (oben links auf der Grafik) -->
		<button
			class="graphToggle mono"
			:title="t( 'graphs.euler.switchGraph', { name: graph.name } )"
			type="button"
			@click.stop="toggleGraph"
		>
			{{ graph.btn ?? "⟲" }}
		</button>

		<svg
			:aria-label="t( 'graphs.euler.aria', { name: graph.name } )"
			class="seGraphSvg"
			role="img"
			:viewBox="`0 0 ${size} ${size}`"
			@click="reroll"
		>
			<g class="baseGraph">
				<path
					v-for="e in baseEdges"
					:key="e.key"
					class="baseEdge"
					:d="e.d"
				/>
			</g>

			<g class="trailGraph">
				<path
					v-for="seg in trailSegments"
					:key="seg.key"
					class="trailSeg"
					:d="seg.d"
					:style="{ stroke: themeRgba('primary', seg.alpha) }"
				/>
			</g>

			<g class="nodes">
				<circle
					v-for="v in nodeList"
					:key="`node-${v.id}`"
					:class="v.id === startId ? 'node nodeStart' : 'node'"
					:cx="v.x"
					:cy="v.y"
					:r="v.id === startId ? 7.2 : 4.6"
				/>
				<text
					v-for="v in nodeList"
					:key="`label-${v.id}`"
					class="nodeLabel"
					:x="v.x + 9"
					:y="v.y - 9"
				>{{ v.id }}</text>
			</g>
		</svg>
	</div>

	<div class="seGraphMeta mono">
		<div><b>{{ t( "graphs.euler.graph" ) }}</b> = {{ graph.name }}</div>
		<div><b>{{ t( "graphs.euler.euler" ) }}</b> = {{ eulerInfo.text }}</div>
		<div><b>{{ t( "graphs.euler.start" ) }}</b> = {{ startId ?? "-" }}</div>
		<div><b>{{ t( "graphs.euler.end" ) }}</b> = {{ endId ?? "-" }}</div>
		<div><b>{{ t( "graphs.euler.edges" ) }}</b> = {{ graph.edges.length }}</div>
		<div><b>{{ t( "graphs.euler.steps" ) }}</b> = {{ Math.max( 0, trailVertices.length - 1 ) }}</div>
	</div>

	<p class="muted seGraphHint">
		{{ t( "graphs.common.clickHint" ) }}
	</p>
</div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "@/i18n.mjs";

const { t } = useI18n( "book1/SE" );

const size = 420;

/** Eckenradius (wie bei dir) */
const cornerRadius = ref( 50 );

function regularPolygonVertices(
	n, cx, cy, r, rotDeg = -90, labels = []
) {
	const out = {};
	const L = labels.length ?
		labels :
		Array.from( { length: n }, ( _, i ) => String.fromCharCode( 65 + i ) );

	for ( let i = 0; i < n; i++ ) {
		const a = ( rotDeg + i * ( 360 / n ) ) * Math.PI / 180;
		out[ L[ i ] ] = {
			x: cx + r * Math.cos( a ),
			y: cy + r * Math.sin( a )
		};
	}

	return out;
}

/**
 * Erweiterbar: einfach neue Graphen ergänzen.
 * edges = Array<[a,b]> (ungerichtet); Multikanten sind erlaubt (mehrfaches [a,b]).
 */
const graphs = [
	{
		id:       "nikolaus",
		btn:      "H",
		name:     t( "graphs.euler.graphNames.nikolaus" ),
		vertices: {
			A: { x: 70, y: 380 },
			B: { x: 350, y: 380 },
			C: { x: 350, y: 160 },
			D: { x: 70, y: 160 },
			E: { x: 210, y: 40 }
		},
		edges: [
			[ "A", "B" ],
			[ "B", "C" ],
			[ "C", "D" ],
			[ "D", "A" ],
			[ "D", "E" ],
			[ "C", "E" ],
			[ "A", "C" ],
			[ "B", "D" ]
		]
	},
	{
		id:       "pentagramm",
		btn:      "★",
		name:     t( "graphs.euler.graphNames.pentagramm" ),
		vertices: regularPolygonVertices(
			5, 210, 220, 170, -90, [ "A", "B", "C", "D", "E" ]
		),
		edges: [
			// Rahmen (Fünfeck)
			[ "A", "B" ],
			[ "B", "C" ],
			[ "C", "D" ],
			[ "D", "E" ],
			[ "E", "A" ],
			// Stern (Diagonalen)
			[ "A", "C" ],
			[ "C", "E" ],
			[ "E", "B" ],
			[ "B", "D" ],
			[ "D", "A" ]
		]
	},
	{
		id:       "koenigsberg",
		btn:      "B",
		name:     t( "graphs.euler.graphNames.koenigsberg" ),
		vertices: {
			N: { x: 120, y: 120 }, // Nordufer
			S: { x: 120, y: 320 }, // Südufer
			K: { x: 160, y: 220 }, // Kneiphof
			L: { x: 340, y: 220 } // Lomse
		},
		edges: [
			// N–K (2 Brücken)
			[ "N", "K" ],
			[ "N", "K" ],
			// S–K (2 Brücken)
			[ "S", "K" ],
			[ "S", "K" ],
			// N–L (1)
			[ "N", "L" ],
			// S–L (1)
			[ "S", "L" ],
			// K–L (1)
			[ "K", "L" ]
		]
	},
	{
		id:       "oktaeder",
		btn:      "O",
		name:     t( "graphs.euler.graphNames.oktaeder" ),
		vertices: {
			T: { x: 210, y: 60 },
			U: { x: 210, y: 140 },
			R: { x: 330, y: 210 },
			D: { x: 210, y: 300 },
			L: { x: 90, y: 210 },
			B: { x: 210, y: 360 }
		},
		edges: [
			// Top zu Quadrat
			[ "T", "U" ],
			[ "T", "R" ],
			[ "T", "D" ],
			[ "T", "L" ],
			// Bottom zu Quadrat
			[ "B", "U" ],
			[ "B", "R" ],
			[ "B", "D" ],
			[ "B", "L" ],
			// Quadrat (U-R-D-L)
			[ "U", "R" ],
			[ "R", "D" ],
			[ "D", "L" ],
			[ "L", "U" ]
		]
	}
];

const graphIndex = ref( 0 );
const graph = computed( () => graphs[ graphIndex.value ] );

const trailVertices = ref( [] );
const trailEdges = ref( [] );
const startId = ref( null );

function themeRgba( name, alpha ) {
	return `rgba(var(--v-theme-${name}), ${alpha})`;
}

function canonPair( a, b ) {
	return a < b ? [ a, b ] : [ b, a ];
}

function buildAdj( g ) {
	const vertices = Object.keys( g.vertices );
	const adj = new Map( vertices.map( v => [ v, [] ] ) );
	const deg = new Map( vertices.map( v => [ v, 0 ] ) );

	g.edges.forEach( ( [ a, b ], eid ) => {
		adj.get( a ).push( { to: b, eid } );
		adj.get( b ).push( { to: a, eid } );
		deg.set( a, ( deg.get( a ) ?? 0 ) + 1 );
		deg.set( b, ( deg.get( b ) ?? 0 ) + 1 );
	} );

	return {
		adj, deg, edgeCount: g.edges.length, vertices
	};
}

const oddVertices = computed( () => {
	const { deg, vertices } = buildAdj( graph.value );
	return vertices.filter( v => deg.get( v ) % 2 === 1 );
} );

const eulerInfo = computed( () => {
	const odd = oddVertices.value;

	if ( odd.length === 0 ) {
		return { possible: true, text: t( "graphs.euler.circle" ) };
	}

	if ( odd.length === 2 ) {
		return { possible: true, text: t( "graphs.euler.path", { vertices: odd.join( ", " ) } ) };
	}

	return { possible: false, text: t( "graphs.euler.no", { count: odd.length } ) };
} );

function pickRandom( arr ) {
	return arr[ Math.floor( Math.random() * arr.length ) ];
}

/**
 * Hierholzer (randomisiert) — gibt Vertex- UND Edge-Reihenfolge zurück.
 * Return: { vertices: [...], edges: [eid0, eid1, ...] }
 */
function eulerTrail( g, forcedStart = null ) {
	const {
		adj, deg, edgeCount, vertices
	} = buildAdj( g );
	const odd = vertices.filter( v => deg.get( v ) % 2 === 1 );

	let start = forcedStart;

	if ( !start ) {
		if ( odd.length === 0 ) {
			start = pickRandom( vertices );
		} else if ( odd.length === 2 ) {
			start = pickRandom( odd );
		} else {
			return { vertices: [], edges: [] };
		}
	}

	const used = Array( edgeCount ).fill( false );
	const stack = [ { v: start, via: null } ];
	const outV = [];
	const outVia = [];

	while ( stack.length ) {
		const top = stack[ stack.length - 1 ];
		const options = adj.get( top.v ).filter( e => !used[ e.eid ] );

		if ( options.length ) {
			const pick = pickRandom( options );
			used[ pick.eid ] = true;
			stack.push( { v: pick.to, via: pick.eid } );
		} else {
			const popped = stack.pop();
			outV.push( popped.v );
			outVia.push( popped.via );
		}
	}

	outV.reverse();
	outVia.reverse();

	const usedCount = used.reduce( ( s, x ) => s + ( x ? 1 : 0 ), 0 );

	if ( usedCount !== edgeCount ) {
		return { vertices: [], edges: [] };
	}

	return { vertices: outV, edges: outVia.slice( 1 ) }; // edge i führt zu vertices[i+1]
}

// ---- Geometrie / Rundung / Kantenkrümmung ----
function dist( a, b ) {
	return Math.hypot( a.x - b.x, a.y - b.y );
}

function norm( v ) {
	const l = Math.hypot( v.x, v.y );
	return l ? { x: v.x / l, y: v.y / l } : { x: 0, y: 0 };
}

function offsetPoint(
	from, toward, r
) {
	const d = norm( { x: toward.x - from.x, y: toward.y - from.y } );
	return { x: from.x + d.x * r, y: from.y + d.y * r };
}

function clamp(
	n, a, b
) {
	return Math.max( a, Math.min( b, n ) );
}

function controlPointForBend(
	pA, pB, bend
) {
	const mid = {
		x: ( pA.x + pB.x ) / 2,
		y: ( pA.y + pB.y ) / 2
	};
	const perp = norm( {
		x: -( pB.y - pA.y ),
		y: pB.x - pA.x
	} );

	return {
		x: mid.x + perp.x * bend,
		y: mid.y + perp.y * bend
	};
}

/** Multikanten: für gleiche Knotenpaare leicht unterschiedliche "Biegung" vergeben */
const edgeMeta = computed( () => {
	const g = graph.value;
	const meta = g.edges.map( ( [ a, b ], eid ) => {
		const [
			aCanon, bCanon
		] = canonPair( a, b );

		return {
			eid,
			a,
			b,
			aCanon,
			bCanon,
			bendCanon: 0
		};
	} );

	const groups = new Map();
	meta.forEach( m => {
		const k = `${m.aCanon}__${m.bCanon}`;

		if ( !groups.has( k ) ) {
			groups.set( k, [] );
		}

		groups.get( k ).push( m.eid );
	} );

	const step = 22; // px

	for ( const eids of groups.values() ) {
		if ( eids.length <= 1 ) {
			continue;
		}

		eids.forEach( ( eid, i ) => {
			meta[ eid ].bendCanon = ( i - ( eids.length - 1 ) / 2 ) * step;
		} );
	}

	return meta;
} );

function signedBend(
	m, fromId, toId
) {
	if ( !m || !m.bendCanon ) {
		return 0;
	}

	if ( m.bendCanon === 0 ) {
		return 0;
	}

	if ( fromId === m.aCanon && toId === m.bCanon ) {
		return m.bendCanon;
	}

	if ( fromId === m.bCanon && toId === m.aCanon ) {
		return -m.bendCanon;
	}

	return m.bendCanon;
}

function edgePathD(
	fromId, toId, pA, pB, bendPx
) {
	if ( !bendPx ) {
		return `M ${pA.x.toFixed( 2 )} ${pA.y.toFixed( 2 )} L ${pB.x.toFixed( 2 )} ${pB.y.toFixed( 2 )}`;
	}

	const c = controlPointForBend(
		pA, pB, bendPx
	);
	return `M ${pA.x.toFixed( 2 )} ${pA.y.toFixed( 2 )} Q ${c.x.toFixed( 2 )}
${c.y.toFixed( 2 )} ${pB.x.toFixed( 2 )} ${pB.y.toFixed( 2 )}`;
}

function edgePartD(
	fromId, toId, pA, pB, bendPx
) {
	if ( !bendPx ) {
		return `L ${pB.x.toFixed( 2 )} ${pB.y.toFixed( 2 )}`;
	}

	const c = controlPointForBend(
		pA, pB, bendPx
	);
	return `Q ${c.x.toFixed( 2 )} ${c.y.toFixed( 2 )} ${pB.x.toFixed( 2 )} ${pB.y.toFixed( 2 )}`;
}

/**
 * Segmente des Eulerwegs:
 * - am Knoten: Q-Bogen (Corner-Rounding)
 * - auf Kanten: gerade oder leicht gebogen (für Multikanten)
 */
function buildTrailSegments(
	points, vertexIds, edgeIds, baseR, meta
) {
	const n = points.length - 1;

	if ( n <= 0 ) {
		return [];
	}

	const segs = [];

	for ( let i = 0; i < n; i++ ) {
		const p0 = points[ i ];
		const p1 = points[ i + 1 ];

		const fromId = vertexIds[ i ];
		const toId = vertexIds[ i + 1 ];
		const eid = edgeIds[ i ];
		const m = meta[ eid ];

		let end = p1;

		if ( i < n - 1 ) {
			const p2 = points[ i + 2 ];
			const rEnd = Math.min(
				baseR, dist( p0, p1 ) * 0.35, dist( p2, p1 ) * 0.35
			);
			end = offsetPoint(
				p1, p0, rEnd
			);
		}

		let d = "";

		// Biegung für diese Kante (Multikanten)
		const fullLen = Math.max( 1e-6, dist( p0, p1 ) );

		if ( i === 0 ) {
			const segLen = dist( p0, end );
			const bend = signedBend(
				m, fromId, toId
			) * ( segLen / fullLen );

			d =
				`M ${p0.x.toFixed( 2 )} ${p0.y.toFixed( 2 )} ` +
				edgePartD(
					fromId, toId, p0, end, bend
				);
		} else {
			const prev = points[ i - 1 ];

			const rCorner = Math.min(
				baseR, dist( prev, p0 ) * 0.35, dist( p1, p0 ) * 0.35
			);

			const inPt = offsetPoint(
				p0, prev, rCorner
			);
			const outPt = offsetPoint(
				p0, p1, rCorner
			);

			const segLen = dist( outPt, end );
			const bend = signedBend(
				m, fromId, toId
			) * ( segLen / fullLen );

			d =
				`M ${inPt.x.toFixed( 2 )} ${inPt.y.toFixed( 2 )} ` +
				`Q ${p0.x.toFixed( 2 )} ${p0.y.toFixed( 2 )} ${outPt.x.toFixed( 2 )} ${outPt.y.toFixed( 2 )} ` +
				edgePartD(
					fromId, toId, outPt, end, bend
				);
		}

		const alpha = n === 1 ? 0.92 : clamp(
			0.92 - i * ( 0.72 / ( n - 1 ) ), 0.18, 0.95
		);

		segs.push( {
			key: `seg-${i}`, d, alpha
		} );
	}

	return segs;
}

// ---- Computeds für Darstellung ----
const nodeList = computed( () => {
	const v = graph.value.vertices;
	return Object.keys( v ).map( id => ( {
		id, x: v[ id ].x, y: v[ id ].y
	} ) );
} );

const baseEdges = computed( () => {
	const v = graph.value.vertices;

	return edgeMeta.value.map( m => {
		const pA = v[ m.a ];
		const pB = v[ m.b ];
		const bend = signedBend(
			m, m.a, m.b
		);

		return {
			key: `edge-${m.eid}-${m.a}-${m.b}`,
			d:   edgePathD(
				m.a, m.b, pA, pB, bend
			)
		};
	} );
} );

const trailPoints = computed( () => {
	const v = graph.value.vertices;
	return trailVertices.value.map( id => v[ id ] ).filter( Boolean );
} );

const trailSegments = computed( () => buildTrailSegments(
	trailPoints.value,
	trailVertices.value,
	trailEdges.value,
	cornerRadius.value,
	edgeMeta.value
) );

const endId = computed( () => {
	const t = trailVertices.value;
	return t.length ? t[ t.length - 1 ] : null;
} );

// ---- Interaktion ----
function toggleGraph() {
	graphIndex.value = ( graphIndex.value + 1 ) % graphs.length;
	reroll();
}

function reroll() {
	// Bei "Königsberger Brücken" etc. ist ggf. kein Eulerweg möglich
	if ( !eulerInfo.value.possible ) {
		trailVertices.value = [];
		trailEdges.value = [];
		startId.value = null;
		return;
	}

	const res = eulerTrail( graph.value );

	trailVertices.value = res.vertices;
	trailEdges.value = res.edges;
	startId.value = res.vertices.length ? res.vertices[ 0 ] : null;
}

reroll();
</script>

<style scoped>
.seGraphWrap {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.seGraphStage {
	position: relative;
	width: min(100%, 520px);
}

.graphToggle {
	position: absolute;
	top: 10px;
	left: 10px;
	z-index: 2;

	border: 1px solid rgba(var(--v-theme-on-surface), 0.22);
	background: rgba(var(--v-theme-surface), 0.75);
	color: rgba(var(--v-theme-on-surface), 0.92);

	width: 34px;
	height: 34px;
	border-radius: 12px;

	cursor: pointer;
	user-select: none;

	display: grid;
	place-items: center;
	font-weight: 900;
}

.seGraphSvg {
	width: 100%;
	height: auto;
	cursor: pointer;
	border: 1px solid rgba(var(--v-theme-on-surface), 0.2);
	border-radius: 14px;
	background: rgba(var(--v-theme-surface), 0.85);
}

.baseEdge {
	fill: none;
	stroke: rgba(var(--v-theme-on-surface), 0.24);
	stroke-width: 1.4;
	vector-effect: non-scaling-stroke;
}

.trailSeg {
	fill: none;
	stroke-width: 5.0;
	stroke-linecap: round;
	stroke-linejoin: round;
	vector-effect: non-scaling-stroke;
}

.node {
	fill: rgba(var(--v-theme-on-surface), 0.46);
	stroke: rgba(var(--v-theme-surface), 0.65);
	stroke-width: 1.2;
	vector-effect: non-scaling-stroke;
}
.nodeStart {
	fill: rgba(var(--v-theme-primary), 0.85);
	stroke: rgba(var(--v-theme-surface), 0.75);
}

.nodeLabel {
	font-size: 12px;
	font-weight: 700;
	fill: rgba(var(--v-theme-on-surface), 0.55);
	user-select: none;
	pointer-events: none;
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
