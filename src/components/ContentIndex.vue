<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps( { title: { type: String, default: "Die aktuell ausgearbeiteten Inhalte sind:" } } );

const router = useRouter();

const items = computed( () => {
	const routes = router.getRoutes();

	return routes
		.filter( ( r ) => r?.meta?.index === true && typeof r.meta?.title === "string" && r.meta.title.trim() )
		.map( ( r ) => ( {
			key:   String( r.name ?? r.path ),
			title: String( r.meta.title ),
			to:    r.name ? { name: r.name } : r.path,
			order: Number.isFinite( r?.meta?.order ) ? Number( r.meta.order ) : null,
			path:  r.path,
			wip:   r?.meta?.wip === true
		} ) )
		.sort( ( a, b ) => {
			if ( a.order !== null && b.order !== null ) {
				return a.order - b.order;
			}

			if ( a.order !== null ) {
				return -1;
			}

			if ( b.order !== null ) {
				return 1;
			}

			return a.title.localeCompare( b.title, "de" );
		} );
} );
</script>

<template>
<div class="contentIndex">
	<p class="muted mb-2">{{ title }}</p>

	<div v-if="items.length" class="contentIndexList">
		<v-btn
			v-for="it in items"
			:key="it.key"
			color="primary"
			:disabled="it.wip"
			:to="it.wip ? undefined : it.to"
			variant="flat"
		>
			{{ it.title }} <!-- {{ it.wip ? "(in Arbeit)" : "" }} -->
		</v-btn>
	</div>

	<p v-else class="muted">Noch keine Inhalte registriert.</p>
</div>
</template>

<style scoped>
.contentIndexList {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
