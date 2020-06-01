const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const chaulk = require('chalk');

module.exports = class QueueCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'queue',
			aliases: ['list'],
			group: 'music',
			memberName: 'queue',
			description: 'Displays the song queue',
			examples: ['queue']
		});
	}

	async run(msg) {
		try {
			if (msg.guild.musicData.queue.length > 0) {
				var queueMessage = `:arrow_forward: Now playing - \`${msg.guild.musicData.queue[0].title}\`\n`;
				for (let i = 1; i < msg.guild.musicData.queue.length; i++) {
					queueMessage += `:hash: ${i} - \`${msg.guild.musicData.queue[i].title}\`\n`;
				}
				msg.say(queueMessage);
				console.log(`Displayed ${msg.guild.musicData.queue.length} songs currently playing or in queue`);
			}
			else {
				msg.say('❌ There\'s nothing in the queue right now');
				console.log(chaulk.red('Queue failed (empty queue)'));
			}
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(chaulk.bgRed(err));
		}
	}
};