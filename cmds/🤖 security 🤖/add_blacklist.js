const fs = require("fs");
const banlist = JSON.parse(fs.readFileSync("json/blacklist.json"));
const {saveFile} = require("../../utils/utils.js")

module.exports = {
    name: "blacklist",
    aliases: ["bl", "add"],
    category: "🤖 security 🤖",
    description: "Add an user to the blacklist",
    usage: "<@user> <reason>",
    run: async(client, msg, args) => {
        if (msg.author.id === "291646942038196224") {
            let target = args[0] || msg.mentions.users.first().id;
            if (!target) {
                msg.channel.send("Usage: <@user> <reason>");
                return
            }
            let reason = args.join(" ").slice(22);
            if (!reason) {
                msg.channel.send("Usage: <@user> <reason>");
                return
            }
            if (!banlist[target]) {
                msg.channel.send("This user has been added to the blacklist")
                banlist[target] = {
                    reason: reason
                }
                saveFile(banlist, "./json/blacklist.json")
            } else {
                const filter = (reaction, user) => ["👍", "👎"].includes(reaction.emoji.name) && user.id === msg.author.id
                msg.channel.send("This user is already in the blacklist, do you want to remove it ? Use the current reaction bellow.").then(msg => {
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
                                delete banlist[target]
                                msg.channel.send("This user has been removed from the blacklist.")
                                saveFile(banlist, "./json/blacklist.json")
                                break
                            case "👎":
                                msg.chanel.send("Okay boss.")
                                break
                        }
                    })
                })
            }
        } else {
            msg.channel.send("You aren't my boss")
        }
    }
}