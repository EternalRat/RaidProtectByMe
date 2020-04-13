const fs = require("fs");
const raidmode = JSON.parse(fs.readFileSync("./json/raidmode.json"));
const {saveFile} = require("../../utils/utils.js")

module.exports = {
    name: "raidmode",
    aliases: ["rm"],
    category: "🤖 security 🤖",
    description: "Turn on the raidmode [default: false]",
    usage: "<true/false>",
    run: async(client, msg, args) => {
        var input = null

        if (!args[0])
            return msg.channel.send("Usage: !raidmode " + client.commands.get("raidmode").usage)
        if (!msg.member.hasPermission("MANAGE_GUILD"))
            return msg.channel.send("You haven't the permission to do that")
        input = args[0]
        if (input === "true") {
            raidmode[msg.guild.id] = {
                active: true
            }
            saveFile(raidmode, "./json/raidmode.json")
            msg.channel.send("Done ✅")
        } else if (input === "false") {
            raidmode[msg.guild.id] = {
                active: false
            }
            saveFile(raidmode, "./json/raidmode.json")
            msg.channel.send("Done ✅")
        } else {
            msg.channel.send("Usage: !raidmode " + client.commands.get("raidmode").usage)
        }
    }
}