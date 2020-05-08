<script>
import {push, remove} from "../../utils/arrayMethods";
import lid from "../../utils/lid";
import Button from "./Button.svelte";

export let channel;

let notifs = [];

channel.receive({
	show(notif) {
		if (typeof notif === "string") {
			notif = {
				message,
			};
		}
		
		notif = {
			id: lid(),
			type: "info",
			component: null,
			props: {},
			...notif,
		};
		
		notifs = push(notifs, notif);
		
		if (notif.time) {
			setTimeout(_ => dismiss(notif), notif.time);
		}
	},
	
	remove(ref) {
		notifs = notifs.filter(n => n.ref !== ref);
	},
	
	clear() {
		notifs = [];
	},
});

function dismiss(notif) {
	notifs = remove(notifs, notif);
}

let dismissButton = {
	marginLeft: "auto",
};
</script>

<style>
#main {
}

.notif {
	display: flex;
	align-items: center;
	padding: 1em;
}

.contents {
	margin-right: 1em;
}

.default {
	color: white;
	background: #87B72D;
}

.error {
	color: white;
	background: #ec2929;
}
</style>

<div id="main">
	{#each notifs as notif (notif.id)}
		<div class="notif {notif.type}">
			<div class="contents">
				{#if notif.component}
					<svelte:component this={notif.component} {...notif.props}/>
				{:else}
					{notif.message}
				{/if}
			</div>
			<Button
				css={dismissButton}
				style="icon"
				icon="/img/icons/white/x.svg"
				iconHeight={15}
				on:click={() => dismiss(notif)}
			/>
		</div>
	{/each}
</div>
