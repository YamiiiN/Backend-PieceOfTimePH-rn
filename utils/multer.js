const multer = require("multer");
const path = require("path");

module.exports = multer({
    limits: { fieldSize: 50 * 1024 * 1024 },
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        console.log(req.files)
        let ext = path.extname(file.originalname).toLowerCase();
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".webp") {
            cb(new Error("Unsupported file type!"), false);
            return;
        }
        cb(null, true);
    },
});