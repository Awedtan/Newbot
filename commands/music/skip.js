const { Command } = require('discord.js-commando');

module.exports = class SkipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'skip',
			aliases: ['next'],
			group: 'music',
			memberName: 'skip',
			description: 'Skips the current song',
			examples: ['skip']
		});
	}

	async run(msg) {
		try {
			if (msg.guild.musicData.queue.length > 0) {
				msg.say(`:next_track: Skipped \`${msg.guild.musicData.queue[0].title}\``);
				console.log(`Skipped \`${msg.guild.musicData.queue[0].title}\``);
				msg.guild.musicData.dispatcher.end();
			}
			else{
				msg.say('❌ There\'s nothing to skip');
				console.log('Skip failed (empty queue');
			}
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(err);
		}
	}
};