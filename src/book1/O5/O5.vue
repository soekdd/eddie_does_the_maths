<!-- i18n-ally-scope: useI18n("book1.O5") -->
<template>
<AppFrame
	:languages="[ 'de', 'en' ]"
	:sub-chapter
	:title="t( 'title' )"
	:vue-date="__VITE_SFC_MTIME_MS__"
>
	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="t( 'imageTitle' )">
				<img :alt="t( 'imageAlt' )" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">{{ t( "introDate" ) }}</h3>
		<div class="eddie">
			<p v-html="t( 'book.p1' )"/>
			<p v-html="t( 'book.p2' )"/>
			<p v-html="t( 'book.p3' )"/>
			<p v-html="t( 'book.p4' )"/>
			<p v-html="t( 'book.p5' )"/>
		</div>
	</template>

	<template #descriptionPart>
		<div class="eddie">
			<h2>{{ t( "sections.part1.title" ) }}</h2>
			<p>
				{{ t( "sections.part1.p1a" ) }} <Katex tex="O" /> {{ t( "sections.part1.p1b" ) }}
				<Katex tex="A" /> {{ t( "sections.part1.p1c" ) }} <Katex tex="C" />
				{{ t( "sections.part1.p1d" ) }} <Katex tex="ABC" />.
				{{ t( "sections.part1.p1e" ) }} <Katex tex="AB" /> {{ t( "sections.part1.p1f" ) }}
				<Katex tex="BC" /> {{ t( "sections.part1.p1g" ) }} <Katex tex="K" />
				{{ t( "sections.part1.p1h" ) }} <Katex tex="N" />.
			</p>
			<p>
				{{ t( "sections.part1.p2a" ) }} <Katex tex="ABC" /> {{ t( "sections.part1.p2b" ) }}
				<Katex tex="KBN" /> {{ t( "sections.part1.p2c" ) }} {{ t( "sections.part1.p2d" ) }}
				<Katex tex="B" />) {{ t( "sections.part1.p2e" ) }} <Katex tex="M" />.
			</p>
			<p v-html="t( 'sections.part1.prove' )"/>
			<div class="kbox">
				<Katex as="div" display tex="\angle OMB = 90^\circ." />
			</div>
		</div>
		<figure class="exampleFigure">
			<ImageZoomer>
				<O5Graph :result />
			</ImageZoomer>
		</figure>

		<h2 id="radikalachsen" class="mt-8">{{ t( "sections.part2.title" ) }}</h2>
		<div class="eddie">
			<h3>{{ t( "sections.part2.s1Title" ) }}</h3>
			<p>
				{{ t( "sections.part2.s1p1a" ) }} <Katex tex="\omega" /> {{ t( "sections.part2.s1p1b" ) }}
				<Katex tex="P" /> {{ t( "sections.part2.s1p1c" ) }} <Katex tex="P" />
				{{ t( "sections.part2.s1p1d" ) }} <Katex tex="\omega" />:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\operatorname{Pot}_{\omega}(P)." />
			</div>
			<p v-html="t( 'sections.part2.s1p2' )"/>
			<p><b>{{ t( "sections.part2.s1a" ) }}</b></p>
			<p>
				{{ t( "sections.part2.s1p3a" ) }} <Katex tex="P" /> {{ t( "sections.part2.s1p3b" ) }}
				<Katex tex="\omega" /> {{ t( "sections.part2.s1p3c" ) }} <Katex tex="U" />
				{{ t( "sections.part2.s1p3d" ) }} <Katex tex="V" />, {{ t( "sections.part2.s1p3e" ) }}
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\operatorname{Pot}_{\omega}(P)=PU\cdot PV." />
			</div>
			<p><b>{{ t( "sections.part2.s1b" ) }}</b></p>
			<p>
				{{ t( "sections.part2.s1p4a" ) }} <Katex tex="\omega" /> {{ t( "sections.part2.s1p4b" ) }}
				<Katex tex="S" /> {{ t( "sections.part2.s1p4c" ) }} <Katex tex="r" />,
				{{ t( "sections.part2.s1p4d" ) }}
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\operatorname{Pot}_{\omega}(P)=PS^2-r^2." />
			</div>
			<p v-html="t( 'sections.part2.s1p5' )"/>

			<h3 class="mt-6">{{ t( "sections.part2.s2Title" ) }}</h3>
			<p>
				{{ t( "sections.part2.s2p1a" ) }} <Katex tex="\omega_1,\omega_2" />
				{{ t( "sections.part2.s2p1b" ) }} <Katex tex="P" />
				{{ t( "sections.part2.s2p1c" ) }}
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\operatorname{Pot}_{\omega_1}(P)=\operatorname{Pot}_{\omega_2}(P)." />
			</div>
			<p v-html="t( 'sections.part2.s2p2' )"/>
			<p v-html="t( 'sections.part2.s2p3' )"/>
			<ul>
				<li>
					{{ t( "sections.part2.s2l1a" ) }} <Katex tex="\omega_1" /> {{ t( "sections.part2.s2l1b" ) }}
					<Katex tex="\omega_2" /> {{ t( "sections.part2.s2l1c" ) }}
				</li>
			</ul>
			<p v-html="t( 'sections.part2.s2p4' )"/>
			<ul>
				<li>{{ t( "sections.part2.s2l2" ) }}</li>
			</ul>
		</div>

		<h2 id="geometrie" class="mt-8">{{ t( "sections.part3.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part3.p1' )"/>
			<ul>
				<li>
					<Katex tex="\omega" />{{ t( "sections.part3.l1a" ) }} <Katex tex="O" />
					{{ t( "sections.part3.l1b" ) }} <Katex tex="A" />
					{{ t( "sections.part3.l1c" ) }} <Katex tex="C" />.
					{{ t( "sections.part3.l1d" ) }} <Katex tex="R=OA=OC=OK=ON" />.
				</li>
				<li><Katex tex="\Gamma" />{{ t( "sections.part3.l2" ) }} <Katex tex="ABC" />.</li>
				<li><Katex tex="\gamma" />{{ t( "sections.part3.l3" ) }} <Katex tex="KBN" />.</li>
			</ul>
			<p v-html="t( 'sections.part3.p2' )"/>
			<ol>
				<li>
					<Katex tex="\omega" /> {{ t( "sections.part3.o1a" ) }} <Katex tex="\Gamma" />
					{{ t( "sections.part3.o1b" ) }} <Katex tex="A" /> {{ t( "sections.part3.o1c" ) }}
					<Katex tex="C" /> <Katex tex="\Rightarrow" /> {{ t( "sections.part3.o1d" ) }}
					<Katex tex="AC" />.
				</li>
				<li>
					<Katex tex="\omega" /> {{ t( "sections.part3.o2a" ) }} <Katex tex="\gamma" />
					{{ t( "sections.part3.o2b" ) }} <Katex tex="K" /> {{ t( "sections.part3.o2c" ) }}
					<Katex tex="N" /> <Katex tex="\Rightarrow" /> {{ t( "sections.part3.o2d" ) }}
					<Katex tex="KN" />.
				</li>
				<li>
					<Katex tex="\Gamma" /> {{ t( "sections.part3.o3a" ) }} <Katex tex="\gamma" />
					{{ t( "sections.part3.o3b" ) }} <Katex tex="B" /> {{ t( "sections.part3.o3c" ) }}
					<Katex tex="M" /> <Katex tex="\Rightarrow" /> {{ t( "sections.part3.o3d" ) }}
					<Katex tex="BM" />.
				</li>
			</ol>
			<p v-html="t( 'sections.part3.p3' )"/>
			<div class="kbox">
				<Katex as="div" display tex="X := AC \cap KN \cap BM." />
			</div>
			<p>{{ t( "sections.part3.p4" ) }} <Katex tex="B,X,M" /> {{ t( "sections.part3.p4b" ) }}</p>
		</div>

		<h2 class="mt-8">{{ t( "sections.part4.title" ) }} <Katex tex="X,M,N,C" /> {{ t( "sections.part4.titleSuffix" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part4.p1' )"/>
			<div class="kbox">
				<Katex as="div" display :tex="t( 'sections.part4.proveBox' )" />
			</div>
			<p v-html="t( 'sections.part4.p2' )"/>
			<div class="kbox">
				<Katex as="div" display tex="\angle XMN = \angle XCN." />
			</div>
			<p>
				{{ t( "sections.part4.p3a" ) }} <Katex tex="180^\circ" /> {{ t( "sections.part4.p3b" ) }}
			</p>
			<p v-html="t( 'sections.part4.p4' )"/>
			<ul>
				<li>
					{{ t( "sections.part4.l1a" ) }} <Katex tex="B,X,M" /> {{ t( "sections.part4.l1b" ) }}
					<Katex tex="MX" /> {{ t( "sections.part4.l1c" ) }} <Katex tex="MB" />
					{{ t( "sections.part4.l1d" ) }} <Katex tex="\angle XMN=\angle BMN" />.
				</li>
				<li>
					{{ t( "sections.part4.l2a" ) }} <Katex tex="B,K,M,N" /> {{ t( "sections.part4.l2b" ) }}
					<Katex tex="\gamma" /> {{ t( "sections.part4.l2c" ) }} <Katex tex="\angle BMN=\angle BKN" />.
				</li>
				<li>
					{{ t( "sections.part4.l3a" ) }} <Katex tex="A,K,B" /> {{ t( "sections.part4.l3b" ) }}
					<Katex tex="BK" /> {{ t( "sections.part4.l3c" ) }} <Katex tex="AK" />
					{{ t( "sections.part4.l3d" ) }} <Katex tex="BK" /> {{ t( "sections.part4.l3e" ) }}
					<Katex tex="KN" /> {{ t( "sections.part4.l3f" ) }} <Katex tex="AK" />
					{{ t( "sections.part4.l3g" ) }} <Katex tex="KN" />; {{ t( "sections.part4.l3h" ) }}
					<Katex tex="\angle BKN=\angle AKN" />.
				</li>
				<li>
					{{ t( "sections.part4.l4a" ) }} <Katex tex="A,C,K,N" /> {{ t( "sections.part4.l4b" ) }}
					<Katex tex="\omega" /> {{ t( "sections.part4.l4c" ) }} <Katex tex="\angle AKN=\angle ACN" />.
				</li>
				<li>
					{{ t( "sections.part4.l5a" ) }} <Katex tex="X" /> {{ t( "sections.part4.l5b" ) }}
					<Katex tex="AC" /> {{ t( "sections.part4.l5c" ) }} <Katex tex="\angle ACN=\angle XCN" />.
				</li>
			</ul>
			<div class="kbox">
				<Katex as="div" display tex="\angle XMN=\angle BMN=\angle BKN=\angle AKN=\angle ACN=\angle XCN." />
			</div>
			<p>{{ t( "sections.part4.p5" ) }} <Katex tex="X,M,N,C" /> {{ t( "sections.part4.p5b" ) }}</p>
		</div>

		<h2 id="potenzpunkte" class="mt-8">{{ t( "sections.part5.title" ) }}</h2>
		<div class="eddie">
			<h3>{{ t( "sections.part5.s1Title" ) }} <Katex tex="X" /></h3>
			<p>
				{{ t( "sections.part5.s1p1a" ) }} <Katex tex="X" /> {{ t( "sections.part5.s1p1b" ) }}
				<Katex tex="BM" /> {{ t( "sections.part5.s1p1c" ) }} <Katex tex="B,M" />
				{{ t( "sections.part5.s1p1d" ) }} <Katex tex="\Gamma" /> {{ t( "sections.part5.s1p1e" ) }}
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\operatorname{Pot}_{\Gamma}(X)=XB\cdot XM." />
			</div>
			<p>
				{{ t( "sections.part5.s1p2a" ) }} <Katex tex="X" /> {{ t( "sections.part5.s1p2b" ) }}
				<Katex tex="\Gamma" /> {{ t( "sections.part5.s1p2c" ) }} <Katex tex="\omega" />
				{{ t( "sections.part5.s1p2d" ) }} <Katex tex="AC" />{{ t( "sections.part5.s1p2e" ) }}
			</p>
			<div class="kbox">
				<Katex as="div" display tex="\operatorname{Pot}_{\Gamma}(X)=\operatorname{Pot}_{\omega}(X)." />
				<Katex as="div" display tex="\operatorname{Pot}_{\omega}(X)=XO^2-R^2=XO^2-ON^2." />
				<Katex as="div" display tex="XB\cdot XM = XO^2-ON^2." />
			</div>
			<p><Katex tex="\text{(1)}" /></p>

			<h3 class="mt-6">{{ t( "sections.part5.s2Title" ) }} <Katex tex="X,M,N,C" /></h3>
			<p>{{ t( "sections.part5.s2p1a" ) }} <Katex tex="X,M,N,C" />. {{ t( "sections.part5.s2p1b" ) }} <Katex tex="\sigma" />.</p>
			<p>
				{{ t( "sections.part5.s2p2a" ) }} <Katex tex="B" /> {{ t( "sections.part5.s2p2b" ) }}
				<Katex tex="\sigma" /> {{ t( "sections.part5.s2p2c" ) }}
			</p>
			<ul>
				<li>
					{{ t( "sections.part5.s2l1a" ) }} <Katex tex="BM" /> {{ t( "sections.part5.s2l1b" ) }}
					<Katex tex="\sigma" /> {{ t( "sections.part5.s2l1c" ) }} <Katex tex="M" />
					{{ t( "sections.part5.s2l1d" ) }} <Katex tex="X" />, {{ t( "sections.part5.s2l1e" ) }}
					<Katex tex="\operatorname{Pot}_{\sigma}(B)=BM\cdot BX" />.
				</li>
				<li>
					{{ t( "sections.part5.s2l2a" ) }} <Katex tex="BC" /> {{ t( "sections.part5.s2l2b" ) }}
					<Katex tex="\sigma" /> {{ t( "sections.part5.s2l2c" ) }} <Katex tex="C" />
					{{ t( "sections.part5.s2l2d" ) }} <Katex tex="N" />, {{ t( "sections.part5.s2l2e" ) }}
					<Katex tex="\operatorname{Pot}_{\sigma}(B)=BC\cdot BN" />.
				</li>
			</ul>
			<div class="kbox">
				<Katex as="div" display tex="BM\cdot BX = BC\cdot BN." />
			</div>
			<p><Katex tex="\text{(2)}" /></p>
			<p>
				{{ t( "sections.part5.s2p3a" ) }} <Katex tex="C" /> {{ t( "sections.part5.s2p3b" ) }}
				<Katex tex="N" /> {{ t( "sections.part5.s2p3c" ) }} <Katex tex="\omega" />,
				{{ t( "sections.part5.s2p3d" ) }} <Katex tex="BC\cdot BN" />
				{{ t( "sections.part5.s2p3e" ) }} <Katex tex="B" />
				{{ t( "sections.part5.s2p3f" ) }} <Katex tex="\omega" />.
				{{ t( "sections.part5.s2p3g" ) }}
			</p>
			<div class="kbox">
				<Katex as="div" display tex="BC\cdot BN=\operatorname{Pot}_{\omega}(B)=BO^2-R^2=BO^2-ON^2." />
				<Katex as="div" display tex="BM\cdot BX = BO^2-ON^2." />
			</div>
			<p><Katex tex="\text{(3)}" /></p>
		</div>

		<h2 class="mt-8">{{ t( "sections.part6.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part6.p1' )"/>
			<div class="kbox">
				<Katex as="div" display tex="(XB\cdot XM) - (BM\cdot BX) = (XO^2-ON^2) - (BO^2-ON^2)," />
				<Katex as="div" display tex="XB\cdot XM - BM\cdot BX = XO^2-BO^2." />
			</div>
			<p><Katex tex="\text{(4)}" /></p>
			<p>
				{{ t( "sections.part6.p2a" ) }} <Katex tex="BM" />.
				{{ t( "sections.part6.p2b" ) }} <Katex tex="BM" /> {{ t( "sections.part6.p2c" ) }}
			</p>
			<p>
				{{ t( "sections.part6.p3a" ) }} <Katex tex="BM = BX + XM" />; {{ t( "sections.part6.p3b" ) }}
				<Katex tex="BX = BM - XM" /> {{ t( "sections.part6.p3c" ) }}
				<Katex tex="XB = XM - BM" />.
			</p>
			<div class="kbox">
				<Katex as="div" display :tex="t( 'sections.part6.p3Box' )" />
			</div>
			<p v-html="t( 'sections.part6.p4' )"/>
			<div class="kbox">
				<Katex as="div" display tex="BM\cdot BX = BM(BM - XM)=BM^2 - BM\cdot XM," />
				<Katex as="div" display tex="XM\cdot XB = XM(XM - BM)=XM^2 - BM\cdot XM." />
			</div>
			<p v-html="t( 'sections.part6.p5' )"/>
			<div class="kbox">
				<Katex as="div" display tex="XM\cdot XB - BM\cdot BX = XM^2 - BM^2." />
			</div>
			<p v-html="t( 'sections.part6.p6' )"/>
			<div class="kbox">
				<Katex as="div" display tex="XM^2 - BM^2 = XO^2 - BO^2," />
				<Katex as="div" display tex="XO^2 - XM^2 = BO^2 - BM^2." />
			</div>
			<p><Katex tex="\text{(5)}" /></p>

			<h3 class="mt-6">{{ t( "sections.part6.s1Title" ) }}</h3>
			<p v-html="t( 'sections.part6.s1p1' )"/>
			<ul>
				<li>
					{{ t( "sections.part6.s1l1" ) }} <Katex tex="\tau" /> {{ t( "sections.part6.s1l1b" ) }}
					<Katex tex="O" /> {{ t( "sections.part6.s1l1c" ) }} <Katex tex="OB" />,
				</li>
				<li>
					{{ t( "sections.part6.s1l2" ) }} <Katex tex="\upsilon" /> {{ t( "sections.part6.s1l2b" ) }}
					<Katex tex="M" /> {{ t( "sections.part6.s1l2c" ) }} <Katex tex="MB" />.
				</li>
			</ul>
			<p>
				{{ t( "sections.part6.s1p2a" ) }} <Katex tex="P" /> {{ t( "sections.part6.s1p2b" ) }}
			</p>
			<div class="kbox">
				<Katex as="div" display tex="PO^2-OB^2 = PM^2-MB^2 \Longleftrightarrow PO^2-PM^2 = OB^2-MB^2." />
			</div>
			<p>
				{{ t( "sections.part6.s1p3a" ) }} <Katex tex="P=X" /> {{ t( "sections.part6.s1p3b" ) }}
				<Katex tex="P=B" /> {{ t( "sections.part6.s1p3c" ) }} <Katex tex="B" />
				{{ t( "sections.part6.s1p3d" ) }} <Katex tex="X" />
				{{ t( "sections.part6.s1p3e" ) }} <Katex tex="\tau" />
				{{ t( "sections.part6.s1p3f" ) }} <Katex tex="\upsilon" />.
				{{ t( "sections.part6.s1p3g" ) }} <Katex tex="BX" />.
			</p>
			<p>
				{{ t( "sections.part6.s1p4a" ) }} <Katex tex="OM" />.
				{{ t( "sections.part6.s1p4b" ) }}
			</p>
			<div class="kbox">
				<Katex as="div" display tex="BX \perp OM." />
			</div>
			<p>
				{{ t( "sections.part6.s1p5a" ) }} <Katex tex="B,X,M" /> {{ t( "sections.part6.s1p5b" ) }}
				<Katex tex="BX" /> {{ t( "sections.part6.s1p5c" ) }} <Katex tex="BM" />.
				{{ t( "sections.part6.s1p5d" ) }}
			</p>
			<div class="kbox">
				<Katex as="div" display tex="BM \perp OM \Rightarrow \angle OMB = 90^\circ." />
				<Katex as="div" display tex="\boxed{\angle OMB = 90^\circ.}" />
			</div>
		</div>
		<EddieComment :subtitle="t( 'sections.part6.commentTitle' )">
			<ol>
				<li v-for="( item, index ) in commentItems" :key="index" v-html="item" />
			</ol>
		</EddieComment>
	</template>

	<template #interactivePart>
		<h2>{{ t( "sections.interactive.title" ) }}</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p v-html="t( 'sections.interactive.intro' )"/>

			<div class="d-flex flex-wrap ga-3 align-center">
				<v-text-field
					v-model="bxInput"
					hide-details="auto"
					:label="t( 'sections.interactive.bxLabel' )"
					style="max-width: 140px"
				/>
				<v-text-field
					v-model="byInput"
					hide-details="auto"
					:label="t( 'sections.interactive.byLabel' )"
					style="max-width: 140px"
				/>
				<v-text-field
					v-model="alphaInput"
					hide-details="auto"
					:label="t( 'sections.interactive.alphaLabel' )"
					style="max-width: 170px"
				/>
				<v-text-field
					v-model="betaInput"
					hide-details="auto"
					:label="t( 'sections.interactive.betaLabel' )"
					style="max-width: 170px"
				/>
				<v-btn color="primary" variant="flat" @click="runCheck">{{ t( "sections.interactive.check" ) }}</v-btn>
				<v-btn variant="tonal" @click="randomExample">{{ t( "sections.interactive.random" ) }}</v-btn>
			</div>

			<p class="muted" v-html="t( 'sections.interactive.hint' )" />

			<v-alert v-if="error" type="error" variant="tonal">
				{{ error }}
			</v-alert>

			<v-alert v-if="result" :type="result.okRightAngle ? 'success' : 'warning'" variant="tonal">
				<div class="d-flex flex-column ga-1">
					<div>
						<Katex :tex="`\\angle OMB \\approx ${fmt(result.angleOMB, 6)}^\\circ`" />,
						{{ t( "sections.interactive.angleLabel" ) }} <Katex tex="90^\circ" />:
						<Katex :tex="`${fmt(result.angleDeviation, 6)}^\\circ`" />.
					</div>
					<div>
						{{ result.okRightAngle ? t( "sections.interactive.confirmed" ) : t( "sections.interactive.unstable" ) }}
					</div>
				</div>
			</v-alert>

			<ImageZoomer :title="t( 'sections.interactive.graphZoomTitle' )">
				<O5Graph :result />
			</ImageZoomer>
		</div>
	</template>

	<template #calculationPart>
		<h2>{{ t( "sections.calculation.title" ) }}</h2>
		<div class="eddie d-flex flex-column ga-3">
			<v-sheet v-if="result" border class="pa-3 rounded">
				<div class="text-subtitle-1 font-weight-medium mb-2">{{ t( "sections.calculation.pointsTitle" ) }}</div>
				<v-table density="compact">
					<thead>
						<tr>
							<th>{{ t( "sections.calculation.point" ) }}</th>
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
				<div class="text-subtitle-1 font-weight-medium mb-2">{{ t( "sections.calculation.identitiesTitle" ) }}</div>
				<div class="mono">XM·XB = {{ fmt(result.eq.xmxb, 8) }}</div>
				<div class="mono">XK·XN = {{ fmt(result.eq.xkxn, 8) }}</div>
				<div class="mono">XO²−ON² = {{ fmt(result.eq.xo2on2, 8) }}</div>
				<div class="mono">BM·BX = {{ fmt(result.eq.bmbx, 8) }}</div>
				<div class="mono">BN·BC = {{ fmt(result.eq.bnbc, 8) }}</div>
				<div class="mono">BO²−ON² = {{ fmt(result.eq.bo2on2, 8) }}</div>
				<div class="mono mt-2">{{ t( "sections.calculation.residual1" ) }} = {{ fmt(result.eq.res1, 10) }}</div>
				<div class="mono">{{ t( "sections.calculation.residual2" ) }} = {{ fmt(result.eq.res2, 10) }}</div>
				<div class="mono">{{ t( "sections.calculation.collinearity" ) }} = {{ fmt(result.collinearity, 10) }}</div>
			</v-sheet>
		</div>
	</template>

	<template #footer>
		<p class="muted">
			{{ t( "footer.label" ) }}
			<a href="https://prase.cz/kalva/imo/isoln/isoln855.html">{{ t( "footer.link" ) }}</a>
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "@/utils/i18n.mjs";

import O5Graph from "./O5_Graph.vue";
import titleImg from "./O5.webp";

const {
	t, tm, parseLocalizedNumber
} = useI18n( "book1.O5" );

const R = 1;
const EPS = 1e-9;

const bxInput = ref( "1.85" );
const byInput = ref( "0.65" );
const alphaInput = ref( "190" );
const betaInput = ref( "220" );

const error = ref( "" );
const result = ref( null );
const subChapter = computed( () => tm( "subChapter" ) ?? {} );
const commentItems = computed( () => tm( "sections.part6.commentItems" ) ?? [] );

function pt( x, y ) {
	return {
		x,
		y
	};
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
		throw new Error( t( "sections.interactive.errors.noSecant" ) );
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

	throw new Error( t( "sections.interactive.errors.noPositiveSecant" ) );
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
		throw new Error( t( "sections.interactive.errors.circumcircleCollinear" ) );
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
		throw new Error( t( "sections.interactive.errors.sameCenter" ) );
	}

	if ( d > r1 + r2 + EPS ) {
		throw new Error( t( "sections.interactive.errors.noIntersection" ) );
	}

	if ( d < Math.abs( r1 - r2 ) - EPS ) {
		throw new Error( t( "sections.interactive.errors.containedNoIntersection" ) );
	}

	const a = ( r1 * r1 - r2 * r2 + d * d ) / ( 2 * d );
	const h2 = r1 * r1 - a * a;

	if ( h2 < -EPS ) {
		throw new Error( t( "sections.interactive.errors.numericIntersection" ) );
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
		throw new Error( t( "sections.interactive.errors.parallelLines" ) );
	}

	const tParam = cross( sub( Q1, P1 ), s ) / denom;
	return add( P1, mul( r, tParam ) );
}

function angleAt(
	A, B, C
) {
	const v1 = sub( A, B );
	const v2 = sub( C, B );
	const n1 = Math.sqrt( norm2( v1 ) );
	const n2 = Math.sqrt( norm2( v2 ) );

	if ( n1 < EPS || n2 < EPS ) {
		throw new Error( t( "sections.interactive.errors.smallAngleLeg" ) );
	}

	let c = dot( v1, v2 ) / ( n1 * n2 );
	c = Math.max( -1, Math.min( 1, c ) );
	return Math.acos( c ) * 180 / Math.PI;
}

function parseNumber( v, label ) {
	const s = String( v ?? "" ).trim();

	if ( !s ) {
		throw new Error( t( "sections.interactive.errors.empty", { label } ) );
	}

	const x = parseLocalizedNumber( s );

	if ( x === null ) {
		throw new Error( t( "sections.interactive.errors.invalidNumber", { label } ) );
	}

	return x;
}

function buildConfiguration( {
	bx, by, alpha, beta
} ) {
	const O = pt( 0, 0 );
	const B = pt( bx, by );

	if ( dist( B, O ) <= R + 0.02 ) {
		throw new Error( t( "sections.interactive.errors.pointBOutside" ) );
	}

	if ( Math.abs( alpha - beta ) < 2 ) {
		throw new Error( t( "sections.interactive.errors.directionsDifferent" ) );
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
		throw new Error( t( "sections.interactive.errors.abcCollinear" ) );
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
			bx,
			by,
			alpha,
			beta
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
				bx,
				by,
				alpha,
				beta
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

	error.value = t( "sections.interactive.errors.randomFailed" );
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
