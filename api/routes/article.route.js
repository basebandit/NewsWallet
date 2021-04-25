const article = require("../controllers/article.controller");
const auth = require("../services/auth.service");
const validate = require("../services/validate.service");
const express = require("express");
const multer = require("multer");

/**
 *
 * @author basebandit
 *
 * @description Article routes
 */

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

//Create article
router.post(
    "/",
    auth.verify,
    upload.single("articleImage"),
    validate.createArticle,
    article.createArticle
);

//Retrieve article
router.get("/:slug", article.retrieveArticle);

//Retrieve articles
router.get("/", article.retrieveArticles);

//Retrieve articles in a category
router.get("/category/:slug", article.retrieveArticlesInCategory);

//Delete article
router.delete(
    "/:slug",
    auth.verify,
    validate.deleteArticle,
    article.deleteArticle
);

module.exports = router;
