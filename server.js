const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const log = require("simple-node-logger").createSimpleLogger();
const config = require("./config");

const isProduction = process.env.NODE_ENV === "production";

log.info(isProduction);

const userRoutes = require("./api/routes/user.route");
const articleRoutes = require("./api/routes/article.route");
const app = express();

const port = process.env.PORT;

// const uri = `mongodb://appuser:newswallet@localhost:14045/newswallet`;
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
app.use(bodyParser.urlencoded({ extended: true })); //accept any type
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads")); //expose static uploads file to world
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/article", articleRoutes);

mongoose.Promise = global.Promise;

mongoose.connect(
    uri,
    { useNewUrlParser: true }
);

//To avoid deprecated warning on latest mongoose version when creating unique indexes
mongoose.set("useCreateIndex", true);

//catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

//Error Handlers
app.use((err, req, res) => {
    log.err(err.stack);

    res.status(err.status || 500);

    res.json({
        errors: {
            message: err.message,
            error: err
        }
    });
});

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
