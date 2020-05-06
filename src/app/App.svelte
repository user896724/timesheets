<script>
import {setContext} from "svelte";
import payload from "svelte-view-engine/payload";
import {Router, Route} from "svelte-routing";
import axios from "axios";
import Index from "./pages/Index.svelte";

let {
	apiBase,
} = payload.get();

let backend = axios.create({
	baseURL: apiBase,
});

setContext("backend", backend);
</script>

<Router>
	<Route path="/" component={Index}/>
</Router>
