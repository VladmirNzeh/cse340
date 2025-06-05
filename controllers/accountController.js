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
async function loginAccount(req, res) {
  try{
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
 
  const loginResult = await accountModel.loginAccount(account_email, account_password)

  // If no account found or password incorrect
  if (!loginResult) {
    req.flash('invalid', 'Invalid login credentials.');
    return res.render("account/login", {
      title: "Login",
      nav,
      messages: req.flash(),
      account_email,  // Keep email in form
    });
  }
  
  // Save account info in session on successful login
  req.session.account = loginResult;
  req.flash('loggedin', 'Welcome back!');
  res.redirect('/');
  }
  catch (error) {
  next(error); // Forward to error handler
}
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

module.exports = { buildLogin, loginAccount, buildRegister, registerAccount }