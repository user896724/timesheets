<script>
import {Router, Route} from "svelte-routing";
import Index from "./pages/Index.svelte";
</script>

<Router>
	<Route path="/" component={Index}/>
</Router>
