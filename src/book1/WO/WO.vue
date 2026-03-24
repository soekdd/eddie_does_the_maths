<!-- eslint-disable vue/max-len -->
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
			<p>{{ t( "book.p1" ) }}</p>
			<p>{{ t( "book.p2" ) }}</p>
			<p>{{ t( "book.p3" ) }}</p>
		</div>
	</template>

	<template #descriptionPart>
		<h2>{{ t( "sections.part1.title" ) }}</h2>

		<h2 id="setting-geometrie" class="mt-8">{{ t( "sections.part2.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "sections.part2.p1" ) }}</p>
			<ul>
				<li>{{ t( "sections.part2.l1Before" ) }} <Katex inline tex="L = 70\,\text{m}" /></li>
				<li>{{ t( "sections.part2.l2Before" ) }} <Katex inline tex="W = 30\,\text{m}" /></li>
			</ul>
			<p>{{ t( "sections.part2.p2" ) }}</p>
			<p>{{ t( "sections.part2.p3Before" ) }} <Katex inline tex="A=(0,0)" />.</p>
			<p>{{ t( "sections.part2.p4" ) }}</p>
			<p>{{ t( "sections.part2.p5Before" ) }} <Katex inline tex="B=\left(\frac{L}{2},W\right)" />.</p>
			<p>{{ t( "sections.part2.p6" ) }}</p>
			<p>
				{{ t( "sections.part2.p7Before" ) }}
				<Katex inline tex="y=0" />
				{{ t( "sections.part2.p7Middle" ) }}
				<Katex inline tex="P=(x,0)\;\text{mit}\;0\le x\le \frac{L}{2}" />
				{{ t( "sections.part2.p7After" ) }}
				<Katex inline tex="B" />.
			</p>
		</div>

		<h2 id="risiko-modell" class="mt-8">{{ t( "sections.part3.title" ) }}</h2>
		<div class="eddie">
			<ul>
				<li>{{ t( "sections.part3.l1" ) }}</li>
				<li>{{ t( "sections.part3.l2" ) }}</li>
			</ul>
			<p>
				{{ t( "sections.part3.p1Before" ) }}<br>
				<Katex inline tex="a=\text{Risiko/m im Schatten}" /> {{ t( "sections.part3.p1Middle" ) }}<br>
				<Katex inline tex="b=\text{Risiko/m bei Querung}" />,<br>
				{{ t( "sections.part3.p1After" ) }} <Katex inline tex="a=1,\;b=3" />.
			</p>
			<p>
				{{ t( "sections.part3.p2Before" ) }}
				<Katex inline tex="L + W + \frac{L}{2}=\frac{3}{2}L+W" />,
				{{ t( "sections.part3.p2Middle" ) }}
				<Katex inline tex="\frac{3}{2}\cdot 70 + 30 = 135\,\text{m}" />.
			</p>
		</div>

		<h2 id="aufgabe" class="mt-8">{{ t( "sections.part4.title" ) }}</h2>
		<div class="eddie">
			<p>
				{{ t( "sections.part4.p1Before" ) }}
				<Katex inline tex="x" />,
				{{ t( "sections.part4.p1After" ) }}
			</p>
		</div>

		<h2 id="loesung" class="mt-8">{{ t( "sections.part5.title" ) }}</h2>
		<div class="eddie">
			<h3>{{ t( "sections.part5.s1" ) }}</h3>
			<p>{{ t( "sections.part5.s1p1Before" ) }} <Katex inline tex="L,W,a,b" />.</p>
			<p>{{ t( "sections.part5.s1p2Before" ) }} <Katex inline tex="x" /></p>
			<p>
				{{ t( "sections.part5.s1p3Before" ) }}
				<Katex inline tex="P=(x,0)" />
				{{ t( "sections.part5.s1p3Middle" ) }}
				<Katex inline tex="B=\left(\frac{L}{2},W\right)" />:
			</p>
			<div class="kbox">
				<Katex as="div" display tex="PB=\sqrt{\left(\frac{L}{2}-x\right)^2+W^2}" />
			</div>
			<p>{{ t( "sections.part5.s1p4" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="R(x)=a\,x+b\sqrt{\left(\frac{L}{2}-x\right)^2+W^2}" />
			</div>

			<h3>{{ t( "sections.part5.s2" ) }}</h3>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="R'(x) &= a+b\cdot\frac{x-\frac{L}{2}}{\sqrt{\left(\frac{L}{2}-x\right)^2+W^2}} \\ R'(x) &= 0 \\ a &= b\cdot\frac{\frac{L}{2}-x}{\sqrt{\left(\frac{L}{2}-x\right)^2+W^2}}"
				/>
			</div>
			<p>{{ t( "sections.part5.s2p1Before" ) }} <Katex inline tex="u=\frac{L}{2}-x" /> ({{ t( "sections.part5.s2p1Middle" ) }} <Katex inline tex="u\ge 0" />):</p>
			<div class="kbox">
				<Katex as="div" display tex="a=b\cdot\frac{u}{\sqrt{u^2+W^2}}" />
			</div>

			<h3>{{ t( "sections.part5.s3" ) }}</h3>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="a^2(u^2+W^2) &= b^2u^2 \\ a^2W^2 &= (b^2-a^2)u^2 \\ u^2 &= \frac{a^2W^2}{b^2-a^2}"
				/>
			</div>
			<p>{{ t( "sections.part5.s3p1Before" ) }} <Katex inline tex="x" />:</p>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="\left(\frac{L}{2}-x\right)^2 &= \frac{a^2W^2}{b^2-a^2} \\ x^2-Lx+\left(\frac{L^2}{4}-\frac{a^2W^2}{b^2-a^2}\right) &= 0 \\ x^* &= \frac{L}{2}-\frac{aW}{\sqrt{b^2-a^2}} \\ \text{mit }r=\frac{b}{a}: \quad x^* &= \frac{L}{2}-\frac{W}{\sqrt{r^2-1}}"
				/>
			</div>

			<h3>{{ t( "sections.part5.s4" ) }}</h3>
			<p>{{ t( "sections.part5.s4p1Before" ) }} <Katex inline tex="L=70,\;W=30,\;a=1,\;b=3\;(r=3)" />:</p>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="x^* &= \frac{L}{2}-\frac{W}{\sqrt{r^2-1}}=35-\frac{30}{\sqrt{9-1}}=35-\frac{15\sqrt2}{2}\approx 24{,}39\,\text{m} \\ u^* &= \frac{L}{2}-x^*=35-\left(35-\frac{15\sqrt2}{2}\right)=\frac{15\sqrt2}{2}\approx 10{,}61\,\text{m} \\ PB^* &= \sqrt{\frac{225}{2}+900}=\sqrt{\frac{2025}{2}}=\frac{45\sqrt2}{2}\approx 31{,}82\,\text{m}"
				/>
			</div>

			<h3 id="interpretation">{{ t( "sections.part5.s5" ) }}</h3>
			<p>
				{{ t( "sections.part5.s5p1Before" ) }}
				<Katex inline tex="24{,}39\,\text{m}" />
				{{ t( "sections.part5.s5p1After" ) }}
			</p>
			<p>{{ t( "sections.part5.s5p2" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="u^*=\frac{15\sqrt2}{2}\approx 10{,}61\,\text{m}" />
			</div>
			<p>{{ t( "sections.part5.s5p3" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="PB^*=\frac{45\sqrt2}{2}\approx 31{,}82\,\text{m}" />
			</div>
			<p>{{ t( "sections.part5.s5p4" ) }}</p>
		</div>
	</template>

	<template #interactivePart>
		<h2 id="interaction">{{ t( "interactive.title" ) }}</h2>
		<WOGraph />
	</template>
</AppFrame>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "@/utils/i18n.mjs";
import titleImg from "./WO.webp";
import WOGraph from "./WO_Graph.vue";

const { t, tm } = useI18n( "book1/WO" );
const subChapter = computed( () => tm( "subChapter" ) ?? {} );
</script>
