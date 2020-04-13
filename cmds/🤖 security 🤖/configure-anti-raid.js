const antiraid = JSON.parse(require("fs").readFileSync("./json/anti-raid.json"));
const {saveFile} = require("../../utils/utils.js")


module.exports = {
    name: "anti-raid",
    aliases: ["ar", "raid"],
    category: "🤖 security 🤖",
    description: "configure the anti-raid (mass join)",
    usage: "<delay before activation (in second)> <number of people> between 1 and 10 seconds both of them",
    run: async(client, msg, args) => {
        var times = null
        var number = null

        if (!args[0] || !args[1])
            return msg.channel.send("Usage: !anti-raid " + client.commands.get("anti-raid").usage)
        if (!msg.member.hasPermission("MANAGE_GUILD"))
            return msg.channel.send("You haven't the permission to do that")
        times = Number(args[0])
        number = Number(args[1])
        if (times <= 0 || times > 10 || number <= 0 || number > 10)
            return msg.channel.send("Usage: !anti-raid " + client.commands.get("anti-raid").usage)
        antiraid[msg.guild.id] = {
            time: times,
            people: number
        }
        saveFile(antiraid, "./json/anti-raid.json")
        msg.channel.send("The bot has been configured.")
    }
}