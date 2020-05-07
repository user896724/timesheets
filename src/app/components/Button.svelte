<script>
import {createEventDispatcher} from "svelte";
import {link} from "svelte-routing";
import bodyClick from "../../utils/dom/bodyClick.js";
import inlineStyle from "../../utils/dom/inlineStyle";

export let label = null;
export let title = null;
export let href = null;
export let style = "default";
export let large = false;
export let primary = false;
export let flat = false;
export let notab = false;
export let nofocus = false;
export let css = null;
export let type = "button";
export let name = "";
export let value = label;
export let arrow = false;
export let down = false;
export let stopPropagation = false;
export let glyph = null;
export let circle = null;
export let icon = null;
export let leftIcon = null;
export let rightIcon = null;
export let iconWidth = null;
export let iconHeight = null;
export let disabled = false;
export let _id = bodyClick.id();

let fire = createEventDispatcher();

let button;
let calculatedCss;

function click(e) {
	bodyClick.add(_id);
	
	fire("click", e);
	
	if (stopPropagation) {
		e.stopPropagation();
	}
}

function mousedown(e) {
	if (nofocus) {
		e.preventDefault();
	}
}

$: circleStyle = circle ? {
	width: circle,
	height: circle,
	borderRadius: 100,
} : null;

$: if (icon) {
	leftIcon = icon;
}

$: hasIcon = leftIcon || rightIcon;

function iconOpacity(icon) {
	return {
		opacity: icon.match(/\/white\//) ? .95 : .75,
	};
}
</script>

<svelte:options accessors/>

<style>
@import "../css/theme";

#button {
	color: #333333;
	font-family: inherit;
	font-size: 1em;
	letter-spacing: normal;
	text-decoration: none;
	position: relative;
	display: inline-block;
	border-radius: 3px;
	padding: 7px 15px;
	cursor: pointer;
	
	&.threed {
	}
	
	&.primary.threed {
		text-shadow: 1px 1px #00000040;
		color: #FCFFF4;
		border: 1px solid #298FC6;
		box-shadow: 0px 1px 0 rgba(79, 138, 59, 0.39), inset 0 0 2px #ffffff80;
		background: linear-gradient(#4BA8DD, #148ABC);
		
		&:active {
			background: linear-gradient(#1A97C9, #45A2D3);
		}
	}
	
	&.secondary.threed {
		border: 1px solid #b9b9b9;
		background: linear-gradient(#f9f9f9, #e4e2e2);
		
		&.down, &:active {
			background: linear-gradient(#e4e2e2, #F4F4F4);
		}
	}
	
	&.primary.flat {
		color: #f6fafd;
		background: #4193E0;
	}
	
	&.secondary.flat {
		background: #e8e7e6;
	}
	
	&.large {
		border-radius: 4px;
		padding: 1em 1.3em;
		
		&:active {
			box-shadow: inset 2px 2px 5px #00000024;
		}
	}
	
	&.icon {
		&.focusable:active {
			box-shadow: $focusShadow !important;
		}
	}
	
	&.disabled {
		text-shadow: none !important;
		color: #bab9b8 !important;
		border-color: #d2d2d2 !important;
		box-shadow: none !important;
		cursor: default;
		background: #e8e7e6;
	}
	
	&.hasIcon {
		display: inline-flex;
		justify-content: center;
		align-items: center;
	}
	
	&.leftIcon .label {
		margin-left: .5em;
	}
	
	&.rightIcon .label {
		margin-right: .5em;
	}
}

.icon {
	border: 0 !important;
	padding: 0 !important;
	background: transparent !important;
	
	&.nofocus:active {
		box-shadow: none !important;
	}
}

.flat {
	border: 0 !important;
}

.link {
	text-decoration: underline;
	border: 0 !important;
	padding: 0;
	box-shadow: none;
	background: transparent !important;
}

.link:active, .link:focus {
	box-shadow: none !important;
}

.disabled {
	color: gray !important;
	box-shadow: none;
	cursor: default;
	background: #efefef !important;
}

.small {
	padding: 0 5px;
}

span.glyph {
	line-height: 0;
}

span.arrow {
	margin-left: .25rem;
}
</style>

{#if href}
	<a
		id="button"
		class={style}
		class:large
		class:primary
		class:secondary={!primary}
		class:hasIcon
		class:leftIcon
		class:rightIcon
		class:flat
		class:threed={!flat}
		class:disabled
		style={inlineStyle(circleStyle, css)}
		{href}
		use:link
		{title}
		on:click={click}
		tabindex={notab ? -1 : ""}
	>
		{#if leftIcon}
			<img
				src={leftIcon}
				width={iconWidth}
				height={iconHeight}
				style={inlineStyle(iconOpacity(leftIcon))}
			>
		{/if}
		{#if label}
			<span class="label">
				{@html label}
			</span>
		{/if}
		{#if rightIcon}
			<img
				src={rightIcon}
				width={iconWidth}
				height={iconHeight}
				style={inlineStyle(iconOpacity(rightIcon))}
			>
		{/if}
	</a>
{:else}
	<button
		bind:this={button}
		id="button"
		class={style}
		class:large
		class:primary
		class:secondary={!primary}
		class:hasIcon
		class:leftIcon
		class:rightIcon
		class:flat
		class:threed={!flat}
		class:disabled
		class:down
		class:nofocus
		class:focusable={!nofocus}
		style={inlineStyle(circleStyle, css)}
		{type}
		{name}
		{value}
		{title}
		on:click={click}
		on:mousedown={mousedown}
		tabindex={notab ? -1 : ""}
		{disabled}
	>
		{#if leftIcon}
			<img
				src={leftIcon}
				width={iconWidth}
				height={iconHeight}
				style={inlineStyle(iconOpacity(leftIcon))}
			>
		{/if}
		{#if label}
			<span class="label">
				{@html label}
			</span>
		{/if}
		{#if rightIcon}
			<img
				src={rightIcon}
				width={iconWidth}
				height={iconHeight}
				style={inlineStyle(iconOpacity(rightIcon))}
			>
		{/if}
		{#if glyph}
			<span class="glyph">
				{@html glyph}
			</span>
		{/if}
		{#if arrow}
			<span class="glyph arrow">
				&#9207;
			</span>
		{/if}
	</button>
{/if}
