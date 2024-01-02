let multer = require('multer');
const { v4: uuidv4 } = require('uuid');

let storage = multer.diskStorage({
    destination: (req, file, path) => {
        path(null, 'public/images')
    },
    filename: (req, file, path) => {
        path(null, uuidv4() + (file.originalname.substring(file.originalname.lastIndexOf('.'))))
    }
});

let upload = multer({ storage: storage })
module.exports = upload;