const { Command } = require('discord.js-commando');
const MidiWriter = require('midi-writer-js');
const synth = require('synth-js');
const fs = require('fs');

module.exports = class SingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sing',
			group: 'fun',
			memberName: 'sing',
			description: 'Sings a song\n\n' +
				'Format:\n' +
				'sing songname length(pitch,pitch,pitch) length(pitch) length(pitch,pitch)\n\n' +
				'Note length applies to the notes inside the next pair of brackets\n' +
				'No flats, only sharps',
			examples: ['sing hotcrossbuns 4(e4,d4) 2(c4) 4(e4,d4) 2(c4) 8(c4,c4,c4,c4,d4,d4,d4,d4) 4(e4,d4) 2(c4)'],
			args: [
				{
					key: 'text',
					prompt: ':grey_question: You didn\'t say what to sing',
					type: 'string'
				}
			],
		});
	}

	async run(msg, { text }) {
		try {
			const voiceChannel = msg.member.voice.channel;
			if (!voiceChannel) return msg.say('You need to be in a voice channel to use that');

			const permissions = voiceChannel.permissionsFor(msg.client.user);
			if (!permissions.has('CONNECT')) return msg.say('I don\'t have permission to join your voice channel.');
			if (!permissions.has('SPEAK')) return msg.say('I don\'t have permission to speak in your voice channel.');

			const args = text.split(" ");
			var track = new MidiWriter.Track();

			for (var i = 1; i < args.length; i++) {
				const values = args[i].split(/[(),]+/);

				for (var j = 1; j < values.length - 1; j++) {
					track.addEvent(new MidiWriter.NoteEvent({ pitch: [`${values[j]}`], duration: `${values[0]}`, velocity: 100 }));
				}
			}
			var write = new MidiWriter.Writer(track);
			write.saveMIDI(`songs/${args[0]}`);

			setTimeout(function () {
				let midiBuffer = fs.readFileSync(`songs/${args[0]}.mid`);
				let wavBuffer = synth.midiToWav(midiBuffer).toBuffer();
				fs.writeFileSync(`songs/${args[0]}.wav`, wavBuffer, { encoding: 'binary' });
			}, 2000);

			setTimeout(async function () {
				const connection = await voiceChannel.join();
				connection.play(`songs/${args[0]}.wav`);
				msg.say(`Now singing ${args[0]} by ${msg.author.username}`);
			}, 2000);
		} catch (err) {
			msg.say(':pensive: Sorry, something went wrong');
			console.log(err);
		}
	}
};