<script>
import {createEventDispatcher} from "svelte";

export let field;
export let label;
export let order;
export let title = null;

let fire = createEventDispatcher();

function click() {
	fire("order", field);
}
</script>

<style>
#main {
	white-space: nowrap;
	cursor: pointer;
}

span.glyph {
	font-size: .8em;
	line-height: 0;
}
</style>

<div
	id="main"
	on:click={click}
	{title}
>
	{label}
	{#if order && order.field === field}
		<span class="glyph">
			{@html order.dir === "asc" ? "&#9206;" : "&#9207;"}
		</span>
	{/if}
</div>
