<template>
<AppFrame
	:languages="[ 'de', 'en' ]"
	:sub-chapter
	:title="t( 'title' )"
	:vue-date="__VITE_SFC_MTIME_MS__"
>
	<template #bookPart>
		<figure class="exampleFigure">
			<ImageZoomer :title="t( 'imageTitle' )">
				<img :alt="t( 'imageAlt' )" loading="lazy" :src="titleImg" />
			</ImageZoomer>
		</figure>
		<h3 id="einleitung">{{ t( "introDate" ) }}</h3>
		<div class="eddie">
			<p>{{ t( "book.p1" ) }}</p>
			<p>{{ t( "book.p2" ) }}</p>
			<p>{{ t( "book.p3" ) }}</p>
		</div>
	</template>
	<template #descriptionPart>
		<h2 id="bits-zu-basen" class="mt-8">{{ t( "sections.part1.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "sections.part1.p1" ) }}</p>
			<p>{{ t( "sections.part1.p2" ) }}</p>
			<p>{{ t( "sections.part1.p3" ) }}</p>
			<div class="kbox">
				<div v-for="row in baseEncodingRows" :key="row.bits" class="mono">
					{{ row.bits }} = {{ row.base }}
				</div>
			</div>
			<figure class="exampleFigure">
				<ImageZoomer :title="t( 'samiImageTitle' )">
					<img :alt="t( 'samiImageAlt' )" loading="lazy" :src="samiImg" />
				</ImageZoomer>
			</figure>
			<p class="muted">
				{{ t( "sections.part1.note" ) }}
			</p>
		</div>

		<h2 id="codons" class="mt-8">{{ t( "sections.part2.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "sections.part2.p1" ) }}</p>
			<div class="kbox">
				<Katex as="div" display tex="3\ \text{Basen} = 3\cdot 2\ \text{Bits} = 6\ \text{Bits}" />
			</div>
			<p>{{ t( "sections.part2.p2" ) }}</p>
		</div>

		<h2 class="mt-8">{{ t( "sections.part3.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "sections.part3.p1" ) }}</p>
			<p>{{ t( "sections.part3.p2" ) }}</p>
		</div>

		<h2 id="vergleich" class="mt-8">{{ t( "sections.part4.title" ) }}</h2>
		<div class="tableScroller mt-3">
			<v-table density="compact">
				<thead>
					<tr>
						<th>{{ t( "comparison.headers.cs" ) }}</th>
						<th>{{ t( "comparison.headers.genetics" ) }}</th>
						<th>{{ t( "comparison.headers.note" ) }}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in comparisonRows" :key="row.cs">
						<td><b>{{ row.cs }}</b></td>
						<td><b>{{ row.genetics }}</b></td>
						<td>{{ row.note }}</td>
					</tr>
				</tbody>
			</v-table>
		</div>

		<h2 id="frameshift" class="mt-8">{{ t( "sections.part5.title" ) }}</h2>
		<div class="eddie">
			<p>{{ t( "sections.part5.p1" ) }}</p>
			<p>{{ t( "sections.part5.p2" ) }}</p>
			<p>{{ t( "sections.part5.p3" ) }}</p>
		</div>

		<EddieComment id="warum" :subtitle="t( 'comment.title' )">
			<p>{{ t( "comment.p1" ) }}</p>
			<p>{{ t( "comment.p2" ) }}</p>
			<p>{{ t( "comment.p3" ) }}</p>
		</EddieComment>
	</template>

	<template #interactivePart>
		<h2 id="gift-code">{{ t( "gift.title" ) }}</h2>
		<div class="eddie d-flex flex-column ga-3">
			<p>{{ t( "gift.p1" ) }}</p>

			<v-text-field
				v-model="giftInput"
				hide-details="auto"
				:label="t( 'gift.inputLabel' )"
				variant="outlined"
			/>

			<v-alert v-if="blockedLetters.length" type="warning" variant="tonal">
				{{ t( "gift.blocked", { letters: blockedLettersText } ) }}
			</v-alert>

			<v-alert v-else-if="!hasLetters" type="info" variant="tonal">
				{{ t( "gift.empty" ) }}
			</v-alert>

			<v-alert v-else type="success" variant="tonal">
				{{ successMessage }}
			</v-alert>

			<div v-if="canEncode" class="kbox">
				<div class="mono">{{ t( "gift.dnaCodons" ) }}: {{ dnaCodonsSpaced }}</div>
				<div class="mono">{{ t( "gift.dnaCompact" ) }}: {{ dnaCompact }}</div>
			</div>
			<div v-if="canEncode" class="kbox">
				<div class="mono">{{ t( "gift.aminoShort" ) }}: {{ aminoShortSequence }}</div>
				<div>{{ t( "gift.aminoLong" ) }}: {{ aminoLongSequence }}</div>
			</div>

			<div v-if="canEncode" class="tableScroller">
				<v-table density="compact">
					<thead>
						<tr>
							<th>#</th>
							<th>{{ t( "gift.table.letter" ) }}</th>
							<th>{{ t( "gift.table.short" ) }}</th>
							<th>{{ t( "gift.table.long" ) }}</th>
							<th class="mono">{{ t( "gift.table.codon" ) }}</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(row, index) in encodedRows" :key="`${row.letter}-${index}`">
							<td class="mono">{{ index + 1 }}</td>
							<td><b>{{ row.letter }}</b></td>
							<td class="mono">{{ row.short }}</td>
							<td>{{ row.name }}</td>
							<td class="mono">{{ row.codon }}</td>
						</tr>
					</tbody>
				</v-table>
			</div>
		</div>
	</template>
	<template #calculationPart>
		<ImageZoomer :title="t( 'gift.imageTitle' )">
			<SDDNA v-if="canEncode" :dna="dnaCompact" />
		</ImageZoomer>
	</template>
</AppFrame>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "@/utils/i18n.mjs";

import SDDNA from "./SD_DNA.vue";
import titleImg from "./SD.webp";
import samiImg from "./SD_SAMI.webp";

const { t: rawT, tm: rawTm } = useI18n( "book1/SD" );
const t = ( k, params = {} ) => rawT( k, params );
const tm = ( key = "" ) => rawTm( key );

const subChapter = computed( () => tm( "subChapter" ) ?? {} );
const baseEncodingRows = computed( () => tm( "baseEncodingRows" ) ?? [] );
const comparisonRows = computed( () => tm( "comparison.rows" ) ?? [] );

const aminoByLetter = computed( () => tm( "gift.aminoByLetter" ) ?? {} );
const blockedSet = computed( () => new Set( Object.entries( aminoByLetter.value )
	.filter( ( [ , amino ] ) => !amino.codon )
	.map( ( [ letter ] ) => letter ) ) );

const giftInput = ref( "SAMIPUNK" );

const normalizedInput = computed( () => giftInput.value.toUpperCase() );

const parsedInput = computed( () => {
	const rows = [];
	const blocked = new Set();
	const ignored = new Set();
	let hasLetters = false;

	for ( const char of normalizedInput.value ) {
		const isAsciiLetter = char >= "A" && char <= "Z";

		if ( isAsciiLetter ) {
			hasLetters = true;

			if ( blockedSet.value.has( char ) ) {
				blocked.add( char );
				continue;
			}

			const amino = aminoByLetter.value[ char ];

			if ( amino?.codon ) {
				rows.push( {
					letter: char,
					codon:  amino.codon,
					short:  amino.short,
					name:   amino.name
				} );
				continue;
			}

			blocked.add( char );
			continue;
		}

		if ( char.trim() ) {
			ignored.add( char );
		}
	}

	return {
		rows,
		hasLetters,
		blocked: [ ...blocked ],
		ignored: [ ...ignored ]
	};
} );

const encodedRows = computed( () => parsedInput.value.rows );
const blockedLetters = computed( () => parsedInput.value.blocked.sort() );
const ignoredChars = computed( () => parsedInput.value.ignored.sort() );
const hasLetters = computed( () => parsedInput.value.hasLetters );
const canEncode = computed( () => {
	return hasLetters.value &&
		blockedLetters.value.length === 0 &&
		encodedRows.value.length > 0;
} );
const dnaCodonsSpaced = computed( () => encodedRows.value.map( ( row ) => row.codon ).join( " " ) );
const dnaCompact = computed( () => encodedRows.value.map( ( row ) => row.codon ).join( "" ) );
const aminoShortSequence = computed( () => encodedRows.value.map( ( row ) => row.short ).join( " - " ) );
const aminoLongSequence = computed( () => encodedRows.value.map( ( row ) => row.name ).join( ", " ) );
const blockedLettersText = computed( () => blockedLetters.value.join( ", " ) );
const ignoredCharsText = computed( () => ignoredChars.value.map( ( char ) => `'${char}'` ).join( ", " ) );
const successMessage = computed( () => {
	if ( ignoredChars.value.length ) {
		return t( "gift.successWithIgnored", {
			count:   encodedRows.value.length,
			ignored: ignoredCharsText.value
		} );
	}

	return t( "gift.success", { count: encodedRows.value.length } );
} );
</script>
