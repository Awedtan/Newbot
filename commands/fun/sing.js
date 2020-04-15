const { Command } = require('discord.js-commando');
const MidiWriter = require('midi-writer-js');
const synth = require('synth-js');
const fs = require('fs');

module.exports = class SingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sing',
			aliases: ['music'],
			group: 'fun',
			memberName: 'sing',
			description: 'Sings a song\n\n' +
				'Format:\n' +
				'sing [tempo] length(pitch,pitch)repeats\n\n' +
				'Note length applies to the notes inside the next pair of brackets\n' +
				'No flats, only sharps\n' +
				'Invalid pitches will become rests',
			examples: ['sing 120 4(e4,d4) 2(c4) 4(e4,d4) 2(c4) 8(c4,d4)4 4(e4,d4) 2(c4)'],
			args: [
				{
					key: 'text',
					prompt: ':grey_question: You didn\'t say what to sing',
					type: 'string',
					default: ''
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

			if (args.length == 1 && args[0].indexOf('(') == -1 && args[0].indexOf(')') == -1 && args[0].indexOf(',') == -1) {
				if (fs.existsSync(`songs/saved/${args[0]}.wav`)) {
					const connection = await voiceChannel.join();
					connection.play(`songs/saved/${args[0]}.wav`);
					msg.say(`Now singing ${args[0]}`);
					console.log(`Singing ${args[0]}`);
				}
				else {
					msg.say(`No song with that name was found`);
				}
			}
			else {
				var track = new MidiWriter.Track();
				track.setTempo(args[0]);

				for (var i = 1; i < args.length; i++) {
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
				write.saveMIDI(`songs/song`);

				setTimeout(function () {
					let midiBuffer = fs.readFileSync(`songs/song.mid`);
					let wavBuffer = synth.midiToWav(midiBuffer).toBuffer();
					fs.writeFileSync(`songs/song.wav`, wavBuffer, { encoding: 'binary' });
				}, 2000);

				setTimeout(async function () {
					msg.guild.musicData.isPlaying = true;
					msg.guild.musicData.connection = await voiceChannel.join();
					msg.guild.musicData.connection.play(`songs/song.wav`, { highWaterMark: 64 });
					msg.say(`Now singing a song by ${msg.author.username}`);
					console.log(`Singing a song by ${msg.author.username}`);
				}, 2000);
			}
		} catch (err) {
			msg.say(err);
			console.log(err);
		}
	}
};