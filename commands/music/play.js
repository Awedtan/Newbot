const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const ytdl = require("ytdl-core");
const search = require("youtube-search");

module.exports = class ReplyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'play',
			group: 'music',
			memberName: 'play',
			description: 'Plays/enqueues a song',
			examples: ['play a song'],
			args: [
				{
					key: 'text',
					prompt: 'What song do you want to play?',
					type: 'string'
				}
			]
		});
		this.queue = new Map();
		this.opts = {
			maxResults: 10,
			key: "AIzaSyCPY10BHGa4YEWSlqq3K6GT_0fNsBknBmA",
			type: "video"
		};
	}
	async run(msg, { text }) {
		try {
			const voiceChannel = msg.member.voice.channel;
			if (!voiceChannel) return msg.say("You need to be in a voice channel to use that");

			const permissions = voiceChannel.permissionsFor(msg.client.user);
			if (!permissions.has('CONNECT')) return msg.say('I don\'t have permission to join your voice channel.');
			if (!permissions.has('SPEAK')) return msg.say('I don\'t have permission to speak in your voice channel.');

			const validLink = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/;
			const serverQueue = this.queue.get(msg.guild.id);

			if (validLink.test(text)) {

			}
			else {
				const query = text;
				let results = await search(query, this.opts);
				let searches = results.results;
				let index = 0;
				let titles = searches.map(result => {
					index++;
					return index + ") " + result.title;
				});
				console.log(titles);
				let selected = searches[0];

				try {
					let embed = new MessageEmbed()
						.setTitle(`${selected.title}`)
						.setURL(`${selected.link}`)
						.setThumbnail(`${selected.thumbnails.default.url}`);
					msg.embed(embed);
				} catch (err) {
					console.log("No results");
					return msg.say(`:pensive: No results were found, double check your spelling :triumph:`);
				}

				const songInfo = await ytdl.getInfo(`${selected.link}`);
				const song = {
					title: songInfo.title,
					url: songInfo.video_url
				};

				if (!serverQueue || serverQueue.songs.length == 0) {
					const queueConstruct = {
						message: null,
						voiceChannel,
						connection: null,
						songs: [],
						volume: 5
					};
					queueConstruct.message = msg;
					queueConstruct.songs.push(song);
					queueConstruct.connection = await voiceChannel.join();

					this.queue.set(msg.guild.id, queueConstruct);
					this.play(msg.guild, song, this.queue)
				}
				else {
					serverQueue.songs.push(song);
					console.log(`Queued ${song.title}`);
					return msg.say(`:+1: \`${song.title}\` was added to the queue`);
				}
			}
		} catch (err) {
			console.log(err);
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