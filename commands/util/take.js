const { Command } = require('discord.js-commando');
const chaulk = require('chalk');

module.exports = class TakeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'take',
			group: 'util',
			memberName: 'take',
			description: 'Takes away a user\'s DanCoin',
			examples: ['take [number] [user]', 'take 10 @user'],
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
			this.client.points.math(msg.mentions.users.first().id, "-", points, "points");
			msg.say(`Took ${points} DanCoin from ${msg.mentions.users.first().username}`);
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(chaulk.bgRed(err));
		}
	}
};