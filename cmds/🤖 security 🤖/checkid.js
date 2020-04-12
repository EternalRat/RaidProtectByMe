const Discord = require("discord.js")
const fs = require("fs")
const blacklist = JSON.parse(fs.readFileSync("./json/blacklist.json"));

module.exports = {
    name: "checkid",
    aliases: ["ci", "check"],
    category: "🤖 security 🤖",
    description: "Check if an user is into the blacklist",
    usage: "<@user>",
    run: async(client, msg, args) => {
        let target = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
        if (!msg.member.hasPermission("MANAGE_GUILD"))
            return msg.channel.send("You aren't the owner")
        let clear = new Discord.RichEmbed()
            .setTitle(":white_check_mark: This user isn't in our blacklist !")
            .setFooter("We recommand you to check your server one time a week. | " + client.user.username, client.user.displayAvatarURL)
        let danger = new Discord.RichEmbed()
            .setFooter("We recommand you to check your server one time a week. | " + client.user.username, client.user.displayAvatarURL)

        if (blacklist[target.id]) {
            let info = ":x: This user is in our blacklist, he can be dangerous be careful ! This person is in the blacklist for the following reason :\n"
            info += blacklist[target.id].reason
            danger.setTitle(info)
            msg.channel.send(danger)
        } else {
            msg.channel.send(clear)
        }
    }
}