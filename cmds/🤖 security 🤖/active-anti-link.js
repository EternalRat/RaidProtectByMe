const {RichEmbed} = require("discord.js")
const fs = require("fs")
const authorize = JSON.parse(fs.readFileSync("./json/anti-link.json"))
const {saveFile} = require("../../utils/utils.js")

module.exports = {
    name: "antilink",
    aliases: ["al", "link"],
    category: "🤖 security 🤖",
    description: "Active the anti-link [default: false]",
    usage: "<true/false>",
    run: async(client, msg, args) => {
        var input = null

        if (!args[0])
            return msg.channel.send("Usage: !antilink " + client.commands.get("antilink").usage)
        if (!msg.member.hasPermission("MANAGE_GUILD"))
            return msg.channel.send("You haven't the permission to do that")
        input = args[0]
        if (input === "true") {
            authorize[msg.guild.id] = {
                active: true
            }
            saveFile(authorize, "./json/anti-link.json")
            msg.channel.send("Done ✅")
        } else if (input === "false") {
            authorize[msg.guild.id] = {
                active: false
            }
            saveFile(authorize, "./json/anti-link.json")
            msg.channel.send("Done ✅")
        } else {
            msg.channel.send("Usage: !antilink " + client.commands.get("antilink").usage)
        }
    }
}