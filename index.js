const Discord = require('discord.js')
const config = require('./config.json');
const fs = require('fs');
const command = require('./command');
const db = require('quick.db');
const fetch = require("node-fetch"); 
const atob = require('atob');
const memberCounter = require('./counters/member-counter');
const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]});
const Timeout = new Set();
const ms = require('ms');
const { setTimeout } = require('timers');
var discordservers = [];

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () =>{
    console.log('AisBasic+ is ready!');
    client.user.setPresence({
        activity: {
            name: '+help | +invite | +vote',
            type: "WATCHING",
        }
    });

    memberCounter(client);

    command(client, ['cc', 'clearchannel'], (message)=> {
        if(message.member.hasPermission('ADMINISTRATOR')){
            message.channel.messages.fetch().then((results) => {
                message.channel.bulkDelete(results);
            });
            message.channel.send('deleting as many messages as I can ❤');
        } else {
            return;
    }
    
    });
});

client.on('message', async message =>{
    try{
    let  blacklisted = ['nigger', 'getadmin'];
    let foundInText = false;
    for(var i in blacklisted){
        if(message.content.toLowerCase().includes(blacklisted[i].toLowerCase())) foundInText = true;
    }
    if(foundInText){
        message.delete();
        message.reply('You are not allowed to say that.');
    }
    if(message.content.toLowerCase().includes('@everyone')){
        message.react(':regional_indicator_y:');
        message.react(':regional_indicator_e:');
        message.react(':regional_indicator_s:');
        message.react(':question:');
    }
    var prefix = db.fetch(`${message.guild.id}prefix`);
    //ttt.run(client, prefix, embed_color, start_cmd)
    if(prefix === null){
    prefix = '+'
    }
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    if(!message.guild) return;
    if(!message.member) message.member = await message.guild.fetchMember(mess);
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if(command === 'prefix'){
        if(message.member.permissions.has("KICK_MEMBERS")){
        db.set(`${message.guild.id}prefix`, args[0])
        return message.reply('My prefix is now `' + args[0] + '`    👏 👏 👏') 
        } else {
            message.channel.send('You must be an admin to change the prefix 😢');
        }
    } 
    else if(command === 'ping'){
        client.commands.get('ping').execute(message, args);
    } else if(command == 'youtube'){
        client.commands.get('youtube').execute(message, args);
    } else if(command == 'dungeondestiny'){
        client.commands.get('dungeondestiny').execute(message, args);
    } else if(command == 'mute'){
        client.commands.get('mute').execute(message, args); 
    } else if(command == 'timedmute'){
        client.commands.get('timedmute').execute(message, args); 
    } else if(command == 'unmute'){
        client.commands.get('unmute').execute(message, args);
    } else if(command == 'makeabot'){
        client.commands.get('makeabot').execute(message, args);
    } else if(command == 'help'){
        client.commands.get('help').execute(client ,message, args);
    } else if(command == 'delete'){
        client.commands.get('delete').execute(message, args);
    } else if(command == 'kick'){
        client.commands.get('kick').execute(message, args);
    } else if(command == 'ban'){
        client.commands.get('ban').execute(message, args);
    } /* else if(command == 'reactionrole'){
        client.commands.get('reactionrole').execute(message, args, Discord, client);
    } */else if(command == 'servers'){
        message.channel.send(`I'm in ${client.guilds.cache.size} servers!`);
    } else if(command == 'inviteme'){
        client.commands.get('inviteme').execute(message, args);
    } else if(command == 'abbey'){
        client.commands.get('abbey').execute(message, args);
    } else if(command == 'rolldice'){
        client.commands.get('rolldice').execute(message, args);
    } else if(command == 'addrole'){
        client.commands.get('addrole').execute(message, args);
    } else if(command == 'pfp' || command == 'avatar' || command == 'av'){
        client.commands.get('pfp').execute(message, args);
    } else if (message.content == 'muteAll') {
        let channel = message.member.voiceChannel;
        for (let member of channel.members) {
            member[1].setMute(true)
        }
    }
} catch (err){
    message.channel.send('Invalid or incomplete command. Try `+help` for more info.\n`' + err + '`');
} 
});

/* client.on('guildMemberAdd', guildMember =>{
    let welcomeRole = guildMember.guild.roles.cache.find(role => role.name === 'Member');
    
    guildMember.roles.add(welcomeRole);
    guildMember.guild.channels.cache.get('785642283919474708').send(`Welcome <@${guildMember.user.id}> to our server!`);
}); */
//keep at end
//plz work plz
client.login("Nzg0OTk0NTU3NDg5MTg0Nzc5.X8xZJg.yRf9_qL2hVGZ1kwUME6Ee8BXyeA");