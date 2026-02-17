<template>
<AppFrame
	:sub-chapter="{
		
	}"
	title="Eddie rechnet: Laplace-Transformation"
>

	<template #descriptionPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="`Eddie`">
				<img alt="Eddie und Zahra lösen Differentialgleichungen" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<div style="height:22em">&nbsp;</div>
	</template>

	<template #interactivePart>

	</template>

	<template #summaryPart>
		<LT_Transform/>
	</template>

	<template #footer>
     
	</template>
</AppFrame>
</template>

<script setup>
import titleImg from "@/images/LT.webp";
import LT_Transform from "./LT_Transform.vue";
</script>
