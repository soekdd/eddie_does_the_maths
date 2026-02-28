<template>
<v-alert
	id="eddieComment"
	border="start"
	class="eddieComment"
	color="success"
	:icon="false"
	type="success"
	variant="tonal"
>
	<template #prepend>
		<img
			alt=""
			aria-hidden="true"
			class="eddieCommentIcon"
			:src="faviconPng"
		/>
	</template>

	<div class="eddieCommentHeader">
		<strong>Eddie:</strong>
		<span v-if="subtitle" class="eddieCommentSubtitle">{{ subtitle }}</span>
	</div>
	<div class="eddieCommentBody eddie">
		<slot />
	</div>
</v-alert>
</template>

<script setup>
import faviconPng from "@/images/favicon.png";

defineProps( {
	subtitle: {
		type:    String,
		default: ""
	}
} );
</script>

<style scoped>
.eddieCommentHeader {
	align-items: baseline;
	display: flex;
	font-weight: 700;
	gap: 0.35rem;
	margin-bottom: 0.35rem;
}

.eddieCommentSubtitle {
	font-weight: 500;
}

.eddieComment :deep(.v-alert__prepend) {
	align-self: center;
	overflow: visible;
}

.eddieCommentIcon {
	box-sizing: border-box;
	border-radius: 4px;
	display: block;
	height: 24px;
	object-fit: contain;
	object-position: center;
	padding: 1.5px;
	width: 24px;
}
</style>
