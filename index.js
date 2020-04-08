const { prefix, token, ownerid } = require("./config.json");
const { CommandoClient } = require('discord.js-commando');
const path = require('path');

const client = new CommandoClient({
	commandPrefix: prefix,
	owner: ownerid,
	disableEveryone: true
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['music', 'Music'],
		['fun', 'Fun']
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'commands'))
	;

client.once("ready", () => {
	console.log("Ready!");
	client.user.setActivity('Under Construction');
});

client.once("reconnecting", () => {
	console.log("Reconnecting!");
});

client.once("disconnect", () => {
	console.log("Disconnected!");
});

client.on("message", async msg => {
});

client.login(token);