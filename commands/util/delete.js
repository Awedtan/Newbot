const { Command } = require('discord.js-commando');
const chaulk = require('chalk');

module.exports = class DeleteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'delete',
			group: 'util',
			memberName: 'delete',
			description: 'Deletes a rankings list',
			examples: ['delete [list]', 'delete movies'],
			args: [
				{
					key: 'list',
					prompt: ':grey_question: You didn\'t say what list to delete',
					type: 'string'
				}
			],
			ownerOnly: true
		});
	}

	async run(msg, { list }) {
		try {
			if (this.client.rankings.get(list)) {
				this.client.rankings.delete(list);
				msg.say(`Deleted the ${list} rankings list`);
			}
			else {
				console.log(this.client.rankings.get(list));
				msg.say('That list doesn\'t exist');
				console.log(chaulk.red('Delete failed (invalid list)'));
			}
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(chaulk.bgRed(err));
		}
	}
};