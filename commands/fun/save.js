const { Command } = require('discord.js-commando');
const MidiWriter = require('midi-writer-js');
const synth = require('synth-js');
const fs = require('fs');

module.exports = class SaveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'save',
			group: 'fun',
			memberName: 'save',
			description: 'Saves a song to the repertoire list\n\n' +
				'Format:\n' +
				'save [name] [tempo] length(pitch)repeats\n\n' +
				'Note length applies to the notes inside the next pair of brackets\n' +
				'No flats, only sharps\n' +
				'Invalid pitches will become rests',
			examples: ['save Hot_Cross_Buns 120 4(e4,d4) 2(c4) 4(e4,d4) 2(c4) 8(c4,d4)4 4(e4,d4) 2(c4)'],
			args: [
				{
					key: 'text',
					prompt: ':grey_question: You didn\'t give a song to save',
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
			track.setTempo(args[1]);

			for (var i = 2; i < args.length; i++) {
				const values = args[i].split(/[(),]+/);

				for (var j = 1; j < values.length - 1; j++) {
					if (Number.isInteger(parseInt(values[values.length - 1]))) {
						track.addEvent(new MidiWriter.NoteEvent({ pitch: [`${values[j]}`], duration: `${values[0]}`, repeat: `${parseInt(values[values.length - 1])}` }));
					}
					else {
						track.addEvent(new MidiWriter.NoteEvent({ pitch: [`${values[j]}`], duration: `${values[0]}` }));
					}
				}
			}
			var write = new MidiWriter.Writer(track);
			write.saveMIDI(`songs/saved/${args[0]}`);

			setTimeout(function () {
				let midiBuffer = fs.readFileSync(`songs/saved/${args[0]}.mid`);
				let wavBuffer = synth.midiToWav(midiBuffer).toBuffer();
				fs.writeFileSync(`songs/saved/${args[0]}.wav`, wavBuffer, { encoding: 'binary' });
				msg.say(`Saved ${args[0]} to the repertoire list`);
				console.log(`Saved ${args[0]} to the repertoire list`);
			}, 2000);
		} catch (err) {
			msg.say(err);
			console.log(err);
		}
	}
};