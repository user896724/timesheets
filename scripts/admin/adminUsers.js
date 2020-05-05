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

function error(msg) {
	console.error(msg);
	process.exit();
}

(async function() {
	let db = await mysql(config.db);
	
	try {
		let [action] = yargs.argv._;
		
		let core = new Core(db);
		
		let {
			User,
		} = core;
		
		let {
			email,
			name,
		} = yargs.argv;
		
		if (action === "add") {
			if (!name && !email) {
				error("Please provide --name and --email");
			}
			
			let password = await readPassword();
			
			let user = await User.new({
				name,
				email,
				password,
			});
			
			console.log(user);
			
			/*
			TODO add admin relationship
			*/
			
			await user.save();
			
			console.log("Admin " + name + " created");
		}
	} catch (e) {
		console.error(e);
	} finally {
		db.end();
	}
})();
