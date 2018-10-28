const express = require("express");
const { AssertionError } = require("assert");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const log = require("simple-node-logger").createSimpleLogger();
const config = require("./config");
const rfs = require("rotating-file-stream");
const path = require("path");
const fs = require("fs");

const isProduction = process.env.NODE_ENV === "production";

const logDirectory = path.join(__dirname, "log");

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
const accessLogStream = rfs("access.log", {
    interval: "1d", // rotate daily
    path: logDirectory
});

const userRoutes = require("./api/routes/user.route");
const articleRoutes = require("./api/routes/article.route");

const app = express();

const port = process.env.PORT;

const uri = `mongodb://${config.user}:${config.pwd}@${config.host}:${
    config.port
}/${config.db}`;

log.info(uri);

/**
 * Middlewares
 */
app.use(cors()); //set necessary headers to allow cors
app.use(helmet()); //add security headers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require("./api/routes"));

if (isProduction) {
    app.use(morgan("combined", { stream: accessLogStream })); // log http requests
} else {
    app.use(morgan("dev"));
}
app.use("/uploads", express.static("uploads"));

mongoose.Promise = global.Promise;

if (isProduction) {
    mongoose.connect(
        uri,
        { useNewUrlParser: true }
    );
    //To avoid deprecated warning on latest mongoose version when creating unique indexes
    mongoose.set("useCreateIndex", true);
} else {
    mongoose.connect(
        uri,
        { useNewUrlParser: true }
    );
    mongoose.set("debug", true);
    mongoose.set("useCreateIndex", true);
}

//catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

/* eslint no-unused-vars:["warn",{ignoreRestSiblings:true}] */

if (!isProduction) {
    app.use((err, req, res, next) => {
        log.error(err.message);

        res.status(err.status || 503);

        res.json({
            errors: {
                message: err.message,
                error: err
            }
        });
    });
} else {
    // production error handler
    // no stacktraces leaked to user
    app.use((err, req, res, next) => {
        res.status(err.status || 503);
        res.json({
            errors: {
                message: err.message,
                errors: {}
            }
        });
    });
}

//let's start our server...
mongoose.connection.once("open", () => {
    log.info(`Successfully connected to the database`);
    app.listen(port, () => {
        log.info(`Server live on ${port}`);
    });
});

//listen for any connection errors
mongoose.connection.on("error", err => {
    log.error(err.message);
});

//Listen for Unhandled Promise rejections from the global promise object
process.on("UnhandledRejection", reason => {
    log.warn(`Unhandled rejection at: ${reason.stack || reason}`);
});
