const utilities = require("../utilities/")
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Login and registration views
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Account management view (protected)
router.get("/",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountManagement)
);

// Logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

// Registration
router.post("/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Login
router.post("/login",
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accountController.accountLogin)
);

// Update account view (protected)
router.get("/update",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildUpdateAccount)
);

// Process account update
router.post("/update",
    regValidate.updateAccountRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
);

// Change password
router.post("/change",
    regValidate.changePasswordRules(),
    regValidate.checkChangePassword,
    utilities.handleErrors(accountController.changePassword)
);

module.exports = router;
