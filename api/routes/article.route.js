const article = require("../controllers/article.controller");
const auth = require("../services/auth.service");
const validate = require("../services/validate.service");
const express = require("express");
const multer = require("multer");

const router = express.Router();

/**
 * multer storage options and destination folder
 */
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + "-" + file.originalname);
    }
});

/**
 * Filter function for multer to specify types of
 * images we require
 */
const fileFilter = (req, file, cb) => {
    //reject a file
    if (file.mimtype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
/**
 * Multer configuration for uploading files
 * We are limiting files to 5mb
 */
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 //5mb
    },
    fileFilter: fileFilter
});

/*********************************************
 * Article Routes
 *
 * @see Articles with auth.verify are protected
 *
 *********************************************/

//Only logged in users can create articles
router.post(
    "/create",
    auth.verify,
    upload.single("articleImage"),
    validate.createArticle,
    article.createArticle
);

//Anyone can read article
router.get("/:article", validate.readArticle, article.readArticle);

module.exports = router;
