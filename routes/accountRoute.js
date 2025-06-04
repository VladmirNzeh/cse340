const regValidate = require('../utilities/account-validation')

// Process the registration data
Router.post(
    '/register',
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)