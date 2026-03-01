<template>
<AppFrame  :sub-chapter="{
		einleitung:'Einleitung',
		'geometrie': 'Geometrie',
		'potenzpunkte': 'Potenzpunkte',
		'radikalachsen': 'Radikalachsen'
	}"
	title="Eddie rechnet: IMO 1985 Aufgabe B2"
	:vue-date="__VITE_SFC_MTIME_MS__"
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
		<div class="eddie">
			<h2>Teil 1 - Aufgabenstellung</h2>
			<p>
				Ein Kreis mit Mittelpunkt <Katex tex="O" /> geht durch die Punkte <Katex tex="A" /> und
				<Katex tex="C" /> des Dreiecks <Katex tex="ABC" />.
				Er schneidet die Strecken <Katex tex="AB" /> bzw. <Katex tex="BC" /> ein zweites Mal in
				<Katex tex="K" /> bzw. <Katex tex="N" />.
			</p>
			<p>
				Die Umkreise von <Katex tex="ABC" /> und <Katex tex="KBN" /> schneiden sich
				(neben <Katex tex="B" />) in einem zweiten Punkt <Katex tex="M" />.
			</p>
			<p>Zu zeigen ist:</p>
			<div class="kbox">
				<Katex as="div" display tex="\angle OMB = 90^\circ." />
			</div>
		</div>

		<h2 id="radikalachsen" class="mt-8">Teil 2 - Zwei Werkzeuge, die wir brauchen (Power + Radikalachse)</h2>
		<div class="eddie">
			<h3>2.1 Potenz (Power) eines Punktes zu einem Kreis</h3>
			<p>
				Für einen Kreis <Katex tex="\omega" /> und einen Punkt <Katex tex="P" /> (nicht unbedingt auf dem Kreis)
				heißt die Potenz von <Katex tex="P" /> bezüglich <Katex tex="\omega" />:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\operatorname{Pow}_{\omega}(P)." />
			</div>
			<p>Zwei praktische Rechenregeln:</p>
			<p><b>(A) Sekantenformel:</b></p>
			<p>
				Schneidet eine Gerade durch <Katex tex="P" /> den Kreis <Katex tex="\omega" /> in
				<Katex tex="U" /> und <Katex tex="V" />, dann gilt
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\operatorname{Pow}_{\omega}(P)=PU\cdot PV." />
			</div>
			<p><b>(B) Mittelpunktformel:</b></p>
			<p>
				Hat <Katex tex="\omega" /> Mittelpunkt <Katex tex="S" /> und Radius <Katex tex="r" />, dann gilt
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\operatorname{Pow}_{\omega}(P)=PS^2-r^2." />
			</div>
			<p>Beide Formeln liefern dieselbe Zahl.</p>

			<h3 class="mt-6">2.2 Radikalachse (Radical axis)</h3>
			<p>
				Für zwei Kreise <Katex tex="\omega_1,\omega_2" /> ist die Radikalachse die Menge aller Punkte
				<Katex tex="P" /> mit
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\operatorname{Pow}_{\omega_1}(P)=\operatorname{Pow}_{\omega_2}(P)." />
			</div>
			<p>Diese Menge ist immer eine Gerade.</p>
			<p>Wichtigster Spezialfall:</p>
			<ul>
				<li>
					Schneiden sich <Katex tex="\omega_1" /> und <Katex tex="\omega_2" /> in zwei Punkten,
					dann ist ihre Radikalachse die Gerade durch diese beiden Schnittpunkte.
				</li>
			</ul>
			<p>Noch ein Fakt (für ganz am Ende):</p>
			<ul>
				<li>
					Die Radikalachse zweier Kreise steht senkrecht zur Verbindungslinie ihrer Mittelpunkte.
				</li>
			</ul>
		</div>

		<h2 class="mt-8">Teil 3 - Die drei Kreise in der Aufgabe</h2>
		<div class="eddie">
			<p>Wir benennen:</p>
			<ul>
				<li>
					<Katex tex="\omega" />: der Kreis mit Mittelpunkt <Katex tex="O" /> durch <Katex tex="A" />
					und <Katex tex="C" />. Sein Radius ist
					<Katex tex="R=OA=OC=OK=ON" />.
				</li>
				<li><Katex tex="\Gamma" />: der Umkreis von <Katex tex="ABC" />.</li>
				<li><Katex tex="\gamma" />: der Umkreis von <Katex tex="KBN" />.</li>
			</ul>
			<p>Dann gelten sofort drei Radikalachsen:</p>
			<ol>
				<li>
					<Katex tex="\omega" /> und <Katex tex="\Gamma" /> schneiden sich in
					<Katex tex="A" /> und <Katex tex="C" /> <Katex tex="\Rightarrow" /> Radikalachse ist
					<Katex tex="AC" />.
				</li>
				<li>
					<Katex tex="\omega" /> und <Katex tex="\gamma" /> schneiden sich in
					<Katex tex="K" /> und <Katex tex="N" /> <Katex tex="\Rightarrow" /> Radikalachse ist
					<Katex tex="KN" />.
				</li>
				<li>
					<Katex tex="\Gamma" /> und <Katex tex="\gamma" /> schneiden sich in
					<Katex tex="B" /> und <Katex tex="M" /> <Katex tex="\Rightarrow" /> Radikalachse ist
					<Katex tex="BM" />.
				</li>
			</ol>
			<p>
				Diese drei Radikalachsen schneiden sich in einem Punkt (dem Radikalzentrum).
				Nenne diesen Punkt
			</p>
			<div class="kbox">
				<Katex as="div" display tex="X := AC \cap KN \cap BM." />
			</div>
			<p>Damit gilt besonders: <Katex tex="B,X,M" /> liegen auf einer Geraden.</p>
		</div>

		<h2 class="mt-8">Teil 4 - Ein Schlüsselschritt: <Katex tex="X,M,N,C" /> liegen auf einem Kreis</h2>
		<div class="eddie">
			<p>Wir zeigen:</p>
			<div class="kbox">
				<Katex as="div" display tex="X,M,N,C \text{ liegen auf einem Kreis.}" />
			</div>
			<p>Dazu zeigen wir die Winkelgleichheit</p>
			<div class="kbox">
				<Katex as="div" display tex="\angle XMN = \angle XCN." />
			</div>
			<p>
				In den folgenden Gleichungen verstehen wir Winkel als Winkel zwischen Geraden
				(also ohne Richtung; Winkel werden modulo <Katex tex="180^\circ" /> betrachtet).
			</p>
			<p>Jetzt die Winkelkette:</p>
			<ul>
				<li>
					Weil <Katex tex="B,X,M" /> auf einer Geraden liegen, sind die Geraden
					<Katex tex="MX" /> und <Katex tex="MB" /> dieselbe Gerade; daher ist
					<Katex tex="\angle XMN=\angle BMN" />.
				</li>
				<li>
					Weil <Katex tex="B,K,M,N" /> auf dem Kreis <Katex tex="\gamma" /> liegen, gilt
					<Katex tex="\angle BMN=\angle BKN" />.
				</li>
				<li>
					Weil <Katex tex="A,K,B" /> auf einer Geraden liegen, sind die Geraden
					<Katex tex="BK" /> und <Katex tex="AK" /> dieselbe Gerade.
					Daher ist der Winkel zwischen <Katex tex="BK" /> und <Katex tex="KN" /> gleich dem Winkel
					zwischen <Katex tex="AK" /> und <Katex tex="KN" />; kurz:
					<Katex tex="\angle BKN=\angle AKN" />.
				</li>
				<li>
					Weil <Katex tex="A,C,K,N" /> auf dem Kreis <Katex tex="\omega" /> liegen, gilt
					<Katex tex="\angle AKN=\angle ACN" />.
				</li>
				<li>
					Weil <Katex tex="X" /> auf <Katex tex="AC" /> liegt, ist
					<Katex tex="\angle ACN=\angle XCN" />.
				</li>
			</ul>
			<div class="kbox">
				<Katex as="div" display tex="\angle XMN=\angle BMN=\angle BKN=\angle AKN=\angle ACN=\angle XCN." />
			</div>
			<p>Damit ist <Katex tex="X,M,N,C" /> zyklisch.</p>
		</div>

		<h2 id="potenzpunkte" class="mt-8">Teil 5 - Die Power-Gleichungen (jetzt wird gerechnet)</h2>
		<div class="eddie">
			<h3>5.1 Eine Gleichung aus dem Radikalzentrum <Katex tex="X" /></h3>
			<p>
				Da <Katex tex="X" /> auf <Katex tex="BM" /> liegt und <Katex tex="B,M" /> auf
				<Katex tex="\Gamma" /> liegen, ist
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\operatorname{Pow}_{\Gamma}(X)=XB\cdot XM." />
			</div>
			<p>
				Da <Katex tex="X" /> aber auch auf der Radikalachse von <Katex tex="\Gamma" /> und
				<Katex tex="\omega" /> liegt (das ist <Katex tex="AC" />), gilt
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\operatorname{Pow}_{\Gamma}(X)=\operatorname{Pow}_{\omega}(X)." />
				<Katex as="div" display tex="\operatorname{Pow}_{\omega}(X)=XO^2-R^2=XO^2-ON^2." />
				<Katex as="div" display tex="XB\cdot XM = XO^2-ON^2." />
			</div>
			<p><Katex tex="\text{(1)}" /></p>

			<h3 class="mt-6">5.2 Eine zweite Gleichung über den Kreis durch <Katex tex="X,M,N,C" /></h3>
			<p>Aus Teil 4 wissen wir: Es gibt einen Kreis durch <Katex tex="X,M,N,C" />. Nenne ihn <Katex tex="\sigma" />.</p>
			<p>Dann ist die Potenz von <Katex tex="B" /> bezüglich <Katex tex="\sigma" /> auf zwei Geraden berechenbar:</p>
			<ul>
				<li>
					Auf der Geraden <Katex tex="BM" /> schneidet <Katex tex="\sigma" /> in
					<Katex tex="M" /> und <Katex tex="X" />, also
					<Katex tex="\operatorname{Pow}_{\sigma}(B)=BM\cdot BX" />.
				</li>
				<li>
					Auf der Geraden <Katex tex="BC" /> schneidet <Katex tex="\sigma" /> in
					<Katex tex="C" /> und <Katex tex="N" />, also
					<Katex tex="\operatorname{Pow}_{\sigma}(B)=BC\cdot BN" />.
				</li>
			</ul>
			<div class="kbox">
				<Katex as="div" display tex="BM\cdot BX = BC\cdot BN." />
			</div>
			<p><Katex tex="\text{(2)}" /></p>
			<p>
				Aber <Katex tex="C" /> und <Katex tex="N" /> liegen auch auf <Katex tex="\omega" />, also ist
				<Katex tex="BC\cdot BN" /> gleichzeitig die Potenz von <Katex tex="B" /> bezüglich <Katex tex="\omega" />.
				Mit der Mittelpunktformel:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="BC\cdot BN=\operatorname{Pow}_{\omega}(B)=BO^2-R^2=BO^2-ON^2." />
				<Katex as="div" display tex="BM\cdot BX = BO^2-ON^2." />
			</div>
			<p><Katex tex="\text{(3)}" /></p>
		</div>

		<h2 class="mt-8">Teil 6 - Der Schluss: daraus folgt der rechte Winkel</h2>
		<div class="eddie">
			<p>Wir ziehen (3) von (1) ab:</p>
			<div class="kbox">
				<Katex as="div" display tex="(XB\cdot XM) - (BM\cdot BX) = (XO^2-ON^2) - (BO^2-ON^2)," />
				<Katex as="div" display tex="XB\cdot XM - BM\cdot BX = XO^2-BO^2." />
			</div>
			<p><Katex tex="\text{(4)}" /></p>
			<p>
				Jetzt kommt ein kurzer Trick mit gerichteten Strecken auf der Geraden <Katex tex="BM" />.
				Wir rechnen auf der Geraden <Katex tex="BM" /> wie auf einer Zahlengeraden (mit Vorzeichen).
				Dabei gilt stets <Katex tex="BM = BX + XM" />; umgestellt ist das
				<Katex tex="BX = BM - XM" /> (mit Vorzeichen).
				Entsprechend gilt dann auch <Katex tex="XB = XM - BM" />.
			</p>
			<div class="kbox">
				<Katex as="div" display tex="BX = BM - XM \quad\text{(als gerichtete Strecken)}." />
			</div>
			<p>Dann ist</p>
			<div class="kbox">
				<Katex as="div" display tex="BM\cdot BX = BM(BM - XM)=BM^2 - BM\cdot XM," />
				<Katex as="div" display tex="XM\cdot XB = XM(XM - BM)=XM^2 - BM\cdot XM." />
			</div>
			<p>Subtrahieren ergibt:</p>
			<div class="kbox">
				<Katex as="div" display tex="XM\cdot XB - BM\cdot BX = XM^2 - BM^2." />
			</div>
			<p>Setze das in (4) ein:</p>
			<div class="kbox">
				<Katex as="div" display tex="XM^2 - BM^2 = XO^2 - BO^2," />
				<Katex as="div" display tex="XO^2 - XM^2 = BO^2 - BM^2." />
			</div>
			<p><Katex tex="\text{(5)}" /></p>

			<h3 class="mt-6">6.1 Was bedeutet (5) geometrisch?</h3>
			<p>Betrachte zwei Kreise:</p>
			<ul>
				<li>Kreis <Katex tex="\tau" /> mit Mittelpunkt <Katex tex="O" /> und Radius <Katex tex="OB" />,</li>
				<li>Kreis <Katex tex="\upsilon" /> mit Mittelpunkt <Katex tex="M" /> und Radius <Katex tex="MB" />.</li>
			</ul>
			<p>
				Dann hat ein Punkt <Katex tex="P" /> auf ihrer Radikalachse genau dann gleiche Potenzen, wenn
			</p>
			<div class="kbox">
				<Katex as="div" display tex="PO^2-OB^2 = PM^2-MB^2 \Longleftrightarrow PO^2-PM^2 = OB^2-MB^2." />
			</div>
			<p>
				Gleichung (5) sagt genau: Die Punkte <Katex tex="P=X" /> und <Katex tex="P=B" /> erfüllen diese Bedingung.
				Also liegen <Katex tex="B" /> und <Katex tex="X" /> auf der Radikalachse der Kreise <Katex tex="\tau" />
				und <Katex tex="\upsilon" />. Diese Radikalachse ist die Gerade <Katex tex="BX" />.
			</p>
			<p>
				Aber: Die Radikalachse zweier Kreise steht senkrecht zur Verbindungslinie ihrer Mittelpunkte,
				hier also senkrecht auf <Katex tex="OM" />. Damit:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="BX \perp OM." />
			</div>
			<p>
				Und weil <Katex tex="B,X,M" /> auf einer Geraden liegen, ist
				<Katex tex="BX" /> dieselbe Gerade wie <Katex tex="BM" />. Also:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="BM \perp OM \Rightarrow \angle OMB = 90^\circ." />
				<Katex as="div" display tex="\boxed{\angle OMB = 90^\circ.}" />
			</div>
		</div>
		<EddieComment subtitle="Die großen Ideen sind:">
			<ol>
				<li>Radikalachsen: drei Paare von Kreisen, drei Geraden, ein Schnittpunkt <Katex tex="X" />.</li>
				<li>Ein zyklisches Viereck <Katex tex="X,M,N,C" /> per Winkelkette.</li>
				<li>Potenzrechnungen auf passenden Geraden (Produkt von Strecken).</li>
				<li>
					Am Ende zeigt eine Gleichung, dass <Katex tex="BX" /> die Radikalachse zweier Kreise mit
					Mittelpunkten <Katex tex="O" /> und <Katex tex="M" /> ist - und damit automatisch senkrecht auf
					<Katex tex="OM" />.
				</li>
			</ol>
		</EddieComment>
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
				<O5_Graph :result />
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
	<template #footer>
		<p class="muted">
			Quelle der Aufgabenstellung/Lösungsskizze:
			<a href="https://prase.cz/kalva/imo/isoln/isoln855.html">IMO 1985 B2 (ISL solutions, prase.cz)</a>
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import { ref } from "vue";

import O5_Graph from "./O5_Graph.vue";
import titleImg from "./O5.webp";

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
