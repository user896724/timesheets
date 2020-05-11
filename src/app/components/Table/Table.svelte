<script>
import {onMount, createEventDispatcher} from "svelte";
import jsonCopy from "../../../utils/jsonCopy";
import {remove, push} from "../../../utils/arrayMethods";
import {indexById, sortBy} from "../../../utils/collections";
import Button from "../Button.svelte";
import OrderableTh from "./OrderableTh.svelte";
import editorComponents from "./editors/components";

export let fields;
export let fetch;
export let newRow;
export let create = null;
export let updateOne;
export let updateMany;
export let _delete;
export let order = null;

let fire = createEventDispatcher();

let result = {
	rows: [],
	page: 0,
	total: 0,
	itemsPerPage: 0,
};

let originalRows;

function updateOriginalRows() {
	originalRows = indexById(jsonCopy(result.rows));
}

updateOriginalRows();

$: sortedRows = order ? sortBy(result.rows, order.field, order.dir === "desc") : result.rows;

$: changedRows = sortedRows.filter(function(row) {
	return JSON.stringify(row) !== JSON.stringify(originalRows[row.id]);
});



let _new = null;
let saving = false;

function _newRow() {
	_new = newRow();
}

async function saveNew() {
	saving = true;
	
	let row = await create(_new);
	
	saving = false;
	_new = null;
	
	refresh();
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
	await _delete(row);
	
	rows = remove(rows, row);
	
	updateOriginalRows();
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
	await updateMany(changedRows);
	
	updateOriginalRows();
}

async function refresh() {
	result = await fetch();
	
	updateOriginalRows();
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
							{field.name}
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
								<svelte:component
									this={editorComponents[field.type]}
									bind:value={_new[field.name]}
								/>
							</td>
						{/each}
						<td>
							<Button
								css={saveButton}
								label="Save"
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
				{#each sortedRows as row (row.id)}
					<tr>
						{#each fields as field}
							<td class="edit">
								<svelte:component
									this={editorComponents[field.type]}
									bind:value={row[field.name]}
								/>
							</td>
						{/each}
						<td>
							<Button
								style="link"
								label="Delete"
								on:click={() => confirmDelete(row)}
								css={changedRows.length > 0 && hideAction}
								disabled={changedRows.length > 0}
							/>
						</td>
					</tr>
				{/each}
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
					label="Save"
					on:click={save}
				/>
			</div>
		</div>
	{/if}
</div>
