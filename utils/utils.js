const fs = require("fs")

module.exports = {
    saveFile: function(file, path) {
        setInterval(() => {
            fs.writeFile(path, JSON.stringify(file), (err) => {
                if (err) console.log(err)
            })
        }, 2000)
    }
}