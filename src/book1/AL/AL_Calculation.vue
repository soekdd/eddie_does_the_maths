<!-- i18n-ally-scope: useI18n("book1.AL") -->
<template>
<v-container class="py-6" fluid>
	<v-row>
		<v-col cols="12" md="5">
			<v-card class="pa-4" rounded="xl">
				<v-card-title class="text-h6">{{ title }}</v-card-title>
				<v-card-subtitle>{{ subtitle }}</v-card-subtitle>

				<v-divider class="my-4" />

				<v-row dense>
					<v-col cols="12">
						<v-alert class="mb-2"
							density="compact"
							type="info"
							variant="tonal"
						>
							<slot name="intro" />
						</v-alert>
					</v-col>

					<slot name="inputs" />

					<v-col v-if="$slots.warning" cols="12">
						<v-alert density="compact" type="warning" variant="tonal">
							<slot name="warning" />
						</v-alert>
					</v-col>

					<v-col class="d-flex ga-2" cols="12">
						<v-btn color="primary"
							:loading="running"
							rounded="xl"
							@click="$emit('run')"
						>
							{{ t( "calculation.actions.run" ) }}
						</v-btn>
						<v-btn rounded="xl" variant="tonal" @click="$emit('reset')">
							{{ t( "calculation.actions.reset" ) }}
						</v-btn>
					</v-col>
				</v-row>
			</v-card>

			<v-card class="pa-4 mt-4" rounded="xl">
				<v-card-title class="text-h6">{{ formulaTitle }}</v-card-title>
				<v-card-text>
					<Katex as="div" :display="true" :tex="formulaTex" />
					<div v-if="$slots.formulaNote" class="text-body-2 mt-3">
						<slot name="formulaNote" />
					</div>
				</v-card-text>
			</v-card>
		</v-col>

		<v-col cols="12" md="7">
			<v-card class="pa-4" rounded="xl">
				<v-card-title class="text-h6">{{ resultTitle }}</v-card-title>

				<v-divider class="my-4" />

				<div v-if="error" class="mb-3">
					<v-alert density="comfortable" type="error" variant="tonal">
						{{ error }}
					</v-alert>
				</div>

				<slot name="result" />

				<v-divider class="my-4" />

				<v-tabs v-model="tabProxy" color="primary">
					<v-tab value="deck">{{ t( "calculation.tabs.deck" ) }}</v-tab>
					<v-tab value="trace">{{ t( "calculation.tabs.trace" ) }}</v-tab>
					<v-tab value="store">{{ t( "calculation.tabs.store" ) }}</v-tab>
				</v-tabs>

				<v-window v-model="tabProxy" class="mt-3">
					<v-window-item value="deck">
						<v-table density="compact">
							<thead>
								<tr>
									<th style="width: 70px;">{{ t( "calculation.columns.index" ) }}</th>
									<th style="width: 90px;">{{ deckLineTitle }}</th>
									<th>{{ t( "calculation.columns.label" ) }}</th>
									<th style="width: 110px;">{{ t( "calculation.columns.op" ) }}</th>
									<th style="width: 150px;">{{ t( "calculation.columns.target" ) }}</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(card, index) in deck" :key="index">
									<td>{{ index + 1 }}</td>
									<td><code>L{{ card.line }}</code></td>
									<td>{{ card.label || "" }}</td>
									<td><code>{{ card.op }}</code></td>
									<td><code>{{ formatDest(card.dest) }}</code></td>
								</tr>
							</tbody>
						</v-table>
					</v-window-item>

					<v-window-item value="trace">
						<v-textarea
							auto-grow
							:label="t( 'calculation.traceLabel' )"
							:model-value="traceText"
							readonly
							rows="16"
						/>
					</v-window-item>

					<v-window-item value="store">
						<slot name="store" />
					</v-window-item>
				</v-window>
			</v-card>
		</v-col>
	</v-row>
</v-container>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "@/utils/i18n.mjs";

const { t } = useI18n( "book1.AL" );

const props = defineProps( {
	title:         { type: String, required: true },
	subtitle:      { type: String, required: true },
	formulaTitle:  { type: String, required: true },
	formulaTex:    { type: String, required: true },
	resultTitle:   { type: String, default: "" },
	deckLineTitle: { type: String, default: "Line" },
	running:       { type: Boolean, default: false },
	error:         { type: String, default: "" },
	deck:          { type: Array, default: () => [] },
	traceText:     { type: String, default: "" },
	tab:           { type: String, default: "deck" }
} );

const emit = defineEmits( [
	"run",
	"reset",
	"update:tab"
] );

const tabProxy = computed( {
	get: () => props.tab,
	set: ( value ) => {
		emit( "update:tab", value );
	}
} );

const resultTitle = computed( () => props.resultTitle || t( "calculation.resultTitle" ) );

function formatDest( dest ) {
	if ( Array.isArray( dest ) ) {
		return dest.map( ( value ) => `V${value}` ).join( ", " );
	}

	return `V${dest}`;
}
</script>
