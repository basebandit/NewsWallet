const Joi = require("joi");
const log = require("simple-node-logger").createSimpleLogger();
/**
 *
 * @author basebandit
 *
 * Validate against malicious user input
 */

const createUserSchema = Joi.object().keys({
    username: Joi.string()
        .alphanum()
        .min(2)
        .max(30)
        .required(),
    email: Joi.string().email({ minDomainAtoms: 2 }),
    password: Joi.string()
        .alphanum()
        .min(8)
        .max(30)
        .required()
});
const loginUserSchema = Joi.object().keys({
    username: Joi.string()
        .alphanum()
        .min(2)
        .max(30)
        .required(),
    password: Joi.string()
        .alphanum()
        .min(8)
        .max(30)
        .required()
});

const createArticleSchema = Joi.object().keys({
    title: Joi.string()
        .min(2)
        .required(),
    description: Joi.string()
        .min(8)
        .required(),
    author: Joi.string(),
    category: Joi.string(),
    origin: Joi.string().required(),
    originUrl: Joi.string().required()
});

const retrieveArticleSchema = Joi.object().keys({
    title: Joi.string().min(2)
});

const retrieveArticlesSchema = Joi.object().keys({
    page: Joi.number()
        .integer()
        .positive(),
    limit: Joi.number()
        .integer()
        .positive()
});
/**
 * @description Will be exposed as middleware for validating user input in the create user route
 *
 * @param {Object} req HTTP Request Object
 * @param {Object} res HTTP Response Object
 *
 */
exports.register = function(req, res, next) {
    createUserSchema
        .validate(req.body, { abortEarly: false })
        .then(validatedUser => {
            log.info(`user ${JSON.stringify(validatedUser)} created`);
            next();
        })
        .catch(validationError => {
            const errorMessage = validationError.details.map(d => d.message);
            next(new Error(errorMessage));
        });
};
/**
 * @description Will be exposed as middleware for validating user input in the login route
 *
 * @param {Object} req HTTP Request Object
 * @param {Object} res HTTP Response Object
 */
exports.login = function(req, res, next) {
    loginUserSchema
        .validate(req.body, { abortEarly: false })
        .then(validatedUser => {
            log.info(`user ${JSON.stringify(validatedUser)} logged in`);
            next();
        })
        .catch(validationError => {
            const errorMessage = validationError.details.map(d => d.message);

            next(new Error(errorMessage));
        });
};
/**
 * @description Will be exposed as middleware for validating user input in the create article route
 *
 * @param {Object} req HTTP Request Object
 * @param {Object} res HTTP Response Object
 */
exports.createArticle = function(req, res, next) {
    createArticleSchema
        .validate(req.body, { abortEarly: false })
        .then(validatedArticle => {
            log.info(`user ${JSON.stringify(validatedArticle)} created`);
            next();
        })
        .catch(validationError => {
            const errorMessage = validationError.details.map(d => d.message);
            next(new Error(errorMessage));
        });
};

exports.readArticle = function(req, res, next) {
    retrieveArticleSchema
        .validate(req.query, { abortEarly: false })
        .then(validatedArticle => {
            log.info(`article ${JSON.stringify(validatedArticle)} found`);
            next();
        })
        .catch(validationError => {
            const errorMessage = validationError.details.map(d => d.message);
            next(new Error(errorMessage));
        });
};

exports.fetchArticles = function(req, res, next) {
    retrieveArticlesSchema
        .validate(req.query, { abortEarly: false })
        .then(validatedArticles => {
            log.info(`articles ${JSON.stringify(validatedArticles)} retrieved`);
            next();
        })
        .catch(validationError => {
            const errorMessage = validationError.details.map(d => d.message);
            next(new Error(errorMessage));
        });
};

exports.deleteArticle = function(req, res, next) {
    retrieveArticleSchema
        .validate(req.query, { abortEarly: false })
        .then(validatedArticle => {
            log.info(`article ${JSON.stringify(validatedArticle)} found`);
            next();
        })
        .catch(validationError => {
            const errorMessage = validationError.details.map(d => d.message);
            next(new Error(errorMessage));
        });
};
