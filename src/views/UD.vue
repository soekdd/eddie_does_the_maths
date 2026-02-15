<template>
<AppFrame
	short="ST"
	:sub-chapter="{
		'entscheidungsbaum': 'Entscheidungsbaum',
		'wahrscheinlichkeiten': 'Wahrscheinlichkeiten',
		'rechner': 'Rechner'
	}"
	title="Eddie rechnet: Mathezettel #3 Uferaufdickung"
>

	<template #descriptionPart>
		<UD_Graph/>
	</template>

	<template #interactivePart>
		<div id="rechner"></div>

	</template>

	<template #calculationPart>
      
	</template>

	<template #footer>
     
	</template>
</AppFrame>
</template>

<script setup>
import UD_Graph from "./UD_Graph.vue";
</script>
