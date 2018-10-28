// const UserService = require("../services/user.service");
// const User = new UserService();
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const log = require("simple-node-logger").createSimpleLogger();

const secret = config.authentication.secret;
const expiry = 60 * 6; //6mins
const genJWT = function(user) {
    return jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        secret,
        { expiresIn: expiry }
    );
};

exports.createUser = async function(req, res, next) {
    //req.body contains the form submit values
    const { username, email, password } = req.body;
    try {
        let user = new User({
            username: username,
            email: email,
            password: password
        });

        user = await user.save();

        res.status(200).json({
            message: "Registration successful",
            user: { username: user.username }
        });
    } catch (err) {
        next(err);
    }
};

exports.loginUser = async function(req, res, next) {
    //req.body contains the form submit values
    const { username, password } = req.body;
    log.info(username, password);
    try {
        let user = await User.authenticate(username, password);
        log.info(user);
        const accessToken = genJWT(user);
        return res.status(200).json({
            accessToken: accessToken,
            expiresIn: expiry
        });
    } catch (err) {
        next(err);
    }
};
