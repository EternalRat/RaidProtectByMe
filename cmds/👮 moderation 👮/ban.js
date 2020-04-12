const {RichEmbed} = require("discord.js")

module.exports = {
    name: "ban",
    aliases: ["b"],
    category: "👮 moderation 👮",
    description: "Ban a member",
    usage: "<member> [reason]",
    run: async(client, msg, args) => {
        if (!msg.member.hasPermission("BAN_MEMBERS")) return msg.channel.send("You haven't the right for this !")
        var embedColor = '#ffffff'
        var missingArgsEmbed = new Discord.RichEmbed() // Creates the embed thats sent if the command isnt run right
            .setColor(embedColor)
            .setAuthor(msg.author.username, msg.author.avatarURL)
            .setTitle('Missing Arguments!')
            .setDescription('Usage: `!ban ' + client.commands.get("ban").usage + '`')
            .setTimestamp();
        let bUser = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
        if (!bUser) return msg.channel.send(missingArgsEmbed);
        let bReason = args.join(" ").slice(22);
        if (!msg.member.hasPermission("MANAGE_MEMBERS")) return msg.channel.send("You haven't the right for this !");
        msg.delete().catch();

        let banEmbed = new Discord.RichEmbed()
            .setDescription("☆━━━━━━☆ Ban ☆━━━━━━☆")
            .setColor("#ff0000")
            .addField("Banned User", `${bUser} with ID ${bUser.id}`)
            .addField("Banned By", `<@${msg.author.id}> with ID ${msg.author.id}`)
            .addField("Banned In", msg.channel)
            .addField("Time", msg.createdAt)
        if (bReason)
            banEmebed.addField("Reason", bReason);
        
        if (bReason)
            msg.guild.member(bUser).ban(bReason);
        else
            msg.guild.member(buser).ban("No reason specify")
        msg.channel.send(banEmbed)
    }
}