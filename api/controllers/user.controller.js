const UserService = require("../services/user.service");
const User = new UserService();
const jwt = require("jsonwebtoken");
const config = require("../../config");
const log = require("simple-node-logger").createSimpleLogger();

const secret = config.authentication.secret;

const genJWT = function(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    return jwt.sign(
        {
            id: user._id,
            username: user.username,
            exp: parseInt(exp.getTime() / 1000)
        },
        secret
    );
};

exports.createUser = async function(req, res) {
    //req.body contains the form submit values
    const { username, email, password } = req.body;
    try {
        let user = await User.createUser(username, email, password);

        res.status(200).json({
            message: "Registration successful",
            user: { username: user.username }
        });
    } catch (err) {
        log.error(err.message);
        res.sendStatus(500);
    }
};

exports.loginUser = async function(req, res) {
    //req.body contains the form submit values
    const { username, password } = req.body;
    log.info(username, password);
    try {
        let user = await User.authenticate(username, password);
        log.info(user);
        const accessToken = genJWT(user);
        return res.status(200).json({
            message: "Login successful",
            accessToken: accessToken
        });
    } catch (err) {
        log.error(err.message);
        res.sendStatus(500);
    }
};
