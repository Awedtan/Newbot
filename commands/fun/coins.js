const { Command } = require('discord.js-commando');

module.exports = class CoinsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'coins',
			aliases: ['score', 'points'],
			group: 'fun',
			memberName: 'coins',
			description: 'Displays your DanCoin balance',
			examples: ['coins'],
		});
	}

	async run(msg) {
		try {
			msg.say(`You currently have ${this.client.points.get(msg.author.id, "points")} DanCoin`);
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(err);
		}
	}
};