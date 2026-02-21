<template>
<AppFrame
	:sub-chapter="{
		
	}"
	title="Eddie rechnet: Landkarten Geometrie"
>

	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer title="Eddie">
				<img loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">Lorem ipsum dolor sit amet,</h3>
		<div class="eddie">
			<p>consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
			</p><p>consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
			</p>
		</div>
	</template>

	<template #descriptionPart>
		<div style="height:20em">&nbsp;</div>
	</template>

	<template #interactivePart>

	</template>

	<template #summaryPart>
		<FI_Map/>
	</template>

	<template #footer>
     
	</template>
</AppFrame>
</template>

<script setup>
import titleImg from "@/images/FI.webp";
import FI_Map from "./FI_Map.vue";
</script>
