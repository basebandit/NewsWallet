const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    title: { type: String, lowercase: true, unique: true },
    slug: { type: String }
});

module.exports = mongoose.model("Category", CategorySchema);
