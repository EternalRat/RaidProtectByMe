const {readdirSync} = require("fs")
const ascii = require("ascii-table")

const table = new ascii().setHeading("Commands loaded", "Status", "Category")
const Loaded_commands = new ascii().setHeading("Number", "Status")

table.setTitle("Command Handler")
Loaded_commands.setTitle("Status bot")

module.exports = (client) => {
    let count = 0
    let status = ["OK", "QUITE FINE", "NOT WORKING"]
    let total = 0
    let j = 0

    readdirSync("./cmds/").forEach(dir => {
        const commands = readdirSync(`./cmds/${dir}/`).filter(f => f.endsWith(".js"))

        for (let file of commands) {
            let pull = require(`../cmds/${dir}/${file}`)
            total++
            if (pull.name) {
                client.commands.set(pull.name, pull)
                count++
                table.addRow(file, "Loaded", pull.category)
            } else {
                table.addRow(file, "Error", pull.category)
                continue;
            }
            if (pull.aliases && Array.isArray(pull.aliases))
                pull.aliases.forEach(alias => client.aliases.set(alias, pull.name))
        }
    })
    if (count / total >= 0.70)
        j = 0;
    else if (count / total >= 0.40 && count / total < 0.70)
        j = 1
    else
        j = 2
    Loaded_commands.addRow(count, status[j])
    console.log(table.toString() + "\n" + Loaded_commands.toString())
}