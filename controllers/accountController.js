const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  const intError = "<a href= /error >Error link</a>"
  res.render("account/login", {
    title: "Login",
    nav,
    intError,
    errors: null,
    account_email: ""
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  const intError = "<a href= /error >Error link</a>"
  res.render("account/register", {
    title: "Register",
    nav,
    intError,
    errors: null,
  })
}

// /* ****************************************
// *  Account management view
// * *************************************** */
// async function buildAccountManagement(req, res, next) {
//   let nav = await utilities.getNav()
//   const intError = "<a href= /error >Error link</a>"
//   res.render("account/", {
//     title: "You are logged in",
//     nav,
//     intError,
//     errors: null,
//     account_type
//   })
// }

/* ****************************************
*  Account management view
* *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  const token = req.cookies.jwt
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  const accountData = await accountModel.getAccountByAccountId(decodedToken.account_id)
  const intError = "<a href= /error >Error link</a>"

  res.render("account/", {
    title: "You are logged in",
    nav,
    intError,
    errors: null,
    accountData // ✅ This makes account_type and other fields available in the view
  })
}

/* ****************************************
*  Process registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      intError: "<a href= /error >Error link</a>"
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`)
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      intError: "<a href= /error >Error link</a>",
      errors: null,
      account_email: ""
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      intError: "<a href= /error >Error link</a>",
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }

  try {
    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password)
    if (passwordMatch) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })

      const cookieOptions = {
        httpOnly: true,
        maxAge: 3600 * 1000,
        ...(process.env.NODE_ENV !== 'development' && { secure: true })
      }

      res.cookie("jwt", accessToken, cookieOptions)
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    console.error("Login error:", error)
    req.flash("notice", "Access Forbidden")
    return res.status(403).redirect("/account/login")
  }
}


/* ****************************************
*  Logout account
* *************************************** */
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  delete res.locals.accountData
  res.locals.loggedin = 0
  req.flash("notice", "Logout successful")
  res.redirect("/")
}

/* ****************************************
*  Update Account management view
* *************************************** */
async function buildUpdateAccount(req, res, next) {
  const token = req.cookies.jwt
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  const account_id = decodedToken.account_id
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountByAccountId(account_id)
  const intError = "<a href= /error >Error link</a>"
  res.render("account/update", {
    title: "Edit Account",
    nav,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    intError,
    errors: null
  })
}

/* ****************************************
*  Process account update
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  } = req.body

  const regResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (regResult) {
    req.flash("notice", "Congratulations, your information has been updated.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
      title: "Edit Account",
      nav,
      intError: "<a href= /error >Error link</a>",
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    })
  }
}

/* ****************************************
*  Process password change
* *************************************** */
async function changePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the change.')
    return res.status(500).render("account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      intError: "<a href= /error >Error link</a>"
    })
  }

  const regResult = await accountModel.changePassword(account_id, hashedPassword)

  if (regResult) {
    req.flash("notice", "Congratulations, successful password change.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the password change failed.")
    res.status(501).render("account/update", {
      title: "Edit Account",
      nav,
      intError: "<a href= /error >Error link</a>",
      errors: null,
      account_id
    })
  }
}


module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  buildAccountManagement,
  accountLogin,
  accountLogout,
  buildUpdateAccount,
  updateAccount,
  changePassword
}
