<template>
<svg
	:aria-label="ariaLabel"
	class="rdGraph"
	role="img"
	:viewBox="viewBox"
	xmlns="http://www.w3.org/2000/svg"
>
	<rect class="bg"
		:height="model.height"
		:width="model.width"
		x="0"
		y="0"
	/>

	<g v-if="model.kind === 'error'" class="msg">
		<text x="20" y="34">{{ model.message }}</text>
	</g>

	<g v-else-if="model.kind === 'light'">
		<g class="guide">
			<line v-for="g in model.guides"
				:key="`g-line-${g.id}`"
				:x1="g.x"
				:x2="g.x"
				:y1="model.top - 10"
				:y2="model.axisY"
			/>
			<text v-for="g in model.guides"
				:key="`g-text-${g.id}`"
				:text-anchor="g.anchor"
				:x="g.labelX"
				:y="model.top - 14"
			>
				{{ g.label }}
			</text>
		</g>

		<line class="axis"
			:x1="model.left"
			:x2="model.right"
			:y1="model.axisY"
			:y2="model.axisY"
		/>
		<text class="axisLabel"
			:x="model.right"
			:y="model.axisY + 30"
		>
			Distanz [km]
		</text>

		<g class="tick">
			<line v-for="t in model.ticks"
				:key="`tick-mark-${t.id}`"
				:x1="t.x"
				:x2="t.x"
				:y1="model.axisY"
				:y2="model.axisY + 7"
			/>
			<text v-for="t in model.ticks"
				:key="`tick-text-${t.id}`"
				text-anchor="middle"
				:x="t.x"
				:y="model.axisY + 22"
			>
				{{ t.value }}
			</text>
		</g>

		<g v-for="row in model.rows" :key="row.id">
			<text class="rowLabel"
				text-anchor="end"
				:x="model.left - 14"
				:y="row.y + 5"
			>
				{{ row.label }}
			</text>

			<line v-for="(seg, i) in row.segments"
				:key="`${row.id}-seg-${i}`"
				:class="seg.kind"
				:x1="seg.x1"
				:x2="seg.x2"
				:y1="row.y"
				:y2="row.y"
			/>

			<circle class="point"
				cx="model.left"
				:cy="row.y"
				r="3"
			/>
			<circle class="point"
				:cx="model.depotX"
				:cy="row.y"
				r="3"
			/>
			<circle v-if="row.turnX !== null"
				class="turnPoint"
				:cx="row.turnX"
				:cy="row.y"
				r="3.5"
			/>
		</g>

		<g class="legend">
			<line class="out"
				:x1="model.left"
				:x2="model.left + 44"
				:y1="model.axisY + 42"
				:y2="model.axisY + 42"
			/>
			<text :x="model.left + 52" :y="model.axisY + 46">Hinweg</text>

			<line class="back"
				:x1="model.left + 140"
				:x2="model.left + 184"
				:y1="model.axisY + 42"
				:y2="model.axisY + 42"
			/>
			<text :x="model.left + 192" :y="model.axisY + 46">Rueckweg</text>
		</g>

		<text v-if="model.trimmed" class="note" :x="model.left" :y="model.axisY + 66">
			Es werden die ersten {{ model.shownK }} von {{ model.k }} Shuttles gezeigt.
		</text>
		<text v-if="model.warning" class="warn" :x="model.left" :y="model.axisY + 84">
			{{ model.warning }}
		</text>
	</g>

	<g v-else>
		<text class="headline" :x="model.left" y="26">
			Mehrdepot-Stufen bis Dm = {{ model.totalDistance }} km
		</text>

		<line class="axis"
			:x1="model.left"
			:x2="model.right"
			:y1="model.axisY"
			:y2="model.axisY"
		/>
		<text class="axisLabel"
			:x="model.right"
			:y="model.axisY + 28"
		>
			Distanz [km]
		</text>

		<g class="tick">
			<line v-for="t in model.ticks"
				:key="`ct-mark-${t.id}`"
				:x1="t.x"
				:x2="t.x"
				:y1="model.axisY"
				:y2="model.axisY + 7"
			/>
			<text v-for="t in model.ticks"
				:key="`ct-text-${t.id}`"
				text-anchor="middle"
				:x="t.x"
				:y="model.axisY + 22"
			>
				{{ t.value }}
			</text>
		</g>

		<g>
			<line v-for="seg in model.segments"
				:key="`seg-${seg.id}`"
				:stroke="seg.color"
				stroke-linecap="round"
				stroke-width="10"
				:x1="seg.x1"
				:x2="seg.x2"
				:y1="model.bandY"
				:y2="model.bandY"
			/>
			<circle class="point"
				:cx="model.left"
				:cy="model.bandY"
				r="3"
			/>
			<circle class="turnPoint"
				:cx="model.right"
				:cy="model.bandY"
				r="3.5"
			/>
			<text v-for="seg in model.labels"
				:key="`seg-label-${seg.id}`"
				text-anchor="middle"
				:x="seg.x"
				:y="model.bandY - 14"
			>
				{{ seg.text }}
			</text>
		</g>

		<g class="msg" :transform="`translate(${model.left}, ${model.bandY + 44})`">
			<text y="0">Stufenbreiten entsprechen Delta x_j.</text>
			<text y="18">Je hoehere Stufe, desto kleiner der Zugewinn.</text>
			<text v-if="model.trimmed" y="36">
				Es werden {{ model.shown }} von {{ model.total }} Stufen gezeigt.
			</text>
		</g>
	</g>
</svg>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps( {
	mode: { type: String, default: "light" },

	cap:      { type: [ Number, String ], default: null },
	cons:     { type: [ Number, String ], default: null },
	speed:    { type: [ Number, String ], default: null },
	depotX:   { type: [ Number, String ], default: null },
	drop:     { type: [ Number, String ], default: null },
	shuttles: { type: [ Number, String ], default: null },
	d0:       { type: [ Number, String ], default: null },
	dmax:     { type: [ Number, String ], default: null },
	ok:       { type: Boolean, default: true },
	warning:  { type: String, default: "" },

	rows: {
		type:    Array,
		default: () => []
	}
} );

const palette = [
	"#0f766e",
	"#2563eb",
	"#ea580c",
	"#7c3aed",
	"#0891b2",
	"#16a34a",
	"#dc2626",
	"#1d4ed8"
];

function toNumber( v ) {
	if ( typeof v === "number" ) {
		return Number.isFinite( v ) ? v : null;
	}

	if ( typeof v !== "string" ) {
		return null;
	}

	const s = v.trim().replace( ",", "." );

	if ( !s ) {
		return null;
	}

	const n = Number( s );
	return Number.isFinite( n ) ? n : null;
}

function toInt( v ) {
	const n = toNumber( v );

	if ( n === null ) {
		return null;
	}

	return Math.trunc( n );
}

function fmt( n, digits = 1 ) {
	if ( !Number.isFinite( n ) ) {
		return "-";
	}

	return Number( n ).toFixed( digits ).replace( ".", "," );
}

function uniqueByValue( list, tolerance ) {
	const out = [];

	for ( const item of list ) {
		const found = out.some( ( x ) => Math.abs( x.value - item.value ) <= tolerance );

		if ( !found ) {
			out.push( item );
		}
	}

	return out;
}

const model = computed( () => {
	if ( props.mode === "classic" ) {
		return buildClassicModel();
	}

	return buildLightModel();
} );

const viewBox = computed( () => `0 0 ${model.value.width} ${model.value.height}` );

const ariaLabel = computed( () => {
	if ( props.mode === "classic" ) {
		return "Mehrdepot-Stufen als SVG";
	}

	return "Touren der Ein-Depot-Strategie als SVG";
} );

function buildLightModel() {
	const cap = toNumber( props.cap );
	const cons = toNumber( props.cons );
	const speed = toNumber( props.speed );
	const depotX = toNumber( props.depotX );
	const drop = toNumber( props.drop );
	const shuttles = toInt( props.shuttles );
	const d0 = toNumber( props.d0 );
	const dmax = toNumber( props.dmax );

	if (
		cap === null || cons === null || speed === null || depotX === null ||
		drop === null || shuttles === null || d0 === null || dmax === null
	) {
		return {
			kind:    "error",
			width:   920,
			height:  170,
			message: "Bitte gueltige Eingaben fuer die Light-Touren setzen."
		};
	}

	if ( cap <= 0 || cons <= 0 || speed <= 0 || depotX < 0 || drop < 0 || shuttles < 0 ) {
		return {
			kind:    "error",
			width:   920,
			height:  170,
			message: "Die Touren brauchen positive Werte (x, d, k nicht negativ)."
		};
	}

	const width = 920;
	const left = 170;
	const rightPad = 28;
	const right = width - rightPad;
	const top = 38;
	const rowGap = 34;
	const shownK = Math.min( shuttles, 12 );
	const rowCount = shownK + 1;
	const axisY = top + rowGap * rowCount + 14;
	const height = axisY + 96;

	const domainMax = Math.max( 1, d0, dmax, depotX );
	const pxPerKm = ( right - left ) / domainMax;
	const toX = ( v ) => left + v * pxPerKm;

	const baseGuides = [
		{ id: "start", value: 0, label: "Start" },
		{ id: "depot", value: depotX, label: `Depot ${fmt( depotX )} km` },
		{ id: "d0", value: d0, label: `Ohne Depot ${fmt( d0 )} km` },
		{ id: "turn", value: dmax, label: `Wende ${fmt( dmax )} km` }
	];
	const tolerance = domainMax * 0.005;
	const guides = uniqueByValue( baseGuides, tolerance ).map( ( g, i ) => {
		const x = toX( g.value );
		const anchor = i % 2 === 0 ? "start" : "end";
		const labelX = anchor === "start" ? x + 4 : x - 4;
		return {
			...g,
			x,
			anchor,
			labelX
		};
	} );

	const ticks = uniqueByValue( [
		{ id: "t0", value: 0 },
		{ id: "tx", value: depotX },
		{ id: "td0", value: d0 },
		{ id: "tdmax", value: dmax }
	], tolerance ).sort( ( a, b ) => a.value - b.value ).map( ( t ) => ( {
		...t,
		x:     toX( t.value ),
		value: fmt( t.value )
	} ) );

	const rows = [];

	for ( let i = 0; i < shownK; i++ ) {
		const y = top + i * rowGap;
		rows.push( {
			id:    `shuttle-${i + 1}`,
			label: `Shuttle ${i + 1}`,
			y,
			turnX: null,
			segments: [
				{ kind: "out", x1: left, x2: toX( depotX ) },
				{ kind: "back", x1: toX( depotX ), x2: left }
			]
		} );
	}

	const finalY = top + shownK * rowGap;
	rows.push( {
		id:    "final",
		label: "Finale Tour",
		y:     finalY,
		turnX: toX( dmax ),
		segments: [
			{ kind: "out", x1: left, x2: toX( depotX ) },
			{ kind: "outStrong", x1: toX( depotX ), x2: toX( dmax ) },
			{ kind: "backStrong", x1: toX( dmax ), x2: toX( depotX ) },
			{ kind: "back", x1: toX( depotX ), x2: left }
		]
	} );

	return {
		kind: "light",
		width,
		height,
		top,
		left,
		right,
		axisY,
		depotX: toX( depotX ),
		rows,
		ticks,
		guides,
		k: shuttles,
		shownK,
		trimmed: shuttles > shownK,
		warning: props.ok ? "" : props.warning
	};
}

function buildClassicModel() {
	const parsedRows = props.rows.map( ( row ) => ( {
		j:     toInt( row?.j ),
		term:  toNumber( row?.term ),
		delta: toNumber( row?.delta ),
		cum:   toNumber( row?.cum )
	} ) ).filter( ( r ) => (
		r.j !== null && r.j > 0 && r.term !== null && r.delta !== null && r.cum !== null
	) );

	if ( !parsedRows.length ) {
		return {
			kind:    "error",
			width:   920,
			height:  180,
			message: "Bitte gueltige Werte fuer das Mehrdepot-Modell setzen."
		};
	}

	const shownRows = parsedRows.slice( 0, 18 );
	const width = 920;
	const left = 86;
	const rightPad = 24;
	const right = width - rightPad;
	const bandY = 112;
	const axisY = 188;
	const height = 280;
	const totalDistance = shownRows[ shownRows.length - 1 ].cum;
	const domainMax = Math.max( 1, totalDistance );
	const toX = ( v ) => left + ( ( right - left ) * v / domainMax );

	const segments = [];
	const labels = [];
	let prev = 0;

	shownRows.forEach( ( row, i ) => {
		const x1 = toX( prev );
		const x2 = toX( row.cum );
		const mid = ( x1 + x2 ) / 2;
		const segment = {
			id:    `c-${row.j}`,
			x1,
			x2,
			color: palette[ i % palette.length ]
		};
		segments.push( segment );

		if ( x2 - x1 > 34 ) {
			labels.push( {
				id:   `lbl-${row.j}`,
				x:    mid,
				text: `j=${row.j}`
			} );
		}

		prev = row.cum;
	} );

	const tickValues = [ 0 ];
	const step = Math.max( 1, Math.floor( shownRows.length / 4 ) );
	for ( let i = step - 1; i < shownRows.length; i += step ) {
		tickValues.push( shownRows[ i ].cum );
	}
	tickValues.push( totalDistance );

	const ticks = uniqueByValue(
		tickValues.map( ( v, idx ) => ( { id: `cv-${idx}`, value: v } ) ),
		domainMax * 0.002
	).sort( ( a, b ) => a.value - b.value ).map( ( t ) => ( {
		...t,
		x:     toX( t.value ),
		value: fmt( t.value )
	} ) );

	return {
		kind: "classic",
		width,
		height,
		left,
		right,
		axisY,
		bandY,
		totalDistance: fmt( totalDistance, 3 ),
		segments,
		labels,
		ticks,
		trimmed: parsedRows.length > shownRows.length,
		total: parsedRows.length,
		shown: shownRows.length
	};
}
</script>

<style scoped>
.rdGraph {
	display: block;
	width: 100%;
	height: auto;
}

.bg {
	fill: var(--kbox-bg);
}

.axis {
	stroke: var(--text);
	stroke-width: 1.6;
}

.axisLabel {
	fill: var(--muted);
	font-size: 12px;
	text-anchor: end;
}

.tick line {
	stroke: var(--muted);
	stroke-width: 1.2;
}

.tick text {
	fill: var(--muted);
	font-size: 11px;
}

.guide line {
	stroke: var(--line);
	stroke-dasharray: 4 4;
	stroke-width: 1;
}

.guide text {
	fill: var(--muted);
	font-size: 11px;
}

.rowLabel {
	fill: var(--text);
	font-size: 12px;
	font-family: var(--mono);
}

.point {
	fill: var(--text);
}

.turnPoint {
	fill: #dc2626;
}

.out {
	stroke: #0f766e;
	stroke-width: 4;
	stroke-linecap: round;
}

.outStrong {
	stroke: #2563eb;
	stroke-width: 5;
	stroke-linecap: round;
}

.back {
	stroke: #b45309;
	stroke-width: 4;
	stroke-linecap: round;
}

.backStrong {
	stroke: #dc2626;
	stroke-width: 5;
	stroke-linecap: round;
}

.legend text,
.msg text,
.note,
.warn,
.headline {
	fill: var(--muted);
	font-size: 12px;
}

.warn {
	fill: #dc2626;
}
</style>
