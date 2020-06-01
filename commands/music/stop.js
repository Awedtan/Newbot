const { Command } = require('discord.js-commando');
const chaulk = require('chalk');

module.exports = class StopCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'stop',
			aliases: ['purge'],
			group: 'music',
			memberName: 'stop',
			description: 'Stops playback and clears the queue',
			examples: ['stop']
		});
	}

	async run(msg) {
		try {
			if (msg.guild.musicData.queue.length > 0) {
				msg.guild.musicData.dispatcher.end();
				msg.guild.musicData.queue = [];
				msg.guild.message.delete();
				msg.say('⏹️ Stopped music playback');
				console.log('Stopped music playback');
			}
			else {
				msg.say('❌ There\'s nothing in the queue right now');
				console.log(chaulk.red('Stop failed (empty queue'));
			}
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(chaulk.bgRed(err));
		}
	}
};