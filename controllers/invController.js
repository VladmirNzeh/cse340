const invModel = require("../models/inventory-model");
const utilities = require("../utilities");
const invController = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invController.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);

    if (!data || data.length === 0) {
      return res.status(404).render("404", {
        title: "Classification Not Found",
        nav: await utilities.getNav()
      });
    }

    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Deliver specific vehicle detail view
 * ************************** */
invController.getVehicleDetail = utilities.handleErrors(async function (req, res, next) {
  const inventoryId = req.params.inventoryId;
  const vehicleData = await invModel.getVehicleById(inventoryId);

  if (!vehicleData) {
    const error = new Error("Vehicle Not Found");
    error.status = 404;
    throw error;
  }

  const vehicleDetailHtml = utilities.formatVehicleDetailHtml(vehicleData);
  let nav = await utilities.getNav();
  res.render("./inventory/vehicleDetail", {
    title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
    nav,
    vehicleDetailHtml,
  });
});

/* ***************************
 *  Build the inventory management view
 * ************************** */
invController.buildManagementView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      messages: req.flash(),
      classificationSelect,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Serve the add classification form
 * ************************** */
invController.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    messages: req.flash(),
  });
};

/* ***************************
 *  Process the classification form submission
 * ************************** */
invController.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;

  if (!classification_name || !/^[a-zA-Z0-9]+$/.test(classification_name)) {
    req.flash("error", "Invalid classification name.");
    return res.redirect("/inv/add-classification");
  }

  try {
    const result = await invModel.addClassification(classification_name);
    if (result) {
      req.flash("success", "Classification added successfully.");
      return res.redirect("/inv/management");
    } else {
      req.flash("error", "Failed to add classification.");
      return res.redirect("/inv/add-classification");
    }
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build the add inventory form
 * ************************** */
invController.buildAddInventoryView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      messages: req.flash(),
    });
  } catch (error) {
    console.error("Error in buildAddInventoryView", error.message);
    next(error);
  }
};

/* ***************************
 *  Process the inventory form submission
 * ************************** */
invController.addInventory = async function (req, res, next) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;

  let nav = await utilities.getNav();

  if (
    !classification_id ||
    !inv_make ||
    !inv_model ||
    !inv_year ||
    !inv_description ||
    !inv_image ||
    !inv_thumbnail ||
    !inv_price ||
    !inv_miles ||
    !inv_color
  ) {
    req.flash("error", "All fields are required.");
    let classificationList = await utilities.buildClassificationList(classification_id);
    return res.render("./inventory/add-inventory", {
      title: "Add New Inventory",
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
    });
  }

  try {
    const result = await invModel.addInventoryItem(
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    );

    if (result) {
      req.flash("success", "Inventory added successfully.");
      res.render("./inventory/management", {
        title: "New Inventory Added",
        nav,
        messages: req.flash(),
      });
    } else {
      req.flash("error", "Failed to add inventory.");
      res.render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        messages: req.flash(),
      });
    }
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Return inventory by classification as JSON
 * ************************** */
invController.getInventoryJSON = async function (req, res, next) {
  try {
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassification(classification_id);
    if (invData && invData.length > 0) {
      return res.json(invData);
    } else {
      next(new Error("No data returned"));
    }
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Deliver the delete inventory view
 * ************************** */
invController.buildDeleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  try {
    const itemData = await invModel.getInventoryById(inv_id);
    if (!itemData) throw new Error("Inventory item not found");

    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    let nav = await utilities.getNav();

    res.render("./inventory/delete-confirm", {
      title: `Delete ${itemName}`,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Process the delete inventory request
 * ************************** */
invController.deleteInventoryItem = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id);
  try {
    const result = await invModel.deleteInventoryById(inv_id);
    if (result) {
      req.flash("notice", "The inventory item was successfully deleted.");
      res.redirect("/inv/management");
    } else {
      req.flash("notice", "Sorry, the delete failed.");
      res.redirect(`/inv/delete/${inv_id}`);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = invController;
