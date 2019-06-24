const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("./config.json");
bot.login(config.token);
/**
 * logs in the console when the bot is on
 */
bot.on('ready',() => {
    console.log("Bot is ready!");
});


bot.on("message",message=>{
    let args = message.content.toLowerCase().split(' ');

});