const {RichEmbed} = require("discord.js")
const moment = require("moment")

module.exports = {
    name: "userinfo",
    aliases: ["ui", "info"],
    category: "👮 moderation 👮",
    description: "Showing user's information",
    usage: "[member]",
    run: async(client, msg, args) => {
        var x = 0
        const user = msg.mentions.users.first() || msg.author
        const target = msg.guild.member(msg.mentions.users.first()) || msg.guild.member(msg.author)
        if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("You do not have the permission to use this")
        client.guilds.forEach(count => {
            if (count.member(user)) {
                x = x + 1
            }
        });
        let userInfo = new RichEmbed()
            .setColor("RANDOM")
            .setTitle("☆━━━━━━☆ Informations about the user ☆━━━━━━☆")
            .setThumbnail(user.displayAvatarURL)
            .addField("The username:", `${user.tag}`, true)
            .addField("The ID:", `${user.id}`, true)
            .addField("Shared servers :", x, false)
            .addField("Account creation date:", moment.utc(target.user.createdAt).format("dddd Do MMMM in YYYY, HH:mm:ss"))
            .addField("Joined the server the:", moment.utc(target.joinedAt).format("dddd Do MMMM in YYYY, HH:mm:ss"))
            .addField("Roles", target.roles.map(r => r.name + ", ").join(' '), true)
            .addField("Bot?!", `${user.bot}`, true)
            .setFooter(`Copyright - ${client.user.username}`, client.user.displayAvatarURL)
        msg.channel.send(userInfo)
    }
}