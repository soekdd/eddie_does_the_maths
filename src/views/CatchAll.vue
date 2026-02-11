<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import ContentIndex from "@/components/ContentIndex.vue";

const route = useRoute();
const where = computed( () => route.fullPath || route.path || "" );
</script>

<template>
<AppFrame>
	<template #title>
		<div class="badge">…</div>
		<div>
			<h1>Eddie rechnet: Thema in Arbeit</h1>
			<p class="sub">Dieses Thema ist noch nicht ausgearbeitet</p>
		</div>
	</template>

	<template #descriptionPart>
		<h2>Oh nein – das ist gerade eine echte <strong>404</strong>… sorry! 😅</h2>
		<div class="eddie">
			<p>Der Inhalt, den du suchst, ist noch nicht verfügbar, aber ich bin schon dran und baue ihn gerade zusammen, Schritt für Schritt, wie eine Rechnung, die am Ende aufgeht.</p>
			<p>Komm später nochmal vorbei, okay? Dann wartet hier hoffentlich genau das, was du gesucht hast.</p>
		</div>
	</template>

	<template #interactivePart>
		<h2>Zurück</h2>
		<ContentIndex />
	</template>

	<template #footer>
		<p class="muted">
			Tipp: Wenn du eine URL mit Query-Shortcut nutzt (z.B. <code class="mono">?DG</code>), wird sie auf
			<code class="mono">/#DG</code> umgeschrieben.
		</p>
	</template>
</AppFrame>
</template>
