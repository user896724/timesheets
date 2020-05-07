<script>
import {onMount, getContext} from "svelte";
import {links} from "svelte-routing";
import user from "../stores/user";
import UserWidget from "../components/UserWidget.svelte";
import NotificationBar from "../components/NotificationBar.svelte";

let api = getContext("api");
let notifications = getContext("notificationChannel");

onMount(function() {
	let apiErrorInterceptor = api.interceptors.response.use(null, function(error) {
		notifications.send({
			type: "error",
			message: "An error occurred while communicating with the server" + Date.now(),
			ref: error,
		});
		
		throw error;
	});
	
	return function() {
		api.interceptors.response.eject(apiErrorInterceptor);
	};
});
</script>

<style>
#main {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background: #eff3f5;
}

#topBar {
	display: flex;
	align-items: center;
	padding: 1em;
	background: white;
}

#user {
	margin-left: auto;
}

#badge {
	text-decoration: none;
	font-size: 1.2em;
	font-weight: bold;
	color: #E06400;
	color: #0067DD;
}

#page {
	display: flex;
	flex-direction: column;
	flex-grow: 1;
}
</style>

<div id="main" aria-live="assertive" use:links>
	<div id="topBar">
		<a id="badge" href="/">
			TimeSheets
		</a>
		<div id="user">
			{#if $user}
				<UserWidget user={$user}/>
			{/if}
		</div>
	</div>
	<NotificationBar channel={notifications}/>
	<div id="page">
		<slot/>
	</div>
</div>
