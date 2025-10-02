const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* **************************
 * Constructs the nav HTML unordered list
 ***************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    console.log(data)
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list += 
        '<a href="/inv/type/' +
        row.classification_id +
        '" title= "See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}



/* **************************
 * Build the classification view HTML
 ***************************** */
Util.buildClassificationGrid = async function(data) {
    let grid
    if(data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
            + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
            + 'details"><img src="' + vehicle.inv_thumbnail 
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
            +' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id +'"       title="View ' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$' 
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'

    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************
 * Build the details view HTML
 ***************************** */

Util.buildInventoryGrid = async function(data) {
    let grid
    if(data.length > 0) {
        grid = `
        <section class= "details-page">
            <div class= "full-vehi-image">
                <img src= "${data[0].inv_image}" alt= "Image of ${data[0].inv_make} ${data[0].inv_model} on CSE Motors" />                
            </div>
            <div class= "details">
                <h2>${data[0].inv_make} ${data[0].inv_model} Details</h2>
                <h3>Price: $${new Intl.NumberFormat().format(data[0].inv_price)}</h3>
                <p><i>Description</i>: ${data[0].inv_description}</p>
                <p>Color: ${data[0].inv_color}</p>
                <p>Miles: ${new Intl.NumberFormat().format(data[0].inv_miles)}</p>
                <a id= "purchase" title= "Purchase" href= "../purchase/${data[0].inv_id}">Purchase</a>
            </div>
        </section>`
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req,res,next)).catch(next)


/* **************************
 * Constructs the dropdown classification list
 ***************************** */

Util.dropDownClassList = async function(classification_id = null) {
    let data = await invModel.getClassifications()
    let optionsList = '<select name="classification_id" id="classificationList" required>' 
    optionsList += "<option value = '' > Please select </option>"
    data.rows.forEach((row)=> {
        optionsList +=
        '<option value= "' + row.classification_id + '"'
        if (
            classification_id != null && row.classification_id == classification_id
        ) {
            optionsList += " selected"
        }
        optionsList += ">" + row.classification_name+ "</option>"
    })
    optionsList += "</select>"
    return optionsList
}


/* **************************
 * Middleware to check token validity
 ***************************** */


Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* **************************
 * Check Login
 ***************************** */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

Util.checkAccountType = (req, res, next) => {
    try {
        //Get token from cookies
        const token = req.cookies.jwt 
        if (!token) {
            req.flash("notice","You must be logged in to access this page.")
            return res.redirect("/account/login")
        }

        //Verify token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        //Check account type

        if (decoded.account_type === "Employee" || decoded.account_type === "Admin") {
            req.user = decoded
            return next()
        } else {
            req.flash("notice", "You do not have permission to access this page.")
            return res.redirect("/account/login")
        }
    } catch (err) {
        req.flash("notice", "Session expired or invalid. Please log in again.")
        return res.redirect("/account/login")
    }
}

/* **************************
 * Build the purchase view HTML
 ***************************** */

Util.buildPurchaseGrid = async function(data) {
    let grid
    if(data.length > 0) {
        grid = `
        <section class= "details-page">
            <div class= "full-vehi-image">
                <img src= "${data[0].inv_image}" alt= "Image of ${data[0].inv_make} ${data[0].inv_model} on CSE Motors" />                
            </div>
            <div class= "details">
                <h2>${data[0].inv_make}${data[0].inv_model} Costs</h2>
                <h3>Price: $${new Intl.NumberFormat().format(data[0].inv_price)}</h3>
                <h3>Shipping cost (in USA): $${new Intl.NumberFormat().format(data[0].inv_price * 0.03)}</h3>
                <h3>Total: $${new Intl.NumberFormat().format(data[0].inv_price * 1.03)}</h3>
            </div>
        </section>`
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

module.exports = Util


