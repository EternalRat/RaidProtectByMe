const {RichEmbed} = require("discord.js")
module.exports = {
    name: "annonce",
    aliases: ["an"],
    category: "lead",
    description: "Send a msg at every guilds owner",
    usage: "<msg>",
    run: async(client, msg, args) => {
        if (args.length == 0)
            return msg.channel.send("Usage: !annonce " + client.commands.get("annonce").usage)
        if (msg.author.id === "291646942038196224") {
            client.guilds.forEach(guild => {
                guild.owner.send("There is an extremely important announce from the creator.")
                let embed = new RichEmbed()
                    .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                    .setTitle("IMPORTANT ANNOUNCE")
                    .setTimestamp()
                    .setThumbnail(msg.author.displayAvatarURL)
                    .setDescription(args)
                    .setFooter(client.user.username, client.user.displayAvatarURL)
                guild.owner.send(embed);
            })
        } else {
            msg.channel.send("You aren't my boss")
        }
    }
}