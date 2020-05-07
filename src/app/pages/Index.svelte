<script>
import user from "../stores/user";
import Button from "../components/Button.svelte";
import Main from "./Main.svelte";

console.log($user);
</script>

<style>
#main {
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 2em;
	padding-top: 3em;
}

#logo {
	color: #666666;
	font-weight: bold;
}

#headline {
	font-size: 2.4em;
	font-weight: bold;
	color: #565656;
	margin-top: 1rem;
}

#tagline {
	font-size: 1.2em;
	color: #595959;
	margin-top: .5em;
}

#cta {
	display: flex;
	align-items: center;
	margin-top: 2em;
	
	a {
		display: block;
	}
}

#loginButton {
	margin-left: 1em;
}
</style>

<Main>
	<div id="main">
		<div id="logo">
			TimeSheets
		</div>
		<div id="headline">
			We take care of time recording
		</div>
		<div id="tagline">
			so you can spend more time getting things done.
		</div>
		<div id="cta">
			<Button
				href="/signup"
				large
				primary
				label="Sign up"
			/>
			<a
				id="loginButton"
				href={$user ? "/home" : "/login"}
			>
				Log in
			</a>
		</div>
	</div>
</Main>
