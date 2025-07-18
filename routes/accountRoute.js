/***************************
 * Account routes
 * Deliver login view account
 *****************************/
const utilities = require("../utilities/")
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")



/***************************
 * Deliver registration View
 * Deliver registration view account
 *****************************/
router.get("/login",  utilities.handleErrors(accountController.buildLogin))

router.get("/register", utilities.handleErrors(accountController.buildRegister))



/***************************
 * Deliver Account Management View
 * Unit 5, JWT authorization activity
 *****************************/
router.get("/",
    utilities.checkJWTToken, //To check if the client is authorized, if not the access for this view is forbidden.
    utilities.checkLogin, //To check if the client is authorized, if not the access for this view is forbidden.    
    utilities.handleErrors(accountController.buildAccountManagement)

)


/***************************
 * Process registration
 * Process registration activity
 *****************************/
router.post("/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount) )

// Process the login attempt
router.post( "/login",
    regValidate.loginRules(),
    regValidate.checkLogData, 
    utilities.handleErrors(accountController.accountLogin) 
)

// Update account view
router.get("/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccountView))

// Process account info update
router.post("/update/info",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccountInfo))

// Process password update
router.post("/update/password",
  regValidate.passwordRules(),
  regValidate.checkUpdatePassword,
  utilities.handleErrors(accountController.updatePassword))

// Logout Route
router.get("/logout", utilities.handleErrors(accountController.logoutAccount))


module.exports = router;