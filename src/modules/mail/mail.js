let svelteViewEngine = require("svelte-view-engine");
let dbTransport = require("./dbTransport");

module.exports = function(config, db) {
	let transports = {
		db: dbTransport(db),
	};
	
	let engine = svelteViewEngine(config.svelteMail);
	
	return async function(to, subject, template, locals, attachments=[]) {
		let html = await engine.render(template, locals);
		
		await transports.db({
			from: config.mailFrom,
			to,
			subject,
			template,
			locals,
			body: html,
			attachments,
		});
	}
}
