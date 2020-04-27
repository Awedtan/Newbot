const { Command } = require('discord.js-commando');

module.exports = class TakeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'take',
			group: 'fun',
			memberName: 'take',
			description: 'Takes away a user\'s DanCoin',
			examples: ['take [number] [user]', 'take 10 @user'],
			args: [
				{
					key: 'points',
					prompt: ':grey_question: You didn\'t specify an amount of DanCoin',
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
				points: 0,
			});
			if (this.client.isOwner(msg.author)) {
				this.client.points.math(msg.mentions.users.first().id, "-", points, "points");
				msg.say(`Took ${points} DanCoin from ${msg.mentions.users.first().username}`);
			}
		} catch (err) {
			msg.say(':pensive: Sorry, something went wrong');
			console.log(err);
		}
	}
};