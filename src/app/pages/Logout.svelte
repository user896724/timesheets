<script>
import {onMount} from "svelte";
import authToken from "../stores/authToken";
import user from "../stores/user";
import Button from "../components/Button.svelte";
import Main from "./Main.svelte";

onMount(function() {
	$authToken = null;
	$user = null;
});
</script>

<style>
#content {
	width: 420px;
	margin: 2em auto;
	border-radius: 5px;
	padding: 1.3em;
	box-shadow: 0px 2px 3px 0 #00000020;
	background: white;
}

#message {
	text-align: center;
}

#actions {
	display: flex;
	justify-content: center;
	margin-top: 1em;
}
</style>

<Main>
	<div id="content">
		<div id="message">
			You are now logged out.
		</div>
		<div id="actions">
			<Button
				href="/"
				primary
				label="Home"
			/>
		</div>
	</div>
</Main>
