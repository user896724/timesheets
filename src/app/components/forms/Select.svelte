<script>
import {createEventDispatcher} from "svelte";
import {isSpace} from "../../../utils/dom/keyEvents";
import _typeof from "../../../utils/typeof";
import {isTouch} from "../../../utils/dom/checkDevice";
import generateOptionPairs from "./generateOptionPairs";

export let id;
export let options;
export let name = "";
export let value = null;
export let disabled = false;
export let required = false;
export let placeholder = null;
export let labelKey = null;
export let valueKey = null;
export let useKey = true;
export let grow = false;
export let touchOnly = false;
export let hide	= false;
export let hintId = null;

export function focus() {
	select.focus();
}

let fire = createEventDispatcher();
let isOpen = false;
let select;

$: pairs = generateOptionPairs(options, useKey, labelKey, valueKey, placeholder);

/*
NOTE open/close events for hidden selects only, so no need to fire on click

(for connecting a hidden select to the custom one for screen reader support)
*/

function keydown(e) {
	if (isSpace(e) && !isOpen) {
		fire("open");
		isOpen = true;
	}
}

function _focus() {
	fire("focus");
}

function blur() {
	isOpen = false;
	fire("close");
	fire("blur");
}
</script>

<style>
@import "../../css/classes/hideInput";

select.grow {
	width: 100%;
}
</style>

<select
	{id}
	{name}
	aria-describedby={hintId}
	bind:this={select}
	class:hideInput={hide || touchOnly && isTouch}
	class:grow
	bind:value
	on:change
	on:blur={blur}
	on:focus={_focus}
	on:keydown={keydown}
	{disabled}
	{required}
>
	{#each pairs as {label, value}}
		<option {value}>{label}</option>
	{/each}
</select>
