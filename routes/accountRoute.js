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
 * JWT authorization activity
 *****************************/
router.get("/",
    utilities.checkLogin, //To check if the client is authorized, if not the access for this view is forbidden.    
    utilities.handleErrors(accountController.buildAccountManagement)

)

// Route to logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

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

// Route to update account view
router.get("/update",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildUpdateAccount))

// Process the update account

router.post("/update", 
    regValidate.updateAccountRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
)

router.post("/change",
    regValidate.changePasswordRules(),
    regValidate.checkChangePassword,
    utilities.handleErrors(accountController.changePassword)
)

module.exports = router;