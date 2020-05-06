<script>
import {link} from "svelte-routing";
import user from "../stores/user";
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
	font-size: 2em;
	font-weight: bold;
	margin-top: 1rem;
}

#tagline {
	font-size: 1.2em;
	color: #606060;
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

#signupButton {
	text-decoration: none;
	color: white;
	text-shadow: 1px 1px #00000040;
	padding: 1em;
	border: 1px solid #C98C2A;
	border: 1px solid #298FC6;
	border-radius: 4px;
	box-shadow: inset 0 0 2px #ffffff80;
	background: linear-gradient(#F4A824, #E58E02);
	background: linear-gradient(#4BA8DD, #148ABC);
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
			<a
				id="signupButton"
				href="/signup"
				use:link
			>
				Sign up
			</a>
			<a
				id="loginButton"
				href={$user ? "/home" : "/login"}
				use:link
			>
				Log in
			</a>
		</div>
	</div>
</Main>
