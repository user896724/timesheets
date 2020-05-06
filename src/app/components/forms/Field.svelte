<script>
import {onMount} from "svelte";
import inlineStyle from "../../../utils/dom/inlineStyle";
import lid from "../../../utils/lid";
import Input from "./Input.svelte";

export let name = "";
export let label = "";
export let hint = "";
export let value = "";
export let css = null;

export function focus() {
	input.focus();
}

let id = lid();
let hintId = lid();
let input;
</script>

<style>
label {
	font-weight: bold;
	margin-bottom: .5em;
}

.hint {
	font-size: .8em;
	font-style: italic;
	color: #7e8a8d;
	margin-top: .8em;
	margin-bottom: .8em;
}

#input {
	margin-top: .2em;
}
</style>

<div style={inlineStyle(css)}>
	{#if label}
		<label for={id}>
			{label}
		</label>
	{/if}
	{#if hint}
		<div class="hint" id={hintId}>
			{hint}
		</div>
	{/if}
	<div id="input">
		<Input
			{id}
			{name}
			bind:this={input}
			bind:value
			{hintId}
			grow
			{...$$restProps}
		/>
	</div>
</div>
