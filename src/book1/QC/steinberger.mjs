// Initial authentic JS port scaffold for Steinberger/RSST tooling
// Based directly on reduce.c and discharge.c provided by the user.
// Scope of this first cut:
//   B) start of discharge-side port: exact configuration parser and data model,
//      question/radius helpers, unavoidable-set loader skeleton.
//   A) start of reduce-side port: ring-color coding helpers, live-set iteration
//      skeleton, reducibility driver skeleton.
// This file is intentionally modular but kept in one file for easier iteration.

// ---------------------------------------------------------------------------
// Shared constants from the original C sources
// ---------------------------------------------------------------------------

export const DISCHARGE_VERTS = 40; // discharge.c: VERTS
export const REDUCE_VERTS = 30; // reduce.c: VERTS
export const DEG = 13;
export const EDGES = 70;
export const MAXRING = 16;
export const CONFS = 4000;
export const MAXVAL = 12;
export const CARTVERT = 5 * MAXVAL + 2;
export const INFTY = 12;
export const MAXELIST = 134;

// ---------------------------------------------------------------------------
// Data model
// ---------------------------------------------------------------------------

export class Configuration {
	constructor( {
		name,
		vertexCount,
		ringSize,
		extendableColorings,
		maxContractSubset,
		contractRaw,
		contractPairs,
		vertices,
		coordinates
	} ) {
		this.name = name;
		this.vertexCount = vertexCount;
		this.ringSize = ringSize;
		this.extendableColorings = extendableColorings;
		this.maxContractSubset = maxContractSubset;
		this.contractRaw = contractRaw;
		this.contractPairs = contractPairs;
		this.vertices = vertices; // 1-indexed externally, 0-indexed array internally
		this.coordinates = coordinates;
	}

	getVertex( id ) {
		if ( id < 1 || id > this.vertexCount ) {
			throw new RangeError( `Vertex ${id} out of range 1..${this.vertexCount}` );
		}

		return this.vertices[ id - 1 ];
	}

	degree( id ) {
		return this.getVertex( id ).degree;
	}

	neighbors( id ) {
		return this.getVertex( id ).neighbors;
	}

	toJSON() {
		return {
			name:                this.name,
			vertexCount:         this.vertexCount,
			ringSize:            this.ringSize,
			extendableColorings: this.extendableColorings,
			maxContractSubset:   this.maxContractSubset,
			contractRaw:         this.contractRaw,
			contractPairs:       this.contractPairs,
			vertices:            this.vertices,
			coordinates:         this.coordinates
		};
	}
}

// ---------------------------------------------------------------------------
// Exact parser for U_2822.conf format reconstructed from ReadConf in C
// ---------------------------------------------------------------------------

function isBlank( line ) {
	return /^\s*$/.test( line );
}

function tokenizeInts( line ) {
	return ( line.match( /-?\d+/g ) ?? [] ).map( Number );
}

function parseContractLine( line, configName ) {
	const ints = tokenizeInts( line );

	if ( ints.length === 0 ) {
		throw new Error( `Error on contract line while reading ${configName}` );
	}

	const count = ints[ 0 ];

	if ( 2 * count + 1 !== ints.length ) {
		throw new Error( `Error on line 3 while reading ${configName}` );
	}

	const pairs = [];

	for ( let i = 0; i < count; i++ ) {
		pairs.push( [ ints[ 1 + 2 * i ], ints[ 2 + 2 * i ] ] );
	}

	return { raw: ints, pairs };
}

function parseAdjacencyLine(
	line, expectedVertexId, configName
) {
	const ints = tokenizeInts( line );

	if ( ints.length < 2 ) {
		throw new Error( `Error while reading vertex ${expectedVertexId} of ${configName}` );
	}

	const [ id, degree, ...neighbors ] = ints;

	if ( id !== expectedVertexId ) {
		throw new Error( `Error while reading vertex ${expectedVertexId} of ${configName}` );
	}

	if ( degree >= DEG ) {
		throw new Error( `Vertex degree larger than ${DEG - 1} in ${configName}` );
	}

	if ( neighbors.length !== degree ) {
		throw new Error( `Error while reading neighbour list of ${expectedVertexId} of ${configName}` );
	}

	return {
		id, degree, neighbors
	};
}

function validateConfiguration( cfg ) {
	const n = cfg.vertexCount;
	const r = cfg.ringSize;

	// condition (1)
	if ( r < 2 || n <= r ) {
		throw new Error( `ReadErr(1): invalid vertex/ring relation in ${cfg.name}` );
	}

	// condition (2)
	for ( let i = 1; i <= r; i++ ) {
		const d = cfg.degree( i );

		if ( d < 3 || d >= n ) {
			throw new Error( `ReadErr(2): invalid ring degree at vertex ${i} in ${cfg.name}` );
		}
	}

	for ( let i = r + 1; i <= n; i++ ) {
		const d = cfg.degree( i );

		if ( d < 5 || d >= n ) {
			throw new Error( `ReadErr(2): invalid internal degree at vertex ${i} in ${cfg.name}` );
		}
	}

	// condition (3)
	for ( let i = 1; i <= n; i++ ) {
		for ( const k of cfg.neighbors( i ) ) {
			if ( k < 1 || k > n ) {
				throw new Error( `ReadErr(3): neighbor ${k} out of range at vertex ${i} in ${cfg.name}` );
			}
		}
	}

	// condition (4)
	for ( let i = 1; i <= r; i++ ) {
		const nbrs = cfg.neighbors( i );
		const first = nbrs[ 0 ];
		const last = nbrs[ nbrs.length - 1 ];
		const expectedFirst = i === r ? 1 : i + 1;
		const expectedLast = i === 1 ? r : i - 1;

		if ( first !== expectedFirst || last !== expectedLast ) {
			throw new Error( `ReadErr(4): bad ring order at vertex ${i} in ${cfg.name}` );
		}

		for ( let j = 1; j < nbrs.length - 1; j++ ) {
			if ( nbrs[ j ] <= r || nbrs[ j ] > n ) {
				throw new Error( `ReadErr(4): bad non-ring neighbor at ring vertex ${i} in ${cfg.name}` );
			}
		}
	}

	// condition (5)
	let degreeSum = 0;

	for ( let i = 1; i <= n; i++ ) {
		degreeSum += cfg.degree( i );
	}

	if ( degreeSum !== 6 * ( n - 1 ) - 2 * r ) {
		throw new Error( `ReadErr(5): Euler degree sum mismatch in ${cfg.name}` );
	}

	// condition (6)
	for ( let i = r + 1; i <= n; i++ ) {
		let k = 0;
		const nbrs = cfg.neighbors( i );
		const d = nbrs.length;

		for ( let j = 0; j < d; j++ ) {
			const a = nbrs[ j ];
			const b = nbrs[ ( j + 1 ) % d ];
			const c = nbrs[ ( j + 2 ) % d ];

			if ( a > r && b <= r ) {
				k++;

				if ( c <= r ) {
					k++;
				}
			}
		}

		if ( k > 2 ) {
			throw new Error( `ReadErr(6): too many ring intervals at vertex ${i} in ${cfg.name}` );
		}
	}

	// condition (7): clockwise edge consistency
	for ( let i = 1; i <= n; i++ ) {
		const nbrs = cfg.neighbors( i );

		for ( let j = 0; j < nbrs.length; j++ ) {
			if ( i <= r && j === nbrs.length - 1 ) {
				continue;
			}

			const k = nbrs[ j ];
			const a = nbrs[ ( j + 1 ) % nbrs.length ];
			const kNbrs = cfg.neighbors( k );
			let ok = false;

			for ( let p = 0; p < kNbrs.length; p++ ) {
				if ( kNbrs[ p ] === a && kNbrs[ ( p + 1 ) % kNbrs.length ] === i ) {
					ok = true;
					break;
				}
			}

			if ( !ok ) {
				throw new Error( `ReadErr(7): orientation mismatch at directed edge (${i}, ${k}) in ${cfg.name}` );
			}
		}
	}

	return true;
}

export function parseConfigurations( text ) {
	const rawLines = text.replace( /\r\n?/g, "\n" ).split( "\n" );
	let idx = 0;
	const configs = [];

	const nextNonBlank = () => {
		while ( idx < rawLines.length && isBlank( rawLines[ idx ] ) ) {
			idx++;
		}

		return idx < rawLines.length ? rawLines[ idx ] : null;
	};

	while ( true ) {
		const nameLine = nextNonBlank();

		if ( nameLine == null ) {
			break;
		}

		const name = nameLine.trim();
		idx++;

		if ( idx >= rawLines.length ) {
			throw new Error( `Unexpected EOF after configuration name ${name}` );
		}

		const header = tokenizeInts( rawLines[ idx++ ] );

		if ( header.length !== 4 ) {
			throw new Error( `Error on line 2 while reading ${name}` );
		}

		const [ vertexCount, ringSize, extendableColorings, maxContractSubset ] = header;

		if ( vertexCount >= DISCHARGE_VERTS ) {
			throw new Error( `${name} has more than ${DISCHARGE_VERTS - 1} vertices` );
		}

		if ( idx >= rawLines.length ) {
			throw new Error( `Unexpected EOF in contract line of ${name}` );
		}

		const contract = parseContractLine( rawLines[ idx++ ], name );

		const vertices = [];

		for ( let v = 1; v <= vertexCount; v++ ) {
			if ( idx >= rawLines.length ) {
				throw new Error( `Unexpected EOF in adjacency of ${name}` );
			}

			vertices.push( parseAdjacencyLine(
				rawLines[ idx++ ], v, name
			) );
		}

		const coordinates = [];

		while ( coordinates.length < vertexCount ) {
			if ( idx >= rawLines.length ) {
				throw new Error( `Unexpected EOF in coordinates of ${name}` );
			}

			const vals = tokenizeInts( rawLines[ idx++ ] );

			if ( vals.length === 0 ) {
				throw new Error( `Error while reading coordinates of ${name}` );
			}

			coordinates.push( ...vals );
		}

		// consume required blank line if present
		if ( idx < rawLines.length && isBlank( rawLines[ idx ] ) ) {
			idx++;
		}

		const cfg = new Configuration( {
			name,
			vertexCount,
			ringSize,
			extendableColorings,
			maxContractSubset,
			contractRaw:   contract.raw,
			contractPairs: contract.pairs,
			vertices,
			coordinates:   coordinates.slice( 0, vertexCount )
		} );

		validateConfiguration( cfg );
		configs.push( cfg );
	}

	return configs;
}

async function getNodeFs() {
	return Function( "return import('node:fs/promises')" )();
}

export async function loadConfigurations( path ) {
	const fs = await getNodeFs();
	const text = await fs.readFile( path, "utf8" );
	return parseConfigurations( text );
}

export async function loadBundledConfigurations() {
	const { default: text } = await import( "./original/U_2822.conf?raw" );
	return parseConfigurations( text );
}

// ---------------------------------------------------------------------------
// Discharge-side start (B)
// ---------------------------------------------------------------------------

export class Query {
	constructor(
		u = 0, v = 0, z = 0, xi = 0
	) {
		this.u = u;
		this.v = v;
		this.z = z;
		this.xi = xi;
	}
}

export class Axle {
	constructor( deg = 0 ) {
		this.low = new Array( CARTVERT ).fill( 0 );
		this.upp = new Array( CARTVERT ).fill( 0 );
		this.low[ 0 ] = deg;
		this.upp[ 0 ] = deg;

		for ( let i = 1; i < CARTVERT; i++ ) {
			this.low[ i ] = 5;
			this.upp[ i ] = INFTY;
		}
	}

	clone() {
		const a = new Axle( 0 );
		a.low = this.low.slice();
		a.upp = this.upp.slice();
		return a;
	}
}

export function axleFromConfiguration( cfg ) {
	const deg = cfg.ringSize;
	const A = new Axle( deg );

	for ( let i = 1; i <= deg; i++ ) {
		const d = cfg.degree( i );
		A.low[ i ] = d;
		A.upp[ i ] = d;
	}

	return A;
}

export function getQuestion( cfg ) {
	const nverts = cfg.vertexCount;
	const ring = cfg.ringSize;
	const Q = Array.from( { length: nverts + 2 }, () => new Query() );
	const found = new Array( nverts + 1 ).fill( 0 );

	Q[ 1 ].u = nverts;
	Q[ 1 ].v = ring;

	let max = 0;
	let best = ring + 1;

	for ( let v = ring + 1; v <= nverts; v++ ) {
		if ( cfg.degree( v ) > max ) {
			max = cfg.degree( v );
			best = v;
		}
	}

	Q[ 0 ].z = best;
	Q[ 0 ].xi = cfg.degree( best );
	found[ best ] = 1;

	max = 0;
	let secondbest = 0;

	for ( const v of cfg.neighbors( best ) ) {
		if ( v <= ring ) {
			continue;
		}

		if ( cfg.degree( v ) > max ) {
			max = cfg.degree( v );
			secondbest = v;
		}
	}

	Q[ 1 ].z = secondbest;
	Q[ 1 ].xi = secondbest > ring ? cfg.degree( secondbest ) : 0;
	found[ secondbest ] = 1;

	let nfound = 2;

	for ( let search = 0; search < nfound; search++ ) {
		const v = Q[ search ].z;

		if ( v <= ring ) {
			continue;
		}

		const nbrs = cfg.neighbors( v );
		const d = nbrs.length;

		let i = 0;

		while ( !found[ nbrs[ i ] ] ) {
			i++;
		}

		let h = i === 0 ? d - 1 : i - 1;

		while ( h !== i ) {
			const u = nbrs[ h ];

			if ( u <= ring ) {
				break;
			}

			if ( !found[ u ] ) {
				Q[ nfound ].z = u;
				Q[ nfound ].xi = u > ring ? cfg.degree( u ) : 0;
				Q[ nfound ].u = nbrs[ h === d - 1 ? 0 : h + 1 ];
				Q[ nfound ].v = v;
				nfound++;
				found[ u ] = 1;
			}

			h = h === 0 ? d - 1 : h - 1;
		}

		if ( h === i ) {
			continue;
		}

		let j = i === d - 1 ? 0 : i + 1;

		for ( ;; j = j === d - 1 ? 0 : j + 1 ) {
			const w = nbrs[ j ];

			if ( w <= ring ) {
				break;
			}

			if ( !found[ w ] ) {
				Q[ nfound ].z = w;
				Q[ nfound ].xi = w > ring ? cfg.degree( w ) : 0;
				Q[ nfound ].u = v;
				Q[ nfound ].v = nbrs[ j === 0 ? d - 1 : j - 1 ];
				nfound++;
				found[ w ] = 1;
			}
		}

		const r = h >= j ? h - j : h - j + d;

		if ( r <= 2 ) {
			continue;
		}

		const u = nbrs[ h ];
		Q[ nfound ].z = u;
		Q[ nfound ].xi = u > ring ? cfg.degree( u ) : 0;
		Q[ nfound ].u = nbrs[ h === d - 1 ? 0 : h + 1 ];
		Q[ nfound ].v = v;
		nfound++;

		for ( let g = h === 0 ? d - 1 : h - 1; g !== j; g = g === 0 ? d - 1 : g - 1 ) {
			const t = nbrs[ g ];

			if ( t <= ring || found[ t ] ) {
				throw new Error( "Error in getQuestion" );
			}

			Q[ nfound ].z = t;
			Q[ nfound ].xi = t > ring ? cfg.degree( t ) : 0;
			Q[ nfound ].u = Q[ nfound - 1 ].z;
			Q[ nfound ].v = v;
			nfound++;
			found[ t ] = 1;
		}
	}

	Q[ nfound ].u = -1;
	return Q;
}

/**
 * Start of Radius port. The C code mutates row-0 metadata in the matrix.
 * For JS we compute BFS radius from the ring and return per-vertex depth.
 */
export function radiusCheck( cfg ) {
	const verts = cfg.vertexCount;
	const ring = cfg.ringSize;
	const reached = new Array( verts + 1 ).fill( 0 );

	for ( let u = ring + 1; u <= verts; u++ ) {
		for ( let v = ring + 1; v <= verts; v++ ) {
			reached[ v ] = 0;
		}

		reached[ u ] = 1;

		for ( const v of cfg.neighbors( u ) ) {
			reached[ v ] = 1;

			if ( v > ring ) {
				for ( const w of cfg.neighbors( v ) ) {
					reached[ w ] = 1;
				}
			}
		}

		let ok = true;

		for ( let v = ring + 1; v <= verts; v++ ) {
			if ( !reached[ v ] ) {
				ok = false;
				break;
			}
		}

		if ( ok ) {
			return true;
		}
	}

	throw new Error( "A configuration does not have radius at most two" );
}

export function getAdjmat( axle ) {
	const deg = axle.low[ 0 ];
	const adjmat = Array.from( { length: CARTVERT }, () => new Array( CARTVERT ).fill( -1 ) );

	for ( let i = 1; i <= deg; i++ ) {
		const h = i === 1 ? deg : i - 1;
		adjmat[ 0 ][ h ] = i;
		adjmat[ i ][ 0 ] = h;
		adjmat[ h ][ i ] = 0;
		const a = deg + h;
		adjmat[ i ][ h ] = a;
		adjmat[ a ][ i ] = h;
		adjmat[ h ][ a ] = i;

		if ( axle.upp[ i ] < 9 ) {
			doFan(
				deg, i, axle.upp[ i ], adjmat
			);
		}
	}

	return adjmat;
}

export function doFan(
	deg, i, k, adjmat
) {
	const a = i === 1 ? 2 * deg : deg + i - 1;
	const b = deg + i;

	if ( k === 5 ) {
		adjmat[ i ][ a ] = b;
		adjmat[ a ][ b ] = i;
		adjmat[ b ][ i ] = a;
		return;
	}

	const c = 2 * deg + i;
	adjmat[ i ][ a ] = c;
	adjmat[ a ][ c ] = i;
	adjmat[ c ][ i ] = a;

	if ( k === 6 ) {
		adjmat[ i ][ c ] = b;
		adjmat[ c ][ b ] = i;
		adjmat[ b ][ i ] = c;
		return;
	}

	const d = 3 * deg + i;
	adjmat[ i ][ c ] = d;
	adjmat[ c ][ d ] = i;
	adjmat[ d ][ i ] = c;

	if ( k === 7 ) {
		adjmat[ i ][ d ] = b;
		adjmat[ d ][ b ] = i;
		adjmat[ b ][ i ] = d;
		return;
	}

	const e = 4 * deg + i;
	adjmat[ i ][ d ] = e;
	adjmat[ d ][ e ] = i;
	adjmat[ e ][ i ] = d;
	adjmat[ i ][ e ] = b;
	adjmat[ e ][ b ] = i;
	adjmat[ b ][ i ] = e;
}

export function addToEdgelist(
	edgelist, u, v, degree
) {
	const a = degree[ u ];
	const b = degree[ v ];

	if ( a >= b && b <= 8 && a <= 11 && ( a <= 8 || u === 0 ) ) {
		const e = edgelist[ a ][ b ];

		if ( e.length + 2 >= MAXELIST ) {
			throw new Error( "More than MAXELIST entries in edgelist needed" );
		}

		e.push( u, v );
	}

	if ( b >= a && a <= 8 && b <= 11 && ( b <= 8 || v === 0 ) ) {
		const e = edgelist[ b ][ a ];

		if ( e.length + 2 >= MAXELIST ) {
			throw new Error( "More than MAXELIST entries in edgelist needed" );
		}

		e.push( v, u );
	}
}

export function getEdgelist( axle ) {
	const deg = axle.upp[ 0 ];
	const edgelist = Array.from( { length: 12 }, () => Array.from( { length: 9 }, () => [] ) );

	for ( let i = 1; i <= deg; i++ ) {
		addToEdgelist(
			edgelist, 0, i, axle.upp
		);
		const h = i === 1 ? deg : i - 1;
		addToEdgelist(
			edgelist, i, h, axle.upp
		);
		const a = deg + h;
		const b = deg + i;
		addToEdgelist(
			edgelist, i, a, axle.upp
		);
		addToEdgelist(
			edgelist, i, b, axle.upp
		);

		if ( axle.low[ i ] !== axle.upp[ i ] ) {
			continue;
		}

		if ( axle.upp[ i ] === 5 ) {
			addToEdgelist(
				edgelist, a, b, axle.upp
			);
			continue;
		}

		const c = 2 * deg + i;
		addToEdgelist(
			edgelist, a, c, axle.upp
		);
		addToEdgelist(
			edgelist, i, c, axle.upp
		);

		if ( axle.upp[ i ] === 6 ) {
			addToEdgelist(
				edgelist, b, c, axle.upp
			);
			continue;
		}

		const d = 3 * deg + i;
		addToEdgelist(
			edgelist, c, d, axle.upp
		);
		addToEdgelist(
			edgelist, i, d, axle.upp
		);

		if ( axle.upp[ i ] === 7 ) {
			addToEdgelist(
				edgelist, b, d, axle.upp
			);
			continue;
		}

		if ( axle.upp[ i ] !== 8 ) {
			throw new Error( "Unexpected error in getEdgelist" );
		}

		const e = 4 * deg + i;
		addToEdgelist(
			edgelist, d, e, axle.upp
		);
		addToEdgelist(
			edgelist, i, e, axle.upp
		);
		addToEdgelist(
			edgelist, b, e, axle.upp
		);
	}

	return edgelist;
}

export function rootedSubConf(
	degree, adjmat, question, x, y, clockwise
) {
	const used = new Array( CARTVERT ).fill( 0 );
	const image = new Array( CARTVERT ).fill( -1 );
	const deg = degree[ 0 ];
	image[ 0 ] = clockwise ? 1 : 0;
	image[ question[ 0 ].z ] = x;
	image[ question[ 1 ].z ] = y;
	used[ x ] = 1;
	used[ y ] = 1;

	for ( let qi = 2; qi < question.length && question[ qi ].u >= 0; qi++ ) {
		const Q = question[ qi ];
		const w = clockwise ? adjmat[ image[ Q.u ] ][ image[ Q.v ] ] : adjmat[ image[ Q.v ] ][ image[ Q.u ] ];

		if ( w === -1 ) {
			return null;
		}

		if ( Q.xi && Q.xi !== degree[ w ] ) {
			return null;
		}

		if ( used[ w ] ) {
			return null;
		}

		image[ Q.z ] = w;
		used[ w ] = 1;
	}

	for ( let j = 1; j <= deg; j++ ) {
		if ( !used[ j ] && used[ deg + j ] && used[ j === 1 ? 2 * deg : deg + j - 1 ] ) {
			return null;
		}
	}

	return image;
}

export function subConf(
	adjmat, degree, question, edgelist
) {
	const bucket = edgelist[ question[ 0 ].xi ][ question[ 1 ].xi ] || [];

	for ( let i = 0; i < bucket.length; i += 2 ) {
		const x = bucket[ i ];
		const y = bucket[ i + 1 ];
		let image = rootedSubConf(
			degree, adjmat, question, x, y, true
		);

		if ( image ) {
			return image;
		}

		image = rootedSubConf(
			degree, adjmat, question, x, y, false
		);

		if ( image ) {
			return image;
		}
	}

	return null;
}

export async function loadUnavoidableSet( path ) {
	const configs = await loadConfigurations( path );

	if ( configs.length > CONFS ) {
		throw new Error( `More than ${CONFS} configurations` );
	}

	return configs.map( ( cfg ) => {
		radiusCheck( cfg );
		return {
			cfg,
			question: getQuestion( cfg )
		};
	} );
}

export function reduceAxleDischarge( axle, unavoidableSet ) {
	const stack = [ axle.clone() ];

	while ( stack.length > 0 ) {
		const B = stack.pop();
		const adjmat = getAdjmat( B );
		const edgelist = getEdgelist( B );
		let found = null;

		for ( const item of unavoidableSet ) {
			const image = subConf(
				adjmat, B.upp, item.question, edgelist
			);

			if ( image ) {
				found = { item, image };
				break;
			}
		}

		if ( !found ) {
			return false;
		}

		const redverts = found.item.question[ 1 ].u;
		const redring = found.item.question[ 1 ].v;

		for ( let i = redring + 1; i <= redverts; i++ ) {
			const v = found.image[ i ];

			if ( v == null || v < 0 ) {
				continue;
			}

			if ( B.low[ v ] === B.upp[ v ] ) {
				continue;
			}

			const next = B.clone();
			next.upp[ v ] = B.upp[ v ] - 1;
			stack.push( next );
		}
	}

	return true;
}

export async function reduceConfigurationDischarge( path, configName ) {
	void path;
	void configName;
	throw new Error( "Discharge reducibility works on presentation-derived axles, not on a configuration alone. Use loadUnavoidableSet() together with reduceAxleDischarge() on a valid axle." );
}

// ---------------------------------------------------------------------------
// Reduce-side start (A)
// ---------------------------------------------------------------------------

// C: power[i] = 3^(i-1) for i>0
export function buildPowerTable( maxRing = MAXRING ) {
	const power = new Array( maxRing + 2 ).fill( 0 );
	power[ 1 ] = 1;

	for ( let i = 2; i <= maxRing + 1; i++ ) {
		power[ i ] = 3 * power[ i - 1 ];
	}

	return power;
}

export function numberOfCodesForRing( ring, power = buildPowerTable() ) {
	return power[ ring ] + 1 >> 1;
}

/**
 * Exact edge list extraction from cyclic adjacency.
 * Used as the first step toward findangles().
 */
export function enumerateUndirectedEdges( cfg ) {
	const seen = new Set();
	const edges = [];

	for ( let u = 1; u <= cfg.vertexCount; u++ ) {
		for ( const v of cfg.neighbors( u ) ) {
			const a = Math.min( u, v );
			const b = Math.max( u, v );
			const key = `${a}:${b}`;

			if ( !seen.has( key ) ) {
				seen.add( key );
				edges.push( {
					id: edges.length + 1, u: a, v: b
				} );
			}
		}
	}

	if ( edges.length >= EDGES ) {
		throw new Error( `Too many edges (${edges.length}) for EDGES=${EDGES}` );
	}

	return edges;
}

export function inInterval( grav, done ) {
	const d = grav.degree;
	const nbrs = grav.neighbors;

	let first = 0;

	while ( first < d - 1 && !done[ nbrs[ first ] ] ) {
		first++;
	}

	if ( first === d - 1 ) {
		return done[ nbrs[ d - 1 ] ] ? 1 : 0;
	}

	let last = first;

	while ( last < d - 1 && done[ nbrs[ last + 1 ] ] ) {
		last++;
	}

	let length = last - first + 1;

	if ( last === d - 1 ) {
		return length;
	}

	if ( first > 0 ) {
		for ( let j = last + 2; j < d; j++ ) {
			if ( done[ nbrs[ j ] ] ) {
				return 0;
			}
		}

		return length;
	}

	let worried = false;

	for ( let j = last + 2; j < d; j++ ) {
		if ( done[ nbrs[ j ] ] ) {
			length++;
			worried = true;
		} else if ( worried ) {
			return 0;
		}
	}

	return length;
}

export function stripConfiguration( cfg ) {
	const verts = cfg.vertexCount;
	const ring = cfg.ringSize;
	const edgeno = Array.from( { length: verts + 1 }, () => new Array( verts + 1 ).fill( 0 ) );

	for ( let v = 1; v <= ring; v++ ) {
		const u = v > 1 ? v - 1 : ring;
		edgeno[ u ][ v ] = v;
		edgeno[ v ][ u ] = v;
	}

	const done = new Array( verts + 1 ).fill( 0 );
	let term = 3 * ( verts - 1 ) - ring;

	for ( let x = ring + 1; x <= verts; x++ ) {
		let maxint = 0;
		let maxes = [];

		for ( let v = ring + 1; v <= verts; v++ ) {
			if ( done[ v ] ) {
				continue;
			}

			const inter = inInterval( cfg.getVertex( v ), done );

			if ( inter > maxint ) {
				maxint = inter;
				maxes = [ v ];
			} else if ( inter === maxint ) {
				maxes.push( v );
			}
		}

		let maxdeg = 0;
		let best = maxes[ 0 ];

		for ( const v of maxes ) {
			const d = cfg.degree( v );

			if ( d > maxdeg ) {
				maxdeg = d;
				best = v;
			}
		}

		const grav = cfg.getVertex( best );
		const d = grav.degree;
		let first = 0;
		let previous = done[ grav.neighbors[ d - 1 ] ];

		while ( previous || !done[ grav.neighbors[ first ] ] ) {
			previous = done[ grav.neighbors[ first++ ] ];

			if ( first >= d ) {
				first = 0;
				break;
			}
		}

		for ( let h = first; done[ grav.neighbors[ h ] ]; h++ ) {
			const u = grav.neighbors[ h ];
			edgeno[ best ][ u ] = term;
			edgeno[ u ][ best ] = term;
			term--;

			if ( h === d - 1 ) {
				if ( first === 0 ) {
					break;
				}

				h = -1;
			}
		}

		done[ best ] = 1;
	}

	for ( let x = 1; x <= ring; x++ ) {
		let maxint = 0;
		let best = 1;

		for ( let v = 1; v <= ring; v++ ) {
			if ( done[ v ] ) {
				continue;
			}

			const u = v > 1 ? v - 1 : ring;
			const w = v < ring ? v + 1 : 1;
			const inter = 3 * cfg.degree( v ) + 4 * ( ( done[ u ] ? 1 : 0 ) + ( done[ w ] ? 1 : 0 ) );

			if ( inter > maxint ) {
				maxint = inter;
				best = v;
			}
		}

		const grav = cfg.getVertex( best );
		const u = best > 1 ? best - 1 : ring;

		if ( done[ u ] ) {
			for ( let h = grav.degree - 2; h >= 1; h-- ) {
				const w = grav.neighbors[ h ];
				edgeno[ best ][ w ] = term;
				edgeno[ w ][ best ] = term;
				term--;
			}
		} else {
			for ( let h = 1; h < grav.degree - 1; h++ ) {
				const w = grav.neighbors[ h ];
				edgeno[ best ][ w ] = term;
				edgeno[ w ][ best ] = term;
				term--;
			}
		}

		done[ best ] = 1;
	}

	return edgeno;
}

export function findAnglesSeed( cfg ) {
	const edges = 3 * cfg.vertexCount - 3 - cfg.ringSize;

	if ( edges >= EDGES ) {
		throw new Error( `Configuration has more than ${EDGES - 1} edges` );
	}

	const edgeno = stripConfiguration( cfg );
	const angle = Array.from( { length: EDGES }, () => [ 0, 0, 0, 0, 0 ] );
	const diffangle = Array.from( { length: EDGES }, () => [ 0, 0, 0, 0, 0 ] );
	const sameangle = Array.from( { length: EDGES }, () => [ 0, 0, 0, 0, 0 ] );
	const contract = new Array( EDGES + 1 ).fill( 0 );

	contract[ 0 ] = cfg.contractPairs.length;

	if ( contract[ 0 ] < 0 || contract[ 0 ] > 4 ) {
		throw new Error( "*** ERROR: INVALID CONTRACT ***" );
	}

	contract[ EDGES ] = cfg.maxContractSubset;

	for ( const [ u, v ] of cfg.contractPairs ) {
		if ( u < 1 || u > cfg.vertexCount || v < 1 || v > cfg.vertexCount ) {
			throw new Error( "*** ERROR: ILLEGAL CONTRACT ***" );
		}

		if ( edgeno[ u ][ v ] < 1 ) {
			throw new Error( "*** ERROR: CONTRACT CONTAINS NON-EDGE ***" );
		}

		contract[ edgeno[ u ][ v ] ] = 1;
	}

	for ( let i = 1; i <= cfg.ringSize; i++ ) {
		if ( contract[ i ] ) {
			throw new Error( "*** ERROR: CONTRACT IS NOT SPARSE ***" );
		}
	}

	angle[ 0 ][ 0 ] = diffangle[ 0 ][ 0 ] = cfg.vertexCount;
	angle[ 0 ][ 1 ] = diffangle[ 0 ][ 1 ] = cfg.ringSize;
	angle[ 0 ][ 2 ] = diffangle[ 0 ][ 2 ] = edges;

	for ( let v = 1; v <= cfg.vertexCount; v++ ) {
		const gv = cfg.getVertex( v );

		for ( let h = 0; h < gv.degree; h++ ) {
			if ( v <= cfg.ringSize && h === gv.degree - 1 ) {
				continue;
			}

			const i = h < gv.degree - 1 ? h + 1 : 0;
			const u = gv.neighbors[ h ];
			const w = gv.neighbors[ i ];
			const a = edgeno[ v ][ w ];
			const b = edgeno[ u ][ w ];
			const c = edgeno[ u ][ v ];

			if ( contract[ a ] && contract[ b ] ) {
				throw new Error( "*** ERROR: CONTRACT IS NOT SPARSE ***" );
			}

			if ( a > c ) {
				angle[ c ][ ++angle[ c ][ 0 ] ] = a;

				if ( !contract[ a ] && !contract[ b ] && !contract[ c ] ) {
					diffangle[ c ][ ++diffangle[ c ][ 0 ] ] = a;
				}

				if ( contract[ b ] ) {
					sameangle[ c ][ ++sameangle[ c ][ 0 ] ] = a;
				}
			}

			if ( b > c ) {
				angle[ c ][ ++angle[ c ][ 0 ] ] = b;

				if ( !contract[ a ] && !contract[ b ] && !contract[ c ] ) {
					diffangle[ c ][ ++diffangle[ c ][ 0 ] ] = b;
				}

				if ( contract[ a ] ) {
					sameangle[ c ][ ++sameangle[ c ][ 0 ] ] = b;
				}
			}
		}
	}

	if ( contract[ 0 ] >= 4 ) {
		let triadFound = false;

		for ( let v = cfg.ringSize + 1; v <= cfg.vertexCount; v++ ) {
			let a = 0;

			for ( const u of cfg.neighbors( v ) ) {
				for ( let j = 0; j < cfg.contractPairs.length; j++ ) {
					const [ x, y ] = cfg.contractPairs[ j ];

					if ( u === x || u === y ) {
						a++;
						break;
					}
				}
			}

			if ( a < 3 ) {
				continue;
			}

			if ( cfg.degree( v ) >= 6 ) {
				triadFound = true;
				break;
			}

			const neighbour = new Array( cfg.vertexCount + 1 ).fill( 0 );

			for ( const u of cfg.neighbors( v ) ) {
				neighbour[ u ] = 1;
			}

			let allCovered = true;

			for ( const [ x, y ] of cfg.contractPairs ) {
				if ( !neighbour[ x ] || !neighbour[ y ] ) {
					allCovered = false;
					break;
				}
			}

			if ( allCovered ) {
				triadFound = true;
				break;
			}
		}

		if ( !triadFound ) {
			throw new Error( "*** ERROR: CONTRACT HAS NO TRIAD ***" );
		}
	}

	return {
		angle, diffangle, sameangle, contract, edgeno, edges
	};
}

export function makeInitialLiveSet( ring, power = buildPowerTable() ) {
	const n = numberOfCodesForRing( ring, power );
	return new Uint8Array( n ).fill( 1 );
}

export function recordColoring(
	col, power, ring, angle, live, state
) {
	const weight = [ 0, 0, 0, 0, 0 ];

	for ( let i = 1; i <= ring; i++ ) {
		const sum = 7 - col[ angle[ i ][ 1 ] ] - col[ angle[ i ][ 2 ] ];
		weight[ sum ] += power[ i ];
	}

	let min = weight[ 4 ];
	let max = weight[ 4 ];

	for ( let i = 1; i <= 2; i++ ) {
		const w = weight[ i ];

		if ( w < min ) {
			min = w;
		} else if ( w > max ) {
			max = w;
		}
	}

	const colno = state.bigno - 2 * min - max;

	if ( live[ colno ] ) {
		state.extent++;
		live[ colno ] = 0;
	}
}

export function inLiveColoring(
	col, power, ring, live, bigno
) {
	const weight = [ 0, 0, 0, 0, 0 ];

	for ( let i = 1; i <= ring; i++ ) {
		weight[ col[ i ] ] += power[ i ];
	}

	let min = weight[ 4 ];
	let max = weight[ 4 ];

	for ( let i = 1; i <= 2; i++ ) {
		const w = weight[ i ];

		if ( w < min ) {
			min = w;
		} else if ( w > max ) {
			max = w;
		}
	}

	const colno = bigno - 2 * min - max;
	return !!live[ colno ];
}

export function findLiveSeed( cfg, power = buildPowerTable() ) {
	const { angle } = findAnglesSeed( cfg );
	const ring = cfg.ringSize;
	const edges = angle[ 0 ][ 2 ];
	const ncodes = numberOfCodesForRing( ring, power );
	const bigno = power[ ring + 1 ] - 1 >> 1;
	const live = new Uint8Array( ncodes ).fill( 1 );
	const c = new Array( EDGES ).fill( 0 );
	const forbidden = new Array( EDGES ).fill( 0 );

	c[ edges ] = 1;
	let j = edges - 1;
	c[ j ] = 2;
	forbidden[ j ] = 5;
	const state = { extent: 0, bigno };

	while ( true ) {
		while ( forbidden[ j ] & c[ j ] ) {
			c[ j ] <<= 1;

			while ( c[ j ] & 8 ) {
				if ( j >= edges - 1 ) {
					return {
						ring,
						live,
						nlive:  ncodes - state.extent,
						power,
						angle,
						bigno,
						extent: state.extent
					};
				}

				c[ ++j ] <<= 1;
			}
		}

		if ( j === ring + 1 ) {
			recordColoring(
				c, power, ring, angle, live, state
			);
			c[ j ] <<= 1;

			while ( c[ j ] & 8 ) {
				if ( j >= edges - 1 ) {
					return {
						ring,
						live,
						nlive:  ncodes - state.extent,
						power,
						angle,
						bigno,
						extent: state.extent
					};
				}

				c[ ++j ] <<= 1;
			}
		} else {
			const am = angle[ --j ];
			c[ j ] = 1;
			let u = 0;

			for ( let i = 1; i <= am[ 0 ]; i++ ) {
				u |= c[ am[ i ] ];
			}

			forbidden[ j ] = u;
		}
	}
}

export function updateLive( state ) {
	const { live } = state;
	let newnlive = 0;

	if ( live[ 0 ] > 1 ) {
		live[ 0 ] = 15;
	}

	for ( let i = 0; i < live.length; i++ ) {
		if ( live[ i ] !== 15 ) {
			live[ i ] = 0;
		} else {
			newnlive++;
			live[ i ] = 1;
		}
	}

	const changed = newnlive < state.nlive && newnlive > 0;
	state.nlive = newnlive;
	return changed;
}

export const updateLiveStub = updateLive;

export function stillReal(
	col, choice, depth, live, on
) {
	const sum = new Array( 128 ).fill( 0 );
	const twisted = [];
	const untwisted = [];

	if ( col < 0 ) {
		if ( !live[ -col ] ) {
			return 0;
		}

		twisted.push( -col );
		sum[ 0 ] = col;
	} else {
		if ( !live[ col ] ) {
			return 0;
		}

		untwisted.push( col );
		sum[ 0 ] = col;
	}

	for ( let i = 2, twopower = 1, mark = 1; i <= depth; i++, twopower <<= 1 ) {
		const c = choice[ i ];

		for ( let j = 0; j < twopower; j++, mark++ ) {
			const b = sum[ j ] - c;

			if ( b < 0 ) {
				if ( !live[ -b ] ) {
					return 0;
				}

				twisted.push( -b );
				sum[ mark ] = b;
			} else {
				if ( !live[ b ] ) {
					return 0;
				}

				untwisted.push( b );
				sum[ mark ] = b;
			}
		}
	}

	if ( on ) {
		for ( const idx of twisted ) {
			live[ idx ] |= 8;
		}

		for ( const idx of untwisted ) {
			live[ idx ] |= 4;
		}
	} else {
		for ( const idx of twisted ) {
			live[ idx ] |= 2;
		}

		for ( const idx of untwisted ) {
			live[ idx ] |= 2;
		}
	}

	return 1;
}

export function checkReality(
	depth, weight, live, real, state, ring, basecol, on
) {
	const nbits = 1 << depth - 1;

	for ( let k = 0; k < nbits; k++, state.bit <<= 1 ) {
		if ( !state.bit ) {
			state.bit = 1;
			state.realterm++;

			if ( state.realterm > state.nchar ) {
				throw new Error( `More than ${state.nchar + 1} entries in real are needed` );
			}
		}

		if ( !( state.bit & real[ state.realterm ] ) ) {
			continue;
		}

		let col = basecol;
		let parity = ring & 1;
		const choice = new Array( 8 ).fill( 0 );
		let left = k;

		for ( let i = 1; i < depth; i++, left >>= 1 ) {
			if ( left & 1 ) {
				parity ^= 1;
				choice[ i ] = weight[ i ][ 1 ];
				col += weight[ i ][ 3 ];
			} else {
				choice[ i ] = weight[ i ][ 0 ];
				col += weight[ i ][ 2 ];
			}
		}

		if ( parity ) {
			choice[ depth ] = weight[ depth ][ 1 ];
			col += weight[ depth ][ 3 ];
		} else {
			choice[ depth ] = weight[ depth ][ 0 ];
			col += weight[ depth ][ 2 ];
		}

		if ( !stillReal(
			col, choice, depth, live, on
		) ) {
			real[ state.realterm ] ^= state.bit;
		} else {
			state.nreal++;
		}
	}
}

export function augmentMatching(
	n, interval, depth, weight, matchweight, live, real, state, ring, basecol, on
) {
	checkReality(
		depth, weight, live, real, state, ring, basecol, on
	);
	depth++;

	for ( let r = 1; r <= n; r++ ) {
		const lower = interval[ 2 * r - 1 ];
		const upper = interval[ 2 * r ];

		for ( let i = lower + 1; i <= upper; i++ ) {
			for ( let j = lower; j < i; j++ ) {
				weight[ depth ] = matchweight[ i ][ j ];
				const newinterval = new Array( 10 ).fill( 0 );
				let h = 1;

				while ( h < 2 * r - 1 ) {
					newinterval[ h ] = interval[ h ];
					h++;
				}

				let newn = r - 1;

				if ( j > lower + 1 ) {
					newn++;
					newinterval[ h++ ] = lower;
					newinterval[ h++ ] = j - 1;
				}

				if ( i > j + 1 ) {
					newn++;
					newinterval[ h++ ] = j + 1;
					newinterval[ h++ ] = i - 1;
				}

				augmentMatching(
					newn, newinterval, depth, weight, matchweight, live, real, state, ring, basecol, on
				);
			}
		}
	}
}

export function testMatch(
	ring, real, power, live, nchar
) {
	const interval = new Array( 10 ).fill( 0 );
	const weight = new Array( 8 ).fill( null );
	const matchweight = Array.from( { length: MAXRING + 1 }, () =>
		Array.from( { length: MAXRING + 1 }, () => new Array( 4 ).fill( 0 ) ) );
	const state = {
		nreal: 0, bit: 1, realterm: 0, nchar
	};

	for ( let a = 2; a <= ring; a++ ) {
		for ( let b = 1; b < a; b++ ) {
			const mw = matchweight[ a ][ b ];
			mw[ 0 ] = 2 * ( power[ a ] + power[ b ] );
			mw[ 1 ] = 2 * ( power[ a ] - power[ b ] );
			mw[ 2 ] = power[ a ] + power[ b ];
			mw[ 3 ] = power[ a ] - power[ b ];
		}
	}

	for ( let a = 2; a < ring; a++ ) {
		for ( let b = 1; b < a; b++ ) {
			let n = 0;
			weight[ 1 ] = matchweight[ a ][ b ];

			if ( b >= 3 ) {
				n = 1;
				interval[ 1 ] = 1;
				interval[ 2 ] = b - 1;
			}

			if ( a >= b + 3 ) {
				n++;
				interval[ 2 * n - 1 ] = b + 1;
				interval[ 2 * n ] = a - 1;
			}

			augmentMatching(
				n, interval, 1, weight, matchweight, live, real, state, ring, 0, 0
			);
		}
	}

	for ( let a = 2; a <= ring; a++ ) {
		for ( let b = 1; b < a; b++ ) {
			const mw = matchweight[ a ][ b ];
			mw[ 0 ] = power[ a ] + power[ b ];
			mw[ 1 ] = power[ a ] - power[ b ];
			mw[ 2 ] = -power[ a ] - power[ b ];
			mw[ 3 ] = -power[ a ] - 2 * power[ b ];
		}
	}

	for ( let b = 1; b < ring; b++ ) {
		let n = 0;
		weight[ 1 ] = matchweight[ ring ][ b ];

		if ( b >= 3 ) {
			n = 1;
			interval[ 1 ] = 1;
			interval[ 2 ] = b - 1;
		}

		if ( ring >= b + 3 ) {
			n++;
			interval[ 2 * n - 1 ] = b + 1;
			interval[ 2 * n ] = ring - 1;
		}

		augmentMatching(
			n, interval, 1, weight, matchweight, live, real, state, ring, power[ ring + 1 ] - 1 >> 1, 1
		);
	}

	return state.nreal;
}

export function checkContractExact(
	live, nlive, diffangle, sameangle, contract, power
) {
	if ( !nlive ) {
		if ( !contract[ 0 ] ) {
			return true;
		}

		throw new Error( "*** ERROR: CONTRACT PROPOSED ***" );
	}

	if ( !contract[ 0 ] ) {
		throw new Error( "*** ERROR: NO CONTRACT PROPOSED ***" );
	}

	if ( nlive !== contract[ EDGES ] ) {
		throw new Error( "*** ERROR: DISCREPANCY IN EXTERIOR SIZE ***" );
	}

	const ring = diffangle[ 0 ][ 1 ];
	const bigno = power[ ring + 1 ] - 1 >> 1;
	let start = diffangle[ 0 ][ 2 ];

	while ( contract[ start ] ) {
		start--;
	}

	const c = new Array( EDGES ).fill( 0 );
	const forbidden = new Array( EDGES ).fill( 0 );
	c[ start ] = 1;
	let j = start;

	while ( contract[ --j ] ) {}

	let dm = diffangle[ j ];
	let sm = sameangle[ j ];
	c[ j ] = 1;
	let u = 4;

	for ( let i = 1; i <= dm[ 0 ]; i++ ) {
		u |= c[ dm[ i ] ];
	}

	for ( let i = 1; i <= sm[ 0 ]; i++ ) {
		u |= ~c[ sm[ i ] ];
	}

	forbidden[ j ] = u;

	for ( ;; ) {
		while ( forbidden[ j ] & c[ j ] ) {
			c[ j ] <<= 1;

			while ( c[ j ] & 8 ) {
				while ( contract[ ++j ] ) {}

				if ( j >= start ) {
					return true;
				}

				c[ j ] <<= 1;
			}
		}

		if ( j === 1 ) {
			if ( inLiveColoring(
				c, power, ring, live, bigno
			) ) {
				throw new Error( "*** ERROR: INPUT CONTRACT IS INCORRECT ***" );
			}

			c[ j ] <<= 1;

			while ( c[ j ] & 8 ) {
				while ( contract[ ++j ] ) {}

				if ( j >= start ) {
					return true;
				}

				c[ j ] <<= 1;
			}

			continue;
		}

		while ( contract[ --j ] ) {}

		dm = diffangle[ j ];
		sm = sameangle[ j ];
		c[ j ] = 1;
		u = 0;

		for ( let i = 1; i <= dm[ 0 ]; i++ ) {
			u |= c[ dm[ i ] ];
		}

		for ( let i = 1; i <= sm[ 0 ]; i++ ) {
			u |= ~c[ sm[ i ] ];
		}

		forbidden[ j ] = u;
	}
}

export function reduceConfigurationSeed( cfg, options = {} ) {
	const power = options.power ?? buildPowerTable();

	if ( cfg.ringSize > MAXRING ) {
		throw new Error( `Ring-size bigger than ${MAXRING}` );
	}

	const {
		angle, diffangle, sameangle, contract
	} = findAnglesSeed( cfg );
	const ring = cfg.ringSize;
	const ncodes = numberOfCodesForRing( ring, power );
	const state = findLiveSeed( cfg, power );

	const simatchnumber = [ 0, 0, 1, 3, 10, 30, 95, 301, 980, 3228, 10797, 36487, 124542, 428506, 1485003, 5178161, 18155816 ];
	const nchar = Math.floor( simatchnumber[ ring ] / 8 ) + 2;
	const real = new Uint8Array( nchar + 1 ).fill( 255 );

	do {
		testMatch(
			ring, real, power, state.live, nchar
		);
	} while ( updateLive( state ) );

	checkContractExact(
		state.live, state.nlive, diffangle, sameangle, contract, power
	);

	return {
		configName: cfg.name,
		ring,
		ncodes,
		nlive:      state.nlive,
		extent:     state.extent,
		status:     state.nlive === 0 ? "D-reducible" : "not-D-reducible"
	};
}

export async function reduceAllSeed( path ) {
	const configs = await loadConfigurations( path );
	return configs.map( ( cfg ) => reduceConfigurationSeed( cfg ) );
}

// ---------------------------------------------------------------------------
// CLI helpers
// ---------------------------------------------------------------------------

async function cli() {
	if ( typeof process === "undefined" || !Array.isArray( process.argv ) ) {
		return;
	}

	const [ , , cmd, inputPath, outputPath ] = process.argv;

	if ( !cmd || !inputPath ) {
		return;
	}

	const fs = await getNodeFs();

	if ( cmd === "parse" ) {
		const cfgs = await loadConfigurations( inputPath );
		const out = cfgs.map( ( c ) => c.toJSON() );

		if ( outputPath ) {
			await fs.writeFile(
				outputPath, JSON.stringify(
					out, null, 2
				), "utf8"
			);
		} else {
			console.log( JSON.stringify(
				out.slice( 0, 3 ), null, 2
			) );
			console.log( `Parsed ${cfgs.length} configurations.` );
		}

		return;
	}

	if ( cmd === "seed-reduce" ) {
		const results = await reduceAllSeed( inputPath );

		if ( outputPath ) {
			await fs.writeFile(
				outputPath, JSON.stringify(
					results, null, 2
				), "utf8"
			);
		} else {
			console.log( JSON.stringify(
				results.slice( 0, 10 ), null, 2
			) );
		}
	}
}

if ( typeof process !== "undefined" && Array.isArray( process.argv ) && import.meta.url === `file://${process.argv[ 1 ]}` ) {
	cli().catch( ( err ) => {
		console.error( err );

		if ( typeof process.exit === "function" ) {
			process.exit( 1 );
		}
	} );
}
