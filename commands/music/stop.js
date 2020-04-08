const { Command } = require('discord.js-commando');

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
				msg.say(':stop_button: Stopped music playback');
				console.log('Stopped music playback');
			}
			else {
				msg.say(':x: There\'s nothing in the queue right now');
				console.log('Stop failed (empty queue');
			}
		} catch (err) {
			msg.say(':pensive: Sorry, something went wrong');
			console.log(err);
		}
	}
};