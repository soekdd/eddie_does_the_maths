<template>
<AppFrame
	:sub-chapter="{
		'willkommen': 'Willkommen',
		'ubersicht': 'Übersicht'
	}"
	title="Eddie rechnet"
>

	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer title="Eddie">
				<img loading="lazy" :src="welcomeImg" />
			</ImageZoomer>
		</figure>
		<h2 id="willkommen">Willkommen</h2>
		<div class="eddie">
			<p>
				Hey, ich bin Eddie und wenn du mein Buch kennst, weißt du: Meine Flucht aus der DDR ist kein
				Zufall, sondern ein Plan aus Papier, Mut und Mathe.
			</p>
			<p>
				In meinem Kopf werden Karten zu Geometrie, Angst zu Wahrscheinlichkeiten und „unmöglich“ zu
				einer Gleichung, die ich knacken kann.
			</p>
			<p>
				Genau darum gibt’s <strong>Eddie rechnet</strong>: damit du siehst, wie Mathe im echten Leben
				plötzlich über Freiheit, Richtung und nächste Schritte entscheidet.
			</p>
			<p>Und nun viel Spaß....</p>

			<div class="exampleClear"></div>
		</div>
	</template>

	<template #interactivePart>
		<h2 id="ubersicht">Index</h2>
		<ContentIndex />
	</template>
</AppFrame>
</template>

<script setup>
import ContentIndex from "@/components/ContentIndex.vue";
import welcomeImg from "@/images/welcome.webp";
</script>
