<script>
import {getContext} from "svelte";
import {navigate} from "svelte-routing";
import Table from "../../components/Table/Table.svelte";

let api = getContext("api");

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
	return api.get("/users");
}

function viewDetail(row) {
	navigate("/time/" + row.id);
}

let order = null;
</script>

<style>
.title {
	font-size: 1.2em;
	font-weight: bold;
	margin-bottom: 1em;
}
</style>

<div id="main">
	<div class="title">
		Users
	</div>
	<Table
		{fields}
		fetch={getUsers}
		{order}
		{viewDetail}
	/>
</div>
