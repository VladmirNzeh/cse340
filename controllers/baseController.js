const utilities = require("../utilities/")
const baseController = {}
// Line 4 - creates an anonymous, asynchronous function and assigns the function to buildHome which acts as a method of the baseController object. In short, this is similar in concept to creating a method within a class, where baseController would be the class name and buildHome would be the method. Being asynchronous, it does not block (stop) the application from executing while it awaits the results of the function to be returned. The function itself accepts the request and response objects as parameters.
baseController.buildHome = async function(req, res) {
    const nav = await utilities.getNav()
    const intError = "<a href= /error >Error link</a>"
    req.flash("notice", "This is a flash message.")
    res.render("index", {title: "Home", nav, intError})
    
} //Line 6 - is the Express command to use EJS to send the index view back to the client, using the response object. The index view will need the "title" name - value pair, and the nav variable. The nav variable will contain the string of HTML code to render this dynamically generated navigation bar.

// Intentional error
baseController.buildError = async function(req, res, next) {
    const nav = await utilities.getNav()
    const intError = "<a href= /error >Error link</a>"
    res.render("errors/error", {
        title: "Sever Error",
        message: "Oh no! There was a crash. Maybe try a different route?",
        nav,
        intError,
    })
}

module.exports = baseController

