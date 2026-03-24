<!-- eslint-disable vue/max-len -->
<template>
<AppFrame
	:languages="[ 'de', 'en' ]"
	:sub-chapter
	:title="t( 'gd.title' )"
	:vue-date="__VITE_SFC_MTIME_MS__"
>
	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="t( 'gd.imageTitle' )">
				<img :alt="t( 'gd.imageAlt' )" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">{{ t( "gd.introDate" ) }}</h3>
		<div class="eddie">
			<p>{{ t( "gd.book.p1" ) }}</p>
			<p>{{ t( "gd.book.p2" ) }}</p>
			<p>{{ t( "gd.book.p3" ) }}</p>
		</div>
	</template>

	<template #descriptionPart>
		<h2 id="diophantos-raetsel">{{ t( "gd.sections.part1.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "gd.sections.part1.p1" ) }}</p>
			<div class="cContainer">
				<blockquote class="storyQuote">
					<div class="plateHeader">
						<div class="plateLead">{{ t( "gd.sections.part1.plateLead" ) }}</div>
						<div class="plateLeadSub">{{ t( "gd.sections.part1.plateLeadSub" ) }}</div>
					</div>
					<div v-html="t( 'gd.sections.part1.epitaph' )" />
				</blockquote>
			</div>
			<p>{{ t( "gd.sections.part1.p2" ) }}</p>
			<ul>
				<li>{{ t( "gd.sections.part1.s1" ) }}</li>
				<li>{{ t( "gd.sections.part1.s2" ) }}</li>
				<li>{{ t( "gd.sections.part1.s3" ) }}</li>
				<li>{{ t( "gd.sections.part1.s4" ) }}</li>
				<li>{{ t( "gd.sections.part1.s5" ) }}</li>
				<li>{{ t( "gd.sections.part1.s6" ) }}</li>
			</ul>
		</div>

		<h2 id="in-formeln" class="mt-8">{{ t( "gd.sections.part2.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "gd.sections.part2.p1" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="\frac16x+\frac1{12}x+\frac17x+5+\frac12x+4=x" />
			</div>
		</div>

		<h2 id="loesen" class="mt-8">{{ t( "gd.sections.part3.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "gd.sections.part3.p1" ) }}</p>
			<div class="kbox">
				<Katex
					as="div"
					display
					tex="\frac16=\frac{14}{84},\quad \frac1{12}=\frac7{84},\quad \frac17=\frac{12}{84},\quad \frac12=\frac{42}{84}"
				/>
			</div>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="\left(\frac{14+7+12+42}{84}\right)x+9 &= x \\ \frac{75}{84}x+9 &= x \\ x-\frac{75}{84}x &= 9 \\ \frac9{84}x &= 9 \\ x &= 9\cdot\frac{84}{9}=84"
				/>
			</div>
			<p><b>{{ t( "gd.sections.part3.p2" ) }}</b></p>
		</div>

		<h2 id="stationen" class="mt-8">{{ t( "gd.sections.part4.title" ) }}</h2>
		<div class="eddie">
			<ul>
				<li>{{ t( "gd.sections.part4.s1" ) }} <Katex tex="\frac16x=14" /></li>
				<li>{{ t( "gd.sections.part4.s2" ) }} <Katex tex="\left(\frac16+\frac1{12}\right)x=14+7=21" /></li>
				<li>{{ t( "gd.sections.part4.s3" ) }} <Katex tex="\left(\frac16+\frac1{12}+\frac17\right)x=14+7+12=33" /></li>
				<li>{{ t( "gd.sections.part4.s4" ) }} <Katex tex="33+5=38" /></li>
				<li>{{ t( "gd.sections.part4.s5" ) }} <Katex tex="\frac12x=42" /> {{ t( "gd.sections.part4.s5b" ) }} <Katex tex="38+42=80" /> {{ t( "gd.sections.part4.s5c" ) }}</li>
				<li>{{ t( "gd.sections.part4.s6" ) }} <Katex tex="80+4=84" /></li>
			</ul>
		</div>

		<h2 id="eddies-rechnung" class="mt-8">{{ t( "gd.sections.part5.title" ) }}</h2>
		<div class="eddie">
			<div class="cContainer">
				<blockquote class="storyQuote">
					<div class="plateHeader">
						<div class="plateLead">{{ t( "gd.sections.part5.plateLead" ) }}</div>
						<div class="plateLeadSub">{{ t( "gd.sections.part5.plateLeadSub" ) }}</div>
					</div>
					<div v-html="t( 'gd.sections.part5.poem' )" />
				</blockquote>
			</div>
			<p>{{ t( "gd.sections.part5.p1" ) }}</p>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="T_{\text{klein}} &= \frac13T \\ T_{\text{schule}} &= \frac49T \\ T_{\text{zahlen}} &= \frac16T \\ T_{\text{Edmilla}} &= \frac23\cdot T_{\text{zahlen}}=\frac23\cdot\frac16T=\frac19T \\ T_{\text{frei}} &= \frac{2}{12}=\frac16\;\text{Jahr}"
				/>
			</div>
			<p>{{ t( "gd.sections.part5.p2" ) }}</p>
			<p>{{ t( "gd.sections.part5.p3" ) }}</p>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="T_{\text{Flucht}} &= T-\left(\frac13T+\frac49T+\frac16T+\frac16\right) \\ \frac13T+\frac49T+\frac16T &= \frac{6}{18}T+\frac{8}{18}T+\frac{3}{18}T=\frac{17}{18}T \\ T_{\text{Flucht}} &= T-\left(\frac{17}{18}T+\frac16\right)=\frac1{18}T-\frac16"
				/>
			</div>
			<p>{{ t( "gd.sections.part5.p4" ) }}</p>
		</div>

		<h2 id="mit-t18" class="mt-8">{{ t( "gd.sections.part6.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "gd.sections.part6.p1" ) }}</p>
			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="T_{\text{Flucht}} &= \frac1{18}\cdot 18-\frac16 \\ &= 1-\frac16=\frac56 \\ &= \frac56\approx 0{,}83\text{ Jahre}=10\text{ Monate}"
				/>
			</div>
			{{ t( "gd.sections.part6.p2" ) }}
		</div>
	</template>

	<template #interactivePart>
		<h2 id="deine-grabplatte">{{ t( "gd.interactive.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "gd.interactive.p1" ) }}</p>
		</div>
		<GDPlate />
	</template>
</AppFrame>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "@/utils/i18n.mjs";
import titleImg from "./GD.webp";
import GDPlate from "./GD_Plate.vue";

const { t } = useI18n( "book1/GD" );

const subChapter = computed( () => Object.fromEntries( [
	[ "einleitung", t( "gd.subChapter.einleitung" ) ],
	[ "diophantos-raetsel", t( "gd.subChapter.diophantosRaetsel" ) ],
	[ "in-formeln", t( "gd.subChapter.inFormeln" ) ],
	[ "loesen", t( "gd.subChapter.loesen" ) ],
	[ "stationen", t( "gd.subChapter.stationen" ) ],
	[ "eddies-rechnung", t( "gd.subChapter.eddiesRechnung" ) ],
	[ "mit-t18", t( "gd.subChapter.mitT18" ) ],
	[ "deine-grabplatte", t( "gd.subChapter.deineGrabplatte" ) ]
] ) );
</script>

<style scoped>
.cContainer {
  width: 100%;
  display: flex;
  justify-content: center; /* horizontal zentrieren */
}
.storyQuote {
	min-width: 30em;
	position: relative;
	overflow: hidden;
    text-align: center;
	max-width: 35em;
	margin: auto 14px;
	padding: 16px 16px 14px;
	border-radius: 16px;
	border: 1px solid rgba(60, 45, 26, 0.5);
	background:
		radial-gradient(120% 100% at 0% 0%, rgba(255, 239, 215, 0.45), transparent 55%),
		linear-gradient(150deg, #7a6651 0%, #ab957d 38%, #725d49 70%, #5d4a3a 100%);
	box-shadow:
		inset 0 1px 0 rgba(255, 248, 235, 0.28),
		inset 0 -18px 22px rgba(35, 24, 14, 0.28),
		0 10px 24px rgba(0, 0, 0, 0.24);
	color: #1f1811;
	font-family: "Cormorant Garamond", "Times New Roman", serif;
	font-size: 1.05rem;
	line-height: 1.35;
}

.storyQuote::before {
	content: "";
	position: absolute;
	inset: 10px;
	border: 1px solid rgba(65, 47, 29, 0.5);
	border-radius: 12px;
	pointer-events: none;
}

.plateHeader {
	position: relative;
	z-index: 1;
	text-align: center;
	margin-bottom: 10px;
}

.plateLead {
	font-size: 1.35rem;
	letter-spacing: 0.04em;
	text-transform: uppercase;
}

.plateLeadSub {
	font-size: 0.95rem;
	letter-spacing: 0.06em;
	opacity: 0.84;
	text-transform: uppercase;
}
</style>
