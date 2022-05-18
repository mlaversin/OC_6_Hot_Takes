const multer = require('multer')

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads')
  },
  filename: (req, file, callback) => {
    const name = (Math.random() + 1).toString(36).substring(2)
    const extension = MIME_TYPES[file.mimetype]
    callback(null, name + Date.now() + '.' + extension)
  },
})

module.exports = multer({ storage }).single('image')
