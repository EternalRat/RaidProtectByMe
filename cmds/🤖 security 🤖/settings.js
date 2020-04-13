const fs = require("fs")
const settings = JSON.parse(fs.readFileSync("json/settings.json"));
const {saveFile} = require("../../utils/utils.js")

module.exports = {
    name: "settings",
    aliases: ["s", "raider"],
    category: "🤖 security 🤖",
    description: "Turn on the kick if someone blacklisted come [default: false]",
    usage: "<true/false>",
    run: async(client, msg, args) => {
        var input = null

        if (!args[0])
            return msg.channel.send("Usage: !settings " + client.commands.get("settings").usage)
        if (!msg.member.hasPermission("MANAGE_GUILD"))
            return msg.channel.send("You haven't the permission to do that")
        input = args[0]
        if (input === "true") {
            settings[msg.guild.id] = {
                active: true
            }
            saveFile(settings, "./json/settings.json")
            msg.channel.send("Done ✅")
        } else if (input === "false") {
            settings[msg.guild.id] = {
                active: false
            }
            saveFile(settings, "./json/settings.json")
            msg.channel.send("Done ✅")
        } else {
            msg.channel.send("Usage: !settings " + client.commands.get("settings").usage)
        }
    }
}