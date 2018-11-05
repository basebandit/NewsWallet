const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 *
 * @author basebandit
 *
 * @description Article schema
 */

const ArticleSchema = new Schema(
    {
        title: { type: String, required: [true, "Can't be blank"] },
        description: { type: String },
        author: { type: String },
        articleImage: { type: String },
        origin: { type: String, required: [true, "Can't be blank"] },
        originUrl: { type: String, unique: true },
        category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
        views: { type: Number, default: 0 },
        favoritesCount: { type: Number, default: 0 },
        slug: { type: String }
    },
    { timestamps: true }
);

/**
 * Increment favoritesCount by 1
 */
ArticleSchema.methods.incFavoritesCount = function() {
    const updates = { $inc: { favoritesCount: 1 } };
    return this.updateOne(updates);
};
/**
 * Decrement favoritesCount by 1
 */
ArticleSchema.methods.decFavoritesCount = function() {
    const updates = { $inc: { favoritesCount: -1 } };
    return this.updateOne(updates);
};
/**
 * Increment views by one
 */
ArticleSchema.methods.incViews = function() {
    const updates = { $inc: { views: 1 } };
    return this.updateOne(updates);
};

module.exports = mongoose.model("Article", ArticleSchema);
