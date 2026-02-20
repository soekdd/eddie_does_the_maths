<template>
<div>
	<div class="d-flex align-center justify-space-between mb-3">
		<div>
			<div class="text-h6">Kommentare</div>
			<div class="text-caption text-medium-emphasis">
				Thread: <code>{{ forumKey }}</code>
			</div>
		</div>

		<v-chip size="small" variant="tonal">
			{{ flatComments.length }} Beiträge
		</v-chip>
	</div>

	<v-alert
		v-if="errorMessage"
		class="mb-3"
		density="comfortable"
		type="error"
		variant="tonal"
	>
		{{ errorMessage }}
	</v-alert>

	<!-- Neuer Kommentar -->
	<v-card class="pa-3 mb-4" rounded="lg" variant="tonal">
		<div class="text-subtitle-2 mb-2">Neuen Kommentar schreiben</div>

		<div class="composerFields mb-2">
			<v-text-field
				v-model="authorName"
				density="comfortable"
				hide-details="auto"
				label="Name"
				maxlength="60"
				variant="outlined"
			/>

			<v-textarea
				v-model="newCommentBody"
				auto-grow
				density="comfortable"
				hide-details="auto"
				label="Kommentar"
				maxlength="4000"
				rows="3"
				variant="outlined"
			/>
		</div>

		<div class="composerConsentRow">
			<v-checkbox
				v-model="acceptedForumRules"
				class="consentCheckbox"
				color="primary"
				density="compact"
				hide-details
			>
				<template #label>
					<span class="consentText">
						Ich akzeptiere die
						<button
							class="rules-link"
							type="button"
							@click.stop="showForumRulesDialog = true"
						>
							Forumsregeln
						</button>.
					</span>
				</template>
			</v-checkbox>

			<v-btn
				color="primary"
				:disabled="!canSubmitRoot"
				:loading="submittingRoot"
				@click="submitRootComment"
			>
				Kommentieren
			</v-btn>
		</div>
	</v-card>

	<v-progress-linear
		v-if="loading"
		class="mb-3"
		indeterminate
		rounded
	/>

	<!-- Liste -->
	<div v-if="!loading && flatComments.length === 0" class="text-medium-emphasis">
		Noch keine Kommentare.
	</div>

	<div v-else>
		<div
			v-for="comment in flatComments"
			:key="comment.id"
			class="mb-3"
			:style="{ marginLeft: `${Math.min(comment.depth * 20, 120)}px` }"
		>
			<v-card class="pa-3" rounded="lg" variant="outlined">
				<div class="d-flex align-center justify-space-between gap-2 mb-2">
					<div class="d-flex align-center flex-wrap" style="gap: 8px;">
						<strong>{{ comment.authorName || 'Unbekannt' }}</strong>
						<span class="text-caption text-medium-emphasis">
							{{ formatDate(comment.created) }}
						</span>
						<v-chip
							v-if="comment.depth > 0"
							size="x-small"
							variant="tonal"
						>
							Antwort
						</v-chip>
					</div>

					<v-btn
						size="small"
						variant="text"
						@click="toggleReply(comment.id)"
					>
						{{ replyToId === comment.id ? 'Abbrechen' : 'Antworten' }}
					</v-btn>
				</div>

				<div class="comment-body">
					{{ comment.body }}
				</div>

				<!-- Antwortformular -->
				<div v-if="replyToId === comment.id" class="mt-3 pt-3 border-top">
					<v-textarea
						v-model="replyBody"
						auto-grow
						class="mb-2"
						counter
						density="comfortable"
						hide-details="auto"
						label="Antwort"
						maxlength="4000"
						rows="2"
						variant="outlined"
					/>

					<div class="composerConsentRow">
						<v-checkbox
							v-model="acceptedForumRules"
							class="consentCheckbox"
							color="primary"
							density="compact"
							hide-details
						>
							<template #label>
								<span class="consentText">
									Ich akzeptiere die
									<button
										class="rules-link"
										type="button"
										@click.stop="showForumRulesDialog = true"
									>
										Forumsregeln
									</button>.
								</span>
							</template>
						</v-checkbox>

						<div class="replyActions">
							<v-btn
								variant="text"
								@click="cancelReply"
							>
								Abbrechen
							</v-btn>
							<v-btn
								color="primary"
								:disabled="!canSubmitReply"
								:loading="submittingReply"
								@click="submitReply"
							>
								Antworten
							</v-btn>
						</div>
					</div>
				</div>
			</v-card>
		</div>
	</div>

	<v-dialog
		v-model="showForumRulesDialog"
		content-class="forumRulesDialogContent"
		max-width="900"
		scrollable
	>
		<v-card>
			<v-card-title class="text-h6">Forumsregeln</v-card-title>
			<v-card-text class="forumRulesContent" v-html="forumRulesHtml" />
			<v-card-actions>
				<v-spacer />
				<v-btn variant="text" @click="showForumRulesDialog = false">
					Schließen
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</div>
</template>

<script setup lang="ts">
import {
	computed, inject, onBeforeUnmount, onMounted, ref, watch
} from "vue";
import PocketBase, { type RecordModel } from "pocketbase";
import netiquetteHtml from "../utils/disclaimer/netiquette_de.html?raw";

type CommentRecord = RecordModel & {
  forumKey: string
  parentId?: string
  authorName: string
  body: string
  created: string
  updated: string
}

type FlatComment = CommentRecord & {
  depth: number
}

const props = withDefaults( defineProps<{
    forumKey: string
    collectionName?: string
  }>(),
{ collectionName: "forum_comments" } );

const pbUrl = inject<string>( "pbUrl", "" );
const pb = new PocketBase( pbUrl );
pb.autoCancellation( false );

const loading = ref( false );
const errorMessage = ref( "" );
const records = ref<CommentRecord[]>( [] );

const authorName = ref( "" );
const newCommentBody = ref( "" );
const submittingRoot = ref( false );

const replyToId = ref<string | null>( null );
const replyBody = ref( "" );
const submittingReply = ref( false );
const acceptedForumRules = ref( false );
const showForumRulesDialog = ref( false );

const authorStorageKey = computed( () => `pb_forum_author_${props.collectionName}` );
const forumRulesHtml = computed( () => netiquetteHtml.trim() || "<p>Forumsregeln sind derzeit nicht verfügbar.</p>" );

const canSubmitRoot = computed( () => {
	return (
		acceptedForumRules.value &&
		authorName.value.trim().length > 0 &&
		newCommentBody.value.trim().length > 0
	);
} );

const canSubmitReply = computed( () => {
	return (
		!!replyToId.value &&
		acceptedForumRules.value &&
    authorName.value.trim().length > 0 &&
    replyBody.value.trim().length > 0
	);
} );

function escapeFilterString( value: string ): string {
	// PocketBase filter strings use quotes; escape backslashes + quotes
	return `"${value.replace( /\\/g, "\\\\" ).replace( /"/g, "\\\"" )}"`;
}

function normalizeParentId( v: unknown ): string {
	return typeof v === "string" ? v.trim() : "";
}

function toDate( value: string ): Date {
	// PocketBase returns RFC3339-like strings; examples vary slightly.
	// We make parsing a bit more tolerant.
	const s = value.includes( "T" ) ? value : value.replace( " ", "T" );
	return new Date( s );
}

function formatDate( value: string ): string {
	const d = toDate( value );

	if ( Number.isNaN( d.getTime() ) ) {
		return value;
	}

	return d.toLocaleString( "de-DE", {
		dateStyle: "short",
		timeStyle: "short"
	} );
}

function buildFlatThread( input: CommentRecord[] ): FlatComment[] {
	const byId = new Map<string, CommentRecord & { children: ( CommentRecord & { children: any[] } )[] }>();
	const roots: ( CommentRecord & { children: any[] } )[] = [];

	for ( const r of input ) {
		byId.set( r.id, { ...r, children: [] } );
	}

	for ( const node of byId.values() ) {
		const p = normalizeParentId( node.parentId );

		if ( p && byId.has( p ) ) {
      byId.get( p )!.children.push( node );
		} else {
			roots.push( node );
		}
	}

	const sortByCreatedAsc = ( a: CommentRecord, b: CommentRecord ) =>
		toDate( a.created ).getTime() - toDate( b.created ).getTime();

	const sortRecursive = ( nodes: ( CommentRecord & { children: any[] } )[] ) => {
		nodes.sort( sortByCreatedAsc );

		for ( const n of nodes ) {
			sortRecursive( n.children );
		}
	};

	sortRecursive( roots );

	const flat: FlatComment[] = [];

	const walk = ( nodes: ( CommentRecord & { children: any[] } )[], depth: number ) => {
		for ( const n of nodes ) {
			const { children, ...rest } = n;
			flat.push( { ...( rest as CommentRecord ), depth } );
			walk( children, depth + 1 );
		}
	};

	walk( roots, 0 );
	return flat;
}

const flatComments = computed( () => buildFlatThread( records.value ) );

async function loadComments() {
	loading.value = true;
	errorMessage.value = "";

	try {
		const result = await pb.collection( props.collectionName ).getFullList<CommentRecord>( {
			sort:   "created",
			filter: `forumKey = ${escapeFilterString( props.forumKey )}`
		} );

		records.value = result;
	} catch ( err: any ) {
		const msg = String( err?.message || "" );

		if ( msg.toLowerCase().includes( "autocancel" ) ) {
			return; // harmlos
		}

		console.error( err );
		errorMessage.value = err?.message || "Kommentare konnten nicht geladen werden.";
	} finally {
		loading.value = false;
	}
}

async function createComment( payload: { body: string; parentId?: string } ) {
	errorMessage.value = "";

	await pb.collection( props.collectionName ).create( {
		forumKey:   props.forumKey,
		parentId:   payload.parentId ?? "",
		authorName: authorName.value.trim(),
		body:       payload.body.trim()
	} );
}

async function submitRootComment() {
	if ( !canSubmitRoot.value ) {
		return;
	}

	submittingRoot.value = true;

	try {
		await createComment( { body: newCommentBody.value } );
		newCommentBody.value = "";
		// await loadComments()   <-- entfernen
	} catch ( err: any ) {
		console.error( err );
		errorMessage.value = err?.message || "Kommentar konnte nicht gespeichert werden.";
	} finally {
		submittingRoot.value = false;
	}
}

function toggleReply( commentId: string ) {
	if ( replyToId.value === commentId ) {
		cancelReply();
		return;
	}

	replyToId.value = commentId;
	replyBody.value = "";
}

function cancelReply() {
	replyToId.value = null;
	replyBody.value = "";
}

async function submitReply() {
	if ( !canSubmitReply.value || !replyToId.value ) {
		return;
	}

	submittingReply.value = true;

	try {
		await createComment( {
			body:     replyBody.value,
			parentId: replyToId.value
		} );
		cancelReply();
		// await loadComments()   <-- entfernen
	} catch ( err: any ) {
		console.error( err );
		errorMessage.value = err?.message || "Antwort konnte nicht gespeichert werden.";
	} finally {
		submittingReply.value = false;
	}
}

async function setupRealtime() {
	// PocketBase SDK kümmert sich um SSE subscribe/unsubscribe intern.
	// Wir abonnieren die ganze Collection und filtern im Callback auf forumKey.
	try {
		await pb.collection( props.collectionName ).subscribe( "*", async( e: any ) => {
			const rec = e?.record as Partial<CommentRecord> | undefined;

			if ( !rec ) {
				return;
			}

			// Nur neu laden, wenn das Event zu diesem Thread gehört:
			if ( rec.forumKey === props.forumKey ) {
				await loadComments();
			}
		} );
	} catch ( err ) {
		// Realtime ist nice-to-have; Thread soll auch ohne laufen
		console.warn( "PocketBase realtime subscribe failed:", err );
	}
}

async function teardownRealtime() {
	try {
		await pb.collection( props.collectionName ).unsubscribe( "*" );
	} catch {
		// ignore
	}
}

watch( () => props.forumKey,
	async() => {
		cancelReply();
		await loadComments();
	} );

watch( authorName, ( val ) => {
	try {
		localStorage.setItem( authorStorageKey.value, val );
	} catch {
		// ignore localStorage failures
	}
} );

onMounted( async() => {
	try {
		authorName.value = localStorage.getItem( authorStorageKey.value ) || "";
	} catch {
		// ignore
	}

	await loadComments();
	await setupRealtime();
} );

onBeforeUnmount( async() => {
	await teardownRealtime();
} );
</script>

<style scoped>
.composerFields {
  display: grid;
  gap: 12px;
}

.composerFields :deep(.v-input) {
  position: relative;
  z-index: 0;
}

.composerFields :deep(.v-input:focus-within) {
  z-index: 1;
}

.composerConsentRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.consentCheckbox {
  margin: 0;
  min-width: 0;
  flex: 1 1 auto;
}

.consentCheckbox :deep(.v-selection-control) {
  min-height: 32px;
}

.consentText {
  white-space: nowrap;
}

.replyActions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
}

.comment-body {
  white-space: pre-wrap;
  line-height: 1.5;
}

.border-top {
  border-top: 1px solid rgba(128, 128, 128, 0.25);
}

.rules-link {
  border: 0;
  background: transparent;
  padding: 0;
  font: inherit;
  color: inherit;
  text-decoration: underline;
  cursor: pointer;
}

.forumRulesContent {
  max-height: 60vh;
}

.forumRulesContent :deep(h3) {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.forumRulesContent :deep(p),
.forumRulesContent :deep(address),
.forumRulesContent :deep(ul) {
  margin-bottom: 0.75rem;
}
</style>
