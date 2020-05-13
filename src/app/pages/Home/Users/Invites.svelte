<script>
import {getContext} from "svelte";
import HttpStatus from "http-status-codes";
import authorisationHelpers from "../../../../modules/authorisationHelpers";
import userStore from "../../../stores/user";
import Button from "../../../components/Button.svelte";
import Table from "../../../components/Table/Table.svelte";

let api = getContext("api");
let notificationChannel = getContext("notificationChannel");

let error;

$: companyId = authorisationHelpers.getCompanyId($userStore);

let fields = [
	{
		name: "email",
		type: "text",
		editable: false,
		label: "Email",
		orderable: true,
	},
];

async function getInvites() {
	try {
		return (await api.get("/company/" + companyId + "/invites")).data;
	} catch (e) {
		error = e;
	}
	
	return [];
}

function newRow() {
	return {
		email: "",
	};
}

function create(row) {
	return api.post("/company/" + companyId + "/invites", row);
}

function _delete(row) {
	return api.delete("/company/" + companyId + "/invite/" + row.id);
}
</script>

<style>

</style>

<div id="main">
	{#if error}
		<div id="error">
			{error}
		</div>
	{/if}
	<Table
		{fields}
		fetch={getInvites}
		{newRow}
		{create}
		{_delete}
	/>
</div>
