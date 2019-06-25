exports.create = async function (message) {
    let guild=message.guild;
    let everyone = guild.roles.find(role=>role.name==="@everyone");
    let parent = guild.channels.find(channel=>channel.name==="Private Channels");
    if(parent==null){await createParent(guild).then(function(result){parent=result})}
    let papa=guild.channels.get(parent.id).children.array();
    if(papa){
        for(i=0;i<papa.length;i++){
            if(papa[i].name==message.author.id+' Private Channel'){
                message.reply("You can only have 1 private channel at the time");
                return;
            }
        }
    }
    guild.createChannel(message.author.id+' Private Channel', {
        type: 'voice',
        parent:parent.id,
        permissionOverwrites: [{
            id: message.author.id,
            allow:["CONNECT"]
        },
        {
            id: everyone,
            deny: ["CONNECT"]
        }]
    }).then(function(m){
            runTimer();
            function runTimer() {
                setTimeout(function () {
                    //delete if possible
                    if(m.deleteable)m.delete();
                    let rmvchannel =guild.channels.find(channel=>channel.name===message.author.id+' Private Channel');
                    if(rmvchannel){
                        //remove channel if nobody joined after 10 seconds
                        if(rmvchannel.members.array().length==0)rmvchannel.delete();
                    }
                    
                }, 10000);
            }
        })
        .catch(console.error);

}

exports.invite = function (message) {
    
    let guild=message.guild;
    let parent = guild.channels.find(channel=>channel.name==="Private Channels");
    if(parent==null){
        message.reply("Make sure you got an private channel");
        return;
    }
    let papa=guild.channels.get(parent.id).children.array();
    if(papa){
        for(i=0;i<papa.length;i++){
            if(papa[i].name==message.author.id+' Private Channel'){

            let userp=message.mentions.users.first();
            if(userp==null||userp==undefined){
                userp=message.content.split(" ")[1]
            }else{
                userp=userp.id;
            }
            let target=message.guild.members.get(userp);
            if(target==undefined){
                message.channel.send("Cannot invite that person make sure u typed everything correctly");return;
            }
            guild.channels.find(channel=>channel.name===message.author.id+' Private Channel').overwritePermissions(target.id,{'CONNECT':true});
            message.channel.send(target+' you have been invited the private channel of '+message.author);
            return;}
        }
        message.reply("Make sure you got an private channel");
    }
}

exports.kick = function (message) {
    if(!message)return;
    if(!message.member.voiceChannel){
        message.reply("Join your voicechannel before kicking the person. You haven't even talked to him yet...");
        return;
    }
    if(message.member.voiceChannel.name==message.author.id+" Private Channel"){
        let voiceChannel=message.member.voiceChannel;
        let mentionedUser=message.mentions.users.first();
        if(mentionedUser==null||mentionedUser==undefined){
            //makes is so you could use there discord id instead of tagging
            mentionedUser=message.content.split(" ")[1];
        }else{
            mentionedUser=mentionedUser.id;
        }
        let target=message.guild.members.get(mentionedUser);
        if(target==undefined){
            message.channel.send("Cannot remove that person make sure u typed everything correctly");
            return;
        }
  
        voiceChannel.overwritePermissions(target.id,{'CONNECT':false});

        if(target.voiceChannel&&target.voiceChannel.name==message.author.id+" Private Channel")target.setVoiceChannel(null);
        else message.reply("This creature isn't even in your channel...")
      }else{
          message.reply("Do you even own a private voicechannel???")
      }
      
}



exports.ready = function (bot) {
    let guilds = bot.guilds.array();
    guilds.forEach(guild => {
        let parent = guild.channels.find(channel=>channel.name==="Private Channels");
        if(parent==null)return;
        let privates=guild.channels.get(parent.id).children.array();
        if(privates){
          for(i=0;i<privates.length;i++){
            if(privates[i].name.includes(' Private Channel')&&privates[i].members.array().length==0){
              privates[i].delete();
              return;
            }
          }
        }
    });
}
function createParent(guild){
    return guild.createChannel('Private Channels', {
        type: 'category',
        permissionOverwrites: [{
          id: guild.id,
          deny: ['CONNECT']
        }]
      })
      .then(parent=>{return parent})
      .catch(console.error);

}
