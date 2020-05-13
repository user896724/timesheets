<script>
import {getContext} from "svelte";
import HttpStatus from "http-status-codes";
import DateTime from "../../../modules/types/DateTime";
import userStore from "../../stores/user";
import Field from "../../components/forms/Field.svelte";
import Button from "../../components/Button.svelte";
import Table from "../../components/Table/Table.svelte";

export let userId = null;

$: if (!userId) {
	userId = $userStore.id;
}

let api = getContext("api");
let notificationChannel = getContext("notificationChannel");

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

async function getEntries() {
	let params = {
		userId: $userStore.id,
		...filters,
	};
	
	try {
		return (await api.get("/entries", {
			params,
		}));
	} catch (e) {
		error = e;
	}
	
	return [];
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
	return api.delete("/entries/" + row.id);
}

function rowStyle(row) {
	return {
		background: row.ratio >= 1 ? "#d0eaad" : "#eac8c8",
	};
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
</style>

<div id="main">
	<div id="title">
		My time
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
		<div id="error">
			{error}
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
	/>
</div>
