let yargs = require("yargs");
let fs = require("flowfs");
let mysql = require("../../src/modules/mysql");
let config = require("../../config/api");
let ensureMigrationsTableExists = require("./ensureMigrationsTableExists");
let runMigration = require("./runMigration");

/*
NOTE not all migrations have down migrations -- they're sometimes not
reversible anyway without data loss, and not useful except in a bad
deploy scenario, so will probably only be used once live (and then we
might need to write some code to back up and restore any lost data --
something along the lines of the up migration returning something that
gets stored somewhere and passed to the down migration.  even this
could only be used in an "emergency" situation, immediately after
deploying, as otherwise the backup could be stale.)
*/

function error(message) {
	console.error(message);
	process.exit();
}

(async function() {
	process.chdir(__dirname);
	
	yargs.alias({
		dryrun: "d",
	});
	
	let args = yargs.argv;
	
	let {
		dryrun,
	} = args;
	
	let [action, n] = args._;
	
	if (!action) {
		action = "update";
	}
	
	if (dryrun) {
		console.log("Dry run (not updating migrations table)");
	}
	
	let migrationsDir = fs("../../migrations");
	let db = await mysql(config.db);
	
	await ensureMigrationsTableExists(db);
	
	let currentVersion = await db.cell("select max(version) from migrations");
	
	if (currentVersion === null) {
		currentVersion = 0;
	}
	
	let migrationFiles = await migrationsDir.ls();
	
	console.log("Current version: " + currentVersion);
	
	let migrations = migrationFiles.filter(function(node) {
		return node.name.match(/^\d+-.+\.js$/);
	}).map(function(node) {
		let version = Number(node.name.split("-")[0]);
		
		return {
			version,
			node,
		};
	}).sort(function(a, b) {
		return a.version > b.version ? 1 : -1;
	});
	
	let byVersion = {};
	
	for (let migration of migrations) {
		byVersion[migration.version] = migration;
	}
	
	async function rollback(n) {
		let migrateTo = n < 0 ? currentVersion + n : n;
		
		let versionsToRollback = await db.col(`
			select version
			from migrations
			where version > ?
			order by version desc
		`, [migrateTo]);
	
		for (let version of versionsToRollback) {
			let {node} = byVersion[version];
			let {down} = require(node.path);
			
			console.log("Rolling back: " + node.name);
			
			await runMigration(db, down);
			
			await db.query(`
				delete from migrations
				where version = ?
			`, [version]);
		}
	}
	
	let actions = {
		async update() {
			let newMigrations = migrations.filter(function({version}) {
				return version > currentVersion;
			});
			
			for (let {version, node} of newMigrations) {
				let {up} = require(node.path);
				
				console.log("Running migration " + node.name);
				
				await runMigration(db, up);
				
				if (!dryrun) {
					await db.insert("migrations", {
						appliedAt: db.now(),
						version,
						name: node.name,
					});
				}
			}
		},
		
		async only() {
			if (!byVersion[n]) {
				error("No such migration: " + n);
			}
			
			let {node} = byVersion[n];
			let {up} = require(node.path);
			
			console.log("Running migration: " + node.name);
			
			await runMigration(db, up);
			
			if (!dryrun) {
				await db.insert("migrations", {
					appliedAt: db.now(),
					version: n,
					name: node.name,
				});
			}
		},
		
		async rollback() {
			if (n === undefined) {
				n = -1;
			}
			
			await rollback(n);
		},
		
		async reset() {
			await rollback(0);
		},
	};
	
	await actions[action]();
	
	db.end();
})();
