<template>
<AppFrame
	:sub-chapter
	:title="t( 'empty.title' )"
	:vue-date="__VITE_SFC_MTIME_MS__"
>

	<template #descriptionPart>
		<div id="entscheidungsbaum"></div>
		<div id="wahrscheinlichkeiten"></div>
      
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
import { computed } from "vue";
import { useI18n } from "@/i18n.mjs";

const { t, tm } = useI18n( "components/lang" );
const subChapter = computed( () => tm( "empty.subChapter" ) ?? {} );
</script>
