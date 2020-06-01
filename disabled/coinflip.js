const { Command } = require('discord.js-commando');
const chaulk = require('chalk');

module.exports = class CoinflipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'coinflip',
			aliases: ['cf', 'flip'],
			group: 'fun',
			memberName: 'coinflip',
			description: 'Bet on a coinflip',
			examples: ['coinflip [h/t] [amount]'],
			args: [
				{
					key: 'guess',
					prompt: '❔ You didn\'t make a guess',
					type: 'string'
				},
				{
					key: 'points',
					prompt: '❔ You didn\'t specify an amount of DanCoin',
					type: 'integer'
				}
			],
		});
	}

	async run(msg, { guess, points }) {
		try {
			const validGuesses = 'ht';
			if (validGuesses.indexOf(guess) == -1 || guess.length != 1) return msg.say('Please make a valid guess');

			switch (Math.floor(Math.random() * 2)) {
				case 0:
					if (guess == 'h') {
						msg.say(`🐵 Heads! You won ${points} DanCoin!`);
					}
					else {
						msg.say(`🐒 Tails! You won ${points} DanCoin!`);
					}
					break;
				case 1:
					if (guess == 't') {
						msg.say(`🐵 Heads! You lost ${points} DanCoin!`);
					}
					else {
						msg.say(`🐒 Tails! You lost ${points} DanCoin!`);
					}
					break;
			}
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(chaulk.bgRed(err));
		}
	}
};