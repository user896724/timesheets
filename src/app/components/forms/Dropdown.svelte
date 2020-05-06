<script>
import {createEventDispatcher} from "svelte";
import noop from "../../../utils/noop";
import wrapAround from "../../../utils/wrapAround";
import {isEnter, isArrow, dirUpDown} from "../../../utils/dom/keyEvents";
import screenOffsets from "../../../utils/dom/screenOffsets";
import inlineStyle from "../../../utils/dom/inlineStyle";
import {isTouch} from "../../../utils/dom/checkDevice";
import generateOptionPairs from "./generateOptionPairs";
import ChevronDown from "../icons/ChevronDown.svelte";
import Select from "./Select.svelte";

export let id;
export let name = "";
export let options;
export let value;
export let required = false;
export let placeholder = null;
export let labelKey = null;
export let valueKey = null;
export let useKey = true;
export let grow = false;
export let css = null;
export let hintId = null;

export function focus() {
	select.focus();
}

if (!value) {
	value = "";
}

let main;
let browse;
let select;
let focused = false;
let isOpen = false;
let focusedOption;
let listDownwards;

$: pairs = generateOptionPairs(options, useKey, labelKey, valueKey, placeholder);
$: selectedOption = findSelectedOption(value);

function findSelectedOption(value) {
	for (let pair of pairs) {
		if (pair.value === value) {
			return pair;
		}
	}
	
	return null;
}

function _focus() {
	focused = true;
}

function blur() {
	focused = false;
	close();
}

function toggleOpen() {
	isOpen ? close() : open();
	
	select.focus();
}

function open() {
	listDownwards = screenOffsets(main).bottom > browse.offsetHeight + 10;
	isOpen = true;
}

function close() {
	isOpen = false;
}

function click() {
	toggleOpen();
}

function clickOption(option) {
	value = option.value;
	close();
}
</script>

<style>
@import "../../css/classes/hide";
@import "../../css/classes/hideInput";

#main {
	position: relative;
	display: inline-flex;
	align-items: center;
	width: 100%;
	max-width: 18rem;
	border: solid 1px rgba(126, 138, 141, 0.3);
	border-radius: 4px;
	cursor: default;
}

#value {
	padding: .7rem;
}

#arrow {
	margin-left: auto;
	margin-right: .7rem;
}

#browseAnchor {
	position: absolute;
	width: 100%;
	
	&.listUpwards {
		top: 0;
	}
	
	&.listDownwards {
		bottom: 0;
	}
}

#browse {
	position: absolute;
	z-index: 10;
	min-width: 100%;
	border: solid 1px rgba(126, 138, 141, 0.3);
	border-radius: 4px;
	background: white;
	
	.listDownwards & {
		top: 2px;
	}
	
	.listUpwards & {
		bottom: 2px;
	}
}

.option {
	border-radius: 4px;
	padding: .7rem;
	
	&:hover, &.focused {
		background: #efefef;
	}
}
</style>

<Select
	{id}
	{name}
	{options}
	{required}
	{placeholder}
	{grow}
	on:open={open}
	on:focus={_focus}
	on:blur={blur}
	bind:value
	bind:this={select}
	touchOnly
	{hintId}
/>
{#if !isTouch}
	<div
		id="main"
		aria-hidden={true}
		bind:this={main}
		on:mousedown|preventDefault={noop}
		on:click|stopPropagation={click}
	>
		<div id="value">
			{selectedOption && selectedOption.label}
		</div>
		<div id="arrow">
			<ChevronDown/>
		</div>
		<div
			id="browseAnchor"
			class:hide={!isOpen}
			class:listDownwards
			class:listUpwards={!listDownwards}
		>
			<div
				id="browse"
				bind:this={browse}
				on:mousedown|preventDefault={noop}
				on:click|stopPropagation={noop}
			>
				{#each pairs as option}
					<div
						class="option"
						class:focused={focusedOption === option}
						on:click={() => clickOption(option)}
					>
						{option.label}
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
