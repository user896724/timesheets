<script>
import moment from "moment";
import {onMount} from "svelte";
import datepicker from "js-datepicker";
import inlineStyle from "../../../utils/dom/inlineStyle";
import Dropdown from "./Dropdown.svelte";

export let id = null;
export let name = "";
export let value = "";
export let type = "text";
export let disabled = false;
export let readonly = false;
export let placeholder = "";
export let required = false;
export let newPassword = false;
export let pattern = null;
export let grow = false;
export let table = false;
export let css = null;
export let hintId = null;

export function focus() {
	input.focus();
}

let input;
let focused = false;

$: ac = newPassword ? "new-password" : "";

function _focus() {
	focused = true;
}

function blur() {
	focused = false;
}

onMount(function() {
	if (type === "date") {
		let options = {
			formatter(input, date) {
				value = moment(date).format("YYYY-MM-DD");
			},
		};
		
		if (value) {
			options.dateSelected = new Date(value.toString());
		}
		
		datepicker(input, options);
	}
});
</script>

<style>
@import "../../css/selectors/inputs";

textarea {
	display: block;
	width: 100%;
	height: 5em;
}

#{$inputs}, textarea {
	letter-spacing: .5px;
	border: solid 1px rgba(126, 138, 141, 0.3);
	border-radius: 4px;
	padding: .7rem;
	box-sizing: border-box;
	
	&.table {
		flex-grow: 1;
		border: 0;
		border-radius: 0;
		background: transparent;
	}
}

#{$inputs} {
	width: 12rem;
	max-width: 100%;
	
	&.grow, &.table {
		width: 100%;
	}
}
</style>

<!-- type can't be dynamic with 2 way binding on value -->
{#if type === "text" || type === "date"}
	<input
		{id}
		{name}
		aria-describedby={hintId}
		type="text"
		bind:this={input}
		bind:value
		class:disabled
		class:grow
		class:table
		style={inlineStyle(css)}
		{required}
		{pattern}
		{placeholder}
		{disabled}
		{readonly}
		autocomplete={ac}
		on:keydown
		on:keypress
		on:keyup
		on:change
		on:focus={_focus}
		on:blur={blur}
		on:click
	>
{:else if type === "email"}
	<input
		{id}
		{name}
		aria-describedby={hintId}
		type="email"
		bind:this={input}
		bind:value
		class:disabled
		class:grow
		class:table
		style={inlineStyle(css)}
		{required}
		{placeholder}
		{disabled}
		{readonly}
		autocomplete={ac}
		on:keydown
		on:keypress
		on:keyup
		on:change
		on:focus={_focus}
		on:blur={blur}
		on:click
	>
{:else if type === "password"}
	<input
		{id}
		{name}
		aria-describedby={hintId}
		type="password"
		bind:this={input}
		bind:value
		class:disabled
		class:grow
		class:table
		style={inlineStyle(css)}
		{required}
		{placeholder}
		{disabled}
		{readonly}
		autocomplete={ac}
		on:keydown
		on:keypress
		on:keyup
		on:change
		on:focus={_focus}
		on:blur={blur}
		on:click
	>
{:else if type === "number"}
	<input
		{id}
		{name}
		aria-describedby={hintId}
		type="number"
		bind:this={input}
		bind:value
		class:disabled
		class:grow
		class:table
		style={inlineStyle(css)}
		{required}
		{placeholder}
		{disabled}
		{readonly}
		autocomplete={ac}
		on:keydown
		on:keypress
		on:keyup
		on:change
		on:focus={_focus}
		on:blur={blur}
		on:click
	>
{:else if type === "area"}
	<div
		class="textarea"
	>
		<textarea
			{id}
			{name}
			aria-describedby={hintId}
			bind:this={input}
			bind:value
			class:disabled
			class:table
			style={inlineStyle(css)}
			{required}
			{disabled}
			{readonly}
			on:keydown
			on:keypress
			on:keyup
			on:change
			on:focus={_focus}
			on:blur={blur}
			on:click
		></textarea>
	</div>
{:else if type === "dropdown"}
	<Dropdown
		bind:value
		{...$$props}
	/>
{:else if type === "hidden"}
	<input type="hidden" bind:this={input} {value}>
{/if}
