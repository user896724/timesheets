<script>
import {onMount, getContext} from "svelte";

let backend = getContext("backend");

onMount(function() {
	let apiErrorInterceptor = backend.interceptors.response.use(null, function(error) {
		console.error(error);
	});
	
	return function() {
		backend.interceptors.response.eject(apiErrorInterceptor);
	};
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
