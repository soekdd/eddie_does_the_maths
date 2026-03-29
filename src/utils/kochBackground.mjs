const SVG_NS = "http://www.w3.org/2000/svg";
const DEFAULT_MAX_DEPTH = 5;
const DEFAULT_POINTS_PER_FRAME = 2;
const DEFAULT_VIEWBOX_WIDTH = 80;
const DEFAULT_VIEWBOX_HEIGHT = 1200;

function splitSegment( a, b ) {
	const dx = ( b.x - a.x ) / 3;
	const dy = ( b.y - a.y ) / 3;
	const p1 = {
		x: a.x + dx,
		y: a.y + dy
	};
	const p3 = {
		x: a.x + 2 * dx,
		y: a.y + 2 * dy
	};
	const angle = Math.atan2( dy, dx ) + Math.PI / 3;
	const len = Math.hypot( dx, dy );
	const p2 = {
		x: p1.x + Math.cos( angle ) * len,
		y: p1.y + Math.sin( angle ) * len
	};

	return [ a, p1, p2, p3, b ];
}

function buildKochState(
	start, end, maxDepth
) {
	return {
		points: [ start ],
		stack:  [
			{
				a:     start,
				b:     end,
				depth: maxDepth
			}
		]
	};
}

function pointsToPathD( points ) {
	return points
		.map( ( p, idx ) => `${idx === 0 ? "M" : "L"}${p.x.toFixed( 2 )} ${p.y.toFixed( 2 )}` )
		.join( " " );
}

function createHost() {
	const host = document.createElement( "div" );
	host.className = "koch-bg";
	return host;
}

function createSvg( viewboxWidth, viewboxHeight ) {
	const svg = document.createElementNS( SVG_NS, "svg" );
	svg.setAttribute( "viewBox", `0 0 ${viewboxWidth} ${viewboxHeight}` );
	svg.setAttribute( "aria-hidden", "true" );
	return svg;
}

function createPath() {
	const path = document.createElementNS( SVG_NS, "path" );
	path.setAttribute( "d", "" );
	path.setAttribute( "fill", "none" );
	path.setAttribute( "stroke",
		window.matchMedia( "(prefers-color-scheme: dark)" ).matches ?
			"rgba(125, 211, 252, 0.72)" :
			"rgba(37, 99, 235, 0.62)" );
	path.setAttribute( "stroke-width", "1.8" );
	path.setAttribute( "stroke-linecap", "round" );
	path.setAttribute( "stroke-linejoin", "round" );
	return path;
}

export function mountKochBackground( options = {} ) {
	const {
		maxDepth = DEFAULT_MAX_DEPTH,
		pointsPerFrame = DEFAULT_POINTS_PER_FRAME,
		viewboxWidth = DEFAULT_VIEWBOX_WIDTH,
		viewboxHeight = DEFAULT_VIEWBOX_HEIGHT,
		start = { x: 220, y: 20 },
		end = { x: 220, y: 1180 }
	} = options;

	const host = createHost();
	const svg = createSvg( viewboxWidth, viewboxHeight );
	const path = createPath();

	svg.append( path );
	host.append( svg );
	document.body.append( host );

	const state = buildKochState(
		start, end, maxDepth
	);

	const grow = () => {
		let addedInFrame = 0;

		while ( state.stack.length > 0 && addedInFrame < pointsPerFrame ) {
			const seg = state.stack.pop();

			if ( seg.depth === 0 ) {
				state.points.push( seg.b );
				addedInFrame += 1;
				continue;
			}

			const [ , p1, p2, p3 ] = splitSegment( seg.a, seg.b );
			const nextDepth = seg.depth - 1;

			state.stack.push(
				{
					a:     p3,
					b:     seg.b,
					depth: nextDepth
				},
				{
					a:     p2,
					b:     p3,
					depth: nextDepth
				},
				{
					a:     p1,
					b:     p2,
					depth: nextDepth
				},
				{
					a:     seg.a,
					b:     p1,
					depth: nextDepth
				}
			);
		}

		path.setAttribute( "d", pointsToPathD( state.points ) );

		if ( state.stack.length > 0 ) {
			requestAnimationFrame( grow );
		}
	};

	requestAnimationFrame( grow );

	return {
		host,
		svg,
		path
	};
}

export function mountKochBackgroundWhenReady( options = {} ) {
	if ( document.readyState === "loading" ) {
		document.addEventListener(
			"DOMContentLoaded", () => mountKochBackground( options ), { once: true }
		);
		return;
	}

	mountKochBackground( options );
}
