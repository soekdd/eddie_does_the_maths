<template>
<AppFrame
	:languages="[ 'de', 'en' ]"
	:sub-chapter
	:title="t( 'fi.title' )"
	:vue-date="__VITE_SFC_MTIME_MS__"
>

	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="t( 'fi.imageTitle' )">
				<img loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">{{ t( "fi.introDate" ) }}</h3>
		<div class="eddie">
			<p v-html="t( 'fi.book.p1' )" />
			<p v-html="t( 'fi.book.p2' )" />
			<p v-html="t( 'fi.book.p3' )" />
			<p>{{ t( "fi.book.p4" ) }}</p>
			<p v-html="t( 'fi.book.p5' )" />
			<p>{{ t( "fi.book.p6" ) }}</p>
		</div>
	</template>

	<template #descriptionPart>
		<h2 id="beschreibung">{{ t( "fi.sections.title" ) }}</h2>
		<div class="eddie d-flex flex-column ga-6">
			<section>
				<figure class="exampleFigure">
					<ImageZoomer no-zoom :title="t( 'fi.sections.step1Figure' )">
						<FINetwork
							v-model="selectedMap"
							:grid="false"
							label="name"
							:label-size="20"
							transform="none"
						/>
					</ImageZoomer>
				</figure>
				<h3>{{ t( "fi.sections.step11" ) }}</h3>
				<p>{{ t( "fi.sections.p11" ) }}</p>
				<ul>
					<li v-html="t( 'fi.sections.s111' )" />
					<li v-html="t( 'fi.sections.s112' )" />
					<li v-html="t( 'fi.sections.s113' )" />
				</ul>
			</section>

			<section>
				<figure class="exampleFigure">
					<ImageZoomer no-zoom :title="t( 'fi.sections.step2Figure' )">
						<FINetwork
							v-model="selectedMap"
							:grid="false"
							label="abbr"
							:label-size="30"
							transform="none"
						/>
					</ImageZoomer>
				</figure>
				<h3>{{ t( "fi.sections.step12" ) }}</h3>
				<p>{{ t( "fi.sections.p12" ) }}</p>
				<p>{{ t( "fi.sections.p13" ) }}</p>
			</section>

			<section>
				<figure class="exampleFigure">
					<ImageZoomer no-zoom :title="t( 'fi.sections.step3Figure' )">
						<FINetwork
							v-model="selectedMap"
							:grid="true"
							label="abbr"
							:label-size="30"
							transform="expScaled"
						/>
					</ImageZoomer>
				</figure>
				<h3>{{ t( "fi.sections.step13" ) }}</h3>
				<p>{{ t( "fi.sections.p14" ) }}</p>
				<p v-html="t( 'fi.sections.p15' )" />
				<p>{{ t( "fi.sections.p16" ) }}</p>
				<div class="kbox mb-3">
					<Katex
						as="div"
						display
						tex="z = x + i y,\quad w = f(z)"
					/>
					<Katex
						as="div"
						display
						tex="f'(z_0)\neq 0 \;\Rightarrow\; f(z_0+\Delta z)\approx f(z_0)+f'(z_0)\,\Delta z"
					/>
					<Katex
						as="div"
						display
						tex="\arg(\Delta w)\approx \arg\!\left(f'(z_0)\right)+\arg(\Delta z)"
					/>
					<Katex
						as="div"
						display
						tex="z_k=\operatorname{norm}(\mathrm{lat}_k,\mathrm{lon}_k),\quad w_k=f(z_k),\quad p_k=\operatorname{svg}(w_k)"
					/>
					<Katex
						as="div"
						display
						tex="\text{Beispiel:}\quad f(z)=\exp(0.85\,z)"
					/>
				</div>
			</section>
			<section>
				<figure class="exampleFigure">
					<ImageZoomer no-zoom :title="t( 'fi.sections.step4Figure' )">
						<FINetwork
							v-model="selectedMap"
							distraction
							:grid="true"
							label="abbr"
							:label-size="30"
							transform="expScaled"
						/>
					</ImageZoomer>
				</figure>
				<h3>{{ t( "fi.sections.step14" ) }}</h3>
				<p>{{ t( "fi.sections.p17" ) }}</p>
				<EddieComment :subtitle="t( 'fi.sections.commentTitle' )">
					<p>
						{{ t( "fi.sections.comment1" ) }}
					</p>
					<p>
						{{ t( "fi.sections.comment2" ) }}
					</p>
				</EddieComment>
			</section>
		</div>
	</template>

	<template #interactivePart>

	</template>

	<template #summaryPart>
		<section>
			<h3>{{ t( "fi.summary.title1" ) }}</h3>
			<div class="wrap">
				<FINetwork
					v-model="selectedMap"
					interactive-mode
					:label-size="30"
				/>
			</div>
		</section>
		<section>
			<h3>{{ t( "fi.summary.title2" ) }}</h3>
			<FIMap/>
		</section>
	</template>

	<template #footer>
     
	</template>
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "@/utils/i18n.mjs";
import titleImg from "./FI.webp";
import FINetwork from "./FI_Network.vue";
import FIMap from "./FI_Map.vue";

const { t } = useI18n( "book1/FI" );

const subChapter = computed( () => ( {
	einleitung:   t( "fi.subChapter.einleitung" ),
	beschreibung: t( "fi.subChapter.beschreibung" ),
	ausprobieren: t( "fi.subChapter.ausprobieren" ),
	karten:       t( "fi.subChapter.karten" )
} ) );

const selectedMap = ref( "FI" );
</script>

<style scoped>
.wrap {
  --fi-surface: rgb(var(--v-theme-surface, 255, 255, 255));
  --fi-on-surface: rgb(var(--v-theme-on-surface, 17, 17, 17));
  --fi-outline: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.16);
  --fi-outline-strong: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.26);
  --fi-muted: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.75);
  --fi-primary: rgb(var(--v-theme-primary, 25, 118, 210));
  --fi-on-primary: rgb(var(--v-theme-on-primary, 255, 255, 255));
  --fi-panel: rgba(var(--v-theme-surface, 255, 255, 255), 0.86);
  --fi-canvas: rgba(var(--v-theme-surface, 255, 255, 255), 0.97);

  display: grid;
  gap: 12px;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  color: var(--fi-on-surface);
}
</style>
