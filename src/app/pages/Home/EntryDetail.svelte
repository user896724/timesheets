<script>
import {onMount, getContext} from "svelte";
import HttpStatus from "http-status-codes";
import userStore from "../../stores/user";
import Input from "../../components/forms/Input.svelte";
import Button from "../../components/Button.svelte";

export let entry;

let api = getContext("api");

let notes;
let loading = {};
let error = null;
let body = "";

$: errorStatus = error && error.response && error.response.status;

async function addNote() {
	loading.addNote = true;
	
	try {
		let note = (await api.post("/entry/" + entry.id + "/notes", {
			body,
		})).data;
		
		notes = [{
			author: $userStore.name,
			...note,
		}, ...notes];
		
		body = "";
	} catch (e) {
		error = e;
	}
	
	loading.addNote = false;
}

onMount(async function() {
	loading.notes = true;
	
	try {
		notes = (await api.get("/entry/" + entry.id + "/notes")).data;
	} catch (e) {
		error = e;
	}
	
	loading.notes = false;
});
</script>

<style>
@import "../../css/classes/error";

#hours {
	font-size: 1.1em;
	font-weight: bold;
}

#date {
	font-size: .9em;
	color: #505050;
	margin-top: .3em;
}

#description {
	margin-top: 1em;
	margin-bottom: 1em;
}

#notes {
	max-height: 400px;
	margin-top: 1em;
	overflow-y: auto;
}

.note {
	margin-bottom: 1em;
}

.noteAuthor {
	font-weight: bold;
}

.noteDate {
	font-size: .9em;
	color: #505050;
	margin-top: .1em;
}

.noteBody {
	margin-top: .5em;
}

.title {
	font-weight: bold;
	font-size: .9em;
	margin-bottom: 1em;
}

#addNote {
	margin-top: 1em;
}

#actions {
	margin-top: .3em;
}
</style>

<div id="main">
	<div id="hours">
		{entry.hours} hours
	</div>
	<div id="date">
		{entry.dateWorked}
	</div>
	<div id="description">
		{entry.description}
	</div>
	<div class="title">
		Notes
	</div>
	<div id="notes">
		{#if error}
			<div class="error">
				{#if errorStatus === HttpStatus.BAD_REQUEST}
					Please enter a note
				{:else}
					An error occurred while communicating with the server
				{/if}
			</div>
		{/if}
		{#if loading.notes}
			Loading notes...
		{:else if notes}
			{#each notes as note}
				<div class="note">
					<div class="noteAuthor">
						{note.author}
					</div>
					<div class="noteDate">
						{note.createdAt}
					</div>
					<div class="noteBody">
						{note.body}
					</div>
				</div>
			{/each}
		{/if}
	</div>
	<div id="addNote">
		<form on:submit|preventDefault={addNote}>
			<Input
				type="area"
				bind:value={body}
			/>
			<div id="actions">
				<Button
					type="submit"
					label={loading.addNote ? "Adding note..." : "Add note"}
					disabled={!body || loading.addNote}
				/>
			</div>
		</form>
	</div>
</div>
