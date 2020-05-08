<script>
import {getContext} from "svelte";
import {navigate} from "svelte-routing";
import HttpStatus from "http-status-codes";
import authTokenStore from "../stores/authToken";
import userStore from "../stores/user";
import Field from "../components/forms/Field.svelte";
import Button from "../components/Button.svelte";
import Main from "./Main.svelte";

let api = getContext("api");
let notificationChannel = getContext("notificationChannel");

let email = "";
let password = "";

let loading = false;
let error = null;

$: valid = email && password;
$: errorStatus = error && error.response && error.response.status;

async function submit() {
	if (!valid) {
		return;
	}
	
	if (error) {
		notificationChannel.remove(error);
	}
	
	loading = true;
	error = null;
	
	try {
		let {
			authToken,
			user,
		} = (await api.post("/login", {
			email,
			password,
		})).data;
		
		$authTokenStore = authToken;
		$userStore = user;
		
		navigate("/home");
	} catch (e) {
		error = e;
	}
	
	loading = false;
}

let inputRow = {
	marginBottom: "1em",
};
</script>

<style>
#intro {
	text-align: center;
	width: 800px;
	max-width: 100%;
	margin: 0 auto;
}

#title {
	font-size: 2.4em;
	font-weight: bold;
	color: #565656;
	margin-top: 1em;
}

#content {
	width: 420px;
	margin: 2em auto;
	border-radius: 5px;
	padding: 1.3em;
	box-shadow: 0px 2px 3px 0 #00000020;
	background: white;
}

.error {
	color: #D10000;
	margin-bottom: 1em;
	border: 2px solid #D1000050;
	border-radius: 7px;
	padding: .5em;
}

#actions {
	display: flex;
	justify-content: center;
}
</style>

<Main>
	<div id="intro">
		<div id="title">
			Log in
		</div>
	</div>
	<div id="content">
		<div id="form">
			<form on:submit|preventDefault={submit}>
				<Field
					type="email"
					required
					label="Email"
					css={inputRow}
					bind:value={email}
					disabled={loading}
				/>
				<Field
					type="password"
					label="Password"
					required
					css={inputRow}
					bind:value={password}
					disabled={loading}
				/>
				{#if error}
					<div class="error">
						{#if errorStatus === HttpStatus.UNAUTHORIZED}
							Email/password not recognised.
						{:else}
							{error}
						{/if}
					</div>
				{/if}
				<div id="actions">
					<Button
						type="submit"
						large
						primary
						disabled={!valid || loading}
						label={loading ? "Checking details..." : "Log in"}
					/>
				</div>
			</form>
		</div>
	</div>
</Main>
