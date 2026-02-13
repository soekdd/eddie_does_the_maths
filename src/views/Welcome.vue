<script setup>
import ContentIndex from "@/components/ContentIndex.vue";
import ImageZoomer from "@/components/ImageZoomer.vue";
import welcomeImg from "@/images/welcome.webp";
</script>

<template>
<AppFrame>
	<template #title>
		<div class="badge">ER</div>
		<div>
			<h1>Eddie rechnet</h1>
			<p class="sub">Willkommen • Übersicht</p>
		</div>
	</template>

	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer title="Titelbild: Eddie rechnet">
				<img alt="Eddie rechnet" loading="lazy" :src="welcomeImg" />
			</ImageZoomer>
		</figure>
		<h2>Willkommen</h2>
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
		<h2>Index</h2>
		<ContentIndex />
	</template>
</AppFrame>
</template>
