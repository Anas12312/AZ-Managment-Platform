const util = require("util");
const multer = require("multer");
const path = require("path")
const generateUuid = require("../utils/generateUuid")
const maxSize = 2 * 1024 * 1024;
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("./uploads"));
  },
  filename: (req, file, cb) => {
    const id = generateUuid() + '.' + file.originalname.split('.').pop();
    req.id = id
    cb(null, id);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

// create the exported middleware object
let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;