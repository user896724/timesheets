<script>
import {setContext} from "svelte";
import payload from "svelte-view-engine/payload";
import {Router, Route} from "svelte-routing";
import axios from "axios";
import _404 from "./pages/404.svelte";
import Index from "./pages/Index.svelte";
import Signup from "./pages/Signup.svelte";

let {
	apiBase,
} = payload.get();

let api = axios.create({
	baseURL: apiBase,
});

setContext("api", api);
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
	<Route component={_404}/>
</Router>
