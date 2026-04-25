<!-- i18n-ally-scope: useI18n("book1.RD") -->
<template>
<AppFrame
	:sub-chapter
	:title="t( 'title' )"
	:vue-date="__VITE_SFC_MTIME_MS__"
>
	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer is-ai :title="t( 'imageTitle' )">
				<img :alt="t( 'imageAlt' )" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">{{ t( "introDate" ) }}</h3>
		<div class="eddie">
			<p v-html="t( 'book.p1' )"/>
			<p v-html="t( 'book.p2' )"/>
			<p v-html="t( 'book.p3' )"/>
		</div>
	</template>

	<template #descriptionPart>
		<h2 id="problemstellung">{{ t( "sections.part1.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part1.p1' )" />
			<p v-html="t( 'sections.part1.p2' )" />
			<p v-html="t( 'sections.part1.p3' )" />
		</div>

		<h2 id="unbegrenzter-vorrat" class="mt-8">{{ t( "sections.part2.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part2.p1' )"/>
			<p v-html="t( 'sections.part2.p2' )"/>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="N_k&=3^k\quad(C=3,\;c=1) \\ D_{k+1}&\ge D_k+v=D_k+20\,\text{km}"
				/>
			</div>
			<p class="muted">{{ t( "sections.part2.p3" ) }}</p>
		</div>

		<h2 id="endlicher-vorrat" class="mt-8">{{ t( "sections.part3.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part3.p1' )"/>
			<p v-html="t( 'sections.part3.p2' )"/>

			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="\Delta x_j^{\leftrightarrow}&=\frac{vC}{2cj},&
D_n^{\leftrightarrow}&=\frac{vC}{2c}\sum_{j=1}^{n}\frac{1}{j} \\
\Delta x_j^{\rightarrow}&=\frac{vC}{c(2j-1)},&
D_n^{\rightarrow}&=\frac{vC}{c}\sum_{j=1}^{n}\frac{1}{2j-1}"
				/>
			</div>

			<p v-html="t( 'sections.part3.p3' )"/>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="D_2^{\leftrightarrow}&=30\left(1+\frac12\right)=45\,\text{km} \\
D_5^{\leftrightarrow}&=30\left(1+\frac12+\frac13+\frac14+\frac15\right)=68{,}5\,\text{km}"
				/>
			</div>
			<p v-html="t( 'sections.part3.p4' )"/>
		</div>

		<h2 id="ein-depot-bilanz" class="mt-8">{{ t( "sections.part4.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part4.p1' )"/>
			<p v-html="t( 'sections.part4.p2' )"/>
			<p v-html="t( 'sections.part4.p3' )"/>

			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="S&=kd+C-c\frac{x}{v} \\
d+2c\frac{x}{v}&\le C \\
D_{\text{zurueck zum Depot}}&=x+\frac{v}{2c}S \\
D_{\text{zurueck zum Start}}&=x+\frac{v}{2c}\left(S-c\frac{x}{v}\right)=x+\frac{v}{2c}\left(kd+C-2c\frac{x}{v}\right) \\
D_{\text{einweg}}&=x+\frac{v}{c}S"
				/>
			</div>
			<p v-html="t( 'sections.part4.p4' )"/>
			<p class="muted">{{ t( "sections.part4.p5" ) }}</p>
		</div>
	</template>

	<template #summaryPart>
		<h2>{{ t( "sections.summary.title" ) }}</h2>
		<p class="muted">{{ t( "sections.summary.p1" ) }}</p>
		<RDGraph />
	</template>
</AppFrame>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "@/utils/i18n.mjs";
import titleImg from "./RD.webp";
import RDGraph from "./RD_Graph.vue";

const { t, tm } = useI18n( "book1.RD" );

const subChapter = computed( () => tm( "subChapter" ) ?? {} );
</script>
