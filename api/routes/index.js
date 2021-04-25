const router = require("express").Router();

/**
 *
 * @author basebandit
 *
 * @description Article routes middleware
 */

router.use("/api/v1/auth", require("./user.route"));
router.use("/api/v1/articles", require("./article.route"));

module.exports = router;
