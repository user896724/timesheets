<script>
import {getContext} from "svelte";
import HttpStatus from "http-status-codes";
import authorisationHelpers from "../../../../modules/authorisationHelpers";
import userStore from "../../../stores/user";
import Button from "../../../components/Button.svelte";
import Table from "../../../components/Table/Table.svelte";

let api = getContext("api");
let notificationChannel = getContext("notificationChannel");

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

function getInvites() {
	return api.get("/company/" + companyId + "/invites");
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
	<Table
		{fields}
		fetch={getInvites}
		{newRow}
		{create}
		{_delete}
	/>
</div>
