const Article = require("../models/article.model");
const Category = require("../models/category.model");
const log = require("simple-node-logger").createSimpleLogger();

exports.createArticle = async (req, res) => {
    log.info(req.file);
    try {
    //Lets check if this category already exists before creating it
        let article;
        if (req.body.category) {
            let category = await Category.findOne({ title: req.body.category });
            if (category) {
                article = new Article({
                    title: req.body.title,
                    description: req.body.description,
                    author: req.body.author,
                    articleImage: req.file.path || "",
                    origin: req.body.origin,
                    originUrl: req.body.originUrl,
                    categoryList: category._id
                });
            } else {
                category = new Category({
                    title: req.body.category
                });

                category = await category.save();
            }
            article = await article.save();
        }

        res.status(200).json({
            message: "Saved article successful",
            article: article
        });
    } catch (err) {
        log.error(err.message);
        res.status(400).json({ message: "already exists" });
    }
};
