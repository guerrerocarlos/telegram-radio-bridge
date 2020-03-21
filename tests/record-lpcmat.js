var record = require('node-record-lpcmat')
var fs = require('fs')

var file = fs.createWriteStream('test.wav', { encoding: 'binary' })

record.start({
  sampleRate: 44100,
  threshold: '0.9',    // silence threshold (rec only)
  thresholdStart: '0.9',  // silence threshold to start recording, overrides threshold (rec only)
  thresholdEnd: '0.9',  // silence threshold to end recording, overrides threshold (rec only)
  silence: '1.0', // seconds of silence before ending
  recordProgram : 'rec',
  verbose: true
})
  .pipe(file)