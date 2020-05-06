<script>
import {getContext} from "svelte";

let backend = getContext("backend");

backend.interceptors.response.use(null, function(error) {
	console.error(error);
});
</script>

<style>
#main {
	min-height: 100vh;
}
</style>

<div id="main">
	<div id="topBar">
		Timesheets
	</div>
	<div id="page">
		<slot/>
	</div>
</div>
