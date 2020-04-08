const { Command } = require('discord.js-commando');

module.exports = class PauseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pause',
			group: 'music',
			memberName: 'pause',
			description: 'Pauses the music playback',
			examples: ['pause'],
		});
	}

	async run(msg) {
		try {
			if (msg.guild.musicData.queue.length > 0) {
				if (!msg.guild.musicData.dispatcher.paused) {
					msg.guild.musicData.dispatcher.pause(true);
					msg.say('Paused music playback');
					console.log(':pause_button: Paused music playback');
				}
				else {
					msg.say(':x: I\'m already paused');
					console.log('Pause failed (already paused)');
				}
			}
			else {
				msg.say(':x: I\'m not playing anything');
				console.log('Pause failed (empty queue)');
			}
		} catch (err) {
			msg.say(':pensive: Sorry, something went wrong');
			console.log(err);
		}
	}
};