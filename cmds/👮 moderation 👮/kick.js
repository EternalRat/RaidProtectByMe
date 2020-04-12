const {RichEmbed} = require("discord.js")

module.exports = {
    name: "kick",
    aliases: ["k"],
    category: "👮 moderation 👮",
    description: "Kick a member",
    usage: "<member> [reason]",
    run: async(client, msg, args) => {
        if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("You haven't the right for this !");
        var embedColor = '#ffffff'
        var missingArgsEmbed = new Discord.RichEmbed() // Creates the embed thats sent if the command isnt run right
            .setColor(embedColor)
            .setAuthor(msg.author.username, msg.author.avatarURL)
            .setTitle('Missing Arguments!')
            .setDescription('Usage: `!kick ' + client.commands.get("kick").usage + '`')
            .setTimestamp();

        let kUser = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
        if (!kUser) return msg.channel.send(missingArgsEmbed);
        if (kUser.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("That person can't be kicked!");
        msg.delete().catch();
        let kReason = args.join(" ").slice(22);

        let kickEmbed = new Discord.RichEmbed()
            .setDescription("☆━━━━━━☆ Kick ☆━━━━━━☆")
            .setColor("#ff0000")
            .addField("Kicked User", `${kUser} with ID ${kUser.id}`)
            .addField("Kicked By", `<@${msg.author.id}> with ID ${msg.author.id}`)
            .addField("Kicked In", msg.channel)
            .addField("Tiime", msg.createdAt)
        if (kReason)
            kcikEmebed.addField("Reason", kReason);
        
        if (kReason)
            msg.guild.member(bUser).kick(kReason);
        else
            msg.guild.member(buser).kick("No reason specify")
        msg.channel.send(kickEmbed)
    }
}