const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

//Combat formula without luck: health - (enemyAttack - defense/2)
//Health is the amount of health (health)
//Attack is how many health points to deduct (attack)
//Defense blocks damage by an amount of (defense/2)
//Defense depreciates above a value of 10 at 10% per combat round
//Luck is the % chance to either crit or dodge (luck%)
//Crits double damage, dodges completely nullify damage
//Critical hits are calculated first and cannot be dodged

//Attack increases unit attack
//Defense increases unit defense (10% depreciation above 10)
//Health increases unit health
//Luck increases unit luck
//Equipment is single-use random stat buff (x2 value)

class player {
	constructor(user, units) {
		this.username = user.username;
		this.id = user.id;
		this.units = [new unitClass()];
	}
}

class slotClass {
	constructor() {
		this.buff = '';
		this.value = 0;
		this.occupied = 'none';
	}
};

class equipmentClass {
	constructor(buff, value) {
		this.buff = buff;
		this.value = value;
	}
};

class unitClass {
	constructor() {
		this.health = 50;
		this.attack = 1;
		this.defense = 0;
		this.luck = 0;
		this.equipment = new equipmentClass('Nothing', 0);
	}
};

module.exports = class CardsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cards',
			group: 'fun',
			memberName: 'cards',
			description: 'Play an untitled game',
			examples: ['cards [opponent]', 'cards @user'],
		});
	}

	async run(msg) {
		try {
			try {
				var playerOne = new player(msg.author);
				var playerTwo = new player(msg.mentions.users.first());
			} catch (err) {
				msg.say('Please choose your opponent');
				return;
			}

			const buffs = ['Attack', 'Defense', 'Health', 'Luck', 'Equipment'];

			var slots = [
				[new slotClass(), new slotClass()],
				[new slotClass(), new slotClass()]
			];

			var playerOneTurn = true;
			var oneChance = 0, twoChance = 0, rounds = 1;
			var rounds = 1;

			var playerOneUnitsEmbed = await this.startPlayerOneUnitsEmbed(msg, playerOne);
			var playerTwoUnitsEmbed = await this.startPlayerTwoUnitsEmbed(msg, playerTwo);
			var slotsEmbed = await this.startSlotsEmbed(msg, playerOneTurn, rounds, slots, playerOne, playerTwo);

			this.gameLoop(msg, playerOne, playerTwo, playerOneUnitsEmbed, playerTwoUnitsEmbed, slotsEmbed, playerOneTurn, rounds, buffs, slots, oneChance, twoChance);
		} catch (err) {
			msg.say('😔 Sorry, something went wrong');
			console.log(err);
		}
	}

	startPlayerOneUnitsEmbed(msg, playerOne) {
		return new Promise(resolve => {
			var embed = new MessageEmbed()
				.setTitle(`${playerOne.username}'s units`)
				.setColor(0xFF0000);

			for (let i = 0; i < playerOne.units.length; i++) {
				embed.addField(`Unit ${i + 1}`,
					`Health: ${playerOne.units[i].health}\n` +
					`Attack: ${playerOne.units[i].attack}\n` +
					`Defense: ${playerOne.units[i].defense}\n` +
					`Luck: ${playerOne.units[i].luck}\n` +
					`Equipment: +${playerOne.units[i].equipment.value} ${playerOne.units[i].equipment.buff}`
					, true);
			}
			resolve(msg.embed(embed));
		});
	}

	startPlayerTwoUnitsEmbed(msg, playerTwo) {
		return new Promise(resolve => {
			var embed = new MessageEmbed()
				.setTitle(`${playerTwo.username}'s units`)
				.setColor(0xFF0000);

			for (let i = 0; i < playerTwo.units.length; i++) {
				embed.addField(`Unit ${i + 1}`,
					`Health: ${playerTwo.units[i].health}\n` +
					`Attack: ${playerTwo.units[i].attack}\n` +
					`Defense: ${playerTwo.units[i].defense}\n` +
					`Luck: ${playerTwo.units[i].luck}\n` +
					`Equipment: +${playerTwo.units[i].equipment.value} ${playerTwo.units[i].equipment.buff}`
					, true);
			}
			resolve(msg.embed(embed));
		});
	}

	startSlotsEmbed(msg, playerOneTurn, rounds, slots, playerOne, playerTwo) {
		return new Promise(resolve => {
			var embed = new MessageEmbed().setColor(0xFF0000);

			if (playerOneTurn) {
				embed.setTitle(`Round ${rounds} - ${playerOne.username}'s turn`)
			}
			else {
				embed.setTitle(`Round ${rounds} - ${playerTwo.username}'s turn`)
			}
			resolve(msg.embed(embed));
		});
	}

	async editEmbed(msg, playerOne, playerTwo, playerOneUnitsEmbed, playerTwoUnitsEmbed, slotsEmbed, playerOneTurn, rounds, slots) {
		var embed = new MessageEmbed()
			.setTitle(`${playerOne.username}'s units`)
			.setColor(0xFF0000);

		for (let i = 0; i < playerOne.units.length; i++) {
			embed.addField(`Unit ${i + 1}`,
				`Health: ${playerOne.units[i].health}\n` +
				`Attack: ${playerOne.units[i].attack}\n` +
				`Defense: ${playerOne.units[i].defense}\n` +
				`Luck: ${playerOne.units[i].luck}\n` +
				`Equipment: +${playerOne.units[i].equipment.value} ${playerOne.units[i].equipment.buff}`
				, true);
		}
		playerOneUnitsEmbed.edit(embed);

		var embed = new MessageEmbed()
			.setTitle(`${playerTwo.username}'s units`)
			.setColor(0xFF0000);

		for (let i = 0; i < playerTwo.units.length; i++) {
			embed.addField(`Unit ${i + 1}`,
				`Health: ${playerTwo.units[i].health}\n` +
				`Attack: ${playerTwo.units[i].attack}\n` +
				`Defense: ${playerTwo.units[i].defense}\n` +
				`Luck: ${playerTwo.units[i].luck}\n` +
				`Equipment: +${playerTwo.units[i].equipment.value} ${playerTwo.units[i].equipment.buff}`
				, true);
		}
		playerTwoUnitsEmbed.edit(embed);

		var embed = new MessageEmbed().setColor(0xFF0000);
		if (playerOneTurn) {
			embed.setTitle(`Round ${rounds}`);
			embed.setDescription(`${playerOne.username} has first turn`);
		}
		else {
			embed.setTitle(`Round ${rounds}`);
			embed.setDescription(`${playerTwo.username} has first turn`);
		}
		let k = 0;
		for (let i = 0; i < slots.length; i++) {
			for (let j = 0; j < slots[0].length; j++) {
				k++;
				embed.addField(`Slot ${k}`,
					`+${slots[i][j].value} ${slots[i][j].buff}\n` +
					`Taken by: ${slots[i][j].occupied}`,
					true);
			}
			embed.addField('\u200B', '\u200B');
		}
		slotsEmbed.edit(embed);
	}

	async gameLoop(msg, playerOne, playerTwo, playerOneUnitsEmbed, playerTwoUnitsEmbed, slotsEmbed, playerOneTurn, rounds, buffs, slots, oneChance, twoChance) {

		for (let i = 0; i < slots.length; i++) {
			for (let j = 0; j < slots[0].length; j++) {
				const rng = Math.ceil((Math.random() * 100));

				if (rng < 100 - oneChance) {
					slots[i][j].buff = buffs[Math.floor((Math.random() * buffs.length))];
					slots[i][j].value = 1;
				}
				else if (rng < 105 - twoChance) {
					slots[i][j].buff = buffs[Math.floor((Math.random() * buffs.length))];
					slots[i][j].value = 2;
				}
				else {
					slots[i][j].buff = buffs[Math.floor((Math.random() * buffs.length))];
					slots[i][j].value = 3;
				}
				slots[i][j].occupied = 'none';
			}
		}

		//Double slot values if is equipment
		for (let i = 0; i < slots.length; i++) {
			for (let j = 0; j < slots[0].length; j++) {
				if (slots[i][j].buff === 'Equipment') {
					slots[i][j].value *= 2;
				}
			}
		}

		this.editEmbed(msg, playerOne, playerTwo, playerOneUnitsEmbed, playerTwoUnitsEmbed, slotsEmbed, playerOneTurn, rounds, slots);

		// Alternate between player turns
		for (let i = 0; i < slots.length; i++) {
			for (let j = 0; j < slots[0].length; j++) {
				if (playerOneTurn) {
					if (j % 2 == 0) {
						let tempVar = await this.playerTurn(msg, slots, playerOne);
						if (tempVar == 1) return;
						this.editEmbed(msg, playerOne, playerTwo, playerOneUnitsEmbed, playerTwoUnitsEmbed, slotsEmbed, playerOneTurn, rounds, slots);
					}
					else {
						let tempVar = await this.playerTurn(msg, slots, playerTwo);
						if (tempVar == 1) return;
						this.editEmbed(msg, playerOne, playerTwo, playerOneUnitsEmbed, playerTwoUnitsEmbed, slotsEmbed, playerOneTurn, rounds, slots);
					}
				}
				else {
					if (j % 2 == 0) {
						let tempVar = await this.playerTurn(msg, slots, playerTwo);
						if (tempVar == 1) return;
						this.editEmbed(msg, playerOne, playerTwo, playerOneUnitsEmbed, playerTwoUnitsEmbed, slotsEmbed, playerOneTurn, rounds, slots);
					}
					else {
						let tempVar = await this.playerTurn(msg, slots, playerOne);
						if (tempVar == 1) return;
						this.editEmbed(msg, playerOne, playerTwo, playerOneUnitsEmbed, playerTwoUnitsEmbed, slotsEmbed, playerOneTurn, rounds, slots);
					}
				}
			}
		}

		if (rounds % 3 == 0) {
			let tempVar = await this.combatTurn(msg, slots, playerOne, playerTwo);
		}

		for (let i = 0; i < playerOne.units.length; i++) {
			playerOne.units[0].defense -= Math.floor(playerOne.units[0].defense / 10);
			playerTwo.units[0].defense -= Math.floor(playerOne.units[0].defense / 10);
		}

		oneChance += 30 + Math.floor(rounds / 3.0);
		twoChance += 1 + Math.floor(rounds / 4.0);
		rounds++;

		if (playerOneTurn) playerOneTurn = false;
		else playerOneTurn = true;
		this.gameLoop(msg, playerOne, playerTwo, playerOneUnitsEmbed, playerTwoUnitsEmbed, slotsEmbed, playerOneTurn, rounds, buffs, slots, oneChance, twoChance);
	}

	async playerTurn(msg, slots, player) {
		const buffs = ['Attack', 'Defense', 'Health', 'Luck', 'Equipment'];
		let promptMsg = await msg.say(`${player.username}, react to select a slot`);

		if (slots[0][0].occupied === 'none') await promptMsg.react('1️⃣');
		if (slots[0][1].occupied === 'none') await promptMsg.react('2️⃣');
		if (slots[1][0].occupied === 'none') await promptMsg.react('3️⃣');
		if (slots[1][1].occupied === 'none') await promptMsg.react('4️⃣');

		return new Promise(resolve => {
			const filter = (reaction, user) => {
				return (reaction.emoji.name === '1️⃣' || reaction.emoji.name === '2️⃣' || reaction.emoji.name === '3️⃣' || reaction.emoji.name === '4️⃣') && user.id === player.id;
			};

			const collector = promptMsg.createReactionCollector(filter, { max: 1, time: 60000 });
			collector.on('collect', (reaction, user) => {
				switch (reaction.emoji.name) {
					case ('1️⃣'):
						switch (String(slots[0][0].buff).toLowerCase()) {
							case ('attack'):
								player.units[0].attack += slots[0][0].value;
								break;
							case ('defense'):
								player.units[0].defense += slots[0][0].value;
								break;
							case ('health'):
								player.units[0].health += slots[0][0].value;
								break;
							case ('luck'):
								player.units[0].luck += slots[0][0].value;
								break;
							case ('equipment'):
								player.units[0].equipment = new equipmentClass(buffs[Math.floor((Math.random() * (buffs.length - 1)))], slots[0][0].value);
								break;
						}
						slots[0][0].occupied = player.username;
						break;
					case ('2️⃣'):
						switch (String(slots[0][1].buff).toLowerCase()) {
							case ('attack'):
								player.units[0].attack += slots[0][1].value;
								break;
							case ('defense'):
								player.units[0].defense += slots[0][1].value;
								break;
							case ('health'):
								player.units[0].health += slots[0][1].value;
								break;
							case ('luck'):
								player.units[0].luck += slots[0][1].value;
								break;
							case ('equipment'):
								player.units[0].equipment = new equipmentClass(buffs[Math.floor((Math.random() * (buffs.length - 1)))], slots[0][1].value);
								break;
						}
						slots[0][1].occupied = player.username;
						break;
					case ('3️⃣'):
						switch (String(slots[1][0].buff).toLowerCase()) {
							case ('attack'):
								player.units[0].attack += slots[1][0].value;
								break;
							case ('defense'):
								player.units[0].defense += slots[1][0].value;
								break;
							case ('health'):
								player.units[0].health += slots[1][0].value;
								break;
							case ('luck'):
								player.units[0].luck += slots[1][0].value;
								break;
							case ('equipment'):
								player.units[0].equipment = new equipmentClass(buffs[Math.floor((Math.random() * (buffs.length - 1)))], slots[1][0].value);
								break;
						}
						slots[1][0].occupied = player.username;
						break;
					case ('4️⃣'):
						switch (String(slots[1][1].buff).toLowerCase()) {
							case ('attack'):
								player.units[0].attack += slots[1][1].value;
								break;
							case ('defense'):
								player.units[0].defense += slots[1][1].value;
								break;
							case ('health'):
								player.units[0].health += slots[1][1].value;
								break;
							case ('luck'):
								player.units[0].luck += slots[1][1].value;
								break;
							case ('equipment'):
								player.units[0].equipment = new equipmentClass(buffs[Math.floor((Math.random() * (buffs.length - 1)))], slots[1][1].value);
								break;
						}
						slots[1][1].occupied = player.username;
						break;
				}
				resolve(0);
			});
			collector.on('end', collected => {
				promptMsg.delete();
				if (collected.size == 0) {
					msg.say('Game has been cancelled');
					resolve(1);
				}
			});
		});
	}
	
	damage(defender, attacker) {
		var rng = Math.ceil((Math.random() * 100));
		if (rng > 100 - attacker.luck) {
			//Critical hit
			defender.health -= (attacker.attack * 2 - defender.defense / 2);
			return 'critical';
		}
		else {
			var rng = Math.ceil((Math.random() * 100));
			if (rng > 100 - defender.luck) {
				//Dodged attack
				return 'dodge';
			}
			else {
				defender.health -= (attacker.attack - defender.defense / 2);
				return 'damage';
			}
		}
	}

	async combatTurn(msg, slots, playerOne, playerTwo) {
		switch (String(this.damage(playerOne.units[0], playerTwo.units[0]))) {
			case ('damage'):
				var combatMsg = await msg.say(`${playerOne.username} took ${playerTwo.units[0].attack - playerOne.units[0].defense / 2} damage!`)
				break;
			case ('critical'):
				var combatMsg = await msg.say(`${playerOne.username} took critical damage!`)
				break;
			case ('dodge'):
				var combatMsg = await msg.say(`${playerOne.username} dodged the attack!`)
				break;
		}
		switch (String(this.damage(playerTwo.units[0], playerOne.units[0]))) {
			case ('damage'):
				var combatMsg2 = await msg.say(`${playerTwo.username} took ${playerOne.units[0].attack - playerTwo.units[0].defense / 2} damage!`)
				break;
			case ('critical'):
				var combatMsg2 = await msg.say(`${playerTwo.username} took critical damage!`)
				break;
			case ('dodge'):
				var combatMsg2 = await msg.say(`${playerTwo.username} dodged the attack!`)
				break;
		}
		return new Promise(resolve => {
			setTimeout(async function () {
				playerOne.units[0].equipment = new equipmentClass('Nothing', 0);
				playerTwo.units[0].equipment = new equipmentClass('Nothing', 0);
				combatMsg.delete();
				combatMsg2.delete();
				resolve(0);
			}, 5000);
		});
	}
};