const {RichEmbed} = require("discord.js")
const {stripIndents} = require("common-tags")

module.exports = {
    name: "help",
    aliases: ["h"],
    category: "other",
    description: "Show the help",
    usage: null,
    run: async(client, msg, args) => {
        if (!args[0])
            getAll(client, msg);
        else
            getCMD(client, msg, args[0]);
    }
}

function getCMD(client, msg, cmd) {
    const embed = new RichEmbed()
    const command = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd.toLowerCase()))
    let info = `No information found for command **${cmd.toLowerCase}**`

    if (!command)
        return (msg.channel.send(embed.setColor("RANDOM").setDescription(info)))
    
    if (command.name) info = `**Name**: ${command.name}\n`
    if (command.aliases) info += `**Aliases**: ${command.aliases.map(a => `\`${a}\``).join(", ")}\n`
    if (command.description) info += `**Description**: ${command.description}\n`
    if (command.usage) {
        info += `**Usage**: ${command.usage}`
        embed.setFooter("Syntax: <> = require, [] = optional")
    }
    return (msg.channel.send(embed.setColor("RANDOM").setDescription(info)))
}

function getAll(client, msg) {
    const embed = new RichEmbed()
        .setColor("RANDOM")
        .setThumbnail(msg.guild.iconURL)
        .setTitle("Help menu")
        .setDescription("For more information, type !help <command>")
        .setAuthor(msg.author.username, msg.author.displayAvatarURL)
        .setFooter(client.user.username, client.user.displayAvatarURL)
    const cmds = (category) => {
        return client.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => `- \`${cmd.name}\`: ${cmd.description}`)
            .join("\n")
    }
    const info = client.categories
        .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${cmds(cat)}`)
        .reduce((string, category) => string + "\n" + category)
    
    return msg.channel.send(embed.setDescription(info))
}

