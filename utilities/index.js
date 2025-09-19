const invModel = require("../models/inventory-model")
const Util = {}
require("dotenv").config()

/* ***************************
    *  Build the nav HTML unordered list
    * ************************** */
Util.getNav = async function(req, res, next) {
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

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
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
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
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

/* **************************************
* Build the vehicle detail view HTML
* ************************************ */   
Util.buildDetailView = async function(vehicle) {
    let detail = ""
    // Container for the entire detail view
    detail += '<div class="vehicle-detail-container">'

    // Main heading: "2019 Cadillac Escalade" (for example)
    detail += `<h2 class="vehicle-title">${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>`

    // Row container for image (left) and details (right)
    detail += '<div class="vehicle-detail-row">'

    // Left column: Vehicle full-size image
    detail += '<div class="vehicle-image-column">'
    detail += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}" />`
    detail += '</div>'

    // Right column: Vehicle details
    detail += '<div class="vehicle-info">'
    detail += `<h3>${vehicle.inv_make} ${vehicle.inv_model} Details</h3>`

    // ✅ Fixed price formatting — removed invalid $(...) syntax
    detail += `<p><strong> Price: </strong>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`

    detail += `<p><strong> Description: </strong>${vehicle.inv_description}</p>`
    detail += `<p><strong> Color: </strong>${vehicle.inv_color}</p>`
    detail += `<p><strong> Miles: </strong>${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}</p>`

    detail += '</div>' // Close right column
    detail += '</div>' // Close row
    detail += '</div>' // Close container
    return detail
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req,res,next)).catch(next)

module.exports = Util