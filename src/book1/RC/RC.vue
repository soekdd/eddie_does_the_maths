<!-- i18n-ally-scope: useI18n("book1.RC") -->
<template>
<AppFrame
	nomd
	:title="t( 'title' )"
	:vue-date="__VITE_SFC_MTIME_MS__"
>
	<template #descriptionPart>
		<RCRubikCube />
	</template>
</AppFrame>
</template>

<script setup>
import { useI18n } from "@/utils/i18n.mjs";
import RCRubikCube from "./RC_RubikCube.vue";

const { t } = useI18n( "book1.RC" );
</script>
