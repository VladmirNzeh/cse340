const jwt = require("jsonwebtoken")
require("dotenv").config()

// Middleware to check if a user is logged in
const checkAuth = (req, res, next) => {
  const token = req.cookies.jwt
  const jwtSecret = process.env.JWT_SECRET

  if (!token) {
    res.locals.accountData = null
    return next()
  }

  jwt.verify(token, jwtSecret, (err, decodedToken) => {
    if (err) {
      res.locals.accountData = null
    } else {
      res.locals.accountData = decodedToken
    }
    next()
  })
}

// Middleware to restrict access to employees and admins
function checkAccountType(req, res, next) {
  const token = req.cookies.jwt
  if (!token) {
    req.flash("notice", "You must be logged in to access that page.")
    return res.redirect("/account/login")
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.account_type === "Employee" || decoded.account_type === "Admin") {
      res.locals.accountData = decoded
      return next()
    } else {
      req.flash("notice", "You do not have permission to access this area.")
      return res.redirect("/account/login")
    }
  } catch (err) {
    console.error(err)
    req.flash("notice", "Session expired or invalid. Please log in again.")
    return res.redirect("/account/login")
  }
}

module.exports = { checkAuth, checkAccountType }
