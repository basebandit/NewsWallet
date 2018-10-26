// /*eslint no-unused-vars: ["error", { "varsIgnorePattern": "Category" }]*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema(
    {
        title: { type: String, required: [true, "Can't be blank"] },
        description: { type: String },
        author: { type: String },
        articleImage: { type: String },
        origin: { type: String, required: [true, "Can't be blank"] },
        originUrl: { type: String, unique: true },
        categoryList: [{ type: String }],
        views: { type: Number, default: 0 },
        favoritesCount: { type: Number, default: 0 }
    },
    { timestamps: true }
);

ArticleSchema.methods.updateFavoritesCount = function() {};
module.exports = mongoose.model("Article", ArticleSchema);
