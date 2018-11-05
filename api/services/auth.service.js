const jwt = require("jsonwebtoken");
const config = require("../../config");
const User = require("../models/user.model");

/**
 *
 * @author basebandit
 *
 * Validate user
 */

exports.verify = (req, res, next) => {
    let token = req.headers["authorization"];
    if (token && token.indexOf("Bearer") !== -1) {
        try {
            token = token.split(" ")[1].trim();
            jwt.verify(token, config.authentication.secret, async (err, decoded) => {
                if (err) {
                    next(err);
                }
                const { username } = decoded;
                const user = await User.findOne({ username: username });
                if (!user) {
                    return res.status(404).json({ message: "Not found" });
                }
                next();
            });
        } catch (err) {
            next(err);
        }
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
};
