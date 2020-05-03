const { prefix, token, ownerid } = require("./config.json");
const { CommandoClient } = require('discord.js-commando');
const { Structures, Collection } = require('discord.js');
const Enmap = require("enmap");
const path = require('path');
const fs = require("fs");

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

			this.commands = new Collection();

			const funCommands = fs.readdirSync('./commands/fun').filter(file => file.endsWith('.js'));
			const musicCommands = fs.readdirSync('./commands/music').filter(file => file.endsWith('.js'));
			const miscCommands = fs.readdirSync('./commands/misc').filter(file => file.endsWith('.js'));

			for (const file of funCommands) {
				const command = require(`./commands/fun/${file}`);
				this.commands.set(command.name, command);
			}
			for (const file of musicCommands) {
				const command = require(`./commands/music/${file}`);
				this.commands.set(command.name, command);
			}
			for (const file of miscCommands) {
				const command = require(`./commands/misc/${file}`);
				this.commands.set(command.name, command);
			}

			console.log(this.client.registry.findCommands(''.command, false, ''));
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
	.registerCommandsIn(path.join(__dirname, 'commands'))
	;

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
	if (msg.author.bot) return;

	client.points.ensure(msg.author.id, {
		id: msg.author.id,
		name: msg.author.username,
		points: 10,
	});
});

client.login(token);