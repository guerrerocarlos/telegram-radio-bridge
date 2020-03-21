const Telegraf = require('telegraf')
const Tg = require('node-telegram-bot-api')
var token = process.env.TELEGRAM_TOKEN
const bot2 = new Tg(token, { polling: false });

const axios = require('axios');
const fs = require('fs');
const path = require('path');

var player = require(`play-sound`)({
    players: ['play']
});

const bot = new Telegraf(token)
bot.on('voice', async (ctx) => {
    console.log(ctx.message)

    var getFileResponse = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
    console.log(getFileResponse)

    axios({
        method: 'get',
        url: getFileResponse,
        responseType: 'stream'
    })
        .then(function (response) {
            response.data.pipe(fs.createWriteStream(path.resolve(__dirname, 'audio.ogg')))
            response.data.on('end', () => {
                console.log('ENDED!')

                player.play(path.resolve(__dirname, '../audio-1234.mp3'), function (err) {
                    if (err) throw err;
                    player.play(path.resolve(__dirname, 'audio.ogg'), function (err) {
                        if (err) throw err;
                    });
                });

            })
        });

    // load(getFileResponse).then(function (buffer) {
    //     console.log(buffer) // => <AudioBuffer>
    //     // let playback = 
    //     play(buffer);
    //     // playback.pause();
    //     // playback.play();
    // })

    // return ctx.reply('Hello')
})

bot.start((ctx) => {
    console.log(ctx.chat)
    // ctx.reply('Connected through radio link!')
} 
)

bot.launch()

module.exports = { bot, bot2 }
