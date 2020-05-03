const { Command } = require('discord.js-commando');

module.exports = class DeleteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'delete',
			group: 'fun',
			memberName: 'delete',
			description: 'Deletes a rankings list',
			examples: ['delete [list]', 'delete movies'],
			args: [
				{
					key: 'list',
					prompt: ':grey_question: You didn\'t say what song to delete',
					type: 'string'
				}
			],
		});
	}

	async run(msg, { list }) {
		try {
			if (this.client.isOwner(msg.author)) {
				if (this.client.rankings.get(list)) {
					this.client.rankings.delete(list);
					msg.say(`Deleted the ${list} rankings list`);
				}
				else {
					console.log(this.client.rankings.get(list));
					msg.say('That list doesn\'t exist');
					console.log('Delete failed');
				}
			}
			else {
				msg.say(':triumph: You can\'t use that command');
				console.log('Delete failed');
			}
		} catch (err) {
			msg.say(':pensive: Sorry, something went wrong');
			console.log(err);
		}
	}
};