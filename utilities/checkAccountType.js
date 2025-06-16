//utilities/checkAccountType.js
const { check } = require("express-validator")
const jwt = require("jsonwebtoken")
require("dotenv").config()

function checkAccountType(req, res, next) {
    const token = req.cookies.jwt

    if (!token) {
        req.flash("notice", "Please log in to continue.")
        return res.status(404).redirect("/account/login")
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Only allow Employee or Admin
        if (decoded.account_type === "Employee" || decoded.account_type === "Admin") {
            req.accountData = decoded // optionally add to reg
            return next()
        } else {
            req.flash("notice", "You do not have permission to view this page.")
            return res.status(403).redirect("/account/login")
        }
    } catch (err) {
        console.error("JWT verification failed:", err.message)
        req.flash("notice", "invalid token. Please login again.")
        return res.status(403).redirect("/account/login")
    }
}

module.exports = checkAccountType