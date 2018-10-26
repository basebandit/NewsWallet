// const Joi = require("joi");
// const log = require("simple-node-logger").createSimpleLogger();
// /**
//  *
//  * @author basebandit
//  *
//  * Validate against malicious user input
//  */

// const articleSchema = Joi.object().keys({
//     title: Joi.string()
//         .alphanum()
//         .min(2)
//         .required(),
//     image: Joi.string().image(),
//     password: Joi.string()
//         .alphanum()
//         .min(8)
//         .max(30)
//         .required()
// });

// /**
//  * @description Will be exposed as middleware for validating user input in the create user route
//  *
//  * @param {Object} req HTTP Request Object
//  * @param {Object} res HTTP Response Object
//  *
//  */
// exports.register = function(req, res, next) {
//     createUserSchema
//         .validate(req.body, { abortEarly: false })
//         .then(validatedUser => {
//             log.info(`user ${JSON.stringify(validatedUser)} created`);
//             next();
//         })
//         .catch(validationError => {
//             const errorMessage = validationError.details.map(d => d.message);
//             res.status(400).json({ message: errorMessage });
//         });
// };
// /**
//  * @description Will be exposed as middleware for validating user input in the login route
//  *
//  * @param {Object} req HTTP Request Object
//  * @param {Object} res HTTP Response Object
//  */
// exports.login = function(req, res, next) {
//     loginUserSchema
//         .validate(req.body, { abortEarly: false })
//         .then(validatedUser => {
//             log.info(`user ${JSON.stringify(validatedUser)} logged in`);
//             next();
//         })
//         .catch(validationError => {
//             const errorMessage = validationError.details.map(d => d.message);
//             res.status(400).json({ message: errorMessage });
//         });
// };
