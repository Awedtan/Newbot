const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const config = require("./../../config.json");
const ytdl = require("ytdl-core");
const search = require("youtube-search");

module.exports = class ReplyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'search',
			group: 'music',
			memberName: 'search',
			description: 'Searches youtube for a song',
			examples: ['search a song'],
			args: [
				{
					key: 'text',
					prompt: 'What song do you want to search?',
					type: 'string'
				}
			]
		});
		this.queue = new Map();
		this.opts = {
			maxResults: 10,
			key: "",
			type : "video"
		};
	}
	async run(message, { text }) {
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.say("You need to be in a voice channel to use that");

		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) return msg.say('I don\'t have permission to join your voice channel.');
		if (!permissions.has('SPEAK')) return msg.say('I don\'t have permission to speak in your voice channel.');

		const validLink = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/;

		if (validLink.test(text)) {
			
		}
		else{
			const query = text;
			let results = await search(query, this.opts);
			let searches = results.results;
			let index = 0;
			let titles = searches.map(result => {
				index++;
				return index + ") " + result.title;
			});
			console.log(titles);
			
			let embed = new RichEmbed()
				.setTitle('Select which song you\'d like by typing its number (0 to cancel)')
				.setDescription(titles.join('\n'))
			message.embed(embed);
			
			let filter = m => (m.author.id === message.author.id) && (m.content >= 0) && (m.content <= searches.length);
			let collected = await message.channel.awaitMessages(filter, { max: 1, time: 30000 });
			if (collected.first().content == 0) {
				console.log("Search has been cancelled");
				return message.channel.send(
					":crab: Search is cancelled :crab:"
				);
			}
			
			let selected = searches[collected.first().content - 1];
			embed = new RichEmbed()
				.setTitle(`${selected.title}`)
				.setURL(`${selected.link}`)
				.setThumbnail(`${selected.thumbnails.default.url}`);
			message.embed(embed);
		}
	}
	
	play(guild, song, queue) {
		if (!song) return;

		const serverQueue = this.queue.get(guild.id);
		const dispatcher = serverQueue.connection
			.play(ytdl(song.url), { highWaterMark: 1<<30})
			.on("finish", () => {
				serverQueue.songs.shift();
				this.play(guild, serverQueue.songs[0], queue);
			})
			.on("error", error => console.error(error));

		dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
		console.log(`Now playing ${song.title}`);
		serverQueue.message.say(`:arrow_forward: Now playing \`${song.title}\``);
	}
};