<template>
<AppFrame
	:sub-chapter="{
		gleichgewicht: 'Gleichgewicht',
		metazentrum: 'Metazentrum',
		windmoment: 'Windmoment',
		downflooding: 'Downflooding',
		interaktiv: 'Interaktiv'
	}"
	title="Eddie rechnet: Warum die Vasa sinken musste"
>
	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="`Eddie`">
				<img alt="Eddie und die Vasa" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>

		<h2 id="gleichgewicht">Teil 1 — Gleichgewicht: Der erste Satz, der alles entscheidet</h2>
		<div class="eddie">
			<p>
				Die <b>Vasa</b> war ein schwimmender Palast und sank trotzdem nach etwa
				<Katex tex="1300\,\mathrm{m}" />. Das wirkt wie Pech, ist aber vor allem
				Geometrie plus Physik.
			</p>
			<p>
				Ein Schiff schwimmt, wenn Gewicht und Auftrieb gleich groß sind:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="W = m g,\qquad A = \rho_{\mathrm{W}} g V,\qquad W=A\Rightarrow m=\rho_{\mathrm{W}}V." />
			</div>
			<p>
				Für die Vasa sind folgende Größenordnung bekannt:
			</p>
			<v-table class="mt-3" density="compact">
				<thead>
					<tr>
						<th>Symbol</th>
						<th>Bedeutung</th>
						<th class="text-right">Wert</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><Katex tex="\Delta" /></td>
						<td>Verdrängung</td>
						<td class="text-right"><Katex tex="\approx 1210\,\mathrm{t}" /></td>
					</tr>
					<tr>
						<td><Katex tex="L" /></td>
						<td>Länge</td>
						<td class="text-right"><Katex tex="\approx 69\,\mathrm{m}" /></td>
					</tr>
					<tr>
						<td><Katex tex="B" /></td>
						<td>Breite</td>
						<td class="text-right"><Katex tex="\approx 11{,}7\,\mathrm{m}" /></td>
					</tr>
					<tr>
						<td><Katex tex="H" /></td>
						<td>Höhe</td>
						<td class="text-right"><Katex tex="\approx 52{,}5\,\mathrm{m}" /></td>
					</tr>
					<tr>
						<td><Katex tex="V" /></td>
						<td>verdrängte Volume</td>
						<td class="text-right"><Katex tex="\approx 1210\,\mathrm{m^3}" /></td>
					</tr>
				</tbody>
			</v-table>
		</div>

		<h2 id="metazentrum" class="mt-8">Teil 2 — Schwerpunkt, Auftriebspunkt, Metazentrum</h2>
		<figure class="exampleFigure">
			<ImageZoomer>
				<VA_Ship nolegend zoom="2"/>
			</ImageZoomer>
		</figure>
		<div class="eddie">
			<p>
				Entscheidend sind die Punkte
				<Katex tex="G" /> (Schwerpunkt),
				<Katex tex="B" /> (Auftriebsschwerpunkt)
				und
				<Katex tex="M" /> (Metazentrum).
			</p>
			<ul>
				<li>
					<Katex tex="G" /> ist der <b>Schwerpunkt des gesamten Schiffs</b>
					(Rumpf, Kanonen, Masten, Ballast, Ladung). In diesem Punkt kann man sich die
					Gewichtskraft <Katex tex="W=\Delta g" /> angreifend denken. Liegt viel Masse hoch,
					steigt <Katex tex="KG" /> und das Schiff wird kippempfindlicher.
				</li>
				<li>
					<Katex tex="B" /> ist der <b>Schwerpunkt des verdrängten Wasservolumens</b>.
					Dort greift die Auftriebskraft <Katex tex="A" /> an. Anders als <Katex tex="G" />
					ist <Katex tex="B" /> nicht fest am Schiff: Bei Krängung ändert sich die Form des
					untergetauchten Volumens, dadurch wandert <Katex tex="B" /> zur tieferen Seite.
				</li>
				<li>
					<Katex tex="M" /> ist das <b>Metazentrum</b>, also der Schnittpunkt der Auftriebslinien
					für sehr kleine Krängungswinkel. Es ist ein geometrischer Referenzpunkt für die
					Anfangsstabilität: Liegt <Katex tex="M" /> über <Katex tex="G" />, entsteht ein
					aufrichtendes Moment; liegt <Katex tex="M" /> darunter, kippt das System weiter.
				</li>
			</ul>
			<p>
				Die zentrale Kenngröße ist der Abstand <Katex tex="GM" />, die metazentrische Höhe.
				Für kleine Krängung gilt:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="GM = KM - KG,\qquad BM=\frac{I_{\mathrm{W}}}{V}." />
			</div>
			<p>
				Wenn <Katex tex="GM>0" />, richtet sich das Schiff anfangs selbst auf.
				Kleines <Katex tex="GM" /> bedeutet aber: wenig Stabilitätsreserve.
				Großes <Katex tex="KG" /> (viel Masse oben) verschlechtert das direkt.
			</p>
			<p>
				Breite an der Wasserlinie hilft stark, weil
				<Katex tex="I_{\mathrm{W}}" />
				mit der Breite stark wächst.
			</p>
		</div>

		<h2 id="windmoment" class="mt-8">Teil 3 — Windmoment gegen Rückstellmoment</h2>
		<div class="eddie">
			<p>
				Bei Krängungswinkel <Katex tex="\varphi" /> wirkt der Rückstellhebelarm
				näherungsweise wie:
			</p>
			<p>
				Der <b>Krängungswinkel</b> <Katex tex="\varphi" /> ist der seitliche Neigungswinkel des Schiffs
				um seine Längsachse. Er misst also, wie weit das Schiff aus der aufrechten Ruhelage gekippt ist:
				<Katex tex="\varphi=0^\circ" /> bedeutet „gerade“, größere Werte bedeuten stärkere Schräglage
				zur Backbord- oder Steuerbordseite.
			</p>
			<p>
				Für die Stabilitätsrechnung ist wichtig: Im kleinen Winkelbereich (typisch einige Grad bis grob
				<Katex tex="10^\circ\text{ bis }15^\circ" />) kann man mit den Kleinwinkel-Formeln gut arbeiten.
				Bei größeren Winkeln wird die Geometrie des untergetauchten Rumpfs stark nichtlinear, dann
				reicht die einfache Näherung nicht mehr.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="GZ(\varphi)\approx GM\sin\varphi,\qquad M_{\mathrm{R}}(\varphi)\approx \Delta g\,GM\sin\varphi." />
			</div>
			<p>
				Das Windmoment kann man grob mit
			</p>
			<div class="kbox">
				<Katex as="div"
					display
					tex="F_{\mathrm{W}}\approx \frac12\rho_{\mathrm{L}} C_D A v^2,\qquad M_{\mathrm{W}}\approx F_{\mathrm{W}}\,h_{\mathrm{CE}}"
				/>
			</div>
			<p>
				abschätzen. Kritisch wird es, wenn
				<Katex tex="M_{\mathrm{W}}\gtrsim M_{\mathrm{R}}" />.
			</p>
			<p>
				Die Proportionen der Vasa zeigen das Problem:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\frac{H}{B}\approx\frac{52{,}5}{11{,}7}\approx 4{,}49." />
			</div>
			<p>
				Hoher Aufbau treibt <Katex tex="KG" /> nach oben, große Segelfläche erhöht das Windmoment.
			</p>
		</div>

		<h2 id="downflooding" class="mt-8">Teil 4 — Downflooding und freie Wasseroberfläche</h2>
		<div class="eddie">
			<p>
				Sobald bei Krängung untere Öffnungen unter Wasser geraten, läuft Wasser ein.
				Dann sinkt die effektive Stabilität zusätzlich durch den freien Oberflächeneffekt:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="GM_{\mathrm{eff}}\approx GM-\frac{\rho_{\mathrm{W}}I_{\mathrm{FS}}}{\Delta}." />
			</div>
			<p>
				Mehr Wasser auf einem breiten Deck bedeutet:
				größeres <Katex tex="I_{\mathrm{FS}}" />, kleineres <Katex tex="GM_{\mathrm{eff}}" />,
				noch mehr Krängung.
			</p>
			<p>
				Die bekannte Belastungsprobe mit laufenden Matrosen deutete genau darauf hin:
				zu kleine Anfangsstabilität.
			</p>
			<p>
				Auch die Rollperiode zeigt die Empfindlichkeit:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="T\approx 2\pi\sqrt{\frac{I_{\varphi}}{\Delta g\,GM}}\approx 2\pi\sqrt{\frac{k^2}{g\,GM}}." />
			</div>
		</div>

		<h2 id="schluss" class="mt-8">Teil 5 — Was die Mathe vorgeschlagen hätte</h2>
		<div class="eddie">
			<p>
				Mathematisch sind die Stellschrauben klar:
			</p>
			<ol>
				<li><Katex tex="KG" /> nach unten: Gewicht tiefer, oben leichter.</li>
				<li><Katex tex="I_{\mathrm{W}}" /> nach oben: mehr Breite an der Wasserlinie.</li>
				<li>Downflooding verhindern: tiefe Stückpforten erst spät öffnen.</li>
			</ol>
			<p>
				Nebenbei zählt auch Unsymmetrie beim Bau (z. B. unterschiedliche Maßsysteme links/rechts),
				weil eine Anfangsschlagseite die Reserve weiter verringert.
			</p>
			<p class="muted">
				Kurzform: Die Vasa ist weniger an einer einzelnen Böe gescheitert,
				sondern an einer zu kleinen Stabilitätsmarge im Gesamtdesign.
			</p>
		</div>
	</template>

	<template #interactivePart>
		<h2 id="interaktiv">Interaktiv: Schiffquerschnitt und Stabilitätsrechner</h2>
		<div class="eddie d-flex flex-column ga-3">
			<v-card class="panel pa-4">
				<v-select
					v-model="presetId"
					hide-details="auto"
					item-title="title"
					item-value="value"
					:items="geometryPresets"
					label="Schiffsgeometrie"
				/>

				<div class="sectionTitle">Geometrie</div>
				<v-row dense>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.beam" hide-details="auto" label="Breite B [m]" />
					</v-col>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.depth" hide-details="auto" label="Tiefe D [m]" />
					</v-col>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.draft" hide-details="auto" label="Tiefgang T [m]" />
					</v-col>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.length" hide-details="auto" label="Wasserlinienlänge L [m]" />
					</v-col>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.cwp" hide-details="auto" label="Wasserlinienfaktor Cwp" />
					</v-col>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.openingHeight" hide-details="auto" label="Höhe untere Öffnung über WL [m]" />
					</v-col>
				</v-row>

				<div class="sectionTitle">Masse und Stabilität</div>
				<v-row dense>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.displacement" hide-details="auto" label="Verdrängung Δ [t]" />
					</v-col>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.kg" hide-details="auto" label="KG [m]" />
					</v-col>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.kb" hide-details="auto" label="KB [m]" />
					</v-col>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.freeSurface" hide-details="auto" label="ΔGM freier Spiegel [m]" />
					</v-col>
				</v-row>

				<div class="sectionTitle">Wind</div>
				<v-row dense>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.sailArea" hide-details="auto" label="Segelfläche A [m²]" />
					</v-col>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.windSpeed" hide-details="auto" label="Windgeschwindigkeit v [m/s]" />
					</v-col>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.cd" hide-details="auto" label="Widerstandsbeiwert Cd" />
					</v-col>
					<v-col cols="12" md="6" sm="6">
						<v-text-field v-model="inputs.hCe" hide-details="auto" label="Angriffshöhe hCE [m]" />
					</v-col>
				</v-row>

				<div class="d-flex flex-wrap ga-2 mt-2">
					<v-btn color="primary" variant="flat" @click="loadPreset">Preset laden</v-btn>
					<v-btn variant="tonal" @click="randomizeWind">Zufallsböe</v-btn>
				</div>
			</v-card>

			<v-alert :type="calc.statusKind" variant="tonal">
				{{ calc.statusText }}
				<p v-if="calc.issues.length" class="muted mt-2">
					{{ calc.issues.join( " · " ) }}
				</p>
			</v-alert>
		</div>
		<h2 class="mt-2">Rechenweg</h2>
		<div class="eddie d-flex flex-column ga-3">
			<v-sheet border class="pa-3 rounded">
				<div class="kbox">
					<div class="mono">V = Δ/ρw = {{ fmt( calc.volume, 1 ) }} m³</div>
					<div class="mono">Iw = Cwp·L·B³/12 = {{ fmt( calc.iw, 1 ) }} m⁴</div>
					<div class="mono">BM = Iw/V = {{ fmt( calc.bm, 3 ) }} m</div>
					<div class="mono">KM = KB + BM = {{ fmt( calc.km, 3 ) }} m</div>
					<div class="mono">GM = KM - KG = {{ fmt( calc.gmRaw, 3 ) }} m</div>
					<div class="mono">GM_eff = GM - ΔGM_fs = {{ fmt( calc.gmEff, 3 ) }} m</div>
				</div>
			</v-sheet>

			<v-sheet border class="pa-3 rounded">
				<div class="kbox">
					<div class="mono">F_w = 0.5·ρL·Cd·A·v² = {{ fmt( calc.windForce / 1000, 2 ) }} kN</div>
					<div class="mono">M_w = F_w·hCE = {{ fmt( calc.windMoment / 1000, 1 ) }} kN m</div>
					<div class="mono">M_r = Δ·g·GM_eff·sin(phi) = {{ fmt( calc.restoringMoment / 1000, 1 ) }} kN m</div>
					<div class="mono">phi_eq = {{ fmt( calc.heelDeg, 2 ) }} deg</div>
					<div class="mono">Downflooding-Winkel = {{ fmt( calc.downfloodAngle, 2 ) }} deg</div>
				</div>
			</v-sheet>

			<v-sheet border class="pa-3 rounded">
				<v-table density="compact">
					<thead>
						<tr>
							<th>Größe</th>
							<th class="text-right">Wert</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Stabilitätsverhältnis r = M_w/(Δ·g·GM_eff)</td>
							<td class="mono text-right">{{ fmt( calc.ratio, 3 ) }}</td>
						</tr>
						<tr>
							<td>GZ(phi) ≈ GM_eff·sin(phi)</td>
							<td class="mono text-right">{{ fmt( calc.gz, 3 ) }} m</td>
						</tr>
						<tr>
							<td>Reserve bis Downflooding</td>
							<td class="mono text-right">{{ fmt( calc.downfloodMargin, 2 ) }} deg</td>
						</tr>
						<tr>
							<td>Bewertung</td>
							<td class="mono text-right">{{ calc.shipStatus }}</td>
						</tr>
					</tbody>
				</v-table>
			</v-sheet>
		</div>
	</template>

	<template #calculationPart>
		<ImageZoomer>
			<VA_Ship
				:beam="calc.beam"
				:bm="calc.bm"
				:depth="calc.depth"
				:displacement-tons="calc.displacementTons"
				:downflood-angle="calc.downfloodAngle"
				:draft="calc.draft"
				:gm="calc.gmEff"
				:h-ce="calc.hCe"
				:heel-deg="calc.heelDeg"
				:kb="calc.kb"
				:kg="calc.kg"
				:restoring-moment="calc.restoringMoment"
				:sail-area="calc.sailArea"
				:status="calc.shipStatus"
				:wind-moment="calc.windMoment"
				:wind-speed="calc.windSpeed"
			/>
		</ImageZoomer>
	</template>
</AppFrame>
</template>

<script setup>
import {
	computed, reactive, ref, watch
} from "vue";
import titleImg from "@/images/VA.webp";
import VA_Ship from "@/views/VA_Ship.vue";
import ImageZoomer from "@/components/ImageZoomer.vue";

const RHO_WATER = 1025;
const G = 9.81;

const geometryPresets = [
	{
		value:         "vasa",
		title:         "Vasa (historisch, grob)",
		beam:          11.7,
		depth:         11.0,
		draft:         4.8,
		length:        46.0,
		cwp:           0.70,
		openingHeight: 1.05,
		displacement:  1210,
		kg:            6.9,
		kb:            2.55,
		freeSurface:   0.08,
		sailArea:      1200,
		windSpeed:     12,
		cd:            1.20,
		hCe:           20.0
	},
	{
		value:         "ballast",
		title:         "Mehr Ballast, gleicher Rumpf",
		beam:          11.7,
		depth:         11.0,
		draft:         5.1,
		length:        46.0,
		cwp:           0.73,
		openingHeight: 1.45,
		displacement:  1320,
		kg:            5.9,
		kb:            2.70,
		freeSurface:   0.05,
		sailArea:      1120,
		windSpeed:     12,
		cd:            1.12,
		hCe:           18.5
	},
	{
		value:         "beamy",
		title:         "Breiter Rumpf (stabiler)",
		beam:          13.5,
		depth:         11.2,
		draft:         5.0,
		length:        46.0,
		cwp:           0.74,
		openingHeight: 1.50,
		displacement:  1380,
		kg:            6.2,
		kb:            2.65,
		freeSurface:   0.04,
		sailArea:      1150,
		windSpeed:     12,
		cd:            1.10,
		hCe:           18.8
	},
	{
		value:         "top-heavy",
		title:         "Schmal und top-heavy (kritisch)",
		beam:          10.5,
		depth:         10.8,
		draft:         4.6,
		length:        44.0,
		cwp:           0.67,
		openingHeight: 0.85,
		displacement:  1090,
		kg:            7.4,
		kb:            2.35,
		freeSurface:   0.12,
		sailArea:      1260,
		windSpeed:     12,
		cd:            1.25,
		hCe:           21.0
	},
	{
		value:         "modern-slim-stable",
		title:         "Modern schmal (Tiefkiel, stabil)",
		beam:          9.4,
		depth:         10.6,
		draft:         5.7,
		length:        48.0,
		cwp:           0.82,
		openingHeight: 1.9,
		displacement:  1800,
		kg:            3.6,
		kb:            3.2,
		freeSurface:   0.03,
		sailArea:      950,
		windSpeed:     12,
		cd:            1.02,
		hCe:           16.5
	}
];

const presetId = ref( geometryPresets[ 0 ].value );

const inputs = reactive( {
	beam:          "",
	depth:         "",
	draft:         "",
	length:        "",
	cwp:           "",
	openingHeight: "",
	displacement:  "",
	kg:            "",
	kb:            "",
	freeSurface:   "",
	sailArea:      "",
	windSpeed:     "",
	cd:            "",
	hCe:           ""
} );

function clamp(
	v, lo, hi
) {
	return Math.min( hi, Math.max( lo, v ) );
}

function degToRad( deg ) {
	return deg * Math.PI / 180;
}

function radToDeg( rad ) {
	return rad * 180 / Math.PI;
}

function fmt( v, digits = 2 ) {
	if ( !Number.isFinite( v ) ) {
		return "-";
	}

	return Number( v ).toFixed( digits );
}

function getPreset() {
	return geometryPresets.find( ( p ) => p.value === presetId.value ) ?? geometryPresets[ 0 ];
}

function setInputsFromPreset( p ) {
	inputs.beam = fmt( p.beam, 2 );
	inputs.depth = fmt( p.depth, 2 );
	inputs.draft = fmt( p.draft, 2 );
	inputs.length = fmt( p.length, 2 );
	inputs.cwp = fmt( p.cwp, 3 );
	inputs.openingHeight = fmt( p.openingHeight, 2 );
	inputs.displacement = fmt( p.displacement, 1 );
	inputs.kg = fmt( p.kg, 2 );
	inputs.kb = fmt( p.kb, 2 );
	inputs.freeSurface = fmt( p.freeSurface, 2 );
	inputs.sailArea = fmt( p.sailArea, 0 );
	inputs.windSpeed = fmt( p.windSpeed, 1 );
	inputs.cd = fmt( p.cd, 2 );
	inputs.hCe = fmt( p.hCe, 2 );
}

function loadPreset() {
	setInputsFromPreset( getPreset() );
}

watch(
	presetId,
	() => loadPreset(),
	{ immediate: true }
);

function randomizeWind() {
	const v = 6 + Math.random() * 20;
	const areaFactor = 0.85 + Math.random() * 0.35;
	const baseArea = getPreset().sailArea;
	inputs.windSpeed = fmt( v, 1 );
	inputs.sailArea = fmt( baseArea * areaFactor, 0 );
}

function readNumber(
	raw,
	label,
	fallback,
	min = -Number.POSITIVE_INFINITY,
	max = Number.POSITIVE_INFINITY
) {
	const text = String( raw ?? "" ).trim()
		.replace( ",", "." );

	if ( !text ) {
		return {
			value: clamp(
				fallback, min, max
			),
			issue: ""
		};
	}

	const parsed = Number( text );

	if ( !Number.isFinite( parsed ) ) {
		return {
			value: clamp(
				fallback, min, max
			),
			issue: `${label}: ungültig, nutze ${fmt( fallback, 2 )}`
		};
	}

	const bounded = clamp(
		parsed, min, max
	);

	if ( bounded !== parsed ) {
		return {
			value: bounded,
			issue: `${label}: begrenzt auf ${fmt( bounded, 2 )}`
		};
	}

	return { value: bounded, issue: "" };
}

const calc = computed( () => {
	const p = getPreset();
	const issues = [];

	const beamRes = readNumber(
		inputs.beam,
		"B",
		p.beam,
		4,
		30
	);
	const depthRes = readNumber(
		inputs.depth,
		"D",
		p.depth,
		2,
		25
	);
	const draftRes = readNumber(
		inputs.draft,
		"T",
		p.draft,
		0.4,
		depthRes.value - 0.1
	);
	const lengthRes = readNumber(
		inputs.length,
		"L",
		p.length,
		10,
		120
	);
	const cwpRes = readNumber(
		inputs.cwp,
		"Cwp",
		p.cwp,
		0.45,
		0.98
	);
	const openingRes = readNumber(
		inputs.openingHeight,
		"h_open",
		p.openingHeight,
		0.05,
		8
	);
	const dispRes = readNumber(
		inputs.displacement,
		"Delta",
		p.displacement,
		100,
		10000
	);
	const kgRes = readNumber(
		inputs.kg,
		"KG",
		p.kg,
		0.2,
		20
	);
	const kbRes = readNumber(
		inputs.kb,
		"KB",
		p.kb,
		0.1,
		20
	);
	const freeSurfaceRes = readNumber(
		inputs.freeSurface,
		"DeltaGM_fs",
		p.freeSurface,
		0,
		5
	);
	const areaRes = readNumber(
		inputs.sailArea,
		"A",
		p.sailArea,
		0,
		8000
	);
	const windRes = readNumber(
		inputs.windSpeed,
		"v",
		p.windSpeed,
		0,
		60
	);
	const cdRes = readNumber(
		inputs.cd,
		"Cd",
		p.cd,
		0.2,
		3.0
	);
	const hCeRes = readNumber(
		inputs.hCe,
		"hCE",
		p.hCe,
		depthRes.value + 0.5,
		60
	);

	for ( const result of [
		beamRes,
		depthRes,
		draftRes,
		lengthRes,
		cwpRes,
		openingRes,
		dispRes,
		kgRes,
		kbRes,
		freeSurfaceRes,
		areaRes,
		windRes,
		cdRes,
		hCeRes
	] ) {
		if ( result.issue ) {
			issues.push( result.issue );
		}
	}

	const beam = beamRes.value;
	const depth = depthRes.value;
	const draft = draftRes.value;
	const length = lengthRes.value;
	const cwp = cwpRes.value;
	const openingHeight = openingRes.value;
	const displacementTons = dispRes.value;
	const kg = kgRes.value;
	const kb = kbRes.value;
	const freeSurface = freeSurfaceRes.value;
	const sailArea = areaRes.value;
	const windSpeed = windRes.value;
	const cd = cdRes.value;
	const hCe = hCeRes.value;

	const displacementKg = displacementTons * 1000;
	const volume = displacementKg / RHO_WATER;
	const iw = cwp * length * beam * beam * beam / 12;
	const bm = iw / volume;
	const km = kb + bm;
	const gmRaw = km - kg;
	const gmEff = gmRaw - freeSurface;

	const rhoAir = 1.225;
	const windForce = 0.5 * rhoAir * cd * sailArea * windSpeed * windSpeed;
	const windMoment = windForce * hCe;
	const downfloodAngle = radToDeg( Math.atan2( openingHeight,
		beam / 2 ) );

	const stableDenominator = displacementKg * G * Math.max( gmEff, 1e-9 );
	const ratio = gmEff > 0 ? windMoment / stableDenominator : Number.POSITIVE_INFINITY;
	const windDrive = windMoment / ( displacementKg * G * Math.max( beam * 0.5, 0.25 ) );

	let heelDeg = 0;

	if ( gmEff <= 0 ) {
		// Even in unstable mode, stronger wind should increase heel.
		const instability = Math.max( 0, -gmEff );
		const baseHeel = downfloodAngle * 0.55 + 3 + instability * 2.5;
		const windHeel = radToDeg( Math.atan( windDrive * 5 ) );
		heelDeg = clamp(
			baseHeel + windHeel,
			0,
			70
		);
	} else if ( ratio <= 1 ) {
		heelDeg = radToDeg( Math.asin( Math.max( 0, ratio ) ) );
	} else {
		heelDeg = Math.min( 70, 35 + ( ratio - 1 ) * 14 );
	}

	const restoringMoment = gmEff > 0 ?
		displacementKg * G * gmEff * Math.sin( degToRad( heelDeg ) ) :
		0;
	const gz = gmEff > 0 ? gmEff * Math.sin( degToRad( heelDeg ) ) : 0;
	const downfloodMargin = downfloodAngle - heelDeg;

	let statusKind = "success";
	let statusText = "Stabile Anfangslage: Rückstellmoment liegt über dem Windmoment.";
	let shipStatus = "stabil: Reserve vorhanden";

	if ( gmEff <= 0 ) {
		statusKind = "error";
		statusText = "GM_eff <= 0: Das Schiff ist im Kleinwinkelbereich nicht aufrichtend.";
		shipStatus = "instabil: GM_eff <= 0";
	} else if ( heelDeg >= downfloodAngle ) {
		statusKind = "error";
		statusText = "Kritisch: Der Gleichgewichtswinkel liegt im Downflooding-Bereich.";
		shipStatus = "kritisch: Downflooding moeglich";
	} else if ( ratio > 0.85 ) {
		statusKind = "warning";
		statusText = "Kleine Stabilitätsreserve: bereits moderate Böen führen zu großen Krängungen.";
		shipStatus = "warnung: kleine Reserve";
	} else if ( ratio > 0.6 ) {
		statusKind = "info";
		statusText = "Spürbare Krängung, aber noch mit Reserve unterhalb des Downflooding-Winkels.";
		shipStatus = "spuerbar gekraengt";
	}

	return {
		issues,
		beam,
		depth,
		draft,
		length,
		cwp,
		openingHeight,
		displacementTons,
		kg,
		kb,
		freeSurface,
		sailArea,
		windSpeed,
		cd,
		hCe,
		volume,
		iw,
		bm,
		km,
		gmRaw,
		gmEff,
		windForce,
		windMoment,
		downfloodAngle,
		ratio,
		heelDeg,
		restoringMoment,
		gz,
		downfloodMargin,
		statusKind,
		statusText,
		shipStatus
	};
} );
</script>

<style scoped>
.sectionTitle {
  font-size: 0.95rem;
  font-weight: 600;
  margin-top: 14px;
  margin-bottom: 4px;
}
</style>
