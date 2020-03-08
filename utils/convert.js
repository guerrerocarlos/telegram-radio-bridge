var ffmpeg = require('fluent-ffmpeg'),
  fs = require('fs');

// create the target stream (can be any WritableStream)

module.exports = function convert(inputFile, outputFile) {
  return new Promise((success, reject) => {
    var stream = fs.createWriteStream(outputFile)

    // make sure you set the correct path to your video file
    var proc = ffmpeg(inputFile)
      .format('mp3')
      .on('end', function () {
        success(outputFile)
        console.log('file has been converted succesfully');
      })
      .on('error', function (err) {
        reject(err)
        console.log('an error happened: ' + err.message);
      })
      .pipe(stream, { end: true });
  })
}