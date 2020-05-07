<script>
import {onMount} from "svelte";
import bodyClick from "../../utils/dom/bodyClick";

export let user;

let showingMenu = false;
let main;

function toggle() {
	showingMenu = !showingMenu;
}

function close() {
	showingMenu = false;
}

onMount(function() {
	let teardown = bodyClick.on(close, () => [main]);
	
	return teardown;
});
</script>

<style>
#menuAnchor {
	position: relative;
}

a#button {
	text-decoration: none;
	display: flex;
	align-items: center;
}

#name {
	margin-right: 1rem;
}

#icon {
	$size: 40px;
	$imgSize: 16px;
	$offset: -2px;
	
	display: flex;
	justify-content: center;
	align-items: center;
	width: $size;
	height: $size;
	border-radius: $size / 2;
	background: #efefef;
	
	&:active, a.showingMenu & {
		box-shadow: inset 1px 1px 3px 0 #00000012;
	}
	
	img {
		position: relative;
		top: $offset;
		width: $imgSize;
	}
}

#menu {
	position: absolute;
	z-index: 10;
	right: 0;
	top: 3px;
	width: 15em;
	border-radius: 5px;
	padding: .5rem .7rem;
	box-shadow: 1px 1px 3px 0 #00000030;
	background: white;
	
	a {
		text-decoration: none;
		display: block;
		padding: .4rem .7rem;
	}
}
</style>

<div id="main" bind:this={main}>
	<a
		id="button"
		class:showingMenu
		href="javascript:void(0)"
		on:click={toggle}
	>
		<div id="name">
			{user.name}
		</div>
		<div id="icon">
			<img src="/img/icons/black/user.svg" alt="User">
		</div>
	</a>
	{#if showingMenu}
		<div id="menuAnchor">
			<div id="menu" on:click={toggle}>
				<a href="/home">Home</a>
				<a href="/logout">Log out</a>
			</div>
		</div>
	{/if}
</div>
