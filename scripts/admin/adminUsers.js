let Prompt = require("prompt-password");
let yargs = require("yargs");
let fs = require("flowfs");
let mysql = require("../../src/modules/mysql");
let hash = require("../../src/utils/hash");
let config = require("../../config/api");
let Core = require("../../src/core/Core");

/*
add/remove/edit admin users (users who can edit everything on the site)
*/

let passwordPrompt = new Prompt({
	type: "password",
	message: "Password: ",
});

async function readPassword() {
	return hash.hash(await passwordPrompt.run());
}

(async function() {
	let db = await mysql(config.db);
	
	try {
		let [action] = yargs.argv._;
		
		let core = new Core(db);
		
		let {
			User,
			relationships,
		} = core;
		
		let {
			email,
			name,
		} = yargs.argv;
		
		if (action === "add") {
			if (!name && !email) {
				throw "Please provide --name and --email";
			}
			
			if (await User.by.email(email)) {
				throw "A user with that email already exists";
			}
			
			let password = await readPassword();
			
			let user = await User.new({
				name,
				email,
				password,
			});
			
			await relationships.add(user.id, "admin", "site");
			
			console.log("Admin " + email + " created");
		} else {
			if (!email) {
				throw "Please provide --email";
			}
			
			let user = await User.by.email(email);
			
			if (!user) {
				throw "User not found";
			}
			
			if (action === "remove") {
				await user.delete();
				
				console.log("Admin " + email + " deleted");
			} else if (action === "password") {
				let password = await readPassword();
				
				await user.update({
					password,
				});
				
				console.log("Password updated");
			}
		}
	} catch (e) {
		console.error(e);
	} finally {
		db.end();
	}
})();
