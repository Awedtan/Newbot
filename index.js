const { prefix, token, ownerid } = require("./config.json");
const { CommandoClient } = require('discord.js-commando');
const { Structures } = require('discord.js');
const Enmap = require("enmap");
const path = require('path');

Structures.extend('Guild', Guild => {
	class MusicGuild extends Guild {
		constructor(client, data) {
			super(client, data);
			this.musicData = {
				isPlaying: false,
				connection: null,
				dispatcher: null,
				message: null,
				voiceChannel: null,
				queue: [],
				volume: 2
			};
		}
	}
	return MusicGuild;
});

const client = new CommandoClient({
	commandPrefix: prefix,
	owner: ownerid,
	disableEveryone: true,
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['music', 'Music'],
		['fun', 'Fun'],
		['misc', 'Misc']
	])
	.registerDefaultGroups()
	.registerDefaultCommands({ help: false })
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.once("ready", () => {
	console.log("Ready!");
	client.user.setActivity('donate to my patreon');
});

client.once("reconnecting", () => {
	console.log("Reconnecting!");
});

client.once("disconnect", () => {
	console.log("Disconnected!");
});

client.points = new Enmap({ name: "points" });
client.rankings = new Enmap({ name: "rankings" });

client.on("message", async msg => {
	try {
		if (msg.author.bot) return;

		client.points.ensure(msg.author.id, {
			id: msg.author.id,
			name: msg.author.username,
			points: 10,
		});
	} catch (err) {
		console.log(chaulk.bgRed(err));
	}
});

client.login(token);