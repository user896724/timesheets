<script>
import Input from "../../forms/Input.svelte";

export let value;
</script>

<Input
	type="number"
	bind:value
	table
/>
