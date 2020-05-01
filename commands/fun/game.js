const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class GameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'game',
			group: 'fun',
			memberName: 'game',
			description: 'Play some games',
			examples: ['coins'],
			args: [
				{
					key: 'game',
					prompt: '❔ You didn\'t specify a game to play',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, { game }) {
		try {
			switch (String(game)) {
				default:
					const embed = new MessageEmbed()
						.setTitle(`Games`)
						.setDescription(
							`\`coinflip\`, \`rps\`\n\n` +
							`Use \`game [command]\` to play a game`
						)
						.setColor(0x00AE86);
					msg.embed(embed);
					break;
				case ('coin'):
				case ('flip'):
				case ('coinflip'):
					this.coinFlip(msg);
					break;
				case ('rps'):
				case ('rockpaperscissors'):
					this.rockPaperScissors(msg);
			}
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(err);
		}
	}

	coinFlip(msg) {
		switch (Math.floor(Math.random() * 2)) {
			case 0:
				msg.say('🐵 Heads!');
				break;
			case 1:
				msg.say('🐒 Tails!');
				break;
		}
		return;
	}

	async rockPaperScissors(msg) {
		let promptMsg = await msg.say('What do you want to throw?');
		promptMsg.react('✊')
			.then(() => promptMsg.react('🧻'))
			.then(() => promptMsg.react('✂️'));

		const filter = (reaction, user) => {
			return (reaction.emoji.name === '✊' || reaction.emoji.name === '✂️' || reaction.emoji.name === '🧻') && user.id === msg.author.id;
		};

		const collector = promptMsg.createReactionCollector(filter, { max: 1, time: 30000 });
		collector.on('collect', (reaction, user) => {
			let opponent = null;

			switch (Math.floor(Math.random() * 3)) {
				case 0:
					opponent = '✊';
					if (reaction.emoji.name === '✂️') {
						msg.say(`${reaction.emoji.name} You lost! ${opponent}`);
					}
					else if (reaction.emoji.name === '🧻') {
						msg.say(`${reaction.emoji.name} You won! ${opponent}`);
					}
					else {
						msg.say(`${reaction.emoji.name} It\'s a tie! ${opponent}`);
					}
					break;
				case 1:
					opponent = '🧻';
					if (reaction.emoji.name === '✊') {
						msg.say(`${reaction.emoji.name} You lost! ${opponent}`);
					}
					else if (reaction.emoji.name === '✂️') {
						msg.say(`${reaction.emoji.name} You won! ${opponent}`);
					}
					else {
						msg.say(`${reaction.emoji.name} It\'s a tie! ${opponent}`);
					}
					break;
				case 2:
					opponent = '✂️';
					if (reaction.emoji.name === '🧻') {
						msg.say(`${reaction.emoji.name} You lost! ${opponent}`);
					}
					else if (reaction.emoji.name === '✊') {
						msg.say(`${reaction.emoji.name} You won! ${opponent}`);
					}
					else {
						msg.say(`${reaction.emoji.name} It\'s a tie! ${opponent}`);
					}
					break;
			}
		});
		collector.on('end', collected => {
			if (collected.size == 0) {
				msg.say('Game has been cancelled');
			}
		});
	}
};