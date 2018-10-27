const router = require("express").Router();

router.use("/api/v1/auth", require("./user.route"));
router.use("/api/v1/articles", require("./article.route"));
// router.use("/api/categories", require("./category.route"));

module.exports = router;
