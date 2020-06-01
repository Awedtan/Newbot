const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const chaulk = require('chalk');

module.exports = class LeaderboardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'leaderboard',
			aliases: ['board', 'top', 'lb'],
			group: 'fun',
			memberName: 'leaderboard',
			description: 'Displays the DanCoin leaderboard',
			examples: ['leaderboard'],
		});
	}

	async run(msg) {
		try {
			const filtered = this.client.points.array();
			const sorted = filtered.sort((a, b) => b.points - a.points);
			const top10 = sorted.splice(0, 10);

			const embed = new MessageEmbed()
				.setTitle("Leaderboard")
				.setDescription("The top 10 richest users")
				.setColor(0x00AE86);
			for (const data of top10) {
				embed.addField(data.name, `${data.points} DanCoin`);
			}
			msg.embed(embed);
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(chaulk.bgRed(err));
		}
	}
};