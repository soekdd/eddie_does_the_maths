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
			<p v-html="t( 'book.p1' )"/>
			<p v-html="t( 'book.p2' )"/>
			<p v-html="t( 'book.p3' )"/>
		</div>
	</template>

	<template #descriptionPart>
		<h2 id="poker">{{ t( "sections.poker.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.poker.p1' )" />
			<p class="mono" v-html="t( 'sections.poker.p2' )" />
		</div>

		<section class="task">
			<figure class="exampleFigure">
				<ImageZoomer no-zoom :title="t( 'sections.task1.imageTitle' )">
					<PGHand
						:cards="[
							{ code: 'Ds', suit: 'Pik', rank: 'Dame' },
							{ code: 'Dh', suit: 'Herz', rank: 'Dame' }
						]"
					/>
				</ImageZoomer>
			</figure>
			<h3 id="wahrscheinlichkeiten">{{ t( "sections.task1.title" ) }}</h3>
			<div class="eddie">
				<p v-html="t( 'sections.task1.p1' )" />
				<p><b>{{ t( "sections.task1.questions" ) }}</b></p>
				<ol>
					<li>{{ t( "sections.task1.q1" ) }}</li>
					<li>{{ t( "sections.task1.q2" ) }}</li>
				</ol>
				<p>
					<b>{{ t( "sections.task1.solution" ) }}</b> {{ t( "sections.task1.solution2" ) }}
					<Katex inline tex="\binom{52-5}{3}=\binom{47}{3}=16{,}215" />
					{{ t( "sections.task1.solution3" ) }}
				</p>
				<div class="kbox">
					<div class="mono">{{ t( "sections.task1.twoPair" ) }}</div>
					<div class="mono">{{ t( "sections.task1.threeKind" ) }}</div>
					<div class="mono">{{ t( "sections.task1.fullHouse" ) }}</div>
					<div class="mono">{{ t( "sections.task1.fourKind" ) }}</div>
					<div class="mono">{{ t( "sections.task1.keepPair" ) }}</div>
				</div>
				<p class="muted"><i>{{ t( "sections.task1.storyHook" ) }}</i></p>
			</div>
		</section>

		<section class="task">
			<figure class="exampleFigure">
				<ImageZoomer no-zoom :title="t( 'sections.task2.imageTitle' )">
					<PGHand
						:cards="[
							{ code: '4c', suit: 'Kreuz', rank: 4 },
							{ code: '4h', suit: 'Herz', rank: 4 },
							{ code: 'Ks', suit: 'Pik', rank: 'König' },
							{ code: 'Kd', suit: 'Karo', rank: 'König' }
						]"
					/>
				</ImageZoomer>
			</figure>
			<h3>{{ t( "sections.task2.title" ) }}</h3>
			<div class="eddie">
				<p v-html="t( 'sections.task2.p1' )" />
				<p><b>{{ t( "sections.task2.p2" ) }}</b></p>
				<div class="kbox">
					<p class="mono" v-html="t( 'sections.task2.p3' )" />
					<Katex as="div" display tex="P(\text{Full House})=\frac{4}{47}\approx 8{,}51\%" />
				</div>
			</div>
		</section>

		<section class="task">
			<figure class="exampleFigure">
				<ImageZoomer no-zoom :title="t( 'sections.task3.imageTitle' )">
					<PGHand
						:cards="[
							{ code: 'Kc', suit: 'Kreuz', rank: '7' },
							{ code: 'Kc', suit: 'Kreuz', rank: '10' },
							{ code: 'Kc', suit: 'Kreuz', rank: 'Dame' },
							{ code: 'Kc', suit: 'Kreuz', rank: 'König' }
						]"
					/>
				</ImageZoomer>
			</figure>
			<h3>{{ t( "sections.task3.title" ) }}</h3>
			<div class="eddie">
				<p v-html="t( 'sections.task3.p1' )" />
				<p><b>{{ t( "sections.task3.p2" ) }}</b></p>
				<div class="kbox">
					<p class="mono" v-html="t( 'sections.task3.p3' )" />
					<Katex as="div" display tex="P(\text{Flush})=\frac{9}{47}\approx 19{,}15\%" />
				</div>
			</div>
		</section>

		<section class="task">
			<figure class="exampleFigure">
				<ImageZoomer no-zoom :title="t( 'sections.task4.imageTitle' )">
					<PGHand
						:cards="[
							{ code: 'Kc', suit: 'Karo', rank: '6' },
							{ code: 'Kc', suit: 'Karo', rank: '7' },
							{ code: 'Kc', suit: 'Karo', rank: '8' },
							{ code: 'Kc', suit: 'Karo', rank: '9' }
						]"
					/>
				</ImageZoomer>
			</figure>

			<h3>{{ t( "sections.task4.title" ) }}</h3>
			<div class="eddie">
				<p v-html="t( 'sections.task4.p1' )" />
				<ul>
					<li>{{ t( "sections.task4.l1" ) }}</li>
					<li>{{ t( "sections.task4.l2" ) }}</li>
				</ul>
				<div class="kbox">
					<p class="mono" v-html="t( 'sections.task4.p2' )" />
					<Katex
						aligned
						as="div"
						display
						tex="P(\text{Straight, open-ended}) &= \frac{8}{47}\approx 17{,}02\% \\ P(\text{Straight, gutshot}) &= \frac{4}{47}\approx 8{,}51\%"
					/>
				</div>
			</div>
		</section>

		<section class="task">
			<figure class="exampleFigure">
				<ImageZoomer :title="t( 'sections.task5.imageTitle' )">
					<img :alt="t( 'sections.task5.imageAlt' )" loading="lazy" :src="eddieImg" />
				</ImageZoomer>
			</figure>
			<h3 id="bayes">{{ t( "sections.task5.title" ) }}</h3>
			<div class="eddie">
				<p v-html="t( 'sections.task5.p1' )"/>
				<ul>
					<li>{{ t( "sections.task5.l1" ) }}</li>
					<li>{{ t( "sections.task5.l2" ) }}</li>
					<li>{{ t( "sections.task5.l3" ) }}</li>
				</ul>
				<p>
					<b>{{ t( "sections.task5.p2" ) }}</b>
					{{ t( "sections.task5.p3" ) }}
					<Katex inline tex="P(\text{Two Pair}\mid \text{zieht 1})" />.
				</p>
				<div class="kbox">
					<Katex
						aligned
						as="div"
						display
						tex="P(\text{Two Pair}) &= \frac{123{.}552}{2{.}598{.}960}\approx 4{,}754\% \\ N(\text{4-Flush}) &= 4\cdot \binom{13}{4}\cdot 39=111{.}540 \\ P(\text{4-Flush}) &= \frac{111{.}540}{2{.}598{.}960}\approx 4{,}292\% \\ P(\text{Two Pair}\mid 1) &\approx 0{,}5255"
					/>
				</div>
				<p class="mono">{{ t( "sections.task5.p4" ) }}</p>
			</div>
		</section>

		<section class="task">
			<h3>{{ t( "sections.task6.title" ) }}</h3>
			<div class="eddie">
				<p v-html="t( 'sections.task6.p1' )" />
				<p v-html="t( 'sections.task6.p2' )" />
				<div class="kbox">
					<Katex as="div" display tex="f\cdot P-(1-f)\cdot B=0\Rightarrow f=\frac{B}{P+B}" />
					<Katex as="div" display tex="P=20,\;B=10\Rightarrow f=\frac{10}{30}=\frac{1}{3}\approx 33{,}3\%" />
				</div>
			</div>
		</section>

		<section class="task">
			<h3 id="ev">{{ t( "sections.task7.title" ) }}</h3>
			<div class="eddie">
				<p v-html="t( 'sections.task7.p1' )"/>
				<ul>
					<li>{{ t( "sections.task7.l1" ) }}</li>
					<li>{{ t( "sections.task7.l2" ) }}</li>
				</ul>
				<p v-html="t( 'sections.task7.p2' )"/>
				<div class="kbox">
					<Katex
						as="div"
						display
						tex="P(\text{Two Pair oder besser})\approx 15{,}985\%+11{,}434\%+1{,}018\%+0{,}278\%=28{,}715\%"
					/>
				</div>
				<ol>
					<li>{{ t( "sections.task7.o1" ) }}</li>
					<li>{{ t( "sections.task7.o2" ) }}</li>
					<li>{{ t( "sections.task7.o3" ) }}</li>
				</ol>
			</div>
		</section>

		<EddieComment class="mt-4" :subtitle="t( 'sections.comment.title' )">
			<p v-html="t( 'sections.comment.p1' )"/>
			<p v-html="t( 'sections.comment.p2' )"/>
			<p class="muted">{{ t( "sections.comment.p3" ) }}</p>
		</EddieComment>
	</template>
	<template #interactivePart>
		<PGGame />
	</template>

	<template #footer>
		<p class="muted">
			<a href="https://github.com/goldfire/pokersolver">{{ t( "footer.link" ) }}</a>
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "@/utils/i18n.mjs";

import titleImg from "./PG.webp";
import eddieImg from "./PG_Eddie.webp";
import PGGame from "./PG_Game.vue";
import PGHand from "./PG_Hand.vue";

const { t, tm } = useI18n( "book1/PG" );
const subChapter = computed( () => tm( "subChapter" ) ?? {} );
</script>

<style scoped>
.task {
	margin-top: 14px;
}

.miniPair {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	margin: 0 4px;
	vertical-align: middle;
}
</style>
