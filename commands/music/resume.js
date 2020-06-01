const { Command } = require('discord.js-commando');
const search = require("youtube-search");
const chaulk = require('chalk');

module.exports = class ResumeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'resume',
			group: 'music',
			memberName: 'resume',
			description: 'Resumes the music playback',
			examples: ['resume'],
		});
	}

	async run(msg) {
		try {
			if (msg.guild.musicData.queue.length > 0) {
				if (msg.guild.musicData.dispatcher.paused) {
					msg.guild.musicData.dispatcher.resume();
					try {
						msg.guild.message.delete();
					} catch (err) { }
					msg.guild.message = await msg.say('Resumed music playback');
					console.log('▶️ Resumed music playback');
				}
				else {
					msg.say('❌ I\'m not paused');
					console.log(chaulk.red('Resume failed (not paused)'));
				}
			}
			else {
				msg.say('❌ I\'m not playing anything');
				console.log(chaulk.red('Resume failed (empty queue)'));
			}
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(chaulk.bgRed(err));
		}
	}
};