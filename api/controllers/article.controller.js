const Article = require("../models/article.model");
const Category = require("../models/category.model");
const slugify = require("slug");
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
        if (req.body.category && req.body.article) {
            const { articleTitle, categoryTitle } = req.body;

            let category = await Category.findOne({ title: categoryTitle });

            //Cbeck if category already exists,we just add it to the article as a reference
            if (category) {
                article = new Article({
                    title: articleTitle,
                    description: req.body.description,
                    author: req.body.author ? req.body.author : "",
                    articleImage: req.file ? req.file.path : "",
                    origin: req.body.origin,
                    originUrl: req.body.originUrl,
                    slug: slugify(articleTitle, { lower: true }),
                    category: category._id
                });

                article = await article.save();
            } else {
                category = new Category({
                    title: categoryTitle,
                    slug: slugify(categoryTitle)
                });
                //check if article exists before creating category
                article = await Article.findOne({ originUrl: req.body.originUrl });

                if (!article) {
                    category = await category.save();

                    article = new Article({
                        title: articleTitle,
                        description: req.body.description,
                        author: req.body.author,
                        articleImage: req.file ? req.file.path : "",
                        origin: req.body.origin,
                        originUrl: req.body.originUrl,
                        slug: slugify(articleTitle, { lower: true }),
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
    const slug = req.params.slug;
    log.info(slug);
    try {
        let article = await Article.findOne({ slug: slug })
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
    const limit = req.query.limit ? Number(req.query.limit) : 1;

    const page = req.query.page ? Number(req.query.page) : 1;

    //calculate no. of documents to skip
    const offset = limit * page - limit;

    try {
        let articles = await Article.find({})
            .skip(offset)
            .limit(limit)
            .sort({ createdAt: "desc" })
            .populate("category")
            .exec();

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
        // res.status(404).json("no such article");
        return next(new Error("No such article"));
    } catch (err) {
        next(err);
    }
};
exports.favoriteArticle = async (req, res, next) => {
    const articleSlug = req.params.slug;
    try {
        const article = Article.findOne({ slug: articleSlug });
        //If such an article exists mark it as favorite
        if (article) {
            let favoritedArticle = await article.incFavoritesCount();

            //If successful then return
            if (favoritedArticle) {
                return res.status(200).json({ message: "Article marked as favorite" });
            }

            return next(new Error("Could not mark article as favorite"));
        } else {
            return next(new Error("No such article found"));
        }
    } catch (err) {
        next(err);
    }
};
