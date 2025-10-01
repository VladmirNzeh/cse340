const utilities = require(".")
const accountModel = require("../models/account-model")
const {body, validationResult} = require("express-validator")
const validate = {}

/* **************************
 * Registration Data Validation Rules
 * Server-side validation
 ***************************** */
validate.registrationRules = () => {
    return [
        //firstname is required and must be string
        body("account_firstname")
          .trim() // sanitizing function
          .escape()
          .notEmpty()
          .isLength({min: 1}) // validation function
          .withMessage("Please provide a first name."),

        // name is required and must be string
        body("account_lastname")
          .trim() // sanitizing function
          .escape()
          .notEmpty()
          .isLength({min: 2}) // validation function
          .withMessage("Please provide a last name."),
        // valide email is required and cannot already exist in the database
        body("account_email")
          .trim() // sanitizing function
          .escape()
          .notEmpty()
          .isEmail()
          .normalizeEmail()// refer to validator.js docs
          .withMessage("A valid email is required.")
          .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (emailExists){
              throw new Error("Email exists. Please log in or use different email")
            }
          }),
        
        // password is required and must be strong password
        body("account_password")
          .trim()
          .notEmpty()
          .isStrongPassword({
            minlength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
          })
          .withMessage("Password does not meet requirements.")
    ]
}

/* **************************
 * Registration Data Validation Rules
 * Server-side validation
 ***************************** */
validate.loginRules = () => {
    return [
        body("account_email")
          .trim() // sanitizing function
          .escape()
          .notEmpty()
          .isEmail()
          .normalizeEmail()// refer to validator.js docs
          .withMessage("A valid email is required."),
        
        // password is required and must be strong password
        body("account_password")
          .trim()
          .notEmpty()
          .isStrongPassword({
            minlength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
          })
          .withMessage("Password does not meet requirements.")
    ]
}

/* **************************
 * Check data and return errors or continue to registration
 ***************************** */

validate.checkRegData =async (req, res, next) => {
    const {account_firstname, account_lastname, account_email} = req.body
    let errors = []    
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
            intError: "<a href= /error >Error link</a>",
        })
        return
    }
    next()
}

validate.checkLogData =async (req, res, next) => {
    const {account_email} = req.body
    let errors = []    
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
            intError: "<a href= /error >Error link</a>",
        })
        return
    }
    next()
}


/* **************************
 * Update account Data Validation Rules
 * Server-side validation
 ***************************** */
validate.updateAccountRules = () => {
    return [
        //firstname is required and must be string
        body("account_firstname")
          .trim() // sanitizing function
          .escape()
          .notEmpty()
          .isLength({min: 1}) // validation function
          .withMessage("Please provide a first name."),

        // name is required and must be string
        body("account_lastname")
          .trim() // sanitizing function
          .escape()
          .notEmpty()
          .isLength({min: 2}) // validation function
          .withMessage("Please provide a last name."),
        // valide email is required and cannot already exist in the database
        body("account_email")
          .trim() // sanitizing function
          .escape()
          .notEmpty()
          .isEmail()
          .normalizeEmail()// refer to validator.js docs
          .withMessage("A valid email is required.")
    ]
}


/* **************************
 * Change password Validation Rules
 * Server-side validation
 ***************************** */
validate.changePasswordRules = () => {
    return [        
        // password is required and must be strong password
        body("account_password")
          .trim()
          .notEmpty()
          .isStrongPassword({
            minlength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
          })
          .withMessage("Password does not meet requirements.")
    ]
}

/* **************************
 * Check data and return errors or continue to update account
 ***************************** */

validate.checkUpdateData =async (req, res, next) => {
    const {account_firstname, account_lastname, account_email} = req.body
    let errors = []    
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors,
            title: "Edit Account",
            nav,
            account_firstname,
            account_lastname,
            account_email,
            intError: "<a href= /error >Error link</a>",
        })
        return
    }
    next()
}

/* **************************
 * Check data and return errors or continue to update account
 ***************************** */

validate.checkChangePassword =async (req, res, next) => {
    const {account_id} = req.body
    let errors = []    
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors,
            title: "Edit Account",
            nav,
            account_id,
            intError: "<a href= /error >Error link</a>",
        })
        return
    }
    next()
}


module.exports = validate

