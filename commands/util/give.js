const { Command } = require('discord.js-commando');
const chaulk = require('chalk');

module.exports = class GiveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'give',
			group: 'util',
			memberName: 'give',
			description: 'Gives a user some DanCoin',
			examples: ['give [number] [user]', 'give 10 @user'],
			args: [
				{
					key: 'points',
					prompt: '❔ You didn\'t specify an amount of DanCoin',
					type: 'integer'
				}
			],
			ownerOnly: true
		});
	}

	async run(msg, { points }) {
		try {
			this.client.points.ensure(msg.author.id, {
				id: msg.author.id,
				name: msg.author.username,
				points: 10,
			});
			this.client.points.math(msg.mentions.users.first().id, "+", points, "points");
			msg.say(`Gave ${points} DanCoin to ${msg.mentions.users.first().username}`);
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(chaulk.bgRed(err));
		}
	}
};