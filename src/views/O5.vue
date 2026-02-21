<template>
<AppFrame
	:sub-chapter="{
		einleitung:'Einleitung',
		'geometrie': 'Geometrie',
		'potenzpunkte': 'Potenzpunkte',
		'radikalachsen': 'Radikalachsen'
	}"
	title="Eddie rechnet: IMO 1985 Aufgabe B2"
>

	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer title="Eddie denkt über die Aufgabe B2 der IMO 85 nach">
				<img loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">Joutsa, 5. Juli 1985</h3>
		<p>Ich höre jeden Atemzug im Raum. Sogar das Umblättern klingt wie ein
			Signal. Mein Blick springt ständig vom Blatt zur Tür, als würde sie gleich aufgehen.</p><p>
			Die Aufgabe ist Geometrie, aber nicht die freundliche Sorte. Es geht um ein Dreieck, und durch
			zwei seiner Ecken läuft ein Kreis mit einem Mittelpunkt, der extra genannt wird. Dieser Kreis
			schneidet zwei Seiten des Dreiecks noch einmal in zwei neuen Punkten. Dann werden zwei weitere
			Kreise gebaut, jeweils durch drei Punkte, und diese beiden Kreise treffen sich (natürlich) in
			genau zwei Stellen. Eine davon ist eine Ecke des Dreiecks. Die andere ist der “mysteriöse” Punkt,
			um den es geht.</p><p>
			Und die ganze Aufgabe läuft auf eine einfache Aussage hinaus: Ein bestimmter Winkel muss genau ein
			rechter Winkel sein. Also wie eine perfekte Ecke.</p><p>
			Normalerweise liebe ich solche “Das muss 90 Grad sein!”-Momente. Heute fühlt es sich an, als müsste
			ich mich zwingen, überhaupt in der Zeichnung zu bleiben.</p><p>
			Hier führe ich dich durch die Idee und die Formeln: Welche Kreise hier “zusammenarbeiten” und warum
			am Ende eine rechte Ecke rausfällt.</p>
	</template>

	<template #descriptionPart>

		<h2 id="geometrie">Teil 1 — Aufgabenstellung</h2>
		<div class="eddie">
			<p>
				Ein Kreis mit Mittelpunkt <Katex tex="O" /> geht durch die Punkte <Katex tex="A" /> und
				<Katex tex="C" /> des Dreiecks <Katex tex="ABC" />.
				Er schneidet die Strecken <Katex tex="AB" /> bzw. <Katex tex="BC" /> ein zweites Mal in
				<Katex tex="K" /> bzw. <Katex tex="N" />.
			</p>
			<p>
				Die Umkreise von <Katex tex="ABC" /> und <Katex tex="KBN" /> schneiden sich genau in
				<Katex tex="B" /> und <Katex tex="M" />.
				Zu zeigen ist:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\angle OMB = 90^\circ." />
			</div>
		</div>

		<h2 id="radikalachsen" class="mt-8">Teil 2 — Beweisidee</h2>
		<div class="eddie">
			<p>
				Die Lösung geht über <b>Radikalachsen</b> und <b>Potenzen</b>:
			</p>
			<ol>
				<li>
					Die drei Radikalachsen der drei Kreispaare sind konkurrent.
					Nenne den Schnittpunkt <Katex tex="X" />.
					Dann liegen <Katex tex="X" /> auf <Katex tex="BM" />, <Katex tex="AC" />, <Katex tex="NK" />.
				</li>
				<li>
					Mit Potenzgleichungen erhält man:
					<Katex tex="XM\cdot XB = XK\cdot XN = XO^2-ON^2" /> und
					<Katex tex="BM\cdot BX = BN\cdot BC = BO^2-ON^2" />.
				</li>
				<li>
					Subtrahieren liefert
					<Katex tex="XO^2-BO^2 = XM^2-BM^2" />;
					daraus folgt geometrisch
					<Katex tex="OM\perp XB" />.
					Da <Katex tex="X,B,M" /> kollinear sind, ist
					<Katex tex="OM\perp MB" />.
				</li>
			</ol>
		</div>

		<h2 id="potenzpunkte" class="mt-8">Teil 3 — Formelblock aus der Lösung</h2>
		<div class="eddie">
			<div class="kbox">
				<Katex as="div" display tex="XM\cdot XB = XK\cdot XN = XO^2-ON^2" />
				<Katex as="div" display tex="BM\cdot BX = BN\cdot BC = BO^2-ON^2" />
				<Katex as="div" display tex="XO^2-BO^2 = XM^2-BM^2" />
				<Katex as="div" display tex="\Rightarrow\ OM\perp MB\ \Rightarrow\ \angle OMB=90^\circ" />
			</div>
		</div>
	</template>

	<template #interactivePart>
		<h2>Spielplatz: numerische Verifikation</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p>
				Wir bauen eine gültige Konfiguration analytisch auf und rechnen die in der Lösung benutzten
				Identitäten numerisch nach.
			</p>

			<div class="d-flex flex-wrap ga-3 align-center">
				<v-text-field
					v-model="bxInput"
					hide-details="auto"
					label="B_x"
					style="max-width: 140px"
				/>
				<v-text-field
					v-model="byInput"
					hide-details="auto"
					label="B_y"
					style="max-width: 140px"
				/>
				<v-text-field
					v-model="alphaInput"
					hide-details="auto"
					label="Richtung α (Grad)"
					style="max-width: 170px"
				/>
				<v-text-field
					v-model="betaInput"
					hide-details="auto"
					label="Richtung β (Grad)"
					style="max-width: 170px"
				/>
				<v-btn color="primary" variant="flat" @click="runCheck">Berechnen</v-btn>
				<v-btn variant="tonal" @click="randomExample">Zufall</v-btn>
			</div>

			<p class="muted">
				Die Richtungen α und β sind die beiden Sekanten durch <Katex tex="B" />, auf denen
				<Katex tex="(A,K)" /> bzw. <Katex tex="(C,N)" /> liegen.
			</p>

			<v-alert v-if="error" type="error" variant="tonal">
				{{ error }}
			</v-alert>

			<v-alert v-if="result" :type="result.okRightAngle ? 'success' : 'warning'" variant="tonal">
				<div class="d-flex flex-column ga-1">
					<div>
						<Katex :tex="`\\angle OMB \\approx ${fmt(result.angleOMB, 6)}^\\circ`" />,
						Abweichung zu <Katex tex="90^\circ" />:
						<Katex :tex="`${fmt(result.angleDeviation, 6)}^\\circ`" />.
					</div>
					<div>
						{{ result.okRightAngle ? "Numerisch bestätigt." : "Hier ist die Konfiguration numerisch instabil." }}
					</div>
				</div>
			</v-alert>

			<image-zoomer :title="`IMO85/5`">
				<O5_Graph :result="result" />
			</image-zoomer>
		</div>
	</template>

	<template #calculationPart>
		<h2>Rechendetails</h2>
		<div class="eddie d-flex flex-column ga-3">
			<v-sheet v-if="result" border class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">Punkte</div>
				<v-table density="compact">
					<thead>
						<tr>
							<th>Punkt</th>
							<th class="text-right">x</th>
							<th class="text-right">y</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="p in result.points" :key="p.name">
							<td><code>{{ p.name }}</code></td>
							<td class="mono text-right">{{ fmt(p.x, 6) }}</td>
							<td class="mono text-right">{{ fmt(p.y, 6) }}</td>
						</tr>
					</tbody>
				</v-table>
			</v-sheet>

			<v-sheet v-if="result" border class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">Identitäten aus der Lösung</div>
				<div class="mono">XM·XB = {{ fmt(result.eq.xmxb, 8) }}</div>
				<div class="mono">XK·XN = {{ fmt(result.eq.xkxn, 8) }}</div>
				<div class="mono">XO²−ON² = {{ fmt(result.eq.xo2on2, 8) }}</div>
				<div class="mono">BM·BX = {{ fmt(result.eq.bmbx, 8) }}</div>
				<div class="mono">BN·BC = {{ fmt(result.eq.bnbc, 8) }}</div>
				<div class="mono">BO²−ON² = {{ fmt(result.eq.bo2on2, 8) }}</div>
				<div class="mono mt-2">Residual 1 = {{ fmt(result.eq.res1, 10) }}</div>
				<div class="mono">Residual 2 = {{ fmt(result.eq.res2, 10) }}</div>
				<div class="mono">Kollinearität(X,B,M) = {{ fmt(result.collinearity, 10) }}</div>
			</v-sheet>
		</div>
	</template>
</AppFrame>
</template>

<script setup>
import { ref } from "vue";

import O5_Graph from "./O5_Graph.vue";
import titleImg from "@/images/O5.webp";

const R = 1;
const EPS = 1e-9;

const bxInput = ref( "1.85" );
const byInput = ref( "0.65" );
const alphaInput = ref( "190" );
const betaInput = ref( "220" );

const error = ref( "" );
const result = ref( null );

function pt( x, y ) {
	return { x, y };
}

function add( a, b ) {
	return pt( a.x + b.x, a.y + b.y );
}

function sub( a, b ) {
	return pt( a.x - b.x, a.y - b.y );
}

function mul( a, t ) {
	return pt( a.x * t, a.y * t );
}

function dot( a, b ) {
	return a.x * b.x + a.y * b.y;
}

function cross( a, b ) {
	return a.x * b.y - a.y * b.x;
}

function norm2( a ) {
	return dot( a, a );
}

function dist2( a, b ) {
	return norm2( sub( a, b ) );
}

function dist( a, b ) {
	return Math.sqrt( dist2( a, b ) );
}

function degToRad( d ) {
	return d * Math.PI / 180;
}

function unitFromDeg( d ) {
	const r = degToRad( d );
	return pt( Math.cos( r ), Math.sin( r ) );
}

function solveLineCircle(
	B, u, radius = 1
) {
	const bu = dot( B, u );
	const c = norm2( B ) - radius * radius;
	const delta = bu * bu - c;

	if ( delta <= EPS ) {
		throw new Error( "Sekante trifft den Kreis nicht in zwei Punkten." );
	}

	const s = Math.sqrt( delta );
	const t1 = -bu - s;
	const t2 = -bu + s;
	return [ t1, t2 ].sort( ( a, b ) => a - b );
}

function orientedSecant(
	B, deg, radius = 1
) {
	const dirs = [ unitFromDeg( deg ), mul( unitFromDeg( deg ), -1 ) ];

	for ( const u of dirs ) {
		const roots = solveLineCircle(
			B, u, radius
		);
		const pos = roots.filter( ( t ) => t > EPS );

		if ( pos.length === 2 ) {
			return {
				u,
				near:      pos[ 0 ],
				far:       pos[ 1 ],
				nearPoint: add( B, mul( u, pos[ 0 ] ) ),
				farPoint:  add( B, mul( u, pos[ 1 ] ) )
			};
		}
	}

	throw new Error( "Richtung liefert keine Sekante mit zwei positiven Schnittparametern." );
}

function circumcircle(
	P, Q, Rr
) {
	const x1 = P.x;
	const y1 = P.y;
	const x2 = Q.x;
	const y2 = Q.y;
	const x3 = Rr.x;
	const y3 = Rr.y;

	const d = 2 * ( x1 * ( y2 - y3 ) + x2 * ( y3 - y1 ) + x3 * ( y1 - y2 ) );

	if ( Math.abs( d ) < EPS ) {
		throw new Error( "Punkte für Umkreis sind nahezu kollinear." );
	}

	const uX =
		( ( x1 * x1 + y1 * y1 ) * ( y2 - y3 ) +
		( x2 * x2 + y2 * y2 ) * ( y3 - y1 ) +
		( x3 * x3 + y3 * y3 ) * ( y1 - y2 ) ) / d;

	const uY =
		( ( x1 * x1 + y1 * y1 ) * ( x3 - x2 ) +
		( x2 * x2 + y2 * y2 ) * ( x1 - x3 ) +
		( x3 * x3 + y3 * y3 ) * ( x2 - x1 ) ) / d;

	const center = pt( uX, uY );
	return {
		center,
		radius: dist( center, P )
	};
}

function circleIntersections(
	c1, r1, c2, r2
) {
	const d = dist( c1, c2 );

	if ( d < EPS ) {
		throw new Error( "Kreise haben fast gleichen Mittelpunkt." );
	}

	if ( d > r1 + r2 + EPS ) {
		throw new Error( "Kreise schneiden sich nicht." );
	}

	if ( d < Math.abs( r1 - r2 ) - EPS ) {
		throw new Error( "Ein Kreis liegt im anderen ohne Schnitt." );
	}

	const a = ( r1 * r1 - r2 * r2 + d * d ) / ( 2 * d );
	const h2 = r1 * r1 - a * a;

	if ( h2 < -EPS ) {
		throw new Error( "Numerischer Fehler bei Kreis-Schnitt." );
	}

	const h = Math.sqrt( Math.max( 0, h2 ) );

	const ex = mul( sub( c2, c1 ), 1 / d );
	const p = add( c1, mul( ex, a ) );
	const ey = pt( -ex.y, ex.x );

	return [
		add( p, mul( ey, h ) ),
		add( p, mul( ey, -h ) )
	];
}

function lineIntersection(
	P1, P2, Q1, Q2
) {
	const r = sub( P2, P1 );
	const s = sub( Q2, Q1 );
	const denom = cross( r, s );

	if ( Math.abs( denom ) < EPS ) {
		throw new Error( "Geraden sind parallel oder fast parallel." );
	}

	const t = cross( sub( Q1, P1 ), s ) / denom;
	return add( P1, mul( r, t ) );
}

function angleAt(
	A, B, C
) {
	const v1 = sub( A, B );
	const v2 = sub( C, B );
	const n1 = Math.sqrt( norm2( v1 ) );
	const n2 = Math.sqrt( norm2( v2 ) );

	if ( n1 < EPS || n2 < EPS ) {
		throw new Error( "Winkel mit zu kleinem Schenkel." );
	}

	let c = dot( v1, v2 ) / ( n1 * n2 );
	c = Math.max( -1, Math.min( 1, c ) );
	return Math.acos( c ) * 180 / Math.PI;
}

function parseNumber( v, label ) {
	const s = String( v ?? "" ).trim()
		.replace( ",", "." );

	if ( !s ) {
		throw new Error( `${label}: leer.` );
	}

	const x = Number( s );

	if ( !Number.isFinite( x ) ) {
		throw new Error( `${label}: ungültige Zahl.` );
	}

	return x;
}

function buildConfiguration( {
	bx, by, alpha, beta
} ) {
	const O = pt( 0, 0 );
	const B = pt( bx, by );

	if ( dist( B, O ) <= R + 0.02 ) {
		throw new Error( "B muss außerhalb des Kreises um O liegen." );
	}

	if ( Math.abs( alpha - beta ) < 2 ) {
		throw new Error( "Die Richtungen α und β müssen ausreichend verschieden sein." );
	}

	const sec1 = orientedSecant(
		B, alpha, R
	);
	const sec2 = orientedSecant(
		B, beta, R
	);

	const A = sec1.farPoint;
	const K = sec1.nearPoint;
	const C = sec2.farPoint;
	const N = sec2.nearPoint;

	const area2 = Math.abs( cross( sub( A, B ), sub( C, B ) ) );

	if ( area2 < 1e-4 ) {
		throw new Error( "A, B, C liegen nahezu auf einer Linie." );
	}

	const cABC = circumcircle(
		A, B, C
	);
	const cKBN = circumcircle(
		K, B, N
	);
	const its = circleIntersections(
		cABC.center, cABC.radius, cKBN.center, cKBN.radius
	);

	const i1 = its[ 0 ];
	const i2 = its[ 1 ];
	const M = dist( i1, B ) > dist( i2, B ) ? i1 : i2;

	const X = lineIntersection(
		A, C, N, K
	);

	const XM = dist( X, M );
	const XB = dist( X, B );
	const XK = dist( X, K );
	const XN = dist( X, N );
	const XO2 = dist2( X, O );
	const ON2 = dist2( O, N );

	const BM = dist( B, M );
	const BN = dist( B, N );
	const BC = dist( B, C );
	const BO2 = dist2( B, O );

	const eq = {
		xmxb:   XM * XB,
		xkxn:   XK * XN,
		xo2on2: XO2 - ON2,
		bmbx:   BM * XB,
		bnbc:   BN * BC,
		bo2on2: BO2 - ON2
	};

	eq.res1 = Math.max( Math.abs( eq.xmxb - eq.xkxn ),
		Math.abs( eq.xmxb - eq.xo2on2 ) );
	eq.res2 = Math.max( Math.abs( eq.bmbx - eq.bnbc ),
		Math.abs( eq.bmbx - eq.bo2on2 ) );

	const angleOMB = angleAt(
		O, M, B
	);
	const angleDeviation = Math.abs( angleOMB - 90 );
	const collinearity = Math.abs( cross( sub( X, B ), sub( M, B ) ) );

	return {
		points: [
			{
				name: "O", x: O.x, y: O.y
			},
			{
				name: "A", x: A.x, y: A.y
			},
			{
				name: "B", x: B.x, y: B.y
			},
			{
				name: "C", x: C.x, y: C.y
			},
			{
				name: "K", x: K.x, y: K.y
			},
			{
				name: "N", x: N.x, y: N.y
			},
			{
				name: "M", x: M.x, y: M.y
			},
			{
				name: "X", x: X.x, y: X.y
			}
		],
		eq,
		angleOMB,
		angleDeviation,
		collinearity,
		okRightAngle: angleDeviation < 1e-4 && eq.res1 < 1e-5 && eq.res2 < 1e-5
	};
}

function runCheck() {
	error.value = "";
	result.value = null;

	try {
		const bx = parseNumber( bxInput.value, "B_x" );
		const by = parseNumber( byInput.value, "B_y" );
		const alpha = parseNumber( alphaInput.value, "α" );
		const beta = parseNumber( betaInput.value, "β" );
		result.value = buildConfiguration( {
			bx, by, alpha, beta
		} );
	} catch ( e ) {
		error.value = e?.message ? String( e.message ) : String( e );
	}
}

function randomExample() {
	error.value = "";
	result.value = null;

	for ( let attempt = 0; attempt < 200; attempt++ ) {
		const d = 1.7 + Math.random() * 0.5;
		const theta = Math.random() * 2 * Math.PI;
		const bx = d * Math.cos( theta );
		const by = d * Math.sin( theta );

		const toCenterDeg = ( Math.atan2( -by, -bx ) * 180 / Math.PI + 360 ) % 360;
		const off1 = 8 + Math.random() * 10;
		const off2 = 8 + Math.random() * 10;

		const alpha = toCenterDeg - off1;
		const beta = toCenterDeg + off2;

		try {
			const out = buildConfiguration( {
				bx, by, alpha, beta
			} );
			bxInput.value = String( bx );
			byInput.value = String( by );
			alphaInput.value = String( alpha );
			betaInput.value = String( beta );
			result.value = out;
			return;
		} catch {
			// try next random config
		}
	}

	error.value = "Konnte keine stabile Zufallskonfiguration finden. Bitte erneut klicken.";
}

function fmt( n, digits = 6 ) {
	if ( !Number.isFinite( n ) ) {
		return "–";
	}

	return n.toFixed( digits );
}

runCheck();
</script>

<style scoped>
ol > li { margin: 0.35rem 0; }
</style>
