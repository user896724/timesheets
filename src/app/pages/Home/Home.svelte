<script>
import {onMount, getContext} from "svelte";
import HttpStatus from "http-status-codes";
import {Router, Route} from "svelte-routing";
import {LOCATION} from "svelte-routing/src/contexts";
import axios from "axios";
import authorisationHelpers from "../../../modules/authorisationHelpers";
import {requireManager} from "../../utils/routeGuards";
import authTokenStore from "../../stores/authToken";
import userStore from "../../stores/user";
import Button from "../../components/Button.svelte";
import Main from "../Main.svelte";
import Time from "./Time.svelte";
import Users from "./Users.svelte";

let api = getContext("api");
let notificationChannel = getContext("notificationChannel");
let location = getContext(LOCATION);
</script>

<style>
#nav {
	display: flex;
	padding: .3em;
	padding-bottom: 0;
	box-shadow: inset 0 -1px 3px 0 #00000020;
	
	a {
		text-decoration: none;
		display: block;
		border-radius: 4px 4px 0 0;
		padding: .5em 1.2em;
		
		&.selected {
			background: white;
		}
	}
}

#page {
	flex-grow: 1;
	background: white;
}
</style>

<Main>
	<div id="nav">
		<a
			href="/home"
			class:selected={$location.pathname === "/home"}
		>
			My time
		</a>
		{#if authorisationHelpers.isManager($userStore)}
			<a
				href="/home/users"
				class:selected={$location.pathname === "/home/users"}
			>
				Manage users
			</a>
		{/if}
	</div>
	<div id="page">
		<Router>
			<Route path="users" component={requireManager($userStore, Users)}/>
			<Route path="/" component={Time}/>
		</Router>
	</div>
</Main>
