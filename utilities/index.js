const invModel = require("../models/inventory-model")
const Util = {}

/* **************************************
 * Centralized Error Handler
 * This function standardizes error handling.
 * ************************************ */
/* **************************************
 * 404 Error Handler
 * ************************************ */
Util.handle404 = (req, res, next) => {
  res.status(404).render("404", {
      title: "404 - Page Not Found",
      errorMessage: "The page you are looking for does not exist.",
      layout: false 
  })
}

/* **************************************
* General Error Handler (500 and other server errors)
* ************************************ */
Util.handle500 = (err, req, res, next) => {
  const errorMessage = err.message || "An unexpected error occurred.";
  res.status(500).render("500", {
      title: "500 - Server Error",
      errorMessage: errorMessage,
      layout: false 
  });
};

/* **************************************
* Async Error Wrapper
* Wrap async functions and pass errors to next()
* ************************************ */
Util.catchAsyncErrors = function (fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((error) => {
      next(error); // Forward errors to the centralized error handler
    });
  };
};




/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
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
        +' on CSE Motors" ></a>'
        grid += '<div class="namePrice">'
        grid += '<hr >'
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
 * Format the vehicle detail HTML
 * ************************************ */
Util.formatVehicleDetailHtml = function (vehicle) {
  const { inv_make, inv_model, inv_year, inv_price, inv_miles, inv_description, inv_image } = vehicle;

  // Format price and mileage
  const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(inv_price);
  const formattedMileage = new Intl.NumberFormat('en-US').format(inv_miles);

  return `
      <div class="vehicle-detail-container">
          <div class="vehicle-image">
              <img src="${inv_image}" alt="${inv_make} ${inv_model}" >
          </div>
          <div class="vehicle-info">
              <h1>${inv_make} ${inv_model}</h1>
              <h2>Year: ${inv_year}</h2>
              <h3>Price: ${formattedPrice}</h3>
              <p>Mileage: ${formattedMileage} miles</p>
              <p>Description: ${inv_description}</p>
          </div>
      </div>
  `;
};

// Function to build classification dropdown list
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}
module.exports = Util