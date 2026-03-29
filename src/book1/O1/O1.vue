<!-- i18n-ally-scope: useI18n("book1.O1") -->
<template>
<AppFrame
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
			<p v-html="t( 'book.p1' )" />
			<p v-html="t( 'book.p2' )" />
			<p v-html="t( 'book.p3' )"/>
			<p v-html="t( 'book.p4' )"/>
		</div>
	</template>

	<template #descriptionPart>
		<div class="eddie">
			<h2>{{ t( "sections.part1.title" ) }}</h2>
			<p v-html="t( 'sections.part1.p1' )" />
			<p v-html="t( 'sections.part1.p2' )" />
			<figure class="exampleFigure">
				<ImageZoomer>
					<O1Graph notitle />
				</ImageZoomer>
			</figure>
			<p v-html="t( 'sections.part1.prove' )"/>
			<div class="kbox">
				<Katex as="div" display tex="\boxed{AD + BC = AB.}" />
			</div>
		</div>

		<h2>{{ t( "sections.part2.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part2.intro' )"/>
			<ul>
				<li v-html="t( 'sections.part2.l1' )" />
				<li v-html="t( 'sections.part2.l2' )" />
				<li v-html="t( 'sections.part2.l3' )" />
			</ul>
			<p v-html="t( 'sections.part2.p1' )" />
			<p class="muted" v-html="t( 'sections.part2.note' )" />
		</div>

		<h2 id="tangenten">{{ t( "sections.part3.title" ) }}</h2>
		<div class="eddie">
			<h3 v-html="t( 'sections.part3.rule1Title' )" />
			<p v-html="t( 'sections.part3.rule1Text' )"/>
			<div class="kbox">
				<Katex as="div" display tex="OL\perp AD,\quad OM\perp CD,\quad ON\perp BC." />
			</div>

			<h3 class="mt-6">{{ t( "sections.part3.rule2Title" ) }}</h3>
			<p v-html="t( 'sections.part3.rule2Text' )"/>
			<ul>
				<li v-html="t( 'sections.part3.rule2Item1' )" />
				<li v-html="t( 'sections.part3.rule2Item2' )" />
			</ul>

			<h3 class="mt-6" v-html="t( 'sections.part3.rule3Title' )" />
			<div class="kbox">
				<Katex as="div" display tex="\angle DAB+\angle DCB=180^\circ,\qquad \angle ABC+\angle ADC=180^\circ." />
			</div>
		</div>

		<h2>{{ t( "sections.part4.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part4.p1' )" />
			<div class="kbox">
				<Katex as="div" display tex="AB=AO+OB." />
			</div>
			<p v-html="t( 'sections.part4.p2' )" />
			<div class="kbox">
				<Katex as="div" display tex="AB=(AL+MC)+(BN+MD)=AL+BN+MC+MD." />
			</div>
			<p v-html="t( 'sections.part4.p3' )"/>
			<div class="kbox">
				<Katex as="div" display tex="MC=CN,\quad MD=DL," />
				<Katex as="div" display tex="AL+DL=AD,\quad BN+CN=BC." />
			</div>
			<p v-html="t( 'sections.part4.p4' )"/>
			<div class="kbox">
				<Katex as="div" display tex="AB=AD+BC." />
			</div>
			<p v-html="t( 'sections.part4.p5' )" />
		</div>

		<h2 id="zyklisch" v-html="t( 'sections.part5.title' )" />
		<div class="eddie">
			<h3 v-html="t( 'sections.part5.s1Title' )" />
			<p v-html="t( 'sections.part5.s1Text' )" />

			<h3 class="mt-6" v-html="t( 'sections.part5.s2Title' )" />
			<p v-html="t( 'sections.part5.s2p1' )" />
			<p v-html="t( 'sections.part5.s2p2' )" />
			<div class="kbox">
				<Katex as="div" display tex="\angle OXA = \angle AOX = \frac{180^\circ-\angle DAB}{2}=90^\circ-\frac{\angle DAB}{2}." />
			</div>
			<p v-html="t( 'sections.part5.s2p3' )" />

			<h3 class="mt-6" v-html="t( 'sections.part5.s3Title' )" />
			<p v-html="t( 'sections.part5.s3p1' )" />
			<div class="kbox">
				<Katex as="div" display tex="\angle OCM=\frac{\angle DCB}{2}" />
			</div>
			<p v-html="t( 'sections.part5.s3p2' )" />
			<p v-html="t( 'sections.part5.s3p3' )"/>
			<div class="kbox">
				<Katex as="div" display tex="\angle DCB = 180^\circ-\angle DAB \Rightarrow \frac{\angle DCB}{2}=90^\circ-\frac{\angle DAB}{2}." />
			</div>
			<p v-html="t( 'sections.part5.s3p4' )" />

			<h3 class="mt-6" v-html="t( 'sections.part5.s4Title' )" />
			<p v-html="t( 'sections.part5.s4p1' )" />
			<ul>
				<li v-html="t( 'sections.part5.s4l1' )" />
				<li v-html="t( 'sections.part5.s4l2' )" />
				<li v-html="t( 'sections.part5.s4l3' )" />
				<li v-html="t( 'sections.part5.s4l4' )" />
			</ul>
			<p v-html="t( 'sections.part5.s4p2' )"/>
			<div class="kbox">
				<Katex as="div" display tex="LX=MC." />
			</div>

			<h3 class="mt-6" v-html="t( 'sections.part5.s5Title' )" />
			<p v-html="t( 'sections.part5.s5p1' )" />
			<div class="kbox">
				<Katex as="div" display tex="AX = AL + LX." />
			</div>
			<p v-html="t( 'sections.part5.s5p2' )" />
			<div class="kbox">
				<Katex as="div" display tex="\boxed{AO = AL + MC.}" />
			</div>
		</div>

		<h2 id="kongruenz" v-html="t( 'sections.part6.title' )" />
		<div class="eddie">
			<h3 v-html="t( 'sections.part6.s1Title' )" />
			<p v-html="t( 'sections.part6.s1Text' )" />

			<h3 class="mt-6" v-html="t( 'sections.part6.s2Title' )" />
			<p v-html="t( 'sections.part6.s2p1' )" />
			<p v-html="t( 'sections.part6.s2p2' )" />
			<div class="kbox">
				<Katex as="div" display tex="\angle OYB = \frac{180^\circ-\angle ABC}{2}=90^\circ-\frac{\angle ABC}{2}." />
			</div>
			<p v-html="t( 'sections.part6.s2p3' )" />

			<h3 class="mt-6" v-html="t( 'sections.part6.s3Title' )" />
			<p v-html="t( 'sections.part6.s3p1' )" />
			<div class="kbox">
				<Katex as="div" display tex="\angle ODM = \frac{\angle ADC}{2}" />
			</div>
			<p v-html="t( 'sections.part6.s3p2' )" />
			<p v-html="t( 'sections.part6.s3p3' )"/>
			<div class="kbox">
				<Katex as="div" display tex="\angle ABC+\angle ADC=180^\circ \Rightarrow \frac{\angle ADC}{2}=90^\circ-\frac{\angle ABC}{2}." />
			</div>
			<p v-html="t( 'sections.part6.s3p4' )"/>
			<div class="kbox">
				<Katex as="div" display tex="\angle ODM = 90^\circ-\frac{\angle ABC}{2} = \angle OYN." />
			</div>

			<h3 class="mt-6" v-html="t( 'sections.part6.s4Title' )" />
			<p v-html="t( 'sections.part6.s4p1' )" />
			<ul>
				<li v-html="t( 'sections.part6.s4l1' )" />
				<li v-html="t( 'sections.part6.s4l2' )" />
				<li v-html="t( 'sections.part6.s4l3' )" />
				<li v-html="t( 'sections.part6.s4l4' )" />
			</ul>
			<p v-html="t( 'sections.part6.s4p2' )"/>
			<div class="kbox">
				<Katex as="div" display tex="NY=MD." />
			</div>
			<p v-html="t( 'sections.part6.s4p3' )" />
			<div class="kbox">
				<Katex as="div" display tex="BY=BN+NY." />
			</div>
			<p v-html="t( 'sections.part6.s4p4' )" />
			<div class="kbox">
				<Katex as="div" display tex="\boxed{OB = BN + MD.}" />
			</div>
		</div>

		<h2>{{ t( "sections.part7.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part7.p1' )"/>
			<div class="kbox">
				<Katex as="div" display tex="AB=AO+OB=(AL+MC)+(BN+MD)." />
			</div>
			<p v-html="t( 'sections.part7.p2' )"/>
			<div class="kbox">
				<Katex as="div" display tex="MC=CN,\quad MD=DL," />
				<Katex as="div" display tex="AB = AL + CN + BN + DL = (AL+DL) + (BN+CN) = AD + BC." />
				<Katex as="div" display tex="\boxed{AD+BC=AB.}" />
			</div>
		</div>

		<EddieComment :subtitle="t( 'sections.part7.commentTitle' )">
			<ol>
				<li v-for="(item, idx) in commentItems" :key="`comment-${idx}`" v-html="item" />
			</ol>
		</EddieComment>
	</template>

	<template #interactivePart>
		<h2>{{ t( "sections.interactiveTitle" ) }}</h2>
		<div class="eddie">
			<p class="muted" v-html="t( 'sections.interactiveHint' )" />
		</div>
		<div class="toolbar">
			<v-btn class="btn mt-3" @click="regenerateGraph">{{ t( "sections.randomButton" ) }}</v-btn>
			<div v-if="graphState?.ready" class="kbox px-5 mx-5">
				<div class="mono"><b>AB</b> = {{ fmt( graphState.lenAB ) }}</div>
				<div class="mono"><b>AD</b> = {{ fmt( graphState.lenAD ) }}</div>
				<div class="mono"><b>BC</b> = {{ fmt( graphState.lenBC ) }}</div>
				<div class="mono"><b>AD + BC</b> = {{ fmt( graphState.lenAD + graphState.lenBC ) }}</div>
			</div>
		</div>
		<ImageZoomer :title="t( 'sections.graphZoomTitle' )">
			<O1Graph ref="graphRef" />
		</ImageZoomer>
	</template>

	<template #footer>
		<p class="muted">
			{{ t( "footer" ) }}
			<a href="https://prase.cz/kalva/imo/isoln/isoln851.html">{{ t( "footerLink" ) }}</a>
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "@/utils/i18n.mjs";

import O1Graph from "./O1_Graph.vue";
import titleImg from "./O1.webp";

const { t, tm } = useI18n( "book1.O1" );

const graphRef = ref( null );
const graphState = computed( () => graphRef.value?.state ?? null );
const subChapter = computed( () => tm( "subChapter" ) ?? {} );
const commentItems = computed( () => tm( "sections.part7.commentItems" ) ?? [] );

function regenerateGraph() {
	graphRef.value?.regenerate?.();
}

function fmt( n, digits = 3 ) {
	if ( !Number.isFinite( n ) ) {
		return "–";
	}

	return n.toFixed( digits );
}
</script>

<style scoped>
.toolbar {
	align-items: flex-start;
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	margin-bottom: 10px;
}

.numbers {
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
	font-size: 13px;
	line-height: 1.35;
}
</style>
