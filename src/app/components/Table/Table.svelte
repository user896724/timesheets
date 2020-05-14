<script>
import {onMount, createEventDispatcher} from "svelte";
import jsonCopy from "../../../utils/jsonCopy";
import {remove, push} from "../../../utils/arrayMethods";
import {indexById, sortBy} from "../../../utils/collections";
import inlineStyle from "../../../utils/dom/inlineStyle";
import Button from "../Button.svelte";
import OrderableTh from "./OrderableTh.svelte";
import editorComponents from "./editors/components";

export let fields;
export let fetch;
export let newRow;
export let create = null;
export let update;
export let _delete = null;
export let order = null;
export let rowStyle = null;
export let viewDetail = null;

let error;

$: errorStatus = error && error.response && error.response.status;

export async function refresh() {
	loading.fetch = true;
	
	try {
		rows = (await fetch()).data;
		
		updateOriginalRows();
	} catch (e) {
		error = e;
		rows = [];
	}
	
	loading.fetch = false;
}

let fire = createEventDispatcher();

let rows = [];
let originalRows;
let originalRowsById;
let loading = {};

function updateOriginalRows() {
	originalRows = jsonCopy(rows);
	originalRowsById = indexById(originalRows);
}

updateOriginalRows();

$: sortedRows = order ? sortBy(rows, order.field, order.dir === "desc") : rows;

$: changedRows = sortedRows.filter(function(row) {
	return JSON.stringify(row) !== JSON.stringify(originalRowsById[row.id]);
});

let _new = null;

function _newRow() {
	_new = newRow();
}

async function saveNew() {
	loading.create = true;
	
	try {
		let row = await create(_new);
		
		_new = null;
		
		refresh();
	} catch (e) {
		error = e;
	}
	
	loading.create = false;
}

function cancelNew() {
	_new = null;
}

function confirmDelete(row) {
	if (confirm("Delete row #" + row.id + "?")) {
		deleteRow(row);
	}
}

async function deleteRow(row) {
	loading.delete = true;
	
	try {
		await _delete(row);
		
		refresh();
	} catch (e) {
		error = e;
	}
	
	loading.delete = false;
}

function clickOrder({detail: field}) {
	if (!confirmIfChanged()) {
		return;
	}
	
	if (order && order.field === field) {
		if (order.dir === "asc") {
			order.dir = "desc";
		} else {
			order = null;
		}
	} else {
		order = {
			field,
			dir: "asc",
		};
	}
}

function confirmIfChanged() {
	if (changedRows.length > 0) {
		return confirm("Updating list will discard pending changes.  Continue?");
	} else {
		return true;
	}
}

async function save() {
	loading.save = true;
	
	try {
		await update(changedRows);
		
		refresh();
	} catch (e) {
		error = e;
	}
	
	loading.save = false;
}

function cancelEdits() {
	rows = jsonCopy(originalRows);
}

refresh();

/*
hide buttons using visibility to prevent the table rejigging when it
changes
*/

let hideAction = {
	visibility: "hidden",
};

let saveButton = {
	marginRight: "1em",
};
</script>

<style>
@import "../../css/classes/error";

#main {
}

#actions {
	margin-bottom: 1rem;
}

table {
	width: 100%;
	border-collapse: collapse;
}

td, th {
	border: 1px solid #d8d8d8;
	padding: 3px 7px;
	
	&.edit {
		padding: 0;
	}
}

tr {
	cursor: default;
	
	&:hover {
		background: #f3f3f3;
	}
	
	&.selected {
		background: #EFEFEF;
	}
}

#reviewAndSave {
	display: flex;
	align-items: center;
	border-top: 1px solid #b5b5b5;
	padding: 1em 0;
	background: white;
	
	> div:last-child {
		margin-left: auto;
	}
}
</style>

<div id="main">
	<div id="actions">
		{#if create}
			<Button
				label="New entry"
				on:click={_newRow}
			/>
		{/if}
	</div>
	{#if error}
		<div class="error">
			An error occurred while communicating with the server.
		</div>
	{/if}
	<div id="list">
		<table>
			<thead>
				{#each fields as field}
					<th>
						{#if field.orderable}
							<OrderableTh
								field={field.name}
								label={field.label}
								{order}
								on:order={clickOrder}
							/>
						{:else}
							{field.label}
						{/if}
					</th>
				{/each}
				<th>
					Actions
				</th>
			</thead>
			<tbody>
				{#if _new}
					<tr>
						{#each fields as field}
							<td class="edit">
								{#if field.type}
									<svelte:component
										this={editorComponents[field.type]}
										bind:value={_new[field.name]}
									/>
								{/if}
							</td>
						{/each}
						<td>
							<Button
								css={saveButton}
								label={loading.create ? "Saving..." : "Save"}
								disabled={loading.create}
								on:click={saveNew}
							/>
							<Button
								style="link"
								label="Cancel"
								on:click={cancelNew}
							/>
						</td>
					</tr>
				{/if}
				{#if loading.fetch}
					<tr>
						<td colspan={fields.length + 1}>
							Loading...
						</td>
					</tr>
				{:else}
					{#each sortedRows as row (row.id)}
						<tr style={inlineStyle(rowStyle && rowStyle(row))}>
							{#each fields as field}
								{#if field.type && field.editable !== false}
									<td class="edit">
										<svelte:component
											this={editorComponents[field.type]}
											bind:value={row[field.name]}
										/>
									</td>
								{:else}
									<td>
										{row[field.name]}
									</td>
								{/if}
							{/each}
							<td>
								{#if _delete}
									<Button
										style="link"
										label={loading.delete ? "Deleting..." : "Delete"}
										on:click={() => confirmDelete(row)}
										css={changedRows.length > 0 && hideAction}
									/>
								{/if}
								{#if viewDetail}
									<Button
										style="link"
										label="View"
										on:click={() => viewDetail(row)}
										css={changedRows.length > 0 && hideAction}
									/>
								{/if}
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
	{#if changedRows.length > 0}
		<div id="reviewAndSave">
			<div>
				{changedRows.length}
				row{changedRows.length === 1 ? "" : "s"}
				modified
			</div>
			<div>
				<Button
					label={loading.save ? "Saving..." : "Save"}
					disabled={loading.save}
					on:click={save}
				/>
				<Button
					style="link"
					on:click={cancelEdits}
					label="Cancel"
				/>
			</div>
		</div>
	{/if}
</div>
