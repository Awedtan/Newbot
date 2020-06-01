const { Command } = require('discord.js-commando');
const chaulk = require('chalk');

module.exports = class RPSCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rps',
			aliases: ['rockpaperscissors'],
			group: 'fun',
			memberName: 'rps',
			description: 'Bet on rock-paper-scissors',
			examples: ['rps [amount]'],
			args: [
				{
					key: 'points',
					prompt: '❔ You didn\'t specify an amount of DanCoin',
					type: 'integer'
				}
			],
		});
	}

	async run(msg, { points }) {
		try {
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
							this.playerLose(msg, reaction, opponent, points);
						}
						else if (reaction.emoji.name === '🧻') {
							this.playerWin(msg, reaction, opponent, points);
						}
						else {
							this.playerTie(msg, reaction, opponent);
						}
						break;
					case 1:
						opponent = '🧻';
						if (reaction.emoji.name === '✊') {
							this.playerLose(msg, reaction, opponent, points);
						}
						else if (reaction.emoji.name === '✂️') {
							this.playerWin(msg, reaction, opponent, points);
						}
						else {
							this.playerTie(msg, reaction, opponent);
						}
						break;
					case 2:
						opponent = '✂️';
						if (reaction.emoji.name === '🧻') {
							this.playerLose(msg, reaction, opponent, points);
						}
						else if (reaction.emoji.name === '✊') {
							this.playerWin(msg, reaction, opponent, points);
						}
						else {
							this.playerTie(msg, reaction, opponent);
						}
						break;
				}
			});
			collector.on('end', collected => {
				if (collected.size == 0) {
					msg.say('Game has been cancelled');
				}
			});
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(chaulk.bgRed(err));
		}
	}

	playerWin(msg, reaction, opponent, points) {
		msg.say(`${reaction.emoji.name} You won! ${opponent}`);
		this.client.points.math(msg.author.id, "+", points, "points");
	}
	
	playerLose(msg, reaction, opponent, points) {
		msg.say(`${reaction.emoji.name} You lost! ${opponent}`);
		this.client.points.math(msg.author.id, "-", points, "points");
	}
	
	playerTie(msg, reaction, opponent) {
		msg.say(`${reaction.emoji.name} It\'s a tie! ${opponent}`);
	}
};