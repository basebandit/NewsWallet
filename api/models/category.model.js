const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 *
 * @author basebandit
 *
 * @description Category schema
 */

const CategorySchema = new Schema({
    title: { type: String, lowercase: true, unique: true },
    slug: { type: String }
});

module.exports = mongoose.model("Category", CategorySchema);
