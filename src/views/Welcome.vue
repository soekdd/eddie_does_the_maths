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
				Hey, ich bin Eddie, und wenn du mein Buch kennst, weißt du: Meine Flucht aus der DDR ist kein
				Zufall, sondern ein Plan aus Papier, Mut und Mathe.
			</p>
			<p>
				In meinem Kopf werden Karten zu Geometrie, Angst zu Wahrscheinlichkeiten und „unmöglich“ zu
				einer Gleichung, die ich knacken kann.
			</p>
			<p>
				Genau darum gibt’s <strong>Eddie rechnet</strong>: damit du siehst, wie Mathe im echten Leben
				plötzlich über Freiheit, Richtung und die nächsten Schritte entscheidet.
			</p>
			<p>
				In den einzelnen Kapiteln werden all die Situationen meiner Flucht aufgegriffen, in denen ich mich
				mit Mathe irgendwie gerettet habe. Im Buch hätte das gestört, aber hier habe ich den Raum, meine
				Gedanken und Rechnungen zu vertiefen. Damit du mir nicht nur beim Denken zusehen musst, gibt es am Ende jedes
				Kapitels einen interaktiven Teil, in dem du die Rechnung selbst ausprobieren kannst. Steinalte
				Computer werden wieder zum Leben erweckt, und noch ältere Segelschiffe werden sinken.
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
