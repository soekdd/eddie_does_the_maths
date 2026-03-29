<!-- i18n-ally-scope: useI18n("book1.NV") -->
<template>
<v-card class="pa-4" rounded="xl">
	<h3 class="text-h6 mb-2">{{ t( "bayes.title" ) }}</h3>
	<p class="text-body-2 mb-4">{{ t( "bayes.intro" ) }}</p>

	<v-row dense>
		<v-col cols="12" md="7">
			<v-sheet class="pa-3 rounded-lg" variant="tonal">
				<div class="text-subtitle-2 mb-2">{{ t( "bayes.sections.hypotheses" ) }}</div>
				<v-table density="compact">
					<thead>
						<tr>
							<th>{{ t( "bayes.table.hypothesis" ) }}</th>
							<th>{{ t( "bayes.table.prior" ) }}</th>
							<th>{{ t( "bayes.table.likelihood" ) }}</th>
							<th>{{ t( "bayes.table.posterior" ) }}</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="h in hypotheses" :key="h.id">
							<td><code>{{ h.id }}</code></td>
							<td style="min-width: 120px;">
								<v-text-field
									v-model.number="h.prior"
									density="compact"
									hide-details
									min="0"
									step="0.01"
									type="number"
								/>
							</td>
							<td style="min-width: 120px;">
								<v-text-field
									v-model.number="h.likelihood"
									density="compact"
									hide-details
									min="0"
									step="0.01"
									type="number"
								/>
							</td>
							<td class="mono">{{ fmtPercent( posteriorById[ h.id ] ) }}</td>
						</tr>
					</tbody>
				</v-table>

				<div class="d-flex flex-wrap ga-2 mt-2">
					<v-chip
						v-for="h in hypotheses"
						:key="`chip-${h.id}`"
						color="primary"
						size="small"
						variant="tonal"
					>
						{{ h.id }}: {{ fmtPercent( posteriorById[ h.id ] ) }}
					</v-chip>
				</div>
			</v-sheet>
		</v-col>

		<v-col cols="12" md="5">
			<v-sheet class="pa-3 rounded-lg" variant="tonal">
				<div class="text-subtitle-2 mb-2">{{ t( "bayes.sections.fusion" ) }}</div>
				<v-table density="compact">
					<thead>
						<tr>
							<th>{{ t( "bayes.table.measurement" ) }}</th>
							<th>{{ t( "bayes.table.value" ) }}</th>
							<th>{{ t( "bayes.table.sigma" ) }}</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="m in measurements" :key="m.id">
							<td><code>{{ m.id }}</code></td>
							<td style="min-width: 110px;">
								<v-text-field
									v-model.number="m.value"
									density="compact"
									hide-details
									step="0.1"
									type="number"
								/>
							</td>
							<td style="min-width: 110px;">
								<v-text-field
									v-model.number="m.sigma"
									density="compact"
									hide-details
									min="0.1"
									step="0.1"
									type="number"
								/>
							</td>
						</tr>
					</tbody>
				</v-table>

				<div class="mono mt-2">{{ t( "bayes.labels.xHat" ) }} = {{ fmt( fusedMean, 3 ) }}</div>
				<div class="mono">{{ t( "bayes.labels.sigmaHat" ) }} = {{ fmt( fusedSigma, 3 ) }}</div>
			</v-sheet>
		</v-col>
	</v-row>

	<div class="kbox mt-3">
		<Katex as="div" display tex="P(H_i\mid E)=\frac{P(E\mid H_i)\,P(H_i)}{\sum_j P(E\mid H_j)\,P(H_j)}" />
		<Katex as="div" display tex="\hat{x}=\frac{\sum_i w_i x_i}{\sum_i w_i},\quad w_i=\frac{1}{\sigma_i^2}" />
		<Katex as="div" display :tex="texFusion" />
	</div>

	<v-row class="mt-2" dense>
		<v-col cols="12" md="6">
			<v-alert :type="bayesStatus.type" variant="tonal">
				{{ bayesStatus.message }}
			</v-alert>
		</v-col>
		<v-col cols="12" md="6">
			<v-alert :type="fusionStatus.type" variant="tonal">
				{{ fusionStatus.message }}
			</v-alert>
		</v-col>
	</v-row>

	<div class="d-flex flex-wrap ga-2 mt-2">
		<v-btn color="primary" variant="flat" @click="applyScenario('ambiguous')">
			{{ t( "bayes.labels.ambiguous" ) }}
		</v-btn>
		<v-btn variant="tonal" @click="applyScenario('clear')">
			{{ t( "bayes.labels.clear" ) }}
		</v-btn>
		<v-btn variant="text" @click="resetAll">
			{{ t( "bayes.labels.reset" ) }}
		</v-btn>
	</div>
</v-card>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "@/utils/i18n.mjs";

const { t } = useI18n( "book1.NV" );

const hypotheses = ref( [
	{
		id: "H1", prior: 0.5, likelihood: 0.45
	},
	{
		id: "H2", prior: 0.3, likelihood: 0.8
	},
	{
		id: "H3", prior: 0.2, likelihood: 0.35
	}
] );

const measurements = ref( [
	{
		id: "M1", value: 12.4, sigma: 1.2
	},
	{
		id: "M2", value: 11.1, sigma: 2.1
	},
	{
		id: "M3", value: 13.0, sigma: 1.6
	}
] );

function safeNumber( value, fallback = 0 ) {
	const n = Number( value );
	return Number.isFinite( n ) ? n : fallback;
}

function clamp01( value ) {
	return Math.max( 0, Math.min( 1, safeNumber( value, 0 ) ) );
}

function fmt( n, digits = 2 ) {
	if ( !Number.isFinite( n ) ) {
		return "n/a";
	}

	return Number( n.toFixed( digits ) ).toString();
}

function fmtPercent( n ) {
	if ( !Number.isFinite( n ) ) {
		return "n/a";
	}

	return `${( n * 100 ).toFixed( 1 )}%`;
}

const normalizedPrior = computed( () => {
	const raw = hypotheses.value.map( ( h ) => Math.max( 0, safeNumber( h.prior, 0 ) ) );
	const sum = raw.reduce( ( a, b ) => a + b, 0 );

	if ( sum <= 1e-9 ) {
		return raw.map( () => 1 / raw.length );
	}

	return raw.map( ( x ) => x / sum );
} );

const posteriorValues = computed( () => {
	const numerators = hypotheses.value.map( ( h, idx ) => normalizedPrior.value[ idx ] * clamp01( h.likelihood ) );
	const z = numerators.reduce( ( a, b ) => a + b, 0 );

	if ( z <= 1e-12 ) {
		return numerators.map( () => 0 );
	}

	return numerators.map( ( n ) => n / z );
} );

const posteriorById = computed( () => {
	const out = {};

	hypotheses.value.forEach( ( h, idx ) => {
		out[ h.id ] = posteriorValues.value[ idx ];
	} );

	return out;
} );

const winner = computed( () => {
	let bestIdx = 0;

	for ( let i = 1; i < posteriorValues.value.length; i++ ) {
		if ( posteriorValues.value[ i ] > posteriorValues.value[ bestIdx ] ) {
			bestIdx = i;
		}
	}

	return {
		id:    hypotheses.value[ bestIdx ]?.id ?? "n/a",
		value: posteriorValues.value[ bestIdx ] ?? NaN
	};
} );

const fused = computed( () => {
	const rows = measurements.value.map( ( m ) => {
		const sigma = Math.max( 0.1, safeNumber( m.sigma, 1 ) );
		const w = 1 / ( sigma * sigma );

		return {
			value: safeNumber( m.value, 0 ),
			sigma,
			w
		};
	} );
	const sumW = rows.reduce( ( s, r ) => s + r.w, 0 );

	if ( sumW <= 1e-12 ) {
		return {
			mean:  NaN,
			sigma: NaN,
			sumW
		};
	}

	const mean = rows.reduce( ( s, r ) => s + r.w * r.value, 0 ) / sumW;
	const sigma = 1 / Math.sqrt( sumW );

	return {
		mean,
		sigma,
		sumW
	};
} );

const fusedMean = computed( () => fused.value.mean );
const fusedSigma = computed( () => fused.value.sigma );

const texFusion = computed( () => {
	return String.raw`\hat{x}\approx ${fmt( fusedMean.value, 3 )},\quad ` +
		String.raw`\sigma_{\hat{x}}\approx ${fmt( fusedSigma.value, 3 )}`;
} );

const bayesStatus = computed( () => {
	if ( !Number.isFinite( winner.value.value ) ) {
		return {
			type:    "error",
			message: t( "bayes.status.posteriorInvalid" )
		};
	}

	if ( winner.value.value > 0.75 ) {
		return {
			type:    "success",
			message: t( "bayes.status.dominant", {
				id:    winner.value.id,
				value: fmtPercent( winner.value.value )
			} )
		};
	}

	if ( winner.value.value > 0.5 ) {
		return {
			type:    "info",
			message: t( "bayes.status.leading", { id: winner.value.id } )
		};
	}

	return {
		type:    "warning",
		message: t( "bayes.status.unclear" )
	};
} );

const fusionStatus = computed( () => {
	if ( !Number.isFinite( fusedSigma.value ) ) {
		return {
			type:    "error",
			message: t( "bayes.status.fusionInvalid" )
		};
	}

	if ( fusedSigma.value < 0.9 ) {
		return {
			type:    "success",
			message: t( "bayes.status.fusionGood" )
		};
	}

	if ( fusedSigma.value < 1.6 ) {
		return {
			type:    "info",
			message: t( "bayes.status.fusionMedium" )
		};
	}

	return {
		type:    "warning",
		message: t( "bayes.status.fusionPoor" )
	};
} );

function applyScenario( mode ) {
	if ( mode === "clear" ) {
		hypotheses.value = [
			{
				id: "H1", prior: 0.45, likelihood: 0.2
			},
			{
				id: "H2", prior: 0.35, likelihood: 0.92
			},
			{
				id: "H3", prior: 0.2, likelihood: 0.15
			}
		];
		return;
	}

	hypotheses.value = [
		{
			id: "H1", prior: 0.4, likelihood: 0.55
		},
		{
			id: "H2", prior: 0.35, likelihood: 0.6
		},
		{
			id: "H3", prior: 0.25, likelihood: 0.5
		}
	];
}

function resetAll() {
	hypotheses.value = [
		{
			id: "H1", prior: 0.5, likelihood: 0.45
		},
		{
			id: "H2", prior: 0.3, likelihood: 0.8
		},
		{
			id: "H3", prior: 0.2, likelihood: 0.35
		}
	];

	measurements.value = [
		{
			id: "M1", value: 12.4, sigma: 1.2
		},
		{
			id: "M2", value: 11.1, sigma: 2.1
		},
		{
			id: "M3", value: 13.0, sigma: 1.6
		}
	];
}
</script>
