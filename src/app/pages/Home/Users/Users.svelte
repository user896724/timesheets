<script>
import ExistingUsers from "./ExistingUsers.svelte";
import Invites from "./Invites.svelte";
</script>

<style>
#main {
	> div {
		margin-bottom: 1em;
	}
}

.title {
	font-size: 1.2em;
	font-weight: bold;
	margin-bottom: 1em;
}
</style>

<div id="main">
	<div>
		<div class="title">
			Invites
		</div>
		<Invites/>
	</div>
	<div>
		<div class="title">
			Users
		</div>
		<ExistingUsers/>
	</div>
</div>
