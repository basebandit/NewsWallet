const Article = require("../models/article.model");
const Category = require("../models/category.model");
const log = require("simple-node-logger").createSimpleLogger();

/**
 * @description Create an article
 * @param {Object} req HTTP Request Object
 * @param {Object} res HTTP Response Object
 */
exports.createArticle = async (req, res, next) => {
    try {
    //Lets check if this category already exists before creating it
        let article;
        if (req.body.category) {
            let category = await Category.findOne({ title: req.body.category });
            if (category) {
                article = new Article({
                    title: req.body.title,
                    description: req.body.description,
                    author: req.body.author ? req.body.author : "",
                    articleImage: req.file ? req.file.path : "",
                    origin: req.body.origin,
                    originUrl: req.body.originUrl,
                    category: category._id
                });

                article = await article.save();
            } else {
                category = new Category({
                    title: req.body.category
                });
                //check if article exists before creating category
                article = await Article.findOne({ originUrl: req.body.originUrl });

                if (!article) {
                    category = await category.save();

                    article = new Article({
                        title: req.body.title,
                        description: req.body.description,
                        author: req.body.author,
                        articleImage: req.file.path || "",
                        origin: req.body.origin,
                        originUrl: req.body.originUrl,
                        category: category._id
                    });

                    article = await article.save();
                } else {
                    return res.status(400).json({ message: "already exists" });
                }
            }
        }

        res.status(200).json({
            message: "Saved article successful",
            article: article
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @description Retrieve an article
 * @param {Object} req HTTP Request Object
 * @param {Object} res HTTP Response Object
 */
exports.retrieveArticle = async (req, res, next) => {
    const title = req.query.title;
    log.info(title);
    try {
        let article = await Article.findOne({ title: title })
            .populate("category")
            .exec();

        if (article) {
            return res.status(200).json({ article: article });
        }
        res.status(404).json({ message: "no such article" });
    } catch (err) {
        next(err);
    }
};

/**
 * @description Retrieve all articles
 *
 * @param {Object} req HTTP Request Object
 * @param {Object} res HTTP Response Object
 */
exports.retrieveArticles = async (req, res, next) => {
    let page = req.query.page ? req.query.page : "";
    try {
        let articles = await Article.find({});
        log.info(`articles ${JSON.stringify(articles)} `);
        //articles found
        if (articles) {
            return res.status(200).json({ articles: articles });
        }
        res.status(404).json({ message: "no articles" });
    } catch (err) {
        next(err);
    }
};

/**
 * @description Delete an article
 *
 * @param {Object} req HTTP Request Object
 * @param {Object} res HTTP Response Object
 */
exports.deleteArticle = async (req, res, next) => {
    const { title } = req.param;
    log.info(title);
    try {
        let article = await Article.findOneAndDelete({
            title: title
        });
        log.info(`article ${JSON.stringify(article)} deleted`);
        //article removed successfully
        if (article) {
            return res.status(200).json({ message: "delete successful" });
        }
        res.status(404).json("no such article");
    } catch (err) {
        next(err);
    }
};
