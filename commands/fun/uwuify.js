const { Command } = require('discord.js-commando');
const owoify = require('owoify-js').default;

module.exports = class UWUCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'uwu',
			aliases: ['owo'],
			group: 'fun',
			memberName: 'uwu',
			description: 'Uwuifies text',
			examples: ['uwu [text]', 'uwu hello world'],
			args: [
				{
					key: 'text',
					prompt: ':grey_question: You didn\'t give any text to uwuify',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { text }) {
		try {
			msg.say(owoify(text, 'uvu'));
		} catch (err) {
			msg.say(':pensive: Sorry, something went wrong');
			console.log(err);
		}
	}
};