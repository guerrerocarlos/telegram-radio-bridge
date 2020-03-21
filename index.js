// Requires the node-audiorecorder and @google-cloud/speech modules to be installed.

// Dependency modules.
// const AudioRecorder = require(`node-audiorecorder`),
const HotwordDetector = require(`./utils/audiodetector`);
// const GoogleSpeech = require(`@google-cloud/speech`);
var FileWriter = require(`wav`).FileWriter;
var path = require(`path`)
var convert = require(`./utils/convert`)
var tg = require(`./utils/telegram`)
// const fs = require(`fs`);

// Options audio recorder.
// const recorderOptions = {};
// Options hotword detector.
const detectorData = {
  resource: `./node_modules/snowboy/resources/common.res`
};
const modelData = [{
  file: `./node_modules/snowboy/resources/snowboy.umdl`,
  hotwords: `snowboy`,
  sensitivity: 0.5
}];
const recorderData = {
  audioGain: 2
};

// Options Google-Cloud Speech API.
// const speech = new GoogleSpeech.SpeechClient({
// 	keyFilename: `KEYPATH_GOOGLECLOUD`
// }); // TODO: Add path to file.
// const speechRequest = {
// 	config: {
// 		encoding: `LINEAR16`,
// 		sampleRateHertz: 16000,
// 		languageCode: `en-GB`
// 	},
// 	interimResults: false
// };

// Initialize hotword detector.
const hotwordDetector = new HotwordDetector(detectorData, modelData, recorderData, console);
hotwordDetector.on(`error`, function (error) {
  throw error;
});

// var file = fs.createWriteStream(`./out.wav`);
// bot.telegram.sendVoice(chatId, { source: path.resolve(__dirname, `test.wav`) })

var ms = new Date().getTime()
var tempWav = `temp-${ms}.wav`
var outputFileStream = new FileWriter(path.resolve(__dirname, tempWav), {
  sampleRate: 16000,
  channels: 1
});

var bytesSaved = 0
var silences = 0
console.log(`Rec in...`, tempWav);
var chatId = CHAT_ID // Define your detination chatId here

hotwordDetector.on(`silence`, function () {
  // console.log(`Silence...`, silences, 'bytes;', bytesSaved);
  silences++
  if (bytesSaved > ( 8192 * 6 ) && silences >= 5) {
    silences = 0
    console.log(`Send!`, tempWav);
    convert(path.resolve(__dirname, tempWav), path.resolve(__dirname, `audio-${ms}.mp3`))
      .then((outputFile) => {
        console.log('converted!', outputFile)
        const doc = require('fs').createReadStream(outputFile)
        tg.bot2.sendVoice(chatId, doc, { filename: outputFile, contentType: 'audio/mpeg' });
      })
    ms = new Date().getTime()
    tempWav = `temp-${ms}.wav`
    outputFileStream = new FileWriter(path.resolve(__dirname, tempWav), {
      sampleRate: 16000,
      channels: 1
    });
    bytesSaved = 0
  }
});

hotwordDetector.on(`sound`, function (buf) {
  console.log(`Sound...`, buf.length);
  outputFileStream.write(buf);
  bytesSaved += buf.length
  silences = 0

  // bot.telegram.sendAudio(chatId, buf, {}, {})

});

// hotwordDetector.on(`hotword`, function (index, hotword, buffer) {
// 	// Index is the associated index of the detected hotword.
// 	// Hotword is a string of which word has been detected.
// 	// Buffer is the most recent section from the audio buffer.
// 	console.log(`hotwordDetector: Hotword detected: ${index}, ${hotword}, ${buffer}.`);

// 	// Stop the detector.
// 	hotwordDetector.stop();

// 	// Record audio.
// 	let audioRecorder = new AudioRecorder(recorderOptions);
// 	// Start recording.
// 	audioRecorder.start();
// 	// Listen to events.
// 	audioRecorder.stream().on(`error`, function (error) {
// 		throw error;
// 	});
// 	audioRecorder.on(`close`, function (exitCode) {
// 		console.log(`Audio stream closed, exit code: '${exitCode}'.`);
// 		// Stop audio recorder.
// 		audioRecorder.stop();

// 		// Exit the program, perhaps here you want to re-enable the hotword detector again.
// 		process.exit(1);
// 	});

// 	// Start Google-Cloud Speech API web stream.
// 	let stream = speech.streamingRecognize(speechRequest)
// 		.on(`error`, console.error)
// 		.on(`data`, function (data) {
// 			console.log(`Transcript: '${data.results[0].alternatives[0].transcript}'.`);
// 		});

// 	// Start streaming audio to stream.
// 	audioRecorder.stream().pipe(stream);
// });

// Start detection.
hotwordDetector.start();


// var mic = require('mic'); // requires arecord or sox, see https://www.npmjs.com/package/mic

// var micInstance = mic({
// 	rate: '16000',
// 	channels: '1',
// 	debug: true
// });

// var micInputStream = micInstance.getAudioStream();



// micInputStream.pipe(outputFileStream);

// micInstance.start();

// setTimeout(function () {
// 	micInstance.stop();
// }, 5000);