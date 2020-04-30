const { Command } = require('discord.js-commando');

module.exports = class GiveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'give',
			group: 'fun',
			memberName: 'give',
			description: 'Gives a user some DanCoin',
			examples: ['give [number] [user]', 'give 10 @user'],
			args: [
				{
					key: 'points',
					prompt: '❔ You didn\'t specify an amount of DanCoin',
					type: 'integer'
				}
			]
		});
	}

	async run(msg, { points }) {
		try {
			this.client.points.ensure(msg.author.id, {
				id: msg.author.id,
				name: msg.author.username,
				points: 10,
			});
			if (this.client.isOwner(msg.author)) {
				this.client.points.math(msg.mentions.users.first().id, "+", points, "points");
				msg.say(`Gave ${points} DanCoin to ${msg.mentions.users.first().username}`);
			}
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(err);
		}
	}
};