const {RichEmbed} = require("discord.js")
const moment = require("moment")

module.exports = {
    name: "botinfo",
    aliases: ["bi", "bot"],
    category: "other",
    description: "Take a look at the bot information",
    usage: null,
    run: async(client, msg, args) => {
        let embed = new RichEmbed()
            .setTitle(`Information for ${client.user.username}`)
            .addField("Guild size", `${client.guilds.size}`, true)
            .addField("Member size", `${client.users.size}`, true)
            .addField("Creation date:", `${moment.utc(client.user.createdAt).format("dddd Do MMMM in YYYY, HH:mm:ss")}`)
            .setThumbnail(msg.guild.iconURL)
            .setAuthor(msg.author.username, msg.author.displayAvatarURL)
            .setFooter(client.user.username, client.user.displayAvatarURL)
        msg.channel.send(embed);
    }
}