<template>
<div class="seCodeWrap">
	<svg
		:aria-label="t( 'graphs.gray.aria' )"
		class="seCodeSvg"
		role="img"
		:viewBox="`0 0 ${W} ${H}`"
	>
		<!-- Header -->
		<g>
			<text class="hdr mono" :x="pad" :y="pad + headerH - 6">{{ t( "graphs.gray.n" ) }}</text>
			<text class="hdr mono" :x="xBin" :y="pad + headerH - 6">{{ t( "graphs.gray.binary" ) }}</text>
			<text class="hdr mono" :x="xGray" :y="pad + headerH - 6">{{ t( "graphs.gray.gray" ) }}</text>

			<line
				class="sep"
				:x1="pad"
				:x2="W - pad"
				:y1="pad + headerH"
				:y2="pad + headerH"
			/>
		</g>

		<!-- Rows -->
		<g v-for="row in rows" :key="row.n">
			<!-- Row background (subtle zebra) -->
			<rect
				v-if="row.n % 2 === 1"
				class="zebra"
				:height="rowH"
				:width="W - 2 * pad"
				:x="pad"
				:y="rowY(row.n) - rowH + 2"
			/>

			<!-- decimal number -->
			<text
				class="num mono"
				:x="xNum"
				:y="rowY(row.n)"
			>{{ row.n }}</text>

			<!-- binary squares -->
			<g>
				<rect
					v-for="(b, i) in row.binBits"
					:key="`b-${row.n}-${i}`"
					:height="cell"
					:rx="r"
					:ry="r"
					:style="bitStyle(b)"
					:width="cell"
					:x="xBin + i * (cell + gap)"
					:y="rowY(row.n) - cell + 2"
				/>
			</g>

			<!-- gray squares -->
			<g>
				<rect
					v-for="(b, i) in row.grayBits"
					:key="`g-${row.n}-${i}`"
					:height="cell"
					:rx="r"
					:ry="r"
					:style="bitStyle(b)"
					:width="cell"
					:x="xGray + i * (cell + gap)"
					:y="rowY(row.n) - cell + 2"
				/>
			</g>

			<!-- row separator line (very thin) -->
			<line
				v-if="row.n < 31"
				class="rowline"
				:x1="pad"
				:x2="W - pad"
				:y1="rowY(row.n) + 6"
				:y2="rowY(row.n) + 6"
			/>
		</g>

		<!-- Column guides (optional subtle) -->
		<g>
			<line class="colguide"
				:x1="xBin - 14"
				:x2="xBin - 14"
				:y1="pad + headerH"
				:y2="H - pad"
			/>
			<line class="colguide"
				:x1="xGray - 14"
				:x2="xGray - 14"
				:y1="pad + headerH"
				:y2="H - pad"
			/>
		</g>
	</svg>
</div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "@/utils/i18n.mjs";

const { t } = useI18n( "book1/SE" );

/**
 * 0–31 als Binär (5 Bit) und Graycode.
 * Darstellung: 3 Spalten (n | bin | gray), Bits als helle/dunkle Quadrate.
 */

// Layout
const pad = 14;
const headerH = 22;

const cell = 14; // Quadratgröße
const gap = 4; // Abstand zwischen Bits
const r = 3; // Corner-Radius (für die kleinen Quadrate)

const rowH = 18; // Zeilenhöhe (Baseline-Abstand)
const numW = 34; // Breite der Nummernspalte
const colGap = 24; // Abstand zwischen Spalten

const bits = 5;
const bitsW = bits * cell + ( bits - 1 ) * gap;

const W = pad * 2 + numW + colGap + bitsW + colGap + bitsW;
const H = pad * 2 + headerH + 32 * rowH + 6;

// Column x-Positions
const xNum = pad;
const xBin = pad + numW + colGap;
const xGray = xBin + bitsW + colGap;

function rowY( n ) {
	// Baseline für Text / Mitte der Bits
	return pad + headerH + ( n + 1 ) * rowH;
}

function bitsOf( value, bitCount = 5 ) {
	// MSB -> LSB
	const out = [];

	for ( let i = bitCount - 1; i >= 0; i-- ) {
		out.push( value >> i & 1 );
	}

	return out;
}

function grayOf( n ) {
	return n ^ n >> 1;
}

const rows = computed( () =>
	Array.from( { length: 32 }, ( _, n ) => ( {
		n,
		binBits:  bitsOf( n, bits ),
		grayBits: bitsOf( grayOf( n ), bits )
	} ) ) );

function bitStyle( bit ) {
	// Bit 1: Theme-primary, Bit 0: sehr helles on-surface
	return {
		fill:        bit ? "rgba(var(--v-theme-primary), 0.78)" : "rgba(var(--v-theme-on-surface), 0.10)",
		stroke:      bit ? "rgba(var(--v-theme-primary), 0.55)" : "rgba(var(--v-theme-on-surface), 0.18)",
		strokeWidth: 1
	};
}
</script>

<style scoped>
.seCodeWrap {
	width: min(100%, 780px);
}

.seCodeSvg {
	width: 100%;
	height: auto;
	display: block;
	border: 1px solid rgba(var(--v-theme-on-surface), 0.2);
	border-radius: 14px;
	background: rgba(var(--v-theme-surface), 0.85);
}

.mono {
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.hdr {
	font-size: 12px;
	font-weight: 800;
	fill: rgba(var(--v-theme-on-surface), 0.7);
	user-select: none;
}

.num {
	font-size: 12.5px;
	font-weight: 800;
	fill: rgba(var(--v-theme-on-surface), 0.85);
	user-select: none;
}

.sep {
	stroke: rgba(var(--v-theme-on-surface), 0.22);
	stroke-width: 1;
}

.rowline {
	stroke: rgba(var(--v-theme-on-surface), 0.10);
	stroke-width: 1;
}

.colguide {
	stroke: rgba(var(--v-theme-on-surface), 0.12);
	stroke-width: 1;
	stroke-dasharray: 2 4;
}

.zebra {
	fill: rgba(var(--v-theme-on-surface), 0.04);
}
</style>
