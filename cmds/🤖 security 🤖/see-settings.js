const fs = require("fs");
const {RichEmbed} = require("discord.js")
const antilink = JSON.parse(fs.readFileSync("./json/anti-link.json"));
const antiraid = JSON.parse(fs.readFileSync("./json/anti-raid.json"));
const settings = JSON.parse(fs.readFileSync("./json/settings.json"));
const raidmode = JSON.parse(fs.readFileSync("./json/raidmode.json"));
const {prefix} = require("../../botSettings.json");

module.exports = {
    name: "security",
    aliases: ["sec"],
    category: "🤖 security 🤖",
    description: "Take a look at the settings of the security",
    usage: null,
    run: async(client, msg, args) => {
        if (!msg.member.hasPermission("MANAGE_GUILD")) return (msg.channel.send("You can't do that !"))
        let embed = new RichEmbed()
            .setTitle(`Settings ${client.user.username}`)
            .setDescription(`Do ${prefix}help to see all the commands to change those settings !`)
            .addField("RaidMode", `Status : ${raidmode[msg.guild.id].active}`)
            .addField("Kicking blacklisted person", `Status : ${settings[msg.guild.id].active}`)
            .addField("Anti-Raid settings", `Number of people : ${antiraid[msg.guild.id].people}\nDelay : ${antiraid[msg.guild.id].time}seconds`)
            .addField("Anti-link", `Status : ${antilink[msg.guild.id].active}`)
            .setThumbnail(msg.guild.iconURL)
            .setAuthor(msg.author.username, msg.author.displayAvatarURL)
            .setFooter(client.user.username, client.user.displayAvatarURL)
        msg.channel.send(embed);
    }
}