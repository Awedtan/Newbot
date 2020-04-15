const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = class RepertoireCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'repertoire',
			aliases: ['rep'],
			group: 'fun',
			memberName: 'repertoire',
			description: 'Lists all saved songs',
			examples: ['repertoire'],
		});
	}

	async run(msg) {
		try {
			const files = fs.readdirSync('songs/saved').filter(file => file.endsWith('.wav'));
			var songs = [];

			for (const file of files) {
				songs.push(file);
			}

			const embed = new MessageEmbed()
				.setTitle('Repertoire list')
				.addFields(
					{ name: 'Songs', value: songs, inline: false }
				);
			msg.embed(embed);
			console.log('Displayed repertoire list');
		} catch (err) {
			msg.say(':pensive: Sorry, something went wrong');
			console.log(err);
		}
	}
};