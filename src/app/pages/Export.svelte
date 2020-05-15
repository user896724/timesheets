<script>
import {onMount, getContext} from "svelte";
import query from "../../utils/query";

let api = getContext("api");

let {
	userId,
	from,
	to,
} = query.parse(location.search);

from = from || "";
to = to || "";

let loading;
let entries = [];
let error;

function getEntries() {
	let params = {
		userId,
		from,
		to,
		includeNotes: true,
	};
	
	return api.get("/entries", {
		params,
	});
}

onMount(async function() {
	loading = true;
	
	try {
		entries = (await getEntries()).data;
	} catch (e) {
		error = e;
	}
	
	loading = false;
});
</script>

<style>
@import "../css/classes/error";

#main {
	padding: 1em;
}

#title {
	font-size: 1.2em;
	font-weight: bold;
	margin-bottom: 1em;
}

.entry {
	margin-bottom: 1em;
	padding-bottom: 1em;
	border-bottom: 1px solid #d7d7d7;
}

.hours {
	font-size: 1.1em;
	font-weight: bold;
}

.date {
	font-size: .9em;
	color: #505050;
	display: inline-block;
	margin-top: .3em;
	padding: .2em;
	background: #d0eaad;
	
	&.below {
		background: #eac8c8;
	}
}

.description {
	margin-top: 1em;
	margin-bottom: 1em;
}

.title {
	font-weight: bold;
}

.notes {
	max-height: 400px;
	margin-top: 1em;
	overflow-y: auto;
}

.note {
	margin-bottom: 1em;
	
	&:last-child {
		margin-bottom: 0;
	}
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
</style>

<div id="main">
	<div id="title">
		Entries
		{#if from}
			from {from}
		{/if}
		{#if to}
			to {to}
		{/if}
	</div>
	{#if loading}
		Loading...
	{/if}
	{#if error}
		<div class="error">
			An error occurred while communicating with the server
		</div>
	{/if}
	{#each entries as entry}
		<div class="entry">
			<div class="hours">
				{entry.hours} hours
			</div>
			<div class="date" class:below={entry.ratio < 1}>
				{entry.dateWorked}
			</div>
			<div class="description">
				{entry.description}
			</div>
			<div class="title">
				Notes
			</div>
			<div class="notes">
				{#each entry.notes as note}
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
				{:else}
					(None)
				{/each}
			</div>
		</div>
	{/each}
</div>
