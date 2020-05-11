<script>
import {getContext} from "svelte";
import HttpStatus from "http-status-codes";
import DateTime from "../../../modules/types/DateTime";
import userStore from "../../stores/user";
import Button from "../../components/Button.svelte";
import Table from "../../components/Table/Table.svelte";

let api = getContext("api");
let notificationChannel = getContext("notificationChannel");

let error;

let fields = [
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

async function getEntries(page, filters, order) {
	let params = {
		user: $userStore.id,
		page,
		...filters,
	};
	
	if (order) {
		params.orderBy = order.field;
		params.orderDir = order.dir;
	}
	
	try {
		return (await api.get("/entries", {
			params,
		})).data;
	} catch (e) {
		error = e;
	}
	
	return {
		rows: [],
		page: 0,
		itemsPerPage: 0,
		total: 0,
	};
}

function newRow() {
	return {
		userId: $userStore.id,
		dateWorked: DateTime.today().toString(),
		description: "",
		hours: 1,
	};
}

function create(row) {
	return api.post("/entries", {
		userId: $userStore.id,
		entry: row,
	});
}

function updateOne(row) {
	return api.put("/entry/" + row.id, row);
}

function updateMany(rows) {
	return api.put("/entries", rows);
}

function _delete(row) {
	return api.delete("/entry/" + row.id);
}
</script>

<style>
#title {
	font-size: 1.2em;
	font-weight: bold;
	margin-bottom: 1em;
}
</style>

<div id="main">
	<div id="title">
		My time
	</div>
	<div id="filters">
		
	</div>
	{#if error}
		<div id="error">
			{error}
		</div>
	{/if}
	<Table
		{fields}
		fetch={getEntries}
		{newRow}
		{create}
		{updateOne}
		{updateMany}
		{_delete}
	/>
</div>
