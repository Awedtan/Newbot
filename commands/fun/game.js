const { Command } = require('discord.js-commando');
const { data } = require('./words.json');
const { MessageEmbed } = require('discord.js');
const chaulk = require('chalk');

module.exports = class GameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'game',
			group: 'fun',
			memberName: 'game',
			description: 'Play some games for free',
			examples: ['game [game]'],
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
							`\`cf\`, \`rps\`, \`hangman\`\n\n` +
							`Use \`game [command]\` to play a game`
						)
						.setColor(0x00AE86);
					msg.embed(embed);
					break;
				case ('coin'):
				case ('flip'):
				case ('cf'):
				case ('coinflip'):
					this.coinFlip(msg);
					break;
				case ('rps'):
				case ('rockpaperscissors'):
					this.rockPaperScissors(msg);
					break;
				case ('hangman'):
				case ('hm'):
					this.hangman(msg);
					break;
			}
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(chaulk.bgRed(err));
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

	async hangman(msg) {		
		const word = await data[Math.floor(Math.random() * data.length)];
		var badTries = 0;
		var correctGuesses = [];
		var badGuesses = '';
		var asciiMessage = await msg.say(this.showHangman(badTries, badGuesses));
		var messageContent = '';
		for (let i = 0; i < word.length; i++) {
			correctGuesses[i] = null;
			messageContent += '❔';
		}
		var message = await msg.say(messageContent);

		console.log('Started hangman game, the word is: ' + chaulk.black(word));
		messageContent = '';

		const filter = m => (m.content.length == 1);
		const collector = msg.channel.createMessageCollector(filter);

		collector.on('collect', m => {
			let bool = false;
			for (let i = 0; i < word.length; i++) {
				if (word.charAt(i) === m.content) {
					correctGuesses[i] = m.content;
					bool = true;
				}
			}
			if (!bool && badGuesses.indexOf(m.content) == -1) {
				badTries++;
				badGuesses += m.content + ' ';
				if (badTries > 5) {
					msg.say(`You lose! The word was: ${word}`);
					collector.stop();
					asciiMessage.edit(this.showHangman(badTries, badGuesses));
					return;
				}
			}

			asciiMessage.edit(this.showHangman(badTries, badGuesses));

			for (let i = 0; i < word.length; i++) {
				if (correctGuesses[i] == null) {
					messageContent += '❔';
				}
				else {
					messageContent += `:regional_indicator_${correctGuesses[i]}:`;
				}
			}
			message.edit(messageContent);
			if (messageContent.indexOf('❔') == -1) {
				msg.say('You win!');
					collector.stop();
					return;
			}
			messageContent = '';
		});
	}
	
	showHangman(badTries, badGuesses) {
		let ascii = '```\n' +
			'_________\n' +
			'|       |\n';
		let segments = 4;

		if (badTries > 0) {
			ascii += '|       O\n';
			segments--;
		}

		if (badTries === 2) {
			ascii += '|       |\n';
			segments--;
		} else if (badTries === 3) {
			ascii += '|      /|\n';
			segments--;
		} else if (badTries >= 4) {
			ascii += '|      /|\\\n';
			segments--;
		}

		if (badTries === 5) {
			ascii += '|      / \n';
			segments--;
		} else if (badTries >= 6) {
			ascii += '|      / \\\n';
			segments--;
		}

		for (let i = 0; i < segments; i++) {
			ascii += '|\n';
		}
		ascii += 'Incorrect guesses: ' + badGuesses + '```';
		return ascii;
	}
};