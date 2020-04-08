const { Command } = require('discord.js-commando');

module.exports = class RemoveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'remove',
			group: 'music',
			memberName: 'remove',
			description: 'Removes a song from the queue',
			examples: ['remove 2'],
			args: [
				{
					key: 'num',
					prompt: ':grey_question: You didn\'t say what song to remove',
					type: 'integer'
				}
			]
		});
	}

	async run(msg, { num }) {
		try {
			if (num < msg.guild.musicData.queue.length && num > 0) {
				msg.say(`:eject: Removed ${msg.guild.musicData.queue[num].title}`);
				console.log(`Removed ${msg.guild.musicData.queue[num].title}`);
				msg.guild.musicData.queue.splice(num, 1);
			}
			else {
				msg.say(':x: Invalid queue position');
			}
		} catch (err) {
			msg.say(':pensive: Sorry, something went wrong');
			console.log(err);
		}
	}
};