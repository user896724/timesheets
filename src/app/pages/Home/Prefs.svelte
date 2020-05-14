<script>
import {getContext} from "svelte";
import userStore from "../../stores/user";
import Field from "../../components/forms/Field.svelte";
import Button from "../../components/Button.svelte";

let api = getContext("api");
let notificationChannel = getContext("notificationChannel");

let saving = false;
let error;

async function save() {
	saving = true;
	error = null;
	
	try {
		await api.patch("/users/" + $userStore.id, {
			prefs: $userStore.prefs,
		});
		
		notificationChannel.send({
			message: "Preferences updated",
			time: 2000,
		});
	} catch (e) {
		error = e;
	}
	
	saving = false;
}
</script>

<style>
@import "../../css/classes/error";

#title {
	font-size: 1.2em;
	font-weight: bold;
	margin-bottom: 1em;
}

form {
	width: 18rem;
	max-width: 100%;
}

#actions {
	margin-top: 1em;
}
</style>

<div id="main">
	<div id="title">
		Preferences
	</div>
	{#if error}
		<div class="error">
			An error occurred while communicating with the server
		</div>
	{/if}
	<form on:submit|preventDefault={save}>
		<Field
			type="number"
			label="Preferred working hours per day"
			bind:value={$userStore.prefs.preferredWorkingHoursPerDay}
		/>
		<div id="actions">
			<Button
				type="submit"
				label={saving ? "Saving..." : "Save"}
				disabled={saving}
			/>
		</div>
	</form>
</div>
