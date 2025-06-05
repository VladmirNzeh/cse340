const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const Util = require("../utilities");

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try{
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  
  if (!data || data.length === 0) {
    return res.status(404).render("404", { title: "Classification Not Found", nav: await utilities.getNav() })
  }

  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}catch (error){
  next(error) // Forward the error to the error handler middleware
  }


}

/* ***************************
 *  Deliver specific vehicle detail view
 * ************************** */
invCont.getVehicleDetail = Util.catchAsyncErrors(async function (req, res, next) {
  const inventoryId = req.params.inventoryId;
  const vehicleData = await invModel.getVehicleById(inventoryId);

  if (!vehicleData) {
      const error = new Error("Vehicle Not Found");
      error.status = 404;
      throw error;
  }

  const vehicleDetailHtml = Util.formatVehicleDetailHtml(vehicleData); // Format vehicle detail using utility
  let nav = await utilities.getNav(); // Get navigation
  res.render("./inventory/vehicleDetail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      vehicleDetailHtml,
  });
});

// Build the inventory management view
invCont.buildManagementView = async function(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      messages: req.flash(),
    });
  } catch (error) {
    next(error)
  }
}

// Serve the add classification form
invCont.buildAddClassificationView = async function(req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    messages: req.flash(),
  });
};

// Process the classification form submission
invCont.addClassification = async function(req, res, next) {
  const { classification_name } = req.body;

  // Server-side validation
  if (!classification_name || !/^[a-zA-Z0-9]+$/.test(classification_name)) {
    req.flash("error", "Invalid classification name.")
    return res.redirect("/inv/add-classification")
  }

  try {
    const result = await invModel.addClassification(classification_name);
    if (result) {
      req.flash("success", "Classification added successfully.")
      return res.redirect("/inv/management")
    } else {
      req.flash("error", "Failed to add classification.")
      return res.redirect("/inv/add-classification")
    }
  } catch (error) {
    next(error);
  }
}

// Build the add inventory form
invCont.buildAddInventoryView = async function(req, res, next) {
  
  try{
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      messages: req.flash(),
    })
  }catch(error){
    console.error("Error in buildInvetoryView", error.message)
    next(error)
  }
}

// Process the inventory form submission
invCont.addInventory = async function(req, res, next) {

  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body;
  let nav = await utilities.getNav()
  // Server-side validation
  if (!classification_id || !inv_make || !inv_model || !inv_year ||!inv_description ||!inv_image ||!inv_thumbnail || !inv_price ||!inv_miles ||!inv_color) {
    req.flash("error", "All fields are required.")
    let classificationList = await utilities.buildClassificationList(classification_id);
    return res.render("./inventory/add-inventory", {
      title: 'Add New Inventory',
      nav,
      classificationList,
      inv_make, 
      inv_model,
      inv_year,
      inv_price,
      classification_id, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_miles, 
      inv_color,

      messages: req.flash(),
    })
  }
    // If validation passes, add inventory to the database
    // Logic for adding inventory to the database
  try {
    const result = await invModel.addInventoryItem(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color);
    if (result) {
      req.flash('success', 'Inventory added successfully.');
	    res.render('./inventory/management', {
      title: 'New Inventory Added',
      nav,
      messages: req.flash(),
    })
    } else {
      req.flash("error", "Failed to add inventory.")
      res.render("./inventory/add-inventory", {
	    title: 'Add Inventory',
      nav,
      messages: req.flash(),
    }  )
  } 
}catch (error) {
    next(error)
  }
}
module.exports = invCont