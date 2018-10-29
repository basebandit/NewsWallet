const log = require("simple-node-logger").createSimpleLogger();
const User = require("../models/user.model");
/**
 * @description Perform user CRUD Operations
 */
class UserService {
    constructor() {}
    /**
   * @param {String} email User unique email
   * @param {String} password User unique password
   * @returns {Object} User Object
   * @description Creates a new user
   */
    async createUser(username, email, password) {
        try {
            let user = new User({
                username: username,
                email: email,
                password: password
            });
            user = await user.save();
            log.info("create User", user);
            return user;
        } catch (err) {
            throw Error("Error occurred while creating user");
        }
    }
    /**
   * @param {Object} user User object
   * @returns {Object} updated User object
   *
   * @description Updates an existing user
   */
    async updateUser(user) {
        let id = user._id;
        let oldUser;
        try {
            oldUser = await User.findById(id);

            // if there is no old user object return false or null
            if (!oldUser) {
                return false;
            }

            log.info(oldUser);

            // Edit the user object
            oldUser.email = user.email || oldUser.email;
            oldUser.password = user.password || oldUser.password;

            let savedUser = await oldUser.save();
            return savedUser;
        } catch (err) {
            throw Error("Error occurred while finding the user");
        }
    }
    /**
   * @param {String id} User unique id
   * @returns {Object} deletedUser Object
   *
   * @description Removes a user
   */
    async deleteUser(id) {
    // delete the user
        try {
            let deleted = await User.remove({ _id: id });
            if (deleted.result.n === 0) {
                throw Error("User could not be deleted");
            }
            return deleted;
        } catch (err) {
            throw Error("Error occurred while deleting the user");
        }
    }
    /**
   * @param {String} query Database query
   * @param {page} page Page number to query from
   * @param {limit} limit Number of maximum records to be returned by the query
   *
   * @description Retrieves all users
   */
    async getUsers(query, page, limit) {
    // options setup for the mongoose paginate
        let options = {
            page,
            limit
        };
        try {
            let users = await User.paginate(query, options);
            // return the user list that was returned by the mongoose promise
            return users;
        } catch (err) {
            throw Error("Error while paginating users");
        }
    }
    /**
   * @param {String} email User email
   * @param {String} password User password
   *
   * @returns {Object} authenticated user Object
   * @description Authenticates an existing user
   */
    async authenticate(username, password) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOne({
                    username: username
                });
                if (!user) {
                    reject(new Error("No User"));
                }
                User.getAuthenticated(username, password, (err, user, reason) => {
                    if (err) {
                        reject(err);
                    }
                    if (user) {
                        // handle login success
                        return resolve(user);
                    }
                    // Otherwise we can determine why we failed
                    let message;
                    const reasons = User.failedLogin;
                    switch (reason) {
                    case reasons.NOT_FOUND:
                    case reasons.PASSWORD_INCORRECT:
                        // note: these cases are usually treated the same - don't tell
                        // the user *why* the login failed, only that it did
                        message = "failure wrong password or username";
                        break;
                    case reasons.MAX_ATTEMPTS:
                        // send email or otherwise notify user that account is
                        // temporarily locked
                        message = "failure wrong password or username";
                        break;
                    }
                    reject(new Error(message));
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = UserService;
