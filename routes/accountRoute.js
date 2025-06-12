// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController.js")
const regValidate = require('../utilities/account-validation')
const { checkAuth, checkAccountType } = require('../middleware/checkAuth')
// GET route for login view
router.get('/login', accountController.buildLogin); 

// GET route for logout view
router.get("/logout", accountController.logoutAccount)

// GET route for registration view
router.get('/register', accountController.buildRegister); 

// 
router.get("/update/:account_id", checkAuth, accountController.buildUpdateAccount);
// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    accountController.registerAccount
  )

  // Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),   // Apply login validation rules
    regValidate.checkLoginData, // Check for validation errors
    utilities.handleErrors(accountController.loginAccount)    // Process the login attempt
  )
  
// Update account info (first name, last name, email)
router.post(
  "/update-account",
  checkAuth, regValidate.updateAccountRules(), regValidate.checkUpdateData, accountController.updateAccountInfo);

// Update password
router.post(
  "/update-password",
  checkAuth, regValidate.passwordRules(), regValidate.checkPasswordUpdate, accountController.updatePassword);

// Error handler middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { error: err });
});

// Export the router
module.exports = router;