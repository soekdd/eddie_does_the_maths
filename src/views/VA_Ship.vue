<template>
<div class="vaShipWrap" :class="{ noLegendMode: props.nolegend }">
	<svg
		:aria-label="`Schiffquerschnitt mit Kraeften, Heel=${fmt( model.heelDeg, 1 )} deg`"
		class="vaShipFigure"
		role="img"
		:viewBox="model.shipViewBox"
		xmlns="http://www.w3.org/2000/svg"
	>
		<defs>
			<marker id="vaArrow"
				markerHeight="6"
				markerWidth="6"
				orient="auto-start-reverse"
				refX="5.25"
				refY="3"
			>
				<path d="M0,0 L6,3 L0,6 z" fill="currentColor" />
			</marker>
		</defs>

		<rect class="bg"
			:height="model.height"
			:width="model.width"
			x="0"
			y="0"
		/>

		<rect class="water"
			:height="model.height - model.waterY"
			:width="model.width"
			x="0"
			:y="model.waterY"
		/>
		<line class="waterline"
			x1="0"
			:x2="model.width"
			:y1="model.waterY"
			:y2="model.waterY"
		/>

		<g v-if="!props.nolegend" class="windLogo" :transform="model.windLogoTransform">
			<!--  eslint-disable-next-line vue/max-len -->
			<path d="M28.69,53.38c-1.61,0-2.91-1.3-2.91-2.91c0-1.61,1.3-2.91,2.91-2.91h51.37c0.21,0,0.42,0.02,0.62,0.07 c1.84,0.28,3.56,0.8,5.1,1.63c1.7,0.92,3.15,2.19,4.27,3.89c3.85,5.83,3.28,11.24,0.56,15.24c-1.77,2.61-4.47,4.55-7.45,5.57 c-3,1.03-6.32,1.13-9.32,0.03c-4.54-1.66-8.22-5.89-8.76-13.55c-0.11-1.6,1.1-2.98,2.7-3.09c1.6-0.11,2.98,1.1,3.09,2.7 c0.35,4.94,2.41,7.56,4.94,8.48c1.71,0.62,3.67,0.54,5.48-0.08c1.84-0.63,3.48-1.79,4.52-3.32c1.49-2.19,1.71-5.28-0.61-8.79 c-0.57-0.86-1.31-1.51-2.18-1.98c-0.91-0.49-1.97-0.81-3.13-0.99H28.69L28.69,53.38z M15.41,27.21c-1.61,0-2.91-1.3-2.91-2.91 c0-1.61,1.3-2.91,2.91-2.91h51.21c1.17-0.18,2.23-0.5,3.14-0.99c0.87-0.47,1.61-1.12,2.18-1.98c2.32-3.51,2.09-6.6,0.61-8.79 c-1.04-1.53-2.68-2.69-4.52-3.32c-1.81-0.62-3.78-0.7-5.48-0.08c-2.52,0.92-4.59,3.54-4.94,8.48c-0.11,1.6-1.49,2.81-3.09,2.7 c-1.6-0.11-2.81-1.49-2.7-3.09c0.54-7.66,4.22-11.89,8.76-13.55c3-1.09,6.32-0.99,9.32,0.03c2.98,1.02,5.68,2.97,7.45,5.57 c2.72,4,3.29,9.41-0.56,15.24c-1.12,1.7-2.57,2.97-4.27,3.89c-1.54,0.83-3.26,1.35-5.1,1.63c-0.2,0.04-0.41,0.07-0.62,0.07H15.41 L15.41,27.21z M2.91,40.3C1.3,40.3,0,38.99,0,37.39c0-1.61,1.3-2.91,2.91-2.91h107.07c1.17-0.18,2.23-0.5,3.13-0.99 c0.87-0.47,1.61-1.12,2.18-1.98c2.32-3.51,2.09-6.6,0.61-8.79c-1.04-1.53-2.68-2.69-4.52-3.32c-1.81-0.62-3.78-0.7-5.48-0.08 c-2.52,0.92-4.59,3.54-4.94,8.48c-0.11,1.6-1.49,2.81-3.09,2.7c-1.6-0.11-2.81-1.49-2.7-3.09c0.54-7.66,4.22-11.89,8.76-13.55 c3-1.09,6.32-0.99,9.32,0.03c2.98,1.02,5.68,2.97,7.45,5.57c2.72,4,3.29,9.41-0.56,15.24c-1.12,1.7-2.57,2.97-4.27,3.89 c-1.54,0.83-3.26,1.35-5.1,1.63c-0.2,0.04-0.41,0.07-0.62,0.07H2.91L2.91,40.3z" />
		</g>

		<g>
			<polygon class="hull" :points="model.hullPoints" />
			<line class="deck"
				:x1="model.deckL.x"
				:x2="model.deckR.x"
				:y1="model.deckL.y"
				:y2="model.deckR.y"
			/>
			<line class="mast"
				:x1="model.mastBase.x"
				:x2="model.mastTop.x"
				:y1="model.mastBase.y"
				:y2="model.mastTop.y"
			/>
			<polygon class="sail" :points="model.sailPoints" />
		</g>

		<g class="dims">
			<line v-if="!props.nolegend"
				class="dim"
				marker-end="url(#vaArrow)"
				marker-start="url(#vaArrow)"
				:x1="model.beamL.x"
				:x2="model.beamR.x"
				:y1="model.beamL.y"
				:y2="model.beamR.y"
			/>
			<text class="valueText" :x="model.beamLabel.x" :y="model.beamLabel.y">
				B = {{ fmt( model.beam, 2 ) }} m
			</text>

			<line class="dim"
				marker-end="url(#vaArrow)"
				marker-start="url(#vaArrow)"
				:x1="model.draftTop.x"
				:x2="model.draftBottom.x"
				:y1="model.draftTop.y"
				:y2="model.draftBottom.y"
			/>
			<text class="valueText" :x="model.draftLabel.x" :y="model.draftLabel.y">
				T = {{ fmt( model.draft, 2 ) }} m
			</text>

			<line v-if="!props.nolegend"
				class="dim"
				marker-end="url(#vaArrow)"
				marker-start="url(#vaArrow)"
				:x1="model.depthTop.x"
				:x2="model.depthBottom.x"
				:y1="model.depthTop.y"
				:y2="model.depthBottom.y"
			/>
			<text class="valueText" :x="model.depthLabel.x" :y="model.depthLabel.y">
				D = {{ fmt( model.depth, 2 ) }} m
			</text>
		</g>

		<g class="axes">
			<line class="axisRef"
				:x1="model.axisRefA.x"
				:x2="model.axisRefB.x"
				:y1="model.axisRefA.y"
				:y2="model.axisRefB.y"
			/>
			<line class="axisNow"
				:x1="model.axisNowA.x"
				:x2="model.axisNowB.x"
				:y1="model.axisNowA.y"
				:y2="model.axisNowB.y"
			/>
			<text class="valueText" :x="model.phiLabel.x" :y="model.phiLabel.y">
				phi = {{ fmt( -model.heelDeg, 1 ) }} deg
			</text>
		</g>

		<g class="forces">
			<line class="wind"
				marker-end="url(#vaArrow)"
				:x1="model.ce.x"
				:x2="model.windTo.x"
				:y1="model.ce.y"
				:y2="model.windTo.y"
			/>
			<text :x="model.windText.x" :y="model.windText.y">F_w</text>

			<line class="weight"
				marker-end="url(#vaArrow)"
				:x1="model.g.x"
				:x2="model.weightTo.x"
				:y1="model.g.y"
				:y2="model.weightTo.y"
			/>
			<text :x="model.weightText.x" :y="model.weightText.y">W</text>

			<line class="buoy"
				marker-end="url(#vaArrow)"
				:x1="model.b.x"
				:x2="model.buoyTo.x"
				:y1="model.b.y"
				:y2="model.buoyTo.y"
			/>
			<text :x="model.buoyText.x" :y="model.buoyText.y">A</text>
		</g>

		<g class="lever">
			<line class="gz"
				marker-end="url(#vaArrow)"
				marker-start="url(#vaArrow)"
				:x1="model.gzA.x"
				:x2="model.gzB.x"
				:y1="model.gzA.y"
				:y2="model.gzB.y"
			/>
			<text class="valueText" :x="model.gzText.x" :y="model.gzText.y">
				GZ = {{ fmt( model.gz, 2 ) }} m
			</text>
		</g>

		<g class="points">
			<circle :cx="model.g.x" :cy="model.g.y" r="5" />
			<text :x="model.g.x + 8" :y="model.g.y - 8">G</text>

			<circle :cx="model.b.x" :cy="model.b.y" r="5" />
			<text :x="model.b.x + 8" :y="model.b.y + 8">B'</text>

			<circle :cx="model.m.x" :cy="model.m.y" r="5" />
			<text :x="model.m.x + 8" :y="model.m.y - 8">M</text>
		</g>
	</svg>

	<svg
		v-if="!props.nolegend"
		:aria-label="`Legende zum Schiffquerschnitt, Heel=${fmt( model.heelDeg, 1 )} deg`"
		class="vaShipLegend"
		role="img"
		:viewBox="`0 0 ${model.legendWidth} ${model.legendHeight}`"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect class="bg"
			:height="model.legendHeight"
			:width="model.legendWidth"
			x="0"
			y="0"
		/>
		<g class="legend">
			<text
				v-for="( line, index ) in model.legendLines"
				:key="`${index}-${line}`"
				x="22"
				:y="42 + index * 24"
			>
				{{ line }}
			</text>
		</g>
	</svg>
</div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps( {
	beam:            { type: Number, default: 11.7 },
	depth:           { type: Number, default: 11.0 },
	draft:           { type: Number, default: 4.8 },
	kg:              { type: Number, default: 6.8 },
	kb:              { type: Number, default: 2.5 },
	bm:              { type: Number, default: 0.8 },
	gm:              { type: Number, default: 0.5 },
	heelDeg:         { type: Number, default: 16 },
	windMoment:      { type: Number, default: 0 },
	restoringMoment: { type: Number, default: 0 },
	//displacementTons: { type: Number, default: 1200 },
	sailArea:        { type: Number, default: 900 },
	windSpeed:       { type: Number, default: 12 },
	hCe:             { type: Number, default: 20 },
	downfloodAngle:  { type: Number, default: 14 },
	status:          { type: String, default: "" },
	nolegend:        { type: Boolean, default: false },
	zoom:            { type: [ Number, String ], default: 1 }
} );

function clamp(
	v, lo, hi
) {
	return Math.min( hi, Math.max( lo, v ) );
}

function toFinite( v, fallback ) {
	const n = Number( v );
	return Number.isFinite( n ) ? n : fallback;
}

function degToRad( deg ) {
	return deg * Math.PI / 180;
}

function rotatePoint(
	point, pivot, angle
) {
	const dx = point.x - pivot.x;
	const dy = point.y - pivot.y;
	const c = Math.cos( angle );
	const s = Math.sin( angle );

	return {
		x: pivot.x + c * dx - s * dy,
		y: pivot.y + s * dx + c * dy
	};
}

function pointsToString( points ) {
	return points.map( ( p ) => `${p.x.toFixed( 2 )},${p.y.toFixed( 2 )}` )
		.join( " " );
}

function fmt( v, digits = 2 ) {
	if ( !Number.isFinite( v ) ) {
		return "-";
	}

	return Number( v ).toFixed( digits );
}

const model = computed( () => {
	const width = 620;
	const height = 920;

	const beam = Math.max( 1, toFinite( props.beam, 11.7 ) );
	const depth = Math.max( 1, toFinite( props.depth, 11 ) );
	const draft = clamp(
		toFinite( props.draft, 4.8 ),
		0.2,
		depth - 0.1
	);
	const kg = Math.max( 0.1, toFinite( props.kg, 6.8 ) );
	const kb = Math.max( 0.05, toFinite( props.kb, 2.5 ) );
	const bm = Math.max( 0.01, toFinite( props.bm, 0.8 ) );
	const gm = toFinite( props.gm, 0.5 );
	const heelDeg = -clamp(
		toFinite( props.heelDeg, 0 ),
		-70,
		70
	);
	const windMoment = Math.max( 0, toFinite( props.windMoment, 0 ) );
	const windSpeed = Math.max( 0, toFinite( props.windSpeed, 0 ) );
	const restoringMoment = toFinite( props.restoringMoment, 0 );
	const hCe = Math.max( depth + 0.5, toFinite( props.hCe, depth + 1.5 ) );
	const zoom = clamp(
		toFinite( props.zoom, 1 ),
		1,
		8
	);

	const halfB = beam / 2;
	const heelRad = degToRad( heelDeg );
	const sailTopY = depth + ( hCe - depth ) * 2.35;
	const extX = halfB * 2.2 + 1.2;
	const extY = Math.max(
		hCe + 2,
		sailTopY + 2,
		depth + 2,
		draft + 2
	);
	const scaleX = width * 0.96 / ( 2 * extX );
	const scaleY = height * 0.90 / ( extY + draft + 1.2 );
	const scale = Math.max( 9, Math.min( scaleX, scaleY ) );

	const pivot = {
		x: 0,
		y: kb
	};

	const hullBase = [
		{
			x: -halfB * 0.95,
			y: depth * 0.98
		},
		{
			x: -halfB * 0.82,
			y: depth * 0.72
		},
		{
			x: -halfB * 0.62,
			y: depth * 0.38
		},
		{
			x: -halfB * 0.30,
			y: depth * 0.12
		},
		{
			x: 0,
			y: 0
		},
		{
			x: halfB * 0.30,
			y: depth * 0.12
		},
		{
			x: halfB * 0.62,
			y: depth * 0.38
		},
		{
			x: halfB * 0.82,
			y: depth * 0.72
		},
		{
			x: halfB * 0.95,
			y: depth * 0.98
		}
	];

	const hullWorld = hullBase.map( ( p ) => rotatePoint(
		p,
		pivot,
		heelRad
	) );
	const hullWorldXs = hullWorld.map( ( p ) => p.x );
	const hullWorldWidth = Math.max( ...hullWorldXs ) - Math.min( ...hullWorldXs );
	const freeViewportWidth = Math.max( 0,
		width - hullWorldWidth * scale );
	const shipLeftShift = freeViewportWidth * 0.2;
	const cx = width * 0.5 - shipLeftShift;
	const waterY = height * 0.76;

	const toScreen = ( p ) => ( {
		x: cx + p.x * scale,
		y: waterY - ( p.y - draft ) * scale
	} );

	const hullScreen = hullWorld.map( toScreen );
	const hullXs = hullScreen.map( ( p ) => p.x );
	const hullYs = hullScreen.map( ( p ) => p.y );
	const hullCenterX = ( Math.min( ...hullXs ) + Math.max( ...hullXs ) ) / 2;
	const hullCenterY = ( Math.min( ...hullYs ) + Math.max( ...hullYs ) ) / 2;

	const deckL = toScreen( rotatePoint(
		{
			x: -halfB * 0.95,
			y: depth
		},
		pivot,
		heelRad
	) );
	const deckR = toScreen( rotatePoint(
		{
			x: halfB * 0.95,
			y: depth
		},
		pivot,
		heelRad
	) );

	const mastBase = toScreen( rotatePoint(
		{
			x: 0,
			y: depth
		},
		pivot,
		heelRad
	) );
	const mastTop = toScreen( rotatePoint(
		{
			x: 0,
			y: hCe * 1.5 + 1.6
		},
		pivot,
		heelRad
	) );

	const sailA = toScreen( rotatePoint(
		{
			x: halfB * 0.10,
			y: depth * 1.02
		},
		pivot,
		heelRad
	) );
	const sailB = toScreen( rotatePoint(
		{
			x: halfB * 1.80,
			y: depth + ( hCe - depth ) * 0.45
		},
		pivot,
		heelRad
	) );
	const sailC = toScreen( rotatePoint(
		{
			x: halfB * 0.12,
			y: sailTopY
		},
		pivot,
		heelRad
	) );

	const gWorld = rotatePoint(
		{
			x: 0,
			y: kg
		},
		pivot,
		heelRad
	);
	const bWorld = {
		x: bm * Math.sin( heelRad ),
		y: kb
	};
	const mWorld = {
		x: 0,
		y: kb + bm
	};
	const ceWorld = rotatePoint(
		{
			x: 0,
			y: hCe
		},
		pivot,
		heelRad
	);

	const g = toScreen( gWorld );
	const b = toScreen( bWorld );
	const m = toScreen( mWorld );
	const ce = toScreen( ceWorld );

	const windLen = 48 + Math.min( 130, Math.sqrt( windMoment ) / 150 );
	const weightLen = 92;
	const buoyLen = 92;

	const windTo = {
		x: ce.x + windLen,
		y: ce.y
	};
	const weightTo = {
		x: g.x,
		y: g.y + weightLen
	};
	const buoyTo = {
		x: b.x,
		y: b.y - buoyLen
	};

	const gzY = ( g.y + b.y ) / 2;
	const gzA = {
		x: g.x,
		y: gzY
	};
	const gzB = {
		x: b.x,
		y: gzY
	};

	const beamL = toScreen( rotatePoint(
		{
			x: -halfB * 0.95,
			y: depth + 0.65
		},
		pivot,
		heelRad
	) );
	const beamR = toScreen( rotatePoint(
		{
			x: halfB * 0.95,
			y: depth + 0.65
		},
		pivot,
		heelRad
	) );

	const draftWorldX = -halfB - 1.3;
	const depthWorldX = -halfB - 2.7;
	const draftTop = toScreen( {
		x: draftWorldX,
		y: draft
	} );
	const draftBottom = toScreen( {
		x: draftWorldX,
		y: 0
	} );
	const depthTop = toScreen( {
		x: depthWorldX,
		y: depth
	} );
	const depthBottom = toScreen( {
		x: depthWorldX,
		y: 0
	} );

	const axisRefA = toScreen( {
		x: 0,
		y: kb
	} );
	const axisRefB = toScreen( {
		x: 0,
		y: depth + 2.1
	} );
	const axisNowA = toScreen( rotatePoint(
		{
			x: 0,
			y: kb
		},
		pivot,
		heelRad
	) );
	const axisNowB = toScreen( rotatePoint(
		{
			x: 0,
			y: depth + 2.1
		},
		pivot,
		heelRad
	) );

	const statusText = props.status || "-";
	const legendLines = [
		`KG = ${fmt( kg, 2 )} m`,
		`KB = ${fmt( kb, 2 )} m`,
		`BM = ${fmt( bm, 2 )} m`,
		`GM = ${fmt( gm, 2 )} m`,
		`M_w = ${fmt( windMoment / 1000, 1 )} kN m`,
		`M_r = ${fmt( restoringMoment / 1000, 1 )} kN m`,
		`v = ${fmt( windSpeed, 1 )} m/s, A = ${
			fmt( Math.max( 0, toFinite( props.sailArea, 0 ) ), 0 )} m^2`,
		`Downflooding bei phi ~= ${fmt( toFinite( props.downfloodAngle, NaN ), 1 )} deg`,
		`Status: ${statusText}`
	];
	const legendWidth = width;
	const legendHeight = 56 + legendLines.length * 24;
	const shipViewW = width / zoom;
	const shipViewH = height / zoom;
	const shipViewX = clamp(
		hullCenterX - shipViewW / 2,
		0,
		width - shipViewW
	);
	const shipViewY = clamp(
		hullCenterY - shipViewH / 2,
		0,
		height - shipViewH
	);
	const windLogoScale = clamp(
		0.28 + windSpeed / 40,
		0.28,
		1.15
	);
	const windLogoX = shipViewX + shipViewW * 0.04;
	const windLogoY = shipViewY + shipViewH * 0.25;

	return {
		width,
		height,
		shipViewBox:       `${shipViewX} ${shipViewY} ${shipViewW} ${shipViewH}`,
		windLogoTransform: `translate(${windLogoX} ${windLogoY}) scale(${windLogoScale})`,
		waterY,
		beam,
		depth,
		draft,
		kg,
		kb,
		bm,
		gm,
		heelDeg,
		windMoment,
		restoringMoment,
		hullPoints:        pointsToString( hullScreen ),
		sailPoints:        pointsToString( [ sailA, sailB, sailC ] ),
		deckL,
		deckR,
		mastBase,
		mastTop,
		g,
		b,
		m,
		ce,
		windTo,
		weightTo,
		buoyTo,
		windText:          {
			x: ce.x + windLen + 8,
			y: ce.y - 2
		},
		weightText: {
			x: g.x + 8,
			y: g.y + weightLen - 4
		},
		buoyText: {
			x: b.x + 8,
			y: b.y - buoyLen + 14
		},
		gzA,
		gzB,
		gz:     Math.abs( bWorld.x - gWorld.x ),
		gzText: {
			x: ( g.x + b.x ) / 2 + 4,
			y: gzY - 8
		},
		beamL,
		beamR,
		beamLabel: {
			x: ( beamL.x + beamR.x ) / 2 - 34,
			y: ( beamL.y + beamR.y ) / 2 - 8
		},
		draftTop,
		draftBottom,
		draftLabel: {
			x: draftTop.x + 8,
			y: ( draftTop.y + draftBottom.y ) / 2 - 4
		},
		depthTop,
		depthBottom,
		depthLabel: {
			x: depthTop.x + 8,
			y: ( depthTop.y + depthBottom.y ) / 2 - 4
		},
		axisRefA,
		axisRefB,
		axisNowA,
		axisNowB,
		phiLabel: {
			x: axisNowB.x + 8,
			y: axisNowB.y - 2
		},
		legendWidth,
		legendHeight,
		legendLines
	};
} );
</script>

<style scoped>
.vaShipWrap {
  display: grid;
  gap: 12px;
}

.noLegendMode .valueText {
  display: none;
}

.vaShipFigure,
.vaShipLegend {
  width: 100%;
  height: auto;
  border: 1px solid var(--line);
  border-radius: 14px;
}

.bg {
  fill: var(--kbox-bg);
}

.water {
  fill: rgba(14, 165, 233, 0.18);
}

.waterline {
  stroke: rgba(14, 165, 233, 0.9);
  stroke-width: 2;
  stroke-dasharray: 7 5;
}

.windLogo path {
  fill: #7dd3fc;
}

.hull {
  fill: rgba(120, 113, 108, 0.32);
  stroke: var(--text);
  stroke-width: 2.3;
}

.deck {
  stroke: var(--text);
  stroke-width: 2;
}

.mast {
  stroke: rgba(120, 53, 15, 0.95);
  stroke-width: 3;
}

.sail {
  fill: rgba(250, 245, 230, 0.75);
  stroke: rgba(120, 53, 15, 0.8);
  stroke-width: 1.4;
}

.dims {
  color: var(--text);
  fill: var(--text);
  font-size: 13px;
}

.dim {
  stroke: currentColor;
  stroke-width: 1.5;
}

.axes {
  fill: var(--muted);
  color: var(--muted);
  font-size: 13px;
}

.axisRef {
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-dasharray: 4 4;
}

.axisNow {
  stroke: rgba(234, 88, 12, 0.95);
  stroke-width: 1.8;
}

.forces {
  font-size: 14px;
  font-weight: 700;
}

.forces .wind {
  color: rgba(59, 130, 246, 0.95);
  stroke: currentColor;
  stroke-width: 2.2;
}

.forces .weight {
  color: rgba(220, 38, 38, 0.95);
  stroke: currentColor;
  stroke-width: 2.2;
}

.forces .buoy {
  color: rgba(16, 185, 129, 0.95);
  stroke: currentColor;
  stroke-width: 2.2;
}

.forces text {
  fill: var(--text);
}

.lever .gz {
  stroke: rgba(168, 85, 247, 0.95);
  stroke-width: 2;
}

.lever text {
  fill: var(--text);
  font-size: 13px;
}

.points circle {
  fill: var(--text);
}

.points text {
  fill: var(--text);
  font-size: 13px;
  font-weight: 700;
}

.legend {
  fill: var(--text);
  font-size: 14px;
}
</style>
