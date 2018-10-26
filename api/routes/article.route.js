const article = require("../controllers/article.controller");
const express = require("express");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + "-" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    //reject a file
    if (file.mimtype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 //5mb
    },
    fileFilter: fileFilter
});

router.post("/create", upload.single("articleImage"), article.createArticle);
// router.get("/read", validate.login, user.loginUser);

module.exports = router;
