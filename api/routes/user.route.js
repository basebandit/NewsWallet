const user = require("../controllers/user.controller");
const validate = require("../services/validate.service");

const express = require("express");

const router = express.Router();

/**
 *
 * @author basebandit
 *
 * @description Authentication routes
 */

router.post("/register", validate.register, user.createUser);
router.post("/login", validate.login, user.loginUser);

module.exports = router;
