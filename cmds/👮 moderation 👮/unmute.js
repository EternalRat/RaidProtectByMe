const {RichEmbed} = require("discord.js")
const fs = require("fs")

module.exports = {
    name: "unmute",
    aliases: ["um"],
    category: "👮 moderation 👮",
    description: "Unmute someone",
    usage: "<member>",
    run: async(client, msg, args) => {
        if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("You do not have the permission to use this");
        var embedColor = '#ffffff'
        var missingArgsEmbed = new Discord.RichEmbed() // Creates the embed thats sent if the command isnt run right
            .setColor(embedColor)
            .setAuthor(msg.author.username, msg.author.avatarURL)
            .setTitle('Missing Arguments!')
            .setDescription('Usage: `!unmute ' + client.commands.get("unmute").usage + '`')
            .setTimestamp();
        let toMute = msg.guild.member(msg.mentions.users.first()) || msg.guild.members.get(args[0]);
        if (!toMute) return msg.channel.send(missingArgsEmbed);
        msg.delete().catch();

        let role = msg.guild.roles.find(r => r.name === "Muted");

        if (!role || !toMute.roles.has(role.id)) return msg.channel.send("This utilisateur is unmute");

        await toMute.removeRole(role);

        delete bot.mutes[toMute.id];

        fs.writeFile("./json/mutes.json", JSON.stringify(bot.mutes), err => {
            if (err) throw err;
            console.log(`I have unmuted ${toMute}.`);
        });
    }
}