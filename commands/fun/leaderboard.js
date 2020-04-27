const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class LeaderboardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'leaderboard',
			aliases: ['board', 'top'],
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
				.setDescription("Top 10 richest users")
				.setColor(0x00AE86);
			for (const data of top10) {
				embed.addField(data.name, `${data.points} DanCoin`);
			}
			msg.embed(embed);
		} catch (err) {
			msg.say(':pensive: Sorry, something went wrong');
			console.log(err);
		}
	}
};