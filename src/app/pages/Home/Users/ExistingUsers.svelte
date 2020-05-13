<script>
import {getContext} from "svelte";
import authorisationHelpers from "../../../../modules/authorisationHelpers";
import userStore from "../../../stores/user";
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

function getUsers() {
	return api.get("/company/" + companyId + "/workers");
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
