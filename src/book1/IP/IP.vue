<!-- i18n-ally-scope: useI18n("book1.IP") -->
<!-- eslint-disable vue/max-len -->
<template>
<AppFrame
	:sub-chapter
	:title="t( 'title' )"
	:wip-date="__VITE_SFC_MTIME_MS__"
>
	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer is-ai :title="t( 'imageTitle' )">
				<img :alt="t( 'imageAlt' )" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">{{ t( "introDate" ) }}</h3>
		<div class="eddie">
			<p v-html="t( 'book.p1' )" />
			<p v-html="t( 'book.p2' )" />
			<p v-html="t( 'book.p3' )" />
			<p v-html="t( 'book.p4' )" />
		</div>
	</template>
	<template #descriptionPart>
		<h2 id="modell">{{ t( "sections.model.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.model.p1' )" />
			<p>{{ t( "sections.model.p2" ) }}</p>
			<div class="tableScroller mt-3">
				<v-table density="compact">
					<thead>
						<tr>
							<th>{{ t( "tables.symbol" ) }}</th>
							<th>{{ t( "tables.meaning" ) }}</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="row in symbolRows" :key="row.id">
							<td><Katex :tex="row.symbol" /></td>
							<td>{{ row.meaning }}</td>
						</tr>
					</tbody>
				</v-table>
			</div>
			<p class="mt-3">
				{{ t( "sections.model.uprightBefore" ) }}
				<Katex tex="\theta=0" />.
			</p>
		</div>

		<h2 id="nichtlineares-modell" class="mt-8">{{ t( "sections.nonlinear.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.nonlinear.p1' )" />
			<div class="kbox">
				<Katex as="div" display tex="(M+m)\ddot{x}+ml\cos(\theta)\ddot{\theta}-ml\sin(\theta)\dot{\theta}^{2}=u" />
			</div>
			<div class="kbox">
				<Katex as="div" display tex="l\ddot{\theta}+\cos(\theta)\ddot{x}-g\sin(\theta)=0" />
			</div>
			<p>{{ t( "sections.nonlinear.p2" ) }}</p>
			<p>{{ t( "sections.nonlinear.p3" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="-ml\sin(\theta)\dot{\theta}^{2}" />
			</div>
			<p>{{ t( "sections.nonlinear.p4" ) }}</p>
		</div>

		<h2 id="linearisierung" class="mt-8">{{ t( "sections.linearization.title" ) }}</h2>
		<div class="eddie">
			<p>
				{{ t( "sections.linearization.p1Before" ) }}
				<Katex tex="\theta=0" />.
			</p>
			<p>{{ t( "sections.linearization.p2" ) }}</p>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="\sin(\theta)&\approx\theta \\ \cos(\theta)&\approx 1 \\ \dot{\theta}^{2}&\approx 0"
				/>
			</div>
			<p>{{ t( "sections.linearization.p3" ) }}</p>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="(M+m)\ddot{x}+ml\ddot{\theta}&=u \\ l\ddot{\theta}+\ddot{x}-g\theta&=0"
				/>
			</div>
		</div>

		<h2 id="beschleunigungen" class="mt-8">{{ t( "sections.acceleration.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "sections.acceleration.p1" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="\ddot{x}=g\theta-l\ddot{\theta}" />
			</div>
			<p>{{ t( "sections.acceleration.p2" ) }}</p>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="(M+m)(g\theta-l\ddot{\theta})+ml\ddot{\theta}&=u \\ (M+m)g\theta-Ml\ddot{\theta}&=u"
				/>
			</div>
			<p>{{ t( "sections.acceleration.p3" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="\ddot{\theta}=\frac{(M+m)g}{Ml}\theta-\frac{1}{Ml}u" />
			</div>
			<p>{{ t( "sections.acceleration.p4" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="\ddot{x}=\frac{1}{M}u-\frac{mg}{M}\theta" />
			</div>
			<p>{{ t( "sections.acceleration.p5" ) }}</p>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="\ddot{x}&=\frac{1}{M}u-\frac{mg}{M}\theta \\ \ddot{\theta}&=\frac{(M+m)g}{Ml}\theta-\frac{1}{Ml}u"
				/>
			</div>
		</div>

		<h2 id="zustandsraum" class="mt-8">{{ t( "sections.stateSpace.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "sections.stateSpace.p1" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="z=\begin{pmatrix}x\\ \dot{x}\\ \theta\\ \dot{\theta}\end{pmatrix}" />
			</div>
			<p>{{ t( "sections.stateSpace.p2" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="\dot{z}=Az+Bu" />
			</div>
			<div class="kbox">
				<Katex
					as="div"
					display
					tex="A=\begin{pmatrix}0&1&0&0\\0&0&-\frac{mg}{M}&0\\0&0&0&1\\0&0&\frac{(M+m)g}{Ml}&0\end{pmatrix}"
				/>
			</div>
			<div class="kbox">
				<Katex as="div" display tex="B=\begin{pmatrix}0\\ \frac{1}{M}\\0\\-\frac{1}{Ml}\end{pmatrix}" />
			</div>
			<p>{{ t( "sections.stateSpace.p3" ) }}</p>
		</div>

		<h2 id="zustandsregler" class="mt-8">{{ t( "sections.controller.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "sections.controller.p1" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="u=-Kz" />
			</div>
			<p>{{ t( "sections.controller.p2" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="u=-k_1x-k_2\dot{x}-k_3\theta-k_4\dot{\theta}" />
			</div>
			<p>{{ t( "sections.controller.p3" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="K=\begin{pmatrix}k_1&k_2&k_3&k_4\end{pmatrix}" />
			</div>
			<p>{{ t( "sections.controller.p4" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="\dot{z}=(A-BK)z" />
			</div>
			<p>
				{{ t( "sections.controller.p5Before" ) }}
				<Katex tex="A-BK" />
				{{ t( "sections.controller.p5After" ) }}
			</p>
		</div>

		<h2 id="regleranteile" class="mt-8">{{ t( "sections.terms.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "sections.terms.p1" ) }}</p>
			<div class="tableScroller mt-3">
				<v-table density="compact">
					<thead>
						<tr>
							<th>{{ t( "tables.term" ) }}</th>
							<th>{{ t( "tables.meaning" ) }}</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="row in controllerRows" :key="row.id">
							<td><Katex :tex="row.term" /></td>
							<td>{{ row.meaning }}</td>
						</tr>
					</tbody>
				</v-table>
			</div>
			<p class="mt-3">{{ t( "sections.terms.p2" ) }}</p>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="-k_3\theta \\ -k_4\dot{\theta}"
				/>
			</div>
			<ol>
				<li>{{ t( "sections.terms.items.angle" ) }}</li>
				<li>{{ t( "sections.terms.items.angularVelocity" ) }}</li>
			</ol>
			<p>{{ t( "sections.terms.p3" ) }}</p>
		</div>
	</template>

	<template #interactivePart>
		<IPControl />
	</template>

	<template #footer />
</AppFrame>
</template>

<script setup>
import titleImg from "./IP.webp";
import { computed } from "vue";
import { useI18n } from "@/utils/i18n.mjs";
import IPControl from "./IP_Control.vue";

const { t, tm } = useI18n( "book1.IP" );
const subChapter = computed( () => tm( "subChapter" ) ?? {} );
const symbolRows = computed( () => tm( "symbolRows" ) ?? [] );
const controllerRows = computed( () => tm( "controllerRows" ) ?? [] );
</script>
