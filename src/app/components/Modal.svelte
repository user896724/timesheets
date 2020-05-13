<script>
import {createEventDispatcher} from "svelte";
import noop from "../../utils/noop";
import inlineStyle from "../../utils/dom/inlineStyle";
import Button from "./Button.svelte";

export let css = null;

let fire = createEventDispatcher();

function close() {
	fire("close");
}

function keyup({key}) {
	if (key === "Escape") {
		close();
	}
}
</script>

<style>
#back {
	position: fixed;
	z-index: 100;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: #00000045;
}

#header {
	display: flex;
	justify-content: flex-end;
}

#content {
	width: 60%;
	border-radius: 8px;
	padding: 1em;
	box-shadow: 0 0 5px 3px #00000010;
	background: white;
}
</style>

<svelte:window on:keyup={keyup}/>

<div id="back" on:click={close}>
	<div id="content" style={inlineStyle(css)} on:click|stopPropagation={noop}>
		<div id="header">
			<Button
				style="icon"
				icon="/img/icons/black/x.svg"
				iconHeight={16}
				on:click={close}
			/>
		</div>
		<slot/>
	</div>
</div>
