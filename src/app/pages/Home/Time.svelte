<script>
import {getContext} from "svelte";
import HttpStatus from "http-status-codes";
import DateTime from "../../../modules/types/DateTime";
import userStore from "../../stores/user";
import Modal from "../../components/Modal.svelte";
import Field from "../../components/forms/Field.svelte";
import Button from "../../components/Button.svelte";
import Table from "../../components/Table/Table.svelte";
import EntryDetail from "./EntryDetail.svelte";
import Export from "./Export.svelte";

export let userId = null;

$: if (!userId) {
	userId = $userStore.id;
}

let api = getContext("api");
let notificationChannel = getContext("notificationChannel");

let showDetail = null;
let showExport = false;
let exportEntries;
let error;
let table;

let filters = {
	from: null,
	to: null,
};

let commonFields = [
	{
		name: "dateWorked",
		type: "date",
		label: "Date worked",
		orderable: true,
	},
	{
		name: "description",
		type: "text",
		label: "Description",
		orderable: true,
	},
	{
		name: "hours",
		type: "number",
		label: "Hours",
		orderable: true,
	},
];

$: fields = userId === $userStore.id ? commonFields : [
	{
		name: "user",
		label: "User",
	},
	...commonFields,
];

function getEntries(includeNotes=false) {
	let params = {
		userId,
		...filters,
	};
	
	if (includeNotes) {
		params.includeNotes = true;
	}
	
	return api.get("/entries", {
		params,
	});
}

function newRow() {
	return {
		userId,
		dateWorked: DateTime.today().toString(),
		description: "",
		hours: 1,
	};
}

function create(row) {
	return api.post("/entries", {
		userId,
		entry: row,
	});
}

function update(rows) {
	return api.put("/entries", rows);
}

function _delete(row) {
	return api.delete("/entry/" + row.id);
}

function rowStyle(row) {
	return {
		background: row.ratio >= 1 ? "#d0eaad" : "#eac8c8",
	};
}

function viewDetail(row) {
	showDetail = row;
}

function closeDetail() {
	showDetail = null;
}

function closeExport() {
	showExport = false;
}

async function exportToHtml() {
	try {
		exportEntries = (await getEntries(true)).data;
		console.log(exportEntries);
		showExport = true;
	} catch (e) {
		error = e;
	}
}

function refresh() {
	table.refresh();
}

let order = {
	field: "dateWorked",
	dir: "desc",
};
</script>

<style>
@import "../../css/classes/error";

#title {
	font-size: 1.2em;
	font-weight: bold;
	margin-bottom: 1em;
}

#filters {
	display: flex;
	align-items: flex-end;
	margin-bottom: 1em;
	
	> div {
		margin-right: 1em;
	}
}

#actions {
	margin-top: 1em;
}
</style>

{#if showDetail}
	<Modal on:close={closeDetail}>
		<EntryDetail entry={showDetail}/>
	</Modal>
{/if}

{#if showExport}
	<Modal on:close={closeExport}>
		<Export entries={exportEntries}/>
	</Modal>
{/if}

<div id="main">
	<div id="title">
		Time
	</div>
	<div id="filters">
		<div>
			<Field
				type="date"
				label="From"
				bind:value={filters.from}
			/>
		</div>
		<div>
			<Field
				type="date"
				label="To"
				bind:value={filters.to}
			/>
		</div>
		<div>
			<Button
				label="Update"
				on:click={refresh}
			/>
		</div>
	</div>
	{#if error}
		<div class="error">
			An error occurred while communicating with the server
		</div>
	{/if}
	<Table
		bind:this={table}
		{fields}
		fetch={getEntries}
		{newRow}
		{create}
		{update}
		{_delete}
		{order}
		{rowStyle}
		{viewDetail}
	/>
	<div id="actions">
		<Button
			label="Export as HTML"
			on:click={exportToHtml}
		/>
	</div>
</div>
