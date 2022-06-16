
const fs = require('fs')


exports.delFile = (filename, callback) => {
    fs.unlink(`uploads/${filename}`, callback)
}