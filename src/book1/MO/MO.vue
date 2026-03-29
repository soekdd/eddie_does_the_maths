<!-- i18n-ally-scope: useI18n("book1.MO") -->
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
		<h3 id="einleitung">{{ t( "introDate1" ) }}</h3>
		<div class="eddie">
			<p v-html="t( 'book.day1p1' )"/><p v-html="t( 'book.day1p2' )"/><p v-html="t( 'book.day1p3' )"/>
		</div>
		<h3>{{ t( "introDate2" ) }}</h3>
		<div class="eddie">
			<p v-html="t( 'book.day2p1' )"/><p v-html="t( 'book.day2p2' )"/><p v-html="t( 'book.day2p3' )"/>
		</div>
	</template>

	<template #descriptionPart>
		<h2>{{ t( "sections.title" ) }}</h2>
		<p class="meta">
			{{ t( "sections.meta" ) }}
			<a href="https://prase.cz/kalva/imo/imo85.html" rel="noreferrer" target="_blank">
				prase.cz/kalva/imo/imo85.html
			</a>
		</p>

		<section class="problem">
			<div class="problem-head">
				<h3 id="a1">{{ t( "tasks.a1.heading" ) }}</h3>
				<RouterLink class="task-link" to="/O1">{{ t( "tasks.a1.link" ) }}</RouterLink>
			</div>
			<p v-html="t( 'tasks.a1.p1' )"/>
		</section>

		<section class="problem">
			<div class="problem-head">
				<h3 id="a2">{{ t( "tasks.a2.heading" ) }}</h3>
				<RouterLink class="task-link" to="/O2">{{ t( "tasks.a2.link" ) }}</RouterLink>
			</div>
			<p v-html="t( 'tasks.a2.p1' )"/>
			<ul>
				<li>{{ t( "tasks.a2.l1" ) }}</li>
				<li>{{ t( "tasks.a2.l2" ) }}</li>
			</ul>
			<p v-html="t( 'tasks.a2.p2' )"/>
		</section>

		<section class="problem">
			<div class="problem-head">
				<h3 id="a3">{{ t( "tasks.a3.heading" ) }}</h3>
				<RouterLink class="task-link" to="/O3">{{ t( "tasks.a3.link" ) }}</RouterLink>
			</div>
			<p v-html="t( 'tasks.a3.p1' )"/>
			<p v-html="t( 'tasks.a3.p2' )"/>
			<Katex
				tex="o\!\bigl(Q_{i_1}+Q_{i_2}+\dots+Q_{i_n}\bigr)\;\ge\;o\!\bigl(Q_{i_1}\bigr)."
			/>
		</section>

		<section class="problem">
			<div class="problem-head">
				<h3 id="b1">{{ t( "tasks.b1.heading" ) }}</h3>
				<RouterLink class="task-link" to="/O4">{{ t( "tasks.b1.link" ) }}</RouterLink>
			</div>
			<p v-html="t( 'tasks.b1.p1' )"/>
			<p v-html="t( 'tasks.b1.p2' )"/>
		</section>

		<section class="problem">
			<div class="problem-head">
				<h3 id="b2">{{ t( "tasks.b2.heading" ) }}</h3>
				<RouterLink class="task-link" to="/O5">{{ t( "tasks.b2.link" ) }}</RouterLink>
			</div>
			<p v-html="t( 'tasks.b2.p1' )"/>
			<p v-html="t( 'tasks.b2.p2' )"/>
		</section>

		<section class="problem">
			<div class="problem-head">
				<h3 id="b3">{{ t( "tasks.b3.heading" ) }}</h3>
				<RouterLink class="task-link" to="/O6">{{ t( "tasks.b3.link" ) }}</RouterLink>
			</div>
			<p v-html="t( 'tasks.b3.p1' )"/>
			<Katex tex="x_{n+1}=x_n\left(x_n+\frac{1}{n}\right)\quad (n=1,2,3,\dots)." />
			<p v-html="t( 'tasks.b3.p2' )"/>
		</section>
	</template>

	<template #footer>
		<p class="muted">
			{{ t( "footer" ) }}
		</p>
	</template>
</AppFrame>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "@/utils/i18n.mjs";
import titleImg from "./MO.webp";

const { t } = useI18n( "book1.MO" );

const subChapter = computed( () => Object.fromEntries( [
	[ "a1", "A1" ],
	[ "a2", "A2" ],
	[ "a3", "A3" ],
	[ "b1", "B1" ],
	[ "b2", "B2" ],
	[ "b3", "B3" ]
] ) );
</script>

<style scoped>
.wrap {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px 56px;
  line-height: 1.6;
}

.meta {
  margin: 8px 0 18px;
  opacity: 0.85;
}

.meta a {
  text-decoration: none;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.35);
}

.problem {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 14px;
  padding: 14px 14px 10px;
  margin: 14px 0;
}

.problem h3 {
  margin: 0 0 8px;
}

.problem-head {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.task-link {
  background: rgb(var(--v-theme-primary));
  border-radius: 999px;
  color: rgb(var(--v-theme-on-primary));
  font-size: 0.88rem;
  padding: 6px 12px;
  text-decoration: none;
  white-space: nowrap;
}

.task-link:hover {
  background: rgba(var(--v-theme-primary), 0.86);
}

.problem ul {
  margin: 8px 0 8px 18px;
}

.katex-block {
  margin: 10px 0;
  overflow-x: auto;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
