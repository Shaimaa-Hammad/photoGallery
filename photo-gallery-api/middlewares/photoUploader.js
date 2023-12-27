/**
 * Module dependencies.
 */
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/png', 'image/jpeg'];

    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PNG and JPEG file types are allowed!'), false);
    }
};

/**
 * Middleware upload function.
 */
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

module.exports = upload;