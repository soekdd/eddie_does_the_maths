<template>
<div class="morse-tree-wrapper">
	<svg
		:aria-label="t( 'description.tree.ariaLabel' )"
		class="morse-tree-svg"
		role="img"
		:viewBox="`0 0 ${svgWidth} ${svgHeight}`"
	>
		<defs>
			<filter id="softShadow"
				height="140%"
				width="140%"
				x="-20%"
				y="-20%"
			>
				<feDropShadow dx="0"
					dy="2"
					flood-opacity="0.18"
					stdDeviation="3"
				/>
			</filter>
		</defs>

		<!-- Hintergrund -->
	
		<!-- Zeitachse -->
		<g class="timeline-layer">
			<line
				class="timeline-line"
				:x1="timelineX"
				:x2="timelineX"
				:y1="paddingTop"
				:y2="timelineEndY"
			/>

			<text
				class="timeline-title"
				text-anchor="end"
				:x="timelineX - 12"
				:y="paddingTop - 12"
			>
				{{ t( "description.tree.timeAxis" ) }}
			</text>

			<g v-for="tick in timelineTicks" :key="tick.y">
				<line
					class="timeline-tick"
					:x1="timelineX - 8"
					:x2="timelineX"
					:y1="tick.y"
					:y2="tick.y"
				/>
				<text
					class="timeline-label"
					text-anchor="end"
					:x="timelineX - 12"
					:y="tick.y + 4"
				>
					{{ tick.label }}
				</text>
			</g>
		</g>

		<!-- Verbindungen -->
		<g class="edges-layer">
			<path
				v-for="edge in edges"
				:key="edge.id"
				class="edge-path"
				:d="edge.path"
			/>

			<text
				v-for="edge in edges"
				:key="`${edge.id}-label`"
				class="edge-label"
				text-anchor="middle"
				:x="edge.labelX"
				:y="edge.labelY"
			>
				{{ edge.symbol === "-" ? "-" : "." }}
			</text>
		</g>

		<!-- Knoten -->
		<g class="nodes-layer">
			<g
				v-for="node in nodes"
				:key="node.id"
				class="node-group"
				:class="{
					'is-active': hoveredNode?.id === node.id,
					'is-interactive': node.depth > 0
				}"
				:tabindex="node.depth > 0 ? 0 : undefined"
				:transform="`translate(${node.x}, ${node.y})`"
				@blur="hideNodeTooltip"
				@focus="showNodeTooltip( node )"
				@keydown.escape.stop="hideNodeTooltip"
				@mouseenter="showNodeTooltip( node )"
				@mouseleave="hideNodeTooltip"
			>
				<circle
					class="node-circle"
					:class="{ 'node-root': node.depth === 0, 'node-terminal': !!node.value }"
					filter="url(#softShadow)"
					:r="node.depth === 0 ? 12 : 9"
				/>

				<text
					v-if="node.depth === 0"
					class="root-label"
					text-anchor="middle"
					x="0"
					y="-22"
				>
					{{ t( "description.tree.rootLabel" ) }}
				</text>

				<text
					v-if="node.code"
					class="node-code"
					text-anchor="middle"
					x="0"
					y="-16"
				>
					{{ node.code }}
				</text>

				<text
					class="node-value"
					text-anchor="middle"
					x="0"
					y="5"
				>
					{{ node.value || "·" }}
				</text>
			</g>
		</g>

		<!-- Legende -->
		<g class="legend-layer" :transform="`translate(${svgWidth - 220}, ${svgHeight - 140})`">
			<rect class="legend-box"
				height="116"
				rx="14"
				width="212"
			/>
			<text class="legend-title" x="16" y="24">{{ t( "description.tree.legendTitle" ) }}</text>

			<line class="legend-line"
				x1="16"
				x2="56"
				y1="44"
				y2="44"
			/>
			<text class="legend-text" x="68" y="48">{{ t( "description.tree.legendEdge" ) }}</text>

			<circle class="node-circle node-terminal"
				cx="22"
				cy="72"
				r="8"
			/>
			<text class="legend-text" x="68" y="76">{{ t( "description.tree.legendTerminal" ) }}</text>

			<circle class="node-circle"
				cx="22"
				cy="98"
				r="8"
			/>
			<text class="legend-text" x="68" y="102">{{ t( "description.tree.legendIntermediate" ) }}</text>
		</g>

		<g v-if="activeTooltip" class="tooltip-layer">
			<path
				class="tooltip-connector"
				:d="activeTooltip.connectorPath"
			/>

			<g :transform="`translate(${activeTooltip.boxX}, ${activeTooltip.boxY})`">
				<rect
					class="tooltip-card"
					filter="url(#softShadow)"
					height="118"
					rx="18"
					width="236"
				/>

				<circle
					class="tooltip-lens"
					cx="48"
					cy="58"
					r="26"
				/>
				<circle
					class="tooltip-lens-glow"
					cx="42"
					cy="51"
					r="13"
				/>
				<line
					class="tooltip-lens-handle"
					x1="67"
					x2="83"
					y1="75"
					y2="91"
				/>
				<text
					class="tooltip-letter"
					text-anchor="middle"
					x="48"
					y="67"
				>
					{{ activeTooltip.displayValue }}
				</text>

				<text class="tooltip-title" x="92" y="28">
					{{ activeTooltip.title }}
				</text>
				<text class="tooltip-label" x="92" y="52">{{ t( "description.tree.tooltipCode" ) }}</text>
				<text class="tooltip-code" x="92" y="74">
					{{ activeTooltip.codeLabel }}
				</text>
				<text class="tooltip-label" x="92" y="96">{{ t( "description.tree.tooltipDuration" ) }}</text>
				<text class="tooltip-duration" x="92" y="112">
					{{ activeTooltip.durationLabel }}
				</text>
			</g>
		</g>
	</svg>
</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "@/utils/i18n.mjs";

type MorseMap = Record<string, string>;

type RawNode = {
  id: string;
  code: string;
  durationUnits: number;
  value: string;
  depth: number;
  x: number;
  y: number;
};

type Edge = {
  id: string;
  from: string;
  to: string;
  symbol: "." | "-";
  path: string;
  labelX: number;
  labelY: number;
};

const morseMap: MorseMap = {
	A: ".-",
	B: "-...",
	C: "-.-.",
	D: "-..",
	E: ".",
	F: "..-.",
	G: "--.",
	H: "....",
	I: "..",
	J: ".---",
	K: "-.-",
	L: ".-..",
	M: "--",
	N: "-.",
	O: "---",
	P: ".--.",
	Q: "--.-",
	R: ".-.",
	S: "...",
	T: "-",
	U: "..-",
	V: "...-",
	W: ".--",
	X: "-..-",
	Y: "-.--",
	Z: "--..",
	0: "-----",
	1: ".----",
	2: "..---",
	3: "...--",
	4: "....-",
	5: ".....",
	6: "-....",
	7: "--...",
	8: "---..",
	9: "----."
};

const paddingTop = 70;
const paddingRight = -50;
const paddingBottom = 20;
const paddingLeft = 190;

const timelineX = 54;
const { t } = useI18n( "book1.HA" );

// Eine Morse-Zeiteinheit entspricht einer Punkt-Länge.
const timeUnitStep = 32;

// Horizontaler Startabstand auf Ebene 1.
// Danach halbiert er sich pro Ebene.
const initialBranchOffset = 190;
const branchShrinkFactor = 0.38;
const minBranchOffset = 16;
const tooltipWidth = 236;
const tooltipHeight = 118;
const tooltipGap = 28;
const tooltipInset = 12;

function symbolUnits( symbol: "." | "-" ): number {
	return symbol === "-" ? 3 : 1;
}

function symbolDuration( symbol: "." | "-" ): number {
	return symbolUnits( symbol ) * timeUnitStep;
}

function morseDurationUnits( code: string ): number {
	let total = 0;

	for ( const symbol of code ) {
		total += symbolUnits( symbol as "." | "-" );
	}

	return total;
}

function formatDurationLabel( units: number ): string {
	return t( units === 1 ?
		"description.tree.durationSingle" :
		"description.tree.durationPlural",
	{ count: units } );
}

function clamp(
	value: number, min: number, max: number
) {
	return Math.min( Math.max( value, min ), max );
}

function buildTreeData( map: MorseMap ) {
  type InternalNode = {
    id: string;
    code: string;
    value: string;
    depth: number;
    parentId: string | null;
    via: "." | "-" | null;
    children: Record<string, InternalNode | undefined>;
    x: number;
    y: number;
  };

  const nodeIndex = new Map<string, InternalNode>();

  const root: InternalNode = {
  	id:       "root",
  	code:     "",
  	value:    "",
  	depth:    0,
  	parentId: null,
  	via:      null,
  	children: {},
  	x:        0,
  	y:        paddingTop
  };

  nodeIndex.set( root.id, root );

  for ( const [ char, code ] of Object.entries( map ) ) {
  	let current = root;

  	for ( let i = 0; i < code.length; i++ ) {
  		const symbol = code[ i ] as "." | "-";
  		const nextCode = current.code + symbol;
  		const childId = nextCode || "root";

  		if ( !current.children[ symbol ] ) {
  			const child: InternalNode = {
  				id:       childId,
  				code:     nextCode,
  				value:    "",
  				depth:    current.depth + 1,
  				parentId: current.id,
  				via:      symbol,
  				children: {},
  				x:        0,
  				y:        current.y + symbolDuration( symbol )
  			};

  			current.children[ symbol ] = child;
  			nodeIndex.set( child.id, child );
  		}

  		current = current.children[ symbol ]!;
  	}

  	current.value = char;
  }

  // Layout: links = Strich, rechts = Punkt
  function layout(
  	node: InternalNode, x: number, offset: number
  ) {
  	node.x = x;

  	const leftChild = node.children[ "-" ];
  	const rightChild = node.children[ "." ];

  	// Weniger aggressives Schrumpfen in tiefen Ebenen,
  	// damit die Endknoten nicht aufeinanderliegen
  	const nextOffset = Math.max( offset * branchShrinkFactor, minBranchOffset );

  	if ( leftChild ) {
  		layout(
  			leftChild, x - offset, nextOffset
  		);
  	}

  	if ( rightChild ) {
  		layout(
  			rightChild, x + offset, nextOffset
  		);
  	}
  }

  const rootX = paddingLeft + initialBranchOffset;
  layout(
  	root, rootX, initialBranchOffset
  );

  const nodes: RawNode[] = Array.from( nodeIndex.values() ).map( ( node ) => ( {
  	id:            node.id,
  	code:          node.code,
  	durationUnits: morseDurationUnits( node.code ),
  	value:         node.value,
  	depth:         node.depth,
  	x:             node.x,
  	y:             node.y
  } ) );

  const edges: Omit<Edge, "path" | "labelX" | "labelY">[] = [];

  for ( const node of nodeIndex.values() ) {
  	if ( !node.parentId || !node.via ) {
  		continue;
  	}

  	edges.push( {
  		id:     `${node.parentId}->${node.id}`,
  		from:   node.parentId,
  		to:     node.id,
  		symbol: node.via
  	} );
  }

  return { nodes, edges };
}

const tree = computed( () => buildTreeData( morseMap ) );

const nodes = computed( () => tree.value.nodes );

const nodeLookup = computed( () => {
	const map = new Map<string, RawNode>();

	for ( const node of nodes.value ) {
		map.set( node.id, node );
	}

	return map;
} );

const maxX = computed( () => Math.max( ...nodes.value.map( ( n ) => n.x ) ) );
const maxY = computed( () => Math.max( ...nodes.value.map( ( n ) => n.y ) ) );
const maxDurationUnits = computed( () => Math.max( ...nodes.value.map( ( n ) => n.durationUnits ) ) );
const hoveredNode = ref<RawNode | null>( null );
const timelineEndY = computed( () => paddingTop + maxDurationUnits.value * timeUnitStep );

const svgWidth = computed( () => Math.max( 720, maxX.value + paddingRight + 0 ) );
const svgHeight = computed( () => Math.max( 550, Math.max( maxY.value, timelineEndY.value ) + paddingBottom + 40 ) );

function curvedPath(
	x1: number, y1: number, x2: number, y2: number
) {
	const cy = y1 + ( y2 - y1 ) * 0.4;
	return `M ${x1} ${y1} C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2}`;
}

const edges = computed<Edge[]>( () => {
	return tree.value.edges.map( ( edge ) => {
		const from = nodeLookup.value.get( edge.from )!;
		const to = nodeLookup.value.get( edge.to )!;

		const path = curvedPath(
			from.x, from.y, to.x, to.y
		);

		return {
			...edge,
			path,
			labelX: ( from.x + to.x ) / 2,
			labelY: ( from.y + to.y ) / 2 - 8
		};
	} );
} );

const timelineTicks = computed( () => {
	const ticks = [];

	for ( let unit = 0; unit <= maxDurationUnits.value; unit++ ) {
		ticks.push( {
			y:     paddingTop + unit * timeUnitStep,
			label: `${unit}`
		} );
	}

	return ticks;
} );

function showNodeTooltip( node: RawNode ) {
	if ( node.depth === 0 ) {
		return;
	}

	hoveredNode.value = node;
}

function hideNodeTooltip() {
	hoveredNode.value = null;
}

const activeTooltip = computed( () => {
	const node = hoveredNode.value;

	if ( !node ) {
		return null;
	}

	const preferLeft = node.x > svgWidth.value - tooltipWidth - 40;
	const rawBoxX = preferLeft ?
		node.x - tooltipWidth - tooltipGap :
		node.x + tooltipGap;
	const boxX = clamp(
		rawBoxX, tooltipInset, svgWidth.value - tooltipWidth - tooltipInset
	);
	const boxY = clamp(
		node.y - tooltipHeight / 2,
		tooltipInset,
		svgHeight.value - tooltipHeight - tooltipInset
	);
	const connectorX = preferLeft ? boxX + tooltipWidth : boxX;
	const connectorY = boxY + tooltipHeight / 2;

	return {
		boxX,
		boxY,
		codeLabel:     node.code,
		connectorPath: `M ${node.x} ${node.y} Q ${( node.x + connectorX ) / 2} ${node.y}, ${connectorX} ${connectorY}`,
		displayValue:  node.value || "·",
		durationLabel: formatDurationLabel( node.durationUnits ),
		title:         node.value ?
			t( "description.tree.letterTitle", { value: node.value } ) :
			t( "description.tree.intermediateTitle" )
	};
} );
</script>

<style scoped>
.morse-tree-wrapper {
  --tree-bg-start: rgba(var(--v-theme-background), 0.96);
  --tree-bg-end: rgba(var(--v-theme-surface), 0.98);
  --tree-surface: rgb(var(--v-theme-surface));
  --tree-surface-soft: rgba(var(--v-theme-surface), 0.92);
  --tree-surface-veil: rgba(var(--v-theme-surface), 0.96);
  --tree-border: rgba(var(--v-theme-on-surface), 0.14);
  --tree-border-strong: rgba(var(--v-theme-on-surface), 0.3);
  --tree-ink: rgba(var(--v-theme-on-surface), 0.92);
  --tree-ink-soft: rgba(var(--v-theme-on-surface), 0.78);
  --tree-muted: rgba(var(--v-theme-on-surface), 0.58);
  --tree-faint: rgba(var(--v-theme-on-surface), 0.18);
  --tree-primary-soft: rgba(var(--v-theme-primary), 0.14);
  --tree-primary: rgba(var(--v-theme-primary), 0.9);
  --tree-success-soft: rgba(var(--v-theme-success), 0.74);
  --tree-success: rgba(var(--v-theme-success), 0.86);
  --tree-info-soft: rgba(var(--v-theme-info), 0.14);
  --tree-info: rgba(var(--v-theme-info), 0.88);
  height: 100%;
  overflow-x: auto;
  background: linear-gradient(180deg, var(--tree-bg-start) 0%, var(--tree-bg-end) 100%);
  border: 1px solid var(--tree-border);
  border-radius: 20px;
  padding: 12px;
}

.morse-tree-svg {
  width: 100%;
  height: auto;
  display: block;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.bg-panel {
  fill: var(--tree-surface);
  stroke: var(--tree-border);
  stroke-width: 1.2;
}

.timeline-line {
  stroke: var(--tree-border-strong);
  stroke-width: 1.5;
  stroke-dasharray: 5 6;
}

.timeline-tick {
  stroke: var(--tree-border-strong);
  stroke-width: 1.2;
}

.timeline-title {
  font-size: 14px;
  font-weight: 700;
  fill: var(--tree-ink-soft);
}

.timeline-label {
  font-size: 11px;
  fill: var(--tree-muted);
}

.edge-path {
  fill: none;
  stroke: var(--tree-muted);
  stroke-width: 2.2;
  opacity: 0.9;
}

.edge-label {
  font-size: 30px;
  fill: var(--tree-muted);
  paint-order: stroke;
  stroke: var(--tree-surface);
  stroke-width: 4px;
  stroke-linejoin: round;
}

.node-group {
  outline: none;
  pointer-events: auto;
}

.node-group.is-interactive {
  cursor: pointer;
}

.node-group.is-active .node-circle,
.node-group.is-interactive:hover .node-circle,
.node-group.is-interactive:focus-visible .node-circle {
  stroke: var(--tree-primary);
  stroke-width: 3;
}

.node-group.is-active .node-value,
.node-group.is-interactive:hover .node-value,
.node-group.is-interactive:focus-visible .node-value {
  fill: var(--tree-ink);
}

.node-circle {
  fill: var(--tree-surface);
  stroke: var(--tree-border-strong);
  stroke-width: 2;
}

.node-root {
  fill: var(--tree-primary-soft);
  stroke: var(--tree-primary);
}

.node-terminal {
  fill: var(--tree-success-soft);
  stroke: var(--tree-success);
}

.root-label {
  font-size: 13px;
  font-weight: 700;
  fill: var(--tree-ink-soft);
}

.node-code {
  font-size: 11px;
  fill: var(--tree-muted);
}

.node-value {
  font-size: 12px;
  font-weight: 700;
  fill: var(--tree-ink);
}

.tooltip-layer {
  pointer-events: none;
}

.tooltip-connector {
  fill: none;
  stroke: var(--tree-border-strong);
  stroke-dasharray: 5 5;
  stroke-width: 2.4;
}

.tooltip-card {
  fill: var(--tree-surface-veil);
  stroke: var(--tree-border);
  stroke-width: 1.4;
}

.tooltip-lens {
  fill: var(--tree-info-soft);
  stroke: var(--tree-info);
  stroke-width: 6;
}

.tooltip-lens-glow {
  fill:  rgba(var(--v-theme-surface), 0.25);
  stroke: rgba(var(--v-theme-surface), 0.95);
  stroke-width: 1.5;
}

.tooltip-lens-handle {
  stroke: var(--tree-info);
  stroke-linecap: round;
  stroke-width: 6;
}

.tooltip-letter {
  fill: var(--tree-ink);
  font-size: 30px;
  font-weight: 800;
}

.tooltip-title {
  fill: var(--tree-ink-soft);
  font-size: 12px;
  font-weight: 700;
}

.tooltip-label {
  fill: var(--tree-muted);
  font-size: 11px;
  font-weight: 700;
}

.tooltip-code {
  fill: var(--tree-ink);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.tooltip-duration {
  fill: var(--tree-ink);
  font-size: 15px;
  font-weight: 700;
}

.legend-box {
  fill: var(--tree-surface-soft);
  stroke: var(--tree-border);
  stroke-width: 1.2;
}

.legend-title {
  font-size: 13px;
  font-weight: 700;
  fill: var(--tree-ink-soft);
}

.legend-line {
  stroke: var(--tree-muted);
  stroke-width: 2.2;
}

.legend-text {
  font-size: 12px;
  fill: var(--tree-muted);
}
</style>
