const jwt = require("jsonwebtoken")
require("dotenv").config()
const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  try{
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      messages: req.flash(),
    })
  }catch (error){
    next(error)
  }
}

/* ****************************************
*  Process Login
* *************************************** */
async function loginAccount(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const {account_email, account_password} = req.body;

    const loginResult = await accountModel.loginAccount(account_email, account_password);
    
    if (!loginResult) {
      req.flash("invalid", "invalid login credentials.");
      return res.render("account/login", {
        title: "Login",
        nav,
        messages: req.flash(),
        account_email,
      });
    }
    // Create JWT token
    const token = jwt.sign(
      {
        account_id: loginResult.account_id,
        account_firstname: loginResult.account_firstname,
        account_lastname: loginResult.account_lastname,
        account_email: loginResult.account_email,
        account_type: loginResult.account_type,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    // Set cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3600000,
    });
    req.flash("loggedin", "Welcome back!");
    res.redirect("/");
  } catch (error) {
    next(error);
  }
}

// Logout Account
function logoutAccount(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
 
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
    })
  }


  const regResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, hashedPassword)
  console.log(regResult[account_firstname])
  if (regResult) {
    req.flash("registered",`Congratulations, you\'re registered ${account_firstname}. Please log in.`)
    res.render('./account/login', { 
      title: 'Login',
      nav,
      messages: req.flash()
    })
  } else {
    req.flash("failed", "Sorry, the registration failed.")
    res.render('./account/register', { 
      title: 'Registration',
      nav,
      messages: req.flash()
    })
  }
}

async function buildUpdateAccount(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const accountId = req.params.account_id;
    const accountData = await accountModel.getaccountById(accountId);

    res.render("account/update-account", {
      title: "Update Account",
      nav,
      account: accountData,
      messages: req.flash(),
    });
  } catch (error) {
    next (error);
  }
}

// Update info update (name + email)
async function updateAccountInfo(req, res, next) {
  try {
    const { account_id, account_firstname, account_lastname, account_email} = req.body;

    const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)

    if (updateResult) {
      req.flash("notice", "Account information updated successfully.")
      res.redirect("/account/")
    } else {
      req.flash("notice", "Update failed.")
      res.redirect(`/account/update/${account_id}`)
    }
  } catch (error) {
    next (error)
  }
}

// Handle password update
async function updatePassword(req, res, next) {
  try {
    const { account_id, account_password} = req.body;

    const hashedPassword = await bcrypt.hash(account_password, 10)
    const result = await accountModel.updatePassword(account_id, hashedPassword)

    if (result) {
      req.flash("notice", "Password updated successfully.")
      res.redirect("/account/")
    } else {
      req.flash("notice", "Password update failed.")
      res.redirect(`/account/update/${aaccount_id}`)
    }
  } catch (error) {
    next(error)
  }
}
    
module.exports = { 
  buildLogin, 
  loginAccount, 
  buildRegister, 
  registerAccount, 
  logoutAccount,
  buildUpdateAccount, 
  updateAccountInfo,
  updatePassword,
}