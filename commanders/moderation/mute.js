const BaseCommand = require('../../BaseClasses/baseCommand');
const Guild = require('../../database/Schemas/guild');
const Discord = require('discord.js');

module.exports = class mute extends BaseCommand {
    constructor(){
        super({
            aliases: ['muteUser'],
            description: "Mutes a user until you unmute them.",
            name: 'mute',
            permissions: ['MUTE_MEMBERS'],
            usage: '`+mute <user>`',
            category: 'moderation'
        });
    }

    async run(client, message, args){
        if(message.member.permissions.has('MUTE_MEMBERS')){
        const dbEm = new Discord.MessageEmbed()
        .setDescription('Something went wrong in the database, please try again.');

        const mentEm = new Discord.MessageEmbed()
        .setDescription('Please mention a user.');

        const member = message.mentions.members.first() || message.guild.cache.get(args[0]);

        const successEm = new Discord.MessageEmbed()
        .setDescription(`${member.user.tag} was successfully muted`);

        if(!member) return message.channel.send(mentEm)

        let guild = await Guild.findOne({guildId: message.guild.id});
        if(!guild) guild = await Guild.create({guildId: message.guild.id});

        let muteRole = message.guild.roles.cache.find(r => r.name== "Muted");
        if(!muteRole){
            muteRole = await message.guild.roles.create({
                data: {
                    name: "Muted",
                    color: "#000000",
                    permissions: [],
                }
            })
        }

        guild.muteRole = muteRole.id
        guild.mutedUsers.push({
            uId: member.id,
            oldRole: member.roles.cache.map(r => r.id),
        })

        for(const role of member.roles.cache.array().filter(r => r.id != message.guild.id)){
            member.roles.remove(role.id);
        }

        member.roles.add(muteRole.id);

        try{
            await guild.updateOne(guild);
        }catch{
            return message.channel.send(dbEm)
        }

        return message.channel.send(successEm);
    }
    }
}