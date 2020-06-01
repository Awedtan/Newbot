const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const config = require('./../../config.json');
const search = require("youtube-search");
const ytdl = require("ytdl-core");
const chaulk = require('chalk');

module.exports = class PlayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'play',
			aliases: ['paly', 'p'],
			group: 'music',
			memberName: 'play',
			description: 'Plays/enqueues a song',
			examples: ['play rocket man', 'play https://youtu.be/dQw4w9WgXcQ'],
			args: [
				{
					key: 'text',
					prompt: '❔ You didn\'t say what song to play',
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
				if (!voiceChannel) return msg.say('You need to be in a voice channel to use that');

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
						msg.say(`👍 \`${song.title}\` was added to the queue`);
					}
				}
				else {
					const query = text;
					let results = await search(query, this.opts);
					let searches = results.results;
					let index = 0;
					let titles = searches.map(result => {
						index++;
						return index + ') ' + result.title;
					});
					let selected = searches[0];

					try {
						let embed = new MessageEmbed()
							.setTitle(`${selected.title}`)
							.setURL(`${selected.link}`)
							.setThumbnail(`${selected.thumbnails.default.url}`)
							.setColor(0x00AE86);
						try {
							msg.guild.message.delete();
						} catch (err) { }
						msg.guild.message = await msg.embed(embed);
					} catch (err) {
						console.log("No results");
						return msg.say(`😔 No results were found, double check your spelling 😤`);
					}

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
						msg.say(`👍 \`${song.title}\` was added to the queue`);
					}
				}
			} catch (err) {
				msg.say('😔 Sorry, something went wrong');
				console.log(chaulk.bgRed(err));
			}
		}
	}

	async play(msg, song) {
		msg.guild.musicData.isPlaying = true;
		if (!song) return msg.guild.musicData.isPlaying = false;

		msg.guild.musicData.dispatcher = msg.guild.musicData.connection
			.play(ytdl(song.url), { highWaterMark: 64 })
			.on('finish', () => {
				msg.guild.musicData.queue.shift();
				this.play(msg, msg.guild.musicData.queue[0]);
			})
			.on('error', error => console.error(error));
		msg.guild.musicData.dispatcher.setVolumeLogarithmic(msg.guild.musicData.volume / 5);

		console.log(`Now playing ${song.title}`);
		try {
			msg.guild.message.delete();
		} catch (err) { }
		msg.guild.message = await msg.guild.musicData.message.say(`:arrow_forward: Now playing \`${song.title}\``);
	}
};