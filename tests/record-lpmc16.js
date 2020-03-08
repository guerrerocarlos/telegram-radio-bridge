const recorder = require('node-record-lpcm16')
const fs = require('fs')
 
const file = fs.createWriteStream('lpcm16.wav', { encoding: 'binary' })
 
recorder.record({
  sampleRate: 16000,
  threshold: 0.5,    // silence threshold (rec only)
//   thresholdStart: 1,  // silence threshold to start recording, overrides threshold (rec only)
//   thresholdEnd: 1,  // silence threshold to end recording, overrides threshold (rec only)
  silence: '1.0', // seconds of silence before ending
  endOnSilence: true,
  recorder: 'arecord',
  verbose: true
})
.stream()
.pipe(file)