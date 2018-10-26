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
        log.error(err.message);
        res.status(400).json({ message: "already exists" });
    }
};

// exports.readArticle = async (req, res) => {
//     if(req.param){

//     }
// };
