const { Command } = require('discord.js-commando');
const config = require('./../../config.json');
const { MessageEmbed } = require('discord.js');
const ytdl = require("ytdl-core");
const search = require("youtube-search");

module.exports = class SearchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'search',
			aliases: ['find'],
			group: 'music',
			memberName: 'search',
			description: 'Searches youtube for a song',
			examples: ['search my salsa', 'search https://youtu.be/LmR7G208ug4'],
			args: [
				{
					key: 'text',
					prompt: ':grey_question: You didn\'t say what song to search',
					type: 'string'
				}
			]
		});
		this.opts = {
			maxResults: 10,
			key: config.youtube_api,
			type: "video"
		};
	}
	async run(msg, { text }) {
		if (text) {
			try {
				const voiceChannel = msg.member.voice.channel;
				if (!voiceChannel) return msg.say("You need to be in a voice channel to use that");

				const permissions = voiceChannel.permissionsFor(msg.client.user);
				if (!permissions.has('CONNECT')) return msg.say('I don\'t have permission to join your voice channel.');
				if (!permissions.has('SPEAK')) return msg.say('I don\'t have permission to speak in your voice channel.');

				const validLink = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/;
				
				if (validLink.test(text)) {
					const songInfo = await ytdl.getInfo(text);
					const song = {
						title: songInfo.title,
						url: songInfo.video_url
					};
					
					if (!msg.guild.musicData.isPlaying) {
						msg.guild.musicData.message = msg;
						msg.guild.musicData.queue.push(song);
						msg.guild.musicData.connection = await voiceChannel.join();
						msg.guild.musicData.voiceChannel = voiceChannel;
						this.play(msg, song);
					}
					else {
						msg.guild.musicData.queue.push(song);
						console.log(`Queued ${song.title}`);
						return msg.say(`:+1: \`${song.title}\` was added to the queue`);
					}
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

					let embed = new MessageEmbed()
						.setTitle('Select which song you\'d like by typing its number (0 to cancel)')
						.setDescription(titles.join('\n'))
						.setColor(0x00AE86);
					msg.embed(embed);

					let filter = m => (m.author.id === msg.author.id) && (m.content >= 0) && (m.content <= searches.length);
					let collected = await msg.channel.awaitMessages(filter, { max: 1, time: 30000 });
					if (collected.first().content == 0) {
						console.log("Search has been cancelled");
						return msg.channel.send(
							":crab: Search is cancelled :crab:"
						);
					}

					let selected = searches[collected.first().content - 1];
					embed = new MessageEmbed()
						.setTitle(`${selected.title}`)
						.setURL(`${selected.link}`)
						.setThumbnail(`${selected.thumbnails.default.url}`)
						.setColor(0x00AE86);
					msg.embed(embed);

					const songInfo = await ytdl.getInfo(`${selected.link}`);
					const song = {
						title: songInfo.title,
						url: songInfo.video_url
					};

					if (!msg.guild.musicData.isPlaying) {
						msg.guild.musicData.message = msg;
						msg.guild.musicData.queue.push(song);
						msg.guild.musicData.connection = await voiceChannel.join();
						msg.guild.musicData.voiceChannel = voiceChannel;
						this.play(msg, song);
					}
					else {
						msg.guild.musicData.queue.push(song);
						console.log(`Queued ${song.title}`);
						return msg.say(`:+1: \`${song.title}\` was added to the queue`);
					}
				}
			} catch (err) {
				msg.say(':pensive: Sorry, something went wrong');
				console.log(err);
			}
		}
	}

	play(msg, song) {
		msg.guild.musicData.isPlaying = true;
		if (!song) return msg.guild.musicData.isPlaying = false;

		const dispatcher = msg.guild.musicData.connection
			.play(ytdl(song.url), { highWaterMark: 64 })
			.on("finish", () => {
				msg.guild.musicData.queue.shift();
				this.play(msg, msg.guild.musicData.queue[0]);
			})
			.on("error", error => console.error(error));
		dispatcher.setVolumeLogarithmic(msg.guild.musicData.volume / 5);

		msg.guild.musicData.dispatcher = dispatcher;
		console.log(`Now playing ${song.title}`);
		msg.guild.musicData.message.say(`:arrow_forward: Now playing \`${song.title}\``);
	}
};