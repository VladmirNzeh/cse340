// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController.js")
const regValidate = require('../utilities/account-validation')

// GET route for login view
router.get('/login', accountController.buildLogin); 

// GET route for registration view
router.get('/register', accountController.buildRegister); 

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    accountController.registerAccount
  )

  // Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),   // Apply login validation rules
    regValidate.checkLoginData, // Check for validation errors
    accountController.loginAccount     // Process the login attempt
  )
  
// Error handler middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { error: err });
});

// Export the router
module.exports = router;