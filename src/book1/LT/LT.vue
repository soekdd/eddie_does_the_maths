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
			<p v-html="t( 'book.p1' )" />
			<p v-html="t( 'book.p2' )" />
			<p v-html="t( 'book.p3' )" />
			<p v-html="t( 'book.p4' )" />
			<p v-html="t( 'book.p5' )" />
			<p v-html="t( 'book.p6' )" />
			<p v-html="t( 'book.p7' )" />
			<p v-html="t( 'book.p8' )" />
			<p v-html="t( 'book.p9' )" />
			<p v-html="t( 'book.p10' )" />
			<p v-html="t( 'book.p11' )" />
			<p v-html="t( 'book.p12' )" />
			<p v-html="t( 'book.p13' )" />
			<p v-html="t( 'book.p14' )" />
			<p v-html="t( 'book.p15' )" />
		</div>
	</template>

	<template #descriptionPart>
		<h2>{{ t( "sections.part1.title" ) }}</h2>

		<h2 id="warum-laplace" class="mt-8">{{ t( "sections.part2.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'sections.part2.p1' )" />

			<ul>
				<li>{{ t( "sections.part2.s1" ) }}</li>
				<li>{{ t( "sections.part2.s2" ) }}</li>
				<li>{{ t( "sections.part2.s3" ) }}</li>
				<li>{{ t( "sections.part2.s4" ) }}</li>
			</ul>

			<p>{{ t( "sections.part2.p2" ) }}</p>
			<ol>
				<li>{{ t( "sections.part2.o1" ) }}</li>
				<li>{{ t( "sections.part2.o2" ) }}</li>
				<li>{{ t( "sections.part2.o3" ) }}</li>
				<li>{{ t( "sections.part2.o4" ) }}</li>
			</ol>

			<p>{{ t( "sections.part2.p3" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="\mathcal{L}\{f'(t)\} = sF(s) - f(0)" />
			</div>

			<p v-html="t( 'sections.part2.p4' )" />

			<h3>{{ t( "sections.part2.h1" ) }}</h3>
			<ul>
				<li>{{ t( "sections.part2.m1" ) }}</li>
				<li>{{ t( "sections.part2.m2" ) }}</li>
				<li>{{ t( "sections.part2.m3" ) }}</li>
				<li>{{ t( "sections.part2.m4" ) }}</li>
				<li>{{ t( "sections.part2.m5" ) }}</li>
			</ul>

			<h3>{{ t( "sections.part2.h2" ) }}</h3>
			<p>{{ t( "sections.part2.p5" ) }}</p>
			<ul>
				<li>{{ t( "sections.part2.g1" ) }}</li>
				<li>{{ t( "sections.part2.g2" ) }}</li>
				<li>{{ t( "sections.part2.g3" ) }}</li>
			</ul>

			<p>{{ t( "sections.part2.p6" ) }}</p>
			<ul>
				<li>{{ t( "sections.part2.w1" ) }}</li>
				<li>{{ t( "sections.part2.w2" ) }}</li>
				<li>{{ t( "sections.part2.w3" ) }}</li>
				<li>{{ t( "sections.part2.w4" ) }}</li>
			</ul>

			<p>{{ t( "sections.part2.p7" ) }}</p>
		</div>

		<h2 id="vorgehen" class="mt-8">{{ t( "sections.part3.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "sections.part3.p1" ) }}</p>
			<ol>
				<li>
					<b>{{ t( "sections.part3.s1Title" ) }}</b><br>
					{{ t( "sections.part3.s1" ) }}
				</li>
				<li>
					<b>{{ t( "sections.part3.s2Title" ) }}</b><br>
					{{ t( "sections.part3.s2" ) }}
				</li>
				<li>
					<b>{{ t( "sections.part3.s3Title" ) }}</b><br>
					{{ t( "sections.part3.s3" ) }}
				</li>
				<li>
					<b>{{ t( "sections.part3.s4Title" ) }}</b><br>
					{{ t( "sections.part3.s4" ) }}
				</li>
			</ol>
		</div>

		<h2 id="beispielrechnung" class="mt-8">{{ t( "sections.part4.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "sections.part4.p1" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="y'(t) + 2y(t) = 4" />
			</div>
			<p>{{ t( "sections.part4.p2" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="y(0) = 1" />
			</div>

			<div class="exampleSplit">
				<section class="methodCard">
					<h3>{{ t( "sections.part4.left.title" ) }}</h3>

					<h4>{{ t( "sections.part4.left.h1" ) }}</h4>
					<div class="kbox">
						<Katex
							aligned
							as="div"
							display
							tex="y'_h + 2y_h &= 0 \\ y_h &= Ce^{-2t}"
						/>
					</div>

					<h4>{{ t( "sections.part4.left.h2" ) }}</h4>
					<p>{{ t( "sections.part4.left.p1" ) }}</p>
					<div class="kbox">
						<Katex
							aligned
							as="div"
							display
							tex="y_p &= A \\ 2A &= 4 \\ A &= 2"
						/>
					</div>

					<h4>{{ t( "sections.part4.left.h3" ) }}</h4>
					<div class="kbox">
						<Katex
							aligned
							as="div"
							display
							tex="y(t) &= Ce^{-2t} + 2 \\ 1 &= C + 2 \\ C &= -1"
						/>
					</div>

					<h4>{{ t( "sections.part4.left.h4" ) }}</h4>
					<div class="kbox">
						<Katex as="div" display tex="\boxed{y(t) = 2 - e^{-2t}}" />
					</div>
				</section>

				<section class="methodCard">
					<h3>{{ t( "sections.part4.right.title" ) }}</h3>

					<p>{{ t( "sections.part4.right.p1" ) }}</p>
					<div class="kbox">
						<Katex as="div" display tex="y' + 2y = 4" />
					</div>

					<p>{{ t( "sections.part4.right.p2" ) }}</p>
					<div class="kbox">
						<Katex
							aligned
							as="div"
							display
							tex="sY(s) - y(0) + 2Y(s) &= \frac{4}{s} \\ sY(s) - 1 + 2Y(s) &= \frac{4}{s} \\ (s+2)Y(s) &= \frac{4}{s} + 1 \\ Y(s) &= \frac{4}{s(s+2)} + \frac{1}{s+2}"
						/>
					</div>

					<h4>{{ t( "sections.part4.right.h1" ) }}</h4>
					<div class="kbox">
						<Katex
							aligned
							as="div"
							display
							tex="\frac{4}{s(s+2)} &= \frac{2}{s} - \frac{2}{s+2} \\ Y(s) &= \frac{2}{s} - \frac{1}{s+2}"
						/>
					</div>

					<h4>{{ t( "sections.part4.right.h2" ) }}</h4>
					<div class="kbox">
						<Katex as="div" display tex="\boxed{y(t) = 2 - e^{-2t}}" />
					</div>
				</section>
			</div>
		</div>

		<h2 id="fazit" class="mt-8">{{ t( "sections.part5.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "sections.part5.p1" ) }}</p>

			<div class="tableWrap">
				<table class="compareTable">
					<thead>
						<tr>
							<th>{{ t( "sections.part5.table.h1" ) }}</th>
							<th>{{ t( "sections.part5.table.h2" ) }}</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{{ t( "sections.part5.table.r1c1" ) }}</td>
							<td>{{ t( "sections.part5.table.r1c2" ) }}</td>
						</tr>
						<tr>
							<td>{{ t( "sections.part5.table.r2c1" ) }}</td>
							<td>{{ t( "sections.part5.table.r2c2" ) }}</td>
						</tr>
						<tr>
							<td>{{ t( "sections.part5.table.r3c1" ) }}</td>
							<td>{{ t( "sections.part5.table.r3c2" ) }}</td>
						</tr>
						<tr>
							<td>{{ t( "sections.part5.table.r4c1" ) }}</td>
							<td>{{ t( "sections.part5.table.r4c2" ) }}</td>
						</tr>
					</tbody>
				</table>
			</div>

			<p v-html="t( 'sections.part5.p2' )" />
			<p v-html="t( 'sections.part5.p3' )" />
			<p>{{ t( "sections.part5.p4" ) }}</p>
		</div>
	</template>

	<template #interactivePart>

	</template>

	<template #summaryPart>
		<LTTransform id="interactivePart"/>
	</template>

	<template #footer>
		<p class="muted">
			<a href="http://www-fourier.ujf-grenoble.fr/~parisse/giac.html">{{ t( "footer" ) }}</a>
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "@/utils/i18n.mjs";
import titleImg from "./LT.webp";
import LTTransform from "./LT_Transform.vue";

const { t } = useI18n( "book1/LT" );

const subChapter = computed( () => Object.fromEntries( [
	[ "einleitung", t( "subChapter.einleitung" ) ],
	[ "warum-laplace", t( "subChapter.warumLaplace" ) ],
	[ "vorgehen", t( "subChapter.vorgehen" ) ],
	[ "beispielrechnung", t( "subChapter.beispielrechnung" ) ],
	[ "fazit", t( "subChapter.fazit" ) ],
	[ "interactivePart", t( "subChapter.interactivePart" ) ]
] ) );
</script>

<style scoped>
.storyQuote {
	border-left: 4px solid rgba(var(--v-theme-primary, 25, 118, 210), 0.9);
	background: rgba(var(--v-theme-primary, 25, 118, 210), 0.08);
	border-radius: 10px;
	padding: 10px 12px;
	margin: 0 0 14px;
}

.storyQuote p {
	margin: 0.3em 0;
}

.exampleSplit {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 12px;
	align-items: start;
}

.methodCard {
	background: rgba(var(--v-theme-surface, 255, 255, 255), 0.88);
	border: 1px solid rgba(var(--v-theme-on-surface, 17, 17, 17), 0.18);
	border-radius: 12px;
	padding: 12px;
}

.methodCard h3 {
	margin-top: 0;
}

.tableWrap {
	overflow-x: auto;
}

.compareTable {
	width: 100%;
	border-collapse: collapse;
	margin: 8px 0 12px;
}

.compareTable th,
.compareTable td {
	border: 1px solid rgba(var(--v-theme-on-surface, 17, 17, 17), 0.16);
	padding: 8px 10px;
	text-align: left;
}

.compareTable th {
	background: rgba(var(--v-theme-primary, 25, 118, 210), 0.12);
}

@media (max-width: 960px) {
	.exampleSplit {
		grid-template-columns: 1fr;
	}
}
</style>
