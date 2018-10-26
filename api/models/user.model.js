/**
 * @author basebandit
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

/**
 * Constants
 */
const SALT_WORK_FACTOR = 10; //10 rounds
const MAX_LOGIN_ATTEMPTS = 5; //max of 5 attempts
const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hour lock

const Schema = mongoose.Schema;

/**
 * Define our schema for our users collection
 */
const UserSchema = new Schema(
    {
        username: { type: String, required: true, index: true, unique: true },
        email: {
            type: String,
            required: [true, "Can't be blank"],
            index: true,
            unique: true
        },
        password: { type: String, required: [true, "Can't be blank"] },
        loginAttempts: { type: Number, required: true, default: 0 },
        lockUntil: { type: Number }
    },
    { timestamps: true }
);

UserSchema.virtual("isLocked").get(function() {
    // Check for a future lockUntil timestamp
    return !!(this.lockUntil && this.lockUntil > Date.now());
});
UserSchema.pre("save", function(next) {
    let user = this;

    // only hash the password if it has been modified(or is new)
    if (!user.isModified("password")) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next();

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return callback(err, isMatch);
        callback(null, isMatch);
    });
};

UserSchema.methods.incLoginAttempts = function(callback) {
    // If we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne(
            {
                $set: { loginAttempts: 1 },
                $unset: { lockUntil: 1 }
            },
            callback
        );
    }
    // Otherwise we're incrementing
    const updates = { $inc: { loginAttempts: 1 } };
    // lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }
    return this.updateOne(updates, callback);
};
// expose enum on the model and provide an internal convenience reference
const reasons = (UserSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
});

UserSchema.statics.getAuthenticated = function(username, password, callback) {
    this.findOne({ username: username }, function(err, user) {
        if (err) {
            return callback(err);
        }
        // Make sure the user exists
        if (!user) {
            return callback(null, null, reasons.NOT_FOUND);
        }
        // Check if account is currently locked
        if (user.isLocked) {
            // just increment login attempts if account is already locked
            return user.incLoginAttempts(function(err) {
                if (err) {
                    return callback(err);
                }
                return callback(null, null, reasons.MAX_ATTEMPTS);
            });
        }
        // Test for a matching password
        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                return callback(err);
            }
            // check if the password was a match
            if (isMatch) {
                // If there is no lockor failed attempts,just return the user
                if (!user.loginAttempts && !user.lockUntil) {
                    return callback(null, user);
                }
                // Reset attempts and lock info
                const updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };
                return user.updateOne(updates, function(err) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, user);
                });
            }
            // Password is incorrect, so increment login attempts before responding
            user.incLoginAttempts(function(err) {
                if (err) {
                    return callback(err);
                }
                return callback(null, null, reasons.PASSWORD_INCORRECT);
            });
        });
    });
};

UserSchema.statics.authenticate = function(username, password) {
    const self = this;
    return new Promise(async (resolve, reject) => {
        try {
            const user = await self.findOne({
                username: username
            });
            if (!user) {
                reject(new Error("No User"));
            }
            user.getAuthenticated(username, password, (err, user, reason) => {
                if (err) {
                    reject(err);
                }
                if (user) {
                    // handle login success
                    return resolve(user);
                }
                // Otherwise we can determine why we failed
                let message;
                const reasons = self.failedLogin;
                switch (reason) {
                case reasons.NOT_FOUND:
                case reasons.PASSWORD_INCORRECT:
                    // note: these cases are usually treated the same - don't tell
                    // the user *why* the login failed, only that it did
                    message = "failure wrong password or username";
                    break;
                case reasons.MAX_ATTEMPTS:
                    // send username or otherwise notify user that account is
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
};
module.exports = mongoose.model("User", UserSchema);
