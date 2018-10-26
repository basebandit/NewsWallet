const Article = require("../models/article.model");
// const Category = require("../models/category.model");
const log = require("simple-node-logger").createSimpleLogger();

exports.createArticle = async (req, res) => {
    log.info(req.file);
    try {
        let article = new Article({
            title: req.body.title,
            description: req.body.description,
            author: req.body.author,
            articleImage: req.file.path || "",
            origin: req.body.origin,
            originUrl: req.body.originUrl,
            categoryList: req.body.category
        });

        article = await article.save();

        res.status(200).json({
            message: "Saved article successful",
            article: article
        });
    } catch (err) {
        log.error(err.message);
        res.status(500).json({ message: "Error when saving article" });
    }
};
