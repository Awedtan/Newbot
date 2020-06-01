const { Command } = require('discord.js-commando');
const chaulk = require('chalk');

module.exports = class LeaveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'leave',
			aliases: ['disconnect', 'dc'],
			group: 'music',
			memberName: 'leave',
			description: 'Leaves the current voice channel',
			examples: ['leave']
		});
	}

	async run(msg) {
		try {
			if (msg.guild.musicData.voiceChannel) {
				msg.say(`:door: Left ${msg.guild.musicData.voiceChannel.name}`);
				console.log(`Left ${msg.guild.musicData.voiceChannel.name}`);

				msg.guild.musicData.voiceChannel.leave();
				msg.guild.musicData.isPlaying = false;
				msg.guild.musicData.connection = null;
				msg.guild.musicData.dispatcher = null;
				msg.guild.musicData.message = null;
				msg.guild.musicData.voiceChannel = null;
				msg.guild.musicData.queue = [];
				msg.guild.message.delete();
			}
			else {
				msg.say('❌ I\'m not in a voice channel');
				console.log(chaulk.red('Leave failed (not in channel)'));
			}
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(chaulk.bgRed(err));
		}
	}
};