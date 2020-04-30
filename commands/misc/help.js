const { prefix } = require("./../../config.json");
const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			group: 'misc',
			memberName: 'help',
			description: 'Displays the help menu',
			examples: ['help'],
			args: [
				{
					key: 'text',
					prompt: 'Which command would you like to view the help for?',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, { text }) {
		try {
			if (!text) {
				const embed = new MessageEmbed()
					.setTitle(`Help`)
					.setDescription(
						`Current prefix: \`${prefix}\`\n\n` +
						`Music\n` +
						`\`play\`, \`search\`, \`skip\`, \`remove\`, \`queue\`, \`stop\`, \`leave\`, \`pause\`, \`resume\`\n\n` +
						`Fun\n` +
						`\`game\`, \`coins\`, \`leaderboard\`, \`uwuify\`\n\n` +
						`Use \`help [command]\` for more information about a command`
					)
					.setColor(0x00AE86);
				msg.embed(embed);
			}
			else {
				const commands = this.client.registry.findCommands(text, false, '');

				var examples = commands[0].examples[0];
				for (let i = 1; i < commands[0].examples.length; i++) {
					examples += '\n' + commands[0].examples[i];
				}

				if (commands[0].aliases.length > 0) {
					var aliases = commands[0].aliases[0];
					for (let i = 1; i < commands[0].aliases.length; i++) {
						aliases += ', ' + commands[0].aliases[i];
					}

					const embed = new MessageEmbed()
						.setTitle('Help')
						.setDescription(commands[0].name)
						.addFields(
							{ name: 'Description', value: commands[0].description, inline: false },
							{ name: 'Examples', value: examples, inline: false },
							{ name: 'Aliases', value: aliases, inline: false },
						)
						.setColor(0x00AE86);
					msg.embed(embed);
				}
				else {
					const embed = new MessageEmbed()
						.setTitle('Help')
						.setDescription(commands[0].name)
						.addFields(
							{ name: 'Description', value: commands[0].description, inline: false },
							{ name: 'Examples', value: examples, inline: false },
						)
						.setColor(0x00AE86);
					msg.embed(embed);
				}
			}
			console.log(`Displayed help menu`);
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(err);
		}
	}
};