<!-- i18n-ally-scope: useI18n("book1.AL") -->
<!-- eslint-disable vue/max-len -->
<template>
<AppFrame
	:sub-chapter
	:title="t( 'title' )"
	:vue-date="__VITE_SFC_MTIME_MS__"
>
	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="t( 'al.imageTitle' )">
				<img loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">{{ t( "al.introDate" ) }}</h3>
		<div class="eddie">
			<p v-html="t( 'al.bookPart.p1' )" />
			<p v-html="t( 'al.bookPart.p2' )" />
			<p v-html="t( 'al.bookPart.p3' )" />
		</div>
	</template>

	<template #descriptionPart>
		<h2>{{ t( "al.sections.part1.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'al.sections.part1.p1' )" />
		</div>

		<h2 id="analytical-engine">{{ t( "al.sections.part2.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'al.sections.part2.p1' )" />
			<ul>
				<li>
					<b>{{ t( "al.sections.part2.item1Prefix" ) }}</b>
					{{ t( "al.sections.part2.item1Suffix" ) }}
					<Katex inline tex="V[0]" />.
				</li>
				<li>
					<b>{{ t( "al.sections.part2.item2Prefix" ) }}</b>
					{{ t( "al.sections.part2.item2Suffix" ) }}
				</li>
			</ul>
			<p v-html="t( 'al.sections.part2.cardsLead' )"/>
			<ol>
				<li>{{ t( "al.sections.part2.cards1" ) }}</li>
				<li>{{ t( "al.sections.part2.cards2" ) }}</li>
				<li>
					{{ t( "al.sections.part2.cards3Prefix" ) }}
					<Katex inline tex="V[i]" />
					{{ t( "al.sections.part2.cards3Suffix" ) }}
				</li>
			</ol>
			<p class="muted">{{ t( "al.sections.part2.muted" ) }}</p>
		</div>

		<h2 id="bernoulli-zahlen">{{ t( "al.sections.part3.title" ) }}</h2>
		<div class="eddie">
			<p>
				{{ t( "al.sections.part3.p1Prefix" ) }}
				<Katex inline tex="B_0,B_1,B_2,\dots" /> {{ t( "al.sections.part3.p1Middle" ) }}
				<Katex inline tex="1^p+2^p+\dots+n^p" />.
				{{ t( "al.sections.part3.p1Suffix" ) }}
			</p>

			<p v-html="t( 'al.sections.part3.p2' )"/>

			<div class="kbox">
				<Katex
					as="div"
					display
					tex="\sum_{m=1}^{n} m^p = \frac{1}{p+1}\sum_{k=0}^{p}(-1)^k\binom{p+1}{k}B_k\,n^{p+1-k}"
				/>
			</div>

			<p>
				{{ t( "al.sections.part3.p3Prefix" ) }}
				<Katex inline tex="B_1=-\frac12" />
				{{ t( "al.sections.part3.p3Suffix" ) }}
			</p>

			<div class="kbox">
				<div class="mono"><Katex inline tex="B_0=1,\;B_1=-\frac12,\;B_2=\frac16,\;B_4=-\frac1{30},\;B_6=\frac1{42}" /></div>
				<div class="mono">{{ t( "al.sections.part3.convention" ) }} <Katex inline tex="B_3=B_5=B_7=\dots=0" />.</div>
			</div>

			<p>
				<span v-html="t( 'al.sections.part3.p4Prefix' )" />
				<Katex inline tex="B_1,B_3,B_5" />
				{{ t( "al.sections.part3.p4Middle" ) }}
				<Katex inline tex="B_{2n-1}=-(A_0+A_1B_1+A_3B_3+A_5B_5)" />.
				{{ t( "al.sections.part3.p4Suffix" ) }}
			</p>

			<p>
				{{ t( "al.sections.part3.p5Prefix" ) }}
				<Katex inline tex="n=4" />{{ t( "al.sections.part3.p5Suffix" ) }}
			</p>

			<div class="kbox">
				<Katex
					aligned
					as="div"
					display
					tex="A_0&=-\frac{7}{18},\;A_1=4,\;A_3=14,\;A_5=\frac{28}{3} \\ B_7&=-\Bigl(-\frac{7}{18}+4\!\left(-\frac12\right)+14\!\left(\frac16\right)+\frac{28}{3}\!\left(-\frac1{30}\right)\Bigr)=\frac{11}{30}"
				/>
			</div>
		</div>

		<h2>{{ t( "al.sections.part4.title" ) }}</h2>
		<div class="eddie">
			<h3>{{ t( "al.sections.part4.step0Title" ) }}</h3>
			<p>
				<span v-html="t( 'al.sections.part4.step0' )" />
				<Katex inline tex="V[0]=B_0=1" />.
			</p>

			<h3>{{ t( "al.sections.part4.step1Title" ) }}</h3>
			<p>
				{{ t( "al.sections.part4.step1LeadPrefix" ) }}
				<Katex inline tex="m=1" />
				{{ t( "al.sections.part4.step1LeadSuffix" ) }}
			</p>
			<div class="kbox">
				<Katex aligned
					as="div"
					display
					tex="B_0 + 2B_1 &= 0 \\ B_1 &= -\frac{B_0}{2} = -\frac12"
				/>
			</div>
			<p>
				{{ t( "al.sections.part4.step1Result" ) }}
				<Katex inline tex="V[1]=B_1=-\frac12" />.
			</p>

			<h3>{{ t( "al.sections.part4.step2Title" ) }}</h3>
			<p>
				{{ t( "al.sections.part4.step2LeadPrefix" ) }}
				<Katex inline tex="m=2" />{{ t( "al.sections.part4.step2LeadSuffix" ) }}
			</p>
			<div class="kbox">
				<Katex aligned
					as="div"
					d
					isplay
					tex="B_0 + 3B_1 + 3B_2 &= 0\\3B_2 &= -B_0 - 3B_1\\B_2&=\frac{-B_0-3B_1}{3}=\frac16"
				/>
			</div>
			<p>
				{{ t( "al.sections.part4.step2Result" ) }}
				<Katex inline tex="V[2]=B_2=\frac16" />.
			</p>
		</div>

		<h2>{{ t( "al.sections.part5.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'al.sections.part5.p1' )" />
			<div class="kbox">
				<Katex
					as="div"
					display
					:tex="`\\text{${t( 'al.sections.part5.p2' )}: }\\frac{2n+1}{2n-1}\\qquad\\text{${t( 'al.sections.part5.p3' )}: }\\frac{2n-1}{2n+1}`"
				/>
			</div>
		</div>

		<h2>{{ t( "al.sections.part6.title" ) }}</h2>
		<div class="eddie">
			<p>
				{{ t( "al.sections.part6.p1Prefix" ) }}
				<Katex inline tex="1+2+\dots+n" />
				{{ t( "al.sections.part6.p1Middle" ) }}
				<Katex inline tex="1^2+2^2+\dots+n^2" />{{ t( "al.sections.part6.p1Suffix" ) }}
			</p>
			<p v-html="t( 'al.sections.part6.p2' )"/>
		</div>

		<h2>{{ t( "al.sections.part7.title" ) }}</h2>
		<div class="eddie">
			<ul>
				<li><b>{{ t( "al.sections.part7.item1Prefix" ) }}</b> {{ t( "al.sections.part7.item1Suffix" ) }} <Katex inline tex="V[i]" /></li>
				<li><b>{{ t( "al.sections.part7.item2Prefix" ) }}</b> {{ t( "al.sections.part7.item2Suffix" ) }}</li>
				<li><b>{{ t( "al.sections.part7.item3Prefix" ) }}</b> {{ t( "al.sections.part7.item3Suffix" ) }}</li>
				<li><b>{{ t( "al.sections.part7.item4Prefix" ) }}</b> {{ t( "al.sections.part7.item4Suffix" ) }}</li>
				<li><b>{{ t( "al.sections.part7.item5Prefix" ) }}</b> <Katex inline tex="B_0=1,\;B_1=-\frac12,\;B_2=\frac16" /></li>
			</ul>
		</div>

		<h2 id="gcd" class="mt-2">{{ t( "al.sections.part8.title" ) }}</h2>
		<div class="eddie">
			<p v-html="t( 'al.sections.part8.p1' )"/>
			<div class="kbox">
				<Katex as="div" display :tex="`\\frac{48}{18}=\\frac{8}{3},\\quad \\text{${t( 'al.sections.part8.p2' )} }\\gcd(48,18)=6.`" />
			</div>
		</div>

		<h2>{{ t( "al.sections.part9.title" ) }}</h2>
		<div class="eddie">
			<ol>
				<li>
					{{ t( "al.sections.part9.step1Prefix" ) }}
					<Katex inline tex="a" />
					{{ t( "al.sections.part9.step1Middle" ) }}
					<Katex inline tex="b" />{{ t( "al.sections.part9.step1Suffix" ) }}
				</li>
				<li>
					{{ t( "al.sections.part9.step2Prefix" ) }}
					<Katex inline tex="b\neq 0" />{{ t( "al.sections.part9.step2Suffix" ) }}
					<ul>
						<li>
							{{ t( "al.sections.part9.step2aPrefix" ) }}
							<Katex inline tex="a" />
							{{ t( "al.sections.part9.step2aMiddle" ) }}
							<Katex inline tex="b" />{{ t( "al.sections.part9.step2aSuffix" ) }}
						</li>
						<li>
							{{ t( "al.sections.part9.step2bPrefix" ) }}
							<Katex inline tex="r" />{{ t( "al.sections.part9.step2bSuffix" ) }}
						</li>
						<li>
							{{ t( "al.sections.part9.step2cPrefix" ) }}
							<Katex inline tex="a:=b,\;b:=r" />.
						</li>
					</ul>
				</li>
				<li>
					{{ t( "al.sections.part9.step3Prefix" ) }}
					<Katex inline tex="a=\gcd(a,b)" />{{ t( "al.sections.part9.step3Suffix" ) }}
				</li>
			</ol>
		</div>

		<h2>{{ t( "al.sections.part10.title" ) }}</h2>
		<div class="eddie">
			<h3>{{ t( "al.sections.part10.step1Title" ) }}</h3>
			<p v-html="t( 'al.sections.part10.step1' )" />

			<h3>{{ t( "al.sections.part10.step2Title" ) }}</h3>
			<div class="kbox">
				<Katex as="div" display tex="48 \div 18 \Rightarrow r=12,\; a:=18,\; b:=12" />
			</div>

			<h3>{{ t( "al.sections.part10.step3Title" ) }}</h3>
			<div class="kbox">
				<Katex as="div" display tex="18 \div 12 \Rightarrow r=6,\; a:=12,\; b:=6" />
			</div>

			<h3>{{ t( "al.sections.part10.step4Title" ) }}</h3>
			<div class="kbox">
				<Katex as="div" display tex="12 \div 6 \Rightarrow r=0,\; a:=6,\; b:=0" />
			</div>

			<h3>{{ t( "al.sections.part10.step5Title" ) }}</h3>
			<p>
				{{ t( "al.sections.part10.step5Prefix" ) }}
				<Katex inline tex="b=0" />, {{ t( "al.sections.part10.step5Middle" ) }}
				<Katex inline tex="\gcd(48,18)=6" />.
			</p>
		</div>

		<h2>{{ t( "al.sections.part11.title" ) }}</h2>
		<div class="eddie">
			<ul>
				<li>{{ t( "al.sections.part11.item1" ) }}</li>
				<li>{{ t( "al.sections.part11.item2" ) }}</li>
				<li>{{ t( "al.sections.part11.item3" ) }}</li>
				<li>{{ t( "al.sections.part11.item4" ) }}</li>
			</ul>
		</div>
	</template>

	<template #interactivePart>
		<h3 id="babbage">{{ t( "al.interactiveTitle" ) }}</h3>
		<v-card class="pa-2">
			<v-select
				v-model="selectedProgram"
				density="compact"
				hide-details
				item-title="title"
				item-value="value"
				:items="programOptions"
				:label="t( 'al.programSelect' )"
			/>
		</v-card>
		<ALBernoulli v-if="selectedProgram === 'bernoulli'" />
		<ALReduceFractions v-else-if="selectedProgram === 'reduceFractions'" />
		<ALHorner v-else-if="selectedProgram === 'horner'" />
		<ALSqrt v-else-if="selectedProgram === 'sqrt'" />
		<ALPrimeTest v-else />
	</template>
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "@/utils/i18n.mjs";
import titleImg from "./AL.webp";
import ALBernoulli from "./AL_Bernoulli.vue";
import ALReduceFractions from "./AL_ReduceFractions.vue";
import ALHorner from "./AL_Horner.vue";
import ALSqrt from "./AL_Sqrt.vue";
import ALPrimeTest from "./AL_PrimeTest.vue";

const { t } = useI18n( "book1.AL" );

const selectedProgram = ref( "bernoulli" );

const subChapter = computed( () => ( {
	"analytical-engine": t( "al.subChapter.analytical-engine" ),
	"bernoulli-zahlen":  t( "al.subChapter.bernoulli-zahlen" ),
	gcd:                 t( "al.subChapter.gcd" ),
	babbage:             t( "al.subChapter.babbage" )
} ) );

const programOptions = computed( () => [
	{ title: t( "al.programs.bernoulli" ), value: "bernoulli" },
	{ title: t( "al.programs.reduceFractions" ), value: "reduceFractions" },
	{ title: t( "al.programs.horner" ), value: "horner" },
	{ title: t( "al.programs.sqrt" ), value: "sqrt" },
	{ title: t( "al.programs.primeTest" ), value: "primeTest" }
] );
</script>
