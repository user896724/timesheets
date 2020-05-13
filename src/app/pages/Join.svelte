<script>
import {getContext, tick} from "svelte";
import {fly, scale, slide} from "svelte/transition";
import {quintOut} from "svelte/easing";
import HttpStatus from "http-status-codes";
import authTokenStore from "../stores/authToken";
import userStore from "../stores/user";
import Field from "../components/forms/Field.svelte";
import Button from "../components/Button.svelte";
import Main from "./Main.svelte";

export let code;

console.log(code);

let api = getContext("api");
let notificationChannel = getContext("notificationChannel");

let name = "234";
let email = "234@Asd";
let password = "234234234";

let loading = false;
let success = false;
let error = null;
let formOutroFinished = false;

$: valid = name && email && password;
$: errorStatus = error && error.response && error.response.status;

async function submit() {
	if (!valid) {
		return;
	}
	
	if (error) {
		notificationChannel.remove(error);
	}
	
	loading = true;
	
	try {
		let {companyId} = (await api.get("/invite/" + code, {
			params: {
				email,
			},
		})).data;
		
		await api.post("/users", {
			name,
			email,
			password,
		});
		
		let {
			user,
			authToken,
		} = (await api.post("/login", {
			email,
			password,
		})).data;
		
		$authTokenStore = authToken;
		
		await tick();
		
		await api.post("/company/" + companyId + "/workers", {
			userId: user.id,
		});
		
		/*
		log in again to get the user with the new company attached
		*/
		
		({user} = (await api.post("/login", {
			email,
			password,
		})).data);
		
		$userStore = user;
		
		success = true;
	} catch (e) {
		error = e;
	}
	
	loading = false;
}

function changeEmail() {
	if (errorStatus === HttpStatus.CONFLICT) {
		error = null;
	}
}

function formOutroEnd() {
	formOutroFinished = true;
}

let scaleInOut = {
	duration: 250,
	easing: quintOut,
};

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

#etc {
	font-size: 1.2em;
	color: #595959;
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

#formTitle {
	color: #717171;
	text-align: center;
	font-size: 1.2em;
	font-weight: bold;
	margin-bottom: .7em;
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

#success {
	text-align: center;
	
	img {
		margin-top: 1em;
	}
}

#successTitle {
	color: #404040;
	font-size: 1.2em;
	font-weight: bold;
	margin-top: .5em;
}

#successMessage {
	margin-top: 1.5em;
}

#successActions {
	margin-top: 1.5em;
	margin-bottom: 1em;
}
</style>

<Main>
	<div id="intro">
		<div id="title">
			Sign up for TimeSheets
		</div>
		<div id="etc">
			Enter your details below to get started immediately.
		</div>
	</div>
	<div id="content">
		{#if success}
			{#if formOutroFinished}
				<div id="success">
					<img src="/img/tick-green.svg" height="48">
					<div id="successTitle">
						Account created
					</div>
					<div id="successMessage">
						Your account has been created.
						<br><br>
						Continue to the dashboard to start logging time.
					</div>
					<div id="successActions">
						<Button
							href="/home"
							label="Go to dashboard"
						/>
					</div>
				</div>
			{/if}
		{:else}
			<div id="form" out:scale={scaleInOut} on:outroend={formOutroEnd}>
				<div id="formTitle">
					Your details
				</div>
				<form on:submit|preventDefault={submit}>
					<Field
						type="text"
						required
						label="Your name"
						css={inputRow}
						bind:value={name}
						disabled={loading}
					/>
					<Field
						type="email"
						required
						label="Email"
						css={inputRow}
						bind:value={email}
						on:change={changeEmail}
						disabled={loading}
					/>
					<Field
						type="password"
						label="Password"
						required
						newPassword
						css={inputRow}
						bind:value={password}
						disabled={loading}
					/>
					{#if error}
						<div class="error" out:scale={scaleInOut}>
							{#if errorStatus === HttpStatus.NOT_FOUND || errorStatus === HttpStatus.UNAUTHORIZED}
								Sorry, we couldn't find a valid invitation for this email.
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
							label={loading ? "Checking details..." : "Sign up"}
						/>
					</div>
				</form>
			</div>
		{/if}
	</div>
</Main>
