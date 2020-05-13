<script>
import {getContext} from "svelte";
import HttpStatus from "http-status-codes";
import authorisationHelpers from "../../../../modules/authorisationHelpers";
import userStore from "../../../stores/user";
import Button from "../../../components/Button.svelte";
import Table from "../../../components/Table/Table.svelte";

$: companyId = authorisationHelpers.getCompanyId($userStore);

let api = getContext("api");
let notificationChannel = getContext("notificationChannel");

let error;

let fields = [
	{
		name: "name",
		label: "Name",
		orderable: true,
	},
	{
		name: "email",
		label: "Email",
		orderable: true,
	},
];

async function getUsers() {
	try {
		return (await api.get("/company/" + companyId + "/users", {
			params,
		})).data;
	} catch (e) {
		error = e;
	}
	
	return [];
}

function _delete(row) {
	return api.delete("/company/" + companyId + "/users/" + row.id);
}

let order = null;
</script>

<style>

</style>

<Table
	{fields}
	fetch={getUsers}
	{_delete}
	{order}
/>
