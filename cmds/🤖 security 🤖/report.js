const {RichEmbed} = require("discord.js")
const fs = require("fs")

module.exports = {
    name: "report",
    aliases: ["rep"],
    category: "🤖 security 🤖",
    description: "Report someone to the owner of the bot",
    usage: "<UserTag> <ID> <Reason>",
    run: async(client, msg, args) => {
        if (!msg.member.hasPermission("MANAGE_GUILD"))
            return msg.channel.send("You haven't the permission to do that")
        if (args.length != 3)
            return msg.channel.send("Usage: !report " + client.commands.get("report").usage)
        client.guilds.forEach(guild => {
            guild.members.forEach(member => {
                if (member.user.id === "291646942038196224")
                    member.send(`Here is a report from ${msg.author} : \n` + args)
            })
        });
    }
}