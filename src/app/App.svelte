<script>
import {setContext} from "svelte";
import payload from "svelte-view-engine/payload";
import {Router, Route} from "svelte-routing";
import axios from "axios";
import _404 from "./pages/404.svelte";
import Index from "./pages/Index.svelte";

let {
	apiBase,
} = payload.get();

let backend = axios.create({
	baseURL: apiBase,
});

setContext("backend", backend);
</script>

<svelte:head>
	<title>Timesheets</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;700&display=swap" rel="stylesheet">
	<style>
		body {
			font-family: "Nunito Sans", sans-serif;
			letter-spacing: .5px;
			margin: 0;
		}
		
		div, form {
			box-sizing: border-box;
		}
	</style>
</svelte:head>

<Router>
	<Route path="/" component={Index}/>
	<Route component={_404}/>
</Router>
