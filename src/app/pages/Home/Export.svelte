<script>
export let entries;
</script>

<style>
#main {
	max-height: 500px;
	margin-top: 1em;
	overflow-y: auto;
}

.hours {
	font-size: 1.1em;
	font-weight: bold;
}

.date {
	font-size: .9em;
	color: #505050;
	margin-top: .3em;
}

.description {
	margin-top: 1em;
	margin-bottom: 1em;
}

.notes {
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
</style>

<div id="main">
	{#each entries as entry}
		<div class="entry">
			<div class="hours">
				{entry.hours} hours
			</div>
			<div class="date">
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
