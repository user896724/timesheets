<script>
import {setContext} from "svelte";
import payload from "svelte-view-engine/payload";
import {Router, Route} from "svelte-routing";
import axios from "axios";
import NotificationChannel from "../utils/NotificationChannel";
import {requireLogin} from "./utils/routeGuards";
import authToken from "./stores/authToken";
import user from "./stores/user";
import _404 from "./pages/404.svelte";
import Index from "./pages/Index.svelte";
import Signup from "./pages/Signup.svelte";
import Home from "./pages/Home/Home.svelte";
import Login from "./pages/Login.svelte";
import Logout from "./pages/Logout.svelte";

let {
	apiBase,
} = payload.get();

let api = axios.create({
	baseURL: apiBase,
});

$: api.defaults.headers.common["Authorization"] = $authToken;

setContext("api", api);
setContext("notificationChannel", new NotificationChannel());
</script>

<svelte:head>
	<title>Timesheets</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;700&display=swap" rel="stylesheet">
	<style>
		body {
			font-family: "Nunito Sans", sans-serif;
			color: #202020;
			letter-spacing: .5px;
			margin: 0;
		}
		
		div, form {
			box-sizing: border-box;
		}
		
		a {
			color: #202020;
		}
	</style>
</svelte:head>

<Router>
	<Route path="/" component={Index}/>
	<Route path="/signup" component={Signup}/>
	<Route path="/home/*" component={requireLogin($user, Home)}/>
	<Route path="/login" component={Login}/>
	<Route path="/logout" component={Logout}/>
	<Route component={_404}/>
</Router>
