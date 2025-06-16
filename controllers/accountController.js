const utilities = require("../utilities/")
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

/* ****************************************
*  Account management view
* *************************************** */
async function buildAccountManagement(req, res, next) {
    let nav = await utilities.getNav()
    const intError = "<a href= /error >Error link</a>"
    res.render("account/account-management", {
        title: "Account Management",
        nav,
        accountData: req.accountData, // Assuming accountData is set in middleware
        intError,
        errors: null,
    })
}

/* **************
* Process Resitration account
* ************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const {
        account_firstname,
        account_lastname,
        account_email,
        account_password,
    } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
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
        req.flash(
            "notice",
            `Congratulations, you\'re registerd ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            intError: "<a href= /error >Error link</a>",
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        req.status(501).render("account/register", {
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
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      intError: "<a href= /error >Error link</a>", 
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        intError: "<a href= /error >Error link</a>", 
      })
    }
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).render("errors/500", {
      title: "Server Error",
    nav,})
  }
}

/* ****************************************
 * Deliver Update Account View
 **************************************** */
async function buildUpdateAcountView(req, res) {
  const account_id = parseInt(req.params.account_id)
  const account = await accountModel.getAccountById(account_id)
  const nav = await utilities.getNav()
  const intError = "<a href= /error >Error link</a>"

  res.render("account/update-account", {
    title: "Update Account",
    nav,
    accountData: req.accountData,
    account,
    intError,
    errors: null,
  })
}

/* ****************************************
 * Process Update Account Info
 **************************************** */
async function updateAccountInfo(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const updateResult = await accountModel.updateAccountInfo(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )
  const nav = await utilities.getNav()
  const intError = "<a href= /error >Error link</a>"

  if (updateResult) {
    req.flash("notice", "Account information updated.")
    res.redirect("/account")
  } else {
    req.flash("notice", "Update failed.")
    res.status(500).render("account/update-account", {
      title: "Update Account",
      nav,
      account: req.body,
      intError,
      errors: null,
    })
  }
}

/* ****************************************
 * Process Update Password
 **************************************** */
async function updatePassword(req, res) {
  const { account_id, account_password } = req.body
  const nav = await utilities.getNav()
  const intError = "<a href= /error >Error link</a>"

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword)

    if (updateResult) {
      req.flash("notice", "Password successfully updated.")
      res.redirect("/account")
    } else {
      req.flash("notice", "Password update failed.")
      res.status(500).render("account/update-account", {
        title: "Update Account",
        nav,
        intError,
        errors: null,
        account: req.body,
      })
    }
  } catch (error) {
    req.flash("notice", "Error encrypting password.")
    res.status(500).render("account/update-account", {
      title: "Update Account",
      nav,
      intError,
      errors: null,
      account: req.body,
    })
  }
}

/* ****************************************
 * Logout Controller: Clear JWT cookie
 **************************************** */
async function logoutAccount(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
}

module.exports = {
  buildLogin, 
  buildRegister, 
  registerAccount, 
  buildAccountManagement, 
  accountLogin,
  buildUpdateAcountView,
  updateAccountInfo,
  updatePassword,
  logoutAccount,
}


