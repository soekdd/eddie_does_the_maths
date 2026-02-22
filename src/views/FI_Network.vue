<template>
<div class="fin-network" :class="{ 'fin-network--interactive': props.interactiveMode }">
	<div v-if="props.interactiveMode" class="toolbar">
		<label class="modeCtrl">
			<span>Transformation</span>
			<select v-model="transformMode" class="modeSelect">
				<option value="none">Keine</option>
				<option value="powerN">z ↦ z³</option>
				<option value="expScaled">z ↦ exp(0.85z)</option>
				<option value="sinScaled">z ↦ z + 1.15·sin(1.8z)</option>
				<option value="mobius">Möbius (Sog)</option>
				<option value="joukowski">Joukowski (mild)</option>
				<option value="weierstrass">z + 0.95·sin(2.2z)</option>
			</select>
		</label>

		<label class="modeCtrl">
			<span>Beschriftung</span>
			<select v-model="labelMode" class="modeSelect">
				<option value="none">Keine</option>
				<option value="abbr">Abkürzungen</option>
				<option value="name">Ortsnamen</option>
			</select>
		</label>

		<label class="modeCtrl">
			<span>Labelgröße</span>
			<input
				v-model.number="svgFontSizePx"
				class="sizeInput"
				max="80"
				min="6"
				step="1"
				type="number"
			/>
		</label>

		<label class="modeCtrl modeCtrl--check">
			<input v-model="showComplexPlane" type="checkbox" />
			<span>Komplexe Ebene anzeigen</span>
		</label>

		<label class="modeCtrl modeCtrl--check">
			<input v-model="showDistraction" type="checkbox" />
			<span>Distraction-Overlay</span>
		</label>

		<div class="transformFormula">
			<p class="transformFormulaTitle">Gewählte Abbildung</p>
			<Katex as="div" display :tex="selectedTransformTex" />
		</div>

		<p v-if="networkNote" class="note note--toolbar">
			{{ networkNote }}
		</p>
	</div>

	<div class="svgWrap">
		<div aria-label="Kartenauswahl" class="mapButtons" role="group">
			<button
				v-for="option in mapOptions"
				:key="option.value"
				class="mapBtn"
				:class="{ active: activeMapKey === option.value }"
				type="button"
				@click="selectMap(option.value)"
			>
				{{ option.label }}
			</button>
		</div>

		<svg
			:aria-label="svgAriaLabel"
			class="svg"
			role="img"
			:style="svgStyleVars"
			:viewBox="`0 0 ${vb.w} ${vb.h}`"
		>
			<g v-if="showComplexPlane" class="complexPlane">
				<line
					v-for="line in reGridLines"
					:key="`re-grid-${line.value}`"
					class="gridLine"
					:x1="line.x1"
					:x2="line.x2"
					:y1="line.y1"
					:y2="line.y2"
				/>
				<line
					v-for="line in imGridLines"
					:key="`im-grid-${line.value}`"
					class="gridLine"
					:x1="line.x1"
					:x2="line.x2"
					:y1="line.y1"
					:y2="line.y2"
				/>

				<line
					v-if="realAxisLine"
					class="axisLine"
					:x1="realAxisLine.x1"
					:x2="realAxisLine.x2"
					:y1="realAxisLine.y1"
					:y2="realAxisLine.y2"
				/>
				<line
					v-if="imagAxisLine"
					class="axisLine"
					:x1="imagAxisLine.x1"
					:x2="imagAxisLine.x2"
					:y1="imagAxisLine.y1"
					:y2="imagAxisLine.y2"
				/>

				<text
					v-for="tick in reTickLabels"
					:key="`re-tick-${tick.value}`"
					class="tickLabel"
					:x="tick.x"
					:y="tick.y"
				>
					{{ tick.text }}
				</text>
				<text
					v-for="tick in imTickLabels"
					:key="`im-tick-${tick.value}`"
					class="tickLabel"
					:x="tick.x"
					:y="tick.y"
				>
					{{ tick.text }}
				</text>

				<text
					v-if="realAxisLabel"
					class="axisLabel"
					:x="realAxisLabel.x"
					:y="realAxisLabel.y"
				>
					Re(z)
				</text>
				<text
					v-if="imagAxisLabel"
					class="axisLabel"
					:x="imagAxisLabel.x"
					:y="imagAxisLabel.y"
				>
					Im(z)
				</text>
			</g>

			<g class="edges">
				<line
					v-for="edge in edges"
					:key="edge.key"
					class="edge"
					:class="`edge--${edge.style}`"
					:x1="pos[edge.from].x"
					:x2="pos[edge.to].x"
					:y1="pos[edge.from].y"
					:y2="pos[edge.to].y"
				/>
			</g>

			<g v-if="showDistraction" class="distractionLayer">
				<circle
					v-if="distractionCircle"
					class="distractionCircle"
					:cx="distractionCircle.cx"
					:cy="distractionCircle.cy"
					:r="distractionCircle.r"
				/>

				<polygon
					v-for="triangle in distractionTriangles"
					:key="triangle.key"
					class="triangleArea"
					:class="`triangleArea--${triangle.label}`"
					:points="triangle.points"
				/>
				<text
					v-for="triangle in distractionTriangles"
					:key="`${triangle.key}-label`"
					class="triangleLabel"
					:x="triangle.labelX"
					:y="triangle.labelY"
				>
					{{ triangle.label }}
				</text>

				<polyline
					v-for="marker in rightAngleMarkers"
					:key="marker.key"
					class="rightAngleMark"
					:points="marker.points"
				/>
			</g>

			<g class="nodes">
				<circle
					v-for="node in nodes"
					:key="node.id"
					class="node"
					:cx="pos[node.id].x"
					:cy="pos[node.id].y"
					:r="nodeRadius(node)"
					@mouseenter="hoverId = node.id"
					@mouseleave="hoverId = null"
				/>
			</g>

			<g v-if="labelMode !== 'none'" class="labels">
				<text
					v-for="node in nodes"
					:key="`label-${node.id}`"
					class="label"
					:x="pos[node.id].x + 6"
					:y="pos[node.id].y - 6"
				>
					{{ nodeLabel(node) }}
				</text>
			</g>

			<g v-if="hoverNode" class="hover">
				<rect
					class="hoverBox"
					:height="hoverBox.h"
					rx="6"
					:width="hoverBox.w"
					:x="pos[hoverNode.id].x + 10"
					:y="pos[hoverNode.id].y + 10"
				/>
				<text
					class="hoverText"
					:x="pos[hoverNode.id].x + 18"
					:y="pos[hoverNode.id].y + 32"
				>
					{{ hoverNode.name }}
				</text>
			</g>
		</svg>
	</div>

</div>
</template>

<script setup lang="ts">
import {
	computed, ref, watch
} from "vue";
import finlandData from "../utils/maps/finland.json";
import helsinkiData from "../utils/maps/helsinki.json";
import swedenData from "../utils/maps/sweden.json";

type Node = {
	id: string;
	name: string;
	lat: number;
	lon: number;
	population?: number;
};

type Edge = {
	from: string;
	to: string;
	route?: string;
	kind?: string;
};

type StyledEdge = {
	key: string;
	from: string;
	to: string;
	style: "both" | "road" | "rail";
};

type LabelMode = "none" | "abbr" | "name";
type TransformMode = "none" | "powerN" | "expScaled" | "sinScaled" | "mobius" | "joukowski" | "weierstrass";
type MapKey = "HE" | "FI" | "SW";

type Complex = {
	re: number;
	im: number;
};

type NetworkData = {
	title?: string;
	note?: string;
	city?: string;
	meta?: {
		title?: string;
		note?: string;
	};
	nodes: Node[];
	networks: {
		roads: { edges: Edge[] };
		rails: { edges: Edge[] };
	};
};

type GridLine = {
	value: number;
	x1: number;
	x2: number;
	y1: number;
	y2: number;
};

type TickLabel = {
	value: number;
	text: string;
	x: number;
	y: number;
};

type TriangleOverlay = {
	key: string;
	label: "A" | "B";
	points: string;
	labelX: number;
	labelY: number;
};

type RightAngleOverlay = {
	key: string;
	points: string;
};

type CircleOverlay = {
	cx: number;
	cy: number;
	r: number;
};

const props = withDefaults( defineProps<{
	modelValue?: MapKey;
	interactiveMode?: boolean;
	transform?: TransformMode;
	label?: LabelMode;
	labelSize?: number;
	grid?: boolean;
	distraction?: boolean;
}>(), {
	modelValue:      "FI",
	interactiveMode: false,
	transform:       "none",
	label:           "none",
	labelSize:       20,
	grid:            false,
	distraction:     false
} );
const emit = defineEmits<{
	( e: "update:modelValue", value: MapKey ): void;
}>();

const VALID_TRANSFORMS: TransformMode[] = [
	"none",
	"powerN",
	"expScaled",
	"sinScaled",
	"mobius",
	"joukowski",
	"weierstrass"
];
const VALID_LABELS: LabelMode[] = [
	"none",
	"abbr",
	"name"
];
const VALID_MAP_KEYS: MapKey[] = [
	"HE",
	"FI",
	"SW"
];

function normalizeTransform( value: unknown ): TransformMode {
	return VALID_TRANSFORMS.includes( value as TransformMode ) ? value as TransformMode : "none";
}

function normalizeLabel( value: unknown ): LabelMode {
	return VALID_LABELS.includes( value as LabelMode ) ? value as LabelMode : "none";
}

function normalizeMapKey( value: unknown ): MapKey {
	return VALID_MAP_KEYS.includes( value as MapKey ) ? value as MapKey : "FI";
}

function normalizeLabelSize( value: unknown ) {
	const n = Number( value );

	if ( !Number.isFinite( n ) ) {
		return 20;
	}

	return Math.max( 6, Math.min( 80, n ) );
}

const activeMapKey = ref<MapKey>( normalizeMapKey( props.modelValue ) );
const hoverId = ref<string | null>( null );
const transformMode = ref<TransformMode>( normalizeTransform( props.transform ) );
const labelMode = ref<LabelMode>( normalizeLabel( props.label ) );
const showComplexPlane = ref( Boolean( props.grid ) );
const showDistraction = ref( Boolean( props.distraction ) );
// Basis-Schriftgröße innerhalb des SVG (in px) für Labels, Ticks und Hover-Text.
const svgFontSizePx = ref( normalizeLabelSize( props.labelSize ) );

watch( () => props.transform, ( value ) => {
	transformMode.value = normalizeTransform( value );
} );
watch( () => props.label, ( value ) => {
	labelMode.value = normalizeLabel( value );
} );
watch( () => props.grid, ( value ) => {
	showComplexPlane.value = Boolean( value );
} );
watch( () => props.distraction, ( value ) => {
	showDistraction.value = Boolean( value );
} );
watch( () => props.labelSize, ( value ) => {
	svgFontSizePx.value = normalizeLabelSize( value );
} );
watch( () => props.modelValue, ( value ) => {
	const normalized = normalizeMapKey( value );

	if ( normalized !== activeMapKey.value ) {
		activeMapKey.value = normalized;
		hoverId.value = null;
	}
} );
watch( svgFontSizePx, ( value ) => {
	const normalized = normalizeLabelSize( value );

	if ( normalized !== value ) {
		svgFontSizePx.value = normalized;
	}
} );

const svgStyleVars = computed( () => ( { "--fi-network-svg-font-size": `${svgFontSizePx.value}px` } ) );
const selectedTransformTex = computed( () => {
	switch ( transformMode.value ) {
		case "none":
			return "f(z)=z";

		case "powerN":
			return "f(z)=z^{3}";

		case "expScaled":
			return "f(z)=\\exp\\!\\left(0.85\\,z\\right)";

		case "sinScaled":
			return "f(z)=z+1.15\\,\\sin\\!\\left(1.8\\,z\\right)";

		case "mobius":
			return "f(z)=\\dfrac{z}{0.45\\,z+1}";

		case "joukowski":
			return "f(z)=z+\\dfrac{0.15}{z+0.9}";

		case "weierstrass":
			return "f(z)=z+0.95\\,\\sin\\!\\left(2.2\\,z\\right)";
	}

	return "f(z)=z";
} );
const mapOptions: Array<{ value: MapKey; label: string }> = [
	{
		value: "HE",
		label: "HE"
	},
	{
		value: "FI",
		label: "FI"
	},
	{
		value: "SW",
		label: "SW"
	}
];
const networkDataByMap: Record<MapKey, NetworkData> = {
	HE: helsinkiData as NetworkData,
	FI: finlandData as NetworkData,
	SW: swedenData as NetworkData
};
const activeNetworkData = computed( () => networkDataByMap[ activeMapKey.value ] );
const svgAriaLabel = computed( () => {
	const title = activeNetworkData.value.meta?.title ?? activeNetworkData.value.title ?? "Netzwerk";
	return `Schematisches Netz: ${title}`;
} );
const networkNote = computed( () => {
	return activeNetworkData.value.meta?.note ?? activeNetworkData.value.note ?? "";
} );

function selectMap( key: MapKey ) {
	if ( activeMapKey.value === key ) {
		return;
	}

	activeMapKey.value = key;
	hoverId.value = null;
	emit( "update:modelValue", key );
}

const nodes = computed<Node[]>( () => {
	return activeNetworkData.value.nodes.slice().sort( ( a, b ) => {
		return ( b.population ?? 0 ) - ( a.population ?? 0 );
	} );
} );
const nodeIds = computed( () => new Set( nodes.value.map( ( node ) => node.id ) ) );
const nodeByIdMap = computed<Record<string, Node>>( () => {
	const out: Record<string, Node> = {};

	for ( const node of nodes.value ) {
		out[ node.id ] = node;
	}

	return out;
} );
const hoverNode = computed( () => {
	if ( !hoverId.value ) {
		return null;
	}

	return nodeByIdMap.value[ hoverId.value ] ?? null;
} );

const roadEdges = computed<Edge[]>( () => activeNetworkData.value.networks.roads.edges ?? [] );
const railEdges = computed<Edge[]>( () => activeNetworkData.value.networks.rails.edges ?? [] );

function undirectedKey( from: string, to: string ) {
	return from < to ? `${from}__${to}` : `${to}__${from}`;
}

const edges = computed<StyledEdge[]>( () => {
	const byKey = new Map<string, {
		key: string;
		from: string;
		to: string;
		hasRoad: boolean;
		hasRail: boolean;
	}>();

	for ( const edge of roadEdges.value ) {
		if ( !nodeIds.value.has( edge.from ) || !nodeIds.value.has( edge.to ) ) {
			continue;
		}

		const key = undirectedKey( edge.from, edge.to );
		const existing = byKey.get( key );

		if ( existing ) {
			existing.hasRoad = true;
			continue;
		}

		byKey.set( key, {
			key,
			from:    edge.from,
			to:      edge.to,
			hasRoad: true,
			hasRail: false
		} );
	}

	for ( const edge of railEdges.value ) {
		if ( !nodeIds.value.has( edge.from ) || !nodeIds.value.has( edge.to ) ) {
			continue;
		}

		const key = undirectedKey( edge.from, edge.to );
		const existing = byKey.get( key );

		if ( existing ) {
			existing.hasRail = true;
			continue;
		}

		byKey.set( key, {
			key,
			from:    edge.from,
			to:      edge.to,
			hasRoad: false,
			hasRail: true
		} );
	}

	return Array.from( byKey.values() ).map( ( edge ) => {
		if ( edge.hasRoad && edge.hasRail ) {
			return {
				key:   edge.key,
				from:  edge.from,
				to:    edge.to,
				style: "both"
			};
		}

		return {
			key:   edge.key,
			from:  edge.from,
			to:    edge.to,
			style: edge.hasRoad ? "road" : "rail"
		};
	} );
} );

const edgeKeySet = computed( () => {
	const out = new Set<string>();

	for ( const edge of edges.value ) {
		out.add( edge.key );
	}

	return out;
} );

const adjacency = computed<Record<string, Set<string>>>( () => {
	const out: Record<string, Set<string>> = {};

	for ( const node of nodes.value ) {
		out[ node.id ] = new Set<string>();
	}

	for ( const edge of edges.value ) {
		out[ edge.from ].add( edge.to );
		out[ edge.to ].add( edge.from );
	}

	return out;
} );

function project( lat: number, lon: number ) {
	const rad = Math.PI / 180;
	const x = lon * rad;
	const y = Math.log( Math.tan( Math.PI / 4 + lat * rad / 2 ) );
	return {
		x,
		y
	};
}

const proj = computed( () => {
	const points: Record<string, {
		x: number;
		y: number;
	}> = {};

	for ( const node of nodes.value ) {
		points[ node.id ] = project( node.lat, node.lon );
	}

	return points;
} );

const vb = {
	w: 900,
	h: 1200
};

const normalizedPlane = computed<Record<string, Complex>>( () => {
	const xs = nodes.value.map( ( node ) => proj.value[ node.id ].x );
	const ys = nodes.value.map( ( node ) => proj.value[ node.id ].y );
	const minX = Math.min( ...xs );
	const maxX = Math.max( ...xs );
	const minY = Math.min( ...ys );
	const maxY = Math.max( ...ys );
	const cx = ( minX + maxX ) / 2;
	const cy = ( minY + maxY ) / 2;
	const span = Math.max(
		1e-6, maxX - minX, maxY - minY
	);
	const halfSpan = span / 2;
	const out: Record<string, Complex> = {};

	for ( const node of nodes.value ) {
		const point = proj.value[ node.id ];
		out[ node.id ] = {
			re: ( point.x - cx ) / halfSpan,
			im: ( point.y - cy ) / halfSpan
		};
	}

	return out;
} );

const EPS = 1e-12;

const cAdd = ( a: Complex, b: Complex ): Complex => ( {
	re: a.re + b.re,
	im: a.im + b.im
} );
const cMul = ( a: Complex, b: Complex ): Complex => ( {
	re: a.re * b.re - a.im * b.im,
	im: a.re * b.im + a.im * b.re
} );

const cDiv = ( a: Complex, b: Complex ): Complex => {
	const denominator = Math.max( EPS, b.re * b.re + b.im * b.im );
	return {
		re: ( a.re * b.re + a.im * b.im ) / denominator,
		im: ( a.im * b.re - a.re * b.im ) / denominator
	};
};

const cAbs = ( z: Complex ) => Math.hypot( z.re, z.im );
const cArg = ( z: Complex ) => Math.atan2( z.im, z.re );

const cExp = ( z: Complex ): Complex => {
	const ex = Math.exp( z.re );
	return {
		re: ex * Math.cos( z.im ),
		im: ex * Math.sin( z.im )
	};
};

const cPowN = ( z: Complex, n: number ): Complex => {
	const r = cAbs( z );
	const phi = cArg( z );
	const rN = Math.pow( r, n );
	return {
		re: rN * Math.cos( n * phi ),
		im: rN * Math.sin( n * phi )
	};
};

const cSin = ( z: Complex ): Complex => ( {
	re: Math.sin( z.re ) * Math.cosh( z.im ),
	im: Math.cos( z.re ) * Math.sinh( z.im )
} );
const cInv = ( z: Complex ): Complex => cDiv( {
	re: 1,
	im: 0
}, z );

function holomorphicMap( z: Complex ): Complex {
	switch ( transformMode.value ) {
		case "none":
			return z;

		case "powerN":
			return cPowN( z, 3 );

		case "expScaled":
			return cExp( {
				re: z.re * 0.85,
				im: z.im * 0.85
			} );

		case "sinScaled": {
			const sinZ = cSin( {
				re: z.re * 1.8,
				im: z.im * 1.8
			} );
			return cAdd( z, {
				re: sinZ.re * 1.15,
				im: sinZ.im * 1.15
			} );
		}

		case "mobius": {
			const A = {
				re: 1,
				im: 0
			};
			const B = {
				re: 0,
				im: 0
			};
			const C = {
				re: 0.45,
				im: 0
			};
			const D = {
				re: 1,
				im: 0
			};
			return cDiv( cAdd( cMul( A, z ), B ), cAdd( cMul( C, z ), D ) );
		}

		case "joukowski":
			return cAdd( z, cMul( cInv( cAdd( z, {
				re: 0.9,
				im: 0
			} ) ), {
				re: 0.15,
				im: 0
			} ) );

		case "weierstrass": {
			const sinZ = cSin( {
				re: z.re * 2.2,
				im: z.im * 2.2
			} );
			return cAdd( z, {
				re: sinZ.re * 0.95,
				im: sinZ.im * 0.95
			} );
		}
	}
}

function isFiniteComplex( z: Complex ) {
	return Number.isFinite( z.re ) && Number.isFinite( z.im ) &&
		Math.abs( z.re ) < 1e6 &&
		Math.abs( z.im ) < 1e6;
}

const planePoints = computed<Record<string, Complex>>( () => {
	const out: Record<string, Complex> = {};

	for ( const node of nodes.value ) {
		const base = normalizedPlane.value[ node.id ];
		const mapped = holomorphicMap( base );
		out[ node.id ] = isFiniteComplex( mapped ) ? mapped : base;
	}

	return out;
} );

const bounds = computed( () => {
	const xs = nodes.value.map( ( node ) => planePoints.value[ node.id ].re );
	const ys = nodes.value.map( ( node ) => planePoints.value[ node.id ].im );
	const minX = Math.min( ...xs );
	const maxX = Math.max( ...xs );
	const minY = Math.min( ...ys );
	const maxY = Math.max( ...ys );
	const spanX = Math.max( 1e-6, maxX - minX );
	const spanY = Math.max( 1e-6, maxY - minY );
	return {
		minX,
		maxX,
		minY,
		maxY,
		spanX,
		spanY
	};
} );

const view = computed( () => {
	const pad = 40;
	const sx = ( vb.w - 2 * pad ) / bounds.value.spanX;
	const sy = ( vb.h - 2 * pad ) / bounds.value.spanY;
	const scale = Math.min( sx, sy );
	const cx = ( bounds.value.minX + bounds.value.maxX ) / 2;
	const cy = ( bounds.value.minY + bounds.value.maxY ) / 2;
	return {
		scale,
		cx,
		cy
	};
} );

function planeToSvg( z: Complex ) {
	return {
		x: ( z.re - view.value.cx ) * view.value.scale + vb.w / 2,
		y: ( view.value.cy - z.im ) * view.value.scale + vb.h / 2
	};
}

const pos = computed( () => {
	const out: Record<string, {
		x: number;
		y: number;
	}> = {};

	for ( const node of nodes.value ) {
		out[ node.id ] = planeToSvg( planePoints.value[ node.id ] );
	}

	return out;
} );

function niceStep( span: number ) {
	const raw = Math.max( span / 8, 1e-6 );
	const base = 10 ** Math.floor( Math.log10( raw ) );
	const multiplier = raw / base;

	if ( multiplier <= 1 ) {
		return base;
	}

	if ( multiplier <= 2 ) {
		return 2 * base;
	}

	if ( multiplier <= 5 ) {
		return 5 * base;
	}

	return 10 * base;
}

function buildTickValues(
	min: number, max: number, step: number
) {
	const out: number[] = [];

	if ( !Number.isFinite( step ) || step <= 0 ) {
		return out;
	}

	const start = Math.ceil( min / step ) * step;

	for ( let value = start; value <= max + step * 0.5; value += step ) {
		const cleaned = Math.abs( value ) < 1e-10 ? 0 : Number( value.toFixed( 10 ) );
		out.push( cleaned );
	}

	return out;
}

function fmtTick( value: number ) {
	return Number( value.toFixed( Math.abs( value ) >= 10 ? 1 : 2 ) ).toString();
}

const reStep = computed( () => niceStep( bounds.value.spanX ) );
const imStep = computed( () => niceStep( bounds.value.spanY ) );
const reTicks = computed( () => buildTickValues(
	bounds.value.minX, bounds.value.maxX, reStep.value
) );
const imTicks = computed( () => buildTickValues(
	bounds.value.minY, bounds.value.maxY, imStep.value
) );

const reGridLines = computed<GridLine[]>( () => {
	const minY = bounds.value.minY;
	const maxY = bounds.value.maxY;
	return reTicks.value
		.filter( ( value ) => Math.abs( value ) > reStep.value * 0.12 )
		.map( ( value ) => {
			const start = planeToSvg( {
				re: value,
				im: minY
			} );
			const end = planeToSvg( {
				re: value,
				im: maxY
			} );
			return {
				value,
				x1: start.x,
				y1: start.y,
				x2: end.x,
				y2: end.y
			};
		} );
} );

const imGridLines = computed<GridLine[]>( () => {
	const minX = bounds.value.minX;
	const maxX = bounds.value.maxX;
	return imTicks.value
		.filter( ( value ) => Math.abs( value ) > imStep.value * 0.12 )
		.map( ( value ) => {
			const start = planeToSvg( {
				re: minX,
				im: value
			} );
			const end = planeToSvg( {
				re: maxX,
				im: value
			} );
			return {
				value,
				x1: start.x,
				y1: start.y,
				x2: end.x,
				y2: end.y
			};
		} );
} );

const realAxisLine = computed( () => {
	if ( bounds.value.minY > 0 || bounds.value.maxY < 0 ) {
		return null;
	}

	const start = planeToSvg( {
		re: bounds.value.minX,
		im: 0
	} );
	const end = planeToSvg( {
		re: bounds.value.maxX,
		im: 0
	} );
	return {
		x1: start.x,
		y1: start.y,
		x2: end.x,
		y2: end.y
	};
} );

const imagAxisLine = computed( () => {
	if ( bounds.value.minX > 0 || bounds.value.maxX < 0 ) {
		return null;
	}

	const start = planeToSvg( {
		re: 0,
		im: bounds.value.minY
	} );
	const end = planeToSvg( {
		re: 0,
		im: bounds.value.maxY
	} );
	return {
		x1: start.x,
		y1: start.y,
		x2: end.x,
		y2: end.y
	};
} );

const reTickLabels = computed<TickLabel[]>( () => {
	const labelY = Math.max( 14, vb.h - 6 );
	return reTicks.value.map( ( value ) => {
		const p = planeToSvg( {
			re: value,
			im: bounds.value.minY
		} );
		return {
			value,
			text: fmtTick( value ),
			x:    p.x + 2,
			y:    labelY
		};
	} );
} );

const imTickLabels = computed<TickLabel[]>( () => {
	return imTicks.value.map( ( value ) => {
		const p = planeToSvg( {
			re: bounds.value.minX,
			im: value
		} );
		return {
			value,
			text: fmtTick( value ),
			x:    4,
			y:    p.y - 2
		};
	} );
} );

const realAxisLabel = computed( () => {
	if ( !realAxisLine.value ) {
		return null;
	}

	return {
		x: vb.w - 48,
		y: realAxisLine.value.y1 - 6
	};
} );

const imagAxisLabel = computed( () => {
	if ( !imagAxisLine.value ) {
		return null;
	}

	return {
		x: imagAxisLine.value.x1 + 6,
		y: 14
	};
} );

function normalizeName( name: string ) {
	return name.toUpperCase()
		.normalize( "NFD" )
		.replace( /[\u0300-\u036f]/g, "" )
		.replace( /[^A-Z]/g, "" );
}

function abbreviationCandidates( normalizedName: string ) {
	const letters = normalizedName.slice( 0, 26 );
	const out: string[] = [];

	if ( letters.length === 0 ) {
		return out;
	}

	if ( letters.length === 1 ) {
		out.push( `${letters[ 0 ]}X` );
	}

	if ( letters.length >= 2 ) {
		out.push( letters.slice( 0, 2 ) );
	}

	for ( let index = 2; index < letters.length; index++ ) {
		out.push( `${letters[ 0 ]}${letters[ index ]}` );
	}

	for ( let code = 65; code <= 90; code++ ) {
		out.push( `${letters[ 0 ]}${String.fromCharCode( code )}` );
	}

	return out;
}

const abbreviationById = computed<Record<string, string>>( () => {
	const used = new Set<string>();
	const out: Record<string, string> = {};

	for ( const node of nodes.value ) {
		const normalized = normalizeName( node.name );
		const candidates = abbreviationCandidates( normalized );
		let selected = "";

		for ( const candidate of candidates ) {
			if ( candidate.length !== 2 ) {
				continue;
			}

			if ( !used.has( candidate ) ) {
				selected = candidate;
				break;
			}
		}

		if ( !selected ) {
			for ( let c1 = 65; c1 <= 90 && !selected; c1++ ) {
				for ( let c2 = 65; c2 <= 90; c2++ ) {
					const candidate = `${String.fromCharCode( c1 )}${String.fromCharCode( c2 )}`;

					if ( !used.has( candidate ) ) {
						selected = candidate;
						break;
					}
				}
			}
		}

		selected = selected || "XX";
		used.add( selected );
		out[ node.id ] = selected;
	}

	return out;
} );

function nodeLabel( node: Node ) {
	return labelMode.value === "abbr" ? abbreviationById.value[ node.id ] : node.name;
}

function nodeRadius( node: Node ) {
	const population = Number( node.population ?? 80_000 );
	const radius = 2.5 + Math.log10( Math.max( 10_000, population ) ) * 0.9;
	return Math.min( 9, Math.max( 3, radius ) );
}

const hoverBox = computed( () => {
	const len = hoverNode.value?.name.length ?? 10;
	return {
		w: Math.max( 130, Math.min( 320, len * 8 + 24 ) ),
		h: 34
	};
} );

function triangleArea(
	a: Complex, b: Complex, c: Complex
) {
	return Math.abs( ( b.re - a.re ) * ( c.im - a.im ) - ( b.im - a.im ) * ( c.re - a.re ) ) * 0.5;
}

function pointsToSvgString( points: Complex[] ) {
	return points.map( ( point ) => {
		const p = planeToSvg( point );
		return `${p.x},${p.y}`;
	} ).join( " " );
}

const distractionTriangles = computed<TriangleOverlay[]>( () => {
	if ( !showDistraction.value ) {
		return [];
	}

	const ids = nodes.value.map( ( node ) => node.id );
	const triangles: Array<{ ids: [string, string, string]; area: number }> = [];

	for ( let i = 0; i < ids.length - 2; i++ ) {
		for ( let j = i + 1; j < ids.length - 1; j++ ) {
			if ( !edgeKeySet.value.has( undirectedKey( ids[ i ], ids[ j ] ) ) ) {
				continue;
			}

			for ( let k = j + 1; k < ids.length; k++ ) {
				if ( !edgeKeySet.value.has( undirectedKey( ids[ i ], ids[ k ] ) ) ) {
					continue;
				}

				if ( !edgeKeySet.value.has( undirectedKey( ids[ j ], ids[ k ] ) ) ) {
					continue;
				}

				const a = planePoints.value[ ids[ i ] ];
				const b = planePoints.value[ ids[ j ] ];
				const c = planePoints.value[ ids[ k ] ];
				const area = triangleArea(
					a, b, c
				);

				if ( area <= 1e-9 ) {
					continue;
				}

				triangles.push( {
					ids: [
						ids[ i ],
						ids[ j ],
						ids[ k ]
					],
					area
				} );
			}
		}
	}

	const topTwo = triangles
		.sort( ( left, right ) => right.area - left.area )
		.slice( 0, 2 );

	const labels: Array<"A" | "B"> = [
		"A",
		"B"
	];

	return topTwo.map( ( triangle, index ) => {
		const [
			aId,
			bId,
			cId
		] = triangle.ids;
		const a = pos.value[ aId ];
		const b = pos.value[ bId ];
		const c = pos.value[ cId ];
		const labelX = ( a.x + b.x + c.x ) / 3;
		const labelY = ( a.y + b.y + c.y ) / 3;
		return {
			key:    `${aId}-${bId}-${cId}`,
			label:  labels[ index ],
			points: `${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y}`,
			labelX,
			labelY
		};
	} );
} );

const RIGHT_MIN_DEG = 88;
const RIGHT_MAX_DEG = 92;

function normalizeVector( v: Complex ) {
	const n = Math.hypot( v.re, v.im );

	if ( n <= 1e-12 ) {
		return null;
	}

	return {
		re: v.re / n,
		im: v.im / n
	};
}

const rightAngleMarkers = computed<RightAngleOverlay[]>( () => {
	if ( !showDistraction.value ) {
		return [];
	}

	const markers: RightAngleOverlay[] = [];
	const minSpan = Math.min( bounds.value.spanX, bounds.value.spanY );
	const markerSize = Math.max( minSpan * 0.035, 1e-4 );

	for ( const center of nodes.value ) {
		const neighbors = Array.from( adjacency.value[ center.id ] ?? [] );

		if ( neighbors.length < 2 ) {
			continue;
		}

		const pivot = planePoints.value[ center.id ];

		for ( let i = 0; i < neighbors.length - 1; i++ ) {
			for ( let j = i + 1; j < neighbors.length; j++ ) {
				const leftPoint = planePoints.value[ neighbors[ i ] ];
				const rightPoint = planePoints.value[ neighbors[ j ] ];
				const u = {
					re: leftPoint.re - pivot.re,
					im: leftPoint.im - pivot.im
				};
				const v = {
					re: rightPoint.re - pivot.re,
					im: rightPoint.im - pivot.im
				};
				const uNorm = normalizeVector( u );
				const vNorm = normalizeVector( v );

				if ( !uNorm || !vNorm ) {
					continue;
				}

				const dot = Math.max( -1, Math.min( 1, uNorm.re * vNorm.re + uNorm.im * vNorm.im ) );
				const angle = Math.acos( dot ) * 180 / Math.PI;

				if ( angle < RIGHT_MIN_DEG || angle > RIGHT_MAX_DEG ) {
					continue;
				}

				const p1 = {
					re: pivot.re + uNorm.re * markerSize,
					im: pivot.im + uNorm.im * markerSize
				};
				const p2 = {
					re: pivot.re + ( uNorm.re + vNorm.re ) * markerSize,
					im: pivot.im + ( uNorm.im + vNorm.im ) * markerSize
				};
				const p3 = {
					re: pivot.re + vNorm.re * markerSize,
					im: pivot.im + vNorm.im * markerSize
				};

				markers.push( {
					key:    `${center.id}:${neighbors[ i ]}:${neighbors[ j ]}`,
					points: pointsToSvgString( [
						p1,
						p2,
						p3
					] )
				} );
			}
		}
	}

	return markers;
} );

const threeLargestNodeIds = computed( () => {
	if ( nodes.value.length < 3 ) {
		return [];
	}

	const byPopulation = nodes.value.slice().sort( ( a, b ) => {
		return ( b.population ?? -1 ) - ( a.population ?? -1 );
	} );

	return byPopulation.slice( 0, 3 ).map( ( node ) => node.id );
} );

function circumcircleFromPoints(
	a: {
		x: number;
		y: number;
	},
	b: {
		x: number;
		y: number;
	},
	c: {
		x: number;
		y: number;
	}
): CircleOverlay | null {
	const d = 2 * ( a.x * ( b.y - c.y ) + b.x * ( c.y - a.y ) + c.x * ( a.y - b.y ) );

	if ( Math.abs( d ) < 1e-10 ) {
		return null;
	}

	const aa = a.x * a.x + a.y * a.y;
	const bb = b.x * b.x + b.y * b.y;
	const cc = c.x * c.x + c.y * c.y;
	const cx = ( aa * ( b.y - c.y ) + bb * ( c.y - a.y ) + cc * ( a.y - b.y ) ) / d;
	const cy = ( aa * ( c.x - b.x ) + bb * ( a.x - c.x ) + cc * ( b.x - a.x ) ) / d;
	const r = Math.hypot( a.x - cx, a.y - cy );

	if ( !Number.isFinite( cx ) || !Number.isFinite( cy ) || !Number.isFinite( r ) || r <= 0 ) {
		return null;
	}

	return {
		cx,
		cy,
		r
	};
}

const distractionCircle = computed<CircleOverlay | null>( () => {
	if ( !showDistraction.value ) {
		return null;
	}

	if ( threeLargestNodeIds.value.length < 3 ) {
		return null;
	}

	const [
		aId,
		bId,
		cId
	] = threeLargestNodeIds.value;
	const a = pos.value[ aId ];
	const b = pos.value[ bId ];
	const c = pos.value[ cId ];

	if ( !a || !b || !c ) {
		return null;
	}

	return circumcircleFromPoints(
		a, b, c
	);
} );
</script>

<style scoped>
svg{
	max-width: 28em;
}
.fin-network {
	font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Noto Sans", Arial, sans-serif;
	color: rgb(var(--v-theme-on-surface));
	max-width: 980px;
}

.fin-network--interactive {
	display: grid;
	grid-template-columns: minmax(0, 1fr) clamp(230px, 26vw, 320px);
	grid-template-areas: "svg toolbar";
	align-items: start;
	column-gap: 14px;
	row-gap: 10px;
}

.fin-network--interactive .svgWrap {
	grid-area: svg;
	min-width: 0;
}

.fin-network--interactive .toolbar {
	grid-area: toolbar;
	margin: 0;
	padding: 10px;
	border: 1px solid rgba(var(--v-theme-on-surface), 0.2);
	border-radius: 12px;
	background: rgba(var(--v-theme-surface), 0.8);
	display: flex;
	flex-direction: column;
	align-items: stretch;
	flex-wrap: nowrap;
	gap: 10px;
}

.fin-network--interactive .transformFormula {
	margin-top: auto;
}

.fin-network--interactive .modeCtrl {
	display: flex;
	justify-content: space-between;
}

.fin-network--interactive .modeCtrl.modeCtrl--check {
	justify-content: flex-start;
}

.fin-network--interactive .modeSelect,
.fin-network--interactive .sizeInput {
	max-width: 150px;
}

.transformFormula {
	padding-top: 8px;
	border-top: 1px dashed rgba(var(--v-theme-on-surface), 0.25);
}

.transformFormulaTitle {
	margin: 0 0 4px;
	font-size: 12px;
	font-weight: 600;
	color: rgba(var(--v-theme-on-surface), 0.78);
}

.transformFormula :deep(.katex-display) {
	margin: 0;
}

.transformFormula :deep(.katex) {
	color: rgb(var(--v-theme-on-surface));
}

.toolbar {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 10px;
	margin: 8px 0 10px;
}

.modeCtrl {
	display: inline-flex;
	gap: 8px;
	align-items: center;
	font-size: 14px;
}

.modeCtrl--check input {
	accent-color: rgb(var(--v-theme-primary));
	margin: 0;
}

.modeSelect,
.sizeInput {
	border: 1px solid rgba(var(--v-theme-on-surface), 0.24);
	border-radius: 8px;
	background: rgb(var(--v-theme-surface));
	color: rgb(var(--v-theme-on-surface));
	padding: 5px 8px;
	font-size: 14px;
}

.sizeInput {
	max-width: 88px;
}

.modeSelect:focus-visible,
.sizeInput:focus-visible,
.mapBtn:focus-visible {
	outline: 2px solid rgba(var(--v-theme-primary), 0.55);
	outline-offset: 1px;
}

.svgWrap {
	position: relative;
}

.mapButtons {
	position: absolute;
	top: 10px;
	left: 10px;
	z-index: 2;
	display: flex;
	gap: 6px;
	padding: 6px;
	border: 1px solid rgba(var(--v-theme-on-surface), 0.25);
	border-radius: 10px;
	background: rgba(var(--v-theme-surface), 0.88);
	backdrop-filter: blur(2px);
}

.mapBtn {
	border: 1px solid rgba(var(--v-theme-on-surface), 0.28);
	border-radius: 7px;
	background: transparent;
	color: rgb(var(--v-theme-on-surface));
	font-size: 12px;
	font-weight: 700;
	line-height: 1;
	padding: 6px 8px;
	cursor: pointer;
}

.mapBtn.active {
	border-color: rgba(var(--v-theme-primary), 0.8);
	background: rgba(var(--v-theme-primary), 0.18);
	color: rgb(var(--v-theme-primary));
}

.svg {
	width: 100%;
	height: auto;
	border: 1px solid rgba(var(--v-theme-on-surface), 0.22);
	border-radius: 12px;
	background: rgb(var(--v-theme-surface));
}

.complexPlane {
	pointer-events: none;
}

.gridLine {
	stroke: rgba(var(--v-theme-on-surface), 0.14);
	stroke-width: 1;
}

.axisLine {
	stroke: rgba(var(--v-theme-primary), 0.7);
	stroke-width: 1.4;
}

.tickLabel {
	fill: rgba(var(--v-theme-on-surface), 0.75);
	font-size: calc(var(--fi-network-svg-font-size, 12px) * 0.84);
}

.axisLabel {
	fill: rgba(var(--v-theme-primary), 0.95);
	font-size: calc(var(--fi-network-svg-font-size, 12px) * 0.92);
	font-weight: 600;
}

.edge {
	stroke: rgba(var(--v-theme-on-surface), 0.88);
	stroke-linecap: round;
	opacity: 0.9;
}

.edge--both {
	stroke-width: 4;
}

.edge--road {
	stroke-width: 1.6;
}

.edge--rail {
	stroke-width: 2.4;
	stroke-dasharray: 7 5;
}

.distractionLayer {
	pointer-events: none;
}

.distractionCircle {
	fill: none;
	stroke: rgba(var(--v-theme-error), 0.8);
	stroke-width: 2;
	stroke-dasharray: 10 6;
}

.triangleArea {
	stroke-width: 2;
}

.triangleArea--A {
	fill: rgba(var(--v-theme-primary), 0.5);
	stroke: rgba(var(--v-theme-primary), 0.75);
}

.triangleArea--B {
	fill: rgba(var(--v-theme-secondary), 0.5);
	stroke: rgba(var(--v-theme-secondary), 0.75);
}

.triangleLabel {
	fill: rgb(var(--v-theme-on-surface));
	font-size: calc(var(--fi-network-svg-font-size, 12px) * 1.2);
	font-weight: 700;
	text-anchor: middle;
	dominant-baseline: middle;
	paint-order: stroke;
	stroke: rgba(var(--v-theme-surface), 0.9);
	stroke-width: 3;
	stroke-linejoin: round;
}

.rightAngleMark {
	fill: none;
	stroke: rgba(var(--v-theme-warning), 0.92);
	stroke-width: 2.6;
	stroke-linecap: round;
	stroke-linejoin: round;
}

.node {
	fill: rgb(var(--v-theme-primary));
	opacity: 0.95;
}

.label {
	fill: rgb(var(--v-theme-on-surface));
	font-size: var(--fi-network-svg-font-size, 12px);
	user-select: none;
}

.hoverBox {
	fill: rgb(var(--v-theme-surface));
	stroke: rgba(var(--v-theme-on-surface), 0.32);
	stroke-width: 1;
	opacity: 0.95;
}

.hoverText {
	fill: rgb(var(--v-theme-on-surface));
	font-size: calc(var(--fi-network-svg-font-size, 12px) * 1.16);
	font-weight: 600;
}

.note {
	color: rgba(var(--v-theme-on-surface), 0.9);
	margin-top: 10px;
	font-size: 13px;
	opacity: 0.9;
}

.note--toolbar {
	margin-top: 8px;
	padding-top: 8px;
	border-top: 1px dashed rgba(var(--v-theme-on-surface), 0.25);
}

@media (max-width: 760px) {
	.fin-network--interactive {
		grid-template-columns: 1fr;
		grid-template-areas:
			"toolbar"
			"svg";
	}

	.fin-network--interactive .toolbar {
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
		padding: 8px;
	}

	.fin-network--interactive .modeCtrl {
		display: inline-flex;
		justify-content: flex-start;
	}

	.fin-network--interactive .modeSelect,
	.fin-network--interactive .sizeInput {
		max-width: none;
	}

	.fin-network--interactive .transformFormula {
		width: 100%;
	}

	.toolbar {
		gap: 8px;
	}

	.modeCtrl {
		font-size: 13px;
	}

	.modeSelect,
	.sizeInput {
		font-size: 13px;
	}

	.mapButtons {
		top: 8px;
		left: 8px;
		padding: 5px;
	}

	.mapBtn {
		padding: 5px 7px;
	}
}
</style>
