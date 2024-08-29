const { check, validationResult } = require('express-validator');

const logInValidator = [
    check("email", "Invalid email").isEmail(),
    check("password", "Password required").notEmpty(),
    (req, res, next) => {
        console.log("checking errors")
        const errors = validationResult(req);
        console.log("errors->",errors)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


const registerValidator = [
    check("email", "please enter a valid email").isEmail(),

    check("mobileNo", "please enter a valid mobile number").isMobilePhone('any'), // 'any' locale or specify a locale like 'en-US'

    check("password").isLength({ min: 6, max: 16 }).withMessage("password length must be greater than 6 and less than 16 characters"),
        // .matches("/[A-Z]/").withMessage("password must contain atleast one capital case letter")
        // .matches("/[a-z]/").withMessage("password must contain atleast one lower case letter")
        // .matches("/0-9/").withMessage("password must contain atleast one digit"),

    check("fullName", "your full name must contain only letters").isAlpha('en-US', { ignore: ' ' }),

    function (req, res, next) {
        const errors = validationResult(req);
        console.log("express validator: ", errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        next();
    }
]
module.exports = { logInValidator, registerValidator };
