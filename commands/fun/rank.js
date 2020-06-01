const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const chaulk = require('chalk');


module.exports = class RankCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rank',
			group: 'fun',
			memberName: 'rank',
			description: 'Create and display your very own rankings list',
			examples: ['rank [list]', 'rank [list] [item] [score]', 'rank movies', 'rank movies CitizenKane 100'],
			args: [
				{
					key: 'list',
					prompt: '❔ You didn\'t specify the rankings list',
					type: 'string'
				},
				{
					key: 'item',
					prompt: '❔ You didn\'t specify the item name',
					type: 'string',
					default: ''
				},
				{
					key: 'score',
					prompt: '❔ You didn\'t specify the score',
					type: 'integer',
					default: ''
				}
			]
		});
	}

	async run(msg, { list, item, score }) {
		try {
			if (item && score) {
				this.client.rankings.ensure(list, {
					item: [],
					score: [],
				});

				this.client.rankings.push(list, item, 'item');
				this.client.rankings.push(list, score, 'score');
				msg.say(`Added ${item} to the ${list} rankings list`);
			}
			else if (!item && !score) {
				try {
					var itemArr = this.client.rankings.get(list).item;
					var scoreArr = this.client.rankings.get(list).score;
				} catch (err) {
					msg.say('❌ That rankings list doesn\'t exist yet');
					console.log(chaulk.red('Rank failed (invalid list)'));
					return;
				}
				for (let j = 0; j < scoreArr.length; j++) {
					for (let i = 0; i < scoreArr.length; i++) {
						if (scoreArr[i] < scoreArr[i + 1]) {
							let tempVar = scoreArr[i];
							scoreArr[i] = scoreArr[i + 1];
							scoreArr[i + 1] = tempVar;
							tempVar = itemArr[i];
							itemArr[i] = itemArr[i + 1];
							itemArr[i + 1] = tempVar;
						}
					}
				}

				const embed = new MessageEmbed()
					.setTitle(list)
					.setDescription("Rankings")
					.setColor(0x00AE86);
				for (let i = 0; i < scoreArr.length; i++) {
					embed.addField(itemArr[i], scoreArr[i]);
				}
				msg.embed(embed);
			}
			else {
				msg.say('❌ Please give valid inputs');
				console.log(chaulk.red('Rank failed (invalid args)'));
			}
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(chaulk.bgRed(err));
		}
	}
};