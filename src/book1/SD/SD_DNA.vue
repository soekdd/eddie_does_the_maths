<template>
<div class="sdDna">
	<div class="canvasFrame">
		<svg
			aria-label="DNA-Helix aus einem Textstring"
			class="helix"
			role="img"
			:viewBox="`180 0 ${VIEW.width-200} ${viewHeight}`"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect
				class="bg"
				height="100%"
				:width="VIEW.width"
				x="0"
				y="0"
			/>

			<g v-if="pairs.length">
				<g class="codonGroups">
					<g v-for="group in codonGroups" :key="group.key">
						<rect
							:class="[ 'codonBand', { codonBandAlt: group.index % 2 === 0 } ]"
							:height="group.yBottom - group.yTop"
							rx="10"
							:width="helixBounds.width"
							:x="helixBounds.left"
							:y="group.yTop"
						/>
						<line
							class="codonBracket"
							:x1="helixBounds.left - 18"
							:x2="helixBounds.left - 18"
							:y1="group.yTop"
							:y2="group.yBottom"
						/>
						<line
							class="codonBracket"
							:x1="helixBounds.left - 18"
							:x2="helixBounds.left - 10"
							:y1="group.yTop"
							:y2="group.yTop"
						/>
						<line
							class="codonBracket"
							:x1="helixBounds.left - 18"
							:x2="helixBounds.left - 10"
							:y1="group.yBottom"
							:y2="group.yBottom"
						/>
						<text
							class="aaLetter"
							:x="helixBounds.right + 12"
							:y="group.yLabel"
						>
							{{ group.aaLetter }}
						</text>
						<text
							class="aaName"
							:x="helixBounds.right + 42"
							:y="group.yLabel"
						>
							{{ group.aaLabel }}
						</text>
					</g>
				</g>

				<path
					v-for="segment in backSegments"
					:key="segment.key"
					class="strand strandBack"
					:d="segment.d"
				/>
				<line
					v-for="rung in backRungs"
					:key="rung.key"
					class="rung rungBack"
					:x1="rung.x1"
					:x2="rung.x2"
					:y1="rung.y"
					:y2="rung.y"
				/>

				<path
					v-for="segment in frontSegments"
					:key="segment.key"
					class="strand strandFront"
					:d="segment.d"
				/>
				<line
					v-for="rung in frontRungs"
					:key="rung.key"
					class="rung rungFront"
					:x1="rung.x1"
					:x2="rung.x2"
					:y1="rung.y"
					:y2="rung.y"
				/>

				<g v-for="node in backNodes" :key="node.key">
					<path
						class="baseBubble baseBubbleBack"
						:d="baseBubblePath( node )"
						:fill="baseColor( node.letter )"
					/>
					<text
						class="baseLabel"
						:fill="baseTextColor( node.letter )"
						:x="baseLabelX( node )"
						:y="node.y"
					>
						{{ node.letter }}
					</text>
				</g>

				<g v-for="node in frontNodes" :key="node.key">
					<path
						class="baseBubble baseBubbleFront"
						:d="baseBubblePath( node )"
						:fill="baseColor( node.letter )"
					/>
					<text
						class="baseLabel"
						:fill="baseTextColor( node.letter )"
						:x="baseLabelX( node )"
						:y="node.y"
					>
						{{ node.letter }}
					</text>
				</g>
			</g>

			<g v-else>
				<text class="emptyText" :x="VIEW.width / 2" :y="viewHeight / 2">
					Keine DNA-Sequenz vorhanden.
				</text>
			</g>
		</svg>
	</div>

	<div class="legend">
		<div v-for="item in legendItems" :key="item.letter" class="legendItem">
			<span class="swatch" :style="{ backgroundColor: item.color }"></span>
			<span class="mono">{{ item.letter }}</span>
		</div>
	</div>

	<p class="muted">
		Basenpaare: <b>{{ pairs.length }}</b>,
		Windungen: <b>{{ turns }}</b>,
		Raster: <b>3 Basenpaare pro Windung</b>.
		{{ invalidChars.length ? ` Ignoriert: ${invalidCharsText}.` : "" }}
	</p>
</div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps( { dna: { type: String, default: "" } } );

const VIEW = {
	width:   760,
	topPad:  52,
	bottom:  52,
	centerX: 380
};

const BASES_PER_TURN = 3;
const ANGLE_STEP = Math.PI * 2 / BASES_PER_TURN;
const STRAND_HALF_SPAN = 96;
const TWIST_AMPLITUDE = 46;
const BASE_BUBBLE_RADIUS = 14;
const BASE_RECT_EXTENSION = 39;
const SPLINE_HANDLE_FACTOR = 0.24;

const COMPLEMENT = {
	A: "T",
	T: "A",
	C: "G",
	G: "C"
};

const BASE_COLORS = {
	A: "#4caf50",
	T: "#ef5350",
	C: "#42a5f5",
	G: "#ffca28",
	N: "#9ca3af"
};

const BASE_TEXT_COLORS = {
	A: "#ffffff",
	T: "#ffffff",
	C: "#ffffff",
	G: "#1f2937",
	N: "#111827"
};

const aminoByLetter = {
	A: {
		short:  "Ala",
		nameDe: "Alanin"
	},
	C: {
		short:  "Cys",
		nameDe: "Cystein"
	},
	D: {
		short:  "Asp",
		nameDe: "Asparaginsäure"
	},
	E: {
		short:  "Glu",
		nameDe: "Glutaminsäure"
	},
	F: {
		short:  "Phe",
		nameDe: "Phenylalanin"
	},
	G: {
		short:  "Gly",
		nameDe: "Glycin"
	},
	H: {
		short:  "His",
		nameDe: "Histidin"
	},
	I: {
		short:  "Ile",
		nameDe: "Isoleucin"
	},
	K: {
		short:  "Lys",
		nameDe: "Lysin"
	},
	L: {
		short:  "Leu",
		nameDe: "Leucin"
	},
	M: {
		short:  "Met",
		nameDe: "Methionin"
	},
	N: {
		short:  "Asn",
		nameDe: "Asparagin"
	},
	O: {
		short:  "Pyl",
		nameDe: "Pyrrolysin"
	},
	P: {
		short:  "Pro",
		nameDe: "Prolin"
	},
	Q: {
		short:  "Gln",
		nameDe: "Glutamin"
	},
	R: {
		short:  "Arg",
		nameDe: "Arginin"
	},
	S: {
		short:  "Ser",
		nameDe: "Serin"
	},
	T: {
		short:  "Thr",
		nameDe: "Threonin"
	},
	U: {
		short:  "Sec",
		nameDe: "Selenocystein"
	},
	V: {
		short:  "Val",
		nameDe: "Valin"
	},
	W: {
		short:  "Trp",
		nameDe: "Tryptophan"
	},
	Y: {
		short:  "Tyr",
		nameDe: "Tyrosin"
	}
};

const letterByCodon = {
	GCT: "A",
	TGT: "C",
	GAT: "D",
	GAA: "E",
	TTT: "F",
	GGT: "G",
	CAT: "H",
	ATT: "I",
	AAA: "K",
	TTA: "L",
	ATG: "M",
	AAT: "N",
	TAG: "O",
	CCT: "P",
	CAA: "Q",
	CGT: "R",
	TCT: "S",
	ACT: "T",
	TGA: "U",
	GTT: "V",
	TGG: "W",
	TAT: "Y"
};

const legendItems = [
	{
		letter: "A",
		color:  BASE_COLORS.A
	},
	{
		letter: "T",
		color:  BASE_COLORS.T
	},
	{
		letter: "C",
		color:  BASE_COLORS.C
	},
	{
		letter: "G",
		color:  BASE_COLORS.G
	}
];

const normalizedInput = computed( () => String( props.dna ?? "" )
	.toUpperCase()
	.replace( /\s+/g, "" ) );

const parsedBases = computed( () => {
	const valid = [];
	const invalid = new Set();

	for ( const char of normalizedInput.value ) {
		if ( char in COMPLEMENT ) {
			valid.push( char );
			continue;
		}

		invalid.add( char );
	}

	return {
		valid,
		invalid: [ ...invalid ].sort()
	};
} );

const bases = computed( () => parsedBases.value.valid );
const invalidChars = computed( () => parsedBases.value.invalid );
const invalidCharsText = computed( () => invalidChars.value.map( ( char ) => `'${char}'` ).join( ", " ) );

const rowStep = computed( () => {
	const count = bases.value.length;

	if ( count <= 18 ) {
		return 56;
	}

	if ( count <= 36 ) {
		return 42;
	}

	if ( count <= 72 ) {
		return 30;
	}

	return 22;
} );

const viewHeight = computed( () => {
	const rows = Math.max( 1, bases.value.length );
	return VIEW.topPad + VIEW.bottom + ( rows - 1 ) * rowStep.value;
} );

const pairs = computed( () => bases.value.map( ( base, index ) => {
	const theta = index * ANGLE_STEP;
	const y = VIEW.topPad + index * rowStep.value;
	const shift = Math.sin( theta ) * TWIST_AMPLITUDE;
	const depth = Math.cos( theta );
	const leftX = VIEW.centerX - STRAND_HALF_SPAN + shift;
	const rightX = VIEW.centerX + STRAND_HALF_SPAN - shift;

	return {
		index,
		base,
		complement: COMPLEMENT[ base ] ?? "N",
		theta,
		depth,
		y,
		leftX,
		rightX
	};
} ) );

const turns = computed( () => Math.ceil( pairs.value.length / BASES_PER_TURN ) );
const helixBounds = computed( () => {
	if ( !pairs.value.length ) {
		return {
			left:  VIEW.centerX - 170,
			right: VIEW.centerX + 170,
			width: 340
		};
	}

	let minX = Number.POSITIVE_INFINITY;
	let maxX = Number.NEGATIVE_INFINITY;

	for ( const pair of pairs.value ) {
		minX = Math.min(
			minX, pair.leftX, pair.rightX
		);
		maxX = Math.max(
			maxX, pair.leftX, pair.rightX
		);
	}

	const left = minX - ( BASE_BUBBLE_RADIUS + 12 );
	const right = maxX + ( BASE_BUBBLE_RADIUS + 12 );

	return {
		left,
		right,
		width: right - left
	};
} );
const codonGroups = computed( () => {
	const groups = [];

	for ( let start = 0; start < pairs.value.length; start += BASES_PER_TURN ) {
		const slice = pairs.value.slice( start, start + BASES_PER_TURN );
		const first = slice[ 0 ];
		const last = slice[ slice.length - 1 ];
		const index = groups.length + 1;
		const codon = slice.map( ( pair ) => pair.base ).join( "" );
		const amino = resolveAminoByCodon( codon );
		const complete = slice.length === BASES_PER_TURN;
		const aaLabel = complete ?
			`${amino.nameDe} (${codon})` :
			"Restgruppe";

		groups.push( {
			key:      `codon-${index}`,
			index,
			codon,
			complete,
			aaLetter: complete ? amino.letter : "·",
			aaLabel,
			yTop:     first.y - rowStep.value * 0.5,
			yBottom:  last.y + rowStep.value * 0.5,
			yLabel:   ( first.y + last.y ) / 2
		} );
	}

	return groups;
} );

const strandSegments = computed( () => {
	const leftPoints = pairs.value.map( ( pair ) => ( {
		x:     pair.leftX,
		y:     pair.y,
		theta: pair.theta
	} ) );
	const rightPoints = pairs.value.map( ( pair ) => ( {
		x:     pair.rightX,
		y:     pair.y,
		theta: pair.theta
	} ) );
	const leftSegments = buildSplineSegments( "left", leftPoints );
	const rightSegments = buildSplineSegments( "right", rightPoints );

	return [
		...leftSegments,
		...rightSegments
	];
} );

const backSegments = computed( () => strandSegments.value.filter( ( segment ) => segment.depth < 0 ) );
const frontSegments = computed( () => strandSegments.value.filter( ( segment ) => segment.depth >= 0 ) );

const rungs = computed( () => pairs.value.map( ( pair ) => ( {
	key:   `rung-${pair.index}`,
	x1:    pair.leftX,
	x2:    pair.rightX,
	y:     pair.y,
	depth: pair.depth
} ) ) );
const backRungs = computed( () => rungs.value.filter( ( rung ) => rung.depth < 0 ) );
const frontRungs = computed( () => rungs.value.filter( ( rung ) => rung.depth >= 0 ) );

const baseNodes = computed( () => pairs.value.flatMap( ( pair ) => [ {
	key:    `base-${pair.index}-left`,
	x:      pair.leftX,
	y:      pair.y,
	letter: pair.complement,
	side:   "left",
	depth:  pair.depth
},
{
	key:    `base-${pair.index}-right`,
	x:      pair.rightX,
	y:      pair.y,
	letter: pair.base,
	side:   "right",
	depth:  pair.depth
} ] ) );
const backNodes = computed( () => baseNodes.value.filter( ( node ) => node.depth < 0 ) );
const frontNodes = computed( () => baseNodes.value.filter( ( node ) => node.depth >= 0 ) );

function baseBubblePath( node ) {
	const seamX = node.x;
	const top = node.y - BASE_BUBBLE_RADIUS;
	const bottom = node.y + BASE_BUBBLE_RADIUS;
	const arcRadius = fmtSvg( BASE_BUBBLE_RADIUS );

	if ( node.side === "left" ) {
		const rectX = seamX + BASE_RECT_EXTENSION;

		return `M ${fmtSvg( seamX )} ${fmtSvg( top )} ` +
			`L ${fmtSvg( rectX )} ${fmtSvg( top )} ` +
			`L ${fmtSvg( rectX )} ${fmtSvg( bottom )} ` +
			`L ${fmtSvg( seamX )} ${fmtSvg( bottom )} ` +
			`A ${arcRadius} ${arcRadius} 0 0 1 ${fmtSvg( seamX )} ${fmtSvg( top )} Z`;
	}

	const rectX = seamX - BASE_RECT_EXTENSION;

	return `M ${fmtSvg( seamX )} ${fmtSvg( top )} ` +
		`L ${fmtSvg( rectX )} ${fmtSvg( top )} ` +
		`L ${fmtSvg( rectX )} ${fmtSvg( bottom )} ` +
		`L ${fmtSvg( seamX )} ${fmtSvg( bottom )} ` +
		`A ${arcRadius} ${arcRadius} 0 0 0 ${fmtSvg( seamX )} ${fmtSvg( top )} Z`;
}

function baseLabelX( node ) {
	const centerShift = ( BASE_RECT_EXTENSION - BASE_BUBBLE_RADIUS ) / 2;
	return node.side === "left" ?
		node.x + centerShift :
		node.x - centerShift;
}

function buildSplineSegments( side, points ) {
	const segments = [];

	for ( let index = 0; index < points.length - 1; index++ ) {
		const prev = points[ Math.max( 0, index - 1 ) ];
		const current = points[ index ];
		const next = points[ index + 1 ];
		const nextNext = points[ Math.min( points.length - 1, index + 2 ) ];
		const cp1 = {
			x: current.x + ( next.x - prev.x ) * SPLINE_HANDLE_FACTOR,
			y: current.y + ( next.y - prev.y ) * SPLINE_HANDLE_FACTOR
		};
		const cp2 = {
			x: next.x - ( nextNext.x - current.x ) * SPLINE_HANDLE_FACTOR,
			y: next.y - ( nextNext.y - current.y ) * SPLINE_HANDLE_FACTOR
		};
		const depth = Math.cos( ( current.theta + next.theta ) / 2 );

		segments.push( {
			key: `strand-${side}-${index}`,
			d:   `M ${fmtSvg( current.x )} ${fmtSvg( current.y )} ` +
				`C ${fmtSvg( cp1.x )} ${fmtSvg( cp1.y )}, ` +
				`${fmtSvg( cp2.x )} ${fmtSvg( cp2.y )}, ` +
				`${fmtSvg( next.x )} ${fmtSvg( next.y )}`,
			depth
		} );
	}

	return segments;
}

function fmtSvg( value ) {
	return Number( value ).toFixed( 2 );
}

function baseColor( letter ) {
	return BASE_COLORS[ letter ] ?? BASE_COLORS.N;
}

function baseTextColor( letter ) {
	return BASE_TEXT_COLORS[ letter ] ?? BASE_TEXT_COLORS.N;
}

function resolveAminoByCodon( codon ) {
	const letter = letterByCodon[ codon ];
	const amino = aminoByLetter[ letter ];

	if ( letter && amino ) {
		return {
			letter,
			short:  amino.short,
			nameDe: amino.nameDe
		};
	}

	return {
		letter: "?",
		short:  "?",
		nameDe: `Unbekanntes Codon ${codon}`
	};
}
</script>

<style scoped>
.sdDna {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.canvasFrame {
	background: rgba(var(--v-theme-surface, 255, 255, 255), 1);
	border: 1px solid rgba(var(--v-theme-on-surface, 17, 17, 17), 0.16);
	border-radius: 12px;
	overflow-x: auto;
	overflow-y: hidden;
}

.helix {
	display: block;
	height: auto;
	min-width: 440px;
	width: 100%;
}

.bg {
	fill: rgba(var(--v-theme-primary, 21, 101, 192), 0.04);
}

.strand {
	fill: none;
	stroke-linecap: round;
}

.codonBand {
	fill: rgba(var(--v-theme-primary, 21, 101, 192), 0.06);
	stroke: rgba(var(--v-theme-primary, 21, 101, 192), 0.22);
	stroke-dasharray: 6 4;
	stroke-width: 1.2;
}

.codonBandAlt {
	fill: rgba(var(--v-theme-secondary, 2, 132, 199), 0.07);
}

.codonBracket {
	stroke: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.5);
	stroke-width: 1.4;
}

.aaLetter {
	dominant-baseline: middle;
	fill: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.92);
	font-family: var(--mono);
	font-size: 24px;
	font-weight: 900;
}

.aaName {
	dominant-baseline: middle;
	fill: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.78);
	font-family: var(--mono);
	font-size: 10px;
	font-weight: 600;
}

.strandBack {
	opacity: 0.38;
	stroke: rgba(var(--v-theme-primary, 21, 101, 192), 0.78);
	stroke-width: 18;
}

.strandFront {
	opacity: 0.94;
	stroke: rgba(var(--v-theme-primary, 21, 101, 192), 1);
	stroke-width: 18;
}

.rung {
	stroke-linecap: round;
}

.rungBack {
	opacity: 0.38;
	stroke: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.45);
	stroke-width: 2.6;
}

.rungFront {
	opacity: 0.85;
	stroke: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.7);
	stroke-width: 2.6;
}

.baseBubble {
	stroke: rgba(var(--v-theme-surface, 255, 255, 255), 0.9);
	stroke-width: 2;
}

.baseBubbleBack {
	opacity: 0.92;
}

.baseBubbleFront {
	opacity: 1;
}

.baseLabel {
	dominant-baseline: middle;
	font-family: var(--mono);
	font-size: 12px;
	font-weight: 800;
	text-anchor: middle;
}

.emptyText {
	fill: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.7);
	font-size: 16px;
	font-weight: 600;
	text-anchor: middle;
}

.legend {
	display: flex;
	flex-wrap: wrap;
	gap: 10px 14px;
}

.legendItem {
	align-items: center;
	display: inline-flex;
	gap: 8px;
}

.swatch {
	border: 1px solid rgba(var(--v-theme-on-surface, 17, 17, 17), 0.18);
	border-radius: 999px;
	display: inline-block;
	height: 14px;
	width: 14px;
}

.mono {
	font-family: var(--mono);
	font-size: 0.92rem;
}
</style>
