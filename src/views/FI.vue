<template>
<AppFrame
	error
	short="FI"
	:sub-chapter="{
		
	}"
	title="Eddie rechnet: Landkarten Geometrie"
>

	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="`Eddie`">
				<img alt="Eddie rechnet zur Fischpopulation" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
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
