const UserService = require("../services/user.service");

const User = new UserService();

const log = require("simple-node-logger").createSimpleLogger();

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
        res.status(400).json({ message: err.message });
    }
};

exports.loginUser = async function(req, res) {
    //req.body contains the form submit values
    const { username, password } = req.body;
    log.info(username, password);
    try {
        let user = await User.authenticate(username, password);
        return res.status(200).json({
            message: "Login successful",
            user: { username: user.username, email: user.email }
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
