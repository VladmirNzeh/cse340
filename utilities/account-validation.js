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

validate.checkRegData = async (req, res, next) => {
  // 🔐 Guard against undefined req.body
  if (!req.body) {
    console.error("❌ req.body is undefined in checkRegData")
    req.flash("notice", "Something went wrong. Please try again.")
    return res.redirect("/account/register")
  }

  // 💥 Destructure safely now that we confirmed req.body exists
  const { account_firstname, account_lastname, account_email } = req.body

  // ✅ Validate input using express-validator
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      intError: "<a href= /error >Error link</a>",
    })
  }

  // 👍 Validation passed, move to the next middleware
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

validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update-account", {
      errors,
      title: "Update Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
    return
  }
  next()
}


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
          .custom(async (account_email, {req}) => {
            const account_id = req.accountData.account_id
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (emailExists && emailExists !== account_id) {
              throw new Error("Email exists. Please use different email")
            }
          }),
    ]
}

validate.passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minlength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
      })
      .withMessage("Password must be at least 12 characters and include at least 1 lowercase, 1 uppercase, and 1 symbol."),
  ]
}

validate.checkUpdatePassword = async (req, res, next) => {
  const { account_id, account_password } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update-account", {
      title: "Edit Account",
      nav,
      errors,
      account_id,
    })
    return
  }
  next()
}


module.exports = validate

