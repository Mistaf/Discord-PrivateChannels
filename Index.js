const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("./config.json");

bot.login(config.Token);
/**
 * logs in the console when the bot is on
 */
bot.on('ready',() => {
    console.log("Bot is ready!");
    require('./private.js').ready(bot);
    bot.user.setActivity("/privatehelp for help",{type:"watching"});
});


bot.on("message",message=>{
    let args = message.content.toLowerCase().split(' ');
    if(message.channel.type!="text"||message.author.bot)return;

    if(!message.guild.me.hasPermission("ADMINISTRATOR")){
        message.channel.send("I do not have the permissions to manage channels!\nPlease make sure the bot is Admin");
        return;
    }
    switch (args[0]) {
        case "/privatecreate":
            require('./private.js').create(message,bot);  
            break;
        case "/privatekick":
            require('./private.js').kick(message);  
            break;
        case "/privateinvite":
            require('./private.js').invite(message);  
            break;
        case "/privatehelp":
            sendHelp(message);
            break;
        default:
            break;
    }

});
/**
 * Delete the channel if nobody is in it anymore
 */
bot.on("voiceStateUpdate",(oldMember,newMember)=>{
    if(!oldMember.guild.me.hasPermission("MANAGE_CHANNELS")||!oldMember.guild.me.hasPermission("MOVE_MEMBERS"))return;
    if(oldMember.voiceChannel&&oldMember.voiceChannel.name.includes(' Private Channel')&&oldMember.voiceChannel!=newMember.voiceChannel&&oldMember.voiceChannel.members.array().length==0)oldMember.voiceChannel.delete();
});

function sendHelp(message){

    var help = new Discord.RichEmbed()
        .setTitle("Hey "+message.author.username+"!")
        .setDescription("Here is everything I can do!")
        .addField("/privatecreate","Creates a private channel for you and the people you invite!")
        .addField("/privateinvite","Invite a person from the same discord server to your private channel by tagging them")
        .addField("/privatekick","Kick the person from your private channel")
        .setColor('#'+Math.random().toString(16).slice(2, 8));
   message.author.send(help).then(m => message.reply("I have Send you a list of my commands."))
        .catch(err=>message.reply("Cannot dm you. Make sure to enable dms for me to send you the help."));
}
