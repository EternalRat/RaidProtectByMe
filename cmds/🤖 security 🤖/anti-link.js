const {RichEmbed} = require("discord.js")
const fs = require("fs")
const authorize = JSON.parse(fs.readFileSync("./json/allowed_channel.json"))
const {saveFile} = require("../../utils/utils.js")

module.exports = {
    name: "channels-no-link",
    aliases: ["cnl", "chan"],
    category: "🤖 security 🤖",
    description: "Autorize channels where you can post links",
    usage: "<channel>",
    run: async(client, msg, args) => {
        if (!msg.member.hasPermission("MANAGE_GUILD")) return (msg.channel.send("You haven't the right to do this"))
        let channelsArray = msg.mentions.channels
        channelsArray.forEach(guild => {
        if (!authorize[msg.guild.id].channels.includes(guild.id)) {
            msg.channel.send("The channel has been added to the list")
            authorize[msg.guild.id].channels.push(guild.id)
        } else if (authorize[msg.guild.id].channels.includes(guild.id)) {
            const filter = (reaction, user) => ["👍", "👎"].includes(reaction.emoji.name) && user.id === msg.author.id
            msg.channel.send("This channel is already in the list, do you want to remove it ?").then(msg => {
                msg.react("👎")
                msg.react("👍")
                msg.awaitReactions(filter, {
                    max: 1,
                    time: 30000,
                    errors: ["time"]
                }).then(async (collected) => {
                    const reaction = collected.first()
                    switch (reaction.emoji.name) {
                        case "👍":
                            delete authorize[msg.guild.id].channels.splice(authorize[msg.guild.id].channels.indexOf(guild.id), 1)
                            msg.channel.send("This user has been removed from the blacklist.")
                            break
                        case "👎":
                            msg.channel.send("Okay boss.")
                            break
                    }
                })
            })
        }
        });
        saveFile(authorize, "./json/allowed_channel.json")
    }
}