//Module
const Discord = require("discord.js");
const client = new Discord.Client({disableEveryone: true});
const fs = require("fs");
const moment = require("moment")

//Fichier perso
const banlist = JSON.parse(fs.readFileSync("./json/blacklist.json"));
const settings = JSON.parse(fs.readFileSync("./json/settings.json"));
const raidmode = JSON.parse(fs.readFileSync("./json/raidmode.json"));
const authorize = JSON.parse(fs.readFileSync("./json/allowed_channel.json"))
const antilink = JSON.parse(fs.readFileSync("./json/anti-link.json"))
const antiraid = JSON.parse(fs.readFileSync("./json/anti-raid.json"));
const {saveFile} = require("./utils/utils.js");
client.mutes = require("./json/mutes.json");
const {prefix, version, author, token} = require("./botSettings.json");

//Handler
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = fs.readdirSync("./cmds/");
["handler"].forEach(handler => {
    require(`./loading_cmd/${handler}`)(client);
})

//Variable global
var tab = new Array();
var lastTimestamp = 0;
var i = 0;

client.on("ready", async () => {
    console.log(`${client.user.username} prêt !`)

    let status1 = [
        prefix + "help",
        `Ready to protect ${client.guilds.size} server(s)`,
        "Made by " + author,
        "Coded in Javascript",
        "Version " + version
    ]
    client.setInterval(function () {
        let status = status1[Math.floor(Math.random() * status1.length)]
        client.user.setActivity(status)
    }, 10000)
    client.guilds.forEach(guild => {
        tab[i] = new Array()
        tab[i][1] = new Array();
        tab[i][0] = new Array()
        tab[i][0].push(guild.id)
        i++
    })
    client.setInterval(() => {
        for (let i in client.mutes) {
            let time = client.mutes[i].time
            let guildID = client.mutes[i].guild
            let guild = client.guilds.get(guildID)
            let member = guild.members.get(i)
            let mutedRole = guild.roles.find(r => r.name === "Muted")
            if (!mutedRole) continue
            if (Date.now() > time) {
                console.log(`${i} is now able to be unmuted!`)
                member.removeRole(mutedRole)
                delete client.mutes[i]
                fs.writeFile("./json/mutes.json", JSON.stringify(client.mutes), err => {
                    if (err) throw err
                    console.log(`I have unmuted ${member.user.tag}.`)
                })
            }
        }
    }, 5000)
    client.setInterval(() => {
        var x = 0
        while (tab[x]) {
            tab[x][1] = []
            x++
        }
    }, 30000);
})

client.on("guildCreate", async (guild) => {
    tab[i] = new Array();
    tab[i][1] = new Array();
    tab[i][0] = new Array();
    tab[i][0].push(guild.id)
    i++
    antiraid[guild.id] = {
        time: 3,
        people: 5
    }
    saveFile(antiraid, "./json/anti-raid.json")
    antilink[guild.id] = {
        active: false
    }
    saveFile(antilink, "./json/anti-link.json")
    authorize[guild.id] = {
        channels: []
    }
    saveFile(authorize, "./json/allowed_channel.json")
    settings[guild.id] = {
        active: false
    }
    saveFile(settings, "./json/settings.json")
    raidmode[guild.id] = {
        active: false
    }
    saveFile(raidmode, "./json/raidmode.json")
})

client.on("guildDelete", async(guild) => {
    delete antiraid[guild.id]
    saveFile(antiraid, "./json/anti-raid.json")
    delete antilink[guild.id]
    saveFile(antilink, "./json/anti-link.json")
    delete authorize[guild.id]
    saveFile(authorize, "./json/allowed_channel.json")
    delete settings[guild.id]
    saveFile(settings, "./json/settings.json")
    delete raidmode[guild.id]
    saveFile(raidmode, "./json/raidmode.json")
})

client.on("guildMemberAdd", async(member, guild) => {
    let x = 0

    if (raidmode[member.guild.id].active == true) {
        member.send("Kick for : Raidmode on, come back later")
        client.guilds.get(member.guild.id).members.get(member.id).kick("RaidMode actif")
    }
    if (banlist[member.user.id] && settings[member.guild.id].active == false)
        member.guild.owner.send("Be careful ! A blacklisted person has been added to your server ! Here is his name : " + member.user.tag + "\nFor having more information about the reason why he is in the blacklist type s!checkid with his id")
    else if (banlist[member.user.id] && settings[member.guild.id].active == true)
        client.guild.members.get(member.user.id).ban("Blacklisted")
    for (; x < tab.length; x++)
        if (tab[x][0][0] == member.guild.id)
            break
    tab[x][1].push(member.user.id)
    if ((member.joinedTimestamp - lastTimestamp) < (antiraid[member.guild.id].times * 1000)) {
        if (tab[x][1].length >= antiraid[member.guild.id].people) {
            var j = 0
            for (; j < tab[x][1].length; j++) {
                member.guild.members.get(tab[x][1][j]).ban("RAID")
                banlist[tab[x][1][j]] = {
                    reason: "Raider"
                }
            }
            if (j === tab[x][1].length) {
                tab[x][1] = []
                lastTimestamp = 0
                member.guild.owner.send("Un raid a été évité et l'antiraid a été activé !")
            }
            saveFile(banlist, "./json/blacklist.json")
        }
    } else {
        lastTimestamp = member.joinedTimestamp
    }
})

client.on('messageDelete', async (message) => {
    if (message.author.id === "593409768568258611") return
    const logs = message.guild.channels.find(ch => ch.name === "logs-message")
    if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) {
        await message.guild.createChannel('logs-message', 'text')
    } else if (!logs) {
        return console.log('The logs channel does not exist and cannot be created')
    }
    const entry = await message.guild.fetchAuditLogs({
        type: 'MESSAGE_DELETE'
    }).then(audit => audit.entries.first())
    let user
    if (entry.extra.channel === message.channel && (entry.target.id === message.author.id) && (entry.createdTimestamp > (Date.now() - 5000)) && (entry.extra.count >= 1)) {
        user = entry.executor.username
    } else {
        user = message.author
    }
    if (logs) {
        if (!message.content) return
        const logembed = new Discord.RichEmbed()
            .setTitle('Message Deleted')
            .setAuthor(user.tag, message.author.displayAvatarURL)
            .addField(`**Message sent by ${message.author.username} has been deleted in ${message.channel.name}**`, message.content)
            .addField("Date du message:", moment.utc(message.createdTimestamp).format("dddd Do MMMM in YYYY, HH:mm:ss"))
            .setColor("#FF0000")
            .setFooter(`#${message.channel.name}`)
            .setTimestamp()
        logs.send(logembed)
    }
})

client.on("messageUpdate", async(oldMsg, newMsg) => {
    if (antilink[oldMsg.guild.id].active == true) {
        if (newMsg.member.hasPermission("MANAGE_GUILD")) return
        if ((newMsg.cleanContent.includes("https://") || newMsg.cleanContent.includes("http://") || newMsg.cleanContent.includes("www.")) && !authorize[newMsg.guild.id].channels.indexOf(newMsg.channel.id)) {
            newMsg.delete().catch();
            newMsg.channel.send("Any link here !")
        }
    }
    if (newMsg.channel.type == 'text' && newMsg.cleanContent != oldMsg.cleanContent) {
        var log = newMsg.guild.channels.find(ch => ch.name === "logs-message")
        if (!log)
            await message.guild.createChannel('logs-message', 'text')
        if (log != null) {
            const logembed = new Discord.RichEmbed()
                .setTitle('Message updated')
                .setAuthor(newMsg.author.username, newMsg.author.displayAvatarURL)
                .setDescription(`**Message sent by ${newMsg.author.username} has been updated in ${newMsg.channel.name}**`)
                .addField("Before :", oldMsg.cleanContent)
                .addField("After :", newMsg.cleanContent)
                .addField("Modification date:", moment.utc(newMsg.editedTimestamp).format("dddd Do MMMM in YYYY, HH:mm:ss"))
                .setColor("#FF0000")
                .setThumbnail(client.user.avatarURL)
                .setFooter(`#${newMsg.channel.name}`)
                .setTimestamp()
            log.send(logembed)
        }
    }
})

client.on("message", async(message) => {
    let messageArray = message.content.split(" ")
    let command = messageArray[0]
    let args = messageArray.slice(1)
    let cmds = command.slice(prefix.length)
    let cmd = client.commands.get(cmds)

    if (antilink[message.guild.id].active == true) {
        if (message.member.hasPermission("MANAGE_GUILD")) return
        if ((message.content.includes("https://") || message.content.includes("http://") || message.content.includes("www.")) && !authorize[message.guild.id].channels.indexOf(message.channel.id)) {
            message.delete().catch();
            message.channel.send("Any link here !")
        }
    }
    if (message.author.bot) return;
    if (!command.startsWith(prefix)) return
    if (!cmd) cmd = client.commands.get(client.aliases.get(cmds))
    if (cmd) {
        cmd.run(client, message, args)
    } else {
        message.channel.send("Wrong command!")
        cmd = client.commands.get("help")
        cmd.run(client, message, args)
    }
})

client.login(token)